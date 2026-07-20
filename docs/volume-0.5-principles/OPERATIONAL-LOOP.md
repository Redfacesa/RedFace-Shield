# Volume 0.5: The Operational Loop

**Status:** Draft v0.1  
**Authority:** Subordinate to [Volume −1: The Philosophy](../volume-minus-1-philosophy/PHILOSOPHY.md); governs all operational volumes  
**Scope:** The universal operational model shared by every RedFace vertical

---

## 1. The Universal Model

Every operational system — whether commerce, security, healthcare, logistics, or emergency response — contains the same six concepts in the same order.

This is not a workflow diagram. It is the **Operational Loop** — a continuous learning system that every RedFace product implements.

```
Intent
  ↓
Mission
  ↓
Events
  ↓
History
  ↓
Intelligence
  ↓
Better Intent
  ↓
(repeat)
```

Break any link and the system cannot learn, cannot verify, and cannot earn trust.

---

## 2. Intent — The First Object

Nothing begins with an incident.  
Nothing begins with a payment.  
Nothing begins with a dispatch.

Everything begins with **intent** — a declared desired outcome.

| Domain | Intent |
|--------|--------|
| Shield | "Recover this stolen vehicle." |
| Shield | "Protect this concert." |
| Commerce | "Deliver this package to the customer by 6pm." |
| Commerce | "Process this payment." |
| Rescue | "Save this patient." |
| Utility | "Restore power to this grid section." |
| Fleet | "Recover this cargo." |

Intent is expressed by a verified identity (person, organization, or system) and recorded by the **Intent Engine**. Intent alone does nothing. It must become a mission to execute.

```yaml
Intent:
  id: RF-INT-2026-000001
  statement: "Recover vehicle CA 123 456 GP safely"
  expressed_by: OrganizationRef | PersonRef
  context: EventRef | PropertyRef | OrderRef (optional)
  priority: critical | high | medium | low
  state: declared | accepted | mission_created | fulfilled | failed | withdrawn
  created_at: timestamp
```

---

## 3. Intent Creates a Mission

Intent needs execution. The **Mission Engine** transforms intent into an orchestrated operational endeavor.

```
Intent
  ↓
Mission
  ↓
Objectives
  ↓
Policies
  ↓
Resources (matched by capability)
  ↓
Execution
```

A mission is **not a workflow**. A workflow is predefined: step 1, step 2, step 3. A mission is **adaptive**: the objective is fixed, but execution adapts to conditions.

**Workflow (wrong model):**
1. Dispatch guard
2. Notify police
3. Close case

**Mission (correct model):**
- **Objective:** Recover the vehicle safely
- System may dispatch one team or three
- System may launch a drone, notify toll operator, request police, or pause for safety
- Objective unchanged; execution adapts

See [Theory of Missions](THEORY-OF-MISSIONS.md) for full mission specification.

---

## 4. Missions Produce Events

Every action during a mission produces a signed event. Events never belong directly to companies — they belong to the **mission timeline**.

```
Mission: Recover Vehicle CA 123 456 GP
  ├── rsp.vehicle.stolen
  ├── rsp.recovery.dispatched
  ├── rsp.vehicle.seen
  ├── rsp.dispatch.accepted
  ├── rsp.drone.launched
  ├── rsp.evidence.created
  ├── rsp.recovery.success
  └── rsp.mission.completed
```

The **Event Engine** captures what happened. The **Policy Engine** governs who may publish and who may receive each event type.

---

## 5. Events Produce History

Events are not consumed and discarded. The **History Engine** preserves them immutably.

History becomes:

- **Evidence** — court-ready, chain-of-custody preserved
- **Analytics** — response times, success rates, cost per mission
- **Compliance** — audit trails for regulators and insurers
- **Learning** — input to intelligence engines

History is append-only. Corrections are new entries referencing originals. Nothing is silently altered.

---

## 6. History Produces Intelligence

Only after sufficient history exists can the system answer operational questions:

- Why did response times increase in the northern region?
- Which recovery strategy succeeds most often for hijackings?
- Which equipment fails most frequently?
- Which patrol routes reduce incident rates?
- Which capabilities should be pre-positioned for Tuesday evenings?

The **Intelligence Engine** observes history. It does not replace it. It recommends — it does not autonomously decide unless explicitly delegated by policy.

Intelligence is learned from history, not invented from models alone.

---

## 7. Intelligence Improves Future Intent

The loop closes.

Better intelligence produces better intent:

- "Pre-position recovery teams near N2 on Tuesday evenings" (from pattern analysis)
- "Request armed response with K9 capability for this property type" (from historical success data)
- "Route delivery via depot X — 30% faster for this zone" (from fulfillment history)

The next intent is smarter because the last mission's history was preserved, analyzed, and learned from.

This is a **continuous learning system** — not a one-shot workflow.

---

## 8. The Loop Across Verticals

Every RedFace vertical implements the same loop with different vocabulary.

### Commerce

| Stage | Expression |
|-------|------------|
| Intent | Sell product / fulfill order |
| Mission | Deliver order #12345 by 6pm |
| Events | Payment authorized, packed, dispatched, delivered |
| History | Commerce ledger, fulfillment record |
| Intelligence | Sales forecasting, route optimization |
| Better Intent | Stock pre-positioning, dynamic pricing |

### Shield

| Stage | Expression |
|-------|------------|
| Intent | Recover stolen vehicle |
| Mission | Coordinate multi-org recovery |
| Events | Dispatch, sightings, evidence, recovery |
| History | Investigation record, chain of custody |
| Intelligence | Crime pattern analysis, patrol optimization |
| Better Intent | Proactive security missions from patterns |

### Rescue

| Stage | Expression |
|-------|------------|
| Intent | Save patient |
| Mission | Ambulance response and hospital handover |
| Events | Dispatch, treatment, transport, admission |
| History | Medical response log |
| Intelligence | Resource optimization, demand prediction |
| Better Intent | Pre-position ambulances based on demand patterns |

Same loop. Same kernel. Different application.

---

## 9. Trust in the Loop

Trust is not a stage in the loop. Trust is the **outcome** of running the loop correctly.

When operations are verifiable:

- Identity is proven → participants know who acted
- Policies are enforced → participants know rules were followed
- Events are signed → participants know what happened
- History is immutable → participants know nothing was altered
- Intelligence is grounded → participants know recommendations are evidence-based

Humans and institutions still decide whether to trust. But they decide based on **verifiable operations**, not phone calls and assumptions.

The **Trust Engine** computes operational trust scores from history — not from marketing claims.

---

## 10. Relationship to the Operational Kernel

Each stage of the loop maps to one or more engines:

| Loop Stage | Engine(s) |
|------------|-----------|
| Intent | Intent Engine |
| Mission | Mission Engine, Resource Engine, Policy Engine |
| Events | Event Engine, Policy Engine |
| History | History Engine, Trust Engine |
| Intelligence | Intelligence Engine |
| Better Intent | Intelligence Engine → Intent Engine |
| Settlement | Economy Engine (runs throughout) |

Identity Engine underpins all stages — nothing operates without verified identity.

See [Operational Kernel](../architecture/OPERATIONAL-KERNEL.md) for full engine specifications.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-07-20 | Initial specification — universal Operational Loop |
