# Mission Model

> **DRAFT — Wave 3.** Publish with RSP after operational proof.

**Publishing wave:** 3 — internal draft only  

**Version:** 1.0  
**Status:** Draft  

---

## Definition

A **mission** is one operational objective executed through **adaptive orchestration** across participants, resources, and policies.

A mission is not a workflow, ticket, or case number. The objective stays fixed; execution adapts as events arrive.

---

## Lifecycle

```text
planning → active → completed | failed | canceled
              ↓
           paused (optional)
```

| State | Meaning |
|-------|---------|
| `planning` | Mission created; resources being matched |
| `active` | Execution in progress |
| `paused` | Temporarily suspended — events may still arrive |
| `completed` | Objective resolved — outcome recorded |
| `failed` | Objective not achieved — outcome recorded |
| `canceled` | Withdrawn before completion |

Every terminal state produces an **outcome** with metrics.

---

## Prerequisites

```text
Intent (declared outcome)
        ↓
Mission (orchestration)
        ↓
Events (immutable record)
        ↓
Outcome (measured result)
```

An intent expresses *what* is desired. A mission executes *how*.

---

## Identity

Missions are addressed with RTN URIs:

```text
rtn://mission/CPT-2026-000001
```

---

## Participants

Missions involve multiple organizations in roles — not a single owner of truth.

| Role (examples) | Description |
|-----------------|-------------|
| `requestor` | Organization that declared the intent |
| `lead` | Primary executing organization |
| `field_support` | Supporting responder |
| `observer` | Read-only participant (e.g. insurer) |

Roles are declared explicitly. Implicit participation is not assumed.

---

## Resources

Resources (people, vehicles, equipment) are **allocated** to missions by capability — not by company name alone.

Allocation and release produce RSP events on the mission timeline.

---

## Stewardship

Every mission SHOULD have a **steward** — an organization responsible for governance (often the control room). Stewardship is separate from legal ownership.

---

## Outcome

Every completed mission MUST record:

| Field | Description |
|-------|-------------|
| `result` | `success` · `partial` · `failure` · `canceled` |
| `summary` | Human-readable resolution |
| `metrics` | Measurable data — duration, distance, cost, etc. |

---

## Three Outputs

Every completed mission produces:

1. **Operational result** — was the objective achieved?  
2. **Institutional learning** — what should this organization improve?  
3. **Network learning** — what anonymized insight helps other participants? (optional, policy-governed)

---

## Adaptive Execution

Missions respond to events without predefined step sequences:

- Camera detection may trigger resource reallocation  
- GPS updates may change nearest-responder matching  
- Policy evaluates current context — not static workflows  

Workflow engines may exist *inside* a participant's systems. The mission model does not encode them.

---

## Conformance

A system is **Mission Model conformant** if it:

- Creates missions with RTN URI identity  
- Records state transitions as RSP events  
- Produces outcomes with metrics at termination  
- Does not mutate historical events  

See [Certification Program](../certification/CERTIFICATION-PROGRAM.md).
