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
      <h2 className="mt-8 font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">Round 2 · new interaction models (see RESEARCH.md)</h2>
      <div className="mt-2 grid grid-cols-3 gap-4">{ROUND2.map(([k,t,d])=>(
        <a key={k} href={`#${k}`} className="block border border-border bg-white p-5 hover:border-brand"><b className="block text-base font-semibold">{t}</b><p className="mt-1 text-neutral-600">{d}</p><span className="mt-3 inline-block text-primary">Open mockup →</span></a>))}</div>
      <h2 className="mt-10 font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">Round 1 · earlier directions</h2>
      <div className="mt-2 grid grid-cols-6 gap-2">{CONCEPTS.map(([k,t])=>(
        <a key={k} href={`#${k}`} className="block border border-border bg-white p-3 text-[12.5px] hover:border-brand">{t}</a>))}</div>
    </div>
  );
}
export default function App() {
  const h = useHash();
  const ALL = [...ROUND2, ...CONCEPTS];
  const C = ALL.find(c=>c[0]===h)?.[3];
  if (!C) return <Gallery/>;
  return <><C/><details className="fixed right-4 bottom-4 z-40 border border-ink bg-ink text-xs text-white">
    <summary className="cursor-pointer px-3 py-1.5 font-semibold">Mockups</summary>
    <nav aria-label="Switch mockup" className="flex flex-wrap gap-0.5 p-1 pt-0"><a href="#" className="px-2 py-1 hover:bg-white/15">All</a>{ALL.map(([k,t])=><a key={k} href={`#${k}`} title={t} aria-current={k===h?'page':undefined} className={`px-2 py-1 hover:bg-white/15 ${k===h?'bg-brand':''}`}>{t.split(' · ')[0]}</a>)}</nav></details></>;
}
