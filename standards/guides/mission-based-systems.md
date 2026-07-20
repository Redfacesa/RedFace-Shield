# Designing Mission-Based Operational Systems

> **Classification: Vision** — architectural guidance. Not measured outcomes from a specific customer.

**Publishing wave:** 1 — safe to publish now  

---

## Start with the Objective

Before screens, databases, or integrations — define:

> **What outcome must this operation achieve?**

That is the mission objective. Everything else serves it.

---

## Intent Before Mission

Users express **intent** ("recover this vehicle safely"). The system creates a **mission** to orchestrate execution.

Skipping intent produces tickets without stated outcomes — and audits without measurable success criteria.

---

## Adaptive, Not Prescriptive

Do not encode:

```text
Step 1 → Step 2 → Step 3 → Done
```

Encode:

```text
Objective + Policies + Resources + Events → Outcome
```

When a camera fires, GPS updates, or a responder goes offline — the mission adapts. The workflow does not break.

---

## Capabilities as First-Class Objects

Register what organizations and resources **can do** — not just who they are.

```text
rtn://capability/vehicle-recovery
rtn://capability/armed-response
```

Match missions to capabilities. Allocate resources that provide them.

---

## Policy Decides, Identity Proves

Authentication proves **who**. Policy decides **what they may do** — evaluated against operational context (current mission, area, steward role).

Never embed authorization in UI buttons alone.

---

## Events at Every Boundary

Publish an event when:

- Intent declared or accepted  
- Mission created or state changed  
- Resource allocated or released  
- Dispatch acknowledged  
- Evidence captured  
- Outcome recorded  

If it mattered operationally, it should be an event.

---

## Three Mission Outputs

Design for:

1. **Operational result** — metrics for this mission  
2. **Institutional learning** — feedback for the organization  
3. **Network learning** — anonymized patterns (optional, policy-governed)  

Systems that only store "closed" miss compounding value.

---

## Anti-Patterns

| Anti-pattern | Why it fails |
|--------------|--------------|
| Incident = mission | Incidents trigger; missions orchestrate |
| Editable audit log | Disputes become unsolvable |
| Company-name dispatch | Doesn't scale or adapt |
| Adapter with business logic | Fragile, unmaintainable integrations |
| Trust score in database | Trust must derive from history |

---

## Reference Models

- [Mission Model](../models/MISSION-MODEL.md)  
- [Event Model](../models/EVENT-MODEL.md)  
- [RSP Specification](../rsp/RSP-SPECIFICATION.md)  

Adapters translate. Kernels decide.
