-- RedFace Operational Kernel — Phase 1 schema
-- First object: intent (Axiom 4). Events immutable (Axiom 6).

CREATE TABLE IF NOT EXISTS intents (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  statement TEXT NOT NULL,
  expressed_by_id TEXT NOT NULL,
  expressed_by_org TEXT NOT NULL,
  priority TEXT NOT NULL,
  state TEXT NOT NULL,
  context JSONB,
  mission_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS missions (
  id TEXT PRIMARY KEY,
  intent_id TEXT NOT NULL REFERENCES intents(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  state TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  capabilities_required TEXT[] NOT NULL DEFAULT '{}',
  priority TEXT NOT NULL,
  outcome JSONB,
  lessons JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  capability_types TEXT[] NOT NULL DEFAULT '{}',
  state TEXT NOT NULL,
  location JSONB,
  trust_score NUMERIC NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_allocations (
  id TEXT PRIMARY KEY,
  mission_id TEXT NOT NULL REFERENCES missions(id),
  resource_id TEXT NOT NULL REFERENCES resources(id),
  capability_used TEXT NOT NULL,
  role TEXT NOT NULL,
  allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  released_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS mission_participants (
  mission_id TEXT NOT NULL REFERENCES missions(id),
  organization_id TEXT NOT NULL,
  role TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (mission_id, organization_id)
);

-- Append-only event store (History Engine projection source)
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  mission_id TEXT,
  intent_id TEXT,
  source_identity TEXT NOT NULL,
  source_organization TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  signature TEXT,
  superseded_by TEXT REFERENCES events(id),
  occurred_at TIMESTAMPTZ NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_mission ON events(mission_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_events_intent ON events(intent_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_resources_capabilities ON resources USING GIN(capability_types);
CREATE INDEX IF NOT EXISTS idx_resources_state ON resources(state);

-- Policy audit log (Axiom 12)
CREATE TABLE IF NOT EXISTS policy_decisions (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_org TEXT NOT NULL,
  allowed BOOLEAN NOT NULL,
  rationale TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  context JSONB,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
