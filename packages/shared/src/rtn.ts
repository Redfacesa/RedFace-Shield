/** RedFace Trust Network — canonical URI scheme (Axiom 1) */

export const RTN_SCHEME = 'rtn:' as const;

/** Identity kinds — every participant object type */
export type RtnKind =
  | 'organization'
  | 'person'
  | 'guard'
  | 'vehicle'
  | 'camera'
  | 'drone'
  | 'property'
  | 'mission'
  | 'intent'
  | 'evidence'
  | 'document'
  | 'api'
  | 'gateway'
  | 'agent'
  | 'sensor'
  | 'body-camera'
  | 'panic-button'
  | 'capability'
  | 'resource'
  | 'event';

export type RtnUri = `rtn://${string}/${string}`;

const RTN_PATTERN = /^rtn:\/\/([a-z0-9-]+)\/([a-zA-Z0-9._-]+)$/;

export function buildRtnUri(kind: RtnKind, localId: string): RtnUri {
  const normalized = localId.trim();
  if (!normalized) {
    throw new Error('RTN localId cannot be empty');
  }
  return `rtn://${kind}/${normalized}` as RtnUri;
}

export function parseRtnUri(uri: string): { kind: RtnKind; localId: string } {
  const match = RTN_PATTERN.exec(uri);
  if (!match) {
    throw new Error(`Invalid RTN URI: ${uri}`);
  }
  return { kind: match[1] as RtnKind, localId: match[2] };
}

export function isRtnUri(value: string): value is RtnUri {
  return RTN_PATTERN.test(value);
}

/** Generate opaque local id when human slug not provided */
export function generateLocalId(prefix?: string): string {
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  return prefix ? `${prefix}-${suffix}` : suffix;
}

export type IdentityStatus = 'active' | 'suspended' | 'revoked';

export interface IdentityRecord {
  uri: RtnUri;
  kind: RtnKind;
  localId: string;
  displayName: string;
  metadata: Record<string, unknown>;
  status: IdentityStatus;
  createdAt: Date;
}

export type OrganizationType =
  | 'private_company'
  | 'government'
  | 'ngo'
  | 'insurance'
  | 'municipality'
  | 'hospital'
  | 'university'
  | 'police'
  | 'recovery'
  | 'other';

export interface OrganizationRecord {
  uri: RtnUri;
  orgType: OrganizationType;
  displayName: string;
  jurisdiction?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export type TrustDocumentType =
  | 'registration'
  | 'insurance'
  | 'license'
  | 'certificate'
  | 'tax'
  | 'contract'
  | 'training'
  | 'firearm_license'
  | 'medical'
  | 'employment'
  | 'vin'
  | 'roadworthy'
  | 'firmware'
  | 'calibration'
  | 'health'
  | 'other';

export type VerificationStatus = 'verified' | 'pending' | 'failed' | 'expired';

export interface TrustDocument {
  id: RtnUri;
  identityUri: RtnUri;
  documentType: TrustDocumentType;
  issuerUri?: RtnUri;
  validFrom?: Date;
  validUntil?: Date;
  payload: Record<string, unknown>;
  verificationStatus: VerificationStatus;
  createdAt: Date;
}

export interface CapabilityRequirement {
  type: string;
  description: string;
  required: boolean;
}

export interface CapabilityRecord {
  uri: RtnUri;
  slug: string;
  name: string;
  description?: string;
  requirements: CapabilityRequirement[];
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface OrganizationCapability {
  organizationUri: RtnUri;
  capabilityUri: RtnUri;
  verified: boolean;
  providedSince: Date;
}

export interface VerificationRecord {
  id: RtnUri;
  subjectUri: RtnUri;
  verificationType: string;
  status: VerificationStatus;
  attestedByUri?: RtnUri;
  evidence?: Record<string, unknown>;
  verifiedAt?: Date;
  expiresAt?: Date;
}

/** Trust is derived — never stored as source of truth (Phase 2) */
export interface DerivedTrust {
  subjectUri: RtnUri;
  score: number;
  components: {
    evidenceIntegrity: number;
    missionSuccess: number;
    policyCompliance: number;
    responseHistory: number;
    documentValidity: number;
  };
  computedAt: Date;
}
