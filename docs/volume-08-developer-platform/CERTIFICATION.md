# RedFace Certification Program

**Status:** Defined — not yet operational  
**Authority:** Architecture v1.0  

---

## Purpose

Certifications are **governance mechanisms** for a healthy ecosystem — not marketing badges.

They tell operators and insurers which partners meet RedFace operational standards.

---

## Certifications

### RSP Compatible

**Means:** The integration publishes compliant, versioned RSP events through the official SDK.

**Requirements:**
- Uses `@redface/rsp` SDK (or certified equivalent in another language)
- Event types include version suffix (`.v1`, `.v2`)
- No incompatible changes to released event types
- Events include valid source identity and signature (when Credential Engine available)

**Verified by:** Event conformance test suite against kernel Event Engine

---

### RTN Verified Organization

**Means:** Organization identity and governance verified on the Trust Network.

**Requirements:**
- Registered Organization with verified documents
- Ownership and stewardship relationships declared
- Trust derivations auditable
- Policy decisions logged

**Verified by:** Trust Engine audit + manual governance review

---

### Mission Ready

**Means:** The system supports full mission lifecycle integration.

**Requirements:**
- Can receive or create missions via kernel API
- Publishes mission-scoped RSP events
- Supports mission playback timeline
- Does not bypass Policy Engine for operational actions

**Verified by:** Mission Simulator scenario pass

---

### Evidence Chain Certified

**Means:** Maintains verifiable chain of custody for evidence objects.

**Requirements:**
- Evidence registered as identity
- Steward assigned (`evidence_custodian`)
- Attestation recorded at custody transfer points
- Events immutable; corrections via supersession only

**Verified by:** Demonstration A chain-of-custody checklist

---

## Process (Future)

1. Partner submits integration for review
2. Automated conformance tests run against kernel
3. Operational demonstration witnessed or recorded
4. Certification issued with expiry and version scope
5. Revocation if incompatible events published or custody broken

---

## Non-Goals

- Certifications do not guarantee operational outcome
- Certifications do not replace insurance or legal liability
- Certifications are not purchasable without technical conformance
