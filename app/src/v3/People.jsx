// Admin · People and access: who can approve what, in which application, and who is away.
import { Button } from '@/components/ui/button';
import { Shell, Card, CardHead, Pill, Avatar, PEOPLE } from './ui';
import { useToast } from '@/components/friendly';
import { UserPlus, ArrowRight } from 'lucide-react';

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
  return (
    <Shell admin active="people" crumbs={['Admin', 'People and access']} actions={<Button className="h-9 rounded-lg px-4" onClick={() => toast('Invitation form opened.')}><UserPlus className="size-4" />Invite person</Button>}>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6">
        <div><h1 className="font-display text-[28px] font-semibold">People and access</h1><p className="mt-1 text-[15px] text-[var(--v-ink-2)]">Who can approve which stages, in which applications. Squads can only use people listed here.</p></div>
        <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
          <Card className="overflow-hidden">
            <table className="w-full text-[13.5px]"><caption className="sr-only">People</caption>
              <thead><tr className="border-b border-[var(--v-line)] bg-[var(--v-sunken)] text-left text-[12.5px] text-[var(--v-ink-3)]"><th className="py-2.5 pl-5 font-medium">Person</th><th className="pr-4 font-medium">Can approve as</th><th className="pr-4 font-medium">Applications</th><th className="pr-4 font-medium">Open</th><th className="pr-5 font-medium">Availability</th></tr></thead>
              <tbody>{DIR.map(([p, roles, apps, open, avail, seen]) => (
                <tr key={p} className="border-b border-[var(--v-line)] align-top last:border-0 hover:bg-[var(--v-sunken)]">
                  <td className="py-3 pl-5"><span className="flex items-center gap-3"><Avatar p={p} size={30} /><span><b className="block font-medium">{PEOPLE[p].name}</b><span className="text-[12.5px] text-[var(--v-ink-3)]">Active {seen.toLowerCase()}</span></span></span></td>
                  <td className="py-3 pr-4"><div className="flex flex-wrap gap-1">{roles.map(r => <span key={r} className="rounded-md bg-[var(--v-sunken)] px-2 py-0.5 text-[12.5px] ring-1 ring-[var(--v-line)]">{r}</span>)}</div></td>
                  <td className="py-3 pr-4"><div className="flex gap-1">{APPS.map((a, i) => <span key={a} title={`${a}: ${apps[i] ? 'has access' : 'no access'}`} className={`grid size-6 place-items-center rounded-md text-[11px] font-semibold ${apps[i] ? 'bg-[var(--v-blue-soft)] text-[var(--v-blue)]' : 'bg-[var(--v-sunken)] text-[var(--v-ink-3)] line-through'}`}>{a.split(' ').map(w => w[0]).join('')}<span className="sr-only">{apps[i] ? ' has access' : ' no access'}</span></span>)}</div></td>
                  <td className="tnum py-3 pr-4">{open}</td>
                  <td className="py-3 pr-5">{avail === 'Available' ? <Pill tone="done">Available</Pill> : <Pill tone="bad">{avail}</Pill>}</td>
                </tr>))}</tbody></table>
            <p className="border-t border-[var(--v-line)] px-5 py-3 text-[12.5px] text-[var(--v-ink-3)]">FA Full Application · AP Advisor Portal · CS Client Services</p>
          </Card>
          <div className="flex flex-col gap-6">
            <Card><CardHead title="Cover while away" />
              <div className="flex items-center gap-3 px-5 pb-4"><Avatar p="jon" size={30} /><ArrowRight className="size-4 text-[var(--v-ink-3)]" /><Avatar p="lena" size={30} /><div className="min-w-0 flex-1 text-[13.5px]"><b className="font-medium">Lena covers for Jon</b><div className="text-[12.5px] text-[var(--v-ink-3)]">Engineering Lead · until Fri 14 Nov</div></div></div>
              <div className="border-t border-[var(--v-line)] px-5 py-3"><button className="text-[13px] font-medium text-[var(--v-blue)]" onClick={() => toast('Cover form opened.')}>Set up cover</button></div></Card>
            <Card><CardHead title="Role coverage" sub="People who can approve, per application. Aim for at least 2." />
              <table className="w-full text-[13px]"><caption className="sr-only">Role coverage by application</caption><thead><tr className="text-left text-[12px] text-[var(--v-ink-3)]"><th className="pb-2 pl-5 font-medium">Role</th>{['FA', 'AP', 'CS'].map(a => <th key={a} className="pb-2 text-center font-medium">{a}</th>)}<th className="pr-5" /></tr></thead>
                <tbody>{COVER.map(([r, n]) => <tr key={r} className="border-t border-[var(--v-line)]"><td className="py-2 pl-5">{r}</td>{n.map((x, i) => <td key={i} className={`tnum text-center ${x < 2 ? 'font-semibold text-[var(--v-red)]' : ''}`}>{x}</td>)}<td className="pr-5" /></tr>)}</tbody></table>
              <p className="border-t border-[var(--v-line)] px-5 py-3 text-[12.5px] text-[var(--v-red)]">Gaps: Release Manager has 1 person in every application; Quality Lead has 1 in Full Application.</p></Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
