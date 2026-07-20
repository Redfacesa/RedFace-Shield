# Decision Register

Major product and company decisions — with evidence, not memory.

Format: `DR-NNN`

---

## DR-001

| Field | Value |
|-------|-------|
| **Decision** | Mission is the orchestration object. |
| **Reason** | Incidents are events. Operations are missions. |
| **Evidence** | Vehicle recovery walkthroughs, Architecture v1.0 ratification. |
| **Date** | 2026 |

---

## DR-002

| Field | Value |
|-------|-------|
| **Decision** | Kernel is source of truth; UI is thin client. |
| **Reason** | Operators need one operational language; business logic must not leak to frontend. |
| **Evidence** | Control Room frontend audit — no deriveTrust, no buildPlayback in UI. |
| **Date** | 2026-07-20 |

---

## DR-003

| Field | Value |
|-------|-------|
| **Decision** | Libraries never execute; only applications have entry points. |
| **Reason** | Circular import caused kernel-api to run MVP on import. |
| **Evidence** | Exit code crash on `schema.sql`; fix via `main.ts` guards. |
| **Date** | 2026-07-20 |

---

## DR-004

| Field | Value |
|-------|-------|
| **Decision** | Operational narrative: Brief → Wall → Replay → Report. |
| **Reason** | Stakeholders map naturally to before / during / after documents. |
| **Evidence** | ODR-1 demonstration flow. |
| **Date** | 2026-07-20 |

---

## DR-005

| Field | Value |
|-------|-------|
| **Decision** | Externally: **Operation Replay**. Internally: playback / `buildPlayback()`. |
| **Reason** | "Replay" is more immediately understood by operators than "Playback". |
| **Evidence** | Pending validation in DEP-001 — rename if operators disagree. |
| **Date** | 2026-07-20 |

---

## DR-006

| Field | Value |
|-------|-------|
| **Decision** | Introduce Decision Latency as operator-facing KPI. |
| **Reason** | Time from intent to first operational decision is universally understood. |
| **Evidence** | Measured from kernel events (intent → dispatch/allocation). |
| **Date** | 2026-07-20 |

---

## DR-007

| Field | Value |
|-------|-------|
| **Decision** | ODR-1 complete — stop major UI surfaces; polish and deploy. |
| **Reason** | Platform Validation Stage 1 achieved; next evidence is operational, not architectural. |
| **Evidence** | Acceptance test passed; five-minute demo script runnable. |
| **Date** | 2026-07-20 |

---

## DR-008

| Field | Value |
|-------|-------|
| **Decision** | Company cadence shifts from product development to operational learning. |
| **Reason** | Roadmap after ODR-1 is Deploy → Observe → Learn, not "build more features". |
| **Evidence** | Reference Deployment Playbook + Learning Tickets + Mission Reviews. |
| **Date** | 2026-07-20 |

---

## Template

```markdown
## DR-NNN

| Field | Value |
|-------|-------|
| **Decision** | |
| **Reason** | |
| **Evidence** | |
| **Date** | |
```
