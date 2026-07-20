# Volume 2: The Operational Graph Specification

**Status:** Draft v0.3  
**Authority:** Subordinate to [Volume −1](../volume-minus-1-philosophy/PHILOSOPHY.md), [Volume 0.5](../volume-0.5-principles/PRINCIPLES.md), [Volume 0](../volume-00-constitution/TRUST-CONSTITUTION.md), and [RTN](../architecture/TRUST-NETWORK.md)  
**Scope:** Canonical domain model for all RedFace applications

---

## 1. Purpose

The Operational Graph is the canonical data model for the RedFace platform. It is not a database technology choice. It is an architectural abstraction — a semantic, connected model in which every object, mission, event, relationship, permission, and policy exists as part of one graph.

Traditional security software stores incidents in one table, cameras in another, guards in another, and companies in another. Relationships are reconstructed at query time through foreign keys. Intelligence is an afterthought.

The Operational Graph inverts this. **Missions are the organizing center.** Relationships are first-class. Intelligence is the natural output of traversing the graph.

---

## 2. Design Principles

1. **Intent precedes mission** — every operation begins with declared intent
2. **Missions organize execution** — resources, events, evidence attach to missions
3. **Capabilities match before companies** — missions query capabilities, not company names
4. **Everything is a node or an edge** — no orphan data
5. **Everything is identified** — every node has an RTN identity
6. **Everything has state** — state is first-class, not inferred from timestamps
7. **Everything emits events** — state changes produce signed RSP events on mission timelines
8. **Everything is permissioned** — edges encode authorization context
9. **Nothing is deleted** — deactivation, archival, and correction via new events

---

## 3. Node Types

### 3.0 Intent

The first operational object. See [Operational Loop](../volume-0.5-principles/OPERATIONAL-LOOP.md).

```yaml
Intent:
  id: RF-INT-2026-000001
  statement: "Recover vehicle CA 123 456 GP safely"
  expressed_by: OrganizationRef | PersonRef
  context: EventRef | PropertyRef | OrderRef (optional)
  priority: critical | high | medium | low
  state: declared | accepted | mission_created | fulfilled | failed | withdrawn
  mission: MissionRef (optional, set when mission created)
  created_at: timestamp
```

### 3.1 Mission

The central organizing node. See [Theory of Missions](../volume-0.5-principles/THEORY-OF-MISSIONS.md) for full specification.

```yaml
Mission:
  id: RF-MSN-2026-ZA-CPT-000001
  type: recover_vehicle | contain_fire | deliver_order | escort_vip | patrol_zone | ...
  title: string
  priority: critical | high | medium | low
  state: planning | active | paused | completed | failed | canceled
  trigger_event: EventRef
  intent: IntentRef  # intent that created this mission
  incident_ref: RF-2026-ZA-CPT-000123456  # optional universal incident ID
  owner: OrganizationRef
  objectives: [ObjectiveRef]
  resources: [ResourceAllocationRef]
  participants: [ParticipantRef]
  timeline: [EventRef]
  evidence: [EvidenceRef]
  outcome: OutcomeRef (optional)
  created_at: timestamp
  completed_at: timestamp (optional)
```

### 3.2 Organization

A legal or operational entity participating in the network.

```yaml
Organization:
  id: RF-ORG-2026-000001
  type: security_company | insurer | recovery | municipality | police | property_manager | ...
  name: string
  jurisdiction: ISO-3166-2
  licenses: [Certificate]
  capabilities: [CapabilityRef]  # what the org can do, not just what it owns
  trust_score: TrustScore
  state: operational | overloaded | understaffed | emergency_mode | suspended
  policies: [PolicyRef]
  contacts: [ContactRef]
  created_at: timestamp
  verified_at: timestamp
```

### 3.3 Capability

What an organization can do — matched by missions, not company name.

```yaml
Capability:
  id: RF-CAP-2026-000001
  type: armed_response | vehicle_recovery | cctv_monitoring | drone_operations |
        k9_unit | medical_response | forensic_collection | cyber_investigation | ...
  organization: OrganizationRef
  verified: boolean
  certifications: [CertificateRef]
  coverage_zones: [ZoneRef]
  availability: derived from Resource Engine state
  trust_score: TrustScore  # capability-specific performance
```

### 3.4 Person

A human operator in the network.

```yaml
Person:
  id: RF-PER-2026-000001
  name: string
  roles: [guard | dispatcher | supervisor | investigator | admin | ...]
  employer: OrganizationRef
  certifications: [Certificate]
  training_records: [TrainingRecord]
  trust_score: TrustScore
  state: available | busy | off_duty | emergency | training | offline
  location: GeoPoint (when on duty, with consent)
  equipment: [AssetRef]
  created_at: timestamp
  verified_at: timestamp
```

### 3.5 Asset

A physical resource owned or operated by a participant.

```yaml
Asset:
  id: RF-AST-2026-000001
  type: vehicle | camera | drone | bodycam | alarm_panel | sensor | motorcycle | dog_unit | ...
  owner: OrganizationRef
  operator: PersonRef (optional)
  manufacturer: string
  model: string
  serial: string
  location: GeoPoint | FixedLocation
  trust_score: TrustScore
  state: <type-specific — see Section 4>
  health: HealthMetrics
  maintenance: MaintenanceSchedule
  created_at: timestamp
  verified_at: timestamp
```

### 3.6 Property

A physical location under protection or management.

```yaml
Property:
  id: RF-PROP-2026-000001
  type: residential | commercial | estate | retail | industrial | municipal | ...
  address: StructuredAddress
  geofence: GeoPolygon
  owner: OrganizationRef | PersonRef
  manager: OrganizationRef (optional)
  coverage: [AssetRef]  # cameras, sensors, alarm panels
  insurance: [InsurancePolicyRef]
  state: protected | unprotected | alarm_active | maintenance
  created_at: timestamp
```

### 3.7 Incident

A triggering or reference event collection — **not** the operational center of the graph. Incidents provide universal identifiers for legal, insurance, and cross-org reference. Missions orchestrate the operational response.

```yaml
Incident:
  id: RF-2026-ZA-CPT-000123456  # Universal Incident ID
  type: burglary | hijacking | fire | medical | flood | missing_person | ...
  mission: MissionRef  # primary mission orchestrating response
  state: open | investigating | responding | contained | resolved | closed
  location: GeoPoint
  property: PropertyRef (optional)
  events: [EventRef]
  created_at: timestamp
  closed_at: timestamp (optional)
```

### 3.8 Evidence

A cryptographically secured record of operational proof.

```yaml
Evidence:
  id: RF-EVD-2026-000001
  type: video | audio | photograph | document | sensor_log | ...
  origin_device: AssetRef
  origin_operator: PersonRef
  incident: IncidentRef (optional)
  location: GeoPoint
  timestamp: timestamp
  duration: duration (optional)
  hash: SHA-256
  signature: DigitalSignature
  chain_of_custody: [CustodyTransfer]
  state: sealed | accessed | transferred | certified | submitted
  access_log: [AccessEvent]
  created_at: timestamp
```

### 3.9 Zone

A geographic or logical area for operational purposes.

```yaml
Zone:
  id: RF-ZONE-2026-000001
  type: patrol_area | response_zone | geofence | city | district | ...
  boundary: GeoPolygon
  assigned: [OrganizationRef | PersonRef]
  state: normal | elevated | lockdown | emergency
  parent: ZoneRef (optional — hierarchical)
```

---

## 4. State Models

State is first-class. Every node type has a defined state machine. State transitions produce RSP events.

### 4.1 Person States

```
                    ┌──────────┐
         ┌─────────►│ Available │◄─────────┐
         │          └─────┬────┘           │
         │                │                │
    ┌────┴────┐     ┌─────▼────┐     ┌────┴────┐
    │ Off Duty │     │   Busy   │     │Training │
    └─────────┘     └─────┬────┘     └─────────┘
                          │
                    ┌─────▼────┐
                    │Emergency │
                    └──────────┘
                          │
                    ┌─────▼────┐
                    │ Offline  │
                    └──────────┘
```

### 4.2 Vehicle States

```
Available ◄──► Driving ◄──► Responding
    │              │
    ▼              ▼
Maintenance    Fuel Low
```

### 4.3 Camera States

```
Healthy ◄──► Recording
  │    │
  ▼    ▼
Offline  Tampered
  │
  ▼
Maintenance
```

### 4.4 Organization States

```
Operational ◄──► Overloaded
      │               │
      ▼               ▼
Understaffed    Emergency Mode
```

### 4.5 Incident States

```
Open → Investigating → Responding → Contained → Resolved → Closed
```

Every state transition:

1. Is authenticated (who changed it)
2. Is authorized (policy permits the transition)
3. Produces an RSP event
4. Is appended to the audit ledger
5. May trigger notifications to graph-connected participants

---

## 5. Edge Types (Relationships)

Relationships are typed, directed, and permissioned.

| Edge | From | To | Meaning |
|------|------|----|---------|
| `expresses` | Person/Organization | Intent | Intent declared |
| `fulfills` | Intent | Mission | Intent became mission |
| `requires` | Mission | Capability | Capability needed for mission |
| `provides` | Organization | Capability | Org registers capability |
| `triggers` | Event | Intent | Event that prompted intent |
| `orchestrates` | Mission | Objective | Mission owns objectives |
| `allocates` | Mission | Asset/Person | Resource assigned to mission |
| `involves` | Mission | Organization | Participant in mission |
| `contains` | Mission | Event | Event on mission timeline |
| `collects` | Mission | Evidence | Evidence gathered during mission |
| `references` | Mission | Incident | Link to universal incident ID |
| `employs` | Organization | Person | Employment relationship |
| `owns` | Organization | Asset | Ownership |
| `operates` | Person | Asset | Current operator (vehicle, drone) |
| `protects` | Organization | Property | Security contract |
| `covers` | Asset | Property | Camera/sensor coverage |
| `insures` | Organization | Property | Insurance policy |
| `responded_to` | Organization | Incident | Response participation |
| `assigned_to` | Person | Incident | Individual assignment |
| `dispatched` | Asset | Incident | Resource dispatch |
| `contains` | Incident | Event | Event membership |
| `linked_to` | Incident | Incident | Suspected connection |
| `custody_of` | Organization | Evidence | Chain of custody holder |
| `investigated_by` | Organization | Incident | Investigation authority |
| `patrols` | Person | Zone | Patrol assignment |
| `subscribes_to` | Organization | EventType | RSP subscription |
| `shares_with` | Organization | Organization | Consent-based data sharing |
| `certified_by` | Certificate | Organization | Verification attestation |

Edges carry metadata:

```yaml
Edge:
  type: employs
  from: RF-ORG-2026-000001
  to: RF-PER-2026-000042
  since: 2024-03-15
  role: armed_response_officer
  authorized_by: RF-POL-2026-000001
  active: true
```

---

## 6. Events in the Graph

Events are not stored separately from the graph. They are **temporal edges** — connections between nodes at a point in time.

```yaml
Event:
  id: RF-EVT-2026-000001
  type: rsp.alarm.raised | rsp.dispatch.accepted | rsp.evidence.created | ...
  timestamp: ISO-8601
  source: IdentityRef  # who/what produced this event
  incident: IncidentRef (optional)
  payload: EventPayload  # type-specific structured data
  signature: DigitalSignature
  ledger_ref: LedgerEntryRef
```

Events attach to the graph by connecting nodes:

```
[Alarm Panel] ──triggered──► [Event: alarm.raised] ──at──► [Property]
                                    │
                                    ├──assigned──► [Incident: RF-2026-ZA-CPT-000123456]
                                    │
                                    └──verified_by──► [Person: Dispatcher #12]
```

---

## 7. The Security Knowledge Graph

Intelligence operates by traversing relationships, not by querying tables.

### Example: Connected Burglary Pattern

```
Query: Find incidents connected to burglary #RF-2026-ZA-CPT-000123456

Traverse:
  Incident → at → Property (estate A)
  Incident → contains → Event (vehicle seen: white Toyota)
  Event → similar_to → Event (vehicle seen: white Toyota) in Incident #000123450
  Incident #000123450 → at → Property (estate B, 2km from A)
  Both incidents → contains → Event (entry: west gate, forced)
  Both incidents → during → TimeWindow (Tuesday, 18:00-20:00)
  Vehicle → linked_to → VehicleProfile (partial plate, direction north)

Result: 2 incidents likely connected. Recommend increased patrols
         in geofence covering estates A, B, and C on Tuesday evenings.
```

This is not a SQL JOIN. It is semantic traversal of the Operational Graph.

### Example: Guard Performance Context

```
Query: Best guard for retail incident at Mall X?

Traverse:
  Incident → at → Property (Mall X, type: retail)
  Person → responded_to → [Incidents at retail properties]
  Person → trust_score → response metrics
  Person → state → available
  Person → operates → Asset (vehicle, ETA to Mall X)
  Person → employs ← Organization (verified, insured)

Result: Guard #204, 4m estimated ETA, 96% retail success rate,
         currently available, 1.2km from Mall X.
```

---

## 8. Structured Operational Facts

The graph stores structured facts, not raw media, as the primary intelligence substrate.

Instead of storing a 30-minute video, the graph stores:

```yaml
Observation:
  incident: RF-2026-ZA-CPT-000123456
  timestamp: 2026-07-15T19:42:00+02:00
  source: RF-AST-2026-000789  # camera
  facts:
    - subject: person
      attributes: { gender: male, clothing: "blue hoodie", height_cm: 178 }
      action: entered
      location: west_gate
      duration_minutes: 6
      confidence: 0.97
    - subject: vehicle
      attributes: { type: "white Polo", plate_partial: "CA *** GP" }
      action: departed
      direction: north
      confidence: 0.91
  evidence_ref: RF-EVD-2026-000042  # link to sealed video
```

Millions of videos become millions of searchable facts. AI extracts facts; the graph connects them.

---

## 9. Permissions on the Graph

Every node and edge carries visibility rules enforced by RTN:

| Scope | Visibility |
|-------|------------|
| **Own nodes** | Full access to organization's own people, assets, properties |
| **Connected nodes** | Access governed by consent policy between participants |
| **Incident nodes** | Access for all participants with active role in incident |
| **Evidence nodes** | Access governed by chain of custody and legal hold |
| **Aggregate queries** | Anonymized patterns without individual identification |
| **Public nodes** | Municipality zones, public camera health — per policy |

Graph traversal respects permissions. A query cannot leak data across policy boundaries by following edges into unauthorized subgraphs.

---

## 10. Graph Operations

Standard operations on the Operational Graph:

| Operation | Description |
|-----------|-------------|
| `resolve(id)` | Retrieve node by RTN identity |
| `traverse(start, edge_type, depth)` | Walk relationships from a node |
| `match(pattern)` | Find subgraphs matching a pattern |
| `connect(from, edge_type, to)` | Create a permissioned relationship |
| `emit(event)` | Record an event and update state |
| `state(node)` | Current state of a node |
| `history(node, time_range)` | State and event history |
| `similarity(node, criteria)` | Find structurally similar nodes |
| `aggregate(zone, metrics, time_range)` | Compute operational metrics over a subgraph |

These are conceptual operations. Implementation may use graph databases, event stores, and search engines in combination — but the model is always the graph.

---

## 11. Extension to Other Verticals

The Operational Graph is vertical-agnostic. The same node and edge types support:

| Application | Additional Node Types | Additional Edge Types |
|-------------|----------------------|----------------------|
| **Shield** | (defined above) | (defined above) |
| **Rescue** | Ambulance, Hospital, Patient | transports, treats, admits |
| **Fleet** | Cargo, Route, Depot | carries, delivers, routes |
| **Utility** | GridNode, Outage, Technician | maintains, restores, monitors |
| **City** | TrafficSignal, Shelter, Hydrant | manages, coordinates, alerts |

New verticals extend the graph; they do not replace it.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-07-20 | Initial draft |
| 0.2 | 2026-07-20 | Mission as central organizing node |
| 0.3 | 2026-07-20 | Intent and Capability nodes; intent precedes mission |
