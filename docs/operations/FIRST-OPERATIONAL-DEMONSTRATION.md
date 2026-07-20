# The First Operational Demonstration

**Status:** Active — Primary execution focus  
**Authority:** Subordinate to [Architecture v1.0](../volume-0.75-ratification/ARCHITECTURE-v1.0-RATIFIED.md)  
**Scope:** Prove the operating model — not just the software  

---

## Purpose

An **MVP proves software**.

An **Operational Demonstration proves the operating model**.

The demonstration succeeds when observers can answer:

> **Did the platform coordinate an operation better than today's tools?**

That is what operators, insurers, municipalities, and investors care about — not screenshots.

---

## Before RedFace vs With RedFace

### Before RedFace

| Step | Reality |
|------|---------|
| 1 | Recovery company receives a phone call |
| 2 | Control room phones another company |
| 3 | Photos sent over WhatsApp |
| 4 | Evidence scattered across devices |
| 5 | No audit trail |
| 6 | No mission review |
| 7 | No reusable knowledge |

### With RedFace

| Step | Platform behavior |
|------|-------------------|
| 1 | **Intent declared** — verified identity, stated outcome |
| 2 | **Mission created** — adaptive orchestration, not a ticket |
| 3 | **Resources matched** — by capability, not company name |
| 4 | **Events recorded** — immutable timeline |
| 5 | **Evidence verified** — Trust Engine |
| 6 | **Chain of custody maintained** — Ownership, Stewardship, Attestation |
| 7 | **Mission reviewed** — outcome with metrics |
| 8 | **Knowledge captured** — lessons feed the next intent |

This comparison is the pitch. Build toward it.

---

## Three Demonstrations

Prove three scenarios on the **same kernel** — no architectural changes between them.

### Demonstration A — Vehicle Recovery

**Proves:** Intent · Mission · Resource allocation · Evidence · History · Trust

| Criterion | Observable outcome |
|-----------|-------------------|
| Intent → Mission | Intent declared by insurer; mission created by control room |
| Capability matching | Recovery provider matched by capability, not manual phone tree |
| Timeline | Full event sequence from dispatch to recovery |
| Evidence | Photograph with hash, steward, attestation |
| Audit | Mission playback reproducible months later |
| Trust | Derived trust reflects verification + mission outcome |

**Script:** `npm run mvp:hijacking`  
**Simulator:** `npm run sim:recovery`

---

### Demonstration B — Estate Alarm Response

**Proves:** Camera event · Dispatch · Multiple responders · Property · Stewardship · Timeline

| Criterion | Observable outcome |
|-----------|-------------------|
| Camera detection | RSP event from adapter/simulator triggers mission |
| Property ownership | Camera owned by estate; operated by security company |
| Multi-responder | Armed response + control room + estate manager as stewards |
| Dispatch | Resources allocated; acknowledgements on timeline |
| Timeline | Alarm → verify → dispatch → arrive → clear |

**Status:** Scenario defined — simulator stub in `@redface/mission-simulator`  
**Blocker:** None architectural — execution only

---

### Demonstration C — Cash-in-Transit Escort

**Proves:** Planned mission · Dynamic routing · Multiple organizations · Operational context · Mission completion

| Criterion | Observable outcome |
|-----------|-------------------|
| Planned mission | Mission created before movement begins |
| Dynamic routing | GPS events update operational context |
| Multi-org | CIT company, insurer, police liaison as participants |
| Context-aware policy | Actions evaluated against current route and mission state |
| Completion | Outcome with metrics; lessons captured |

**Status:** Scenario defined — simulator stub in `@redface/mission-simulator`  
**Blocker:** Credential + Session engines for full operational context (specified, not yet implemented)

---

## Success Metrics

Demonstration succeeds when an independent observer can verify:

- [ ] Intent and mission lifecycle completed without manual workaround
- [ ] Resources matched by capability
- [ ] Every significant action has an event on the timeline
- [ ] Evidence has verifiable chain of custody
- [ ] Mission is replayable end-to-end
- [ ] Outcome includes measurable metrics
- [ ] Operation was coordinated better than the "Before RedFace" baseline

---

## Mission Playback

Every mission must be **replayable** — scrub forwards and backwards through operational time.

Example playback:

```text
08:31:02  Intent declared
08:31:10  Mission created
08:31:22  Resources matched
08:32:11  Vehicle dispatched
08:36:41  Camera detection
08:37:10  Officer arrived
08:39:50  Evidence uploaded
08:48:11  Vehicle recovered
09:03:00  Mission closed
09:05:00  Lessons recorded
```

**Value:** Training · Audits · Insurance · Incident review · Customer reporting

**Implementation:** `kernel.history.buildPlayback(missionUri)` · API `GET /missions?uri=...&playback=true`

**CLI:** `npm run playback:demo`

Because the architecture is event-driven, playback is a projection — not a new subsystem.

---

## Mission Simulator

Before integrating real hardware, exercise the platform with an internal simulator.

The simulator generates:

- Camera detections
- GPS updates
- Guard check-ins
- Panic alarms
- Evidence uploads
- Dispatch acknowledgements

All events publish through the **RSP SDK** — same path as real adapters.

**Package:** `@redface/mission-simulator`  
**Rule:** Simulators use RSP SDK. Adapters use RSP SDK. No invented translation logic.

---

## Build Order (CTO Roadmap)

Architecture is ratified. Scope is the risk. **Do not prove everything at once.**

| Priority | Deliverable | Why |
|----------|-------------|-----|
| 1 | Demonstration A end-to-end | First operational proof |
| 2 | **RSP SDK** | All integrations share one path |
| 3 | Mission Playback | Demonstrates audit value immediately |
| 4 | Mission Simulator | Repeatable exercises without hardware |
| 5 | Demonstration B | Proves camera + stewardship path |
| 6 | Credential Engine | When real users need login |
| 7 | First real adapter (via SDK) | One device, not five vendors |
| 8 | Demonstration C | Proves multi-org + planned missions |
| 9 | Thin Control Room UI | Display + intent submission only |

**Do not build Hikvision adapter before RSP SDK.**

---

## Quarterly Objectives

Stop measuring progress in engines completed, tables created, or APIs implemented.

### Q1 — Operational Proof

**Objective 1:** Demonstrate one complete vehicle recovery mission end-to-end.

**Objective 2:** Integrate one third-party device using only the RSP SDK (simulator acceptable for first pass).

**Objective 3:** Show two completely different mission types on the same kernel without kernel modifications.

**Objective 4:** Complete one independently verifiable chain of custody from event creation to mission closure.

If all four are met, the architecture is proven under real operational scenarios — not on paper.

---

## Certification (Future Ecosystem)

Partners may earn certifications — governance mechanisms, not marketing badges:

| Certification | Meaning |
|---------------|---------|
| **RSP Compatible** | Publishes compliant, versioned RSP events |
| **RTN Verified Organization** | Identity and governance verified on RTN |
| **Mission Ready** | Supports full mission lifecycle integration |
| **Evidence Chain Certified** | Maintains verifiable chain of custody |

See [Certification Program](../volume-08-developer-platform/CERTIFICATION.md).

---

## Doctrine Test

| Question | Answer |
|----------|--------|
| New architecture? | No — v1.0 ratified; demonstrations derive |
| New primitives? | No |
| Scope control? | Yes — three demonstrations sequenced, not parallel |
| UI-first? | No — operational proof first |
