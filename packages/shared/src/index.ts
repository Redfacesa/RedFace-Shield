/** Canonical identifiers — Axiom 1: Everything has identity. */

export * from './rtn.js';
import type { RtnUri } from './rtn.js';
import { buildRtnUri, generateLocalId } from './rtn.js';

/** @deprecated Use buildRtnUri — legacy Phase 1 prefix IDs */
export type IdPrefix =
  | 'RF-INT'
  | 'RF-MSN'
  | 'RF-ORG'
  | 'RF-PER'
  | 'RF-AST'
  | 'RF-CAP'
  | 'RF-EVT'
  | 'RF-EVD'
  | 'RF-POL';

/** @deprecated Use buildRtnUri */
export function generateId(prefix: IdPrefix): string {
  const year = new Date().getFullYear();
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
  return `${prefix}-${year}-${suffix}`;
}

/** Create RTN URI for operational objects */
export function newIntentUri(localId?: string): RtnUri {
  return buildRtnUri('intent', localId ?? generateLocalId('int'));
}

export function newMissionUri(localId?: string): RtnUri {
  return buildRtnUri('mission', localId ?? generateLocalId('msn'));
}

export function newEventUri(): RtnUri {
  return buildRtnUri('event', generateLocalId('evt'));
}

export interface IdentityRef {
  uri: RtnUri;
  organizationUri: RtnUri;
}

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type IntentState =
  | 'declared'
  | 'accepted'
  | 'mission_created'
  | 'fulfilled'
  | 'failed'
  | 'withdrawn';

export type MissionState =
  | 'planning'
  | 'active'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'canceled';

export type ResourceState =
  | 'available'
  | 'allocated'
  | 'busy'
  | 'maintenance'
  | 'offline';

export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface IntentRecord {
  id: RtnUri;
  type: string;
  statement: string;
  expressedBy: IdentityRef;
  priority: Priority;
  state: IntentState;
  context?: Record<string, unknown>;
  missionId?: RtnUri;
  createdAt: Date;
  updatedAt: Date;
}

export interface MissionRecord {
  id: RtnUri;
  intentId: RtnUri;
  type: string;
  title: string;
  state: MissionState;
  ownerUri: RtnUri;
  capabilitiesRequired: RtnUri[];
  priority: Priority;
  outcome?: MissionOutcome;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface MissionOutcome {
  result: 'success' | 'partial_success' | 'failure' | 'canceled';
  summary: string;
  metrics?: Record<string, number | string | boolean>;
}

export interface ResourceRecord {
  id: RtnUri;
  type: string;
  organizationUri: RtnUri;
  capabilityUris: RtnUri[];
  state: ResourceState;
  location?: GeoPoint;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceAllocation {
  id: string;
  missionId: RtnUri;
  resourceId: RtnUri;
  capabilityUri: RtnUri;
  role: string;
  allocatedAt: Date;
  releasedAt?: Date;
}

export interface MissionParticipant {
  missionId: RtnUri;
  organizationUri: RtnUri;
  role: string;
  joinedAt: Date;
}

export interface RspEventRecord {
  id: RtnUri;
  type: string;
  missionId?: RtnUri;
  intentId?: RtnUri;
  source: IdentityRef;
  payload: Record<string, unknown>;
  signature?: string;
  supersededBy?: RtnUri;
  occurredAt: Date;
  recordedAt: Date;
}

export interface PolicyDecision {
  allowed: boolean;
  rationale: string;
  policyVersion: string;
  decidedAt: Date;
}

export class KernelError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'KernelError';
  }
}
