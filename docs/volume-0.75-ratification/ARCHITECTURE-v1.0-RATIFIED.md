# Architecture v1.0 — Ratified

**Status:** Ratified  
**Date:** 2026-07-20  
**Authority:** Founding architecture approval  

---

## Declaration

> **Architecture v1.0 is ratified.**

Not because it is perfect. Because it is **internally consistent**.

From this date forward, architecture changes are **constitutional amendments** — not ordinary feature work.

Implementation may proceed. Doctrine may not drift.

---

## What v1.0 Includes

| Layer | Contents |
|-------|----------|
| Philosophy | Operations must be verifiable; trust is earned |
| Axioms | Fifteen invariants — [AXIOMS.md](AXIOMS.md) |
| Language | Canonical vocabulary — [CANONICAL-LANGUAGE.md](CANONICAL-LANGUAGE.md) |
| Engine Contract | Owns · Consumes · Produces · Never Does — [ENGINE-CONTRACT.md](ENGINE-CONTRACT.md) |
| Kernel | Identity, Organization, Ownership, Capability, Trust, Attestation, Intent, Mission, Resource, Policy, Event, History |
| Addressing | RTN URI scheme |
| Protocol | RSP event model — versioned, immutable once released |
| Rules | Adapters translate only; UI displays and submits intents; Policy decides access |

Credential Engine, Session Engine, Intelligence, and Economy are **specified** but not required for v1.0 ratification. Their contracts exist; implementation follows operational proof.

---

## Amendment Process

Changes to ratified architecture require a **constitutional amendment**:

1. **Proposal** — written amendment describing what changes and why no existing primitive suffices
2. **Doctrine Test** — all ten questions answered; axioms cited or amended
3. **Engine Contract review** — affected engines updated before code
4. **Version bump** — semantic version increment on affected engines ([ENGINE-VERSIONS.md](ENGINE-VERSIONS.md))
5. **Ratification sign-off** — explicit approval; amendment logged below

**Permitted without amendment:**
- Implementing specified engines
- Operational demonstrations
- Adapters using RSP SDK
- Reference implementations (Shield, Commerce)
- Bug fixes that restore intended behavior
- Projections, UI, simulators, playback

**Not permitted without amendment:**
- New axioms or primitives
- New kernel engines without contract
- Stored trust scores as source of truth
- Editable history
- Auth granting access directly (Credential proves; Policy decides)
- Adapters containing business logic

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| **1.0** | 2026-07-20 | Initial ratification — Operational Kernel architecture frozen |

---

## What Comes Next

Architecture is complete enough to be **boring**.

Progress is measured by **operational proof**, not engines completed:

See [The First Operational Demonstration](../operations/FIRST-OPERATIONAL-DEMONSTRATION.md).
