# Round 3: one product, six connected screens

## Why this round is different
- **One coherent product, not twelve ideas.** Six screens follow one real journey: Home → New request → Run overview → Approve a design → Answer questions → How it was made. Every link goes to the next screen.
- **Built on the client's existing design system.** Tokens come from their current console (Inter, navy `#101429`, blue `#2469bc`, sage-grey background `#eef1ed`, soft rounded cards), so it reads as the next version of their product.
- **Dropped the "AI-generated" look** flagged by the design guidance: no cream paper, no serif narration, no mono uppercase labels everywhere, no hairline newspaper columns.

## Usability decisions
- Each screen answers "what do I need to do?" first: Home leads with the decisions waiting, Run overview leads with the next decision.
- Every waiting item names the exact decision ("Approve the solution design"), the reason, who sent it and how long it has waited.
- Approval screen: plain summary by default, full technical detail one click away, sources cited inline. The approve button stays disabled until the reviewer explicitly accepts the known risk (Microsoft HAX: make clear why the system did what it did).
- Clarifying questions show *why the agent is asking*, offer options with the agent's suggestion marked, and allow a free answer.
- New request previews the plan, the approvers and the timeline before anything starts.
- Evidence screen turns the agent's work into readable steps, including the mistake it fixed.

## Checks
axe-core WCAG 2 A/AA: 0 violations on all six screens at 1280px. Scripted tests: approve gating, summary/technical toggle, question answering, empty-request validation.

## Run
`npm install && npm run dev`, open `#v3-home`.
