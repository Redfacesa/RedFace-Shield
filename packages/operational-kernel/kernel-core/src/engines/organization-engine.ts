import {
  buildRtnUri,
  KernelError,
  type OrganizationRecord,
  type OrganizationType,
  type RtnUri,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { IdentityEngine } from './identity-engine.js';

/** Organization Engine — government, NGO, insurer, company, municipality are all organizations. */

export interface RegisterOrganizationInput {
  localId: string;
  orgType: OrganizationType;
  displayName: string;
  jurisdiction?: string;
  metadata?: Record<string, unknown>;
}

export class OrganizationEngine {
  constructor(
    private readonly db: DbPool,
    private readonly identity: IdentityEngine,
  ) {}

  async register(input: RegisterOrganizationInput): Promise<OrganizationRecord> {
    const uri = buildRtnUri('organization', input.localId);

    await this.identity.register({
      kind: 'organization',
      localId: input.localId,
      displayName: input.displayName,
      metadata: input.metadata,
    });

    await this.db.query(
      `INSERT INTO organizations (uri, org_type, display_name, jurisdiction, metadata)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (uri) DO UPDATE SET
         org_type = EXCLUDED.org_type,
         display_name = EXCLUDED.display_name,
         jurisdiction = EXCLUDED.jurisdiction,
         metadata = EXCLUDED.metadata`,
      [
        uri,
        input.orgType,
        input.displayName,
        input.jurisdiction ?? null,
        JSON.stringify(input.metadata ?? {}),
      ],
    );

    return this.get(uri);
  }

  async get(uri: RtnUri): Promise<OrganizationRecord> {
    const result = await this.db.query(`SELECT * FROM organizations WHERE uri = $1`, [uri]);
    if (result.rowCount === 0) {
      throw new KernelError(`Organization not found: ${uri}`, 'ORGANIZATION_NOT_FOUND');
    }
    return mapOrgRow(result.rows[0]);
  }
}

function mapOrgRow(row: Record<string, unknown>): OrganizationRecord {
  return {
    uri: row.uri as RtnUri,
    orgType: row.org_type as OrganizationType,
    displayName: row.display_name as string,
    jurisdiction: row.jurisdiction as string | undefined,
    metadata: row.metadata as Record<string, unknown>,
    createdAt: new Date(row.created_at as string),
  };
}
