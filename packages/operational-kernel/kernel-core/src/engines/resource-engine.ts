import {
  generateId,
  KernelError,
  type GeoPoint,
  type IdentityRef,
  type ResourceAllocation,
  type ResourceRecord,
  type ResourceState,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { EventEngine } from './event-engine.js';
import type { PolicyEngine } from './policy-engine.js';

/** Resource Engine — Axiom 10: Missions allocate capabilities, not brands. */

export interface RegisterResourceInput {
  type: string;
  organizationId: string;
  capabilityTypes: string[];
  location?: GeoPoint;
  trustScore?: number;
  metadata?: Record<string, unknown>;
}

export interface MatchCapabilitiesInput {
  capabilities: string[];
  zone?: GeoPoint;
  limit?: number;
}

export class ResourceEngine {
  constructor(
    private readonly db: DbPool,
    private readonly policy: PolicyEngine,
    private readonly events: EventEngine,
  ) {}

  async register(input: RegisterResourceInput): Promise<ResourceRecord> {
    const resource: ResourceRecord = {
      id: generateId('RF-AST'),
      type: input.type,
      organizationId: input.organizationId,
      capabilityTypes: input.capabilityTypes,
      state: 'available',
      location: input.location,
      trustScore: input.trustScore ?? 0,
      metadata: input.metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO resources (id, type, organization_id, capability_types, state, location, trust_score, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        resource.id,
        resource.type,
        resource.organizationId,
        resource.capabilityTypes,
        resource.state,
        JSON.stringify(resource.location ?? null),
        resource.trustScore,
        JSON.stringify(resource.metadata ?? {}),
      ],
    );

    return resource;
  }

  async matchCapabilities(input: MatchCapabilitiesInput): Promise<ResourceRecord[]> {
    const limit = input.limit ?? 5;
    const result = await this.db.query(
      `SELECT * FROM resources
       WHERE state = 'available'
         AND capability_types @> $1::text[]
       ORDER BY trust_score DESC
       LIMIT $2`,
      [input.capabilities, limit],
    );
    return result.rows.map(mapResourceRow);
  }

  async allocate(
    missionId: string,
    resourceId: string,
    capabilityUsed: string,
    role: string,
    actor: IdentityRef,
  ): Promise<ResourceAllocation> {
    await this.policy.require({
      action: 'resource.allocate',
      actor,
      missionId,
      metadata: { resourceId, capabilityUsed },
    });

    const resource = await this.get(resourceId);
    if (resource.state !== 'available') {
      throw new KernelError(`Resource ${resourceId} not available`, 'RESOURCE_UNAVAILABLE');
    }

    const allocation: ResourceAllocation = {
      id: `alloc-${crypto.randomUUID()}`,
      missionId,
      resourceId,
      capabilityUsed,
      role,
      allocatedAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO resource_allocations (id, mission_id, resource_id, capability_used, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [allocation.id, missionId, resourceId, capabilityUsed, role],
    );

    await this.setState(resourceId, 'allocated');

    await this.events.publish({
      type: 'rsp.resource.allocated',
      source: actor,
      missionId,
      payload: { resourceId, capabilityUsed, role, allocationId: allocation.id },
    });

    return allocation;
  }

  async release(missionId: string, resourceId: string, actor: IdentityRef): Promise<void> {
    await this.policy.require({ action: 'resource.release', actor, missionId, metadata: { resourceId } });

    await this.db.query(
      `UPDATE resource_allocations SET released_at = NOW()
       WHERE mission_id = $1 AND resource_id = $2 AND released_at IS NULL`,
      [missionId, resourceId],
    );

    await this.setState(resourceId, 'available');

    await this.events.publish({
      type: 'rsp.resource.released',
      source: actor,
      missionId,
      payload: { resourceId },
    });
  }

  async get(resourceId: string): Promise<ResourceRecord> {
    const result = await this.db.query(`SELECT * FROM resources WHERE id = $1`, [resourceId]);
    if (result.rowCount === 0) {
      throw new KernelError(`Resource not found: ${resourceId}`, 'RESOURCE_NOT_FOUND');
    }
    return mapResourceRow(result.rows[0]);
  }

  private async setState(resourceId: string, state: ResourceState): Promise<void> {
    await this.db.query(`UPDATE resources SET state = $1, updated_at = NOW() WHERE id = $2`, [state, resourceId]);
  }
}

function mapResourceRow(row: Record<string, unknown>): ResourceRecord {
  return {
    id: row.id as string,
    type: row.type as string,
    organizationId: row.organization_id as string,
    capabilityTypes: row.capability_types as string[],
    state: row.state as ResourceRecord['state'],
    location: row.location as GeoPoint | undefined,
    trustScore: Number(row.trust_score),
    metadata: row.metadata as Record<string, unknown> | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}
