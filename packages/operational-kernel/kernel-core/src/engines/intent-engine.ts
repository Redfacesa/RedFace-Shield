import {
  KernelError,
  newIntentUri,
  type IdentityRef,
  type IntentRecord,
  type IntentState,
  type Priority,
  type RtnUri,
} from '@redface/shared';
import type { DbPool } from '../db/client.js';
import type { EventEngine } from './event-engine.js';
import type { IdentityEngine } from './identity-engine.js';
import type { PolicyEngine } from './policy-engine.js';

/** Intent Engine — Axiom 4: Intent precedes mission. */

export interface DeclareIntentInput {
  type: string;
  statement: string;
  expressedBy: IdentityRef;
  priority: Priority;
  context?: Record<string, unknown>;
  localId?: string;
}

export class IntentEngine {
  constructor(
    private readonly db: DbPool,
    private readonly policy: PolicyEngine,
    private readonly events: EventEngine,
    private readonly identity: IdentityEngine,
  ) {}

  async declare(input: DeclareIntentInput): Promise<IntentRecord> {
    await this.policy.require({ action: 'intent.declare', actor: input.expressedBy });
    await this.identity.resolve(input.expressedBy.uri);

    const uri = newIntentUri(input.localId);
    const intent: IntentRecord = {
      id: uri,
      type: input.type,
      statement: input.statement,
      expressedBy: input.expressedBy,
      priority: input.priority,
      state: 'declared',
      context: input.context,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.identity.register({
      kind: 'intent',
      localId: uri.split('/').pop()!,
      displayName: input.statement.slice(0, 120),
      metadata: { type: input.type },
    });

    await this.db.query(
      `INSERT INTO intents (id, uri, type, statement, expressed_by_id, expressed_by_org, priority, state, context)
       VALUES ($1, $1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        uri,
        intent.type,
        intent.statement,
        intent.expressedBy.uri,
        intent.expressedBy.organizationUri,
        intent.priority,
        intent.state,
        JSON.stringify(intent.context ?? {}),
      ],
    );

    await this.events.publish({
      type: 'rsp.intent.declared',
      source: input.expressedBy,
      intentUri: uri,
      payload: { type: intent.type, statement: intent.statement, priority: intent.priority },
    });

    return intent;
  }

  async accept(intentUri: RtnUri, actor: IdentityRef): Promise<IntentRecord> {
    await this.policy.require({ action: 'intent.accept', actor, metadata: { intentUri } });

    const intent = await this.get(intentUri);
    if (intent.state !== 'declared') {
      throw new KernelError(`Intent ${intentUri} cannot be accepted from state ${intent.state}`, 'INTENT_INVALID_STATE');
    }

    await this.setState(intentUri, 'accepted');
    await this.events.publish({
      type: 'rsp.intent.accepted',
      source: actor,
      intentUri,
      payload: { intentUri },
    });

    return this.get(intentUri);
  }

  async linkMission(intentUri: RtnUri, missionUri: RtnUri): Promise<void> {
    await this.db.query(
      `UPDATE intents SET mission_id = $1, state = 'mission_created', updated_at = NOW() WHERE uri = $2`,
      [missionUri, intentUri],
    );
  }

  async fulfill(intentUri: RtnUri): Promise<void> {
    await this.setState(intentUri, 'fulfilled');
  }

  async get(intentUri: RtnUri): Promise<IntentRecord> {
    const result = await this.db.query(`SELECT * FROM intents WHERE uri = $1 OR id = $1`, [intentUri]);
    if (result.rowCount === 0) {
      throw new KernelError(`Intent not found: ${intentUri}`, 'INTENT_NOT_FOUND');
    }
    return mapIntentRow(result.rows[0]);
  }

  private async setState(intentUri: RtnUri, state: IntentState): Promise<void> {
    await this.db.query(`UPDATE intents SET state = $1, updated_at = NOW() WHERE uri = $2 OR id = $2`, [
      state,
      intentUri,
    ]);
  }
}

function mapIntentRow(row: Record<string, unknown>): IntentRecord {
  const uri = (row.uri ?? row.id) as RtnUri;
  return {
    id: uri,
    type: row.type as string,
    statement: row.statement as string,
    expressedBy: {
      uri: row.expressed_by_id as RtnUri,
      organizationUri: row.expressed_by_org as RtnUri,
    },
    priority: row.priority as IntentRecord['priority'],
    state: row.state as IntentRecord['state'],
    context: row.context as Record<string, unknown> | undefined,
    missionId: row.mission_id as RtnUri | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}
