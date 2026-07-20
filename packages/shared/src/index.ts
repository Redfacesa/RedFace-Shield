/** Canonical identifiers — Axiom 1: Everything has identity. */

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

export function generateId(prefix: IdPrefix): string {
  const year = new Date().getFullYear();
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
  return `${prefix}-${year}-${suffix}`;
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

export interface IdentityRef {
  id: string;
  organizationId: string;
}

export interface IntentRecord {
  id: string;
  type: string;
  statement: string;
  expressedBy: IdentityRef;
  priority: Priority;
  state: IntentState;
  context?: Record<string, unknown>;
  missionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MissionRecord {
  id: string;
  intentId: string;
  type: string;
  title: string;
  state: MissionState;
  ownerId: string;
  capabilitiesRequired: string[];
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
  id: string;
  type: string;
  organizationId: string;
  capabilityTypes: string[];
  state: ResourceState;
  location?: GeoPoint;
  trustScore: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceAllocation {
  id: string;
  missionId: string;
  resourceId: string;
  capabilityUsed: string;
  role: string;
  allocatedAt: Date;
  releasedAt?: Date;
}

export interface MissionParticipant {
  missionId: string;
  organizationId: string;
  role: string;
  joinedAt: Date;
}

export interface RspEventRecord {
  id: string;
  type: string;
  missionId?: string;
  intentId?: string;
  source: IdentityRef;
  payload: Record<string, unknown>;
  signature?: string;
  supersededBy?: string;
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
