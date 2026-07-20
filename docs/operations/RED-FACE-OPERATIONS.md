# RedFace Operations

**RedFace Shield** is the customer product. **RedFace Operations** is how the company runs.

If we build an operational platform, we become an operational organization. That symmetry is intentional.

---

## Weekly cadence

| Day | Mode | Focus |
|-----|------|-------|
| **Monday** | Plan | Review Learning Tickets. Prioritize operational improvements. Set deployment objectives. |
| **Tue–Thu** | Execute | Engineering. Operator observation. Deployment work. |
| **Friday** | Mission Review | Missions, Decision Latency, MCI, operator stories, product requests, lessons, next hypotheses. |

No story points. No sprint theatre. **Missions, not commits.**

---

## The flywheel

```text
Deploy → Observe → Learn → Improve → Measure → Publish Case Study → Deploy Again
```

Everything else supports this cycle.

---

## Artifacts

| Artifact | Purpose |
|----------|---------|
| [Deployment Ledger](./DEPLOYMENT-LEDGER.md) | Immutable record of every deployment |
| [DEP-001 Plan](./DEP-001.md) | 90-day evidence objective + Hypotheses A/B/C |
| [What We Were Wrong About](./WHAT-WE-WERE-WRONG-ABOUT.md) | Fill after ~50 missions |
| [Decision Register](./DECISION-REGISTER.md) | Why we decided what we decided |
| [Hypothesis Ledger](./HYPOTHESIS-LEDGER.md) | Validated learning over time |
| [Hypothesis Template](./HYPOTHESIS-TEMPLATE.md) | Format for new hypotheses |
| [Learning Ticket](./LEARNING-TICKET-TEMPLATE.md) | Every backlog item traces to a mission |
| [Weekly Mission Review](./WEEKLY-MISSION-REVIEW.md) | Friday agenda |
| [Operational Readiness Levels](./OPERATIONAL-READINESS-LEVELS.md) | ODR-1 … ODR-5 |
| [Company State](./COMPANY-STATE.md) | Operational Validation — chapter closed |
| [Architecture v1.0 — Final](./ARCHITECTURE-v1.0-FINAL.md) | Evidence hierarchy; learning loop |
| [Things We Refused to Build](./THINGS-WE-REFUSED-TO-BUILD.md) | Quarterly discipline — permission to say no |

---

## Company objective (next 90 days)

> **Generate enough operational evidence to decide whether RedFace deserves to exist as an independent company.**

See [DEP-001](./DEP-001.md) — three assumptions (A: preference, B: economic improvement, C: product transfer).

Board resolution: **Architecture v1.0 ratified.** No constitutional amendments. No vertical expansion. Next milestone is empirical.

---

## Learning Velocity

Not features shipped — **validated hypotheses per month.**

| Month | Tested | Validated | Rejected |
|-------|--------|-----------|----------|
| *(DEP-001)* | — | — | — |

Rejected hypotheses are progress. Update [Hypothesis Ledger](./HYPOTHESIS-LEDGER.md) every Friday.

---

## Intentional slowdown (post ODR-1)

Product architecture and company OS are sufficient. **Market validation is the bottleneck.**

- No new major UI **features** or surfaces
- **70% operator experience polish** · 30% backend stability (bugs, WebSockets, performance)
- No new doctrine (Volume 11, new axioms, constitutional articles)
- When a question arises: *Can this be answered by running another mission?* If yes — run it, don't write a document

---

## Focus

Stay obsessively on **vehicle recovery and coordinated response** until ODR-3.

*"Can it do hospitals / logistics / mining?"* → **Not yet.** Focus is the competitive advantage.

---

## CEO metric: Operational Hours

> Hours spent running real operations on RedFace.

Software that's used accumulates operational experience. You can't fake operational hours. Track from DEP-001 onward.

---

## Rule

> **For every week spent writing code, spend at least one day watching operators use the product.**

---

## Mission Intelligence

Internal only: `/intel` in the control room app (team use).

Answers four questions — not a vanity analytics dashboard:

1. Are deployments healthy?
2. Are operators succeeding?
3. What are we learning?
4. Where should engineering focus next?
