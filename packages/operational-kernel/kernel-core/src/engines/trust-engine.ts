import {
  buildRtnUri,
  generateLocalId,
  type DerivedTrust,
  type RtnUri,
  type VerificationStatus,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { IdentityEngine } from './identity-engine.js';

/** Trust Engine — verification ("I checked this"). Trust derived, never stored. Attestation is separate. */

export interface RecordVerificationInput {
  subjectUri: RtnUri;
  verificationType: string;
  status: VerificationStatus;
  attestedByUri?: RtnUri;
  evidence?: Record<string, unknown>;
  expiresAt?: Date;
}

export class TrustEngine {
  constructor(
    private readonly db: DbPool,
    private readonly identity: IdentityEngine,
  ) {}

  async recordVerification(input: RecordVerificationInput): Promise<void> {
    await this.identity.resolve(input.subjectUri);

    const uri = buildRtnUri('document', generateLocalId('ver'));
    await this.db.query(
      `INSERT INTO verifications (uri, subject_uri, verification_type, status, attested_by_uri, evidence, verified_at, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        uri,
        input.subjectUri,
        input.verificationType,
        input.status,
        input.attestedByUri ?? null,
        JSON.stringify(input.evidence ?? {}),
        input.status === 'verified' ? new Date().toISOString() : null,
        input.expiresAt?.toISOString() ?? null,
      ],
    );
  }

  async verifyDocument(documentUri: RtnUri, attestedByUri: RtnUri): Promise<void> {
    await this.db.query(
      `UPDATE trust_documents SET verification_status = 'verified' WHERE uri = $1`,
      [documentUri],
    );
    await this.recordVerification({
      subjectUri: documentUri,
      verificationType: 'document_verified',
      status: 'verified',
      attestedByUri,
    });
  }

  /**
   * Derive trust from verifiable history — never read a stored score.
   * Trust = f(evidence integrity, mission success, policy compliance, response history, document validity)
   */
  async deriveTrust(subjectUri: RtnUri): Promise<DerivedTrust> {
    await this.identity.resolve(subjectUri);

    const [docs, verifications, missions, attestations] = await Promise.all([
      this.db.query(
        `SELECT verification_status FROM trust_documents WHERE identity_uri = $1`,
        [subjectUri],
      ),
      this.db.query(
        `SELECT status FROM verifications WHERE subject_uri = $1`,
        [subjectUri],
      ),
      this.db.query(
        `SELECT outcome FROM missions
         WHERE owner_id = $1 OR uri IN (
           SELECT mission_id FROM mission_participants WHERE organization_id = $1
         )`,
        [subjectUri],
      ),
      this.db.query(
        `SELECT 1 FROM attestations WHERE subject_uri = $1 AND revoked_at IS NULL`,
        [subjectUri],
      ),
    ]);

    const documentValidity = scoreDocuments(docs.rows);
    const evidenceIntegrity = scoreVerifications(verifications.rows);
    const missionSuccess = scoreMissions(missions.rows);
    const attestationWeight = attestations.rows.length > 0 ? 1 : 0.5;
    const policyCompliance = 1;
    const responseHistory = missionSuccess;

    const components = {
      evidenceIntegrity,
      missionSuccess,
      policyCompliance,
      responseHistory,
      documentValidity,
    };

    const score =
      (components.evidenceIntegrity * 0.2 +
        components.missionSuccess * 0.25 +
        components.policyCompliance * 0.15 +
        components.responseHistory * 0.15 +
        components.documentValidity * 0.15) *
      attestationWeight;

    return {
      subjectUri,
      score: round(score),
      components: {
        evidenceIntegrity: round(components.evidenceIntegrity),
        missionSuccess: round(components.missionSuccess),
        policyCompliance: round(components.policyCompliance),
        responseHistory: round(components.responseHistory),
        documentValidity: round(components.documentValidity),
      },
      computedAt: new Date(),
    };
  }
}

function scoreDocuments(rows: Array<{ verification_status: string }>): number {
  if (rows.length === 0) return 0.5;
  const verified = rows.filter((r) => r.verification_status === 'verified').length;
  return verified / rows.length;
}

function scoreVerifications(rows: Array<{ status: string }>): number {
  if (rows.length === 0) return 0.5;
  const verified = rows.filter((r) => r.status === 'verified').length;
  return verified / rows.length;
}

function scoreMissions(rows: Array<{ outcome: unknown }>): number {
  if (rows.length === 0) return 0.5;
  let success = 0;
  for (const row of rows) {
    const outcome = row.outcome as { result?: string } | null;
    if (outcome?.result === 'success') success++;
    else if (outcome?.result === 'partial_success') success += 0.5;
  }
  return success / rows.length;
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
