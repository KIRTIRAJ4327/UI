# Unified Product Delivery Platform: UI build specification

**Version:** 1.0 · 16 November 2026
**Source of truth:** the clickable prototype in `app/src/v3/` (commit `c56aa85`). Every value in this file was copied from that code, not redrawn from the video.
**Visual reference:** full-page screenshots of every screen and overlay in `app/docs/ui-spec/screens/` (1440 × 900, light mode unless named "dark").

---

## 0. How to use this file

This file is written so that a developer, a design team or an AI coding agent can rebuild the whole UI from it, screen by screen, without opening the prototype.

| If you are… | Read |
|---|---|
| Planning the work | §1 Product, §11 Phased build plan, §12 Acceptance checklist |
| Setting up the project | §2 Stack and setup |
| Building styles and components | §3 Design tokens, §4 Component library |
| Building a screen | §5 Screen map, then that screen in §6 |
| Wiring behaviour | §7 Workflow and state, §8 Roles and permissions, §9 Data model |
| Checking quality | §10 Cross-cutting rules, §12 Acceptance checklist, §13 Known shortcuts |

**Rules for whoever builds from this file**

1. Build in the order of §11. Each phase ends with acceptance checks; do not start the next phase until they pass.
2. Use the tokens in §3 for every colour. Never write a raw hex value in a component, except the few marked "fixed" in §3.4.
3. Copy text exactly as written in §6. The product's wording was reviewed for plain language; do not paraphrase it.
4. Every decision a person makes must (a) change state, (b) write an audit entry, (c) show a toast, and (d) offer Undo where §7.4 says so.
5. Every screen must work in light and dark mode, by keyboard only, and with a screen reader (§10.4).
6. Where this file and the screenshots disagree, this file wins. Where this file is silent, match the screenshot.

**Notation used in wireframes**

```
┌──┐ card or panel      [Button]  primary button     (Button)  outline button
│  │                    ‹Link›    text link          ☐ / ☑     checkbox
└──┘                    ▾         select             ◉ / ○     radio
●  status dot           ▮▮▮▯▯▯▯▯  compact stage bar  ⓘ         icon
```

---

## 1. The product in one page

**What it is.** A web console in which a business person describes a change in plain language and an AI agent delivers it through eight stages. A named person approves each important stage. Every decision, document and access is recorded in one audit trail.

**The eight stages** (fixed order, index 0–7):

| # | Stage | Agent produces | Approved by (role) | Default person |
|---|---|---|---|---|
| 0 | Plan | Delivery plan (objective + stories) | Product Owner | Priya Nair |
| 1 | Specify | Specification (rules + acceptance criteria) | Product Owner | Priya Nair |
| 2 | Impact | Impact assessment | Automatic (no human gate) | — |
| 3 | Design | Architecture decision record (ADR) + developer and tester handoffs | Solution Architect | Alex Kim |
| 4 | Build | Code + tests via the Developer Agent in VS Code; completion report | Engineering Lead | Jon Reyes |
| 5 | Integrate | Integration evidence (pipeline runs) | Integration Lead | Tom Iverson |
| 6 | Validate | Validation report (acceptance + regression) | Quality Lead | Mara Lopez |
| 7 | Release | Release record, notes, rollback plan | Release Manager | Sam Okafor |

**Who uses it.** Nine roles (§8): Requester, Product Owner, Solution Architect, Engineering Lead, Integration Lead, Quality Lead, Release Manager, Auditor, Platform Admin (super admin).

**The core loop.** Request → agent works → a gate opens → the named approver is notified → they read the document, check "How the agent did this", decide → toast with Undo → audit entry → the agent continues. Repeat until release.

**Principles visible in every screen**

- *What needs me?* comes first: Home lists only the decisions waiting for the signed-in person, oldest first.
- Approvals sit beside the content they approve (document left, decision panel right).
- Status colour means one thing each: **amber** = a person holds it, **blue** = the agent is working, **green** = passed or done, **red** = failed or blocked.
- Nothing is hidden behind a summary: every document opens in full, with where it is stored.
- People who cannot decide still see everything, plus an explanation of who decides.

---

## 2. Stack and setup

### 2.1 Stack

| Concern | Choice | Version used |
|---|---|---|
| Build | Vite | 8.x |
| UI | React (JavaScript, no TypeScript) | 19.x |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, CSS variables | 4.3.x |
| Components | shadcn/ui, style `radix-nova`, base colour `neutral`, icon library `lucide` | shadcn 4.x, `radix-ui` 1.8 |
| Icons | `lucide-react` | 1.72 |
| Class helpers | `clsx` + `tailwind-merge` (`cn()`), `class-variance-authority` | |
| Motion | `gsap` + `@gsap/react` (SplitText title), `motion` (AnimatedList) | |
| Fonts | `@fontsource-variable/inter`, `@fontsource/space-grotesk` (500, 600), `@fontsource/jetbrains-mono` (400) | |
| Routing | Hash routing, no router library (§5) | |
| State | One React context + `sessionStorage` (§9) | |
| Lint | `oxlint` | |
| Tests | Playwright + `axe-core` | |
| Share build | `vite-plugin-singlefile` (`vite build --mode share` → one HTML file) | |

### 2.2 Commands

```bash
npm create vite@latest app -- --template react
cd app
npm i tailwindcss @tailwindcss/vite tw-animate-css clsx tailwind-merge class-variance-authority lucide-react radix-ui \
      @fontsource-variable/inter @fontsource/space-grotesk @fontsource/jetbrains-mono gsap @gsap/react motion
npm i -D oxlint vite-plugin-singlefile axe-core
npx shadcn@latest init          # style radix-nova, base colour neutral, CSS variables yes
npx shadcn@latest add button checkbox
npm run dev                      # then open #v3-home
```

### 2.3 Config files

`vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'share' ? [viteSingleFile()] : [])],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: mode === 'share' ? { outDir: 'dist-share', assetsInlineLimit: 100_000_000, cssCodeSplit: false } : {},
}))
```

`jsconfig.json`: `{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } } }`

`src/lib/utils.js`: `export function cn(...inputs) { return twMerge(clsx(inputs)) }`

`package.json` scripts: `dev`, `build`, `preview`, `lint: oxlint`, `build:share: vite build --mode share`.

### 2.4 Folder structure

```
src/
  main.jsx            Providers: Theme → Prototype (store) → Toast → Doc → <App/>
  App.jsx             Hash router, permission guards, narrow-screen gate, Not found
  index.css           Tailwind import, fonts, tokens (§3)
  lib/utils.js        cn()
  components/
    ui/button.jsx     shadcn Button (§4.2)
    ui/checkbox.jsx   shadcn Checkbox
    friendly.jsx      ToastProvider/useToast (§4.20)
    SplitText.jsx     Animated page title (Home only)
    AnimatedList.jsx  Recent activity list (Home only)
    SpotlightCard.jsx Cursor spotlight card (Home "Waiting for you" only)
  v3/
    store.jsx         State, actions, derived data (§7, §9)
    theme.jsx         ThemeProvider, useTheme, ThemeToggle (§4.4)
    ui.jsx            PEOPLE, STAGES, Avatar, Pill, Stepper, Card, CardHead, Shell
    gate.jsx          useGate, NotYours, RequirePerm (§8.4)
    table.jsx         useTable, SortTh, Pager
    forms.jsx         FormDialog, Field, inputCls
    collab.jsx        Comments, Activity, when()
    overlays.jsx      CommandPalette, Notifications
    agentpanel.jsx    AgentPanelButton + AgentPanel
    docs.jsx          DocProvider/useDoc, document viewer, StoriesCard, DevAgentCard, StoryBar, saveFile, copyText
    tour.jsx          Welcome dialog, TourBar, useSteps
    protomenu.jsx     Prototype controls in the sidebar
    Home.jsx NewRequest.jsx Runs.jsx Run.jsx Approve.jsx Clarify.jsx Evidence.jsx Review.jsx Release.jsx
    Rules.jsx Artifacts.jsx Admin.jsx Squads.jsx Squad.jsx People.jsx Roles.jsx Policies.jsx Connections.jsx Audit.jsx
```

---

## 3. Design tokens

### 3.1 The complete stylesheet (`src/index.css`, product part)

Every product screen renders inside an element with class `v3` and `data-mode="light|dark"` (the Shell does this). All tokens live on `.v3`.

```css
@import "tailwindcss";
@import "@fontsource-variable/inter";
@import "@fontsource/space-grotesk/500.css";
@import "@fontsource/space-grotesk/600.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));
/* Keep the shadcn @theme inline block and :root defaults that `shadcn init` generates. */

.v3 {
  --radius: 0.625rem;
  --v-bg: #eef1ed; --v-surface: #ffffff; --v-sunken: #f5f7f4; --v-line: #dfe5df; --v-line-strong: #b9c4bb;
  --v-ink: #101429; --v-ink-2: #4a5550; --v-ink-3: #56615a;
  --v-blue: #2469bc;  --v-blue-soft: #e8f0fb;  --v-blue-line: #c9d8f0;
  --v-green: #23703a; --v-green-soft: #e6f4e8;
  --v-amber: #864f00; --v-amber-soft: #fdf1dc; --v-amber-line: #f0d9a8;
  --v-red: #b3261e;   --v-red-soft: #fdeceb;   --v-red-line: #f2c4c0;
  --v-toggle-off: #c3ccc5;
  --v-inv: #101429; --v-inv-fg: #ffffff; --v-side: #101429;
  --primary: #2469bc; --ring: #2469bc;
  font-family: 'Inter Variable', Inter, system-ui, sans-serif; font-size: 14px;
  color: var(--v-ink); background: var(--v-bg);
  font-feature-settings: "cv11", "ss01";
}
.v3 .font-display { font-family: 'Space Grotesk', 'Inter Variable', sans-serif; letter-spacing: -0.01em; }
.v3 .font-mono    { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.v3 .tnum         { font-variant-numeric: tabular-nums; }
.v3 h1, .v3 h2, .v3 h3 { text-wrap: balance; }

.v3[data-mode="dark"] {
  color-scheme: dark;
  --v-bg: #0d111d; --v-surface: #151a2a; --v-sunken: #1b2134; --v-line: #283048; --v-line-strong: #3a4462;
  --v-ink: #e8ebf3; --v-ink-2: #b6bdcd; --v-ink-3: #8f99ae;
  --v-blue: #7aa7ff;  --v-blue-soft: #1a2846; --v-blue-line: #2c4370;
  --v-green: #56c787; --v-green-soft: #12291d;
  --v-amber: #f2b54b; --v-amber-soft: #2b2212; --v-amber-line: #5b4520;
  --v-red: #ff8077;   --v-red-soft: #33171a;  --v-red-line: #5e2a2c;
  --v-toggle-off: #3a4462; --v-inv: #e8ebf3; --v-inv-fg: #0d111d; --v-side: #090c16;
  /* shadcn tokens follow the product palette */
  --background: var(--v-bg); --foreground: var(--v-ink); --card: var(--v-surface); --card-foreground: var(--v-ink);
  --popover: var(--v-surface); --popover-foreground: var(--v-ink); --border: var(--v-line); --input: var(--v-line-strong);
  --muted: var(--v-sunken); --muted-foreground: var(--v-ink-3); --accent: var(--v-sunken); --accent-foreground: var(--v-ink);
  --secondary: var(--v-sunken); --secondary-foreground: var(--v-ink);
  --primary: #2f74d6; --primary-foreground: #ffffff; --ring: #7aa7ff;
}
.v3[data-mode="dark"] ::placeholder { color: #737d93; }
```

The page `<body>` background is set from JS to `#eef1ed` (light) or `#0d111d` (dark) so overscroll matches (§4.4).

### 3.2 Colour roles

| Token | Light | Dark | Use |
|---|---|---|---|
| `--v-bg` | #eef1ed | #0d111d | Page background |
| `--v-surface` | #ffffff | #151a2a | Cards, dialogs, inputs |
| `--v-sunken` | #f5f7f4 | #1b2134 | Table headers, hover rows, inset boxes, chips |
| `--v-line` | #dfe5df | #283048 | Hairline borders and dividers |
| `--v-line-strong` | #b9c4bb | #3a4462 | Form inputs, hover borders, empty bar segments |
| `--v-ink` | #101429 | #e8ebf3 | Primary text |
| `--v-ink-2` | #4a5550 | #b6bdcd | Body copy, secondary text |
| `--v-ink-3` | #56615a | #8f99ae | Labels, metadata, captions (still ≥ 4.5:1 on surface) |
| `--v-blue` / `-soft` / `-line` | #2469bc / #e8f0fb / #c9d8f0 | #7aa7ff / #1a2846 / #2c4370 | Brand, links, primary action, **agent working**, selection |
| `--v-green` / `-soft` | #23703a / #e6f4e8 | #56c787 / #12291d | **Passed / done / approved** |
| `--v-amber` / `-soft` / `-line` | #864f00 / #fdf1dc / #f0d9a8 | #f2b54b / #2b2212 / #5b4520 | **A person holds it / waiting / warning** |
| `--v-red` / `-soft` / `-line` | #b3261e / #fdeceb / #f2c4c0 | #ff8077 / #33171a / #5e2a2c | **Failed / blocked / destructive / no access** |
| `--v-inv` / `--v-inv-fg` | #101429 / #fff | #e8ebf3 / #0d111d | Selected filter chip (inverted) |
| `--v-side` | #101429 | #090c16 | Sidebar and Welcome header |
| `--v-toggle-off` | #c3ccc5 | #3a4462 | Switch off, unticked matrix box border |

### 3.3 Status mapping (use everywhere)

| Meaning | Pill tone | Stepper code | Colour |
|---|---|---|---|
| Waiting for **you** | `you` | `w` | amber |
| Waiting for **someone else** | `wait` | `w` | amber |
| Agent working | `work` (dot pulses) | `a` | blue |
| Done / passed / approved / released | `done` | `d` | green |
| Failed / blocked / needs attention | `bad` | `f` | red |
| Neutral / draft / metadata | `mute` | `''` (upcoming) | sunken grey |

### 3.4 Fixed colours (allowed raw values)

| Value | Where |
|---|---|
| `#e0a000` | Waiting marker yellow: stepper `w` border and compact segment, nav badge background, "now" dots, wait bars, 1px dot in Documents list |
| `#101429` with alpha | Overlay scrims: `bg-[#101429]/45` (dialogs), `/35` (agent panel), `/30` + `backdrop-blur-[2px]` (command palette) |
| `#c8cde0`, `#8f97b3`, `#1c2140`, `white/5`, `white/10`, `white/15` | Sidebar text, sidebar sub-text, View-as select background, hover/active nav backgrounds |
| `#93201a` | Hover on the red "Release to production" button |
| `#9cc3ff` | "Undo" link inside the toast |
| Avatar hues | §9.2 (one fixed hue per person) |

### 3.5 Typography

Base: Inter Variable 14px on `.v3`. Display: Space Grotesk 600 (`font-display`). Code and IDs: JetBrains Mono (`font-mono`). Numbers in tables and KPIs: `tnum`.

| Style | Size / weight / font | Used for |
|---|---|---|
| Page title (Home) | 30px / 600 / display, `leading-tight`, animated word fade | "1 decision is waiting for you" |
| Page title | 28px / 600 / display | Every other screen H1 |
| Document title | 26px / 600 / display | ADR title on Approve |
| Empty-state / no-access title | 24px / 600 / display | Not found, no access, welcome |
| KPI value large | 26px / 600 / display / tnum | Governance KPI tiles |
| KPI value | 22px / 600 / display / tnum | Evidence KPIs, Squad "x of 6", Agent panel confidence word |
| KPI value small | 20px / 600 / display / tnum | Home KPI chips |
| Dialog title | 20px display (confirm dialogs), 19px display (document viewer), 17px semibold (form dialog, agent panel) | |
| Status card title | 17px / 600 | Run StatusCard heading, Clarify question |
| Decision panel title | 18px / 600 | "Approve the design?" |
| Card title | 15px / 600 (`CardHead`), 16px / 600 (Stories, Dev agent, In production) | |
| Body large | 15.5px, line-height 1.75 | ADR article |
| Lede | 15px, `--v-ink-2` | Paragraph under every H1 |
| Body | 14.5px / 14px / 13.5px | Paragraphs, table cells (13.5px) |
| Section label | 13px / 600 / `uppercase tracking-wide` / `--v-ink-3` | "IN ONE PARAGRAPH", document headings |
| Label / meta | 13px, 12.5px, 12px | Sub-titles, helper text, IDs |
| Micro | 11.5px, 11px, 10.5px | Avatar labels in stepper, kbd, citation chips |

### 3.6 Spacing, radius, shadow, layers

| Item | Value |
|---|---|
| Page padding | `px-8 py-7` inside `<main>` |
| Content max widths | 820 (Clarify), 980 (Policies), 1180 (Home, New, Run, Evidence, Release, Connections), 1240 (Runs, Approve, Review, Rules, Admin, Squads, Squad, People, Audit), 1320 (Artifacts, Roles) — always `mx-auto` |
| Vertical rhythm | `gap-6` between page blocks (24px), `gap-5` on list pages, `gap-4` in side panels |
| Two-column pattern | `grid grid-cols-[minmax(0,1fr)_<side>px] items-start gap-6`; side = 340, 360, 380, 400 or 420 (per screen in §6) |
| Card | `rounded-2xl border border-[--v-line] bg-[--v-surface]` + shadow `0 1px 2px rgba(16,20,41,.04), 0 8px 24px -12px rgba(16,20,41,.10)` |
| Inner boxes | `rounded-xl` (12px) for callouts and option rows; `rounded-lg` (10px) for inputs and buttons |
| Pills and chips | `rounded-full` |
| Dialogs | `rounded-2xl shadow-2xl` |
| Sticky side panels | `sticky top-24` |
| z-index | top bar 20, tour bar 10, notifications popover 40, palette / welcome / agent panel / confirm 50, form dialog and document viewer 60, toast 50 |

### 3.7 Motion

| Where | Motion |
|---|---|
| Home H1 | SplitText: words fade in, 45 ms stagger, 0.5 s, plays once on load (re-plays when the text changes) |
| Pill `work` dot | `animate-pulse` |
| StatusCard "agent working" icon | `animate-spin`, 2.5 s per turn |
| Recent activity | AnimatedList, animates once |
| "Waiting for you" card | SpotlightCard: cursor-following glow, `rgba(36,105,188,0.18)` light / `rgba(122,167,255,0.14)` dark, size 420, intensity 0.12, border glow 0.35 |
| Toggles | `transition-all` on the knob |
| Everything | Respect `prefers-reduced-motion` (SplitText and AnimatedList must skip animation) |

---

## 4. Component library

Each entry gives anatomy, exact classes (Tailwind v4, tokens written as `[var(--v-…)]`), states and accessibility. Build these before any screen.

### 4.1 Avatar

- Props: `p` (person key), `size` (default 28), `ring` (adds `ring-2 ring-white`).
- Circle, background = person hue (§9.2), white initials, font size = `size × 0.38`, `font-semibold`.
- `title="<Name>, <Role>"`.
- Sizes used: 16 (stepper), 18 (record lists), 20 (chips), 22 (lists), 24 (tables), 26, 28, 30, 32 (sidebar), 34 (run header).

### 4.2 Button (shadcn, product sizes)

Base: `inline-flex items-center justify-center rounded-lg text-sm font-medium`, focus ring `focus-visible:ring-3 ring-ring/50`, `active:translate-y-px`, disabled `opacity-50 pointer-events-none`, icons 16px.

| Variant | Look | Used for |
|---|---|---|
| `default` | `bg-primary text-white hover:bg-primary/80` | The one main action per area |
| `outline` | border, surface background, `hover:bg-muted` | Secondary actions (Send back, Request changes, Hold, Test) |
| `ghost` | no border, `hover:bg-muted` | Cancel, Clear, Discard, "All runs" |
| `destructive` | `bg-destructive/10 text-destructive` | Danger submit in FormDialog (`tone="danger"`) |

Product heights override shadcn defaults: top-bar actions `h-9 rounded-lg px-4`; panel actions `h-10 rounded-lg px-5`; decision buttons `h-11 rounded-lg text-[15px]` full width; small in-card `size="sm"` (`h-7`) with `rounded-lg`. The red "Release to production" button is `bg-[var(--v-red)] hover:bg-[#93201a]`.

### 4.3 Pill (status badge)

`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12.5px] font-medium` + tone:

| Tone | Classes |
|---|---|
| `you`, `wait` | `bg-[var(--v-amber-soft)] text-[var(--v-amber)]` |
| `work` | `bg-[var(--v-blue-soft)] text-[var(--v-blue)]` (dot `animate-pulse`) |
| `done` | `bg-[var(--v-green-soft)] text-[var(--v-green)]` |
| `bad` | `bg-[var(--v-red-soft)] text-[var(--v-red)]` |
| `mute` | `bg-[var(--v-sunken)] text-[var(--v-ink-2)]` |

Leading dot `size-1.5 rounded-full bg-current` unless `dot={false}`.

### 4.4 Theme: ThemeProvider and ThemeToggle

- Modes: `light`, `dark`, `system`. Stored in `localStorage['delivery-theme']` (default `system`; wrap in try/catch).
- `system` resolves from the host page's `<html data-theme>` if set to `light|dark`, otherwise `prefers-color-scheme`. Listen to both (media query `change` + MutationObserver on `data-theme`).
- `resolved` is written to `data-mode` on the `.v3` root, and to `document.body.style.background`.
- Toggle: `grid size-9 place-items-center rounded-lg border border-[--v-line] bg-[--v-surface] text-[--v-ink-2] hover:bg-[--v-sunken]`, icon 18px: Sun (light) → Moon (dark) → Monitor (system), cycling in that order. `aria-label="Theme: Light. Switch to Dark"`, `title="Theme: Light"`.

### 4.5 Shell (app frame)

```
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ ▣ Delivery │ Runs / WI-4821            [⌕ Search requests, rules, people ⌘K] ☀ 🔔3 (Action) │ ← top bar h-16, sticky, blur
│   Platform │──────────────────────────────────────────────────────────────────│
│ Full App…  │ [Guided tour bar — only when the tour is on]                     │ ← sticky top-16
│            │                                                                  │
│ ⌂ Home     │   <main id="v3main" class="px-8 py-7"> page content </main>      │
│ ⊕ New req. │                                                                  │
│ ⇩ Approvals 2                                                                 │
│ 🚀 Runs     │                                                                  │
│ 📖 Business rules                                                             │
│ 🛡 Artifacts│                                                                  │
│            │                                                                  │
│ Admin      │   (admin group only if the person has any admin permission)      │
│ ▦ Governance                                                                  │
│ 👥 Squads   │                                                                  │
│ ☎ People and access                                                           │
│ 🔑 Roles and permissions                                                      │
│ ⚖ Policies │                                                                  │
│ 🔌 Connections                                                                │
│ ⟲ Audit log│                                                                  │
│            │                                                                  │
│ ▸ Prototype controls                                                          │
│ ┌────────┐ │                                                                  │
│ │AK Alex Kim                                                                  │
│ │ Solution Architect                                                          │
│ │ View as [Alex Kim · Solution Architect ▾]                                   │
│ └────────┘ │                                                                  │
└────────────┴──────────────────────────────────────────────────────────────────┘
   248px                                1fr
```

- Root: `v3 grid min-h-screen grid-cols-[248px_1fr]`, `data-mode={resolved}`.
- **Skip link** first: "Skip to content" → `#v3main` (`sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50`).
- **Sidebar** `<aside aria-label="Sidebar">`: `sticky top-0 flex h-screen flex-col gap-1 bg-[var(--v-side)] px-3 py-4 text-[#c8cde0]`.
  - Brand block `mb-5 px-2.5`: 32px blue rounded-lg tile with a white "M" polyline (`M4 15V5l6 5 6-5v10`, stroke 2.2), then "Delivery Platform" (display 15px white) over "Full Application team" (12px `#8f97b3`).
  - `<nav aria-label="Primary">` scrolls (`overflow-y-auto`). Item: `flex h-9 items-center gap-3 rounded-lg px-2.5 text-[14px] hover:bg-white/5 hover:text-white`; active `bg-white/10 font-medium text-white` and `aria-current="page"`. Icon 18px, stroke 1.8.
  - Primary items: Home `#v3-home` (Home icon) · New request `#v3-new` (FilePlus2) · Approvals `#v3-approvals` (Inbox, badge = number of decisions waiting for me) · Runs `#v3-runs` (Rocket) · Business rules `#v3-rules` (BookCheck) · Artifacts `#v3-artifacts` (ShieldCheck).
  - Badge: `ml-auto rounded-full bg-[#e0a000] px-1.5 text-[11.5px] font-semibold text-[var(--v-ink)]`, hidden when 0.
  - Admin group label "Admin" (`mt-5 mb-1 px-2.5 text-[12px] font-medium text-[#8f97b3]`) and items, each shown only if the person holds its permission: Governance (LayoutDashboard, `squads.manage`) · Squads (UsersRound, `squads.manage`) · People and access (Contact, `people.manage`) · Roles and permissions (KeyRound, `roles.manage`) · Policies (Scale, `policies.manage`) · Connections (Plug, `connections.manage`) · Audit log (History, `audit.view`).
  - Prototype controls (§4.24), then the **user block** `rounded-xl bg-white/5 px-2.5 py-2`: Avatar 32 + name (14px white) + role (12px `#8f97b3`); label "View as"; `<select id="viewas">` `h-8 rounded-md border-white/15 bg-[#1c2140] text-[13px] text-white`. Changing it calls `setMe(person)` and navigates to `#v3-home`. Options in order: Alex Kim · Solution Architect, Priya Nair · Product Owner, Sam Okafor · Release Manager, Jon Reyes · Engineering Lead, Tom Iverson · Integration Lead, Mara Lopez · Quality Lead, Ines Duarte · Auditor, Dana Whitfield · Platform Admin.
- **Top bar** `<header>`: `sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[--v-line] bg-[--v-bg]/90 px-8 backdrop-blur`.
  - Breadcrumb `<nav aria-label="Breadcrumb"><ol>` 14px `--v-ink-3`, "/" separators `aria-hidden`; last item `aria-current="page"` in `--v-ink` medium; earlier items link where known: Home, Requests/Runs → `#v3-runs`, Approvals, Admin → `#v3-admin`, Squads, Business rules, and run IDs → that run.
  - Search button `h-9 w-72 rounded-lg border bg-surface px-3 text-[13.5px] text-ink-3`: Search icon, "Search requests, rules, people", `<kbd>⌘K</kbd>` at right. `aria-keyshortcuts="Control+K Meta+K /"`. Opens the palette.
  - ThemeToggle, Notifications bell (§4.17), then the page's `actions` slot.
- Global keys: Ctrl/⌘+K opens the palette; `/` opens it unless focus is in an input, textarea or select.
- Below the header: TourBar (§4.23), then `<main>`, then the Welcome dialog and the palette.

### 4.6 Card and CardHead

- `Card` = `<section>` with the card classes in §3.6. Optional `className` (e.g. `overflow-hidden`, `p-5`).
- `CardHead({ title, sub, right })`: `flex items-start gap-3 px-5 pt-4 pb-3`; `<h2>` 15px semibold; sub 13px `--v-ink-3`; `right` slot (link, Pill or small button). Links in `right` are 13px medium `--v-blue`.

### 4.7 Stepper (stage progress)

Stage string `s`: one character per stage reached; `d` done, `w` waiting on a person, `a` agent working, `f` failed; positions beyond `s.length` are upcoming. Current stage = `max(s.length,1)`.

**Full** (run page):
```
 ✓───────✓───────✓───────④───────⑤───────⑥───────⑦───────⑧
Plan  Specify  Impact  Design  Build Integrate Validate Release
●Priya ●Priya Automatic ●Alex  ●Jon   ●Tom    ●Mara    ●Sam
```
- `<ol class="grid grid-cols-8" aria-label="Delivery stages">`. Connector `absolute top-[13px] right-1/2 h-0.5 w-full`, green if the stage has a state else `--v-line`.
- Node `size-7 rounded-full border-2 text-[12px] font-semibold`: `d` green filled with Check (strokeWidth 3); `w` `border-[#e0a000] bg-amber-soft text-amber ring-4 ring-[#e0a000]/20` with the number; `a` blue border, surface fill, blue number; `f` red filled with X + `ring-4 ring-red/20`; upcoming line border, ink-3 number.
- Label 13px (`w` semibold, `f` semibold red + sr-only "(failed)"), then Avatar 16 + first name 11.5px, or "Automatic" for Impact.

**Compact**: `flex items-center gap-1`, eight `h-1.5 flex-1 rounded-full` segments: d green, w `#e0a000`, a blue, f red, else line. `role="img" aria-label="Stage 4 of 8, Design"`.

**Compact + label**: compact bar plus "Stage 4 of 8 · Design" (12px ink-3). Used in tables (`w-44`/`w-40`) and Home rows (`w-52`).

### 4.8 KPI tile

- Home chip: `<a>` `rounded-xl border bg-surface px-4 py-2.5 hover:border-line-strong`, label 12.5px ink-3, value 20px display tnum, `title` tooltip.
- Governance / Evidence tile: Card `px-5 py-4`, label 13px ink-3 (+ 8px dot amber or red for warning tiles), value 26px (Governance) or 22px (Evidence) display tnum; red text when tone is bad.

### 4.9 Filter chips (status tabs)

`<div role="tablist" aria-label="Filter by status">` of `<button role="tab" aria-selected>`: `h-8 rounded-full px-3.5 text-[13.5px] ring-1`; selected `bg-[--v-inv] text-[--v-inv-fg] ring-[--v-inv]`; others `bg-surface text-ink-2 ring-line hover:ring-line-strong`. Optional count `<span class="tnum opacity-70">`.

### 4.10 Search field and select

- Search: `<label class="flex h-9 items-center gap-2 rounded-lg border bg-surface px-3 text-[13.5px]">` + Search icon 16 ink-3 + sr-only label + borderless `<input>` (`w-36…w-48 bg-transparent outline-none`).
- Select: `h-9 rounded-lg border bg-surface px-3 text-[13.5px]` with an sr-only `<label>`.
- Form input (`inputCls`): `h-10 w-full rounded-lg border border-[--v-line-strong] bg-surface px-3 text-[14px] outline-none focus:border-[--v-blue] focus:ring-4 focus:ring-[--v-blue]/15`. Textareas use the same focus ring with `p-2.5`/`p-3`.

### 4.11 Data table, SortTh, Pager

- Table in a `Card className="overflow-hidden"`: `w-full text-[13.5px]`, sr-only `<caption>`.
- Header row: `border-b bg-[--v-sunken] text-left text-[12.5px] text-[--v-ink-3]`, cells `font-medium`, first cell `py-2.5 pl-5`, last `pr-5`.
- Body rows: `border-b last:border-0 hover:bg-[--v-sunken]`; cells `py-3`–`py-3.5`; selected row `bg-[--v-blue-soft]`.
- Sub-line under a title: `font-mono text-[12px] text-[--v-ink-3]` ("WI-4821 · Full Application").
- `useTable(rows, { sort, dir, pageSize, getters })` → `{ view, by(key), page, pages, setPage, total, from, to }`; clicking a sorted header toggles asc/desc, a new header sorts asc and resets to page 1; numbers compare numerically, else `localeCompare`.
- `SortTh`: `<th aria-sort="ascending|descending|none">` containing a button `-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-surface`; icon ChevronUp / ChevronDown / ChevronsUpDown 14px `opacity-70`.
- `Pager`: `border-t px-5 py-3 text-[13px] text-ink-3`; left "1–8 of 8 runs" (tnum) or "No runs"; right Prev/Next `size-8` bordered icon buttons (`aria-label="Previous page"`, disabled `opacity-40`) around "Page 1 of 1".
- Empty row: one cell `colSpan` all, `px-5 py-12 text-center text-ink-2`: "No runs match these filters. ‹Clear filters›".

### 4.12 Callout boxes

| Kind | Classes | Example |
|---|---|---|
| Accepted risk / warning | `rounded-xl border border-[--v-amber-line] bg-[--v-amber-soft] p-4` + AlertTriangle amber | "The gap you are accepting" |
| Your next decision | header strip `border-b border-[--v-amber-line] bg-[--v-amber-soft] px-6 py-5` with a 40px surface circle holding AlertTriangle | Run StatusCard when it is your turn |
| Failure | `border-[--v-red-line] bg-[--v-red-soft]`, `role="alert"` | Validation failed; Teams sign-in expired |
| Success | `bg-[--v-green-soft]` + CheckCircle2 green | "Your answers were sent." |
| Info quote | `rounded-lg border-l-4 border-[--v-blue] bg-[--v-blue-soft] px-4 py-3` | Story "As a…, I want…" |
| Inset facts | `rounded-xl bg-[--v-sunken] p-4` | Platform checks list in the decision panel |

### 4.13 Toggle switch

`<button type="button" role="switch" aria-checked aria-label>`: track `relative h-5 w-9 rounded-full`, on `bg-[--v-blue]`, off `bg-[--v-toggle-off]`; knob `absolute top-0.5 size-4 rounded-full bg-white shadow transition-all`, `left-[18px]` on, `left-0.5` off.

### 4.14 FormDialog, Field

```
┌──────────────────────────────────────────────┐
│ Hold this release                        ✕   │ ← header border-b px-6 py-4, title 17px
│ Priya Nair and Mara Lopez are told why…      │   sub 13px ink-3
├──────────────────────────────────────────────┤
│ Why are you holding it?                      │ ← Field label 13.5px medium
│ ┌──────────────────────────────────────────┐ │
│ │ e.g. Pricing team asked to wait…         │ │
│ └──────────────────────────────────────────┘ │
│ At least 10 characters. This goes into…      │ ← help 12.5px ink-3, id="<id>-help"
├──────────────────────────────────────────────┤
│                        Cancel  [Hold release]│ ← footer bg-sunken px-6 py-3
└──────────────────────────────────────────────┘
```
- Scrim `fixed inset-0 z-[60] grid place-items-center bg-[#101429]/45 p-6`; clicking the scrim closes.
- Panel is a `<form role="dialog" aria-modal="true" aria-labelledby="fd-t">`, `w-full max-w-[480px] rounded-2xl border bg-surface shadow-2xl`. Body `flex flex-col gap-4 px-6 py-5 text-[14px]`.
- On open focus the first input; Tab and Shift+Tab cycle inside; Esc closes; on close focus returns to the opener. Enter submits only when not disabled.
- Footer: ghost "Cancel" + submit (`default`, or `destructive` when `tone="danger"`), both `h-10 rounded-lg`.

### 4.15 Confirm dialog (alertdialog)

Used for "Release to production now?" and "Grant … to …?". `role="alertdialog" aria-modal aria-labelledby aria-describedby`, `max-w-[460–480px] rounded-2xl bg-surface p-6 shadow-2xl`, title 20px display. **Initial focus on Cancel** (safe default). Esc and scrim click cancel. Buttons right-aligned: (Cancel) [Confirm].

### 4.16 Command palette

```
┌──────────────────────────────────────────────────────────┐
│ ⌕ Search runs, documents, rules and people…        [Esc] │ h-14 input, 15px
├──────────────────────────────────────────────────────────┤
│ Go to                                                    │ group label 12px ink-3
│  ▦ Home                                               ↵  │ active row bg-blue-soft
│  ▦ New request                                           │
│ Runs                                                     │
│  🚀 WI-4821 Registered Amortization limit                 │
├──────────────────────────────────────────────────────────┤
│ ↑ ↓ move    ↵ open    Esc close                          │ footer bg-sunken 12px
└──────────────────────────────────────────────────────────┘
```
- Scrim `z-50 bg-[#101429]/30 backdrop-blur-[2px]`, panel at `pt-[12vh]`, `max-w-[620px] rounded-2xl shadow-2xl ring-1 ring-black/10`.
- Input `role="combobox" aria-expanded aria-controls="cp-list" aria-activedescendant`; list `role="listbox"`, options `role="option" aria-selected`. Arrow keys move, Enter opens, Esc closes, Tab is blocked, mouse move sets the active row.
- Items: "Go to" pages (admin pages only if permitted: Governance, Policies, Connections, Squads, Roles and permissions, Audit log, each suffixed "(admin)"), every run in state (`<ID> <title>`), Documents (ADR-0173 …, How the WI-4821 design was made), Business rules (RA-MAX …, RATE-H …), People (Priya Nair · Product Owner; Jon Reyes · Engineering Lead (on leave); Lena Brooks · Engineering Lead).
- Empty query shows Go to + Runs (first 14). No match: "Nothing matches “q”. Try a run ID like WI-4821 or a person’s name."

### 4.17 Notifications popover

- Bell button `relative grid size-9 rounded-lg border bg-surface`, `aria-label="Notifications, 3 unread"`, `aria-expanded`. Unread badge `absolute -top-1 -right-1 h-[18px] min-w-[18px] rounded-full bg-[--v-red] px-1 text-[11px] font-semibold text-white`.
- Popover `role="dialog" aria-label="Notifications"`, `absolute right-0 top-11 z-40 w-[380px] rounded-2xl shadow-2xl`. Header: "Notifications" + ‹Mark all read› (13px blue) + close ✕.
- Row (link): unread dot `size-2 bg-blue` (transparent when read), title 14px (semibold if unread), sub 12.5px ink-3 truncated, age 12px at right, sr-only "Unread". Clicking marks that one read and navigates. Closes on outside click and Esc. List `max-h-[400px] overflow-y-auto`.
- Only notifications addressed to the signed-in person (or to everyone) are shown.

### 4.18 Agent panel ("How the agent did this")

Trigger `AgentPanelButton({ stage, run, label })`: outline `h-9 rounded-lg`, Sparkles icon in blue, default label "How the agent did this" (Approve uses "How it was made"). `aria-haspopup="dialog"`.

```
                                   ┌───────────────────────────────────────┐
                                   │ ✦  WI-4821 · Design stage          ✕ │
                                   │    How the agent did this             │
                                   ├───────────────────────────────────────┤
                                   │ Confidence                            │
                                   │ High   86 of 100                      │
                                   │ ███████████████████████░░░░            │
                                   │ Based on checks passed (6 of 6), …    │
                                   │ ┌ What the agent is unsure about ───┐ │ amber box
                                   │ │ • The Pricing API also accepts…   │ │
                                   │ └───────────────────────────────────┘ │
                                   │ What it produced                      │
                                   │ Sources it used  1 ▤ Product rules v4 │
                                   │ Checks  ✓ … / ✗ …                     │
                                   │ Steps   🔧 Found and fixed…   3m 06s  │
                                   │ ┌Model GPT-5.4┐┌Time 13 min 48 s┐     │
                                   │ ┌Cost $0.21 · 6,410 tokens┐┌Self-corrections 1┐
                                   │ (Q&A bubbles)                          │
                                   ├───────────────────────────────────────┤
                                   │ [Ask why, what it checked, or …] [➤]  │
                                   └───────────────────────────────────────┘
```
- Right-side sheet: scrim `fixed inset-0 z-50 flex justify-end bg-[#101429]/35`; panel `<aside role="dialog" aria-modal aria-labelledby="ap-t">` `h-full w-full max-w-[480px] border-l bg-surface shadow-2xl`. Focus starts on ✕; Esc and scrim close and return focus to the trigger.
- Confidence word and bar colour: ≥ 80 **High** green, ≥ 65 **Medium** amber, else **Low** red. Bar `h-2 rounded-full`, `role="img" aria-label="Confidence 86 out of 100"`.
- Explanation: "Based on checks passed (n of m), agreement between k sources, and u open question(s). Decide with the open questions in mind."
- Checks: CheckCircle2 green or XCircle red, plus sr-only ": passed" / ": not passed". Steps whose text contains "fix" get a Wrench icon in amber. For WI-4821 Design add ‹Open the full trace› → `#v3-evidence`.
- Metric tiles `grid grid-cols-2 gap-2`, each `rounded-lg bg-sunken px-3 py-2` with icon (Cpu, Clock, Coins, Wrench).
- Ask box: textarea 1 row, Enter sends, Shift+Enter newline; send button icon-only `aria-label="Ask"`, disabled when empty. Answers appear as chat bubbles (question right, blue-soft; answer left, sunken, prefixed **Agent:**) in an `aria-live="polite"` section. Canned answers by keyword: risk/gap/api/server, source/evidence/where, confiden/sure/why; otherwise "I have added your question to the discussion and flagged the stage owner…".
- Per-stage content is in §9.6.

### 4.19 Document viewer

Opened from anywhere with `openDoc({ run, kind, story? })`. Also opens from deep links `#v3-run-wi-4821/<kind>` and `#v3-run-wi-4821/story-<n>`.

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ ▤  WI-4821 · Registered Amortization limit · Design stage   ●Waiting for approval  v2 ✕│
│    Architecture decision record                                                        │
├────────────────────────────────────────────────────────────┬──────────────────────────┤
│ (👁 Document) (</> Markdown source)                         │ Author     Delivery agent│
│                                                            │ Approver   AK Alex Kim   │
│   DECISION                                                 │ Requested by Priya Nair  │
│   Enforce the maximum in the Product Selection form…       │ STORED                   │
│   OPTIONS CONSIDERED  ┌table┐                              │ ⛁ Azure Blob Storage     │
│   ACCEPTED RISK  ▌The Pricing API still accepts…           │   artifacts/full-…/…md   │
│   [Product Selection]──▶[Shared validator]┄┄▶[Pricing API] │ ⛃ Azure SQL              │
│   CHANGES SINCE V1   + AC-3 cited…  − Unreferenced…         │   dbo.Artifacts · id …   │
│                                                            │ ⧉ Fingerprint sha256:…   │
│                                                            │ LINKED  Azure Boards #…  │
│                                                            │ (⇩ Download .md) (🔗 Copy link)
└────────────────────────────────────────────────────────────┴──────────────────────────┘
```
- Wrapped in its own `v3` + `data-mode` so it themes correctly. Scrim `z-[60] bg-[#101429]/45 p-6`; dialog `max-h-[92vh] w-full max-w-[1080px] rounded-2xl`, body grid `grid-cols-[minmax(0,1fr)_300px]`.
- Header: 36px blue-soft icon tile; meta line (mono ID · title · stage) 12.5px; title 19px display; status Pill (Approved/Built → done, Failed → bad, Draft/Queued/Planned → mute, else wait); version chip `rounded-md bg-sunken px-2 font-mono text-[12px]`; close ✕ (receives focus).
- Tabs (`role="tablist"`): "Document" (Eye) and "Markdown source" (Code2); active tab has a 2px blue bottom border.
- Content area `overflow-y-auto px-8 py-6`, `tabIndex=0`, article `max-w-[680px] text-[14.5px] leading-[1.7]`. Block types: heading (13px uppercase ink-3), paragraph, callout (info quote), bullet list, numbered list, code (with a header "Paste into the Agent in VS Code" and ‹Copy›), table (rounded border, sunken header; cells containing "gap" or "Not changed" are amber), stories (clickable rows with StoryBar), progress, diff (green "+" rows, red "−" rows, sr-only "Added:/Removed:"), diagram (SVG three boxes 170×46: two solid blue, the third dashed amber; solid arrow then dashed arrow; caption "Solid: changed in this request. Dashed: not changed.").
- Markdown tab: `<pre>` of the same content converted to Markdown.
- Record side panel `bg-sunken px-5 py-5 text-[13px]`: Author "Delivery agent", Approver (stage's default approver, or "Automatic"), Requested by; **Stored**: Azure Blob Storage path, Azure SQL `dbo.Artifacts · id <n>` + "Versions, approvals and access", Fingerprint `sha256:<first 16 hex>…` computed with `crypto.subtle.digest('SHA-256', markdown)` ("Calculating…" until ready; full hash in `title`); **Linked**: Azure Boards #task, "PR #n · Azure Repos" (or "PR opens at Build") from Design onwards, story links (on the plan) or "Delivery plan" (on a story). Buttons: (Download .md) if the person can see artifacts, (Copy link) to the deep link.
- Opening a document writes an audit entry "Viewed document" (category access). Closing restores the URL to the run and focus to the opener. Focus is trapped while open.

### 4.20 Toast with Undo

- One toast at a time, bottom centre: container `pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center`, `role="status" aria-live="polite"`; toast `rounded-lg bg-[#101429] px-4 py-2.5 text-white shadow-lg`, optional ‹Undo› (`font-semibold text-[#9cc3ff] underline`).
- Duration 8 s with Undo, 5 s without. Navigating away (hash change more than 1.5 s after the toast appeared) dismisses it.
- Undo calls `undo(token)`; it succeeds only if nothing else changed since (§7.5). Result toast: "Undone." or "Cannot undo: something else has changed since."

### 4.21 Comments and Activity

- **Comments** card ("Discussion", "n comment(s)"): each comment = Avatar 28 + bubble `rounded-xl rounded-tl-sm bg-sunken px-3 py-2 text-[14px]` with name, time (`when()`: "just now", "n min ago", or "11 Nov, 09:32 UTC"), text with @mentions highlighted (`rounded bg-blue-soft px-1 font-medium text-blue`). Composer: textarea 2 rows, placeholder "Add a comment. Type @ and a name to notify someone.", hint "Ctrl + Enter to post", [Post] disabled when empty. Mentions recognised: Priya, Alex, Sam, Dana, Jon, Lena, Tom, Mara. Toast: "Comment posted." or "Comment posted. Priya was notified." / "… were notified."
- **Activity** card ("Activity", "Everything that happened on this work item", right ‹Audit log›): up to 8 audit entries whose target contains the run ID, grid `24px 1fr auto`: avatar (or grey dot), "**Name** lower-cased action", time. Empty: "No activity recorded yet."

### 4.22 Gate helpers: NotYours and RequirePerm

- **NotYours** card (decision side panel when the viewer cannot decide): Lock icon + **View only**; text either "Your role, **X**, does not include “<permission label>”." or "This decision is assigned to someone else."; holder box (Avatar 30, name, "<role> · decides this gate"); footnote "You can read everything on this page and leave a comment. Try **View as** at the bottom of the menu to switch person."
- **RequirePerm** page (admin route without permission): centred `max-w-[560px] py-20`, 56px red-soft circle with ShieldX, H1 "You do not have access to this page" (24px display), "It needs the permission “<label>”. Your role, **X**, does not include it.", "A platform admin can grant it in Roles and permissions.", [Go to home] (Request access) → toast "Access request sent to Dana Whitfield."

### 4.23 Welcome dialog and guided tour

- **Welcome** (first visit only, `welcomed=false`): scrim `bg-[#101429]/45 backdrop-blur-[2px]`, dialog `max-w-[560px] rounded-2xl`. Header block `bg-[--v-side] px-7 py-6 text-white`: "✦ Clickable prototype", H2 "Unified Product Delivery Platform" (24px display), paragraph "A business person describes a change, an AI agent delivers it stage by stage, and the right people approve each step. Everything here works, with sample data. Nothing is sent anywhere." Three ticks: **Decide.** Approve designs, answer the agent, review code and release. **Switch person.** Use View as at the bottom of the menu to see what each role can do. **Govern.** As the super admin, fix squads, change permissions and read the audit log. Footer: [▶ Take the 8-step tour] (focused) · Explore on my own · "About 5 minutes". Esc = explore.
- **TourBar** (when on): `sticky top-16 z-10 border-b border-blue-line bg-blue-soft px-8 py-2.5`. Compass icon; eight 24px step circles (done green ✓; next blue with ring; others surface + ring) that jump to the step; text "**Step n: <title>.** <hint>" + " We will switch you to the right person." when needed; [Go ›]; ✕ close. When all done: "Tour complete. You have seen every part of the platform. Use Reset demo data to start again." (green).
- Steps (each ticks itself from state): 1 Approve a design (Alex, `#v3-approve`) · 2 Answer the agent’s questions as Priya (`#v3-clarify`) · 3 Review the code as a backup (Alex, `#v3-review`) · 4 Start a new request (Alex, `#v3-new`) · 5 Approve the plan as Priya (the new run) · 6 Release as Sam (`#v3-release`) · 7 Fix a squad as the super admin (Dana, `#v3-squads`) · 8 Change a permission, then read the audit log (Dana, `#v3-roles`).

### 4.24 Prototype controls (demo only; remove in production)

`<details>` in the sidebar above the user block, summary "Prototype controls": Show/Hide the guided tour; Reset demo data (restores seed data, keeps `welcomed=true`, goes Home); jump links Home, Approvals, Runs, Design, Questions, Code, Release, Artifacts, Governance, Squads, Roles, Audit; ‹Earlier design rounds›.

### 4.25 Small parts

| Part | Spec |
|---|---|
| Stories card | `rounded-xl border bg-surface`; header "Stories" + "Each story is specified, designed and built one at a time." + ‹Open the plan›; rows: 24px number circle, title (medium, truncate), status (12.5px ink-3), StoryBar |
| StoryBar | three `h-1.5 flex-1 rounded-full` segments Specify/Design/Build: done green, current amber (unless Queued/Planned/Built), else line-strong; `w-24` (or `w-48` wide); `role="img"` label "Designing: 1 of 3 steps done" |
| Developer Agent card | §6.4 |
| Evidence timeline | 40px circle per step (green-soft, or amber-soft for a self-correction), 2px vertical connector, title + "Self-corrected" Pill, duration right, description |
| Diff viewer (code review) | collapsible file rows (FileCode2 icon, mono path, green "+42 −0"); open shows `<pre>` mono 12.5px leading-6, added lines on green-soft with "+" gutter |
| Matrix checkbox (roles) | `role="checkbox" aria-checked aria-label="<Role>: <permission>"`, `size-6 rounded-md border`; on = blue fill + Check; locked = Lock icon, `cursor-not-allowed opacity-70` |
| PersonSelect (squad) | bordered row with Avatar 22 (or dashed "?" circle) + borderless select; options "Not assigned", "<Name> · <n> open" or "<Name> (on leave)" |
| Narrow-screen gate | §10.6 |

---

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

---

## 6. Screen specifications

Each screen: purpose, layout, wireframe, content in order (exact copy), states, actions and their effects. Actions refer to store actions in §7.4.

### 6.1 Home (`#v3-home`)

**Purpose.** Answer "what needs me?" in one look. **Top-bar action:** [+ New request] (`h-9 px-4`, → `#v3-new`).

```
Tuesday 11 November                                   ┌In progress┐┌Released┐┌Average time to release┐
1 decision is waiting for you                         │    7      ││   1    ││       3.2 days        │
                                                      └───────────┘└────────┘└───────────────────────┘
┌ Waiting for you ─────────────────────── ‹See all› ┐  ┌ Solution Architect ──────────────┐ (admins only,
│ Oldest first. Each one names exactly what you…     │  │ 4 problems need an admin          │  red-soft or
├────────────────────────────────────────────────────┤  │ Approvers on leave, stuck agents… │  green-soft)
│ WI-4807 Advisor eligibility banner ●Reassigned to you │ [Open governance]                │
│ Review the completion report           ⏱ Waiting 3 h │ └──────────────────────────────────┘
│ Code and 6 unit tests are ready. Jon…    [Review →]│  ┌ Your requests ────────── ‹New› ┐
│ PN from Priya Nair            ▮▮▮▮▮▯▯▯ Stage 5 of 8 │  │ Rate hold expiry notice ●Agent… │
├────────────────────────────────────────────────────┤  │ ▮▮▮▯▯▯▯▯                         │
│ WI-4821 Registered Amortization limit              │  └─────────────────────────────────┘
│ Approve the solution design            ⏱ Waiting 12 min┌ Recent activity ────────────────┐
│ …                                        [Review →]│  │ AI Design finished · WI-4821     │
└────────────────────────────────────────────────────┘  │    The agent · 12 min ago        │
                     minmax(0,1fr)                       └─────────────── 340px ───────────┘
```

- Header: date line 14px ink-3 ("Tuesday 11 November"), animated H1 30px. H1 text: "n decision(s) is/are waiting for you" or "You are all caught up".
- KPI chips: **In progress** (runs not done; tooltip "Work items that are not yet released"; → Runs), **Released** (done runs; → Runs), **Average time to release** "3.2 days" ("From request to release, last 30 days"; → Governance).
- **Waiting for you** (SpotlightCard): sub "Oldest first. Each one names exactly what you are deciding."; right ‹See all› (only if any). Each row: mono run ID link + title 13px + optional red Pill "Reassigned to you"; the **ask** as a 16px semibold link to the gate screen; the **why** 13.5px (max 62ch); right column "⏱ Waiting <time>" amber + [Review →]; bottom line Avatar 22 "from <requester>" + compact labelled stepper `w-52`. Sorted by waiting time, oldest first.
- Empty state: PartyPopper green 32px, "Nothing is waiting for you", "The agent is carrying on with the work you approved. You will be notified when the next decision needs you.", (See all runs).
- Admin card (only with `squads.manage`): role label, "**n problems need an admin**" (red-soft) or "No problems need an admin" (green-soft), "Approvers on leave, stuck agents, freezes and incomplete squads.", [Open governance].
- **Your requests**: up to 4 runs requested by me; each row title + Pill (Released / Needs attention / Agent working / Waiting) + compact stepper. Empty: "You have not started any requests. ‹Start one›".
- **Recent activity**: the 5 newest feed items, Avatar 30 + title + "who · time"; selecting an item that contains a WI number opens that run.

### 6.2 New request (`#v3-new`)

**Purpose.** Describe a change in plain words and preview what will happen before starting.

```
Describe the change you need                                  ┌ What will happen ──── ●Live preview ┐
Write it the way you would explain it to a colleague…          │ A preview based on what you have…  │
┌──────────────────────────────────────────────────────────┐   │ ▤ 1 objective, about 2 stories     │
│ What should change, and why?                             │   │   Block values above 310 on…       │
│ ┌──────────────────────────────────────────────────────┐ │   │ ⧉ Likely affected                  │
│ │ In the Full Application advisor flow, the Product… │ │   │   Full Application · Product Sel…  │
│ └──────────────────────────────────────────────────────┘ │   │ 👥 People who will approve          │
│ Tip: include the business rule…          231 characters   │   │   PN Priya Nair · Plan and spec…    │
│ Application [Full Application ▾]  Needed by (optional) [📅]│   │   AK Alex Kim · Design …            │
│ ───────────────────────────────────────────────────────  │   │ ⏱ About 3 working days             │
│ [✦ Draft the plan]  Clear        Usually ready in under a minute │ Most of that is waiting…         │
└──────────────────────────────────────────────────────────┘   └──────────────── 400px, sticky ─────┘
```

- H1 "Describe the change you need"; lede "Write it the way you would explain it to a colleague. The platform drafts a plan, and nothing starts until you approve it."
- Textarea label "What should change, and why?", 6 rows, `rounded-xl bg-sunken p-4 text-[15px]`, becomes surface on focus. Pre-filled with: "In the Full Application advisor flow, the Product Selection page must prevent advisors from entering a Registered Amortization value that exceeds the documented maximum. Registered Amortization must be less than or equal to 310."
- Helper row: "Tip: include the business rule and where it applies." · "<n> characters" (tnum).
- Two fields: **Application** select (Full Application, Advisor Portal, Client Services); **Needed by** *(optional)* date, default 2026-11-20.
- Footer: [✦ Draft the plan] disabled until the text is longer than 40 characters; ghost "Clear" empties the text; "Usually ready in under a minute".
- Preview card (sticky `top-24`, Pill "Live preview"): 1 objective about 2 stories; Likely affected = "<app> · Product Selection page · shared validation"; People who will approve: Priya Nair · Plan and specification, Alex Kim · Design, Jon Reyes · Build and integration, Mara Lopez · Validation, Sam Okafor · Release; "About 3 working days" + "Most of that is waiting for approvals. Agent work takes about 2 hours."
- **Draft the plan** → `createRequest(WI-<nextId>, text, app)`, toast "WI-4841 started. The agent is drafting the plan.", navigate to the new run. Title is derived from the first sentence, dropping a leading "In/On/For/Within … ," clause, capitalised, cut at a word to 56 characters with "…".

### 6.3 Runs and Approvals (`#v3-runs`, `#v3-approvals`)

```
Runs                                                                                [+ New request]
Every request the platform is delivering, newest first.
(All 8) (Waiting for me 2) (Agent working 2) (Blocked 1) (Released 1)      [⌕ Search by name or ID] [All applications ▾]
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ Request ⇅               │ Progress ⇅          │ Now ⇅                         │ Held by ⇅ │ Age ⇅ │ Expected release │
│ Rate hold expiry notice │ ▮▮▮▯▯▯▯▯            │ ●Agent writing the impact…    │ AI Agent  │ 2 h   │ Mon 17 Nov       │
│ WI-4836 · Full Application · requested by you   Stage 3 of 8 · Impact                                              │
│ …                                                                                                                  │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1–8 of 8 runs                                                         ‹ Page 1 of 1 ›           │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

- H1 "Runs" / "Approvals". Lede: "Every request the platform is delivering, newest first." / "Decisions waiting for you, oldest first. Switch the filter to see everything else."
- Filter chips with counts: All · Waiting for me · Agent working · Blocked · Released (Approvals starts on "Waiting for me" and sorts by Age descending).
- Search (by name or ID, `w-40`) and Application select (All applications + 3 apps).
- Columns: **Request** (title link + mono "ID · app" + " · requested by you"), **Progress** (`w-44`, compact labelled stepper), **Now** (Pill; if it is my turn, an amber Pill "… →" linking to the gate screen), **Held by** (Avatar 24 + first name or "Agent"), **Age** (tnum), **Expected release** (red medium when "At risk"). Sortable: Request, Progress (count of done stages), Now, Held by, Age (hours). Page size 8.
- Empty: "No runs match these filters. ‹Clear filters›" (resets filter, app and search).

### 6.4 Run overview (`#v3-run-<id>`)

**Purpose.** Where a work item is, who holds it, what happens next, and every document. **Top-bar action** (if `runs.pause`): (Pause run) / (Resume run).

```
WI-4821 · Full Application ●Waiting for you                    ┌PN Requested by │ Expected release┐
Registered Amortization limit                                  │   Priya Nair   │ Thu 13 Nov      │
Stage 4 of 8 · Design                                          └─────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  ✓──────✓──────✓──────④──────⑤──────⑥──────⑦──────⑧   (full stepper, §4.7)                    │
│  See the sources, checks, confidence and cost behind the current stage.  (✦ How the agent did this) │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
┌ StatusCard (varies, see below) ───────────────────────────┐ ┌ Documents ───────────────────┐
│ ⚠ Approve the solution design                [Review →]   │ │ Created at each stage         │
│   Blocks values above 310 on Product Selection…           │ │ ▤ Delivery plan  Plan·Approved ✓│
│ What changes │ What does not │ If you approve             │ │ ▤ Specification …          ✓ │
└───────────────────────────────────────────────────────────┘ │ ▤ Architecture decision  ● │
┌ Stories ─────────────────────────────── ‹Open the plan› ┐   │ ▤ Developer assignment       │
│ ① Block values above 310…  Designing        ▮▮▯        │   └──────────────────────────────┘
│ ② Explain the limit…  Queued: starts after story 1 …    │   ┌ People ────────── ‹Manage› ┐
└─────────────────────────────────────────────────────────┘   │ PN Priya Nair        Plan ✓ │
┌ Build · Developer Agent in VS Code   [⧉ Copy Developer prompt] (from stage 5) │ AK Alex Kim (you) Design · now │ amber row
┌ Activity ─────────────────────────────── ‹Audit log› ┐      │ …                            │
┌ Discussion ──────────────────────────────────────────┐      └──────────────────────────────┘
┌ How the design was made  13 min 48 s · 6 of 6…   (Open) ┐   (🚀 All runs)
                      minmax(0,1fr)                                  360px
```

**Header**: mono "ID · app" + Pill (Waiting for you / Agent working / Waiting for a person / Needs attention / Complete); H1 title; "Stage n of 8 · <stage>"; right box Avatar 34 "Requested by <name>" | "Expected release <eta>".

**Stepper card**: full stepper, then a divider row "See the sources, checks, confidence and cost behind the current stage." + Agent panel button for the first stage that is not done.

**Left column, in order**:
1. Paused banner (amber, if paused): "**Paused by you.** The agent and approvers cannot move this run until you resume it." [Resume run].
2. **StatusCard** — one of:

| Condition | Shows |
|---|---|
| It is my decision (`state = you`) | Amber strip: AlertTriangle, ask (17px), why. Right side: [Review →] to the gate screen if the run has one; for Integrate (5)/Validate (6)/Release (7) gates without a screen: [Approve integration]/[Approve validation]/[Schedule for the next window] + (Send back) (not on Release), or "Your role cannot approve integrations/approve validation/release"; for a plan (stage 0): [Approve plan] (Send back), or "You requested this, so another Product Owner must approve the plan." when separation of duties applies, or "Your role cannot approve plans". |
| … and stage 5 | Table "Pipeline (Azure DevOps) · Result · Duration": Build and unit tests on the merge commit ✓Passed 6 min; Deploy to staging ✓Passed 4 min; Contract tests with dependent services ✓Passed 3 min |
| … and stage 6 | Three columns: Acceptance criteria "All met, each linked to its test"; Regression tests "214 of 214 pass"; User acceptance "Signed off by the Product Owner" |
| … and stage 0 | Three columns: Objective (title), Stories (numbered links to each story + ‹Open the full plan›), Agent assumptions ("Only <app> is affected", "No API change in this request") |
| … and WI-4821 | Three columns: What changes "Product Selection blocks values above 310 and explains why." · What does not "The Pricing API and batch import still accept any value." · If you approve "The agent builds it with unit tests, about 20 minutes, then Jon reviews." |
| Failed (`bad` with an `f` stage) | Red card `role="alert"`: "Validation failed: 2 of 214 tests", "The agent tried 3 times and stopped. The tests still expect the old 20-minute timeout; the spec now says 15."; mono list "session.spec.js › warns at 18 min — expected 18, got 13", "logout.spec.js › auto logout — expected 20, got 15"; footer "Agent attempts: 3 of 3 · last run 40 min ago · CI #5521" + [Update the tests and re-run] (if `runs.pause` or requester) + (Assign an engineer) (if `squads.manage`) or "Jon Reyes and the platform admin have been notified." |
| Release scheduled | Blue clock: "Release scheduled: <when>", "Not live yet. The deployment starts in the window, then health checks run and the record is completed. Until then the release can be cancelled." + (Cancel schedule) if `gate.release` |
| Agent working at Build (stage 5, `a`) | Spinner: "Ready for the Developer Agent in VS Code" or "The Developer Agent is building in VS Code" + now + ". A developer copies the prompt below into the Agent in VS Code." / ". The completion report comes back here automatically." |
| Agent working (other) | Spinner blue: "The agent is working", "<now>. You will be notified when a person is needed." |
| Waiting for someone else | Amber clock: "Waiting for <holder>", "<now>." + (Send a reminder) → toast "Reminder sent to <name>." |
| Needs attention (other) | Red: "Needs attention", "<now>. The run is paused until someone decides what to do." |
| Done | Green: "Released", "Every stage is complete and the evidence is saved." |
| After any decision | Green line "Your decision was recorded just now." |

3. **In production** (done runs): "Health checks normal since release · error rate 0.02% · no linked incidents. The tested rollback plan is attached to the release record." + (↺ Roll back) for `gate.release` → toast "Rollback of <id> prepared. It needs a second Release Manager to confirm before it runs." or "Release Managers can roll back this change."
4. **Answers to the agent’s questions** (if answered): question in ink-3, answer medium.
5. **Sent back:** <note> (amber, while the agent reworks). **Release held:** <reason> (amber).
6. **Stories** card (from the plan onward).
7. **Build · Developer Agent in VS Code** card (from stage 5): Laptop tile; "The agent runs standalone on the developer’s machine. The platform prepares its assignment and tracks the result."; [⧉ Copy Developer prompt] until working; five tracked steps with a vertical line: (1) ‹Developer assignment ready› "Handoff and prompt prepared from the approved design" ✓ → opens the assignment; (2) Developer Agent started in VS Code: "Copy the prompt and paste it into the Agent in VS Code" → after copying "Waiting for the agent to connect…" (spinner) → "Connected · last heartbeat just now" (✓) or "Started by Lena Brooks" when built; (3) Branch and Azure Boards task #<88000+n> with the branch name `feature/wi-4821-registered-amortization-li…`; (4) Pull request #<200+n> in Azure Repos: "Opens when the agent finishes" / "Opened · checks green"; (5) ‹Completion report received› "Comes back to the platform automatically" / "4 files changed · 6 of 6 tests pass". Copy → toast "Developer prompt copied. Paste it into the Agent in VS Code." and after 2.5 s the step shows connected.
8. **Activity** and **Discussion** (§4.21).
9. WI-4821 only: card "How the design was made", sub "13 min 48 s · 6 of 6 quality checks passed · 4 sources", (Open) → `#v3-evidence`.

**Right column (360px)**:
- **Documents** "Created at each stage": one row per stage reached that is done or waiting (Delivery plan, Specification, Impact assessment, Architecture decision, Completion report, Integration evidence, Validation report, Release record) with "<stage> · Approved" ✓ or "<stage> · Waiting for approval" ● (`#e0a000`). After Design is approved add "Developer assignment" ("Build · prompt for the Agent in VS Code"). Empty: "The first document appears when the plan is drafted." Rows open the document viewer.
- **People** "Who approves each stage of this run" (+ ‹Manage› → squad, for `squads.manage`): one row per stage with an approver: Avatar 24, name (+ " (you)"), stage label; done → green "Plan ✓"; current → amber row "Design · now".
- Ghost link (🚀 All runs).

**Timers on this page**: a fresh run in stage `a` becomes a plan waiting for approval after **4 s** (`finishPlan`); a retrying run finishes validation after **3.5 s** (`finishRetry`).

### 6.5 Approve a design (`#v3-approve`, WI-4821)

```
┌────────────────────────────────────────────────────────────────────────┐  ┌──────────────────────────────┐
│ 📖 Architecture decision · written by the delivery agent · quality check passed │ ●Your decision  waiting 12 min │
│    ADR-0173      (✦ How it was made)  [Plain summary | Full technical]  │  │ Approve the design?           │
├────────────────────────────────────────────────────────────────────────┤  │ If you approve, the agent…    │
│   Enforce the Registered Amortization maximum on Product Selection     │  │ ┌──────────────────────────┐ │
│   IN ONE PARAGRAPH                                                     │  │ │✓ Scope matches the approved │
│   Advisors will no longer be able to enter more than 310…¹             │  │ │✓ Reuses an existing approved │
│   ┌⚠ The gap you are accepting──────────────────────────────┐         │  │ │✓ Unit tests are planned…    │
│   │ The Pricing API is not changed. A system calling…        │         │  │ │☐ I accept that the Pricing  │
│   └──────────────────────────────────────────────────────────┘         │  │ │  API is not covered…        │
│   WHAT GETS CHANGED                                                    │  │ └──────────────────────────┘ │
│   • Product Selection form: blocks values above 310²                   │  │ Note for the team (optional)  │
│   SOURCES  1 🔗 ADR-0151 · Reuse shared validators …                    │  │ [e.g. Please raise a follow-up…]
└────────────────────────────────────────────────────────────────────────┘  │ [   Approve design   ] (disabled)
                                                                            │ Tick the risk above to approve │
                                                                            │ (  Request changes   )         │
                                                                            └──────────── 380px, sticky ─────┘
                                                                            ┌ Discussion ──────────────────┐
```

- Grid `1fr / 380px`. Document card header: BookOpen; "Architecture decision · written by the delivery agent · quality check passed"; **ADR-0173**; Agent panel button (stage 3, label "How it was made"); segmented tabs "Plain summary" / "Full technical" (`rounded-lg bg-sunken p-1`, active tab surface + shadow-sm).
- Article `max-w-[680px] px-7 py-8 text-[15.5px] leading-[1.75]`, H1 26px "Enforce the Registered Amortization maximum on Product Selection".
- **Plain summary**: IN ONE PARAGRAPH "Advisors will no longer be able to enter more than 310 in Registered Amortization on the Product Selection page. They will see a short message explaining the limit. The check reuses the validator the form already uses, so no new service is added.¹" → amber box "**The gap you are accepting** The Pricing API is not changed. A system calling the API directly could still save a value above 310. Priya has suggested a follow-up request to close it." → WHAT GETS CHANGED: "Product Selection form: blocks values above 310²", "Shared amortization validator: gains the maximum³", "One new message for advisors, and 3 new unit tests".
- **Full technical**: CONTEXT "Product rules v4 set the maximum Registered Amortization to 310⁴. Acceptance criterion AC-3 requires the form to block higher values and show the reason²." DECISION "Add `MAX_REGISTERED_AMORTIZATION = 310` to `amortizationValidator.js` and call it from `ProductSelection.jsx`, following ADR-0151 (reuse shared validators)¹." CONSEQUENCES "Client-side enforcement only. Server-side validation in the Pricing API is out of scope for this story."
- Citation chips: `rounded bg-blue-soft px-1 font-mono text-[10.5px] text-blue`, `aria-label="Source n"`, scroll smoothly to SOURCES. Sources: 1 ADR-0151 · Reuse shared validators; 2 Specification v3 · AC-3; 3 full-application-ui · src/validation/amortizationValidator.js; 4 Knowledge Fabric · Product rules v4.
- **Decision panel** (when I hold it and may decide): Pill "Your decision" + "waiting 12 min"; H2 "Approve the design?"; "If you approve, the agent starts building. Jon Reyes reviews the code next."; inset box with three platform-checked ticks (sr-only "(checked by the platform)") and the **risk checkbox** "I accept that the Pricing API is not covered by this change"; "Note for the team (optional)" textarea, placeholder "e.g. Please raise a follow-up for the API.", help "Optional to approve. Required to request changes; it is added to the discussion."; [Approve design] (`h-11`) disabled until the risk is ticked, with hint "Tick the risk above to approve"; (Request changes) disabled until the note has ≥ 5 characters (`title="Add a note saying what should change"`).
- Approve → note (if any) posted as a comment, `approveDesign`, toast "Design approved. The agent has started building." + Undo, go to the run. Request changes → comment "Changes requested: <note>", `requestDesignChanges`, toast "Sent back to the agent with your note." + Undo, go to the run.
- Already decided: green card "✓ Decision recorded", "You have decided on this design. Current status: <now>.", [Open the run] (Back to home).
- Not mine: NotYours card. Discussion card always below.

### 6.6 Answer questions (`#v3-clarify`, WI-4799)

```
WI-4799 · Client Services ●Needs your answer
2 questions before the specification can be written
The agent found places where the request could mean two things…   (✦ How the agent did this)
┌──────────────────────────────────────────────────────────────────┐
│ ① Which order should the columns appear in the export?            │
│   ⓘ Why this matters: The current statement and the new spec…    │
│   ○ Same as the on-screen statement (Date, Description, Amount…) │
│   ◉ Bank reconciliation order (Date, Amount, Balance…) ●Agent suggests │ selected = blue border + blue-soft
│   ○ Something else                                               │
└──────────────────────────────────────────────────────────────────┘
┌ ② Should the export include accounts closed in the last 90 days? ┐
└──────────────────────────────────────────────────────────────────┘
┌ sticky bottom bar: 1 of 2 answered                 [Send answers] ┐
```

- Width 820. Header: mono "WI-4799 · Client Services" + Pill "Needs your answer"; H1 "2 questions before the specification can be written"; lede "The agent found places where the request could mean two things. Pick an option or write your own. The run continues as soon as you send."; Agent panel (stage 1).
- Each question is a `<fieldset>` in a Card `p-6`: legend = 28px blue-soft number + 17px question; "Why this matters:" line with HelpCircle; options as radio cards (`rounded-xl border px-4 py-3 text-[14.5px]`, selected `border-blue bg-blue-soft`), the suggested option has a green chip "Agent suggests"; last option "Something else" reveals a textarea "Type your answer".
- Q1 "Which order should the columns appear in the export?" — why: "The current statement and the new spec list them differently, and the downstream bank reconciliation reads columns by position." Options: "Same as the on-screen statement (Date, Description, Amount, Balance)"; "Bank reconciliation order (Date, Amount, Balance, Description)" (suggested, pre-selected).
- Q2 "Should the export include accounts closed in the last 90 days?" — why: "Closed accounts are hidden on screen but some clients request their final statements." Options: "Yes, include them and mark them as closed" (suggested); "No, open accounts only".
- Sticky bottom bar `sticky bottom-4 rounded-2xl border bg-white/95 shadow-lg backdrop-blur`: "**n of 2** answered" + [Send answers] (disabled until all answered) → `answerQuestions`, toast "Answers sent. The agent is writing the specification." + Undo, go to the run.
- After sending: green banner "Your answers were sent. The agent is writing the specification. ‹Open the run›". Not mine: NotYours.

### 6.7 How the design was made (`#v3-evidence`)

- H1 "How the design was made"; lede "Every step the agent took for the Design stage, what it used, and what it checked. Use this when you want to verify the work before approving."
- Four KPI tiles: Time taken **13.8 min** · Sources used **4** · Quality checks passed **6 of 6** · Cost **$0.21**.
- Grid `1fr / 360px`. **Steps** "In the order they happened" (timeline §4.25): Found the relevant rules (3m 12s) "Searched product rules and earlier decisions. Kept 4 of 12 results." · Checked the facts (1m 24s) "Confirmed the maximum (310), the affected page and the validator against the specification." · Wrote the decision record (4m 30s) "Drafted ADR-0173 from the approved specification and the sources." · **Found and fixed a mistake** (3m 06s, amber, Pill "Self-corrected") "Its own quality check found the draft did not reference AC-3. It added the reference and checked again." · Saved the evidence (54s) "Stored the record and sources with a tamper-evident fingerprint." · Asked for approval (42s) "Sent the design to Alex Kim."
- **Sources** (links to Artifacts): Product rules v4 — Knowledge Fabric; Specification v3 — Approved by Priya Nair; ADR-0151 — Earlier decision; amortizationValidator.js — full-application-ui.
- **Record** "For audit": Saved Wed 11 Nov, 09:42 UTC · Fingerprint `9f2c 41ab 77e0` · Model GPT-5.4 · Kept for 7 years.

### 6.8 Code review, Build gate (`#v3-review`, WI-4807)

```
WI-4807 · Advisor Portal ●Build · reassigned to you                         ▮▮▮▮▮▯▯▯
Review the code for the eligibility banner                                  Stage 5 of 8 · Build
The agent built the approved design and tested it. You are the named…       (✦ How the agent did this)
┌ What was built ─────────────────────────────────────────┐  ┌ Automatic checks ── ●All passed ┐
│ Advisors who are under 18 or whose licence is not…      │  │ ✓ Unit tests  6 of 6 passed     │
└─────────────────────────────────────────────────────────┘  │ ✓ Baseline build  Green before… │
┌ Changed files  4 files · +103 lines   ‹⑂ Pull request #214› │ ✓ Scope  Only files named…     │
│ ▸ src/advisor/EligibilityBanner.jsx            +42 −0  │  │ ✓ Lint and formatting  No issues│
│   + export function EligibilityBanner() { …            │  │ ✓ Accessibility  Banner announced│
│ ▸ src/advisor/Dashboard.jsx                     +2 −0  │  └─────────────────────────────────┘
│ ▸ src/i18n/en.json                              +1 −0  │  ┌ Approve the build? ─────────────┐
│ ▸ src/advisor/EligibilityBanner.test.jsx       +58 −0  │  │ Next: Tom Iverson runs integration│
└─────────────────────────────────────────────────────────┘  │ Comment (optional) [          ] │
                                                              │ [Approve build] (Request changes)│
```

- Header: Pill "Build · reassigned to you"; H1 "Review the code for the eligibility banner"; lede "The agent built the approved design and tested it. You are the named backup for Jon Reyes, who is on leave, so you can approve this build even though your role is Solution Architect. If you approve, the change moves to integration."; right `w-56`: compact stepper `ddddw`, "Stage 5 of 8 · Build", Agent panel (stage 4).
- **What was built**: "Advisors who are under 18 or whose licence is not active now see a warning banner on their dashboard. They can still view clients but cannot submit applications. Four files changed: one new component, one line on the dashboard, one message, and a test file."
- **Changed files** (first file open by default; one open at a time, `aria-expanded`). Diffs: EligibilityBanner.jsx (context import line, then 5 added lines of the component); Dashboard.jsx (`<Header />`, + `<EligibilityBanner />`, `<ClientList />`); en.json (+ `"eligibility.blocked": "You can view clients but cannot submit applications until your licence is active."`); the test file shows text "6 tests covering under 18, inactive licence, both conditions and the eligible case."
- **Automatic checks** (Pill "All passed"): Unit tests "6 of 6 passed"; Baseline build "Green before and after"; Scope "Only files named in the design were changed"; Lint and formatting "No issues"; Accessibility "Banner announced to screen readers".
- Decision: "Approve the build?", "Next: Tom Iverson runs integration on the merge commit.", Comment (optional), [Approve build] → toast "Build approved. Integration has started." + Undo; (Request changes) → "Sent back to the agent with your comment." + Undo; both go to the run. Decided and NotYours states as in §6.5.

### 6.9 Release gate (`#v3-release`, WI-4772)

```
WI-4772 · Full Application ●Release · waiting for you  ●Production            ▮▮▮▮▮▮▮▮
Release the fee schedule update                                                Stage 8 of 8 · Release
Everything before release is done. Check the list, choose when it goes live…   (✦ How the agent did this)
┌ Ready to release  4 of 4 confirmed ──────────── ●Ready ┐  ┌ 📅 When should it go live? ────────┐
│ ✓ Validation passed   All 8 acceptance… ML Mara Lopez · Tue 10:12 │ ◉ Thu 13 Nov, 18:00          │
│ ✓ Business sign-off (UAT) …            PN Priya Nair · Tue 15:40 │   Standard evening window…   │
│ ✓ Integration pipeline …               TI Tom Iverson · Mon 17:05│ ○ Fri 14 Nov, 18:00          │
│ ✓ Rollback plan …                      AI Prepared by the agent  │ ○ Now  Outside a release…    │
└────────────────────────────────────────────────────────┘  │ Change ticket [CHG0041872]        │
┌ Release notes  Written by the agent… Edit before sending ┐ │ ServiceNow change request…       │
│ [Fee schedule v7 is now live in the Full Application…]  │  │ ↺ After release, Release Managers…│
└────────────────────────────────────────────────────────┘  │ [Schedule release] (Hold release) │
```

- Pills: "Release · waiting for you" (you) / "Release · waiting for Sam Okafor" / run status when decided; plus mute "Production". H1 "Release the fee schedule update". Lede "Everything before release is done. Check the list, choose when it goes live, and release to **production** (version 2026.11.3, merge commit 7c2e1fa)."
- **Ready to release** (4 of 4 confirmed, Pill "Ready"): Validation passed — "All 8 acceptance criteria met · 214 regression tests green" — Mara Lopez · Tue 10:12; Business sign-off (UAT) — "Priya tested the new fee table in staging with 3 sample clients" — Priya Nair · Tue 15:40; Integration pipeline — "Merge commit 7c2e1fa built and deployed to staging" — Tom Iverson · Mon 17:05; Rollback plan — "Previous fee table v6 stays available; switch back takes about 2 minutes" — Prepared by the agent.
- **Release notes** (editable only for the deciding person, otherwise `readOnly`): "Fee schedule v7 is now live in the Full Application.\n\n• Advisors see the new fee table on Product Selection.\n• Applications started before release keep the v6 fees.\n• No action is needed from advisors."
- **When should it go live?** radio cards: Thu 13 Nov, 18:00 — "Standard evening window · no conflicts" (default); Fri 14 Nov, 18:00 — "Standard evening window · 1 other release"; Now — "Outside a release window · needs a reason". Choosing **Now** shows "Reason for releasing outside a window" (input, placeholder "e.g. regulatory deadline", help "Required. At least 10 characters, recorded in the audit log.", red + `aria-invalid` while too short).
- **Change ticket** (mono, default CHG0041872), help "ServiceNow change request, approved by the change board on Mon 10 Nov."
- Note box: "After release, Release Managers can roll back from the run page; a second Release Manager confirms."
- [Schedule release] / [Release now] (disabled if the reason is missing or the ticket is empty) and (Hold release).
- Schedule → `scheduleRelease(window)`, toast "Release scheduled for Thu 13 Nov, 18:00. You can cancel it until then." + Undo. Release now → confirm dialog "Release to production now?" ("This goes live immediately, outside a release window. It cannot be undone from here; use the rollback plan if something goes wrong."; facts Environment Production · Version 2026.11.3 · commit 7c2e1fa · Change ticket · Reason · Rollback "Switch back to fee table v6, about 2 minutes"; (Cancel) focused, red [Release to production]) → toast "Released to production. The team has been notified." (no Undo).
- Hold → FormDialog "Hold this release" / "Priya Nair and Mara Lopez are told why, and the run waits until you release it." / field "Why are you holding it?" (≥ 10 chars, placeholder "e.g. Pricing team asked to wait for the rate change") / [Hold release] → toast "Release held. Priya and Mara have been told why." + Undo.

### 6.10 Business rules (`#v3-rules`)

- Grid `300px / 1fr`. Left list card: search "Search 48 rules"; rule rows (mono ID, title, coverage bar + "2/6"): RA-MAX Registered Amortization must be 310 or less (2/6, amber); RA-MIN Amortization must be at least 5 years (6/6 green); RATE-H Rate holds last at most 120 days (3/5); KYC-02 Two forms of ID before approval (4/4); ADDR-1 Address changes are audited (1/4 red); FEE-07 Fees follow fee table v7 (2/3). Selected row `bg-blue-soft shadow-[inset_3px_0_0_var(--v-blue)]`, `aria-current`.
- Right: mono "RA-MAX · owned by Priya Nair"; H1 rule; lede "Checked in the Advisor Portal today. Run WI-4821 adds it to the Full Application form. **The Pricing API and batch import still accept larger values.**" (red); KPI card "Checked in **2 of 6 places**", "2 more in progress".
- **Where the rule is checked** + [Request a fix for the gaps →] (→ New request). Table: status icon (green ✓ Checked, red ✗ Not checked, amber − In progress) · Place · System · Status: Product Selection form / Full Application / WI-4821 · in design; Shared amortization validator / Validation library / WI-4821 · in design; Pricing API / Server / **Not covered by any run**; Batch application import / Server / **Not covered by any run**; Advisor Portal quote tool / Advisor Portal / WI-4511 · since Mar 2026; Product rules (source of truth) / Knowledge Fabric / Documented in v4.
- **History**: 11 Nov WI-4821 started: add the check to the Full Application form (amber dot) · Mar 2026 WI-4511 released: Advisor Portal quote tool checks the rule · Jan 2026 Maximum raised from 300 to 310 (product rules v4) · Aug 2025 Rule created.

### 6.11 Artifacts (`#v3-artifacts`)

```
Artifacts                                          ┌🛡 Evidence store ──────────────┐ (⇩ Export 40)
Every document and piece of evidence the platform… │ Immutable · fingerprinted · 7 yrs│
(All)(Approved)(Waiting)(Draft)                     [⌕ Search name or work item] [All types ▾]
┌──────────────────────────────────────────────────────────┐ ┌ ▤ Architecture decision record ✕┐
│ Artifact ⇅          │ Work item ⇅ │ Stage ⇅│ Status ⇅│ Version│ │ WI-4821 · Registered…        │
│ ▤ Delivery plan     │ WI-4836     │ Plan   │●Approved│ v1     │ │ ┌ preview text ┐             │
│   Plan              │ Rate hold…  │        │         │        │ │ Status ●Approved  Approver AK │
│ …                                                          │ │ Version v2  Fingerprint …    │
├──────────────────────────────────────────────────────────┤ │ [Open document](Download)(Copy link)
│ 1–12 of 40 artifacts                       ‹ Page 1 of 4 › │ ┌ Versions ┐ ┌ Who has opened this ┐
└──────────────────────────────────────────────────────────┘ ┌ Storage: … ┐       420px when a row is selected
```

- H1 "Artifacts"; lede (all access) "Every document and piece of evidence the platform has stored, for every work item." or (own scope) "Documents from the work you requested, hold, or approve. A platform admin or auditor can see everything."
- Badge box "Evidence store · Immutable · fingerprinted · kept 7 years". (⇩ Export n) for `artifacts.export` → CSV `artifacts-index.csv` with columns artifact, work_item, stage, status, version, blob_path; audit "Exported n artifacts".
- Filters: status chips All / Approved / Waiting / Draft; search; type select (All types + Plan, Specification, Impact, Design, Code and tests, Pipeline, Test report, Release, Handoff, Story).
- Rows are **derived from runs** (§9.5): one artifact per stage that is done, waiting or failed (not for agent-working stages), plus after Design the "Developer assignment" and "Tester handoff" (type Handoff), plus one "Story n: …" per story after the plan is approved. Version `v1`, `v2` for the WI-4821 ADR, `v1 draft` while waiting.
- Scope: `artifacts.all` sees everything; otherwise only artifacts where I am the requester, the holder or the stage approver. Pager noun "artifacts" / "artifacts you can see". Page size 12.
- Clicking the row selects it (detail panel, audit "Viewed document"); clicking the name opens the document viewer.
- Detail panel (sticky): title + run link + ✕; preview text per type; Status, Approver (or "Automatic checks"), Version, Fingerprint (two 8-hex hashes); [Open document], (Download) (needs `artifacts.export`, otherwise "🔒 Your role cannot download"), (Copy link) → "Link copied. Only people with access can open it."; **Versions** (v2 Approved Today 14:33 · v1 Superseded: missing AC-3 reference Today 14:31, else one row); **Who has opened this** (up to 5 access entries, ‹Full audit log› for `audit.view`); storage note "the document is in Azure Blob Storage (immutable container, <app> folder); its versions, approvals and access are recorded in Azure SQL. Encrypted at rest, kept for 7 years after release."

### 6.12 Governance (`#v3-admin`, super admin)

- Top-bar action (⇩ Export audit pack) → JSON file `audit-pack-2026-w46.json` `{ period, generated, runs[], audit[] }`.
- Header: "All workspaces · this week", H1 "Governance", date chip "Mon 10 – Sun 16 Nov".
- KPI tiles (4): In progress (runs not done) · Waiting on a person (amber dot) · Over approval target (red dot, red value: approver-on-leave item + blocked runs) · Agent spend this week **$48.20**.
- **Needs your attention** (Pill "n open" red / "All clear" green). Rows: icon in red-soft or amber-soft circle, title + mono ID, text, outline action:

| Key | Icon / tone | Title | Text | Action | Result toast |
|---|---|---|---|---|---|
| leave | UserX red | Approver is on leave · WI-4807 | Jon Reyes holds the completion review and is away until Friday. It has waited 3 h against a 2 h target. | Reassign to Lena Brooks | WI-4807 reassigned to Lena Brooks. Jon has been notified. |
| agent | FlaskConical red | Agent stopped after 3 attempts · WI-4790 | Two regression tests still fail. The agent needs an engineer to decide whether the tests or the code are wrong. | Assign an engineer | Engineer assignment opened for WI-4790. |
| freeze | ShieldAlert amber | Release falls in the month-end freeze · WI-4830 | Planned release on 2 Dec is inside the 1–3 Dec freeze. Approve an exception or move the date. | Review exception | Freeze exception approved for WI-4830. The release stays on Tue 2 Dec and the exception is in the audit log. |
| squad | AlertTriangle amber | Squad is incomplete · WI-4836 | No Integration Lead is assigned. The run will stop at Integrate without one. | Complete squad → | (navigates to `#v3-squad-wi-4836`) |

  Empty: "Nothing needs you right now. New problems appear here as soon as the platform finds them."
- **All work items** table: Work item (title + "ID · app") · Progress (labelled compact) · Held by · Waiting · Squad ("6/6", or amber "5/6") · Health (Blocked bad / Squad gap wait / Freeze risk wait / Done / On track) · ‹Manage squad›.
- Right 340px: **Where work waits** "Average hours per approval role" — bars `h-2` (red if > 6 h, else `#e0a000`, width = hours × 10%): Product Owner 9.5, Engineering Lead 6.8, Solution Architect 4.2, Release Manager 3.0, Quality Lead 2.4, Integration Lead 1.1. **People load** "Open approvals per person": Alex 3, Priya 4 (amber bar ≥ 4), Jon 2 "On leave until Fri" (red text, no bar), Lena 1, Ravi 1, Mara 2; bar width n × 20%. Footer card "⏱ Escalations go to **Dana Whitfield** after 8 h".

### 6.13 Squads (`#v3-squads`)

- H1 "Squads"; lede "Every work item has a squad: one approver and one backup per stage. A run stops at any stage that has nobody assigned."; Pills "n squad(s) need attention" (bad) or "All squads complete" (done) + "n active".
- Table (min width 980) "Squads for active work items" / "Initials show the approver for each stage. Dashed means nobody is assigned.": Work item · Product Owner · Solution Architect · Engineering Lead · Integration Lead · Quality Lead · Release Manager (two-line headers) · Progress · action. Cells: Avatar 28; missing = dashed red circle "?" (sr-only "<role> not assigned"); on leave = red 12px dot on the avatar. Action [Fix squad] (primary, when a gap or leave) or (Edit).
- Three pool cards (Full Application, Advisor Portal, Client Services) "People who can be added to its squads" + ‹Manage› → People; avatar chips; Full Application footer "⚠ Only 1 Release Manager" (amber).

### 6.14 Squad for a work item (`#v3-squad-<id>`)

- Header: mono "ID · app" + Pill (run status); H1 "Squad for <title>"; lede "Choose who approves each stage and who steps in if they are away. Changes apply to stages that have not been approved yet."; right "**5 of 6** roles filled" + [Save squad] (disabled while any red issue).
- Table: Role (name + "Approves <stages>" + inline issue in red/amber) · Approver (PersonSelect, `w-[230px]`) · Backup (PersonSelect, options + Dana) · Gate Pill (Approved / Waiting now (you tone) / Next / Upcoming). Approved gates are read-only text.

| Role | Approves | Eligible people |
|---|---|---|
| Product Owner | Plan, Specify | Priya, Mara |
| Solution Architect | Design | Alex, Ravi |
| Engineering Lead | Build | Jon, Lena |
| Integration Lead | Integrate | Tom, Lena |
| Quality Lead | Validate | Mara, Ana |
| Release Manager | Release and UAT | Sam, Dana |

  Open-approval counts in the options: Priya 4, Alex 3, Ravi 1, Jon 2 (on leave until Fri 14 Nov), Lena 1, Tom 0, Mara 2, Ana 1, Sam 2, Dana 0.
- Live validation: no approver → red "<Role> has no approver. The run will stop at this gate."; approver on leave → amber "<Name> is away (until Fri 14 Nov). Assign a backup who can cover."; no backup → amber "<Role> has no backup approver."; same person twice → red "<Role>: approver and backup are the same person."; requester (Priya) as Design or Release approver → red "The requester cannot approve Design or Release."
- **Policy checks** card (green/red ticks, live): Every gate has an approver · Every gate has a backup · Requester does not approve Design or Release · Approvers have Full Application access. Footer when blocked: "Fix the red items to save."
- **Suggested** "Based on availability and workload": Integration Lead → Tom Iverson "No open approvals · worked on Full Application 6 times" (Assign); Engineering Lead backup → Lena Brooks "1 open approval · covers for Jon while he is away" (Assign).
- **Agent permissions** "What the agent may do without a person": switches "Move past Impact automatically when checks pass" (on), "Retry failed tests up to 3 times" (on).
- Save → resolves the squad or leave problem if this run had one, toast "Squad saved. New approvers have been notified." (+ Undo when it resolved something), go to Squads.

### 6.15 People and access (`#v3-people`)

- Top-bar action [👤+ Invite person]. H1 "People and access"; lede "Who can approve which stages, in which applications. People and groups are synced from your identity provider every hour."; Pill "SSO and SCIM: Microsoft Entra ID · synced 14 min ago".
- Search "Search by name or role" (`w-72`).
- Table: Person (Avatar 30, name, "Active today/now/…") · Can approve as (role chips; amber warning when the person holds a blocked pair: "Product Owner and Quality Lead on one work item is blocked by policy") · Applications (three 24px tiles FA / AP / CS, blue-soft = access, sunken + line-through = none) · Open · Availability (green "Available" or red "On leave until Fri 14 Nov").

| Person | Roles | FA AP CS | Open | Availability |
|---|---|---|---|---|
| Priya Nair | Product Owner | ✓ ✗ ✓ | 4 | Available |
| Alex Kim | Solution Architect | ✓ ✓ ✗ | 3 | Available |
| Ravi Shah | Solution Architect | ✓ ✓ ✓ | 1 | Available |
| Jon Reyes | Engineering Lead | ✓ ✓ ✗ | 2 | On leave until Fri 14 Nov |
| Lena Brooks | Engineering Lead, Integration Lead | ✓ ✓ ✓ | 1 | Available |
| Tom Iverson | Integration Lead | ✓ ✗ ✓ | 0 | Available |
| Mara Lopez | Quality Lead, Product Owner (conflict warning) | ✓ ✓ ✓ | 2 | Available |
| Ana Costa | Quality Lead | ✗ ✓ ✓ | 1 | Available |
| Sam Okafor | Release Manager | ✓ ✓ ✓ | 2 | Available |

  Blocked role pairs: Product Owner + Quality Lead; Engineering Lead + Quality Lead; Solution Architect + Release Manager. Pending invitations list under the table (letter avatar, email, "role · apps", Pill "Invitation sent"). Legend "FA Full Application · AP Advisor Portal · CS Client Services".
- Right 360px: **Cover while away** (Jon → Lena "Lena covers for Jon", "Engineering Lead · until Fri 14 Nov" + any new covers "Until <date> · new decisions go to <name>") + ‹Set up cover›; **Role coverage** "People who can approve, per application. Aim for at least 2." table (red bold when < 2): Product Owner 2/1/2, Solution Architect 2/2/1, Engineering Lead 2/2/1, Integration Lead 2/1/2, Quality Lead 1/2/2, Release Manager 1/1/1; footer red "Gaps: Release Manager has 1 person in every application; Quality Lead has 1 in Full Application."
- **Invite a person** dialog ("They get an email to sign in with your identity provider."): Work email (valid email; help "Must match a user in your identity provider.") · Role (Requester, Product Owner, Solution Architect, Engineering Lead, Integration Lead, Quality Lead, Release Manager, Auditor) · Applications checkboxes (≥ 1) → [Send invitation], toast "Invitation sent to <email>." + Undo, audit "Invited <email> as <role>" (detail "Applications: …").
- **Set up cover** dialog ("While someone is away, their new decisions go to the person covering."): Who is away · Covered by (help "They must hold the same role in the same applications."; "Choose someone else." if same) · Until (date, min 2026-11-12) → [Save cover], toast "<By> now covers for <Who> until <Fri 21 Nov>." + Undo, audit entry, notification to the cover person "You are covering for <Who>".

### 6.16 Roles and permissions (`#v3-roles`)

- H1 "Roles and permissions"; lede "Each person gets their abilities from their role. Changes apply straight away, are recorded in the audit log, and can be undone. Platform Admin always keeps every permission, so you cannot lock yourself out."
- Matrix table (min width 980, horizontal scroll, sticky first column `w-64`): columns = 9 roles (clickable header selects the "focus" role, highlighted blue-soft); grouped rows = permissions (§8.2) with group headings (12px uppercase). Cells = matrix checkbox (§4.25). Platform Admin column is locked.
- Clicking toggles at once (toast "Granted “Approve designs” to Solution Architect." / "Removed … from …" + Undo, audit category `rbac`). **Granting a sensitive permission** (`gate.release`, `artifacts.all`, `artifacts.export`, `audit.view`, `people.manage`, `roles.manage`, `connections.manage`, `policies.manage`) first opens a confirm dialog "Grant “<label>” to <role>?" "This is a sensitive permission. It applies straight away to **n people**: names." (or "Nobody has this role yet, so it takes effect when someone is given it.") "The change is recorded in the audit log with your name." (Cancel) [Grant permission].
- Below, two cards: focus role ("n of 17 permissions", Pill "Locked" for Platform Admin, "People with this role" list or "Nobody yet. Assign it in People and access.", ‹Manage people›) and a hint: "**Try it:** remove “Approve designs” from Solution Architect, then use **View as → Alex Kim** and open the design approval. The buttons are replaced by an explanation."

### 6.17 Policies (`#v3-policies`)

- Width 980, bottom padding 80. H1 "Policies"; lede "Rules every run follows. Changes apply to new gates from the moment you save; approvals already given are not affected."
- Row pattern: title 14px medium + optional sub 12.5px ink-3, control at right; rows separated by top borders.
- **Approval targets** "How long each role has to decide before the item counts as late": number inputs (`h-9 w-20 text-right tnum`, unit "hours"): Product Owner 4, Solution Architect 4, Engineering Lead 2, Integration Lead 4, Quality Lead 4, Release Manager 8; "Escalate to the platform admin after" 8 hours ("Dana Whitfield is notified and can reassign").
- **Separation of duties** "Who may not approve their own work": "The requester cannot approve their own plan" ("Applies straight away to every run") — **live**, toggling writes the policy immediately with toast "Requesters can no longer approve their own plans." / "Requesters can now approve their own plans." and an audit entry; "The requester cannot approve the Design" (on); "The requester cannot approve the Release" (on); "A person cannot review code they asked the agent to change" (on).
- **Change freezes** "No releases are scheduled inside these windows without an exception" + (+ Add freeze): Month-end close · 1–3 Dec 2026 · All applications; Year-end · 22 Dec – 2 Jan · All applications; Pricing review · 15 Jan 2027 · Full Application; each with a trash button (`aria-label="Remove <name>"`, red hover).
- **What the agent may do on its own** "Defaults for new runs. A squad can be stricter, never looser.": Move past Impact when all checks pass ("Impact has no human gate", on); Retry failed tests up to 3 times ("Then it stops and asks for an engineer", on); Publish stakeholder summaries without review ("Off: a person reads them first", off).
- **Agent spend** "This month: $186 of $500" + Pill "37% used": Monthly budget 500 USD; Warn the platform admin at 80 % of budget.
- Unsaved bar (when anything other than the live SoD switch changes): fixed bottom centre, offset by the sidebar (`pl-[248px]`), `rounded-2xl bg-[--v-side] px-5 py-3 text-white shadow-xl`: "You have unsaved policy changes" (Discard) [Save policies] → toast "Policies saved. They apply to new gates from now."

### 6.18 Connections (`#v3-connections`)

- H1 "Connections"; lede "Systems the platform reads from and writes to. If one stops working, runs that need it pause and you are told here."; Pills "4 healthy" (5 after fixing), "1 needs attention", "1 failing".
- Failure banner (red): Bell, "**Approval requests are not reaching Teams** The Teams sign-in expired at 08:12. Approvers still see their items in the platform, but 3 notifications were not delivered." [Sign in again] → `fixTeams`, toast "Signed in to Teams. The 3 missed notifications have been sent." + Undo.
- Grid of 3 columns, one card per system: 40px sunken icon tile, name, status Pill, description, two meta lines, buttons (↻ Test → "Testing <name>… connection works."), [Re-index now] for the amber one ("Re-indexing the Knowledge Fabric. About 20 minutes."), ghost (Settings) toggling a details box (Signs in as svc-delivery-platform · Scope · Owner Dana Whitfield).

| System | Icon | Purpose | Status | Meta |
|---|---|---|---|---|
| Azure Boards | LayoutList | Creates a Developer Task for every approved design | Connected | Synced 2 min ago · 128 tasks this month |
| Azure DevOps Pipelines | Workflow | Runs integration on each merge commit | Connected | Last run 18 min ago · 3 pipelines |
| Source repositories | GitBranch | Read access for impact checks, write access to feature branches only | Connected | 3 repositories · full-application-ui and 2 more |
| Knowledge Fabric | BookOpen | Product rules and earlier decisions the agent searches | Index is 2 days old (amber) | Last indexed Sun 9 Nov · Product rules v4 · 2,418 documents |
| AI model | Cpu | GPT-5.4 for planning, design and code | Connected | Average reply 4.2 s · $186 spent this month |
| Microsoft Teams | Bell | Sends approval requests and escalations | Sign-in expired (red) → Connected | Failed since 08:12 today · 3 notifications not delivered |

### 6.19 Audit log (`#v3-audit`)

- Top-bar action (⇩ Export CSV) → `audit-log-<range>.csv` with columns time_utc, who, action, target, category, ip, detail; audit "Exported audit log, n entries, <range>".
- H1 "Audit log"; lede "Every decision, document, access and permission change. Entries cannot be edited or deleted, and each one is linked to the one before it. Times are in UTC."; badge "Chain verified · n entries · kept 7 years".
- Filters: category chips All / Decision / Access / Permissions / Admin / Document / System; range select All time / Today / Last 7 days; search "Search actions"; person select (Everyone + names, "System").
- Table (default sort When desc, page size 12): When (UTC) (date-time + relative "12 min ago"), Who (Avatar + name or "System"), What, Where, Type Pill (Decision work · Access mute · Permissions bad · Admin wait · Document done · System bad).
- Selecting a row opens the detail panel (380px): type Pill, action title, When (full UTC), Who (+ " · signed in with SSO" for people), Where, From (IP · session id), Change (for permission entries: struck "granted"/"not granted" → new value), Fingerprint, Previous; green note "Linked to the previous entry. Unchanged since it was written."
- Chain: entries are hashed oldest-first; each fingerprint = hash(previous fingerprint + time + who + action + target). (Prototype uses a 32-bit hash; production must use SHA-256 and server-side signing, see §13.)

### 6.20 Not found, no access, narrow screen

See §5 (router) and §4.22 (no access) and §10.6 (narrow).

---

## 7. Workflow and state

### 7.1 Stage string

Each run stores its progress as a string `s`, one character per stage reached, index = stage number:

| Code | Meaning | Visual |
|---|---|---|
| `d` | Done (approved, or passed automatically) | green ✓ |
| `w` | Waiting on a person (gate open) | amber ring |
| `a` | Agent working on this stage | blue |
| `f` | Failed (agent stopped) | red ✗ |
| (absent) | Upcoming | grey |

Example `ddddw` = Plan, Specify, Impact, Design done; Build waiting on a person. Current stage index = `s.length − 1`.

### 7.2 Run state

| `state` | Meaning |
|---|---|
| `work` | The agent is working (last character `a`), or a release is scheduled |
| `wait` | A person holds it (last character `w`) |
| `bad` | Blocked: failed or on hold |
| `done` | Released |
| `you` | **Derived, never stored**: `wait` and `holder === me`. The `now` text is also personalised ("waiting for approval" → "waiting for your approval", "waiting for an answer" → "waiting for your answer"). |

### 7.3 State machine for one stage

```
            agent finishes                     approver approves
   ┌───┐  ───────────────▶  ┌───┐  ─────────────────────────────▶  ┌───┐ → next stage starts as `a`
   │ a │                    │ w │                                   │ d │
   └───┘  ◀───────────────  └───┘                                   └───┘
     │     sent back / request changes (note required where shown)
     │
     └── agent fails 3 times ──▶ ┌───┐ ── "Update the tests and re-run" ──▶ a ── 3.5 s ──▶ w (Quality Lead)
                                 │ f │ ── "Assign an engineer" ──▶ w (held by Lena Brooks)
                                 └───┘
Impact (2) has no human gate: a → d automatically when checks pass (policy "Move past Impact…").
Release (7): w → scheduled (state work, `scheduled` set) → done at the window; or w → done ("Now");
             or w → bad (held, reason required); scheduled → w ("Cancel schedule").
```

### 7.4 Actions (store API)

Every action: clones state, bumps version `v`, persists, and returns an **undo token**. "Audit" = entry added at the top of the audit log; "Notify" = notification added for the named people.

| Action | Who / where | Effect on the run | Audit | Notify | Toast (Undo?) |
|---|---|---|---|---|---|
| `createRequest(id, text, app)` | New request | New run: `s='a'`, state work, now "Agent drafting the plan", holder agent, eta "About 3 days", `fresh`; put first in order; `nextId+1` | "Request started" | — | "WI-4841 started. The agent is drafting the plan." (no) |
| `finishPlan(id)` (auto after 4 s) | system | `s='w'`, wait, now "Plan waiting for approval", ask "Approve the delivery plan"; holder Priya, **or Dana if the requester is Priya and plan SoD is on** (why: "Priya Nair requested this, so separation of duties sends the plan to Dana Whitfield as second approver." else "The agent turned the request into 1 objective and 2 stories.") | "Opened approval gate (Product Owner)" or "(second approver, separation of duties)" by agent | holder: "Plan waiting for your approval"; requester (if different): "Plan drafted for <id>" | — |
| `approvePlan(id)` | Run page | stage → d, next `a`, now "Agent writing the specification" | "Plan approved" | — | "Plan approved. The agent is writing the specification." (yes) |
| `requestPlanChanges(id)` | Run page | `s='a'`, now "Agent revising the plan" | "Plan sent back" | — | "Plan sent back to the agent." (yes) |
| `answerQuestions(answers)` | Clarify | WI-4799: store answers, advance, now "Agent writing the specification" | "Questions answered" | — | "Answers sent. The agent is writing the specification." (yes) |
| `approveDesign()` | Approve | WI-4821: advance, now "Agent building the change" | "Design approved" | me: "Build started for WI-4821" | "Design approved. The agent has started building." (yes) |
| `requestDesignChanges()` | Approve | WI-4821: `s='ddda'`, now "Agent revising the design" | "Changes requested" | — | "Sent back to the agent with your note." (yes) |
| `setDev(id, 'copied'→'working')` | Dev agent card | `dev` phase; working 2.5 s after copied | "Copied the Developer prompt for VS Code" (me) / "Started work in VS Code (Developer Agent)" (agent) | — | "Developer prompt copied…" (no) |
| `approveBuild()` | Review | WI-4807: advance, now "Integration running on the merge commit", clears reassigned | "Build approved" | me: "Integration started for WI-4807" | "Build approved. Integration has started." (yes) |
| `requestBuildChanges()` | Review | WI-4807: `s='dddda'`, now "Agent revising the code" | — | — | "Sent back to the agent with your comment." (yes) |
| `finishAuto(id)` (auto after 5 s) | system | For a run working at Integrate (5) or Validate (6): last `a` → `w`, holder Tom / Mara, now "Integration waiting for approval" / "Validation waiting for approval", ask "Approve the integration" / "Approve validation", why "3 pipelines passed on the merge commit and staging is deployed." / "Every acceptance criterion is met and 214 of 214 regression tests pass." (+ " Resubmitted after your feedback.") | "Opened approval gate (Integration Lead / Quality Lead)" by agent | holder | — |
| `approveStage(id)` | Run page | stage 5 → advance, now "Validation running: acceptance and regression tests"; stage 6 → `…dw`, holder Sam, now "Release waiting for sign-off"; stage 7 → scheduled "Thu 13 Nov, 18:00" | "Integration approved" / "Validation approved" / "Release scheduled" | stage 6: Sam "Release waiting for your sign-off" | "Integration approved. Validation is running." / "Validation approved. The release is with Sam Okafor." / "Release scheduled for Thu 13 Nov, 18:00." (yes) |
| `sendBackStage(id, why)` | Run page dialog | last → `a`, holder agent, now "Agent fixing the integration after feedback" / "Agent reworking after validation feedback", `sentBack = why` | "Sent back integration/validation" (detail = note) | — | "Sent back to the agent with your note." (yes) |
| `scheduleRelease(when)` | Release | WI-4772: "Now" → `dddddddd` done "Released", eta "Released today"; else `dddddddw`, state work, `scheduled = when`, now "Release scheduled <when>" | "Released" / "Release scheduled" | — | see §6.9 (Undo only when scheduled) |
| `holdRelease(reason)` | Release dialog | now "Release on hold", state bad, `hold = reason` | "Held release" (detail) | Priya, Mara: "Release held · WI-4772" | "Release held. Priya and Mara have been told why." (yes) |
| `cancelSchedule(id)` | Run page | back to `dddddddw`, wait, holder Sam, eta "Not scheduled" | "Cancelled scheduled release" | — | "Scheduled release cancelled. It is back with the Release Manager." (yes) |
| `retryRun(id)` | Run (failed) | `f`→`a`, `retrying`, now "Agent re-running validation with the updated tests", eta "Fri 14 Nov" | "Validation re-run" | — | "Re-running validation with updated tests." (no) |
| `finishRetry(id)` (auto after 3.5 s) | system | `a`→`w`, holder Mara, now "Validation waiting for approval", why "All 214 regression tests now pass." | "Validation passed after retry" (agent) | — | — |
| `assignEngineer(id)` | Run (failed) | holder Lena, `f`→`w`, now "Engineer investigating the failed tests"; clears the "agent" problem | "Assigned Lena Brooks to investigate failed tests" | — | "Lena Brooks is now investigating." (yes) |
| `togglePause(id)` | Run top bar | `paused` toggles; paused runs are skipped by auto-advance | "Paused"/"Resumed" | — | "<id> paused. Nothing will move until you resume it." / "<id> resumed." (no) |
| `addComment(id, text)` | Comments, Approve note | append comment | "Commented" | each @mentioned person (not me): "<Name> mentioned you · <id>" | see §4.21 |
| `resolve(key)` | Governance, Squad | removes the problem; leave → WI-4807 holder Lena; squad → clears gap; freeze → clears freeze, sets `exception` | see §6.12 | — | see §6.12 (yes) |
| `invite(p)`, `setCover(c)` | People dialogs | adds to `invites` / `covers` | yes (category admin) | cover person | yes |
| `togglePerm(role, perm)` | Roles | add/remove permission | "Granted/Removed permission “perm” to/from Role" (rbac) | — | yes |
| `setPolicy('planSoD', v)` | Policies | policy flag | "Turned on/off policy “Requester cannot approve their own plan”" | — | (no) |
| `fixTeams()` | Connections | `teamsOk = true`, marks Teams note read | "Signed in to Microsoft Teams again" | — | yes |
| `viewArtifact(name, run)`, `exportArtifacts(what)` | Docs, Artifacts, Audit | — | "Viewed document" / "Exported …" (access) | — | — |
| `setMe(person)` | View as | `me` changes, go Home | "Signed in as <Name>" (access) | — | — |
| `markRead()`, `markOne(id)` | Notifications | unread → false | — | — | — |
| `reset()` | Prototype controls | seed data, keeps tour flag, `welcomed=true` | — | — | — |

### 7.5 Undo rule

Each action returns `{ before, v }`. `undo(token)` restores `before` **only if the current version still equals `token.v`** (nothing else changed since); it keeps the current `tour` and `welcomed` flags. Otherwise it returns false and the toast says "Cannot undo: something else has changed since."

### 7.6 Who approves a stage (`approver(run, i)`)

1. If stage `i` is waiting and held by a person → that person.
2. WI-4807 Build: Alex (named backup) while Jon is on leave, otherwise Lena.
3. Otherwise the default per stage: Priya, Priya, — (automatic), Alex, Jon, Tom, Mara, Sam.

### 7.7 Who may decide a gate (`useGate(id, perm)`)

- `decided` = run state is not `wait`.
- `blocked` = not decided and (I am not the holder **or** I lack the permission).
- **Named backup exception:** if I am the holder and the run is marked `backupFor`, I may decide without the role permission (Alex approving the Build for WI-4807).
- When blocked, the decision panel is replaced by NotYours (§4.22). The page itself stays readable.

### 7.8 Separation of duties

- Plan: when `policy.planSoD` is on and the requester is the person who would approve (Priya), the plan goes to Dana as second approver; the requester sees "You requested this, so another Product Owner must approve the plan."
- Squad editor blocks Priya (the requester) as Design or Release approver.
- People page warns on blocked role pairs.
- Policies page shows four SoD switches (one live in the prototype).

### 7.9 End-to-end journey (the video tour)

| Step | Person | Screen | Action | Result |
|---|---|---|---|---|
| 1 | Alex (Solution Architect) | Home → Approve | Read summary, tick risk, Approve design | WI-4821 → Build; toast with Undo |
| 2 | Priya (Product Owner) | Clarify | Pick answers, Send answers | WI-4799 → specification |
| 3 | Alex as backup for Jon | Review | Open a file, Approve build | WI-4807 → Integrate (agent runs 5 s) |
| 4 | Tom (Integration Lead) | Run WI-4807 | Approve integration | → Validate (agent runs 5 s) |
| 5 | Mara (Quality Lead) | Run WI-4807 | Approve validation | → Release, with Sam |
| 6 | Alex | New request | Draft the plan | WI-4841 created; plan ready in 4 s |
| 7 | Priya | Run WI-4841 | Approve plan | → Specify |
| 8 | Sam (Release Manager) | Release | Choose window, Schedule release | WI-4772 scheduled; can cancel; rollback after release |
| 9 | Dana (Platform Admin) | Governance, Squads, People, Roles, Audit | Reassign, complete squad, invite, change a permission, read the log | Problems clear; audit shows every step |

---

## 8. Roles and permissions

### 8.1 People and roles

| Key | Name | Role | Initials | Hue |
|---|---|---|---|---|
| alex | Alex Kim | Solution Architect | AK | #2469bc |
| priya | Priya Nair | Product Owner | PN | #7c5cc4 |
| sam | Sam Okafor | Release Manager | SO | #5a6b2b |
| dana | Dana Whitfield | Platform Admin | DW | #a0306a |
| jon | Jon Reyes | Engineering Lead (on leave until Fri 14 Nov) | JR | #0f7b6c |
| lena | Lena Brooks | Engineering Lead | LB | #12806f |
| tom | Tom Iverson | Integration Lead | TI | #6d5a2b |
| mara | Mara Lopez | Quality Lead | ML | #b4541f |
| ana | Ana Costa | Quality Lead | AC | #a84a1f |
| ravi | Ravi Shah | Solution Architect | RS | #3b6fb6 |
| ines | Ines Duarte | Auditor | ID | #55607a |
| agent | Delivery agent / "The agent" | AI | AI | #101429 |

"View as" offers: Alex, Priya, Sam, Jon, Tom, Mara, Ines, Dana. Default signed-in person: Alex.

### 8.2 Permissions (17, in four groups)

| Group | Key | Label |
|---|---|---|
| Delivery | `request.create` | Start requests |
| | `runs.pause` | Pause and resume runs |
| Approval gates | `gate.plan` | Approve plans and specifications |
| | `gate.design` | Approve designs |
| | `gate.build` | Approve builds |
| | `gate.integrate` | Approve integration |
| | `gate.validate` | Approve validation |
| | `gate.release` | Release to production |
| Artifacts and evidence | `artifacts.own` | See artifacts for their own work |
| | `artifacts.all` | See every artifact |
| | `artifacts.export` | Download and export artifacts |
| | `audit.view` | See the audit log |
| Administration | `squads.manage` | Manage squads |
| | `people.manage` | Manage people and access |
| | `roles.manage` | Edit roles and permissions |
| | `policies.manage` | Edit policies |
| | `connections.manage` | Manage connections |

Sensitive (need confirmation to grant): `gate.release`, `artifacts.all`, `artifacts.export`, `audit.view`, `people.manage`, `roles.manage`, `connections.manage`, `policies.manage`.

### 8.3 Default role matrix (● = granted)

| Permission | Platform Admin | Product Owner | Solution Architect | Engineering Lead | Integration Lead | Quality Lead | Release Manager | Auditor | Requester |
|---|---|---|---|---|---|---|---|---|---|
| request.create | ● | ● | ● | ● | | | | | ● |
| runs.pause | ● | ● | | ● | | | ● | | |
| gate.plan | ● | ● | | | | | | | |
| gate.design | ● | | ● | | | | | | |
| gate.build | ● | | | ● | | | | | |
| gate.integrate | ● | | | | ● | | | | |
| gate.validate | ● | | | | | ● | | | |
| gate.release | ● | | | | | | ● | | |
| artifacts.own | ● | ● | ● | ● | ● | ● | ● | | ● |
| artifacts.all | ● | | | | | | | ● | |
| artifacts.export | ● | | | | | | ● | ● | |
| audit.view | ● | | | | | | | ● | |
| squads.manage | ● | | | | | | | | |
| people.manage | ● | | | | | | | | |
| roles.manage | ● | | | | | | | | |
| policies.manage | ● | | | | | | | | |
| connections.manage | ● | | | | | | | | |

Platform Admin is locked (always all permissions).

### 8.4 Where permissions take effect

| Place | Rule |
|---|---|
| Admin routes | Guarded by the table in §5; without the permission → RequirePerm page |
| Sidebar Admin group | Each item only with its permission; group hidden if none |
| Command palette | Admin destinations only with permission |
| Gate decision panels | `useGate` (§7.7) |
| Run page late gates | `gate.integrate` / `gate.validate` / `gate.release` |
| Plan approval on run page | `gate.plan` + SoD |
| Pause / Resume | `runs.pause` |
| Retry failed run | `runs.pause` or requester |
| Assign engineer, Manage squad links, admin card on Home | `squads.manage` |
| Roll back, Cancel schedule | `gate.release` |
| Artifacts scope | `artifacts.all` → everything, else own work |
| Export / download | `artifacts.export` (document .md download also allowed with `artifacts.own`) |
| Audit links | `audit.view` |

---

## 9. Data model and seed data

### 9.1 Run

```js
{
  id: 'WI-4821', t: 'Registered Amortization limit', app: 'Full Application',
  by: 'priya',                 // requester
  s: 'dddw',                   // stage string (§7.1)
  state: 'wait',               // work | wait | bad | done   ('you' is derived)
  now: 'Design waiting for approval',
  holder: 'alex',              // person key or 'agent'
  age: '1 d', eta: 'Thu 13 Nov', wait: '12 min',
  screen: '#v3-approve',       // gate screen, if any
  ask: 'Approve the solution design',
  why: 'Blocks values above 310 on Product Selection. The Pricing API is not covered.',
  // optional: reassigned, backupFor, squadGap, freeze, exception, paused, retrying, fresh, dev ('copied'|'working'),
  //           answers [[q,a]], sentBack, hold, scheduled, decidedAt
}
```

### 9.2 Seed runs (in list order)

| ID | Title | App | By | s | state | Now | Holder | Age | ETA | Special |
|---|---|---|---|---|---|---|---|---|---|---|
| WI-4836 | Rate hold expiry notice | Full Application | alex | dda | work | Agent writing the impact assessment | agent | 2 h | Mon 17 Nov | squadGap |
| WI-4830 | Advisor licence check | Advisor Portal | priya | ddd | work | Agent preparing the design | agent | 6 h | Tue 2 Dec | freeze |
| WI-4821 | Registered Amortization limit | Full Application | priya | dddw | wait | Design waiting for approval | alex | 1 d | Thu 13 Nov | screen approve, wait 12 min |
| WI-4807 | Advisor eligibility banner | Advisor Portal | jon | ddddw | wait | Build waiting for code review | alex | 2 d | Fri 14 Nov | screen review, reassigned, backupFor Engineering Lead, wait 3 h |
| WI-4799 | Statement export format | Client Services | priya | dw | wait | Questions waiting for an answer | priya | 3 d | Wed 19 Nov | screen clarify, ask "Answer 2 questions", wait 1 h |
| WI-4790 | Session timeout copy | Advisor Portal | jon | ddddddf | bad | Validation failed: 2 tests | jon | 4 d | At risk | |
| WI-4772 | Fee schedule update | Full Application | priya | dddddddw | wait | Release waiting for sign-off | sam | 5 d | Thu 13 Nov | screen release, wait 5 h |
| WI-4751 | Mortgage term picker labels | Full Application | priya | dddddddd | done | Released | sam | 9 d | Released 9 Nov | |

`nextId` starts at 4841. Asks and whys for the waiting runs: WI-4807 "Review the completion report" / "Code and 6 unit tests are ready. Jon is on leave, so this came to you."; WI-4799 "Answer 2 questions" / "The agent needs to know the column order before writing the specification."; WI-4772 "Release the fee schedule update" / "Validation and business sign-off are done. Choose a release window."

### 9.3 Seed notifications, feed, comments, problems, audit

- Notifications (to, title, sub, age, link, unread): sam "Release waiting for your sign-off" "WI-4772 · validation and UAT are done" 5 h → release ●; dana "Approver on leave is holding a review" "WI-4807 · Jon Reyes is away until Friday" 3 h → admin ●; alex "Design waiting for your approval" "WI-4821 · from the delivery agent" 12 min → approve ●; alex "Completion report reassigned to you" "WI-4807 · Jon Reyes is on leave" 3 h → review ●; alex "Priya replied to your question" "WI-4821 · “Can we add the server check…”" 10 min → approve ●; dana "Teams notifications are failing" "Connections · sign-in expired at 08:12" 2 h → connections (read); everyone "Term picker labels released" "WI-4751 · Sam Okafor" Mon → runs (read).
- Feed: agent "Design finished · WI-4821" 12 min ago; Priya "Plan approved · WI-4830" 40 min ago; agent "Fixed its own mistake · WI-4821" 45 min ago; Sam "Released · WI-4751" Mon 16:05.
- Comments: WI-4821 — Priya, 2026-11-11 09:32 UTC: "Can we add the server check as a follow-up request?"
- Open admin problems: leave, agent, freeze, squad. `teamsOk: false`. `policy.planSoD: true`.
- Audit seed (time, who, action, target, category, IP): 08:40 agent Validation failed after 3 attempts: 2 tests · WI-4790 · gate · 10.20.4.2; 08:05 agent Retried validation (attempt 2 of 3) · WI-4790 · gate; 09:42 agent Saved document · ADR-0173 · WI-4821 · artifact; 09:40 agent Opened approval gate (Solution Architect) · WI-4821 · gate; 09:31 dana Viewed document · Impact assessment · WI-4821 · access; 09:12 priya Approved plan · WI-4830 · gate; 08:12 system Connection failed: Microsoft Teams sign-in expired · Connections · system; Mon 17:20 dana Changed role: Lena Brooks can approve as Integration Lead · People and access · rbac; Mon 16:05 sam Released · WI-4751 · gate; Mon 11:02 dana Exported audit pack (week 45) · Governance · access. All dated 9–11 Nov 2026 UTC.
- Audit entry shape: `{ t, at (ISO), ip, who, action, target, cat (gate|access|rbac|admin|artifact|system), detail?, live? }`. New entries: IP `10.20.4.37` for people, `10.20.4.2` for the agent.

### 9.4 Persistence

- All prototype state in `sessionStorage['delivery-prototype-v7']` (JSON, saved on every change; failures ignored). Each viewer gets their own copy. Theme in `localStorage['delivery-theme']`.
- Production replaces this with the API (§11 Phase 9).

### 9.5 Documents (artifacts)

| Kind key | Name | Stage | Type label (Artifacts) |
|---|---|---|---|
| plan | Delivery plan | 0 | Plan |
| story | Story n: <title> | 0 | Story |
| spec | Specification | 1 | Specification |
| impact | Impact assessment | 2 | Impact |
| design | Architecture decision record | 3 | Design |
| assignment | Developer assignment | 3 | Handoff |
| handoff-test | Tester handoff | 3 | Handoff |
| completion | Developer completion report | 4 | Code and tests |
| integration | Integration evidence | 5 | Pipeline |
| validation | Validation report | 6 | Test report |
| release | Release record | 7 | Release |

- Storage references shown to users:
  - Blob path: `artifacts/<app-slug>/<run-id lower>/<kind or story-n>-<version>.md` (app slug e.g. `full-application`).
  - SQL id: `dbo.Artifacts · id <18000 + (run number mod 1000) × 7 + stage × 3 + story>`.
  - Azure Boards task `#<88000 + run number mod 1000>`; pull request `#<200 + run number mod 50>`; branch `feature/<run id lower>-<title slug, 28 chars>`.
  - Repositories: Full Application → `full-application-ui`, Advisor Portal → `advisor-portal-web`, Client Services → `client-services-app`.
- Stories: two per run (WI-4821, WI-4807, WI-4799 have named stories; others get generic ones). Story 1 progresses Specify → Design → Build with the run (status Planned, Specifying, Designing, Building, Built); story 2 is "Queued: starts after story 1 is built" until Build is done.
- Document content per kind is listed in `docs.jsx contentFor()`; the key headings are: Plan (Objective, Stories, Out of scope, Agent assumptions, Traceability); Story (callout "As …, I want …, so that …", Acceptance criteria, Delivery order, Status); Specification (Business rules table, Acceptance criteria AC-1…AC-4, Non-functional requirements: WCAG 2.2 AA, No new service or data store, Validation runs in under 50 ms); Impact (Affected components table, diagram, Dependencies); Design (Decision, Options considered table, Accepted risk callout, diagram, Changes since v1 diff); Developer assignment (For the developer, Developer prompt code block, Files the design allows to change, Rules); Tester handoff (What to test, Test data "Values 1, 309, 310, 311 and 999."); Completion (Summary, files table, results list); Integration (pipelines table); Validation (results list); Release (Version 2026.11.3, Change ticket CHG0041872, Window, Rollback).
- Developer prompt text:
  ```
  You are the Developer Agent for WI-4821 (Registered Amortization limit).
  Repository: full-application-ui · base branch: main
  Read the approved design (ADR) and developer handoff from the platform.
  Implement only the approved changes, add unit tests, and open a pull request.
  Link Azure Boards task #88821. Post the completion report when done.
  ```

### 9.6 Agent panel content per stage

| Stage | Confidence | Produced | Unsure about | Time · cost · tokens |
|---|---|---|---|---|
| 0 Plan | 82 | A delivery plan: 1 objective and 2 stories | Whether renewals are in scope; the request does not say. | 4 min · $0.09 · 3,120 |
| 1 Specify | 74 | A specification with 8 acceptance criteria | The column order differs between two documents, so it asked you. / Whether closed accounts belong in the export. | 4 min · $0.13 · 4,410 |
| 2 Impact | 88 | An impact assessment: 4 components across 2 repositories | Whether batch import shares the same validator. | 6 min · $0.16 · 5,300 |
| 3 Design | 86 | Architecture decision ADR-0173 and developer and tester handoffs | The Pricing API also accepts this value… / Whether Compliance must approve the advisor message wording. | 13 min 48 s · $0.21 · 6,410 · 1 self-correction |
| 4 Build | 91 | 4 changed files and 6 unit tests | The banner copy is a draft until Compliance reviews it. | 14 min · $0.34 · 9,820 |
| 5 Integrate | 90 | Integration evidence: 3 pipeline runs on the merge commit | Staging data is 2 days old, so one contract test ran against older fixtures. | 15 min · $0.06 · 1,900 |
| 6 Validate | 58 (Low) | A validation report | Two tests still expect the old 20-minute timeout… | 24 min · $0.18 · 5,200 |
| 7 Release | 93 | Release notes, rollback plan and deployment checklist | Applications started before release keep the old fees… | 4 min · $0.08 · 2,950 |

Each stage also lists 2–4 sources, 2–6 checks (pass/fail) and 3–5 timed steps (full text in `agentpanel.jsx BASE`). Model for every stage: GPT-5.4.

---

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

---

## 11. Phased build plan

Ten phases. Phases 0–8 rebuild the prototype exactly (front end with mock data). Phase 9 swaps the mock store for real services. Sizes: S ≈ 1–2 days, M ≈ 3–5 days, L ≈ 1–2 weeks, for one experienced front-end developer (an AI coding agent can go faster but must still pass every check).

### Phase 0 · Project setup (S)

| Task | Output |
|---|---|
| 0.1 Create Vite + React app, install packages (§2.2) | Runs on `npm run dev` |
| 0.2 Configure Tailwind v4, aliases, shadcn (`radix-nova`, neutral, lucide) | `@/` imports work |
| 0.3 Add oxlint, Playwright, axe-core; CI runs lint + tests | Green pipeline |
| 0.4 Add `build:share` single-file build | `dist-share/index.html` opens offline |

**Done when:** a blank page builds, lints and deploys.

### Phase 1 · Tokens and typography (S)

| Task | Output |
|---|---|
| 1.1 Paste the stylesheet from §3.1 | `.v3` tokens, light and dark |
| 1.2 Load fonts (Inter Variable, Space Grotesk 500/600, JetBrains Mono 400) | `font-display`, `font-mono`, `tnum` |
| 1.3 ThemeProvider + ThemeToggle (§4.4) | Light / dark / system, remembered |
| 1.4 A token test page showing every colour pair, pill and type size in both modes | Visual check |

**Done when:** the token page matches §3 in both modes and axe reports no contrast issues.

### Phase 2 · Primitive components (M)

Build §4.1–4.15 and §4.25 in isolation with demo data: Avatar, Button sizes, Pill, Stepper (3 variants), Card/CardHead, KPI tile, filter chips, search field, select, input, table + SortTh + Pager + useTable, callouts, Toggle, FormDialog + Field, confirm dialog, StoryBar, timeline, diff viewer, matrix checkbox, PersonSelect.

**Done when:** each component has a story/demo, keyboard works, axe is clean, dark mode is correct.

### Phase 3 · Shell, routing and global overlays (M)

| Task | Spec |
|---|---|
| 3.1 Shell layout, sidebar (with Admin group by permission), top bar, breadcrumb, skip link | §4.5 |
| 3.2 Hash router, guards, Not found, unknown run, narrow gate | §5, §10.6 |
| 3.3 Toast provider with Undo | §4.20 |
| 3.4 Command palette (Ctrl/⌘+K, `/`) | §4.16 |
| 3.5 Notifications popover | §4.17 |
| 3.6 RequirePerm page and NotYours card | §4.22 |
| 3.7 Welcome dialog and tour bar (demo builds only) | §4.23 |

**Done when:** every route in §5 renders inside the Shell with the right active nav item and breadcrumb, and guarded routes show the no-access page for Alex.

### Phase 4 · Data store and workflow engine (M)

| Task | Spec |
|---|---|
| 4.1 Seed data (runs, people, notes, feed, comments, audit, roles, policy) | §9 |
| 4.2 Store with versioned updates, persistence and undo tokens | §7.5, §9.4 |
| 4.3 All actions with audit entries and notifications | §7.4 |
| 4.4 Derived data: personalised state `you`, `mine` (sorted by wait), my notifications and unread count, `can()`, `approver()`, KPIs | §7.2, §7.6 |
| 4.5 Timers: finishPlan 4 s, finishAuto 5 s, finishRetry 3.5 s, dev copied→working 2.5 s; paused runs are skipped | §7.4 |
| 4.6 `useGate` with the named-backup exception | §7.7 |

**Done when:** unit tests cover every action, undo (allowed and refused), SoD routing of plans and the derived `you` state.

### Phase 5 · Delivery screens (L)

| Task | Screen | Spec |
|---|---|---|
| 5.1 | Home | §6.1 |
| 5.2 | New request | §6.2 |
| 5.3 | Runs and Approvals | §6.3 |
| 5.4 | Run overview with every StatusCard variant, Documents, People, Stories, Activity, Discussion | §6.4 |
| 5.5 | Comments and Activity | §4.21 |

**Done when:** a new request goes from drafting to plan approval and appears correctly on Home, Runs and Approvals for each person.

### Phase 6 · Gate screens (L)

| Task | Screen | Spec |
|---|---|---|
| 6.1 | Approve a design (summary/technical, citations, risk tick, note rules) | §6.5 |
| 6.2 | Answer questions | §6.6 |
| 6.3 | Code review | §6.8 |
| 6.4 | Release (windows, reason, ticket, confirm, hold dialog) | §6.9 |
| 6.5 | Late gates on the run page: Integrate, Validate, send-back dialog, failed run, scheduled release, rollback | §6.4 |

**Done when:** every gate has decided, not-mine and no-permission states, and each decision shows a toast, writes audit, and can be undone.

### Phase 7 · Documents, evidence and rules (M)

| Task | Spec |
|---|---|
| 7.1 Document viewer with all block types, Markdown tab, record panel, SHA-256, download, copy link, deep links | §4.19, §9.5 |
| 7.2 Stories card and Developer Agent card | §6.4, §4.25 |
| 7.3 Agent panel with per-stage content and Q&A | §4.18, §9.6 |
| 7.4 How the design was made | §6.7 |
| 7.5 Business rules | §6.10 |
| 7.6 Artifacts library with scope, filters, detail panel, CSV export | §6.11 |

**Done when:** every document in the Documents list, Stories card and Artifacts opens, downloads and deep-links.

### Phase 8 · Administration (L)

| Task | Screen | Spec |
|---|---|---|
| 8.1 | Governance, including audit pack export | §6.12 |
| 8.2 | Squads | §6.13 |
| 8.3 | Squad editor with live policy checks | §6.14 |
| 8.4 | People and access with invite and cover dialogs | §6.15 |
| 8.5 | Roles and permissions matrix with sensitive-grant confirmation | §6.16 |
| 8.6 | Policies with the live SoD switch and unsaved bar | §6.17 |
| 8.7 | Connections | §6.18 |
| 8.8 | Audit log with chain, filters, detail and CSV export | §6.19 |

**Done when:** Dana can clear all four problems, a permission change takes effect immediately for Alex, and every admin action appears in the audit log.

### Phase 9 · Production back end (L–XL, outside the prototype)

Replace the mock store with services, keeping the same UI contracts.

| Prototype piece | Production replacement |
|---|---|
| `sessionStorage` state | REST/GraphQL API over Azure SQL (runs, stages, approvals, comments, notifications, roles, policies, squads) |
| Document content in `docs.jsx` | Agent-generated Markdown in Azure Blob Storage (immutable container), metadata and versions in Azure SQL `dbo.Artifacts` |
| SHA-256 in the browser | Server-side hash at write time, stored with the version, optionally signed |
| Audit chain (32-bit hash) | Append-only audit table with SHA-256 chaining and write-once storage |
| `can()` from a local role map | Entra ID SSO + SCIM groups mapped to roles; permission checks on every API call (the UI checks are only for display) |
| Timers that move runs | Agent orchestration service events (webhooks or server-sent events) |
| Developer prompt copy-paste | Azure Boards task + Developer Agent pulling its assignment (e.g. through an MCP server) and posting the completion report |
| Pipeline results | Azure DevOps Pipelines API |
| Notifications | In-app store + Microsoft Teams |
| Agent panel numbers | Real telemetry per stage: sources, checks, steps, model, tokens, cost |

**Done when:** the acceptance checklist in §12 passes against the real back end, and server-side permission tests prove the UI cannot be bypassed.

### Suggested order and dependencies

```
P0 → P1 → P2 → P3 → P4 ─┬─→ P5 → P6 ─┐
                        └─→ P7 ───────┼─→ P8 → P9
                                      └──────┘
```
P5 and P7 can run in parallel after P4. P8 needs P5 (Shell pages) and P7 (Artifacts, Audit links).

---

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

---

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

---

## Appendix A. Screenshot index (`app/docs/ui-spec/screens/`)

| File | Shows |
|---|---|
| 01-home.png | Home as Alex (2 decisions waiting) |
| 02-new-request.png | New request with live preview |
| 03-runs.png | Runs, all filters |
| 04-approvals.png | Approvals (Waiting for me) |
| 05-run-overview.png | Run WI-4821, design waiting for Alex |
| 06-approve-design.png | Approve a design, plain summary |
| 07-clarify.png | Answer questions as Priya |
| 08-evidence.png | How the design was made |
| 09-code-review.png | Code review as Alex (backup) |
| 10-release.png | Release gate as Sam |
| 11-business-rules.png | Business rules, RA-MAX |
| 12-artifacts.png | Artifacts as Dana (all) |
| 13-governance.png | Governance with 4 problems |
| 14-squads.png | Squads |
| 15-squad-detail.png | Squad editor for WI-4836 (Integration Lead missing) |
| 16-people.png | People and access |
| 17-roles.png | Roles and permissions matrix |
| 18-policies.png | Policies |
| 19-connections.png | Connections with Teams failing |
| 20-audit-log.png | Audit log |
| 21-run-failed.png | Failed run WI-4790 as Dana |
| 22-run-release-wait.png | Run WI-4772 as Sam |
| 23-no-access.png | No access page (Alex on Roles) |
| 24-agent-panel.png | "How the agent did this" sheet |
| 25-document-viewer.png | Document viewer (ADR) |
| 26-command-palette.png | Command palette |
| 27-notifications.png | Notifications popover |
| 28-form-dialog.png | Hold release form dialog |
| 29-home-dark.png | Home in dark mode (as Sam) |
| 30-welcome.png | Welcome dialog |
| 31-tour-bar.png | Guided tour bar |

## Appendix B. File-to-section index

| Prototype file | Section |
|---|---|
| index.css | §3 |
| main.jsx, App.jsx | §2.4, §5 |
| v3/theme.jsx | §4.4 |
| v3/ui.jsx | §4.1, §4.3, §4.5–4.7, §8.1 |
| v3/table.jsx | §4.11 |
| v3/forms.jsx | §4.14 |
| v3/gate.jsx | §4.22, §7.7 |
| v3/collab.jsx | §4.21 |
| v3/overlays.jsx | §4.16, §4.17 |
| v3/agentpanel.jsx | §4.18, §9.6 |
| v3/docs.jsx | §4.19, §4.25, §9.5 |
| v3/tour.jsx, protomenu.jsx | §4.23, §4.24 |
| v3/store.jsx | §7, §8, §9 |
| components/friendly.jsx | §4.20 |
| Screen files | §6.1–§6.19 |
