import {
  buildRtnUri,
  KernelError,
  type CapabilityRecord,
  type CapabilityRequirement,
  type OrganizationCapability,
  type RtnUri,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { IdentityEngine } from './identity-engine.js';
import type { OrganizationEngine } from './organization-engine.js';

/** Capability Engine — capabilities exist independently of organizations and resources. */

export interface RegisterCapabilityInput {
  slug: string;
  name: string;
  description?: string;
  requirements?: CapabilityRequirement[];
  metadata?: Record<string, unknown>;
}

export class CapabilityEngine {
  constructor(
    private readonly db: DbPool,
    private readonly identity: IdentityEngine,
    private readonly organizations: OrganizationEngine,
  ) {}

  async register(input: RegisterCapabilityInput): Promise<CapabilityRecord> {
    const uri = buildRtnUri('capability', input.slug);

    await this.identity.register({
      kind: 'capability',
      localId: input.slug,
      displayName: input.name,
      metadata: input.metadata,
    });

    await this.db.query(
      `INSERT INTO capabilities (uri, slug, name, description, requirements, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (uri) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         requirements = EXCLUDED.requirements,
         metadata = EXCLUDED.metadata`,
      [
        uri,
        input.slug,
        input.name,
        input.description ?? null,
        JSON.stringify(input.requirements ?? []),
        JSON.stringify(input.metadata ?? {}),
      ],
    );

    return this.get(uri);
  }

  async get(uri: RtnUri): Promise<CapabilityRecord> {
    const result = await this.db.query(`SELECT * FROM capabilities WHERE uri = $1`, [uri]);
    if (result.rowCount === 0) {
      throw new KernelError(`Capability not found: ${uri}`, 'CAPABILITY_NOT_FOUND');
    }
    return mapCapabilityRow(result.rows[0]);
  }

  async getBySlug(slug: string): Promise<CapabilityRecord> {
    return this.get(buildRtnUri('capability', slug));
  }

  async organizationProvides(
    organizationUri: RtnUri,
    capabilityUri: RtnUri,
    verified = false,
  ): Promise<OrganizationCapability> {
    await this.organizations.get(organizationUri);
    await this.get(capabilityUri);

    await this.db.query(
      `INSERT INTO organization_capabilities (organization_uri, capability_uri, verified)
       VALUES ($1, $2, $3)
       ON CONFLICT (organization_uri, capability_uri) DO UPDATE SET verified = EXCLUDED.verified`,
      [organizationUri, capabilityUri, verified],
    );

    return {
      organizationUri,
      capabilityUri,
      verified,
      providedSince: new Date(),
    };
  }

  /** Find organizations that provide ALL required capabilities (Axiom 10) */
  async matchProviders(requiredCapabilityUris: RtnUri[]): Promise<RtnUri[]> {
    if (requiredCapabilityUris.length === 0) return [];

    const result = await this.db.query(
      `SELECT organization_uri
       FROM organization_capabilities
       WHERE capability_uri = ANY($1::text[]) AND verified = true
       GROUP BY organization_uri
       HAVING COUNT(DISTINCT capability_uri) = $2`,
      [requiredCapabilityUris, requiredCapabilityUris.length],
    );

    return result.rows.map((r) => r.organization_uri as RtnUri);
  }
}

function mapCapabilityRow(row: Record<string, unknown>): CapabilityRecord {
  return {
    uri: row.uri as RtnUri,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string | undefined,
    requirements: row.requirements as CapabilityRequirement[],
    metadata: row.metadata as Record<string, unknown>,
    createdAt: new Date(row.created_at as string),
  };
}
