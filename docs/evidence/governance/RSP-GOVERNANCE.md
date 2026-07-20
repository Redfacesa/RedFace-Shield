# RSP Governance

**Status:** Draft — publish with Wave 3 standards  
**Question answered:** *Who decides what RSP becomes?*

---

## Current Steward

Today, RedFace maintains the RSP specification as **steward** — not owner of implementations.

Third parties may implement RSP without RedFace software. RedFace commits to transparent evolution documented here.

As adoption grows, governance may expand to an advisory council. This document defines how decisions are made **now** and how they may evolve.

---

## Decision Types

| Decision | Authority (today) | Future |
|----------|---------------------|--------|
| New event type (`.v1`) | RedFace standards team | + Advisory council review |
| Breaking envelope change (RSP 2.0) | RedFace + 12-month notice | Council ratification |
| Certification test updates | RedFace | Independent test body |
| RTN kind registration | RedFace standards team | Public registry + proposal |
| Deprecation | RedFace + compatibility promise | Council + vote |

---

## Proposal Process

1. **Problem statement** — industry interoperability pain, not RedFace product need  
2. **Evidence** — Wave 2 deployment(s) demonstrating the gap  
3. **Draft spec change** — PR to public `redface/standards` repo  
4. **Comment period** — minimum 30 days for MAJOR; 14 days for MINOR  
5. **Release** — version bump per [Version Policy](../../standards/VERSION-POLICY.md)  
6. **Certification update** — tests published before enforcement  

---

## Versioning Authority

- **PATCH** — clarifications, RedFace standards team  
- **MINOR** — new event types, optional fields — standards team + documented in changelog  
- **MAJOR** — breaking changes — requires evidence of industry need + 12-month overlap  

See [Compatibility Promise](../../standards/COMPATIBILITY-PROMISE.md).

---

## Certification Authority

RedFace operates certification tests initially.

Goal: independent certification body as ecosystem matures — same model as PCI, Wi-Fi Alliance, or Khronos early stages.

Revocation criteria published in [Certification Program](../../standards/certification/CERTIFICATION-PROGRAM.md).

---

## Advisory Council (Future)

When **≥5 organizations** ship RSP-compatible integrations:

- Invite control room, insurer, vendor, municipality, integrator representatives  
- Quarterly review of proposals  
- No veto over RedFace Platform product — **protocol only**  

Formation criteria documented here when triggered.

---

## Transparency Commitments

- All released spec changes have public changelog  
- Draft specs marked DRAFT — not covered by compatibility promise  
- Governance document updated when authority shifts  
- No retroactive incompatible changes to released `.v1` event types  

---

## Why Publish With Wave 3

Publishing governance before standards creates bureaucracy without adoption.

Publishing governance **with** standards answers the first question integrators ask:

> "If we build on this, who controls our future?"

Answer: documented process, compatibility promise, and evolving council — not silent vendor lock-in.

---

## Amendment Log

| Version | Date | Change |
|---------|------|--------|
| 0.1-draft | 2026-07-20 | Initial governance model — publish with Wave 3 |
