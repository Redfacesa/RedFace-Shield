# RedFace

> **RedFace makes operations verifiable.**

RedFace is an **Operational Infrastructure Platform**. Trust is not assumed — it is earned through verifiable operations.

**Shield** is the first reference implementation. **Commerce** is the second. The **Operational Kernel** is the company.

---

## Architecture Status: Implementation Phase 1

Doctrine ratified for implementation. **Code begins with the Operational Kernel**, not Shield UI.

| Phase | Status |
|-------|--------|
| Doctrine (Volumes −1 → 0.75) | Complete — frozen |
| **Kernel (Phase 1)** | **In progress** |
| Shield applications | Blocked until MVP loop passes |
| Camera adapters | Phase 2 |

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for build order and success metric.

```bash
npm install
npm run db:up
npm run db:migrate
npm run mvp:hijacking    # validates Operational Loop end-to-end
npm run kernel:dev       # read API :3000/missions/:id
```

---

## Doctrine Stack

```
Volume −1     Philosophy         Why
Volume 0.5    Theory             Loop · Missions · Kernel · Principles
Volume 0      Constitution       Law
Volume 0.75   Ratification       Proof
─────────────────────────────────────────
Code          Kernel Phase 1     See IMPLEMENTATION.md
Volume 1–9    Derived docs       Must pass Doctrine Test
```

---

## Volume 0.75 — Proof

| Document | Purpose |
|----------|---------|
| [Axioms](docs/volume-0.75-ratification/AXIOMS.md) | 15 invariants — must always be true |
| [Canonical Language](docs/volume-0.75-ratification/CANONICAL-LANGUAGE.md) | One word, one meaning |
| [Conceptual Models](docs/volume-0.75-ratification/CONCEPTUAL-MODELS.md) | Mission, trust, capability equations |
| [Non-Goals](docs/volume-0.75-ratification/NON-GOALS.md) | What RedFace will never do |
| [Doctrine Test](docs/volume-0.75-ratification/DOCTRINE-TEST.md) | Gate for every feature |

---

## Fifteen Axioms (Summary)

1. Everything has identity  
2. Identity precedes permission  
3. Permission precedes execution  
4. Intent precedes mission  
5. Execution creates events  
6. Events are immutable — only superseded  
7. History is derived — never rewritten  
8. Intelligence never invents facts  
9. Trust is earned from verifiable history  
10. Capabilities over organizations  
11. Missions own execution  
12. Every decision is auditable  
13. Every mission teaches  
14. Verifiability precedes trust  
15. Primitives are frozen  

Full definitions: [AXIOMS.md](docs/volume-0.75-ratification/AXIOMS.md)

---

## The Operational Loop

```
Intent → Mission → Events → History → Intelligence → Better Intent
```

---

## The Operational Kernel

Identity · Trust · Intent · Mission · Resource · Policy · Event · History · Intelligence · Economy

Details: [Operational Kernel](docs/architecture/OPERATIONAL-KERNEL.md)

---

## Reading Order (Ratification)

1. [Philosophy](docs/volume-minus-1-philosophy/PHILOSOPHY.md)
2. [Principles](docs/volume-0.5-principles/PRINCIPLES.md) · [Loop](docs/volume-0.5-principles/OPERATIONAL-LOOP.md) · [Missions](docs/volume-0.5-principles/THEORY-OF-MISSIONS.md)
3. [Constitution](docs/volume-00-constitution/TRUST-CONSTITUTION.md)
4. **[Axioms](docs/volume-0.75-ratification/AXIOMS.md)** ← prove consistency here
5. [Language](docs/volume-0.75-ratification/CANONICAL-LANGUAGE.md) · [Models](docs/volume-0.75-ratification/CONCEPTUAL-MODELS.md) · [Non-Goals](docs/volume-0.75-ratification/NON-GOALS.md)
6. [Doctrine Test](docs/volume-0.75-ratification/DOCTRINE-TEST.md)
7. [Ratification Checklist](docs/volume-0.75-ratification/README.md)

Then — and only then — derived volumes and code.

---

## License

Doctrine documents are proprietary to RedFace. Distribution requires authorization.
