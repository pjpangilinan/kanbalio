"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const client = new client_bedrock_runtime_1.BedrockRuntimeClient({ region: 'ap-southeast-1' });
// --- Module-level cache (warm Lambda reuse) ---
let cachedChunks = null;
function loadChunks() {
    if (cachedChunks)
        return cachedChunks;
    const filePath = path.join(__dirname, 'embeddings.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    cachedChunks = data.chunks;
    return cachedChunks;
}
// --- Cosine similarity ---
function cosine(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8);
}
// --- Embed a query string via Cohere Embed English v3 ---
async function embedQuery(text) {
    const cmd = new client_bedrock_runtime_1.InvokeModelCommand({
        modelId: 'cohere.embed-english-v3',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({ texts: [text], input_type: 'search_query' }),
    });
    const res = await client.send(cmd);
    const body = JSON.parse(Buffer.from(res.body).toString('utf-8'));
    return body.embeddings[0];
}
// --- Retrieve top-k chunks ---
async function retrieve(query, topK = 3) {
    const queryEmbedding = await embedQuery(query);
    const chunks = loadChunks();
    const scored = chunks.map(chunk => ({
        chunk,
        score: cosine(queryEmbedding, chunk.embedding),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(s => s.chunk);
}
// --- Generate answer via Claude 3 Haiku ---
async function generate(query, context) {
    const contextText = context
        .map((c, i) => `[${i + 1}] (${c.source})\n${c.text}`)
        .join('\n\n');
    const systemPrompt = `You are a portfolio assistant for Patrick James Pangilinan, a Cloud/DevOps/Agentic Engineer based in the Philippines.
Answer questions about Patrick's projects, skills, and experience using only the provided context.
Be concise, accurate, and professional. If the context does not contain enough information to answer, say so honestly — do not invent details.
Never reveal internal implementation details like API secrets, credentials, or infrastructure costs.`;
    const userMessage = `Context from Patrick's portfolio:\n\n${contextText}\n\n---\nQuestion: ${query}`;
    const cmd = new client_bedrock_runtime_1.ConverseCommand({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        system: [{ text: systemPrompt }],
        messages: [{ role: 'user', content: [{ text: userMessage }] }],
        inferenceConfig: {
            maxTokens: 400,
            temperature: 0.3,
        },
    });
    const res = await client.send(cmd);
    const content = res.output?.message?.content ?? [];
    const textBlock = content.find((b) => 'text' in b && typeof b.text === 'string');
    if (!textBlock || !('text' in textBlock)) {
        throw new Error('Unexpected Bedrock response format');
    }
    return textBlock.text;
}
// --- Lambda handler ---
const handler = async (event) => {
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
    let message;
    try {
        const parsed = JSON.parse(event.body);
        message = (parsed.message ?? '').trim();
    }
    catch {
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
    }
    catch (err) {
        console.error('RAG error:', err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
exports.handler = handler;
