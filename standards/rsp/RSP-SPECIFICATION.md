# RSP Specification

> **DRAFT — Wave 3.** Do not publish until reference customer evidence exists and integrators ask how to connect.

**Publishing wave:** 3 — internal draft only  

## 1. Purpose

RSP is an **open event protocol** for operational coordination.

It defines how independent organizations publish structured, signed events — camera detections, dispatch acknowledgements, GPS updates, evidence creation — so that control rooms, insurers, and responders can coordinate without custom pairwise integrations.

RSP is transport-agnostic. The same envelope works over HTTP, MQTT, WebSocket, or gRPC.

---

## 2. Design Principles

1. **Event-driven** — everything operational is an event  
2. **Immutable** — events are never edited; corrections supersede  
3. **Signed** — every event carries source identity  
4. **Structured** — typed payloads, not free text  
5. **Versioned** — event types include explicit version suffix  
6. **Mission-scoped** — events attach to missions when applicable  

---

## 3. Envelope

```json
{
  "rspVersion": "1.0.0",
  "type": "rsp.camera.motion.detected.v1",
  "missionUri": "rtn://mission/CPT-2026-000001",
  "intentUri": "rtn://intent/CPT-2026-HIJACK-001",
  "source": {
    "uri": "rtn://camera/CAM-PARKING-12",
    "organizationUri": "rtn://organization/mall-demo"
  },
  "payload": {
    "zone": "Parking Level B2",
    "confidence": 0.94
  },
  "occurredAt": "2026-07-20T08:36:41+02:00",
  "signature": "base64..."
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `rspVersion` | Yes | Protocol version — `1.0.0` |
| `type` | Yes | Namespaced event type with version |
| `source` | Yes | Publisher identity — RTN URIs |
| `payload` | Yes | Type-specific structured data |
| `occurredAt` | Yes | ISO-8601 — when it happened |
| `missionUri` | No | Mission context |
| `intentUri` | No | Originating intent |
| `signature` | Recommended | Digital signature over canonical body |

Object addresses use [RTN URI](../rtn/RTN-URI-SPECIFICATION.md).

---

## 4. Event Type Naming

```text
rsp.{domain}.{action}.v{N}
```

Examples:

```text
rsp.camera.motion.detected.v1
rsp.gps.location.updated.v1
rsp.guard.checkin.v1
rsp.alarm.panic.v1
rsp.evidence.uploaded.v1
rsp.dispatch.acknowledged.v1
rsp.dispatch.accepted.v1
rsp.mission.completed.v1
```

Once `.v1` is released, it is **immutable**. See [Compatibility Promise](../COMPATIBILITY-PROMISE.md).

---

## 5. Registered Event Types (v1.0)

### Detection

| Type | Payload (required fields) |
|------|----------------------------|
| `rsp.camera.motion.detected.v1` | `zone` or `region` |
| `rsp.alarm.panic.v1` | `location` or `zone` |

### Tracking

| Type | Payload (required fields) |
|------|----------------------------|
| `rsp.gps.location.updated.v1` | `lat`, `lon` |

### Personnel

| Type | Payload (required fields) |
|------|----------------------------|
| `rsp.guard.checkin.v1` | `status` |

### Dispatch

| Type | Payload (required fields) |
|------|----------------------------|
| `rsp.dispatch.acknowledged.v1` | `accepted` (boolean) |
| `rsp.dispatch.accepted.v1` | `etaMinutes` (optional) |
| `rsp.dispatch.en_route.v1` | — |
| `rsp.dispatch.arrived.v1` | — |

### Evidence

| Type | Payload (required fields) |
|------|----------------------------|
| `rsp.evidence.uploaded.v1` | `hash`, `mediaType` |
| `rsp.evidence.created.v1` | `hash`, `type` |

### Mission lifecycle

| Type | Payload (required fields) |
|------|----------------------------|
| `rsp.intent.declared.v1` | `statement` |
| `rsp.mission.created.v1` | `title` |
| `rsp.mission.completed.v1` | `result`, `summary` |

Additional types register via [Version Policy](../VERSION-POLICY.md) minor releases.

---

## 6. Supersession

Erroneous events are corrected by publishing a new event that references the original. The original remains in history.

```json
{
  "type": "rsp.event.superseded.v1",
  "payload": {
    "supersedes": "rtn://event/evt-original",
    "reason": "Incorrect plate number"
  }
}
```

Events MUST NOT be deleted or mutated in place.

---

## 7. Publishing

### HTTP (reference)

```http
POST /rsp/events
Content-Type: application/json

{ envelope }
```

### SDK (reference)

```typescript
import { RspPublisher } from '@redface/rsp';

await rsp.publish({
  type: 'rsp.camera.motion.detected.v1',
  mission: 'rtn://mission/CPT-2026-000001',
  source: { uri: 'rtn://camera/CAM-12', organizationUri: 'rtn://organization/acme' },
  payload: { zone: 'B2', confidence: 0.92 },
});
```

Adapters translate vendor formats → RSP. Adapters do not embed business logic.

---

## 8. Conformance

An implementation is **RSP conformant** if it:

- Publishes valid envelopes with required fields  
- Uses RTN URIs for all identity references  
- Uses versioned event types  
- Does not mutate published events  
- Passes certification test suite  

See [Certification Program](../certification/CERTIFICATION-PROGRAM.md).

---

## 9. Relationship to RedFace Platform

RSP is **open**. Any system may publish conformant events.

RedFace Platform provides mission orchestration, policy, playback, and cross-organization coordination — proprietary capabilities that **consume** RSP events.

See [Open Boundary](../OPEN-BOUNDARY.md).
