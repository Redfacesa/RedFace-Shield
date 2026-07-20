# The Operational Kernel

**Status:** Draft v0.1  
**Authority:** Subordinate to [Volume −1](../volume-minus-1-philosophy/PHILOSOPHY.md) and [Operational Loop](../volume-0.5-principles/OPERATIONAL-LOOP.md); implements [Volume 0](../volume-00-constitution/TRUST-CONSTITUTION.md)  
**Scope:** Core platform architecture — ten engines, one responsibility each

---

## 1. Purpose

RedFace is implemented as an **Operational Kernel** — a set of specialized engines that together make physical operations verifiable, orchestrable, and continuously improvable.

The kernel is not a monolith. Each engine has exactly one responsibility. Engines communicate through the Operational Graph and the Operational Loop. No engine bypasses another.

Applications (Shield, Commerce, Rescue, Fleet, Utility, City) are **reference implementations** that compose kernel engines for specific verticals. They do not embed operational logic that belongs in the kernel.

---

## 2. Kernel Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATIONS                              │
│   Shield · Commerce · Rescue · Fleet · Utility · City       │
├─────────────────────────────────────────────────────────────┤
│                  OPERATIONAL KERNEL                          │
│                                                              │
│   Identity Engine    │  Who or what is participating?       │
│   Trust Engine       │  What can be verified?                │
│   Intent Engine      │  What outcome is requested?           │
│   Mission Engine     │  How will the outcome be achieved?    │
│   Resource Engine    │  What is available?                   │
│   Policy Engine      │  What rules constrain execution?      │
│   Event Engine       │  What happened?                       │
│   History Engine     │  Preserve immutable record              │
│   Intelligence Engine│  Learn from history                   │
│   Economy Engine     │  Cost, value, settlement              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                  OPERATIONAL GRAPH                           │
│   Intents · Missions · Nodes · Edges · State · Events       │
├─────────────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE                              │
│   Storage · Streaming · Search · Graph · AI · Cloud · Edge  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Engine Specifications

### 3.1 Identity Engine

**Responsibility:** Who or what is participating?

- Register and verify organizational, human, asset, and property identities
- Issue and manage RTN identifiers (`RF-ORG-*`, `RF-PER-*`, `RF-AST-*`, etc.)
- Authenticate humans, devices, and services
- Manage credentials, certificates, and session lifecycle
- Suspend or revoke compromised identities

**Does not:** Authorize actions (Policy Engine), orchestrate missions (Mission Engine)

**Outputs:** Verified identity references consumed by all other engines

---

### 3.2 Trust Engine

**Responsibility:** What can be verified?

- Verify claims: licenses, certifications, insurance, device location, evidence integrity
- Compute operational trust scores from history (not from self-report)
- Manage chain of custody for evidence objects
- Issue digital signatures and certificates
- Process trust score disputes

**Does not:** Create trust (humans decide), store raw events (History Engine)

**Outputs:** Verification results, trust scores, signed evidence, certificates

**Note:** Trust Engine makes verification possible. Trust is earned by participants through verifiable operations recorded in history.

---

### 3.3 Intent Engine

**Responsibility:** What outcome is requested?

- Accept intent declarations from verified identities
- Validate intent against policy (is this identity permitted to request this outcome?)
- Route intent to Mission Engine for orchestration
- Track intent lifecycle: declared → accepted → mission_created → fulfilled | failed
- Surface intelligence-informed intent suggestions (from Intelligence Engine)

**Does not:** Execute missions (Mission Engine), allocate resources (Resource Engine)

**Outputs:** Intent objects (`RF-INT-*`) that trigger mission creation

**Examples:**
- "Recover vehicle CA 123 456 GP"
- "Deliver order #12345 by 18:00"
- "Protect concert at venue X on Saturday"

---

### 3.4 Mission Engine

**Responsibility:** How will the outcome be achieved?

- Transform intent into mission with objectives, policies, and success criteria
- Orchestrate adaptive execution — objective fixed, path flexible
- Manage mission lifecycle: planning → allocation → execution → adaptation → completion → review
- Coordinate multi-organization participation
- Capture review and lessons learned (stages often missing in traditional software)

**Does not:** Match resources (Resource Engine), publish events (Event Engine), enforce policy (Policy Engine)

**Outputs:** Mission objects (`RF-MSN-*`), objective completion, outcomes, lessons learned

**Key distinction:** A mission is not a workflow. Workflows are predefined. Missions adapt.

---

### 3.5 Resource Engine

**Responsibility:** What people, assets, and capabilities are available?

- Maintain live state of all operational resources (guards, vehicles, drones, equipment)
- Maintain **capability registry** — what organizations can do, not just what they own
- Match mission requirements to available capabilities and resources
- Allocate and release resources to/from missions
- Operate capacity exchange and marketplace matching

**Capability model:**

```yaml
Organization:
  capabilities:
    - armed_response
    - vehicle_recovery
    - cctv_monitoring
    - drone_operations
    - k9_unit
    - medical_response
    - forensic_collection
```

Missions query: *"Find nearest organizations with capabilities [vehicle_recovery, drone_operations] in zone X"* — not *"Find Company Y."*

**Does not:** Define mission objectives (Mission Engine), authorize allocation (Policy Engine)

**Outputs:** Resource allocations, capability matches, availability state

---

### 3.6 Policy Engine

**Responsibility:** What rules constrain execution?

- Evaluate authorization for every action: publish event, access evidence, join mission, allocate resource
- Manage consent agreements between participants
- Enforce data sharing rules, escalation paths, and jurisdictional requirements
- Default deny — explicit permit required
- Log every policy decision for audit

**Does not:** Define business rules for applications (applications configure policies), store history (History Engine)

**Outputs:** Permit/deny decisions with rationale, consent records

---

### 3.7 Event Engine

**Responsibility:** What happened?

- Accept signed events from verified identities
- Validate event envelope against RSP specification
- Attach events to mission timelines
- Route events to authorized subscribers
- Support transport bindings: HTTP webhook, MQTT, WebSocket, gRPC, edge queue

**Does not:** Interpret events (Intelligence Engine), store permanently (History Engine)

**Outputs:** Validated, routed, mission-attached events

---

### 3.8 History Engine

**Responsibility:** Preserve the immutable operational record.

- Append all events to immutable, hash-chained ledger
- Support query by mission, organization, time range, event type
- Enforce retention policies per jurisdiction and participant
- Provide audit export for compliance, legal, and insurance
- Never edit or delete — corrections are new entries referencing originals

**Does not:** Analyze history (Intelligence Engine), verify identities (Identity Engine)

**Outputs:** Immutable history, audit trails, compliance exports

---

### 3.9 Intelligence Engine

**Responsibility:** Learn from operational history.

- Observe history — never replace it
- Detect patterns: connected missions, recurring crime MO, equipment failure rates
- Recommend: resource matching, patrol routes, staffing levels, mission strategies
- Extract structured operational facts from raw sensor data
- Generate lessons learned from completed missions
- Produce AI COO briefings for executive decision support

**Does not:** Autonomously create missions, dispatch resources, or override policy without explicit delegation

**Outputs:** Recommendations, predictions, pattern alerts, lessons learned, structured facts

---

### 3.10 Economy Engine

**Responsibility:** Measure cost, value, incentives, and settlement.

- Track economic activity within missions: dispatch fees, marketplace payments, platform coordination fees
- Compute cost per mission, profit per contract, margin per patrol
- Settle payments between participants
- Integrate with RedFace Pay / Commerce Kernel for financial rails
- Measure value generated: asset recovered, time saved, claim accelerated

**Does not:** Set pricing (participants do), define missions (Mission Engine)

**Outputs:** Invoices, settlements, cost analytics, value metrics

---

## 4. Engine Interaction

Typical flow when a vehicle is stolen:

```
1. Identity Engine    → Verify tracking company identity
2. Intent Engine      → Accept intent: "Recover vehicle CA 123 456 GP"
3. Policy Engine      → Authorize intent; determine participant visibility
4. Mission Engine     → Create mission with objectives
5. Resource Engine    → Match capabilities: vehicle_recovery, anpr_search
6. Policy Engine      → Authorize cross-org participant invitations
7. Mission Engine     → Begin execution; adapt as conditions change
8. Event Engine       → Capture dispatch, sightings, evidence events
9. History Engine     → Append all events immutably
10. Trust Engine      → Seal evidence chain of custody
11. Economy Engine    → Track fees and settlements
12. Mission Engine    → Complete mission; capture review and lessons
13. Intelligence Engine → Analyze mission history; update patterns
14. Intent Engine     → Surface smarter intents for future similar situations
```

No engine skips another. No application bypasses the kernel.

---

## 5. Relationship to Trust Network (RTN)

The Trust Network (RTN) document describes the trust layer as originally conceived. In the kernel model:

| RTN Concept | Kernel Engine |
|-------------|---------------|
| Digital Identity | Identity Engine |
| Authentication | Identity Engine |
| Verification | Trust Engine |
| Authorization | Policy Engine |
| Chain of Custody | Trust Engine |
| Audit Ledger | History Engine |
| Trust Scores | Trust Engine |
| Compliance | Policy Engine + History Engine |

RTN is not deprecated — it is **implemented by** Identity Engine, Trust Engine, Policy Engine, and History Engine working together.

---

## 6. Relationship to Commerce Kernel

The Commerce Kernel implements the same Operational Loop:

| Commerce Concept | Kernel Engine |
|------------------|---------------|
| Order | Intent |
| Fulfillment | Mission |
| Payment event, shipment event | Event |
| Ledger | History |
| Forecasting | Intelligence |
| Pricing, settlement | Economy |

Commerce and Shield are not separate platforms sharing a database. They are **two reference implementations of the same Operational Kernel**.

This is the discovery that validates the architecture: Commerce already proved the loop. Shield applies it to security. The kernel was always the company.

---

## 7. Engine Evolution

Each engine evolves independently:

- Identity Engine can add new credential types without changing Mission Engine
- Resource Engine can add capability types without changing Event Engine
- Intelligence Engine can improve models without changing History Engine

The interface between engines is the Operational Graph and RSP events — not shared code or shared databases.

This separation makes the architecture evolvable across decades.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-07-20 | Initial specification — ten engines, one responsibility each |
