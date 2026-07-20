# Compatibility Promise

> **DRAFT — Wave 3.** Publish alongside RSP when integrators depend on stability guarantees.

**Publishing wave:** 3 — internal draft only  

**Effective:** 2026-07-20 *(draft)*  

## Our Commitment

Once a specification element is **released** at version 1.0 or higher, RedFace commits to **backward compatibility** within that major version.

Integrators should be able to ship once and not fear silent breakage.

---

## Event Types

Released event types are **immutable**.

```text
rsp.camera.motion.detected.v1   ← frozen forever
rsp.camera.motion.detected.v2   ← additive successor when needed
```

We will **never** change the meaning of a released `.v1` event type.

New fields may appear in `.v2`. Old adapters continue publishing `.v1` until they choose to upgrade.

---

## RTN URIs

The URI format `rtn://{kind}/{localId}` is stable.

Existing kinds will not be repurposed. New kinds may be registered additively.

---

## Envelope

RSP envelope version `1.x` changes are backward compatible.

Breaking envelope changes require RSP `2.0` with migration guide and minimum 12-month overlap period.

---

## Deprecation

When we deprecate a specification element:

1. **Announcement** — documented in [VERSION-POLICY.md](VERSION-POLICY.md) changelog
2. **Overlap period** — minimum 12 months where both old and new are accepted
3. **Certification update** — new conformance tests published before enforcement

We will not deprecate without replacement.

---

## What We Do Not Promise

- Internal RedFace Platform APIs (commercial product — separate SLA)
- Undocumented behavior
- Pre-1.0 draft types in production without version suffix

---

## Reporting Issues

Implementers who believe a released specification behaves inconsistently with this promise may report via the certification program review process.

Conformance matters to us because **trust in the standard is trust in the network**.
