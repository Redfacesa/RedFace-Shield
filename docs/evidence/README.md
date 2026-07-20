# Evidence Repository

**The company's library of operational proof — not isolated success stories.**

Every demonstration produces a structured case study. Over time this becomes one of RedFace's most valuable assets.

---

## Purpose

| Without repository | With repository |
|--------------------|-----------------|
| "We ran a demo" | "Here are 12 deployments with measured outcomes" |
| Anecdotes | Comparable evidence |
| Sales claims | Cited measurements |

External documents must **separate Vision from Evidence**. This repository holds Evidence.

---

## Case Study Structure

Every entry uses the same template:

1. **Initial situation** — how operations worked before  
2. **Operational process** — what was deployed  
3. **Timeline** — mission playback or key events  
4. **Before metrics** — baseline scorecard  
5. **After metrics** — measured improvement  
6. **Lessons learned** — institutional + platform  
7. **Remaining limitations** — honest constraints  

Template: [CASE-STUDY-TEMPLATE.md](templates/CASE-STUDY-TEMPLATE.md)

---

## Cases

| ID | Customer | Mission type | Status | Wave |
|----|----------|--------------|--------|------|
| — | *Reference control room TBD* | Vehicle recovery | Pending | 2 |

Store completed case studies in `cases/`:

```text
docs/evidence/cases/
└── 2026-001-control-room-vehicle-recovery.md   (when ready)
```

---

## Related Artifacts

| Artifact | Purpose |
|----------|---------|
| [Demonstration Scorecard](../operations/DEMONSTRATION-SCORECARD.md) | Before / After metrics |
| [Operational Benchmark](benchmark/OPERATIONAL-BENCHMARK.md) | Repeatable measurement framework |
| [Mission Coordination Index (MCI)](benchmark/MISSION-COORDINATION-INDEX.md) | North-star operational metric |
| [Reference Deployment Playbook](../deployments/REFERENCE-DEPLOYMENT-PLAYBOOK.md) | How first customer deploys |
| [Publishing Waves](../../standards/PUBLISHING-WAVES.md) | When case studies go public |

---

## Vision vs Evidence Labels

Use in every external-facing case study:

**Vision:** "Mission-based coordination can reduce operational fragmentation."

**Evidence:** "In Demonstration A with [Control Room X], manual coordination steps decreased from 12 to 7 over 30 missions."

Never publish Evidence without naming the deployment, period, and measurement method.

---

## Governance

Case studies require:

- Customer approval for public Wave 2 publication  
- Internal review that metrics are accurate  
- Limitations section — no overclaiming  

---

## Amendment Log

| Date | Change |
|------|--------|
| 2026-07-20 | Evidence Repository established |
