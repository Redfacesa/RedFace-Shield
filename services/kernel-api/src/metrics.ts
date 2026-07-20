import type { RspEventRecord } from '@redface/shared';

const INTENT_EVENTS = new Set(['rsp.intent.declared', 'rsp.mission.created']);
const DECISION_EVENTS = new Set([
  'rsp.dispatch.accepted',
  'rsp.resource.allocated',
  'rsp.mission.state_changed',
]);

/** Seconds from intent/mission start to first operational decision (dispatch, allocation, activation). */
export function computeDecisionLatencySeconds(events: RspEventRecord[]): number | null {
  const sorted = [...events].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
  const intentEvent = sorted.find((e) => INTENT_EVENTS.has(e.type));
  if (!intentEvent) return null;

  const decisionEvent = sorted.find(
    (e) =>
      e.occurredAt.getTime() > intentEvent.occurredAt.getTime() &&
      (e.type === 'rsp.dispatch.accepted' || e.type === 'rsp.resource.allocated'),
  ) ?? sorted.find(
    (e) => e.occurredAt.getTime() > intentEvent.occurredAt.getTime() && DECISION_EVENTS.has(e.type),
  );

  if (!decisionEvent) return null;
  return Math.max(0, Math.round((decisionEvent.occurredAt.getTime() - intentEvent.occurredAt.getTime()) / 1000));
}

export function formatDecisionLatency(seconds: number | null): string {
  if (seconds === null) return '—';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}
