import { generateId, type RspEventRecord } from '@redface/shared';
import type { RspEventType } from '@redface/rsp';
import type { IdentityRef } from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { PolicyEngine } from './policy-engine.js';

/** Event Engine — Axiom 5: Execution creates events. Axiom 6: Immutable, supersede only. */

export interface PublishEventInput {
  type: RspEventType;
  source: IdentityRef;
  missionId?: string;
  intentId?: string;
  payload: Record<string, unknown>;
  occurredAt?: Date;
  signature?: string;
}

export class EventEngine {
  constructor(
    private readonly db: DbPool,
    private readonly policy: PolicyEngine,
  ) {}

  async publish(input: PublishEventInput): Promise<RspEventRecord> {
    await this.policy.require({
      action: 'event.publish',
      actor: input.source,
      missionId: input.missionId,
      metadata: { eventType: input.type },
    });

    const event: RspEventRecord = {
      id: generateId('RF-EVT'),
      type: input.type,
      missionId: input.missionId,
      intentId: input.intentId,
      source: input.source,
      payload: input.payload,
      signature: input.signature,
      occurredAt: input.occurredAt ?? new Date(),
      recordedAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO events (id, type, mission_id, intent_id, source_identity, source_organization, payload, signature, occurred_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        event.id,
        event.type,
        event.missionId ?? null,
        event.intentId ?? null,
        event.source.id,
        event.source.organizationId,
        JSON.stringify(event.payload),
        event.signature ?? null,
        event.occurredAt.toISOString(),
      ],
    );

    return event;
  }

  async supersede(originalEventId: string, correction: PublishEventInput, actor: IdentityRef): Promise<RspEventRecord> {
    const replacement = await this.publish({
      ...correction,
      source: actor,
      payload: {
        ...correction.payload,
        supersedes: originalEventId,
      },
    });

    await this.db.query(`UPDATE events SET superseded_by = $1 WHERE id = $2`, [replacement.id, originalEventId]);

    await this.publish({
      type: 'rsp.event.superseded',
      source: actor,
      missionId: correction.missionId,
      intentId: correction.intentId,
      payload: { originalEventId, replacementEventId: replacement.id },
    });

    return replacement;
  }

  async listByMission(missionId: string): Promise<RspEventRecord[]> {
    const result = await this.db.query(
      `SELECT * FROM events WHERE mission_id = $1 ORDER BY occurred_at ASC`,
      [missionId],
    );
    return result.rows.map(mapEventRow);
  }
}

function mapEventRow(row: Record<string, unknown>): RspEventRecord {
  return {
    id: row.id as string,
    type: row.type as string,
    missionId: row.mission_id as string | undefined,
    intentId: row.intent_id as string | undefined,
    source: {
      id: row.source_identity as string,
      organizationId: row.source_organization as string,
    },
    payload: row.payload as Record<string, unknown>,
    signature: row.signature as string | undefined,
    supersededBy: row.superseded_by as string | undefined,
    occurredAt: new Date(row.occurred_at as string),
    recordedAt: new Date(row.recorded_at as string),
  };
}

/** History Engine — Axiom 7: History is derived from events, never rewritten. */

export class HistoryEngine {
  constructor(private readonly events: EventEngine) {}

  async getMissionTimeline(missionId: string): Promise<RspEventRecord[]> {
    return this.events.listByMission(missionId);
  }

  async exportMissionAudit(missionId: string): Promise<{ missionId: string; events: RspEventRecord[] }> {
    const timeline = await this.getMissionTimeline(missionId);
    return { missionId, events: timeline };
  }
}
