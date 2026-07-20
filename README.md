# RedFace

> **Enable independent organizations to coordinate critical operations through verifiable, interoperable workflows.**

[North Star](docs/business/NORTH-STAR.md) · [Investment Memo](docs/business/INVESTMENT-MEMO.md) · [Investor Readiness](docs/business/INVESTOR-READINESS.md)

---

## What To Do Now

| Priority | Action | Document |
|----------|--------|----------|
| 1 | Publish **Wave 1 only** (ideas, no protocol) | [Publishing Waves](standards/PUBLISHING-WAVES.md) |
| 2 | Deploy first control room | [Reference Deployment Playbook](docs/deployments/REFERENCE-DEPLOYMENT-PLAYBOOK.md) |
| 3 | Measure outcomes | [Scorecard](docs/operations/DEMONSTRATION-SCORECARD.md) · [MCI](docs/evidence/benchmark/MISSION-COORDINATION-INDEX.md) |
| 4 | Build evidence library | [Evidence Repository](docs/evidence/README.md) |
| 5 | Wave 2 public case study | After reference customer |
| 6 | Wave 3 standards | After integrators ask how to connect |

**Do not publish RSP, RTN, or certification on day one.**

---

## Wave 1 — Publish Now

| Document |
|----------|
| [The Future of Verifiable Operations](standards/whitepapers/THE-FUTURE-OF-VERIFIABLE-OPERATIONS.md) |
| [Immutable Evidence Chain](standards/guides/immutable-evidence-chain.md) |
| [Mission-Based Systems](standards/guides/mission-based-systems.md) |
| [Event-Driven Auditability](standards/guides/event-driven-auditability.md) |

---

## Run Locally

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # if using local Node install
npm run db:local          # terminal 1 — PostgreSQL
npm run db:migrate        # terminal 2
npm run mvp:hijacking
```

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for dev setup.

---

## Internal (Do Not Publish Yet)

| Layer | Location |
|-------|----------|
| Architecture v1.0 | [docs/volume-0.75-ratification/](docs/volume-0.75-ratification/ARCHITECTURE-v1.0-RATIFIED.md) |
| Adoption | [docs/business/ADOPTION-STRATEGY.md](docs/business/ADOPTION-STRATEGY.md) |
| Wave 3 drafts | [standards/rsp/](standards/rsp/), [standards/rtn/](standards/rtn/), etc. |
| Platform code | `packages/` |

---

## Vision vs Evidence

**Vision:** What we believe is possible.  
**Evidence:** Measured outcome from a named deployment.

External documents must never confuse the two.

---

## License

Platform proprietary. Wave 1 public materials shareable with attribution.
