import { useEffect, useState } from 'react';
import InboxConcept from '@/concepts/Inbox';
import MissionControl from '@/concepts/MissionControl';
import StoryBoard from '@/concepts/StoryBoard';
import Timeline from '@/concepts/Timeline';
import Workbench from '@/concepts/Workbench';
import RoleLenses from '@/concepts/RoleLenses';
import SplitText from '@/components/SplitText';

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
      <p className="mt-2 max-w-3xl text-neutral-600">Six directions built on one visual language: the delivery track, the gate, the platform's plain-English voice, and evidence under every claim. Each uses the same sample run, WI-4821.</p>
      <div className="mt-8 grid grid-cols-3 gap-4">{CONCEPTS.map(([k,t,d])=>(
        <a key={k} href={`#${k}`} className="block border bg-white p-5 hover:border-brand border-border"><b className="block text-base font-semibold">{t}</b><p className="mt-1 text-neutral-600">{d}</p><span className="mt-3 inline-block text-primary">Open mockup →</span></a>))}</div>
    </div>
  );
}
export default function App() {
  const h = useHash();
  const C = CONCEPTS.find(c=>c[0]===h)?.[3];
  if (!C) return <Gallery/>;
  return <><C/><nav aria-label="Concepts" className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 border bg-neutral-900 p-1 text-xs text-white">
    <a href="#" className="px-2.5 py-1.5 hover:bg-neutral-700">All</a>{CONCEPTS.map(([k,t])=><a key={k} href={`#${k}`} className={`px-2.5 py-1.5 hover:bg-neutral-700 ${k===h?'bg-primary':''}`}>{t.split(' · ')[0]}</a>)}</nav></>;
}
