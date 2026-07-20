# Publishing Waves

**Rule:** Standards gain legitimacy when backed by evidence — not ideas.

Do not publish the full standards ecosystem on day one. Publish in waves.

---

## Wave 1 — Thought Leadership *(publish now)*

Introduce ideas. Do not ask anyone to adopt anything.

| Document | Path |
|----------|------|
| The Future of Verifiable Operations | [whitepapers/THE-FUTURE-OF-VERIFIABLE-OPERATIONS.md](whitepapers/THE-FUTURE-OF-VERIFIABLE-OPERATIONS.md) |
| How to Design an Immutable Evidence Chain | [guides/immutable-evidence-chain.md](guides/immutable-evidence-chain.md) |
| Designing Mission-Based Operational Systems | [guides/mission-based-systems.md](guides/mission-based-systems.md) |
| Event-Driven Operations and Auditability | [guides/event-driven-auditability.md](guides/event-driven-auditability.md) |

**Not in Wave 1:** protocol specs, certification, RTN, RSP, compatibility promise, governance.

**Tone:** Vision clearly labelled. No adoption ask. No RedFace product pitch.

---

## Wave 2 — Demonstrated Reality *(after reference customer)*

Publish when one control room has run real missions with measured outcomes.

| Document | Source |
|----------|--------|
| Reference customer case study | [Evidence Repository](../docs/evidence/README.md) |
| Before / After scorecard | [Demonstration Scorecard](../docs/operations/DEMONSTRATION-SCORECARD.md) |
| Optional: Multi-organization coordination guide | [guides/multi-organization-coordination.md](guides/multi-organization-coordination.md) |

**Headline format:**

> "Here's how one control room reduced coordination friction."

Theory becomes observed outcome. Separate **Vision** from **Evidence** in every document.

---

## Wave 3 — Standards *(after Wave 2 evidence exists)*

Publish only when the industry asks: *"How do other systems integrate with what has already been proven?"*

| Document | Path |
|----------|------|
| RSP Specification | [rsp/RSP-SPECIFICATION.md](rsp/RSP-SPECIFICATION.md) |
| RTN URI Specification | [rtn/RTN-URI-SPECIFICATION.md](rtn/RTN-URI-SPECIFICATION.md) |
| Mission Model | [models/MISSION-MODEL.md](models/MISSION-MODEL.md) |
| Event Model | [models/EVENT-MODEL.md](models/EVENT-MODEL.md) |
| Compatibility Promise | [COMPATIBILITY-PROMISE.md](COMPATIBILITY-PROMISE.md) |
| Version Policy | [VERSION-POLICY.md](VERSION-POLICY.md) |
| Certification Program | [certification/CERTIFICATION-PROGRAM.md](certification/CERTIFICATION-PROGRAM.md) |
| Open Boundary | [OPEN-BOUNDARY.md](OPEN-BOUNDARY.md) |
| RSP Governance | [../docs/evidence/governance/RSP-GOVERNANCE.md](../docs/evidence/governance/RSP-GOVERNANCE.md) |

**Principle:** Never publish a standard because RedFace needs it. Publish because the industry has a recurring interoperability problem Wave 2 proved.

---

## Public Repository Launch

**Day one public repo contains Wave 1 only.**

Wave 2 and Wave 3 documents stay in this monorepo as drafts until their wave criteria are met. Then copy to `github.com/redface/standards` (or publish on site).

See [PUBLISHING.md](PUBLISHING.md) for repo split mechanics.

---

## Checklist Before Each Wave

### Wave 1
- [ ] Vision vs Evidence labels on all published docs
- [ ] No protocol or certification pages public
- [ ] Whitepaper PDF export
- [ ] No "adopt RSP" language

### Wave 2
- [ ] Reference customer agreed to public case study
- [ ] Scorecard Before/After filled with real measurements
- [ ] Claims cite specific numbers — not generalities
- [ ] Limitations section included

### Wave 3
- [ ] At least one external integrator asked "how do we connect?"
- [ ] Governance model published alongside specs
- [ ] Compatibility promise ratified
- [ ] Certification test suite exists

---

## Amendment Log

| Date | Change |
|------|--------|
| 2026-07-20 | Wave sequencing defined — Wave 1 only at public launch |
