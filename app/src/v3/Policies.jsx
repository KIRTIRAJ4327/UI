// Admin · Policies: the rules the platform enforces on every run.
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Card, CardHead, Pill } from './ui';
import { useToast } from '@/components/friendly';
import { useProto } from './store';
import { Plus, Trash2 } from 'lucide-react';

const Toggle = ({ on, onChange, label }) => <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? 'bg-[var(--v-blue)]' : 'bg-[#c3ccc5]'}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} /></button>;
const Row = ({ title, sub, children }) => <div className="flex items-center gap-4 border-t border-[var(--v-line)] px-5 py-3.5 first:border-0"><div className="min-w-0 flex-1"><div className="text-[14px] font-medium">{title}</div>{sub && <div className="text-[12.5px] text-[var(--v-ink-3)]">{sub}</div>}</div>{children}</div>;
const NumIn = ({ id, value, onChange, unit, label }) => <label htmlFor={id} className="flex items-center gap-2 text-[13.5px]"><span className="sr-only">{label}</span><input id={id} type="number" min="1" value={value} onChange={e => onChange(+e.target.value)} className="tnum h-9 w-20 rounded-lg border border-[var(--v-line)] px-2.5 text-right outline-none focus:border-[var(--v-blue)] focus:ring-4 focus:ring-[var(--v-blue)]/15" />{unit}</label>;

const START = { targets: { 'Product Owner': 4, 'Solution Architect': 4, 'Engineering Lead': 2, 'Integration Lead': 4, 'Quality Lead': 4, 'Release Manager': 8 }, escalate: 8, sod: { design: true, release: true, review: true }, auto: { impact: true, retry: true, docs: false }, budget: 500, alert: 80 };

export default function V3Policies() {
  const toast = useToast();
  const proto = useProto();
  const [p, setP] = useState(START);
  const [freezes, setFreezes] = useState([['Month-end close', '1–3 Dec 2026', 'All applications'], ['Year-end', '22 Dec – 2 Jan', 'All applications'], ['Pricing review', '15 Jan 2027', 'Full Application']]);
  const changed = JSON.stringify(p) !== JSON.stringify(START);
  const up = (k, v) => setP(x => ({ ...x, [k]: v }));
  return (
    <Shell admin active="policies" crumbs={['Admin', 'Policies']}>
      <div className="mx-auto flex max-w-[980px] flex-col gap-6 pb-20">
        <div><h1 className="font-display text-[28px] font-semibold">Policies</h1><p className="mt-1 text-[15px] text-[var(--v-ink-2)]">Rules every run follows. Changes apply to new gates from the moment you save; approvals already given are not affected.</p></div>

        <Card><CardHead title="Approval targets" sub="How long each role has to decide before the item counts as late" />
          <div className="border-t border-[var(--v-line)]">{Object.entries(p.targets).map(([r, h], i) => <Row key={r} title={r}><NumIn id={`t${i}`} label={`${r} target in hours`} value={h} unit="hours" onChange={v => up('targets', { ...p.targets, [r]: v })} /></Row>)}
            <Row title="Escalate to the platform admin after" sub="Dana Whitfield is notified and can reassign"><NumIn id="esc" label="Escalation in hours" value={p.escalate} unit="hours" onChange={v => up('escalate', v)} /></Row></div></Card>

        <Card><CardHead title="Separation of duties" sub="Who may not approve their own work" />
          <div className="border-t border-[var(--v-line)]"><Row title="The requester cannot approve their own plan" sub="Applies straight away to every run"><Toggle label="The requester cannot approve their own plan" on={proto.policy.planSoD} onChange={v => { proto.setPolicy('planSoD', v); toast(v ? 'Requesters can no longer approve their own plans.' : 'Requesters can now approve their own plans.'); }} /></Row>{[['design', 'The requester cannot approve the Design'], ['release', 'The requester cannot approve the Release'], ['review', 'A person cannot review code they asked the agent to change']].map(([k, t]) => <Row key={k} title={t}><Toggle label={t} on={p.sod[k]} onChange={v => up('sod', { ...p.sod, [k]: v })} /></Row>)}</div></Card>

        <Card><CardHead title="Change freezes" sub="No releases are scheduled inside these windows without an exception" right={<Button size="sm" variant="outline" className="rounded-lg" onClick={() => setFreezes(f => [...f, ['New freeze', 'Choose dates', 'All applications']])}><Plus className="size-4" />Add freeze</Button>} />
          <table className="w-full border-t border-[var(--v-line)] text-[13.5px]"><caption className="sr-only">Change freezes</caption><tbody>{freezes.map(([n, d, a], i) => <tr key={i} className="border-b border-[var(--v-line)] last:border-0"><td className="py-3 pl-5 font-medium">{n}</td><td className="tnum pr-4">{d}</td><td className="pr-4 text-[var(--v-ink-2)]">{a}</td><td className="pr-5 text-right"><button aria-label={`Remove ${n}`} onClick={() => setFreezes(f => f.filter((_, j) => j !== i))} className="rounded-md p-1.5 text-[var(--v-ink-3)] hover:bg-[var(--v-red-soft)] hover:text-[var(--v-red)]"><Trash2 className="size-4" /></button></td></tr>)}</tbody></table></Card>

        <Card><CardHead title="What the agent may do on its own" sub="Defaults for new runs. A squad can be stricter, never looser." />
          <div className="border-t border-[var(--v-line)]">{[['impact', 'Move past Impact when all checks pass', 'Impact has no human gate'], ['retry', 'Retry failed tests up to 3 times', 'Then it stops and asks for an engineer'], ['docs', 'Publish stakeholder summaries without review', 'Off: a person reads them first']].map(([k, t, s]) => <Row key={k} title={t} sub={s}><Toggle label={t} on={p.auto[k]} onChange={v => up('auto', { ...p.auto, [k]: v })} /></Row>)}</div></Card>

        <Card><CardHead title="Agent spend" sub="This month: $186 of $500" right={<Pill tone="done">37% used</Pill>} />
          <div className="border-t border-[var(--v-line)]"><Row title="Monthly budget"><NumIn id="bud" label="Monthly budget in dollars" value={p.budget} unit="USD" onChange={v => up('budget', v)} /></Row><Row title="Warn the platform admin at"><NumIn id="al" label="Warning threshold percent" value={p.alert} unit="% of budget" onChange={v => up('alert', v)} /></Row></div></Card>
      </div>
      {changed && <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center pl-[248px]"><div className="flex items-center gap-4 rounded-2xl bg-[var(--v-ink)] px-5 py-3 text-white shadow-xl"><span className="text-[14px]">You have unsaved policy changes</span><Button variant="ghost" className="h-9 rounded-lg text-white hover:bg-white/10 hover:text-white" onClick={() => setP(START)}>Discard</Button><Button className="h-9 rounded-lg" onClick={() => toast('Policies saved. They apply to new gates from now.')}>Save policies</Button></div></div>}
    </Shell>
  );
}
