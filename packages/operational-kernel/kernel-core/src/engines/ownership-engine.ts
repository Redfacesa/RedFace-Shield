import { KernelError, type RtnUri } from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { IdentityEngine } from './identity-engine.js';

/** Ownership Engine — legal owner (one) vs stewards (many). Not organization profiles. */

export type StewardRole =
  | 'operator'
  | 'maintainer'
  | 'viewer'
  | 'evidence_custodian'
  | 'mission_steward'
  | 'operational_steward'
  | 'admin_steward'
  | 'insurer';

export interface OwnershipRecord {
  subjectUri: RtnUri;
  ownerUri: RtnUri;
  ownershipType: string;
  effectiveFrom: Date;
  effectiveUntil?: Date;
}

export interface StewardshipRecord {
  subjectUri: RtnUri;
  stewardUri: RtnUri;
  role: StewardRole;
  effectiveFrom: Date;
  effectiveUntil?: Date;
}

export class OwnershipEngine {
  constructor(
    private readonly db: DbPool,
    private readonly identity: IdentityEngine,
  ) {}

  /** Assign exactly one legal owner per subject (replaces prior legal ownership) */
  async assignOwner(subjectUri: RtnUri, ownerUri: RtnUri, ownershipType = 'legal'): Promise<OwnershipRecord> {
    await this.identity.resolve(subjectUri);
    await this.identity.resolve(ownerUri);

    await this.db.query(
      `INSERT INTO ownership (subject_uri, owner_uri, ownership_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (subject_uri, ownership_type) DO UPDATE SET
         owner_uri = EXCLUDED.owner_uri,
         effective_from = NOW(),
         recorded_at = NOW()`,
      [subjectUri, ownerUri, ownershipType],
    );

    return this.getOwner(subjectUri, ownershipType);
  }

  async getOwner(subjectUri: RtnUri, ownershipType = 'legal'): Promise<OwnershipRecord> {
    const result = await this.db.query(
      `SELECT * FROM ownership WHERE subject_uri = $1 AND ownership_type = $2`,
      [subjectUri, ownershipType],
    );
    if (result.rowCount === 0) {
      throw new KernelError(`No owner for ${subjectUri}`, 'OWNERSHIP_NOT_FOUND');
    }
    return mapOwnershipRow(result.rows[0]);
  }

  async assignSteward(
    subjectUri: RtnUri,
    stewardUri: RtnUri,
    role: StewardRole,
  ): Promise<StewardshipRecord> {
    await this.identity.resolve(subjectUri);
    await this.identity.resolve(stewardUri);

    await this.db.query(
      `INSERT INTO stewardship (subject_uri, steward_uri, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (subject_uri, steward_uri, role) DO UPDATE SET
         effective_from = NOW(),
         recorded_at = NOW()`,
      [subjectUri, stewardUri, role],
    );

    return { subjectUri, stewardUri, role, effectiveFrom: new Date() };
  }

  async listStewards(subjectUri: RtnUri): Promise<StewardshipRecord[]> {
    const result = await this.db.query(
      `SELECT * FROM stewardship WHERE subject_uri = $1 AND effective_until IS NULL`,
      [subjectUri],
    );
    return result.rows.map(mapStewardshipRow);
  }

  async isSteward(subjectUri: RtnUri, stewardUri: RtnUri, role?: StewardRole): Promise<boolean> {
    const query = role
      ? `SELECT 1 FROM stewardship WHERE subject_uri = $1 AND steward_uri = $2 AND role = $3 AND effective_until IS NULL`
      : `SELECT 1 FROM stewardship WHERE subject_uri = $1 AND steward_uri = $2 AND effective_until IS NULL`;
    const params = role ? [subjectUri, stewardUri, role] : [subjectUri, stewardUri];
    const result = await this.db.query(query, params);
    return (result.rowCount ?? 0) > 0;
  }
}

function mapOwnershipRow(row: Record<string, unknown>): OwnershipRecord {
  return {
    subjectUri: row.subject_uri as RtnUri,
    ownerUri: row.owner_uri as RtnUri,
    ownershipType: row.ownership_type as string,
    effectiveFrom: new Date(row.effective_from as string),
    effectiveUntil: row.effective_until ? new Date(row.effective_until as string) : undefined,
  };
}

function mapStewardshipRow(row: Record<string, unknown>): StewardshipRecord {
  return {
    subjectUri: row.subject_uri as RtnUri,
    stewardUri: row.steward_uri as RtnUri,
    role: row.role as StewardRole,
    effectiveFrom: new Date(row.effective_from as string),
    effectiveUntil: row.effective_until ? new Date(row.effective_until as string) : undefined,
  };
}