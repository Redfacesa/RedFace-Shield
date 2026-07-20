# Event Model

> **DRAFT — Wave 3.** Publish with RSP after operational proof.

**Publishing wave:** 3 — internal draft only  

**Version:** 1.0  
**Status:** Draft  

---

## Definition

An **operational event** is a signed, immutable record that something happened at a point in time.

Events are the source of truth for operational history. Reports, dashboards, and audits are **projections** of events — never alternate sources of truth.

---

## Properties

| Property | Rule |
|----------|------|
| **Immutable** | Never edited after publication |
| **Timestamped** | `occurredAt` — when it happened, not when processed |
| **Attributed** | Every event has a verified `source` identity |
| **Structured** | Typed payload — not unstructured log text |
| **Scoped** | Attached to mission when operationally relevant |
| **Versioned** | Type includes `.vN` suffix |

---

## Identity

Events receive RTN URIs:

```text
rtn://event/evt-a1b2c3d4e5f6
```

IDs are assigned by the publisher and MUST be globally unique within the publisher's namespace.

---

## Envelope

Events conform to [RSP Specification](../rsp/RSP-SPECIFICATION.md).

---

## Mission Timelines

Events on the same `missionUri` form a **timeline** — ordered by `occurredAt`.

Timelines enable:

- Audit reconstruction  
- Mission playback  
- Insurance review  
- Training and after-action analysis  

---

## Evidence Events

Evidence is a specialized event class with additional requirements:

| Requirement | Purpose |
|-------------|---------|
| Cryptographic hash | Integrity verification |
| Media type | Classification |
| Steward assignment | Chain of custody |
| Attestation (optional) | Public standing behind custody |

See guide: [How to Design an Immutable Evidence Chain](../guides/immutable-evidence-chain.md).

---

## Supersession

The only permitted correction mechanism:

1. Original event remains in history  
2. New event published with `rsp.event.superseded.v1`  
3. Reference to original event URI and reason  

Deletion is not permitted.

---

## Verification vs Attestation

| Concept | Meaning |
|---------|---------|
| **Verification** | "I checked this" — technical validation |
| **Attestation** | "I stand behind this" — public accountability |

Both may reference events or evidence objects. They are separate records, not event mutations.

---

## Conformance

An implementation is **Event Model conformant** if it:

- Publishes RSP-compliant events  
- Never mutates stored events  
- Uses supersession for corrections  
- Builds audit views from event timelines only  

See [Certification Program](../certification/CERTIFICATION-PROGRAM.md).
