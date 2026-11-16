# UI build pack

Everything needed to build the Unified Product Delivery Platform UI exactly as shown in the stakeholder video.

| Folder / file | What it is | Use it when |
|---|---|---|
| `starter/` | The complete working project (19 screens). `npm install && npm run dev` | You want the UI running now, and will use Copilot to change or extend it |
| `kit/00-START-HERE.md` | A 31-step build kit: one file per step with the full code, a Copilot prompt, a screenshot and a check | The code must be created inside another repository with Copilot |
| `UI-BUILD-SPEC.md` | The written specification: styles, components, screens, workflow, roles, data, phased plan, acceptance checklist | You need to understand or change the design |
| `screens/` | 31 reference screenshots | Checking the result |

`build-kit.py` regenerates `kit/` from `starter/` and the specification.
