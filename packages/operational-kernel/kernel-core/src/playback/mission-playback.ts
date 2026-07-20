import type { RspEventRecord, RtnUri } from '@redface/shared';
import { formatPlaybackLine, type PlaybackEntry } from '@redface/rsp';
import type { EventEngine } from '../engines/event-engine.js';

const PLAYBACK_LABELS: Record<string, string> = {
  'rsp.intent.declared': 'Intent declared',
  'rsp.intent.accepted': 'Intent accepted',
  'rsp.mission.created': 'Mission created',
  'rsp.mission.state_changed': 'Mission state changed',
  'rsp.resource.allocated': 'Resources matched',
  'rsp.resource.released': 'Resource released',
  'rsp.dispatch.accepted': 'Vehicle dispatched',
  'rsp.dispatch.en_route': 'En route',
  'rsp.dispatch.arrived': 'Officer arrived',
  'rsp.dispatch.acknowledged.v1': 'Dispatch acknowledged',
  'rsp.vehicle.seen': 'Vehicle located',
  'rsp.camera.motion.detected.v1': 'Camera detection',
  'rsp.gps.location.updated.v1': 'GPS update',
  'rsp.guard.checkin.v1': 'Guard check-in',
  'rsp.alarm.panic.v1': 'Panic alarm',
  'rsp.evidence.created': 'Evidence uploaded',
  'rsp.evidence.uploaded.v1': 'Evidence uploaded',
  'rsp.recovery.success': 'Vehicle recovered',
  'rsp.mission.completed': 'Mission closed',
};

export interface MissionPlayback {
  missionUri: RtnUri;
  entries: PlaybackEntry[];
  lines: string[];
  durationMs: number;
}

function formatTime(date: Date): string {
  return date.toISOString().slice(11, 19);
}

function labelForEvent(event: RspEventRecord): string {
  return PLAYBACK_LABELS[event.type] ?? event.type.replace(/^rsp\./, '').replace(/\./g, ' ');
}

export function buildPlaybackFromEvents(missionUri: RtnUri, events: RspEventRecord[]): MissionPlayback {
  const sorted = [...events].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
  const entries: PlaybackEntry[] = sorted.map((event) => ({
    timestamp: event.occurredAt.toISOString(),
    time: formatTime(event.occurredAt),
    label: labelForEvent(event),
    type: event.type,
    eventId: event.id,
    source: event.source,
    payload: event.payload,
  }));

  const first = sorted[0]?.occurredAt.getTime() ?? 0;
  const last = sorted[sorted.length - 1]?.occurredAt.getTime() ?? first;

  return {
    missionUri,
    entries,
    lines: entries.map(formatPlaybackLine),
    durationMs: last - first,
  };
}

export class MissionPlaybackEngine {
  constructor(private readonly events: EventEngine) {}

  async build(missionUri: RtnUri): Promise<MissionPlayback> {
    const timeline = await this.events.listByMission(missionUri);
    return buildPlaybackFromEvents(missionUri, timeline);
  }
}
