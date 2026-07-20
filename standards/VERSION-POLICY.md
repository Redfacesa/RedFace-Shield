# Version Policy

> **DRAFT — Wave 3.** Publish with RSP specification.

**Publishing wave:** 3 — internal draft only  

---

## Semantic Versioning

| Component | Scheme | Example |
|-----------|--------|---------|
| RSP protocol | `MAJOR.MINOR.PATCH` | `1.0.0` |
| Event types | `{name}.v{N}` | `rsp.gps.location.updated.v1` |
| RTN URI format | `MAJOR` only | `1.0` |
| Certification levels | `MAJOR` | `1.0` |
| SDK packages | Semver | `@redface/rsp@1.2.0` |

---

## RSP Protocol

| Bump | When |
|------|------|
| **MAJOR** | Breaking envelope change — requires migration guide |
| **MINOR** | New event types, optional envelope fields |
| **PATCH** | Clarifications, documentation, non-normative fixes |

Current: **RSP 1.0.0**

---

## Event Types

1. New types launch with explicit version suffix: `.v1`
2. `.v1` is frozen on publication date
3. Incompatible payload changes require `.v2`
4. Adapters declare supported types in certification

See [COMPATIBILITY-PROMISE.md](COMPATIBILITY-PROMISE.md).

---

## RTN URI

Additive only within major version:

- New `kind` values may be registered
- Existing kinds are stable
- Format `rtn://kind/localId` unchanged in 1.x

---

## Certification

Certification tests version with the specification they validate.

| Certification | Valid for |
|---------------|-----------|
| RSP Compatible 1.0 | RSP 1.x event types listed in test suite |
| RSP Compatible 1.1 | Adds new event types — prior 1.0 remains valid |

---

## Changelog

| Date | Component | Version | Change |
|------|-----------|---------|--------|
| 2026-07-20 | RSP | 1.0.0 | Initial public release |
| 2026-07-20 | RTN URI | 1.0 | Initial public release |
| 2026-07-20 | Mission Model | 1.0 | Initial public release |
| 2026-07-20 | Event Model | 1.0 | Initial public release |

---

## Draft vs Released

| Label | Meaning |
|-------|---------|
| **Draft** | Subject to change — not covered by compatibility promise |
| **Released** | Covered by [COMPATIBILITY-PROMISE.md](COMPATIBILITY-PROMISE.md) |

Do not implement draft types in production integrations.
