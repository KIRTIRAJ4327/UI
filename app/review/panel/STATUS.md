# What is fixed and what is still open (12 Nov 2026)

This file checks the findings from four sources against the current build:
- the panel (`VERDICT.md`, `owner.md`, `designer.md`, `personas.md`);
- the two market rounds;
- the future-readiness review (`future-readiness.md`).

Every "Fixed" item is covered by an automated check. Six suites cover journeys, access control, review fixes, the guided tour, documents and this round: 36, 35, 43, 10, 16 and 18 checks, 158 in total. In addition, dark mode is clean on all 19 screens and the dead-link audit passes.

## Fixed
| Finding | Raised by | Status |
|---|---|---|
| Evidence dates and numbers contradicted each other; release had four dates; notification named the wrong item | Owner, personas | Fixed (round 5) |
| Rollback promised but missing | All | Fixed: production health + Roll back with second confirmation |
| Requester's own plan could not be approved by anyone | Personas | Fixed: routes to a second approver |
| Citation links led to "page does not exist" | Designer | Fixed |
| No "How the agent did this" | Market, owner | Fixed: on every gate |
| Dark mode | User | Fixed |
| Documents only shown as one-line summaries | User | Fixed: every artifact opens in place, with Markdown, download, Azure Blob/SQL record and deep links |
| Stories not visible | User | Fixed: stories in plan, run page and library |
| Standalone Developer Agent in VS Code not shown | User | Fixed: Build card with prompt, connection, branch, Boards task, PR and completion report |
| Business questions went to the architect, the requester was view-only | Personas | Fixed: they go to the requester; chosen answers show on the run |
| Scheduled release showed "Complete" with no way to cancel | Personas | Fixed: shows "Release scheduled", with Cancel schedule |
| Hold release asked for no reason, but the message said "told why" | Personas | Fixed: a reason is required; it is logged and sent to Priya and Mara |
| @mentions said "notified" but sent nothing | Personas | Fixed: the mentioned person gets a notification |
| Invite person and Set up cover only showed a message | Personas, owner | Fixed: real forms, pending invitations, cover list, audit entries, undo |
| Exports never produced a file | Personas, owner | Fixed: audit log CSV, artifact index CSV, audit pack JSON, document .md. On the shared link, the viewer is asked to confirm each download |
| Freeze exception: message, audit log and date told three different stories | Personas | Fixed: one consistent outcome |
| Auditor and Engineering Lead could not be chosen in "View as" | Personas | Fixed: Ines Duarte (Auditor) and Jon Reyes (Engineering Lead) |
| "Requested by you" was hard-coded to Alex | Personas | Fixed |
| Governance period switch did nothing | Designer | Fixed: replaced by a plain date label |
| Fingerprint was a 32-bit hash | Future review | Fixed: real SHA-256 of each document version |

## Still open
These are product capabilities rather than prototype bugs. They are listed in priority order, and the full reasoning is in `future-readiness.md` and `market-agentic-sdlc.md`.

| # | Item | Why it matters | Effort |
|---|---|---|---|
| 1 | **Workflow templates and risk tiers.** Stages and approvers should be data, with a fast path for low-risk changes. | The biggest rigidity in the design. Competitors (ServiceNow, Harness, AWS) already auto-approve low-risk changes. | M |
| 2 | **Model admin.** A registry, per-stage pinning, model, version and prompt stamped on every artifact, use of the client's own Azure OpenAI or Foundry, and alerts before a model retires. | We score 0 on model choice, and models are retired every few months. | M |
| 3 | **Delivery MCP server.** The VS Code agent pulls its assignment and reports back, with copy-paste kept as a fallback. | Removes the weakest step in the flow. The MCP spec version dated 2026-07-28 is the current target. | M |
| 4 | **Policy as code.** Gates, separation of duties and auto-approval each record the policy version used. | Regulators want to know which rule approved a change, not only who approved it. | M–L |
| 5 | **OpenTelemetry tracing** feeding "How the agent did this", plus evals in CI. | Lets us prove agent quality over time. | M |
| 6 | **Agent identity.** Register each agent in Entra Agent ID, keep an agent registry, and add a global stop. | Security buyers ask for this, and banks lack a kill switch. | M |
| 7 | **Immutable evidence.** Write-once Blob storage, signed attestations, and an evidence pack mapped to DORA, ISO 42001 and the AI Act. | Turns the evidence chain into evidence an auditor can verify. | M |
| 8 | **Connectors and integrations.** Two-way ServiceNow and Jira Service Management, webhooks and a public API, and GitHub repos as a second option. | Reach beyond Azure DevOps. | L |
| 9 | **Insights dashboard.** Lead time against a baseline, DORA metrics, where waiting happens, and cost per change. | The return-on-investment story for the economic buyer. | M |
| 10 | **Design-system clean-up.** A type scale, elevation levels, and moving to shadcn Dialog and Sheet. | Polish and maintainability. The dialogs already trap focus and handle Esc. | M |
| 11 | **Onboarding wizard** for a new application, and a workspace switcher. | Lets the customer roll out on their own. | L |
| 12 | **Certifications:** SOC 2, ISO 27001 and ISO 42001. | Required by every regulated RFP. | L |
