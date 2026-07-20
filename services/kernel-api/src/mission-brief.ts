import type { OperationalKernel } from '@redface/kernel-core';
import type { RspEventRecord, RtnUri } from '@redface/shared';
import { eventDisplayLabel } from './event-labels.js';

export interface MissionBrief {
  missionId: RtnUri;
  title: string;
  objective: string;
  priority: string;
  state: string;
  currentIntelligence: string[];
  assignedResources: Array<{ label: string; role: string; type: string }>;
  participants: Array<{ organization: string; role: string }>;
  knownRisks: string[];
  successCriteria: string[];
}

const SUCCESS_CRITERIA: Record<string, string[]> = {
  vehicle_recovery: [
    'Vehicle recovered safely',
    'No injuries to personnel or public',
    'Evidence captured and preserved',
  ],
  default: ['Objective achieved safely', 'All participants accounted for', 'Operational record complete'],
};

const RISK_HINTS: Record<string, string[]> = {
  vehicle_recovery: [
    'Possible armed suspects near last known location',
    'Dense traffic may delay response',
    'Residential and school zones require caution',
  ],
  default: ['Operational conditions may change during execution'],
};

function intelligenceFromEvents(events: RspEventRecord[]): string[] {
  const lines: string[] = [];
  for (const event of events) {
    if (event.type === 'rsp.vehicle.seen') {
      const plate = event.payload.plate as string | undefined;
      const loc = event.payload.location as { lat?: number; lon?: number } | undefined;
      lines.push(
        plate
          ? `Vehicle ${plate} last detected${loc ? ` (${loc.lat?.toFixed(3)}, ${loc.lon?.toFixed(3)})` : ''}`
          : 'Vehicle last detected by tracking unit',
      );
    }
    if (event.type === 'rsp.camera.motion.detected.v1') {
      lines.push('Camera motion alert in operational zone');
    }
    if (event.type === 'rsp.dispatch.accepted') {
      const eta = event.payload.etaMinutes as number | undefined;
      if (eta) lines.push(`Recovery unit dispatched — ETA ${eta} minutes`);
    }
  }
  return lines.length ? lines : ['Awaiting field intelligence updates'];
}

export async function getMissionBrief(kernel: OperationalKernel, missionUri: RtnUri): Promise<MissionBrief> {
  const mission = await kernel.mission.get(missionUri);
  const intent = await kernel.intent.get(mission.intentId);
  const participants = await kernel.mission.listParticipants(missionUri);
  const timeline = await kernel.history.getMissionTimeline(missionUri);
  const allocations = await kernel.resource.listAllocationsForMission(missionUri);

  const assignedResources = await Promise.all(
    allocations.map(async (alloc) => {
      const resource = await kernel.resource.get(alloc.resourceId);
      const callsign = resource.metadata?.callsign as string | undefined;
      const label = callsign ?? resource.id.split('/').pop() ?? resource.type;
      return { label, role: alloc.role, type: resource.type };
    }),
  );

  const criteria = SUCCESS_CRITERIA[mission.type] ?? SUCCESS_CRITERIA.default;
  const risks = RISK_HINTS[mission.type] ?? RISK_HINTS.default;

  return {
    missionId: mission.id,
    title: mission.title,
    objective: intent.statement,
    priority: mission.priority,
    state: mission.state,
    currentIntelligence: intelligenceFromEvents(timeline),
    assignedResources,
    participants: participants.map((p) => ({
      organization: p.organizationUri.split('/').pop() ?? p.organizationUri,
      role: p.role,
    })),
    knownRisks: risks,
    successCriteria: criteria,
  };
}

export function timelineDisplayEntries(timeline: RspEventRecord[]): Array<{ time: string; label: string; type: string }> {
  return timeline.map((event) => ({
    time: event.occurredAt.toISOString().slice(11, 19),
    label: eventDisplayLabel(event.type),
    type: event.type,
  }));
}
