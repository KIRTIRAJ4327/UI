# Future-readiness and competitiveness review: Unified Product Delivery Platform (12 Nov 2026)

**Scope.** This is round 3. Round 1 (`review/panel/market.md`) covered the market and competitors. Round 2 (`review/panel/market-agentic-sdlc.md`) covered spec-driven development, the IDE-agent hand-off and the artifact store. This round asks two things: **are we competitive today**, and **will the design survive the next 12–24 months** of change in standards, models, regulation and autonomy. Findings from earlier rounds are cited, not repeated.

**Method.** About 35 web searches in parallel batches (standard mode) plus one direct fetch (the MCP blog), all on 12 Nov 2026. I also read `PROTOTYPE.md`, `VERDICT.md`, the two market rounds, `src/v3/store.jsx`, `docs.jsx` and `agentpanel.jsx`.

**Tags.** [V] = the vendor's own docs, blog or press. [I] = independent (regulator, law firm, analyst, trade press). [3P] = third-party blog or aggregator. [?] = not verified or my inference. No prices or dates appear that a source did not state. Where sources conflicted, both readings are given.

---

## 0. Bottom line

**Are we competitive?** Only in one slice of the market, and only on paper. That slice is a regulated buyer who wants business people and named, accountable approvers to govern a change from request to release, inside Azure DevOps. No competitor offers that whole path for general applications (round 2).

On the criteria a buyer actually scores, the prototype comes out at **13/30, against 18–24 for the incumbents**. We lead clearly on one criterion (business participation) and on Azure DevOps fit by design. We score zero on model choice, risk tiering and certifications, and we have no customers. ServiceNow, Atlassian, GitHub, Harness and Microsoft all moved during 2026 toward "agents assigned work items under workflow governance":
- Atlassian: agents in Jira went GA, and Rovo Studio has approvals and versioning.
- GitHub: Copilot Fusion and Agent HQ.
- Harness: OPA governs agents in pipelines.
- ServiceNow: auto-approves low-risk changes.

So our gap in governance is narrowing. Because of that, our edge has to be *evidence and accountability depth*, not "we have gates".

**Will the design last?** The *idea* will. The current *implementation shape* will not. Four things are hard-wired:
- the 8 stages, held as a positional status string (`s: 'dddw'`) with a fixed `STAGE_APPROVER` array
- 9 fixed roles
- the literal model name `'GPT-5.4'`
- copy-paste prompts

Within 12–24 months each of these will collide with a known external change:
- **Models now retire every few weeks.** GitHub ran Copilot deprecation batches on 31 Jul, 1 Sep, 2 Oct, 19 Oct and 16 Nov 2026 [V].
- **Standards churn on a schedule.** MCP 2026-07-28 removed sessions and server-initiated elicitation, and introduced a 12-month deprecation policy [V].
- **Policy-based auto-approval is becoming normal.** ServiceNow, Harness and the AWS Agentic AI Lens all use it [V].
- **Regulators want machine-verifiable evidence.** That includes agent identity, model version and signed provenance [I/3P].

The fix is cheap if done now. Turn stages, roles, models and policies into **data and policy**, not code. Put agents behind **MCP/A2A** with **Entra Agent IDs**. Make every artifact a **signed, typed attestation** that carries model, prompt and policy versions.

---

## 1. Is it competitive today? Scorecard

Scale: 0 = absent, 1 = weak or partial, 2 = solid, 3 = best-in-class or native. "Us" is scored on the **prototype as designed**. Integrations are mocked, and **nothing is in production**.

| Criterion | **Us (prototype)** | GitHub (Agent HQ + Spec Kit + Copilot coding agent) | Atlassian (Jira agents / Rovo + JSM) | ServiceNow (Build Agent + AI Control Tower + Change) | Harness | GitLab Duo Agent Platform | AWS Kiro | Microsoft (Azure DevOps + Copilot + Foundry) |
|---|---|---|---|---|---|---|---|---|
| 1. Business-user participation | **3**: plain-language request, plain/technical views, PO approves in browser | 1: Spec Kit is developer-owned, repo markdown [V, round 2] | 2: agents assignable to work items, @mentioned in Jira; PMs in Jira/Confluence [I: SiliconANGLE, heise] | 2: Build Agent turns plain-language requests into Now apps (Now platform only) [V/I] | 0: pipeline/DevOps users | 1: Planner agent [V, round 2] | 0: developer approves own specs [V] | 1: Boards work items only |
| 2. Governance / approvals | 2: named gates, squads, backups, SoD (designed, not proven; no policy-as-code) | 2: branch protection, agent control plane [V] | 2: Rovo Studio GA with roles, approvals, versioning, audit [V/I]; JSM change approval [V] | 3: change approval flows, AI Control Tower; Gartner AI Governance MQ Leader [V/3P] | 3: OPA checked at template save, pipeline start and governed agent action [V] | 2: MR approvals, AI Catalog restrictions (19.0/19.1) [V] | 1: per-phase developer approval | 2: Pipelines approvals/checks |
| 3. Evidence / audit | 2: evidence chain, versions, approver, fingerprint (prototype uses 32-bit FNV hash, not cryptographic) | 2: audit log, signed agent commits now possible [3P] | 2: agent updates recorded in issue history [I: Futurum] | 3: lifecycle governance, AI inventory [V] | 2: "attributed, logged, signed" (vendor claim) [V] | 2: audit events, compliance frameworks [V] | 1: GovCloud prompt logging: docs conflict [V] | 2: ADO audit stream |
| 4. IDE / agent openness | 1: any agent *can* use the prompt, but copy-paste is untracked | 3: Agent HQ hosts agents from several vendors; AGENTS.md; Skills [V/3P] | 3: assign to Claude Code / Cursor / Copilot; Teamwork Graph MCP (beta) [V/I] | 2: Build Agent skills inside Cursor / Claude Code / Copilot [V] | 1 | 2: custom agents and flows, catalog [V] | 1: own IDE + MCP | 2: VS Code agent mode, ADO Remote MCP GA [V, round 2] |
| 5. Azure DevOps fit | **3 by design** (Boards, Repos, Pipelines, Entra); 0 built | 1: Boards → coding agent needs GitHub repos [V] | 1 [?] | 2: Change Velocity ADO extension [V] | 2 [?]: ADO connectors widely documented | 0 | 0 | 3: native; Copilot code review for Azure Repos in public preview [V] |
| 6. Model choice | **0**: single hard-coded GPT-5.4 | 3: Copilot Fusion (GA 28 Oct 2026) routes across models [3P/I] | 2 [?] | 2 [?] | 2: admins can block non-approved models [V] | 3: self-hosted model support in 19.0 [I] | 2: Bedrock models, model governance [V] | 3: Foundry catalog incl. Claude GA; model router [V] |
| 7. Risk tiering | **0**: P0 roadmap item, not built | 1: per-repo rules | 2: JSM risk assessment (Premium) [V] | 3: Change Success Score auto-approves low-risk changes [V] | 2: conditional OPA approvals [V] | 1 | 0 | 1 |
| 8. Metrics / ROI | 1: cost and time per run; no DORA metrics or baseline | 2: agent activity dashboards [I] | 1 [?] | 2 | 3: SEI/DORA [V, round 1] | 2 | 1: usage analytics | 1 |
| 9. Security / certifications | **0**: none; prototype | 3: SOC 2, ISO 27001; ISO 42001 claimed [3P] | 3: SOC 2/ISO 27001; Rovo ISO 42001 (sources conflict) [V/3P] | 3 | 3 [?] | 3: ISO 42001 covering Duo Agent Platform [V] | 3: FedRAMP High, DoD IL-4/5 (Jun 2026) [V] | 3 |
| 10. Time-to-value | 1: new platform, 8 gates, integrations still to build | 3: Copilot bundled into GitHub Enterprise, paid via AI credits (sources conflict on details) [3P] | 3 for Jira shops | 2 | 2 | 2 | 2 | 3 for ADO shops |
| **Total /30** | **13** | **21** | **21** | **24** | **20** | **18** | **11** | **21** |

**Blunt read.**
- **Where we cannot compete yet:**
  - Certifications: we have no SOC 2, ISO 27001 or ISO 42001. GitLab's ISO 42001 explicitly covers Duo Agent Platform [V]. Kiro has FedRAMP High [V].
  - Reference customers: none.
  - Model choice.
  - Time-to-value.

  No feature work fixes the first two in under 12 months.
- **Where we lead:**
  - Criterion 1 (business participation).
  - The *combination* of criteria 1, 2, 3 and 5: business request → named gates → evidence → ADO release.

  ServiceNow is the closest overall, but its plain-language build is for Now-platform apps only. Atlassian is closest in shape, but agents act at workflow transitions with lighter evidence [I].
- **Most dangerous movers:**
  - **Microsoft.** Foundry + Agent 365 + Copilot in ADO already covers agent identity, registry, model routing and code review on Azure Repos. A Boards planning layer would squeeze us [V, inference].
  - **Atlassian.** The 15 Jul 2026 launch put the agent work surface, workflow routing and control plane in one system in Jira [I: Futurum, single source].

---

## 2. Future adaptability (12–24 months)

Each item gives the evidence, then what it **breaks (−)** or **favours (+)** in our design.

### 2.1 Agent interoperability standards

| Standard | State, Nov 2026 | Impact on us |
|---|---|---|
| **MCP** | Latest spec is **2026-07-28** (RC 21 May, final 28 Jul) [V]. Main changes [V: MCP blog]:<br>• **Stateless core**: no `initialize`, no `Mcp-Session-Id`.<br>• **Tasks** moved into an extension.<br>• **Multi Round-Trip Requests replace server-initiated elicitation and sampling**.<br>• **CIMD** is the preferred client registration (DCR deprecated); clients must validate RFC 9207 `iss`.<br>• **Enterprise-Managed Authorization** extension.<br>• **12-month minimum deprecation window**; Roots, Sampling and Logging deprecated.<br>Official MCP Registry is still **preview and public-only (no private servers)**; enterprises use private registries (JFrog GA, Azure API Center) [3P/V]. | **+** The round-2 "Delivery MCP server" fits a stateless, load-balanced Azure deployment.<br>**−** Design `ask_question` as an MRTR `input_required` round-trip, not legacy elicitation. Use the Tasks extension for long builds.<br>**−** Budget for yearly spec migrations. |
| **A2A** | v1.0 (Mar 2026 by most sources) added signed Agent Cards, multi-tenancy, and gRPC/HTTP bindings [3P]. 150+ supporting organisations; in production in Azure AI Foundry and Bedrock AgentCore [I: LF]. **Moved into the Agentic AI Foundation on 20 Aug 2026** [3P]. One analysis says v1.0.1 still lacks protocol-level human escalation and audit replay [3P]. | **+** The missing human-escalation and audit layer is our niche. Expose the delivery agent as an A2A agent (Later horizon) so Foundry, Agent 365 or ServiceNow orchestrators can call it.<br>**−** Not urgent: buyers ask for MCP first. |
| **Agentic AI Foundation (LF)** | Launched Dec 2025 with MCP, goose and AGENTS.md; A2A joined in 2026. **300+ members by 22 Oct 2026** [V: LF]. | **+** Standards are consolidating under neutral governance, so it is safe to build on MCP and A2A. |
| **AGENTS.md** | Read by Copilot, Codex and Cursor. Claude Code support is disputed [3P]. ~60k–97k repos [3P]. An ETH Zurich study found README-style AGENTS.md *slightly hurt* agent performance and raised token cost [3P]. | **+** Generate a *short* AGENTS.md in the repo mirror from approved Knowledge Fabric rules.<br>**−** Keep it terse. |
| **Agent Skills (SKILL.md)** | Opened by Anthropic Dec 2025. Adopted in VS Code / Copilot (`.github/skills`), Codex and 30–40+ tools [3P]. Not confirmed to sit under AAIF [3P]. | **+** Ship "Delivery Developer" skills (assignment, completion report, spec conformance) as portable SKILL.md. This replaces part of the copy-paste prompt. |
| **Agent SDKs** | Microsoft Agent Framework **1.0 GA 2 Apr 2026**; Agent Harness GA at Build (Jun 2026) [I: InfoQ; V]. **Foundry Agent Service GA Mar 2026**, Responses-API based and wire-compatible with OpenAI agents [V]. Hosted agents GA (date conflicts) [V/I]. OpenAI SDK lacks native A2A; Claude SDK has deep MCP support [3P]. | **+** Build the platform's own stage agents on **Microsoft Agent Framework + Foundry Agent Service**. This gives model choice and Azure residency for free. Do not write our own runtime. |
| **Agent identity / registry** | **Microsoft Agent 365 GA 1 May 2026**, built on **Entra Agent ID**, $15/user/month or in M365 E7 [3P]. The Entra Agent registry moved into Agent 365 [3P]. AWS Agent Registry GA Aug 2026 [V]. NIST NCCoE concept paper on agent identity and authorisation (comments closed 2 Apr 2026) [I/3P]. | **−** Today "The agent" is one anonymous actor in our audit log.<br>**+** Register each platform agent (Plan, Spec, Impact…) and the developer's IDE agent session as Entra Agent IDs. The audit log then names an accountable *agent principal* plus its human sponsor. |

### 2.2 Model portability and deprecation

- **Cadence:**
  - GitHub Copilot retires models in batches every few weeks, announced 2–6 weeks ahead (31 Jul, 1 Sep, 2 Oct, 19 Oct, 16 Nov 2026) [V: GitHub changelog].
  - Azure OpenAI gives **at least 60 days' notice** for GA retirements, and retirement dates are **not extendable** [V: MS Learn]. The typical GA lifecycle is 12–18 months; sources differ by provider [V/3P].
  - OpenAI retired `gpt-5.4-cyber` on **20 days' notice** [3P].
- **Our model:**
  - GPT-5.4 left Codex for ChatGPT sign-in on 31 Aug 2026 but stays on the API [3P citing OpenAI release notes].
  - Azure lists gpt-5.4 (2026-03-05) for retirement on **2 Sep 2027** [3P; verify on MS Learn].
  - Hard-coding it breaks within the roadmap window.
- **Routing is becoming the default:**
  - Microsoft Foundry model router now spans 28 regions and includes Claude, which went GA in Foundry in Jun 2026; Claude must be deployed to the customer's own resource [V/I].
  - GitHub **Copilot Fusion** went GA on 28 Oct 2026. It picks one or several models per request at an effort level [3P/I].
- **Implication for regulated buyers:** they need to route *and* pin. Each stage needs an approved model list, a pinned version, an eval gate before any switch, and the model, version and prompt version **stamped on every artifact and decision**. Otherwise a model swap silently changes evidence that an approver already signed.

### 2.3 Agent observability and evals

- **OpenTelemetry GenAI conventions** define `invoke_agent` and tool spans, but **every gen_ai.\* item is still "Development"**. In v1.42.0 (12 Jun 2026) they moved to a separate repo with no tagged release yet [V: opentelemetry.io; 3P]. One blog claiming they are "stable" contradicts the official docs [3P].
  - **Adopt now, pin the version, and keep the mapping in one adapter.**
- **Evals in CI** are now common practice [3P]:
  - deterministic checks first, then LLM-as-judge;
  - non-inferiority against a baseline;
  - nightly and canary runs;
  - per-run cost ceilings;
  - "observation mode" for a few weeks before a gate becomes hard.

  Microsoft Ignite 2026 has an agent "hill-climbing" session on Foundry [I: Redmond Mag].
  - **−** We have no quality loop. "Confidence 74%" in the agent panel is not backed by any eval.
  - **+** "How the agent did this" can be fed from real OTel traces.

### 2.4 Regulation: what will be demanded

| Regime | Status, Nov 2026 | Evidence features it will demand from us |
|---|---|---|
| **EU AI Act + AI Omnibus** | Reg. (EU) **2026/1744**: published in the OJ 24 Jul 2026, in force 27 Jul. Annex III high-risk obligations apply from **2 Dec 2027**; Annex I from **2 Aug 2028**. The Art. 50(2) labelling grace period ends **2 Dec 2026**. Systems self-assessed as non-high-risk must still be registered [I: White & Case, Orrick, Pinsent Masons, Gibson Dunn]. | An SDLC agent is probably **not** itself Annex III high-risk [?]. But FS clients will deliver Annex III systems through us (for example creditworthiness) [?]. They will want:<br>• technical-documentation exports per change<br>• a human-oversight record (who, when, on what evidence)<br>• logging and retention<br>• AI-generated content marking. |
| **DORA** | RTS 2024/1774 Art. 17 change management: recorded, tested, approved, verified; approver separated from implementer (round 2) [I]. **ESAs' joint statement on frontier AI ICT risk (31 Jul 2026)**; AI risks go into **2027 critical-third-party oversight** [I: EBA/EIOPA/ESMA; Capco]. | Change records, SoD proof, a register-of-information pack for us as an ICT third party, incident and kill-switch evidence. |
| **US model risk** | **SR 11-7 rescinded and replaced by SR 26-2 / OCC Bulletin 2026-13 / FDIC FIL-15-2026 on 17 Apr 2026** [I: Orrick]. Commentary says generative and agentic AI are **outside its scope**, leaving banks to define their own AI governance [3P]. Guidance text not checked [?]. | Less compulsion, more vacuum. Banks will still ask for a model inventory, validation (evals), change control on models and prompts, and monitoring. That is an opportunity for a vendor that ships evidence by default. |
| **UK FCA / PRA** | No AI rulebook; SM&CR, Consumer Duty and SYSC apply. PRA SS1/23 covers model risk. **Mills Review published 6 Jul 2026**: SM&CR is fine for low-autonomy AI, but under pressure "once AI approves" [I/3P]. BoE/FCA 2026 survey: only 2% deploy agents with broad autonomy (round 1) [I]. | A named Senior Manager accountable per application. Evidence that a human (or a human-owned policy) approved. |
| **ISO/IEC 42001** | Peers are certified: GitLab (scope includes Duo Agent Platform) [V]; Atlassian Rovo (Trust Center says certified; whitepaper says "in progress") [V/3P]; GitHub Copilot [3P]; BCA bank [V: SGS]. Gartner's first **AI Governance Platforms MQ** (2026) names IBM, ServiceNow and Truyo as Leaders [3P]. | Buyers will ask whether *we* are 42001-certified. Our records must map to the AIMS lifecycle and event-logging controls. |
| **NIST** | CAISI **AI Agent Standards Initiative** launched 17 Feb 2026. An **agent interoperability profile** is a planned Q4 2026 deliverable, unpublished as far as I found; voluntary [I/3P]. | Agent identity, authorisation and interop. Aligns with Entra Agent ID + MCP auth. |
| **EU CRA** (for us as a software vendor) | Vulnerability and incident reporting from **11 Sep 2026**; full obligations, including a machine-readable **SBOM**, from **11 Dec 2027** [3P/I]. Whether our SaaS is in scope is not assessed [?]. | SBOM for our own product. Release-gate SBOM support for clients. |

**Cross-regime "evidence feature" list** (what auditors will ask for by 2027–28):
- **Agent identity.** Every action is attributed to an agent principal and its human sponsor.
- **Version stamps.** Model, prompt and policy version on every artifact and decision.
- **Approver record.** Each approval captures the approver's identity, competence or role, reason, and the risk tier and policy that applied.
- **Tamper evidence.** Cryptographic hashes, WORM storage and signed exports.
- **Ownership of the oversight decision.** A record of which human or policy decided to automate a gate.
- **Operational controls.** Kill switch, incident log and retention or legal hold.
- **Supply chain.** SBOM and provenance for released code.
- **Third-party pack.** Register-of-information data for us as a vendor.

### 2.5 The autonomy trend: will 8 human gates become a liability?

**Yes, for low-risk change, within 12–24 months. No, for high-risk change.** Evidence:
- **Policy-based auto-approval is mainstream:**
  - The AWS Agentic AI Lens tiers actions as autonomous, notify or approve, by impact and reversibility [V].
  - ServiceNow's Change Success Score auto-approves low-risk changes [V]. One third-party article disputes that any vendor's *AI* auto-approves [3P].
  - Harness runs OPA at each governed agent action [V].
- **Volume is rising:** agents now start about 40% of PRs on GitHub, per Universe 2026 coverage [I: TNW, vendor figure].
- **HITL fatigue is documented:**
  - Users reportedly approve 93% of Claude Code permission prompts [3P citing Anthropic, unverified].
  - Use of auto-approve rises with experience, from about 20% to over 40% of sessions [3P].
  - OWASP lists "overwhelming HITL" as an attack vector [3P].
- **The regulatory counterweight:**
  - Only 2% of UK firms grant agents broad autonomy (round 1).
  - The Mills Review flags accountability pressure once AI approves [I/3P].
  - DORA still requires recorded approval and SoD.

**Design answer:**
- Move from "human in every loop" to **human-on-the-loop by policy**. Each gate becomes *required-human*, *policy-approved with human notified*, or *sampled post-hoc review*, chosen by a versioned policy per risk tier.
- A *named human owns the policy*. The audit record reads: "Auto-approved by policy `low-risk-ui@v3`, owned by Dana Whitfield, 2 checks passed".
- This keeps SM&CR accountability while removing rubber stamps.
- Add **approval graduation**: after N clean approvals of a pattern, propose a policy relaxation to the policy owner. Repeated rejections tighten the policy [3P pattern].

### 2.6 Software supply chain and AI-code attribution

- **SLSA L3** provenance is generated by CI with keys the developer cannot access [3P].
- **No settled standard** exists for attributing AI involvement per commit. Current options [3P/V]:
  - AIIR: Sigstore-signed / in-toto receipts, but it misses agent-mode sessions and squash merges.
  - git trailers.
  - Red Hat's sigstore-a2a: signed Agent Cards with SLSA provenance, plus SPIFFE for runtime identity.
- **Commit signing:** the Copilot cloud agent can now push to repos that require signed commits [3P].
- **AI-BOMs:** CycloneDX ML-BOM (ECMA-424) and the SPDX 3.0 AI profile. Neither yet covers agent-specific assurance fields well [3P/I: arXiv].
- **Implication:**
  - The **Completion Report should become an in-toto attestation**: subject is the PR commit SHAs; predicate is the assignment ID, spec fingerprint, model and version, agent ID, tests and deviations. Sign it with the platform's key.
  - At Release, attach the ADO-pipeline **SLSA provenance + CycloneDX SBOM**.
  - We can then be the "who asked for this, who approved it, which agent and model wrote it" layer that SLSA alone does not cover.

### 2.7 Pricing trend

- Hybrid models dominate. In Orb's 2026 sample of 80 AI-agent companies, 95% use hybrid pricing, 91% have a usage component, and only **3.8% use pure outcome pricing** [3P].
- GitHub Copilot moved all plans to token-priced **AI Credits from 1 Jun 2026**. At Universe it bundled Copilot into GitHub Enterprise; sources conflict on whether credits are still billed [3P].
- Agent 365 costs $15 per user per month [3P]. ServiceNow, Salesforce and Zendesk are moving to consumption or outcome pricing [3P].
- **Implication** [?]:
  - Price as a **platform fee (per application or approver seat) plus a metered "governed change" unit**.
  - Pass model tokens through, or have customers BYO their Azure OpenAI / Foundry deployment so tokens land on their own Azure bill.
  - Keep hard budgets (already in the prototype).
  - Avoid pure outcome pricing: "released change" is easy to define, but value attribution is contested.

---

## 3. Adaptability gaps in the current design

Evidence comes from the code read for this review. Line refs are in `/home/user/UI/app/src/v3/`.

| # | Rigid today | Evidence in code | What breaks it (§2) | Adaptive principle to adopt |
|---|---|---|---|---|
| 1 | **Fixed 8 stages, positional status** | `store.jsx` `STAGE = [8 names]`; run status is a positional string `s: 'dddw'`; `KIND_STAGE` maps artifact → stage index | Risk tiers, bug-fix flow, auto-approved gates | **Stages as versioned workflow templates** (stage definitions + gate policy per template). Runs hold *stage instances* with IDs, not array positions. Templates per application and change type. |
| 2 | **Fixed approver per stage index; 9 fixed roles, 17 permissions** | `STAGE_APPROVER = ['priya','priya',null,'alex',…]`; `roles` object literal | Custom roles, app-scoped roles, SCIM, policy-owner role | **Role and permission model as data**, scoped to tenant, application or squad. Approver resolution driven by policy (squad + role + SoD rule), synced from Entra groups via SCIM. |
| 3 | **Single model, hard-coded** | `agentpanel.jsx:68` `['Model','GPT-5.4']` | Deprecations every few weeks; router adoption; BYO model | **Model registry + router with pinning**: approved models per stage, pinned version, fallback, retirement-date alerts, eval-gated switch. Stamp model, version and prompt version on each artifact. Implement via Foundry. |
| 4 | **Copy-paste developer prompt** | Build card "Copy the Developer prompt" (`docs.jsx`, PROTOTYPE.md) | MCP 2026-07-28, Agent Skills, ADO Remote MCP | **Agents behind MCP (stateless, CIMD/Entra auth, MRTR for questions, Tasks for long jobs)** + SKILL.md + AGENTS.md mirror. Copy-paste stays only as a fallback. |
| 5 | **Azure-only, hard-coded apps and repos** | `docs.jsx` `REPO = {3 apps → repo names}` | Microsoft steering to GitHub repos; Jira/JSM and ServiceNow buyers | **Connector abstraction** (SCM, tracker, CI/CD, ITSM) with ADO as the first implementation. Applications onboarded as records, not code. |
| 6 | **No API, events or webhooks** | State in `sessionStorage` (`store.jsx:81`); no outbound events | ITSM sync, SIEM streaming, A2A orchestrators | **Event bus + outbound webhooks** (CloudEvents format [?]) for every decision and artifact. Public REST API. ADO service hooks inbound. |
| 7 | **Policies are toggles** (`policy: { planSoD: true }`) | `store.jsx` | Auto-approval, risk tiers, regulator questions like "which rule applied?" | **Policy-as-code** (OPA/Rego, which Harness already evaluates *in the customer's infrastructure*; or Cedar, now a CNCF Sandbox project [I]). Versioned, unit-tested, policy version recorded per decision. |
| 8 | **No eval / quality loop** | Agent panel shows `conf: 74` with no basis | Model churn; SR 26-2 vacuum; auditors | **Eval harness**: golden sets per stage, evals in CI before any model or prompt change, live quality metrics (send-back rate, deviation rate) per model. |
| 9 | **No agent registry / identity** | Audit actor is just `'agent'` | Agent 365 / Entra Agent ID; NIST agent identity | **Every agent is a registered principal** (Entra Agent ID) with an owner, scope, model and allowed tools. A global stop works per agent. |
| 10 | **Weak tamper evidence** | `docs.jsx:17` `fp` = 32-bit FNV-1a hash (fine for a demo, not for evidence) | Auditor scrutiny, SLSA/in-toto | **SHA-256 content hashes**, Blob immutability (WORM), **signed in-toto attestations** per artifact and release. |
| 11 | **Fixed artifact kinds** | `KINDS = ['plan','spec',…]` | New flows (bug fix, design-first), schema evolution | **Artifacts as typed, versioned schemas** (JSON Schema + markdown body) with schema version on each record and migrations. |
| 12 | **No tracing** | Agent panel data is static `BASE[stage]` | OTel GenAI | **OTel GenAI tracing** (pinned semconv version, one adapter). The panel and Insights read from traces, exported to Azure Monitor / App Insights. |

---

## 4. Improvement roadmap

Effort: S = under 2 weeks, M = 2–6 weeks, L = over 6 weeks (small team). This roadmap refines and resequences the VERDICT.md P0–P2 list; it does not replace it.

### Now (0–3 months): make the core *configurable and evidential*

| # | Item | Why (evidence) | Effort | Fit with Azure + VS Code standalone agent |
|---|---|---|---|---|
| N1 | **Workflow templates + risk tiers as data** (refactor `s` string → stage instances; template per app and change type; gate mode = human / policy / sampled) | Rigidity gap #1–2. VERDICT P0 #1. Auto-approval is mainstream [V: ServiceNow, Harness, AWS] | M | Pure platform change. Azure SQL schema: `workflow_template`, `stage_instance`, `gate_decision`. |
| N2 | **Model admin: registry, per-stage pinning, version stamps, retirement alerts**; BYO Azure OpenAI / Foundry deployment | Copilot retires models every few weeks [V]; Azure gives ≥60 days' notice and no extensions [V]; GPT-5.4 Azure retirement 2 Sep 2027 [3P] | M | Foundry deployments in the *customer's* subscription. Model router optional, with pinning for regulated stages. |
| N3 | **Delivery MCP server on the 2026-07-28 spec** (stateless, CIMD + Entra, MRTR questions, Tasks extension) + SKILL.md pack; copy-paste becomes the fallback | Round 2 rec #1, updated for the new spec [V] | M | Keeps the agent standalone in VS Code. Any MCP client (Copilot agent mode, Claude Code, Cline) works. Host on Azure Container Apps behind APIM. |
| N4 | **Real tamper evidence**: SHA-256, Blob immutability for released evidence, signed completion report (in-toto) | Gap #10. DORA / ISO 42001 records [I/3P]. SLSA / in-toto practice [3P] | S–M | Azure Key Vault signing key; Blob immutability policies. |
| N5 | **OTel GenAI tracing** of every agent run (pinned semconv) feeding "How the agent did this" | OTel agent spans exist but are still "Development" [V] | S–M | Azure Monitor / App Insights accept OTLP [?]. |
| N6 | **Outbound webhooks + ADO service hooks inbound** | Gap #6. Round 2 rec #10 | S | Native ADO service hooks; Event Grid for outbound [?]. |

### Next (3–9 months): *policy, quality, identity*

| # | Item | Why (evidence) | Effort | Fit |
|---|---|---|---|---|
| X1 | **Policy-as-code (OPA/Rego) for gates, SoD, auto-approval and budgets**, versioned and unit-tested; policy version on every decision; named policy owner | Harness OPA for agents [V]; human-on-the-loop needs an accountable rule [I/3P: Mills] | M–L | OPA sidecar in the customer tenant (Harness shows the pattern) [V]. |
| X2 | **Eval harness + evals in CI** for each stage's prompts and models; quality metrics (send-back rate, spec deviations) in Insights | Practice reports [3P]; SR 26-2 AI vacuum [I/3P]; model churn | M | Run in Azure Pipelines; Foundry evaluation can host the runs [?]. |
| X3 | **Agent identity**: register platform agents and IDE agent sessions as Entra Agent IDs; agent registry page; global and per-agent stop | Agent 365 / Entra Agent ID GA [3P]; NIST NCCoE agent identity [I] | M | Native to Entra; customers may need an Agent 365 licence [3P]. |
| X4 | **Public API + SIEM streaming + regulator-mapped evidence pack** (DORA RTS Art. 17, ISO 42001 controls, AI Act technical-documentation fields) | §2.4 evidence list | M | Microsoft Sentinel connector; APIM-fronted API. |
| X5 | **Typed artifact schemas + repo mirror** with a generated terse AGENTS.md and spec files carrying fingerprints | Round 2 rec #3; AGENTS.md is broadly read, but bloated files hurt [3P] | M | Azure Repos PR + branch-policy status check. |
| X6 | **Assurance programme starts**: SOC 2 Type I readiness, ISO 27001, ISO 42001 gap assessment; DORA third-party pack | Competitors certified [V/3P]; buyer criterion 9 | L (non-engineering) | Azure inherits many controls [?]. |

### Later (9–24 months): *open, autonomous where safe, supply-chain-grade*

| # | Item | Why (evidence) | Effort | Fit |
|---|---|---|---|---|
| L1 | **A2A Agent Card for the delivery agent** (callable by Foundry / Agent 365 / ServiceNow orchestrators). Optionally delegate Build to cloud coding agents for GitHub-hosted repos | A2A v1.0 in Foundry and Bedrock [I]; lacks human escalation and audit replay, which is our layer [3P] | L | Built on Microsoft Agent Framework (A2A support) [3P]. |
| L2 | **Human-on-the-loop mode**: policy auto-approval for low tiers, sampled post-hoc review, approval graduation proposals to the policy owner | §2.5 evidence | M–L | Depends on X1 + X2. |
| L3 | **Release supply-chain evidence**: CycloneDX SBOM, SLSA provenance from ADO pipelines, AI-attribution trailers + attestation, CRA-ready vulnerability links | §2.6; CRA SBOM from 11 Dec 2027 [3P/I] | M | Azure Pipelines tasks; Defender for DevOps [?]. |
| L4 | **Connectors beyond ADO**: GitHub repos (Microsoft's direction [V]), Jira/JSM and ServiceNow change, both two-way | Microsoft steers ADO customers toward GitHub repos [V] | L | Connector abstraction (gap #5). |
| L5 | **Certifications**: SOC 2 Type II, ISO 42001 certification; NIST agent-profile mapping once it is published | Criterion 9 | L | n/a |
| L6 | **Pricing**: platform fee + metered governed change + BYO-model pass-through, with hard budgets | §2.7 | S (commercial) | Tokens billed on the customer's Azure. |

### Do not chase
- **Our own model, router or fine-tunes.** Use the Foundry catalog and router, and pin for regulated stages.
- **Our own agent runtime or framework.** Use Microsoft Agent Framework + Foundry Agent Service (both GA).
- **Our own IDE, VS Code fork, or a competing cloud coding agent.** Round 2 conclusion stands.
- **A2A before MCP.** Buyers and IDE agents ask for MCP now; A2A is for orchestrator-to-orchestrator, later.
- **Supporting every new model the week it ships.** Evaluate quarterly, change only through the eval gate.
- **A home-grown policy DSL.** Use OPA (or Cedar).
- **Hard-wiring OTel attribute names.** They are still "Development"; use one adapter.
- **Becoming an AI governance platform** for clients' whole AI estate (IBM, ServiceNow and Truyo lead that MQ). Export evidence *to* them.
- **Pure outcome pricing** (3.8% of the market [3P]).
- **FedRAMP or GovCloud.** That is not our buyer; Kiro already owns it.
- **More stages or artifact types.** Configurability, not more ceremony (round 2).

---

## 5. Honest bottom line

We are competitive in a narrow, real niche. Regulated, Azure DevOps-centred enterprises want business requesters and named, accountable approvers to govern AI-built change end to end, with one evidence chain. Nobody else covers that whole path for general applications today.

On a buyer's full scorecard, however, the prototype scores 13/30 against 18–24 for ServiceNow, GitHub, Atlassian, Microsoft, Harness and GitLab. We score zero on model choice, risk tiering and certifications, and we have no customers. Incumbents are closing the governance gap quickly.

The *concept* will last, and regulation (DORA, the AI Act from Dec 2027, the post-SR 11-7 vacuum, SM&CR) is moving toward exactly the evidence we specialise in. The *current design* will not last unchanged:
- fixed stages and roles, held as array positions
- one hard-coded model in an era of retirements every few weeks
- a copy-paste hand-off while MCP has become the standard pipe
- toggles instead of policy-as-code
- no eval loop, no agent identity, a non-cryptographic fingerprint

All are fixable within 3–9 months on Azure-native building blocks: Foundry, Agent Framework, Entra Agent ID, Key Vault, Blob immutability. Do that before adding features. Without it we are a well-designed demo that the next model retirement or the first auditor will break.

---

## Sources

**Interoperability standards**
- [V] MCP 2026-07-28 release post: https://blog.modelcontextprotocol.io/posts/2026-07-28/
- [V] MCP spec 2026-07-28: https://modelcontextprotocol.io/specification/2026-07-28.md
- [V] MCP RC post: https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
- [3P] Composio on MCP 2026-07-28: https://composio.dev/blog/mcp-2026-07-28-update-statelessness-apps-auth
- [V] AAIF on MCP 2026: https://aaif.io/blog/mcp-2026-changes-the-rules
- [V] LF, AAIF passes 300 members: https://www.linuxfoundation.org/press/agentic-ai-foundation-surpasses-300-members-in-less-than-one-year
- [I] TechRepublic, AAIF adds 57 members: https://www.techrepublic.com/article/news-agentic-ai-foundation-adds-57-members-open-standards/
- [V] LF, A2A passes 150 organisations: https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year
- [3P] A2A joins AAIF: https://ai2.work/blog/google-s-a2a-protocol-joins-the-agentic-ai-foundation-with-mcp
- [3P] Enterprise DNA on A2A/AAIF: https://enterprisedna.co/resources/news/google-a2a-aaif-agent-protocol-open-standard-august-2026
- [3P] MCP registry comparison: https://www.truefoundry.com/blog/best-mcp-registries
- [V] JFrog MCP Registry GA: https://jfrog.com/blog/announcing-general-availability-of-the-jfrog-mcp-registry/
- [3P] Agent Skills adoption: https://www.noqta.tn/en/news/skill-md-open-standard-30-ai-coding-tools-adoption-2026
- [I] VentureBeat, Anthropic opens Agent Skills: https://venturebeat.com/ai/anthropic-launches-enterprise-agent-skills-and-opens-the-standard
- [3P] AGENTS.md adoption and ETH study: https://codex.danielvaughan.com/2026/05/12/configuring-agentic-coding-tools-research-codex-cli-adoption-gap/
- [3P] AGENTS.md guide: https://neuraltrust.ai/es/blog/agents-md
- [3P] Agent SDK comparison: https://composio.dev/content/claude-agents-sdk-vs-openai-agents-sdk-vs-google-adk
- [3P] SDK comparison (A2A): https://www.morphllm.com/ai-agent-framework

**Microsoft platform**
- [I] InfoQ, Agent Framework harness GA: https://infoq.com/news/2026/08/agent-framework-harness-ga
- [V] Foundry Agent Service GA: https://devblogs.microsoft.com/foundry/foundry-agent-service-ga/
- [V] What's new in Foundry, Build 2026: https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-build-2026/
- [V] Azure update, hosted agents GA: https://mc.merill.net/message/AZ563596
- [3P] Agent 365 GA: https://ivision.com/blog/agent-365-ga
- [3P] Agent registry moving to Agent 365: https://blog-en.topedia.com/?p=65633
- [V] Microsoft Security blog, agentic AI: https://www.microsoft.com/security/blog/2026/03/09/secure-agentic-ai-for-your-frontier-transformation/
- [V] Claude in Foundry GA: https://azure.microsoft.com/blog/claude-in-microsoft-foundry-is-now-generally-available/
- [V] Foundry model router: https://learn.microsoft.com/azure/ai-foundry/openai/how-to/model-router
- [I] InfoQ, model router regions: https://infoq.com/news/2026/08/foundry-model-router-regions
- [V] Foundry model lifecycle and retirement: https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/model-lifecycle-retirement
- [V] Azure OpenAI model retirements: https://learn.microsoft.com/en-my/Azure/foundry/openai/concepts/model-retirements
- [3P] GPT-5.4 / 5.5 Azure retirement dates: https://ecorpit.com/azure-openai-gpt-5-4-gpt-5-5-retirement-2027/
- [V] Azure DevOps and GitHub in the AI era: https://devblogs.microsoft.com/devops/azure-devops-and-github-journeying-into-the-ai-era/
- [V] ADO release notes, sprint 275: https://learn.microsoft.com/en-au/azure/devops/release-notes/2026/sprint-275-update
- [I] Redmond Mag, Ignite 2026 sessions: https://redmondmag.com/articles/2026/10/05/the-5-microsoft-ignite-2026-sessions-that-matter-most.aspx

**Models and deprecation**
- [V] GitHub, Copilot models deprecated 19 Oct 2026: https://github.blog/changelog/2026-10-19-github-copilot-models-deprecated-on-october-19-2026
- [V] GitHub, mid-November deprecations: https://github.blog/changelog/2026-10-15-upcoming-deprecation-of-selected-github-copilot-models-in-mid-november
- [V] GitHub, August 2026 deprecations: https://github.blog/changelog/2026-08-03-upcoming-august-2026-model-deprecations-in-github-copilot/
- [V] GitHub, 2 Oct deprecations: https://github.blog/changelog/2026-10-02-selected-models-in-github-copilot-deprecated
- [3P] GPT-5.4 leaves Codex on 31 Aug: https://codex.danielvaughan.com/2026/08/01/gpt-54-retirement-august-31-codex-cli-migration-gpt56-terra-luna-configuration/
- [3P] gpt-5.4-cyber retired on 20 days' notice: https://mixed-news.com/en/?p=34883
- [I] TNW, Copilot Fusion and agents starting 40% of PRs: https://thenextweb.com/news/github-universe-copilot-fusion-octoverse-agents
- [V] GitHub Universe 2026: https://github.blog/news-insights/company-news/github-universe-2026-evolving-every-layer-of-the-stack/
- [3P] Copilot Fusion pricing: https://smartscope.blog/en/blog/github-copilot-fusion-automatic-model-selection-pricing-supported-2026/
- [3P] GitHub Enterprise bundles Copilot: https://www.beri.net/article/github-universe-2026-recap-enterprise-includes-copilot-no-ai-credits-fusion-ga-30-percent-discount-standalone-10-dollars
- [I] The New Stack on Copilot Fusion: https://thenewstack.io/github-copilot-fusion/

**Observability and evals**
- [V] OTel GenAI agent spans: https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans
- [3P] GenAI conventions not yet stable: https://dev.to/azena-ai/opentelemetrys-genai-semantic-conventions-are-not-stable-yet-heres-what-actually-shipped-in-2026-3mke
- [3P] Dash0, GenAI conventions explained: https://www.dash0.com/knowledge/opentelemetry-genai-semantic-conventions-explained
- [3P] LLM eval as a CI regression gate: https://oneuptime.com/blog/post/2026-08-31-llm-evaluation-ci-regression-gate/view
- [3P] Agent CI gates: https://tianpan.co/blog/2026-04-17-ai-agents-ci-pipeline-deployment-gates

**Regulation**
- [I] White & Case, AI Omnibus enters into force: https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act
- [I] Orrick, Digital Omnibus finalised: https://www.orrick.com/en/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes
- [I] Pinsent Masons, high-risk delay finalised: https://www.pinsentmasons.com/out-law/news/law-delaying-eu-high-risk-ai-rules-finalised
- [I] Gibson Dunn, AI Act Omnibus: https://www.gibsondunn.com/eu-ai-act-omnibus-agreement
- [I] EBA, ESAs joint statement on frontier AI (31 Jul 2026): https://www.eba.europa.eu/publications-and-media/press-releases/eba-eiopa-and-esma-call-enhanced-governance-and-consistent-supervision-mitigate-ict-risks-frontier
- [I] Capco on frontier AI and DORA: https://www.capco.com/intelligence/capco-intelligence/frontier-ai-cyber-risk-how-banks-should-rethink-dora
- [I] Orrick, model risk guidance overhaul (SR 26-2): https://www.orrick.com/en/Insights/2026/04/Agencies-Overhaul-Model-Risk-Management-Guidance-for-Banks-Heres-What-Changed
- [3P] SR 11-7 rescinded, AI gap: https://elevateconsult.com/insights/sr-11-7-rescinded-model-risk-guidance-ai-gap
- [I] Protiviti, MRM guidance changes: https://www.protiviti.com/sites/default/files/2026-05/insights-paper-mrm-guidance-changes-protiviti-na.pdf
- [I] Freshfields, FCA Mills Review: https://www.freshfields.com/en/our-thinking/briefings/2026/02/the-fca-looks-to-2030-key-takeaways-from-the-mills-review-on-ai-in-retail-financial-services
- [I] Ashurst, Mills Review and agentic AI: https://www.ashurstperkinscoie.com/en/insights/technology-transactions-soundbite-the-fca-mills-review-and-its-agentic-ai-finance-framework/
- [I] PwC, agentic AI and regulatory attention: https://www.pwc.co.uk/industries/financial-services/understanding-regulatory-developments/agentic-ai-preparing-for-greater-regulatory-attention.html
- [I] NIST, AI Agent Standards Initiative: https://nist.gov/news-events/news/2026/02/announcing-ai-agent-standards-initiative-interoperable-and-secure
- [I] Pillsbury on NIST agent standards: https://www.pillsburylaw.com/en/news-and-insights/nist-ai-agent-standards.html
- [3P] CSA research note on NIST: https://labs.cloudsecurityalliance.org/research/csa-research-note-nist-ai-agent-standards-initiative-2026040/
- [V] SGS, BCA ISO 42001: https://www.sgs.com/en-ae/news/2026/02/consumer-bank-becomes-first-in-indonesia-to-receive-iso-iec-42001-certification
- [V] GitLab ISO 42001: https://about.gitlab.com/blog/gitlab-achieves-iso-iec-42001-certification-for-ai-governance/
- [V] Atlassian Trust Center: https://customertrust.atlassian.com/
- [3P] GitHub Copilot certifications summary: https://conductatlas.com/platform/github/github-copilot-business-privacy-statement/
- [3P] OneTrust on Gartner AI Governance MQ 2026: https://onetrust.com/resources/gartner-magic-quadrant-for-ai-governance-platforms-2026-report/
- [3P] GuidePoint, CRA reporting from 11 Sep: https://www.guidepointsecurity.com/blog/eu-cra-reporting-requirements/
- [I] TechTarget, CRA reporting: https://www.techtarget.com/cybersecurity/feature/EU-Cyber-Resilience-Act-reporting-What-CISOs-need-to-know
- [3P] Advisori, CRA September 2026: https://www.advisori.de/en/blog/cra-september-2026-vulnerability-reporting-manufacturers-check

**Autonomy, policy, supply chain**
- [V] AWS Agentic AI Lens, action tiers: https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel02-bp05.html
- [3P] NeuralTrust, HITL statistics: https://neuraltrust.ai/blog/human-in-the-loop-ai-agents
- [3P] HackerNoon, oversight fatigue: https://hackernoon.com/the-oversight-fatigue-problem-why-hitl-breaks-down-at-scale-and-what-comes-after
- [3P] Obsidian, approval graduation: https://www.obsidiansecurity.com/academy/human-in-the-loop-agent-approvals
- [V] ServiceNow change management data sheet: https://www.servicenow.com/es/standard/resource-center/data-sheet/change-management-data-sheet.html
- [3P] eesel, no vendor auto-approves: https://www.eesel.ai/blog/ai-for-change-management-itsm
- [V] Harness governed worker agents: https://harness.io/platform/worker-agents
- [V] Harness, OPA on your own infrastructure: https://www.harness.io/blog/announcing-opa-policy-evaluation-on-your-own-infrastructure
- [I] DevOps.com, Harness extends to AI agents: https://devops.com/harness-extends-devops-reach-to-the-realm-of-ai-agents/
- [I] InfoQ, Cedar joins CNCF: https://www.infoq.com/news/2026/01/cedar-joins-cncf-sandbox
- [V] AWS, AgentCore Policy uses Cedar: https://aws.amazon.com/blogs/security/why-policy-in-amazon-bedrock-agentcore-chose-cedar-for-securing-agentic-workflows/
- [V] Red Hat, provenance for agent identity: https://next.redhat.com/2026/08/07/supply-chain-provenance-for-ai-agent-identity/
- [3P] AIIR receipts: https://pypi.org/project/aiir/
- [3P] Copilot commit signing: https://www.tenki.cloud/blog/copilot-commit-signing-code-review
- [3P] VirtusLab, provenance per change: https://visdom-maturity-matrix.virtuslab.com/guides/delivery/full-provenance-tracking-per-change
- [3P] AI-BOM, CycloneDX and SPDX: https://wavect.io/blog/ai-bill-of-materials-cyclonedx-spdx-2026/
- [I] arXiv, AI-BOM assurance gaps: https://arxiv.org/html/2510.07070v2

**Competitors (2026 updates)**
- [I] Futurum, Atlassian agent surface in Jira: https://futurumgroup.com/insights/atlassian-fuses-the-agent-work-surface-workflow-and-control-plane-into-jira/
- [I] SiliconANGLE, Atlassian Team '26: https://siliconangle.com/2026/05/06/atlassian-opens-teamwork-graph-pushes-rovo-agentic-execution-team-26
- [V] Atlassian, Rovo at Team '26: https://www.atlassian.com/blog/company-news/rovo-team-26
- [I] heise, agents in Jira tickets: https://heise.de/-11287380
- [V] ServiceNow, AI Control Tower Zurich → Australia release notes: https://www.servicenow.com/docs/r/m4LmCVvkm6_8u3nlIuep5Q/Z6zAC~V4gK79HjtioaIEqA
- [I] SD Times, ServiceNow Zurich: https://sdtimes.com/agentic-ai/servicenow-unveils-zurich-ai-platform/
- [I] Help Net Security, GitLab 19.0: https://www.helpnetsecurity.com/2026/05/22/gitlab-19-0-adds-ai-workflows-secrets-management-and-self-hosted-model-support/
- [V] GitLab, AI Catalog governance: https://about.gitlab.com/de-de/blog/ai-catalog-updates-for-governance-and-operations/
- [V] AWS, Kiro FedRAMP High: https://aws.amazon.com/about-aws/whats-new/2026/06/kiro-fedramp-high-dod-il-4-5-govcloud-us/
- [V] AWS GovCloud Kiro guide: https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/govcloud-kiro.html
- [V] AWS Agent Registry GA: https://aws.amazon.com/about-aws/whats-new/2026/08/aws-agent-registry-generally-available

**Pricing**
- [3P] Orb, AI agent pricing trends: https://www.withorb.com/blog/ai-agent-pricing-trends
- [3P] Channel Insider, agentic AI beyond per-seat: https://www.channelinsider.com/ai/agentic-ai-saas-outcome-based-pricing/
- [3P] Copilot AI credits: https://blog.codercops.com/blog/github-copilot-ai-credits-pricing-2026

## Not verified / open
- Exact text of SR 26-2 on the AI exclusion; the FDIC FIL number.
- The GA date of Foundry hosted agents (June vs July 2026).
- Whether GitHub Enterprise bundling still bills AI credits.
- Whether ServiceNow's 2026 "AI Specialist" executes low-risk changes itself, beyond rule-based auto-approval.
- Atlassian Rovo's ISO 42001 status (sources conflict).
- Whether NIST's agent interoperability profile has been published.
- Harness's and Atlassian's Azure DevOps connector depth.
- Whether our SaaS is in scope of the EU CRA.
- Whether an SDLC agent could ever be classed high-risk under the AI Act (my view: no; client systems may be).
