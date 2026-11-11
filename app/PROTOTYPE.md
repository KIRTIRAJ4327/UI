# Clickable prototype

Two versions of the same 15-screen product.

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

## 2. Figma prototype, for design review
File: https://www.figma.com/design/yA0uUcQ3SXUKcXhqj5hUX5 (newest 18 frames, flow "Delivery Platform prototype", starting at Home). Press Present (▶).
204 click links: the sidebar, search, notification bell, Home items, list rows, decision buttons and admin actions. Frames are static, so they show each screen in its starting state; use the React prototype to show state changes.
