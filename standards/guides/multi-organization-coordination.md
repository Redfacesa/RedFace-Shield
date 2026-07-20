# Coordinating Multi-Organization Response

> **Classification: Vision** — operational patterns. Publish publicly with Wave 2 case study, not Wave 1.

**Publishing wave:** 2 — hold until reference customer evidence exists  

---

## Why Single-Organization Tools Fail

A control room does not operate alone.

Every significant mission involves:

- The control room (coordination)  
- Field responders (execution)  
- The client or property owner (authority)  
- Often an insurer (evidence and liability)  
- Sometimes municipality or police (oversight)  

Software designed for one organization creates **re-entry** — the same mission data typed into five systems, photos sent on WhatsApp, phone calls to confirm what the system already knows.

---

## Coordination Is a Graph, Not a Hierarchy

```
        Insurer
           │
Control Room ─── Recovery Co
           │
        Field Unit
           │
      Property Owner
```

Each edge is a **relationship** that must be verified — not assumed from a contract PDF.

---

## Practical Patterns

### Declare intent early

Before dispatch, state the desired outcome explicitly. "Recover vehicle safely" — not "handle alarm."

Intent gives all participants a shared objective before tactics diverge.

### One mission, many participants

Participants have roles (`requestor`, `lead`, `observer`). Observers — insurers, clients — receive timeline access without operating dispatch.

### Match capabilities, not contacts

When Company A is unavailable, match `vehicle-recovery` capability across the network — not the next number on a spreadsheet.

### Events replace status meetings

"Where are they?" should be answered from `rsp.gps.location.updated.v1` and `rsp.dispatch.arrived.v1` — not a phone call.

### Outcomes close the loop

Every mission ends with metrics: duration, resources used, result. Without outcomes, coordination never improves.

---

## Failure Modes

| Failure | Symptom | Fix |
|---------|---------|-----|
| Shadow systems | WhatsApp becomes evidence | Evidence events on mission timeline |
| Phone tree dispatch | Slow, untracked allocation | Capability matching + dispatch events |
| Narrative disputes | No shared timeline | Immutable events + playback |
| Observer exclusion | Insurer learns late | Participant roles with read access |

---

## Measuring Improvement

Track before/after:

- Manual phone calls per mission  
- Organizations coordinated without duplicate entry  
- Time to operational review  

Coordination quality is measurable — not subjective.
