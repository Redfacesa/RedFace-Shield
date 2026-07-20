import { buildRtnUri, generateLocalId, type RtnUri } from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { IdentityEngine } from './identity-engine.js';

/** Attestation Engine — "I publicly stand behind this" (≠ verification "I checked this") */

export interface AttestationRecord {
  uri: RtnUri;
  subjectUri: RtnUri;
  attestedByUri: RtnUri;
  attestationType: string;
  statement: string;
  evidence: Record<string, unknown>;
  createdAt: Date;
  revokedAt?: Date;
}

export interface CreateAttestationInput {
  subjectUri: RtnUri;
  attestedByUri: RtnUri;
  attestationType: string;
  statement: string;
  evidence?: Record<string, unknown>;
}

export class AttestationEngine {
  constructor(
    private readonly db: DbPool,
    private readonly identity: IdentityEngine,
  ) {}

  async attest(input: CreateAttestationInput): Promise<AttestationRecord> {
    await this.identity.resolve(input.subjectUri);
    await this.identity.resolve(input.attestedByUri);

    const uri = buildRtnUri('document', generateLocalId('att'));
    const record: AttestationRecord = {
      uri,
      subjectUri: input.subjectUri,
      attestedByUri: input.attestedByUri,
      attestationType: input.attestationType,
      statement: input.statement,
      evidence: input.evidence ?? {},
      createdAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO attestations (uri, subject_uri, attested_by_uri, attestation_type, statement, evidence)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        record.uri,
        record.subjectUri,
        record.attestedByUri,
        record.attestationType,
        record.statement,
        JSON.stringify(record.evidence),
      ],
    );

    return record;
  }

  async listBySubject(subjectUri: RtnUri, includeRevoked = false): Promise<AttestationRecord[]> {
    const query = includeRevoked
      ? `SELECT * FROM attestations WHERE subject_uri = $1 ORDER BY created_at DESC`
      : `SELECT * FROM attestations WHERE subject_uri = $1 AND revoked_at IS NULL ORDER BY created_at DESC`;
    const result = await this.db.query(query, [subjectUri]);
    return result.rows.map(mapRow);
  }

  async revoke(uri: RtnUri, reason: string): Promise<void> {
    await this.db.query(
      `UPDATE attestations SET revoked_at = NOW(), revocation_reason = $2 WHERE uri = $1`,
      [uri, reason],
    );
  }
}

function mapRow(row: Record<string, unknown>): AttestationRecord {
  return {
    uri: row.uri as RtnUri,
    subjectUri: row.subject_uri as RtnUri,
    attestedByUri: row.attested_by_uri as RtnUri,
    attestationType: row.attestation_type as string,
    statement: row.statement as string,
    evidence: row.evidence as Record<string, unknown>,
    createdAt: new Date(row.created_at as string),
    revokedAt: row.revoked_at ? new Date(row.revoked_at as string) : undefined,
  };
}
