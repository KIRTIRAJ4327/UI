# UX review and fixes: round 2 mockups (G–L)

Scope: desktop (1280px laptop and 1440px), the six round-2 concepts. Method: the `ui-ux-review` skill, an axe-core WCAG 2 A/AA scan in Chromium, keyboard tab-order checks, and scripted interaction tests.

## Findings and what changed

| # | Severity | Finding | Fix |
|---|---|---|---|
| 1 | High | Strips, calendar, recorder and rules screens never said what the user should do. | Every screen opens with a **"Your next step"** bar: one sentence and the main action, or "Nothing needs you here". |
| 2 | High | Unexplained jargon and metaphors: strip board, in bay, RQ/PO/SA stamps, blast radius, flight recorder, self-correction, CAB, layers. | Plain-language titles ("Handoff board", "What this change touches", "Agent activity"), labels in everyday words, stamp names on hover, and a collapsible **"How to read this screen"** on the unusual layouts. |
| 3 | High | Decisions gave no feedback and could not be undone. | Every approve / send back / start action shows a confirmation with **Undo** (announced to screen readers). |
| 4 | Medium | 64 contrast failures (grey labels 3.1–4.3:1, amber text 3.3:1). | Darker text greys and amber. axe now reports **0 violations** on all six screens. |
| 5 | Medium | Controls that looked interactive but weren't: console suggestions, command line, recorder slider. | Console input and suggestion buttons work; the recorder slider and step rows update the detail panel. |
| 6 | Medium | Calendar scroll area not keyboard reachable; no skip link, so keyboard users tab through the whole nav first. | Calendar region is focusable and labelled; "Skip to content" is the first tab stop. |
| 7 | Low | Mockup switcher covered page content. | Collapsed by default. |
| 8 | Low | Impact map had no text alternative. | SVG has a full text description; the side panel lists the same facts. |

## Principles applied (from research)
- **Complex is fine, complicated is not** (NN/g): keep the depth experts need, remove avoidable friction.
- **Plain language helps experts too** (NN/g): short, scannable, minimal jargon.
- **Explain why the system did what it did, and how well it can do it** (Microsoft HAX G2, G11); **explain for understanding, not completeness** (Google PAIR).
- **Let users reverse actions** (expert-user principles): undo on every decision.

## Not covered
Screen-reader walkthrough, zoom/reflow at 200%, dark mode, and real user testing. Data is sample data.

## Sources
- https://www.nngroup.com/videos/complex-vs-complicated/
- https://www.nngroup.com/videos/plain-language-for-experts/
- https://www.microsoft.com/en-us/haxtoolkit/library/example,guideline,pattern/13/all/59/
- https://uxdesign.cc/the-rulebook-for-designing-ai-experiences-a22a50bb063c
- https://interaction19.ixda.org/download/talk-designing-transparent-ai.pdf
- https://api.designprinciplesftw.com/collections/principles-for-designing-systems-for-expert-users

---

# UX review round 3: the complete product (15 screens)

Method: `ui-ux-review` skill; Chromium at 1280px and 1920px; axe-core WCAG 2 A/AA; keyboard tab order; reduced-motion emulation; scripted interaction tests.

| # | Severity | Finding | Fix |
|---|---|---|---|
| 1 | High | Search box and ⌘K looked interactive but did nothing on all 15 screens. | Working command palette: ⌘K, Ctrl+K or `/`; search runs, documents, rules, people and screens; arrow keys, Enter, Esc; empty-result message. |
| 2 | High | No notifications although approvals, reassignments and a failing Teams connection all happen. | Bell with unread count, panel of linked notifications, "Mark all read", Esc and click-outside to close. |
| 3 | Medium | Breadcrumbs were plain text, so the side menu was the only way back. | Breadcrumbs are links with `aria-current` on the current page. |
| 4 | Medium | Compact stage bars only revealed the stage on hover. | "Stage 4 of 8 · Design" shown under the bars on Home, Approvals, Runs and Governance; bars expose the same text to screen readers. |
| 5 | Medium | The floating mockup switcher covered the comment box on Code review at 1280px. | Switcher moved into the sidebar's empty space; verified it covers no control on any screen. |
| 6 | Medium | "Approvals" in the menu opened one specific approval, and the badge (3) disagreed with the list (2). | New Approvals list (Runs filtered to "Waiting for me"); data fixed so badge and list both show 3. |

Verified after fixes: 0 axe violations on all 16 routes at 1280px, no horizontal overflow, nothing covered by the switcher, focus visible on every tab stop, reduced motion shows final numbers immediately.


---

# Independent review and fixes (round 4)

An independent reviewer agent assessed the prototype against modern enterprise SaaS (Linear, Stripe, ServiceNow, GitHub). Guidance from the `ui-ux-pro-max` skill (confirmation for irreversible actions, error recovery, bulk actions, toast timing, live badge announcements) and 21st.dev data-table patterns informed the fixes.

## Fixed
| Finding | Fix |
|---|---|
| Release "Now" worked with no reason, no confirmation | Reason required (10+ characters), change-ticket field, production label, confirmation dialog naming environment, version, ticket and rollback; focus starts on Cancel; no Undo on production release |
| Undo could revert a different action (e.g. a role switch) | Undo is tied to the action that raised it and refused if anything changed since; toasts close when you leave the page |
| Notifications identical for everyone, not marked read | Notifications per person; clicking one marks it read |
| Screens disagreed on approvers and counts | One approver resolver for every screen (Integrate = Tom, backups and leave honoured); run page lists all 7 human gates; one definition per KPI with tooltips |
| Failed runs were dead ends | Failure panel with failing tests, attempts and CI link; role-based actions (re-run, assign an engineer); red failed stage in the stepper |
| Plan approval was blind and self-approvable | Plan contents (objective, stories, agent assumptions) shown before approval; "requester cannot approve their own plan" policy, switchable in Policies |
| Comments promised but missing | Discussion with @mentions on every run and on the design approval; Request changes requires a note, which joins the discussion; Activity panel per run |
| Tables did not scale | Sortable headers (aria-sort) and paging on Runs, Approvals, Artifacts and Audit; Approvals sorted oldest first |
| Audit log not audit-ready | Absolute UTC timestamps, date-range filter, sorting, paging, entry details with IP, session, before/after and a fingerprint chain; signed export |
| Risky permission grants were instant | Confirmation for sensitive permissions listing who is affected |
| People lacked enterprise basics | Search, SSO/SCIM source, separation-of-duties conflict flags |
| Small bugs | Squads breadcrumb, search over all runs (and admin pages hidden from non-admins), admin-only links hidden, Home "Review" order, sidebar overlap at 1280×800, count-up removed from data tiles, activity rows link to runs |

## Verified
New regression suite: 43 of 43 checks (every reported bug reproduced and confirmed fixed, plus axe WCAG 2 A/AA on 10 changed screens). Earlier suites still pass: journey 35/35, access control 34/34, guided tour 10/10, no dead links or buttons.

## Still open (larger build-outs)
Custom and application-scoped roles, SCIM-driven offboarding, saved and shared table views with column configuration and bulk actions, dark mode, workspace and environment switcher, the "How the agent did this" drawer on every gate.
