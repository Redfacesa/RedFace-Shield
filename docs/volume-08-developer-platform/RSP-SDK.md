# RSP SDK

**Package:** `@redface/rsp`  
**Version:** 1.0.0  
**Authority:** Subordinate to [RSP Specification](../volume-03-protocol/RSP-SPECIFICATION.md) and Architecture v1.0  

---

## Purpose

Every integration — Hikvision, Dahua, Axis, Ajax, simulators, internal tools — publishes events through the **same SDK**.

Adapters translate vendor formats to RSP. They do not invent their own envelope, HTTP client, or versioning scheme.

**Build the SDK before the adapter.**

---

## Compatibility Rule

RSP event types are **immutable once released**.

Never change an event type incompatibly. Add a new version:

```text
rsp.camera.motion.detected.v1   ← frozen
rsp.camera.motion.detected.v2   ← new fields, adapters upgrade independently
```

Consumers accept both until v1 is deprecated with notice.

---

## Usage

### In-process (simulator, tests, kernel scripts)

```typescript
import { RspPublisher } from '@redface/rsp';

const rsp = new RspPublisher({
  publish: (input) => kernel.events.publish(input),
});

await rsp.publish({
  type: 'rsp.camera.motion.detected.v1',
  mission: 'rtn://mission/CPT-2026-000001',
  source: { uri: 'rtn://resource/CAM-PARKING-12', organizationUri: 'rtn://organization/mall-demo' },
  payload: { zone: 'Parking Level B2', confidence: 0.92 },
});
```

### HTTP (adapters, external systems)

```typescript
const rsp = new RspPublisher({ baseUrl: 'http://localhost:3000' });

await rsp.publish({
  type: 'rsp.gps.location.updated.v1',
  mission: missionUri,
  source: guardRef,
  payload: { lat: -33.918, lon: 18.423 },
});
```

Posts to `POST /rsp/events` on kernel API.

---

## Event Type Registry (v1)

| Type | Domain |
|------|--------|
| `rsp.camera.motion.detected.v1` | Camera |
| `rsp.gps.location.updated.v1` | Tracking |
| `rsp.guard.checkin.v1` | Personnel |
| `rsp.alarm.panic.v1` | Alarm |
| `rsp.evidence.uploaded.v1` | Evidence |
| `rsp.dispatch.acknowledged.v1` | Dispatch |

Legacy kernel events (`rsp.dispatch.accepted`, etc.) remain supported. New integrations use versioned types.

---

## Envelope

Every published event includes:

```typescript
{
  rspVersion: '1.0.0',
  type: 'rsp.camera.motion.detected.v1',
  missionUri?: RtnUri,
  intentUri?: RtnUri,
  source: IdentityRef,
  payload: Record<string, unknown>,
  occurredAt: ISO8601,
}
```

---

## Certification Path

Adapters built exclusively on RSP SDK v1+ are eligible for **RSP Compatible** certification.

See [Certification Program](CERTIFICATION.md).
