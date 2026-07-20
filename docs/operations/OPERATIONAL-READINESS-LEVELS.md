# Operational Readiness Levels (ODR)

Milestones tied to **customer reality**, not code completion.

| Level | Meaning | Status |
|-------|---------|--------|
| **ODR-1** | Operational demonstration complete — Brief, Wall, Replay, Report, acceptance test | ✅ Complete |
| **ODR-2** | Reference deployment running with real operators | ⏳ Next |
| **ODR-3** | Repeatable operational improvement demonstrated (Before/After metrics) | ⏳ |
| **ODR-4** | Multi-organization coordination validated in live ops | ⏳ |
| **ODR-5** | Operational network established across organizations | ⏳ |

---

## ODR-1 criteria (met)

- [x] Mission Brief
- [x] Operations Wall
- [x] Live Mission via kernel
- [x] Operation Replay
- [x] Mission Report
- [x] Operational acceptance test (`npm run accept:recovery`)
- [x] Stable kernel + explicit entry points

---

## ODR-2 criteria (target)

> **A real operator completed at least 50 real or shadow-mode missions using RedFace as part of their normal work.**

Not "we deployed." Fifty missions reveal patterns — one is luck, five is anecdote.

- [ ] DEP-001 in Deployment Ledger — Active
- [ ] Reference partner: willing to experiment, operationally competent, fast decisions, enough volume, weekly feedback
- [ ] **50+ missions** completed by real operators (real or shadow-mode)
- [ ] Weekly Mission Reviews recorded throughout
- [ ] Time to Operational Confidence measured
- [ ] Learning Tickets and Hypotheses populated from observed patterns
- [ ] Case study draft with Before/After metrics

**Focus:** Vehicle recovery and coordinated response only. Not hospitals, logistics, municipalities — *"Not yet."*

---

## Promotion rule

Advance ODR level only when **evidence exists in the Deployment Ledger or Case Study** — not when engineering feels ready.
