# How to Design an Immutable Evidence Chain

> **Classification: Vision** — design guidance and principles. Not evidence from a named deployment.

**Publishing wave:** 1 — safe to publish now  

---

## The Problem

Evidence disputes destroy trust:

- Was the photo taken at the scene?  
- Was the file altered after capture?  
- Who had custody between capture and court?  

Screenshots and messaging apps cannot answer these questions defensibly.

---

## Principles

### 1. Evidence is an object, not a file path

Register evidence with a permanent identifier ([RTN URI](../rtn/RTN-URI-SPECIFICATION.md)):

```text
rtn://document/evidence-photo-001
```

The identifier survives storage moves, format conversions, and system migrations.

### 2. Capture is an event

Publishing `rsp.evidence.uploaded.v1` (or `rsp.evidence.created.v1`) records:

- When capture occurred (`occurredAt`)  
- Who captured it (`source`)  
- Cryptographic hash (`payload.hash`)  
- Mission context (`missionUri`)  

The event is immutable. The file is verified against the hash.

### 3. Custody is stewardship

Assign an `evidence_custodian` steward at each custody transfer. Stewardship is a declared relationship — not a folder permission.

### 4. Standing is attestation

Verification checks the hash. **Attestation** is a separate record: "I stand behind the integrity of this evidence."

Do not conflate "I checked" with "I vouch."

### 5. Corrections supersede

Wrong evidence is not deleted. Publish `rsp.event.superseded.v1` referencing the original with reason. History remains intact.

---

## Minimum Chain

```text
Capture event (hash + source + mission)
        ↓
Steward assigned
        ↓
Transfer events (each with new steward)
        ↓
Attestation at handoff points
        ↓
Mission outcome references evidence URIs
```

---

## Audit Questions

A defensible chain answers:

| Question | Source |
|----------|--------|
| When was it captured? | Event `occurredAt` |
| Who captured it? | Event `source` |
| Has it changed? | Hash verification |
| Who was responsible? | Stewardship records |
| Who vouched for it? | Attestation records |
| Was anything corrected? | Supersession events |

---

## Certification

Implementations may pursue **Evidence Chain Certified** status.

See [Certification Program](../certification/CERTIFICATION-PROGRAM.md).
