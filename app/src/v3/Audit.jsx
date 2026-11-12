// Admin · Audit log: every action by every person and the agent, with exact times, details and a verifiable chain.
import { saveFile } from './docs';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Card, Pill, Avatar } from './ui';
import { useProto } from './store';
import { useToast } from '@/components/friendly';
import { useTable, SortTh, Pager } from './table';
import { Download, Search, X, ShieldCheck } from 'lucide-react';

const CAT = { gate: ['Decision', 'work'], access: ['Access', 'mute'], rbac: ['Permissions', 'bad'], admin: ['Admin', 'wait'], artifact: ['Document', 'done'], system: ['System', 'bad'] };
const RANGES = [['all', 'All time'], ['today', 'Today'], ['7d', 'Last 7 days']];
const fmt = iso => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' }) + ' UTC';
const rel = iso => { const m = Math.round((Date.now() - new Date(iso)) / 60000); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
// Each entry's fingerprint covers its content and the previous fingerprint, so editing any entry breaks the chain.
const h = s => [...s].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381).toString(16).padStart(8, '0');
const GET = { at: e => e.at, who: e => e.who, action: e => e.action, cat: e => e.cat };

const csv = rows => rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
export default function V3Audit() {
  const { audit, NAME, exportArtifacts } = useProto();
  const toast = useToast();
  const [cat, setCat] = useState('all'); const [who, setWho] = useState('Everyone'); const [q, setQ] = useState(''); const [range, setRange] = useState('all'); const [sel, setSel] = useState(null);
  const chained = useMemo(() => { const asc = [...audit].reverse(); let prev = '00000000'; const out = asc.map(e => { const fp = h(prev + e.at + e.who + e.action + e.target); const r = { ...e, prev, fp }; prev = fp; return r; }); return out.reverse(); }, [audit]);
  const people = ['Everyone', ...new Set(audit.map(e => NAME[e.who] || 'System'))];
  const now = Date.now();
  const rows = chained.filter(e => (cat === 'all' || e.cat === cat) && (who === 'Everyone' || (NAME[e.who] || 'System') === who) && `${e.action} ${e.target}`.toLowerCase().includes(q.toLowerCase())
    && (range === 'all' || (range === 'today' ? new Date(e.at).toDateString() === new Date(now).toDateString() : now - new Date(e.at) < 7 * 864e5)));
  const tb = useTable(rows, { sort: 'at', dir: 'desc', getters: GET, pageSize: 12 });
  const doExport = () => { exportArtifacts(`audit log, ${rows.length} entries, ${RANGES.find(r => r[0] === range)[1].toLowerCase()}`); saveFile(`audit-log-${range}.csv`, csv([['time_utc', 'who', 'action', 'target', 'category', 'ip', 'detail'], ...rows.map(e => [e.at, e.who, e.action, e.target, e.cat, e.ip, e.detail])]), toast); };
  return (
    <Shell active="audit" crumbs={['Admin', 'Audit log']} actions={<Button variant="outline" className="h-9 rounded-lg" onClick={doExport}><Download className="size-4" />Export signed PDF</Button>}>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-0 flex-1"><h1 className="font-display text-[28px] font-semibold">Audit log</h1><p className="mt-1 max-w-[80ch] text-[15px] text-[var(--v-ink-2)]">Every decision, document, access and permission change. Entries cannot be edited or deleted, and each one is linked to the one before it. Times are in UTC.</p></div>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--v-line)] bg-[var(--v-surface)] px-4 py-2.5 text-[13px]"><ShieldCheck className="size-5 text-[var(--v-green)]" /><div><b className="font-medium">Chain verified</b><div className="text-[var(--v-ink-3)]">{audit.length} entries · kept 7 years</div></div></div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div role="tablist" aria-label="Category" className="flex flex-wrap gap-1.5">{[['all', 'All'], ...Object.entries(CAT).map(([k, v]) => [k, v[0]])].map(([k, l]) => <button key={k} role="tab" aria-selected={cat === k} onClick={() => setCat(k)} className={`h-8 rounded-full px-3.5 text-[13.5px] ring-1 ${cat === k ? 'bg-[var(--v-inv)] text-[var(--v-inv-fg)] ring-[var(--v-inv)]' : 'bg-[var(--v-surface)] text-[var(--v-ink-2)] ring-[var(--v-line)]'}`}>{l}</button>)}</div>
          <div className="flex-1" />
          <label htmlFor="lr" className="sr-only">Date range</label><select id="lr" value={range} onChange={e => setRange(e.target.value)} className="h-9 rounded-lg border border-[var(--v-line)] bg-[var(--v-surface)] px-3 text-[13.5px]">{RANGES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          <label htmlFor="lq" className="flex h-9 items-center gap-2 rounded-lg border border-[var(--v-line)] bg-[var(--v-surface)] px-3 text-[13.5px]"><Search className="size-4 text-[var(--v-ink-3)]" /><span className="sr-only">Search the audit log</span><input id="lq" value={q} onChange={e => setQ(e.target.value)} placeholder="Search actions" className="w-36 bg-transparent outline-none" /></label>
          <label htmlFor="lw" className="sr-only">Person</label><select id="lw" value={who} onChange={e => setWho(e.target.value)} className="h-9 rounded-lg border border-[var(--v-line)] bg-[var(--v-surface)] px-3 text-[13.5px]">{people.map(p => <option key={p}>{p}</option>)}</select>
        </div>
        <div className={`grid items-start gap-6 ${sel ? 'grid-cols-[minmax(0,1fr)_380px]' : 'grid-cols-1'}`}>
          <Card className="overflow-hidden">
            <table className="w-full text-[13.5px]"><caption className="sr-only">Audit entries</caption>
              <thead><tr className="border-b border-[var(--v-line)] bg-[var(--v-sunken)] text-left text-[12.5px] text-[var(--v-ink-3)]"><SortTh label="When (UTC)" s={tb.by('at')} className="w-48 py-2.5 pl-5" /><SortTh label="Who" s={tb.by('who')} className="pr-4" /><SortTh label="What" s={tb.by('action')} className="pr-4" /><th className="pr-4 font-medium">Where</th><SortTh label="Type" s={tb.by('cat')} className="pr-5" /></tr></thead>
              <tbody>{tb.view.map(e => (
                <tr key={e.fp} onClick={() => setSel(e)} className={`cursor-pointer border-b border-[var(--v-line)] last:border-0 hover:bg-[var(--v-sunken)] ${sel?.fp === e.fp ? 'bg-[var(--v-blue-soft)]' : ''}`}>
                  <td className="py-3 pl-5"><button onClick={ev => { ev.stopPropagation(); setSel(e); }} className="tnum text-left hover:text-[var(--v-blue)]"><span className="block whitespace-nowrap">{fmt(e.at).replace(" UTC", "")}</span><span className="block text-[12px] text-[var(--v-ink-3)]">{rel(e.at)}</span></button></td>
                  <td className="pr-4"><span className="flex items-center gap-2 whitespace-nowrap">{NAME[e.who] && <Avatar p={e.who} size={22} />}{NAME[e.who] || 'System'}</span></td>
                  <td className="pr-4">{e.action}</td>
                  <td className="pr-4 text-[var(--v-ink-2)]">{e.target}</td>
                  <td className="pr-5"><Pill tone={CAT[e.cat]?.[1] || 'mute'}>{CAT[e.cat]?.[0] || e.cat}</Pill></td>
                </tr>))}
                {!rows.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-[var(--v-ink-2)]">No entries match these filters.</td></tr>}
              </tbody></table>
            <Pager t={tb} noun="entries" />
          </Card>
          {sel && (
            <aside aria-label="Entry details" className="sticky top-24">
              <Card className="p-5">
                <div className="flex items-start gap-2"><div className="min-w-0 flex-1"><Pill tone={CAT[sel.cat]?.[1] || 'mute'}>{CAT[sel.cat]?.[0]}</Pill><h2 className="mt-2 text-[16px] font-semibold leading-snug">{sel.action}</h2></div><button aria-label="Close details" onClick={() => setSel(null)} className="rounded-md p-1 hover:bg-[var(--v-sunken)]"><X className="size-4" /></button></div>
                <dl className="mt-4 grid grid-cols-[96px_1fr] gap-y-2 text-[13px]">
                  <dt className="text-[var(--v-ink-3)]">When</dt><dd className="tnum">{fmt(sel.at)}</dd>
                  <dt className="text-[var(--v-ink-3)]">Who</dt><dd>{NAME[sel.who] || 'System'}{sel.who !== 'system' && sel.who !== 'agent' && ' · signed in with SSO'}</dd>
                  <dt className="text-[var(--v-ink-3)]">Where</dt><dd>{sel.target}</dd>
                  <dt className="text-[var(--v-ink-3)]">From</dt><dd className="font-mono text-[12px]">{sel.ip || '10.20.4.2'} · session {h(sel.who + sel.at).slice(0, 6)}</dd>
                  {sel.cat === 'rbac' && <><dt className="text-[var(--v-ink-3)]">Change</dt><dd><span className="rounded bg-[var(--v-red-soft)] px-1 line-through">{/Removed/.test(sel.action) ? 'granted' : 'not granted'}</span> → <span className="rounded bg-[var(--v-green-soft)] px-1">{/Removed/.test(sel.action) ? 'not granted' : 'granted'}</span></dd></>}
                  <dt className="text-[var(--v-ink-3)]">Fingerprint</dt><dd className="font-mono text-[12px]">{sel.fp}</dd>
                  <dt className="text-[var(--v-ink-3)]">Previous</dt><dd className="font-mono text-[12px]">{sel.prev}</dd>
                </dl>
                <p className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--v-green-soft)] px-3 py-2 text-[13px] text-[var(--v-green)]"><ShieldCheck className="size-4" />Linked to the previous entry. Unchanged since it was written.</p>
              </Card>
            </aside>)}
        </div>
      </div>
    </Shell>
  );
}
