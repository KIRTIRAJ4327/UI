# Unified Product Delivery Platform: stakeholder briefing video

Length: 7 min 11 s. Files: `stakeholder-briefing.mp4` (voice and on-screen captions), `stakeholder-briefing.srt` (subtitles).

Updated 13 November 2026: the comparison section now answers "Spec Kit or the platform?" using facts read in the Spec Kit source code, and places both in the wider market.

Voice generated offline with Piper (LibriTTS voice, CC BY 4.0). Product screens show sample data. Charts: survey figures come from published summaries and press coverage of the named sources; maturity levels and market scores are our own estimates. Sources are in `review/panel/maturity.md` and `review/report/ai-delivery-approaches.html`.

**00:01 · Opening**  
This briefing covers three things. Why governed AI delivery matters now. How the platform works. And how it compares with Spec Kit and the wider market.

**00:11 · Why now: use and trust**  
AI coding tools are now close to universal. In Google's DORA survey, ninety percent of developers use AI at work. But trust has not kept up. Fewer than seven percent would trust AI with an important decision. In the United Kingdom, eighty percent of financial firms run AI agents, but only two percent allow them broad autonomy.

**00:33 · Why now: delivery under strain**  
Each developer produces more, but delivery as a whole is under strain. One vendor study of about twenty-two thousand developers reports a third more tasks completed. It also reports more bugs, more incidents, and review times more than five times longer. Review has become the bottleneck.

**00:52 · Maturity by region**  
On a five-level scale, most regions sit between assisted coding and task agents. This is our estimate from public evidence. Canada sits at about level one and a half. No bank, in any region, has publicly described level three: governed delivery with named approvers at every stage. That is where this platform aims.

**01:15 · Canada**  
Canadian banks are strong on AI overall. RBC ranks third of fifty banks on the 2026 Evident AI Index, and TD is in the top ten. The regulator is explicit too. OSFI published a bulletin on generative and agentic AI in July 2026. Its model risk guideline, E-23, takes effect in May 2027.

**01:42 · What the platform does**  
The platform answers that gap. A business person describes a change. An AI agent carries it through eight stages. A named person approves each gate, and every decision lands in one evidence trail. Developers keep working in VS Code.

**02:01 · Product tour**  
This is the working prototype. Everything you see is clickable, with sample data. Let's follow one working day.

**02:09 · Home: decisions waiting**  
Alex is a solution architect. His home page shows only the decisions waiting for him, oldest first, and says exactly what each one is.

**02:18 · Design approval**  
The agent has written an architecture decision. Alex can read a plain summary, or switch to the full technical version. Every statement is linked to its source.

**02:28 · How the agent did this**  
How the agent did this shows its confidence and why, what it is unsure about, the sources and checks it used, each step it took, and its time and cost. Alex can ask the agent a question before he decides.

**02:41 · Approve with undo and audit**  
Alex accepts the one gap the agent called out, and approves. Each decision can be undone for a short time, and is recorded in the audit log.

**02:51 · Run page, stories and documents**  
The run page shows where the work is. The plan is split into stories, and each story is specified, designed and built one at a time. Any document opens in place, with where it is stored: the file in Azure Blob Storage, its versions and approvals in Azure SQL, and its fingerprint.

**03:09 · Developer Agent in VS Code**  
Building happens on the developer's machine. The platform prepares the assignment. The developer copies the prompt into the standalone Developer Agent in VS Code, and the platform tracks the branch, the Azure Boards task, the pull request, and the completion report.

**03:25 · Requester answers the agent**  
When the agent is unsure what the business meant, it asks the person who made the request. Priya, the product owner, picks an answer, and the agent goes on to write the specification.

**03:36 · Code review as named backup**  
Jon, the engineering lead, is on leave, so Alex reviews the code as his named backup. He opens a changed file, and approves the build.

**03:46 · Integration and validation gates**  
After the build is approved, integration runs. Tom, the integration lead, sees the pipeline results and approves, or sends the work back with a note. Mara, the quality lead, does the same for validation.

**04:05 · New request and plan approval**  
Anyone with the right role can start a new request in plain language. The agent drafts a delivery plan in seconds, and the product owner approves it. A requester can never approve their own plan.

**04:18 · Release**  
Sam, the release manager, checks that validation and acceptance testing are done, picks a release window, and schedules the release. Until it goes live it can be cancelled, and after release it can be rolled back.

**04:31 · Governance (super admin)**  
Dana, the platform administrator, sees everything that needs attention: approvers on leave, stuck agents, change freezes, and incomplete squads. She fixes each one in place.

**04:43 · People, cover and roles**  
She invites people, sets up cover while someone is away, and decides what each role is allowed to do.

**04:50 · Audit log**  
Every action, by a person or by the agent, lands in an audit log with a tamper-evident chain, and can be exported for auditors.

**04:59 · Dark mode**  
The whole product also works in dark mode.

**05:02 · Comparison: three layers of AI-driven delivery**  
How does this compare with the alternatives? AI-driven delivery has three layers. Coding agents write the code. Spec-driven toolkits, such as GitHub Spec Kit, make the agent work from a written requirement and plan. Governed delivery platforms decide who approves, and what is released. This platform is in the third layer.

**05:24 · Spec Kit today**  
Spec Kit deserves a fair description. It is free and open source, and it is now at version one point four. It works with forty-three coding agents, and has almost two hundred community extensions. It has review gates. Community add-ons handle multiple repositories, and Azure DevOps with human sign-off. We read this in its source code this week.

**05:47 · Spec Kit or the platform?**  
So, Spec Kit or the platform? They control different things. Spec Kit controls what the agent is asked to build. It lives in the repository, and developers use it. The platform controls who approves, and what is released. It serves nine roles, keeps one audit record, and covers integration, validation, release and rollback. One caveat matters. Spec Kit ships today. The platform is still a prototype.

**06:13 · The wider market**  
We also scored ten options on how much of the lifecycle they cover, and how deep their governance goes. Toolkits cover requirements and code well, but score low on governance. Platforms from GitHub, GitLab, Atlassian and ServiceNow score higher on governance. With add-ons, Spec Kit moves up. These scores are our own judgement from public material, not test results.

**06:37 · Our answer: both**  
Our answer is both, not either. Use Spec Kit inside the repository, as the build engine. Use the platform above it, for business approvals, separation of duties, release control, and the audit record. Next, we will add a fast path for low-risk changes, and replace copy and paste with a direct connection to the developer's agent.

**07:00 · Close**  
One governed flow, from business request to release. Named people accountable at every gate, and one evidence trail an auditor can follow. Thank you for watching.
