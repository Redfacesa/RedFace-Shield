import type { IdentityRef, RspEventRecord, RtnUri } from '@redface/shared';
import { buildEnvelope, envelopeToPublishInput, type RspEnvelope } from './envelope.js';
import { RSP_SDK_VERSION } from './event-types.js';

export interface RspPublishInput {
  type: string;
  source: IdentityRef;
  mission?: RtnUri;
  intent?: RtnUri;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
  signature?: string;
}

export type RspPublishFn = (input: {
  type: string;
  source: IdentityRef;
  missionUri?: RtnUri;
  intentUri?: RtnUri;
  payload: Record<string, unknown>;
  occurredAt?: Date;
  signature?: string;
}) => Promise<RspEventRecord>;

export interface RspPublisherOptions {
  /** Kernel API base URL — posts to POST /rsp/events */
  baseUrl?: string;
  /** In-process publish (simulator, tests, MVP scripts) */
  publish?: RspPublishFn;
}

/**
 * RSP SDK — single publish path for adapters, simulators, and integrations.
 *
 * @example
 * await rsp.publish({
 *   type: 'rsp.camera.motion.detected.v1',
 *   mission: 'rtn://mission/CPT-2026-000001',
 *   source: { uri: 'rtn://resource/CAM-1', organizationUri: 'rtn://organization/mall' },
 *   payload: { zone: 'B2' },
 * });
 */
export class RspPublisher {
  readonly sdkVersion = RSP_SDK_VERSION;

  constructor(private readonly options: RspPublisherOptions) {
    if (!options.baseUrl && !options.publish) {
      throw new Error('RspPublisher requires baseUrl or publish function');
    }
  }

  async publish(input: RspPublishInput): Promise<RspEventRecord> {
    const envelope = buildEnvelope({
      type: input.type,
      source: input.source,
      missionUri: input.mission,
      intentUri: input.intent,
      payload: input.payload,
      occurredAt: input.occurredAt,
      signature: input.signature,
    });

    return this.publishEnvelope(envelope);
  }

  async publishEnvelope(envelope: RspEnvelope): Promise<RspEventRecord> {
    const publishInput = envelopeToPublishInput(envelope);

    if (this.options.publish) {
      return this.options.publish(publishInput);
    }

    const response = await fetch(`${this.options.baseUrl!.replace(/\/$/, '')}/rsp/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envelope),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`RSP publish failed (${response.status}): ${body}`);
    }

    return response.json() as Promise<RspEventRecord>;
  }
}

/** Convenience factory */
export function createRspPublisher(options: RspPublisherOptions): RspPublisher {
  return new RspPublisher(options);
}
