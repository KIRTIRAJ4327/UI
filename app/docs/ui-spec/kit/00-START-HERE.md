# Build kit: start here

This kit rebuilds the Unified Product Delivery Platform UI exactly as shown in the stakeholder video: 19 screens, light and dark mode, all dialogs and panels.

## Two ways to use it

### Option A (recommended): start from the working project

The folder `../starter/` is the complete, working product. Nothing needs to be generated.

```bash
cd starter
npm install
npm run dev        # open the printed address; it lands on #v3-home
```

Use Copilot only to **change or extend** it. The file `starter/.github/copilot-instructions.md` gives Copilot the project rules automatically.

### Option B: rebuild it step by step with Copilot

Use this when the code must be created inside another repository. There are 31 steps. Each step is one file in this folder with the complete code for that step, a prompt to paste into Copilot, a screenshot, and a check.

**Why steps:** Copilot cannot hold the whole product in one request. One screen per request fits, and you check each one before moving on.

**Rules for every step**

1. Do the steps in order. Do not skip the checks.
2. Give Copilot one step file at a time (attach it with `#file:` or open it and reference it).
3. Ask Copilot to copy the code exactly. If it shortens a file or writes "rest of the code here", reject the result and ask again for that file only.
4. Compare each file's line count with the count printed in the step file.
5. The app first runs at step 12. From then on, check each screen in the browser against its screenshot in `../screens/`.

## The steps

| Step | File | What it builds | Code files |
|---|---|---|---|
| 1 | `01-project-setup.md` | Project setup | `package.json`, `vite.config.js`, `jsconfig.json`, `components.json`, `index.html`, `favicon.svg`, `.gitignore`, `copilot-instructions.md`, `utils.js`, `main.jsx` |
| 2 | `02-styles-and-tokens.md` | Styles and design tokens | `index.css` |
| 3 | `03-base-components.md` | Buttons, checkbox and toast | `button.jsx`, `checkbox.jsx`, `friendly.jsx` |
| 4 | `04-animated-components.md` | Animated components for Home | `SplitText.jsx`, `AnimatedList.jsx`, `SpotlightCard.jsx` |
| 5 | `05-data-store.md` | Data store and workflow | `store.jsx` |
| 6 | `06-theme-and-shell.md` | Theme, shared UI and the app frame | `theme.jsx`, `ui.jsx`, `protomenu.jsx` |
| 7 | `07-search-notifications-tour.md` | Search, notifications, welcome and tour | `overlays.jsx`, `tour.jsx` |
| 8 | `08-shared-helpers.md` | Access rules, tables, form dialogs and comments | `gate.jsx`, `table.jsx`, `forms.jsx`, `collab.jsx` |
| 9 | `09-agent-panel.md` | "How the agent did this" panel | `agentpanel.jsx` |
| 10 | `10-documents.md` | Document viewer, stories and the Developer Agent card | `docs.jsx` |
| 11 | `11-screen-home.md` | Screen 1: Home | `Home.jsx` |
| 12 | `12-router-first-run.md` | Router, and the first run of the app | `App.jsx` |
| 13 | `13-screen-new-request.md` | Screen 2: New request | `NewRequest.jsx` |
| 14 | `14-screen-runs-approvals.md` | Screen 3: Runs and Approvals | `Runs.jsx` |
| 15 | `15-screen-run-overview.md` | Screen 4: Run overview | `Run.jsx` |
| 16 | `16-screen-approve-design.md` | Screen 5: Approve a design | `Approve.jsx` |
| 17 | `17-screen-clarify.md` | Screen 6: Answer questions | `Clarify.jsx` |
| 18 | `18-screen-evidence.md` | Screen 7: How the design was made | `Evidence.jsx` |
| 19 | `19-screen-code-review.md` | Screen 8: Code review (Build gate) | `Review.jsx` |
| 20 | `20-screen-release.md` | Screen 9: Release | `Release.jsx` |
| 21 | `21-screen-business-rules.md` | Screen 10: Business rules | `Rules.jsx` |
| 22 | `22-screen-artifacts.md` | Screen 11: Artifacts | `Artifacts.jsx` |
| 23 | `23-screen-governance.md` | Screen 12: Governance (admin) | `Admin.jsx` |
| 24 | `24-screen-squads.md` | Screen 13: Squads (admin) | `Squads.jsx` |
| 25 | `25-screen-squad-editor.md` | Screen 14: Squad for one work item (admin) | `Squad.jsx` |
| 26 | `26-screen-people.md` | Screen 15: People and access (admin) | `People.jsx` |
| 27 | `27-screen-roles.md` | Screen 16: Roles and permissions (admin) | `Roles.jsx` |
| 28 | `28-screen-policies.md` | Screen 17: Policies (admin) | `Policies.jsx` |
| 29 | `29-screen-connections.md` | Screen 18: Connections (admin) | `Connections.jsx` |
| 30 | `30-screen-audit-log.md` | Screen 19: Audit log (admin) | `Audit.jsx` |
| 31 | `31-final-router-and-checks.md` | Final router and full acceptance check | `App.jsx` |

## Screen list

| Address | Screen | Step | View as | Screenshot |
|---|---|---|---|---|
| `#v3-home` | Home | 11 | Alex Kim | `01-home.png` |
| `#v3-new` | New request | 13 | Alex Kim | `02-new-request.png` |
| `#v3-runs` | Runs and Approvals | 14 | Alex Kim | `03-runs.png` |
| `#v3-approvals` | Approvals | 14 | Alex Kim | `04-approvals.png` |
| `#v3-run-wi-4821` | Run overview | 15 | Alex Kim | `05-run-overview.png` |
| `#v3-approve` | Approve a design | 16 | Alex Kim | `06-approve-design.png` |
| `#v3-clarify` | Answer questions | 17 | Priya Nair | `07-clarify.png` |
| `#v3-evidence` | How the design was made | 18 | Alex Kim | `08-evidence.png` |
| `#v3-review` | Code review (Build gate) | 19 | Alex Kim | `09-code-review.png` |
| `#v3-release` | Release | 20 | Sam Okafor | `10-release.png` |
| `#v3-rules` | Business rules | 21 | Alex Kim | `11-business-rules.png` |
| `#v3-artifacts` | Artifacts | 22 | Dana Whitfield | `12-artifacts.png` |
| `#v3-admin` | Governance (admin) | 23 | Dana Whitfield | `13-governance.png` |
| `#v3-squads` | Squads (admin) | 24 | Dana Whitfield | `14-squads.png` |
| `#v3-squad-wi-4836` | Squad for one work item (admin) | 25 | Dana Whitfield | `15-squad-detail.png` |
| `#v3-people` | People and access (admin) | 26 | Dana Whitfield | `16-people.png` |
| `#v3-roles` | Roles and permissions (admin) | 27 | Dana Whitfield | `17-roles.png` |
| `#v3-policies` | Policies (admin) | 28 | Dana Whitfield | `18-policies.png` |
| `#v3-connections` | Connections (admin) | 29 | Dana Whitfield | `19-connections.png` |
| `#v3-audit` | Audit log (admin) | 30 | Dana Whitfield | `20-audit-log.png` |

## Other files

- `../UI-BUILD-SPEC.md`: the full written specification (styles, components, workflow, roles, data, phased plan, acceptance checklist). Each step file includes the parts it needs.
- `../screens/`: 31 reference screenshots.
- `../starter/`: the working project (Option A).

## If something looks wrong

| Symptom | Likely cause | Fix |
|---|---|---|
| Plain unstyled page | `src/index.css` not imported or Tailwind plugin missing | Check `src/main.jsx` imports `./index.css` and `vite.config.js` has `tailwindcss()` |
| Colours missing, boxes transparent | A token name was changed | Re-copy `src/index.css` from step 2 |
| "Cannot find module @/…" | Alias missing | Check `vite.config.js` and `jsconfig.json` from step 1 |
| A screen is half built | Copilot shortened the file | Compare the line count; re-do that one file |
| White page with an error about `useProto` | Providers missing | Re-copy `src/main.jsx` from step 1 |
| Fonts look different | Font packages not installed | `npm install` again; check the `@fontsource` imports at the top of `index.css` |
