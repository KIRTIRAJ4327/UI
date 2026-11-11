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

## Design rules
- Flat enterprise style: 2px radius, hairline borders, no shadows, one blue accent, 13px base type.
- Status colours mean one thing each: green = done, blue = agent working, amber = waiting on a person, red = failed.
- Every concept answers "what needs me?" first. Approvals sit next to the content they approve.

## Run
`npm install && npm run dev`, then open the printed URL. Screenshots are in `shots/`.
