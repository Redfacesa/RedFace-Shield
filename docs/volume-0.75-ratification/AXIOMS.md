# Volume 0.75: The Axioms

**Status:** Draft — Ratification Phase  
**Authority:** Subordinate to [Volume −1](../volume-minus-1-philosophy/PHILOSOPHY.md); constrains all volumes, engines, and code  
**Scope:** Architectural invariants — must always be true

---

## Purpose

Principles explain *why* we think a certain way.  
Philosophy explains *why* RedFace exists.

**Axioms** are different. An axiom is something that **must always be true**. Everything else is derived from it.

If ten engineers work independently, they should arrive at the same design — not because everyone talks, but because the axioms constrain the solution space.

When someone proposes: *"Let's allow editing incident history."*

You do not debate. You check the axioms. Axiom 5 says events are immutable. The proposal dies. No meeting required.

There are **fifteen axioms**. Not two hundred. Not fifty. Fifteen.

---

## Axiom 1 — Identity

**Everything has identity.**

If something cannot be identified, it cannot participate in the Operational Graph, publish events, receive permissions, or appear in history.

No anonymous actors. No unattributed actions.

---

## Axiom 2 — Identity Precedes Permission

**No identity. No permission.**

Authentication and authorization require a verified identity. There are no permission grants to unknown entities.

---

## Axiom 3 — Permission Precedes Execution

**Nothing executes without policy.**

Default is deny. Every operational action — dispatch, evidence access, mission join, resource allocation — requires explicit policy authorization at the moment of execution.

---

## Axiom 4 — Intent Precedes Mission

**No mission without intent.**

A mission is orchestration of a declared desired outcome. Operations do not begin with alarms, payments, or dispatches. They begin with intent. The Mission Engine executes intent; it does not invent it (except via intelligence-informed suggestions requiring human or policy acceptance).

---

## Axiom 5 — Execution Creates Events

**Everything meaningful becomes an event.**

State changes, decisions, allocations, arrivals, evidence creation, policy permits and denials — all produce signed, typed events on a mission timeline.

If it happened and it matters, it is an event. If it is not an event, it did not happen as far as the platform is concerned.

---

## Axiom 6 — Events Are Immutable

**Events are never edited. Only superseded.**

Correction does not modify the original. A new event references the original and records the correction. The original remains in history forever.

---

## Axiom 7 — History Is Derived

**History is the accumulation of events. History is never rewritten.**

History is computed from immutable events. There is no separate editable history store. Export, audit, analytics, and trust scores all derive from the same event accumulation.

---

## Axiom 8 — Intelligence Never Invents Facts

**AI only reasons over evidence. AI creates hypotheses. Humans confirm them where required.**

The Intelligence Engine must not write operational facts directly into history. It may propose structured observations, pattern links, and recommendations. Facts enter history only through verified events — human confirmation, sensor attestation, or policy-delegated automation with full audit.

---

## Axiom 9 — Trust Is Earned

**Trust is confidence derived from verifiable operational history — not marketing, not reputation claims, not platform assertion.**

The platform makes operations verifiable. Trust scores are computed from history. The platform never guarantees trust. It makes trust earnable.

---

## Axiom 10 — Capabilities Over Organizations

**Missions allocate capabilities. Not brands.**

Resource matching queries: *What capabilities are required? What verified capabilities are available?* — not *Which company do we usually call?*

Organizations register capabilities. Missions consume them.

---

## Axiom 11 — Missions Own Execution

**The mission is the center of operational truth. Companies participate.**

Events belong to mission timelines, not to organizational silos. Multi-org coordination attaches to the mission. The mission owns objectives, resources, timeline, evidence, and outcome. Organizations contribute; they do not own the operational record.

---

## Axiom 12 — Every Decision Is Auditable

**If AI recommends, we know why. If a human overrides, we know why. If policy denies, we know why.**

Every recommendation, override, permit, and deny produces an auditable record: actor, rationale, policy version, timestamp, signature.

---

## Axiom 13 — Every Mission Teaches

**Failure is acceptable. Learning nothing is not.**

Every completed mission must produce review and captured knowledge — lessons learned, metrics, outcome — feeding the Intelligence Engine. Missions that close without institutional knowledge violate this axiom.

---

## Axiom 14 — Verifiability Precedes Trust

**Operations must be verifiable before trust can be earned.**

Identity, policy, signatures, chain of custody, and immutable history exist to make claims verifiable. Trust is downstream of verifiability, never upstream.

---

## Axiom 15 — Primitives Are Frozen

**New foundational objects require doctrine amendment — not feature tickets.**

The primitives are: Identity, Intent, Mission, Capability, Resource, Event, History, Evidence, Policy, Outcome, Trust. New primitives may not be introduced in application code or product specs without Volume 0.75 amendment and Architecture version increment.

---

## Axiom Index

| # | Axiom | One Line |
|---|-------|----------|
| 1 | Identity | Everything has identity |
| 2 | Identity → Permission | No identity, no permission |
| 3 | Permission → Execution | Nothing executes without policy |
| 4 | Intent → Mission | No mission without intent |
| 5 | Execution → Events | Everything meaningful becomes an event |
| 6 | Immutability | Events never edited; only superseded |
| 7 | Derived History | History accumulates; never rewritten |
| 8 | Intelligence | AI hypothesizes; does not invent facts |
| 9 | Trust | Earned from verifiable history |
| 10 | Capabilities | Missions allocate capabilities, not brands |
| 11 | Mission Center | Missions own execution; orgs participate |
| 12 | Audit | Every decision auditable |
| 13 | Learning | Every mission increases institutional knowledge |
| 14 | Verifiability | Verifiable before trustable |
| 15 | Primitives | New primitives require doctrine amendment |

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.75-draft | 2026-07-20 | Initial fifteen axioms — Ratification Phase |
