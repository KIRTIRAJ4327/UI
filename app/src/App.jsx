import { useEffect, useState } from 'react';
import InboxConcept from '@/concepts/Inbox';
import MissionControl from '@/concepts/MissionControl';
import StoryBoard from '@/concepts/StoryBoard';
import Timeline from '@/concepts/Timeline';
import Workbench from '@/concepts/Workbench';
import RoleLenses from '@/concepts/RoleLenses';
import SplitText from '@/components/SplitText';
import FlightStrips from '@/concepts2/FlightStrips';
import BlastRadius from '@/concepts2/BlastRadius';
import ReleaseTrain from '@/concepts2/ReleaseTrain';
import FlightRecorder from '@/concepts2/FlightRecorder';
import CommandConsole from '@/concepts2/CommandConsole';
import RuleLedger from '@/concepts2/RuleLedger';

import V3Home from '@/v3/Home';
import V3New from '@/v3/NewRequest';
import V3Run from '@/v3/Run';
import V3Approve from '@/v3/Approve';
import V3Clarify from '@/v3/Clarify';
import V3Evidence from '@/v3/Evidence';
import { useProto } from '@/v3/store';
import V3Admin from '@/v3/Admin';
import V3Squad from '@/v3/Squad';
import V3Runs from '@/v3/Runs';
import V3Review from '@/v3/Review';
import V3Release from '@/v3/Release';
import V3Rules from '@/v3/Rules';
import V3People from '@/v3/People';
import V3Policies from '@/v3/Policies';
import V3Connections from '@/v3/Connections';
export const V3 = [
  ['v3-home','1 · Home','What is waiting for you, your requests and recent activity.',V3Home],
  ['v3-new','2 · New request','Describe the change; see the plan, approvers and timing before anything starts.',V3New],
  ['v3-runs','3 · Runs','Every request in one filterable list.',V3Runs],
  ['v3-run','4 · Run overview','Where a request is, who holds it, and the next decision.',V3Run],
  ['v3-approve','5 · Approve a design','Plain summary or full detail, the risk you accept, then decide.',V3Approve],
  ['v3-clarify','6 · Answer questions','The agent asks; you pick an option with the reason shown.',V3Clarify],
  ['v3-evidence','7 · How it was made','Every step, source and check behind the agent\'s work.',V3Evidence],
  ['v3-review','8 · Code review','Build gate: what was built, changed files, automatic checks.',V3Review],
  ['v3-release','9 · Release','Release gate: readiness, UAT sign-off, window, notes, rollback.',V3Release],
  ['v3-rules','10 · Business rules','Each rule, where it is checked and where it is not.',V3Rules],
  ['v3-admin','11 · Admin: Governance','Everything running, what needs attention, where work waits.',V3Admin],
  ['v3-squad','12 · Admin: Squad','Assign an approver and backup to every gate, with policy checks.',V3Squad],
  ['v3-people','13 · Admin: People and access','Who can approve what, in which application, and who is away.',V3People],
  ['v3-policies','14 · Admin: Policies','Approval targets, separation of duties, freezes, agent limits, spend.',V3Policies],
  ['v3-connections','15 · Admin: Connections','Health of Azure Boards, pipelines, repos, Knowledge Fabric, model, Teams.',V3Connections],
];
export const ROUND2 = [
  ['strips','G · Flight strips','From air traffic control: each run is a strip handed between role bays, stamped by everyone who handled it.',FlightStrips],
  ['radius','H · Blast radius','From service maps: approve by seeing what the change touches, ring by ring, and what it does not.',BlastRadius],
  ['train','I · Release calendar','From change-advisory boards: runs on a calendar with gates, freeze windows and collisions.',ReleaseTrain],
  ['recorder','J · Flight recorder','From agent tracing: the agent\'s real steps for a stage, scrubbable, with what it saw.',FlightRecorder],
  ['console','K · Command console','From delegative and generative UI: one command line, answers arrive as live UI.',CommandConsole],
  ['rules','L · Rule ledger','From ontology tools: the business rule is the main object, with where it is and is not enforced.',RuleLedger],
];

export const CONCEPTS = [
  ['inbox','A · Gate queue','Decisions grouped by gate, with waiting time against target and the risk you accept.',InboxConcept],
  ['mission','B · Control tower','Where delivery waits: agent time vs people time, and every run on an aligned track.',MissionControl],
  ['board','C · Two-lane board','Each stage split into what agents are doing and what people are holding.',StoryBoard],
  ['timeline','D · Narrated run','The run told as a short story, with evidence under every sentence.',Timeline],
  ['workbench','E · Evidence review','The decision document with every claim cited to its source.',Workbench],
  ['roles','F · Role lenses','One run, explained four ways: requester, approver, engineer, auditor.',RoleLenses],
];
const useHash = () => { const [h,setH] = useState(location.hash.slice(1)); useEffect(()=>{ const f=()=>setH(location.hash.slice(1)); addEventListener('hashchange',f); return ()=>removeEventListener('hashchange',f); },[]); return h; };

function Gallery() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-10 text-ink">
      <div className="text-xs text-neutral-500">Unified Product Delivery Platform</div>
      <SplitText text="Redesign proposals for review" tag="h1" splitType="words" effect="fade" delay={60} duration={0.6} textAlign="left" trigger="load" className="text-3xl font-light" />
      <p className="mt-2 max-w-3xl text-neutral-600">Round 2 borrows interaction models from air traffic control, service maps, change-advisory boards, agent tracing, command lines and ontology tools. All use the same sample run, WI-4821, and the same visual language.</p>
      <h2 className="mt-8 text-[13px] font-semibold text-ink">Round 3 · recommended: the complete product, 15 connected screens</h2>
      <div className="mt-2 grid grid-cols-3 gap-4">{V3.map(([k,t,d])=>(
        <a key={k} href={`#${k}`} className="block rounded-xl border-2 border-brand/30 bg-white p-5 hover:border-brand"><b className="block text-base font-semibold">{t}</b><p className="mt-1 text-neutral-600">{d}</p><span className="mt-3 inline-block text-primary">Open screen →</span></a>))}</div>
      <h2 className="mt-10 font-mono text-[11px] uppercase tracking-wider text-[#65635c]">Round 2 · new interaction models (see RESEARCH.md)</h2>
      <div className="mt-2 grid grid-cols-3 gap-4">{ROUND2.map(([k,t,d])=>(
        <a key={k} href={`#${k}`} className="block border border-border bg-white p-5 hover:border-brand"><b className="block text-base font-semibold">{t}</b><p className="mt-1 text-neutral-600">{d}</p><span className="mt-3 inline-block text-primary">Open mockup →</span></a>))}</div>
      <h2 className="mt-10 font-mono text-[11px] uppercase tracking-wider text-[#65635c]">Round 1 · earlier directions</h2>
      <div className="mt-2 grid grid-cols-6 gap-2">{CONCEPTS.map(([k,t])=>(
        <a key={k} href={`#${k}`} className="block border border-border bg-white p-3 text-[12.5px] hover:border-brand">{t}</a>))}</div>
    </div>
  );
}
const ApprovalsList = () => <V3Runs approvals />;
function DemoMenu({ h, ALL }) {
  const { reset } = useProto();
  return <details className="fixed left-3 bottom-[76px] z-40 w-[224px] rounded-lg border border-white/15 bg-[#1c2140] text-xs text-white shadow-lg">
    <summary className="cursor-pointer px-3 py-1.5 font-semibold">Prototype</summary>
    <div className="flex flex-col gap-1 p-2 pt-0">
      <button onClick={() => { reset(); location.hash = 'v3-home'; }} className="rounded-md bg-white/10 px-2 py-1.5 text-left hover:bg-white/20">Reset demo data</button>
      <a href="#" className="rounded-md px-2 py-1.5 hover:bg-white/15">All mockups and earlier rounds</a>
      <nav aria-label="Jump to screen" className="flex flex-wrap gap-0.5">{ALL.filter(x => x[0].startsWith('v3')).map(([k,t])=><a key={k} href={`#${k}`} title={t} aria-current={k===h?'page':undefined} className={`rounded px-1.5 py-1 hover:bg-white/15 ${k===h?'bg-brand':''}`}>{t.split(' · ')[0]}</a>)}</nav>
    </div></details>;
}
export default function App() {
  const h = useHash();
  const ALL = [...V3, ['v3-approvals','Approvals','',ApprovalsList], ...ROUND2, ...CONCEPTS];
  useEffect(() => { window.scrollTo(0, 0); }, [h]);
  const runId = h.startsWith('v3-run-') ? h.slice(7).toUpperCase() : null;
  const C = ALL.find(c=>c[0]===h)?.[3];
  if (!C && !runId) return <Gallery/>;
  return <>{runId ? <V3Run key={runId} id={runId} /> : <C/>}<DemoMenu h={h} ALL={ALL} /></>;
}
