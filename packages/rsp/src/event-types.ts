/** RSP protocol and SDK version — independent from kernel engine versions */

export const RSP_PROTOCOL_VERSION = '1.0.0' as const;
export const RSP_SDK_VERSION = '1.0.0' as const;

/**
 * Versioned event types — immutable once released.
 * Never change incompatibly; add .v2 instead.
 */
export const RspEventTypesV1 = {
  cameraMotionDetected: 'rsp.camera.motion.detected.v1',
  gpsLocationUpdated: 'rsp.gps.location.updated.v1',
  guardCheckin: 'rsp.guard.checkin.v1',
  alarmPanic: 'rsp.alarm.panic.v1',
  evidenceUploaded: 'rsp.evidence.uploaded.v1',
  dispatchAcknowledged: 'rsp.dispatch.acknowledged.v1',
} as const;

/** Legacy kernel lifecycle events — supported, prefer versioned types for new integrations */
export const RspLifecycleEvents = {
  intentDeclared: 'rsp.intent.declared',
  intentAccepted: 'rsp.intent.accepted',
  missionCreated: 'rsp.mission.created',
  missionStateChanged: 'rsp.mission.state_changed',
  resourceAllocated: 'rsp.resource.allocated',
  resourceReleased: 'rsp.resource.released',
  dispatchAccepted: 'rsp.dispatch.accepted',
  dispatchEnRoute: 'rsp.dispatch.en_route',
  dispatchArrived: 'rsp.dispatch.arrived',
  vehicleSeen: 'rsp.vehicle.seen',
  recoverySuccess: 'rsp.recovery.success',
  evidenceCreated: 'rsp.evidence.created',
  missionCompleted: 'rsp.mission.completed',
  eventSuperseded: 'rsp.event.superseded',
} as const;

export type RspEventTypeV1 = (typeof RspEventTypesV1)[keyof typeof RspEventTypesV1];
export type RspLifecycleEventType = (typeof RspLifecycleEvents)[keyof typeof RspLifecycleEvents];

/** @deprecated Use RspEventTypesV1 + RspLifecycleEvents */
export type RspEventType = RspLifecycleEventType | RspEventTypeV1 | string;

/** Returns true if type follows versioned naming convention */
export function isVersionedEventType(type: string): boolean {
  return /\.v\d+$/.test(type);
}

/** Suggest next version for an event family */
export function nextEventVersion(baseType: string, currentVersion: number): string {
  const normalized = baseType.replace(/\.v\d+$/, '');
  return `${normalized}.v${currentVersion + 1}`;
}
