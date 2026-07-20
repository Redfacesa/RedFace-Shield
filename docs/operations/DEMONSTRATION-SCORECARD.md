# Demonstration Scorecard

**Status:** Template — fill with real baselines from first control room partner  
**Used by:** [First Operational Demonstration](FIRST-OPERATIONAL-DEMONSTRATION.md) · [Adoption Strategy](../business/ADOPTION-STRATEGY.md)  

---

## Purpose

Every demonstration ends with **measurable improvement** — not another architecture diagram.

This scorecard is the investor slide, the customer proof, and the internal gate for "did we coordinate better than today's tools?"

---

## Mission Metadata

| Field | Value |
|-------|-------|
| Demonstration | A / B / C |
| Mission type | e.g. Vehicle recovery |
| Date | |
| Control room | |
| Organizations involved | |
| Mission URI | `rtn://mission/...` |

---

## Scorecard

| Metric | Before RedFace | With RedFace | Δ | Notes |
|--------|----------------|--------------|---|-------|
| Time from trigger → dispatch | | | | |
| Time from dispatch → on-scene | | | | |
| Manual phone calls | | | | |
| Organizations coordinated without re-entry | | | | |
| Evidence items captured | | | | |
| Evidence completeness (%) | | | | |
| Chain of custody | Partial / None | Complete | | |
| Duplicate data entry (systems touched) | | | | |
| Time to operational review | | | | |
| Audit trail reconstructable? | Yes / No | Yes | | |
| Mission playback available? | No | Yes | | |
| Outcome metrics recorded? | | | | |
| Institutional learning captured? | | | | |

---

## Qualitative Observer Questions

Answer yes/no after each demonstration:

- [ ] Could an observer reconstruct what happened without calling participants?
- [ ] Was evidence defensible to an insurer or legal reviewer?
- [ ] Did capability matching reduce manual "who do we call?" decisions?
- [ ] Would the control room run the next similar mission on RedFace?

---

## Network Effect Indicators (Later Stages)

Track as organizations join:

| Indicator | Baseline | Current |
|-----------|----------|---------|
| Organizations on mission | | |
| Verified cross-org relationships | | |
| Missions without phone dispatch | | |
| Counterparties requiring RTN | | |

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Control room operator | | | |
| RedFace witness | | | |
| Insurer observer (optional) | | | |

---

## Usage

1. Fill **Before** column with control room baseline (one week of typical operations).
2. Run demonstration on RedFace.
3. Fill **With RedFace** from mission playback and audit export.
4. Attach to investor updates and customer case studies.

```bash
npm run mvp:hijacking
npm run playback:demo
# Export: GET /missions?uri=...&playback=true
```
