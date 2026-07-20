# The RedFace Trust Network (RTN)

**Status:** Draft v0.1  
**Authority:** Subordinate to [Volume 0: The Trust Constitution](../volume-00-constitution/TRUST-CONSTITUTION.md)  
**Scope:** Core platform architecture beneath all RedFace applications

---

## 1. Purpose

The RedFace Trust Network (RTN) is the foundational platform layer on which all RedFace applications operate. It is not a product. It is infrastructure — comparable to what TCP/IP is to the internet, what Stripe's payment rails are to commerce, or what Visa's network is to card transactions.

RTN answers one question for every physical operation in Africa:

> **Can this be trusted?**

Before an alarm is raised, before a guard is dispatched, before evidence is presented in court, before an insurance claim is processed — RTN establishes identity, verifies authenticity, enforces authorization, records audit, and maintains chain of custody.

Shield is an application on RTN. Rescue will be an application on RTN. So will Fleet, Utility, City, and Commerce. They share trust infrastructure; they differ in operational workflows.

---

## 2. Architectural Position

```
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATIONS                             │
│   Shield  ·  Rescue  ·  Fleet  ·  Utility  ·  City  ·  Commerce │
├─────────────────────────────────────────────────────────────┤
│                   OPERATIONAL SERVICES                      │
│   Dispatch · Evidence · Identity · Messaging · Billing      │
│   Analytics · AI · Marketplace                              │
├─────────────────────────────────────────────────────────────┤
│              REDFACE TRUST NETWORK (RTN)          ◄── YOU ARE HERE
│   Digital Identity · Certificates · Signatures              │
│   Permissions · Policy Engine · Chain of Custody            │
│   Audit Ledger · Compliance                                 │
├─────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                           │
│   Storage · Streaming · Search · Graph · Events             │
│   AI · Cloud · Edge                                         │
└─────────────────────────────────────────────────────────────┘
```

Applications must not implement their own identity, audit, or authorization. They consume RTN services. This prevents trust fragmentation and ensures one audit trail across the ecosystem.

---

## 3. RTN Components

### 3.1 Digital Identity

Every entity on the network receives a verifiable digital identity.

| Identity Class | Examples | Properties |
|----------------|----------|------------|
| **Organizational** | Security company, insurer, municipality, recovery firm | Registration, jurisdiction, licenses, insurance, trust score |
| **Human** | Guard, dispatcher, investigator, supervisor | Employment, training, certifications, biometric (optional) |
| **Asset** | Vehicle, camera, drone, bodycam, alarm panel | Manufacturer, owner, location, firmware, health |
| **Physical** | Property, gate, fence, zone, city | Address, geofence, owner, coverage |
| **Operational** | Incident, evidence package, dispatch order | Origin, participants, status, universal ID |

Identity properties:

- **Globally unique** — stable identifiers across the network (`RF-ORG-*`, `RF-PER-*`, `RF-AST-*`, `RF-INC-*`)
- **Verifiable** — third parties can confirm identity without contacting RedFace directly (via certificates)
- **Attributable** — every action traces to an identity
- **Revocable** — compromised or non-compliant identities can be suspended with audit

### 3.2 Authentication

Proof that an identity is who it claims to be.

- Multi-factor authentication for human operators
- Device certificates for cameras, sensors, vehicles, bodycams
- API keys with scoped permissions for system integrations
- Mutual TLS for service-to-service communication
- Session management with configurable timeout and re-authentication policies

Authentication is continuous, not point-in-time. A guard authenticated at shift start who goes offline triggers state change, not silent trust.

### 3.3 Verification

Proof that a claim is true.

| Claim | Verification Method |
|-------|---------------------|
| Company is licensed | Document verification + registry lookup |
| Guard is certified | Training record + employer attestation |
| Camera is at claimed location | GPS + installation certificate + periodic heartbeat |
| Evidence is unaltered | Cryptographic hash + digital signature + ledger entry |
| Vehicle is insured | Insurer attestation via policy link |
| Dispatch was accepted | Signed acceptance event from responding unit |

Verification is not binary forever. Licenses expire. Certifications lapse. Cameras go offline. Verification status is stateful and time-bound.

### 3.4 Authorization

What an authenticated, verified identity is permitted to do.

Authorization is governed by the **Policy Engine** (Section 3.6). Default is deny. Permissions are:

- **Scoped** — a guard can view incidents assigned to their company, not all incidents in the city
- **Conditional** — an insurer can view evidence for claims they underwrite, not unrelated incidents
- **Temporal** — access during active incident, revoked at closure unless legal hold applies
- **Delegatable** — a company admin can grant sub-permissions within their organization

Authorization decisions are logged. Every access to sensitive data produces an audit event.

### 3.5 Digital Signatures and Certificates

RTN issues and manages:

- **Organization certificates** — attesting verified status of a participant
- **Device certificates** — binding hardware to owner and location
- **Evidence signatures** — binding recording to device, operator, time, and location
- **Dispatch signatures** — binding acceptance/rejection to responding unit and timestamp
- **Policy signatures** — binding consent agreements between participants

Signatures use industry-standard cryptography. Certificate authority hierarchy is managed by RedFace with provision for jurisdiction-specific sub-authorities.

### 3.6 Policy Engine

The policy engine evaluates authorization requests against participant-defined rules.

Example policies:

- "Share live camera feed with armed response company X when alarm is verified in geofence Y"
- "Allow insurer Z to access evidence packages linked to active claims only"
- "Permit municipality to view aggregate incident statistics, not individual identities"
- "Require two-operator verification before dispatching armed response to residential property"

Policies are:

- Written in a declarative policy language
- Versioned and auditable
- Enforced at the RTN layer, not left to application discretion
- Negotiable between participants (consent-based data sharing agreements)

### 3.7 Chain of Custody

Digital chain of custody for evidence is a first-class RTN capability.

When evidence is created (bodycam recording, CCTV clip, photograph, document):

```
Evidence Created
  → Evidence Object ID assigned
  → Origin: device identity + operator identity
  → Context: GPS + timestamp + incident link (if applicable)
  → Integrity: cryptographic hash computed
  → Signature: device + platform co-sign
  → Ledger: immutable entry appended
  → Access: policy-governed from this point forward
```

Every transfer of custody (handed to police, submitted to insurer, entered in court) is a signed event. Alteration of content changes the hash and is immediately detectable.

This is designed to meet evidentiary standards in South African and broader African legal systems.

### 3.8 Audit Ledger

All trust-relevant actions are recorded in an append-only audit ledger.

Ledger entries include:

- Authentication and authorization events
- Identity creation, modification, suspension, revocation
- Policy creation, modification, enforcement decisions
- Evidence creation, access, transfer, certification
- Consent grants and revocations
- Cross-participant data sharing events
- Trust score computations and disputes

The ledger is:

- **Append-only** — no edits, no deletes; corrections are new entries referencing originals
- **Tamper-evident** — hash-chained entries detect modification
- **Queryable** — participants can audit access to their own data
- **Retained** — per jurisdiction requirements and participant policy

### 3.9 Compliance

RTN provides compliance infrastructure:

- **POPIA** (South Africa) — consent management, data subject access, purpose limitation
- **GDPR-aligned practices** — where applicable to international participants
- **Sector regulations** — PSIRA (private security), insurance regulatory requirements
- **Legal hold** — evidence and audit preservation for active legal proceedings
- **Data residency** — participant data stored in approved jurisdictions

Compliance is enforced at RTN, not reimplemented per application.

### 3.10 Consent Management

Cross-participant data sharing requires explicit consent:

- Consent is granular (what data, for what purpose, for how long)
- Consent is revocable (with operational continuity safeguards for active incidents)
- Consent is auditable (who granted, when, under what policy version)
- Consent is bilateral (both parties acknowledge the sharing agreement)

---

## 4. RTN Services (API Surface)

RTN exposes services consumed by applications and third-party integrators:

| Service | Responsibility |
|---------|----------------|
| `identity.*` | Create, verify, suspend, resolve identities |
| `auth.*` | Authenticate humans, devices, and services |
| `authz.*` | Evaluate permissions against policies |
| `policy.*` | Define, version, and enforce participant policies |
| `evidence.*` | Create, sign, transfer, certify evidence objects |
| `ledger.*` | Append and query audit entries |
| `consent.*` | Manage cross-participant sharing agreements |
| `trust.*` | Compute, query, and dispute operational trust scores |
| `cert.*` | Issue, renew, revoke certificates |

Applications never bypass these services. A Shield dispatch action flows through: authenticate dispatcher → authorize dispatch → verify responding unit → sign dispatch event → append to ledger.

---

## 5. Trust Scores

Every participant and asset accumulates an operational trust score derived from auditable platform data.

### Organization Trust Score

| Metric | Example |
|--------|---------|
| Average response time | 4m 22s |
| Success rate | 96% |
| Customer satisfaction | 4.8 / 5 |
| Evidence quality | 98% |
| False alarm handling | 99% |

### Recovery Organization

| Metric | Example |
|--------|---------|
| Recovery rate | 88% |
| Average recovery time | 5h |
| Post-hijacking success | 73% |
| Documentation quality | 99% |

### Asset (Camera)

| Metric | Example |
|--------|---------|
| Uptime | 99.8% |
| Video quality | 98% |
| Night accuracy | 95% |
| Tamper incidents | 0 |

Trust scores:

- Are computed from platform data, not self-reported
- Are transparent — participants see their own metrics and aggregate benchmarks
- Are disputable through defined appeals process
- Cannot be purchased or commercially suppressed
- Influence routing — higher-trust responders may be prioritized in dispatch matching

---

## 6. Universal Incident Identity

When an incident spans multiple participants, RTN assigns one universal identifier:

```
RF-2026-ZA-CPT-000123456
 │    │   │   │      │
 │    │   │   │      └── Sequential incident number
 │    │   │   └── Region (CPT = Cape Town)
 │    │   └── Country (ZA = South Africa)
 │    └── Year
 └── RedFace namespace
```

This ID follows the incident across:

- Security company internal systems
- Police case management
- Insurance claim processing
- Recovery operations
- Municipal records
- Court proceedings

All participants reference the same incident. Duplication of case numbers, claim numbers, and internal references is eliminated.

---

## 7. RTN and the Operational Graph

RTN governs the **trust properties** of every node and edge in the Operational Graph (Volume 2):

- **Nodes** (companies, people, assets, properties) have RTN identities
- **Edges** (employment, ownership, response, insurance) require authorization
- **Events** (alarms, dispatches, evidence) are signed and ledgered
- **State changes** (available → responding → arrived) are authenticated

The Operational Graph is the semantic model. RTN is the trust substrate that makes the graph trustworthy.

---

## 8. RTN and RSP

The RedFace Shield Protocol (RSP, Volume 3) defines the **event vocabulary** that flows through RTN. RSP events are:

- Published by authenticated identities
- Authorized by policy before delivery to subscribers
- Signed at creation
- Appended to the audit ledger
- Routed through the Operational Graph

RTN is the trust layer. RSP is the language layer. Together they form the interoperability standard for physical security in Africa.

---

## 9. Deployment Model

RTN is designed for:

- **Multi-tenant** — each participant is isolated by policy, not by infrastructure silo
- **Multi-region** — data residency per jurisdiction
- **Hybrid** — cloud core with edge nodes for latency-sensitive verification and evidence signing
- **Offline-capable** — edge devices queue signed events when connectivity is lost; ledger reconciles on reconnect

RTN does not require participants to migrate existing systems. Integration is via RSP publish/subscribe and RTN identity/certification services.

---

## 10. What RTN Enables

When RTN exists, the following become possible without custom integration per pair of participants:

- A hijacking detected by a tracking company automatically creates a universal incident visible to recovery, security, insurance, police, and municipality traffic cameras — each governed by their own policy
- Evidence from a bodycam is court-ready from the moment of recording
- A security company can instantly verify that a subcontracted guard is certified, insured, and authorized
- An insurer can trust that a claim's evidence has not been altered since collection
- A municipality can see operational intelligence across all connected participants without accessing individual privacy data
- AI can operate on trusted, structured facts rather than unverified feeds

RTN is the reason RedFace becomes infrastructure rather than software.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-07-20 | Initial draft |
