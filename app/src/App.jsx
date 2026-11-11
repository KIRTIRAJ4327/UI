import { useEffect, useState } from 'react';
import InboxConcept from '@/concepts/Inbox';
import MissionControl from '@/concepts/MissionControl';
import StoryBoard from '@/concepts/StoryBoard';
import Timeline from '@/concepts/Timeline';
import Workbench from '@/concepts/Workbench';
import RoleLenses from '@/concepts/RoleLenses';
import SplitText from '@/components/SplitText';

export const CONCEPTS = [
  ['inbox','A · Inbox-first','Approver to-do list with a decision reader and keyboard shortcuts.',InboxConcept],
  ['mission','B · Mission control','KPIs and every run in one table with an 8-stage progress bar.',MissionControl],
  ['board','C · Story board','Stories across the 8 stages, with gates shown as column markers.',StoryBoard],
  ['timeline','D · Live timeline','The run as a plain-English event log with the decision inline.',Timeline],
  ['workbench','E · Document workbench','Focus view: stages, full document, and an approval rail.',Workbench],
  ['roles','F · Role lenses','Requester, Approver, Engineer and Auditor views of one product.',RoleLenses],
];
const useHash = () => { const [h,setH] = useState(location.hash.slice(1)); useEffect(()=>{ const f=()=>setH(location.hash.slice(1)); addEventListener('hashchange',f); return ()=>removeEventListener('hashchange',f); },[]); return h; };

function Gallery() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <div className="text-xs text-neutral-500">Unified Product Delivery Platform</div>
      <SplitText text="Redesign proposals for review" tag="h1" splitType="words" effect="fade" delay={60} duration={0.6} textAlign="left" trigger="load" className="text-3xl font-light" />
      <p className="mt-2 max-w-3xl text-neutral-600">Six structural directions built on one shared component set (shadcn/ui, Radix). Each uses the same sample run, WI-4821, so the client compares layouts, not content.</p>
      <div className="mt-8 grid grid-cols-3 gap-4">{CONCEPTS.map(([k,t,d])=>(
        <a key={k} href={`#${k}`} className="block border bg-white p-5 hover:border-primary"><b className="block text-base font-semibold">{t}</b><p className="mt-1 text-neutral-600">{d}</p><span className="mt-3 inline-block text-primary">Open mockup →</span></a>))}</div>
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
