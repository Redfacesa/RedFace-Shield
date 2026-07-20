const API = '/api';

export interface DashboardData {
  stats: {
    activeMissions: number;
    availableGuards: number;
    vehicles: number;
    camerasOnline: number;
    alertsToday: number;
    mciPercent: number;
  };
  missions: MissionSummary[];
  recentEvents: EventSummary[];
  resources: ResourceSummary[];
}

export interface MissionSummary {
  id: string;
  title: string;
  state: string;
  type: string;
  priority: string;
  updatedAt: string;
  outcome?: { summary: string; result: string };
}

export interface EventSummary {
  id: string;
  type: string;
  missionId?: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface ResourceSummary {
  id: string;
  type: string;
  state: string;
  location?: { lat: number; lon: number };
  metadata?: Record<string, unknown>;
}

export interface MissionDetail {
  mission: MissionSummary & { intentId: string; ownerUri: string; capabilitiesRequired: string[] };
  timeline: EventSummary[];
  participants: Array<{ organizationUri: string; role: string }>;
  playback?: { entries: Array<{ time: string; label: string }>; lines: string[] };
  attestations: Array<{ statement: string; attestationType: string }>;
}

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch(`${API}/control-room/dashboard`);
  if (!res.ok) throw new Error('Failed to load dashboard');
  return res.json();
}

export async function fetchMission(uri: string, playback = false): Promise<MissionDetail> {
  const params = new URLSearchParams({ uri, ...(playback ? { playback: 'true' } : {}) });
  const res = await fetch(`${API}/missions?${params}`);
  if (!res.ok) throw new Error('Mission not found');
  return res.json();
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function eventLabel(type: string): string {
  const map: Record<string, string> = {
    'rsp.intent.declared': 'Intent declared',
    'rsp.mission.created': 'Mission created',
    'rsp.mission.state_changed': 'Mission state changed',
    'rsp.resource.allocated': 'Resources matched',
    'rsp.dispatch.accepted': 'Vehicle dispatched',
    'rsp.dispatch.en_route': 'En route',
    'rsp.dispatch.arrived': 'Officer arrived',
    'rsp.vehicle.seen': 'Vehicle located',
    'rsp.evidence.created': 'Evidence uploaded',
    'rsp.recovery.success': 'Recovered',
    'rsp.mission.completed': 'Mission closed',
    'rsp.camera.motion.detected.v1': 'Camera detection',
    'rsp.gps.location.updated.v1': 'GPS update',
  };
  return map[type] ?? type.replace(/^rsp\./, '').replace(/\./g, ' ');
}
