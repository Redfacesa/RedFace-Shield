import {
  buildRtnUri,
  generateLocalId,
  KernelError,
  type GeoPoint,
  type IdentityRef,
  type ResourceAllocation,
  type ResourceRecord,
  type ResourceState,
  type RtnUri,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { CapabilityEngine } from './capability-engine.js';
import type { EventEngine } from './event-engine.js';
import type { IdentityEngine } from './identity-engine.js';
import type { PolicyEngine } from './policy-engine.js';

/** Resource Engine — concrete allocatable assets. Capabilities matched via Capability Engine. */

export interface RegisterResourceInput {
  type: string;
  organizationUri: RtnUri;
  capabilityUris: RtnUri[];
  localId?: string;
  location?: GeoPoint;
  metadata?: Record<string, unknown>;
}

export class ResourceEngine {
  constructor(
    private readonly db: DbPool,
    private readonly policy: PolicyEngine,
    private readonly events: EventEngine,
    private readonly identity: IdentityEngine,
    private readonly capabilities: CapabilityEngine,
  ) {}

  async register(input: RegisterResourceInput): Promise<ResourceRecord> {
    for (const cap of input.capabilityUris) {
      await this.capabilities.get(cap);
    }

    const localId = input.localId ?? generateLocalId(input.type.slice(0, 3));
    const uri = buildRtnUri('resource', localId);

    await this.identity.register({
      kind: 'resource',
      localId,
      displayName: `${input.type}:${localId}`,
      metadata: input.metadata,
    });

    const resource: ResourceRecord = {
      id: uri,
      type: input.type,
      organizationUri: input.organizationUri,
      capabilityUris: input.capabilityUris,
      state: 'available',
      location: input.location,
      metadata: input.metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO resources (id, uri, type, organization_id, capability_types, capability_uris, state, location, metadata)
       VALUES ($1, $1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        uri,
        resource.type,
        resource.organizationUri,
        input.capabilityUris.map((c) => c.split('/').pop()),
        input.capabilityUris,
        resource.state,
        JSON.stringify(resource.location ?? null),
        JSON.stringify(resource.metadata ?? {}),
      ],
    );

    return resource;
  }

  async matchByCapabilities(requiredCapabilityUris: RtnUri[], limit = 5): Promise<ResourceRecord[]> {
    if (requiredCapabilityUris.length === 0) return [];

    const result = await this.db.query(
      `SELECT * FROM resources
       WHERE state = 'available'
         AND capability_uris @> $1::text[]
       ORDER BY created_at ASC
       LIMIT $2`,
      [requiredCapabilityUris, limit],
    );
    return result.rows.map(mapResourceRow);
  }

  async allocate(
    missionUri: RtnUri,
    resourceUri: RtnUri,
    capabilityUri: RtnUri,
    role: string,
    actor: IdentityRef,
  ): Promise<ResourceAllocation> {
    await this.policy.require({
      action: 'resource.allocate',
      actor,
      missionUri,
      metadata: { resourceUri, capabilityUri },
    });

    const resource = await this.get(resourceUri);
    if (resource.state !== 'available') {
      throw new KernelError(`Resource ${resourceUri} not available`, 'RESOURCE_UNAVAILABLE');
    }

    const allocation: ResourceAllocation = {
      id: `alloc-${crypto.randomUUID()}`,
      missionId: missionUri,
      resourceId: resourceUri,
      capabilityUri,
      role,
      allocatedAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO resource_allocations (id, mission_id, resource_id, capability_used, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [allocation.id, missionUri, resourceUri, capabilityUri.split('/').pop(), role],
    );

    await this.setState(resourceUri, 'allocated');

    await this.events.publish({
      type: 'rsp.resource.allocated',
      source: actor,
      missionUri,
      payload: { resource: resourceUri, capability: capabilityUri, role },
    });

    return allocation;
  }

  async release(missionUri: RtnUri, resourceUri: RtnUri, actor: IdentityRef): Promise<void> {
    await this.policy.require({ action: 'resource.release', actor, missionUri, metadata: { resourceUri } });

    await this.db.query(
      `UPDATE resource_allocations SET released_at = NOW()
       WHERE mission_id = $1 AND resource_id = $2 AND released_at IS NULL`,
      [missionUri, resourceUri],
    );

    await this.setState(resourceUri, 'available');

    await this.events.publish({
      type: 'rsp.resource.released',
      source: actor,
      missionUri,
      payload: { resource: resourceUri },
    });
  }

  async get(resourceUri: RtnUri): Promise<ResourceRecord> {
    const result = await this.db.query(`SELECT * FROM resources WHERE uri = $1 OR id = $1`, [resourceUri]);
    if (result.rowCount === 0) {
      throw new KernelError(`Resource not found: ${resourceUri}`, 'RESOURCE_NOT_FOUND');
    }
    return mapResourceRow(result.rows[0]);
  }

  async listAll(): Promise<ResourceRecord[]> {
    const result = await this.db.query(`SELECT * FROM resources ORDER BY type, updated_at DESC`);
    return result.rows.map(mapResourceRow);
  }

  private async setState(resourceUri: RtnUri, state: ResourceState): Promise<void> {
    await this.db.query(`UPDATE resources SET state = $1, updated_at = NOW() WHERE uri = $2 OR id = $2`, [
      state,
      resourceUri,
    ]);
  }
}

function mapResourceRow(row: Record<string, unknown>): ResourceRecord {
  const uri = (row.uri ?? row.id) as RtnUri;
  const capUris = (row.capability_uris as RtnUri[] | null) ?? [];
  return {
    id: uri,
    type: row.type as string,
    organizationUri: row.organization_id as RtnUri,
    capabilityUris:
      capUris.length > 0
        ? capUris
        : ((row.capability_types as string[]) ?? []).map((s) => `rtn://capability/${s}` as RtnUri),
    state: row.state as ResourceRecord['state'],
    location: row.location as GeoPoint | undefined,
    metadata: row.metadata as Record<string, unknown>,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}
