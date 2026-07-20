import {
  generateId,
  KernelError,
  type IdentityRef,
  type IntentRecord,
  type IntentState,
  type Priority,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { EventEngine } from './event-engine.js';
import type { PolicyEngine } from './policy-engine.js';

/** Intent Engine — Axiom 4: Intent precedes mission. */

export interface DeclareIntentInput {
  type: string;
  statement: string;
  expressedBy: IdentityRef;
  priority: Priority;
  context?: Record<string, unknown>;
}

export class IntentEngine {
  constructor(
    private readonly db: DbPool,
    private readonly policy: PolicyEngine,
    private readonly events: EventEngine,
  ) {}

  async declare(input: DeclareIntentInput): Promise<IntentRecord> {
    await this.policy.require({
      action: 'intent.declare',
      actor: input.expressedBy,
    });

    const intent: IntentRecord = {
      id: generateId('RF-INT'),
      type: input.type,
      statement: input.statement,
      expressedBy: input.expressedBy,
      priority: input.priority,
      state: 'declared',
      context: input.context,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO intents (id, type, statement, expressed_by_id, expressed_by_org, priority, state, context)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        intent.id,
        intent.type,
        intent.statement,
        intent.expressedBy.id,
        intent.expressedBy.organizationId,
        intent.priority,
        intent.state,
        JSON.stringify(intent.context ?? {}),
      ],
    );

    await this.events.publish({
      type: 'rsp.intent.declared',
      source: input.expressedBy,
      intentId: intent.id,
      payload: {
        type: intent.type,
        statement: intent.statement,
        priority: intent.priority,
      },
    });

    return intent;
  }

  async accept(intentId: string, actor: IdentityRef): Promise<IntentRecord> {
    await this.policy.require({ action: 'intent.accept', actor, metadata: { intentId } });

    const intent = await this.get(intentId);
    if (intent.state !== 'declared') {
      throw new KernelError(`Intent ${intentId} cannot be accepted from state ${intent.state}`, 'INTENT_INVALID_STATE');
    }

    await this.setState(intentId, 'accepted');
    await this.events.publish({
      type: 'rsp.intent.accepted',
      source: actor,
      intentId,
      payload: { intentId },
    });

    return this.get(intentId);
  }

  async linkMission(intentId: string, missionId: string): Promise<void> {
    await this.db.query(
      `UPDATE intents SET mission_id = $1, state = 'mission_created', updated_at = NOW() WHERE id = $2`,
      [missionId, intentId],
    );
  }

  async fulfill(intentId: string): Promise<void> {
    await this.setState(intentId, 'fulfilled');
  }

  async get(intentId: string): Promise<IntentRecord> {
    const result = await this.db.query(`SELECT * FROM intents WHERE id = $1`, [intentId]);
    if (result.rowCount === 0) {
      throw new KernelError(`Intent not found: ${intentId}`, 'INTENT_NOT_FOUND');
    }
    return mapIntentRow(result.rows[0]);
  }

  private async setState(intentId: string, state: IntentState): Promise<void> {
    await this.db.query(`UPDATE intents SET state = $1, updated_at = NOW() WHERE id = $2`, [state, intentId]);
  }
}

function mapIntentRow(row: Record<string, unknown>): IntentRecord {
  return {
    id: row.id as string,
    type: row.type as string,
    statement: row.statement as string,
    expressedBy: {
      id: row.expressed_by_id as string,
      organizationId: row.expressed_by_org as string,
    },
    priority: row.priority as IntentRecord['priority'],
    state: row.state as IntentRecord['state'],
    context: row.context as Record<string, unknown> | undefined,
    missionId: row.mission_id as string | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}
