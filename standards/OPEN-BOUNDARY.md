# Open Boundary

> **DRAFT — Wave 3.** Publish when open vs proprietary split becomes relevant to integrators.

**Publishing wave:** 3 — internal draft only  

What is **open for the ecosystem** vs what remains **proprietary to RedFace**.

Infrastructure companies succeed when the protocol is open and the platform is valuable.

---

## Open (Ecosystem)

Anyone may implement without RedFace commercial agreement:

| Asset | Location |
|-------|----------|
| RSP event specification | [rsp/RSP-SPECIFICATION.md](rsp/RSP-SPECIFICATION.md) |
| RTN URI format | [rtn/RTN-URI-SPECIFICATION.md](rtn/RTN-URI-SPECIFICATION.md) |
| Mission & event models | [models/](models/) |
| Certification requirements | [certification/CERTIFICATION-PROGRAM.md](certification/CERTIFICATION-PROGRAM.md) |
| Compatibility promise | [COMPATIBILITY-PROMISE.md](COMPATIBILITY-PROMISE.md) |
| Version policy | [VERSION-POLICY.md](VERSION-POLICY.md) |
| RSP SDK (reference) | `@redface/rsp` |
| Developer guides | [guides/](guides/) |

**Goal:** A camera vendor, insurer, or municipality can publish RSP events and address objects with RTN URIs using their own software.

---

## Proprietary (RedFace Platform)

RedFace commercial value accumulates here:

| Capability | Why proprietary |
|------------|-----------------|
| Operational Intelligence | Derived from aggregated verified mission data |
| Mission optimization & matching | Cross-organization coordination graph |
| Mission playback engine | Platform projection over event history |
| Analytics & benchmarking | Network-scale insights |
| Cross-organization coordination | Policy, stewardship, multi-tenant orchestration |
| Commercial dashboards | Enterprise control room product |
| Enterprise features | SLA, support, hosted kernel |

**Goal:** Organizations choose RedFace Platform for coordination, intelligence, and outcomes — not because the protocol is locked.

---

## Analogy

| Company | Open | Proprietary |
|---------|------|-------------|
| **Stripe** | API specifications, SDKs | Fraud models, Connect graph, dashboard |
| **Cloudflare** | HTTP standards participation | Global network, WAF intelligence |
| **Visa** | Network rules, message formats | Processing, risk, issuer services |
| **RedFace** | RSP, RTN URI, certification | Operational kernel, intelligence, coordination |

---

## For Integrators

Build adapters that **translate → RSP**. Do not reimplement mission orchestration, policy, or trust derivation unless you are building a competing platform.

RedFace Platform accepts your events. You keep your hardware. The network gets denser.
