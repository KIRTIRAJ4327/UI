# State of AI maturity in the software / product delivery lifecycle (SDLC / PDLC), 2026

**Focus: Canadian banks, with a region-by-region comparison.** Prepared 12 Nov 2026.

**Scope.** This is round 4. It builds on `review/panel/market.md` (competitors), `market-agentic-sdlc.md` (spec-driven development, IDE hand-off) and `future-readiness.md` (standards, regulation, autonomy). Findings from those rounds are cited, not repeated.

**Method.** About 95 web searches on 12 Nov 2026, in parallel batches, standard and extended mode. **Every direct page fetch failed**: the session's network allowlist blocked evidentinsights.com, survey.stackoverflow.co, stackoverflow.blog, mckinsey.com, osfi-bsif.gc.ca, newswire.ca, thelogic.co, advisor.ca and scotiabank.investorroom.com. Every figure below therefore comes from a search excerpt of the named page, or from secondary coverage of it. Nothing was read in full. Treat each number as "reported by the named source, primary page not opened" and verify before it goes on a slide.

**Tags.** [V] = the company's or vendor's own source. [I] = independent (regulator, analyst firm, academic, reputable press, law firm). [3P] = third-party blog or aggregator. [?] = not verified. "Analyst estimate" = my own judgement, with the basis stated. "Not found" = searched, nothing credible.

**A caution on bank numbers.** Almost every productivity figure a bank publishes is self-reported, uses its own definition, and has no published method. They are not comparable with each other or with controlled studies.

---

## 0. Key findings

1. **Assisted coding is close to universal; governed agentic delivery is not publicly evidenced at any bank.** Surveys put AI use among developers at 83–90% (Stack Overflow 2026, DORA 2025, JetBrains 2026) [I/V]. No bank found, in any region, has publicly described a multi-stage agentic delivery flow with named human approvers at each stage. The closest are engineering-led agent programmes (Goldman Sachs, Citi, Commonwealth Bank, Santander, Bradesco).
2. **Individual output is up; system-level delivery is mixed or worse.** Telemetry studies report more tasks and pull requests per developer, but also five-times-longer review times, more bugs and more incidents per change (Faros 2026) [V], falling main-branch success (CircleCI 2026) [V], and higher delivery instability (DORA 2025 and DORA's 2026 ROI report) [I]. The review and verification step is now the bottleneck.
3. **Trust lags use.** Only 6.6% of developers would trust AI with an important decision (Stack Overflow 2026) [I via press]. 96% do not fully trust AI code, yet only 48% always check it (Sonar 2026) [V].
4. **Canadian banks sit at "assisted coding at scale, agents emerging" — about level 1.5 on a 0–4 scale (analyst estimate).** RBC and TD rank 3rd and 10th of 50 on the Evident AI Index (6 Oct 2026) [I]. That index measures overall AI maturity, not software delivery. On software delivery specifically, the public evidence shows roll-outs of coding assistants to 2,000–7,000 engineers per bank, with early agent use at RBC, Scotiabank, Manulife and Sun Life.
5. **The leading US banks, Commonwealth Bank and Santander are about half a level ahead** on public evidence of coding agents in daily engineering work (about level 2.0).
6. **Canada's regulator has been unusually explicit about AI-generated code.** OSFI's July 2026 bulletin on generative and agentic AI asks institutions to validate AI-generated code before deployment and to put approval checkpoints on high-risk actions [I]. Guideline E-23 (model risk) takes effect on 1 May 2027 [I]. In the US, the equivalent model-risk guidance (SR 26-2) explicitly leaves generative and agentic AI out of scope [I/3P].
7. **What this means for the client.** A governed platform with named gates and an evidence trail matches where regulation is heading and fills a gap no Canadian bank has publicly closed. Its main risk is adding eight review points to a system whose known bottleneck is already review.

---

## 1. A maturity model for AI in the SDLC / PDLC

### 1.1 What published frameworks exist

| Framework | What it gives | Limits | Tag |
|---|---|---|---|
| **DORA AI Capabilities Model** (Google, Sept 2025) | Seven organisational capabilities that amplify AI's benefit: a clear and communicated AI stance; healthy data ecosystems; AI-accessible internal data; strong version control; working in small batches; user-centric focus; quality internal platforms. Based on 78 interviews and the ~5,000-respondent 2025 survey. | A capability model, not levels. It says what makes AI pay off, not how autonomous the delivery is. | [I] |
| **DORA 2025 team profiles** | Seven team clusters; AI is "an amplifier" of existing strengths and weaknesses. | One critic notes only two clusters clearly benefit and the sample skews to DORA-aware teams [3P]. | [I] |
| **DORA "ROI of AI-assisted Software Development" (2026.01, ~30 Apr 2026)** | A J-curve: performance dips before it improves. DORA is **not running a 2026 annual survey**, so there is no 2026 "State of" report. | Secondary coverage only; the pause is reported by one vendor blog. | [I], pause [3P] |
| **Gartner** | "Software Engineering Maturity Model for the AI Era" (29 Jan 2026) and "Maturity Model for AI-Native Software Engineering" (12 Mar 2026). A Gartner abstract (9 Sept 2026) says only **5%** of software engineering leaders rate their AI maturity as high. | Level names are paywalled: **not found**. | [I], abstracts only |
| **McKinsey, "Beyond the copilot: scaling the agentic PDLC"** (Q2 2026 survey, n=334) | Separates "adopters" (AI added, roles and ways of working unchanged) from organisations that redesign the whole product development system. Only 25% of director-and-above respondents report top-level acceleration. Adopters reach top-accelerator status 27% of the time. | Archetypes, not numbered levels. Full text not read. | [I] |
| **Thoughtworks** (Looking Glass 2026; Radar Vol. 34, Apr 2026) | Defines "AI-first software delivery" as end-to-end use of generative and agentic systems from requirements to maintenance. Reports a typical uplift of **up to 15%** in delivery speed and calls bigger claims exaggerated. Separates feedforward controls (skills, specs) from feedback controls (tests, linters). | No formal level model. | [I] |
| **Autonomy ladders** (Shapiro L0–L5; Cloud Security Alliance L0–L5 v2.0, Mar 2026; academic "Levels of Automated Code Generation") | Levels defined by what humans still review and approve, by analogy with driving automation. | No agreed standard as of mid-2026 [3P]. Mostly blogs; CSA and the academic taxonomy not read. | [3P] |
| **BCG Applied AI Index 2026** | 7.5% of companies "future-built", 41% scaling (all sectors, 1,300+ executives). | Not software-specific. | [I via press] |
| **Forrester** | — | **Not found.** | — |
| **Evident AI Index (banks)** | Ranks 50 banks on Talent, Innovation, Leadership, Transparency using 75 indicators. | Measures enterprise AI maturity from public disclosure. It is **not** an SDLC measure. | [I] |

**Conclusion.** No published framework gives both (a) numbered levels of delivery autonomy and (b) governance criteria suited to a regulated bank. The model below combines the autonomy ladders (what the human still approves), the round-1 autonomy scale already used in `market.md`, and DORA's capability findings (what must be true for a level to be sustainable).

### 1.2 Proposed five-level model (L0–L4)

A level is reached only when its criteria are true for **most engineering work**, not for a pilot. The frontier (best team) is recorded separately.

| Level | Name | Who does the work / who decides | Observable criteria (all should be evidenced) | Typical evidence in public sources |
|---|---|---|---|---|
| **L0** | None or unsanctioned | Humans do everything. Any AI use is individual and unmanaged. | No approved AI tool; no AI policy for engineering; no usage data. | Nothing disclosed, or bans. |
| **L1** | Assisted coding in the IDE | Developer writes; AI suggests and answers. Developer accepts each suggestion. | Approved assistant licensed to most engineers; stated AI stance and acceptable-use rules; adoption tracked (active users); AI limited mainly to code, tests and documentation; normal pull-request review unchanged. | "N developers on Copilot", "X% active", self-reported productivity %. |
| **L2** | Task agents that open pull requests | An agent completes a bounded task (fix, migration, test suite) and proposes a change. A developer reviews and merges. | Agent mode or background/cloud agents in routine use; agent work arrives as a pull request or diff; agent identity distinguishable from human in the record; branch protection and review apply to agent changes; AI share of code or pull requests is measured; AI-assisted code review or test generation in use. | "Coding agents used by X% of engineers", "Y% of code AI-generated", named agent products, migration case studies. |
| **L3** | Governed multi-stage agentic delivery with human gates | Agents draft across stages (request, requirements, design, code, test, release). **Named, accountable humans approve at defined gates.** | One traceable record from business request to release; named approver per gate with separation of approver and implementer; risk tiers that set which gates apply; evidence trail (who, what, which model and version, when); model inventory and change control on prompts and models; quality loop (evals, send-back rate, change failure rate) reported; kill switch. | A described workflow with roles and gates, audit evidence, regulator-mapped controls. **Not found at any bank.** |
| **L4** | Policy-driven autonomous delivery | Agents deliver low-risk change end to end. A versioned policy approves; a named human owns the policy and is notified or samples after the fact. | Policy-as-code with a named owner; automatic approval for defined low-risk classes with a record of the policy version applied; continuous evaluation and automatic rollback; humans gate only high-risk change; regulator-accepted accountability model. | Auto-approval rates by risk class; policy registry. **Not found at any bank.** |

**Why these boundaries.**
- **L1 → L2** is the move from suggestions to delegated tasks. GitHub reports agents started more than 40% of pull requests on its platform in September 2026, up from 17% in March [V via press], so this boundary is being crossed quickly in the general market.
- **L2 → L3** is the move from "a developer reviews a diff" to "the organisation governs the whole change". This is what OSFI's July 2026 bulletin, DORA RTS Art. 17 (round 2) and the Bank of England/FCA survey findings point at. It is an organisational change, not a tooling one, which matches McKinsey's adopter finding [I].
- **L3 → L4** needs policy-based approval. Round 3 showed ServiceNow, Harness and AWS already offer it for low-risk change [V]. In UK financial services, no more than 9% of firms expect agents to approve customer outcomes, execute payments or change controls even within 12 months [I via secondary].

**Sustaining conditions (from DORA).** A team that reaches L2 without small batches, strong version control and a good internal platform will show the instability pattern in section 2.3. These seven capabilities are the precondition for holding any level above L1 [I].

---

## 2. Global state, with numbers

### 2.1 Adoption of assistants and agents

| Measure | Value | Source and date | Tag |
|---|---|---|---|
| Technology professionals using AI at work | 90% (up 14 points on 2024); ~5,000 respondents | DORA 2025 (Sept 2025) | [I] |
| Developers using AI in some capacity | 83% | Stack Overflow 2026 (published 6 Oct 2026; ~30,900 responses, 169 countries) | [I via press] |
| Use AI coding assistants or coding agents | 65.9% | Stack Overflow 2026 | [I via press] |
| Use AI agents or automated agent workflows | 26.2% | Stack Overflow 2026 | [I via press] |
| Do not use AI tools | 17.2% | Stack Overflow 2026 | [I via press] |
| Use AI agents at work (pulse survey, ~1,100 people) | 59%, up from 31% a year earlier; daily use 37% (from 14%) | Stack Overflow pulse, fielded Apr 2026, published 27 May 2026 | [I] |
| Professional developers using AI coding agents at least weekly | 90%; daily 68%; 15,000+ developers, May–Jul 2026 | JetBrains Developer Ecosystem 2026 | [V] |
| Share of committed code that is AI-generated or assisted | 42% (developers expect 65% by 2027) | Sonar State of Code, 8 Jan 2026 | [V] |
| Share of work code fully generated by agents | ~47% on average (secondary reports do not reconcile) | JetBrains 2026 | [V via 3P] |
| Pull requests on GitHub started by agents | >40% in Sept 2026, up from 17% in Mar 2026 | GitHub Octoverse, 28 Oct 2026 | [V via press] |
| Same, independent sample of public pull requests | 32.5% agent-marked (to 27 Sept 2026) | Third-party tracker | [3P] |
| New code at Google that is AI-generated and engineer-approved | 75% (Apr 2026), ~50% (late 2025), ~25% (Oct 2024) | Google CEO, Cloud Next, 22 Apr 2026 | [V via press] |
| Companies scaling software coding agents | ~20% (31% at larger enterprises) | McKinsey State of AI 2026, 25 Aug 2026 | [I via press] |
| Enterprise software engineers relying on coding agents by 2028 | >70% (forecast) | Gartner, May 2026 | [I via press] |

**Reading note.** The Stack Overflow 26% and 59% agent figures and the JetBrains 90% figure measure different things with different samples. They cannot be put on one trend line. The safe statement is: assistant use is the norm; agent use is somewhere between a quarter and most of professional developers depending on definition, and it roughly doubled in a year.

### 2.2 Measured productivity effects

| Study | Design | Finding | Tag |
|---|---|---|---|
| **METR (Jul 2025)** | Randomised trial, 16 experienced open-source developers | AI-allowed tasks took **19% longer**; developers believed they were ~20% faster | [I] |
| **METR update (24 Feb 2026)** | Follow-on experiment from Aug 2025 | METR calls the earlier slowdown "outdated" and says speedups "now seem likely". Reported point estimate: about −18% task time for returning developers, 95% interval roughly −38% to +9%. METR calls the new data unreliable (selection effects) and is changing its design. | [I]; figures via [3P] |
| **Google internal trial** | Randomised, 96 engineers, one enterprise task | ~21% less time; wide confidence interval | [I via 3P] |
| **Cui et al. (Microsoft, Accenture, one Fortune 100 firm)** | Three field experiments | ~26% more completed tasks pooled; Microsoft 12.9–21.8% more pull requests per week; Accenture 7.5–8.7% | [I via 3P] |
| **Microsoft dose-response study (arXiv, Jun 2026)** | Observational, 16,223 engineers | 40.5% more pull requests in highest-usage weeks vs zero-usage weeks; authors note confounding | [I] |
| **Uplevel (2024)** | Observational, ~800 developers | No significant efficiency gain; bug rate +41% with Copilot access | [V via press] — older |
| **DORA 2025** | Survey, ~5,000 | AI now linked to higher delivery throughput (a reversal from 2024) **and** still linked to higher delivery instability | [I] |
| **Faros "Acceleration Whiplash" (2026)** | Telemetry, ~22,000 developers, 4,000+ teams, two years | Task throughput per developer +33.7%; epics per developer +66%; median review time ×5 (+441.5%); bugs per developer +54%; incidents per pull request +242.7%; 31% more pull requests merged with no review | [V] |
| **CircleCI State of Software Delivery 2026** | 28.7m CI workflows | Overall throughput +59%; median team feature-branch +15% but **main-branch −7%**; main-branch success rate 70.8% (benchmark 90%). The "top 5% benefit" framing is contested [3P]. | [V] |
| **CodeRabbit (Dec 2025)** | 470 open-source pull requests | AI pull requests 10.83 issues each vs 6.45 for human | [V] — older |
| **Veracode GenAI Code Security (28 Jul 2026)** | 100+ models, security test tasks | Average security pass rate 56% (55% four years earlier); ~44% of tasks produced an OWASP Top 10 flaw. A reported October edition (62% pass) is unverified [?]. | [V] |
| **Thoughtworks (2026)** | Practitioner judgement | Typical delivery-speed uplift up to 15% | [I] |
| **Gartner (2026)** | Leader survey | Only 35% of software engineering leaders report significant ROI from AI in the SDLC | [I], article excerpt |
| **McKinsey (Q2 2026, n=334)** | Leader survey | 25% of senior respondents report top-level acceleration | [I] |

**What the evidence supports.**
- Individual task speed and output volume: up, on most 2026 evidence. The one rigorous negative result (METR 2025) is now disowned as outdated by its own authors, but they also say their newer positive number is unreliable.
- Delivery to production: not clearly up. Review queues, defect rates and failed merges absorb much of the extra output.
- Vendor telemetry (Faros, CircleCI, Sonar, CodeRabbit, Veracode) comes from firms that sell review, testing or measurement tools. The direction is consistent across them and with DORA, but the magnitudes should not be quoted as neutral facts.

### 2.3 Where in the lifecycle AI is used

| Stage | Evidence of use | Tag |
|---|---|---|
| **Idea / requirements / planning** | No robust 2026 survey percentage found. Product tools exist (Jira Planner, Productboard Spark, ChatPRD: round 2). | **Not found** |
| **Design / architecture** | No survey percentage found. | **Not found** |
| **Writing new code** | 71% of respondents who write code use AI for it (DORA 2025). 67% use AI to generate code in areas they know (Stack Overflow 2026). | [I]; DORA figure via secondary |
| **Modifying existing code** | 66% (DORA 2025) | [I via 3P] |
| **Debugging** | 61% (Stack Overflow 2026) | [I via press] |
| **Testing** | 62% use AI to create test cases (DORA 2025) | [I via 3P], to verify against the report's figure |
| **Code review** | 56% (DORA 2025). A 2026 survey of 49 engineering leaders reports a rise from 30% to 69% (Madrona). GitHub says Copilot code review has run 60m+ reviews [V via 3P]. | [I via 3P]; [3P] |
| **Documentation** | 64% (DORA 2025); 48% → 78% (Madrona 2026, n=49) | [I via 3P]; [3P] |
| **Release / deploy / operate** | 20% use AI for deploying, operating or troubleshooting production (Stack Overflow 2026) | [I via press] |

**Pattern.** Use is concentrated in the middle of the lifecycle (code, debug, test, docs). It is thin at both ends: the business-facing front (requirements, design) has no good data, and the production end is at about one in five. The DORA percentages use "people whose job includes this task" as the base; the Stack Overflow ones use all respondents. They are shown together only to indicate the shape.

### 2.4 Share of organisations at each level

No credible source publishes a distribution on a level scale like the one above. The usable proxies are:

| Proxy | Value | Suggests | Tag |
|---|---|---|---|
| Developers not using AI tools | 17.2% (Stack Overflow 2026) | Upper bound for L0 among individuals | [I via press] |
| Companies scaling coding agents | ~20%; 31% of larger enterprises (McKinsey 2026) | Lower bound for L2 or above | [I via press] |
| Leaders reporting top-level acceleration | 25% (McKinsey Q2 2026) | Upper bound for "L2 done well" | [I] |
| Leaders rating their AI maturity high | 5% (Gartner, Sept 2026 abstract) | Order of magnitude for L3 or above | [I], abstract only |
| "Future-built" companies, all sectors | 7.5% (BCG 2026) | Same | [I via press] |
| UK financial firms letting agents act with broad autonomy | ~2% (BoE/FCA 2026) | Order of magnitude for L4 in financial services | [I via secondary] |
| Developers at Build stage rating maturity "formal or better" | 37.4% (Info-Tech, Jun 2026, n=578 leaders) | Formal process trails use | [I via 3P] |

**Analyst estimate (large enterprises, late 2026), not a measured figure:** L0 about 10%, L1 about 45%, L2 about 35%, L3 about 8%, L4 about 2%. Basis: the proxies above, read as bounds. The uncertainty on each band is at least ±10 points. Do not chart this without the "analyst estimate" label.

### 2.5 Main blockers

1. **Trust and verification.**
   - 6.6% would trust AI with an important decision; 48% trust output when it is easy to verify; 78.7% say source attribution matters (Stack Overflow 2026) [I via press].
   - In 2025, 46% distrusted AI accuracy against 33% who trusted it, and 3% trusted it highly (Stack Overflow 2025) [I]. A 2026 equivalent was not found.
   - 30% have little or no trust in AI-generated code (DORA 2025) [I].
   - 96% do not fully trust AI code is correct, but only 48% always check before committing (Sonar 2026) [V].
2. **The review bottleneck.** Review time ×5 and 31% more unreviewed merges (Faros 2026) [V]. 38% say AI code takes more effort to review than human code, against 27% who say less (Sonar 2026) [V via press].
3. **Security.** A 56% security pass rate that has barely moved in four years (Veracode, Jul 2026) [V]. 81% of developers have security or privacy concerns about agents (Stack Overflow 2025) [I].
4. **Oversight habits.** 60% block agents from making unapproved system changes; 69% of agent workflows use a single agent (Stack Overflow pulse, May 2026) [I]. Agents are kept on a short leash.
5. **Governance and process.** Tool roll-out without changing roles or ways of working rarely reaches top performance: 27% (McKinsey 2026) [I]. In Evident's 2026 index, 80% of leading banks have sophisticated control mechanisms against 40% of the rest [I via excerpt].
6. **Return on investment.** Only 12 of 50 banks report a realised or projected return across their AI activity (Evident 2026; a second excerpt says 38 of 50 report none) [I]. 37% of companies attribute any EBIT impact to AI (McKinsey 2026) [I via press].
7. **Cost.** Gartner predicts AI coding costs per developer will exceed the average developer's salary by 2028 as token use grows (24 Jun 2026) [I].

---

## 3. Canadian banks and insurers

### 3.1 What each has said publicly about AI in software delivery

| Institution | Public evidence on software engineering / developer tooling / agents | Date | Tag |
|---|---|---|---|
| **RBC** | "Empowering 6,000+ developers through a centralized developer platform" that includes AI-powered code generation. | RBC AI page, undated (seen Nov 2026) | [V] |
| | "How RBC is enhancing developer productivity with generative and agentic AI": generative and agentic AI across the application lifecycle, with IBM as a partner. Mainframe developers use IBM watsonx Code Assistant for Z to analyse COBOL and generate tests. | 21 May 2026 | [V via trade press] |
| | CEO said gen AI is deployed for coding (among other uses); CFO cited "AI-enabled developer productivity". | FY2025 Q4 call | [I via press] |
| | 10,000 technologists use AI tools for work such as software development; 72,000+ employees use RBC Assist or Aiden. | 2026 | [3P], unverified |
| | Borealis AI (in-house research institute): 100+ PhD scientists, 850+ AI developers and data engineers. RBC Lumina platform on a large private GPU cluster. ATOM foundation model used in 15 products in 2025. | 2025–26 | [3P/V] |
| | Target of C$700m–C$1bn enterprise value from AI by 2027 (investor day, Mar 2025). | 2025 | [I via press] |
| | Blocks third-party personal AI agents from online banking (customer side, not SDLC). | Late Oct 2026 | [I] |
| **TD** | AI tools "rolled out to all TD engineers and developers"; **76% actively use GitHub Copilot**; pull-request throughput up **80% year over year (2025→2026)**, "aided by" Copilot. | TD Stories, undated | [V], single source, excerpt only |
| | 7,000+ engineers using AI for software development; 40,000+ colleagues on Copilot. | May 2026 earnings call | [3P], unverified |
| | US unit: 1,800 developers on GitHub Copilot. | 2026 | [3P] |
| | GitHub Copilot pilot for engineers announced. | 2023 | [V] — older |
| | Layer 6 (in-house AI research). C$1bn AI value target; ~C$195m delivered in first three quarters of FY2026. | 2026 | [3P], unverified |
| | Will block third-party personal AI agents where authentication is required. | Oct 2026 | [I] |
| **BMO** | "Among our 2,000-plus software developers, we're targeting a 20% to 30% productivity uplift", using gen AI to accelerate code development. Employee AI adoption over 96%. | Investor Day, 26 Mar 2026 | [V] |
| | Later reported as AI tools scaled to 2,000+ developers with a 20–30% improvement. | Fiscal Q2 2026 | [3P] |
| | BMO Institute for Applied Artificial Intelligence and Quantum launched to govern AI at scale. | 2026 | [V via press] |
| | Agent-developer job posting (builds AI agents; not evidence of agents in BMO's own SDLC). | Mid-2026 | [V], weak |
| **Scotiabank** | Scotia Intelligence launched; **Scotia Navigator** "provides advanced AI-powered coding assistance to automate routine tasks for technical teams". | 13 Apr 2026 | [V] |
| | 71,000+ employees with assistive AI; **5,500 engineers using AI to support coding productivity**. | 10 Jun 2026 | [V] |
| | "About 5,000 coders and engineers" actively using AI tools. | Financials summit, ~Aug–Sep 2026 | [I transcript] |
| | Founding member (with Sun Life, TELUS) of an AI Consortium whose flagship project is an **Agentic Control Plane** to govern models, agents and inference. | Jul 2026 (date from one aggregator) | [V/I] |
| **CIBC** | CIBC AI platform launched and GitHub Copilot rolled out; pilot showed a 10–15% productivity boost for developers. | Aug 2024 | [V] — older |
| | "More than 1,700 developers now use GitHub Copilot"; now "focused on scaling agentic patterns" with human oversight. | Microsoft customer story, 7 Jan 2026 | [V] |
| | 1,800+ developers on Copilot; plans to extend to all developers. | Deloitte case study, undated | [V] |
| **National Bank** | No statement on developer AI tooling found. Job postings mention "integrating generative AI into the development cycle" and "AI-Assisted Development". CEO has said AI alone will not give banks a lasting edge. | 2026 | [V] postings, weak; [I] |
| **Desjardins** | All employees have access to Microsoft Copilot (chat). **Nothing found on developer coding tools or agents.** | Apr 2025 | [I] — older |
| **Manulife** | Developers "continue to adopt assisted and autonomous AI capabilities and have increased their productivity by 30 per cent"; GitHub Copilot "laid a strong foundation". Example: mortgage renewal application rebuilt in weeks. | Microsoft partnership release, 2026 | [V] |
| **Sun Life** | Developers "broadly" use GitHub Copilot. | ~late 2025 | [I interview] |
| | CIO: technology teams use agentic AI to help develop and test code. | 31 Aug 2026 | [I interview] |
| | Founding member of the AI Consortium (Agentic Control Plane). | 2026 | [V/I] |

**Not found for any Canadian institution:** share of code that is AI-generated; named coding-agent products other than GitHub Copilot, Scotia Navigator and watsonx Code Assistant for Z; use of Claude Code, Cursor or Devin; any description of gated, multi-stage agentic delivery; AI use in requirements or release stages; patents specific to AI in software delivery.

### 3.2 Evident AI Index (edition published 6 Oct 2026; 50 banks)

| Bank | 2026 rank | Change | Tag |
|---|---|---|---|
| RBC | 3 | unchanged (top Canadian bank). Pillar ranks: Talent 8, Innovation 5, Leadership 2, Transparency 3 | [I] |
| TD | 10 | +3 | [I] |
| BMO | 20 | −1 | [I via press] |
| CIBC | 21 | +1 (talent score improved) | [I via press] |
| Scotiabank | 30 | −1 | [I via press] |
| National Bank | not included | — | [I via press] |

- All five large Canadian banks are in the top 30 [I: Globe and Mail].
- **Scores (points) were not found**; only ranks. The average bank score rose 26%, or 9.6 points, in a year [I via excerpt].
- Sources differ on whether RBC has been third for four or five consecutive years.
- BMO separately reports the highest available scores on Responsible AI indicators and a No. 2 ranking for reported AI use-case outcomes [V].

### 3.3 Placement on the maturity scale (public evidence only)

The number is the level at which most engineering work appears to operate. "Frontier" is the highest level with any public evidence. These are **analyst estimates**. A bank may be more advanced internally than it has disclosed.

| Institution | Level (range) | Frontier evidenced | Confidence | Basis |
|---|---|---|---|---|
| **RBC** | 1.5 (1–2) | L2 | Medium | Central platform with AI code generation for 6,000+ developers [V]; "generative and agentic AI" across the application lifecycle [V via press]. No agent adoption rate, no AI code share, no gated workflow disclosed. |
| **TD** | 1.5 (1–2) | L1–L2 | Medium | Strongest adoption data in Canada: all engineers enabled, 76% active, throughput +80% [V, single source]. Agent use in engineering not stated. |
| **Scotiabank** | 1.5 (1–2) | L2 | Medium | Own coding assistant, 5,000–5,500 engineers [V/I]; governance investment through the Agentic Control Plane [V/I]. |
| **CIBC** | 1.0 (1–1.5) | L1 | Medium | 1,700–1,800 developers on Copilot, not yet all developers [V]; "agentic patterns" stated as a direction, not specific to engineering [V]. |
| **BMO** | 1.0 (1–1.5) | L1 | Medium | 2,000+ developers; the 20–30% figure was stated as a target in March 2026 [V]. |
| **National Bank** | 1.0 (0.5–1.5) | L1 | Low | Job postings only. |
| **Desjardins** | not placed (0.5–1.5) | — | Low | No public evidence on developer tooling. |
| **Manulife** | 1.5 (1–2) | L2 | Low–medium | "Assisted and autonomous AI capabilities", 30% productivity [V]; no method or adoption rate. |
| **Sun Life** | 1.5 (1–2) | L2 | Low | Copilot broadly used; agentic AI for code and test per CIO interview [I]. |

**Canada overall: 1.5 (range 1.0–2.0), confidence medium.** No Canadian institution has public evidence of L3.

### 3.4 Canadian regulation and policy

| Instrument | Status and dates | Relevance to AI in software delivery | Tag |
|---|---|---|---|
| **OSFI Guideline E-23, Model Risk Management (2027)** | Final published 11 Sept 2025. **Effective 1 May 2027** for all federally regulated financial institutions. | "Model" now covers anything that processes input data to generate results, with added AI/ML expectations. Third-party models are in scope together with B-10. Institutions may set an exceptions policy for limited use before validation is complete. The text does not name agentic AI in the excerpts found. | [I: OSFI, Blakes, Torys] |
| **OSFI Technology Risk Bulletin: "Generative and Agentic Artificial Intelligence: Implications for Technology, Cyber Security, and Operational Resilience"** | July 2026 | The most direct statement found. Per law-firm summary: treat AI outputs as inputs to a decision; keep human accountability for material decisions; **validate AI-generated code before deployment**; **approval checkpoints for high-risk actions**; map AI dependencies, test outages, keep manual fallbacks; require third parties to disclose AI use. Warns agentic AI can act on hallucinated outputs. Existing guidelines apply and should be re-read "through an AI-risk lens". | [I: OSFI page title; McCarthy Tétrault summary] |
| **OSFI Annual Risk Outlook 2026–27** | 14 Apr 2026; semi-annual update 8 Oct 2026 | AI listed as amplifying existing risks. The October update centres on **frontier AI** and the difficulty of understanding AI use and controls at critical third parties. | [I] |
| **OSFI–FCAC risk report on AI** | 24 Sept 2024 | AI use at institutions: ~30% (2019), ~50% (2023), 70% **expected** by 2026. This is a 2023 forecast, not a 2026 measurement. | [I] — older |
| **FIFAI II** (OSFI-led forum) | Report March 2026 | AI risks and mitigants; "AGILE" framing. Content not read. | [I], title only |
| **OSFI Guideline B-13, Technology and Cyber Risk** | Final 13 Jul 2022; effective 1 Jan 2024 | Expects an SDLC framework with processes per phase and control gates, and change management in which changes are documented, assessed, tested and approved (wording from the draft; final may differ). Accommodates Agile and continuous delivery. | [I: law-firm summaries] |
| **OSFI Guideline B-10, Third-Party Risk** | Effective 1 May 2024 | Covers AI model and tool vendors. | [I] |
| **OSFI Guideline E-21, Operational Risk and Resilience** | Final 22 Aug 2024; full adherence reported as 1 Sept 2026 | Resilience of critical operations, including AI dependencies. | [I]; date [3P] |
| **Bill C-27 / AIDA** | Died on prorogation, 6 Jan 2025. **No federal AI statute; no successor AI bill tabled** as of Aug–Oct 2026. | No horizontal AI law binds a bank's SDLC tooling. | [I/3P] |
| **Bill C-36, Protecting Privacy and Consumer Data Act** | Introduced 15 Jun 2026; stage in Parliament unclear (sources conflict) | Privacy reform; reportedly adds transparency duties for automated decision-making. Not an AI act. | [I: DLA Piper]; stage [?] |
| **National AI strategy, "AI for All"** | Launched 4 Jun 2026 | Adoption, sovereign infrastructure, talent. A C$1bn public AI supercomputer was previewed. | [I: Canada.ca, CP24] |
| **Canadian Sovereign AI Compute Strategy** | C$2bn over five years (Budget 2024); TELUS sovereign data-centre work (May 2026) | Domestic compute for sensitive workloads. | [I: Canada.ca] |
| **Québec Law 25, s. 12.1** | In force | Notice, explanation and human review when a decision rests exclusively on automated processing of personal information. Bears on client systems, not on SDLC tools. | [3P commentary]; statute not read |
| **AMF (Québec) Guideline for the Use of Artificial Intelligence** | Final spring 2026 (30 Mar or 7 Apr; sources differ). **Effective 1 May 2027.** | Applies to Québec-chartered insurers, cooperatives (Desjardins), trust and deposit institutions. A senior manager accountable for all AI systems. | [I: BLG, Blakes, NRF] |
| **Bank of Canada** | — | **No statement on agentic AI in software delivery found.** May 2026 speech by a Deputy Governor on AI and productivity; Governor's warning on AI investment valuations. | [I via press] |
| **Industry action** | Oct 2026 | RBC and TD block third-party personal AI agents; the Financial Stability Board has recommended tighter oversight of agents' access. Signals a conservative stance on agent autonomy. | [I] |

**Reading.** Two dates line up on **1 May 2027** (OSFI E-23 and the AMF guideline). Any AI system a Canadian bank puts into its delivery process should be designed now to be inventoried, risk-rated and validated by then. OSFI's July 2026 bulletin already describes L3-style controls (validation of AI code, approval checkpoints, named human accountability) as its expectation.

---

## 4. Region by region

Placements are analyst estimates of the level at which most engineering work at **large banks** in the region appears to operate, from public evidence. They are not survey results.

### 4.1 United States — level 2.0 (range 1.5–2.5), confidence medium

| Bank | Public evidence | Tag |
|---|---|---|
| **JPMorgan Chase** (Evident #1) | 10–20% engineer productivity from an in-house coding assistant (Mar 2025); 40,000+ engineers with assistants (May 2025 investor day); CIO says tools boost productivity by as much as 30% (Bloomberg, 19 May 2026); AI-use goals in performance reviews for most of the 65,000 technologists (by end Mar 2026) [3P]; in-house assistant plus Copilot and Claude Code, "most code" now assisted or agentic [3P]. | [I]; some [3P] |
| **Goldman Sachs** (#12) | Devin (Cognition) introduced Jul 2025; hundreds of instances alongside ~12,000 engineers (reported Sept 2026). In Oct 2026 it **restricted Claude Code and GitHub tools to engineers and quants**, withdrawing them from bankers and traders after a productivity and risk review. | [I: Bloomberg via press] |
| **Citi** (#8) | Agentic AI rolled out to developers from Jul 2025 using Devin; 14,000 engineers by Oct 2026 and ~100,000 hours of weekly capacity from AI code review are aggregator figures. "Humans approve every change." | [I] for roll-out; [3P] for numbers |
| **Bank of America** (#7) | ~19,000 developers using real-time coding assistance; productivity up more than 20% (Q2 2026 investor presentation). | [V via 3P] |
| **Morgan Stanley** (#9) | DevGen.AI: 9 million lines of legacy code reviewed, ~280,000 developer hours saved (Jan–Jun 2025). No 2026 update found. | [I] — older |
| **Wells Fargo** (#5) | 60%+ of developers using assistants, +15% code output; 14,000 engineers on Devin; 30–35% efficiency. All unverified. | [3P] |
| **Capital One** (#2) | ~14,000 technologists; started with coding assistance, now proofs of concept for agentic tooling; deprecated one AI tool engineers disliked; open-sourced VulnHunter, an agentic code-security tool. No adoption or productivity numbers. | [I: The New Stack]; [V] |

**Regulatory posture.** SR 26-2 / OCC Bulletin 2026-13 / FDIC FIL-15-2026 (17 Apr 2026) replaced SR 11-7. A footnote puts **generative and agentic AI outside its scope** as "novel and rapidly evolving"; banks are told to use their own risk practices, and third-party AI falls under third-party risk management [I via secondary; guidance text not read]. A separate request for information is reported as planned [?]. The result is fast adoption with governance set by each bank.

### 4.2 United Kingdom — level 1.75 (range 1.5–2.0), confidence medium

| Bank | Public evidence | Tag |
|---|---|---|
| **HSBC** (#11) | ~31,000 engineers with a gen-AI coding assistant (Feb 2026 earnings call); 20,000+ developers using assistants with 15% efficiency in coding time (HSBC AI page); patching "five times faster". | [I: WatersTechnology]; [V] |
| **Lloyds** (#15) | ~5,000 engineers on AI coding tools, 50% improvement converting legacy code (Jan 2026); GitHub Copilot deployed to 10,000+ engineers (Microsoft agreement, Jun 2026); £100m AI value target for 2026. | [V] |
| **NatWest** (#17) | 12,000 engineers use AI coding tools; AI produces over a third of code (Feb 2026); "over 40%" AI-generated or assisted (CIO, Jun 2026, via blog). | [I via 3P] |
| **Barclays** (#19) | Not found. | — |

**Regulatory posture.** No AI rulebook; SM&CR, Consumer Duty and PRA SS1/23 apply (round 3). The **BoE/FCA "AI in UK financial services 2026"** survey (26 Oct 2026): 86% of firms use AI (75% in 2024); ~80% have agents in production for decision support (base: 105 detailed responses of 196); about 2% allow broad autonomy; no more than 9% expect agents to approve customer outcomes, execute payments or change controls within 12 months; third-party systems are 39% of all AI systems and 53% of high-materiality ones [I via secondary]. A percentage for AI code generation was **not found**. The posture is principles-based with strong personal accountability.

### 4.3 European Union — level 1.5 (range 1.0–2.0), confidence medium

| Bank | Public evidence | Tag |
|---|---|---|
| **Santander** | 40% of all code developed by AI in June 2026; 17,000+ people working with agentic AI in software development (May 2026); 6,000+ developers using coding agents (2025 annual report); 280 process agents; €1bn+ AI value target for 2026–28. | [V via press] |
| **UBS** (Switzerland; #6, top European bank) | ~18,000 developers using AI across the software lifecycle (Jul 2026), up from 3,000 in Oct 2025; over a quarter of AI suggestions used directly in production code; GitHub Copilot is the main tool. | [V via 3P] |
| **Deutsche Bank** | 15,000+ developers on GitHub Copilot and Google Gemini Code Assist; 1.5–2.5 hours saved per week, with "10x gains" on some tasks (14 Jul 2026). AI code may never be deployed without review; training is mandatory first; tools kept with professional developers. | [V] |
| **BBVA** (#13) | AI strategy deck (6 Oct 2026) lists coding and testing agents in use. No numbers found. | [V], excerpt |
| **ING** | Natural-language coding in electronic trading (single source). | [?] |

**Regulatory posture.** The strictest. DORA RTS 2024/1774 Art. 17 requires recorded, tested, approved change with approver and implementer separated (round 2). The AI Act as amended by the 2026 Omnibus applies high-risk obligations from 2 Dec 2027 (round 3). The ESAs' joint statement on frontier AI and ICT risk is dated 31 Jul 2026 (round 3). ECB: nearly 90% of significant banks use AI; generative AI is growing in IT operations; concentration on a few non-EU providers is a concern [I]. EBA: about 40% of EU banks use general-purpose AI, including for code generation and legacy migration (date not confirmed) [I]. Spain's Santander shows the range is wide: a few banks are at L2 while the regulatory floor keeps most at L1–L1.5.

### 4.4 Asia-Pacific

| Market | Level (range), confidence | Named evidence | Regulatory posture |
|---|---|---|---|
| **Australia** | 1.75 (1.5–2.0), medium | **CBA** (#4): over 80% of 7,800 engineers use bought and built AI coding agents; three times more code changes in a year; 15,000+ quality, resilience and security issues fixed; A$200m gross AI benefit in FY26 [I: interview with CBA's AI chief; V]. **NAB**: 6,000 developers standardised on Cursor after evaluating Amazon Q and Copilot [3P]. **ANZ**: 2024 Copilot trial (~1,000 engineers, +42% on trial tasks) [I, older]; "enterprise AI control plane" [I: iTnews]. **Westpac** (#36): agents in engineering, claims unverified [3P]. | APRA letter to all regulated entities (30 Apr 2026): no new rules; existing standards apply; expectations for agents in production, and security testing that accounts for AI-generated code. CPS 230 applies in full to smaller institutions from 1 Jul 2026 [3P summaries; letter not read]. Parliamentary inquiry into AI heard the banks in Oct 2026 [I]. |
| **Singapore** | 1.5 (1.0–2.0), medium–low | **DBS** (#25, down 7): coding agents for development, testing and deployment "deeply embedded in our workflows" (COO, Apr 2026); CodeBuddy saves data professionals up to 20% on some coding tasks [V/I]. **OCBC**: Wingman coding assistant, ~2,000 developers, 20% uplift [V/I]. | **MAS Guidelines on AI Risk Management finalised 7 Oct 2026**, covering all AI including generative AI and agents, risk-proportionate. Effective 7 Oct 2027, possibly phased to Oct 2028 (sources differ). Agents to be inventoried, monitored and halted where needed [I/3P; text not read]. |
| **Hong Kong** | 1.25 (1.0–1.5), low | No bank-specific SDLC evidence found. | **HKMA "ART" framework** (Accountability, Resilience, Trust) and updated supervisory guidance, 15 Oct 2026 [I: info.gov.hk]. GenA.I. Sandbox++ first cohort: 36 agentic use cases, 30 institutions (27 Aug 2026) [I]. A discussion paper on agentic AI is reported for 2 Nov 2026 [?]. |
| **Japan** | 1.25 (1.0–1.5), low | **MUFG** reportedly built an in-house alternative to Claude Code and keeps a human in the loop on every AI tool [I: PYMNTS, single source]. | FSA AI Discussion Paper v1.1 (3 Mar 2026); joint FSA–BoJ request on frontier-AI threats (22 May 2026) [I]. |
| **India** | 1.0 (0.5–1.5), low | Bank-specific SDLC evidence **not found** (HDFC, ICICI, SBI). | RBI FREE-AI report (13 Aug 2025), advisory, 26 recommendations; draft model-risk guidance 24 Jun 2026; no binding AI-specific rules as of Oct 2026 [3P]. |
| **China** | 1.5 (1.0–2.0), low | **CCB**: AI in the whole R&D process; AI coding contribution up 50% (H1 2026 call; wording unclear). CCB's fintech arm: code-generation adoption above 30% (older). **Bank of China**: 13.37m lines of code in one month with a DeepSeek-based tool, 3,600 users (2025). **ICBC**: 600+ large-model scenarios; no code share found. | Not researched. Domestic models and tools. |

### 4.5 Middle East — level 1.5 for the UAE (range 1.0–2.0), low; Saudi Arabia 1.0 (0.5–1.5), low

- **Emirates NBD**: 2,300 engineers using Claude Code and more than a quarter of production code AI-written, per Evident's MEA coverage [I via excerpt]; earlier, 1,000+ developers on GitHub Copilot [3P]. Top-ranked in Evident's first Middle East and Africa index (25 banks, mid-2026), which describes Gulf banks as adopters, not developers, of frontier AI, with a talent bottleneck [I].
- **First Abu Dhabi Bank, Saudi banks**: SDLC evidence **not found**.
- **Regulation.** CBUAE guidance note on AI and ML for licensed institutions, February 2026 (11 or 23 Feb; sources differ), supervisory and not legally binding; agentic AI not mentioned [3P]. SAMA: no AI-specific banking guidance found [3P].

### 4.6 Latin America — Brazil 1.5 (range 1.0–2.0), low

- **Bradesco**: describes three phases. Assistant phase (Copilot as "BIA Tech"): 10–20% gain. 2026 agent phase: 20–40%, up to 90% on some tasks; executives cite 5–20× on specific work and a 78% cut in development hours; a conference talk describes an AI engineering cycle "from specification to deploy" [I: TI Inside; talk listing]. This is the closest public description to L3 found anywhere, but no gate or approver detail is given.
- **Nubank**: used Devin to migrate a 6-million-line ETL system, with humans approving each step; 8–12× engineering-time efficiency [V: Cognition case study].
- **Itaú**: not found. Regulation: not researched.

### 4.7 Summary observation across regions

- Where regulators have left agentic AI to bank discretion (US), adoption of agents is fastest and loudest.
- Where regulators have written agent-specific expectations in 2026 (Canada's OSFI bulletin, MAS, HKMA, APRA's letter), banks talk more about control planes and inventories than about autonomy.
- **No region shows public evidence of L3 at a bank.** The difference between regions is how much of L2 is in routine use.

---

## 5. Comparison tables designed for charts

### Table A — Maturity level by region (financial-services software delivery)

**All values are analyst estimates** on the L0–L4 scale. Basis: named-bank evidence in sections 3 and 4, weighted toward institutions with primary-source figures. One number per region; range shows uncertainty.

| Region | Level | Low | High | Confidence | Main evidence |
|---|---|---|---|---|---|
| United States | 2.0 | 1.5 | 2.5 | Medium | JPMorgan, Goldman, Citi, BofA |
| United Kingdom | 1.75 | 1.5 | 2.0 | Medium | HSBC, Lloyds, NatWest; BoE/FCA survey |
| Australia | 1.75 | 1.5 | 2.0 | Medium | CBA; NAB [3P] |
| **Canada** | **1.5** | **1.0** | **2.0** | **Medium** | RBC, TD, Scotiabank, CIBC, BMO |
| European Union (+ Switzerland) | 1.5 | 1.0 | 2.0 | Medium | Santander, UBS, Deutsche Bank |
| Singapore | 1.5 | 1.0 | 2.0 | Medium–low | DBS, OCBC |
| China | 1.5 | 1.0 | 2.0 | Low | CCB, Bank of China |
| UAE | 1.5 | 1.0 | 2.0 | Low | Emirates NBD only |
| Brazil | 1.5 | 1.0 | 2.0 | Low | Bradesco, Nubank |
| Hong Kong | 1.25 | 1.0 | 1.5 | Low | Regulator activity only |
| Japan | 1.25 | 1.0 | 1.5 | Low | MUFG, single source |
| India | 1.0 | 0.5 | 1.5 | Low | No bank evidence found |
| Saudi Arabia | 1.0 | 0.5 | 1.5 | Low | No bank evidence found |

Differences of 0.25 are within the margin of error. The defensible chart message is three bands: US leading (about 2), a middle group including Canada (about 1.5–1.75), and markets with little public evidence (about 1–1.25).

### Table B — Canadian banks vs selected global peers, Evident AI Index

Source for every row: **Evident AI Index for Banks, 2026 edition, published 6 Oct 2026** (50 banks; ranks only, scores not found). Ranks reached this report through Evident page excerpts and press (Advisor.ca, The Logic, Globe and Mail, Seeking Alpha, American Banker, resultsense). The Evident table itself was not opened.

| Rank | Bank | Country | Change vs 2025 | Rank source |
|---|---|---|---|---|
| 1 | JPMorgan Chase | US | 0 | Evident [I] |
| 2 | Capital One | US | 0 | Evident [I] |
| **3** | **RBC** | **Canada** | 0 | Evident; RBC release [I/V] |
| 4 | Commonwealth Bank | Australia | n/a | Evident excerpt [I] |
| 5 | Wells Fargo | US | n/a | Evident excerpt [I] |
| 6 | UBS | Switzerland | n/a | Press [I] |
| 7 | Bank of America | US | +3 | Evident table excerpt [I] |
| 8 | Citi | US | +4 | Evident excerpt [I] |
| 9 | Morgan Stanley | US | −4 | Evident table excerpt [I] |
| **10** | **TD** | **Canada** | +3 | The Logic; Advisor.ca [I] |
| 11 | HSBC | UK | −3 | Press [I] |
| 12 | Goldman Sachs | US | −3 | Evident table excerpt [I] |
| 13 | BBVA | Spain | +1 | Evident table excerpt [I] |
| 15 | Lloyds | UK | n/a | Press [I via 3P] |
| 17 | NatWest | UK | n/a | Press [I via 3P] |
| 19 | Barclays | UK | n/a | Press [I via 3P] |
| **20** | **BMO** | **Canada** | −1 | Advisor.ca / The Logic [I] |
| **21** | **CIBC** | **Canada** | +1 | Advisor.ca / The Logic [I] |
| 23 | Standard Chartered | UK | n/a | Press [I via 3P] |
| 25 | DBS | Singapore | −7 | Bloomberg excerpt [I] |
| **30** | **Scotiabank** | **Canada** | −1 | Advisor.ca / The Logic [I] |
| 36 | Westpac | Australia | +9 | Evident excerpt [I] |
| — | National Bank | Canada | not ranked | The Logic [I] |

Ranks for Santander, ING, Deutsche Bank, BNP Paribas, ANZ and NAB: **not found**.

### Table C — AI use by lifecycle stage (%)

Different surveys, different bases. Chart as "indicative shape", not as one series.

| Stage | % | Base | Source | Tag |
|---|---|---|---|---|
| Requirements / planning | not found | — | — | — |
| Design / architecture | not found | — | — | — |
| Writing new code | 71 | Respondents whose work includes the task | DORA 2025 | [I via 3P] |
| Generating code in familiar areas | 67 | All respondents | Stack Overflow 2026 | [I via press] |
| Modifying existing code | 66 | Task performers | DORA 2025 | [I via 3P] |
| Documentation | 64 | Task performers | DORA 2025 | [I via 3P] |
| Creating test cases | 62 | Task performers | DORA 2025 | [I via 3P] |
| Debugging | 61 | All respondents | Stack Overflow 2026 | [I via press] |
| Code review | 56 | Task performers | DORA 2025 | [I via 3P] |
| Code review (leaders' organisations) | 69 | 49 engineering leaders | Madrona 2026 | [3P] |
| Deploy / operate / troubleshoot production | 20 | All respondents | Stack Overflow 2026 | [I via press] |

### Table D — Adoption vs trust, and adoption vs measured impact

**D1. Adoption vs trust**

| Source (date) | Adoption measure | % | Trust measure | % | Tag |
|---|---|---|---|---|---|
| DORA 2025 | Use AI at work | 90 | Little or no trust in AI-generated code | 30 | [I] |
| Stack Overflow 2025 | Use or plan to use AI tools | 84 | Trust accuracy / distrust accuracy / highly trust | 33 / 46 / 3 | [I] |
| Stack Overflow 2026 | Use AI in some capacity | 83 | Trust output when easy to verify / trust for important decisions | 48.0 / 6.6 | [I via press] |
| Sonar 2026 | AI share of committed code | 42 | Do not fully trust AI code / always verify before commit | 96 / 48 | [V] |
| JetBrains 2026 | Use coding agents weekly | 90 | not found | — | [V] |
| Stack Overflow pulse (May 2026) | Use agents at work | 59 | Block agents from unapproved system changes | 60 | [I] |
| BoE/FCA 2026 (UK financial firms) | Agents in production for decision support | 80 | Allow agents broad autonomy | 2 | [I via secondary] |

**D2. Adoption vs measured impact**

| Source (date) | Positive effect | Negative or offsetting effect | Tag |
|---|---|---|---|
| Faros 2026 | Tasks per developer +33.7%; epics +66% | Review time +441.5%; bugs per developer +54%; incidents per pull request +242.7% | [V] |
| CircleCI 2026 | Overall throughput +59%; feature-branch +15% (median) | Main-branch throughput −7% (median); main success rate 70.8% | [V] |
| DORA 2025 | Throughput higher with AI | Delivery instability higher with AI | [I] |
| METR 2025 | — | Tasks 19% slower (n=16) | [I] |
| METR Feb 2026 | ~18% faster (interval −38% to +9%); flagged unreliable | — | [I via 3P] |
| Cui et al. | +26% tasks completed | — | [I via 3P] |
| Google trial | ~21% faster on one task (n=96) | — | [I via 3P] |
| Uplevel 2024 | No significant gain | Bug rate +41% | [V via press] |
| Thoughtworks 2026 | Up to 15% delivery speed | — | [I] |
| Gartner 2026 | 35% of leaders see significant ROI | 65% do not | [I] |
| McKinsey Q2 2026 | 25% report top acceleration | 75% do not | [I] |

**D3. Bank self-reported figures (not comparable; shown for context only)**

| Bank | Figure | Date | Tag |
|---|---|---|---|
| TD | Pull-request throughput +80% YoY; 76% of engineers active on Copilot | 2026 | [V] |
| BMO | 20–30% productivity (target), 2,000+ developers | Mar 2026 | [V] |
| CIBC | 10–15% in pilot | 2024 | [V] |
| Manulife | 30% developer productivity | 2026 | [V] |
| Scotiabank | 5,500 engineers using AI for coding (no % gain given) | Jun 2026 | [V] |
| JPMorgan | 10–20% (2025); up to 30% | Mar 2025; May 2026 | [I] |
| Bank of America | >20%, ~19,000 developers | Q2 2026 | [V via 3P] |
| HSBC | 15% of coding time | 2026 | [V] |
| OCBC | 20% | 2026 | [V/I] |
| CBA | 3× code changes; 80%+ of engineers on agents | Sept 2026 | [I] |
| Santander | 40% of code by AI | Jun 2026 | [V via press] |
| NatWest | Over a third of code by AI | Feb 2026 | [I via 3P] |
| UBS | Over 25% of AI suggestions used in production code | Jul 2026 | [V via 3P] |
| Deutsche Bank | 1.5–2.5 hours saved per developer per week | Jul 2026 | [V] |

---

## 6. Where Canada stands, and what it means for a governed agentic delivery platform

**Where Canada stands.**
- **On enterprise AI maturity: strong.** Two banks in the global top ten and all five in the top 30 [I]. RBC ranks 2nd on Leadership and 3rd on Transparency.
- **On AI in software delivery: mid-pack, at L1 moving into L2.** The disclosed numbers are roll-out counts and self-reported uplift. No Canadian institution has published an AI code share, an agent adoption rate for engineers, or a governed multi-stage workflow.
- **On regulation: early and specific.** OSFI's July 2026 bulletin names AI-generated code and approval checkpoints. E-23 and the AMF guideline both start on 1 May 2027. There is no federal AI statute, so OSFI guidance is what binds.
- **On posture: cautious about autonomy.** RBC and TD blocking third-party personal agents, and the consortium-built Agentic Control Plane, both point to "control first".

**Implications for a bank considering the platform** (business request → 8 gated stages → named approvers → evidence trail; standalone developer agent in VS Code; Azure DevOps):

1. **The platform targets a level no bank has publicly reached, so the client would lead, not follow.**
   - Evidence: no L3 found at any bank in any region (sections 3–4). The Gartner "5% high maturity" figure and McKinsey's 27% adopter result suggest it is rare everywhere [I].
   - Consequence: there is no peer reference to copy. Plan a staged pilot with its own baseline, not a benchmark-driven business case.

2. **It maps directly onto what OSFI now asks for. Build the mapping explicitly.**
   - Evidence: OSFI bulletin (Jul 2026): validate AI code before deployment, approval checkpoints, human accountability [I]. B-13: SDLC control gates and documented, tested, approved change [I]. E-23 from 1 May 2027 [I].
   - Consequence: each gate and each evidence record should cite the OSFI expectation it satisfies. The platform's own agents and models will need to be in the bank's model inventory and validated under E-23 before May 2027.

3. **Eight human gates will collide with the known bottleneck unless gates are risk-tiered from day one.**
   - Evidence: review time ×5, 31% more unreviewed merges (Faros) [V]; main-branch success falling (CircleCI) [V]; DORA instability [I]; only 48% always verify (Sonar) [V].
   - Consequence: more review points on the same reviewers produces rubber-stamping, which is the failure OSFI's "approval checkpoint" is meant to prevent. Risk tiers, small batches (a DORA capability) and a visible send-back rate are preconditions, not later features. This reinforces round 3's first recommendation.

4. **The value is at the two ends of the lifecycle, where AI use is thin, not in code generation, where the bank already has tools.**
   - Evidence: 61–71% use in coding and debugging against 20% in production operations and no data at all for requirements (Table C). Every Canadian bank already has a coding assistant (section 3.1).
   - Consequence: position the platform as the layer that connects a business request to the bank's existing Copilot or agent, and connects the result to release evidence. Do not sell it as a better coding tool.

5. **Keeping the developer agent standalone in VS Code fits Canadian banks' disclosed tooling and posture.**
   - Evidence: TD, CIBC, Manulife and Sun Life name GitHub Copilot [V/I]; Scotiabank has its own assistant [V]; Deutsche Bank and Goldman keep coding tools with trained professional developers [V/I]; BoE/FCA shows 2% broad autonomy [I].
   - Consequence: bring-your-own-agent is a requirement. The hand-off must be tracked (rounds 2 and 3 recommend MCP), because an untracked hand-off breaks the evidence chain that OSFI's validation expectation depends on.

6. **Measure delivery outcomes, not activity, and publish the method.**
   - Evidence: bank figures are self-reported and non-comparable (Table D3); only 12 of 50 banks report AI returns (Evident) [I]; 35% of leaders see significant ROI (Gartner) [I]; DORA's J-curve implies an initial dip [I].
   - Consequence: baseline lead time, change failure rate, review wait and send-back rate before the pilot. Expect a dip in the first months and say so in advance. A bank that can show audited delivery metrics would have something no Canadian peer has disclosed.

7. **Treat the platform vendor and model providers as critical third parties under B-10 and E-21, and plan for data residency.**
   - Evidence: OSFI's October 2026 update focuses on AI at critical third parties [I]; third-party systems are 53% of high-materiality AI in UK finance [I]; the ECB flags concentration on a few non-EU providers [I]; Canada is funding sovereign compute [I].
   - Consequence: expect questions on model inventory, exit and fallback, outage testing, and where prompts and code are processed. Running models in the bank's own Azure tenancy (round 3) answers most of them.

---

## 7. Limitations and open questions

**Limitations of this report**
- **No primary page was read.** All fetches were blocked by the session's network allowlist. Every figure is from a search excerpt or secondary coverage. Numbers marked [V] or [I] are tagged by who originated them, not by how they reached this report.
- **Public evidence understates private practice.** Placements reflect disclosure. A bank that says little (National Bank, Desjardins, Barclays, Indian and Saudi banks) may be further ahead than shown.
- **The maturity scale and all placements are analyst estimates.** Differences of 0.25 are not significant.
- **Bank productivity figures are self-reported** with unpublished methods and different definitions.
- **Vendor telemetry dominates the "contrary" evidence** (Faros, CircleCI, Sonar, Veracode, CodeRabbit). Each sells a remedy for the problem it measures.
- **Survey figures use different bases** and cannot be combined into one series (Tables C and D).
- **Aggregator sites** (notably bankingnewsai.com) supplied several 2026 bank figures. These are tagged [3P] and should be traced to earnings transcripts before use.
- **Evident measures enterprise AI maturity from disclosure**, not software delivery. Ranks only; scores not found.

**Could not be verified or was not found**
- Evident 2026 point scores; ranks for Santander, ING, Deutsche Bank, BNP Paribas, ANZ, NAB; whether RBC's top-three run is four or five years.
- Level names in Gartner's two 2026 maturity models; the base of Gartner's "5% high maturity" figure.
- Stack Overflow 2026 per-stage workflow table (testing, review, planning) and a 2026 "trust accuracy" figure comparable to 2025.
- DORA 2025 task percentages against the report's own figure; the source for DORA pausing its 2026 survey.
- JetBrains 2026 agent code-share figures (secondary sources disagree).
- The TD Stories page date; TD's and RBC's engineer counts using AI; whether RBC uses GitHub Copilot.
- Scotiabank's 5,500 vs "about 5,000" engineers; the AI Consortium's founding date.
- Any Canadian bank's AI code share, agent adoption rate among engineers, or use of Claude Code, Cursor or Devin.
- Desjardins and National Bank developer tooling.
- Exact text of OSFI's July 2026 bulletin and of SR 26-2's footnote; E-21's 1 Sept 2026 date; Bill C-36's current stage.
- MAS guideline phasing; HKMA discussion-paper date; CBUAE guidance date.
- Wells Fargo, Citi and JPMorgan 2026 figures from aggregators.
- Any Bank of Canada statement on agentic AI in software delivery; any Forrester 2026 data; any survey percentage for AI use in requirements or design.
- Bank-specific evidence for India, Saudi Arabia, Hong Kong, Itaú, FAB, Barclays.

**Open questions for the client**
1. What do the client's own engineering metrics show today (lead time, change failure rate, review wait)? Without a baseline, no uplift claim can be tested.
2. Which existing assistant or agent do the client's developers use, and under what policy? This sets the hand-off design.
3. How will the platform's agents be classified under the client's E-23 model inventory, and who validates them before 1 May 2027?
4. Which change classes could be approved by policy instead of by a person, and who would own that policy?
5. Has OSFI commented, in supervision, on AI-generated code at the client? The July 2026 bulletin suggests the question is coming.

---

## 8. Sources

All accessed 12 Nov 2026 through web search; **pages not opened** (see Method). URLs are as returned by search.

**Frameworks and developer surveys**
- [I] DORA 2025 State of AI-assisted Software Development: https://services.google.com/fh/files/misc/2025_state_of_ai_assisted_software_development.pdf ; https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
- [I] DORA AI Capabilities Model: https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model ; https://dora.dev/ai/capabilities-model/report
- [I] DORA ROI report (InfoQ, May 2026): https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/ ; https://dora.dev/ai/
- [3P] DORA pausing its survey: https://waydev.co/dora-pauses-the-annual-survey/
- [3P] Critique of DORA 2025 clusters: https://blog.robbowley.net/2025/10/01/dora-2025-ai-assisted-dev-report-some-benefit-most-dont/
- [I via 3P] DORA 2025 task percentages: https://kt.team/blog/dora-2025-ai-transformation-part-3 ; https://www.secondtalent.com/resources/ai-in-software-development-statistics/
- [I] Stack Overflow 2026 results: https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/ ; https://survey.stackoverflow.co/2026/ai/data ; press release https://stackoverflow.co/company/press/archive/stack-overflow-annual-developer-survey-ai-trust-conditional
- [I] Coverage of Stack Overflow 2026: https://itbrief.co.uk/story/stack-overflow-survey-shows-developers-trust-ai-with-caveats ; https://qz.com/stack-overflow-developer-survey-2026-ai-coding-tools ; https://www.theregister.com/a/5301662
- [I] Stack Overflow pulse, "Agents on a leash" (27 May 2026): https://stackoverflow.blog/2026/05/27/agents-on-a-leash-agentic-ai-remains-mostly-monitored-at-work
- [I] Stack Overflow 2025: https://survey.stackoverflow.co/2025/ai ; https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/
- [V] JetBrains 2026 agent adoption: https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/ ; https://blog.jetbrains.com/research/2026/08/how-much-code-do-developers-really-let-agents-write/ ; https://blog.jetbrains.com/research/2026/11/state-of-developer-ecosystem-2026/
- [V] Sonar State of Code 2026: https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/ ; [I] https://www.theregister.com/2026/01/09/devs_ai_code/
- [I] Gartner abstracts: https://www.gartner.com/en/documents/7586633 ; https://www.gartner.com/en/documents/8364249 ; https://www.gartner.com/en/documents/7402130
- [I] Gartner, AI in software engineering / ROI: https://www.gartner.com/en/articles/ai-in-software-engineering ; https://www.gartner.com/en/articles/technology-adoption-roi
- [I] Gartner, AI coding cost prediction (24 Jun 2026): https://gartner.com/en/newsroom/press-releases/2026-06-24-gartner-predicts-ai-coding-costs-will-surpass-average-developer-salary-by-2028-as-token-consumption-surges
- [I] Gartner coding-agent forecast (coverage): https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx
- [I] McKinsey, Beyond the copilot: https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/beyond-the-copilot-scaling-the-agentic-product-development-life-cycle
- [I] McKinsey State of AI 2026: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai ; coverage https://diginomica.com/were-road-roi-mckinseys-verdict-ai-2026
- [I] Thoughtworks Looking Glass 2026: https://www.thoughtworks.com/en-us/insights/looking-glass/looking-glass-2026/AI-and-software-delivery ; on CircleCI: https://www.thoughtworks.com/insights/blog/generative-ai/a-thoughtworks-perspective-on-circleci-s-2026-state-of-software-
- [I] Info-Tech AI in software development (Jun 2026): https://www.infotech.com/research/ai-adoption-impact-study-ai-in-software-development-june-26-top-10-insights
- [I] BCG Applied AI Index 2026 (coverage): https://www.consulting.us/news/14058/nearly-half-of-companies-now-create-value-with-ai-bcg-report
- [3P] Autonomy ladders: https://dash0.com/knowledge/the-six-levels-of-agentic-software-engineering ; https://metrics.blogg.gu.se/?p=1038
- [3P] Madrona 2026 leader survey: https://www.madrona.com/on-to-the-next-bottleneck-what-product-engineering-leaders-told-us-about-ai-in-software-development/

**Productivity and quality evidence**
- [I] METR update (24 Feb 2026): https://metr.org/blog/2026-02-24-uplift-update/ ; [3P] https://blog.robbowley.net/2026/04/04/metrs-developer-productivity-research-2026-update/
- [V] Faros Acceleration Whiplash: https://www.faros.ai/research/ai-acceleration-whiplash ; https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways
- [V] CircleCI 2026: https://circleci.com/landing-pages/assets/2026-state-of-software-delivery-report.pdf ; [3P] critique https://blog.robbowley.net/2026/04/02/more-code-less-delivery-but-does-the-circleci-2026-report-really-show-1-in-20-teams-are-benefiting/
- [I] Cui et al. draft: https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf ; [3P] summary https://newsletter.getdx.com/p/copilot-impact-on-productivity
- [I] Microsoft dose-response study: https://arxiv.org/abs/2606.00438
- [V] CodeRabbit: https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report ; [I] https://www.theregister.com/2025/12/17/ai_code_bugs/
- [V] Veracode 2026: https://veracode.com/resources/analyst-reports/2026-genai-code-security-report ; [I] https://sdtimes.com/agentic-security/veracode-finds-ai-generated-code-security-has-barely-improved-since-last-year/
- [3P] Uplevel and Google trial summaries: https://enterprisespectator.substack.com/p/gen-ai-coding-assistants-productivity ; https://www.techspot.com/news/104945-ai-coding-assistants-do-not-boost-productivity-or.html
- [V via press] Google 75% of new code: https://devops.com/google-ceo-says-75-of-new-code-is-ai-generated/ ; https://www.semafor.com/article/04/24/2026/google-ceo-says-75-of-companys-new-code-is-ai-generated
- [V via press] GitHub Octoverse 2026: https://visualstudiomagazine.com/articles/2026/10/29/github-octoverse-agents-started-more-than-40-percent-of-september-pull-requests.aspx

**Evident AI Index**
- [I] https://evidentinsights.com/ai-index/ ; https://evidentinsights.com/bankingbrief/inside-the-2026-ai-index ; https://evidentinsights.com/insights/banks-ai-index-2026-report
- [I] https://thelogic.co/news/td-rbc-evident-ai-returns/ ; https://www.advisor.ca/industry-news/industry/rbc-td-rank-among-top-10-banks-for-ai-maturity/ ; https://www.theglobeandmail.com/business/article-banking-ai-rbc-td-cibc-bmo-scotiabank-bottom-lines-report/
- [I] https://www.americanbanker.com/news/jpmorganchase-still-tops-ai-ranking-as-big-bank-lead-widens ; https://seekingalpha.com/news/4650666-jpmorgan-chase-capital-one-rbc-top-ai-banks-index ; https://www.bloomberg.com/news/articles/2026-10-06/jpmorgan-tops-global-ai-banking-index-for-fifth-straight-year
- [3P] https://www.resultsense.com/news/2026-10-07-evident-ai-index-hsbc-drops-out-top-ten/ ; https://wallstreetdebug.com/articles/evident-ai-index-banks-2026/
- [V] RBC release: https://www.newswire.ca/news-releases/rbc-maintains-top-three-leadership-position-globally-for-ai-maturity-in-financial-services-850533624.html
- [V] BMO Responsible AI release: https://www.newswire.ca/news-releases/bmo-earns-top-recognition-for-responsible-ai-leadership-in-global-banking-826429901.html
- [I] Evident MEA: https://evidentinsights.com/bankingbrief/new-top-ai-banks-in-the-middle-east-africa ; https://www.agbi.com/analysis/banking-finance/2026/06/talent-bottleneck-threatens-gulf-banks-ai-push/

**Canadian institutions**
- [V] RBC AI and technology pages: https://www.rbc.com/our-impact/technology/artificial-intelligence.html ; https://www.rbc.com/our-impact/technology/
- [V via trade press] RBC developer productivity (21 May 2026): https://insurance-canada.ca/2026/05/21/rbc-enhancing-productivity-with-ai/
- [I] RBC AI value and deployment: https://www.pymnts.com/news/artificial-intelligence/2026/rbc-embeds-ai-at-the-core-of-banking-aiming-for-1-billion-in-returns/ ; https://thelogic.co/news/rbc-ai-chief-data-scaling/
- [I] RBC and TD block personal AI agents: https://www.theglobeandmail.com/business/article-banks-ai-agents-client-data-osfi/ ; https://www.bnnbloomberg.ca/business/artificial-intelligence/2026/10/28/some-canadian-banks-blocking-personal-ai-agents-amid-security-concerns/
- [V] TD Stories: https://stories.td.com/ca/en/article/ai-at-work ; [I] https://www.fintech.ca/2026/02/09/how-td-is-scaling-ai-across-banking/ ; [V] 2023 pilots https://www.newswire.ca/news-releases/td-launches-new-generative-ai-pilots-to-help-empower-colleagues-to-deliver-legendary-customer-experiences-806595494.html
- [V] BMO Investor Day transcript (26 Mar 2026): https://www.bmo.com/pdf/2026BMOInvestoDayTranscript.pdf
- [V] Scotiabank: https://scotiabank.investorroom.com/2026-04-13-Scotiabank-Launches-Scotia-Intelligence,-Empowering-Employees-and-Accelerating-Enterprise-AI-Adoption ; https://scotiabank.investorroom.com/2026-06-10-Scotiabank-Accelerates-Enterprise-Adoption-of-AI-with-New-Scotia-Intelligence-Capabilities
- [I] Scotiabank summit transcript: https://www.investing.com/news/transcripts/scotiabank-at-annual-financials-summit-early-roe-goal-met-93CH-4894010
- [I] AI Consortium / Agentic Control Plane: https://www.wealthprofessional.ca/news/industry-news/scotiabank-backs-new-consortium-to-build-shared-ai-control-infrastructure/392971 ; https://ca.finance.yahoo.com/news/scotiabank-teams-other-canadian-companies-103046116.html
- [V] CIBC: https://www.microsoft.com/en-us/industry/microsoft-in-business/customer-story/2026/01/07/modern-banking-reinvented-cibcs-blueprint-for-successful-ai-transformation/ ; https://www.newswire.ca/news-releases/cibc-launches-custom-built-cibc-ai-platform-and-rolls-out-github-copilot-803776814.html ; https://www.deloitte.com/ca/en/about/story/impact/cibc.html
- [V] National Bank postings: https://emplois.bnc.ca/en_CA/careers/JobDetail/P7I75-ARCHITECTE-PRINCIPAL-DE-SOLUTIONS/35463 ; [I] https://thelogic.co/news/national-bank-ceo-ai/
- [I] Desjardins (Apr 2025): https://insurance-portal.ca/article/less-waiting-more-efficiency-artificial-intelligence-reinvents-insurance/
- [V] Manulife–Microsoft: https://www.manulife.com/ca/en/about-us/news/manulife-expands-partnership-with-microsoft-to-accelerate-enterprise-ai-governance-and-innovation
- [I] Sun Life: https://www.innovationleader.com/financial-services/sunlife-ai-interview-evp-laura-money/ ; https://www.cdomagazine.tech/aiml/building-an-ai-ready-enterprise-how-sun-life-is-enabling-trusted-innovation-at-global-scale
- [3P] Aggregator figures (unverified): https://www.bankingnewsai.com/banks/rbc ; https://www.bankingnewsai.com/banks/td-bank-group ; https://www.bankingnewsai.com/banks/scotiabank

**Canadian regulation and policy**
- [I] OSFI Guideline E-23 (2027): https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/guideline-e-23-model-risk-management-2027 ; https://www.blakes.com/insights/osfi-releases-final-guideline-e-23-for-model-risk-management-and-ai-use-by-frfis/ ; https://www.torys.com/en/our-latest-thinking/publications/2025/10/osfi-updates-and-expands-scope-of-guideline-e-23
- [I] OSFI bulletin on generative and agentic AI: https://www.osfi-bsif.gc.ca/en/risks/technology-cyber-risk-management/technology-risk-bulletin/generative-agentic-artificial-intelligence-implications-technology-cyber-security-operational ; https://www.mccarthy.ca/en/insights/blogs/techlex/managing-the-ai-risks-in-the-financial-sector-osfi-s-bulletin-on-generative-and-agentic-artificial-intelligence
- [I] OSFI Annual Risk Outlook 2026–27 and update: https://www.osfi-bsif.gc.ca/en/about-osfi/reports-publications/osfis-annual-risk-outlook-fiscal-year-2026-2027 ; https://www.osfi-bsif.gc.ca/en/about-osfi/reports-publications/annual-risk-outlook-semi-annual-update-fiscal-year-2026-2027 ; https://www.wealthprofessional.ca/news/industry-news/osfi-flags-frontier-ai-as-top-threat-to-canadas-financial-system/393750
- [I] OSFI–FCAC AI report (2024): https://www.osfi-bsif.gc.ca/en/about-osfi/reports-publications/osfi-fcac-risk-report-ai-uses-risks-federally-regulated-financial-institutions
- [I] FIFAI II: https://www.osfi-bsif.gc.ca/en/about-osfi/reports-publications/fifai-ii-ai-risks-opportunities-adopting-agile-framework-canadian-financial-services
- [I] B-13: https://www.blg.com/en/insights/2022/08/osfis-new-guideline-b-13-managing-technology-and-cyber-risks ; https://www.torys.com/our-latest-thinking/publications/2024/03/osfis-guidance-on-technology-and-cyber-risk-management
- [I] B-10 and E-21: https://www.mccarthy.ca/en/insights/publications/osfi-releases-final-guideline-operational-risk-and-resilience-federal-financial-institutions ; https://www.osfi-bsif.gc.ca/en/news/backgrounder-guideline-e-21-operational-risk-resilience ; [3P] https://www.gatekeeperhq.com/blog/a-2026-guide-to-osfi-compliance-for-canadian-frfis
- [I] Bill C-36: https://www.dlapiper.com/en/insights/publications/2026/06/canada-tables-bill-c36-the-protecting-privacy-and-consumer-data-act ; [3P] AIDA status https://billc27.ca/
- [I] National AI strategy and compute: https://www.canada.ca/en/innovation-science-economic-development/news/2026/06/minister-solomon-highlights-canadas-national-artificial-intelligence.html ; https://www.cp24.com/news/canada/2026/06/02/federal-governments-new-ai-strategy-will-emphasize-trust-minister-says/ ; https://www.canada.ca/en/innovation-science-economic-development/news/2026/05/government-of-canada-and-telus-advance-work-to-build-sovereign-ai-infrastructure.html
- [I] AMF AI guideline: https://lautorite.qc.ca/fileadmin/lautorite/reglementation/lignes-directrices-assurance/Guideline-Use-of-Artificial-Intelligence.pdf ; https://www.blg.com/en/insights/2026/05/amf-publie-ses-attentes-sur-lutilisation-de-lia ; https://www.nortonrosefulbright.com/en/knowledge/publications/27e0daab/amf-s-ai-guideline-is-now-official-what-financial-institutions-need-to-know
- [3P] Law 25 commentary: https://www.fruggr.io/en/quebec-law-25-ai-compliance-insurers-2026/
- [I] Bank of Canada speech coverage: https://www.insurancejournal.com/news/international/2026/05/15/869866.htm

**United States**
- [I] JPMorgan: https://finance.yahoo.com/news/jpmorgan-engineers-efficiency-jumps-much-190410471.html ; https://www.bloomberg.com/news/articles/2026-05-19/jpmorgan-s-cio-sees-big-leadership-test-as-ai-fuels-major-shift ; [3P] https://letsdatascience.com/blog/jpmorgan-tracks-65000-engineers-ai-usage-performance-reviews
- [I] Goldman Sachs: https://www.fortune.com/2025/07/14/goldman-sachs-ai-powered-software-engineer-devin-new-employee-increase-productivity-fears-of-job-replacement ; https://qa-financial.com/goldman-puts-ai-coding-to-the-test/ ; https://www.pymnts.com/news/artificial-intelligence/2026/goldman-benches-its-vibe-coders-while-bny-lets-everyone-build/ ; https://the-decoder.com/goldman-sachs-pulls-ai-coding-tools-from-traders-and-bankers/
- [I] Citi: https://www.pymnts.com/artificial-intelligence-2/2025/citi-cto-says-agentic-ai-progress-demands-speed-and-structure/ ; [3P] https://www.bankingnewsai.com/banks/citigroup
- [I] Bank of America: https://www.sifma.org/news/blog/bank-of-americas-hari-gopalkrishnan-on-ai-innovation-and-the-customer-experience ; [3P] https://codehypes.com/blog/bank-ai-roi-earnings-2026
- [I] Morgan Stanley: https://developers.slashdot.org/story/25/06/04/1233253/morgan-stanley-says-its-ai-tool-processed-9-million-lines-of-legacy-code-this-year-and-saved-280000-developer-hours
- [I] Capital One: https://thenewstack.io/capital-one-developer-enablement/ ; [V] https://www.capitalone.com/tech/open-source/announcing-vulnhunter/
- [3P] Wells Fargo: https://www.bankingnewsai.com/banks/wells-fargo ; https://infotechlead.com/cio/wells-fargo-bolsters-ai-driven-digital-transformation-with-65-cloud-adoption-and-2-8-bn-tech-spend-95248
- [3P] SR 26-2 scope: https://www.meilynx.com/reference/sr-26-2-generative-ai-carve-out ; https://www.moring.ai/learn/sr-26-2-explained/ ; [I] https://arxiv.org/html/2607.04103v2 (see also Orrick and Protiviti in `future-readiness.md`)

**United Kingdom**
- [I] BoE/FCA survey 2026: https://www.lewissilkin.com/insights/2026/10/30/key-lessons-from-the-bank-of-england-and-fcas-2026-survey-102o6yl ; https://www.regulationtomorrow.com/2026/10/boe-and-fca-publish-joint-report-on-ai-in-uk-financial-services/ ; [3P] https://www.resultsense.com/news/2026-10-27-boe-fca-ai-survey-2026-agents-third-parties/
- [I/V] HSBC: https://www.waterstechnology.com/emerging-technologies/7952964/hsbc-gives-31000-engineers-an-ai-coding-assistant ; https://www.hsbc.com/who-we-are/hsbc-and-digital/hsbc-and-ai/transforming-hsbc-with-ai
- [V] Lloyds: https://www.lloydsbankinggroup.com/media/press-releases/2026/lloyds-banking-group/ai-driven-benefits-2026.html ; https://ukstories.microsoft.com/features/lloyds-banking-group-rolls-out-microsoft-365-frontier-suite-to-power-its-agentic-future/
- [I/3P] NatWest: https://www.artificialintelligence-news.com/news/banking-ai-in-multiple-business-functions-at-natwest/ ; https://www.resultsense.com/news/2026-02-17-natwest-deploys-ai-across-customer-service-wealth-and-engineering ; https://cote.io/2026/07/03/how-natwest-is-using-ai.html

**European Union and Switzerland**
- [V via press] Santander: https://www.fintechfutures.com/ai-in-fintech/santander-to-extend-ai-capabilities-to-185-000-employees-worldwide ; https://www.crowdfundinsider.com/2026/06/287100-banco-santander-rolls-out-ai-tools-to-all-workers-as-early-results-demonstrate-clear-business-value/
- [V] Deutsche Bank (14 Jul 2026): https://www.db.com/news/detail/20260714-how-ai-is-reshaping-the-software-behind-everyday-banking?language_id=1
- [V/3P] UBS: https://www.ubs.com/global/en/our-firm/what-we-do/technology/innovation-and-ai.html ; https://www.bankingnewsai.com/banks/ubs
- [V] BBVA AI strategy talk (6 Oct 2026): https://shareholdersandinvestors.bbva.com/wp-content/uploads/2026/10/20261006-AIT-Strategic-Talk.pdf
- [I] ECB: https://www.bankingsupervision.europa.eu/press/speeches/date/2026/html/ssm.sp260203~672ce5d5ff.en.html ; https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp261001~cf3c630379.en.html
- [I] EBA special topic on AI: https://www.eba.europa.eu/publications-and-media/publications/special-topic-artificial-intelligence
- AI Act Omnibus, DORA Art. 17, ESAs statement: see sources in `future-readiness.md` and `market-agentic-sdlc.md`.

**Asia-Pacific**
- [I/V] CBA: https://www.retailbankerinternational.com/features/interview-cba-ai-chief/ ; https://www.commbank.com.au/content/dam/commbank-assets/investors/2026/CBA-2026-Annual-Report.pdf
- [3P] NAB: https://www.startuphub.ai/ai-news/technology/2026/nab-picks-cursor-ai-over-rivals ; [I] ANZ: https://arxiv.org/pdf/2402.05636 ; https://www.itnews.com.au/news/anz-stands-up-an-enterprise-ai-control-plane-630221
- [I] Australian inquiry: https://www.abc.net.au/news/2026-10-09/asx-markets-business-live-news-9-october-2026/107246104
- [3P] APRA letter summaries: https://certrak.com.au/ai-regulation-australia/apra-letter-to-industry-on-artificial-intelligence/ ; https://airiskaware.com/apra-ai
- [I] DBS: https://www.computerweekly.com/news/366639844/DBS-rewires-operating-models-for-AI-reasoning-era ; https://www.euromoney.com/article/1knptsrkpgtcc4sksw488gkw0/insights-from-dbs-on-being-a-trusted-ai-enabled-bank-with-a-heart/
- [I] OCBC: https://live.theasianbanker.com/video/ocbcs-donald-macdonald-genai-integration-increased-efficiency ; https://cfotech.asia/story/exclusive-ocbc-s-20-year-data-ai-innovation-journey
- [I/3P] MAS guidelines: https://www.pwc.com/sg/en/services/risk/straightaways/mas-ai-risk-management-guidelines.html ; https://www.bloomberg.com/professional/insights/regulation/october-2026-global-regulatory-brief-digital-finance/ ; https://kla.digital/blog/mas-ai-risk-management-guidelines-final
- [I] HKMA: https://www.info.gov.hk/gia/general/202610/15/P2026101500186.htm ; https://technode.global/2026/08/27/hong-kong-genai-sandbox-agentic-ai-pilots/ ; https://fintechnews.hk/41320/ai/hkma-art-framework-agentic-ai-banks/
- [I] Japan FSA: https://www.fsa.go.jp/en/news/2026/20260303/aidp.html
- [3P] RBI: https://www.bankingnewsai.com/ai-regulation/rbi ; https://cybersigmacs.com/knowledge-center/rbi-free-ai/
- [I/3P] China: https://ca.investing.com/news/stock-market-news/earnings-call-transcript-china-construction-bank-posts-steady-h1-2026-growth-93CH-4821250 ; https://thefinanser.com/2025/05/how-chinas-banks-and-fintechs-are-using-ai-to-leapfrog-the-world

**Middle East and Latin America**
- [3P] CBUAE guidance: https://hadefpartners.com/news-insights/insights/ai-in-banking-finance-in-the-uae-2026-legal-regulatory-considerations/ ; https://agoujgal.com/insights/cbuae-ai-guidance-note-analysis
- [3P] SAMA comparison: https://www.grclens.net/blog/ai-model-risk-management-banks-2026-apra-mas-cbuae
- [I] Gulf banks: https://www.khaleejtimes.com/business/tech/emirates-nbd-fab-and-mashreq-among-gccs-most-ai-advanced-banks
- [I] Bradesco: https://tiinside.com.br/en/25/08/2026/bradesco-ja-opera-no-segundo-ato-da-ia-corporativa-e-reporta-78-de-reducao-em-horas-de-desenvolvimento/ ; https://tiinside.com.br/26/08/2026/bradesco-amplia-uso-de-agentes-de-ia-e-registra-ate-20-vezes-mais-produtividade/ ; https://imasters.com.br/especial/tdc-stage-at-rec-n-play-2026/c/jn74qc2nwwzt08fqcehsbec5m98j1z9t
- [V/3P] Nubank–Devin: https://ai-best-practices.com/case-studies/nubank-refactors-6m-lines-of-etl-code-8x-faster-and-at-20x-lower-cost-us

**Hosts that must be allowed in the session's network settings to verify primary pages:** evidentinsights.com, survey.stackoverflow.co, stackoverflow.blog, www.mckinsey.com, www.osfi-bsif.gc.ca, www.newswire.ca, thelogic.co, www.advisor.ca, scotiabank.investorroom.com.

---

## 9. Chart data (JSON)

```json
{
  "meta": {
    "report": "State of AI maturity in the SDLC/PDLC 2026 - Canadian banks and regional comparison",
    "as_of": "2026-11-12",
    "scale": "L0 none/unsanctioned; L1 assisted coding in IDE; L2 task agents opening pull requests; L3 governed multi-stage agentic delivery with human gates; L4 policy-driven autonomous delivery",
    "caveat": "No primary page was opened; all figures come from search excerpts or secondary coverage. Maturity levels are analyst estimates from public evidence."
  },
  "table_a_maturity_by_region": {
    "unit": "maturity level 0-4",
    "source": "analyst estimate; basis = named-bank public evidence in report sections 3 and 4",
    "rows": [
      {"region": "United States", "level": 2.0, "low": 1.5, "high": 2.5, "confidence": "medium"},
      {"region": "United Kingdom", "level": 1.75, "low": 1.5, "high": 2.0, "confidence": "medium"},
      {"region": "Australia", "level": 1.75, "low": 1.5, "high": 2.0, "confidence": "medium"},
      {"region": "Canada", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "medium"},
      {"region": "European Union + Switzerland", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "medium"},
      {"region": "Singapore", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "medium-low"},
      {"region": "China", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "low"},
      {"region": "UAE", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "low"},
      {"region": "Brazil", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "low"},
      {"region": "Hong Kong", "level": 1.25, "low": 1.0, "high": 1.5, "confidence": "low"},
      {"region": "Japan", "level": 1.25, "low": 1.0, "high": 1.5, "confidence": "low"},
      {"region": "India", "level": 1.0, "low": 0.5, "high": 1.5, "confidence": "low"},
      {"region": "Saudi Arabia", "level": 1.0, "low": 0.5, "high": 1.5, "confidence": "low"}
    ]
  },
  "table_b_evident_ai_index_2026": {
    "unit": "rank out of 50 banks (1 = best)",
    "source": "Evident AI Index for Banks, 2026 edition, published 2026-10-06; ranks via Evident excerpts and press coverage; scores not found",
    "rows": [
      {"rank": 1, "bank": "JPMorgan Chase", "country": "US", "change": 0, "canadian": false},
      {"rank": 2, "bank": "Capital One", "country": "US", "change": 0, "canadian": false},
      {"rank": 3, "bank": "RBC", "country": "Canada", "change": 0, "canadian": true},
      {"rank": 4, "bank": "Commonwealth Bank", "country": "Australia", "change": null, "canadian": false},
      {"rank": 5, "bank": "Wells Fargo", "country": "US", "change": null, "canadian": false},
      {"rank": 6, "bank": "UBS", "country": "Switzerland", "change": null, "canadian": false},
      {"rank": 7, "bank": "Bank of America", "country": "US", "change": 3, "canadian": false},
      {"rank": 8, "bank": "Citi", "country": "US", "change": 4, "canadian": false},
      {"rank": 9, "bank": "Morgan Stanley", "country": "US", "change": -4, "canadian": false},
      {"rank": 10, "bank": "TD", "country": "Canada", "change": 3, "canadian": true},
      {"rank": 11, "bank": "HSBC", "country": "UK", "change": -3, "canadian": false},
      {"rank": 12, "bank": "Goldman Sachs", "country": "US", "change": -3, "canadian": false},
      {"rank": 13, "bank": "BBVA", "country": "Spain", "change": 1, "canadian": false},
      {"rank": 15, "bank": "Lloyds", "country": "UK", "change": null, "canadian": false},
      {"rank": 17, "bank": "NatWest", "country": "UK", "change": null, "canadian": false},
      {"rank": 19, "bank": "Barclays", "country": "UK", "change": null, "canadian": false},
      {"rank": 20, "bank": "BMO", "country": "Canada", "change": -1, "canadian": true},
      {"rank": 21, "bank": "CIBC", "country": "Canada", "change": 1, "canadian": true},
      {"rank": 23, "bank": "Standard Chartered", "country": "UK", "change": null, "canadian": false},
      {"rank": 25, "bank": "DBS", "country": "Singapore", "change": -7, "canadian": false},
      {"rank": 30, "bank": "Scotiabank", "country": "Canada", "change": -1, "canadian": true},
      {"rank": 36, "bank": "Westpac", "country": "Australia", "change": 9, "canadian": false}
    ],
    "not_ranked": ["National Bank of Canada"],
    "rbc_pillar_ranks": {"talent": 8, "innovation": 5, "leadership": 2, "transparency": 3}
  },
  "table_c_ai_use_by_lifecycle_stage": {
    "unit": "percent of respondents",
    "caveat": "Different surveys and bases; indicative shape only, not one series",
    "rows": [
      {"stage": "Requirements / planning", "pct": null, "base": null, "source": "not found"},
      {"stage": "Design / architecture", "pct": null, "base": null, "source": "not found"},
      {"stage": "Writing new code", "pct": 71, "base": "respondents whose work includes the task", "source": "DORA 2025 (via secondary)"},
      {"stage": "Generating code in familiar areas", "pct": 67, "base": "all respondents", "source": "Stack Overflow 2026"},
      {"stage": "Modifying existing code", "pct": 66, "base": "task performers", "source": "DORA 2025 (via secondary)"},
      {"stage": "Documentation", "pct": 64, "base": "task performers", "source": "DORA 2025 (via secondary)"},
      {"stage": "Creating test cases", "pct": 62, "base": "task performers", "source": "DORA 2025 (via secondary)"},
      {"stage": "Debugging", "pct": 61, "base": "all respondents", "source": "Stack Overflow 2026"},
      {"stage": "Code review", "pct": 56, "base": "task performers", "source": "DORA 2025 (via secondary)"},
      {"stage": "Code review (49 engineering leaders)", "pct": 69, "base": "49 engineering leaders", "source": "Madrona 2026 [3P]"},
      {"stage": "Deploy / operate / troubleshoot production", "pct": 20, "base": "all respondents", "source": "Stack Overflow 2026"}
    ]
  },
  "table_d_adoption_vs_trust_and_impact": {
    "d1_adoption_vs_trust": [
      {"source": "DORA 2025", "adoption_label": "Use AI at work", "adoption_pct": 90, "trust_label": "Little or no trust in AI-generated code", "trust_pct": 30},
      {"source": "Stack Overflow 2025", "adoption_label": "Use or plan to use AI tools", "adoption_pct": 84, "trust_label": "Trust accuracy of AI tools", "trust_pct": 33, "distrust_pct": 46, "high_trust_pct": 3},
      {"source": "Stack Overflow 2026", "adoption_label": "Use AI in some capacity", "adoption_pct": 83, "trust_label": "Would trust AI for important decisions", "trust_pct": 6.6, "trust_when_verifiable_pct": 48.0},
      {"source": "Sonar 2026", "adoption_label": "AI share of committed code", "adoption_pct": 42, "trust_label": "Always verify AI code before commit", "trust_pct": 48, "do_not_fully_trust_pct": 96},
      {"source": "Stack Overflow pulse May 2026", "adoption_label": "Use AI agents at work", "adoption_pct": 59, "trust_label": "Block agents from unapproved system changes", "trust_pct": 60},
      {"source": "BoE/FCA 2026 (UK financial firms)", "adoption_label": "Agents in production for decision support", "adoption_pct": 80, "trust_label": "Allow agents broad autonomy", "trust_pct": 2}
    ],
    "d2_adoption_vs_measured_impact": [
      {"source": "Faros 2026 (vendor telemetry, ~22,000 developers)", "metric": "Task throughput per developer", "change_pct": 33.7, "direction": "positive"},
      {"source": "Faros 2026", "metric": "Epics completed per developer", "change_pct": 66, "direction": "positive"},
      {"source": "Faros 2026", "metric": "Median pull-request review time", "change_pct": 441.5, "direction": "negative"},
      {"source": "Faros 2026", "metric": "Bugs per developer", "change_pct": 54, "direction": "negative"},
      {"source": "Faros 2026", "metric": "Incidents per pull request", "change_pct": 242.7, "direction": "negative"},
      {"source": "CircleCI 2026 (28.7m workflows)", "metric": "Overall throughput", "change_pct": 59, "direction": "positive"},
      {"source": "CircleCI 2026", "metric": "Main-branch throughput, median team", "change_pct": -7, "direction": "negative"},
      {"source": "METR 2025 (RCT, n=16)", "metric": "Task completion time", "change_pct": 19, "direction": "negative"},
      {"source": "METR Feb 2026 (flagged unreliable)", "metric": "Task completion time", "change_pct": -18, "ci_low": -38, "ci_high": 9, "direction": "positive"},
      {"source": "Cui et al. (3 field experiments)", "metric": "Completed tasks", "change_pct": 26, "direction": "positive"},
      {"source": "Google internal RCT (n=96)", "metric": "Task completion time", "change_pct": -21, "direction": "positive"},
      {"source": "Uplevel 2024", "metric": "Bug rate", "change_pct": 41, "direction": "negative"},
      {"source": "Thoughtworks 2026", "metric": "Delivery speed (up to)", "change_pct": 15, "direction": "positive"}
    ],
    "d2_leader_surveys": [
      {"source": "Gartner 2026", "metric": "Leaders reporting significant ROI from AI in SDLC", "pct": 35},
      {"source": "McKinsey Q2 2026 (n=334)", "metric": "Senior respondents reporting top-level acceleration", "pct": 25},
      {"source": "Gartner Sept 2026 (abstract)", "metric": "Leaders rating own AI maturity high", "pct": 5},
      {"source": "McKinsey State of AI 2026", "metric": "Companies scaling coding agents", "pct": 20, "large_enterprise_pct": 31}
    ],
    "d3_bank_self_reported": [
      {"bank": "TD", "country": "Canada", "metric": "Pull-request throughput YoY", "pct": 80, "date": "2026"},
      {"bank": "TD", "country": "Canada", "metric": "Engineers actively using GitHub Copilot", "pct": 76, "date": "2026"},
      {"bank": "BMO", "country": "Canada", "metric": "Developer productivity target (range 20-30)", "pct": 25, "low": 20, "high": 30, "date": "2026-03"},
      {"bank": "CIBC", "country": "Canada", "metric": "Developer productivity in pilot (range 10-15)", "pct": 12.5, "low": 10, "high": 15, "date": "2024"},
      {"bank": "Manulife", "country": "Canada", "metric": "Developer productivity", "pct": 30, "date": "2026"},
      {"bank": "JPMorgan Chase", "country": "US", "metric": "Engineer productivity (up to)", "pct": 30, "date": "2026-05"},
      {"bank": "Bank of America", "country": "US", "metric": "Developer productivity (more than)", "pct": 20, "date": "2026-Q2"},
      {"bank": "HSBC", "country": "UK", "metric": "Efficiency in coding time", "pct": 15, "date": "2026"},
      {"bank": "OCBC", "country": "Singapore", "metric": "Developer productivity", "pct": 20, "date": "2026"},
      {"bank": "Commonwealth Bank", "country": "Australia", "metric": "Engineers using coding agents (over)", "pct": 80, "date": "2026-09"},
      {"bank": "Santander", "country": "Spain", "metric": "Share of code developed by AI", "pct": 40, "date": "2026-06"},
      {"bank": "NatWest", "country": "UK", "metric": "Share of code produced by AI (over)", "pct": 33, "date": "2026-02"}
    ]
  },
  "table_e_canadian_institution_placement": {
    "unit": "maturity level 0-4",
    "source": "analyst estimate from public evidence only (report section 3.3)",
    "rows": [
      {"institution": "RBC", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "medium", "evident_rank_2026": 3},
      {"institution": "TD", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "medium", "evident_rank_2026": 10},
      {"institution": "Scotiabank", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "medium", "evident_rank_2026": 30},
      {"institution": "CIBC", "level": 1.0, "low": 1.0, "high": 1.5, "confidence": "medium", "evident_rank_2026": 21},
      {"institution": "BMO", "level": 1.0, "low": 1.0, "high": 1.5, "confidence": "medium", "evident_rank_2026": 20},
      {"institution": "National Bank", "level": 1.0, "low": 0.5, "high": 1.5, "confidence": "low", "evident_rank_2026": null},
      {"institution": "Desjardins", "level": null, "low": 0.5, "high": 1.5, "confidence": "low", "evident_rank_2026": null},
      {"institution": "Manulife", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "low-medium", "evident_rank_2026": null},
      {"institution": "Sun Life", "level": 1.5, "low": 1.0, "high": 2.0, "confidence": "low", "evident_rank_2026": null}
    ]
  },
  "global_level_distribution_estimate": {
    "unit": "percent of large enterprises",
    "source": "analyst estimate; bounded by Stack Overflow 2026 (17.2% no AI), McKinsey 2026 (20-31% scaling coding agents), Gartner 2026 (5% high maturity), BCG 2026 (7.5% future-built), BoE/FCA 2026 (2% broad autonomy); uncertainty at least +/-10 points per band",
    "rows": [
      {"level": "L0", "pct": 10},
      {"level": "L1", "pct": 45},
      {"level": "L2", "pct": 35},
      {"level": "L3", "pct": 8},
      {"level": "L4", "pct": 2}
    ]
  }
}
```
