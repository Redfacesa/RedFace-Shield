# Certification Program

> **DRAFT — Wave 3.** Publish with RSP specification after demonstrated integration need.

**Publishing wave:** 3 — internal draft only  

**Version:** 1.0  
**Status:** Draft  

---

## Purpose

Certifications are **governance mechanisms** that help operators identify interoperable participants — not marketing badges.

---

## Certifications

### RSP Compatible

**Means:** Publishes conformant, versioned RSP events.

**Requirements:**
- Valid envelope on all published events  
- RTN URIs for all identity references  
- Versioned event types (`.v1` or higher)  
- No in-place event mutation  
- Passes automated conformance test suite  

**Who:** Hardware vendors, integrators, adapter authors  

---

### RTN Verified Organization

**Means:** Organization identity and governance documents verified.

**Requirements:**
- Registered organization with RTN URI  
- Verified trust documents (license, registration, insurance as applicable)  
- Ownership and stewardship relationships declared  
- Policy decisions auditable  

**Who:** Security companies, control rooms, insurers joining the network  

---

### Mission Ready

**Means:** Supports full mission lifecycle integration.

**Requirements:**
- Creates or consumes mission-scoped RSP events  
- Records mission state transitions  
- Produces outcomes with metrics  
- Supports timeline export or playback consumption  

**Who:** Control room platforms, dispatch systems  

---

### Evidence Chain Certified

**Means:** Maintains verifiable chain of custody.

**Requirements:**
- Evidence registered with RTN URI  
- Steward assigned at custody points  
- Hash on all evidence events  
- Attestation at transfer points (where applicable)  
- Supersession-only corrections  

**Who:** Bodycam vendors, field apps, evidence management systems  

---

## Process

1. Submit integration for review  
2. Run automated conformance tests (published with specification version)  
3. Operational review (Mission Ready, Evidence Chain)  
4. Certification issued with scope and expiry  
5. Revocation if incompatible events published or custody rules violated  

---

## Non-Goals

- Certification does not guarantee mission outcome  
- Certification does not replace legal liability or insurance  
- Certification is not for sale without technical conformance  

---

## Relationship to RedFace Platform

Certification validates **standards conformance**.

RedFace Platform provides hosted coordination, intelligence, and enterprise features — separate commercial agreement.

See [Open Boundary](../OPEN-BOUNDARY.md).
