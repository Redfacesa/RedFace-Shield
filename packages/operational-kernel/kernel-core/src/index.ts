import type { DbPool } from './db/client.js';
import { createPool } from './db/client.js';
import { EventEngine, HistoryEngine } from './engines/event-engine.js';
import { IntentEngine } from './engines/intent-engine.js';
import { MissionEngine } from './engines/mission-engine.js';
import { PolicyEngine } from './engines/policy-engine.js';
import { ResourceEngine } from './engines/resource-engine.js';

/** Operational Kernel — composes engines. Generic, not security-specific. */

export class OperationalKernel {
  readonly policy: PolicyEngine;
  readonly events: EventEngine;
  readonly history: HistoryEngine;
  readonly intent: IntentEngine;
  readonly mission: MissionEngine;
  readonly resource: ResourceEngine;

  constructor(private readonly db: DbPool) {
    this.policy = new PolicyEngine(db);
    this.events = new EventEngine(db, this.policy);
    this.history = new HistoryEngine(this.events);
    this.intent = new IntentEngine(db, this.policy, this.events);
    this.mission = new MissionEngine(db, this.policy, this.events, this.intent);
    this.resource = new ResourceEngine(db, this.policy, this.events);
  }

  static create(connectionString?: string): OperationalKernel {
    return new OperationalKernel(createPool(connectionString));
  }

  async close(): Promise<void> {
    await this.db.end();
  }
}

export * from './engines/event-engine.js';
export * from './engines/intent-engine.js';
export * from './engines/mission-engine.js';
export * from './engines/policy-engine.js';
export * from './engines/resource-engine.js';
export { createPool } from './db/client.js';
export { migrate } from './db/migrate.js';
