# Why Event-Driven Operations Improve Auditability

> **Classification: Vision** — why immutable event history matters. Not a deployment case study.

**Publishing wave:** 1 — safe to publish now  

---

## State vs History

Most operational systems answer: **"What is the status now?"**

Auditors ask: **"How did you get here?"**

Status fields are overwritten. History disappears.

Event-driven systems answer both — because **history is the primary record** and status is derived.

---

## The Audit Reconstruction Problem

After an incident, auditors request:

1. Timeline of decisions  
2. Evidence of who authorized each action  
3. Proof evidence was not altered  
4. Demonstration that policy was followed  

Reconstructing this from database UPDATE statements, log files, and email threads is expensive and disputable.

Reconstructing from an immutable event timeline is mechanical.

---

## Properties Auditors Care About

| Property | Event-driven approach |
|----------|----------------------|
| **Completeness** | Mission-scoped event set |
| **Integrity** | Hashes + signatures on evidence events |
| **Attribution** | Source identity on every event |
| **Ordering** | `occurredAt` timestamps |
| **Non-repudiation** | Signatures + stewardship |
| **Correction audit** | Supersession events with reason |

---

## Projections Are Not Sources of Truth

Reports, PDFs, and dashboards are **projections**.

If a report disagrees with the event timeline, the timeline wins.

This single rule eliminates an entire class of audit failure.

---

## Playback

Mission playback — scrubbing forward and backward through operational time — is a direct consequence of event-driven design.

Training, insurance review, and regulatory response use the same underlying timeline.

---

## Implementation Guidance

1. Publish events at decision points — not only at completion  
2. Attach events to missions  
3. Never UPDATE event records — supersede  
4. Build all reports from event queries  
5. Separate verification ("checked") from attestation ("vouch")  

See [Event Model](../models/EVENT-MODEL.md) and [RSP Specification](../rsp/RSP-SPECIFICATION.md).
