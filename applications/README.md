# Applications

Customer-facing experiences on the Operational Kernel. **Thin clients** — display state, submit intents, render timelines. No business logic in UI.

## Rule

> **No feature without an operator story.**

Every change should answer:
- Who is the user?
- What mission are they performing?
- What decision becomes easier?
- What measurable outcome improves?

---

## Operational Demonstration Ready (ODR-1)

Internal milestone — not a version number, a **demonstration state**.

| Criterion | Status |
|-----------|--------|
| Mission Brief | ✅ |
| Operations Wall | ✅ |
| Live Mission | ✅ |
| Operation Replay | ✅ |
| Mission Report | ✅ |
| Acceptance Test | ✅ |
| Stable Kernel | ✅ |
| Live WebSockets | ⏳ |
| Reference Deployment | ⏳ |

### Operational narrative

```text
Mission Begins → Mission Brief → Operations Wall → Operation Replay → Mission Report
```

| Stakeholder | Uses |
|-------------|------|
| Supervisor | Mission Brief |
| Control Room | Operations Wall |
| Field Teams | Live Mission |
| Management | Operation Replay |
| Insurer / Client | Mission Report |
| Auditor | Replay + Report |

### Five-minute demo script

1. **Minute 1** — Mission Brief. *"This vehicle has been reported stolen."*
2. **Minute 2** — Start simulator (`npm run sim:recovery` or seeded MVP).
3. **Minute 3** — Operations Wall (`/wall`). Mission appears. Resources dispatch.
4. **Minute 4** — Operation Replay. Show animated timeline.
5. **Minute 5** — Generate Report. Print. Done.

No PowerPoint. The product tells the story.

---

## Three Operational Documents

| Phase | Document | Route |
|-------|----------|-------|
| Before | Mission Brief | `/brief?uri=...` |
| During | Operations Wall | `/wall` |
| After | Mission Report | `/report?uri=...` |

## Shield Control Room

| Screen | Route |
|--------|-------|
| Dashboard | `/` |
| Mission Queue | `/missions` |
| Mission Brief | `/brief?uri=...` |
| Mission Workspace | `/mission?uri=...` |
| Operation Replay | `/playback?uri=...` |
| Live Map | `/map` |
| **Operations Wall** | `/wall` |
| **Mission Report** | `/report?uri=...` |

### Run

```bash
npm run db:local
npm run db:migrate && npm run mvp:hijacking   # once
npm run kernel:dev
npm run shield:dev
npm run accept:recovery                       # regression gate
```

- Control Room: http://localhost:5173
- **Operations Wall:** http://localhost:5173/wall

### KPIs (operator-facing)

- **MCI** — Mission Coordination Index (% successful completions)
- **Decision Latency** — seconds from intent to first operational decision (dispatch/allocation)

Both computed by the API from kernel events — not in the UI.

### Architecture Rule

UI reads kernel via `/api` proxy. Brief, report, and metrics are assembled server-side.
