# Applications

Customer-facing experiences on the Operational Kernel. **Thin clients** — display state, submit intents, render timelines. No business logic in UI.

## Shield Control Room v0.1

Operational console for 55-inch control room displays.

| Screen | Route | Status |
|--------|-------|--------|
| Dashboard | `/` | ✅ v0.1 |
| Mission Queue | `/missions` | ✅ v0.1 |
| Mission Workspace | `/mission?uri=...` | ✅ v0.1 |
| Playback | `/playback?uri=...` | ✅ v0.1 |
| Live Map | `/map` | ✅ v0.1 |
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

For 55-inch displays, use `?tv=1` once (e.g. http://localhost:5173/?tv=1) to enable large-type mode.

### Architecture Rule

UI reads kernel via `/api` proxy → `kernel-api`. Never embeds mission logic.
