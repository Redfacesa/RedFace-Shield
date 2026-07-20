#!/usr/bin/env node
/**
 * Local PostgreSQL without Docker — uses embedded-postgres.
 * Start before: npm run db:migrate / npm run mvp:hijacking
 */
import EmbeddedPostgres from 'embedded-postgres';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const dataDir = resolve(process.cwd(), '.data/postgres');

mkdirSync(dataDir, { recursive: true });

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'redface',
  password: 'redface',
  port: 5432,
  persistent: true,
});

await pg.initialise();
await pg.start();

try {
  await pg.createDatabase('redface');
} catch {
  // database may already exist on subsequent starts
}

console.log('PostgreSQL ready at postgresql://redface:redface@localhost:5432/redface');
console.log('Press Ctrl+C to stop.');

const shutdown = async () => {
  await pg.stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await new Promise(() => {});
