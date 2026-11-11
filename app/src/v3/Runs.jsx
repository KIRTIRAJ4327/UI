// Runs: every work item in one filterable list.
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Card, Pill, Avatar, Stepper, PEOPLE } from './ui';
import { Plus, Search } from 'lucide-react';

const RUNS = [
  { id: 'WI-4836', t: 'Rate hold expiry notice', app: 'Full Application', s: 'dda', now: ['Agent writing the impact assessment', 'work'], holder: 'agent', age: '2 h', eta: 'Mon 17 Nov', mine: true },
  { id: 'WI-4830', t: 'Advisor licence check', app: 'Advisor Portal', s: 'ddd', now: ['Agent preparing the design', 'work'], holder: 'agent', age: '6 h', eta: 'Tue 2 Dec', mine: false },
  { id: 'WI-4821', t: 'Registered Amortization limit', app: 'Full Application', s: 'dddw', now: ['Design waiting for approval', 'you'], holder: 'alex', age: '1 d', eta: 'Thu 13 Nov', mine: true },
  { id: 'WI-4807', t: 'Advisor eligibility banner', app: 'Advisor Portal', s: 'ddddw', now: ['Build waiting for code review', 'you'], holder: 'alex', age: '2 d', eta: 'Fri 14 Nov', mine: true },
  { id: 'WI-4799', t: 'Statement export format', app: 'Client Services', s: 'dw', now: ['Questions waiting for an answer', 'wait'], holder: 'priya', age: '3 d', eta: 'Wed 19 Nov', mine: false },
  { id: 'WI-4790', t: 'Session timeout copy', app: 'Advisor Portal', s: 'ddddddf', now: ['Validation failed: 2 tests', 'bad'], holder: 'jon', age: '4 d', eta: 'At risk', mine: false },
  { id: 'WI-4772', t: 'Fee schedule update', app: 'Full Application', s: 'dddddddw', now: ['Release waiting for sign-off', 'wait'], holder: 'sam', age: '5 d', eta: 'Thu 13 Nov', mine: false },
  { id: 'WI-4751', t: 'Mortgage term picker labels', app: 'Full Application', s: 'dddddddd', now: ['Released', 'done'], holder: 'sam', age: '9 d', eta: 'Released 6 Nov', mine: true },
];
const FILTERS = [['all', 'All'], ['you', 'Waiting for me'], ['work', 'Agent working'], ['bad', 'Blocked'], ['done', 'Released']];

export default function V3Runs() {
  const [f, setF] = useState('all');
  const [app, setApp] = useState('All applications');
  const [q, setQ] = useState('');
  const rows = useMemo(() => RUNS.filter(r => (f === 'all' || r.now[1] === f) && (app === 'All applications' || r.app === app) && (`${r.id} ${r.t}`.toLowerCase().includes(q.toLowerCase()))), [f, app, q]);
  const count = k => k === 'all' ? RUNS.length : RUNS.filter(r => r.now[1] === k).length;
  return (
    <Shell active="run" crumbs={['Runs']} actions={<Button asChild className="h-9 rounded-lg px-4"><a href="#v3-new"><Plus className="size-4" />New request</a></Button>}>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5">
        <div><h1 className="font-display text-[28px] font-semibold">Runs</h1><p className="mt-1 text-[15px] text-[var(--v-ink-2)]">Every request the platform is delivering, newest first.</p></div>
        <div className="flex flex-wrap items-center gap-3">
          <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-1.5">{FILTERS.map(([k, l]) => <button key={k} role="tab" aria-selected={f === k} onClick={() => setF(k)} className={`h-8 rounded-full px-3.5 text-[13.5px] ring-1 ${f === k ? 'bg-[var(--v-ink)] text-white ring-[var(--v-ink)]' : 'bg-white text-[var(--v-ink-2)] ring-[var(--v-line)] hover:ring-[#b9c4bb]'}`}>{l} <span className="tnum opacity-70">{count(k)}</span></button>)}</div>
          <div className="flex-1" />
          <label className="flex h-9 items-center gap-2 rounded-lg border border-[var(--v-line)] bg-white px-3 text-[13.5px]" htmlFor="rq"><Search className="size-4 text-[var(--v-ink-3)]" /><span className="sr-only">Search runs</span><input id="rq" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or ID" className="w-52 bg-transparent outline-none" /></label>
          <label htmlFor="rapp" className="sr-only">Application</label>
          <select id="rapp" value={app} onChange={e => setApp(e.target.value)} className="h-9 rounded-lg border border-[var(--v-line)] bg-white px-3 text-[13.5px]"><option>All applications</option><option>Full Application</option><option>Advisor Portal</option><option>Client Services</option></select>
        </div>
        <Card className="overflow-hidden">
          <table className="w-full text-[13.5px]">
            <caption className="sr-only">Runs</caption>
            <thead><tr className="border-b border-[var(--v-line)] bg-[var(--v-sunken)] text-left text-[12.5px] text-[var(--v-ink-3)]"><th className="py-2.5 pl-5 font-medium">Request</th><th className="w-44 pr-6 font-medium">Progress</th><th className="pr-4 font-medium">Now</th><th className="pr-4 font-medium">Held by</th><th className="pr-4 font-medium">Age</th><th className="pr-5 font-medium">Expected release</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-[var(--v-line)] last:border-0 hover:bg-[var(--v-sunken)]">
                  <td className="py-3.5 pl-5"><a href={r.id === 'WI-4807' ? '#v3-review' : r.id === 'WI-4772' ? '#v3-release' : '#v3-run'} className="font-medium hover:text-[var(--v-blue)]">{r.t}</a><div className="font-mono text-[12px] text-[var(--v-ink-3)]">{r.id} · {r.app}{r.mine && ' · requested by you'}</div></td>
                  <td className="pr-6"><Stepper s={r.s} compact /></td>
                  <td className="pr-4"><Pill tone={r.now[1]}>{r.now[0]}</Pill></td>
                  <td className="pr-4"><span className="flex items-center gap-2"><Avatar p={r.holder} size={24} />{r.holder === 'agent' ? 'Agent' : PEOPLE[r.holder].name.split(' ')[0]}</span></td>
                  <td className="tnum pr-4 text-[var(--v-ink-2)]">{r.age}</td>
                  <td className={`pr-5 ${r.eta === 'At risk' ? 'font-medium text-[var(--v-red)]' : ''}`}>{r.eta}</td>
                </tr>))}
              {!rows.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-[var(--v-ink-2)]">No runs match these filters. <button onClick={() => { setF('all'); setApp('All applications'); setQ(''); }} className="font-medium text-[var(--v-blue)] underline">Clear filters</button></td></tr>}
            </tbody>
          </table>
        </Card>
      </div>
    </Shell>
  );
}
