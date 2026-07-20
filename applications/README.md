# Applications

Customer-facing experiences on the Operational Kernel. **Thin clients** — display state, submit intents, render timelines. No business logic in UI.

## Rule

> **No feature without an operator story.**

Every change should answer:
- Who is the user?
- What mission are they performing?
- What decision becomes easier?
- What measurable outcome improves?

## Sprint Goal

> A control-room supervisor can walk into the room, run a complete simulated vehicle recovery, monitor it on the Operations Wall, review it in Playback, and leave with a printable Mission Report — without needing the architecture explained.

## Three Operational Documents

| Phase | Document | Route |
|-------|----------|-------|
| Before | Mission Brief | `/brief?uri=...` |
| During | Operations Wall | `/wall` |
| After | Mission Report | `/report?uri=...` |

## Shield Control Room v0.1

| Screen | Route | Status |
|--------|-------|--------|
| Dashboard | `/` | ✅ v0.1 |
| Mission Queue | `/missions` | ✅ v0.1 |
| Mission Brief | `/brief?uri=...` | ✅ v0.1 |
| Mission Workspace | `/mission?uri=...` | ✅ v0.1 |
| Playback | `/playback?uri=...` | ✅ v0.1 |
| Live Map | `/map` | ✅ v0.1 |
| **Operations Wall** | `/wall` | ✅ v0.1 |
| **Mission Report** | `/report?uri=...` | ✅ v0.1 |
| Guard Mobile | — | Planned |
| Supervisor Portal | — | Planned |
| Customer Portal | — | Planned |

### Design System

Shared components: `@redface/ui`

### Run

```bash
# Terminal 1 — database
npm run db:local

# Terminal 2 — seed demo data (once)
npm run db:migrate && npm run mvp:hijacking

# Terminal 3 — kernel API
npm run kernel:dev

# Terminal 4 — control room UI
npm run shield:dev
```

Open http://localhost:5173

**Operations Wall (55-inch display):** http://localhost:5173/wall

**Acceptance test:** `npm run accept:recovery` (requires kernel API + seeded data)

### Architecture Rule

UI reads kernel via `/api` proxy → `kernel-api`. Never embeds mission logic.

Brief and report data are assembled by the API from kernel state — not computed in React.
