# Volume 1: The RedFace Shield Operating Model

**Status:** Draft v0.1  
**Authority:** Subordinate to [Volume 0](../volume-00-constitution/TRUST-CONSTITUTION.md)  
**Scope:** How participants join, operate, and benefit from the Shield network

---

## 1. Purpose

This document defines how the physical security ecosystem participates in RedFace Shield without surrendering sovereignty, replacing existing systems, or changing their core business.

Shield is not a security company. Shield is the operating model through which security companies, control rooms, insurers, recovery firms, municipalities, and public agencies coordinate as one network.

Every participant retains:

- Ownership of its people, vehicles, and equipment
- Control of its own policies and dispatch decisions
- Its existing software, dashboards, and workflows (integrated, not replaced)
- Its client relationships and commercial contracts
- Its data (held in trust by RTN, exportable at any time)

What participants gain:

- One integration instead of dozens of bilateral APIs
- Universal incident identity across organizations
- Trusted evidence with chain of custody
- Operational intelligence from network-wide patterns
- Access to a resource marketplace for surge capacity
- Trust scores that demonstrate operational excellence
- Reduced response times through intelligent coordination

---

## 2. The Problem Shield Solves

Consider a burglary in Cape Town today:

```
Alarm triggered
  → Alarm company receives signal (System A)
  → Operator phones homeowner (phone call)
  → No answer (delay)
  → Operator phones response company (phone call)
  → Vehicle dispatched (radio)
  → Guard arrives (30 min later)
  → Guard calls control room (phone call)
  → Police maybe called (phone call)
  → Insurance maybe notified (email, days later)
  → Owner maybe uploads CCTV (WhatsApp)
  → Investigator manually collects evidence (days)
  → Insurance requests documents (PDF exchange)
  → Case eventually closed (weeks)
```

Every arrow is a phone call, a different system, or a manual handoff. No shared incident. No shared evidence. No shared intelligence.

Shield replaces the arrows with trusted, structured, real-time coordination:

```
Alarm triggered
  → RSP event: alarm.raised (signed, universal incident ID created)
  → Policy: notify monitoring company (automatic)
  → Operator verifies (decision support from AI)
  → Policy: dispatch nearest verified responder (automatic matching)
  → Responder accepts (signed dispatch event)
  → GPS tracked, ETA shared (real-time state)
  → Guard arrives (RSP event: arrival.confirmed)
  → Evidence collected (chain of custody begins)
  → Policy: notify police, insurer (automatic, structured)
  → AI links to related incidents (operational intelligence)
  → Case resolved (single incident object, complete timeline)
```

The participant's control room still makes decisions. Shield makes those decisions faster, better informed, and fully auditable.

---

## 3. Participant Roles

### 3.1 Security Companies

**Who:** Armed response, alarm monitoring, CCTV monitoring, estate security, retail security, mining security.

**What they bring:** Guards, vehicles, control rooms, client contracts, dispatch capability.

**How they participate:**

| Activity | Shield Role |
|----------|-------------|
| Alarm monitoring | Publish `alarm.raised`, `alarm.verified`, `alarm.false` events |
| Dispatch | Consume dispatch requests, publish `dispatch.accepted/rejected/arrived` |
| Patrol | Publish guard state and location (with consent), receive patrol assignments |
| Evidence | Collect via bodycam/CCTV, evidence auto-sealed with chain of custody |
| Reporting | Receive AI-generated operational reports, trust score updates |
| Surge capacity | Offer idle resources on marketplace; rent from others when overloaded |

**What they keep:** Client relationships, pricing, guard employment, control room operations, existing alarm/CCTV systems (integrated via RSP).

**Integration point:** One RSP adapter connecting their existing monitoring/dispatch software to Shield.

### 3.2 Recovery Companies

**Who:** Vehicle recovery, hijack recovery, asset tracing, fleet tracking, repossession.

**What they bring:** Tracking technology, recovery teams, vehicle databases, GPS platforms.

**How they participate:**

| Activity | Shield Role |
|----------|-------------|
| Hijacking detection | Publish `vehicle.stolen`, `tracking.active` events → universal incident |
| Recovery | Publish `recovery.dispatched`, `recovery.success/failed` |
| ANPR integration | Publish `vehicle.seen` events linked to active incidents |
| Cross-network search | All connected ANPR, cameras, and tracking search simultaneously |

**What they keep:** Tracking platforms, recovery teams, client contracts.

### 3.3 Insurance

**Who:** Short-term insurers, loss adjusters, risk assessors, fraud investigators.

**What they bring:** Claims processing, risk models, policy data, fraud detection.

**How they participate:**

| Activity | Shield Role |
|----------|-------------|
| Claims | Link claims to universal incident ID — no duplicate case numbers |
| Evidence | Access certified evidence packages with verified chain of custody |
| Risk assessment | Receive aggregate operational intelligence for underwriting |
| Fraud detection | Cross-reference incidents, vehicles, and patterns across network |
| Premium optimization | Trust scores inform risk pricing for connected properties |

**What they keep:** Claims systems, underwriting, client policies. Integration via RSP events and evidence API.

### 3.4 Police and Investigators

**Who:** SAPS, metro police, private investigators, crime intelligence.

**What they bring:** Legal authority, investigation capability, case management.

**How they participate:**

| Activity | Shield Role |
|----------|-------------|
| Incident notification | Receive structured incident summaries (not raw feeds) per policy |
| Evidence | Receive court-ready evidence packages with chain of custody |
| Investigation | Query Operational Graph for connected incidents, vehicles, patterns |
| Case linking | Reference universal incident ID in case management |

**What they keep:** Legal authority, case management systems, operational independence. Shield does not dispatch police — it provides structured information for police decision-making.

### 3.5 Municipalities

**Who:** City operations, traffic management, emergency management, public safety.

**What they bring:** Traffic cameras, street cameras, emergency infrastructure, geographic authority.

**How they participate:**

| Activity | Shield Role |
|----------|-------------|
| Traffic cameras | Publish `vehicle.seen` events during active incidents |
| Emergency coordination | Receive and publish emergency events (fire, flood, civil unrest) |
| City operational twin | Dashboard showing active incidents, resource density, infrastructure health |
| Public safety analytics | Aggregate intelligence without individual privacy exposure |

**What they keep:** Municipal systems, legal authority, public policy decisions.

### 3.6 Property Managers

**Who:** Estate managers, body corporates, facility managers, access control operators.

**What they bring:** Properties, access systems, visitor management, maintenance.

**How they participate:**

| Activity | Shield Role |
|----------|-------------|
| Property registration | Register properties with geofences, coverage maps, insurance links |
| Access events | Publish `access.granted/denied`, `visitor.arrived/departed` |
| Incident context | Provide property layout, access history, and occupancy during incidents |

### 3.7 Hardware and IoT Vendors

**Who:** Camera manufacturers (Hikvision, Axis, etc.), alarm panel vendors, IoT platforms, drone operators.

**What they bring:** Devices, firmware, cloud platforms, installation networks.

**How they participate:**

| Activity | Shield Role |
|----------|-------------|
| Device registration | Register devices with RTN identity and certificates |
| Event publishing | Publish RSP events directly from devices (motion, tamper, offline) |
| Health monitoring | Publish device state for trust score computation |
| Certification | "Works with RedFace Shield" interoperability certification |

**What they gain:** One protocol (RSP) instead of custom integration per security company.

---

## 4. The Incident Lifecycle

Every incident follows a standard lifecycle on Shield. Participants join and leave the incident based on their role and policy.

```
┌─────────────────────────────────────────────────────────────┐
│  1. DETECTION                                               │
│     Sensor/alarm/tracking/human reports event                │
│     → RSP event published                                   │
│     → Universal Incident ID assigned (if new incident)      │
├─────────────────────────────────────────────────────────────┤
│  2. VERIFICATION                                            │
│     Control room operator or AI verifies threat             │
│     → RSP event: alarm.verified or alarm.false              │
│     → False alarms recorded for trust score                 │
├─────────────────────────────────────────────────────────────┤
│  3. TRIAGE                                                  │
│     AI summarizes: priority, type, nearest resources          │
│     → Operator reviews AI recommendation                      │
│     → Policy determines escalation path                       │
├─────────────────────────────────────────────────────────────┤
│  4. DISPATCH                                                │
│     Nearest verified responder matched                        │
│     → RSP event: dispatch.requested                           │
│     → Responder accepts/rejects (signed)                      │
│     → GPS tracking begins                                     │
├─────────────────────────────────────────────────────────────┤
│  5. RESPONSE                                                │
│     Responder en route → arrived → on scene                   │
│     → RSP events: dispatch.en_route, arrival.confirmed        │
│     → Real-time ETA shared with all authorized participants   │
├─────────────────────────────────────────────────────────────┤
│  6. EVIDENCE                                                │
│     Bodycam, CCTV, photographs collected                      │
│     → Evidence objects sealed (chain of custody)              │
│     → Structured facts extracted (AI)                         │
├─────────────────────────────────────────────────────────────┤
│  7. COORDINATION                                            │
│     Police, insurance, recovery join per policy               │
│     → Each adds events to same incident object                │
│     → No duplicate case numbers                               │
├─────────────────────────────────────────────────────────────┤
│  8. RESOLUTION                                              │
│     Incident contained and resolved                           │
│     → RSP event: incident.resolved                            │
│     → Evidence packages finalized                             │
│     → Insurance claims initiated (linked to incident)         │
├─────────────────────────────────────────────────────────────┤
│  9. LEARNING                                                │
│     AI analyzes: response time breakdown, pattern links       │
│     → Trust scores updated                                    │
│     → Operational intelligence fed back to graph              │
│     → Recommendations for future prevention                   │
├─────────────────────────────────────────────────────────────┤
│  10. CLOSURE                                                │
│     Incident closed, evidence archived                        │
│     → RSP event: incident.closed                              │
│     → Audit trail preserved per retention policy              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Control Room Operations

The control room is the operational heart of a security company. Shield enhances it without replacing it.

### What Changes

| Today | With Shield |
|-------|-------------|
| Operator receives alarm from single source | Operator sees alarm with AI context: property history, false alarm rate, nearest resources |
| Operator calls response company by phone | System matches and dispatches nearest verified responder automatically; operator confirms |
| Operator manually logs incident | Incident auto-created with universal ID; all events logged automatically |
| Operator has no visibility after dispatch | Real-time GPS, ETA, arrival confirmation visible to operator |
| Evidence collected separately, days later | Evidence sealed at scene with chain of custody |
| No connection to related incidents | AI surfaces connected patterns in real time |

### What Doesn't Change

- Operator makes verification decisions
- Operator can override AI recommendations
- Company sets its own dispatch policies
- Company maintains its client relationships
- Company uses its existing alarm receiving equipment (via RSP adapter)

---

## 6. Data Sovereignty Model

```
┌──────────────────────────────────────────────┐
│           PARTICIPANT SOVEREIGN ZONE          │
│                                               │
│  Own people, assets, clients, policies        │
│  Own operational data                         │
│  Own commercial relationships                 │
│  Export anytime                               │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │         CONSENT-GOVERNED SHARING         │ │
│  │                                          │ │
│  │  Incident data → authorized participants │ │
│  │  Evidence → chain of custody holders     │ │
│  │  Aggregate stats → anonymized patterns   │ │
│  │  Trust scores → computed, transparent    │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │         RTN TRUST LAYER                  │ │
│  │                                          │ │
│  │  Identity · Audit · Signatures           │ │
│  │  Policy enforcement · Compliance         │ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

No participant can access another participant's sovereign data without explicit consent policy. RTN enforces this at the infrastructure layer.

---

## 7. Onboarding Model

### Phase 1 — Identity (Week 1)

- Register organization on RTN
- Verify licenses, insurance, certifications
- Register key personnel with roles
- Define initial data sharing policies

### Phase 2 — Integration (Weeks 2–4)

- Deploy RSP adapter for existing alarm/dispatch/CCTV systems
- Register assets (vehicles, cameras, bodycams) with RTN identities
- Register properties under protection
- Test event publishing and subscription

### Phase 3 — Operations (Weeks 4–8)

- Begin publishing live events to Shield
- Control room operators trained on AI decision support
- Dispatch matching activated
- Evidence collection with chain of custody

### Phase 4 — Network (Month 3+)

- Activate cross-participant policies (insurance, recovery, municipality)
- Join resource marketplace
- Contribute to and benefit from operational intelligence
- Trust score visible and improving

---

## 8. Commercial Model for Participants

Participants do not pay for "seats" or "cameras connected." They pay for coordination value.

| Fee Type | Trigger | Example |
|----------|---------|---------|
| Platform membership | Monthly | Base access to RTN identity, RSP, control room tools |
| Dispatch coordination | Per dispatch matched through Shield | Fee when Shield matches and coordinates a response |
| Evidence certification | Per evidence package sealed | Court-ready chain of custody certification |
| Cross-network intelligence | Monthly | AI pattern detection, connected incident alerts |
| Marketplace commission | Per resource exchange | Guard/vehicle rental through capacity exchange |
| API usage | Per event published/consumed | Third-party integrations beyond base allocation |
| Insurance integration | Per claim linked | Universal incident linking for insurers |

Pricing is designed so participants earn more from faster response, better evidence, and new business opportunities than they pay in platform fees.

---

## 9. Escalation Paths

Not every incident requires the same response. Shield supports configurable escalation:

```
Level 0: Sensor event → logged, no action
Level 1: Verified alarm → dispatch security response
Level 2: Confirmed threat → notify police per policy
Level 3: Active crime in progress → all-network alert, recovery activation
Level 4: Mass casualty / disaster → municipal emergency mode, all services
```

Each participant defines their own escalation policies. Shield enforces and coordinates — it does not dictate escalation decisions.

---

## 10. What Success Looks Like

For a security company on Shield after 12 months:

- Average response time reduced from 12 minutes to 4 minutes
- False alarm rate reduced through AI prioritization
- Evidence packages accepted in court without challenge
- Trust score in top quartile → new client acquisition
- Surge capacity handled through marketplace (no rejected clients)
- Connected incident detection preventing crimes before they escalate
- Operational costs visible per contract, per patrol, per response
- AI COO providing daily executive intelligence

For the ecosystem:

- Insurance claims processed in days, not weeks
- Recovery rate improved through cross-network coordination
- Police receive structured intelligence, not phone calls
- Municipalities operate with city-level operational awareness
- One universal incident language across all participants

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-07-20 | Initial draft |
