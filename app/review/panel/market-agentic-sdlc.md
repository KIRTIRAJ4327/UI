# Market analysis, round 2: agentic SDLC/PDLC and spec-driven development (12 Nov 2026)

**Scope.** This round goes deeper than `review/panel/market.md` (11 Nov) on five things: who covers which lifecycle stage, Spec Kit and Kiro in detail, the standalone IDE-agent pattern, where artifacts should live, and spec-driven UX. It ends with ranked recommendations that fit the existing architecture: Azure DevOps, Azure SQL + Blob, and a standalone Developer Agent in VS Code.

**Method.** About 45 web searches in Nov 2026, run in parallel batches. Direct page fetches worked only for github.com/github/spec-kit. kiro.dev, martinfowler.com and infoq.com could not be reached from this session (they are not on the network allowlist), so claims about those pages come from search excerpts and secondary coverage. They are tagged to say so.

**Tags.** [V] = the vendor's own docs, blog or press. [I] = independent (regulator, analyst, trade press, peer-reviewed work). [3P] = third-party blog or aggregator. [?] = not verified. No prices are asserted beyond what sources state. Most third-party price figures conflict, so they are left out.

---

## 0. Key conclusions (TL;DR)

1. **Spec-driven development has gone mainstream, but it is developer-owned and repo-bound.**
   - Spec Kit reached 1.0 in Aug 2026 and has an extension, preset and catalog ecosystem [V/3P].
   - Kiro has feature, bugfix and design-first specs [V/3P].
   - Atlassian launched **Jira Planner**, which writes specs into Confluence and assigns work items to Claude Code, Cursor or Copilot [V/I].
   - Thoughtworks keeps SDD in "Assess" and flags verbose markdown, instruction bloat and context rot [I].

   Nobody in this group makes a *business person* the author, or *named, non-developer approvers* the gate.
2. **The top user complaints are verbosity, review fatigue, drift, overkill on small changes, and single-repo assumptions.**
   - Verbosity: one report counts 8 files and 1,300 lines to show a date [3P].
   - Review fatigue: "I'd rather review code than all these markdown files" [3P].
   - Drift: specs fall out of sync after implementation, and reconciling them is manual according to Spec Kit's own docs [V/3P].
   - Overkill: "sledgehammer to crack a nut" [3P, attribution unverified].
   - Single-repo assumptions: InfoQ notes that "enterprise systems are rarely mono-repos" [I, excerpt].

   Our design answers most of these structurally: one Story at a time, plain/technical views, a platform record, multi-repo Integrate. It only works if we keep artifacts *short* and add *drift detection*.
3. **The IDE agent is converging on "the work item is the hand-off, MCP is the pipe".**
   - Azure DevOps Remote MCP Server went GA on 5 Aug 2026 [V].
   - Atlassian Rovo MCP is available, labelled Beta [V].
   - Linear MCP is first-party [V].
   - Jira assigns work to IDE/cloud agents [V].
   - Kiro has MCP prompts [V/3P].

   **Copy-paste of a prompt is now behind the market.** The platform should expose the Developer Assignment through an MCP server, with a thin VS Code extension for status and heartbeat. The agent stays standalone.
4. **Keeping the developer agent standalone in VS Code is a good fit for Azure DevOps shops.** It is not a gap.
   - The **GitHub Copilot cloud coding agent only works on GitHub-hosted repos.** Microsoft has said it has no plans to support Azure Repos [V, 2025 statement; no 2026 reversal found].
   - Copilot *code review* for Azure Repos did arrive in public preview in Aug–Sep 2026 [V/I].
   - For an Azure Repos client, a local IDE agent (Copilot agent mode, Claude Code, Cline) is the realistic path today.
5. **The artifact store should be hybrid.**
   - The governed record (approvals, versions, fingerprints) stays in Azure SQL + Blob.
   - A **read-only markdown mirror goes into the repo (`/specs/<WI>/<story>/`) on the PR**, so the IDE agent and reviewers get developer-native context.
   - DORA RTS Art. 17, SOX ITGC and ISO 42001 all expect change records, approval evidence and separation of approver from implementer. A git folder alone does not provide these well [I/3P].

---

## 1. Landscape: lifecycle coverage matrix (late 2026)

Legend: ● = core, first-party capability. ◐ = partial, or via integration/preview. ○ = not covered. "Gate" = human approvals built into that stage.

| Product | Idea / discovery | Requirements / spec | Design / architecture | Code | Test / validate | Release / change | Operate | Who drives it | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| **Our platform** (8 stages) | ● business request | ● Plan → Stories → Spec (gated, PO) | ● Impact + ADR (gated, Architect) | ◐ handoff to standalone VS Code agent; completion report | ● Validate (Quality Lead) + Integrate pipelines | ● Release Manager gate, rollback | ◐ production health after release | Business person + named approvers | prototype |
| **GitHub Spec Kit** (OSS, 1.0 Aug 2026) | ◐ `assess` extension (intake → decide: go / needs-clarification / kill) | ● `/speckit-specify` | ● `/speckit-plan`, constitution | ◐ `/speckit-implement` via any agent | ◐ `converge`, `bug-test`; community verify/trace extensions | ○ | ○ | Developer in repo | [V] repo README; [V] history page |
| **Copilot agent mode / cloud coding agent + Agent HQ** | ○ | ◐ Plan agent, custom `.agent.md`, handoffs | ◐ | ● | ◐ Actions on agent PRs | ○ (branch protection only) | ○ | Developer / admin | [V] VS Code docs, GitHub docs |
| **AWS Kiro** (IDE + autonomous agent, preview) | ○ | ● requirements.md (EARS) / bugfix.md | ● design.md; design-first mode (Feb 2026) | ● tasks.md execution; autonomous agent opens a PR per repo | ◐ hooks (e.g. update tests on save) | ○ | ○ | Developer | [V] kiro.dev blog/docs via search; [3P] |
| **Tessl** | ○ | ◐ spec-as-source (Framework still closed beta / paused) | ○ | ◐ | ○ | ○ | ○ | Developer; now mostly a skills registry | [V/3P] |
| **BMAD-METHOD** (OSS, v6) | ● Analyst agent | ● PM agent PRD | ● Architect agent | ● Dev agent | ◐ Test Architect | ○ | ○ | Developer running role-agents | [3P] |
| **OpenSpec** (OSS) | ○ | ● change proposals as **deltas** (ADDED/MODIFIED/REMOVED), archive merges into `specs/` | ◐ | ◐ via agent | ○ | ○ | ○ | Developer; brownfield-first | [V] openspec.dev; [I] Thoughtworks |
| **Factory (Droids)** | ○ | ◐ Specification Mode (read-only plan, saved as markdown) | ◐ | ● | ◐ | ◐ | ◐ incident droids [?] | Eng teams; admin autonomy caps | [V] docs |
| **Devin / Devin Desktop** | ○ | ◐ interactive planning | ○ | ● | ◐ | ○ | ○ | Engineers | [V/3P] |
| **Cursor** | ○ | ◐ plan mode with clarifying questions | ○ | ● (cloud/background agents) | ◐ Bugbot review + autofix | ○ | ○ | Developer | [V] changelog, [3P] |
| **Claude Code** | ○ | ◐ plan mode, skills | ◐ subagents | ● | ◐ hooks | ○ | ○ | Developer; managed settings for admins | [V] docs |
| **OpenAI Codex** | ○ | ○ | ○ | ● CLI / IDE / cloud | ◐ code review | ○ | ○ | Developer | [V/I] |
| **Atlassian (Jira Planner, Rovo Dev, JPD, JSM)** | ● JPD (Rovo AI) | ● **Jira Planner: requirements + technical spec in Confluence** | ◐ | ● Rovo Dev; assign to Claude Code / Cursor / Copilot | ◐ Rovo code reviewer | ● JSM change approval | ◐ JSM | PM + devs in Jira | [V] Atlassian; [I] TechTarget, SD Times |
| **Linear** | ◐ | ◐ issues and projects | ○ | ◐ Linear Agent + delegation to any agent | ○ | ○ | ○ | Product/eng | [V] changelog |
| **ServiceNow (Build Agent, AI SDLC, Control Tower)** | ◐ | ● build-ready requirements with Given-When-Then (Now platform apps) | ◐ | ● on Now; skills inside Cursor / Claude Code / Copilot | ● self-healing test loop / quality gates | ● deployment approvals, ReleaseOps, change mgmt | ● ITOM | Platform/app devs on ServiceNow | [V] press release May 2026, docs |
| **Harness (Agent DLC, AI code review, repo)** | ○ | ○ | ○ | ◐ | ● eval gates, AI testing | ● approvals, OPA, canary | ● | Platform/DevOps | [V], [I] SiliconANGLE |
| **GitLab Duo Agent Platform** (GA 18.8, Jan 2026) | ◐ Planner agent | ◐ | ○ | ● Developer flow (issue → MR), Software Development flow | ◐ | ◐ CI/CD flows | ○ | Dev + PM in GitLab | [V] docs, [I] heise |
| **Azure DevOps + Copilot + Foundry** | ○ | ◐ Boards work items | ○ | ◐ Boards → Copilot coding agent (**GitHub repos only**); agent mode in VS Code | ◐ Copilot code review for Azure Repos (preview) | ◐ Pipelines approvals | ◐ | Dev teams | [V] Learn, devblogs |
| **ChatPRD** | ● | ● PRDs; MCP; Cursor plugin with "product-reviewer" subagent | ○ | ◐ hand-off to Replit / Cursor | ◐ checks code against acceptance criteria | ○ | ○ | PMs | [V] skill file; [3P] |
| **Productboard Spark** | ● VoC, discovery | ● "delivery-ready specs grounded in your codebase" | ○ | ○ (to Jira / Linear) | ○ | ○ | ○ | PMs | [V] support page; [3P] |

**Reading the matrix.**
- **Left of code (idea → spec):** PM tools (ChatPRD, Productboard Spark, JPD, Jira Planner) own it for product managers. Spec Kit, Kiro, BMAD and OpenSpec own it for developers.
- **Right of code (test → release → operate):** owned by Harness, ServiceNow and GitLab.
- **The seam between the two:** only Atlassian (Planner → assign agent → JSM change) and ServiceNow (Build Agent → ReleaseOps, but Now-platform apps only) span both sides.
- **Where we sit:** no product found spans **business request → named-approver gates at every stage → Azure DevOps release** for general (non-ServiceNow) apps.
- **Closest threat for Atlassian shops:** Atlassian, *not* Spec Kit. Jira Planner + Rovo + JSM is the same shape, with weaker gates.
- **Closest threat for Microsoft shops:** Microsoft itself, if it ever brings the coding agent to Azure Repos and adds a planning layer to Boards. Watch both.

---

## 2. Deep comparison: GitHub Spec Kit and Kiro

### 2.1 Exact flows

**Spec Kit** [V: github.com/github/spec-kit README, fetched 12 Nov 2026]
- **Setup:** `uv tool install specify-cli`, then `specify init <project> --integration copilot`. Needs Python 3.11+.
- **Core commands:**
  - `/speckit-constitution` (once per project)
  - `/speckit-specify`
  - `/speckit-plan`
  - `/speckit-tasks`
  - `/speckit-implement`
  - `/speckit-converge` (repeat until it reports "Converged")
- **Clarification, checklists and consistency analysis** sit in the walkthrough.
- **Extensions:**
  - `bug` (assess / fix / test, with verdicts verified, partial or failed)
  - `assess` (intake → research → define → shape → decide, giving go, needs-clarification or kill; on "go" it hands off to `/speckit-specify`)
- **Governance mechanisms:** presets that "can enforce organizational or regulatory standards", private and self-hosted catalogs of approved components, extension hooks, and workflows [V].
- **History and agents:** 1.0 released 21 Aug 2026 [V history page]. 30+ agent integrations [3P].
- **Where things live:** everything is markdown in the repo (`.specify/…`, feature spec folders).

**Kiro** [V via search excerpts from kiro.dev; 3P]
- **Specs:** live under `.kiro/specs/<feature>/` as `requirements.md` (EARS notation) or `bugfix.md`, plus `design.md` and `tasks.md`.
- **Phases:** each is approved by the developer before the next one starts.
- **Updating a spec:** "Refine" in `design.md` and "Update tasks" in `tasks.md` carry requirement edits forward.
- **Feb 2026 (0.10):**
  - **design-first** workflow (design first, requirements derived from it)
  - **bugfix specs** (root cause → fix design → regression prevention, with "must not change" constraints)
  - task hooks
  - MCP prompts
- **Steering:** files live in `.kiro/steering/`. A 2026 changelog added *global* steering [3P].
- **Kiro autonomous agent (preview):**
  - It takes GitHub issues (`kiro` label or `/kiro` comment).
  - A multi-repo task opens one PR per affected repo.
  - Users can only assign repos they can write to.
  - The docs warn it may follow instructions embedded in repo code [V].
- **Enterprise:** IAM Identity Center, credit pooling with profile/group/user limits, and MCP and model governance [V blog].

### 2.2 Side by side

| Dimension | Spec Kit | Kiro | **Our platform** |
|---|---|---|---|
| Primary user | Developer at a terminal or IDE | Developer in the Kiro IDE | **Business requester + named approvers**; developer only at Build |
| Flow | constitution → specify → plan → tasks → implement → converge | requirements (or design-first / bugfix) → design → tasks → execute | Plan → Specify → Impact → Design → Build → Integrate → Validate → Release, **story by story** |
| Where specs live | Repo markdown | Repo markdown (`.kiro/specs`) | Azure SQL (metadata, versions, approvals) + Blob (docs), fingerprinted |
| Approvals | Implicit: the developer runs the next command. Any formal approval comes only from PR review. | Developer clicks to move on in each phase | **Named role per stage, backups, separation of duties, audit log** |
| Traceability | Community `spec-kit-trace`, `verify`, `reconcile` extensions [3P] | Tasks map to requirements inside a spec | Request → plan → story → spec → ADR → PR → pipeline → release record (needs to be *shown*: see Rec. 4) |
| Multi-repo | Not native; community workarounds (multi-root workspaces, separate spec repo) [V discussion #1119, 3P] | Autonomous agent: one PR per repo [V]. IDE specs are per project. | Integrate stage runs ADO pipelines per repository; Impact assesses blast radius |
| Non-developers | Hard: "non-technical people rarely comment on markdown in a Git repo" [3P]. InfoQ: PMs/BAs "face barriers to participation" [I] | Same | **Core design point** (plain summary, approve in browser, Teams) |
| Governance | Presets, private catalogs, hooks (config, not evidence) | Org identity, credit and MCP policy | Roles/permissions matrix, policies, audit, evidence chain |
| Cost / licence | **Free, MIT, any agent** | Paid credits (tiers conflict across sources [3P]) | Enterprise product |
| Small-change ergonomics | Overkill for small fixes [3P]; `bug` extension helps | Bugfix spec; spec overhead is "#1 reason casual users bounce" [3P] | Today all 8 gates apply; risk tiers are on the P0 roadmap |

### 2.3 Documented pain points (what users complain about)

| Pain point | Evidence | Applies to us? |
|---|---|---|
| **Verbose markdown, review heavier than code** | Thoughtworks Radar: "overly verbose markdown outputs that increased cognitive load", fixed by trimming templates [I]. Marmelab: 8 files / 1,300 lines to show a date; review time roughly doubles [3P]. "I'd rather review code than all these markdown files" [3P] | **Yes, risk.** We generate *nine* artifact types. Without plain summaries and length budgets we inherit this. |
| **Review/approval fatigue** | Daily approval fatigue, reflexive approval [3P]. AI PR review load: LinearB/Faros figures (+91% review time; +441% wait) [3P, unverified primaries]. 61% of agent PRs merged or closed with no review (EASE 2026) [I via 3P] | **Yes.** Eight gates × N stories. Needs risk tiers, batching per run, and a diff view of only what changed. |
| **Spec drift after implementation** | Spec Kit discussions #501 and #1671; Spec Kit docs say the team "reconciles the artifact set manually" [V/3P]. Community Reconcile/Sync/Verify extensions exist [3P] | **Yes, and it is our opening.** The Completion Report can carry a spec-conformance check. |
| **Overkill for small tasks / waterfall feel** | "Waterfall strikes back" (Marmelab) [3P]. Kiro bug → 16 acceptance criteria (secondhand) [3P]. HN users: "too slow" [3P via blogs] | **Yes.** Our 8 stages read as waterfall unless a fast path exists. |
| **Greenfield bias / brownfield pain** | Brownfield support in Spec Kit is mostly community (`brownfield-bootstrap`) [3P]. OpenSpec praised for deltas on existing systems [I Thoughtworks] | Partly. Knowledge Fabric + Impact help, but specs should be written as **deltas**. |
| **Single-repo assumption** | InfoQ: "enterprise systems are rarely mono-repos" [I excerpt]. Normal Computing built its own multi-repo layer [3P] | **We are ahead**: Impact + per-repo Integrate. |
| **Instruction bloat / context rot / token burn** | Thoughtworks Radar Vol. 34 [I]; a reviewer exhausted a plan on Spec Kit planning [3P] | Our Developer Assignment must be *scoped to one story*. Story-by-story already helps. |
| **Prompt injection from repo content** | Kiro docs warn the agent may follow malicious instructions in repo code [V] | Applies to any agent; the Knowledge Fabric content must be curated. |

### 2.4 How we are different and easier, and where they are better

**Different and easier**
- **The author is a business person, and approvers are named humans.** Spec Kit and Kiro make the *developer* the author and approver of their own spec. Regulators expect the approver to be separate from the implementer (DORA RTS recital 17, MFSA guidance [I]). Self-approval in a repo does not meet that bar. We do.
- **The browser, not markdown in git.** Priya approves a plan in plain language. She never opens a PR. That is exactly the barrier the InfoQ piece and practitioners describe [I/3P].
- **Story-by-story progression.** "Each Story is specified, then designed and built one at a time" keeps every review small. This is a direct answer to the verbosity and context-bloat complaints. Spec Kit's per-feature spec → plan → tasks tends to produce one large bundle per feature.
- **The spec is not the end.** Impact, Integrate (multi-repo pipelines), Validate and Release are gated too. Spec Kit stops at implementation, and Kiro at a PR.
- **Evidence.** Fingerprinted, versioned artifacts with approver identity are an audit record. A git log of markdown is not.

**Where Spec Kit and Kiro are honestly better (say this in front of engineers)**
- **Free and open.** Spec Kit is MIT and works with 30+ agents. There is no procurement step.
- **Developer-native.** Specs sit next to code, change in the same PR, are diffable with git, and can be read offline by any agent. Our Blob store is invisible to the developer's agent unless we push context to it.
- **Fast inner loop.** A developer can go spec → code in minutes. We cannot, and we should not try to match that for low-risk work without a fast path.
- **An extensible ecosystem.** Presets, extensions, catalogs and hooks; Kiro's steering and hooks.
- **Kiro's design-first and bugfix modes** are good UX for brownfield and bug work. We do not yet have a bugfix-shaped flow.

---

## 3. The standalone IDE agent pattern

### 3.1 What others do

| Pattern | Examples | Notes |
|---|---|---|
| **Work item → cloud agent → PR** | Azure Boards → Copilot coding agent (GA; draft PR linked back; status In Progress / Ready for Review; custom agents; model choice) [V]. Jira → Rovo Dev / Claude Code / Cursor / Copilot [V]. Linear → any agent [V]. Kiro autonomous agent via GitHub issue label [V] | **Copilot coding agent needs GitHub repos, not Azure Repos** [V]. "Each work item should be self-contained": dependencies are not supported [V]. |
| **Tracker MCP server pulled by the IDE agent** | Azure DevOps Remote MCP (GA 5 Aug 2026, Entra auth, `mcp.dev.azure.com/{org}`; works in VS Code / Visual Studio / Copilot CLI; **Claude Code, Cursor and Codex must use the local server for now**) [V/I]. Atlassian Rovo MCP (all Cloud customers, user permissions honoured, rate limits, Beta label) [V]. Linear MCP (hosted, OAuth) [V/3P]. ChatPRD MCP [V]. Task Master MCP (PRD → tasks.json) [3P] | MCP is request/response: the "agent won't be notified when an issue changes; it has to poll" [3P]. |
| **Spec as slash commands / prompts in the IDE** | Spec Kit slash commands [V]. Kiro MCP prompts (0.10) [3P]. VS Code exposes MCP *prompts* as `/mcp.server.prompt` slash commands, *resources* as attachable context, and *elicitation* for asking the user [V] | The cleanest way to replace copy-paste. |
| **Custom agents and handoffs in VS Code** | `.agent.md` in `.github/agents`; handoff buttons (e.g. Plan → "Implement Plan"), VS Code 1.106+; VS Code also reads `.claude/agents` [V] | We can ship a "Delivery Developer" custom agent definition. |
| **Governance inside the developer's tool** | ServiceNow Build Agent skills inside Cursor / Claude Code / Copilot, "governed by default" [V]. Claude Code managed settings and plugins [V/3P]. Copilot policy for agent mode [V] | Validates the "platform governs, agent stays where the developer is" stance. |

### 3.2 Verdict on our pattern

**Keep the Developer Agent standalone in VS Code. It is the right fit, not a compromise.**
1. For **Azure Repos** customers, the Microsoft cloud coding agent is not an option [V]. A local IDE agent is the practical path.
2. Regulated buyers keep humans accountable. A developer driving the agent in their own IDE matches the "assist, human accountable" posture from round 1 (BoE/FCA: 2% broad autonomy) [I, from market.md].
3. It is BYO-agent friendly: Copilot agent mode, Claude Code or Cline. This matches the "Can it use our Copilot or Claude?" question from round 1.
4. ServiceNow moved its Build Agent *into* developers' tools in May 2026 [V], which supports this direction.

**But the copy-paste hand-off is the weakest link.** It is lossy, untracked, unauthenticated and invisible. The market has moved to **pull via MCP**.

### 3.3 Recommended integration pattern

1. **A "Delivery Platform" MCP server** (remote, Entra ID auth, same RBAC as the console) exposing:
   - *Prompts*: `/delivery.start-assignment WI-4807/S2`. This returns the scoped Developer Assignment, so the developer stops copying it.
   - *Resources*: the approved spec, ADR, impact notes, Knowledge Fabric rules cited, acceptance criteria, and the test list, each with its fingerprint.
   - *Tools*:
     - `get_assignment`
     - `ask_question` (routes to the right approver, appears in Clarify)
     - `report_progress` (heartbeat)
     - `submit_completion_report` (structured: files changed, tests, spec conformance, deviations)
     - `link_pr`
2. **A thin VS Code extension** for what MCP cannot do:
   - status bar showing the assignment and its stage
   - a push-style "new assignment / answer received" notification (MCP has no push [3P])
   - automatic heartbeat
   - a one-click "Open in console"
   - a branch-name convention

   Optionally ship a **custom agent file** (`.github/agents/delivery-developer.agent.md`) with tool restrictions and a handoff to "Submit completion report".
3. **Belt and braces through ADO:** the PR description template and the linked Boards task carry the assignment ID. An **Azure DevOps service hook** (PR created/updated, build completed) lets the platform pick up the PR and pipeline even if the agent never calls `link_pr`.
4. **Keep copy-paste as the fallback,** for agents without MCP or locked-down machines, but make it secondary.
5. **Do not depend on Azure DevOps Remote MCP for non-Microsoft agents yet.** Claude Code, Cursor and Codex currently need the local ADO MCP server [V/I]. Our own MCP server should work with any MCP client.

---

## 4. Artifact store: Azure SQL + Blob vs spec-in-repo

| | **Platform record (ours)** | **Spec-in-repo (Spec Kit, Kiro, OpenSpec)** |
|---|---|---|
| Who can see and edit | Anyone with a role; non-developers in the browser | People with repo access; markdown in git |
| Approvals | First-class, named, separation of duties, backups | Only PR approval; usually self-authored |
| Versioning | Our versions + fingerprints | git history (excellent diffs) |
| Tamper evidence | Fingerprints; could add an immutable Blob policy (WORM) | git hashes, but rewriteable without branch rules |
| Multi-repo | One record spans repos | One copy per repo, or a separate spec repo |
| Agent context | Invisible to the IDE agent unless pushed or pulled | **Native**: the agent reads it in the workspace |
| Drift | Separate from code: can drift silently | Next to code, *still* drifts [V/3P] |
| Audit / retention / legal hold | Policy-driven (on the roadmap) | Weak; depends on repo policy |

**Regulatory expectations (brief).**
- **EU DORA, RTS 2024/1774 Art. 17** (ICT change management, building on DORA Art. 9(4)(e)): changes are recorded, tested, assessed, approved, implemented and verified; potential impact on ICT security is identified; emergency changes are approved after the fact; approving and implementing functions are separated [I: springlex/Advisera/MFSA summaries; check EUR-Lex for exact wording].
- **SOX ITGC:** auditors look for change approval evidence, author ≠ approver, and reproducibility. The PCAOB's 2026 inspection priorities reportedly include ITGCs over AI [3P: Uniqus]. Whether an AI can count as one party in SoD is unsettled, so confirm with the auditor [3P].
- **ISO/IEC 42001:** documents (plans) vs *records* (what was done), lifecycle records, event logging (A.6.2.8 per commentary), and protection of documented information from alteration [3P].

**Best fit: a hybrid. The platform is the system of record; the repo gets a mirror.**
1. Azure SQL + Blob stays the **system of record** for approvals, versions and fingerprints. Add a Blob immutability (WORM) policy for released evidence. This is cheap and strengthens the audit claim.
2. On Build, the platform writes a **read-only mirror** into the PR: `/specs/WI-4807/S2/spec.md`, `design.md`, `acceptance.md`. Each file has a front-matter header holding the record ID, version, fingerprint, approver and a "do not edit here, change via console" note.
3. The Completion Report checks that the mirrored fingerprint matches the approved version, so tampering or drift shows up. A **PR status check** ("Spec approved: v3, fingerprint matches") can block merge in Azure Repos branch policies.
4. If a developer *does* edit the mirror, the platform turns it into a **change proposal** that goes back through Specify, rather than silently diverging. This borrows OpenSpec's delta idea.

---

## 5. Ease of use: UX patterns to adopt and avoid

**Patterns that make spec-driven work easy (evidence)**
- **Progressive, one unit at a time.** Kiro gates each phase [V/3P], and our "one Story at a time" fits this. Show a **story rail** (S1 ✓ approved → S2 in Design → S3 not started).
- **Short by default.** Thoughtworks teams fixed verbosity by trimming templates and limiting files [I]. → Enforce **length budgets** and a 5-line plain summary at the top of every artifact. Put full detail behind "Full technical", which already exists.
- **Deltas, not whole documents.** OpenSpec's ADDED/MODIFIED/REMOVED is praised for brownfield work [I]. → Show **"What changed since v2"** on every re-approval, and write specs as changes to current behaviour.
- **Bug-shaped flow.** Kiro's bugfix spec (root cause, fix, regression, "must not change") [V/3P]. → Add a *Bug fix* request type with a reduced artifact set.
- **Design-first entry** for architect-led changes (Kiro 0.10) [V/3P].
- **Handoff buttons** (VS Code custom agents) [V]. → "Start in VS Code" deep link instead of "Copy prompt".
- **Clarifying questions up front** (Cursor plan mode, Spec Kit clarify) [V/3P]. → Our Clarify step is right. Route business questions to the requester (already on the P1 roadmap).
- **Traceability you can click**: requirement ID → spec section → task → test → deployment, as recommended in Microsoft Tech Community SDD guidance [V/3P]. → A per-run **trace view**: Request sentence → Story → Acceptance criterion → files/PR → tests → pipeline run → release record, with gaps in red.

**Patterns that make it painful (avoid)**
- Many long files per feature [I/3P].
- Approving without seeing the diff (rubber-stamping) [3P].
- Re-approving a whole document for a one-line change.
- Specs that silently go stale [V/3P].
- One flow for every change size ("waterfall") [3P].

---

## 6. Recommendations: "best fit, not forced"

Ranking = value × fit with the existing architecture. Effort: S < 2 wks, M 2–6 wks, L > 6 wks (rough, for a small team).

| # | What | Why (evidence) | Fit | Effort |
|---|---|---|---|---|
| 1 | **Delivery MCP server + "Start in VS Code"** replacing copy-paste: prompts / resources / tools for assignment, questions, heartbeat, completion report | The market moved to pull-by-MCP (ADO Remote MCP GA, Rovo MCP, Linear MCP, Kiro MCP prompts, VS Code MCP prompts as slash commands) [V]. Copy-paste is untracked and lossy. | Keeps the standalone agent; any MCP client works; Entra auth | M |
| 2 | **Thin VS Code extension** (status bar, notifications, auto heartbeat, branch naming, ships a `delivery-developer.agent.md`) | MCP has no push [3P]; custom agents and handoffs are native in VS Code 1.106+ [V] | VS Code is already the developer's tool | M |
| 3 | **Repo mirror of approved specs on the PR + spec-fingerprint PR status check** in Azure Repos branch policy | Developer-native context (what Spec Kit and Kiro do well) without giving up the system of record. Drift is the #1 SDD complaint [V/3P]. | SQL/Blob stay the source; ADO branch policies already exist | M |
| 4 | **End-to-end trace view** (request → story → acceptance criterion → PR/files → tests → pipeline → release) and a per-change evidence pack | DORA Art. 17 "recorded, tested, approved, verified" [I]; Microsoft SDD guidance on IDs across artifacts [V]. Approvers need to see what the agent did (round 1). | Data already exists in SQL + ADO links | M |
| 5 | **Spec-conformance section in the Completion Report** (each acceptance criterion: met / test / deviation) + drift flag if code diverges | Spec Kit users need community Verify/Reconcile extensions [3P]; Augment's Verifier agent [V]; ChatPRD's product-reviewer subagent [V] | Fits the existing Completion Report artifact | S–M |
| 6 | **Risk-tiered fast path** (already P0), including a **Bug fix** request type with a reduced artifact set | "Overkill for small tasks" and "waterfall" are top complaints [3P]; Kiro added bugfix specs [V] | Policy engine and roles exist | M |
| 7 | **Artifact length budgets + plain 5-line summary + "what changed since last version" diff** on every gate | Thoughtworks: trim templates [I]; Marmelab: review doubles [3P]; approval fatigue [3P] | Plain/technical toggle already exists | S |
| 8 | **Story rail on the run page** (stories × stages grid, current story highlighted, next story auto-starts after Build approval) | Makes "one story at a time" visible; smaller reviews | UI only | S |
| 9 | **Specs written as deltas against current behaviour** (ADDED / MODIFIED / REMOVED), seeded by Knowledge Fabric | OpenSpec's brownfield strength [I]; Spec Kit's brownfield gaps [3P] | Knowledge Fabric already indexes rules | M |
| 10 | **ADO service hooks** (PR created/updated, build completed) as the fallback signal, so the platform never depends solely on the agent calling back | Robustness; Copilot/Boards uses the same PR-link pattern [V] | Native ADO | S |
| 11 | **Blob immutability (WORM) for released evidence + retention/legal hold** | ISO 42001 protection of records; SOX/DORA evidence [I/3P] | Azure-native feature | S |
| 12 | **Import / export Spec Kit-compatible markdown** (constitution ↔ Knowledge Fabric rules, spec.md ↔ our spec) | Lets teams already on Spec Kit (1.0, 30+ agents) adopt us without throwing work away; a Spec Kit ADO extension already exists [3P] | Adapter only | M |

### Do NOT do (forced or misfit)
- **Do not replace the VS Code Developer Agent with a cloud coding agent.** The Copilot cloud agent does not support Azure Repos [V]. A regulated client wants a human-driven build, and we would compete head-on with GitHub, Cognition and OpenAI. An *optional* cloud agent can come later for GitHub-hosted repos, but it is not core.
- **Do not move the record of truth into the repo.** Approvals, SoD and audit evidence don't belong in markdown in git [I]. Mirror it; don't migrate it.
- **Do not build our own IDE or fork VS Code** (Kiro, Cursor, Devin Desktop own that).
- **Do not invent a new spec language** (EARS, Given-When-Then and markdown are enough). ServiceNow uses Given-When-Then [V], Kiro uses EARS [V].
- **Do not add more artifacts or stages.** Fight verbosity instead. Every new document makes the main complaint worse [I/3P].
- **Do not try to be a PM discovery tool** (VoC, roadmaps): Productboard Spark, JPD and ChatPRD own that. Accept their output as the request instead (an import from Jira / JPD / ChatPRD MCP).
- **Do not build agent-specific integrations for each IDE agent.** One MCP server covers Copilot, Claude Code, Cline and Cursor.
- **Do not auto-update the spec to match whatever the agent built.** Flag the deviation for an approver; this was the critique of Intent [3P].
- **Do not rely on Azure DevOps Remote MCP for non-Microsoft clients yet.** Entra client registration limits it [V/I].

---

## 7. Positioning

> **Spec Kit makes specs for developers; we make approved change for the business.** Spec Kit and Kiro help one developer turn an idea into code inside their repo. We let a business person ask for a change, and get it specified, assessed, designed, built, integrated, validated and released one story at a time. Named people approve every stage, with backups and separation of duties, and every decision is sealed into one audit-ready record. The developer still works in VS Code with their own agent, and the platform hands them exactly one approved story through MCP and collects the evidence back automatically. We are free to read like Spec Kit (the approved spec is mirrored into the PR) but governed like a change board.

**Three demo talking points**
1. **"Priya never opens a repo."** Show the plain-language plan and spec approval in the browser, then the same spec mirrored into the PR with its fingerprint check passing. That shows business participation *and* a developer-native spec.
2. **"One story, one assignment, no copy-paste."** In VS Code, run `/delivery.start-assignment`: the agent pulls the approved story, asks a question that lands in Clarify, then submits a completion report that ticks each acceptance criterion. The platform sees the PR and pipeline through ADO hooks.
3. **"Trace any line back to a business sentence."** Open the trace view: request → story → acceptance criterion → PR → tests → pipeline → release record → approver for each stage. Export the evidence pack. That answers the DORA Art. 17 and SOX change-evidence question in one click.

---

## Sources

**Spec Kit / SDD**
- [V] https://github.com/github/spec-kit (README, fetched 12 Nov 2026)
- [V] https://github.github.com/spec-kit/history.html
- [V] https://github.github.com/spec-kit/concepts/spec-persistence.html
- [V] https://github.com/github/spec-kit/issues/1436 (brownfield extension)
- [V] https://gh.r-mj.com/github/spec-kit/discussions/1119 (multi-repo test; mirror)
- [V] https://gh.hhj520.top/github/spec-kit/discussions/501 and https://tgfed.nhyvvfeijnh.workers.dev/github/spec-kit/discussions/1671 (drift; mirrors)
- [3P] https://speckit-community.github.io/extensions/reconcile
- [3P] https://speckit-community.github.io/extensions/maqa-azure-devops
- [3P] https://gh.r-mj.com/pragya247/spec-kit-azure-devops
- [I] https://visualstudiomagazine.com/articles/2026/05/12/github-spec-kit-takes-off-as-antidote-to-piecemeal-vibe-coding.aspx
- [3P] https://tproger.ru/news/github-vypustil-spec-kit-1-0-11-s-idempotentnym-dobavleniem-kata
- [I] https://www.thoughtworks.com/radar/languages-and-frameworks/github-spec-kit
- [I] https://www.thoughtworks.com/radar/tools/openspec
- [I] https://www.thoughtworks.com/radar/techniques/spec-driven-development
- [I] https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html (could not fetch; via secondary summaries)
- [3P] https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html
- [3P] https://byteiota.com/spec-driven-development-just-waterfall-2-0/
- [3P] https://wavect.io/blog/github-spec-kit-production-guide/
- [I] https://www.infoq.com/articles/enterprise-spec-driven-development (excerpt only)
- [3P] https://dev.to/jefe_cool/spec-driven-development-why-mcp-is-the-missing-integration-layer-for-enterprise-ai-37jl
- [3P] https://abnormalbuilders.substack.com/cp/189666914
- [3P] https://normalcomputing.com/blog/building-sdd-for-real-production-systems-sdd-part2
- [V] https://openspec.dev/docs/core-concepts
- [3P] https://codemyspec.com/blog/openspec-explained
- [V] https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry/
- [3P] https://codemyspec.com/blog/tessl-review
- [3P] https://docs.bmad-method.org (via https://jimmysong.io/ai/bmad-method, https://www.nitorinfotech.com/blog/what-is-the-bmad-method-a-complete-guide-to-ai-driven-software-development-in-2026/)
- [V] https://www.augmentcode.com/intent

**Kiro**
- [V] https://kiro.dev/blog/introducing-kiro/
- [V] https://kiro.dev/blog/specs-bugfix-and-design-first/
- [V] https://kiro.dev/docs/specs/bugfix-specs/
- [V] https://kiro.dev/blog/introducing-kiro-autonomous-agent/
- [V] https://kiro.dev/docs/autonomous-agent/github/
- [V] https://kiro.dev/blog/credit-pooling/
- [V] https://alpha.us-east-2.kiro.adc.aws.dev/changelog/ide/0-10
- [3P] https://codemyspec.com/blog/kiro-specs-explained
- [3P] https://www.verdent.ai/guides/agents/kiro-spec-driven-development
- [I] https://infoq.com/news/2025/08/aws-kiro-spec-driven-agent
- [I] https://www.theregister.com/2025/12/02/aws_kiro_devops_coding_agents/
- [3P] https://dev.classmethod.jp/articles/kiro-ide-design-first-workflow/

**IDE agents, MCP, trackers**
- [V] https://devblogs.microsoft.com/devops/azure-devops-remote-mcp-server-ga/
- [I] https://infoq.com/news/2026/08/azure-devops-remote-mcp-ga
- [V] https://learn.microsoft.com/en-us/azure/devops/boards/github/work-item-integration-github-copilot
- [V] https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/integrate-cloud-agent-with-azure-boards
- [V] https://learn.microsoft.com/en-us/azure/devops/release-notes/2026/boards/sprint-268-update
- [V] https://learn.microsoft.com/en-au/azure/devops/release-notes/2026/sprint-275-update
- [V] https://devblogs.microsoft.com/devops/azure-boards-integration-with-github-copilot-private-preview/ (Azure Repos not supported, comment thread)
- [V] https://devblogs.microsoft.com/devops/copilot-code-reviews-for-azure-repos-public-preview/
- [I] https://infoq.com/news/2026/09/copilot-code-review-azure-repos
- [V] https://github.blog/developer-skills/github/less-todo-more-done-the-difference-between-coding-agent-and-agent-mode-in-github-copilot/
- [V] https://github.blog/changelog/2025-11-03-github-copilot-policy-now-supports-agent-mode-in-the-ide/
- [V] https://github.blog/news-insights/company-news/welcome-home-agents/
- [V] https://code.visualstudio.com/api/extension-guides/ai/mcp
- [V] https://code.visualstudio.com/blogs/2025/06/12/full-mcp-spec-support
- [V] https://code.visualstudio.com/docs/copilot/customization/custom-agents
- [V] https://code.visualstudio.com/updates/v1_110
- [V] https://developer.atlassian.com/cloud/rovo-mcp/
- [V] https://www.atlassian.com/blog/announcements/remote-mcp-server
- [V] https://linear.app/changelog/2026-04-23-linear-agent-mcp-support
- [3P] https://www.morphllm.com/linear-mcp-server
- [3P] https://glama.ai/mcp/servers/@eyaltoledano/claude-task-master
- [V] https://code.claude.com/docs/en/features-overview
- [V] https://docs.factory.ai/cli/user-guides/specification-mode
- [V] https://docs.devin.ai/desktop/devin-desktop-faq
- [V] https://www.cursor.com/changelog
- [I] https://techcrunch.com/2026/06/02/openai-launches-new-codex-tools-for-white-collar-work/

**PDLC / platforms**
- [V] https://www.atlassian.com/blog/jira/introducing-jira-planner
- [V] https://www.atlassian.com/software/jira/guides/agentic-engineering/spec-driven-development-jira
- [I] https://www.techtarget.com/searchitoperations/news/366645858/Atlassian-Jira-Planner-joins-spec-driven-development-AI-coding-trend
- [I] https://sdtimes.com/augmented-software-development/how-atlassians-new-jira-ai-features-give-coding-agents-context-to-build-software/
- [V] https://www.atlassian.com/licensing/rovo-dev
- [V] https://www.atlassian.com/blog/announcements/rovo-dev-now-generally-available-in-vs-code
- [V] https://support.atlassian.com/jira-product-discovery/docs/explore-atlassian-intelligence-in-jira-product-discovery/
- [V] https://www.productboard.com/blog/introducing-spark-ai-product-management-agent/
- [V] https://support.productboard.com/hc/en-us/articles/44571897288723-Productboard-Spark
- [V] https://www.chatprd.ai/.well-known/agent-skills/chatprd/SKILL.md
- [V] https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-Build-Agent-now-works-inside-every-major-AI-coding-tool-governed-by-default
- [V] https://www.servicenow.com/docs/r/application-development/servicenow-ai-sdlc.html
- [V] https://www.harness.io/blog/introducing-harness-agent-dlc
- [I] https://siliconangle.com/2026/08/27/harness-tackles-influx-of-agent-delivered-code-with-code-repository-and-ai-code-review/
- [V] https://docs.gitlab.com/user/duo_agent_platform/
- [I] https://heise.de/-11143439
- [I] https://infoq.com/news/2026/06/microsoft-foundry-agents
- [V] https://devblogs.microsoft.com/azure-sdk/microsoft-foundry-azure-developer-cli-ga/

**Evidence, regulation, review load**
- [I] https://www.springlex.eu/en/packages/dora/rts-rmf-regulation/article-17/
- [I] https://www.mfsa.mt/publication/ict-change-management-under-the-digital-operational-resilience-act-dora/
- [3P] https://advisera.com/cdr-2024-1774/ict-change-management/
- [3P] https://uniqus.com/internal-controls-over-generative-ai/
- [3P] https://www.floqast.com/blog/7-biggest-sox-compliance-risks-of-using-ai-in-accounting-and-what-to-do-about-them
- [3P] https://sprinto.com/hub/iso-42001-documentation/
- [3P] https://sprinto.com/hub/iso-42001-ai-lifecycle-evidence/
- [I] https://services.google.com/fh/files/misc/2025_state_of_ai_assisted_software_development.pdf
- [I] https://www.infoq.com/news/2025/09/dora-state-of-ai-in-dev-2025
- [3P] https://votazz.co/2026/07/07/ai-code-review-bottleneck/ (cites EASE 2026, Sonar)
- [3P] https://hackernoon.com/ai-is-writing-more-codeand-creating-a-review-bottleneck
- [I] https://leaddev.com/ai/as-ai-helps-us-write-more-code-whos-catching-the-bugs

**Not reachable from this session** (network allowlist): kiro.dev, martinfowler.com and infoq.com page fetches. Claims from these are based on search excerpts.
