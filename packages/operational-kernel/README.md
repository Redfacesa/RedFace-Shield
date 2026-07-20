# Operational Kernel

Phase 1 and Phase 2 engines live in **`kernel-core/`** until interfaces stabilize, then split into independent packages.

## Phase 2 Engines (implemented)

| Package marker | Module | Responsibility |
|----------------|--------|----------------|
| `identity-engine/` | `identity-engine.ts` | RTN URIs, registry, trust documents |
| `organization-engine/` | `organization-engine.ts` | Organizations (all types) |
| `capability-engine/` | `capability-engine.ts` | Capabilities + requirements |
| `trust-engine/` | `trust-engine.ts` | Verification, **derived** trust |

## Phase 1 Engines (updated for RTN)

| Module | Responsibility |
|--------|----------------|
| `intent-engine.ts` | Intent precedes mission |
| `mission-engine.ts` | Adaptive orchestration |
| `resource-engine.ts` | Allocatable assets |
| `event-engine.ts` | Immutable events |
| `policy-engine.ts` | Authorization (not auth) |

## Not yet implemented

- Authentication (JWT, OAuth, passkeys) — step 5
- Intelligence Engine — recommendations only
- Economy Engine — settlement
- Hardware adapters — step 6
