import type { ServerResponse } from 'node:http';

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

export function applyCors(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export function json(res: ServerResponse, status: number, body: unknown): void {
  applyCors(res);
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(status);
  res.end(JSON.stringify(body, (_, value) => (value instanceof Date ? value.toISOString() : value)));
}
