import type { DbPool } from './db/client.js';
import { createPool } from './db/client.js';
import { AttestationEngine } from './engines/attestation-engine.js';
import { CapabilityEngine } from './engines/capability-engine.js';
import { EventEngine, HistoryEngine } from './engines/event-engine.js';
import { IdentityEngine } from './engines/identity-engine.js';
import { IntentEngine } from './engines/intent-engine.js';
import { MissionEngine } from './engines/mission-engine.js';
import { OrganizationEngine } from './engines/organization-engine.js';
import { OwnershipEngine } from './engines/ownership-engine.js';
import { PolicyEngine } from './engines/policy-engine.js';
import { ResourceEngine } from './engines/resource-engine.js';
import { TrustEngine } from './engines/trust-engine.js';

/** Operational Kernel — Platform v0.1 */

export class OperationalKernel {
  readonly identity: IdentityEngine;
  readonly organization: OrganizationEngine;
  readonly ownership: OwnershipEngine;
  readonly capability: CapabilityEngine;
  readonly trust: TrustEngine;
  readonly attestation: AttestationEngine;
  readonly policy: PolicyEngine;
  readonly events: EventEngine;
  readonly history: HistoryEngine;
  readonly intent: IntentEngine;
  readonly mission: MissionEngine;
  readonly resource: ResourceEngine;

  constructor(private readonly db: DbPool) {
    this.identity = new IdentityEngine(db);
    this.organization = new OrganizationEngine(db, this.identity);
    this.ownership = new OwnershipEngine(db, this.identity);
    this.capability = new CapabilityEngine(db, this.identity, this.organization);
    this.trust = new TrustEngine(db, this.identity);
    this.attestation = new AttestationEngine(db, this.identity);
    this.policy = new PolicyEngine(db);
    this.events = new EventEngine(db, this.policy);
    this.history = new HistoryEngine(this.events);
    this.intent = new IntentEngine(db, this.policy, this.events, this.identity);
    this.mission = new MissionEngine(db, this.policy, this.events, this.intent, this.identity);
    this.resource = new ResourceEngine(db, this.policy, this.events, this.identity, this.capability);
  }

  static create(connectionString?: string): OperationalKernel {
    return new OperationalKernel(createPool(connectionString));
  }

  async ping(): Promise<void> {
    await this.db.query('SELECT 1');
  }

  async close(): Promise<void> {
    await this.db.end();
  }
}

export { createPool } from './db/client.js';
