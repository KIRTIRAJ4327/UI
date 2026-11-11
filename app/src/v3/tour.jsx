// Guided demo for clients exploring the prototype on their own.
// Steps tick themselves off from the prototype state, so the tour never gets out of sync with what was clicked.
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useProto } from './store';
import { Check, ChevronRight, X, Sparkles, PlayCircle, Compass } from 'lucide-react';

export function useSteps() {
  const { raw, order, audit, attention, me } = useProto();
  const newId = order.find(id => raw[id]?.fresh);
  return [
    { t: 'Approve a design', who: 'alex', href: 'v3-approve', hint: 'Read the plain summary, accept the risk, approve.', done: raw['WI-4821'].state !== 'wait' },
    { t: 'Answer the agent’s questions', who: 'alex', href: 'v3-clarify', hint: 'Pick an option for each question and send.', done: raw['WI-4799'].state !== 'wait' },
    { t: 'Review the code as a backup', who: 'alex', href: 'v3-review', hint: 'Open a changed file, then approve the build.', done: raw['WI-4807'].state !== 'wait' },
    { t: 'Start a new request', who: 'alex', href: 'v3-new', hint: 'Draft the plan and watch the agent work.', done: !!newId },
    { t: 'Approve the plan as Priya', who: 'priya', href: newId ? `v3-run-${newId.toLowerCase()}` : 'v3-home', hint: 'Product Owners approve plans.', done: !!newId && raw[newId].s.length > 1 },
    { t: 'Release as Sam', who: 'sam', href: 'v3-release', hint: 'Choose a window and schedule the release.', done: raw['WI-4772'].state === 'done' },
    { t: 'Fix a squad as the super admin', who: 'dana', href: 'v3-squads', hint: 'Fix the squad with nobody in Integration Lead.', done: !attention.includes('squad') },
    { t: 'Change a permission, then read the audit log', who: 'dana', href: 'v3-roles', hint: 'Untick any box, then open Audit log.', done: audit.some(e => e.cat === 'rbac' && e.t === 'just now') },
  ].map(s => ({ ...s, current: s.who === me }));
}

export function TourBar() {
  const { tour, setTour, setMe, me } = useProto();
  const steps = useSteps();
  if (!tour) return null;
  const doneN = steps.filter(s => s.done).length;
  const next = steps.find(s => !s.done);
  const go = s => { if (s.who !== me) setMe(s.who); location.hash = s.href; };
  return (
    <div role="region" aria-label="Guided tour" className="sticky top-16 z-10 border-b border-[#c9d8f0] bg-[var(--v-blue-soft)] px-8 py-2.5">
      <div className="flex items-center gap-4">
        <Compass className="size-5 shrink-0 text-[var(--v-blue)]" />
        <div className="flex shrink-0 items-center gap-1" aria-label={`${doneN} of ${steps.length} steps done`}>{steps.map((s, i) => <button key={i} title={s.t} aria-label={`Step ${i + 1}: ${s.t}${s.done ? ', done' : ''}`} onClick={() => go(s)} className={`grid size-6 place-items-center rounded-full text-[11px] font-semibold ${s.done ? 'bg-[var(--v-green)] text-white' : s === next ? 'bg-[var(--v-blue)] text-white ring-4 ring-[var(--v-blue)]/20' : 'bg-white text-[var(--v-ink-3)] ring-1 ring-[#c9d8f0]'}`}>{s.done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}</button>)}</div>
        <div className="min-w-0 flex-1 text-[14px]">
          {next ? <><b className="font-semibold">Step {steps.indexOf(next) + 1}: {next.t}.</b> <span className="text-[var(--v-ink-2)]">{next.hint}{next.who !== me && ' We will switch you to the right person.'}</span></>
            : <b className="font-semibold text-[var(--v-green)]">Tour complete. You have seen every part of the platform. Use Reset demo data to start again.</b>}
        </div>
        {next && <Button size="sm" className="h-8 shrink-0 rounded-lg" onClick={() => go(next)}>Go<ChevronRight className="size-4" /></Button>}
        <button aria-label="Close the guided tour" onClick={() => setTour(false)} className="shrink-0 rounded-md p-1 text-[var(--v-ink-2)] hover:bg-white"><X className="size-4" /></button>
      </div>
    </div>
  );
}

export function Welcome() {
  const { welcomed, setWelcomed, setTour } = useProto();
  const primary = useRef(null);
  useEffect(() => { if (!welcomed) primary.current?.focus(); }, [welcomed]);
  if (welcomed) return null;
  const close = tour => { setWelcomed(); setTour(tour); };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#101429]/45 p-6 backdrop-blur-[2px]">
      <div role="dialog" aria-modal="true" aria-labelledby="wt" onKeyDown={e => e.key === 'Escape' && close(false)} className="w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-[var(--v-ink)] px-7 py-6 text-white">
          <div className="flex items-center gap-2 text-[13px] text-[#c8cde0]"><Sparkles className="size-4" />Clickable prototype</div>
          <h2 id="wt" className="mt-1 font-display text-[24px] font-semibold">Unified Product Delivery Platform</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[#dfe3ef]">A business person describes a change, an AI agent delivers it stage by stage, and the right people approve each step. Everything here works, with sample data. Nothing is sent anywhere.</p>
        </div>
        <ul className="flex flex-col gap-3 px-7 py-5 text-[14px]">
          {[['Decide', 'Approve designs, answer the agent, review code and release.'], ['Switch person', 'Use View as at the bottom of the menu to see what each role can do.'], ['Govern', 'As the super admin, fix squads, change permissions and read the audit log.']].map(([a, b]) => <li key={a} className="flex gap-3"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--v-blue-soft)] text-[var(--v-blue)]"><Check className="size-3" strokeWidth={3} /></span><span><b className="font-semibold">{a}.</b> {b}</span></li>)}
        </ul>
        <div className="flex items-center gap-3 border-t border-[var(--v-line)] bg-[var(--v-sunken)] px-7 py-4">
          <Button ref={primary} className="h-10 rounded-lg px-5" onClick={() => close(true)}><PlayCircle className="size-4" />Take the 8-step tour</Button>
          <Button variant="ghost" className="h-10 rounded-lg" onClick={() => close(false)}>Explore on my own</Button>
          <span className="ml-auto text-[12.5px] text-[var(--v-ink-3)]">About 5 minutes</span>
        </div>
      </div>
    </div>
  );
}
