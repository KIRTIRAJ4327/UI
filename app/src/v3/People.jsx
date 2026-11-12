// Admin · People and access: who can approve what, in which application, and who is away.
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Shell, Card, CardHead, Pill, Avatar, PEOPLE } from './ui';
import { Search, AlertTriangle } from 'lucide-react';
// Role pairs one person should not hold together on the same work item.
const CONFLICTS = [['Product Owner', 'Quality Lead'], ['Engineering Lead', 'Quality Lead'], ['Solution Architect', 'Release Manager']];
const conflictOf = roles => CONFLICTS.find(([a, b]) => roles.includes(a) && roles.includes(b));
import { useToast } from '@/components/friendly';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useProto } from './store';
import { FormDialog, Field, inputCls } from './forms';

const APPS = ['Full Application', 'Advisor Portal', 'Client Services'];
const DIR = [
  ['priya', ['Product Owner'], [1, 0, 1], 4, 'Available', 'Today'],
  ['alex', ['Solution Architect'], [1, 1, 0], 3, 'Available', 'Now'],
  ['ravi', ['Solution Architect'], [1, 1, 1], 1, 'Available', 'Today'],
  ['jon', ['Engineering Lead'], [1, 1, 0], 2, 'On leave until Fri 14 Nov', '3 days ago'],
  ['lena', ['Engineering Lead', 'Integration Lead'], [1, 1, 1], 1, 'Available', 'Today'],
  ['tom', ['Integration Lead'], [1, 0, 1], 0, 'Available', 'Yesterday'],
  ['mara', ['Quality Lead', 'Product Owner'], [1, 1, 1], 2, 'Available', 'Today'],
  ['ana', ['Quality Lead'], [0, 1, 1], 1, 'Available', 'Today'],
  ['sam', ['Release Manager'], [1, 1, 1], 2, 'Available', 'Now'],
];
const COVER = [['Product Owner', [2, 1, 2]], ['Solution Architect', [2, 2, 1]], ['Engineering Lead', [2, 2, 1]], ['Integration Lead', [2, 1, 2]], ['Quality Lead', [1, 2, 2]], ['Release Manager', [1, 1, 1]]];

export default function V3People() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const { invite, setCover, invites = [], covers = [], undo } = useProto();
  const [form, setForm] = useState(null);
  const [inv, setInv] = useState({ email: '', role: 'Product Owner', apps: ['Full Application'] });
  const [cv, setCv] = useState({ who: 'jon', by: 'lena', until: '2026-11-21' });
  const emailOk = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(inv.email);
  const fmt = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  return (
    <Shell admin active="people" crumbs={['Admin', 'People and access']} actions={<Button className="h-9 rounded-lg px-4" onClick={() => setForm('invite')}><UserPlus className="size-4" />Invite person</Button>}>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6">
        <div className="flex flex-wrap items-end gap-4"><div className="min-w-0 flex-1"><h1 className="font-display text-[28px] font-semibold">People and access</h1><p className="mt-1 text-[15px] text-[var(--v-ink-2)]">Who can approve which stages, in which applications. People and groups are synced from your identity provider every hour.</p></div><Pill tone="done">SSO and SCIM: Microsoft Entra ID · synced 14 min ago</Pill></div>
        <label htmlFor="pq" className="flex h-9 w-72 items-center gap-2 rounded-lg border border-[var(--v-line)] bg-[var(--v-surface)] px-3 text-[13.5px]"><Search className="size-4 text-[var(--v-ink-3)]" /><span className="sr-only">Search people</span><input id="pq" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or role" className="w-full bg-transparent outline-none" /></label>
        <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
          <Card className="overflow-hidden">
            <table className="w-full text-[13.5px]"><caption className="sr-only">People</caption>
              <thead><tr className="border-b border-[var(--v-line)] bg-[var(--v-sunken)] text-left text-[12.5px] text-[var(--v-ink-3)]"><th className="py-2.5 pl-5 font-medium">Person</th><th className="pr-4 font-medium">Can approve as</th><th className="pr-4 font-medium">Applications</th><th className="pr-4 font-medium">Open</th><th className="pr-5 font-medium">Availability</th></tr></thead>
              <tbody>{DIR.filter(([p, roles]) => `${PEOPLE[p].name} ${roles.join(' ')}`.toLowerCase().includes(q.toLowerCase())).map(([p, roles, apps, open, avail, seen]) => (
                <tr key={p} className="border-b border-[var(--v-line)] align-top last:border-0">
                  <td className="py-3 pl-5"><span className="flex items-center gap-3"><Avatar p={p} size={30} /><span><b className="block font-medium">{PEOPLE[p].name}</b><span className="text-[12.5px] text-[var(--v-ink-3)]">Active {seen.toLowerCase()}</span></span></span></td>
                  <td className="py-3 pr-4"><div className="flex flex-wrap gap-1">{roles.map(r => <span key={r} className="rounded-md bg-[var(--v-sunken)] px-2 py-0.5 text-[12.5px] ring-1 ring-[var(--v-line)]">{r}</span>)}</div>{conflictOf(roles) && <p className="mt-1.5 flex items-center gap-1 text-[12px] text-[var(--v-amber)]"><AlertTriangle className="size-3.5" />{conflictOf(roles).join(" and ")} on one work item is blocked by policy</p>}</td>
                  <td className="py-3 pr-4"><div className="flex gap-1">{APPS.map((a, i) => <span key={a} title={`${a}: ${apps[i] ? 'has access' : 'no access'}`} className={`grid size-6 place-items-center rounded-md text-[11px] font-semibold ${apps[i] ? 'bg-[var(--v-blue-soft)] text-[var(--v-blue)]' : 'bg-[var(--v-sunken)] text-[var(--v-ink-3)] line-through'}`}>{a.split(' ').map(w => w[0]).join('')}<span className="sr-only">{apps[i] ? ' has access' : ' no access'}</span></span>)}</div></td>
                  <td className="tnum py-3 pr-4">{open}</td>
                  <td className="py-3 pr-5">{avail === 'Available' ? <Pill tone="done">Available</Pill> : <Pill tone="bad">{avail}</Pill>}</td>
                </tr>))}</tbody></table>
            {invites.length > 0 && <ul aria-label="Pending invitations" className="border-t border-[var(--v-line)]">{invites.map(i => <li key={i.at} className="flex items-center gap-3 px-5 py-3 text-[13.5px]"><span className="grid size-[30px] place-items-center rounded-full bg-[var(--v-sunken)] text-[12px] font-semibold text-[var(--v-ink-3)]">{i.email[0].toUpperCase()}</span><span className="min-w-0 flex-1"><b className="block truncate font-medium">{i.email}</b><span className="text-[12.5px] text-[var(--v-ink-3)]">{i.role} · {i.apps.join(', ')}</span></span><Pill tone="wait">Invitation sent</Pill></li>)}</ul>}
            <p className="border-t border-[var(--v-line)] px-5 py-3 text-[12.5px] text-[var(--v-ink-3)]">FA Full Application · AP Advisor Portal · CS Client Services</p>
          </Card>
          <div className="flex flex-col gap-6">
            <Card><CardHead title="Cover while away" />
              <div className="flex items-center gap-3 px-5 pb-4"><Avatar p="jon" size={30} /><ArrowRight className="size-4 text-[var(--v-ink-3)]" /><Avatar p="lena" size={30} /><div className="min-w-0 flex-1 text-[13.5px]"><b className="font-medium">Lena covers for Jon</b><div className="text-[12.5px] text-[var(--v-ink-3)]">Engineering Lead · until Fri 14 Nov</div></div></div>
              {covers.map(c => <div key={c.who + c.until} className="flex items-center gap-3 border-t border-[var(--v-line)] px-5 py-3"><Avatar p={c.who} size={30} /><ArrowRight className="size-4 text-[var(--v-ink-3)]" /><Avatar p={c.by} size={30} /><div className="min-w-0 flex-1 text-[13.5px]"><b className="font-medium">{PEOPLE[c.by].name.split(' ')[0]} covers for {PEOPLE[c.who].name.split(' ')[0]}</b><div className="text-[12.5px] text-[var(--v-ink-3)]">Until {fmt(c.until)} · new decisions go to {PEOPLE[c.by].name.split(' ')[0]}</div></div></div>)}
              <div className="border-t border-[var(--v-line)] px-5 py-3"><button className="text-[13px] font-medium text-[var(--v-blue)]" onClick={() => setForm('cover')}>Set up cover</button></div></Card>
            <Card><CardHead title="Role coverage" sub="People who can approve, per application. Aim for at least 2." />
              <table className="w-full text-[13px]"><caption className="sr-only">Role coverage by application</caption><thead><tr className="text-left text-[12px] text-[var(--v-ink-3)]"><th className="pb-2 pl-5 font-medium">Role</th>{['FA', 'AP', 'CS'].map(a => <th key={a} className="pb-2 text-center font-medium">{a}</th>)}<th className="pr-5" /></tr></thead>
                <tbody>{COVER.map(([r, n]) => <tr key={r} className="border-t border-[var(--v-line)]"><td className="py-2 pl-5">{r}</td>{n.map((x, i) => <td key={i} className={`tnum text-center ${x < 2 ? 'font-semibold text-[var(--v-red)]' : ''}`}>{x}</td>)}<td className="pr-5" /></tr>)}</tbody></table>
              <p className="border-t border-[var(--v-line)] px-5 py-3 text-[12.5px] text-[var(--v-red)]">Gaps: Release Manager has 1 person in every application; Quality Lead has 1 in Full Application.</p></Card>
          </div>
        </div>
      </div>
      {form === 'invite' && <FormDialog title="Invite a person" sub="They get an email to sign in with your identity provider." submitLabel="Send invitation" disabled={!emailOk || !inv.apps.length} onClose={() => setForm(null)} onSubmit={() => { const t = invite(inv); setForm(null); toast(`Invitation sent to ${inv.email}.`, () => undo(t)); setInv({ email: '', role: 'Product Owner', apps: ['Full Application'] }); }}>
        <Field id="iv-e" label="Work email" help="Must match a user in your identity provider."><input id="iv-e" type="email" value={inv.email} onChange={e => setInv({ ...inv, email: e.target.value })} className={inputCls} placeholder="name@company.com" aria-describedby="iv-e-help" /></Field>
        <Field id="iv-r" label="Role"><select id="iv-r" value={inv.role} onChange={e => setInv({ ...inv, role: e.target.value })} className={inputCls}>{['Requester', 'Product Owner', 'Solution Architect', 'Engineering Lead', 'Integration Lead', 'Quality Lead', 'Release Manager', 'Auditor'].map(r => <option key={r}>{r}</option>)}</select></Field>
        <fieldset><legend className="text-[13.5px] font-medium">Applications</legend><div className="mt-1.5 flex flex-col gap-1.5">{APPS.map(a => <label key={a} className="flex items-center gap-2"><input type="checkbox" checked={inv.apps.includes(a)} onChange={e => setInv({ ...inv, apps: e.target.checked ? [...inv.apps, a] : inv.apps.filter(x => x !== a) })} className="size-4 accent-[var(--v-blue)]" />{a}</label>)}</div></fieldset>
      </FormDialog>}
      {form === 'cover' && <FormDialog title="Set up cover" sub="While someone is away, their new decisions go to the person covering." submitLabel="Save cover" disabled={cv.who === cv.by || !cv.until} onClose={() => setForm(null)} onSubmit={() => { const t = setCover(cv); setForm(null); toast(`${PEOPLE[cv.by].name} now covers for ${PEOPLE[cv.who].name} until ${fmt(cv.until)}.`, () => undo(t)); }}>
        <Field id="cv-w" label="Who is away"><select id="cv-w" value={cv.who} onChange={e => setCv({ ...cv, who: e.target.value })} className={inputCls}>{DIR.map(([p, r]) => <option key={p} value={p}>{PEOPLE[p].name} · {r[0]}</option>)}</select></Field>
        <Field id="cv-b" label="Covered by" help={cv.who === cv.by ? 'Choose someone else.' : 'They must hold the same role in the same applications.'}><select id="cv-b" value={cv.by} onChange={e => setCv({ ...cv, by: e.target.value })} className={inputCls} aria-describedby="cv-b-help">{DIR.map(([p, r]) => <option key={p} value={p}>{PEOPLE[p].name} · {r.join(', ')}</option>)}</select></Field>
        <Field id="cv-u" label="Until"><input id="cv-u" type="date" value={cv.until} min="2026-11-12" onChange={e => setCv({ ...cv, until: e.target.value })} className={inputCls} /></Field>
      </FormDialog>}
    </Shell>
  );
}
