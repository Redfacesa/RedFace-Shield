# Phase 1 — Operational Kernel

**Status:** Implementation authorized post-doctrine ratification  
**MVP:** Vehicle hijacking recovery — one complete Operational Loop

## Build Order

```
Operational Kernel  ← Phase 1 (NOW)
  ↓
Trust Network (full RTN)
  ↓
Shield Applications (proof)
```

Do **not** start with mobile app, control room UI, or camera firmware.

## Monorepo Layout

```
packages/
  shared/                 Canonical types & IDs
  rsp/                    Event protocol
  operational-graph/      Graph projections (Phase 2)
  operational-kernel/
    kernel-core/          Engine composition + PostgreSQL + MVP

services/
  kernel-api/             Read API for missions/timeline

applications/               Phase 2 — after kernel validated
infrastructure/docker/    PostgreSQL + Redis
docs/                     Doctrine (frozen)
```

## First Object

The first table is **`intents`**, not incidents. See `kernel-core/src/db/schema.sql`.

## Success Metric

> Can one real-world mission move through the entire Operational Loop — from intent to completion — with every action verifiable, every event recorded, and every participant coordinated?

Run:

```bash
npm install
npm run db:up
npm run db:migrate
npm run mvp:hijacking
```

## Doctrine Test (MVP)

| Question | Answer |
|----------|--------|
| Axioms | 4, 5, 6, 10, 11, 12, 13 |
| Engines | Intent, Mission, Resource, Event, History, Policy |
| First object | Intent |
| Events | RSP types on mission timeline |
| History | Append-only `events` table |
| New primitive? | No |

## Storage (Phase 1)

| Store | Use |
|-------|-----|
| PostgreSQL | Intents, missions, resources, events, policy audit |
| Redis | Phase 2 — live state cache |
| Object storage | Phase 2 — evidence media |
| OpenSearch | Phase 2 — search |
| Graph DB | Phase 2 — relationship traversal |

## Next Steps (Phase 2)

1. Identity Engine — full RTN auth, certificates
2. Trust Engine — evidence hashes, chain of custody
3. Graph projections from event stream
4. Hikvision/generic webhook adapter → RSP
5. Shield control room (reads kernel, no own mission model)
