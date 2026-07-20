# Reference Deployment Playbook

**Audience:** First control room customer — not engineers  
**Goal:** Turn architecture into an adoption process  

---

## Overview

This playbook answers how the **first reference customer** goes from signed agreement to measured operational improvement in 30 days.

**North Star:**

> Enable independent organizations to coordinate critical operations through verifiable, interoperable workflows.

---

## 1. How Long Does Deployment Take?

| Phase | Duration | Outcome |
|-------|----------|---------|
| **Kickoff** | Day 0 | Roles, mission types, baseline scorecard |
| **Configuration** | Days 1–3 | Orgs, resources, capabilities registered |
| **Training** | Day 3–4 | Operators run simulated mission |
| **First live mission** | Day 5–7 | One mission class on platform |
| **Steady state** | Days 8–30 | 20–30 missions, remeasure benchmark |
| **Case study** | Day 30+ | Wave 2 evidence publication (optional) |

**Target time to value:** First successful mission within **1 business day** of operator training.

---

## 2. What Systems Connect First?

Priority order — do not connect everything at once.

| Priority | System | Method | Why |
|----------|--------|--------|-----|
| 1 | Control room operators | Platform UI / API | Mission orchestration hub |
| 2 | Field responders | Mobile or manual event entry | Dispatch loop |
| 3 | One insurer or client observer | Read-only mission access | Evidence verification |
| 4 | Simulator | RSP SDK | Training without hardware |
| 5 | One camera or tracker | RSP adapter | After 10+ successful manual missions |

**Wave 3 integrations** (formal RSP adapters) come after operational proof — not before.

---

## 3. What Data Is Imported?

| Data | Import method | Required? |
|------|---------------|-----------|
| Organizations | Register with RTN URI | Yes |
| Operators / guards | Identity registration | Yes |
| Resources (vehicles, units) | Resource registration + location | Yes |
| Capabilities | Register what org can do | Yes |
| Historical missions | **Do not import** | No — start fresh timeline |
| Legacy tickets | **Do not migrate** | No — parallel run if needed |

Start clean. Verifiable history begins at first intent on platform.

---

## 4. How Are Operators Trained?

| Session | Duration | Content |
|---------|----------|---------|
| **Concept** | 1 hour | Intent → Mission → Events → Outcome (not software tour) |
| **Simulated mission** | 2 hours | Run vehicle recovery in simulator |
| **Playback review** | 30 min | Read timeline; understand audit value |
| **Live shadow** | 1 shift | RedFace witness on first real mission |

Training focuses on **operating model**, not feature clicks.

---

## 5. What Does Day 1 Look Like?

- [ ] Kickoff with control room manager + lead dispatcher  
- [ ] Baseline scorecard — measure last week's typical missions  
- [ ] Register organizations and operators  
- [ ] Register resources and capabilities  
- [ ] Run one **simulated** mission end-to-end  
- [ ] Review playback with operators — collect friction notes  

No live mission on Day 1 unless team is confident.

---

## 6. What Does the First Live Mission Look Like?

Choose **one mission class** — e.g. vehicle recovery or alarm response.

| Step | Operator action | Platform |
|------|-----------------|----------|
| 1 | Receive trigger (call, alarm) | — |
| 2 | Declare intent | Intent Engine |
| 3 | Accept and create mission | Mission Engine |
| 4 | Match resources by capability | Resource Engine |
| 5 | Dispatch | Events on timeline |
| 6 | Field updates (arrive, evidence) | Events |
| 7 | Complete with outcome metrics | Mission closure |
| 8 | Review playback | Audit / training |

RedFace witness present. Observer from insurer optional.

Fill [Demonstration Scorecard](../operations/DEMONSTRATION-SCORECARD.md) immediately after.

---

## 7. How Do You Measure Success After 30 Days?

Use [Operational Benchmark](../evidence/benchmark/OPERATIONAL-BENCHMARK.md):

| Success signal | Target |
|----------------|--------|
| Missions on platform | ≥ 20 of target class |
| Time to value | First success within 1 day of training |
| Coordination steps | Measurable reduction vs baseline |
| Operator willingness | "Would run next mission on RedFace" = yes |
| Independent observer | Can reconstruct mission without phone calls |
| Case study ready | Before/After metrics + limitations documented |

Schedule Day 30 review with customer approver.

---

## 8. What Does Expansion Look Like?

After reference customer success:

| Step | Action |
|------|--------|
| 1 | Second organization joins **their** network (insurer or field company) |
| 2 | Publish Wave 2 case study (with approval) |
| 3 | Customer Advisory Group invites second operator voice |
| 4 | Add second mission type (Demonstration B or C) |
| 5 | First RSP hardware adapter (Wave 3 prep) |
| 6 | Publish standards when integrators ask how to connect |

Expansion is **depth in one city**, not breadth nationally.

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Customer sponsor** | Control room manager — authority + public reference |
| **Lead operator** | Day-to-day mission execution |
| **RedFace deployment lead** | Configuration, training, witness |
| **Observer (optional)** | Insurer / municipal — independent validation |

---

## Documents Used

| Document | When |
|----------|------|
| [Demonstration Scorecard](../operations/DEMONSTRATION-SCORECARD.md) | Every mission → Day 30 aggregate |
| [Case Study Template](../evidence/templates/CASE-STUDY-TEMPLATE.md) | Day 30 |
| [Adoption Strategy](../business/ADOPTION-STRATEGY.md) | Internal — network expansion |
| [Publishing Waves](../../standards/PUBLISHING-WAVES.md) | When to go public |

---

## What This Playbook Is Not

- Not an engineering install guide (see `IMPLEMENTATION.md` for dev setup)  
- Not a sales contract  
- Not a promise of outcomes — a process to **measure** them  

---

## Amendment Log

| Date | Change |
|------|--------|
| 2026-07-20 | Initial reference deployment playbook |
