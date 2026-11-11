# Persona walkthroughs: Unified Product Delivery Platform (frozen build, localhost:4174)

Method: Playwright, 1440x900, clean sessionStorage per persona, "Explore on my own", persona set with `#viewas`. Scripts and raw dumps are in `/tmp/claude-0/-home-user-UI/88bfff22-1691-53d5-ab19-4aff22ef43ff/scratchpad/panel/personas/`. Everything below comes from clicking through the UI; source was read only to confirm causes.

---

## 1. Priya Nair, Product Owner / business requester

**Jobs:** submit a request, follow its progress, answer the agent, approve a plan, know when it goes live, see what changed, get notified.

**Steps taken**
1. #v3-home: "You are all caught up", 0 unread. Shows 4 of her requests with a status pill but no date.
2. #v3-new: typed a Client Services request about the branch phone number and picked Client Services. Clicked "Draft the plan", which opened #v3-run-wi-4841 (2 clicks plus typing).
3. After about 4 s the run showed "Waiting for you". The bell had "Plan waiting for your approval". The gate itself said "You requested this, so another Product Owner must approve the plan." There was **no Approve button** for her.
4. Switched to alex, then dana (dana has `gate.plan`), and opened WI-4841. Neither had an Approve button. **The plan is stuck with no way forward.**
5. #v3-clarify (WI-4799, her own request, asking about export column order): "View only. Your role, Product Owner, does not include 'Approve designs'. Alex Kim decides this gate."
6. #v3-run-wi-4751 (released): "Released. Every stage is complete and the evidence is saved." It lists 8 document links.
7. #v3-rules, RA-MAX: a clear "where the rule is checked" view. "Request a fix for the gaps" opened #v3-new with the generic example text, not the Pricing API or batch-import gap.
8. Bell after Alex @mentioned her: nothing new arrived.

**Outcome: blocked** on approving her own plan and on answering questions about her own request. **Partly done** on following progress and seeing what changed.

**Friction points**
- #v3-run-wi-4841: separation-of-duties (SoD) deadlock. The pill and notification say "Waiting for you / your approval", the gate says someone else must approve, and nobody can. The run never names an alternate approver and offers no "ask another PO" control, even though Mara Lopez is listed as a Product Owner in #v3-people.
- #v3-clarify: business questions (column order, include closed accounts) are routed to the Solution Architect behind `gate.design`. After Alex answered, Priya's run showed "Your decision was recorded just now" and never showed which answers were chosen.
- #v3-new: the "Live preview" is static. It always says "Block values above 310 on Product Selection" whatever she types. "Needed by" is not saved; the run shows "About 3 days". The preview names Jon for "Build and integration", but the run shows Tom for Integrate.
- The generated plan copies her first sentence, truncated ("Clients complain the statement PDF shows the wrong."). Its stories are templated and irrelevant ("Explain the rule to the advisor inline").
- #v3-approvals opens on "Waiting for me 0" with "No runs match these filters". People shows her with 4 open approvals.
- Bell: "Fee schedule update released · WI-4751", but WI-4751 is "Mortgage term picker labels". Run dates disagree: audit says 9 Nov, ETA says 6 Nov, feed says Tue.
- The released run has no "what changed for users" summary, release notes, version, or production link. Document links on the run page open the unfiltered #v3-artifacts list, not the document.
- #v3-runs shows "requested by you" on WI-4836 (Alex's request) for every viewer. It is hard-coded to `by === 'alex'`.

**Missing controls:** approve or route her plan when SoD applies; edit the plan or give feedback when sending it back; answer her own clarifying questions; "notify me when live"; a released-change summary; a plain-language ETA with a reason when it slips.

**Her top request:** "Let me answer the agent's questions and get my plan approved without having to chase anyone, and when it's live, tell me what changed in plain English."

---

## 2. Alex Kim, Solution Architect

**Jobs:** triage his queue, review a design with confidence, push back, back up as code reviewer, collaborate.

**Steps taken**
1. #v3-home and #v3-approvals: 3 items with clear asks (WI-4799 questions, WI-4807 build review, WI-4821 design). One click into each.
2. #v3-approve (ADR-0173): a plain or full-technical toggle, numbered sources, an explicit "gap you are accepting", 3 platform checks, and a risk checkbox that must be ticked before approving. Very good.
3. #v3-evidence ("How the design was made"): steps, sources, self-correction, fingerprint, model.
4. Pushed back: typed a note and clicked Request changes. The toast said "Sent back to the agent with your note", with Undo, and the run showed "Agent revising the design".
5. Posted "@Priya can we file the API follow-up now?". The toast said "Priya was notified". **Priya's bell got nothing.** Typing "@" brings up no picker.
6. #v3-clarify: answered 2 product questions with radio buttons and sent them. The run moved on.
7. #v3-review (WI-4807, backup for Jon): a clear backup banner, expandable diffs, and 5 automatic checks. "Pull request #214" links back to #v3-review. Request changes **works with an empty comment** ("Sent back with your comment").

**Outcome: done** for triage, design approval and push-back. **Partly done** for code review and collaboration.

**Friction points**
- Evidence numbers conflict, which hurts trust. The run page says "13 min 48 s · 6 of 6 quality checks · 4 sources". #v3-evidence says "10.9 min · 5 of 6 · 3 sources" and "Saved Wed 12 Nov 14:33", which is after the shell date of "Tuesday 11 November". The approve page lists 4 sources.
- #v3-approvals says "oldest first" but sorts by age (1 h, 3 h, 12 min). Home sorts by wait time.
- Request changes on a design gives no new ETA and no time for when the revised design comes back. The ETA stays at Thu 13 Nov.
- Code review has no line comments, no full-file view, a dead PR link, and no rule that a comment is required to reject.
- He answers business questions (#v3-clarify) that belong to Priya.
- Comment mentions are a first-name regex with no picker, and they create no notification.

**Missing controls:** inline or line comments on the ADR and the diff; "compare with v1" for revised designs; delegate or reassign his own gate; spawn the follow-up request (Pricing API) straight from the design; a real @mention picker that actually notifies.

**His top request:** "When I send a design back, show me a diff of what the agent changed, and make my @mentions actually reach people."

---

## 3. Sam Okafor, Release Manager

**Jobs:** plan and run releases, coordinate windows and freezes, roll back, prove compliance.

**Steps taken**
1. #v3-home: 1 item, "Release the fee schedule update". Into #v3-release in 1 click.
2. #v3-release: a 4-of-4 readiness checklist (validation, UAT, pipeline, rollback plan), editable release notes, 3 window choices, and a change ticket (CHG0041872). Choosing "Now" makes a reason of at least 10 characters mandatory. Good.
3. Scheduled Thu 13 Nov 18:00. The toast said "You can cancel it until then", and Undo was the only way to cancel.
4. #v3-run-wi-4772 straight after scheduling: status **"Complete"**, every stage ticked, Release record "Approved", 2 days before it goes live.
5. Looked for rollback. The release page says "roll back for 24 hours … from the run page". Neither #v3-run-wi-4751 nor WI-4772 has a Rollback control; the only control is "Pause run".
6. Hold release: no reason was asked, but the toast claims "Priya and Mara have been told why".
7. Freezes: WI-4830 has a freeze flag, but his view of the run shows nothing about it. Ctrl+K "freeze" or "rollback" finds nothing. No release calendar exists. Freezes are only visible in #v3-policies, which is admin-only.
8. Compliance: #v3-audit is denied ("Request access" sends a request to Dana). #v3-artifacts "Export 20" gives a toast "being prepared" and no file.

**Outcome: partly done.** He can schedule one release. Rollback and calendar or freeze coordination are **blocked**, and compliance proof is partial.

**Friction points:** a scheduled release looks released; the promised rollback does not exist; no cancel or reschedule after the toast; no view across releases (the "1 other release" on Fri gives no link to it); the run page's own "Audit log" link sends him to an access-denied page; exports never arrive.

**Missing controls:** a release calendar with freezes and conflicts; batch or train releases; reschedule or cancel; rollback with a reason; post-release verification or smoke status; change-ticket validation against ServiceNow; a per-release evidence pack he can download.

**His top request:** "Give me a release calendar with freezes, and a real Rollback button on released runs."

---

## 4. Dana Whitfield, Platform Admin

**Jobs:** onboard a team or app, staff squads, manage access, set policies, handle incidents, report to leadership.

**Steps taken**
1. #v3-admin: "Needs your attention" shows 4 cards (leave, agent stopped, freeze, squad gap), KPIs, where work waits, and people load. Excellent triage.
2. "Reassign to Lena Brooks": a toast, and it works (WI-4807 holder changes).
3. "Assign an engineer": toast "Engineer assignment opened". The audit says "Assigned an engineer to WI-4790" with no name. **The run page still shows the failure and its own "Assign an engineer" button.**
4. "Review exception" (freeze): toast "Freeze exception request opened". The audit says **"Approved freeze exception"**, and the ETA silently moved to Thu 4 Dec. That is three different stories for one click, with no decision form.
5. "Complete squad", #v3-squad-wi-4836: approver and backup selects per role, "Assign", then Save gave "Squad saved. New approvers have been notified". **The Admin attention card "Squad is incomplete" was still open afterwards.**
6. #v3-people: "Invite person" and "Set up cover" each only produce a toast ("…form opened"), with no form. App "Manage" in #v3-squads goes to the generic #v3-people.
7. #v3-roles: a working permission matrix with an undoable audit trail. #v3-policies: SLA hours, SoD toggles, freezes, agent autonomy, budget. "Add freeze" does nothing.
8. #v3-connections: Teams "Sign in again" fixes it (toast "3 missed notifications sent"). Test works. "Settings" does nothing. There is no Add connection.
9. "Export audit pack" and "Export signed PDF": toasts "being prepared", no download, and nowhere to collect the file later.

**Outcome: partly done.** Triage and the leave reassignment are done. Squad staffing is done, but the dashboard does not reflect it. Onboarding a new app or team is **blocked**: the 3 applications are hard-coded and Invite is a toast. Incident handling is **partly done**. Leadership reporting is **partly done**: weekly KPIs exist, but there are no trends or export.

**Missing controls:** add an application, its repos and its connections; real invite and cover forms; a freeze exception decision with approve or deny and a reason; "unstick" a run (resume, retry, or reassign to a named engineer); a policy check that finds deadlocks like the SoD case in WI-4841, where an admin can approve or override with a reason; a leadership report covering throughput, cycle time trend, spend per change and SLA breaches; a usable export.

**Her top request:** "When I click a fix, show me a real form and make the dashboard reflect it, and let me onboard a new application without engineering's help."

---

## 5. Missing personas

**A. Auditor / Compliance officer.** The Auditor role exists in #v3-roles (`artifacts.all`, `artifacts.export`, `audit.view`), but nobody holds it in #v3-people and it is not offered in "View as". What exists today for them: the #v3-audit hash chain ("Chain verified"), filters, a signed PDF export (a toast only), #v3-evidence fingerprints, and the 7-year evidence store. **Needs:** a read-only per-change evidence pack (who approved what, against which version, with SoD proof), a sampling view (for example "all releases outside a window" or "all freeze exceptions"), an AI-use register (model, prompts, cost, self-corrections), exceptions and overrides reports, and downloads that actually arrive. The deadlocks and contradictory audit text above (freeze "opened" vs "approved") would fail an audit.

**B. Engineering Lead / developer (Jon, Lena).** Their approver role is wired in (#v3-review, backup cover), but they cannot be chosen in "View as". **Needs:** a queue of builds and failed validations (WI-4790 is held by Jon, yet nothing exists for him to act on); the real PR in the repo with line comments; the ability to take over from the agent ("I'll fix the tests") and hand back; an agent-steering prompt; repo and pipeline links; a "my squads" view. Today it is only reachable indirectly through Alex's backup review.

(An executive sponsor would also be unserved. Only Dana's admin KPIs exist, with no portfolio, value or roadmap view.)

---

## Cross-persona top 10 gaps

| # | Gap (route) | Personas | Severity | Suggested fix |
|---|---|---|---|---|
| 1 | SoD deadlock: the requester's own plan cannot be approved by anyone, while the UI tells her "Waiting for you" (#v3-run-wi-4841) | Priya, Dana | Critical | When SoD applies, route to the squad's backup PO (Mara) automatically; show "Waiting for Mara"; give admins an override with a reason; make the notification text match |
| 2 | Clarifying questions on a business request go to the Solution Architect and lock out the requester (#v3-clarify) | Priya, Alex | High | Route by question type to the request owner; show the chosen answers on the run |
| 3 | Rollback is promised but missing; scheduled releases show as "Complete" (#v3-release, #v3-run-wi-4772/4751) | Sam, Priya, Auditor | Critical | Add a "Scheduled" state, cancel and reschedule, and a Rollback action with a reason during the 24 h window |
| 4 | Admin actions only produce toasts, or say one thing and record another (Assign engineer, Review exception, Invite, Set up cover, Add freeze, Settings) (#v3-admin, #v3-people, #v3-policies, #v3-connections) | Dana, Sam, Auditor | High | Real forms with a named assignee and an approve or deny decision; one consistent outcome across toast, run and audit |
| 5 | @mentions say "notified" but no notification is created; no mention picker (all runs) | Alex, Priya, all | High | Create the notification for each mention, add an autocomplete picker, deep-link to the comment |
| 6 | No release calendar or freeze visibility for the Release Manager; freezes live only in admin Policies | Sam, Dana, Priya | High | A release calendar with windows, freezes, conflicts and exceptions; a freeze badge on runs |
| 7 | Evidence and status data contradict each other (13m48 / 6 of 6 / 4 sources vs 10.9 min / 5 of 6 / 3; WI-4751 named "Fee schedule"; Stage 3 "Impact" while "preparing the design"; "requested by you" hard-coded) | Alex, Priya, Auditor | High | Generate every summary from one record; fix the stage index and the requester check |
| 8 | Exports never arrive (Export audit pack, signed PDF, Export 20) and no auditor persona can be used | Sam, Dana, Auditor | High | Synchronous download or an "Exports" inbox; seed an Auditor and Engineering Lead in View as |
| 9 | Onboarding is impossible: apps are hard-coded, there is no Add application or Add connection, and Invite is a toast | Dana, new teams | High | An application onboarding wizard (repos, pipelines, squad template, roles), a real invite, and Add connection |
| 10 | The request intake and the result are not real: static "Live preview", "Needed by" dropped, templated plan, no "what changed" after release, document links go to the unfiltered list | Priya, exec sponsor | Medium | A live preview from the text, needed-by date driving the ETA, a released-change summary on the run, and document links that deep-link to the artifact |

Also worth fixing: a code-review reject with no comment is accepted, the PR link points back to itself, the Approvals queue opens on an empty "Waiting for me" filter, a fixed squad still shows "Squad is incomplete", and Sam is denied the audit log that his own run page links to.

---

## Verdict

Alex is the only persona who can do his core job end to end in the platform: queue, evidence-backed design approval and push-back all work well, though collaboration (mentions) and code review are shallow. Priya can submit and track but is blocked twice on her own work: a separation-of-duties deadlock on her plan and clarifying questions routed to Alex. Sam can schedule one release but has no rollback, calendar or freeze view and no working compliance export. Dana has excellent triage visibility, but most remediation, onboarding and export buttons are toast-only or record contradictory outcomes, and Auditor and Engineering Lead users cannot be served yet.
