-- Phase 2: Identity, Organization, Capability, Trust
-- Identity is not auth. Trust scores are derived, not stored as source of truth.

CREATE TABLE IF NOT EXISTS identities (
  uri TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  local_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (kind, local_id)
);

CREATE INDEX IF NOT EXISTS idx_identities_kind ON identities(kind);

CREATE TABLE IF NOT EXISTS organizations (
  uri TEXT PRIMARY KEY REFERENCES identities(uri),
  org_type TEXT NOT NULL,
  display_name TEXT NOT NULL,
  jurisdiction TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS capabilities (
  uri TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  requirements JSONB NOT NULL DEFAULT '[]',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_capabilities (
  organization_uri TEXT NOT NULL REFERENCES organizations(uri),
  capability_uri TEXT NOT NULL REFERENCES capabilities(uri),
  verified BOOLEAN NOT NULL DEFAULT false,
  provided_since TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (organization_uri, capability_uri)
);

CREATE TABLE IF NOT EXISTS trust_documents (
  uri TEXT PRIMARY KEY,
  identity_uri TEXT NOT NULL REFERENCES identities(uri),
  document_type TEXT NOT NULL,
  issuer_uri TEXT REFERENCES identities(uri),
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  payload JSONB NOT NULL DEFAULT '{}',
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trust_documents_identity ON trust_documents(identity_uri);

CREATE TABLE IF NOT EXISTS verifications (
  uri TEXT PRIMARY KEY,
  subject_uri TEXT NOT NULL REFERENCES identities(uri),
  verification_type TEXT NOT NULL,
  status TEXT NOT NULL,
  attested_by_uri TEXT REFERENCES identities(uri),
  evidence JSONB,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verifications_subject ON verifications(subject_uri);

-- Link operational objects to identity registry
ALTER TABLE intents ADD COLUMN IF NOT EXISTS uri TEXT;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS uri TEXT;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS uri TEXT;

-- Phase 2: capabilities as URIs on missions/resources
ALTER TABLE missions ADD COLUMN IF NOT EXISTS capabilities_required_uris TEXT[] DEFAULT '{}';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS capability_uris TEXT[] DEFAULT '{}';

-- Deprecate stored trust_score — trust is derived (Trust Engine)
ALTER TABLE resources DROP COLUMN IF EXISTS trust_score;
