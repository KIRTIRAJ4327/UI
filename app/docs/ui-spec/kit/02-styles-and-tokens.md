# Step 2 of 31: Styles and design tokens

One stylesheet holds every colour, font and radius for light and dark mode. Every later file depends on these token names.

## What to tell Copilot

Open this file in the editor, then paste this into Copilot Chat (Agent or Edit mode):

```text
Using #file:02-styles-and-tokens.md, create the file exactly as given in the "Files" section: src/index.css.
Copy the code character for character. Do not rename, reformat, shorten, "improve" or convert to TypeScript.
Do not leave placeholders such as "// rest of the code". When done, list the files you created with their line counts.
```

## Files

Create this file with **exactly** this content.

### File: `src/index.css` (184 lines)

`````css
@import "tailwindcss";
@import "@fontsource-variable/inter";
@import "@fontsource/space-grotesk/500.css";
@import "@fontsource/space-grotesk/600.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-heading: var(--font-sans);
    --font-sans: 'Inter Variable', Inter, system-ui, sans-serif;
        --font-mono: 'JetBrains Mono', ui-monospace, monospace;
    --color-ink: var(--ink);
    --color-brand: var(--brand);
    --color-brand-soft: var(--brand-soft);
    --color-gate: var(--gate);
    --color-gate-soft: var(--gate-soft);
    --color-done: var(--done);
    --color-paper: var(--paper);
    --color-sidebar-ring: var(--sidebar-ring);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar: var(--sidebar);
    --color-chart-5: var(--chart-5);
    --color-chart-4: var(--chart-4);
    --color-chart-3: var(--chart-3);
    --color-chart-2: var(--chart-2);
    --color-chart-1: var(--chart-1);
    --color-ring: var(--ring);
    --color-input: var(--input);
    --color-border: var(--border);
    --color-destructive: var(--destructive);
    --color-accent-foreground: var(--accent-foreground);
    --color-accent: var(--accent);
    --color-muted-foreground: var(--muted-foreground);
    --color-muted: var(--muted);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-secondary: var(--secondary);
    --color-primary-foreground: var(--primary-foreground);
    --color-primary: var(--primary);
    --color-popover-foreground: var(--popover-foreground);
    --color-popover: var(--popover);
    --color-card-foreground: var(--card-foreground);
    --color-card: var(--card);
    --color-foreground: var(--foreground);
    --color-background: var(--background);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
    --brand: oklch(0.53 0.24 262);
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --radius: 0.125rem;
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
}

.dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
    }
  body {
    @apply bg-background text-foreground;
    }
  html {
    @apply font-sans;
    }
}
/* Brand: derived from the existing console (navy #101429, blue #2469bc) */
:root {
  --ink: #101429; --brand: #2469bc; --brand-soft: #e8f0fa;
  --gate: #965c08; --gate-soft: #fbf3e4; --done: #2f7d4f; --paper: #f7f6f2;
  --primary: #2469bc; --primary-foreground: #fff; --ring: #2469bc;
  --background: #f7f6f2; --border: #e3e1da; --foreground: #101429;
}
body { font-size: 13.5px; color: var(--ink); }

/* v3: evolution of the client's console tokens (bg #eef1ed, ink #101429, blue #2469bc, green #4fae58) */
.v3 {
  --radius: 0.625rem;
  --v-bg: #eef1ed; --v-surface: #ffffff; --v-sunken: #f5f7f4; --v-line: #dfe5df; --v-ink: #101429; --v-ink-2: #4a5550; --v-ink-3: #56615a;
  --v-blue: #2469bc; --v-blue-soft: #e8f0fb; --v-green: #23703a; --v-green-soft: #e6f4e8; --v-amber: #864f00; --v-amber-soft: #fdf1dc; --v-red: #b3261e; --v-red-soft: #fdeceb;
  --primary: #2469bc; --ring: #2469bc;
  --v-line-strong: #b9c4bb; --v-amber-line: #f0d9a8; --v-red-line: #f2c4c0; --v-blue-line: #c9d8f0; --v-toggle-off: #c3ccc5;
  --v-inv: #101429; --v-inv-fg: #ffffff; --v-side: #101429;
  font-family: 'Inter Variable', Inter, system-ui, sans-serif; font-size: 14px; color: var(--v-ink); background: var(--v-bg);
  font-feature-settings: "cv11", "ss01";
}
.v3 .font-display { font-family: 'Space Grotesk', 'Inter Variable', sans-serif; letter-spacing: -0.01em; }
.v3 .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.v3 .tnum { font-variant-numeric: tabular-nums; }
.v3 h1, .v3 h2, .v3 h3 { text-wrap: balance; }

/* Dark mode for the product (round 3). Same navy and blue identity; surfaces step up in lightness, accents brighten for contrast. */
.v3[data-mode="dark"] {
  color-scheme: dark;
  --v-bg: #0d111d; --v-surface: #151a2a; --v-sunken: #1b2134; --v-line: #283048; --v-line-strong: #3a4462;
  --v-ink: #e8ebf3; --v-ink-2: #b6bdcd; --v-ink-3: #8f99ae;
  --v-blue: #7aa7ff; --v-blue-soft: #1a2846; --v-blue-line: #2c4370;
  --v-green: #56c787; --v-green-soft: #12291d;
  --v-amber: #f2b54b; --v-amber-soft: #2b2212; --v-amber-line: #5b4520;
  --v-red: #ff8077; --v-red-soft: #33171a; --v-red-line: #5e2a2c;
  --v-toggle-off: #3a4462; --v-inv: #e8ebf3; --v-inv-fg: #0d111d; --v-side: #090c16;
  /* shadcn component tokens follow the product palette */
  --background: var(--v-bg); --foreground: var(--v-ink); --card: var(--v-surface); --card-foreground: var(--v-ink);
  --popover: var(--v-surface); --popover-foreground: var(--v-ink); --border: var(--v-line); --input: var(--v-line-strong);
  --muted: var(--v-sunken); --muted-foreground: var(--v-ink-3); --accent: var(--v-sunken); --accent-foreground: var(--v-ink);
  --secondary: var(--v-sunken); --secondary-foreground: var(--v-ink); --primary: #2f74d6; --primary-foreground: #ffffff; --ring: #7aa7ff;
}
.v3[data-mode="dark"] ::placeholder { color: #737d93; }
`````

## Check before the next step

- [ ] The file contains the `.v3` block and the `.v3[data-mode="dark"]` block.
- [ ] No colour is changed, renamed or removed.

## Specification

This explains what the code above does, in words. If you later change the screen, keep to these rules.

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
