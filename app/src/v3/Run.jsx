// Run overview for any work item: where it is, who holds it, and what happens next.
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Card, CardHead, Pill, Avatar, Stepper, PEOPLE, STAGES } from './ui';
import { useProto } from './store';
import { useToast } from '@/components/friendly';
import { Comments, Activity } from './collab';
import { FileText, ArrowRight, AlertTriangle, CheckCircle2, Loader2, Clock, Rocket } from 'lucide-react';

const DOC = ['Delivery plan', 'Specification', 'Impact assessment', 'Architecture decision', 'Completion report', 'Integration evidence', 'Validation report', 'Release record'];
const DOC_HREF = { 3: '#v3-approve', 4: '#v3-review' };

function StatusCard({ r }) {
  const toast = useToast();
  const { approvePlan, requestPlanChanges, can, undo, me, policy, retryRun, assignEngineer } = useProto();
  const selfPlan = !r.screen && policy.planSoD && r.by === me;
  const holder = PEOPLE[r.holder]?.name || 'the agent';
  if (r.state === 'you') return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-4 border-b border-[#f0d9a8] bg-[var(--v-amber-soft)] px-6 py-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[var(--v-amber)]"><AlertTriangle className="size-5" /></span>
        <div className="min-w-0 flex-1"><h2 className="text-[17px] font-semibold">{r.ask}</h2><p className="mt-0.5 text-[14px] text-[var(--v-ink-2)]">{r.why}</p></div>
        {r.screen ? <Button asChild className="h-10 shrink-0 rounded-lg px-5"><a href={r.screen}>Review<ArrowRight className="size-4" /></a></Button>
          : selfPlan ? <span className="max-w-[220px] shrink-0 text-[13px] text-[var(--v-ink-2)]">You requested this, so another Product Owner must approve the plan.</span>
          : can('gate.plan') ? <div className="flex shrink-0 gap-2"><Button className="h-10 rounded-lg px-5" onClick={() => { const t = approvePlan(r.id); toast('Plan approved. The agent is writing the specification.', () => undo(t)); }}>Approve plan</Button><Button variant="outline" className="h-10 rounded-lg" onClick={() => { const t = requestPlanChanges(r.id); toast('Plan sent back to the agent.', () => undo(t)); }}>Send back</Button></div>
          : <span className="shrink-0 text-[13px] text-[var(--v-ink-3)]">Your role cannot approve plans</span>}
      </div>
      {!r.screen && <div className="grid grid-cols-3 divide-x divide-[var(--v-line)] text-[14px]">
        <div className="px-6 py-5"><h3 className="text-[13px] font-semibold text-[var(--v-ink-3)]">Objective</h3><p className="mt-1 leading-relaxed">{r.t.replace(/…$/, '')}.</p></div>
        <div className="px-6 py-5"><h3 className="text-[13px] font-semibold text-[var(--v-ink-3)]">Stories</h3><ol className="mt-1 list-decimal pl-4 leading-relaxed"><li>Make the change on the {r.app} screens</li><li>Explain the rule to the advisor inline</li></ol></div>
        <div className="px-6 py-5"><h3 className="text-[13px] font-semibold text-[var(--v-ink-3)]">Agent assumptions</h3><ul className="mt-1 list-disc pl-4 leading-relaxed"><li>Only {r.app} is affected</li><li>No API change in this request</li></ul></div>
      </div>}
      {r.id === 'WI-4821' && <div className="grid grid-cols-3 divide-x divide-[var(--v-line)]">
        {[['What changes', 'Product Selection blocks values above 310 and explains why.'], ['What does not', 'The Pricing API and batch import still accept any value.'], ['If you approve', 'The agent builds it with unit tests, about 20 minutes, then Jon reviews.']].map(([h, t]) => <div key={h} className="px-6 py-5"><h3 className="text-[13px] font-semibold text-[var(--v-ink-3)]">{h}</h3><p className="mt-1 text-[14.5px] leading-relaxed">{t}</p></div>)}
      </div>}
    </Card>);
  if (r.state === 'bad' && r.s.includes('f')) return (
    <Card className="overflow-hidden" role="alert">
      <div className="flex items-start gap-4 border-b border-[#f2c4c0] bg-[var(--v-red-soft)] px-6 py-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[var(--v-red)]"><AlertTriangle className="size-5" /></span>
        <div className="min-w-0 flex-1"><h2 className="text-[17px] font-semibold">Validation failed: 2 of 214 tests</h2><p className="mt-0.5 text-[14px] text-[var(--v-ink-2)]">The agent tried 3 times and stopped. The tests still expect the old 20-minute timeout; the spec now says 15.</p></div>
      </div>
      <ul className="divide-y divide-[var(--v-line)] font-mono text-[13px]">{[['session.spec.js › warns at 18 min', 'expected 18, got 13'], ['logout.spec.js › auto logout', 'expected 20, got 15']].map(([a, b]) => <li key={a} className="flex justify-between gap-4 px-6 py-2.5"><span>{a}</span><span className="text-[var(--v-red)]">{b}</span></li>)}</ul>
      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--v-line)] px-6 py-4">
        <span className="mr-auto text-[13px] text-[var(--v-ink-3)]">Agent attempts: 3 of 3 · last run 40 min ago · CI #5521</span>
        {can('runs.pause') || r.by === me ? <Button className="h-9 rounded-lg" onClick={() => { retryRun(r.id); toast('Re-running validation with updated tests.'); }}>Update the tests and re-run</Button> : null}
        {can('squads.manage') && <Button variant="outline" className="h-9 rounded-lg" onClick={() => { const t = assignEngineer(r.id); toast('Lena Brooks is now investigating.', () => undo(t)); }}>Assign an engineer</Button>}
        {!can('runs.pause') && r.by !== me && !can('squads.manage') && <span className="text-[13px] text-[var(--v-ink-2)]">Jon Reyes and the platform admin have been notified.</span>}
      </div>
    </Card>);
  const cfg = {
    work: [Loader2, 'bg-[var(--v-blue-soft)] text-[var(--v-blue)]', 'The agent is working', r.now + '. You will be notified when a person is needed.', null],
    wait: [Clock, 'bg-[var(--v-amber-soft)] text-[var(--v-amber)]', `Waiting for ${holder}`, r.now + '.', ['Send a reminder', () => toast(`Reminder sent to ${holder}.`)]],
    bad: [AlertTriangle, 'bg-[var(--v-red-soft)] text-[var(--v-red)]', 'Needs attention', r.now + '. The run is paused until someone decides what to do.', null],
    done: [CheckCircle2, 'bg-[var(--v-green-soft)] text-[var(--v-green)]', r.now, 'Every stage is complete and the evidence is saved.', null],
  }[r.state];
  const [I, c, h, t, act] = cfg;
  return (
    <Card className="flex items-start gap-4 px-6 py-5">
      <span className={`grid size-10 shrink-0 place-items-center rounded-full ${c}`}><I className={`size-5 ${r.state === 'work' ? 'animate-spin [animation-duration:2.5s]' : ''}`} /></span>
      <div className="min-w-0 flex-1"><h2 className="text-[17px] font-semibold">{h}</h2><p className="mt-0.5 text-[14px] text-[var(--v-ink-2)]">{t}</p>{r.decidedAt && <p className="mt-2 text-[13px] text-[var(--v-green)]">Your decision was recorded {r.decidedAt}.</p>}</div>
      {act && <Button variant="outline" className="h-10 shrink-0 rounded-lg" onClick={act[1]}>{act[0]}</Button>}
    </Card>);
}

export default function V3Run({ id = 'WI-4821' }) {
  const { runs, finishPlan, togglePause, can, approver, me, finishRetry } = useProto();
  const toast = useToast();
  const r = runs[id];
  useEffect(() => { if (r?.retrying) { const t = setTimeout(() => finishRetry(id), 3500); return () => clearTimeout(t); } }, [r?.retrying, id, finishRetry]);
  useEffect(() => { if (r?.fresh && r.s === 'a') { const t = setTimeout(() => finishPlan(id), 4000); return () => clearTimeout(t); } }, [r?.fresh, r?.s, id, finishPlan]);
  if (!r) return (
    <Shell active="run" crumbs={['Runs', id]}><div className="mx-auto max-w-[600px] py-20 text-center"><h1 className="font-display text-[24px] font-semibold">We could not find {id}</h1><p className="mt-2 text-[var(--v-ink-2)]">It may have been reset with the demo data.</p><Button asChild className="mt-5 h-10 rounded-lg"><a href="#v3-runs">Back to all runs</a></Button></div></Shell>);
  const cur = Math.max(r.s.length, 1);
  return (
    <Shell active="run" crumbs={['Runs', r.id]} actions={can('runs.pause') && <Button variant="outline" className="h-9 rounded-lg" onClick={() => { togglePause(r.id); toast(r.paused ? `${r.id} resumed.` : `${r.id} paused. Nothing will move until you resume it.`); }}>{r.paused ? 'Resume run' : 'Pause run'}</Button>}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
        <div className="flex flex-wrap items-start gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2"><span className="font-mono text-[12.5px] text-[var(--v-ink-3)]">{r.id} · {r.app}</span><Pill tone={r.state}>{r.state === 'you' ? 'Waiting for you' : r.state === 'work' ? 'Agent working' : r.state === 'wait' ? 'Waiting for a person' : r.state === 'bad' ? 'Needs attention' : 'Complete'}</Pill></div>
            <h1 className="mt-1 font-display text-[28px] font-semibold">{r.t}</h1>
            <p className="mt-1 text-[15px] text-[var(--v-ink-2)]">Stage {cur} of 8 · {STAGES[cur - 1][0]}</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--v-line)] bg-white px-4 py-3"><Avatar p={r.by} size={34} /><div className="leading-tight"><div className="text-[12.5px] text-[var(--v-ink-3)]">Requested by</div><div className="font-medium">{PEOPLE[r.by].name}</div></div><div className="mx-2 h-8 w-px bg-[var(--v-line)]" /><div className="leading-tight"><div className="text-[12.5px] text-[var(--v-ink-3)]">Expected release</div><div className="font-medium">{r.eta}</div></div></div>
        </div>

        <Card className="px-6 py-6"><Stepper s={r.s} /></Card>

        <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
          <div className="flex flex-col gap-6">
            {r.paused && <Card className="flex items-center gap-3 border-[#f0d9a8] bg-[var(--v-amber-soft)] px-6 py-4 text-[14px]"><Clock className="size-5 text-[var(--v-amber)]" /><span className="flex-1"><b>Paused by you.</b> The agent and approvers cannot move this run until you resume it.</span><Button className="h-9 rounded-lg" onClick={() => togglePause(r.id)}>Resume run</Button></Card>}
            <StatusCard r={r} />
            <Activity id={r.id} />
            <Comments id={r.id} />
            {r.id === 'WI-4821' && <Card><CardHead title="How the design was made" sub="13 min 48 s · 6 of 6 quality checks passed · 4 sources" right={<Button asChild variant="outline" size="sm" className="rounded-lg"><a href="#v3-evidence">Open</a></Button>} /></Card>}
          </div>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHead title="Documents" sub="Created at each stage" />
              <ul className="flex flex-col px-3 pb-3">
                {DOC.slice(0, r.s.replace(/[^dw]/g, '').length).map((t, i) => { const ok = r.s[i] === 'd'; return <li key={t}><a href={DOC_HREF[i] && (r.id === 'WI-4821' || r.id === 'WI-4807') ? DOC_HREF[i] : '#v3-artifacts'} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-[var(--v-sunken)]"><FileText className="size-[18px] shrink-0 text-[var(--v-ink-3)]" /><div className="min-w-0 flex-1"><div className="truncate font-medium">{t}</div><div className="text-[12.5px] text-[var(--v-ink-3)]">{STAGES[i][0]} · {ok ? 'Approved' : 'Waiting for approval'}</div></div>{ok ? <CheckCircle2 className="size-4 text-[var(--v-green)]" /> : <span className="size-2 rounded-full bg-[#e0a000]" />}</a></li>; })}
                {!r.s.replace(/[^dw]/g, '').length && <li className="px-2 py-3 text-[13.5px] text-[var(--v-ink-2)]">The first document appears when the plan is drafted.</li>}
              </ul>
            </Card>
            <Card>
              <CardHead title="People" sub="Who approves each stage of this run" right={can('squads.manage') && <a href={`#v3-squad-${r.id.toLowerCase()}`} className="text-[13px] font-medium text-[var(--v-blue)]">Manage</a>} />
              <ul className="flex flex-col gap-2 px-5 pb-5 text-[13.5px]">{STAGES.map(([st], i) => { const p = approver(r, i); if (!p) return null; const now = r.s[i] === 'w' || (r.s[i] === 'f'); const done = r.s[i] === 'd'; return <li key={st} className={`flex items-center gap-2.5 rounded-lg px-1.5 py-1 ${now ? 'bg-[var(--v-amber-soft)]' : ''}`}><Avatar p={p} size={24} /><span className="flex-1">{PEOPLE[p].name}{p === me && <span className="text-[var(--v-ink-3)]"> (you)</span>}</span><span className={done ? 'text-[var(--v-green)]' : now ? 'font-medium text-[var(--v-amber)]' : 'text-[var(--v-ink-3)]'}>{st}{done ? ' ✓' : now ? ' · now' : ''}</span></li>; })}</ul>
            </Card>
            <Button asChild variant="ghost" className="h-9 justify-start rounded-lg"><a href="#v3-runs"><Rocket className="size-4" />All runs</a></Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
