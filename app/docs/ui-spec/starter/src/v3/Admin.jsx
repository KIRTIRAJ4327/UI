// Super admin · Governance: everything running, what needs attention, where work waits, who is overloaded.
import { Button } from '@/components/ui/button';
import { Shell, Card, CardHead, Pill, Avatar, Stepper, PEOPLE } from './ui';
import { useToast } from '@/components/friendly';
import { saveFile } from './docs';
import { useProto, runHref } from './store';
import { AlertTriangle, Clock, UserX, ShieldAlert, FlaskConical, Download, ArrowRight } from 'lucide-react';

const KPIS = [
  ['In progress', 14, 0, '', '', 'mute'],
  ['Waiting on a person', 5, 0, '', '', 'wait'],
  ['Over approval target', 2, 0, '', '', 'bad'],
  ['Agent spend this week', 48.2, 2, '$', '', 'mute'],
];

const ATTENTION = [
  { icon: UserX, tone: 'bad', id: 'WI-4807', key: 'leave', title: 'Approver is on leave', text: 'Jon Reyes holds the completion review and is away until Friday. It has waited 3 h against a 2 h target.', action: 'Reassign to Lena Brooks', done: 'WI-4807 reassigned to Lena Brooks. Jon has been notified.' },
  { icon: FlaskConical, tone: 'bad', id: 'WI-4790', key: 'agent', title: 'Agent stopped after 3 attempts', text: 'Two regression tests still fail. The agent needs an engineer to decide whether the tests or the code are wrong.', action: 'Assign an engineer', done: 'Engineer assignment opened for WI-4790.' },
  { icon: ShieldAlert, tone: 'wait', id: 'WI-4830', key: 'freeze', title: 'Release falls in the month-end freeze', text: 'Planned release on 2 Dec is inside the 1–3 Dec freeze. Approve an exception or move the date.', action: 'Review exception', done: 'Freeze exception approved for WI-4830. The release stays on Tue 2 Dec and the exception is in the audit log.' },
  { icon: AlertTriangle, tone: 'wait', id: 'WI-4836', key: 'squad', title: 'Squad is incomplete', text: 'No Integration Lead is assigned. The run will stop at Integrate without one.', action: 'Complete squad', href: '#v3-squad-wi-4836' },
];



const WAIT = [['Product Owner', 9.5], ['Engineering Lead', 6.8], ['Solution Architect', 4.2], ['Release Manager', 3.0], ['Quality Lead', 2.4], ['Integration Lead', 1.1]];
const LOAD = [['alex', 3, ''], ['priya', 4, ''], ['jon', 2, 'On leave until Fri'], ['lena', 1, ''], ['ravi', 1, ''], ['mara', 2, '']];

export default function V3Admin() {
  const toast = useToast();
  const { list, attention, resolve, undo, audit } = useProto();
  const open = ATTENTION.filter(a => attention.includes(a.key));
  const { kpi: K } = useProto();
  const kpi = [K.inProgress, list.filter(r => r.state === 'you' || r.state === 'wait').length, (attention.includes('leave') ? 1 : 0) + list.filter(r => r.state === 'bad').length, 48.2];
  const ITEMS = list.map(r => ({ id: r.id, t: r.t, app: r.app, s: r.s, holder: r.holder, wait: r.wait || '—', squad: r.squadGap ? '5/6' : '6/6', health: r.state === 'bad' ? ['Blocked', 'bad'] : r.squadGap ? ['Squad gap', 'wait'] : r.freeze ? ['Freeze risk', 'wait'] : r.state === 'done' ? ['Done', 'done'] : ['On track', 'done'] }));
  return (
    <Shell admin active="admin" crumbs={['Admin', 'Governance']} actions={<Button variant="outline" className="h-9 rounded-lg" onClick={() => saveFile('audit-pack-2026-w46.json', JSON.stringify({ period: '2026-11-10/2026-11-16', generated: new Date().toISOString(), runs: list.map(r => ({ id: r.id, title: r.t, app: r.app, stages: r.s, state: r.state, holder: r.holder })), audit }, null, 2), toast)}><Download className="size-4" />Export audit pack</Button>}>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-0 flex-1"><p className="text-[14px] text-[var(--v-ink-3)]">All workspaces · this week</p><h1 className="font-display text-[28px] font-semibold">Governance</h1></div>
          <span className="rounded-lg bg-[var(--v-surface)] px-3 py-1.5 text-[13px] text-[var(--v-ink-2)] ring-1 ring-[var(--v-line)]">Mon 10 – Sun 16 Nov</span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {KPIS.map(([l, v0, d, pre, suf, tone], ki) => { const v = kpi[ki]; return (
            <Card key={l} className="px-5 py-4"><div className="flex items-center justify-between text-[13px] text-[var(--v-ink-3)]">{l}{tone !== 'mute' && <span className={`size-2 rounded-full ${tone === 'bad' ? 'bg-[var(--v-red)]' : 'bg-[#e0a000]'}`} />}</div>
              <div className={`tnum mt-0.5 font-display text-[26px] font-semibold ${tone === 'bad' ? 'text-[var(--v-red)]' : ''}`}>{pre}{d ? v.toFixed(d) : v}{suf}</div></Card>); })}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHead title="Needs your attention" sub="Problems the platform cannot resolve on its own" right={open.length ? <Pill tone="bad">{open.length} open</Pill> : <Pill tone="done">All clear</Pill>} />
              <ul className="divide-y divide-[var(--v-line)] border-t border-[var(--v-line)]">
                {open.length === 0 && <li className="px-5 py-8 text-center text-[14px] text-[var(--v-ink-2)]">Nothing needs you right now. New problems appear here as soon as the platform finds them.</li>}
                {open.map(a => (
                  <li key={a.id} className="flex items-start gap-4 px-5 py-4">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full ${a.tone === 'bad' ? 'bg-[var(--v-red-soft)] text-[var(--v-red)]' : 'bg-[var(--v-amber-soft)] text-[var(--v-amber)]'}`}><a.icon className="size-[18px]" /></span>
                    <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><b className="font-semibold">{a.title}</b><span className="font-mono text-[12px] text-[var(--v-ink-3)]">{a.id}</span></div><p className="mt-0.5 max-w-[70ch] text-[13.5px] text-[var(--v-ink-2)]">{a.text}</p></div>
                    {a.href ? <Button asChild variant="outline" className="h-9 shrink-0 rounded-lg"><a href={a.href}>{a.action}<ArrowRight className="size-4" /></a></Button> : <Button variant="outline" className="h-9 shrink-0 rounded-lg" onClick={() => { const t = resolve(a.key); toast(a.done, () => undo(t)); }}>{a.action}</Button>}
                  </li>))}
              </ul>
            </Card>

            <Card className="overflow-hidden">
              <CardHead title="All work items" sub="Who holds each one and whether its squad is complete" />
              <div className="overflow-x-auto">
                <table className="w-full text-[13.5px]">
                  <thead><tr className="border-y border-[var(--v-line)] bg-[var(--v-sunken)] text-left text-[12.5px] text-[var(--v-ink-3)]"><th className="py-2 pl-5 font-medium">Work item</th><th className="w-40 pr-4 font-medium">Progress</th><th className="pr-4 font-medium">Held by</th><th className="pr-4 font-medium">Waiting</th><th className="pr-4 font-medium">Squad</th><th className="pr-4 font-medium">Health</th><th className="pr-5"><span className="sr-only">Actions</span></th></tr></thead>
                  <tbody>{ITEMS.map(r => (
                    <tr key={r.id} className="border-b border-[var(--v-line)] last:border-0 hover:bg-[var(--v-sunken)]">
                      <td className="py-3 pl-5"><a href={runHref(r.id)} className="font-medium hover:text-[var(--v-blue)]">{r.t}</a><div className="font-mono text-[12px] text-[var(--v-ink-3)]">{r.id} · {r.app}</div></td>
                      <td className="pr-4"><Stepper s={r.s} compact label /></td>
                      <td className="pr-4"><span className="flex items-center gap-2"><Avatar p={r.holder} size={24} />{r.holder === 'agent' ? 'Agent' : PEOPLE[r.holder].name.split(' ')[0]}</span></td>
                      <td className="tnum pr-4">{r.wait}</td>
                      <td className={`tnum pr-4 ${r.squad !== '6/6' ? 'font-semibold text-[var(--v-amber)]' : ''}`}>{r.squad}</td>
                      <td className="pr-4"><Pill tone={r.health[1]}>{r.health[0]}</Pill></td>
                      <td className="pr-5 text-right"><a href={`#v3-squad-${r.id.toLowerCase()}`} className="whitespace-nowrap text-[13px] font-medium text-[var(--v-blue)] hover:underline">Manage squad</a></td>
                    </tr>))}</tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHead title="Where work waits" sub="Average hours per approval role" />
              <ul className="flex flex-col gap-2.5 px-5 pb-5">{WAIT.map(([r, h]) => <li key={r} className="grid grid-cols-[120px_1fr_34px] items-center gap-3 text-[13px]"><span className="truncate">{r}</span><span className="h-2 rounded-full bg-[var(--v-sunken)]"><span className={`block h-2 rounded-full ${h > 6 ? 'bg-[var(--v-red)]' : 'bg-[#e0a000]'}`} style={{ width: `${h * 10}%` }} /></span><span className="tnum text-right">{h}</span></li>)}</ul>
            </Card>
            <Card>
              <CardHead title="People load" sub="Open approvals per person" />
              <ul className="flex flex-col gap-3 px-5 pb-5">{LOAD.map(([p, n, note]) => <li key={p} className="flex items-center gap-3"><Avatar p={p} size={28} /><div className="min-w-0 flex-1"><div className="flex justify-between text-[13.5px]"><span className="truncate font-medium">{PEOPLE[p].name}</span><span className="tnum text-[var(--v-ink-3)]">{n}</span></div>{note ? <div className="text-[12.5px] text-[var(--v-red)]">{note}</div> : <div className="mt-1 h-1.5 rounded-full bg-[var(--v-sunken)]"><div className={`h-1.5 rounded-full ${n >= 4 ? 'bg-[#e0a000]' : 'bg-[var(--v-green)]'}`} style={{ width: `${n * 20}%` }} /></div>}</div></li>)}</ul>
            </Card>
            <Card className="px-5 py-4"><div className="flex items-center gap-2 text-[13.5px]"><Clock className="size-4 text-[var(--v-ink-3)]" />Escalations go to <b className="font-medium">Dana Whitfield</b> after 8 h</div></Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
