# Publishing RedFace Standards

Public launch follows **[Publishing Waves](PUBLISHING-WAVES.md)** — not a big-bang release.

---

## Public Repo — Wave 1 Only

When creating `github.com/redface/standards`, include **only**:

```text
standards/
├── README.md
├── PUBLISHING-WAVES.md          # optional — or summarize in README
├── whitepapers/
│   └── THE-FUTURE-OF-VERIFIABLE-OPERATIONS.md
└── guides/
    ├── immutable-evidence-chain.md
    ├── mission-based-systems.md
    └── event-driven-auditability.md
```

Do **not** include in initial public repo:

- `rsp/`, `rtn/`, `models/`, `certification/`
- `COMPATIBILITY-PROMISE.md`, `VERSION-POLICY.md`, `OPEN-BOUNDARY.md`
- Internal platform code or doctrine

---

## Monorepo vs Public Repo

| Location | Contents |
|----------|----------|
| `RedFace-Shield/standards/` | All waves — drafts marked in README |
| `github.com/redface/standards` | Wave 1 at launch; Wave 2/3 added per checklist |
| `RedFace-Shield/` (private) | Platform, kernel, evidence, deployments |

---

## Site Options

| Phase | Channel |
|-------|---------|
| Wave 1 | GitHub Pages or PDF whitepaper |
| Wave 2 | Case study on site + link from whitepaper |
| Wave 3 | `standards.redface.io` with specs + certification |

---

## Adding Wave 2

After reference customer sign-off:

1. Publish case study from [Evidence Repository](../docs/evidence/cases/)
2. Add scorecard metrics (Before / After)
3. Optionally add multi-org coordination guide

---

## Adding Wave 3

After external integrator asks how to connect:

1. Publish RSP + RTN + models
2. Publish [RSP Governance](../docs/evidence/governance/RSP-GOVERNANCE.md)
3. Publish compatibility promise + certification
4. Release `@redface/rsp` SDK with public README pointing to specs

---

## Legitimacy Checklist

- [ ] Wave 1 live — ideas only, no protocol
- [ ] Wave 2 live — one measured case study
- [ ] Wave 3 live — specs + governance + certification tests
- [ ] Every claim labelled Vision or Evidence
- [ ] No internal doctrine links in public docs
