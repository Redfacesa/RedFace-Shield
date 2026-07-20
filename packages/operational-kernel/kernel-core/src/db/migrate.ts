import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPool } from './client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function migrate(): Promise<void> {
  const pool = createPool();
  const files = readdirSync(__dirname)
    .filter((f) => f.startsWith('schema') && f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = readFileSync(join(__dirname, file), 'utf8');
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }

  await pool.end();
  console.log('Migration complete.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
