# Panel verdict: Unified Product Delivery Platform (11 Nov 2026)

Four reviewers worked separately on the same build, then their findings were compared:
- **Platform owner**: controls and commercial readiness. See `owner.md`.
- **UX/UI designer**: used the ui-ux-pro-max and ui-ux-review skills. See `designer.md`.
- **Persona walkthroughs**: Priya, Alex, Sam and Dana, clicked through in a browser. See `personas.md`.
- **Market analyst**: about 30 web searches, sources tagged. See `market.md`.

## Verdict

**Ready to demo the core story; not yet a complete platform. Carry on, in this order: trust first, then control, then scale.**

All four reviewers agree on three points:
1. **The core idea is genuinely different.** A business person describes the change. Named people approve all 8 stages, with backups. Every decision is sealed into one evidence chain. The market review found no competitor that brings non-engineers in before code exists, or that treats squads as something governed. The direct competition is GitHub Agent HQ, ServiceNow, Harness and GitLab.
2. **Trust is the selling point, so any inconsistency costs us the deal.** Three reviewers independently found evidence that contradicted itself:
   - dates;
   - check counts;
   - a notification that named the wrong change;
   - a rollback that was promised but did not exist.

   A risk team would find these in the first demo.
3. **Approvers need to see what the agent did.** This was the top "behind the market" item. Copilot, Devin and Codex all show this. Without it, an approval is a rubber stamp in an auditor's eyes.

**Where the reviewers disagreed:**
- **Seven human gates for every change.** The market and the platform owner see this as a weakness, because Factory and ServiceNow let low-risk changes skip steps. The personas see it as reassuring for regulated work.
  Resolution: keep all 8 stages, but add **risk tiers** per application and change type. A one-line label fix gets fewer gates. A pricing rule keeps all of them. This answers both "too heavy" and "strict enough".
- **Visual polish.** The designer would fix the design system (type scale, shadcn dialogs, focus handling) before adding features. The platform owner would add controls first.
  Resolution: do the accessibility and focus fixes now, because they are cheap and the dialogs are a WCAG risk. Do the full type-scale refactor alongside the next features, not before them.

## Done in this round
| Finding | Raised by | Status |
|---|---|---|
| "How the agent did this" panel on every gate: confidence, open questions, sources, checks, steps, model, time, cost, self-corrections, and a box to ask the agent | Market, owner | Done: Approve, Clarify, Review, Release and every run page |
| Dark mode | User | Done: light / dark / system; axe clean on all 19 routes in dark |
| Evidence page said "Saved Wed 12 Nov" and its numbers animated | Owner, personas | Fixed: 11 Nov 09:42 UTC, matching the audit log; numbers are static |
| WI-4751 had four release dates, and a notification called it "Fee schedule update" | Owner, personas | Fixed: Mon 9 Nov 16:05 everywhere; correct name |
| Rollback was promised but did not exist | All four | Fixed: released runs show production health and a "Roll back" action for Release Managers, which needs a second Release Manager to confirm |
| Priya's own plan could not be approved by anyone (dead end) | Personas | Fixed: separation of duties routes it to a second approver (Dana), who is notified, and the run says why |
| Citation links went to "page does not exist" | Designer | Fixed: they scroll to Sources and have names like "Source 1" |

## Roadmap, by priority
**P0: before a regulated client pilot**
1. **Risk-tiered workflows.** Configure which stages and gates apply per application and change type, with a fast path for low-risk changes. *(owner, market)*
2. **Real forms behind every admin action.** Invite, Set up cover, Add freeze, Freeze exception and Assign engineer should each open a form. Toast, audit log and dashboard must all record the same outcome. *(personas, owner)*
3. **Release lifecycle.** Add a Scheduled state that is not shown as "Complete". Add cancel and reschedule, a release calendar with freezes, and a reason when a release is put on hold. *(personas)*
4. **AI and data admin page.** Approved models, choice of model per stage, bring your own Copilot, Claude or Azure OpenAI, data residency, zero data retention, and a **global agent stop**. *(owner, market)*
5. **Focus and dialogs.** Move every overlay onto shadcn Dialog and Sheet primitives. Focus the page heading on every route change. Return focus to whatever opened an overlay. *(designer)*
6. **Two-way ServiceNow and Jira Service Management change requests,** replacing the free-text ticket field. *(market, owner)*

**P1: to scale and sell**
7. **Onboard an application.** A wizard to add an application, plus a workspace switcher. *(owner, Dana)*
8. **Working @mentions.** An autocomplete picker, and mentions that actually notify the person. Route the agent's business questions to the requester, not the architect. *(personas)*
9. **Insights dashboard.** Lead time against a baseline, DORA metrics, where the waiting happens, and cost per change. *(owner, market)*
10. **Auditor and Engineering Lead views,** each available in "View as". Per-change evidence packs that actually download. *(personas)*
11. **Design system.** Seven type sizes, three elevation levels, one segmented control, one page-header component, and a glossary (request, run, work item). *(designer)*
12. **Policy as code with versions.** Retention, legal hold, and budgets per application or squad. *(owner, market)*

**P2**
13. Public API and webhooks.
14. Plan, billing and usage page: seats plus metered credits, in line with the market.
15. Keyboard shortcuts and a command palette that can run actions.
16. Line-level code review comments.

## Positioning (from the market review)
> For regulated enterprises that want AI to deliver change without losing control: turn a business request into a released change through eight governed stages, with named, accountable people at every gate and one audit-ready evidence chain.

Have answers ready for three questions:
- "Can it use our Copilot or Claude?"
- "Where does it run?"
- "Show me what the agent actually did." This one can now be answered in the demo.
