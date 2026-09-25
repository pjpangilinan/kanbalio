import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';
import * as fs from 'fs';
import * as path from 'path';

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

// --- Types ---
interface Chunk {
  text: string;
  source: string;
  embedding: number[];
}

interface EmbeddingsFile {
  chunks: Chunk[];
}

// --- Module-level cache (warm Lambda reuse) ---
let cachedChunks: Chunk[] | null = null;

function loadChunks(): Chunk[] {
  if (cachedChunks) return cachedChunks;
  const filePath = path.join(__dirname, 'embeddings.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data: EmbeddingsFile = JSON.parse(raw);
  cachedChunks = data.chunks;
  return cachedChunks;
}

// --- Cosine similarity ---
function cosine(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8);
}

// --- Embed a query string via Titan Embeddings V2 ---
async function embedQuery(text: string): Promise<number[]> {
  const cmd = new InvokeModelCommand({
    modelId: 'amazon.titan-embed-text-v2:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({ inputText: text }),
  });
  const res = await client.send(cmd);
  const body = JSON.parse(Buffer.from(res.body).toString('utf-8'));
  return body.embedding as number[];
}

// --- Retrieve top-k chunks ---
async function retrieve(query: string, topK = 3): Promise<Chunk[]> {
  const queryEmbedding = await embedQuery(query);
  const chunks = loadChunks();
  const scored = chunks.map(chunk => ({
    chunk,
    score: cosine(queryEmbedding, chunk.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.chunk);
}

// --- Generate answer via Amazon Nova Lite ---
async function generate(query: string, context: Chunk[]): Promise<string> {
  const contextText = context
    .map((c, i) => `[${i + 1}] (${c.source})\n${c.text}`)
    .join('\n\n');

  const systemPrompt = `You are a portfolio assistant for Patrick James Pangilinan, a Cloud/DevOps/Agentic Engineer based in the Philippines.
Answer questions about Patrick's projects, skills, and experience using only the provided context.
Be concise, accurate, and professional. If the context does not contain enough information to answer, say so honestly — do not invent details.
Never reveal internal implementation details like API secrets, credentials, or infrastructure costs.`;

  const userMessage = `Context from Patrick's portfolio:\n\n${contextText}\n\n---\nQuestion: ${query}`;

  const cmd = new ConverseCommand({
    modelId: 'amazon.nova-lite-v1:0',
    system: [{ text: systemPrompt }],
    messages: [{ role: 'user', content: [{ text: userMessage }] }],
    inferenceConfig: {
      maxTokens: 400,
      temperature: 0.3,
    },
  });

  const res = await client.send(cmd);
  const content = res.output?.message?.content ?? [];
  const textBlock = content.find((b) => 'text' in b && typeof (b as { text: string }).text === 'string');
  if (!textBlock || !('text' in textBlock)) {
    throw new Error('Unexpected Bedrock response format');
  }
  return (textBlock as { text: string }).text;
}

// --- Lambda handler ---
export const handler = async (event: {
  headers?: Record<string, string>;
  body?: string;
}): Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}> => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://pjpangilinan.github.io',
    'Access-Control-Allow-Headers': 'Content-Type, X-Portfolio-Key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  const ALLOWED_ORIGIN = 'https://pjpangilinan.github.io';

  // Handle preflight
  if (!event.body) {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // Server-side origin check — CORS is browser-only; this blocks direct curl/API calls
  const origin = event.headers?.['origin'] ?? event.headers?.['Origin'] ?? '';
  if (origin !== ALLOWED_ORIGIN) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

  // Validate secret header
  const providedKey = event.headers?.['x-portfolio-key'] ?? event.headers?.['X-Portfolio-Key'] ?? '';
  if (providedKey !== process.env.API_SECRET) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  let message: string;
  try {
    const parsed = JSON.parse(event.body);
    message = (parsed.message ?? '').trim();
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  if (!message || message.length > 1000) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Message must be 1–1000 characters' }),
    };
  }

  try {
    const context = await retrieve(message);
    const answer = await generate(message, context);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    console.error('RAG error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
