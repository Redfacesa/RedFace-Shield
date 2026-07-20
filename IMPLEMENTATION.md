# Platform v1.0 — Operational Proof

**Architecture v1.0 is ratified.** Progress is measured by operational demonstrations — not engines completed.

See [Publishing Waves](standards/PUBLISHING-WAVES.md) · [Reference Deployment Playbook](docs/deployments/REFERENCE-DEPLOYMENT-PLAYBOOK.md) · [Evidence Repository](docs/evidence/README.md)

**Publish Wave 1 only.** Standards (Wave 3) wait for evidence.

---

## What To Build Next (In Order)

| Priority | Deliverable | Command |
|----------|-------------|---------|
| 1 | Demonstration A — Vehicle Recovery | `npm run mvp:hijacking` |
| 2 | RSP SDK | `@redface/rsp` — `RspPublisher.publish()` |
| 3 | Mission Playback | `npm run playback:demo` |
| 4 | Mission Simulator | `npm run sim:recovery` |
| 5 | Demonstration B — Estate Alarm | Scenario defined in simulator |
| 6 | Credential Engine | When real users need login |
| 7 | First adapter via SDK | Not before SDK |
| 8 | Thin Control Room UI | Display + intents only |

**Do not build Hikvision adapter before RSP SDK.**

---

## Engine Versions

All core engines at **1.0.0**. See [ENGINE-VERSIONS.md](docs/volume-0.75-ratification/ENGINE-VERSIONS.md).

Kernel API `/health` returns architecture and engine versions.

---

## Quarterly Objectives (Q1)

1. One complete vehicle recovery mission end-to-end  
2. One third-party device via RSP SDK (simulator acceptable first)  
3. Two mission types on same kernel without kernel changes  
4. One verifiable chain of custody from event to mission closure  

---

## Run

```bash
npm install
npm run db:up
npm run db:migrate
npm run mvp:hijacking      # Demonstration A
npm run playback:demo      # Mission playback timeline
npm run sim:recovery       # Simulator via RSP SDK
npm run kernel:dev         # API :3000 — POST /rsp/events, GET /missions?playback=true
```

---

## RSP Compatibility

Event types are immutable once released. Add `.v2` — never break `.v1`.

See [RSP SDK](docs/volume-08-developer-platform/RSP-SDK.md).

---

## Certification (Future)

RSP Compatible · RTN Verified Organization · Mission Ready · Evidence Chain Certified

See [Certification Program](docs/volume-08-developer-platform/CERTIFICATION.md).
