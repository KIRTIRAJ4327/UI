// Business rules: each rule, where it is checked, where it is not, and the runs that changed it.
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Card, CardHead, Pill } from './ui';
import { Check, X, Minus, Search, ArrowRight } from 'lucide-react';

const RULES = [
  { id: 'RA-MAX', t: 'Registered Amortization must be 310 or less', cov: [2, 6], tone: 'wait', owner: 'Priya Nair', places: [['Product Selection form', 'Full Application', 'progress', 'WI-4821 · in design'], ['Shared amortization validator', 'Validation library', 'progress', 'WI-4821 · in design'], ['Pricing API', 'Server', 'no', 'Not covered by any run'], ['Batch application import', 'Server', 'no', 'Not covered by any run'], ['Advisor Portal quote tool', 'Advisor Portal', 'yes', 'WI-4511 · since Mar 2026'], ['Product rules (source of truth)', 'Knowledge Fabric', 'yes', 'Documented in v4']], history: [['11 Nov', 'WI-4821 started: add the check to the Full Application form'], ['Mar 2026', 'WI-4511 released: Advisor Portal quote tool checks the rule'], ['Jan 2026', 'Maximum raised from 300 to 310 (product rules v4)'], ['Aug 2025', 'Rule created']] },
  { id: 'RA-MIN', t: 'Amortization must be at least 5 years', cov: [6, 6], tone: 'done' },
  { id: 'RATE-H', t: 'Rate holds last at most 120 days', cov: [3, 5], tone: 'wait' },
  { id: 'KYC-02', t: 'Two forms of ID before approval', cov: [4, 4], tone: 'done' },
  { id: 'ADDR-1', t: 'Address changes are audited', cov: [1, 4], tone: 'bad' },
  { id: 'FEE-07', t: 'Fees follow fee table v7', cov: [2, 3], tone: 'work' },
];
const IC = { yes: [Check, 'bg-[var(--v-green)] text-white', 'Checked'], no: [X, 'bg-[var(--v-red)] text-white', 'Not checked'], progress: [Minus, 'border-2 border-[#e0a000] text-[var(--v-amber)]', 'In progress'] };

export default function V3Rules() {
  const [sel] = useState(0);
  const r = RULES[sel];
  return (
    <Shell active="rules" crumbs={['Business rules', r.id]}>
      <div className="mx-auto grid max-w-[1240px] grid-cols-[300px_minmax(0,1fr)] items-start gap-6">
        <Card className="overflow-hidden">
          <div className="border-b border-[var(--v-line)] p-3"><label htmlFor="rs" className="flex h-9 items-center gap-2 rounded-lg bg-[var(--v-sunken)] px-3 text-[13.5px]"><Search className="size-4 text-[var(--v-ink-3)]" /><span className="sr-only">Search rules</span><input id="rs" placeholder="Search 48 rules" className="w-full bg-transparent outline-none" /></label></div>
          <ul>{RULES.map((x, i) => <li key={x.id}><a href="#v3-rules" aria-current={i === sel ? 'true' : undefined} className={`flex flex-col gap-1.5 border-b border-[var(--v-line)] px-4 py-3 last:border-0 hover:bg-[var(--v-sunken)] ${i === sel ? 'bg-[var(--v-blue-soft)] shadow-[inset_3px_0_0_var(--v-blue)]' : ''}`}><span className="font-mono text-[12px] text-[var(--v-ink-3)]">{x.id}</span><span className="text-[13.5px] font-medium leading-snug">{x.t}</span><span className="flex items-center gap-2"><span className="h-1.5 flex-1 rounded-full bg-[var(--v-line)]"><span className={`block h-1.5 rounded-full ${x.tone === 'done' ? 'bg-[var(--v-green)]' : x.tone === 'bad' ? 'bg-[var(--v-red)]' : 'bg-[#e0a000]'}`} style={{ width: `${(x.cov[0] / x.cov[1]) * 100}%` }} /></span><span className="tnum text-[12px] text-[var(--v-ink-3)]">{x.cov[0]}/{x.cov[1]}</span></span></a></li>)}</ul>
        </Card>
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start gap-6">
            <div className="min-w-0 flex-1"><div className="font-mono text-[12.5px] text-[var(--v-ink-3)]">{r.id} · owned by {r.owner}</div><h1 className="mt-1 font-display text-[28px] font-semibold">{r.t}</h1>
              <p className="mt-2 max-w-[70ch] text-[15px] text-[var(--v-ink-2)]">Checked in the Advisor Portal today. Run WI-4821 adds it to the Full Application form. <b className="font-medium text-[var(--v-red)]">The Pricing API and batch import still accept larger values.</b></p></div>
            <Card className="px-5 py-4 text-right"><div className="text-[13px] text-[var(--v-ink-3)]">Checked in</div><div className="tnum font-display text-[24px] font-semibold">2 of 6 places</div><div className="text-[12.5px] text-[var(--v-ink-3)]">2 more in progress</div></Card>
          </div>
          <Card className="overflow-hidden">
            <CardHead title="Where the rule is checked" right={<Button asChild size="sm" className="rounded-lg"><a href="#v3-new">Request a fix for the gaps<ArrowRight className="size-4" /></a></Button>} />
            <table className="w-full text-[13.5px]"><caption className="sr-only">Places where the rule applies</caption>
              <thead><tr className="border-y border-[var(--v-line)] bg-[var(--v-sunken)] text-left text-[12.5px] text-[var(--v-ink-3)]"><th className="w-14 py-2.5 pl-5 font-medium"><span className="sr-only">Status</span></th><th className="pr-4 font-medium">Place</th><th className="pr-4 font-medium">System</th><th className="pr-5 font-medium">Status</th></tr></thead>
              <tbody>{r.places.map(([p, s, st, n]) => { const [I, c, l] = IC[st]; return <tr key={p} className="border-b border-[var(--v-line)] last:border-0"><td className="py-3 pl-5"><span title={l} className={`grid size-6 place-items-center rounded-md ${c}`}><I className="size-3.5" strokeWidth={3} /><span className="sr-only">{l}</span></span></td><td className="pr-4 font-medium">{p}</td><td className="pr-4 text-[var(--v-ink-2)]">{s}</td><td className={`pr-5 ${st === 'no' ? 'font-medium text-[var(--v-red)]' : 'text-[var(--v-ink-2)]'}`}>{n}</td></tr>; })}</tbody></table>
          </Card>
          <Card>
            <CardHead title="History" sub="Every change to this rule and where it is checked" />
            <ol className="flex flex-col gap-3 px-5 pb-5">{r.history.map(([d, t], i) => <li key={d} className="grid grid-cols-[80px_12px_1fr] items-start gap-3 text-[13.5px]"><span className="tnum text-[var(--v-ink-3)]">{d}</span><span className={`mt-1.5 size-2.5 rounded-full ${i === 0 ? 'bg-[#e0a000]' : 'bg-[var(--v-green)]'}`} /><span>{t}</span></li>)}</ol>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
