# Volume 0.5: Principles

**Status:** Draft v0.1  
**Authority:** Subordinate to [Volume −1: The Philosophy](../volume-minus-1-philosophy/PHILOSOPHY.md); governs [Volume 0: The Constitution](../volume-00-constitution/TRUST-CONSTITUTION.md)  
**Scope:** Institutional principles — not technical specifications

---

## Purpose

These are not engineering guidelines. They are **institutional principles** — the logical sequence through which verifiable operations become possible, and through which trust may be earned.

Every volume, every engine, every API, every partnership must respect this sequence. No principle may be skipped. No upper layer may function without the layers beneath it.

If Volume −1 answers *why* RedFace exists (*operations must be verifiable*), Volume 0.5 answers *in what order* truth is established — and defines the [Operational Loop](OPERATIONAL-LOOP.md) through which operations continuously improve.

---

## The Sequence

```
Everything possesses identity.
        ↓
Identity precedes permission.
        ↓
Permission precedes action.
        ↓
Every action produces an event.
        ↓
Every event becomes history.
        ↓
History is immutable.
        ↓
Intelligence observes history.
        ↓
Trust emerges from history.
```

This sequence is incredibly important. It is not a feature list. It is a **chain of causation**. Break any link and trust collapses.

---

## Principle One

### Everything possesses identity.

Nothing anonymous operates on the RedFace platform.

Every company, person, vehicle, camera, drone, property, sensor, evidence package, and mission possesses a verifiable digital identity on the Trust Network.

If it cannot be identified, it cannot participate.  
If it cannot be identified, it cannot be trusted.  
If it cannot be identified, its actions cannot be attributed.

Identity is not a login. Identity is **existence** on the trust network — persistent, verifiable, and attributable.

---

## Principle Two

### Identity precedes permission.

Authentication without identity is meaningless. Authorization without authentication is dangerous.

Before any entity may do anything, it must prove *who it is*. Only then may the platform determine *what it may do*.

No backdoors. No "trusted internal services" that bypass identity. No anonymous event publishing. No unauthenticated dispatch.

Identity first. Always.

---

## Principle Three

### Permission precedes action.

Default is deny.

Every action — publishing an event, accessing evidence, dispatching a resource, joining a mission, viewing a camera feed — requires explicit authorization governed by policy.

Permission is not a role assigned once. Permission is evaluated **at the moment of action**, against current policy, current identity, and current context.

A guard authorized yesterday may not be authorized today if certification lapsed. A company permitted to view evidence for one incident may not view evidence for another. Policy is live, not static.

Action without permission is rejected and logged.

---

## Principle Four

### Every action produces an event.

Nothing happens silently on the RedFace platform.

Alarm raised → event.  
Dispatch accepted → event.  
Evidence accessed → event.  
Guard state changed → event.  
Mission objective completed → event.  
Permission denied → event.

If it happened, it is an event. If it is not an event, it did not happen — as far as the platform is concerned.

Events are structured, typed, signed, and timestamped. They are the atoms of operational reality.

---

## Principle Five

### Every event becomes history.

Events are not consumed and discarded. Events are **preserved**.

History is the accumulated record of everything that has happened — across all participants, all missions, all resources, all time (subject to retention policy).

History is how operators review what happened.  
History is how auditors verify what happened.  
History is how courts determine what happened.  
History is how AI learns from what happened.

No event is ephemeral. Every event enters history.

---

## Principle Six

### History is immutable.

History is append-only.

Events are never edited. Events are never deleted. Corrections are recorded as **new events** that reference the original — never as modifications to the original.

If history can be altered silently, trust is destroyed. If evidence timestamps can be changed, chain of custody is broken. If audit logs can be edited, compliance is theatre.

Immutability is not a storage constraint. It is a **trust guarantee**.

---

## Principle Seven

### Intelligence observes history.

AI does not guess. AI does not hallucinate operational reality. AI **observes** — it reads history, traverses relationships, detects patterns, and produces recommendations.

Intelligence operates on:

- Immutable event history
- Structured operational facts extracted from history
- Relationship graphs connecting entities across history
- Trust scores computed from history

Intelligence never replaces history. Intelligence interprets history.

AI may recommend dispatch. AI may not silently dispatch.  
AI may suggest connected missions. AI may not merge missions without authorization.  
AI may predict resource demand. AI may not reallocate resources without permission.

Intelligence observes. Humans (or explicit policy) decide.

---

## Principle Eight

### Trust emerges from history.

Trust is not assigned. Trust is not purchased. Trust is not declared. Trust is not programmed.

The platform makes operations **verifiable**. Humans and institutions decide whether verifiable operations earn their trust.

Trust **emerges** from the accumulated evidence of operational behavior recorded in immutable history — when identities are proven, policies are enforced, events are signed, and history cannot be altered.

Trust scores are computed, transparent, and disputable — but they are always derived from verifiable history, never from opinion or marketing.

---

## How Principles Map to Architecture

| Principle | Architectural Layer |
|-----------|----------------------|
| Everything possesses identity | Trust Network — Digital Identity |
| Identity precedes permission | Trust Network — Authentication |
| Permission precedes action | Trust Network — Policy Engine |
| Every action produces an event | Mission Engine — Event emission |
| Every event becomes history | Trust Network — Audit Ledger |
| History is immutable | Trust Network — Append-only ledger |
| Intelligence observes history | Intelligence Layer — Graph + AI |
| Trust emerges from history | Trust Network — Trust Scores |

---

## Relationship to Other Volumes

| Volume | Relationship |
|--------|-------------|
| **Volume −1** | Philosophy — *operations must be verifiable; trust is earned* |
| **Volume 0.5 — Operational Loop** | Intent → Mission → Events → History → Intelligence → Better Intent |
| **Volume 0.5 — Theory of Missions** | Missions are adaptive orchestration, not workflows |
| **Volume 0** | Constitution codifies principles into law |
| **Operational Kernel** | Ten engines implement the principles and loop |

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-07-20 | Initial principles — eight principles in causal sequence |
