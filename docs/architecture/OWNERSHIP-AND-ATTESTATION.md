# Ownership, Stewardship, and Attestation

**Status:** Platform v0.1  
**Authority:** [Engine Contract](ENGINE-CONTRACT.md)

---

## Ownership ≠ Organization

An **organization** is a participant type. **Ownership** is a relationship.

```
Camera
  Owned by        → Shopping Centre        (one legal owner)
  Operated by     → Security Company       (steward)
  Maintained by   → Vendor                 (steward)
  Viewed by       → Control Room           (steward)
  Evidence used by→ Police                 (steward, mission-scoped)
  Insured by      → Insurance Company      (steward)
```

Only **one entity owns** an object. Many entities may **steward** it in different roles.

Ownership is not a JSON property on a record. It is a **first-class graph edge** governed by the Ownership Engine.

---

## Steward

A **steward** is responsible for governance of an object — not necessarily ownership.

| Object | Steward | Role |
|--------|---------|------|
| Mission | Control Room Alpha | `mission_steward` |
| Evidence | Police Investigation Unit | `evidence_custodian` |
| Vehicle | Recovery Company | `operational_steward` |
| Organization | Platform Administrator | `admin_steward` |
| Camera | Security Company | `operator` |

Stewards matter for municipalities and governments: the city may **steward** infrastructure without **owning** every camera.

---

## Verification vs Attestation

| | Verification | Attestation |
|---|-------------|-------------|
| Meaning | "I **checked** this" | "I **stand behind** this" |
| Engine | Trust Engine | Attestation Engine |
| Example | Document hash matches | SIA attests training certificate |
| Revocable | Status: failed/expired | Revocation record appended |

Both feed Policy and derived trust. Neither grants access directly.

---

## Operational Context *(Phase 3)*

When a credential proves identity, Policy evaluates **context** — not just role strings.

```
Identity verified
AND current mission assigned
AND evidence steward for mission
AND within operational area
AND mission state = active
→ Permit evidence.upload
```

Context includes: current mission, vehicle, shift, equipment, area, supervisor, organization, permissions snapshot.

Sessions carry operational context. Credential Engine proves identity; Session Engine holds context; Policy Engine decides.

---

## Credential Engine *(Phase 3 — design)*

Not "Auth Engine." **Credential Engine** validates credentials:

- Passkey, hardware key, smart card, API key, OAuth, certificate, OTP

The engine does not care which format — only whether the credential **proves** an identity URI.

```
Credential validated
  → Identity proven
  → Policy evaluated (with operational context)
  → Session created
```

Authentication never directly grants access.

---

## Sessions *(Phase 3 — design)*

Not JWT-centric. **Sessions** are the model. JWT may be one representation.

| Session type | Credential | Context |
|--------------|------------|---------|
| Browser | Passkey / OAuth | Control room operator |
| Mobile | Passkey | Field officer on mission |
| Patrol terminal | Smart card | Vehicle + shift |
| API | API key | Integration partner |

Same session model. Different credentials.

---

## Adapter Rule

Adapters are **tiny**. They translate. The kernel decides.

```
Hikvision event → normalize → RSP event → Event Engine
```

No business logic. No mission logic. No authentication. No direct database writes.

---

## UI Rule

The UI knows **almost nothing**:

- Display state
- Submit intents
- Render timelines
- Subscribe to events

It does not calculate, orchestrate, or contain business rules.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| v0.1 | 2026-07-20 | Ownership, steward, attestation, credential/session design |
