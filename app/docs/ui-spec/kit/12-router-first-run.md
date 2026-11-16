# Step 12 of 31: Router, and the first run of the app

The router that maps each address to a screen. To run the app before all screens exist, use the temporary version below, then replace it with the final version at step 31.

## What to tell Copilot

Open this file in the editor, then paste this into Copilot Chat (Agent or Edit mode):

```text
Using #file:12-router-first-run.md, create src/App.jsx with exactly the code under "Temporary router".
Do not add imports for screens that do not exist yet. Then run `npm run dev` and tell me the URL.
```

## Temporary router

This version only knows Home, so the app can run now. Each screen step tells you which two lines to add.

### File: `src/App.jsx` (temporary)

`````jsx
// Temporary router: add one import and one ROUTES line per screen as you build it. Replaced by the final router in step 31.
import { useEffect, useState } from 'react';
import V3Home from '@/v3/Home';
import { RequirePerm } from '@/v3/gate';

export const ROUTES = {
  'v3-home': V3Home,
};
const GUARD = { 'v3-admin': 'squads.manage', 'v3-squad': 'squads.manage', 'v3-squads': 'squads.manage', 'v3-people': 'people.manage', 'v3-policies': 'policies.manage', 'v3-connections': 'connections.manage', 'v3-roles': 'roles.manage', 'v3-audit': 'audit.view' };

const startHash = () => { const h = location.hash.slice(1); if (h) return h; history.replaceState(null, '', '#v3-home'); return 'v3-home'; };
const useHash = () => { const [h, setH] = useState(startHash); useEffect(() => { const f = () => setH(location.hash.slice(1) || 'v3-home'); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []); return h; };
const NotFound = () => <div className="v3 grid min-h-screen place-items-center p-8 text-center"><div><h1 className="font-display text-[26px] font-semibold">This page does not exist</h1><p className="mt-2 text-[15px] text-[var(--v-ink-2)]">It may not be built yet.</p><a href="#v3-home" className="mt-5 inline-block rounded-lg bg-[var(--v-blue)] px-5 py-2.5 font-medium text-white">Go to home</a></div></div>;

export default function App() {
  const h = useHash();
  useEffect(() => { window.scrollTo(0, 0); }, [h]);
  const runId = h.startsWith('v3-run-') ? h.slice(7).split('/')[0].toUpperCase() : null;
  const squadId = h.startsWith('v3-squad-') ? h.slice(9).toUpperCase() : null;
  const key = runId ? 'v3-run' : squadId ? 'v3-squad' : h;
  const C = ROUTES[key];
  if (!C) return <NotFound />;
  const page = runId ? <C key={runId} id={runId} /> : squadId ? <C key={squadId} id={squadId} /> : <C />;
  return GUARD[key] ? <RequirePerm perm={GUARD[key]} active={key.slice(3)} crumbs={['Admin']}>{page}</RequirePerm> : page;
}
`````

## Check before the next step

- [ ] `npm run dev` starts and the browser shows the Welcome dialog, then Home as Alex Kim with "2 decisions are waiting for you".
- [ ] The sidebar, top bar, search (Ctrl/⌘+K), bell and theme toggle work.
- [ ] "View as" switches person. Links to screens you have not built yet show "This page does not exist" for now.

## Specification

## 5. Screen map and routing

Hash routing: the route is `location.hash` without `#`. A bare URL is replaced with `#v3-home`. Scroll to top on every route change.

| # | Route | Screen | File | Nav item active | Breadcrumb | Guard permission | Main user | Screenshot |
|---|---|---|---|---|---|---|---|---|
| 1 | `#v3-home` | Home | Home.jsx | Home | Home | — | everyone | 01, 29 (dark) |
| 2 | `#v3-new` | New request | NewRequest.jsx | New request | Requests / New request | — (button needs `request.create` in production) | requester | 02 |
| 3 | `#v3-runs` | Runs | Runs.jsx | Runs | Runs | — | everyone | 03 |
| 3a | `#v3-approvals` | Approvals (Runs filtered to "Waiting for me", oldest first) | Runs.jsx `approvals` | Approvals | Approvals | — | approvers | 04 |
| 4 | `#v3-run-<id>` | Run overview (any work item, e.g. `#v3-run-wi-4821`) | Run.jsx | Runs | Runs / WI-4821 | — | everyone | 05, 21, 22 |
| 4a | `#v3-run-<id>/<kind>` and `/story-<n>` | Run overview with a document open | docs.jsx | Runs | — | — | everyone | 25 |
| 5 | `#v3-approve` | Approve a design (WI-4821) | Approve.jsx | Approvals | Approvals / WI-4821 / Design | decision needs `gate.design` + holder | Solution Architect | 06, 24 |
| 6 | `#v3-clarify` | Answer questions (WI-4799) | Clarify.jsx | Approvals | Approvals / WI-4799 / Questions | decision needs `gate.plan` + holder | requester / Product Owner | 07 |
| 7 | `#v3-evidence` | How the design was made | Evidence.jsx | (none) | Runs / WI-4821 / How the design was made | — | approvers, auditors | 08 |
| 8 | `#v3-review` | Code review, Build gate (WI-4807) | Review.jsx | Approvals | Approvals / WI-4807 / Code review | `gate.build` + holder, or named backup | Engineering Lead | 09 |
| 9 | `#v3-release` | Release gate (WI-4772) | Release.jsx | Approvals | Approvals / WI-4772 / Release | `gate.release` + holder | Release Manager | 10, 28 |
| 10 | `#v3-rules` | Business rules | Rules.jsx | Business rules | Business rules / RA-MAX | — | product, architects | 11 |
| 11 | `#v3-artifacts` | Artifacts library | Artifacts.jsx | Artifacts | Artifacts | — (scope by `artifacts.all`) | everyone, auditors | 12 |
| 12 | `#v3-admin` | Governance | Admin.jsx | Governance | Admin / Governance | `squads.manage` | Platform Admin | 13 |
| 13 | `#v3-squads` | Squads | Squads.jsx | Squads | Admin / Squads | `squads.manage` | Platform Admin | 14 |
| 14 | `#v3-squad` and `#v3-squad-<id>` | Squad for one work item (default WI-4836) | Squad.jsx | Squads | Admin / Squads / WI-4836 | `squads.manage` | Platform Admin | 15 |
| 15 | `#v3-people` | People and access | People.jsx | People and access | Admin / People and access | `people.manage` | Platform Admin | 16 |
| 16 | `#v3-roles` | Roles and permissions | Roles.jsx | Roles and permissions | Admin / Roles and permissions | `roles.manage` | Platform Admin | 17, 23 (no access) |
| 17 | `#v3-policies` | Policies | Policies.jsx | Policies | Admin / Policies | `policies.manage` | Platform Admin | 18 |
| 18 | `#v3-connections` | Connections | Connections.jsx | Connections | Admin / Connections | `connections.manage` | Platform Admin | 19 |
| 19 | `#v3-audit` | Audit log | Audit.jsx | Audit log | Admin / Audit log | `audit.view` | Platform Admin, Auditor | 20 |
| — | anything else | Not found | App.jsx | — | — | — | — | — |

Overlays (no route): Welcome (30), Tour bar (31), Command palette (26), Notifications (27), Agent panel (24), Document viewer (25), Form dialog (28), Confirm dialogs.

**Router logic (App.jsx)**

1. If the window is narrower than 900px and the person has not chosen "Show the desktop layout anyway", render the narrow gate (§10.6).
2. `runId` = the part after `v3-run-` up to `/`, upper-cased. `squadId` = the part after `v3-squad-`, upper-cased.
3. If the route is not in the table and there is no runId or squadId → Not found: H1 "This page does not exist", "The link may be from an older version of the prototype.", [Go to home].
4. Run routes render `<Run id>`; squad routes render `<Squad id>`; others the mapped component.
5. If the route has a guard and the person lacks it → the RequirePerm page (§4.22) inside the Shell with that nav item active.
6. Unknown run ID → in-page message "We could not find WI-xxxx", "It may have been reset with the demo data.", [Back to all runs].

**Navigation map (where every link goes)**

```
Home ──Review──▶ gate screen (approve / clarify / review / release) or run page
  │──"See all"──▶ Approvals          │──KPI chips──▶ Runs / Governance
  │──Your requests row──▶ Run        │──Recent activity item──▶ Run
  └──Open governance (admin)──▶ Governance
New request ──Draft the plan──▶ new Run page (plan appears after 4 s)
Runs / Approvals ──row title──▶ Run      ──amber "Now" pill──▶ gate screen
Run ──Review──▶ gate screen  ──Documents/Stories──▶ Document viewer  ──Manage──▶ Squad
    ──How the agent did this──▶ Agent panel   ──Open (design trace)──▶ Evidence
Gate screens ──decision──▶ Run page (with toast + Undo)
Evidence / Agent panel sources ──▶ Artifacts
Governance ──row / Manage squad──▶ Run / Squad    ──Complete squad──▶ Squad WI-4836
Squads ──Fix squad / Edit──▶ Squad   ──Manage (pool)──▶ People
Squad ──Save squad──▶ Squads
Roles ──Manage people──▶ People     Artifacts ──Full audit log──▶ Audit
Notifications ──item──▶ its target  Command palette ──item──▶ its target
```
