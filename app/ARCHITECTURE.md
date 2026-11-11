# Redesign mockups: UI architecture

Six clickable mockups of the Unified Product Delivery Platform, built as one React app so they share components and data.

## Stack
- Vite + React 19 (JavaScript), Tailwind CSS v4
- shadcn/ui (Radix base): Button, Badge, Table, Tabs, Card, Checkbox, Textarea, Progress, Separator
- `@react-bits/SplitText-JS-CSS` (GSAP) for page titles only: word fade, plays once on load, respects reduced motion

## Structure
```
src/
  App.jsx            Gallery + hash routing (#inbox, #mission, #board, #timeline, #workbench, #roles)
  data.js            Sample data: one run (WI-4821), runs list, inbox, audit trail
  components/
    kit.jsx          App shell (header, side nav), Tag, StageBar, Dot, Kbd, Panel, Title
    SplitText.jsx    From the React Bits registry
    ui/              shadcn components
  concepts/          One file per proposal (A–F)
```

## Signature visual language (`src/components/signature.jsx`)
What makes this the platform's own UI rather than a generic dashboard:
- **Gate glyph:** two posts and a bar. It is the product mark and the symbol for every human checkpoint.
- **Delivery track:** the 8 stages as stations on a line, with gates sitting *between* stations. Used large on a run, small in lists, and aligned across runs in the control tower.
- **Narration:** the platform's plain-English voice, set in a reading serif (Source Serif 4). Data stays in IBM Plex Sans/Mono.
- **Evidence strip:** every claim shows what it rests on (sources, checks, scope).
- **Rule trace:** one business rule followed from request → spec → design → code → tests.
- **Waiting clock:** time a gate has waited against its target.
- **Colour:** taken from the existing console: navy ink `#101429`, brand blue `#2469bc`; amber = a person holds it, blue = an agent is working, green = passed. Warm paper background `#f7f6f2`.

## Design rules
- Flat enterprise style: square corners, hairline borders, no shadows, 13.5px base type.
- Status colours mean one thing each: green = passed, blue = agent working, amber = waiting on a person, red = failed.
- Every concept answers "what needs me?" first. Approvals sit next to the content they approve.

## Run
`npm install && npm run dev`, then open the printed URL. Screenshots are in `shots/`.
