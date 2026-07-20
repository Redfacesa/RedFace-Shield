# Engine Semantic Versioning

**Status:** Ratified with Architecture v1.0  
**Rule:** Every engine has an independent semantic version. Changes are explicit.

---

## Versioning Rules

| Change type | Version bump | Example |
|-------------|--------------|---------|
| Bug fix restoring contract behavior | PATCH | `1.0.0` → `1.0.1` |
| Backward-compatible addition | MINOR | `1.0.0` → `1.1.0` |
| Contract break (requires amendment) | MAJOR | `1.0.0` → `2.0.0` |

Engine version is declared in `@redface/kernel-core` (`ENGINE_VERSIONS`) and returned by kernel API `/health`.

RSP event types follow separate compatibility rules — see [RSP SDK](../volume-08-developer-platform/RSP-SDK.md).

---

## Current Versions

| Engine | Version | Status |
|--------|---------|--------|
| Identity | 1.0.0 | Implemented |
| Organization | 1.0.0 | Implemented |
| Ownership | 1.0.0 | Implemented |
| Capability | 1.0.0 | Implemented |
| Trust | 1.0.0 | Implemented |
| Attestation | 1.0.0 | Implemented |
| Intent | 1.0.0 | Implemented |
| Mission | 1.0.0 | Implemented |
| Resource | 1.0.0 | Implemented |
| Policy | 1.0.0 | Implemented |
| Event | 1.0.0 | Implemented |
| History | 1.0.0 | Implemented |
| Credential | 0.0.0 | Specified — not implemented |
| Session | 0.0.0 | Specified — not implemented |
| Intelligence | 0.0.0 | Not started |
| Economy | 0.0.0 | Not started |

**Kernel package:** `1.0.0`  
**RSP SDK:** `1.0.0`  
**Architecture:** `1.0.0`

---

## Changelog Discipline

When an engine version changes:

1. Update `packages/operational-kernel/kernel-core/src/versions.ts`
2. Log change in this document
3. If MAJOR — verify constitutional amendment was ratified

---

## Changelog

| Date | Engine | Version | Change |
|------|--------|---------|--------|
| 2026-07-20 | All core engines | 1.0.0 | Initial release with Architecture v1.0 ratification |
