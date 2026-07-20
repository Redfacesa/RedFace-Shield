import {
  KernelError,
  newMissionUri,
  type IdentityRef,
  type MissionOutcome,
  type MissionRecord,
  type MissionState,
  type Priority,
  type RtnUri,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { EventEngine } from './event-engine.js';
import type { IdentityEngine } from './identity-engine.js';
import type { IntentEngine } from './intent-engine.js';
import type { PolicyEngine } from './policy-engine.js';

/** Mission Engine — Axiom 11: Missions own execution. Adaptive, not workflow. */

export interface CreateMissionInput {
  intentUri: RtnUri;
  type: string;
  title: string;
  ownerUri: RtnUri;
  capabilitiesRequired: RtnUri[];
  priority: Priority;
  actor: IdentityRef;
  localId?: string;
}

export interface CompleteMissionInput {
  missionUri: RtnUri;
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
    private readonly identity: IdentityEngine,
  ) {}

  async createFromIntent(input: CreateMissionInput): Promise<MissionRecord> {
    await this.policy.require({
      action: 'mission.create',
      actor: input.actor,
      metadata: { intentUri: input.intentUri },
    });

    const intent = await this.intents.get(input.intentUri);
    if (intent.state !== 'accepted') {
      throw new KernelError(`Intent must be accepted before mission creation`, 'INTENT_NOT_ACCEPTED');
    }

    const uri = newMissionUri(input.localId);
    await this.identity.register({
      kind: 'mission',
      localId: uri.split('/').pop()!,
      displayName: input.title,
      metadata: { type: input.type },
    });

    const mission: MissionRecord = {
      id: uri,
      intentId: input.intentUri,
      type: input.type,
      title: input.title,
      state: 'planning',
      ownerUri: input.ownerUri,
      capabilitiesRequired: input.capabilitiesRequired,
      priority: input.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO missions (id, uri, intent_id, type, title, state, owner_id, capabilities_required, capabilities_required_uris, priority)
       VALUES ($1, $1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        uri,
        mission.intentId,
        mission.type,
        mission.title,
        mission.state,
        mission.ownerUri,
        input.capabilitiesRequired.map((c) => c.split('/').pop()),
        input.capabilitiesRequired,
        mission.priority,
      ],
    );

    await this.intents.linkMission(input.intentUri, uri);

    await this.events.publish({
      type: 'rsp.mission.created',
      source: input.actor,
      missionUri: uri,
      intentUri: input.intentUri,
      payload: {
        type: mission.type,
        title: mission.title,
        capabilitiesRequired: mission.capabilitiesRequired,
      },
    });

    return mission;
  }

  async addParticipant(missionUri: RtnUri, organizationUri: RtnUri, role: string): Promise<void> {
    await this.db.query(
      `INSERT INTO mission_participants (mission_id, organization_id, role)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [missionUri, organizationUri, role],
    );
  }

  async transition(
    missionUri: RtnUri,
    toState: MissionState,
    actor: IdentityRef,
    reason?: string,
  ): Promise<MissionRecord> {
    await this.policy.require({
      action: 'mission.transition',
      actor,
      missionUri,
      metadata: { toState, reason },
    });

    const mission = await this.get(missionUri);
    await this.db.query(`UPDATE missions SET state = $1, updated_at = NOW() WHERE uri = $2 OR id = $2`, [
      toState,
      missionUri,
    ]);

    await this.events.publish({
      type: 'rsp.mission.state_changed',
      source: actor,
      missionUri,
      intentUri: mission.intentId,
      payload: { fromState: mission.state, toState, reason },
    });

    return this.get(missionUri);
  }

  async complete(input: CompleteMissionInput): Promise<MissionRecord> {
    await this.policy.require({
      action: 'mission.complete',
      actor: input.actor,
      missionUri: input.missionUri,
    });

    await this.db.query(
      `UPDATE missions
       SET state = 'completed', outcome = $1, lessons = $2, completed_at = NOW(), updated_at = NOW()
       WHERE uri = $3 OR id = $3`,
      [JSON.stringify(input.outcome), JSON.stringify(input.lessons), input.missionUri],
    );

    const mission = await this.get(input.missionUri);

    await this.events.publish({
      type: 'rsp.mission.completed',
      source: input.actor,
      missionUri: input.missionUri,
      intentUri: mission.intentId,
      payload: { outcome: input.outcome, lessons: input.lessons },
    });

    await this.intents.fulfill(mission.intentId);
    return mission;
  }

  async get(missionUri: RtnUri): Promise<MissionRecord> {
    const result = await this.db.query(`SELECT * FROM missions WHERE uri = $1 OR id = $1`, [missionUri]);
    if (result.rowCount === 0) {
      throw new KernelError(`Mission not found: ${missionUri}`, 'MISSION_NOT_FOUND');
    }
    return mapMissionRow(result.rows[0]);
  }
}

function mapMissionRow(row: Record<string, unknown>): MissionRecord {
  const uri = (row.uri ?? row.id) as RtnUri;
  const capUris = (row.capabilities_required_uris as RtnUri[] | null) ?? [];
  return {
    id: uri,
    intentId: row.intent_id as RtnUri,
    type: row.type as string,
    title: row.title as string,
    state: row.state as MissionRecord['state'],
    ownerUri: row.owner_id as RtnUri,
    capabilitiesRequired: capUris.length > 0 ? capUris : ((row.capabilities_required as string[]) ?? []).map(
      (s) => `rtn://capability/${s}` as RtnUri,
    ),
    priority: row.priority as MissionRecord['priority'],
    outcome: row.outcome as MissionOutcome | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    completedAt: row.completed_at ? new Date(row.completed_at as string) : undefined,
  };
}
