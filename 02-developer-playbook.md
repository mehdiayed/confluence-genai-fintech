# Developer Playbook – From Code to Infrastructure

**Secure delivery, test generation, Kubernetes/Helm, and repository-level Copilot configuration for fintech engineers**

| Field | Value |
|---|---|
| **Audience** | Backend, Frontend, DevOps, Platform Engineers, Tech Leads |
| **Owner** | Principal AI Enablement & DevOps Architect |
| **Co-owner** | Platform Engineering Lead |
| **Classification** | Internal |
| **Version** | 1.0 |
| **Review** | Quarterly, and after any material architecture or Copilot feature change |
| **Labels** | `genai`, `github-copilot`, `dev-playbook`, `fintech`, `kubernetes` |

**On this page**

1. Purpose and outcomes
2. The developer AI operating loop
3. Secure and compliant code
4. Test generation that improves quality
5. Kubernetes, Helm, and deployment workflows
6. Project-level instructions, workspace rules, and prompt templates
7. Copy-paste configuration templates
8. PR and review workflow
9. Definition of Done
10. Metrics
11. Anti-patterns

---

## 1. Purpose and outcomes

This page turns GitHub Copilot from an autocomplete tool into a governed engineering capability. It is written for developers who own code, tests, deployment configuration, and the operational consequences of both.

**Outcomes**

- A shared, repeatable loop for using Copilot on fintech changes.
- Secure coding and money-handling rules that the model cannot talk its way around.
- A practical test-generation workflow with a clear oracle and human review.
- Safer Kubernetes/Helm and deployment-script changes.
- Repository-level instructions, path-specific rules, prompt files, skills, agents, and hooks that encode your architecture — not a 40-page prompt nobody reads.

> **Non-goal**
>
> This is not a prompt catalogue for writing more code faster. It is a system for producing **smaller, safer, better-evidenced changes** with less review churn.

---

## 2. The developer AI operating loop

### 2.1 Six steps

| Step | Activity | Copilot surface | Artefact | Gate |
|---|---|---|---|---|
| **1. Frame** | Clarify the ticket, acceptance criteria, risk tier, and data classification | Chat / issue context | Change brief | Definition of Ready |
| **2. Context** | Load the relevant instructions, ADRs, API spec, and files | Repository instructions, `#file`, MCP read-only tools | Context pack | Correct repo and branch |
| **3. Plan** | Ask for a read-only plan, risks, and test strategy | Plan mode / chat | Plan + risk list | Human approves plan for high-risk changes |
| **4. Generate** | Make small diffs and tests | Agent mode / inline chat | Code + tests | Small batch; no unrelated refactor |
| **5. Verify** | Run tests, static analysis, contract checks, policy checks | Terminal, CI, code review | Evidence | All required gates pass |
| **6. Record** | Capture risk, rollback, verification, AI assistance | PR description | Merge-ready PR | Peer review + CODEOWNERS |

### 2.2 Surface selection

| Surface | Best for | Avoid | Guardrail |
|---|---|---|---|
| **Inline completion** | Local, low-risk code, boilerplate, test scaffolding | Complex multi-file changes; security-critical logic without review | Review every accepted line |
| **Chat / ask** | Explanation, design options, debugging, review | Pasting secrets or production data | Redact; cite sources |
| **Agent mode** | Multi-file implementation with a plan and tools | Unbounded refactors; production commands | Small scope; read-only tools by default |
| **Copilot CLI** | Terminal workflows, repository-wide tasks, scripted analysis | Destructive commands; production credentials | Sandbox; explicit approvals |
| **Copilot code review** | First-pass review, consistency checks, missing tests | Replacing human/CODEOWNERS review | Treat as an additional reviewer |
| **Cloud agent** | Delegated, well-scoped tasks with a PR | High-risk, ambiguous, or production changes | Branch protections; human merge |

### 2.3 Operating rules

- **No plan, no production code** for high-risk changes: money movement, auth, ledger, settlement, data migrations, infrastructure, and customer-facing APIs.
- **Small batches:** one behaviour change per PR; do not mix refactoring, dependency upgrades, and feature work.
- **The model is not the source of truth:** for money, policy, and architecture, the source is the spec, ADR, ledger rule, or contract.
- **Every accepted suggestion is your code:** you own the tests, the review, and the production outcome.
- **Escalate ambiguity:** if the requirement is unclear, ask. Do not let the model invent a business rule.

---

## 3. Secure and compliant code

### 3.1 Fintech secure coding baseline

| Control | Requirement | How Copilot helps | Deterministic check |
|---|---|---|---|
| **Authentication** | Every non-public endpoint authenticated; no custom crypto | Generate auth middleware tests, review token handling | Framework config, integration tests |
| **Authorization** | Object-level authorization; deny by default; no IDOR | Generate authz matrix and negative tests | Policy tests, SAST, peer review |
| **Input validation** | Allowlist schemas; reject unknown fields; bound sizes | Generate schema and abuse cases | OpenAPI validation, fuzzing |
| **Output encoding** | Context-aware encoding; no raw HTML | Review templates and error responses | SAST, CSP, security tests |
| **Injection** | Parameterised queries; no string-built SQL/commands | Review query construction; generate tests | SAST, dependency scan |
| **Secrets** | Approved secret store; never in code, logs, tests, or prompts | Detect suspicious patterns; draft secret-store wiring | Secret scanning, hooks, CI |
| **Cryptography** | Approved libraries and key management; no homegrown crypto | Explain usage; generate test vectors | Crypto policy, review |
| **Money** | Minor units or `BigDecimal`; explicit currency and rounding | Generate boundary tests; review arithmetic | Property-based tests, ledger checks |
| **Idempotency** | State-changing payment endpoints replay-safe | Generate replay/duplicate tests | Contract tests, integration tests |
| **Concurrency** | Optimistic locking/versioning; no lost updates | Review transaction boundaries; generate race tests | Concurrency tests, DB constraints |
| **Audit logging** | Who/what/when/why; no sensitive payloads | Generate audit events and tests | Log schema, policy check |
| **PII/PCI** | Minimise; mask; never log PAN/CVV/full account data | Review data flow; generate masked fixtures | DLP, log scanning, review |
| **Errors** | Shared taxonomy; no internal detail leakage | Review error mapping | Contract tests, SAST |
| **Rate limiting** | Per-client and per-operation limits | Generate limit tests | Gateway config, load tests |
| **Dependencies** | Pinned, scanned, provenance-checked | Explain upgrade impact; generate migration tests | SCA, SBOM, signed artefacts |
| **API contracts** | Versioned, backward-compatible, consumer-tested | Diff specs; generate contract tests | Contract CI, schema validation |

### 3.2 Money and ledger non-negotiables

These rules should be in repository instructions **and** enforced by tests and architecture checks. A prompt is not a control.

- **No floating point for money.** Use integer minor units or `BigDecimal` with explicit scale. Floating point is acceptable only for non-monetary analytics, and must be labelled.
- **Currency is explicit.** Every amount carries a currency; reject mismatches; know the minor unit (JPY 0, EUR/USD 2, KWD/BHD 3).
- **Rounding is a product decision.** Specify the mode (`HALF_UP`, `HALF_EVEN`, etc.) and where it happens — per line, per fee, per tax, or at the total. Do not let the model choose.
- **Fees, tax, and FX have an order.** Document whether fees are calculated before or after tax, and whether FX conversion happens before or after fees. Test the order.
- **Double-entry ledger.** Every posting balances. Posted entries are immutable; corrections are reversals, not edits.
- **Idempotency.** Every state-changing payment operation has an idempotency key and a replay-safe handler. A retry must not create a second debit.
- **Optimistic concurrency.** Use version columns or compare-and-set; do not rely on "last write wins".
- **UTC everywhere.** Store UTC; render in the customer/product time zone; handle DST and cut-off times explicitly.
- **Settlement is not capture.** Model authorization, capture, settlement, refund, reversal, chargeback, and reconciliation as distinct states.
- **Reconciliation is a feature.** Expose the identifiers needed to reconcile: transaction ID, journal ID, external reference, scheme reference, idempotency key.
- **Audit trail.** Record the actor, action, before/after state, reason, and correlation ID — without sensitive payloads.

### 3.3 Threat-model workflow

Use Copilot to widen the risk lens before coding, then have a security champion review it.

```text
You are a security architect for a regulated payments platform.

Feature: {{feature_summary}}
Data flow: {{actors, systems, data stores, trust boundaries}}
Data classification: {{...}}
Regulatory context: {{PCI/GDPR/PSD2/DORA if relevant}}

Produce a threat model:
1. Assets and actors.
2. Trust boundaries and data flows.
3. STRIDE threats, each with: scenario, impact, likelihood, existing control, proposed control, test case.
4. Fintech-specific abuse cases: replay, duplicate debit, race condition, tampering, limit bypass, SCA bypass, data exfiltration via logs, prompt injection.
5. Residual risks and open questions.

Rules:
- Do not assume a control exists; cite the design or code.
- Separate MUST-FIX from defence-in-depth.
- Keep it under two pages.
```

### 3.4 Secure code review prompt

Use this before requesting human review. It is not a substitute for SAST or a security review.

```text
Review the following change as a senior fintech security engineer.

Change: {{diff_or_pr}}
Context: {{service, transaction types, data classification}}
Relevant standards: {{OWASP ASVS, PCI DSS, internal secure coding standard}}

Check:
- authentication and object-level authorization
- input validation, output encoding, injection, SSRF, deserialization
- money representation, rounding, currency, fees, FX, ledger integrity
- idempotency, retries, concurrency, duplicate posting
- PII/PCI handling, logging, secrets, audit trail
- error handling and information disclosure
- dependency and supply-chain risk

Rules:
- Cite file and line.
- Do not claim a control exists unless the code demonstrates it.
- Separate MUST-FIX from DEFENCE-IN-DEPTH.
- For each finding: severity, exploit scenario, fix, and test.
- If evidence is missing, say what you need.

Output: findings table sorted by severity, then a merge recommendation with residual risk.
```

### 3.5 Data-migration review checklist

☐ Is the migration backward-compatible during rollout (expand/contract)?

☐ Does it lock large tables or rewrite them online?

☐ Is there a backfill plan with throttling and resumability?

☐ Is there a rollback plan that does not lose data?

☐ Are old and new code compatible during the transition?

☐ Are indexes created concurrently where required?

☐ Is PII/PCI data minimised, encrypted, and retained correctly?

☐ Are ledger invariants preserved during backfill?

☐ Is the migration tested against production-like volume?

☐ Is there an observability signal for progress, errors, and reconciliation?

---

## 4. Test generation that improves quality

### 4.1 Test pyramid for fintech

| Layer | What it proves | AI role | Human role |
|---|---|---|---|
| **Unit** | Money rules, rounding, validation, state transitions | Generate cases and stubs; explain failures | Define the oracle; review assertions |
| **Integration** | DB, outbox, idempotency, migrations, external adapters | Generate harness and fixtures | Verify isolation, data, and determinism |
| **Contract** | API/event compatibility with consumers | Diff specs; generate provider/consumer tests | Approve breaking changes and versioning |
| **End-to-end** | Critical customer journeys | Generate scenarios and page objects | Keep the suite small; own the risk |
| **Non-functional** | Performance, resilience, security | Generate load profiles and abuse cases | Define thresholds and acceptance |

### 4.2 Test-generation workflow

1. **Approve the test matrix before code generation.** This prevents the model from writing tests that merely mirror the implementation.
2. **State the oracle.** The expected value must come from the spec, a ledger rule, an approved fixture, or a worked example — not from the model's opinion.
3. **Constrain the environment.** Synthetic data, fixed clock, fixed FX rates, seeded randomness, no live network.
4. **Generate stubs, not final truth.** Review assertions, naming, isolation, and failure messages.
5. **Run the tests and inspect failures.** A test that passes immediately may be testing nothing.
6. **Mutate critical money logic** where the tooling supports it; ensure tests catch the mutation.

### 4.3 Test quality rules

- One behaviour per test; arrange-act-assert; no conditionals or loops in test logic.
- Test names describe behaviour and expected outcome, not the method name.
- No `sleep`; use deterministic waits or fake clocks.
- No shared mutable state; each test creates its own data.
- No live external calls in unit tests; use contract stubs or Testcontainers.
- Assert both the business outcome and the side effect (ledger entry, audit event, outbox message).
- Avoid snapshot tests for money unless the snapshot is reviewed and versioned.
- Mark slow/integration tests with tags and run them in the right pipeline stage.
- A flaky test is a defect; quarantine with an owner and a fix date.

### 4.4 Property-based invariants for money

These are high-value tests that AI can help generate, but the invariants must be owned by the domain.

- Sum of debits equals sum of credits for every journal.
- A refund never exceeds the captured amount.
- Replaying the same idempotency key returns the same result and does not create a second posting.
- Currency is preserved across the transaction; no implicit conversion.
- Applying a fee never changes the original amount's currency or scale incorrectly.
- Balance never goes negative unless the product explicitly allows overdraft.
- Reversing a transaction restores the prior balance exactly.
- Rounding is applied once at the documented boundary; no double rounding.
- An out-of-order event does not move the state machine backwards.
- A duplicate scheme response does not create a duplicate settlement.

### 4.5 Coverage-gap prompt

```text
You are a senior test architect.

Inputs:
- Diff / changed files: {{...}}
- Existing tests: {{...}}
- Acceptance criteria: {{...}}
- Risk tier: {{...}}

Task: Identify coverage gaps that matter for risk, not line coverage.

Output:
1. Changed behaviour and the tests that cover it.
2. Untested branches, boundaries, error paths, and side effects.
3. Missing integration/contract tests.
4. Missing negative/abuse/concurrency tests.
5. Top five gaps by risk, with a proposed test and oracle.
6. Tests that look like they assert implementation details rather than behaviour.

Rules:
- Do not propose tests that require production data.
- Do not count a test as coverage if its assertion is weak or absent.
- Mark assumptions.
```

---

## 5. Kubernetes, Helm, and deployment workflows

### 5.1 Kubernetes/Helm security baseline

| Area | Requirement | AI assist | Deterministic check |
|---|---|---|---|
| **Workload identity** | Non-root, no privileged, drop all capabilities, read-only root FS, seccomp `RuntimeDefault` | Review security context; generate values | PodSecurity admission, policy-as-code |
| **Images** | Pinned by digest; no `latest`; minimal base; scanned | Explain diff; generate digest pin | Image policy, SCA |
| **Resources** | Requests and limits set; right-sized | Suggest based on metrics | Policy check, load test |
| **Health** | Liveness, readiness, startup probes | Generate probe config | `helm template`, schema |
| **Availability** | PDB, topology spread, anti-affinity, HPA where appropriate | Review HA design | Policy check, chaos test |
| **Network** | Default-deny network policy; explicit egress | Generate policy | CNI policy test |
| **Secrets** | External Secrets/CSI; no secrets in values or Git | Review references; detect leaks | Secret scanning, policy |
| **RBAC** | Least-privilege service account; no cluster-admin | Review roles | RBAC policy check |
| **Rollout** | Canary/blue-green; rollback plan; migration jobs | Draft runbook | Deployment verification |
| **Observability** | Metrics, logs, traces, dashboards, alerts | Draft signals and alerts | SLO review |

### 5.2 Helm review workflow

1. **Render** the chart for the target environment with the exact values.
2. **Diff** the rendered output against the deployed state (read-only).
3. **Lint and validate** (`helm lint`, schema validation, `kubeconform`).
4. **Policy check** (OPA/Kyverno or internal policy).
5. **Review** the diff with Copilot for security, reliability, and drift.
6. **Approve** through the normal change process.
7. **Deploy** canary; verify SLOs and reconciliation; roll back on trigger.

**Never** let an agent run `helm upgrade`, `kubectl apply`, or a production script without explicit human approval and the approved change process.

### 5.3 Helm review prompt

```text
Review the following Helm chart / rendered manifest as a platform engineer.

Input: {{chart_path_or_rendered_diff}}
Environment: {{dev/staging/prod}}
Known constraints: {{...}}

Check:
- secrets, image digests, non-root, read-only FS, capabilities, seccomp
- requests/limits, probes, PDB, topology spread, HPA
- network policy, service account/RBAC, PodSecurity admission
- values schema, environment separation, templating, drift
- rollout/rollback, migration jobs, verification signals

Rules:
- Do not apply anything. Render and inspect only.
- Cite file and line.
- Separate MUST-FIX from RECOMMENDED.
- Give the exact read-only verification command and expected output.

Output:
1. Findings table: severity | file:line | issue | why it matters | fix | verification.
2. Rendered-diff risks.
3. Rollback checklist.
4. Questions for the service owner.
```

### 5.4 Deployment-script standards

- **Idempotent:** safe to run twice; no duplicated side effects.
- **Explicit target:** cluster, namespace, environment, and account are explicit; no implicit current context.
- **Least privilege:** no production admin credentials on laptops; use short-lived, scoped credentials.
- **Dry-run first:** render, diff, plan, or `--dry-run=server` before apply.
- **Approval gate:** production changes require the approved change record and a human approver.
- **Audit:** log who ran what, when, against which target, and the result.
- **Rollback:** a tested rollback path, not a hope.
- **Verification:** a clear success signal (SLO, transaction success rate, reconciliation, error budget).
- **No secrets:** read from the secret manager at runtime; never echo or log them.

### 5.5 Deployment runbook prompt

```text
Draft a deployment runbook for {{service}} version {{version}} to {{environment}}.

Inputs:
- Change summary and risk tier: {{...}}
- Pre-checks: {{...}}
- Rollback assets: {{...}}
- Verification signals: {{...}}
- Comms/approval path: {{...}}

Output:
1. Pre-flight checklist.
2. Exact steps with expected output and time estimates.
3. Go/no-go criteria.
4. Verification: SLOs, transaction success, ledger/reconciliation, error budget.
5. Rollback triggers and steps.
6. Comms plan.
7. Evidence to attach to the change record.

Rules:
- Do not include real credentials or customer data.
- Mark any step that requires human approval.
- Prefer read-only verification.
```

---

## 6. Project-level instructions, workspace rules, and prompt templates

### 6.1 What "workspace rules" means in GitHub Copilot

There is no single "workspace rules" file. In practice, workspace rules are the combination of:

- Repository-wide custom instructions: `.github/copilot-instructions.md`.
- Path-specific instructions: `.github/instructions/*.instructions.md` with `applyTo` globs.
- Agent instructions: `AGENTS.md` (or `CLAUDE.md` / `GEMINI.md` where supported).
- Tool restrictions on custom agents and skills: `tools`, `allowed-tools`.
- Workspace settings that enable or recommend customisations.

> **Design rule**
>
> Keep always-on instructions short and stable. Move detailed procedures into skills, and move non-negotiable controls into hooks/CI.

### 6.2 The customization ladder

| Layer | File / location | Scope | Use for | Owner | Review |
|---|---|---|---|---|---|
| **Repository instructions** | `.github/copilot-instructions.md` | Whole repo, always on | Architecture, build/test commands, money/security rules, DoD | Tech lead | Every architecture change |
| **Path-specific instructions** | `.github/instructions/*.instructions.md` | Files matching `applyTo` | Domain rules for money, API, infra, tests | Module owner | Quarterly |
| **Agent instructions** | `AGENTS.md` | Directory tree / agents | Agent-specific workflow and constraints | Platform | Quarterly |
| **Prompt files** | `.github/prompts/*.prompt.md` | Manual, per task | Repeatable tasks: review, test plan, Helm review | Capability owner | When changed |
| **Skills** | `.github/skills/<name>/SKILL.md` | Auto-selected by relevance | Multi-step procedures with assets/scripts | Capability owner | When changed |
| **Custom agents** | `.github/agents/*.agent.md` | Manual or delegated | Specialist roles with tool restrictions | Capability owner | When changed |
| **Hooks** | `.github/hooks/*.json` | Lifecycle events | Deterministic guardrails, audit, secret checks | Platform/Security | Security review |
| **MCP** | Repository MCP settings / `mcp.json` | Tools and data | Read-only access to registries, observability, policy | Platform | Security review |
| **Plugins** | Agent plugin manifest / marketplace | Bundle | Distribution of related capabilities | Platform | Full supply-chain review |

### 6.3 Which customization should I use?

| Need | Use | Why |
|---|---|---|
| A rule that must apply to almost every task | Repository instructions | Always-on context |
| A rule that applies only to a domain/path | Path-specific instructions | Avoids polluting unrelated work |
| A repeatable single task with inputs | Prompt file (IDE) or skill (cross-surface) | Manual invocation, consistent output |
| A multi-step procedure with scripts/templates | Skill | Loads only when relevant; can bundle assets |
| A specialist role with restricted tools | Custom agent | Reusable persona + permissions |
| A task that must be blocked or allowed deterministically | Hook / CI / policy | The model cannot override it |
| External data or an action | MCP server / connector | Standardised, auditable integration |
| A bundle for distribution | Agent plugin / internal marketplace | Versioned installation and lifecycle |

> **Prompt files vs skills**
>
> Prompt files are primarily IDE-scoped and manually invoked. Skills are auto-selected by relevance and work across more Copilot surfaces, including cloud agent and code review. If a workflow must work everywhere, build a skill.

### 6.4 Instruction hygiene

☐ Keep repository instructions under two pages.

☐ Use imperative, testable language: "Use X", "Never Y", "Run Z".

☐ Include exact build/test/lint commands.

☐ Link to ADRs and specs instead of duplicating them.

☐ Never include secrets, customer data, or internal URLs that require special access.

☐ Do not include transient ticket IDs, sprint numbers, or temporary workarounds.

☐ Resolve conflicts between instructions; the model should not have to guess.

☐ Assign an owner and a review date.

☐ Measure: does the instruction reduce review comments or rework? If not, remove it.

---

## 7. Copy-paste configuration templates

### 7.1 Repository-wide instructions

`.github/copilot-instructions.md`

```markdown
# Repository instructions

## What this repository is
- {{service_name}} is a {{language/framework}} service in the {{domain}} domain.
- It handles: {{transaction types}}. It must never: {{prohibited behaviours}}.
- Architecture: {{layers/modules}}. Dependencies point inward. No domain logic in controllers.
- Source of truth: {{ADRs, OpenAPI/proto, ledger spec}}.

## Build, test, run
- Build: `{{command}}`
- Unit tests: `{{command}}`
- Integration tests: `{{command}}` (requires Docker/Testcontainers)
- Contract tests: `{{command}}`
- Lint/format: `{{command}}`
- Local run: `{{command}}`
- Always run `{{command}}` before proposing a PR.

## Non-negotiable engineering rules
- Money: integer minor units or BigDecimal; never float/double. Specify currency and rounding explicitly.
- Ledger: double-entry; immutable journal; reversals only; no edits to posted entries.
- Idempotency: every state-changing payment endpoint requires an idempotency key and replay-safe handling.
- Auth: authorize at the object level, not just the route. Deny by default.
- Secrets: never hard-code, log, or echo secrets. Use the approved secret store.
- PII/PCI: minimise. Never log PAN, CVV, full account numbers, or personal data.
- Errors: use the shared error taxonomy. Do not leak internal details to clients.
- Observability: include correlation ID, transaction ID, and safe structured fields.

## API and events
- API changes follow {{versioning policy}}. Breaking changes require an ADR and consumer notification.
- Events are immutable and versioned. Consumers must tolerate unknown fields.
- Contract source of truth: {{OpenAPI/proto/AsyncAPI path}}.

## Tests
- Every behaviour change needs a test that fails before and passes after.
- Use fixed clocks, fixed FX rates, and seeded randomness.
- No live network calls in unit tests; use contract stubs or Testcontainers.
- Name tests by behaviour, not implementation.

## Definition of Done
- Tests, static analysis, dependency/secret scanning, and contract checks pass.
- Rollout/rollback and observability are documented.
- No sensitive data in code, logs, tests, fixtures, or prompts.
- PR includes risk, rollback, and verification notes.

## How to work
- Read the relevant ADR and module README before changing behaviour.
- Prefer small, reviewable diffs. Do not mix refactoring with behaviour change.
- If a requirement is ambiguous, ask. Do not invent policy or business rules.
- Do not modify generated files, migrations, or production configs without explicit instruction.
- When you use AI, verify the output and disclose material assistance in the PR.

## Where to look
- ADRs: `docs/adr/`
- Runbooks: `docs/runbooks/`
- API spec: `{{path}}`
- Architecture diagram: `{{path}}`
```

### 7.2 Path-specific instructions

`.github/instructions/money.instructions.md`

```markdown
---
applyTo: "**/ledger/**,**/payments/**,**/*Money*.*,**/*Amount*.*"
---
- Represent money as minor units (long) or BigDecimal. Never float or double.
- Carry currency explicitly. Reject mismatched currencies.
- Specify the rounding mode at the boundary. Default to HALF_EVEN unless the product rule says otherwise.
- Apply fees, tax, and FX in the documented order.
- Every posting must balance. Use reversal entries, never edits.
- Add property-based tests for invariants: debits = credits, refund <= capture, replay is idempotent.
- Do not introduce a new money library without an ADR.
```

`.github/instructions/api.instructions.md`

```markdown
---
applyTo: "**/api/**,**/openapi/**,**/contracts/**"
---
- Public APIs are versioned. Breaking changes require an ADR and consumer impact analysis.
- Every mutating endpoint requires idempotency and object-level authorization.
- Use the shared error taxonomy. Never leak stack traces or internal identifiers.
- Validate request and response against the OpenAPI schema. Update the spec in the same PR.
- Add contract tests for consumer/provider compatibility.
- Events are immutable and versioned; consumers tolerate unknown fields.
```

`.github/instructions/infra.instructions.md`

```markdown
---
applyTo: "**/helm/**,**/k8s/**,**/terraform/**,**/deploy/**"
---
- No secrets in values, manifests, or scripts. Use External Secrets or CSI.
- Containers: non-root, read-only root FS, drop ALL capabilities, seccomp RuntimeDefault, no privileged.
- Pin images by digest. Never use :latest.
- Set requests/limits, probes, PDB, and network policy.
- Render and diff before apply. Run helm lint, schema validation, and policy checks.
- Every change needs rollback steps and a verification signal.
- Do not run production commands without explicit human approval.
```

`.github/instructions/tests.instructions.md`

```markdown
---
applyTo: "**/test/**,**/tests/**,**/*Test*.*,**/*IT.*"
---
- One behaviour per test. Arrange-act-assert. No conditionals or loops in tests.
- Fixed clock, fixed FX rates, seeded randomness. No live external calls.
- Use synthetic data only. Never copy production data.
- Assert the business outcome and the audit/ledger side effect.
- Mark slow/integration tests with the agreed tags.
- A flaky test is a defect: quarantine it with an owner and a fix date.
```

### 7.3 Prompt files

`.github/prompts/secure-review.prompt.md`

```markdown
---
name: secure-review
description: Review a diff for fintech security, money, and compliance risks
argument-hint: [diff, PR, or path]
agent: agent
---
Review {{input}} as a senior fintech security engineer.

Check:
- authentication and object-level authorization
- input validation, output encoding, injection, SSRF, deserialization
- money representation, rounding, currency, fees, FX, ledger integrity
- idempotency, retries, concurrency, duplicate posting
- PII/PCI handling, logging, secrets, audit trail
- error handling and information disclosure
- dependency and supply-chain risk

Rules:
- Cite file and line.
- Do not claim a control exists unless the code demonstrates it.
- Separate MUST-FIX from DEFENCE-IN-DEPTH.
- For each finding: risk, exploit scenario, fix, and test.
- If evidence is missing, say what you need.

Output: findings table sorted by severity, then a merge recommendation with residual risk.
```

`.github/prompts/test-plan.prompt.md`

```markdown
---
name: test-plan
description: Derive a risk-based test plan from acceptance criteria
argument-hint: [ticket, AC, or spec]
agent: plan
---
Create a test plan for {{input}}.

Rules:
- Derive expected values from the specification, not from the implementation.
- Cover happy path, boundaries, negative/abuse cases, state transitions, concurrency, and audit/ledger side effects.
- For money: include zero, min, max, precision, rounding, currency minor units, FX, fees, and limits.
- Mark assumptions and open questions.
- Do not generate test code yet.

Output:
1. Requirement/AC traceability table.
2. Test matrix: ID | rule | technique | input | expected | oracle | priority | type.
3. Top 10 risks and why.
4. Test data needs (synthetic only).
5. Automation candidates and manual/exploratory charters.
```

`.github/prompts/helm-review.prompt.md`

```markdown
---
name: helm-review
description: Review a Helm chart or rendered manifest for security and reliability
argument-hint: [chart path or diff]
agent: agent
---
Review {{input}} as a platform engineer.

Check:
- secrets, image digests, non-root, read-only FS, capabilities, seccomp
- requests/limits, probes, PDB, topology spread, HPA
- network policy, service account/RBAC, PodSecurity admission
- values schema, environment separation, templating, drift
- rollout/rollback, migration jobs, verification signals

Rules:
- Do not apply anything. Render and inspect only.
- Cite file and line.
- Separate MUST-FIX from RECOMMENDED.
- Provide the exact read-only verification command and expected output.

Output:
1. Findings table: severity | file:line | issue | why it matters | fix | verification.
2. Rendered-diff risks.
3. Rollback checklist.
4. Questions for the service owner.
```

`.github/prompts/hotfix-risk.prompt.md`

```markdown
---
name: hotfix-risk
description: Assess regression risk for a minimal hotfix
argument-hint: [incident ID, diff, or PR]
agent: plan
---
Assess the regression risk of {{input}} for a production hotfix.

Inputs to request if missing:
- incident summary and affected journeys
- diff and changed files
- dependency graph / consumers
- existing tests and coverage
- feature flags and data migrations
- rollback plan

Output:
1. Blast-radius table: component | downstream | data | contract | customer journey.
2. Risk score: impact × likelihood × detectability, with rationale.
3. Must-run / should-run / defer tests, with time estimates.
4. Manual exploratory charters.
5. Verification signals and rollback triggers.
6. Residual risk and sign-off recommendation (not a sign-off).
```

### 7.4 Skill example

`.github/skills/payment-incident-triage/SKILL.md`

```markdown
---
name: payment-incident-triage
description: Reconstruct a payment incident timeline and transaction lifecycle from redacted evidence. Use when a payment, refund, ledger, or reconciliation incident needs structured RCA.
---
# Payment incident triage

1. Confirm the incident ID, severity, affected transaction types, and time window (UTC).
2. Build the Incident Context Pack from the approved template. Mark unknowns.
3. Normalise evidence: source, timestamp, correlation ID, redaction status.
4. Build the timeline and signal clusters.
5. Reconstruct the transaction lifecycle; identify the first divergence.
6. Check ledger balance, idempotency, retries, FX/rounding, fees, and settlement.
7. Produce a hypothesis matrix with falsifiable probes.
8. Stop and escalate on any stop rule: double debit, data corruption, sanctions, regulatory trigger.

Never: request raw PAN/PII, execute production commands, or declare root cause.

Output: timeline, lifecycle table, hypothesis matrix, next probes, evidence gaps.
```

### 7.5 Custom agent example

`.github/agents/security-reviewer.agent.md`

```markdown
---
name: security-reviewer
description: Read-only security and compliance reviewer for fintech diffs. Use for pre-PR review of auth, money, PII, and dependency changes.
tools: ["read", "search"]
---
You are a read-only security reviewer for a regulated fintech codebase.

- Do not edit files or execute commands.
- Cite file and line for every finding.
- Check authentication, object-level authorization, injection, money handling, idempotency, PII/PCI, secrets, audit logging, and error disclosure.
- Separate MUST-FIX from DEFENCE-IN-DEPTH.
- If a control cannot be verified from the repository, say so.
- Never approve a merge. Return findings, required evidence, and a residual-risk statement.
```

### 7.6 Hooks example

`.github/hooks/guardrails.json`

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": ".github/hooks/scripts/guard-tool-use.sh",
        "powershell": ".github/hooks/scripts/guard-tool-use.ps1",
        "cwd": ".",
        "timeoutSec": 10
      }
    ],
    "sessionStart": [
      {
        "type": "command",
        "bash": ".github/hooks/scripts/audit-session-start.sh",
        "powershell": ".github/hooks/scripts/audit-session-start.ps1",
        "cwd": ".",
        "timeoutSec": 10
      }
    ]
  }
}
```

> **Hook review requirement**
>
> Hooks run real code. Review every script, keep it under five seconds where possible, never log secrets, validate inputs, and test both allow and deny paths. Do not pre-approve `shell` or `bash` in skills unless the skill and its scripts have been security-reviewed.

### 7.7 Architecture standards as executable assets

| Standard | Where it lives | How it is enforced |
|---|---|---|
| **Layering and dependency direction** | ADR + module README | Architecture tests (ArchUnit, dependency-cruiser, import-linter) |
| **API style and versioning** | OpenAPI/proto + API instructions | Schema validation, contract tests, breaking-change check |
| **Error taxonomy** | Shared library + instructions | Lint rule, contract tests |
| **Money and rounding** | Ledger spec + money instructions | Property-based tests, ledger invariant checks |
| **Idempotency** | API spec + instructions | Replay tests, contract tests |
| **Observability** | Service template + instructions | Review checklist, telemetry tests |
| **Security controls** | Secure coding standard + instructions | SAST, SCA, secret scanning, security tests |
| **Infrastructure** | Helm chart template + infra instructions | `helm lint`, schema validation, policy-as-code |
| **Data classification** | Data catalogue + instructions | DLP, log scanning, review |

---

## 8. PR and review workflow

### 8.1 Author checklist

☐ The PR implements one behaviour change and links the ticket/AC.

☐ The plan and risk tier are recorded for high-risk changes.

☐ Tests fail before and pass after; the oracle is documented.

☐ SAST, SCA, secret scanning, and contract checks pass.

☐ Money, ledger, idempotency, and concurrency impacts are stated.

☐ Data classification and PII/PCI impact are stated.

☐ Rollout, rollback, and observability are documented.

☐ AI assistance is disclosed, and material outputs are verified.

☐ The diff is small enough to review properly.

### 8.2 Reviewer checklist

☐ The change matches the ticket and does not smuggle in unrelated refactoring.

☐ The security and money rules are actually enforced, not just mentioned.

☐ Tests assert behaviour and side effects; no weak or missing assertions.

☐ Error handling does not leak internal details.

☐ Migrations and infra changes have rollback and verification.

☐ The PR description is accurate; AI-generated claims are checked.

☐ CODEOWNERS approval is present for high-risk paths.

### 8.3 PR description template

```markdown
## Change
{{what and why, linked ticket/AC}}

## Risk
- Customer impact:
- Money/ledger impact:
- Data classification:
- Regulatory impact:
- Blast radius:

## Verification
- [ ] Unit / integration / contract tests
- [ ] SAST / SCA / secret scan
- [ ] Policy / IaC checks
- [ ] Canary / staging verification
- [ ] Rollback tested or rehearsed

## Observability
- Metrics / logs / traces / alerts:
- Success signal:
- Rollback trigger:

## AI assistance
- Used Copilot for:
- Output verified by:
- Remaining uncertainty:
```

> **Accountability**
>
> AI-generated code is still your code. "Copilot wrote it" is not a defence in review, incident response, or audit.

---

## 9. Definition of Done

| Change type | Required evidence | Approver |
|---|---|---|
| **Feature** | AC traceability, unit/integration tests, contract check, security scan, observability, rollback | Peer + CODEOWNERS |
| **Hotfix** | Incident link, minimal diff, regression tests, risk assessment, canary, rollback, reconciliation | Incident commander + QA/security |
| **API contract** | Spec diff, consumer impact, contract tests, versioning, deprecation plan | API owner + consumers |
| **Data migration** | Expand/contract plan, backfill, rollback, volume test, invariant checks | Data owner + DBA/platform |
| **Infra/Helm** | Rendered diff, lint/schema/policy, security context, rollback, verification | Platform + security |
| **Dependency upgrade** | SCA, licence, provenance, migration tests, rollback | Owner + security |

---

## 10. Metrics

| Metric | What it tells you | Target direction |
|---|---|---|
| **PR size** | Batch size and reviewability | Down |
| **Review cycle time** | Wait and rework | Down |
| **Change failure rate** | Safety of delivery | Down |
| **Escaped defect rate** | Test effectiveness | Down |
| **Test coverage of risk** | Whether high-risk behaviours are tested | Up |
| **Rework rate** | Quality of the first change | Down |
| **Security findings per PR** | Shift-left effectiveness | Down over time |
| **AI acceptance / retention** | Whether suggestions are useful | Directional |
| **Time saved (sampled)** | Practical value | Up, with evidence |

> **Do not use lines of code as a productivity metric.** It rewards volume, not outcomes, and is trivial to inflate with AI.

---

## 11. Anti-patterns

| Anti-pattern | Why it fails | Better approach |
|---|---|---|
| **A 40-page instruction file** | Model attention dilutes; humans stop maintaining it | Short always-on rules + path-specific + skills |
| **Vague rules** ("write clean code") | Not testable; no behaviour change | Imperative, specific, with examples |
| **Secrets or customer data in prompts** | Compliance and security incident | Redact; use approved tools and synthetic data |
| **AI-generated tests without an oracle** | Tests assert the implementation, not the requirement | Define the oracle from spec/ledger rules |
| **Letting an agent apply infrastructure** | Unreviewed production change | Render/diff only; human approves apply |
| **Auto-merging high-risk PRs** | Bypasses accountability | CODEOWNERS, required checks, human merge |
| **Prompt files for cross-surface workflows** | Prompt files are IDE-scoped | Build a skill |
| **Copy-pasting public prompts/skills** | Prompt injection, licence, and security risk | Review, pin, and evaluate before use |
| **"All tests pass" without running them** | False evidence | Run the command; attach the output |
| **Using AI to bypass a failing gate** | Treats the symptom, not the control | Fix the cause; exception only with approval |

---

## 12. Related pages

- **GenAI Strategy for Fintech Kanban & Run Incidents** — context switching, RCA prompts, and incident guardrails.
- **QA Playbook – Accelerated Testing & Edge-Case Coverage** — acceptance criteria, boundary-value tests, and hotfix regression risk.
- **Advanced Extensibility & Tooling (Skills, Agents & Plugins)** — contract verification, compliance agents, MCP, and packaging.
- **Architecture & Workflow Diagrams (Excalidraw Ready)** — Dev/QA touchpoints and extensibility architecture.

---

**Change log**

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-11-08 | AI Enablement | Initial production-ready release |
