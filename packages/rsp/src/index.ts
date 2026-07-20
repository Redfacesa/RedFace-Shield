import type { IdentityRef } from '@redface/shared';

/** RSP event envelope — Volume 3. Events are immutable (Axiom 6). */

export const RSP_VERSION = '1.0-draft' as const;

export type RspEventType =
  | 'rsp.intent.declared'
  | 'rsp.intent.accepted'
  | 'rsp.mission.created'
  | 'rsp.mission.state_changed'
  | 'rsp.resource.allocated'
  | 'rsp.resource.released'
  | 'rsp.dispatch.accepted'
  | 'rsp.dispatch.en_route'
  | 'rsp.dispatch.arrived'
  | 'rsp.vehicle.seen'
  | 'rsp.recovery.success'
  | 'rsp.evidence.created'
  | 'rsp.mission.completed'
  | 'rsp.event.superseded';

export interface RspEnvelope {
  version: typeof RSP_VERSION;
  event: {
    id: string;
    type: RspEventType;
    occurredAt: string;
    source: IdentityRef;
    missionId?: string;
    intentId?: string;
    correlationId?: string;
    payload: Record<string, unknown>;
    signature?: string;
  };
}

export function buildEnvelope(
  event: RspEnvelope['event'],
): RspEnvelope {
  return { version: RSP_VERSION, event };
}

/** MVP hijacking recovery — canonical event payloads */
export const MVP_MISSION_TYPE = 'vehicle_recovery' as const;
export const MVP_INTENT_TYPE = 'vehicle_recovery' as const;

export const CAPABILITY_VEHICLE_RECOVERY = 'vehicle_recovery';
export const CAPABILITY_ARMED_RESPONSE = 'armed_response';
export const CAPABILITY_GPS_TRACKING = 'gps_tracking';
