# Step 31 of 31: Final router and full acceptance check

Replace the temporary router with the final one, then run the whole checklist.

## What to tell Copilot

Open this file in the editor, then paste this into Copilot Chat (Agent or Edit mode):

```text
Using #file:31-final-router-and-checks.md, replace src/App.jsx with exactly the code in the file section.
Then run `npm run build` and `npm run lint` and report any error without changing other files.
```

## Files

Create this file with **exactly** this content.

### File: `src/App.jsx` (73 lines)

`````jsx
// Hash router for the product: 19 screens, permission guards, the narrow-screen notice and "not found".
import { useEffect, useState } from 'react';
import V3Home from '@/v3/Home';
import V3New from '@/v3/NewRequest';
import V3Run from '@/v3/Run';
import V3Approve from '@/v3/Approve';
import V3Clarify from '@/v3/Clarify';
import V3Evidence from '@/v3/Evidence';
import V3Admin from '@/v3/Admin';
import V3Runs from '@/v3/Runs';
import V3Review from '@/v3/Review';
import V3Release from '@/v3/Release';
import V3Rules from '@/v3/Rules';
import V3People from '@/v3/People';
import V3Policies from '@/v3/Policies';
import V3Connections from '@/v3/Connections';
import V3Roles from '@/v3/Roles';
import V3Artifacts from '@/v3/Artifacts';
import V3Audit from '@/v3/Audit';
import V3Squads from '@/v3/Squads';
import V3Squad from '@/v3/Squad';
import { RequirePerm } from '@/v3/gate';
import { useTheme } from '@/v3/theme';

const ApprovalsList = () => <V3Runs approvals />;
// route → screen component
export const ROUTES = {
  'v3-home': V3Home, 'v3-new': V3New, 'v3-runs': V3Runs, 'v3-approvals': ApprovalsList, 'v3-run': V3Run,
  'v3-approve': V3Approve, 'v3-clarify': V3Clarify, 'v3-evidence': V3Evidence, 'v3-review': V3Review, 'v3-release': V3Release,
  'v3-rules': V3Rules, 'v3-artifacts': V3Artifacts,
  'v3-admin': V3Admin, 'v3-squads': V3Squads, 'v3-squad': V3Squad, 'v3-people': V3People, 'v3-roles': V3Roles,
  'v3-policies': V3Policies, 'v3-connections': V3Connections, 'v3-audit': V3Audit,
};
// route → permission needed to open it
const GUARD = { 'v3-admin': 'squads.manage', 'v3-squad': 'squads.manage', 'v3-squads': 'squads.manage', 'v3-people': 'people.manage', 'v3-policies': 'policies.manage', 'v3-connections': 'connections.manage', 'v3-roles': 'roles.manage', 'v3-audit': 'audit.view' };

const startHash = () => { const h = location.hash.slice(1); if (h) return h; history.replaceState(null, '', '#v3-home'); return 'v3-home'; };
const useHash = () => { const [h, setH] = useState(startHash); useEffect(() => { const f = () => setH(location.hash.slice(1) || 'v3-home'); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []); return h; };

// Phones and narrow windows: the platform is built for laptop screens, so explain that and offer the desktop layout in a scrollable frame.
const useNarrow = () => { const q = '(max-width: 899px)'; const [n, setN] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches); useEffect(() => { const m = matchMedia(q); const f = () => setN(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []); return n; };
function NarrowGate({ onContinue }) {
  const { resolved } = useTheme();
  return (
    <div data-mode={resolved} className="v3 flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] rounded-2xl bg-[var(--v-surface)] p-6 shadow-lg ring-1 ring-black/5">
        <div className="text-[13px] text-[var(--v-ink-3)]">Clickable prototype</div>
        <h1 className="mt-1 font-display text-[24px] leading-tight font-semibold">Unified Product Delivery Platform</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--v-ink-2)]">This platform is designed for laptops and larger screens, where approvers review documents side by side with their decision. Open this link on a computer for the best experience.</p>
        <button onClick={onContinue} className="mt-5 h-11 w-full rounded-lg bg-[var(--v-blue)] font-medium text-white">Show the desktop layout anyway</button>
        <p className="mt-3 text-center text-[12.5px] text-[var(--v-ink-3)]">You will need to scroll sideways.</p>
      </div>
    </div>
  );
}
const NotFound = () => <div className="v3 grid min-h-screen place-items-center p-8 text-center"><div><h1 className="font-display text-[26px] font-semibold">This page does not exist</h1><p className="mt-2 text-[15px] text-[var(--v-ink-2)]">The link may be out of date.</p><a href="#v3-home" className="mt-5 inline-block rounded-lg bg-[var(--v-blue)] px-5 py-2.5 font-medium text-white">Go to home</a></div></div>;

export default function App() {
  const h = useHash();
  const narrow = useNarrow();
  const [wide, setWide] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, [h]);
  // #v3-run-wi-4821 (optionally /design or /story-2) and #v3-squad-wi-4836 carry the work item in the address
  const runId = h.startsWith('v3-run-') ? h.slice(7).split('/')[0].toUpperCase() : null;
  const squadId = h.startsWith('v3-squad-') ? h.slice(9).toUpperCase() : null;
  const guardKey = squadId ? 'v3-squad' : h;
  const C = ROUTES[h];
  if (narrow && !wide) return <NarrowGate onContinue={() => setWide(true)} />;
  if (!C && !runId && !squadId) return <NotFound />;
  const page = runId ? <V3Run key={runId} id={runId} /> : squadId ? <V3Squad key={squadId} id={squadId} /> : <C />;
  const body = GUARD[guardKey] ? <RequirePerm perm={GUARD[guardKey]} active={guardKey.slice(3)} crumbs={['Admin']}>{page}</RequirePerm> : page;
  return narrow ? <div style={{ overflowX: 'auto', maxWidth: '100vw' }}><div style={{ minWidth: 1280 }}>{body}</div></div> : body;
}
`````

## Check: the whole product

Work through §12 below. Every box must be ticked.

## Specification

This explains what the code above does, in words. If you later change the screen, keep to these rules.

## 10. Cross-cutting rules

### 10.1 Feedback

- Every decision shows a toast (§4.20); reversible ones carry Undo (§7.4).
- After a gate decision, navigate to the run page so the person sees the consequence; the StatusCard shows "Your decision was recorded just now."
- Destructive or irreversible actions use a confirm dialog with Cancel focused (release now, sensitive grants). Actions that need a reason use a FormDialog with a minimum length (send back, hold: 10 characters; request design changes: 5).

### 10.2 Notifications

- Created by actions in §7.4 and addressed to people (`to: []`) or to everyone (no `to`).
- Bell shows the count of unread for the signed-in person; "Mark all read" clears only theirs.
- Production: also deliver to Microsoft Teams (Connections shows failures).

### 10.3 Audit log

- Every state-changing action, every document view, every export and every View-as switch writes an entry.
- Categories: gate (Decision), access, rbac (Permissions), admin, artifact (Document), system.
- Entries are never edited; the chain fingerprint (§6.19) proves it.

### 10.4 Accessibility (WCAG 2.2 AA; the prototype passes axe on all 19 screens in light and dark)

- Landmarks: skip link, `aside` Sidebar, `nav` Primary and Breadcrumb, `main#v3main`, each Card is a `section` with an `h2`.
- One `h1` per screen. Status is never colour-only: every Pill has text, stepper has `aria-label`, check icons have sr-only text.
- All tables have a (sr-only) `caption`; sortable headers use `aria-sort`; filter chips are `role=tab` with `aria-selected`; switches use `role=switch`; matrix uses `role=checkbox`.
- Dialogs: `role=dialog|alertdialog`, `aria-modal`, labelled, focus moved in, focus trapped, Esc closes, focus returned to the opener.
- Inputs have visible labels (or sr-only labels for search), helper text linked with `aria-describedby`, invalid state with `aria-invalid`.
- Live regions: toast (`role=status aria-live=polite`), agent Q&A (`aria-live=polite`).
- Focus ring: 4px ring at 15% blue on inputs; shadcn ring on buttons. Target size ≥ 24px.
- Contrast: all `--v-ink-*` tokens ≥ 4.5:1 on surface and sunken in both modes.

### 10.5 Keyboard

| Key | Action |
|---|---|
| Ctrl/⌘ + K, or `/` (outside inputs) | Open command palette |
| ↑ ↓ ↵ Esc | Move, open, close in the palette |
| Esc | Close any dialog, sheet or popover |
| Enter | Send a question to the agent (Shift+Enter = newline) |
| Ctrl/⌘ + Enter | Post a comment |
| Tab / Shift+Tab | Cycle within an open dialog |

### 10.6 Screen sizes

- Designed for laptops: minimum layout width 1280px.
- Below 900px wide, show the narrow gate: card "Clickable prototype" / "Unified Product Delivery Platform" / "This platform is designed for laptops and larger screens, where approvers review documents side by side with their decision. Open this link on a computer for the best experience." [Show the desktop layout anyway] "You will need to scroll sideways." Choosing it renders the app in a horizontally scrollable container with `min-width: 1280px`.

### 10.7 Dark mode

- Driven only by tokens (§3.1). Never use Tailwind `dark:` classes on product components.
- Body background follows the mode. Overlays that render outside the Shell (document viewer) wrap themselves in `v3` + `data-mode`.

### 10.8 Writing style

- Plain English, sentence case, short sentences. Say who and what: "Waiting for Sam Okafor", not "Pending".
- Buttons are verbs naming the outcome: "Approve design", "Schedule release", "Send back".
- Explain consequences before the decision ("If you approve, the agent starts building. Jon Reyes reviews the code next.").
- Dates like "Thu 13 Nov", times "18:00", UTC in the audit log.
- No jargon without context; IDs (WI-4821, ADR-0173) always next to a human title.

## 12. Acceptance checklist

Run these as automated Playwright journeys (the prototype has 172 such checks across seven suites) plus an axe scan on every screen in both modes.

**Global**
- [ ] Bare URL redirects to `#v3-home`; unknown route shows "This page does not exist".
- [ ] Ctrl/⌘+K and `/` open the palette; arrows, Enter and Esc work; admin pages hidden for Alex.
- [ ] Bell count matches the signed-in person's unread notifications; Mark all read clears them.
- [ ] Theme toggle cycles light → dark → system and survives a reload.
- [ ] Below 900px the narrow gate shows; "Show the desktop layout anyway" renders a 1280px scrollable layout.
- [ ] No dead links or buttons on any screen.
- [ ] axe: zero violations on all 19 screens, light and dark.

**Delivery**
- [ ] Alex's Home says "2 decisions are waiting for you" (WI-4807, WI-4821; oldest first).
- [ ] Approve design is disabled until the risk is ticked; Request changes needs a 5-character note.
- [ ] Approving the design moves WI-4821 to Build, shows a toast with Undo, writes audit, and Undo restores it.
- [ ] Priya answers both questions; WI-4799 moves to Specify; answers appear on the run page.
- [ ] Alex approves the WI-4807 build as Jon's backup even though Solution Architect lacks `gate.build`.
- [ ] After 5 s the run waits for Tom; Tom approves integration; after 5 s Mara approves validation; Sam holds the release next.
- [ ] Send back requires a 10-character note and returns the stage to the agent.
- [ ] New request creates WI-4841 with a derived title; after 4 s the plan waits for Priya; if Priya is the requester, it goes to Dana.
- [ ] Sam schedules the release; the run shows "Release scheduled: Thu 13 Nov, 18:00" with Cancel schedule; Release now needs a 10-character reason and a confirm dialog.
- [ ] Hold release requires a reason and notifies Priya and Mara.
- [ ] The failed run WI-4790 offers re-run (passes after 3.5 s) or Assign an engineer.
- [ ] Pause run stops automatic movement until resumed.
- [ ] A comment with @Priya notifies Priya.

**Documents and evidence**
- [ ] Every Documents row, story and Artifacts row opens the viewer; deep links `#v3-run-wi-4821/design` and `/story-2` open directly; Esc returns focus.
- [ ] The viewer shows Blob path, SQL id, SHA-256 fingerprint, Boards task and PR; Markdown tab matches the document; Download saves a `.md`.
- [ ] The agent panel shows the right content for each stage and answers questions.
- [ ] Artifacts: Alex sees only his own work; Dana and Ines see everything; Export writes a CSV.

**Administration**
- [ ] Alex opening `#v3-roles` sees "You do not have access to this page".
- [ ] Dana clears leave, agent, freeze and squad problems; Governance shows "All clear".
- [ ] The squad editor blocks save while any red issue exists.
- [ ] Removing "Approve designs" from Solution Architect replaces Alex's decision panel with View only; adding a sensitive permission asks for confirmation.
- [ ] Turning off the plan SoD policy lets Priya approve her own plan.
- [ ] Fixing Teams turns the connection green.
- [ ] The audit log shows every action from this checklist, filters by category, range, person and text, exports CSV, and shows the chain in the detail panel.

## 13. Known prototype shortcuts (fix in production)

| Shortcut in the prototype | What production needs |
|---|---|
| Gate screens are bound to one work item each (Approve = WI-4821, Clarify = WI-4799, Review = WI-4807, Release = WI-4772) | Route gate screens by run and stage, e.g. `#/runs/WI-4821/design`, and load content from the API |
| Business rules shows one rule (RA-MAX); the list does not switch | Selectable rules with their own coverage and history |
| Policies (except the plan SoD switch), squad assignments and agent permissions are local to the page | Persist and audit every policy and squad change |
| Approval targets, KPI values, waiting times, load figures and Evidence numbers are static | Compute from real timestamps and telemetry |
| Audit chain uses a 32-bit hash; artifact list fingerprints are 32-bit | SHA-256, server-side, write-once storage |
| Permissions are checked only in the browser | Enforce every permission on the server |
| "Request access", "Send a reminder", "Test", "Re-index now", "Roll back" only show a toast | Real requests, with audit and notifications |
| Release notes and review comments are not saved | Save with the decision |
| "Something else" answers in Clarify are recorded as "Own answer" | Store the typed answer |
| Model shown as GPT-5.4 everywhere | Show the actual model and version per stage; allow per-stage choice |
| Dates are fixed to the week of 10–16 Nov 2026 | Real dates and the viewer's locale and time zone |
| Prototype controls, View as, Welcome and Tour | Remove, or keep only in a demo build |
