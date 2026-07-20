import { createServer } from 'node:http';
import { ARCHITECTURE_VERSION, ENGINE_VERSIONS, KERNEL_VERSION, OperationalKernel } from '@redface/kernel-core';
import { envelopeToPublishInput, type RspEnvelope } from '@redface/rsp';
import { isRtnUri } from '@redface/shared';

const PORT = Number(process.env.PORT ?? 3000);

async function readJsonBody<T>(req: import('node:http').IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as T;
}

async function main() {
  const kernel = OperationalKernel.create();

  const server = createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

    if (url.pathname === '/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          status: 'ok',
          service: 'kernel-api',
          architecture: ARCHITECTURE_VERSION,
          kernel: KERNEL_VERSION,
          engines: ENGINE_VERSIONS,
        }),
      );
      return;
    }

    if (url.pathname === '/rsp/events' && req.method === 'POST') {
      try {
        const envelope = await readJsonBody<RspEnvelope>(req);
        const event = await kernel.events.publish(envelopeToPublishInput(envelope));
        res.writeHead(201);
        res.end(JSON.stringify(event));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Invalid RSP envelope' }));
      }
      return;
    }

    if (url.pathname === '/missions' && req.method === 'GET') {
      const missionUri = url.searchParams.get('uri');
      if (!missionUri || !isRtnUri(missionUri)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Query param uri=rtn://mission/... required' }));
        return;
      }
      try {
        const mission = await kernel.mission.get(missionUri);
        const timeline = await kernel.history.getMissionTimeline(missionUri);
        const trust = await kernel.trust.deriveTrust(mission.ownerUri);
        const includePlayback = url.searchParams.get('playback') === 'true';
        const playback = includePlayback ? await kernel.history.buildPlayback(missionUri) : undefined;
        res.writeHead(200);
        res.end(JSON.stringify({ mission, timeline, derivedTrust: trust, playback }));
      } catch {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Mission not found' }));
      }
      return;
    }

    if (url.pathname === '/identities' && req.method === 'GET') {
      const identityUri = url.searchParams.get('uri');
      if (!identityUri || !isRtnUri(identityUri)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Query param uri=rtn://... required' }));
        return;
      }
      try {
        const identity = await kernel.identity.resolve(identityUri);
        const documents = await kernel.identity.listDocuments(identityUri);
        const trust = await kernel.trust.deriveTrust(identityUri);
        res.writeHead(200);
        res.end(JSON.stringify({ identity, documents, derivedTrust: trust }));
      } catch {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Identity not found' }));
      }
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  server.listen(PORT, () => {
    console.log(`Kernel API (Architecture v${ARCHITECTURE_VERSION}) http://localhost:${PORT}`);
    console.log(`Example: /missions?uri=${encodeURIComponent('rtn://mission/CPT-2026-000001')}&playback=true`);
    console.log(`RSP SDK: POST /rsp/events`);
  });
}

main().catch(console.error);
