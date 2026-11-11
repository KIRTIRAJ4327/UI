// Admin · Audit log: every action by every person and the agent, including access and permission changes.
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Card, Pill, Avatar } from './ui';
import { useProto } from './store';
import { useToast } from '@/components/friendly';
import { Download, Search } from 'lucide-react';

const CAT = { gate: ['Decision', 'work'], access: ['Access', 'mute'], rbac: ['Permissions', 'bad'], admin: ['Admin', 'wait'], artifact: ['Document', 'done'], system: ['System', 'bad'] };
export default function V3Audit() {
  const { audit, NAME, exportArtifacts } = useProto();
  const toast = useToast();
  const [cat, setCat] = useState('all'); const [who, setWho] = useState('Everyone'); const [q, setQ] = useState('');
  const people = ['Everyone', ...new Set(audit.map(e => NAME[e.who] || e.who))];
  const rows = audit.filter(e => (cat === 'all' || e.cat === cat) && (who === 'Everyone' || (NAME[e.who] || e.who) === who) && `${e.action} ${e.target}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Shell active="audit" crumbs={['Admin', 'Audit log']} actions={<Button variant="outline" className="h-9 rounded-lg" onClick={() => { exportArtifacts(`audit log (${rows.length} entries)`); toast(`Audit log with ${rows.length} entries exported as a signed PDF.`); }}><Download className="size-4" />Export</Button>}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
        <div><h1 className="font-display text-[28px] font-semibold">Audit log</h1><p className="mt-1 max-w-[80ch] text-[15px] text-[var(--v-ink-2)]">Every decision, document, access and permission change, newest first. Entries cannot be edited or deleted. Actions you take in this prototype appear here straight away.</p></div>
        <div className="flex flex-wrap items-center gap-3">
          <div role="tablist" aria-label="Category" className="flex flex-wrap gap-1.5">{[['all', 'All'], ...Object.entries(CAT).map(([k, v]) => [k, v[0]])].map(([k, l]) => <button key={k} role="tab" aria-selected={cat === k} onClick={() => setCat(k)} className={`h-8 rounded-full px-3.5 text-[13.5px] ring-1 ${cat === k ? 'bg-[var(--v-ink)] text-white ring-[var(--v-ink)]' : 'bg-white text-[var(--v-ink-2)] ring-[var(--v-line)]'}`}>{l}</button>)}</div>
          <div className="flex-1" />
          <label htmlFor="lq" className="flex h-9 items-center gap-2 rounded-lg border border-[var(--v-line)] bg-white px-3 text-[13.5px]"><Search className="size-4 text-[var(--v-ink-3)]" /><span className="sr-only">Search the audit log</span><input id="lq" value={q} onChange={e => setQ(e.target.value)} placeholder="Search actions" className="w-40 bg-transparent outline-none" /></label>
          <label htmlFor="lw" className="sr-only">Person</label><select id="lw" value={who} onChange={e => setWho(e.target.value)} className="h-9 rounded-lg border border-[var(--v-line)] bg-white px-3 text-[13.5px]">{people.map(p => <option key={p}>{p}</option>)}</select>
        </div>
        <Card className="overflow-hidden">
          <table className="w-full text-[13.5px]"><caption className="sr-only">Audit entries</caption>
            <thead><tr className="border-b border-[var(--v-line)] bg-[var(--v-sunken)] text-left text-[12.5px] text-[var(--v-ink-3)]"><th className="w-28 py-2.5 pl-5 font-medium">When</th><th className="pr-4 font-medium">Who</th><th className="pr-4 font-medium">What</th><th className="pr-4 font-medium">Where</th><th className="pr-5 font-medium">Type</th></tr></thead>
            <tbody>{rows.map((e, i) => (
              <tr key={i} className="border-b border-[var(--v-line)] last:border-0">
                <td className="tnum py-3 pl-5 text-[var(--v-ink-3)]">{e.t}</td>
                <td className="pr-4"><span className="flex items-center gap-2">{NAME[e.who] && <Avatar p={e.who} size={22} />}{NAME[e.who] || 'System'}</span></td>
                <td className="pr-4">{e.action}</td>
                <td className="pr-4 text-[var(--v-ink-2)]">{e.target}</td>
                <td className="pr-5"><Pill tone={CAT[e.cat]?.[1] || 'mute'}>{CAT[e.cat]?.[0] || e.cat}</Pill></td>
              </tr>))}
              {!rows.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-[var(--v-ink-2)]">No entries match these filters.</td></tr>}
            </tbody></table>
        </Card>
      </div>
    </Shell>
  );
}
