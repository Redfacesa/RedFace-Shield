import { createServer } from 'node:http';
import { ARCHITECTURE_VERSION, OperationalKernel } from '@redface/kernel-core';
import { envelopeToPublishInput, type RspEnvelope } from '@redface/rsp';
import { isRtnUri } from '@redface/shared';
import { getControlRoomDashboard } from './control-room.js';
import { getHealthStatus } from './health.js';
import { applyCors, json } from './http.js';

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
    if (req.method === 'OPTIONS') {
      applyCors(res);
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

    if (url.pathname === '/health' && req.method === 'GET') {
      try {
        const health = await getHealthStatus(kernel);
        json(res, health.status === 'unhealthy' ? 503 : 200, health);
      } catch (err) {
        json(res, 503, { status: 'unhealthy', error: err instanceof Error ? err.message : 'Health check failed' });
      }
      return;
    }

    if (url.pathname === '/control-room/dashboard' && req.method === 'GET') {
      try {
        const dashboard = await getControlRoomDashboard(kernel);
        json(res, 200, dashboard);
      } catch (err) {
        json(res, 500, { error: err instanceof Error ? err.message : 'Dashboard failed' });
      }
      return;
    }

    if (url.pathname === '/rsp/events' && req.method === 'POST') {
      try {
        const envelope = await readJsonBody<RspEnvelope>(req);
        const event = await kernel.events.publish(envelopeToPublishInput(envelope));
        json(res, 201, event);
      } catch (err) {
        json(res, 400, { error: err instanceof Error ? err.message : 'Invalid RSP envelope' });
      }
      return;
    }

    if (url.pathname === '/missions' && req.method === 'GET') {
      const missionUri = url.searchParams.get('uri');
      if (!missionUri || !isRtnUri(missionUri)) {
        json(res, 400, { error: 'Query param uri=rtn://mission/... required' });
        return;
      }
      try {
        const mission = await kernel.mission.get(missionUri);
        const timeline = await kernel.history.getMissionTimeline(missionUri);
        const participants = await kernel.mission.listParticipants(missionUri);
        const trust = await kernel.trust.deriveTrust(mission.ownerUri);
        const attestations = await kernel.attestation.listBySubject(missionUri);
        const includePlayback = url.searchParams.get('playback') === 'true';
        const playback = includePlayback ? await kernel.history.buildPlayback(missionUri) : undefined;
        json(res, 200, { mission, timeline, participants, derivedTrust: trust, attestations, playback });
      } catch {
        json(res, 404, { error: 'Mission not found' });
      }
      return;
    }

    if (url.pathname === '/identities' && req.method === 'GET') {
      const identityUri = url.searchParams.get('uri');
      if (!identityUri || !isRtnUri(identityUri)) {
        json(res, 400, { error: 'Query param uri=rtn://... required' });
        return;
      }
      try {
        const identity = await kernel.identity.resolve(identityUri);
        const documents = await kernel.identity.listDocuments(identityUri);
        const trust = await kernel.trust.deriveTrust(identityUri);
        json(res, 200, { identity, documents, derivedTrust: trust });
      } catch {
        json(res, 404, { error: 'Identity not found' });
      }
      return;
    }

    json(res, 404, { error: 'Not found' });
  });

  server.listen(PORT, () => {
    console.log(`Kernel API (Architecture v${ARCHITECTURE_VERSION}) http://localhost:${PORT}`);
    console.log(`Health: GET /health`);
    console.log(`Control Room: GET /control-room/dashboard`);
    console.log(`Mission: GET /missions?uri=...&playback=true`);
  });
}

main().catch(console.error);
