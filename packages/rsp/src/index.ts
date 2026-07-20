import { buildRtnUri } from '@redface/shared';
import {
  RSP_PROTOCOL_VERSION,
  RSP_SDK_VERSION,
  RspEventTypesV1,
  RspLifecycleEvents,
  type RspEventType,
  isVersionedEventType,
  nextEventVersion,
} from './event-types.js';
import { buildEnvelope, formatPlaybackLine, type PlaybackEntry, type RspEnvelope } from './envelope.js';
import { RspPublisher, createRspPublisher, type RspPublishInput } from './publisher.js';

/** @deprecated Use RSP_PROTOCOL_VERSION */
export const RSP_VERSION = RSP_PROTOCOL_VERSION;

export const MVP_MISSION_TYPE = 'vehicle_recovery' as const;
export const MVP_INTENT_TYPE = 'vehicle_recovery' as const;

export const CAPABILITY_VEHICLE_RECOVERY = buildRtnUri('capability', 'vehicle-recovery');
export const CAPABILITY_GPS_TRACKING = buildRtnUri('capability', 'gps-tracking');

export {
  RSP_PROTOCOL_VERSION,
  RSP_SDK_VERSION,
  RspEventTypesV1,
  RspLifecycleEvents,
  type RspEventType,
  isVersionedEventType,
  nextEventVersion,
  buildEnvelope,
  envelopeToPublishInput,
  formatPlaybackLine,
  type PlaybackEntry,
  type RspEnvelope,
  RspPublisher,
  createRspPublisher,
  type RspPublishInput,
  buildRtnUri,
};
