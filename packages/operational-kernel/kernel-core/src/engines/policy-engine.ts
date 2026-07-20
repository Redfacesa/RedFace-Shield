import { generateId, type IdentityRef, type PolicyDecision } from '@redface/shared';
import type { DbPool } from '../db/client.js';

/** Policy Engine — Axiom 3: Permission precedes execution. Default deny in production; MVP uses explicit allow rules. */

export interface PolicyContext {
  action: string;
  actor: IdentityRef;
  missionId?: string;
  metadata?: Record<string, unknown>;
}

export class PolicyEngine {
  constructor(
    private readonly db: DbPool,
    private readonly version = 'mvp-1.0',
  ) {}

  async evaluate(context: PolicyContext): Promise<PolicyDecision> {
    const allowed = this.evaluateRules(context);
    const rationale = allowed
      ? `Action '${context.action}' permitted for ${context.actor.organizationId}`
      : `Action '${context.action}' denied by default policy`;

    const decision: PolicyDecision = {
      allowed,
      rationale,
      policyVersion: this.version,
      decidedAt: new Date(),
    };

    await this.db.query(
      `INSERT INTO policy_decisions (id, action, actor_id, actor_org, allowed, rationale, policy_version, context)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        generateId('RF-POL'),
        context.action,
        context.actor.id,
        context.actor.organizationId,
        allowed,
        rationale,
        this.version,
        JSON.stringify(context.metadata ?? {}),
      ],
    );

    return decision;
  }

  async require(context: PolicyContext): Promise<void> {
    const decision = await this.evaluate(context);
    if (!decision.allowed) {
      throw new Error(`Policy denied: ${context.action} — ${decision.rationale}`);
    }
  }

  private evaluateRules(context: PolicyContext): boolean {
    const allowedActions = new Set([
      'intent.declare',
      'intent.accept',
      'mission.create',
      'mission.transition',
      'resource.allocate',
      'resource.release',
      'event.publish',
      'mission.complete',
    ]);

    if (context.actor.organizationId.startsWith('RF-ORG-VIEW-')) {
      return context.action === 'mission.read';
    }

    return allowedActions.has(context.action);
  }
}
