import {
  buildRtnUri,
  generateLocalId,
  KernelError,
  type IdentityRecord,
  type IdentityStatus,
  type RtnKind,
  type RtnUri,
  type TrustDocument,
  type TrustDocumentType,
  type VerificationStatus,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';

/** Identity Engine — who or what exists. NOT authentication. */

export interface RegisterIdentityInput {
  kind: RtnKind;
  localId?: string;
  displayName: string;
  metadata?: Record<string, unknown>;
}

export interface AttachDocumentInput {
  identityUri: RtnUri;
  documentType: TrustDocumentType;
  issuerUri?: RtnUri;
  validFrom?: Date;
  validUntil?: Date;
  payload?: Record<string, unknown>;
}

export class IdentityEngine {
  constructor(private readonly db: DbPool) {}

  async register(input: RegisterIdentityInput): Promise<IdentityRecord> {
    const localId = input.localId ?? generateLocalId(input.kind.slice(0, 3));
    const uri = buildRtnUri(input.kind, localId);

    await this.db.query(
      `INSERT INTO identities (uri, kind, local_id, display_name, metadata)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (uri) DO NOTHING`,
      [uri, input.kind, localId, input.displayName, JSON.stringify(input.metadata ?? {})],
    );

    return this.resolve(uri);
  }

  async resolve(uri: RtnUri): Promise<IdentityRecord> {
    const result = await this.db.query(`SELECT * FROM identities WHERE uri = $1`, [uri]);
    if (result.rowCount === 0) {
      throw new KernelError(`Identity not found: ${uri}`, 'IDENTITY_NOT_FOUND');
    }
    return mapIdentityRow(result.rows[0]);
  }

  async setStatus(uri: RtnUri, status: IdentityStatus): Promise<IdentityRecord> {
    await this.db.query(`UPDATE identities SET status = $1 WHERE uri = $2`, [status, uri]);
    return this.resolve(uri);
  }

  async attachDocument(input: AttachDocumentInput): Promise<TrustDocument> {
    await this.resolve(input.identityUri);

    const docUri = buildRtnUri('document', generateLocalId('doc'));
    const doc: TrustDocument = {
      id: docUri,
      identityUri: input.identityUri,
      documentType: input.documentType,
      issuerUri: input.issuerUri,
      validFrom: input.validFrom,
      validUntil: input.validUntil,
      payload: input.payload ?? {},
      verificationStatus: 'pending',
      createdAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO trust_documents (uri, identity_uri, document_type, issuer_uri, valid_from, valid_until, payload, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        doc.id,
        doc.identityUri,
        doc.documentType,
        doc.issuerUri ?? null,
        doc.validFrom?.toISOString() ?? null,
        doc.validUntil?.toISOString() ?? null,
        JSON.stringify(doc.payload),
        doc.verificationStatus,
      ],
    );

    return doc;
  }

  async listDocuments(identityUri: RtnUri): Promise<TrustDocument[]> {
    const result = await this.db.query(
      `SELECT * FROM trust_documents WHERE identity_uri = $1 ORDER BY created_at DESC`,
      [identityUri],
    );
    return result.rows.map(mapDocumentRow);
  }
}

function mapIdentityRow(row: Record<string, unknown>): IdentityRecord {
  return {
    uri: row.uri as RtnUri,
    kind: row.kind as IdentityRecord['kind'],
    localId: row.local_id as string,
    displayName: row.display_name as string,
    metadata: row.metadata as Record<string, unknown>,
    status: row.status as IdentityStatus,
    createdAt: new Date(row.created_at as string),
  };
}

function mapDocumentRow(row: Record<string, unknown>): TrustDocument {
  return {
    id: row.uri as RtnUri,
    identityUri: row.identity_uri as RtnUri,
    documentType: row.document_type as TrustDocumentType,
    issuerUri: row.issuer_uri as RtnUri | undefined,
    validFrom: row.valid_from ? new Date(row.valid_from as string) : undefined,
    validUntil: row.valid_until ? new Date(row.valid_until as string) : undefined,
    payload: row.payload as Record<string, unknown>,
    verificationStatus: row.verification_status as VerificationStatus,
    createdAt: new Date(row.created_at as string),
  };
}

export type { VerificationStatus };
