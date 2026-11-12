# Unified Product Delivery Platform: narrated product tour

Length: about 3 minutes (3:04). Files: `tour-narrated.mp4` (video with voice and on-screen captions), `tour-narrated.srt` (subtitles). Voice generated offline with Piper (LibriTTS voice, CC BY 4.0). All data is sample data.

**00:02 · Introduction**  
This is the Unified Product Delivery Platform. A business person describes a change, an AI delivery agent carries it through eight gated stages, and named people approve every step. Let's follow one working day.

**00:16 · Home: decisions waiting**  
Alex is a solution architect. His home page shows only the decisions waiting for him, oldest first, and says exactly what each one is.

**00:25 · Design approval**  
The agent has written an architecture decision. Alex can read a plain summary, or switch to the full technical version. Every statement is linked to its source.

**00:34 · How the agent did this**  
How the agent did this shows its confidence and why, what it is unsure about, the sources and checks it used, each step it took, and its time and cost. Alex can ask the agent a question before he decides.

**00:48 · Approve with undo and audit**  
Alex accepts the one gap the agent called out, and approves. Each decision can be undone for a short time, and is recorded in the audit log.

**00:58 · Run page, stories and documents**  
The run page shows where the work is. The plan is split into stories, and each story is specified, designed and built one at a time. Any document opens in place, with where it is stored: the file in Azure Blob Storage, its versions and approvals in Azure SQL, and its fingerprint.

**01:17 · Developer Agent in VS Code**  
Building happens on the developer's machine. The platform prepares the assignment. The developer copies the prompt into the standalone Developer Agent in VS Code, and the platform tracks the branch, the Azure Boards task, the pull request, and the completion report.

**01:34 · Requester answers the agent**  
When the agent is unsure what the business meant, it asks the person who made the request. Priya, the product owner, picks an answer, and the agent goes on to write the specification.

**01:44 · Code review as named backup**  
Jon, the engineering lead, is on leave, so Alex reviews the code as his named backup. He opens a changed file, and approves the build.

**01:55 · New request and plan approval**  
Anyone with the right role can start a new request in plain language. The agent drafts a delivery plan in seconds, and the product owner approves it. A requester can never approve their own plan.

**02:07 · Release**  
Sam, the release manager, checks that validation and acceptance testing are done, picks a release window, and schedules the release. Until it goes live it can be cancelled, and after release it can be rolled back.

**02:20 · Governance (super admin)**  
Dana, the platform administrator, sees everything that needs attention: approvers on leave, stuck agents, change freezes, and incomplete squads. She fixes each one in place.

**02:33 · People, cover and roles**  
She invites people, sets up cover while someone is away, and decides what each role is allowed to do.

**02:40 · Audit log**  
Every action, by a person or by the agent, lands in an audit log with a tamper-evident chain, and can be exported for auditors.

**02:48 · Dark mode**  
The whole product also works in dark mode.

**02:51 · Close**  
One governed flow, from business request to release. Named people accountable at every gate, and one evidence trail an auditor can follow. Thank you for watching.
