# Applications (Phase 2)

Shield UIs consume the Operational Kernel via `@redface/kernel-api` and RSP. They do **not** define their own mission model.

Planned:

- `shield-control-room/` — create and monitor missions
- `shield-field/` — assignments, status, evidence capture
- `shield-dispatch/` — recovery operations map
- `shield-admin/` — resources and capabilities
- `shield-timeline/` — immutable history viewer

Build after MVP loop validates: `npm run mvp:hijacking`
