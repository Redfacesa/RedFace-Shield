import type { IdentityRef, RtnUri } from '@redface/shared';
import { RSP_PROTOCOL_VERSION } from './event-types.js';

export interface RspEnvelope {
  rspVersion: typeof RSP_PROTOCOL_VERSION;
  type: string;
  missionUri?: RtnUri;
  intentUri?: RtnUri;
  source: IdentityRef;
  payload: Record<string, unknown>;
  occurredAt: string;
  signature?: string;
}

export interface BuildEnvelopeInput {
  type: string;
  source: IdentityRef;
  missionUri?: RtnUri;
  intentUri?: RtnUri;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
  signature?: string;
}

export function buildEnvelope(input: BuildEnvelopeInput): RspEnvelope {
  return {
    rspVersion: RSP_PROTOCOL_VERSION,
    type: input.type,
    missionUri: input.missionUri,
    intentUri: input.intentUri,
    source: input.source,
    payload: input.payload ?? {},
    occurredAt: (input.occurredAt ?? new Date()).toISOString(),
    signature: input.signature,
  };
}

export function envelopeToPublishInput(envelope: RspEnvelope) {
  return {
    type: envelope.type,
    source: envelope.source,
    missionUri: envelope.missionUri,
    intentUri: envelope.intentUri,
    payload: envelope.payload,
    occurredAt: new Date(envelope.occurredAt),
    signature: envelope.signature,
  };
}

export interface PlaybackEntry {
  timestamp: string;
  time: string;
  label: string;
  type: string;
  eventId: RtnUri;
  source: IdentityRef;
  payload: Record<string, unknown>;
}

export function formatPlaybackLine(entry: PlaybackEntry): string {
  return `${entry.time}  ${entry.label}`;
}
