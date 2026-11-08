# QA Playbook – Accelerated Testing & Edge-Case Coverage

**AI-assisted acceptance criteria, financial boundary testing, automated test stubs, and hotfix regression risk**

| Field | Value |
|---|---|
| **Audience** | QA Engineers, SDETs, Developers, Product Owners |
| **Owner** | Principal AI Enablement & DevOps Architect |
| **Co-owner** | QA Lead |
| **Classification** | Internal |
| **Version** | 1.0 |
| **Review** | Quarterly, and after any escaped defect above threshold |
| **Labels** | `genai`, `github-copilot`, `qa-playbook`, `fintech`, `testing` |

**On this page**

1. Purpose and principles
2. The QA AI operating loop
3. Acceptance criteria workflow
4. Boundary-value testing for financial calculations
5. Automated test stubs
6. Regression risk during rapid hotfixes
7. Test data and privacy
8. Metrics
9. Definition of Done and sign-off
10. Anti-patterns

---

## 1. Purpose and principles

QA is where GenAI has one of its highest leverage points in fintech — and one of its most dangerous failure modes. A model can generate hundreds of plausible test cases in seconds. It can also generate a plausible **wrong expected value** just as quickly.

> **The core principle**
>
> **The model can generate tests; it cannot be the oracle.**
>
> Every expected value must come from an authoritative source: the product rule, the ledger specification, the regulatory requirement, the approved configuration, or a versioned golden dataset. "The model said so" is not an oracle.

**What this page optimises**

- Acceptance criteria that are testable, unambiguous, and risk-aware.
- Boundary coverage for money, FX, fees, tax, interest, limits, dates, state, and concurrency.
- Test stubs that accelerate automation without weakening assertions.
- Fast, evidence-based regression risk analysis during Kanban hotfixes.
- Fewer escaped defects, fewer false-positive tests, and less rework.

**What this page does not do**

- It does not replace exploratory testing, domain judgement, or sign-off accountability.
- It does not permit production data in prompts or test environments.
- It does not treat coverage percentage as a proxy for quality.

---

## 2. The QA AI operating loop

| Step | Activity | AI role | Human role | Artefact |
|---|---|---|---|---|
| **1. Understand** | Read the story, AC, domain rules, and data classification | Summarise; identify ambiguity | Confirm business intent | Clarified requirement |
| **2. Model risk** | Identify money, regulatory, customer, and failure impact | Generate risk hypotheses | Assign risk tier | Risk assessment |
| **3. Design** | Choose techniques: BVA, decision table, state transition, pairwise, property-based | Generate candidate cases and boundaries | Select, prioritise, define oracle | Test matrix |
| **4. Generate** | Create stubs, fixtures, and harness code | Scaffold tests and data generators | Review assertions and isolation | Test code |
| **5. Verify** | Run tests; inspect failures; mutate critical logic | Explain failures; suggest gaps | Confirm correctness and coverage | Evidence |
| **6. Report** | Summarise coverage, residual risk, and sign-off | Draft report | Sign off / escalate | QA evidence pack |

> **Operating rule**
>
> Design first, generate second. If the test matrix is wrong, faster test generation only produces wrong answers faster.

---

## 3. Acceptance criteria workflow

### 3.1 Quality bar for acceptance criteria

A good acceptance criterion is:

- **Unambiguous** — one interpretation, one behaviour.
- **Testable** — a human can determine pass/fail without asking the author.
- **Traceable** — linked to a business rule, regulation, or product decision.
- **Risk-aware** — states money, customer, data, and regulatory impact.
- **Complete** — includes negative, boundary, state, and audit behaviour.
- **Scoped** — says what is out of scope.

### 3.2 Prompt pattern: acceptance criteria from a story

```text
You are a senior QA analyst in a regulated payments domain.

Story: {{story}}
Business rules: {{rule_ids_and_text}}
Domain glossary: {{terms}}
Data classification: {{...}}
Regulatory context: {{PCI/GDPR/PSD2/DORA if relevant}}
Known constraints: {{...}}

Produce acceptance criteria in Given/When/Then format.

Rules:
- Do not invent business policy. If a rule is missing, list it as an open question.
- Include happy path, boundaries, negative/abuse cases, state transitions, audit trail, and observability.
- Include monetary examples with exact amounts, currencies, and rounding.
- Include non-functional criteria where relevant: latency, availability, idempotency, reconciliation.
- Separate MUST-HAVE from NICE-TO-HAVE.
- Mark assumptions as ASSUMPTION.

Output:
1. AC table: ID | Given | When | Then | Rule ID | Risk | Test type.
2. Open questions and missing rules.
3. Suggested test data (synthetic only).
4. Out of scope.
5. Definition of Ready checklist.
```

### 3.3 Acceptance criteria review checklist

☐ Each AC maps to a business rule or regulatory requirement.

☐ Each AC has a clear pass/fail condition.

☐ Money examples specify amount, currency, scale, and rounding.

☐ Negative and abuse cases are included.

☐ State transitions and idempotency are covered.

☐ Audit trail and observability are covered.

☐ Non-functional expectations are stated where relevant.

☐ Out-of-scope is explicit.

☐ Product Owner and QA agree; Compliance is consulted where required.

☐ Test data can be generated without production data.

### 3.4 Example: refund of a captured card payment

This is a compact illustration of the level of specificity expected. Amounts are illustrative.

| AC ID | Given | When | Then | Rule |
|---|---|---|---|---|
| **REF-01** | A captured payment of EUR 100.00, refundable | A full refund is requested | EUR 100.00 is refunded; the payment state becomes `REFUNDED`; ledger reversal balances | R-101 |
| **REF-02** | A captured payment of EUR 100.00 | A partial refund of EUR 30.00 is requested | EUR 30.00 is refunded; remaining refundable amount is EUR 70.00 | R-102 |
| **REF-03** | A captured payment of EUR 100.00, already refunded EUR 30.00 | A refund of EUR 70.01 is requested | The request is rejected with `REFUND_EXCEEDS_CAPTURE`; no ledger posting | R-102 |
| **REF-04** | A refund request with idempotency key `K1` | The same request is replayed with `K1` | The same refund is returned; no second posting | R-103 |
| **REF-05** | A refund within the fee-refund window | The refund is processed | The fee is refunded according to the product rule; the ledger shows the fee reversal | R-104 |
| **REF-06** | A refund in a different currency from the capture | The refund is requested | The request is rejected unless FX conversion is explicitly allowed; the rate and timestamp are recorded | R-105 |
| **REF-07** | A successful refund | The event is published | An audit event contains actor, payment ID, amount, currency, reason, and correlation ID; no PAN/PII | R-106 |
| **REF-08** | A refund request during a scheme timeout | The request is retried | The retry is idempotent; the final state is consistent; no duplicate credit | R-103/R-107 |

The point is not the specific numbers. The point is that every AC has a rule, an observable outcome, and a testable oracle.

---

## 4. Boundary-value testing for financial calculations

### 4.1 Why AI struggles with money

Models are good at pattern completion and bad at silent assumptions. In financial calculations, the common failure modes are:

- Floating-point representation and binary rounding.
- Currency minor units (JPY has 0 decimals; KWD/BHD have 3).
- Rounding at the wrong stage (per line vs per total).
- Mixing `HALF_UP` and `HALF_EVEN`.
- Applying fees/tax/FX in the wrong order.
- Using the current FX rate instead of the locked/settlement rate.
- Ignoring cut-off times, holidays, DST, and value dates.
- Treating a retry as a new transaction.
- Testing only the happy path and calling it coverage.

> **Test design rule**
>
> Use decimal strings in test data, not binary floats. Specify the scale and rounding mode explicitly. If the expected value is not derivable from a rule, the test is not ready.

### 4.2 Boundary dimensions

| Dimension | Boundary values to test | Expected behaviour | Oracle source |
|---|---|---|---|
| **Amount** | `0`, `0.01`, minimum, maximum, max+0.01, negative, `-0.00`, very large | Accept/reject per rule; no overflow; sign handled explicitly | Product rule, API schema |
| **Scale / precision** | 2, 3, 4, 6 decimal places; trailing zeros; values with more precision than allowed | Round or reject per rule; no silent truncation | Money standard, ISO 4217 |
| **Currency** | EUR/USD (2), JPY (0), KWD/BHD (3), unknown currency, mismatched currencies | Correct minor unit; reject mismatch/unknown | ISO 4217, product config |
| **Rounding** | `0.004`, `0.005`, `0.006`, `1.005`, `2.675`, negative halves | Exact expected value for the specified mode | Rounding policy |
| **Aggregation** | Sum of rounded lines vs rounded sum; many small amounts | Consistent with documented aggregation rule | Ledger/product rule |
| **FX rate** | 0, negative, very large, many decimals, inverse rate, cross rate, stale rate, rate at cut-off | Reject invalid; use locked rate; record source/timestamp | FX policy, rate feed spec |
| **Fees** | Fixed, percentage, min, max, cap, waiver, tiered, multiple fees, fee on refund | Correct order and rounding; no double fee | Fee schedule |
| **Tax** | Inclusive/exclusive, jurisdiction, rounding, reverse charge, exempt | Correct tax base and rounding; auditable jurisdiction | Tax rule |
| **Interest** | 30/360, ACT/365, ACT/360, leap year, end-of-month, accrual, compounding | Correct day count and accrual | Product/legal spec |
| **Limits** | Exactly at limit, limit+0.01, cumulative daily/monthly, velocity, reset at midnight/time zone | Allow/deny exactly per rule; correct reset | Limit policy |
| **Dates** | Cut-off, weekend, holiday, DST transition, value date vs booking date, settlement T+1/T+2 | Correct date arithmetic and status | Market/product calendar |
| **State** | Partial capture, multiple captures, partial refund, over-refund, reversal, chargeback, expired auth | Valid transitions only; immutable history | State machine |
| **Concurrency** | Two debits at once, optimistic-lock conflict, idempotent replay, out-of-order event | One wins; no lost update; no duplicate posting | Concurrency design |
| **Data quality** | Null, empty, whitespace, unicode, extremely long strings, invalid enum | Reject with the correct error; no crash | API schema |

### 4.3 Test matrix template

| ID | Rule | Dimension | Input | Expected | Oracle | Priority | Type |
|---|---|---|---|---|---|---|---|
| `T-001` | R-101 | Amount = 0 | `0.00 EUR` | Reject `AMOUNT_INVALID` | API rule | P1 | Unit |
| `T-002` | R-101 | Amount = min | `0.01 EUR` | Accept; ledger posts 1 minor unit | Product rule | P1 | Unit |
| `T-003` | R-102 | Refund > capture | `100.01` vs `100.00` | Reject; no posting | Refund rule | P1 | Integration |
| `T-004` | R-105 | Currency mismatch | EUR capture, USD refund | Reject unless FX allowed | FX policy | P1 | Integration |
| `T-005` | R-103 | Replay | Same idempotency key twice | Same result; one posting | Idempotency spec | P1 | Integration |
| `T-006` | R-104 | Fee refund | Refund within window | Fee reversed correctly | Fee schedule | P2 | Integration |
| `T-007` | R-107 | Timeout + retry | Scheme timeout, then retry | No duplicate credit | State machine | P1 | Contract/chaos |

### 4.4 Test design techniques to combine

| Technique | Use for | Example |
|---|---|---|
| **Equivalence partitioning** | Grouping inputs with the same behaviour | Valid/invalid currency; allowed/blocked jurisdictions |
| **Boundary value analysis** | Edges of each partition | Limit, limit+0.01, max, zero |
| **Decision table** | Multiple business rules interacting | Fee + tax + FX + refund window |
| **State transition** | Payment lifecycle | Auth → capture → refund → chargeback |
| **Pairwise / combinatorial** | Many config dimensions | Currency × channel × customer tier × fee schedule |
| **Property-based** | Invariants over many inputs | Debits = credits; refund ≤ capture |
| **Metamorphic** | Relationships between outputs | Doubling amount doubles fee (within cap) |
| **Fuzzing** | Parser and protocol robustness | ISO 20022 fields, API payloads |
| **Contract testing** | Provider/consumer compatibility | OpenAPI, AsyncAPI, ISO 20022 |
| **Model-based** | Complex state machines | Generate sequences from a state model |

### 4.5 Oracle hierarchy

When there is a dispute about the expected value, use this order:

1. **Regulatory or scheme rule** — e.g., ISO 20022, card scheme rules, tax law.
2. **Approved product/ledger specification** — the documented business rule.
3. **Approved configuration** — fee schedule, FX policy, limit policy.
4. **Versioned golden dataset** — reviewed, traceable, and owned.
5. **Characterisation of current behaviour** — only to detect change, not to prove correctness. Label it as a characterisation test.
6. **Model suggestion** — never the sole oracle. Use it to generate candidates, not to decide truth.

> **If the expected value cannot be sourced, the requirement is not ready.** Escalate to the Product Owner or domain expert rather than accepting a model-generated number.

### 4.6 Prompt pattern: boundary-value test design

```text
You are a senior QA engineer designing boundary-value tests for a financial calculation.

Feature: {{feature}}
Business rules: {{rule_ids_and_text}}
Money rules: {{currency, scale, rounding mode, fee/FX/tax order}}
State machine: {{states_and_transitions}}
Known risks: {{...}}

Task: Produce a boundary-value and equivalence-partition test matrix.

Rules:
- Derive every expected value from the rules provided. If a rule is missing, write MISSING RULE and ask.
- Use decimal strings, not floating-point literals.
- Include zero, min, max, just-below, just-above, negative, precision, currency, rounding, aggregation, FX, fees, tax, limits, dates, state, and concurrency.
- Include at least one property-based invariant.
- Mark assumptions as ASSUMPTION.
- Do not generate test code yet.

Output:
1. Test matrix: ID | rule | dimension | input | expected | oracle | priority | type.
2. Top 10 risks and why.
3. Missing rules/questions.
4. Suggested synthetic test data.
5. Automation candidates.
```

### 4.7 Prompt pattern: test data design

```text
Design synthetic test data for {{feature}}.

Constraints:
- No production data, PII, PAN, account numbers, or real customer identifiers.
- Deterministic and reproducible.
- Cover: {{currencies, jurisdictions, customer tiers, states, edge amounts}}.
- Respect data classification: {{...}}.

Output:
1. Data model and relationships.
2. Generator rules with seeds.
3. Boundary datasets.
4. Invalid/abuse datasets.
5. Expected outcomes per dataset.
6. Cleanup/isolation strategy.

Rules:
- Do not use real names, addresses, or card numbers.
- Use reserved test identifiers and clearly fake values.
- Mark any field that must be masked or tokenised.
```

---

## 5. Automated test stubs

### 5.1 What AI can generate

- Test scaffolding and naming.
- Arrange-act-assert structure.
- Fixtures and builders for synthetic data.
- Page objects and API clients for E2E tests.
- Property-based generators.
- Contract test skeletons from OpenAPI/AsyncAPI.
- Mocks/stubs for external adapters.
- Table-driven tests from an approved matrix.

### 5.2 What humans must verify

- **Oracle correctness** — the expected value is right.
- **Assertion strength** — the test would fail if the behaviour were wrong.
- **Isolation** — no shared state, no order dependence.
- **Determinism** — fixed clocks, fixed rates, seeded randomness.
- **Data safety** — synthetic only, no production copies.
- **Security** — no secrets, no real endpoints, no dangerous side effects.
- **Maintainability** — no duplication, no over-mocking, clear failure messages.

### 5.3 Prompt pattern: generate test stubs from an approved matrix

```text
Generate test stubs from the approved test matrix below.

Stack: {{language}} / {{test framework}} / {{assertion library}}
Test matrix: {{approved_matrix}}
Existing patterns: {{links_to_examples}}
Constraints:
- Do not change production code.
- Do not use live network calls or production data.
- Use the existing fixtures/builders where possible.
- Fixed clock and fixed FX rates.
- One behaviour per test; no conditionals or loops in test logic.
- Mark integration tests with the agreed tag.

Output:
1. Files to create/modify.
2. Test code stubs with TODO markers only where the oracle is missing.
3. Fixtures/builders.
4. Commands to run the tests.
5. A list of assertions that need human confirmation.

Rules:
- If the expected value is not in the matrix, do not invent it. Add a TODO and ask.
- Do not weaken an assertion to make the test pass.
- Do not add sleeps or retries to hide flakiness.
```

### 5.4 Test stub quality checklist

☐ The test name describes behaviour and expected outcome.

☐ Arrange-act-assert is clear.

☐ The test fails if the behaviour regresses (mutation check where practical).

☐ The assertion checks the business outcome and the side effect.

☐ No conditionals, loops, or complex logic in the test.

☐ No `sleep`; deterministic waits or fake clocks.

☐ No shared mutable state; each test creates its own data.

☐ No live external calls; contract stubs or Testcontainers.

☐ Synthetic data only; no secrets.

☐ Failure message is actionable.

☐ Test is tagged correctly and runs in the right pipeline stage.

### 5.5 Contract testing workflow

1. Identify the contract source of truth: OpenAPI, AsyncAPI, protobuf, ISO 20022 schema.
2. Diff the proposed change against the current version.
3. Classify changes: breaking, compatible, additive.
4. Generate consumer and provider contract tests.
5. Run against the provider and the consumer stubs.
6. Require consumer notification and versioning for breaking changes.
7. Record the evidence in the PR.

**AI can** explain the diff and generate tests. **AI cannot** approve a breaking change or decide that a consumer does not matter.

---

## 6. Regression risk during rapid hotfixes

### 6.1 The problem

Hotfixes compress the normal delivery timeline. The team is under pressure, the diff is small, and the temptation is to run a smoke test and ship. In fintech, the smallest diff can touch money, auth, or settlement.

### 6.2 Risk model

Use a simple, explicit score:

**Risk = Impact × Likelihood × Detectability**

| Factor | 1 (Low) | 3 (Medium) | 5 (High) |
|---|---|---|---|
| **Impact** | Internal tooling | Customer-facing, reversible | Money movement, regulatory, data integrity |
| **Likelihood** | Isolated, well-tested, simple | Moderate coupling, some coverage | Complex state, concurrency, weak coverage, recent defects |
| **Detectability** | Strong tests + observability | Partial tests or monitoring | No test, no signal, silent failure |

**Risk tiers**

- **Tier 1 (score ≥ 45):** full regression, security review, canary, reconciliation, executive/IC sign-off.
- **Tier 2 (20–44):** targeted regression, contract checks, canary, monitoring, QA sign-off.
- **Tier 3 (< 20):** smoke + targeted tests, standard approval.

The score is a conversation starter, not a substitute for judgement. A Tier 1 issue cannot be argued down because the team is tired.

### 6.3 Inputs to the analysis

- Incident summary and affected customer journeys.
- Diff and changed files.
- Dependency graph and downstream consumers.
- Existing tests and coverage of the changed behaviour.
- Historical defects in the same area.
- Feature flags and data migrations.
- Rollback plan and observability.
- Regulatory/customer impact.

### 6.4 Prompt pattern: hotfix regression risk

```text
You are a senior QA risk analyst supporting a production hotfix.

Inputs:
- Incident: {{id, severity, summary}}
- Diff / changed files: {{...}}
- Dependency graph / consumers: {{...}}
- Existing tests and coverage: {{...}}
- Historical defects: {{...}}
- Feature flags / migrations: {{...}}
- Rollback plan: {{...}}

Task: Assess regression risk and recommend a test strategy. Do not approve the hotfix.

Output:
1. Blast-radius table: component | downstream | data | contract | customer journey.
2. Risk score: impact × likelihood × detectability, with rationale.
3. Must-run tests (with time estimates), should-run tests, and deferred tests with residual risk.
4. Manual exploratory charters (30–60 minutes each).
5. Verification signals: SLOs, transaction success, ledger/reconciliation, error budget.
6. Rollback triggers and post-rollback verification.
7. Residual risk and sign-off recommendation (not a sign-off).

Rules:
- Do not assume a test exists; ask for evidence.
- Do not trade away money, auth, or regulatory checks for speed.
- Mark unknowns as UNKNOWN.
```

### 6.5 Blast-radius map

| Component | Downstream | Data | Contract | Customer journey | Tests |
|---|---|---|---|---|---|
| `payments-api` | `ledger-service`, `notification`, `reporting` | Payment state, idempotency keys | `POST /payments`, `PaymentAuthorized` event | Checkout | Unit, integration, contract |
| `ledger-service` | Reconciliation, reporting, finance | Journal entries, balances | Internal gRPC/event | Balance, refund | Invariant, integration |
| `fx-rate-service` | Pricing, settlement, reporting | Rates, timestamps, source | Rate API | Cross-currency payment | Contract, stale-rate tests |
| `reconciliation-job` | Finance, compliance | Breaks, exceptions | Batch/report | Settlement | Batch, reconciliation |

### 6.6 Test selection

| Priority | What to run | When |
|---|---|---|
| **Must-run** | Money invariants, authz, idempotency, contract tests for changed APIs, regression for affected journeys | Before every Tier 1/2 hotfix |
| **Should-run** | Adjacent journey tests, performance smoke, security regression | If time and risk justify |
| **Deferred** | Broad E2E, non-critical UI, low-risk refactors | With explicit residual-risk acceptance |

> **Timebox rule**
>
> If the must-run set cannot fit the incident window, escalate the risk. Do not silently drop a money or auth test to meet the clock.

### 6.7 Exploratory testing charters

Use short, risk-focused sessions. AI can suggest charters, but a human must explore.

| Charter | Focus | Example questions |
|---|---|---|
| **Money tour** | Amounts, currencies, rounding, fees, FX | What happens at 0.005? At the limit? With a stale rate? |
| **State tour** | Payment lifecycle | Can a refund precede capture? Can a reversal be reversed? |
| **Integration tour** | External rails and retries | What happens on timeout, duplicate response, or out-of-order event? |
| **Security tour** | Auth, input, data exposure | Can I access another customer's payment? Does the error leak data? |
| **Operational tour** | Observability and rollback | Would we detect this? Can we roll back safely? |

### 6.8 Sign-off rubric

| Risk tier | Evidence required | Approver |
|---|---|---|
| **Tier 1** | Full regression, security review, contract checks, canary, reconciliation, rollback rehearsal | Incident commander + QA lead + security/compliance |
| **Tier 2** | Targeted regression, contract checks, canary, monitoring, rollback plan | QA lead + service owner |
| **Tier 3** | Smoke + targeted tests, standard monitoring | QA or service owner |

**Residual risk** must be written down, not implied. "We did not test X because Y; the risk is Z; the owner accepts it" is a valid record. Silence is not.

### 6.9 Post-hotfix verification

- Canary metrics: success rate, latency, error rate, saturation.
- Transaction-level checks: counts, amounts, currencies, states.
- Ledger/reconciliation: no new breaks; existing breaks trending down.
- Customer impact: complaint volume, support contacts, status page.
- Rollback triggers: explicit thresholds, not vibes.
- Post-hotfix: add the missing regression test, update the risk model, close the loop in the postmortem.

---

## 7. Test data and privacy

| Principle | Requirement |
|---|---|
| **Synthetic by default** | Generate data; do not copy production. |
| **No PII/PAN** | Never use real names, addresses, card numbers, account numbers, or customer identifiers. |
| **Deterministic** | Seeds, fixed clocks, fixed FX rates, versioned fixtures. |
| **Classified** | Label test data with its classification and retention. |
| **Isolated** | Each test creates and cleans up its own data. |
| **Access-controlled** | Test environments follow the same least-privilege principle as production. |
| **Residency-aware** | Test data stays in approved regions. |
| **Reviewable** | Fixtures are code-reviewed and versioned. |

> **Red line**
>
> Do not use production data to make a test "more realistic". If realism is required, use a approved masked/tokenised dataset with a documented data-protection review.

---

## 8. Metrics

| Metric | Definition | Target direction |
|---|---|---|
| **Escaped defect rate** | Defects found in production / total defects | Down |
| **Defect leakage by stage** | Where defects are found | Earlier |
| **Test coverage of risk** | High-risk behaviours with an explicit test and oracle | Up |
| **Boundary coverage** | Required boundary dimensions covered per money feature | Up |
| **Oracle defects** | Tests with an incorrect expected value | Down |
| **Flaky test rate** | Tests failing non-deterministically | Down |
| **Automation ROI** | Time saved vs maintenance cost | Up |
| **Hotfix regression incidents** | Incidents caused by a hotfix | Down |
| **Cycle time** | Requirement to verified test evidence | Down |
| **Exploratory coverage** | Risk areas covered by charters | Up |

> **Coverage warning**
>
> Line coverage measures execution, not verification. A test with no assertion can cover 100% of a file and prove nothing. Track **risk coverage** and **oracle quality**, not just percentage.

---

## 9. Definition of Done and sign-off

### 9.1 QA Definition of Done

☐ Acceptance criteria are testable and traceable to rules.

☐ Test matrix covers happy path, boundaries, negative/abuse, state, concurrency, and audit.

☐ Every expected value has a documented oracle.

☐ Automated tests assert behaviour and side effects.

☐ Contract tests pass; breaking changes are approved.

☐ Regression risk is assessed for hotfixes.

☐ Test data is synthetic, deterministic, and classified.

☐ Evidence is attached: test run, coverage of risk, residual risk.

☐ Exploratory charters are completed for high-risk changes.

☐ Sign-off is recorded with the approver and residual risk.

### 9.2 Sign-off by risk tier

| Tier | QA evidence | Sign-off |
|---|---|---|
| **Tier 1** | Full matrix, invariants, contract, security, exploratory, canary, reconciliation | QA lead + incident commander + security/compliance |
| **Tier 2** | Targeted matrix, contract, exploratory, canary | QA lead + service owner |
| **Tier 3** | Smoke + targeted tests | QA or service owner |

---

## 10. Anti-patterns

| Anti-pattern | Why it hurts | Do instead |
|---|---|---|
| **Model as oracle** | Plausible but wrong expected values | Source every expected value from a rule/spec |
| **100% line coverage as a goal** | Rewards execution, not verification | Track risk coverage and mutation quality |
| **Testing implementation details** | Tests break on refactor and miss behaviour | Test outcomes and side effects |
| **Huge E2E suites** | Slow, flaky, hard to diagnose | Small critical journey suite + unit/integration/contract |
| **Snapshot tests for money without review** | Silent approval of wrong values | Review and version the snapshot; assert key fields |
| **Production data in test environments** | Privacy and compliance incident | Synthetic or approved masked data |
| **AI-generated 200 tests** | Volume without risk prioritisation | Start from the risk-based matrix |
| **Sleeps and retries to hide flakiness** | Masks real defects and slows the suite | Deterministic waits; fix the root cause |
| **Skipping exploratory testing** | Automates known cases but misses the unknown | Risk-based charters |
| **"All tests pass" without evidence** | False confidence | Attach the run, the environment, and the result |
| **Dropping money/auth tests to meet a hotfix clock** | Asymmetric fintech risk | Escalate; do not silently accept |

---

## 11. Related pages

- **GenAI Strategy for Fintech Kanban & Run Incidents** — incident workflow, RCA prompts, and data handling.
- **Developer Playbook – From Code to Infrastructure** — secure coding, test generation, and repository instructions.
- **Advanced Extensibility & Tooling (Skills, Agents & Plugins)** — contract verification, compliance agents, and MCP.
- **Architecture & Workflow Diagrams (Excalidraw Ready)** — Dev/QA touchpoints and hotfix flow.

---

**Change log**

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-11-08 | AI Enablement | Initial production-ready release |
