# Three ways to run AI-assisted delivery, compared persona by persona (12 Nov 2026)

> **Update, 13 Nov 2026.** The Spec Kit facts in this file are partly out of date. Spec Kit 1.4.0 has workflow review gates, a converge step, and community add-ons for multi-repo and Azure DevOps. See `review/report/spec-kit-vs-platform.html` (PDF alongside), which was checked against the source code.

**Approaches**
- **A. Our platform**: the Unified Product Delivery Platform prototype (browser console, 8 gated stages, named approvers, Azure SQL + Blob record, standalone Developer Agent in VS Code).
- **B. Spec-driven development in the repo**: GitHub Spec Kit and AWS Kiro, on top of the team's normal boards, repos and pipelines.
- **C. Code-based / IDE-only**: VS Code with an AI coding agent (Copilot agent mode, Claude Code, Cursor, Cline) plus Azure DevOps or GitHub. No spec framework and no governing platform.

**Evidence tags**
- **[V]** read directly this session: our code and project documents, or the primary page (github.com/github/spec-kit).
- **[I]** official vendor post or reputable press, seen through search excerpts rather than a direct fetch.
- **[3P]** third-party blog, vendor-funded data or a secondary summary.
- **[?]** not verified, or unknown.
- **Assessment** marks my own judgement. Every score in this report is an assessment.

**Method**
- A: read `PROTOTYPE.md`, `review/panel/STATUS.md`, `VERDICT.md`, `personas.md`, `market-agentic-sdlc.md`, `future-readiness.md`, and `src/v3` (`store.jsx`, `docs.jsx`, `agentpanel.jsx`, `Run.jsx`, `Approve.jsx`, `Clarify.jsx`, `Release.jsx`, `Admin.jsx`, `Audit.jsx`, `gate.jsx`, `ui.jsx`, `Review.jsx`). No project file was changed.
- B and C: one direct fetch of the Spec Kit README and ten web searches on 12 Nov 2026.
- Not reachable from this session: `blog.scottlogic.com` (host not on the network allowlist). Its findings are quoted from secondary summaries and tagged [3P]. Earlier rounds could not reach kiro.dev, martinfowler.com or infoq.com either [V: market-agentic-sdlc.md].

**The most important caveat.** A is a clickable prototype. Its data is mocked, state lives in the browser's `sessionStorage`, and no integration with Azure DevOps, Teams or ServiceNow is built [V: store.jsx, future-readiness.md]. B and C are shipping products in daily use. A is scored on **what the prototype shows as designed**. In production today A scores 0 on everything, because it is not deployed.

---

## 1. Summary

| Persona | A. Our platform | B. Spec-driven in repo | C. IDE-only | Best fit today |
|---|---|---|---|---|
| Business requester / Product Owner | **11** | 5 | 4 | A |
| Solution Architect | **10** | 9 | 7 | A, narrowly |
| Developer / Engineering Lead | 7 | **11** | 9 | B |
| Integration Lead | 5 | 7 | **8** | C |
| Quality Lead / tester | **7** | **7** | 5 | A and B tie |
| Release Manager | **11** | 7 | 7 | A |
| Platform Admin | **9** | 5 | 7 | A |
| Auditor / risk and compliance | **9** | 4 | 2 | A |
| Executive sponsor | **5** | 1 | 4 | None is good |
| **Total out of 108** | **74** | **56** | **53** | |

Scores are out of 12 per persona: four criteria, 0 to 3 each.

**What the table says (assessment)**
1. A wins for every role that is **not** a developer and that has a gate screen today: Product Owner, Architect, Release Manager, Auditor, Admin.
2. B and C win for the people who write and ship code. A developer on A loses 4 points against B, almost all of it on "stays in their natural tool".
3. A's two lowest non-executive scores come from a prototype gap, not from the design. The Integration Lead and the Quality Lead have a role and a permission, but no screen on which to approve [V: Run.jsx, ui.jsx].
4. Nobody serves the executive sponsor. A has the data to do it and no view.
5. A's lead is on evidence (2.67 of 3 against 1.67 and 1.33) and on understanding what the AI did (2.11 against 1.44 and 0.89). C leads on "natural tool" (2.11 against 1.78), and B is close behind A there (1.67).

---

## 2. What exists today in each approach

### A. Our platform (prototype)
- **19 screens**, with "View as" for six people: Solution Architect, Product Owner, Release Manager, Engineering Lead, Auditor, Platform Admin [V: ui.jsx]. Integration Lead, Quality Lead and an executive cannot be chosen.
- **8 stages**: Plan, Specify, Impact, Design, Build, Integrate, Validate, Release. Fixed approver per stage; Impact has no human approver [V: store.jsx `STAGE_APPROVER`].
- **9 roles against 17 permissions**, editable, audited, with undo [V: store.jsx, PROTOTYPE.md].
- **Working gate screens**: plan (run page), clarifying questions, design (ADR with plain and full technical views, an "accepted gap" tick box), build review (diffs, 5 automatic checks), release (4-point readiness list, release notes, window, change ticket, mandatory reason outside a window, scheduled state, cancel, rollback confirmed by a second Release Manager) [V: Run.jsx, Approve.jsx, Review.jsx, Release.jsx, STATUS.md].
- **No gate screen for Integrate or Validate.** A waiting run with no dedicated screen only offers "Approve plan", and to anyone else says "Your role cannot approve plans" [V: Run.jsx `StatusCard`].
- **"How the agent did this"** on every gate: confidence, open questions, sources, checks, steps, model, time, cost, self-corrections, and a box to ask the agent. The content is static, it has no data for the Impact or Integrate stages (they fall back to the Design data), and the model is the literal string `GPT-5.4` [V: agentpanel.jsx].
- **Documents open in place** with a Markdown tab, download, Azure Blob path, Azure SQL record, SHA-256 fingerprint, and Azure Boards and Repos links [V: docs.jsx].
- **Developer Agent**: "Copy Developer prompt", paste into the agent in VS Code. The platform shows connection, branch, Boards task, pull request and completion report. An MCP hand-off is proposed, not built [V: docs.jsx, STATUS.md item 3].
- **Audit log** with filters, a "Chain verified" hash chain and CSV export; audit pack JSON; governance dashboard with attention cards, KPIs and "where work waits" [V: Audit.jsx, Admin.jsx].
- **Open by its own account**: risk tiers and a fast path, model admin, policy as code, tracing, agent identity and a global stop, immutable evidence, ServiceNow and Jira connectors, an insights dashboard, an onboarding wizard, certifications [V: STATUS.md].

### B. Spec Kit and Kiro
- **Spec Kit** is MIT-licensed, 149.4k stars. It needs Python 3.11+, `uv` and a supported AI coding agent [V: README].
- Flow: `/speckit-constitution` (once), `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`, `/speckit-converge` until "Converged". The README says to run each skill in the agent's chat, one at a time, reviewing each result [V].
- Extension model: integrations, extensions, presets, workflows, workflow steps, and bundles. Presets "enforce organizational or regulatory standards". Catalog listings "are not audits or endorsements" [V].
- Version 1.0.0 is reported for 21 Aug 2026 and 1.0.11 for 24 Sep 2026 [3P; history page read in the earlier round, V: market-agentic-sdlc.md]. Supported agents: "30+" in the README per search, 35 to 50+ in later guides [3P]. Community extensions: 105 with 22 presets in May, 138 with 25 in August [3P].
- **Kiro**: `requirements.md` (EARS) or `bugfix.md`, then `design.md`, then `tasks.md` under `.kiro/specs/<feature>/`; the developer approves each phase; steering files and hooks [V/3P via market-agentic-sdlc.md]. Generally available since 17 Nov 2025 with a CLI and IAM Identity Center for teams [I]. Supervised mode shows each diff for accept or reject; Autopilot applies changes without review [3P]. Pricing is credit-based and drew a public backlash in Aug 2025 [I: The Register]. Reviewers report bugs and inconsistent behaviour alongside real gains in "the agent wrote the wrong thing" [3P].
- **Approval** in both is implicit: the developer runs the next command or clicks to continue. The only formal approval is the pull request [V: market-agentic-sdlc.md §2.2].

### C. IDE-only
- **VS Code agent mode** with custom agents (`.agent.md`, hand-off buttons) and an agent sessions view since 1.106 [I]. Agent plugins bundle slash commands, skills, custom agents, hooks and MCP servers since 1.110 [I].
- **Enterprise policy**: managed settings override user settings; admins can disable agent mode and allowlist MCP servers through an organisation registry; enterprise-managed plugins in public preview since 5 Jun 2026 [I/3P].
- **Azure DevOps Remote MCP Server**: generally available 5 Aug 2026, Entra sign-in, exposes work items, pull requests, repos and pipelines. Claude Code, Cursor and similar clients still need the local server [I: Microsoft DevOps blog, InfoQ].
- **Copilot code review for Azure Repos**: technical preview 2 Jun 2026, public preview 26 Aug 2026, billed through the Azure subscription. It always leaves a comment review, never approves or requests changes, and does not satisfy required-reviewer policies [I].
- **Copilot cloud coding agent** from an Azure Boards work item needs the code in GitHub, not Azure Repos. No 2026 announcement changes that [I].
- **Azure Repos branch policy** can require reviewers and "prohibit the most recent pusher from approving their own changes" [I: Microsoft Learn].

---

## 3. Persona by persona

Criteria: **(1)** does the job without leaving their natural tool; **(2)** understands what the AI did; **(3)** control: approve, stop, send back; **(4)** evidence kept automatically. Scale 0 = absent, 1 = weak, 2 = solid, 3 = best in class. All scores are assessments.

### 3.1 Business requester / Product Owner

| | A. Our platform | B. Spec-driven in repo | C. IDE-only |
|---|---|---|---|
| Where they work | Browser console only: New request, Home, run page, Clarify [V] | Boards or Jira for the request; the spec is markdown in a repo branch or pull request | Boards or Jira only |
| Must know | Plain language | How to find a branch or pull request, read rendered markdown, comment on a PR. Install is `uv` and a terminal [V] | The board. Nothing about the AI |
| Main job on one change | Write request, approve plan, answer questions, approve spec, hear it is live: about 5 actions, **0 tool switches** | Write ticket, explain it to a developer, read `spec.md` in the PR if invited, UAT: about 4 actions, **2 switches** (board, repo web view) | Write ticket, explain it, UAT: 3 actions, **1 switch** (board, chat or meeting) |
| Sees of the AI | Plain summary, "What changes / What does not / If you approve", sources, open questions, confidence [V] | A behaviour-focused spec that reads like a product document [3P], but long | Nothing until a demo. Possibly a PR description |
| Approve / reject | Approve plan, Send back, Pause run [V]. Send back takes no note; she cannot edit the plan [V: store.jsx, personas.md] | A PR comment, if she has repo access. The developer decides when to move on | Moves the card, or rejects at UAT |
| Evidence | Request, plan and spec versions, her approval, fingerprint, audit entry [V] | Git history of the spec. Her agreement is a comment at best | Work item history |
| Missing or painful | Her own plan is routed to a second approver; no "what changed for users" after release; intake preview is static [V: personas.md] | "Non-technical people rarely comment on markdown in a Git repo" [3P]. Critics warn of "turning business analysts into Markdown reviewers" [3P] | Intent is retold by word of mouth. No record of what was agreed |

| Criterion | A | B | C |
|---|---|---|---|
| 1 Natural tool | **3**: browser and plain language from start to finish | **1**: the thing she must review sits in a repo | **2**: stays in the board, but there is nothing in it to review |
| 2 Understands the AI | **3**: plain summary, sources and open questions on each gate | **2**: the spec is readable but long and outside her tool | **0**: no artifact she can read before code exists |
| 3 Control | **2**: approve, send back, pause; no note on send-back, no plan edit | **1**: comment only, no gate of her own | **1**: accept or reject at the end |
| 4 Evidence | **3**: every version and decision stored without effort | **1**: spec history yes, her approval no | **1**: work item history only |
| **Total** | **11** | **5** | **4** |

### 3.2 Solution Architect

| | A | B | C |
|---|---|---|---|
| Where they work | Browser: Approvals queue, design approval page, evidence page [V] | Repo and IDE: `constitution.md`, `plan.md`, Kiro `design.md` and steering files | Pull request, `AGENTS.md` or custom instruction files, wiki for ADRs |
| Must know | Reading an ADR; nothing new | Git, markdown, the slash commands or Kiro phases | Git, PR review, how to write agent instructions |
| Main job on one change | Open queue item, read plain or full view, open agent panel, tick the accepted gap, approve: 4 to 5 clicks, **0 switches** [V: personas.md] | Pull the branch or open the PR, read `plan.md` and research notes, edit or comment, approve PR: **2 switches** (IDE, repo web) | Review the diff after the code is written; write an ADR by hand if policy needs one: **2 to 3 switches** |
| Sees of the AI | Numbered sources, options considered, "the gap you are accepting", 3 platform checks, self-corrections [V] | The plan and its reasoning as files. The agent conversation that produced them is not kept | The diff and the PR description. Plan-mode output lives in one developer's chat |
| Approve / reject | Approve design or Request changes with a note; ask the agent a question [V] | Edit the file directly (stronger than a note), or vote on the PR. No design gate before code unless the team adds one | PR vote, required reviewer by branch policy [I] |
| Evidence | ADR version, approver, fingerprint, audit entry [V] | Git history of the plan beside the code; PR vote | PR thread |
| Missing or painful | No inline comments on the ADR, no "compare with v1" after a send-back, cannot edit the design himself [V: personas.md] | Plans are verbose; architecture rules in a constitution are guidance to the agent, not an enforced check (assessment) | Design is reviewed after it has been built. No design record |

| Criterion | A | B | C |
|---|---|---|---|
| 1 Natural tool | **2**: one browser page, but no code or diagram tools and no inline comments | **3**: design lives as files in the repo he already uses | **3**: PR and repo |
| 2 Understands the AI | **3**: sources, options, accepted gap, self-corrections on the gate | **2**: reasoning is on file, the session is not | **1**: sees output, not reasoning |
| 3 Control | **2**: approve and send back before code exists; cannot edit or annotate | **2**: can rewrite the plan, but nothing forces a design decision before build | **2**: can block the PR, only after the fact |
| 4 Evidence | **3**: design approval bound to a version and a named person | **2**: plan history and PR vote, not bound to each other | **1**: PR thread only |
| **Total** | **10** | **9** | **7** |

### 3.3 Developer / Engineering Lead

| | A | B | C |
|---|---|---|---|
| Where they work | Browser for the assignment and the build review; VS Code for the work; Azure Repos for the real PR [V: docs.jsx] | VS Code or Kiro, terminal, repo | VS Code, terminal, repo |
| Must know | The console, plus everything in C | Git, markdown, `uv` and the Specify CLI, 6 slash commands [V] | Git and their agent |
| Main job on one change | Open run, copy prompt, paste in VS Code, supervise the agent, PR, return to the console for the completion report, lead approves build: **3 switches** (console, IDE, console; plus Repos for the PR) | specify, clarify, plan, tasks, implement, converge, PR: 6 commands, **1 switch** (IDE to PR) | Prompt, iterate, PR: **1 switch** |
| Sees of the AI | Their own agent session in the IDE, plus the completion report and 5 checks in the console [V: Review.jsx] | Spec, plan and tasks in the workspace, tasks ticked as done, the full agent session | The agent session, diffs, checkpoints |
| Approve / reject | Approve build or Request changes. Reject works with an empty comment; no line comments; the PR link points back to the console page [V: personas.md] | Full: edit any file, stop the agent, rerun a phase | Full |
| Evidence | Assignment, branch, Boards task, PR and completion report tracked as designed [V]. The copy-paste step itself is untracked [V: future-readiness.md] | Specs, tasks and commits in git, automatically | Commits and the PR. Agent sessions are not kept by default (assessment) |
| Missing or painful | Copy-paste hand-off; no "take over from the agent and hand back"; the approved spec is invisible to the IDE agent unless pasted [V: market-agentic-sdlc.md] | Verbose markdown; long agent runs; specs drift after implementation and are reconciled by hand [V/3P]; overkill for small fixes [3P] | Intent is lost after the chat closes; quality depends on the individual; review load moves to the lead |

Said plainly for engineers: **B and C are better for this persona.** They are free or already licensed, in the repo, work with 30+ agents, and take a change from idea to pull request in minutes. A adds a browser round trip and cannot match that inner loop.

| Criterion | A | B | C |
|---|---|---|---|
| 1 Natural tool | **1**: two extra surfaces and a copy-paste to start | **3**: everything in the IDE and repo | **3**: everything in the IDE and repo |
| 2 Understands the AI | **2**: completion report and checks; the approved context does not reach the IDE on its own | **3**: intent, plan, tasks and session all visible | **2**: session and diff, no lasting statement of intent |
| 3 Control | **2**: approve or send back; no line comments, no take-over path | **3**: full control of every phase | **3**: full control |
| 4 Evidence | **2**: tracked as designed, with an untracked first step | **2**: spec trail in git, no approvals | **1**: commits and PR only |
| **Total** | **7** | **11** | **9** |

### 3.4 Integration Lead

| | A | B | C |
|---|---|---|---|
| Where they work | Meant to be the console. Today: the Integration evidence document only [V: docs.jsx] | Azure Pipelines and PR checks; a spec per repo | Azure Pipelines and PR checks |
| Must know | The console | Pipelines, YAML, where each repo keeps its spec | Pipelines, YAML |
| Main job on one change | Open the run, read the pipeline table (CI, staging deploy, contract tests), approve. **The approve step has no screen** [V: Run.jsx] | Watch the pipeline, approve an environment check: **0 to 1 switch** | The same: **0 switches** |
| Sees of the AI | A pipeline results table. The agent panel has no Integrate data and shows the Design stage's content instead [V: agentpanel.jsx] | Contracts in `plan.md` if the developer generated them; one repo at a time [3P] | Whatever the PR description says |
| Approve / reject | The `gate.integrate` permission exists; no button uses it [V] | Pipeline environment approvals and checks, branch policies | The same |
| Evidence | Integration evidence document with fingerprint [V] | Pipeline run logs and approval records in Azure DevOps | The same |
| Missing or painful | No gate screen, not in "View as", no link to the real pipeline run | Multi-repo works via community extensions (central spec repo, branch sync); no cross-repo impact view or per-repo approval evidence [3P excerpts] | No cross-repo impact view; finds breaking changes when the pipeline fails |

| Criterion | A | B | C |
|---|---|---|---|
| 1 Natural tool | **1**: a second tool that cannot yet do his job | **2**: Pipelines, plus specs scattered per repo | **3**: Pipelines only |
| 2 Understands the AI | **1**: results table only; the panel shows the wrong stage | **1**: per-repo plan at best | **1**: PR description at best |
| 3 Control | **1**: permission without a control | **2**: native pipeline approvals and checks | **2**: the same |
| 4 Evidence | **2**: evidence document stored and fingerprinted | **2**: pipeline logs and approvals | **2**: the same |
| **Total** | **5** | **7** | **8** |

The design intent for A is stronger than this score: the Impact stage names affected components and repositories, and one record spans repos [V: docs.jsx]. A generic gate screen would lift A to about 9 (assessment).

### 3.5 Quality Lead / tester

| | A | B | C |
|---|---|---|---|
| Where they work | Console: tester handoff, validation report, failed-validation card [V] | Repo for the acceptance criteria; Pipelines or Test Plans for results | Board for acceptance criteria; Pipelines or Test Plans |
| Must know | The console | Where the spec is; markdown | The board and test tools |
| Main job on one change | Read the tester handoff (what to test; data 1, 309, 310, 311, 999), read the validation report, approve. **The approve step has no screen** [V] | Read criteria in `spec.md`, run or read tests, sign off on the work item: **2 switches** | Read the ticket, test, sign off: **1 to 2 switches** |
| Sees of the AI | Validation panel: "212 of 214 pass", and the agent's view that the tests are out of date, not the code [V: agentpanel.jsx] | Explicit criteria and tasks; `converge` reports when implementation matches [V] | AI-written tests of unknown intent |
| Approve / reject | `gate.validate` exists, no button. "Update the tests and re-run" is offered to others [V: Run.jsx] | No validate gate. Blocks through PR review or the test plan | The same |
| Evidence | Validation report, criteria, fingerprint [V] | Criteria in git plus test runs in the pipeline | Test runs |
| Missing or painful | No gate screen, not in "View as", no criterion-to-test trace view | Criterion-to-test traceability needs community extensions [3P] | No stated criteria beyond the ticket; the AI wrote both code and tests |

| Criterion | A | B | C |
|---|---|---|---|
| 1 Natural tool | **1**: a second tool that cannot yet take her decision | **2**: criteria in the repo, results in her test tools | **2**: board and test tools |
| 2 Understands the AI | **2**: explains failures and what the agent is unsure about | **2**: testable criteria and a convergence check | **1**: ticket text only |
| 3 Control | **1**: permission without a control | **1**: no gate of her own | **1**: no gate of her own |
| 4 Evidence | **3**: validation report and handoff stored with fingerprint | **2**: criteria and test runs, not linked | **1**: test runs only |
| **Total** | **7** | **7** | **5** |

### 3.6 Release Manager

| | A | B | C |
|---|---|---|---|
| Where they work | Console: Release page and run page [V] | Azure Pipelines environments, ServiceNow | Azure Pipelines environments, ServiceNow |
| Must know | The console | Pipelines; where specs are, if he wants context | Pipelines |
| Main job on one change | One click from Home; check the 4-point readiness list, edit notes, pick a window, enter the change ticket, release or schedule: **1 switch** (to ServiceNow for the ticket number) | Gather readiness from PR, test run and ticket; approve the environment; update ServiceNow: **3 switches** | The same: **3 switches** |
| Sees of the AI | Release notes, rollback plan and deployment checklist drafted by the agent, with checks and sources; the whole chain one click away [V] | Nothing release-shaped. Spec Kit ends at implementation [V: market-agentic-sdlc.md] | Linked commits and work items; nothing says which were AI-made |
| Approve / reject | Release, schedule, cancel schedule, hold with a required reason, roll back with a second Release Manager [V: STATUS.md] | Environment approval or rejection in Pipelines | The same |
| Evidence | Release record, reason, window, ticket, approver, fingerprint [V] | Pipeline approval and deployment history | The same |
| Missing or painful | No release calendar or freeze view; the ServiceNow ticket is typed text, not a live link [V: personas.md, STATUS.md item 8] | Readiness is assembled by hand from three tools | The same |

| Criterion | A | B | C |
|---|---|---|---|
| 1 Natural tool | **2**: one page for the decision, but ServiceNow and the calendar are elsewhere | **2**: Pipelines is native; readiness is gathered by hand | **2**: the same |
| 2 Understands the AI | **3**: readiness, notes and rollback plan with their sources | **1**: can read a spec if he goes looking | **1**: linked items only |
| 3 Control | **3**: release, schedule, hold, cancel, roll back, each with a reason | **2**: approve or reject a deployment | **2**: the same |
| 4 Evidence | **3**: one release record tied to the full chain | **2**: deployment and approval history | **2**: the same |
| **Total** | **11** | **7** | **7** |

### 3.7 Platform Admin

| | A | B | C |
|---|---|---|---|
| Where they work | Console: Governance, Squads, People, Roles, Policies, Connections, Audit [V] | Repo templates, private catalogs, the CLI; Azure DevOps admin; for Kiro, IAM Identity Center [I] | VS Code policy through device management, the GitHub or Copilot admin console, Azure DevOps organisation settings |
| Must know | The console | Git, CLI, how presets and extensions work | Device policy, Entra, Azure DevOps administration |
| Main job (keep delivery staffed and within policy) | Attention card, one click to reassign, complete a squad, edit a permission: **0 switches** | Maintain presets and catalogs per repo; branch policies per repo: **3 or more switches** | Set policies once in 2 to 3 consoles: **2 to 3 switches** |
| Sees of the AI | Per-run panels, "agent stopped" alerts, cost per run. No fleet view, model registry or trace [V: STATUS.md] | No central view. Kiro reports usage and credits [I/3P] | Usage metrics; agent sessions are per developer [I] |
| Approve / stop | Pause a run, reassign, edit roles, toggle separation of duties. No global agent stop; policies are toggles [V] | Approved-component catalogs and presets; Kiro model and MCP governance [V/I] | Disable agent mode, allowlist MCP servers, branch policies [I/3P] |
| Evidence | Every admin action audited, with undo [V] | Git history; the Azure DevOps audit log | Azure DevOps and GitHub audit logs |
| Missing or painful | Cannot onboard an application (three are hard-coded); no model admin; no global stop [V: personas.md, STATUS.md] | Governance is configuration copied into each repo; community extensions are not audited [V] | Controls exist but span several consoles; nothing ties a policy to a change |

| Criterion | A | B | C |
|---|---|---|---|
| 1 Natural tool | **2**: one console, but no onboarding or model settings | **1**: scattered across repos and a CLI | **2**: mature, but several consoles |
| 2 Understands the AI | **2**: per-run view and alerts, no fleet view | **1**: no central view | **1**: usage numbers, not actions |
| 3 Control | **2**: pause, reassign, roles; no global stop | **2**: catalogs, presets, model and MCP policy | **2**: switch agent mode off, allowlist servers |
| 4 Evidence | **3**: every admin action recorded automatically | **1**: git and scattered logs | **2**: organisation audit logs |
| **Total** | **9** | **5** | **7** |

### 3.8 Auditor / risk and compliance

| | A | B | C |
|---|---|---|---|
| Where they work | Console, read-only: Audit log, Artifacts [V] | Repo web view, PR history, pipeline history | PR history, pipeline history, audit log export |
| Must know | The console | How to read git history and pull requests | The same |
| Main job (prove one change was approved by the right people against the right version) | Filter the audit log by work item, open each artifact with version, approver and fingerprint, export CSV or the JSON pack: **0 switches** | Find the branch, read commits to the spec files, match them to a PR vote, then to a deployment: **3 switches**, with a developer's help | PR, then pipeline, then work item: **3 switches** |
| Sees of the AI | Per gate: sources, checks, self-corrections, model, cost [V]. The model, version and prompt are not stamped on each artifact [V: STATUS.md item 2] | What was intended (spec, plan, tasks). Not which model, prompt or session produced it | That an AI was involved, only if a commit trailer or PR label says so |
| Control | Read and export. Cannot raise a finding or request evidence in the tool | None | None |
| Evidence | Automatic and fingerprinted, with a hash-chained log and a record of who opened what [V] | Git history is automatic. The author usually approves their own spec [V: market-agentic-sdlc.md]; history can be rewritten without branch rules | PR approvals and deployment logs. A branch policy can stop self-approval [I]; whether an AI counts as one party in separation of duties is unsettled [3P] |
| Missing or painful | Not write-once, no signed attestations, no sampling or exceptions views, no per-change evidence pack [V: STATUS.md item 7, personas.md] | Evidence must be assembled by hand; specs drift from code [V/3P] | No record of intent or design. 61% of agent PRs reportedly get no review [I via 3P] |

| Criterion | A | B | C |
|---|---|---|---|
| 1 Natural tool | **3**: a read-only audit view with filters and export | **1**: must read git and PR history | **1**: must join three tools by hand |
| 2 Understands the AI | **2**: per-gate account of what the agent did; model and prompt not yet stamped | **1**: intent on file, provenance absent | **0**: nothing recorded about the AI |
| 3 Control | **1**: read and export only | **0**: none | **0**: none |
| 4 Evidence | **3**: automatic, versioned, fingerprinted, attributed | **2**: automatic history, weak on who approved what | **1**: approvals and logs, no intent |
| **Total** | **9** | **4** | **2** |

### 3.9 Executive sponsor

| | A | B | C |
|---|---|---|---|
| Where they work | No view of their own. The admin dashboard has weekly KPIs and "where work waits" [V: Admin.jsx] | Nothing | Copilot usage dashboards; Azure DevOps Analytics or Power BI |
| Must know | Would need admin access | Not applicable | Existing reports |
| Main job (is AI delivery faster, safe, worth the money) | Ask the admin for a screenshot or an audit pack | Ask engineering | Open a usage report; ask engineering what it means |
| Sees of the AI | Cost and time per run, one run at a time | Nothing | Adoption figures: seats, acceptance rates |
| Control | Through the admin's policies | None | Licence and policy on or off |
| Evidence | All the raw data needed for lead time, waiting and cost per change is recorded [V] | Git only | Usage and deployment data in separate systems |
| Missing or painful | No portfolio, value or trend view; not in "View as" [V: personas.md, STATUS.md item 9] | Everything | Activity, not outcomes |

| Criterion | A | B | C |
|---|---|---|---|
| 1 Natural tool | **1**: only by borrowing the admin dashboard | **0**: nothing for this role | **1**: existing usage reports |
| 2 Understands the AI | **1**: per-run numbers, no roll-up | **0**: nothing | **1**: adoption, not results |
| 3 Control | **1**: indirect, through policy | **0**: none | **1**: licence and policy switch |
| 4 Evidence | **2**: the data is captured, not yet reported | **1**: git history | **1**: scattered usage data |
| **Total** | **5** | **1** | **4** |

---

## 4. One change, end to end: "Registered Amortization limit"

The request: on the Product Selection page of the Full Application flow, block Registered Amortization values above 310 and tell the advisor why. This is WI-4821 in the prototype [V: store.jsx, NewRequest.jsx]. It is a one-field validation: 4 files, about 100 lines, 3 to 6 unit tests [V: docs.jsx, Approve.jsx].

### A. Our platform (as the prototype shows it)

| # | Who | Tool | What happens | Hand-off or wait |
|---|---|---|---|---|
| 1 | Priya (Product Owner) | Console | Writes the request in plain language, picks the application, "Draft the plan" | To the agent |
| 2 | Agent | Platform | Drafts the plan: 1 objective, 2 stories | To a person |
| 3 | Second approver | Console | Approves the plan. Priya requested it, so separation of duties routes it away from her (to Dana in the prototype) [V: store.jsx `finishPlan`] | **Wait 1** |
| 4 | Agent | Platform | Writes the specification for story 1 (8 acceptance criteria); sends any business questions to Priya | To a person |
| 5 | Priya | Console | Answers questions, approves the specification | **Wait 2** |
| 6 | Agent | Platform | Impact assessment (no human approver), then ADR-0173 with developer and tester handoffs. Design took 13 min 48 s in the demo data [V] | To a person |
| 7 | Alex (Architect) | Console | Reads the plain or full view, opens "How the agent did this", ticks the accepted gap (the Pricing API still accepts any value), approves | **Wait 3** (shown as 1 day in the demo data) |
| 8 | Developer | Console, then VS Code | Opens the Build card, copies the Developer prompt, pastes it into the agent | **Wait 4**, plus a manual tool switch |
| 9 | Developer Agent | VS Code, Azure Repos, Azure Boards | Branch, Boards task, code and tests, pull request, completion report back to the platform | To a person |
| 10 | Jon (Engineering Lead; Alex as backup) | Console | Reviews the completion report, diffs and 5 checks; approves the build | **Wait 5** |
| 11 | Pipelines | Azure Pipelines | CI, staging deploy and contract tests on the merge commit | To a person |
| 12 | Tom (Integration Lead) | Console | Approves integration. No screen exists for this yet [V] | **Wait 6** |
| 13 | Agent | Platform | Runs the regression suite and the acceptance criteria, writes the validation report | To a person |
| 14 | Mara (Quality Lead) | Console | Approves validation. No screen exists for this yet [V] | **Wait 7** |
| 15 | Sam (Release Manager) | Console, ServiceNow | Checks readiness, picks a window, enters the change ticket, releases | **Wait 8** |
| 16 | Platform | Pipelines | Deploys, runs health checks, completes the release record, notifies Priya | End |

Story 2 ("Explain the limit next to the field") repeats steps 4 to 10. It is not counted below.

### B. Spec Kit in the repo (same organisation, same controls)

| # | Who | Tool | What happens | Hand-off or wait |
|---|---|---|---|---|
| 1 | Priya | Azure Boards | Writes a work item | **Wait 1** (backlog) |
| 2 | Priya and developer | Teams or a meeting | Developer asks what exactly is wanted | Tool switch |
| 3 | Developer | VS Code | New branch, `/speckit-specify` with the request; answers the clarify questions | |
| 4 | Developer | VS Code, Teams | Checks open points with Priya (is 310 allowed? what should the message say?) | **Wait 2** |
| 5 | Developer | VS Code | `/speckit-plan`, reads `plan.md` | |
| 6 | Developer | VS Code | `/speckit-tasks`, reads `tasks.md` | |
| 7 | Developer and agent | VS Code | `/speckit-implement`, then `/speckit-converge` until "Converged" | |
| 8 | Developer | Azure Repos | Opens a pull request holding spec, plan, tasks, code and tests; links the work item | **Wait 3** |
| 9 | Engineering Lead (Architect if required) | Azure Repos | Reviews markdown and code; Copilot code review adds comments but cannot approve [I]; approves | |
| 10 | Pipelines | Azure Pipelines | CI and staging deploy | **Wait 4** |
| 11 | Tester | Test Plans or staging | Tests against the criteria in `spec.md`; signs off on the work item | **Wait 5** |
| 12 | Priya | Staging, Azure Boards | User acceptance | **Wait 6** |
| 13 | Release Manager | Azure Pipelines, ServiceNow | Raises the change ticket, approves the production environment | |
| 14 | Pipelines | Azure Pipelines | Deploys; work item closed | End |

**Minimum path** for a small team with no separate tester or release role: steps 3, 5, 6, 7, 8, 9, 10, 14.

### C. IDE-only (same organisation, same controls)

| # | Who | Tool | What happens | Hand-off or wait |
|---|---|---|---|---|
| 1 | Priya | Azure Boards | Writes a work item | **Wait 1** |
| 2 | Priya and developer | Teams or a meeting | Clarify what is wanted | Tool switch |
| 3 | Developer | VS Code | Pulls the work item through the Azure DevOps MCP server [I], or pastes it; asks the agent for a plan and reads it in chat | |
| 4 | Developer and agent | VS Code | Agent writes the code and tests; developer iterates. Open points go back to Priya | **Wait 2** |
| 5 | Developer | Azure Repos | Opens a pull request, links the work item | **Wait 3** |
| 6 | Engineering Lead | Azure Repos | Reviews the diff with Copilot code review comments; approves | |
| 7 | Pipelines | Azure Pipelines | CI and staging deploy | **Wait 4** |
| 8 | Tester | Test Plans or staging | Tests against the ticket; signs off | **Wait 5** |
| 9 | Priya | Staging, Azure Boards | User acceptance | **Wait 6** |
| 10 | Release Manager | Azure Pipelines, ServiceNow | Change ticket, approves the production environment | |
| 11 | Pipelines | Azure Pipelines | Deploys; work item closed | End |

**Minimum path**: steps 3, 4, 5, 6, 7, 11.

### Counts

| | A. Our platform | B. Full | B. Minimum | C. Full | C. Minimum |
|---|---|---|---|---|---|
| Steps | 16 | 14 | 8 | 11 | 6 |
| People | 8 | 5 | 2 | 5 | 2 |
| Tools a person must open | 3 | 6 | 2 | 6 | 2 |
| Hand-offs that wait for a person | 8 | 6 | 1 | 6 | 1 |
| Recorded, enforced human approvals | 7 | 2 | 1 | 2 | 1 |
| Approval before any code is written | 3 (plan, spec, design) | 0 enforced | 0 | 0 | 0 |
| Manual tool switches, all people | 3 | about 9 | 1 | about 8 | 1 |

Notes on the counts
- A's tools are the console, VS Code and ServiceNow. Add one if the pull request has to be completed by hand in Azure Repos [?].
- B's and C's tools are Boards, Teams, VS Code, Azure Repos, Pipelines or Test Plans, and ServiceNow.
- Elapsed time was not measured for any approach [?]. The prototype's demo data shows about 3 days for this change, with a 1-day wait at design [V: store.jsx].

**Reading the counts (assessment)**
- A has the most steps, people and waits, and the fewest tools. Every person except the developer stays in one place.
- For this change, a single field validation in one repository, **8 waits is too many**. B's or C's minimum path does it with one. This is the case for the risk-tiered fast path already at the top of our roadmap [V: STATUS.md item 1].
- B and C in a regulated organisation are not light either: 6 waits across 6 tools, and only 2 of the decisions are enforced and recorded. The rest happen in chat and meetings.
- Only A records an approval of **what** will be built before it is built.

---

## 5. UX comparison

| Dimension | A. Our platform | B. Spec-driven in repo | C. IDE-only |
|---|---|---|---|
| **Learning curve** | Low for approvers: an 8-step guided tour, plain language [V]. Medium for developers: a new surface plus a hand-off ritual | Medium to high: `uv`, a CLI, 6 commands, a folder convention, plus presets and extensions [V]. Kiro is easier: phases are built into the IDE [3P] | Low for developers. Not usable by anyone else |
| **Cognitive load** | One decision per screen, plain and technical views [V]. Risk: 9 document types times stories [V: market-agentic-sdlc.md] | High. Spec Kit "generated verbose, repetitive markdown files that were heavier to review than the code itself would have been" [3P summary of the Fowler-site review]; "a sea of markdown documents, long agent run-times and unexpected friction" [3P summary of Scott Logic]; 8 files and 1,300 lines to show a date [3P via market-agentic-sdlc.md]. Thoughtworks teams cut load by trimming templates [I via market-agentic-sdlc.md] | Low to write, high to review. The reviewer has a diff and no statement of intent |
| **Visibility of status** | Strong: stage stepper, "Waiting for <name>", Home queue, notifications, governance dashboard [V] | Weak outside the repo: task ticks in `tasks.md`; the board is updated by hand | Weak: the board, by hand; agent sessions are per developer |
| **Error recovery** | Send back with a note, Undo on every decision, pause and resume, retry validation, assign an engineer, cancel a schedule, roll back with a second person [V]. No "compare with previous version" after a send-back [V] | Edit the file and rerun the phase; git revert. Fixing a wrong spec after implementation means reconciling by hand [V/3P] | Agent checkpoints, git revert, close the PR. Fast, local, unrecorded |
| **Accessibility for non-developers** | The core design point. WCAG 2 A/AA scan clean, light and dark [V: PROTOTYPE.md] | Poor: markdown in git. Kiro and Spec Kit make the developer the author and approver [V: market-agentic-sdlc.md] | None |
| **Onboarding time** | Approver: minutes (assessment, from the tour). Organisation: long. No onboarding wizard, integrations not built, no certifications [V: STATUS.md] | Developer: about an hour to first spec (assessment). Organisation: a constitution and presets per repo | Developer: minutes. Organisation: licences and policy, days |

**Evidence on review burden, which affects all three**
- AI-written code raises review load. Reported figures: pull request volume up 98% and review time up 91% (Faros); AI-generated PRs wait 4.6 times longer and are accepted 32.7% of the time against 84.4% (LinearB, 8.1 million PRs); time in review up about 200% on average [3P, mostly vendors that sell review tools].
- Reviews get skipped: PRs merged with no review up 31.3% in high-adoption periods (Faros) [3P]; 61% of agent PRs receive no review (EASE 2026 paper) [I via 3P].
- A counter-finding: Atlassian reports a 30.8% drop in median PR cycle time across 1,900+ repositories (ICSE 2026) [I via 3P].
- People stop reading approval prompts: users reportedly approve 93% of agent permission prompts [3P, unverified, via future-readiness.md].
- Copilot code review on Azure Repos only comments. A person still has to approve [I].

**What this means (assessment)**
- C moves the bottleneck to the reviewer and gives that reviewer the least context.
- B gives the reviewer context and then asks them to read more markdown than code.
- A splits the review by role, so each person reads less. But 7 approvals on a one-field change invites the same rubber-stamping the data describes. Fewer, better-informed gates will beat more gates.

---

## 6. When each approach is the right choice

| Situation | Choose | Why |
|---|---|---|
| One to ten developers, no separate approver roles | C, or B for larger features | Nothing to govern; speed matters most |
| Greenfield build, or a prototype | B | The spec gives the agent structure; Spec Kit and Kiro are strongest on new code [3P] |
| Developer-only change: refactor, dependency bump, test fix, tooling | C | No business decision is involved. A spec or a gate adds delay and no value |
| Bug fix with a clear cause | C, or Kiro's bugfix spec, or Spec Kit's `bug` extension [V] | A has no bug-shaped flow yet [V: market-agentic-sdlc.md] |
| Team already on GitHub with Copilot | B or C | The cloud coding agent, Agent HQ and Spec Kit work there natively [I] |
| A business rule, pricing, eligibility or customer-facing change in a regulated firm | **A** | A named person outside engineering must approve what is built, and the record must show it |
| Several roles and repositories on one change | **A** | Hand-offs, backups and cover are visible; one record spans repos |
| The change will be audited (DORA, SOX ITGC, ISO 42001) | **A** | Approver separate from implementer, versioned evidence, an audit log [V: market-agentic-sdlc.md §4] |
| The requester is not technical and wants to follow progress | **A** | The only option where the requester has a tool at all |

**Honest limits of A**: it is a prototype with no customers and no certifications; it scored 13 of 30 against 18 to 24 for incumbents in our own review [V: future-readiness.md]. It is the wrong tool for the first five rows above.

### Combining them
The three are layers, not rivals (assessment, building on market-agentic-sdlc.md §3 and §4).

1. **The platform governs.** Request, approvals, squads, evidence and release stay in A.
2. **Markdown is mirrored into the pull request.** On Build, the platform writes the approved spec, design and acceptance criteria into `/specs/<WI>/<story>/` in Spec Kit-compatible markdown, read-only, with the record ID, version, fingerprint and approver in the header. The IDE agent and the reviewer get developer-native context.
3. **A status check in Azure Repos branch policy** confirms the mirrored fingerprint matches the approved version and blocks the merge if not.
4. **The IDE agent connects through MCP.** A Delivery MCP server offers the assignment as a slash command, the approved documents as resources, and tools to ask a question and submit the completion report. Any MCP client works: Copilot agent mode, Claude Code, Cursor, Cline. Copy-paste stays as the fallback.
5. **Risk tiers pick the path.** Low-risk and developer-only changes run as C with the platform recording the PR and the pipeline result. Medium-risk changes get plan and release gates. Regulated changes get all eight.
6. **Teams already on Spec Kit** import their `spec.md` and constitution as the starting specification and rules, so no work is thrown away.

---

## 7. UX improvements for our platform, ranked

Limited to changes that fit the existing architecture: Azure DevOps, Azure SQL + Blob, the standalone Developer Agent, the current roles and gate component. "Lift" is my estimate of the persona score after the change (assessment).

| # | Improvement | Who gains | Lift | Effort |
|---|---|---|---|---|
| 1 | **Gate screens for Integrate and Validate**, built on the existing gate component: pipeline results per repository and criterion-by-criterion test results, with approve and send back. Add Tom and Mara to "View as". Add Impact and Integrate data to the agent panel. | Integration Lead, Quality Lead | 5 to 9; 7 to 10 | **S** |
| 2 | **Delivery MCP server and "Start in VS Code"** in place of copy-paste: assignment as a slash command, approved documents as resources, tools for questions, heartbeat and the completion report. | Developer, Architect | 7 to 10 | **M** |
| 3 | **Risk-tiered fast path and a Bug fix request type.** For the 310 change: plan and spec approved together, design auto-approved by policy because it reuses an approved pattern (ADR-0151), build review, release. 8 waits become 3. | Everyone; the answer to "waterfall" | +1 on control for all | **M** |
| 4 | **Read-only spec mirror in the pull request, plus a fingerprint status check** in Azure Repos branch policy. | Developer, Architect, Auditor | Developer +1 | **M** |
| 5 | **Review where the code is.** Link to the real pull request, line-level comments synced with Azure Repos, a required comment on reject, and "what changed since the last version" on every re-approval. | Engineering Lead, Architect | 10 to 11 | **S–M** |
| 6 | **Close the loop for the requester.** A note and inline edits when sending a plan back; separation of duties routes to the squad's backup Product Owner, not the admin; a plain "what changed for users" summary and a "tell me when it is live" notice on release. | Product Owner | 11 to 12 | **S** |
| 7 | **Approve from Teams.** An adaptive card with the plain summary, the open questions and Approve or Open, for plan, spec and release gates. The Teams connection already exists. | Product Owner, Release Manager, Architect | Fewer waits | **S–M** |
| 8 | **Shorter documents.** A five-line plain summary and a length budget on every artifact; one batched review per run for low-risk stories. | All approvers | Lower review load | **S** |
| 9 | **Real provenance in the agent panel.** Model, version, prompt version and policy version stamped on each artifact; later, steps read from traces. | Auditor, Admin, Architect | Auditor 9 to 10 | **S** for the stamp, **M** for tracing |
| 10 | **Auditor workbench.** A per-change evidence pack, sampling views (releases outside a window, freeze exceptions, overrides), an exceptions report, and "raise a finding" that opens a tracked item. Write-once Blob storage for released evidence. | Auditor | 9 to 11 | **M** |
| 11 | **Insights view for the sponsor.** Lead time against a baseline, where work waits by role, cost per change, send-back rate, releases and rollbacks. Read-only; add to "View as". | Executive sponsor, Admin | 5 to 9 | **M** |
| 12 | **Release calendar** with windows, freezes and conflicts, and a freeze badge on runs. | Release Manager | 11 to 12 | **M** |
| 13 | **Take over and hand back.** A developer can claim a build from the agent, fix it by hand, and return it with a note; the record shows who did what. | Developer | +1 on control | **M** |
| 14 | **Admin: onboard an application, model settings, global agent stop.** | Platform Admin | 9 to 11 | **M–L** |
| 15 | **Spec Kit-compatible import and export.** | Teams moving from B | Adoption | **M** |
| 16 | **Two-way ServiceNow change link** in place of the typed ticket number. | Release Manager, Auditor | Removes A's last tool switch for releases | **L** |

Items 1, 6 and 8 are small and would raise the total from 74 to about 84 (assessment). Items 2, 3 and 4 are what make A acceptable to engineers.

---

## 8. Chart-ready data

```json
{
  "as_of": "2026-11-12",
  "scale": { "per_criterion": "0-3", "per_persona_max": 12, "total_max": 108 },
  "caveat": "A is scored on the prototype as designed; it is not in production. B and C are shipping products. All scores are the analyst's assessment.",
  "approaches": {
    "A": "Our platform (prototype)",
    "B": "Spec-driven in repo (Spec Kit, Kiro)",
    "C": "IDE-only (AI agent + Azure DevOps/GitHub)"
  },
  "criteria": ["Natural tool", "Understands what the AI did", "Control", "Evidence kept automatically"],
  "persona_scores": [
    { "persona": "Business requester / Product Owner", "A": [3,3,2,3], "B": [1,2,1,1], "C": [2,0,1,1], "totals": { "A": 11, "B": 5, "C": 4 } },
    { "persona": "Solution Architect", "A": [2,3,2,3], "B": [3,2,2,2], "C": [3,1,2,1], "totals": { "A": 10, "B": 9, "C": 7 } },
    { "persona": "Developer / Engineering Lead", "A": [1,2,2,2], "B": [3,3,3,2], "C": [3,2,3,1], "totals": { "A": 7, "B": 11, "C": 9 } },
    { "persona": "Integration Lead", "A": [1,1,1,2], "B": [2,1,2,2], "C": [3,1,2,2], "totals": { "A": 5, "B": 7, "C": 8 } },
    { "persona": "Quality Lead / tester", "A": [1,2,1,3], "B": [2,2,1,2], "C": [2,1,1,1], "totals": { "A": 7, "B": 7, "C": 5 } },
    { "persona": "Release Manager", "A": [2,3,3,3], "B": [2,1,2,2], "C": [2,1,2,2], "totals": { "A": 11, "B": 7, "C": 7 } },
    { "persona": "Platform Admin", "A": [2,2,2,3], "B": [1,1,2,1], "C": [2,1,2,2], "totals": { "A": 9, "B": 5, "C": 7 } },
    { "persona": "Auditor / risk and compliance", "A": [3,2,1,3], "B": [1,1,0,2], "C": [1,0,0,1], "totals": { "A": 9, "B": 4, "C": 2 } },
    { "persona": "Executive sponsor", "A": [1,1,1,2], "B": [0,0,0,1], "C": [1,1,1,1], "totals": { "A": 5, "B": 1, "C": 4 } }
  ],
  "approach_totals": { "A": 74, "B": 56, "C": 53 },
  "criteria_averages": {
    "A": { "Natural tool": 1.78, "Understands what the AI did": 2.11, "Control": 1.67, "Evidence kept automatically": 2.67 },
    "B": { "Natural tool": 1.67, "Understands what the AI did": 1.44, "Control": 1.44, "Evidence kept automatically": 1.67 },
    "C": { "Natural tool": 2.11, "Understands what the AI did": 0.89, "Control": 1.56, "Evidence kept automatically": 1.33 }
  },
  "walkthrough": {
    "change": "WI-4821 Registered Amortization limit: block values above 310 on Product Selection",
    "counts": [
      { "approach": "A", "variant": "as prototyped", "steps": 16, "people": 8, "tools_opened_by_people": 3, "handoffs_waiting_for_a_person": 8, "enforced_human_approvals": 7, "approvals_before_code": 3 },
      { "approach": "B", "variant": "full, regulated organisation", "steps": 14, "people": 5, "tools_opened_by_people": 6, "handoffs_waiting_for_a_person": 6, "enforced_human_approvals": 2, "approvals_before_code": 0 },
      { "approach": "B", "variant": "minimum, small team", "steps": 8, "people": 2, "tools_opened_by_people": 2, "handoffs_waiting_for_a_person": 1, "enforced_human_approvals": 1, "approvals_before_code": 0 },
      { "approach": "C", "variant": "full, regulated organisation", "steps": 11, "people": 5, "tools_opened_by_people": 6, "handoffs_waiting_for_a_person": 6, "enforced_human_approvals": 2, "approvals_before_code": 0 },
      { "approach": "C", "variant": "minimum, small team", "steps": 6, "people": 2, "tools_opened_by_people": 2, "handoffs_waiting_for_a_person": 1, "enforced_human_approvals": 1, "approvals_before_code": 0 }
    ],
    "A_with_fast_path_estimate": { "handoffs_waiting_for_a_person": 3, "note": "Estimate if improvement 3 (risk tiers) is built; not measured." }
  }
}
```

---

## 9. Limits of this report

- All scores are one analyst's judgement from documents, code and published sources. No user was observed or timed in any of the three approaches.
- A was not clicked through in a browser this session. Behaviour is taken from the source and from the earlier persona walkthroughs, which predate some fixes listed in STATUS.md.
- Elapsed times and waits were not measured for any approach.
- Kiro's own pages were not read directly; its details come from the earlier market round and from press and reviews. Current Kiro pricing is disputed between sources and is not quoted.
- The Scott Logic and Fowler-site reviews of Spec Kit were not opened; their wording comes from secondary summaries.
- The review-burden figures mostly come from vendors that sell review tools. The direction is consistent; the exact percentages are not reliable.
- Whether a pull request must be completed by hand in Azure Repos under A is not settled by the prototype.

---

## Sources

**Our platform [V]**
- `/home/user/UI/app/PROTOTYPE.md`
- `/home/user/UI/app/review/panel/STATUS.md`, `VERDICT.md`, `personas.md`, `market-agentic-sdlc.md`, `future-readiness.md`
- `/home/user/UI/app/src/v3/store.jsx`, `docs.jsx`, `agentpanel.jsx`, `Run.jsx`, `Approve.jsx`, `Clarify.jsx`, `Release.jsx`, `Admin.jsx`, `Audit.jsx`, `gate.jsx`, `ui.jsx`, `Review.jsx`, `NewRequest.jsx`

**Spec Kit and spec-driven development**
- [V] https://github.com/github/spec-kit (README, fetched 12 Nov 2026)
- [3P] https://github.github.com/spec-kit/ and https://github.github.com/spec-kit/history.html (via search excerpts)
- [3P] https://tproger.ru/news/spec-kit-1-0-i-eshhyo-desyat-ii-repozitoriev-sobravwih-zvyozdy-za-n (1.0.0 on 21 Aug 2026)
- [3P] https://tproger.ru/news/github-vypustil-spec-kit-1-0-11-s-idempotentnym-dobavleniem-kata (1.0.11 on 24 Sep 2026)
- [I] https://visualstudiomagazine.com/articles/2026/05/12/github-spec-kit-takes-off-as-antidote-to-piecemeal-vibe-coding.aspx
- [3P] https://www.augmentcode.com/guides/github-spec-kit-practical-guide-sdd-workflow
- [3P] https://jmlopezdona.github.io/ai-coding-agents-sdd/09-honest-critique/ (summarises the Fowler-site and Scott Logic reviews)
- [3P] https://dev.to/pacheco/spec-driven-development-isnt-waterfall-but-it-keeps-ending-up-there-4eei
- [3P] https://www.augmentcode.com/guides/spec-driven-development-vs-waterfall
- [3P] https://feedbagel.com/post/critique-of-spec-driven-development-balancing-structure-and-agility-in-ai-progra
- [3P] https://codemyspec.com/blog/github-spec-kit-guide
- [3P] https://www.shiplight.ai/blog/spec-driven-development-with-spec-kit
- [I] https://learn.microsoft.com/en-us/training/modules/spec-driven-development-github-spec-kit-enterprise-developers/3-examine-github-spec-kit
- Not reachable: https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html

**Kiro**
- [I] https://kiro.dev/blog/general-availability/ (via search excerpt)
- [I] https://siliconangle.com/2025/11/17/aws-launches-kiro-general-availability-team-features-cli-support/
- [I] https://www.theregister.com/2025/08/18/aws_updated_kiro_pricing/
- [I] https://www.techzine.eu/news/devops/133888/aws-significantly-increases-the-price-of-its-kiro-development-environment
- [3P] https://dev.to/pickuma/amazon-kiro-review-awss-spec-driven-agentic-ide-in-2026-4f48
- [3P] https://www.gilricardo.com/blog/kiro-review-spec-driven-agentic-ide
- [3P] https://rywalker.com/research/kiro

**IDE agents and Azure DevOps**
- [I] https://devblogs.microsoft.com/devops/azure-devops-remote-mcp-server-ga/ (5 Aug 2026)
- [I] https://infoq.com/news/2026/08/azure-devops-remote-mcp-ga
- [I] https://github.blog/changelog/2026-06-02-github-copilot-code-review-for-azure-repos-is-now-in-technical-preview/
- [I] https://devblogs.microsoft.com/devops/copilot-code-reviews-for-azure-repos-public-preview/ (26 Aug 2026)
- [I] https://devblogs.microsoft.com/devops/updates-to-copilot-code-reviews-for-azure-repos (30 Sep 2026)
- [I] https://infoq.com/news/2026/09/copilot-code-review-azure-repos
- [I] https://learn.microsoft.com/en-us/azure/devops/repos/git/copilot-code-reviews
- [I] https://devblogs.microsoft.com/devops/github-copilot-for-azure-boards/ (coding agent needs GitHub repos)
- [I] https://devblogs.microsoft.com/devops/azure-boards-integration-with-github-copilot-includes-custom-agent-support/
- [I] https://code.visualstudio.com/updates/v1_106 and https://code.visualstudio.com/updates/v1_110
- [I] https://code.visualstudio.com/docs/enterprise/manage-ai-settings
- [I] https://visualstudiomagazine.com/articles/2025/11/12/vs-code-1-106-adds-agent-hq-new-security-controls.aspx
- [3P] https://devops.com/vs-code-is-becoming-an-agent-control-plane-and-most-teams-havent-noticed-yet/
- [3P] https://www.digitalapplied.com/blog/enterprise-governed-ai-coding-vscode-copilot-byok-2026
- [I] https://github.com/MicrosoftDocs/azure-devops-docs/blob/main/docs/repos/git/branch-policies.md
- [I] https://microsoft.github.io/zerotrustassessment/docs/workshop-guidance/devsecops/DS_007

**Review burden**
- [3P] https://www.faros.ai/blog/ai-code-quality-senior-engineer-review-burden
- [3P] https://blog.codacy.com/ai-breaking-code-review-how-engineering-teams-survive-pr-bottleneck
- [3P] https://dev.to/code-board/the-review-bottleneck-why-faster-code-generation-isnt-faster-delivery-cb7
- [3P] https://tianpan.co/blog/2026-05-06-ai-code-velocity-review-capacity-mismatch
- [3P] https://codex.danielvaughan.com/2026/07/05/ai-writes-faster-than-humans-review-enterprise-2x-mandate-codex-cli-guardian-auto-review-bottleneck-defence/
- [3P] https://hackernoon.com/heres-why-code-review-is-having-trouble-scaling-to-the-ai-era
