-- Platform v0.1 — Ownership, Stewardship, Attestation
-- Ownership ≠ organization. Verification ≠ attestation.

CREATE TABLE IF NOT EXISTS ownership (
  subject_uri TEXT NOT NULL REFERENCES identities(uri),
  owner_uri TEXT NOT NULL REFERENCES identities(uri),
  ownership_type TEXT NOT NULL DEFAULT 'legal',
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_until TIMESTAMPTZ,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (subject_uri, ownership_type)
);

CREATE INDEX IF NOT EXISTS idx_ownership_owner ON ownership(owner_uri);

CREATE TABLE IF NOT EXISTS stewardship (
  subject_uri TEXT NOT NULL REFERENCES identities(uri),
  steward_uri TEXT NOT NULL REFERENCES identities(uri),
  role TEXT NOT NULL,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_until TIMESTAMPTZ,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (subject_uri, steward_uri, role)
);

CREATE INDEX IF NOT EXISTS idx_stewardship_steward ON stewardship(steward_uri);
CREATE INDEX IF NOT EXISTS idx_stewardship_subject ON stewardship(subject_uri);

CREATE TABLE IF NOT EXISTS attestations (
  uri TEXT PRIMARY KEY,
  subject_uri TEXT NOT NULL REFERENCES identities(uri),
  attested_by_uri TEXT NOT NULL REFERENCES identities(uri),
  attestation_type TEXT NOT NULL,
  statement TEXT NOT NULL,
  evidence JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_attestations_subject ON attestations(subject_uri);
CREATE INDEX IF NOT EXISTS idx_attestations_attester ON attestations(attested_by_uri);

-- Phase 3 design: sessions and operational context (schema only)
CREATE TABLE IF NOT EXISTS sessions (
  uri TEXT PRIMARY KEY,
  identity_uri TEXT NOT NULL REFERENCES identities(uri),
  credential_type TEXT NOT NULL,
  operational_context JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sessions_identity ON sessions(identity_uri);
