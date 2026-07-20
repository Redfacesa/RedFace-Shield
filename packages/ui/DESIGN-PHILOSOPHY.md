# RedFace UI — Operational Design Philosophy

We design **human cognition under pressure**, not screens.

Every interface should answer: **What is the next best action?**

---

## Four principles

### 1. Scan, don't read

Understand the screen in **3 seconds**, not 30.

❌ `Mission Status: Vehicle Recovery · Priority Level: Critical`  
✅ `🔴 VEHICLE RECOVERY · CRITICAL · 08:42 · 64%`

Eyes win before the brain reads.

### 2. Motion communicates state

Animation answers **what changed?** — never decoration.

| Event | Motion |
|-------|--------|
| Mission accepted | Card slides into Active |
| Mission completed | Soft green expansion |
| Evidence uploaded | Counter pulse |
| Guard offline | Marker fades |

### 3. Color is language

Not branding — **operations**. This language never changes.

| Color | Meaning |
|-------|---------|
| Red | Immediate action required |
| Amber | Attention needed |
| Green | Healthy / complete |
| Blue | Information / dispatch |
| Grey | Offline / historical |

### 4. One-glance hierarchy

From 4 meters away, answer:

- How many critical missions?
- Which one needs me?
- Is everything okay?

---

## Operational primitives

Shared across Shield, Fleet, Rescue, Commerce, City:

- Mission Card · Alert Banner · Resource Badge · Mission Progress
- Evidence Counter · Dispatch Indicator · Trust Indicator · Response Timer
- Live Marker · Mission Ribbon · Replay Timeline · Status Ring · Scan Line

---

## Layered darkness

Control rooms are dark. Surfaces use **depth**, not flat black:

```
Background     → dark graphite
Cards          → slightly lighter
Mission focus  → elevated white/graphite
Critical       → red accent
Actions        → blue
```

---

## Audio language (optional, future)

| Event | Sound |
|-------|-------|
| New mission | Soft tone |
| Critical escalation | Urgent alert |
| Mission completed | Completion chime |
| Evidence uploaded | Short click |

---

## Deferred until operators ask

- **Mission Confidence** — operator-set readiness summary (not AI)
