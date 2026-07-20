# Volume 0.75: Conceptual Models

**Status:** Draft — Ratification Phase  
**Authority:** Subordinate to [Axioms](AXIOMS.md) and [Canonical Language](CANONICAL-LANGUAGE.md)  
**Scope:** Mathematical thinking — not implementation formulas

---

## Purpose

Every infrastructure company eventually becomes mathematical.

Commerce became accounting. Payments became ledgers. Networking became packets. Databases became transactions.

RedFace requires **conceptual models** — equations that force consistent thinking across engineers, product, and investors. These are not code. They are mental invariants.

If two teams interpret a mission differently, return to the model.

---

## The Operational Loop

```
Operations(t+1) = f( Intelligence( History( Events( Mission( Intent(t) ) ) ) ) )
```

In plain language:

The next operation is a function of intelligence applied to history accumulated from events produced by missions executing intent.

The loop is closed. There is no shortcut from intent to intelligence without events and history.

---

## Mission Composition

```
Mission = Intent + Objectives + Resources + Policies + Events + Outcome
```

| Component | Meaning |
|-----------|---------|
| Intent | Why the mission exists |
| Objectives | What must be achieved (success criteria) |
| Resources | Allocated capabilities and concrete assets |
| Policies | Rules governing execution and participation |
| Events | Immutable timeline of what happened |
| Outcome | Measured result and metrics |

A mission without outcome is incomplete (Axiom 13).  
A mission without events did not execute (Axiom 5).

---

## Intent Transition

```
Intent → Mission          when policy permits and Mission Engine accepts
Intent → Withdrawn        when expressor cancels before mission creation
Mission → Outcome         when objectives resolved
Outcome → Lessons         when review completes (required)
Lessons → Better Intent   when Intelligence Engine surfaces improvements
```

---

## Trust Model

```
Trust = f( Verifiable History , Consistency , Transparency )
```

Where:

- **Verifiable History** — signed events, chain of custody, immutable accumulation
- **Consistency** — performance stable across missions over time
- **Transparency** — scores computable and disputable from auditable data

Trust is **not** an input to the system. It is an **output**. The platform never sets Trust directly.

```
Trust ≠ PlatformAssertion
Trust = Computed( History )
```

---

## Capability Model

```
Capability = Skill + Authorization + Availability + Verification
```

| Factor | Meaning |
|--------|---------|
| Skill | Organization registers capability type |
| Authorization | Licenses, certifications, policy permit |
| Availability | Resources currently able to perform |
| Verification | Trust Engine confirms capability is valid now |

Mission matching query:

```
Match( MissionRequirements , Capabilities , Zone , Time ) → [ Allocations ]
```

Missions never match on organization name alone (Axiom 10).

---

## Resource Model

```
ResourceState = f( Location , Health , Allocation , MissionBinding )
```

A resource is either:

- **Available** — may be allocated
- **Allocated** — bound to mission `RF-MSN-*`
- **Unavailable** — off duty, maintenance, offline

Only Resource Engine changes allocation state. Mission Engine requests; Policy Engine permits; Resource Engine commits.

---

## Event Model

```
Event = Identity + Type + Timestamp + Payload + Signature + MissionRef
```

Events form a **directed acyclic timeline** per mission — with supersession edges for corrections:

```
Event_original → Event_superseding     (original preserved)
```

Never:

```
Event_original → Event_modified          (forbidden)
```

---

## History Model

```
History(t) = Events(0..t)
```

History is a **pure function** of events. There is no `History.update()`. There is only `Events.append()`.

Audit, compliance export, trust scores, and intelligence datasets are all **projections** of History — not separate sources of truth.

---

## Intelligence Model

```
Recommendation = Model( History , Graph , PolicyConstraints )
Fact = Event                                    (only events create facts)
Hypothesis = Intelligence.output                (requires confirmation path)
```

Intelligence never writes to History except by triggering human/policy-confirmed events (Axiom 8).

```
∀ operational fact F : ∃ event E such that F = extract(E) ∧ E ∈ History
```

---

## Policy Model

```
Permit( Actor , Action , Context ) → { allow | deny , rationale , policy_version }
```

Every execution path passes through Policy evaluation (Axiom 3):

```
Execute(A)  only if  Permit(Identity(A), A, Context) = allow
```

---

## Economy Model

```
MissionCost = Σ( ResourceCost , CoordinationFee , MarketplaceFee , ... )
MissionValue = f( OutcomeMetrics , AssetProtected , TimeSaved , ... )
```

Economy Engine measures. Participants price. Platform coordinates settlement — it does not own operational revenue of participants.

---

## Evidence Model

```
Evidence = Event_payload + Hash + Signature + ChainOfCustody
```

Chain of custody is a **sequence of signed custody transfer events**:

```
Custody(0) = Creator
Custody(n) = Transfer( Custody(n-1) , Holder_n , Event_n )
```

Integrity verified by hash chain. Any alteration breaks verification.

---

## Operational Graph Projection

```
Graph = ( Nodes , Edges , State , Missions )
```

Where:

- **Nodes** ∈ { Identity, Intent, Mission, Capability, Resource, Evidence, ... }
- **Edges** = typed, permissioned relationships
- **State** = current node state machines
- **Missions** = subgraphs orchestrating operational truth

The graph is a **view** of kernel engines — not a separate source of truth.

---

## Architecture v1.0 Constraint

These models are **closed**. Extensions require:

1. Doctrine amendment (Axiom 15)
2. Architecture version increment
3. Ratification review

Feature teams may not invent parallel models in application code.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.75-draft | 2026-07-20 | Initial conceptual models — Ratification Phase |
