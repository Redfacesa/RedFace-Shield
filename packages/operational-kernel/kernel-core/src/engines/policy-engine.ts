import { buildRtnUri, generateLocalId, type IdentityRef, type PolicyDecision, type RtnUri } from '@redface/shared';
import type { DbPool } from '../db/client.js';

/** Policy Engine — Axiom 3: Permission precedes execution. Authorization is separate from identity and auth. */

export interface PolicyContext {
  action: string;
  actor: IdentityRef;
  missionUri?: RtnUri;
  metadata?: Record<string, unknown>;
}

export class PolicyEngine {
  constructor(
    private readonly db: DbPool,
    private readonly version = 'mvp-2.0',
  ) {}

  async evaluate(context: PolicyContext): Promise<PolicyDecision> {
    const allowed = this.evaluateRules(context);
    const rationale = allowed
      ? `Action '${context.action}' permitted for ${context.actor.organizationUri}`
      : `Action '${context.action}' denied by default policy`;

    const decision: PolicyDecision = {
      allowed,
      rationale,
      policyVersion: this.version,
      decidedAt: new Date(),
    };

    const polUri = buildRtnUri('document', generateLocalId('pol'));
    await this.db.query(
      `INSERT INTO policy_decisions (id, action, actor_id, actor_org, allowed, rationale, policy_version, context)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        polUri,
        context.action,
        context.actor.uri,
        context.actor.organizationUri,
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
    if (context.action === 'mission.read') {
      return context.actor.organizationUri.startsWith('rtn://organization/');
    }

    const allowedActions = new Set([
      'intent.declare',
      'intent.accept',
      'mission.create',
      'mission.transition',
      'resource.allocate',
      'resource.release',
      'event.publish',
      'mission.complete',
      'identity.register',
      'organization.register',
      'capability.register',
      'trust.verify',
    ]);

    return allowedActions.has(context.action);
  }
}
