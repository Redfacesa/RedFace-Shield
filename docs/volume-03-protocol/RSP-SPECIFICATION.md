# Volume 3: The RedFace Shield Protocol (RSP)

**Status:** Draft v0.1  
**Authority:** Subordinate to [Volume 0](../volume-00-constitution/TRUST-CONSTITUTION.md) and [RTN](../architecture/TRUST-NETWORK.md)  
**Scope:** Open event standard for physical security interoperability

---

## 1. Purpose

The RedFace Shield Protocol (RSP) is the **common language** for physical security operations in Africa.

Today, every manufacturer speaks a different protocol. Every alarm system uses different formats. Every control room runs different software. Every tracking company exposes different APIs. Integration requires custom development for every pair of systems.

RSP replaces this fragmentation with one event standard. Integrate once. Communicate with everyone.

RSP is to physical security what:

- **HTTP** is to the web
- **SMTP** is to email
- **ISO 8583** is to card payments
- **FHIR** is to healthcare records

RSP is designed for adoption by third parties. RedFace hosts the reference implementation, but the protocol is open. Any security company, camera vendor, tracking platform, or insurer can publish and subscribe to RSP events without using RedFace software — though RTN trust services enhance every interaction.

---

## 2. Design Principles

1. **Event-driven** — everything that happens is an event
2. **Publish/subscribe** — participants publish events and subscribe to event types
3. **Signed** — every event carries a digital signature from its source identity
4. **Structured** — events carry typed payloads, not free text
5. **Idempotent** — event IDs prevent duplicate processing
6. **Versioned** — backward-compatible schema evolution
7. **Transport-agnostic** — RSP defines the event, not the wire protocol (MQTT, HTTP, WebSocket, gRPC supported)

---

## 3. Event Envelope

Every RSP event conforms to a standard envelope:

```yaml
rsp:
  version: "1.0"
  event:
    id: RF-EVT-2026-000001          # Globally unique event ID
    type: rsp.alarm.raised           # Namespaced event type
    timestamp: "2026-07-20T14:32:00+02:00"  # ISO-8601
    source:
      identity: RF-AST-2026-000789   # RTN identity of publisher
      organization: RF-ORG-2026-000001
    incident: RF-2026-ZA-CPT-000123456  # Universal incident ID (optional)
    correlation: RF-EVT-2026-000000  # Parent event ID (optional)
    payload: { ... }                 # Type-specific structured data
    signature: "base64..."           # Digital signature over event body
    ledger_ref: RF-LGR-2026-000001   # Audit ledger entry (assigned by RTN)
```

### Envelope Rules

- `id` is assigned by the publisher and must be globally unique
- `type` follows the namespace convention: `rsp.<domain>.<action>`
- `timestamp` is the time the event occurred, not when it was transmitted
- `source.identity` must be a verified RTN identity
- `signature` is required — unsigned events are rejected
- `incident` links the event to a universal incident (assigned at first event or explicitly)
- `correlation` links derived events to their triggering event

---

## 4. Event Namespaces

RSP events are organized into namespaces by operational domain.

### 4.1 `rsp.motion.*` — Motion and Detection

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.motion.detected` | Motion detected by sensor or camera | location, zone, confidence, media_ref |
| `rsp.motion.cleared` | Motion zone cleared | location, zone, duration |

### 4.2 `rsp.alarm.*` — Alarm Events

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.alarm.raised` | Alarm triggered | property, zone, alarm_type, panel_id |
| `rsp.alarm.verified` | Operator verified alarm as genuine | operator, verification_method, notes |
| `rsp.alarm.false` | Alarm determined to be false | operator, reason, false_alarm_category |
| `rsp.alarm.silenced` | Alarm silenced by authorized party | operator, reason, duration |
| `rsp.alarm.canceled` | Alarm canceled (e.g., user disarm) | operator, method |

### 4.3 `rsp.access.*` — Access Control

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.access.granted` | Access granted | person, method, gate/door, direction |
| `rsp.access.denied` | Access denied | person, method, reason |
| `rsp.access.forced` | Forced entry detected | location, sensor, method |
| `rsp.visitor.arrived` | Visitor checked in | visitor, host, purpose |
| `rsp.visitor.departed` | Visitor checked out | visitor, duration |

### 4.4 `rsp.vehicle.*` — Vehicle Events

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.vehicle.seen` | Vehicle detected (ANPR, camera, tracking) | plate, make, model, color, location, direction, confidence |
| `rsp.vehicle.stolen` | Vehicle reported stolen | plate, vin, owner, tracking_device |
| `rsp.vehicle.recovered` | Vehicle recovered | plate, location, condition, recovery_team |
| `rsp.vehicle.flagged` | Vehicle flagged for monitoring | plate, reason, requesting_org, expiry |

### 4.5 `rsp.dispatch.*` — Dispatch and Response

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.dispatch.requested` | Dispatch request created | incident, resource_type, count, priority, location |
| `rsp.dispatch.accepted` | Responder accepted dispatch | responder_org, responder_person, resource, eta |
| `rsp.dispatch.rejected` | Responder rejected dispatch | responder_org, reason |
| `rsp.dispatch.en_route` | Responder en route | resource, person, eta, route |
| `rsp.dispatch.arrived` | Responder arrived on scene | resource, person, location, timestamp |
| `rsp.dispatch.completed` | Response completed | resource, person, outcome, duration |
| `rsp.dispatch.canceled` | Dispatch canceled | reason, canceled_by |

### 4.6 `rsp.evidence.*` — Evidence and Chain of Custody

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.evidence.created` | Evidence object created | evidence_id, type, device, operator, hash, location |
| `rsp.evidence.accessed` | Evidence accessed | evidence_id, accessor, purpose |
| `rsp.evidence.transferred` | Custody transferred | evidence_id, from_org, to_org, reason |
| `rsp.evidence.certified` | Evidence certified for legal use | evidence_id, certifier, standard |
| `rsp.evidence.extracted` | Structured facts extracted | evidence_id, observations[] |

### 4.7 `rsp.incident.*` — Incident Lifecycle

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.incident.created` | New incident opened | incident_id, type, priority, location |
| `rsp.incident.updated` | Incident metadata updated | incident_id, fields_changed |
| `rsp.incident.escalated` | Incident escalated | incident_id, new_level, reason |
| `rsp.incident.contained` | Threat contained | incident_id, contained_by |
| `rsp.incident.resolved` | Incident resolved | incident_id, outcome, resolution_type |
| `rsp.incident.closed` | Incident closed | incident_id, closed_by, summary |
| `rsp.incident.linked` | Incidents linked as related | incident_id, linked_incident_id, reason, confidence |

### 4.8 `rsp.recovery.*` — Recovery Operations

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.recovery.dispatched` | Recovery team dispatched | incident, team, vehicle, eta |
| `rsp.recovery.tracking` | Active tracking update | vehicle, location, speed, direction |
| `rsp.recovery.success` | Asset recovered | vehicle/asset, location, condition |
| `rsp.recovery.failed` | Recovery attempt failed | vehicle/asset, reason |

### 4.9 `rsp.state.*` — Operational State Changes

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.state.changed` | Any entity state transition | entity_id, entity_type, from_state, to_state, reason |
| `rsp.state.heartbeat` | Periodic alive signal | entity_id, health_metrics |
| `rsp.state.tamper` | Tamper detected on device | entity_id, tamper_type, location |
| `rsp.state.offline` | Entity went offline | entity_id, last_seen, reason |
| `rsp.state.online` | Entity came online | entity_id, health_metrics |

### 4.10 `rsp.insurance.*` — Insurance Integration

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.insurance.claim.opened` | Claim opened for incident | incident_id, claim_id, insurer, policy |
| `rsp.insurance.claim.updated` | Claim status update | claim_id, status, notes |
| `rsp.insurance.claim.closed` | Claim closed | claim_id, outcome, settlement |

### 4.11 `rsp.payment.*` — Economic Events

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.payment.dispatched` | Payment for dispatch service | incident, payer, payee, amount, currency |
| `rsp.payment.marketplace` | Marketplace resource exchange payment | resource, provider, consumer, amount |
| `rsp.payment.invoice` | Invoice generated | org, period, line_items[], total |

### 4.12 `rsp.emergency.*` — Non-Security Emergencies

| Event Type | Description | Key Payload Fields |
|------------|-------------|-------------------|
| `rsp.emergency.fire` | Fire detected/reported | location, severity, property |
| `rsp.emergency.medical` | Medical emergency | location, severity, patient_count |
| `rsp.emergency.flood` | Flood event | location, severity, affected_area |
| `rsp.emergency.missing_person` | Missing person report | person, last_seen, description |

---

## 5. Payload Schemas

Each event type defines a structured payload. Example:

### `rsp.alarm.raised`

```yaml
payload:
  property: RF-PROP-2026-000042
  zone: "Kitchen"
  alarm_type: intrusion  # intrusion | panic | fire | medical | duress
  panel: RF-AST-2026-000123
  sensor: RF-AST-2026-000456
  severity: high  # critical | high | medium | low
  raw_signal:  # optional — original signal from alarm panel
    protocol: contact_id
    account: "1234"
    code: "130"
```

### `rsp.vehicle.seen`

```yaml
payload:
  plate:
    full: "CA 123 456 GP"       # if fully read
    partial: "CA *** 456 GP"    # if partially read
    confidence: 0.94
  vehicle:
    make: Toyota
    model: Hilux
    color: white
    type: bakkie
  location:
    point: { lat: -33.9249, lon: 18.4241 }
    address: "N2 Highway, Cape Town"
    direction: north
    speed_kmh: 87
  source:
    type: anpr  # anpr | camera | tracking | manual
    device: RF-AST-2026-000789
  linked_incident: RF-2026-ZA-CPT-000123456  # if matched to active incident
```

### `rsp.evidence.created`

```yaml
payload:
  evidence_id: RF-EVD-2026-000001
  type: video  # video | audio | photograph | document | sensor_log
  device: RF-AST-2026-000789
  operator: RF-PER-2026-000042
  location: { lat: -33.9249, lon: 18.4241 }
  duration_seconds: 342
  hash: "sha256:a1b2c3..."
  hash_algorithm: SHA-256
  media:
    storage_ref: "s3://evidence/RF-EVD-2026-000001"
    format: mp4
    resolution: "1920x1080"
    size_bytes: 157286400
  incident: RF-2026-ZA-CPT-000123456
```

---

## 6. Publish/Subscribe Model

Participants declare subscriptions to event types. RTN policy engine filters delivery.

### Subscription Declaration

```yaml
subscription:
  subscriber: RF-ORG-2026-000001
  events:
    - type: "rsp.alarm.raised"
      filter:
        geofence: RF-ZONE-2026-000010  # only alarms in this zone
    - type: "rsp.vehicle.seen"
      filter:
        linked_incident: active  # only vehicles linked to my active incidents
    - type: "rsp.dispatch.requested"
      filter:
        resource_type: armed_response
        max_distance_km: 15
  delivery:
    endpoint: "https://api.example.com/rsp/events"
    protocol: webhook  # webhook | mqtt | websocket | grpc
    retry: exponential_backoff
```

### Routing Rules

1. Event published by authenticated identity
2. RTN verifies signature and appends to ledger
3. Policy engine evaluates all subscriptions
4. Authorization checked for each potential recipient
5. Event delivered to authorized subscribers
6. Delivery confirmation logged

---

## 7. Incident Correlation

Events become incidents through correlation rules:

### Automatic Correlation

- First `alarm.raised` or `emergency.*` event on a property → new incident created
- `vehicle.stolen` → new incident, recovery participants auto-subscribed per policy
- Multiple `alarm.raised` events in same geofence within time window → may be linked

### Manual Correlation

- Operator links events to existing incident
- AI suggests links based on graph similarity (vehicle, time, location, method)
- `rsp.incident.linked` event records the connection with reason and confidence

### Universal Incident ID Assignment

```
First event with no incident reference
  → RTN assigns: RF-2026-ZA-CPT-000123456
  → rsp.incident.created event published
  → All subsequent correlated events reference this ID
```

---

## 8. Transport Bindings

RSP defines the event format. Transport is pluggable:

| Binding | Use Case | Characteristics |
|---------|----------|-----------------|
| **HTTP Webhook** | Control room integrations, insurance systems | Simple, request-response, retry via HTTP codes |
| **MQTT** | IoT devices, cameras, sensors | Lightweight, pub/sub, offline queuing |
| **WebSocket** | Real-time control room dashboards | Persistent connection, low latency |
| **gRPC** | High-throughput service integrations | Typed, streaming, efficient |
| **Edge Queue** | Offline-capable devices | Local queue, sync on reconnect |

All transports carry the same RSP event envelope. Transport choice is an integration decision, not a protocol decision.

---

## 9. Versioning

RSP follows semantic versioning:

- **Major** — breaking changes to envelope or event types (migration required)
- **Minor** — new event types or optional payload fields (backward compatible)
- **Patch** — documentation, clarifications (no schema change)

Current version: **1.0-draft**

Participants declare supported RSP version in their RTN identity. RTN translates between versions when necessary.

---

## 10. Certification

Third parties can certify RSP compatibility:

| Level | Requirement |
|-------|-------------|
| **RSP Publisher** | Can publish events with valid signatures |
| **RSP Subscriber** | Can receive and process events |
| **RSP Full** | Publish and subscribe with policy compliance |
| **RSP Certified** | Full + passed interoperability test suite |

Certification is administered by RedFace with provision for independent testing authorities.

"Works with RedFace Shield" mark granted at RSP Full level or above.

---

## 11. Example: Hijacking Flow in RSP

```
T+0s    Tracking company detects unauthorized movement
        → rsp.vehicle.stolen { plate: "CA 123 456 GP", tracking_device: ... }
        → RTN creates incident: RF-2026-ZA-CPT-000123456
        → rsp.incident.created { type: hijacking, priority: critical }

T+2s    Policy: notify recovery companies in geofence
        → rsp.recovery.dispatched { team: RF-ORG-2026-000050, eta: 8min }

T+5s    Policy: notify all ANPR systems to search
        → Subscribers receive vehicle.flagged { plate: "CA 123 456 GP" }

T+45s   Municipal traffic camera detects vehicle
        → rsp.vehicle.seen { plate: "CA 123 456 GP", location: N2 north, speed: 140 }
        → Auto-linked to RF-2026-ZA-CPT-000123456

T+60s   AI predicts escape route, notifies security companies along route
        → rsp.dispatch.requested { type: intercept, location: route_prediction }

T+3m    Security company accepts intercept dispatch
        → rsp.dispatch.accepted { responder: RF-ORG-2026-000010, eta: 4min }

T+8m    Recovery team arrives at last known location
        → rsp.dispatch.arrived { team: RF-ORG-2026-000050 }

T+12m   Vehicle spotted by shopping centre ANPR
        → rsp.vehicle.seen { plate: "CA 123 456 GP", location: Canal Walk }

T+18m   Vehicle recovered
        → rsp.recovery.success { vehicle: "CA 123 456 GP", location: Milnerton }
        → rsp.incident.resolved { outcome: recovered, duration: 18min }

T+20m   Insurance claim opened
        → rsp.insurance.claim.opened { incident: RF-2026-ZA-CPT-000123456 }

All events: signed, ledgered, linked to one incident, visible to authorized participants.
Zero phone calls. Zero duplicate case numbers. Complete audit trail.
```

---

## 12. Relationship to RTN

| RSP Responsibility | RTN Responsibility |
|--------------------|--------------------|
| Event format and vocabulary | Identity of event publisher |
| Event type definitions | Signature verification |
| Payload schemas | Authorization for publish/subscribe |
| Publish/subscribe routing | Policy enforcement on delivery |
| Version management | Audit ledger append |
| Transport bindings | Consent management |
| Certification program | Compliance enforcement |

RSP events flow through RTN trust services. An RSP event without a valid RTN signature is rejected. An RSP subscription without RTN policy authorization is not delivered.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-07-20 | Initial draft — RSP 1.0 event vocabulary |
