# Mission Coordination Index (MCI)

**Status:** Defined — populate with reference customer data  
**Purpose:** Single north-star operational metric for company, customer, and investor alignment  

Not revenue. Not users. **Coordination quality.**

---

## Definition

MCI measures how effectively independent organizations execute missions on the platform — relative to manual friction.

Conceptual form:

```text
        Mission Success
      × Evidence Completeness
      × Response Efficiency
      × Cross-Organization Coordination
      ─────────────────────────────────
              Manual Operational Friction
```

Higher is better. Friction in the denominator — reducing phone calls, duplicate entry, and handoffs increases MCI.

---

## Component Metrics

Each component is scored **0.0 – 1.0** per mission or aggregated over a period.

| Component | Measures | Source |
|-----------|----------|--------|
| **Mission Success** | Objective achieved with recorded outcome | Mission outcome `result` + metrics |
| **Evidence Completeness** | Required evidence captured / required | Mission audit |
| **Response Efficiency** | Time vs baseline or SLA | Playback timestamps vs scorecard |
| **Cross-Org Coordination** | Orgs on mission without duplicate re-entry | Participant count, manual steps |
| **Manual Friction** | Phone calls + duplicate systems + reconstruction time | Scorecard (inverse — lower friction raises MCI) |

---

## Calculation (v0.1)

Per mission:

```text
numerator = missionSuccess × evidenceCompleteness × responseEfficiency × crossOrgCoordination

frictionScore = 1 / (1 + manualPhoneCalls + duplicateSystemTouches + reconstructionHours)

MCI = numerator × frictionScore
```

Scale to **0 – 100** for reporting: `MCI × 100`

**Example:**

| Component | Value |
|-----------|-------|
| Mission success | 1.0 |
| Evidence completeness | 0.9 |
| Response efficiency | 0.85 |
| Cross-org coordination | 0.7 |
| Friction score | 0.25 (high friction) |

```text
numerator = 1.0 × 0.9 × 0.85 × 0.7 = 0.535
MCI = 0.535 × 0.25 = 0.134 → MCI score 13.4 / 100
```

After improvement (friction reduced):

```text
frictionScore = 0.55
MCI = 0.535 × 0.55 = 0.294 → MCI score 29.4 / 100
```

Report **Δ MCI** before vs after — not absolute alone.

---

## Aggregation

| Level | Use |
|-------|-----|
| Per mission | Operator feedback, playback review |
| Weekly | Control room standup |
| 30-day | Reference customer benchmark |
| Investor | Trend across n ≥ 30 missions |

---

## Relationship to Other Metrics

| Metric | Relationship |
|--------|--------------|
| [Operational Benchmark](OPERATIONAL-BENCHMARK.md) | Component inputs |
| [Demonstration Scorecard](../../operations/DEMONSTRATION-SCORECARD.md) | Raw Before/After counts |
| Revenue | Lagging — follows proven MCI improvement |

---

## Reporting Discipline

| Label | Allowed |
|-------|---------|
| **Evidence** | "MCI improved from 13 to 29 over 30 missions at Control Room X" |
| **Vision** | "MCI can measure coordination quality" |

Never report MCI without sample size, period, and customer context.

---

## Why One Metric

Investors, operators, and product teams align when asking:

> "Did coordination get better?"

Not: "Did we ship another engine?"

---

## Amendment Log

| Date | Change |
|------|--------|
| 2026-07-20 | MCI v0.1 defined |
