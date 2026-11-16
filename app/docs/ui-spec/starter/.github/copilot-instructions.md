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
