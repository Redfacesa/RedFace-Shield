import { newEventUri, type IdentityRef, type RspEventRecord, type RtnUri } from '@redface/shared';
import type { DbPool } from '../db/client.js';
import { buildPlaybackFromEvents, type MissionPlayback } from '../playback/mission-playback.js';
import type { PolicyEngine } from './policy-engine.js';

/** Event Engine — Axiom 5 & 6. History Engine — Axiom 7. */

export interface PublishEventInput {
  type: string;
  source: IdentityRef;
  missionUri?: RtnUri;
  intentUri?: RtnUri;
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
      missionUri: input.missionUri,
      metadata: { eventType: input.type },
    });

    const id = newEventUri();
    const event: RspEventRecord = {
      id,
      type: input.type,
      missionId: input.missionUri,
      intentId: input.intentUri,
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
        event.source.uri,
        event.source.organizationUri,
        JSON.stringify(event.payload),
        event.signature ?? null,
        event.occurredAt.toISOString(),
      ],
    );

    return event;
  }

  async listByMission(missionUri: RtnUri): Promise<RspEventRecord[]> {
    const result = await this.db.query(
      `SELECT * FROM events WHERE mission_id = $1 ORDER BY occurred_at ASC`,
      [missionUri],
    );
    return result.rows.map(mapEventRow);
  }
}

export class HistoryEngine {
  constructor(private readonly events: EventEngine) {}

  async getMissionTimeline(missionUri: RtnUri): Promise<RspEventRecord[]> {
    return this.events.listByMission(missionUri);
  }

  async exportMissionAudit(missionUri: RtnUri): Promise<{ missionUri: RtnUri; events: RspEventRecord[] }> {
    const events = await this.getMissionTimeline(missionUri);
    return { missionUri, events };
  }

  async buildPlayback(missionUri: RtnUri): Promise<MissionPlayback> {
    const events = await this.getMissionTimeline(missionUri);
    return buildPlaybackFromEvents(missionUri, events);
  }
}

function mapEventRow(row: Record<string, unknown>): RspEventRecord {
  return {
    id: row.id as RtnUri,
    type: row.type as string,
    missionId: row.mission_id as RtnUri | undefined,
    intentId: row.intent_id as RtnUri | undefined,
    source: {
      uri: row.source_identity as RtnUri,
      organizationUri: row.source_organization as RtnUri,
    },
    payload: row.payload as Record<string, unknown>,
    signature: row.signature as string | undefined,
    supersededBy: row.superseded_by as RtnUri | undefined,
    occurredAt: new Date(row.occurred_at as string),
    recordedAt: new Date(row.recorded_at as string),
  };
}
