import pg from 'pg';

const DEFAULT_URL = 'postgresql://redface:redface@localhost:5432/redface';

export function createPool(connectionString = process.env.DATABASE_URL ?? DEFAULT_URL) {
  return new pg.Pool({ connectionString });
}

export type DbPool = pg.Pool;
