# Volume 0.75: Canonical Language

**Status:** Draft — Ratification Phase  
**Authority:** Subordinate to [Axioms](AXIOMS.md); governs all documentation, code, APIs, and conversation  
**Scope:** One word. One meaning. Forever.

---

## Purpose

One of the biggest reasons companies become confusing: everyone invents terminology.

This document defines the **canonical vocabulary** of RedFace. When an engineer, product manager, investor, or partner uses these words, they mean exactly what is defined here — not what their previous employer meant.

Synonyms in conversation must map to these terms. Deprecated terms are listed explicitly.

---

## Core Primitives

### Intent

A **declared desired outcome** expressed by a verified identity.

- *Is:* "Recover vehicle CA 123 456 GP safely"
- *Is not:* An alarm, a payment, a ticket, a workflow trigger

**Engine:** Intent Engine  
**Identity prefix:** `RF-INT-*`

---

### Mission

**One objective executed through adaptive orchestration** across participants, resources, and policies.

- *Is:* Recover the vehicle; deliver the order; contain the fire
- *Is not:* A workflow, an incident, a task list, a Jira ticket, a case number

Missions adapt execution while holding the objective fixed.

**Engine:** Mission Engine  
**Identity prefix:** `RF-MSN-*`

---

### Incident

A **triggering event or situation** that may initiate one or more intents and missions.

- *Is:* The hijacking signal, the verified alarm, the fire detection
- *Is not:* The operational center of the system; not synonymous with mission

Incidents may receive a universal reference ID for legal and insurance cross-org use. Operations orchestrate through missions.

**Identity prefix:** `RF-2026-*` (universal incident reference)

---

### Capability

A **verifiable operational function** an organization can perform.

- *Is:* `vehicle_recovery`, `armed_response`, `drone_operations`, `k9_unit`
- *Is not:* A company name, a person, a job title, a marketing claim

Capabilities are registered, verified, and matched to mission requirements.

**Engine:** Resource Engine  
**Identity prefix:** `RF-CAP-*`

---

### Resource

Anything **concretely allocatable** to a mission: person, vehicle, drone, equipment, control room slot.

- *Is:* Guard #204, Vehicle 18, Drone Alpha
- *Is not:* A capability (abstract); a company (organization)

Resources have state, location, and availability. Capabilities describe what resources (or organizations) can do.

**Engine:** Resource Engine  
**Identity prefix:** `RF-AST-*`, `RF-PER-*`

---

### Event

A **signed, immutable record** that something happened at a point in time.

- *Is:* `rsp.dispatch.accepted`, `rsp.evidence.created`
- *Is not:* A log line, a chat message, an editable database row

Events belong to mission timelines. Events are never edited.

**Engine:** Event Engine  
**Identity prefix:** `RF-EVT-*`  
**Protocol:** RSP (Volume 3)

---

### History

The **immutable accumulation of verified events** — derived, never rewritten.

- *Is:* Audit trail, mission timeline, compliance record
- *Is not:* A mutable database, a report that can be regenerated with different numbers, an editable case file

**Engine:** History Engine

---

### Evidence

**History suitable for verification** — typically media or documents under chain of custody.

- *Is:* Bodycam recording with hash, signature, and custody chain
- *Is not:* An unverified screenshot, an editable PDF, raw video without custody

Evidence is a specialized class of history object governed by Trust Engine.

**Engine:** Trust Engine  
**Identity prefix:** `RF-EVD-*`

---

### Policy

A **rule constraining execution** — who may do what, when, under what conditions.

- *Is:* "Share live feed with Org X when alarm verified in Zone Y"
- *Is not:* Business preference, informal agreement, UI configuration without enforcement

Default deny. Policies are versioned and auditable.

**Engine:** Policy Engine

---

### Outcome

The **measured result of a mission** — success, partial success, failure, or cancel — with metrics.

- *Is:* Vehicle recovered in 18 minutes; 96% objective completion
- *Is not:* A closed ticket without metrics; an undocumented resolution

Every mission produces an outcome before archival.

**Engine:** Mission Engine

---

### Trust

**Confidence derived from verifiable operational history** — computed, not asserted.

- *Is:* Response time average 4m 22s over 500 missions; evidence quality 98%
- *Is not:* Marketing claim, platform guarantee, purchased rating, social reputation

Humans decide whether computed trust is sufficient. The platform provides verifiable basis.

**Engine:** Trust Engine

---

### Identity

A **unique participant** in the Operational Graph — organization, person, asset, property, or operational object.

- *Is:* Verified, attributable, persistent `RF-*` identifier
- *Is not:* A display name, an email alone, an unverified API key

**Engine:** Identity Engine

---

## Platform Terms

### Operational Loop

The continuous cycle: **Intent → Mission → Events → History → Intelligence → Better Intent**

Every RedFace vertical implements this loop. Not optional.

---

### Operational Kernel

The ten engines that implement RedFace: Identity, Trust, Intent, Mission, Resource, Policy, Event, History, Intelligence, Economy.

Applications compose engines. Applications do not embed kernel logic.

---

### Operational Graph

The semantic model connecting all primitives — nodes, edges, state — in one graph. Not a database brand. An abstraction.

---

### Reference Implementation

An application proving the kernel for one vertical. **Shield** = security. **Commerce** = economic fulfillment. Reference implementations are not the platform.

---

### RSP (RedFace Shield Protocol)

The **event language** — envelope format, event types, publish/subscribe. Transport-agnostic. Third parties may implement RSP without RedFace software.

---

### Supersession

The **only permitted correction mechanism** for erroneous events. A new event references and supersedes the original. The original remains in history.

---

## Deprecated Terms

Do not use these in doctrine, code, or product specs:

| Deprecated | Use Instead |
|------------|-------------|
| "Trust platform" (as product category) | Operational Infrastructure Platform |
| "Incident management" | Mission orchestration |
| "Case" (as operational object) | Mission, or Incident (reference only) |
| "Workflow" (for mission execution) | Mission (adaptive orchestration) |
| "Programmable trust" | Verifiable operations; trust earned |
| "Customer" (for network participant) | Participant |
| "Security platform" (internal) | Shield reference implementation |
| "Edit event" / "Update history" | Supersede with new event |
| "AI decided" | AI recommended; human/policy confirmed |
| "Find Company X" | Match required capabilities |

---

## Usage Rule

If a meeting introduces a term not in this document:

1. Map it to an existing primitive, or
2. Propose a doctrine amendment (Axiom 15), or
3. Reject the term

No shadow vocabulary.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.75-draft | 2026-07-20 | Initial canonical language — Ratification Phase |
