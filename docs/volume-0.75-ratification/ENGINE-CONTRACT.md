# Engine Contract

**Status:** Platform v0.1 — mandatory for every engine  
**Authority:** [Axioms](AXIOMS.md), [Canonical Language](CANONICAL-LANGUAGE.md)

---

## Rule

Every engine must answer four questions before it can exist. No exceptions. No "temporary" violations.

If an engine cannot answer **Never Does**, it will eventually absorb responsibilities that belong elsewhere — and the architecture will rot.

---

## Template

```markdown
### [Engine Name]

**Owns** — authoritative data and decisions  
**Consumes** — inputs from other engines  
**Produces** — outputs for other engines  
**Never Does** — explicit boundaries
```

---

## Identity Engine

**Owns**
- Universal identity registry (`rtn://` URIs)
- Identity metadata and status (active, suspended, revoked)
- Trust document attachment (document ownership on identity)

**Consumes**
- None at registration time (foundational)

**Produces**
- Identity records resolvable by URI
- Document records linked to identities

**Never Does**
- Authenticate credentials
- Authorize actions
- Assign ownership or stewardship (Ownership Engine)
- Attest to truth (Attestation Engine)
- Compute trust scores

---

## Organization Engine

**Owns**
- Organization profile (type, jurisdiction, metadata)
- Organization as specialized identity kind

**Consumes**
- Identity Engine (organization URI must exist)

**Produces**
- Organization records

**Never Does**
- Manage credentials or sessions
- Match capabilities (Capability Engine)
- Own operational objects (Ownership Engine)

---

## Ownership Engine

**Owns**
- Legal/operational **ownership** relationships (exactly one owner per owned object)
- **Stewardship** relationships (many stewards, many roles per object)

**Consumes**
- Identity Engine (subject, owner, steward must exist)

**Produces**
- Ownership graph edges
- Stewardship graph edges

**Never Does**
- Grant permissions (Policy Engine evaluates ownership/stewardship)
- Authenticate users
- Operate missions

---

## Capability Engine

**Owns**
- Capability definitions and requirements
- Organization → capability provision links

**Consumes**
- Identity Engine, Organization Engine

**Produces**
- Capability records
- Provider matching for required capabilities

**Never Does**
- Allocate concrete resources (Resource Engine)
- Execute missions
- Store trust scores

---

## Trust Engine

**Owns**
- Verification records ("I checked this")
- Trust document verification status updates
- **Derived trust computation** (never stored as source of truth)

**Consumes**
- Identity Engine, History (events), Ownership/Stewardship, Verifications, Documents

**Produces**
- `DerivedTrust` at query time
- Verification records

**Never Does**
- Public attestation ("I stand behind this") — Attestation Engine
- Authenticate credentials
- Authorize actions directly

---

## Attestation Engine

**Owns**
- Attestation records ("I publicly stand behind this")
- Attestation revocation

**Consumes**
- Identity Engine (attester and subject must exist)
- Optional link to verifications or evidence

**Produces**
- Attestation events and records

**Never Does**
- Replace verification (checking ≠ standing behind)
- Authorize access (Policy Engine)
- Issue credentials

---

## Intent Engine

**Owns**
- Intent lifecycle (declared → accepted → mission_created → fulfilled)

**Consumes**
- Identity Engine, Policy Engine, Event Engine

**Produces**
- Intent records, intent RSP events

**Never Does**
- Create missions without accepted intent
- Match resources
- Authenticate users

---

## Mission Engine

**Owns**
- Mission lifecycle, objectives, state transitions, outcomes, lessons

**Consumes**
- Intent, Policy, Resource availability (via allocation), Capabilities (requirements)

**Produces**
- Mission events, state changes, outcome records

**Never Does**
- Authenticate users
- Talk to cameras or adapters
- Send notifications directly
- Calculate trust
- Decide ownership

---

## Resource Engine

**Owns**
- Resource registration, availability state, mission allocations

**Consumes**
- Identity, Capability (validates capability URIs), Policy, Event Engine

**Produces**
- Resource allocation events

**Never Does**
- Define capabilities (Capability Engine)
- Match organizations by brand name
- Store derived trust

---

## Event Engine

**Owns**
- Event envelope validation and append to mission/intent timelines

**Consumes**
- Policy (publish permission), Identity (source)

**Produces**
- Immutable RSP events

**Never Does**
- Mutate events
- Interpret events (Intelligence Engine)
- Route to external systems (Adapter layer)

---

## History Engine

**Owns**
- Nothing stored separately — history **is** the event accumulation

**Consumes**
- Event Engine projections

**Produces**
- Timelines, audit exports

**Never Does**
- Rewrite history
- Store alternate editable records

---

## Policy Engine

**Owns**
- Authorization decisions and audit log
- Policy version references

**Consumes**
- Identity, **Operational Context** (when available), Ownership/Stewardship, Mission state

**Produces**
- Permit/deny with rationale

**Never Does**
- Authenticate credentials (Credential Engine)
- Prove identity exists (Identity Engine)
- Store sessions

---

## Credential Engine *(Phase 3 — not yet implemented)*

**Owns**
- Credential registration (passkey, API key, certificate, OAuth binding)
- Credential validation ("this credential proves this identity")

**Consumes**
- Identity Engine

**Produces**
- Identity proof result (not authorization)

**Never Does**
- Grant permissions (Policy Engine)
- Create identities
- Issue JWT as identity

---

## Session Engine *(Phase 3 — not yet implemented)*

**Owns**
- Session lifecycle (browser, mobile, patrol terminal, API)
- Session → identity binding
- **Operational Context** attachment to session

**Consumes**
- Credential Engine (identity proven), Policy Engine

**Produces**
- Session records, context snapshots for policy evaluation

**Never Does**
- Authorize actions directly
- Orchestrate missions

---

## Intelligence Engine *(planned)*

**Owns**
- Hypotheses, recommendations, pattern alerts

**Consumes**
- History, Graph projections, Mission state

**Produces**
- Recommendations (require human/policy confirmation to become facts)

**Never Does**
- Write operational facts to history (Axiom 8)
- Autonomously dispatch or close missions

---

## Economy Engine *(planned)*

**Owns**
- Cost attribution, settlement records, value metrics per mission

**Consumes**
- Mission outcomes, Resource allocations, Events

**Produces**
- Economic events, invoices

**Never Does**
- Price participant services
- Own payment rails (integrates with RedFace Pay)

---

## Adapter Layer *(not an engine — translation only)*

**Owns**
- Vendor format normalization

**Consumes**
- External vendor events

**Produces**
- RSP events → Event Engine

**Never Does**
- Business logic, mission logic, authentication, database writes, policy decisions

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| v0.1 | 2026-07-20 | Initial engine contracts — Platform v0.1 |
