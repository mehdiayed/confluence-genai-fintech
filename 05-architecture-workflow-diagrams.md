# Architecture & Workflow Diagrams (Excalidraw Ready)

**Text-based node-link blueprints and editable Excalidraw sources for the fintech GenAI operating model**

| Field | Value |
|---|---|
| **Audience** | All engineering profiles, AI champions, architecture reviewers |
| **Owner** | Principal AI Enablement & DevOps Architect |
| **Classification** | Internal |
| **Version** | 1.0 |
| **Review** | Quarterly, or when the Kanban, incident, or Copilot operating model changes |
| **Labels** | `genai`, `github-copilot`, `excalidraw`, `architecture`, `kanban` |
| **Attachments** | `assets/ai-assisted-kanban-flow.excalidraw`, `assets/dev-qa-genai-touchpoints.excalidraw`, `assets/extensibility-architecture.excalidraw` |

**On this page**

1. How to use this page
2. Excalidraw style guide
3. Diagram 1 — AI-Assisted Kanban Flow: From Run Incident to Hotfix
4. Diagram 2 — Dev & QA GenAI Touchpoints in the Fintech Pipeline
5. Diagram 3 — Extensibility Architecture
6. Drawing and maintenance checklist

---

## 1. How to use this page

Each diagram is provided in three forms:

1. **A node-link blueprint** — IDs, labels, coordinates, and edges you can draw or edit.
2. **An ASCII layout** — a quick spatial reference for the overall composition.
3. **An editable `.excalidraw` file** — open it at [excalidraw.com](https://excalidraw.com) or import it into your Confluence Excalidraw macro.

> **Recommended workflow**
>
> Open the `.excalidraw` file first. If your Confluence instance cannot embed it, export a PNG/SVG, attach both the image and the `.excalidraw` source, and use the node-link table below as the accessible text alternative.

**Canvas conventions**

- Landscape, 16:9 or wider.
- Grid size 20, snap to grid.
- Minimum 12 px text; 16–20 px for primary labels.
- Maximum seven words per node.
- Bind arrows to shapes so the diagram survives editing.
- Keep node IDs stable across versions; change the label, not the ID, unless the concept changes.

---

## 2. Excalidraw style guide

### 2.1 Colour semantics

| Role | Stroke | Fill | Use |
|---|---|---|---|
| **Human role / decision** | `#1E3A8A` | `#DBEAFE` | Engineers, IC, QA, reviewers |
| **Copilot / GenAI** | `#0F766E` | `#CCFBF1` | AI-assisted steps, prompts, skills |
| **Decision / gate** | `#B45309` | `#FEF3C7` | Go/no-go, severity, sign-off |
| **Incident / risk** | `#B91C1C` | `#FEE2E2` | Incident lane, stop rules, rollback |
| **System / data** | `#374151` | `#F3F4F6` | Services, stores, registries |
| **Success / verified** | `#15803D` | `#DCFCE7` | Verified, reconciled, closed |
| **Neutral annotation** | `#6B7280` | `transparent` | Notes, legends, arrows |

### 2.2 Shape semantics

| Shape | Meaning |
|---|---|
| **Rounded rectangle** | Step, activity, or capability |
| **Diamond** | Decision or gate |
| **Cylinder** | Data store or registry |
| **Large dashed rectangle** | Lane, trust boundary, or scope |
| **Thick border** | Human accountability / non-negotiable gate |
| **Dashed arrow** | AI-assisted or optional path |
| **Solid arrow** | Primary flow |
| **Red arrow** | Escalation, rollback, or risk path |

### 2.3 Arrow labels

Use verbs, not nouns: `page`, `stabilise`, `diagnose`, `approve`, `rollback`, `reconcile`, `re-enter`. If an arrow has no label, the diagram should still be understandable from node text.

---

## 3. Diagram 1 — AI-Assisted Kanban Flow: From Run Incident to Hotfix

**Purpose:** Show how work moves between the planned bundle lane and the incident lane, where AI assists, where humans decide, and how the engineer re-enters planned work.

**Canvas:** 2200 × 1250.

### 3.1 ASCII layout

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ PLANNED BUNDLE LANE                                                                          │
│  [B1 Bundle]──▶[B2 Park context]                                     [B3 Resume]──▶[B4 Re-plan] │
│                       │                                                    ▲                 │
└───────────────────────┼────────────────────────────────────────────────────┼─────────────────┘
                        │ page incident                                      │ return
┌───────────────────────▼────────────────────────────────────────────────────┼─────────────────┐
│ RUN INCIDENT LANE                                                           │                 │
│ [I1 Detect]─▶[I2 Triage]─▶[I3 Stabilise]─▶[I4 Diagnose]─▶[I5 Scope]─▶[I6 Fix]─▶[I7 Release]─▶[I8 Verify]─▶[I9 Learn]
│                                   ▲              ▲                         │        │              │
│                                   │              │                         │        └──rollback───┘
│                              [A1 Brief]    [A2/A3/A4 AI]                 [A5 AI]  [A7 Comms]
└──────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ AI ASSIST (READ-ONLY EVIDENCE)                                                               │
│                [A1 Context brief] [A2 Logs] [A3 Txn] [A4 Hypothesis] [A5 Tests] [A7 Comms] [A6 Postmortem]
└──────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ HUMAN GATES                                                                                  │
│        [G1 Severity/impact] [G2 Root cause] [G3 Hotfix scope] [G4 QA/security] [G5 Integrity] [G6 Regulatory]
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Node-link table

| ID | Label | Type | Lane | x, y | w × h | Notes |
|---|---|---|---|---|---|---|
| **B1** | Bundle topic in progress | Step | Planned | 120, 190 | 180 × 70 | Current planned work |
| **B2** | Park context (10 min) | Step | Planned | 380, 190 | 180 × 70 | Bundle Context Pack |
| **B3** | Resume bundle (15 min re-entry) | Step | Planned | 1500, 190 | 200 × 70 | Re-entry ritual |
| **B4** | Re-plan if needed | Step | Planned | 1780, 190 | 180 × 70 | Update WIP/estimate |
| **I1** | Incident detected | Step | Incident | 80, 430 | 160 × 70 | Alert, customer, reconciliation |
| **I2** | Triage severity & impact | Step | Incident | 280, 430 | 170 × 70 | Amber; regulatory clock |
| **I3** | Stabilise first | Step | Incident | 490, 430 | 190 × 70 | Rollback, flag, pause, failover |
| **I4** | Diagnose / RCA | Step | Incident | 720, 430 | 180 × 70 | Timeline, transaction, hypotheses |
| **I5** | Scope minimal hotfix | Step | Incident | 940, 430 | 170 × 70 | Smallest safe change |
| **I6** | Implement + tests | Step | Incident | 1150, 430 | 160 × 70 | AI-assisted, human-reviewed |
| **I7** | Release gate / canary | Step | Incident | 1350, 430 | 160 × 70 | Change approval |
| **I8** | Verify & reconcile | Step | Incident | 1550, 430 | 170 × 70 | Ledger, customer, SLO |
| **I9** | Postmortem + actions | Step | Incident | 1760, 430 | 180 × 70 | Blameless, owned actions |
| **A1** | Context-switch brief | AI assist | AI | 400, 820 | 160 × 60 | Generated at switch |
| **A2** | Log / trace compression | AI assist | AI | 600, 820 | 150 × 60 | Cite evidence IDs |
| **A3** | Transaction reconstruction | AI assist | AI | 840, 820 | 150 × 60 | Ledger/state machine |
| **A4** | Hypothesis matrix | AI assist | AI | 1060, 820 | 150 × 60 | Falsifiable probes |
| **A5** | Test & fix assistant | AI assist | AI | 1240, 820 | 150 × 60 | Stubs, diff review |
| **A7** | Comms / status draft | AI assist | AI | 1480, 820 | 150 × 60 | Human-approved |
| **A6** | Postmortem draft | AI assist | AI | 1890, 820 | 150 × 60 | Evidence-linked |
| **G1** | Gate: severity, impact, regulatory | Gate | Gates | 280, 1040 | 190 × 60 | Human decision |
| **G2** | Gate: root cause validated | Gate | Gates | 720, 1040 | 190 × 60 | Evidence-backed |
| **G3** | Gate: hotfix scope & risk | Gate | Gates | 940, 1040 | 190 × 60 | IC + QA |
| **G4** | Gate: QA/security + change approval | Gate | Gates | 1350, 1040 | 200 × 60 | No auto-merge |
| **G5** | Gate: data integrity / reconciliation | Gate | Gates | 1550, 1040 | 210 × 60 | Money is correct |
| **G6** | Gate: regulatory & customer comms | Gate | Gates | 1760, 1040 | 200 × 60 | Compliance owns |

### 3.3 Edge list

| From | To | Style | Label | Meaning |
|---|---|---|---|---|
| B1 | B2 | Solid | park | Park planned work |
| B2 | A1 | Dashed, teal | brief | Generate context brief |
| B2 | I1 | Dashed, red | page incident | Enter incident lane |
| I1 | I2 | Solid | triage | Confirm impact |
| I2 | I3 | Solid | stabilise | Stop the bleeding |
| I3 | I4 | Solid | diagnose | Root cause analysis |
| I4 | I5 | Solid | scope | Minimal change |
| I5 | I6 | Solid | implement | Fix + tests |
| I6 | I7 | Solid | release | Canary/change gate |
| I7 | I8 | Solid | verify | SLO + reconciliation |
| I8 | I9 | Solid | learn | Postmortem |
| I7 | I3 | Dashed, red | rollback | Feedback on failed release |
| I9 | B3 | Solid | return | Re-enter bundle |
| B3 | B4 | Solid | re-plan | Update plan |
| A1 | I2 | Dashed, teal | brief | Triage support |
| A2 | I4 | Dashed, teal | evidence | Log/trace analysis |
| A3 | I4 | Dashed, teal | reconstruct | Transaction lifecycle |
| A4 | I4 | Dashed, teal | hypothesise | Differential diagnosis |
| A5 | I6 | Dashed, teal | assist | Tests and diff |
| A7 | I7 | Dashed, teal | draft | Comms support |
| A6 | I9 | Dashed, teal | draft | Postmortem |
| G1 | I2 | Dashed, amber | decide | Severity/impact |
| G2 | I4 | Dashed, amber | decide | Root cause |
| G3 | I5 | Dashed, amber | decide | Hotfix scope |
| G4 | I7 | Dashed, amber | approve | QA/security/change |
| G5 | I8 | Dashed, amber | verify | Data integrity |
| G6 | I9 | Dashed, amber | approve | Regulatory/comms |

### 3.4 Annotations

- **Top left:** "AI proposes; human gates decide."
- **Incident lane:** "Stabilise before root cause."
- **AI lane:** "Read-only evidence. No raw PAN/PII. Cite [E#]."
- **Gates lane:** "No gate, no production change."
- **Bottom right:** "Re-entry is part of the flow, not an afterthought."

### 3.5 Drawing instructions

1. Draw four horizontal lane rectangles (planned, incident, AI, gates) with light fills and dashed borders.
2. Add the lane labels in the top-left of each lane.
3. Place the nodes using the coordinates above. Use rounded rectangles; use amber fill for I2 and the gate nodes.
4. Draw the primary incident flow first (I1 → I9), then the bundle flow (B1 → B4), then the AI dashed links, then the gate links.
5. Route the rollback arrow below the incident row (I7 → I3) so it does not cross the intermediate nodes; bind both ends.
6. Bind each arrow to its source and target. Add the label on the arrow.
7. Group each lane, then group the whole diagram. Name the groups `lane-planned`, `lane-incident`, `lane-ai`, `lane-gates`.
8. Add the annotations and legend. Export PNG/SVG at 2× for Confluence.

---

## 4. Diagram 2 — Dev & QA GenAI Touchpoints in the Fintech Pipeline

**Purpose:** Show where Dev and QA use Copilot across the delivery pipeline, which capability supports each stage, and which gate keeps the change safe.

**Canvas:** 2200 × 1200.

### 4.1 ASCII layout

```text
        DISCOVER      DESIGN        BUILD         REVIEW        VERIFY        RELEASE       OPERATE       LEARN
DEV     [D1 AC]──────▶[D2 Threat]──▶[D3 Code]───▶[D4 PR]─────▶[D5 Contract]▶[D6 Release]─▶[D7 Observe]─▶[D8 Fix]
          ▲             ▲             ▲             ▲             ▲             ▲             ▲             ▲
AI        [A1 AC]      [A2 Threat]   [A3 Tests]    [A4 Review]   [A5 Contract] [A6 Risk]     [A7 RCA]      [A8 PM]
          ▼             ▼             ▼             ▼             ▼             ▼             ▼             ▼
QA        [Q1 Review]──▶[Q2 Plan]────▶[Q3 BVA]────▶[Q4 Oracle]──▶[Q5 Regress]─▶[Q6 Signoff]─▶[Q7 Verify]──▶[Q8 Escape]
GATES     [G1 Ready]   [G2 Design]   [G3 Static]   [G4 Peer]     [G5 QA/contract][G6 Change] [G7 SLO]      [G8 Actions]
```

### 4.2 Stage table

| Stage | Dev node | QA node | AI capability | Gate | Key artefact |
|---|---|---|---|---|---|
| **1. Discover** | D1 Clarify AC, risk, data class | Q1 Review AC for testability | A1 Acceptance-criteria prompt | G1 Definition of Ready | Clarified story + AC |
| **2. Design** | D2 Threat model, ADR, API shape | Q2 Risk-based test plan | A2 Threat-model prompt | G2 Design review | Threat model + test plan |
| **3. Build** | D3 Implement + unit tests | Q3 Boundary + property tests | A3 Test-stub generator | G3 Unit + static + secret scan | Code + tests |
| **4. Review** | D4 Self-review, small PR | Q4 Review test diff, oracle quality | A4 Code review agent | G4 Peer review + CODEOWNERS | Review evidence |
| **5. Verify** | D5 Contract + integration tests | Q5 Regression + exploratory | A5 Contract diff MCP + skill | G5 QA + contract gates | Test evidence |
| **6. Release** | D6 Release checklist, rollback | Q6 Sign-off, residual risk | A6 Release risk prompt | G6 Change advisory + canary | Go/no-go record |
| **7. Operate** | D7 Observe, runbook, flags | Q7 Production verification | A7 RCA / incident agent | G7 SLO + reconciliation | Monitoring + reconciliation |
| **8. Learn** | D8 Permanent fix, postmortem actions | Q8 Escape analysis, regression test | A8 Postmortem skill | G8 Actions closed | Postmortem + regression test |

### 4.3 Node-link table

Use this table if you want to draw the diagram from scratch. Coordinates are for a 2200 × 1200 canvas.

| ID | Label | Lane | x, y | w × h | Connects to |
|---|---|---|---|---|---|
| **D1** | Clarify AC, risk, data class | Dev | 150, 210 | 180 × 70 | D2, Q1, A1, G1 |
| **D2** | Threat model, ADR, API shape | Dev | 400, 210 | 180 × 70 | D3, Q2, A2, G2 |
| **D3** | Implement + unit tests | Dev | 650, 210 | 180 × 70 | D4, Q3, A3, G3 |
| **D4** | Self-review, small PR | Dev | 900, 210 | 180 × 70 | D5, Q4, A4, G4 |
| **D5** | Contract + integration tests | Dev | 1150, 210 | 180 × 70 | D6, Q5, A5, G5 |
| **D6** | Release checklist, rollback | Dev | 1400, 210 | 180 × 70 | D7, Q6, A6, G6 |
| **D7** | Observe, runbook, flags | Dev | 1650, 210 | 180 × 70 | D8, Q7, A7, G7 |
| **D8** | Permanent fix, postmortem actions | Dev | 1900, 210 | 180 × 70 | Q8, A8, G8 |
| **Q1** | Review AC for testability | QA | 150, 570 | 180 × 70 | Q2, A1 |
| **Q2** | Risk-based test plan | QA | 400, 570 | 180 × 70 | Q3, A2 |
| **Q3** | Boundary + property tests | QA | 650, 570 | 180 × 70 | Q4, A3 |
| **Q4** | Review test diff, oracle quality | QA | 900, 570 | 180 × 70 | Q5, A4 |
| **Q5** | Regression + exploratory | QA | 1150, 570 | 180 × 70 | Q6, A5 |
| **Q6** | Sign-off, residual risk | QA | 1400, 570 | 180 × 70 | Q7, A6 |
| **Q7** | Production verification | QA | 1650, 570 | 180 × 70 | Q8, A7 |
| **Q8** | Escape analysis, regression test | QA | 1900, 570 | 180 × 70 | A8 |
| **A1** | Acceptance-criteria prompt | AI | 150, 390 | 180 × 70 | D1, Q1 |
| **A2** | Threat-model prompt | AI | 400, 390 | 180 × 70 | D2, Q2 |
| **A3** | Test-stub generator | AI | 650, 390 | 180 × 70 | D3, Q3 |
| **A4** | Code review agent | AI | 900, 390 | 180 × 70 | D4, Q4 |
| **A5** | Contract diff MCP + skill | AI | 1150, 390 | 180 × 70 | D5, Q5 |
| **A6** | Release risk prompt | AI | 1400, 390 | 180 × 70 | D6, Q6 |
| **A7** | RCA / incident agent | AI | 1650, 390 | 180 × 70 | D7, Q7 |
| **A8** | Postmortem skill | AI | 1900, 390 | 180 × 70 | D8, Q8 |
| **G1** | Definition of Ready | Gate | 150, 750 | 180 × 60 | Q1 (aligned with D1) |
| **G2** | Design review | Gate | 400, 750 | 180 × 60 | Q2 (aligned with D2) |
| **G3** | Unit + static + secret scan | Gate | 650, 750 | 180 × 60 | Q3 (aligned with D3) |
| **G4** | Peer review + CODEOWNERS | Gate | 900, 750 | 180 × 60 | Q4 (aligned with D4) |
| **G5** | QA + contract gates | Gate | 1150, 750 | 180 × 60 | Q5 (aligned with D5) |
| **G6** | Change advisory + canary | Gate | 1400, 750 | 180 × 60 | Q6 (aligned with D6) |
| **G7** | SLO + reconciliation | Gate | 1650, 750 | 180 × 60 | Q7 (aligned with D7) |
| **G8** | Actions closed | Gate | 1900, 750 | 180 × 60 | Q8 (aligned with D8) |

### 4.4 Edge list

**Primary flow**

- D1 → D2 → D3 → D4 → D5 → D6 → D7 → D8
- Q1 → Q2 → Q3 → Q4 → Q5 → Q6 → Q7 → Q8

**AI touchpoints**

- A1 → D1 and A1 → Q1
- A2 → D2 and A2 → Q2
- A3 → D3 and A3 → Q3
- A4 → D4 and A4 → Q4
- A5 → D5 and A5 → Q5
- A6 → D6 and A6 → Q6
- A7 → D7 and A7 → Q7
- A8 → D8 and A8 → Q8

**Gate flow**

- G1 → Q1; G2 → Q2; G3 → Q3; G4 → Q4; G5 → Q5; G6 → Q6; G7 → Q7; G8 → Q8.
- Each gate is vertically aligned with its Dev and QA nodes; the gate applies to both roles, and the QA link makes that explicit.

### 4.5 Annotations

- **Top:** "One pipeline, two accountable roles, one evidence chain."
- **AI lane:** "Assist, don't approve."
- **Gate lane:** "Gates apply to both Dev and QA."
- **Bottom:** "QA owns the oracle; Dev owns the code; the gate owns the evidence."

### 4.6 Drawing instructions

1. Draw eight vertical stage separators and eight stage headers.
2. Draw four horizontal lanes in this order: Dev, AI, QA, Gates. Leave a label column on the left.
3. Place the Dev and QA nodes in stage order. Use solid arrows for the primary flow.
4. Place the AI nodes between the Dev and QA lanes. Use dashed teal arrows to both Dev and QA nodes.
5. Place the gate nodes below the QA lane. Use thick amber borders. Draw a short dashed line from the gate to the QA node; alignment carries the gate to the Dev node.
6. Add a cross-cutting bar at the bottom for identity, data classification, audit, evaluation, and human accountability.
7. Export PNG/SVG at 2×; keep the `.excalidraw` source.

---

## 5. Diagram 3 — Extensibility Architecture

**Purpose:** Show how Copilot surfaces, customisations, the MCP gateway, and internal systems fit together, with identity, policy, and audit as cross-cutting controls.

**Canvas:** 2200 × 1300.

### 5.1 ASCII layout

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ SURFACES                                                                                     │
│ [IDE]                    [Copilot CLI]          [GitHub.com / Cloud Agent]   [Code Review]    │
└───────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                            │ loads
┌───────────────────────────────────────────▼──────────────────────────────────────────────────┐
│ CUSTOMISATION                                                                                │
│ [Instructions] [Prompt files] [Skills] [Custom agents] [Hooks] [Plugins]                     │
└───────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                            │ tool calls
┌───────────────────────────────────────────▼──────────────────────────────────────────────────┐
│ MCP GATEWAY / CONNECTORS                                                                     │
│ [AuthN/Z] [Policy] [DLP/Redaction] [Rate limits] [Audit]                                     │
└───────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                            │ read-only / approved
┌───────────────────────────────────────────▼──────────────────────────────────────────────────┐
│ INTERNAL SYSTEMS                                                                             │
│ [Git/API registry] [Policy engine] [Observability] [CI/CD] [Ticketing/Docs] [Secrets/KMS]    │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ CROSS-CUTTING: Identity & access | Audit/SIEM | Evaluation | Cost & capacity | Human approval│
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Node-link table

| Layer | ID | Label | x, y | w × h | Connects to |
|---|---|---|---|---|---|
| **Surfaces** | S1 | IDE (VS Code / JetBrains / Visual Studio) | 100, 140 | 400 × 90 | C1–C6 |
| **Surfaces** | S2 | Copilot CLI | 600, 140 | 400 × 90 | C1–C6 |
| **Surfaces** | S3 | GitHub.com / Cloud Agent | 1100, 140 | 400 × 90 | C1–C6 |
| **Surfaces** | S4 | Copilot Code Review | 1600, 140 | 400 × 90 | C1–C6 |
| **Customisation** | C1 | Instructions | 100, 380 | 300 × 90 | S1–S4, G |
| **Customisation** | C2 | Prompt files | 440, 380 | 300 × 90 | S1–S4, G |
| **Customisation** | C3 | Skills | 780, 380 | 300 × 90 | S1–S4, G |
| **Customisation** | C4 | Custom agents | 1120, 380 | 300 × 90 | S1–S4, G |
| **Customisation** | C5 | Hooks | 1460, 380 | 300 × 90 | S1–S4, G |
| **Customisation** | C6 | Plugins | 1800, 380 | 300 × 90 | S1–S4, G |
| **Gateway** | G | MCP gateway / Copilot connectors | 100, 620 | 2000 × 160 | C1–C6, T1–T6 |
| **Systems** | T1 | Git & API registry | 100, 900 | 300 × 90 | G |
| **Systems** | T2 | Policy engine | 440, 900 | 300 × 90 | G |
| **Systems** | T3 | Observability (read-only) | 780, 900 | 300 × 90 | G |
| **Systems** | T4 | CI/CD | 1120, 900 | 300 × 90 | G |
| **Systems** | T5 | Ticketing & docs | 1460, 900 | 300 × 90 | G |
| **Systems** | T6 | Secrets / KMS | 1800, 900 | 300 × 90 | G |

The gateway contains five control chips: **AuthN/AuthZ**, **Policy**, **DLP / redaction**, **Rate limits**, and **Audit**. The load and return paths in the drawing are representative; the gateway applies to every customisation and every system.

### 5.3 Edge list

| From | To | Style | Label | Meaning |
|---|---|---|---|---|
| S1–S4 | C1–C6 | Dashed, teal | loads | Representative load paths; any surface can load any customisation |
| C1–C6 | G | Solid | tool calls | Customisations request tools/data |
| G | T1–T6 | Solid | scoped | Scoped access to internal systems |
| T1, T3, T4 | G | Dashed, gray | data / result | Representative redacted results returning to the gateway |
| G | C1–C6 | Conceptual | redacted result | Model sees only approved data; enforced by DLP on every response |
| G | Cross-cutting | Dotted | audit / policy | Every call is logged and constrained |

### 5.4 Cross-cutting bar

```text
Identity & access  |  Audit / SIEM  |  Evaluation  |  Cost & capacity  |  Human approval
```

Place this as a full-width bar at the bottom of the diagram. It applies to every layer, not just the gateway.

### 5.5 Annotations

- **Left:** "Least privilege by default."
- **Right:** "Read-only unless explicitly approved."
- **Gateway:** "Trust boundary: authenticate, authorise, redact, rate-limit, audit."
- **Bottom:** "If it cannot be audited, it cannot scale."

### 5.6 Drawing instructions

1. Draw four main horizontal layer bands with light fills, plus a cross-cutting bar at the bottom.
2. Place the surface boxes across the top.
3. Place the six customisation boxes in a row.
4. Draw the gateway as a wide box with five small control chips inside: AuthN/AuthZ, Policy, DLP/redaction, Rate limits, Audit.
5. Place the six internal-system boxes in a row.
6. Draw the primary downward arrows (surfaces → customisation → gateway → systems) and the dashed return arrows.
7. Add a dashed trust-boundary rectangle around the gateway and systems.
8. Add the cross-cutting bar and the annotations.
9. Group by layer; name groups `layer-surfaces`, `layer-customisation`, `layer-gateway`, `layer-systems`, `layer-controls`.

---

## 6. Drawing and maintenance checklist

### 6.1 Before publishing a diagram

☐ The node-link table and the `.excalidraw` file use the same IDs and labels.

☐ Every arrow is bound to a source and target.

☐ Every decision has a yes/no or approve/block path.

☐ AI-assisted steps are visually distinct from human decisions.

☐ Human gates are thick-bordered and labelled.

☐ The diagram is readable at 100% zoom in Confluence.

☐ Colour is not the only signal; labels and shapes also differ.

☐ A text alternative (the node-link table) is on the page.

☐ The diagram has a title, owner, version, and last-reviewed date.

☐ Sensitive examples, customer data, and real internal hostnames are removed.

### 6.2 Maintenance triggers

- Kanban policy changes (WIP, classes of service, incident lane).
- Incident process changes (severity, roles, regulatory clock).
- Copilot surface or customisation changes (new agent/skill/MCP capability).
- Security or compliance control changes.
- Post-incident lessons that alter the flow.

### 6.3 Change procedure

1. Update the node-link table first; it is the source of truth.
2. Edit the `.excalidraw` file; keep IDs stable.
3. Export a new PNG/SVG for Confluence.
4. Update the version and change log.
5. Ask a Dev and a QA representative to review readability.
6. Replace the attachment; do not leave multiple "final" versions.

---

## 7. Related pages

- **GenAI Strategy for Fintech Kanban & Run Incidents** — the operating model behind Diagram 1.
- **Developer Playbook – From Code to Infrastructure** — the Dev touchpoints in Diagram 2.
- **QA Playbook – Accelerated Testing & Edge-Case Coverage** — the QA touchpoints in Diagram 2.
- **Advanced Extensibility & Tooling (Skills, Agents & Plugins)** — the architecture behind Diagram 3.

---

**Change log**

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-11-08 | AI Enablement | Initial production-ready release; three Excalidraw sources |
