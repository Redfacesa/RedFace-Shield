/**
 * MVP: Vehicle Hijacking Recovery
 *
 * Success metric: one mission moves Intent → Mission → Events → History → Outcome
 * with every action verifiable and auditable.
 *
 * Axioms: 4, 5, 6, 10, 11, 13
 * Engines: Intent, Mission, Resource, Event, History, Policy
 */

import {
  CAPABILITY_GPS_TRACKING,
  CAPABILITY_VEHICLE_RECOVERY,
  MVP_INTENT_TYPE,
  MVP_MISSION_TYPE,
} from '@redface/rsp';
import type { IdentityRef } from '@redface/shared';
import { migrate } from '../db/migrate.js';
import { OperationalKernel } from '../index.js';

const ORG_INSURANCE = 'RF-ORG-INSURE-001';
const ORG_RECOVERY = 'RF-ORG-RECOVER-001';
const ORG_CONTROL = 'RF-ORG-CONTROL-001';
const ORG_FIELD = 'RF-ORG-FIELD-001';

const ACTOR_INSURANCE: IdentityRef = { id: 'RF-PER-INS-001', organizationId: ORG_INSURANCE };
const ACTOR_CONTROL: IdentityRef = { id: 'RF-PER-CTRL-001', organizationId: ORG_CONTROL };
const ACTOR_RECOVERY: IdentityRef = { id: 'RF-PER-REC-001', organizationId: ORG_RECOVERY };
const ACTOR_FIELD: IdentityRef = { id: 'RF-PER-FIELD-001', organizationId: ORG_FIELD };

async function main(): Promise<void> {
  console.log('=== RedFace MVP: Vehicle Hijacking Recovery ===\n');

  await migrate();
  const kernel = OperationalKernel.create();

  try {
    // Register capabilities (Axiom 10)
    const recoveryVehicle = await kernel.resource.register({
      type: 'vehicle',
      organizationId: ORG_RECOVERY,
      capabilityTypes: [CAPABILITY_VEHICLE_RECOVERY, CAPABILITY_GPS_TRACKING],
      trustScore: 0.92,
      location: { lat: -33.9249, lon: 18.4241 },
      metadata: { callsign: 'Recovery Unit 7' },
    });

    const fieldOfficer = await kernel.resource.register({
      type: 'officer',
      organizationId: ORG_FIELD,
      capabilityTypes: [CAPABILITY_VEHICLE_RECOVERY],
      trustScore: 0.88,
      location: { lat: -33.918, lon: 18.423 },
      metadata: { name: 'Officer Mbeki' },
    });

    console.log('Resources registered:', recoveryVehicle.id, fieldOfficer.id);

    // Intent (Axiom 4) — everything begins here
    const intent = await kernel.intent.declare({
      type: MVP_INTENT_TYPE,
      statement: 'Recover stolen Hilux CA 123 456 GP safely',
      expressedBy: ACTOR_INSURANCE,
      priority: 'critical',
      context: {
        vehiclePlate: 'CA 123 456 GP',
        vehicleMake: 'Toyota Hilux',
        stolenAt: new Date().toISOString(),
      },
    });
    console.log('\nIntent declared:', intent.id, '—', intent.statement);

    await kernel.intent.accept(intent.id, ACTOR_CONTROL);
    console.log('Intent accepted by control room');

    // Mission from intent
    const mission = await kernel.mission.createFromIntent({
      intentId: intent.id,
      type: MVP_MISSION_TYPE,
      title: 'Recover vehicle CA 123 456 GP',
      ownerId: ORG_RECOVERY,
      capabilitiesRequired: [CAPABILITY_VEHICLE_RECOVERY],
      priority: 'critical',
      actor: ACTOR_CONTROL,
    });
    console.log('\nMission created:', mission.id, '— state:', mission.state);

    await kernel.mission.addParticipant(mission.id, ORG_INSURANCE, 'requestor');
    await kernel.mission.addParticipant(mission.id, ORG_RECOVERY, 'lead_recovery');
    await kernel.mission.addParticipant(mission.id, ORG_FIELD, 'field_support');

    // Capability matching — not company names
    const matched = await kernel.resource.matchCapabilities({
      capabilities: [CAPABILITY_VEHICLE_RECOVERY],
      limit: 2,
    });
    console.log('\nCapability match:', matched.map((r) => `${r.id} (${r.type})`).join(', '));

    await kernel.mission.transition(mission.id, 'active', ACTOR_CONTROL, 'Recovery initiated');

    const allocVehicle = await kernel.resource.allocate(
      mission.id,
      recoveryVehicle.id,
      CAPABILITY_VEHICLE_RECOVERY,
      'primary_recovery',
      ACTOR_RECOVERY,
    );
    await kernel.resource.allocate(
      mission.id,
      fieldOfficer.id,
      CAPABILITY_VEHICLE_RECOVERY,
      'field_support',
      ACTOR_RECOVERY,
    );

    console.log('\nResources allocated:', allocVehicle.id);

    // Operational events on mission timeline
    await kernel.events.publish({
      type: 'rsp.dispatch.accepted',
      source: ACTOR_RECOVERY,
      missionId: mission.id,
      payload: { resourceId: recoveryVehicle.id, etaMinutes: 8 },
    });

    await kernel.events.publish({
      type: 'rsp.dispatch.en_route',
      source: ACTOR_FIELD,
      missionId: mission.id,
      payload: { resourceId: fieldOfficer.id },
    });

    await kernel.events.publish({
      type: 'rsp.vehicle.seen',
      source: ACTOR_RECOVERY,
      missionId: mission.id,
      payload: {
        plate: 'CA 123 456 GP',
        location: { lat: -33.89, lon: 18.51 },
        direction: 'north',
      },
    });

    await kernel.events.publish({
      type: 'rsp.dispatch.arrived',
      source: ACTOR_FIELD,
      missionId: mission.id,
      payload: { resourceId: fieldOfficer.id },
    });

    await kernel.events.publish({
      type: 'rsp.evidence.created',
      source: ACTOR_FIELD,
      missionId: mission.id,
      payload: {
        type: 'photograph',
        hash: 'sha256:demo-evidence-hash',
        description: 'Vehicle located in Milnerton industrial area',
      },
    });

    await kernel.events.publish({
      type: 'rsp.recovery.success',
      source: ACTOR_RECOVERY,
      missionId: mission.id,
      payload: { plate: 'CA 123 456 GP', location: 'Milnerton' },
    });

    // Complete mission with lessons (Axiom 13)
    const completed = await kernel.mission.complete({
      missionId: mission.id,
      actor: ACTOR_CONTROL,
      outcome: {
        result: 'success',
        summary: 'Vehicle recovered in 18 minutes. Evidence preserved.',
        metrics: { durationMinutes: 18, resourcesUsed: 2 },
      },
      lessons: {
        insight: 'GPS tracking + recovery unit coordination reduced response time',
        category: 'recovery_coordination',
      },
    });

    await kernel.resource.release(mission.id, recoveryVehicle.id, ACTOR_RECOVERY);
    await kernel.resource.release(mission.id, fieldOfficer.id, ACTOR_RECOVERY);

    const audit = await kernel.history.exportMissionAudit(mission.id);

    console.log('\n=== Mission Complete ===');
    console.log('Outcome:', completed.outcome?.summary);
    console.log('Intent state:', (await kernel.intent.get(intent.id)).state);
    console.log('Timeline events:', audit.events.length);
    console.log('\nEvent timeline:');
    for (const e of audit.events) {
      console.log(`  [${e.occurredAt.toISOString()}] ${e.type}`);
    }

    console.log('\n✓ Operational Loop validated: Intent → Mission → Events → History → Outcome');
  } finally {
    await kernel.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
