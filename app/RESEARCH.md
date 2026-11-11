# Research round 2: ideas from outside delivery dashboards

Round 1 (gate queue, control tower, board, timeline, workbench, role lenses) used familiar SaaS patterns. Round 2 borrows interaction models from other industries and tools, so the client sees genuinely different directions.

| # | Concept | Borrowed from | The idea we take |
|---|---|---|---|
| G | Flight strips | Air traffic control electronic flight strips | Work is a *strip* handed between controller bays (roles). The strip keeps the stamps of everyone who handled it, so handoff history is visible at a glance. |
| H | Blast radius | Service maps (Grafana, Coralogix, BigPanda) | Approve a change by looking at what it touches, ring by ring, and, just as importantly, what it does **not** touch. |
| I | Release train | ServiceNow CAB workbench, conflict calendar | Plot runs on a calendar with gates as milestones, freeze windows and collisions (two runs changing the same component). |
| J | Flight recorder | Langfuse / LangSmith trace views | Replace the 7-step activity checklist with the agent's real trace: a waterfall of steps you can scrub, with what the agent saw at each moment. |
| K | Command console | Delegative / generative UI (AG-UI, A2UI), Raycast | One keyboard command line. You delegate ("approve", "why is it failing", "start …") and the platform answers with live UI cards, not pages. |
| L | Rule ledger | Palantir Foundry object views (ontology) | Make the **business rule** the primary object, not the run: where it is enforced, where it is not, and every run that changed it. |

## Notes and caveats
- Most sources are vendor docs or practitioner write-ups, not peer-reviewed research.
- Flight-strip findings come from MIT (Doble & Hansman) and NTNU work: strips record control actions and make handoffs observable; layouts are configured per working position.
- Agent-observability vendors argue for a readable transcript by default with the span tree one click away.

## Sources
- ATC strips: https://ntrs.nasa.gov/api/citations/20030068998/downloads/20030068998.pdf · https://dspace.mit.edu/handle/1721.1/35252 · https://www.ntnu.no/documents/10401/1286462006/mats.ruste.holen.pdf/9cf03a4f-ec78-4f9d-9e8a-55ab980bce17 · https://www.copperchase.co.uk/electronic-flight-strips/
- Service maps / blast radius: https://grafana.com/docs/grafana-cloud/knowledge-graph/use-cases/explore-dependencies/ · https://coralogix.com/docs/user-guides/apm-v2/features/service-map/ · https://www.bigpanda.io/glossary/service-dependency-mapping/ · https://www.doit.com/changelog/cloud-diagrams-update-enhancing-investigate-mode-with-search-and-second-order-de
- CAB / conflict calendar: https://www.servicenow.com/docs/r/it-service-management/change-management/cab-workbench.html · https://www.servicenow.com/docs/r/MlbQAgTiiiMOLOw9T36wJg/J1Wr3wTEjguRwiE87EnJfQ
- Agent traces: https://langfuse.com/docs/observability/features/agent-graphs · https://langfuse.com/changelog/2026-08-28-responsive-timeline · https://laminar.sh/blog/2026-01-29-laminar-vs-langfuse-vs-langsmith-llm-observability-compared
- Agent UI paradigms: https://www.aiacceleratorinstitute.com/nobody-wants-another-chatbot-7-interface-architectures-worth-building/ · https://www.marktechpost.com/2026/01/29/beyond-the-chatbox-generative-ui-ag-ui-and-the-stack-behind-agent-driven-interfaces/ · https://www.maviklabs.com/blog/agentic-ui-patterns-2026/
- Ontology / object views: https://www.palantir.com/docs/foundry/ontology/why-ontology · https://palantir.com/docs/foundry/platform-overview/overview/
- Review queues: https://graphite.dev/docs/review-pull-requests
