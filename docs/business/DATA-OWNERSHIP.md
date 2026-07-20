# Data Ownership & Commercial Framework

**Status:** Draft — must be clear before multi-organization missions  
**Addresses:** Investor Risk 3 — who owns what when multiple parties participate  

---

## Principle

**Events belong to the mission. Missions belong to participants. Intelligence belongs to policy.**

No silent exfiltration. No ambiguous "platform owns everything."

---

## Ownership Matrix

| Asset | Primary owner | Participants get | Platform gets |
|-------|---------------|------------------|---------------|
| **Mission timeline (events)** | Mission steward org | Read access per role | Processing, playback engine — not content ownership |
| **Raw events** | Source organization | Copy on mission they joined | Hosting — not IP transfer |
| **Evidence objects** | Legal owner + evidence steward | Custody chain visibility | Verification infrastructure |
| **Playback projections** | Derived from events — same as timeline | Export per policy | Engine proprietary; output follows mission access |
| **Institutional learning** | Each organization | Their own lessons | — |
| **Network intelligence packs** | Platform (anonymized aggregate) | Licensed access per tier | Derived, anonymized — never raw mission export |
| **Derived trust scores** | Computed — not stored as owned property | Ephemeral view of subject | Algorithm proprietary |
| **Operator PII** | Employing organization | — | Processor under agreement |

---

## Multi-Organization Rules

1. **Join mission explicitly** — no passive data sharing  
2. **Policy decides visibility** — not default public  
3. **Export requires steward approval** — audit logged  
4. **Withdrawal** — org can leave mission; events they published remain (immutable history)  
5. **Anonymized aggregates** — opt-in or contractually defined for intelligence packs  

---

## Customer Agreements (Commercial)

Every reference deployment contract should specify:

| Clause | Question answered |
|--------|-------------------|
| Data residency | Where events are stored |
| Retention | How long mission history kept |
| Export | Who can export playback and evidence |
| Subprocessors | Who processes data (hosting, AI) |
| Intelligence | Whether anonymized outcomes feed network learning |
| Termination | What customer receives on exit |

---

## What RedFace Does Not Claim

- Ownership of customer's operational secrets  
- Right to sell raw mission data to third parties  
- Perpetual lock-in of exported evidence — customer can export what policy allows  

---

## What RedFace Does Claim (Proprietary)

- Operational Kernel implementation  
- Playback engine and analytics  
- Anonymized network intelligence (where contracted)  
- RSP reference SDK (open) vs hosted coordination (commercial)  

See [Open Boundary](../../standards/OPEN-BOUNDARY.md) — Wave 3.

---

## Investor Diligence Answer

> "Who owns mission history when insurer, control room, and field company share a mission?"

**Answer:** Each organization owns what it published. The mission steward governs access. RedFace hosts and processes under contract — does not own the operational record. Export and intelligence terms are explicit in commercial agreement.

---

## Amendment Log

| Date | Change |
|------|--------|
| 2026-07-20 | Initial framework — pre-legal review |

*Requires legal review before customer contracts.*
