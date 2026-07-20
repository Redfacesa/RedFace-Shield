/** Presentation labels for API responses — eventually moves to RSP event display metadata. */

const LABELS: Record<string, string> = {
  'rsp.intent.declared': 'Intent declared',
  'rsp.intent.accepted': 'Intent accepted',
  'rsp.mission.created': 'Mission created',
  'rsp.mission.state_changed': 'Mission state changed',
  'rsp.resource.allocated': 'Resources matched',
  'rsp.resource.released': 'Resource released',
  'rsp.dispatch.accepted': 'Vehicle dispatched',
  'rsp.dispatch.en_route': 'En route',
  'rsp.dispatch.arrived': 'Officer arrived',
  'rsp.vehicle.seen': 'Vehicle located',
  'rsp.camera.motion.detected.v1': 'Camera detection',
  'rsp.gps.location.updated.v1': 'GPS update',
  'rsp.evidence.created': 'Evidence uploaded',
  'rsp.recovery.success': 'Vehicle recovered',
  'rsp.mission.completed': 'Mission closed',
};

export function eventDisplayLabel(type: string): string {
  return LABELS[type] ?? type.replace(/^rsp\./, '').replace(/\./g, ' ');
}

export function missionLocalId(missionUri: string): string {
  return missionUri.split('/').pop() ?? missionUri;
}

export function playbackId(missionUri: string): string {
  const local = missionLocalId(missionUri);
  const numeric = local.replace(/\D/g, '').slice(-6).padStart(6, '0');
  return `RF-PLAY-${numeric}`;
}

export function reportId(missionUri: string): string {
  const local = missionLocalId(missionUri);
  const numeric = local.replace(/\D/g, '').slice(-6).padStart(6, '0');
  return `RF-RPT-${numeric}`;
}
