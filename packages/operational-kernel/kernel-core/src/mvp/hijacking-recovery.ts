import { buildRtnUri } from '@redface/shared';
import { MVP_INTENT_TYPE, MVP_MISSION_TYPE } from '@redface/rsp';
import type { IdentityRef, RtnUri } from '@redface/shared';
import { migrate } from '../db/migrate.js';
import { OperationalKernel } from '../index.js';

/** Platform v0.1 MVP — ownership, stewardship, attestation, derived trust, operational loop */

const ORG_INSURANCE = buildRtnUri('organization', 'santam-demo');
const ORG_RECOVERY = buildRtnUri('organization', 'recovery-demo');
const ORG_CONTROL = buildRtnUri('organization', 'control-demo');
const ORG_FIELD = buildRtnUri('organization', 'field-demo');
const ORG_MALL = buildRtnUri('organization', 'mall-demo');

const CAP_VEHICLE_RECOVERY = buildRtnUri('capability', 'vehicle-recovery');
const CAP_GPS_TRACKING = buildRtnUri('capability', 'gps-tracking');

const ACTOR_INSURANCE: IdentityRef = {
  uri: buildRtnUri('person', 'insurance-operator-001'),
  organizationUri: ORG_INSURANCE,
};
const ACTOR_CONTROL: IdentityRef = {
  uri: buildRtnUri('person', 'control-operator-001'),
  organizationUri: ORG_CONTROL,
};
const ACTOR_RECOVERY: IdentityRef = {
  uri: buildRtnUri('person', 'recovery-dispatcher-001'),
  organizationUri: ORG_RECOVERY,
};
const ACTOR_FIELD: IdentityRef = {
  uri: buildRtnUri('guard', '284729'),
  organizationUri: ORG_FIELD,
};

async function main(): Promise<void> {
  console.log('=== RedFace Demonstration A: Vehicle Hijacking Recovery ===\n');

  await migrate();
  const { kernel, missionUri } = await runVehicleRecoveryDemo();

  try {
    const playback = await kernel.history.buildPlayback(missionUri);
    console.log('\n--- Mission Playback (preview) ---');
    for (const line of playback.lines.slice(0, 5)) {
      console.log(line);
    }
    console.log(`... ${playback.lines.length} events total — run npm run playback:demo for full timeline`);
  } finally {
    await kernel.close();
  }
}

export interface VehicleRecoveryDemoResult {
  kernel: OperationalKernel;
  missionUri: RtnUri;
}

export async function runVehicleRecoveryDemo(options?: { quiet?: boolean }): Promise<VehicleRecoveryDemoResult> {
  const log = options?.quiet ? () => {} : console.log.bind(console);
  const kernel = OperationalKernel.create();

  // 1. Organizations (Organization Engine)
    for (const [uri, type, name] of [
      [ORG_INSURANCE, 'insurance', 'Santam Demo'],
      [ORG_RECOVERY, 'recovery', 'Recovery Demo'],
      [ORG_CONTROL, 'private_company', 'Control Room Demo'],
      [ORG_FIELD, 'private_company', 'Field Ops Demo'],
      [ORG_MALL, 'property', 'Shopping Centre Demo'],
    ] as const) {
      await kernel.organization.register({
        localId: uri.split('/').pop()!,
        orgType: type,
        displayName: name,
      });
    }

    // Register actors in Identity Engine
    for (const actor of [ACTOR_INSURANCE, ACTOR_CONTROL, ACTOR_RECOVERY, ACTOR_FIELD]) {
      await kernel.identity.register({
        kind: actor.uri.includes('/guard/') ? 'guard' : 'person',
        localId: actor.uri.split('/').pop()!,
        displayName: actor.uri,
        metadata: { organizationUri: actor.organizationUri },
      });
    }

    // 2. Capabilities (Capability Engine — first-class)
    await kernel.capability.register({
      slug: 'vehicle-recovery',
      name: 'Vehicle Recovery',
      requirements: [
        { type: 'certified_driver', description: 'PSIRA certified driver', required: true },
        { type: 'tow_vehicle', description: 'Recovery vehicle equipped', required: true },
        { type: 'insurance', description: 'Valid liability insurance', required: true },
      ],
    });
    await kernel.capability.register({
      slug: 'gps-tracking',
      name: 'GPS Tracking',
      requirements: [{ type: 'tracker', description: 'Active GPS tracker', required: true }],
    });

    await kernel.capability.organizationProvides(ORG_RECOVERY, CAP_VEHICLE_RECOVERY, true);
    await kernel.capability.organizationProvides(ORG_RECOVERY, CAP_GPS_TRACKING, true);
    await kernel.capability.organizationProvides(ORG_FIELD, CAP_VEHICLE_RECOVERY, true);

    // Trust documents (Identity Engine — not auth)
    await kernel.identity.attachDocument({
      identityUri: ORG_RECOVERY,
      documentType: 'license',
      payload: { psira: 'PSIRA-12345', validUntil: '2027-12-31' },
    });
    await kernel.trust.recordVerification({
      subjectUri: ORG_RECOVERY,
      verificationType: 'organization_license',
      status: 'verified',
      attestedByUri: ORG_CONTROL,
    });

    // 3. Resources
    const recoveryVehicle = await kernel.resource.register({
      type: 'vehicle',
      organizationUri: ORG_RECOVERY,
      capabilityUris: [CAP_VEHICLE_RECOVERY, CAP_GPS_TRACKING],
      localId: 'CPT-TRK-001',
      location: { lat: -33.9249, lon: 18.4241 },
      metadata: { callsign: 'Recovery Unit 7' },
    });

    const fieldOfficer = await kernel.resource.register({
      type: 'guard',
      organizationUri: ORG_FIELD,
      capabilityUris: [CAP_VEHICLE_RECOVERY],
      localId: '284729',
      location: { lat: -33.918, lon: 18.423 },
    });

    log('Resources:', recoveryVehicle.id, fieldOfficer.id);

    // Ownership & stewardship — camera owned by mall, operated by control room
    const camera = await kernel.resource.register({
      type: 'camera',
      organizationUri: ORG_MALL,
      capabilityUris: [],
      localId: 'CAM-PARKING-12',
      location: { lat: -33.92, lon: 18.42 },
      metadata: { zone: 'Parking Level B2' },
    });
    await kernel.ownership.assignOwner(camera.id, ORG_MALL);
    await kernel.ownership.assignSteward(camera.id, ORG_CONTROL, 'operator');
    await kernel.ownership.assignSteward(camera.id, ORG_CONTROL, 'viewer');
    await kernel.ownership.assignSteward(camera.id, ORG_INSURANCE, 'insurer');

    log('Camera owner:', (await kernel.ownership.getOwner(camera.id)).ownerUri);
    log('Camera stewards:', (await kernel.ownership.listStewards(camera.id)).map((s) => s.role).join(', '));

    // 4. Intent → Mission (Operational Loop)
    const intent = await kernel.intent.declare({
      type: MVP_INTENT_TYPE,
      statement: 'Recover stolen Hilux CA 123 456 GP safely',
      expressedBy: ACTOR_INSURANCE,
      priority: 'critical',
      localId: 'CPT-2026-HIJACK-001',
      context: { plate: 'CA 123 456 GP', make: 'Toyota Hilux' },
    });
    log('\nIntent:', intent.id);

    await kernel.intent.accept(intent.id, ACTOR_CONTROL);

    const mission = await kernel.mission.createFromIntent({
      intentUri: intent.id,
      type: MVP_MISSION_TYPE,
      title: 'Recover vehicle CA 123 456 GP',
      ownerUri: ORG_RECOVERY,
      capabilitiesRequired: [CAP_VEHICLE_RECOVERY],
      priority: 'critical',
      actor: ACTOR_CONTROL,
      localId: 'CPT-2026-000001',
    });
    log('Mission:', mission.id);

    await kernel.ownership.assignSteward(mission.id, ORG_CONTROL, 'mission_steward');

    await kernel.mission.addParticipant(mission.id, ORG_INSURANCE, 'requestor');
    await kernel.mission.addParticipant(mission.id, ORG_RECOVERY, 'lead_recovery');
    await kernel.mission.addParticipant(mission.id, ORG_FIELD, 'field_support');

    const providers = await kernel.capability.matchProviders([CAP_VEHICLE_RECOVERY]);
    log('Capability providers:', providers.join(', '));

    const matched = await kernel.resource.matchByCapabilities([CAP_VEHICLE_RECOVERY]);
    log('Matched resources:', matched.map((r) => r.id).join(', '));

    await kernel.mission.transition(mission.id, 'active', ACTOR_CONTROL, 'Recovery initiated');

    await kernel.resource.allocate(mission.id, recoveryVehicle.id, CAP_VEHICLE_RECOVERY, 'primary', ACTOR_RECOVERY);
    await kernel.resource.allocate(mission.id, fieldOfficer.id, CAP_VEHICLE_RECOVERY, 'support', ACTOR_RECOVERY);

    await publishTimeline(kernel, mission.id, ACTOR_RECOVERY, ACTOR_FIELD);

    const evidenceUri = buildRtnUri('document', 'evidence-photo-demo');
    await kernel.identity.register({
      kind: 'document',
      localId: 'evidence-photo-demo',
      displayName: 'Field recovery photograph',
      metadata: { hash: 'sha256:demo', cameraUri: camera.id },
    });
    await kernel.ownership.assignSteward(evidenceUri, ACTOR_FIELD.uri, 'evidence_custodian');
    await kernel.attestation.attest({
      subjectUri: evidenceUri,
      attestedByUri: ACTOR_FIELD.uri,
      attestationType: 'evidence_custody',
      statement: 'I stand behind the integrity of field evidence captured during recovery',
      evidence: { hash: 'sha256:demo', cameraUri: camera.id },
    });
    await kernel.attestation.attest({
      subjectUri: mission.id,
      attestedByUri: ACTOR_CONTROL.uri,
      attestationType: 'mission_outcome',
      statement: 'Mission outcome verified by control room supervisor',
    });

    const completed = await kernel.mission.complete({
      missionUri: mission.id,
      actor: ACTOR_CONTROL,
      outcome: {
        result: 'success',
        summary: 'Vehicle recovered in 18 minutes. Evidence preserved.',
        metrics: { durationMinutes: 18 },
      },
      lessons: { insight: 'Capability-based matching reduced dispatch time' },
    });

    await kernel.resource.release(mission.id, recoveryVehicle.id, ACTOR_RECOVERY);
    await kernel.resource.release(mission.id, fieldOfficer.id, ACTOR_RECOVERY);

    const audit = await kernel.history.exportMissionAudit(mission.id);
    const trust = await kernel.trust.deriveTrust(ORG_RECOVERY);

    log('\n=== Complete ===');
    log('Outcome:', completed.outcome?.summary);
    log('Events:', audit.events.length);
    log('Derived trust (not stored):', trust.score, trust.components);
    log('Attestations on mission:', (await kernel.attestation.listBySubject(mission.id)).length);

    log('\n✓ Demonstration A: Ownership · Stewardship · Attestation · Capabilities · Derived Trust · Operational Loop');

    return { kernel, missionUri: mission.id };
}

async function publishTimeline(
  kernel: OperationalKernel,
  missionUri: RtnUri,
  recovery: IdentityRef,
  field: IdentityRef,
): Promise<void> {
  const steps = [
    { type: 'rsp.dispatch.accepted' as const, source: recovery, payload: { etaMinutes: 8 } },
    { type: 'rsp.dispatch.en_route' as const, source: field, payload: {} },
    {
      type: 'rsp.vehicle.seen' as const,
      source: recovery,
      payload: { plate: 'CA 123 456 GP', location: { lat: -33.89, lon: 18.51 } },
    },
    { type: 'rsp.dispatch.arrived' as const, source: field, payload: {} },
    {
      type: 'rsp.evidence.created' as const,
      source: field,
      payload: { hash: 'sha256:demo', type: 'photograph' },
    },
    { type: 'rsp.recovery.success' as const, source: recovery, payload: { plate: 'CA 123 456 GP' } },
  ];

  for (const step of steps) {
    await kernel.events.publish({ ...step, missionUri });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
