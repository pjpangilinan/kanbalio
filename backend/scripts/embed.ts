/**
 * embed.ts — Corpus embedding script
 *
 * Crawls:
 *   - ../../data/projects.json
 *   - ../../showcase/* /index.md
 *   - GitHub READMEs for linked repos (pjpangilinan/*)
 *
 * Calls Titan Embeddings V2 for each chunk.
 * Writes backend/lambda/embeddings.json.
 *
 * Run: npx ts-node scripts/embed.ts
 * Requires AWS credentials with bedrock:InvokeModel permission.
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

const REPO_ROOT = path.join(__dirname, '../../');
const OUTPUT_FILE = path.join(__dirname, '../lambda/embeddings.json');
const CHUNK_SIZE = 500;   // target tokens (~600 chars)
const CHUNK_OVERLAP = 50; // chars overlap between chunks

const GITHUB_REPOS = [
  'areweupyet',
  'deony',
  'dgos',
  'maylupa',
  'votechain',
  'muse-journ',
  'logos',
  'graphien',
];

// --- Helpers ---

function chunkText(text: string, source: string): Array<{ text: string; source: string }> {
  // Simple character-based chunking (~600 chars ≈ ~150 tokens)
  const CHAR_SIZE = 1800;
  const CHAR_OVERLAP = 180;
  const chunks: Array<{ text: string; source: string }> = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + CHAR_SIZE, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 50) {
      chunks.push({ text: chunk, source });
    }
    if (end >= text.length) break;
    start = end - CHAR_OVERLAP;
  }
  return chunks;
}

async function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'kanbalio-rag-embed/1.0',
        'Accept': 'application/vnd.github.v3.raw',
      },
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        httpsGet(res.headers.location!).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function embedText(text: string): Promise<number[]> {
  const truncated = text.slice(0, 20000);
  const cmd = new InvokeModelCommand({
    modelId: 'amazon.titan-embed-text-v2:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({ inputText: truncated }),
  });
  const res = await client.send(cmd);
  const body = JSON.parse(Buffer.from(res.body).toString('utf-8'));
  return body.embedding as number[];
}

// --- Corpus sources ---

function loadProjectsJson(): Array<{ text: string; source: string }> {
  const filePath = path.join(REPO_ROOT, 'data/projects.json');
  const projects = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const chunks: Array<{ text: string; source: string }> = [];
  for (const p of projects) {
    const text = [
      `Project: ${p.title}`,
      p.description ? `Description: ${p.description}` : '',
      p.tech_stack?.length ? `Tech stack: ${p.tech_stack.join(', ')}` : '',
      p.status ? `Status: ${p.status}` : '',
      p.date ? `Year: ${p.date}` : '',
      p.github_url ? `GitHub: ${p.github_url}` : '',
      p.live_url ? `Live: ${p.live_url}` : '',
      p.issuer ? `Issuer: ${p.issuer}` : '',
    ].filter(Boolean).join('\n');
    chunks.push({ text, source: `projects.json:${p.id}` });
  }
  return chunks;
}

function loadShowcaseDocs(): Array<{ text: string; source: string }> {
  const showcaseDir = path.join(REPO_ROOT, 'showcase');
  const result: Array<{ text: string; source: string }> = [];
  if (!fs.existsSync(showcaseDir)) return result;
  for (const dir of fs.readdirSync(showcaseDir)) {
    const mdPath = path.join(showcaseDir, dir, 'index.md');
    if (fs.existsSync(mdPath)) {
      const text = fs.readFileSync(mdPath, 'utf-8');
      result.push(...chunkText(text, `showcase/${dir}/index.md`));
    }
  }
  return result;
}

async function loadGithubReadmes(): Promise<Array<{ text: string; source: string }>> {
  const result: Array<{ text: string; source: string }> = [];
  for (const repo of GITHUB_REPOS) {
    const url = `https://api.github.com/repos/pjpangilinan/${repo}/readme`;
    try {
      console.log(`  Fetching README: ${repo}`);
      const raw = await httpsGet(url);
      // GitHub returns base64-encoded content in JSON
      let content: string;
      try {
        const json = JSON.parse(raw);
        content = Buffer.from(json.content, 'base64').toString('utf-8');
      } catch {
        // Sometimes returns raw content directly
        content = raw;
      }
      result.push(...chunkText(content, `github:${repo}/README.md`));
      // Respect rate limit
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.warn(`  Warning: could not fetch ${repo} README:`, (err as Error).message);
    }
  }
  return result;
}

// --- Main ---

async function main() {
  console.log('Loading corpus...');
  const projectChunks = loadProjectsJson();
  console.log(`  projects.json: ${projectChunks.length} entries`);

  const showcaseChunks = loadShowcaseDocs();
  console.log(`  showcase docs: ${showcaseChunks.length} chunks`);

  console.log('  Fetching GitHub READMEs...');
  const readmeChunks = await loadGithubReadmes();
  console.log(`  GitHub READMEs: ${readmeChunks.length} chunks`);

  const allChunks = [...projectChunks, ...showcaseChunks, ...readmeChunks];
  console.log(`\nTotal chunks to embed: ${allChunks.length}`);

  const embedded: Array<{ text: string; source: string; embedding: number[] }> = [];

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    process.stdout.write(`\rEmbedding ${i + 1}/${allChunks.length}: ${chunk.source.slice(0, 40).padEnd(40)}`);
    const embedding = await embedText(chunk.text);
    embedded.push({ ...chunk, embedding });
    // Small delay to avoid Bedrock throttling
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n\nWriting embeddings.json...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ chunks: embedded }, null, 2));
  console.log(`Done. ${embedded.length} chunks written to ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error('Embed script failed:', err);
  process.exit(1);
});
