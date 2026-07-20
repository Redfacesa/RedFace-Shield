import { createServer } from 'node:http';
import { OperationalKernel } from '@redface/kernel-core';

const PORT = Number(process.env.PORT ?? 3000);

async function main() {
  const kernel = OperationalKernel.create();

  const server = createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', service: 'kernel-api' }));
      return;
    }

    if (req.url?.startsWith('/missions/') && req.method === 'GET') {
      const missionId = req.url.split('/')[2];
      if (!missionId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Mission ID required' }));
        return;
      }
      try {
        const mission = await kernel.mission.get(missionId);
        const timeline = await kernel.history.getMissionTimeline(missionId);
        res.writeHead(200);
        res.end(JSON.stringify({ mission, timeline }));
      } catch {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Mission not found' }));
      }
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  server.listen(PORT, () => {
    console.log(`Kernel API listening on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
