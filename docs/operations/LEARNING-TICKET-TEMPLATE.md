# Learning Ticket Template

Every backlog item traces to a **real mission** or **deployment observation**.

Ban: *"Add notifications."*

Require: *"During Mission #143, the supervisor missed the resource allocation event, increasing Decision Latency by 87 seconds."*

---

## LT-NNN

| Field | Value |
|-------|-------|
| **Mission** | `rtn://mission/...` or DEP-001 observation |
| **Operator** | Role (supervisor / control room / field) |
| **Observation** | What happened |
| **Impact** | Decision Latency +87s / missed dispatch / confusion at replay |
| **Proposed change** | Specific, minimal |
| **Hypothesis** | HYP-NNN (if applicable) |
| **Status** | Open / In progress / Shipped / Deferred |

---

## Example

**LT-001**

| Field | Value |
|-------|-------|
| **Mission** | `rtn://mission/CPT-2026-000001` |
| **Operator** | Control room supervisor (simulated walkthrough) |
| **Observation** | Resource allocation event not visible on Wall during first 30s of demo |
| **Impact** | Narrative break — supervisor looked away from Wall |
| **Proposed change** | Highlight allocation events in Wall alert panel |
| **Hypothesis** | HYP-001 |
| **Status** | Open |

---

## Open learning tickets

| ID | Summary | Status |
|----|---------|--------|
| LT-001 | Wall visibility for resource allocation | Open |
