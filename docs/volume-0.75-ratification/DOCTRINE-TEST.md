# Volume 0.75: The Doctrine Test

**Status:** Draft — Ratification Phase  
**Authority:** Subordinate to [Axioms](AXIOMS.md); required for all features, APIs, and integrations  
**Scope:** Gate for Architecture v1.0 compliance

---

## Purpose

Every future feature must pass the Doctrine Test before design approval, implementation, or merge.

If a feature cannot answer these questions, it is **not ready** — regardless of customer pressure, investor interest, or engineering convenience.

This is how architecture stays consistent when ten engineers work independently.

---

## The Test

| # | Question | Required Answer |
|---|----------|-----------------|
| 1 | **Which axiom does it rely on?** | One or more of Axioms 1–15 with justification |
| 2 | **Which engine owns it?** | Exactly one primary engine from the Operational Kernel |
| 3 | **Which object changes state?** | Intent, Mission, Resource, Capability, Evidence, etc. — canonical terms only |
| 4 | **Which events are emitted?** | RSP event types; signed; mission-attached |
| 5 | **What history is preserved?** | Immutable events appended; supersession path if correction needed |
| 6 | **How is it verified?** | Identity, signature, policy, audit — which mechanisms |
| 7 | **How does it improve intelligence?** | Learning path: what history enables future recommendations |
| 8 | **Does it introduce a new primitive?** | Yes/No — if Yes, doctrine amendment required (Axiom 15) |
| 9 | **Does it violate any non-goal?** | Explicit check against [Non-Goals](NON-GOALS.md) |
| 10 | **Does it use canonical language?** | Terms match [Canonical Language](CANONICAL-LANGUAGE.md) |

---

## Pass Criteria

**Pass:** All ten questions answered. No non-goal violations. No new primitives without amendment. Primary engine ownership clear.

**Conditional Pass:** Questions 7 or 10 partially deferred — only for internal tooling with explicit exclusion from operational history. Requires architecture review sign-off.

**Fail:** Any unanswered question. Any non-goal violation. Any new primitive without amendment. Any editable history path. Any AI-invented fact path.

Failed features return to design. They do not proceed to implementation.

---

## Example — Pass

**Feature:** Auto-match recovery capability when vehicle stolen intent declared.

| # | Answer |
|---|--------|
| 1 | Axiom 4 (Intent → Mission), Axiom 10 (Capabilities over orgs), Axiom 11 (Mission owns execution) |
| 2 | Resource Engine (match); Mission Engine (create mission) |
| 3 | Intent: `declared → mission_created`; Mission: `planning → active`; Resources: `available → allocated` |
| 4 | `rsp.intent.accepted`, `rsp.mission.created`, `rsp.recovery.dispatched` |
| 5 | All events append to mission timeline; no edits |
| 6 | Verified identity for intent expressor; policy permits auto-dispatch; signed events |
| 7 | Match success/failure feeds recovery capability trust scores and match algorithm |
| 8 | No |
| 9 | No violations |
| 10 | Uses Intent, Mission, Capability, Resource — canonical |

**Result:** Pass.

---

## Example — Fail

**Feature:** Allow control room supervisor to edit dispatch timestamp for billing reports.

| # | Answer |
|---|--------|
| 1 | ??? |
| 2 | ??? |
| 3 | Attempts to modify Event timestamp |
| 4 | None — silent edit |
| 5 | Mutates history — **violates Axiom 6, 7** |
| 6 | None |
| 7 | None |
| 8 | No |
| 9 | **Violates Non-Goal 9** (editable history) |
| 10 | "Edit event" — deprecated term |

**Result:** Fail. Correct approach: supersession event with rationale, or billing event separate from operational event.

---

## Example — Fail (AI Facts)

**Feature:** AI automatically writes "suspect entered west gate" into mission history from video without human confirmation.

| # | Answer |
|---|--------|
| 1 | Attempts to bypass Axiom 8 |
| 7 | Creates fact without event attestation |
| 9 | **Violates Non-Goal 2** (fabricated facts) |

**Result:** Fail. Correct approach: AI emits hypothesis; operator confirms → `rsp.evidence.extracted` or verified observation event.

---

## Review Process (Ratification Phase)

1. Author completes Doctrine Test table in feature spec or PR description
2. Reviewer checks against Axioms, Language, Models, Non-Goals
3. Pass → proceed
4. Fail → redesign or doctrine amendment (rare)

During Ratification Phase, **architecture reviewers** include founding doctrine authors. Post v1.0, trained reviewers apply the same test.

---

## Architecture v1.0 Declaration

Architecture v1.0 is declared when:

- [ ] Volume −1 (Philosophy) ratified
- [ ] Volume 0 (Constitution) ratified
- [ ] Volume 0.5 (Loop, Missions, Kernel) ratified
- [ ] Volume 0.75 (Axioms, Language, Models, Non-Goals, Doctrine Test) ratified
- [ ] No open primitive disputes
- [ ] Founding team sign-off

After v1.0: **no new foundational concepts** without Architecture v1.x amendment process.

Implementation (RTN, Mission Engine, Shield MVP) begins only after v1.0.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.75-draft | 2026-07-20 | Initial Doctrine Test — Ratification Phase |
