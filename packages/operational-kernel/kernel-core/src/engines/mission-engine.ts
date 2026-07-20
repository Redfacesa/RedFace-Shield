import {
  generateId,
  KernelError,
  type IdentityRef,
  type MissionOutcome,
  type MissionRecord,
  type MissionState,
  type Priority,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { EventEngine } from './event-engine.js';
import type { IntentEngine } from './intent-engine.js';
import type { PolicyEngine } from './policy-engine.js';

/** Mission Engine — Axiom 11: Missions own execution. Adaptive, not workflow. */

export interface CreateMissionInput {
  intentId: string;
  type: string;
  title: string;
  ownerId: string;
  capabilitiesRequired: string[];
  priority: Priority;
  actor: IdentityRef;
}

export interface CompleteMissionInput {
  missionId: string;
  outcome: MissionOutcome;
  lessons: Record<string, unknown>;
  actor: IdentityRef;
}

export class MissionEngine {
  constructor(
    private readonly db: DbPool,
    private readonly policy: PolicyEngine,
    private readonly events: EventEngine,
    private readonly intents: IntentEngine,
  ) {}

  async createFromIntent(input: CreateMissionInput): Promise<MissionRecord> {
    await this.policy.require({
      action: 'mission.create',
      actor: input.actor,
      metadata: { intentId: input.intentId },
    });

    const intent = await this.intents.get(input.intentId);
    if (intent.state !== 'accepted') {
      throw new KernelError(`Intent must be accepted before mission creation`, 'INTENT_NOT_ACCEPTED');
    }

    const mission: MissionRecord = {
      id: generateId('RF-MSN'),
      intentId: input.intentId,
      type: input.type,
      title: input.title,
      state: 'planning',
      ownerId: input.ownerId,
      capabilitiesRequired: input.capabilitiesRequired,
      priority: input.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO missions (id, intent_id, type, title, state, owner_id, capabilities_required, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        mission.id,
        mission.intentId,
        mission.type,
        mission.title,
        mission.state,
        mission.ownerId,
        mission.capabilitiesRequired,
        mission.priority,
      ],
    );

    await this.intents.linkMission(input.intentId, mission.id);

    await this.events.publish({
      type: 'rsp.mission.created',
      source: input.actor,
      missionId: mission.id,
      intentId: input.intentId,
      payload: {
        type: mission.type,
        title: mission.title,
        capabilitiesRequired: mission.capabilitiesRequired,
      },
    });

    return mission;
  }

  async addParticipant(missionId: string, organizationId: string, role: string): Promise<void> {
    await this.db.query(
      `INSERT INTO mission_participants (mission_id, organization_id, role)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [missionId, organizationId, role],
    );
  }

  async transition(
    missionId: string,
    toState: MissionState,
    actor: IdentityRef,
    reason?: string,
  ): Promise<MissionRecord> {
    await this.policy.require({
      action: 'mission.transition',
      actor,
      missionId,
      metadata: { toState, reason },
    });

    const mission = await this.get(missionId);
    await this.db.query(
      `UPDATE missions SET state = $1, updated_at = NOW() WHERE id = $2`,
      [toState, missionId],
    );

    await this.events.publish({
      type: 'rsp.mission.state_changed',
      source: actor,
      missionId,
      intentId: mission.intentId,
      payload: { fromState: mission.state, toState, reason },
    });

    return this.get(missionId);
  }

  async complete(input: CompleteMissionInput): Promise<MissionRecord> {
    await this.policy.require({
      action: 'mission.complete',
      actor: input.actor,
      missionId: input.missionId,
    });

    await this.db.query(
      `UPDATE missions
       SET state = 'completed', outcome = $1, lessons = $2, completed_at = NOW(), updated_at = NOW()
       WHERE id = $3`,
      [JSON.stringify(input.outcome), JSON.stringify(input.lessons), input.missionId],
    );

    const mission = await this.get(input.missionId);

    await this.events.publish({
      type: 'rsp.mission.completed',
      source: input.actor,
      missionId: input.missionId,
      intentId: mission.intentId,
      payload: { outcome: input.outcome, lessons: input.lessons },
    });

    await this.intents.fulfill(mission.intentId);

    return mission;
  }

  async get(missionId: string): Promise<MissionRecord> {
    const result = await this.db.query(`SELECT * FROM missions WHERE id = $1`, [missionId]);
    if (result.rowCount === 0) {
      throw new KernelError(`Mission not found: ${missionId}`, 'MISSION_NOT_FOUND');
    }
    return mapMissionRow(result.rows[0]);
  }
}

function mapMissionRow(row: Record<string, unknown>): MissionRecord {
  return {
    id: row.id as string,
    intentId: row.intent_id as string,
    type: row.type as string,
    title: row.title as string,
    state: row.state as MissionRecord['state'],
    ownerId: row.owner_id as string,
    capabilitiesRequired: row.capabilities_required as string[],
    priority: row.priority as MissionRecord['priority'],
    outcome: row.outcome as MissionOutcome | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    completedAt: row.completed_at ? new Date(row.completed_at as string) : undefined,
  };
}
