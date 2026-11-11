# Clickable prototype

**Shareable link:** https://claude.ai/artifact/TywKummPrCWYpBe6uRLQTJ
It is private until you share it: open the link, use **Share**, and add the client. Each visitor gets their own copy of the demo data in their browser, so clients cannot affect each other.

First-time visitors see a short welcome and can take the **8-step guided tour**. Steps tick off automatically, and the tour switches person for you (Alex → Priya → Sam → Dana). A recorded run of the full tour is in `demo/demo-run.webm`.

To update the link after changes: `npm run build:share && python3 scripts/make-share-page.py <file.html>`, then republish that file.

Two versions of the same 19-screen product.

## 1. Working prototype (React), the one to demo
`npm install && npm run dev`, then open `#v3-home`.

Every link and button does something, and decisions change the rest of the product:
- Approving, sending back, answering or releasing moves the run to its next stage, removes it from "Waiting for you", updates the Approvals badge, adds a notification and an activity entry, and shows a confirmation with a working **Undo**.
- **New request** creates a new run (WI-4841, WI-4842, and so on); the agent drafts the plan and hands it to Priya after a few seconds.
- **Governance** problems disappear when you fix them (reassign, complete a squad), and **Connections** recovers when you sign in to Teams again.
- **Pause run / Resume run**, search (⌘K or `/`), notifications, breadcrumbs and the Approvals list all work.
- State survives a page refresh. **Prototype → Reset demo data** (bottom of the sidebar) starts over.

### Suggested 5-minute demo
1. **Home**: "3 decisions are waiting for you". Click *Approve the solution design*.
2. Read the plain summary, switch to *Full technical*, tick the risk, **Approve design**. You land on the run, now in Build. Try **Undo**, then approve again.
3. **Approvals** in the menu: answer the 2 questions, then review and **Approve build**.
4. **Home** now says *You are all caught up*; open the bell to see what happened.
5. **New request** → **Draft the plan** and watch the agent hand it to Priya.
6. Switch to the admin view: **Governance** → *Reassign to Lena Brooks* → *Complete squad* → assign Tom → **Save squad**.
7. **Connections** → **Sign in again**. Finish with **Reset demo data**.

Verified by an automated click-through: 33 of 33 journey checks pass, no dead links or dead buttons on any screen, and the WCAG 2 A/AA scan is clean.

## Roles, access control and the super admin
Use **View as** at the bottom of the menu to switch person. Each person sees their own work and can only do what their role allows.

| Person | Role | What they see |
|---|---|---|
| Alex Kim | Solution Architect | Approves designs; is the named backup for Jon's code review |
| Priya Nair | Product Owner | Approves plans and specifications (try it on a new request) |
| Sam Okafor | Release Manager | Releases; can download artifacts |
| Dana Whitfield | Platform Admin (super admin) | Everything: Governance, Squads, People and access, Roles and permissions, Policies, Connections, Audit log, every artifact |

- **Roles and permissions** (admin): an editable matrix of 9 roles against 17 permissions. Changes apply at once, are audited and can be undone. Platform Admin is locked so nobody can lock themselves out.
- **Squads** (admin): every work item's approver per stage, gaps and people on leave, plus who is available per application. "Fix squad" opens the squad for that work item.
- **Artifacts**: every stored document across all work items, generated from the live runs. Super admins and auditors see all; everyone else sees their own work. The viewer shows versions, approver, fingerprint, who opened it and where it is stored. Opening an artifact is recorded in the audit log.
- **Audit log** (admin and auditor): every decision, access, permission change and admin action, filterable, including what you do in the demo.
- Decisions that are not yours show a **View only** card naming who decides. Admin pages show **You do not have access** with the missing permission and a "Request access" button.

### 2-minute access-control demo
1. As **Alex**, there is no admin menu; open `#v3-roles` and see the refusal.
2. Start a **New request**, then **View as Priya** and approve the plan from Home.
3. **View as Dana** → **Roles and permissions** → untick "Approve designs" for Solution Architect.
4. **View as Alex** → open the design approval: the buttons are replaced by an explanation. Tick it back as Dana.
5. As **Dana**, open **Audit log**: every step above is recorded.

Verified: 34 of 34 role and access checks and 35 of 35 journey checks pass, with no dead links or buttons across 19 screens.

## 2. Figma prototype, for design review
File: https://www.figma.com/design/yA0uUcQ3SXUKcXhqj5hUX5. Press Present (▶) and pick a flow: **Delivery Platform prototype** (Home), **Super admin tour** (Dana's home) or **Access control: view only**.
About 300 click links across 25 frames: the sidebar, search, notification bell, Home items, list rows, decision buttons and admin actions. Frames are static, so they show each screen in its starting state; use the React prototype to show state changes.
