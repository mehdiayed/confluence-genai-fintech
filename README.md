# GenAI Enablement for Fintech Engineering

**GitHub Copilot adoption guide for Dev, QA, and DevOps in a Kanban + run-incident operating model**

| Field | Value |
|---|---|
| **Space** | Engineering Enablement → GenAI Enablement |
| **Audience** | Software Developers (Backend / Frontend / DevOps), QA Engineers, Engineering Managers, Incident Commanders |
| **Owner** | Principal AI Enablement & DevOps Architect |
| **Co-owners** | Head of Engineering Operations, QA Lead, Platform Engineering Lead |
| **Approvers** | Engineering Leadership, Information Security, Compliance, Data Protection Officer |
| **Classification** | Internal |
| **Version** | 1.0 |
| **Review cadence** | Quarterly, and after any P1 incident or material Copilot feature change |
| **Status** | Approved for pilot and team rollout |

---

## 1. What this space is

This is the operating guide for using GitHub Copilot and approved Generative AI tooling inside a regulated fintech engineering organisation. It is written for practitioners who move continuously between two kinds of work:

- **Bundle topics** — planned feature streams that need deep context, design quality, and predictable lead time.
- **Run incidents** — production events that need rapid triage, evidence discipline, and safe mitigation.

The guide does **not** contain generic coding labs. It contains the workflows, decision rules, prompt patterns, repository configuration, and architecture blueprints that make AI useful on a normal Tuesday and safe during a payments incident.

> **Core thesis**
>
> GenAI creates the most value in fintech when it compresses context, improves the quality of evidence, and removes repetitive toil — not when it writes the most code. The engineer remains accountable. The system, not the model, enforces the non-negotiable controls.

---

## 2. Page tree

This README is the space home and publishing guide, not a sixth content page. Create the five pages below in this order. The links are file names in this package; in Confluence, use page links with the same titles.

| # | Confluence page title | File | Primary audience | Outcome |
|---|---|---|---|---|
| 01 | **GenAI Strategy for Fintech Kanban & Run Incidents** | `01-genai-strategy-fintech-kanban-run-incidents.md` | All profiles, managers, incident commanders | A shared operating model for switching between bundle work and production incidents, plus repeatable RCA prompts |
| 02 | **Developer Playbook – From Code to Infrastructure** | `02-developer-playbook.md` | Developers, DevOps, platform engineers | Secure coding, test generation, Kubernetes/Helm, deployment scripts, and repository-level Copilot customisation |
| 03 | **QA Playbook – Accelerated Testing & Edge-Case Coverage** | `03-qa-playbook.md` | QA, SDET, developers | Acceptance criteria, financial boundary-value testing, automated test stubs, and hotfix regression risk analysis |
| 04 | **Advanced Extensibility & Tooling (Skills, Agents & Plugins)** | `04-advanced-extensibility.md` | Platform engineers, AI champions, tech leads | Architecture blueprints for skills, custom agents, hooks, MCP servers, plugins, and internal workflows such as contract verification and compliance checks |
| 05 | **Architecture & Workflow Diagrams (Excalidraw Ready)** | `05-architecture-workflow-diagrams.md` | All profiles | Text node-link blueprints plus editable `.excalidraw` files for three key diagrams |

### Confluence labels

Apply these labels to the relevant pages:

`genai` · `github-copilot` · `fintech` · `kanban` · `run-incident` · `dev-playbook` · `qa-playbook` · `extensibility` · `mcp` · `excalidraw` · `engineering-enablement`

---

## 3. Non-negotiable guardrails

These are adapted from the source training blueprint's banking guardrails (R1–R6) and extended for day-to-day engineering use. They apply to every profile, every surface, and every prompt.

| ID | Guardrail | What it means in practice | Primary enforcement |
|---|---|---|---|
| **G1** | **Classify before you prompt** | No restricted data in a prompt, file, log, ticket, or tool response unless the tool and use case are explicitly approved. Redact PAN, CVV, account identifiers, personal data, secrets, and tokens. | Data classification, DLP, content exclusions, approved-tool policy |
| **G2** | **Human accountability** | AI proposes; the engineer decides and verifies. No destructive, irreversible, or customer-impacting action without explicit human approval. | Approval steps, four-eyes review, incident command |
| **G3** | **No autonomous production change** | Copilot and agents do not deploy to production, rotate production secrets, change limits, or alter customer records without a human-approved change process. | Protected environments, rulesets, change management |
| **G4** | **Deterministic gates remain deterministic** | Security, schema, infrastructure, money, and compliance controls are enforced by code, policy, and CI — not by asking the model nicely. | Hooks, CI checks, policy-as-code, branch protection |
| **G5** | **Evidence over eloquence** | Every material AI-assisted decision must be traceable to a source, an owner, and an artefact. Model output alone is not evidence. | Incident record, PR notes, audit log, evidence links |
| **G6** | **Least privilege for tools** | MCP servers, hooks, plugins, and agents get read-only access by default, scoped credentials, allowlisted tools, and explicit egress rules. | Token scopes, MCP gateway, tool allowlists |
| **G7** | **Version and evaluate everything** | Instructions, prompts, skills, agents, and plugins are versioned, reviewed, tested against real tasks, and deprecated deliberately. | Toolkit repository, eval harness, change log |

> **Rule of thumb**
>
> If a control must hold every time, implement it as a hook, CI check, policy, or permission — not as an instruction. Instructions shape judgement; they do not guarantee behaviour.

---

## 4. How to publish this guide in Confluence

### 4.1 Create the space and page tree

1. Create a space named **GenAI Enablement** (or add these pages under your existing Engineering Enablement space).
2. Create the five pages using the exact titles in the page tree above.
3. Paste the Markdown body of each file into the Confluence editor. Confluence Cloud converts headings, tables, lists, code blocks, and links on paste; review the result before publishing.
4. Add the page tree macro to the space home so the five pages appear as a navigable hierarchy.

### 4.2 Apply Confluence macros

| Markdown element | Recommended Confluence treatment |
|---|---|
| Metadata table at the top of each page | Keep as a table, or convert to a **Page Properties** macro |
| `> **Why it matters**` blockquotes | Convert to **Info**, **Note**, or **Warning** panels, depending on severity |
| `**On this page**` list | Add a **Table of Contents** macro at the top |
| Long prompt/config templates | Wrap in an **Expand** macro to keep pages scannable |
| Checklists (`☐`) | Convert to Confluence **Task lists** where your team tracks completion |
| `Status` values | Use the **Status** macro if your space uses status lozenges |
| Tables with owners/dates | Consider **Page Properties Report** for a portfolio view |

### 4.3 Attach the Excalidraw files

1. Open **Page 05 – Architecture & Workflow Diagrams**.
2. Attach the three files in `assets/`:
   - `ai-assisted-kanban-flow.excalidraw`
   - `dev-qa-genai-touchpoints.excalidraw`
   - `extensibility-architecture.excalidraw`
3. If your Confluence instance has an Excalidraw macro, embed each file. Otherwise, open the file at [excalidraw.com](https://excalidraw.com), export a PNG/SVG, attach the image, and keep the `.excalidraw` file as the editable source.
4. Name future versions with the pattern `YYYY-MM-DD-diagram-name.excalidraw` and record the change in the page's change log.

**Regenerating the sources**

The three `.excalidraw` files are generated deterministically from the blueprints in Page 05:

```bash
cd confluence-genai-fintech
python tools/generate_excalidraw.py
```

The script uses only the Python standard library, keeps stable element IDs, binds every arrow to its source and target, and writes the files to `assets/`. Edit the page 05 node-link tables and the generator together so the text alternative and the drawing stay aligned.

### 4.4 Set access and ownership

- Page restrictions: editable by the AI Enablement group and page owners; viewable by all engineering.
- Add a page owner and a review date to every page.
- Link the space from onboarding, the engineering handbook, and the incident response runbook.
- Do not duplicate this content into personal spaces. Link to the canonical pages.

---

## 5. Operating model

### 5.1 Roles

| Role | Accountability |
|---|---|
| **AI Enablement Lead** | Strategy, guardrails, toolkit roadmap, measurement, vendor relationship |
| **Platform Engineering** | MCP gateway, hooks, CI integration, secrets, observability, internal toolkit distribution |
| **Dev / QA Champions** | Team-level adoption, prompt and skill contributions, feedback, peer coaching |
| **Engineering Managers** | WIP policy, capacity for incidents, adoption support, removal of blockers |
| **Security / Compliance / DPO** | Data classification, approved use cases, control validation, audit evidence |
| **Incident Commander** | Final decisions during incidents; ensures AI outputs are reviewed and evidence is retained |
| **Every Engineer** | Classifies data, verifies output, discloses material AI assistance, follows the guardrails |

### 5.2 Rollout in 90 days

| Phase | Days | Focus | Exit criteria |
|---|---|---|---|
| **Baseline** | 1–15 | Inventory repositories, data classifications, existing Copilot settings; agree guardrails; select two pilot teams (one Dev, one QA); baseline flow and quality metrics | Pilot scope, owners, and success measures agreed |
| **Pilot** | 16–45 | Deploy repository instructions, 3–5 prompt files, one skill, one read-only MCP integration; run weekly office hours; capture friction | Pilot teams report measurable time savings or quality improvement; no guardrail violations |
| **Scale** | 46–90 | Publish the playbooks, expand to all teams, add compliance and contract-verification blueprints, establish the AI guild | At least 70% of licensed engineers active; documented use cases; quarterly review scheduled |

### 5.3 Cadence

- **Weekly:** team flow review — WIP, blocked work, incident lane, prompt/skill friction.
- **Biweekly:** AI guild — demo a workflow, review a failed prompt, update the toolkit.
- **Monthly:** metrics review — adoption, flow, quality, guardrail exceptions.
- **Quarterly:** governance review — data classification, vendor changes, model changes, audit findings, roadmap.

---

## 6. Measurement framework

Measure flow and risk, not AI activity for its own sake.

| Dimension | Metrics | Why it matters |
|---|---|---|
| **Flow** | Lead time, cycle time, WIP, blocked time, context-switch recovery time, PR size, review cycle time | AI should reduce waiting and rework, not just increase output |
| **Incident response** | MTTA, MTTR, customer-impact minutes, change failure rate, rollback rate, reconciliation breaks | The fintech cost of failure is asymmetric |
| **Quality** | Escaped defect rate, defect leakage by stage, test coverage of risk, flaky test rate, contract-break escapes | Better tests and earlier risk detection |
| **AI adoption** | Active users, depth of use (chat / agent / review), accepted suggestions, prompt/skill reuse, time saved (sampled) | Directional signals; avoid lines-of-code as a productivity metric |
| **Guardrails** | Sensitive-data incidents, over-permissioned tools, blocked dangerous actions, audit gaps, policy exceptions | Trust is the precondition for scale |

> **Anti-vanity metrics:** lines of code generated, number of prompts sent, number of skills installed. These do not demonstrate value and can incentivise the wrong behaviour.

---

## 7. Adapting the source blueprint

This guide adapts the concepts from the Claude Code Dev/DevOps training blueprint ([mehdiayed/dev-devops-claude-code_Training](https://github.com/mehdiayed/dev-devops-claude-code_Training)) to GitHub Copilot and a multi-surface GenAI setup. The underlying progression is the same: start with context, codify repeatable work, enforce guardrails, then connect tools.

| Source blueprint concept | GitHub Copilot equivalent | Practical note |
|---|---|---|
| Project memory (`CLAUDE.md`) | `.github/copilot-instructions.md`, `AGENTS.md`, path-specific `.github/instructions/*.instructions.md` | Keep always-on instructions short; move detailed procedures to skills |
| Custom slash commands | `.github/prompts/*.prompt.md`; skills for cross-surface use | Prompt files are primarily IDE-scoped; skills travel further across Copilot surfaces |
| Deterministic hooks | `.github/hooks/*.json`, GitHub Actions, rulesets, policy-as-code | Hooks can approve/deny tool calls; CI remains the final gate |
| Skills | `.github/skills/<skill-name>/SKILL.md` with optional scripts/resources | Best for multi-step procedures with bundled assets |
| Sub-agents | Custom agents (`.github/agents/*.agent.md`) and runtime subagents | Restrict tools; read-only reviewers are a strong default |
| Plugins / marketplace | Agent plugins, internal marketplace, MCP connectors | Package only when distribution and lifecycle justify it |
| MCP | MCP servers at repository, IDE, or agent level; Copilot connectors | Read-only, scoped, audited; cloud agent supports tools, not MCP resources/prompts |
| Headless CI | Copilot CLI, cloud agent, GitHub Actions | Keep humans in the approval path for production changes |

---

## 8. How to contribute

1. Propose the change in the AI Enablement backlog: use case, audience, data classification, risk tier, expected value, owner.
2. Prototype in a branch or a sandbox repository. Do not test with production data.
3. Add an evaluation: a small set of real tasks with expected outcomes, edge cases, and failure modes.
4. Review with Security/Compliance if the capability touches code, customer data, money movement, or production systems.
5. Publish with a version, owner, changelog, and rollback plan.
6. Measure adoption and outcomes for 30 days; keep, iterate, or retire.

---

## 9. Disclaimer

This guide is an engineering operating model, not legal, regulatory, or compliance advice. Regulatory obligations — including DORA, GDPR, PCI DSS, PSD2/SCA, SOC 2, and applicable AI/model-risk rules — must be validated with your Compliance, Legal, Data Protection, and Model Risk functions. Product-specific retention, residency, and subprocessors must be confirmed with GitHub and Procurement before enterprise rollout.

---

**Change log**

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-11-08 | AI Enablement | Initial production-ready release |
