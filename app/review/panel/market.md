# Market analysis: Unified Product Delivery Platform (as of 11 Nov 2026)

Method: about 30 web searches (Nov 2026) and a read of the prototype (/home/user/UI/app/src/v3, PROTOTYPE.md, UX-REVIEW.md). Tags: **[V]** = vendor's own docs or press, **[I]** = independent (regulator, analyst, press, law firm), **[3P]** = third-party blog or aggregator (weaker, figures often conflict), **[?]** = not verified. I did not open vendor pricing pages directly. Treat every price below as indicative.

## 1. Market summary
1. **Coding agents are now an enterprise software category in their own right, and the leaders are model and platform vendors.** Gartner's first Magic Quadrant for Enterprise AI Coding Agents (20 May 2026) names Anthropic, Cursor, GitHub and OpenAI as Leaders, and AWS, Google, Alibaba Cloud and Cognition as Challengers. Gartner sizes the market at about $9.8–11.0B annualised and predicts that by 2027 more than 65% of teams using agentic coding will treat the IDE as optional, "shifting control, governance, and validation to automated platforms" **[I: Gartner]**. That shift toward platforms is the opening for this product.
2. **The fight has moved from which agent is best to who controls the agents.** Examples: GitHub Agent HQ / "mission control" for third-party agents **[V]**, ServiceNow AI Control Tower and Build Agent "governed by default" **[V]**, Harness Agent DLC ("OPA policy, RBAC, approvals, change windows govern agent actions exactly as they govern human ones") **[V]**, GitLab Duo Agent Platform (GA Jan 2026) **[V]**, and Opsera, which calls itself the "control plane for AI-SDLC" **[V]**. Every incumbent now claims governance, so governance alone no longer sets anyone apart.
3. **Regulated buyers allow agents to assist but keep humans accountable.** In the BoE/FCA 2026 survey, 80% of UK financial firms have AI agents in production for decision support, but only 2% deploy agents with broad autonomy. 94% have firmwide AI policies and 84% have central AI/model-risk governance forums **[I]**. Wolters Kluwer's index reports 72% of US banks lack AI "kill switches" and failure reporting **[3P/vendor survey, via American Banker]**. Under DORA, AI-generated change gets no exemption from ICT change-management controls (segregation of duties, records), and BaFin singles out AI-assisted code generation as a risk **[I: law-firm/supervisor commentary]**. The EU AI Act Omnibus provisionally delays high-risk obligations to roughly Dec 2027 or Aug 2028 but does not soften the human-oversight duties **[I, final text not verified]**.
4. **Spec-driven development is now standard practice.** Kiro (requirements → design → tasks, each approved by the developer), GitHub Spec Kit (constitution → specify → plan → tasks → implement; open source, which GitHub calls "an experiment") and Tessl (spec registry, beta) **[V/3P]** all follow it. Buyers will read our plan → spec → ADR stages as current practice, not as something new.
5. **Pricing has moved from seats to seats plus metered usage credits.** Specifics:
   - GitHub Copilot: AI Credits since 1 Jun 2026, Business $19 and Enterprise $39 per user per month with matching credits **[3P]**.
   - GitLab: Credits ($12 or $24 per user per month included) **[V]**.
   - Atlassian Rovo Dev: credits, about 5 credits per LLM request **[3P/community]**.
   - Devin: ACUs; enterprise rate set in the order form **[3P]**.
   - Cursor: Teams $40 per user per month, Enterprise custom **[3P]**.
   - Factory: rate limits plus prepaid credits **[3P]**.
   - Kiro: credit tiers $20–$200 **[3P]**.
   - Linear: AI credits **[V]**.

   Buyers complain about unpredictable spend, so a hard budget with alerts (the prototype has one) is a selling point.

## 2. Competitor matrix

Autonomy scale: L1 = assist in the IDE, L2 = agent does a task and opens a PR, L3 = agent runs multi-step async across the SDLC, L4 = agent ships to production with policy auto-approval.

| Competitor | Target user | Autonomy | Human gates / approvals | Governance & audit | Enterprise integrations (Azure / Jira / ServiceNow) | Pricing model | Notable UX pattern |
|---|---|---|---|---|---|---|---|
| **GitHub Copilot coding agent + Agent HQ** | Developers, platform admins | L2–L3 | Agent pushes only to a `copilot/` branch. Actions runs on its PRs need a write-access user's approval. Branch protection applies; the requester cannot approve the PR (MS Learn) **[V]** | Enterprise AI controls, agent control plane, audit logging, agent/model allow-lists (public preview Oct 2025; GA **[?]**) **[V]** | Azure Boards → Copilot PR is GA, but **needs GitHub repos, not Azure Repos** **[V: MS Learn]**. Jira via 3rd party **[?]**. ServiceNow: none found | Seat plus AI Credits **[3P]** | Assign an issue to @copilot; "mission control" to track a fleet of agents |
| **Devin (Cognition; Windsurf renamed Devin Desktop Jun 2026)** | Engineering teams | L3 | Plan and PR review; approval happens in GitHub. "Approval enforced by default" **[?]** | SSO, RBAC, audit logs, enterprise API; single-tenant VPC option **[V]**. Mercari built extra tooling for permissions and audit **[3P]** | Jira, Linear, Slack, GitHub/GitLab/Bitbucket **[V/3P]**. Azure DevOps **[?]**. ServiceNow: none found | ACUs; enterprise custom **[3P]** | Chat with the agent in Slack/Jira; Playbooks and Knowledge |
| **Cursor (Cloud Agents)** | Developers | L2–L3 | PR review only (no stage gates) | Audit logs (Enterprise only) cover admin events, **not prompts or code**; hooks; SOC 2 Type II, ISO 27001/42001 **[V]** | Linear, Slack, GitHub **[V]**. Azure/Jira/SNOW **[?]** | Teams $40 per user per month plus usage; Enterprise custom **[3P]** | IDE-native; delegate from Linear |
| **Factory (Droids)** | Enterprise engineering | L2–L4 (admin-capped) | Admin sets **maximum autonomy level**, org → project → user hierarchy (users cannot weaken it) **[V]** | Droid Shield (secrets), audit export to SIEM, SOC 2 (Type I or II, sources conflict) **[V]** | Jira, Slack, Linear, GitHub/GitLab **[3P]**. Azure **[?]** | Rate-limit tiers plus credits; enterprise custom **[3P]** | Configurable autonomy dial |
| **OpenAI Codex (cloud)** | Developers, ChatGPT Enterprise | L2–L3 | PR review | RBAC, admin-enforced "requirements", Compliance API audit, retention/residency **[V]** | GitHub (incl. GHES connector **[3P]**), Slack, Linear **[V]** | Bundled in ChatGPT seats plus credits **[?]** | Many parallel cloud tasks; best-of-N diffs |
| **Claude Code** | Developers | L1–L3 | Per-tool permission prompts | Server-managed settings, model restrictions, Compliance API (scope for local sessions disputed) **[3P]** | GitHub Actions, MCP to anything **[V]**. Azure/Jira via MCP | Team/Enterprise seats plus usage **[?]** | Terminal agent; skills/hooks |
| **Google Jules** | Individual developers | L2 | Plan approval before it codes **[3P]** | Thin; Workspace accounts reportedly not yet eligible **[3P]** | GitHub only **[3P]** | Bundled in Google AI Pro/Ultra **[3P]** | Async task queue |
| **AWS Kiro (+ Kiro autonomous agent; Q Developer IDE plugins end of support 30 Apr 2027)** | Developers on AWS | L2–L3 | **Developer approves requirements (EARS), design, tasks**; agent output arrives as PRs **[V/3P]** | IAM Identity Center, SSO, MCP governance, usage analytics **[3P]** | AWS-centric; GitHub. Azure/Jira/SNOW **[?]** | Credit tiers; enterprise via AWS bill **[3P]** | Spec files plus agent "hooks" |
| **GitHub Spec Kit** (open source) | Developers | Method, not an agent | Human checkpoints between phases; a "constitution" sets the gates | None (files in the repo) | Works with Copilot, Claude Code, Gemini CLI **[V]** | Free | Slash-command phases |
| **Atlassian Rovo Dev / Jira + JSM** | Jira teams, ITSM | L2 | JSM can hold a deployment until change approval completes; risk assessment (Premium) **[V]**. Rovo agents **cannot yet act as workflow validators** (open feature request) **[V]** | Atlassian admin/audit **[V]** | Jira native, Bitbucket/GitHub. Azure DevOps partial **[?]**. SNOW n/a | Credits ($20 per user per month with 2,000 credits **[3P]**) | Issue → PR from Jira; Rovo Ops change risk |
| **Linear (Linear Agent, cloud coding agent)** | Product/eng teams | L2 | GitHub review rules still decide what ships **[V]** | Basic | GitHub; delegates to Cursor/Copilot/Codex/Devin **[V]** | Plan plus AI credits **[V]** | **Issue as the hand-off point to any agent**; "Loops" for recurring triage |
| **ServiceNow (DevOps Change Velocity, Build Agent, AI Control Tower)** | IT/Change, platform owners | L2 (Build Agent, on the Now platform) / L4 change auto-approval | **Manual, minimal-automation and advanced-automation change approval flows** that pause Azure DevOps pipelines **[V]** | AI Control Tower (GA) inventories and governs any agent/model; AEMC lifecycle governance **[V]** | **Azure DevOps extension**, GitHub, Jenkins; SNOW native. Jira **[?]** | Platform subscription (not public) **[?]** | Policy auto-approves low-risk changes from pipeline evidence |
| **Harness (Software Delivery Agent, Agent DLC)** | Platform/DevOps | L3–L4 in CD | Approvals, change windows, freezes, OPA policy **[V]** | "Every action attributed, logged, signed"; audit trails on demand **[V, unverified]** | Azure, Jira, ServiceNow approval steps **[V, widely documented]** | Module subscriptions **[?]** | Pipeline studio; policy-as-code |
| **GitLab Duo Agent Platform (Ultimate)** | DevSecOps orgs | L2–L3 | MR approval rules, compliance pipelines **[V]** | Compliance frameworks, audit events, LDAP/SAML **[V]** | Jira integration; Azure/SNOW **[?]** | Seats plus GitLab Credits **[V]** | Agents and flows inside one DevSecOps app |
| *(adjacent)* **Opsera, LinearB, Jellyfish** | Eng leadership | Analytics plus remediation agents | n/a | AI-impact metrics (LinearB: agent PRs wait >5x longer for review **[V]**) | 150+ tools (Opsera) **[V]** | Seat/contract **[?]** | DORA-metric dashboards |
| *(adjacent)* **Credo AI, IBM watsonx.governance + Guardium** | Risk/compliance | n/a | Policy and registry; runtime enforcement limited or on the roadmap **[3P]** | EU AI Act / ISO 42001 mapping **[V/3P]** | GRC tools | Enterprise contract | AI inventory and risk register |

## 3. Differentiation, stated bluntly

**Where we are genuinely different:**
- **Business users make requests in plain language, and named non-engineers approve each gate.** Every coding agent above starts from an issue a developer writes and ends at a PR a developer reviews. None has named Product Owner → Solution Architect → … → Release Manager gates across 8 stages, with a plain-language versus full-technical view of each decision. ServiceNow and Harness gate the deploy, not plan, spec, impact and design.
- **Squads as a governance object.** An approver per stage per work item, with backups, leave cover, gap detection and "Fix squad". I found no equivalent in any competitor. Governance tools assume approvals belong to a role or a repo, not to a named, staffed squad.
- **One evidence chain per change.** Artifacts carry versions, approver, fingerprint and who opened them, plus an audit log with a fingerprint chain and signed export, all tied to the run. Competitors scatter this evidence across Git, the CI system, the ITSM tool and the agent vendor's logs. Cursor explicitly does not log prompts or code.
- **Built-in segregation of duties.** Policies include "requester cannot approve own plan", SoD conflict flags on People, change freezes, escalation SLAs, and a monthly AI budget with warnings. This maps directly to DORA change-management language.

**Where we are behind:**
- **The agent is a black box.** "How the agent did this" is listed as still open in UX-REVIEW.md. Copilot, Devin, Codex and Cursor all show session logs, diffs and best-of-N output, and Factory and Codex expose sandbox and autonomy settings. An approver who cannot see the agent's reasoning, tool calls and diff gives the "click approve" sign-off that auditors call worthless.
- **Autonomy is fixed.** Factory lets admins cap autonomy per org or project. ServiceNow auto-approves low-risk changes from evidence. Our 7 human gates apply to every change, which is unworkable for a one-line config fix. We need risk tiers that collapse gates for low-risk changes.
- **Agents are not interchangeable.** Agent HQ, Linear and Opsera let customers pick Copilot, Claude, Codex or Devin. Our Connections screen shows a single model ("GPT-5.4"). Buyers already hold Copilot or Claude contracts and will ask "can it use ours?"
- **The Azure story stops short.** Microsoft is steering customers from Azure Repos to GitHub for AI features, and Azure Boards → Copilot needs GitHub repos. If we support only Azure Repos, Microsoft's own direction undercuts us. We also show no Jira or GitHub support, and the ServiceNow change ticket is a free-text field (Release.jsx), not a two-way change request like DevOps Change Velocity.
- **No policy-as-code.** Harness (OPA), GitLab compliance pipelines and ServiceNow policies are versioned and testable. Ours are toggles and numbers in a form.
- **No engineering-outcome metrics.** LinearB, Jellyfish and Opsera sell AI-impact and DORA metrics. We show cost and time per run (Evidence.jsx) but no lead time, change failure rate or rework from approvals sent back.
- **Category credibility.** Every named competitor has SOC 2 / ISO, real customers and Gartner coverage. We have a prototype.

## 4. Table-stakes RFP items the prototype does not show
1. Deployment model and data residency: SaaS vs single-tenant VPC vs on-prem, EU region, zero data retention with the model provider (Devin, Codex and Cursor all answer this).
2. Certifications: SOC 2 Type II, ISO 27001, ISO 42001, pen-test report, DORA Article 28/30 contract clauses and register-of-information data for an ICT third party.
3. Model governance: model inventory and versioning, model risk documentation (SR 11-7-style validation), customer-approved model allow-list, BYO model / Azure OpenAI tenancy, prompt and version change control.
4. Agent containment: sandboxed execution, network egress allow-list, secret handling and scanning (cf. Factory Droid Shield), least-privilege repo tokens, prompt-injection defences.
5. A global kill switch and emergency stop across all runs and agents (we have a per-run Pause only), plus incident and failure reporting (the 72% of banks without one, cited above).
6. Supply-chain evidence per release: SAST/SCA/secret scan results, SBOM, signed build provenance (SLSA), licence compliance, all attached to the Release gate.
7. Approval integrity: step-up re-authentication or e-signature at each gate, an approver-competency attestation, and a reason captured on every approve (we require one only on sends back and production release).
8. Audit operations: streaming to SIEM (Splunk/Sentinel), retention schedules and legal hold, immutable/WORM storage, and an auditor read-only API. We have signed export only.
9. Two-way ITSM: create, update and close ServiceNow/JSM change requests and honour CAB decisions, with incident linkage blocking releases.
10. Identity lifecycle: SCIM provisioning and deprovisioning, and custom or application-scoped roles. UX-REVIEW.md lists both as still open; only the SSO/SCIM "source" label is shown.
11. Policy-as-code and risk tiers: per application or data classification, with which gates are mandatory.
12. Multi-repo and cross-work-item dependencies, environment promotion (dev → UAT → prod) with test evidence per environment, and rollback verification.
13. Accessibility conformance report (VPAT). The axe scan is clean, but there is no formal ACR.

## 5. Positioning and demo
**Positioning:** For regulated enterprises that want AI to deliver change without losing control, Unified Product Delivery Platform turns a business request into a released change through eight governed stages. Named, accountable people approve every gate in plain language, and every decision and artifact is sealed into one audit-ready evidence chain. Unlike coding agents that stop at a pull request, or change tools that only gate the deploy, it governs the whole path from intent to production, in Azure DevOps and Teams where your teams already work.

**Lead with these three in the demo:**
1. **Business-to-release in one governed flow.** New request → agent drafts the plan → Priya approves in plain language → design approval with the plain/technical toggle. No competitor puts non-developers in the loop before code exists.
2. **Accountability by name, not by role.** Squads with backups and leave cover, SoD policy ("requester cannot approve own plan"), and the View-only card that says who decides. Then revoke a permission as Dana and show the change take effect at once and appear in the audit log.
3. **Evidence an auditor accepts.** Artifact fingerprints, the audit log with before/after values and the fingerprint chain, signed export, and a production release that requires reason, change ticket and rollback. Frame it with DORA's change-management records requirement and "no exemption for AI-generated change".

Have answers ready for "can it use our Copilot/Claude?", "where does it run?", and "show me what the agent actually did".

## 6. Sources
(V = vendor, I = independent, 3P = third-party blog/aggregator)

**Market and regulation**
- I: Gartner, Enterprise AI coding agents market (May 2026): https://www.gartner.com/en/newsroom/press-releases/2026-05-20-gartner-says-the-market-for-enterprise-ai-coding-agents-is-entering-a-new-phase-of-expansion-and-competitive-realignment
- I: Virtualization Review on the MQ: https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx
- I: Bank of England / FCA, AI in UK financial services 2026: https://www.bankofengland.co.uk/report/2026/artificial-intelligence-in-uk-financial-services-2026
- I: Lewis Silkin summary of the BoE/FCA survey: https://www.lewissilkin.com/insights/2026/10/30/key-lessons-from-the-bank-of-england-and-fcas-2026-survey-102o6yl
- I (reporting a vendor survey): American Banker on Wolters Kluwer: https://www.americanbanker.com/news/72-of-banks-lack-ai-model-kill-switches-failure-reporting
- 3P (Tricentis survey): https://ffnews.com/news/ai-adoption-outpaces-governance-in-financial-services-as-64-of-firms-admit-to-releasing-untested-code
- I: Pinsent Masons, EU AI Act Omnibus: https://www.pinsentmasons.com/out-law/news/rules-high-risk-ai-delayed-under-eu-omnibus-deal
- I: Morrison Foerster, Digital Omnibus: https://www.mofo.com/resources/insights/251201-eu-digital-omnibus
- I: Goodwin, Frontier AI and DORA: https://www.goodwinlaw.com/en/insights/publications/2026/08/alerts-technology-fs-frontier-ai-dora-service-providers-to-eu-financial-entities-take-note
- I: MFSA, DORA ICT change management: https://www.mfsa.mt/?p=62149
- 3P: Red Gate, DORA roundtables: https://www.red-gate.com/blog/dora-in-practice-what-two-roundtables-with-technical-leaders-revealed/

**GitHub and Microsoft**
- V: GitHub Agent HQ: https://github.blog/news-insights/company-news/welcome-home-agents/
- V: GitHub agent control plane changelog: https://github.blog/changelog/2025-10-28-enterprise-ai-controls-the-agent-control-plane-are-in-public-preview/
- I: VentureBeat on Agent HQ: https://venturebeat.com/ai/githubs-agent-hq-aims-to-solve-enterprises-biggest-ai-coding-problem-too
- V: Copilot cloud agent risks and mitigations: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations
- V: MS Learn, Copilot coding agent security: https://learn.microsoft.com/en-us/training/modules/github-copilot-code-agent/2-security-risks-limitations-copilot-code-agent
- I: The New Stack, Copilot usage billing: https://thenewstack.io/github-copilot-usage-billing/
- 3P: Copilot pricing: https://www.activepieces.com/blog/github-copilot-pricing-2026-plans-credits-and-costs.md
- V: Azure Boards + Copilot: https://learn.microsoft.com/en-us/azure/devops/boards/github/work-item-integration-github-copilot
- V: Azure DevOps sprint 268: https://learn.microsoft.com/en-us/azure/devops/release-notes/2026/boards/sprint-268-update
- V: Azure DevOps and GitHub in the AI era: https://devblogs.microsoft.com/devops/azure-devops-and-github-journeying-into-the-ai-era/

**Coding agents**
- V: Devin deployment: https://docs.devin.ai/enterprise/deployment
- V: Devin Review: https://docs.devin.ai/work-with-devin/devin-review
- 3P: Devin/Windsurf radar: https://rubinlake.com/en/technology-radar/developer-ai-and-delivery/devin-windsurf
- 3P: Devin pricing: https://usagebar.com/blog/devin-pricing-and-rate-limits
- V: Cursor compliance and monitoring: https://cursor.com/docs/enterprise/compliance-and-monitoring
- 3P: Cursor pricing: https://dev.to/rahulxsingh/cursor-pricing-in-2026-hobby-pro-pro-ultra-teams-and-enterprise-plans-explained-4b89
- V: Factory compliance, audit and monitoring: https://docs.factory.ai/enterprise/compliance-audit-and-monitoring
- V: Factory LLM safety and agent controls: https://docs.factory.ai/enterprise/llm-safety-and-agent-controls
- 3P: Factory pricing: https://usagepricing.com/blueprint/factory
- V: Codex enterprise admin setup: https://developers.openai.com/codex/enterprise/admin-setup
- V: Running Codex safely: https://openai.com/index/running-codex-safely/
- 3P: Claude Code admin controls: https://www.eesel.ai/en/blog/admin-controls-claude-code
- 3P: Jules pricing: https://www.activepieces.com/blog/google-jules-pricing-free-pro-and-ultra-plans-2026
- V: Amazon frontier agents and Kiro: https://press.aboutamazon.com/2025/12/aws-unveils-frontier-agents-a-new-class-of-ai-agents-that-work-as-an-extension-of-your-software-development-team
- V: Q Developer IDE end of support: https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-developer-ide-end-of-support.html
- 3P: Kiro pricing: https://usagebar.com/blog/kiro-pricing-and-rate-limits

**Spec-driven tools**
- V: Microsoft, Spec Kit: https://developer.microsoft.com/blog/spec-driven-development-spec-kit/
- I: DevOps.com on Spec Kit: https://devops.com/githubs-spec-kit-puts-the-spec-back-in-software-development/
- V: Tessl framework and registry: https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry/
- 3P: Tessl review: https://codemyspec.com/blog/tessl-review

**Atlassian and Linear**
- V: Rovo Dev licensing: https://www.atlassian.com/licensing/rovo-dev
- 3P (community): Rovo credits: https://community.atlassian.com/forums/Rovo-questions/How-can-I-find-out-how-much-Rovo-will-cost-from-the-1st-March/qaq-p/3187868
- V: Jira feature request, AI validators: https://jira.atlassian.com/browse/JRACLOUD-98947
- V: Service management for engineering: https://www.atlassian.com/collections/service/guides/service-management-engineering
- V: Linear cloud coding agent: https://linear.app/docs/linear-cloud-coding-agent
- V: Linear agents: https://linear.app/agents

**Delivery governance platforms**
- V: ServiceNow DevOps Change Velocity: https://www.servicenow.com/uk/products/devops-change-velocity.html
- V: ServiceNow + Azure DevOps (community): https://www.servicenow.com/community/devops-articles/devops-change-velocity-servicenow-amp-azure-devops-integration/ta-p/2982679
- V: ServiceNow Build Agent: https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-Build-Agent-now-works-inside-every-major-AI-coding-tool-governed-by-default
- V: ServiceNow AI Control Tower: https://newsroom.servicenow.com/press-releases/details/2025/ServiceNow-Launches-AI-Control-Tower-a-Centralized-Command-Center-to-Govern-Manage-Secure-and-Realize-Value-From-Any-AI-Agent-Model-and-Workflow/
- V: Harness Software Delivery Agent: https://www.harness.io/products/software-delivery-agent
- I (reporting Harness launch): The New Stack, Harness Agent DLC: https://thenewstack.io/harness-ai-agent-dlc
- V: GitLab Duo Agent Platform GA: https://about.gitlab.com/press/releases/2026-01-15-gitlab-announces-duo-agent-platform-general-availability/
- I (reporting vendor releases): SD Times on Opsera: https://sdtimes.com/ai/opsera-unveils-appsec-ai-agents-to-power-the-shift-from-traditional-sdlc-to-ai-sdlc/
- V: LinearB AI analytics: https://linearb.io/blog/ai-analytics-measure-ai-impact
- V: Jellyfish vs LinearB: https://jellyfish.co/?p=32786

**AI governance**
- 3P: Arthur, AI governance platforms 2026: https://www.arthur.ai/column/best-ai-governance-platforms-2026
- 3P: Expert Insights, agentic AI governance: https://expertinsights.com/ai-security/best-agentic-ai-governance-solutions

## Not verified
- GA status of GitHub Agent HQ / mission control.
- ServiceNow integrations for Devin, Cursor, Codex and Kiro.
- Exact enterprise prices for any vendor.
- Whether Factory's SOC 2 is Type I or Type II.
- Final EU AI Act Omnibus dates.
- Claude Code Compliance API scope.
- Harness's "signed" audit claim.
