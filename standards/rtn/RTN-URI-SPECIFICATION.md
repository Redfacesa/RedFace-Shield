# RTN URI Specification

> **DRAFT — Wave 3.** Do not publish until Wave 2 evidence exists.

**Publishing wave:** 3 — internal draft only  

**Version:** 1.0  
**Status:** Draft  

---

## Purpose

The RedFace Trust Network URI (RTN URI) provides a **stable global address** for every operational object — organizations, people, assets, missions, evidence, and events.

Integrators use RTN URIs in RSP events and APIs. URIs are permanent identifiers, not database primary keys.

---

## Format

```text
rtn://{kind}/{localId}
```

| Part | Rules |
|------|-------|
| Scheme | Always `rtn:` |
| Kind | Lowercase alphanumeric and hyphens (`a-z`, `0-9`, `-`) |
| Local ID | Alphanumeric, dots, underscores, hyphens (`a-z`, `A-Z`, `0-9`, `.`, `_`, `-`) |

### Examples

```text
rtn://organization/acme-security
rtn://guard/284729
rtn://resource/CPT-TRK-001
rtn://mission/CPT-2026-000001
rtn://capability/vehicle-recovery
rtn://document/evidence-photo-001
rtn://event/evt-a1b2c3d4e5f6
```

---

## Registered Kinds (v1.0)

| Kind | Description |
|------|-------------|
| `organization` | Legal or operational entity |
| `person` | Human operator |
| `guard` | Field personnel (specialized person) |
| `vehicle` | Mobile asset |
| `camera` | Fixed or PTZ camera |
| `drone` | Unmanned aerial asset |
| `resource` | Generic allocatable asset |
| `property` | Physical site or estate |
| `mission` | Operational mission |
| `intent` | Declared desired outcome |
| `capability` | Verifiable operational function |
| `document` | Evidence or certificate object |
| `event` | RSP event identity |
| `sensor` | IoT sensor |
| `gateway` | Integration endpoint |

New kinds may be registered in minor specification updates. Existing kinds are stable.

---

## Validation

Implementers SHOULD validate URIs with this pattern:

```regex
^rtn://([a-z0-9-]+)/([a-zA-Z0-9._-]+)$
```

Invalid URIs MUST be rejected at publish time.

---

## Assignment Rules

1. **Publisher assigns localId** — must be unique within `(kind, registry scope)`
2. **Opaque IDs allowed** — `rtn://event/evt-a1b2c3d4e5f6`
3. **Human-readable IDs allowed** — `rtn://mission/CPT-2026-000001`
4. **Never reuse** — a retired URI is never reassigned to a different object

---

## Usage in RSP

Every RSP event MUST include:

```yaml
source:
  uri: rtn://guard/284729
  organizationUri: rtn://organization/acme-security
```

Mission-scoped events SHOULD include:

```yaml
missionUri: rtn://mission/CPT-2026-000001
```

---

## Relationship to Legacy Prefixes

Legacy prefixes (`RF-ORG-*`, `RF-EVT-*`) are deprecated. New implementations MUST use RTN URIs.

---

## Conformance

An implementation is **RTN URI conformant** if:

- All published object references use valid RTN URI syntax
- Kinds used are from the registered list or documented extensions
- URIs are not reassigned after retirement

See [Certification Program](../certification/CERTIFICATION-PROGRAM.md).
