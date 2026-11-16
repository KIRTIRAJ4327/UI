# Step 1 of 31: Project setup

Create the project, install the packages and add the entry files. Nothing shows on screen yet.

## What to tell Copilot

Open this file in the editor, then paste this into Copilot Chat (Agent or Edit mode):

```text
Using #file:01-project-setup.md, create 10 files exactly as given in the "Files" section: package.json, vite.config.js, jsconfig.json, components.json, index.html, public/favicon.svg, .gitignore, .github/copilot-instructions.md, src/lib/utils.js, src/main.jsx.
Copy the code character for character. Do not rename, reformat, shorten, "improve" or convert to TypeScript.
Do not leave placeholders such as "// rest of the code". When done, list the files you created with their line counts.
```

## Files

Create these files with **exactly** this content.

### File: `package.json` (39 lines)

`````json
{
  "name": "delivery-platform-ui",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "oxlint",
    "build:share": "vite build --mode share"
  },
  "dependencies": {
    "@fontsource-variable/inter": "^5.3.0",
    "@fontsource/jetbrains-mono": "^5.3.0",
    "@fontsource/space-grotesk": "^5.3.0",
    "@gsap/react": "^2.1.2",
    "@hugeicons/core-free-icons": "^4.4.0",
    "@hugeicons/react": "^1.1.10",
    "@tailwindcss/vite": "^4.3.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "gsap": "^3.15.1",
    "lucide-react": "^1.72.0",
    "radix-ui": "^1.8.1",
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "shadcn": "^4.23.0",
    "tailwind-merge": "^3.7.0",
    "tailwindcss": "^4.3.5",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.1.2",
    "oxlint": "^1.90.0",
    "vite": "^8.3.6",
    "vite-plugin-singlefile": "^2.3.4"
  }
}
`````

### File: `vite.config.js` (13 lines)

`````js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'

// `vite build --mode share` produces one self-contained HTML file (fonts, styles and scripts inlined)
// for publishing the prototype as a shareable link.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'share' ? [viteSingleFile()] : [])],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: mode === 'share' ? { outDir: 'dist-share', assetsInlineLimit: 100_000_000, cssCodeSplit: false } : {},
}))
`````

### File: `jsconfig.json` (1 lines)

`````json
{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } } }
`````

### File: `components.json` (27 lines)

`````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
`````

### File: `index.html` (13 lines)

`````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Delivery Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`````

### File: `public/favicon.svg` (1 lines)

`````xml
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="46" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style="fill:#863bff;fill:color(display-p3 .5252 .23 1);fill-opacity:1"/><mask id="a" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" style="fill:#000;fill-opacity:1"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="rotate(93.35 24.506 48.493)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(39.51 .387 8.972)"/></g><g filter="url(#k)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 47.523 -6.092)"/></g><g filter="url(#l)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 41.412 6.333)"/></g><g filter="url(#m)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#n)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#o)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 35.651 29.907)"/></g><g filter="url(#p)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 38.418 32.4)"/></g></g><defs><filter id="b" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-49.64" y="2.03" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-45.045" y="20.029" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-43.513" y="21.178" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="15.756" y="-17.901" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-27.636" y="-22.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="20.116" y="-38.415" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="24.641" y="-11.323" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="8.244" y="-2.416" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="18.713" y="10.588" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter></defs></svg>
`````

### File: `.gitignore` (3 lines)

`````
node_modules
dist
dist-share
`````

### File: `.github/copilot-instructions.md` (29 lines)

`````markdown
# Project rules for GitHub Copilot

This is the Unified Product Delivery Platform UI: a React prototype of a governed AI delivery console with 19 screens.

## Stack
- Vite, React 19 (JavaScript, not TypeScript), Tailwind CSS v4, shadcn/ui (`radix-nova`), lucide-react icons.
- Hash routing in `src/App.jsx` (no router library). State in `src/v3/store.jsx` (React context + sessionStorage).

## Where things are
- `src/index.css`: all design tokens. Product screens render inside `.v3` with `data-mode="light|dark"`.
- `src/v3/ui.jsx`: `Shell` (sidebar + top bar), `Card`, `CardHead`, `Pill`, `Stepper`, `Avatar`, `PEOPLE`, `STAGES`.
- `src/v3/store.jsx`: seed data, every action, `useProto()`, `can(permission)`.
- `src/v3/gate.jsx`: `useGate`, `NotYours`, `RequirePerm` (who may decide, and the no-access page).
- `src/v3/table.jsx`, `forms.jsx`, `collab.jsx`, `overlays.jsx`, `agentpanel.jsx`, `docs.jsx`, `tour.jsx`: shared pieces.
- `src/v3/<Screen>.jsx`: one file per screen.

## Rules
1. Colours come only from tokens: write `bg-[var(--v-surface)]`, `text-[var(--v-ink-2)]`, `border-[var(--v-line)]`. Never add a raw hex colour and never use Tailwind `dark:` classes; dark mode works through the tokens.
2. Status colours have one meaning each: amber = a person holds it, blue = the agent is working, green = done or passed, red = failed or blocked. Use `<Pill tone="you|wait|work|done|bad|mute">`.
3. Every screen is wrapped in `<Shell active="…" crumbs={[…]}>` and has exactly one `<h1>`.
4. Every decision must: call a store action, show a toast (`useToast`), offer Undo with the token the action returns when the action is reversible, and leave an audit entry (the store does this).
5. Check permissions with `can('…')` or `useGate`. People who cannot act still see the page, with an explanation.
6. Dialogs trap focus, close on Esc, and return focus to the button that opened them. Use `FormDialog` for forms.
7. Tables use `useTable`, `SortTh` and `Pager`, with a `<caption className="sr-only">`.
8. Keep all visible wording as it is unless asked. Plain English, sentence case.
9. Do not convert files to TypeScript, do not reformat existing files, do not replace the hash router.
10. After any change run `npm run build` and `npm run lint`.

The full specification is in `docs/UI-BUILD-SPEC.md` if it has been copied into the repository.
`````

### File: `src/lib/utils.js` (6 lines)

`````js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
`````

### File: `src/main.jsx` (14 lines)

`````jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from '@/components/friendly'
import { PrototypeProvider } from '@/v3/store'
import { ThemeProvider } from '@/v3/theme'
import { DocProvider } from '@/v3/docs'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider><PrototypeProvider><ToastProvider><DocProvider><App /></DocProvider></ToastProvider></PrototypeProvider></ThemeProvider>
  </StrictMode>,
)
`````

## Check before the next step

- [ ] `npm install` finishes without errors.
- [ ] The files exist at exactly these paths.
- [ ] Do not run the app yet: `src/App.jsx` arrives in step 12.

## Specification

This explains what the code above does, in words. If you later change the screen, keep to these rules.

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
