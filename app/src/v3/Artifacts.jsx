// Artifact library: every document and piece of evidence the platform stores, across all work items.
// Super admins and auditors see everything; everyone else sees artifacts from the stages they approve or the work they own.
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Card, Pill, Avatar, PEOPLE, STAGES } from './ui';
import { useProto, runHref } from './store';
import { useTable, SortTh, Pager } from './table';
import { useToast } from '@/components/friendly';
import { FileText, Search, Download, X, ShieldCheck, Lock, History, Link2 } from 'lucide-react';

const DOCS = [
  ['Delivery plan', 'Plan'], ['Specification', 'Specification'], ['Impact assessment', 'Impact'], ['Architecture decision record', 'Design'],
  ['Developer completion report', 'Code and tests'], ['Integration evidence', 'Pipeline'], ['Validation report', 'Test report'], ['Release record', 'Release'],
];
const EXTRA = { 3: [['Developer handoff', 'Handoff'], ['Tester handoff', 'Handoff']] };
const PREVIEW = {
  Plan: 'Objective: stop advisors entering a value above the documented maximum. Stories: (1) block the value on Product Selection, (2) explain the limit inline.',
  Specification: '8 acceptance criteria. AC-3: when the value exceeds 310, the form blocks submission and shows the reason next to the field.',
  Impact: 'Touches the Product Selection page, the shared amortization validator and one test suite. No other application is affected.',
  Design: 'Decision: enforce the maximum in the form using the shared validator. Accepted risk: the Pricing API is not changed in this story.',
  'Code and tests': '4 files changed (+103 lines). 6 of 6 unit tests pass. Baseline build green before and after.',
  Pipeline: 'Merge commit built and deployed to staging. 3 pipelines passed.',
  'Test report': 'All acceptance criteria met. 214 regression tests green.',
  Release: 'Release window, approver, release notes and rollback plan, with the deployment receipt.',
  Handoff: 'Instructions generated from the approved design for the people who build and test it.',
};
const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7).toString(16).padStart(8, '0');

export default function V3Artifacts() {
  const { list, me, can, audit, viewArtifact, exportArtifacts, NAME } = useProto();
  const toast = useToast();
  const all = can('artifacts.all');
  const [q, setQ] = useState(''); const [type, setType] = useState('All types'); const [status, setStatus] = useState('all'); const [sel, setSel] = useState(null);
  const items = useMemo(() => list.flatMap(r => {
    const out = [];
    [...r.s].forEach((k, i) => {
      if (k === 'a' || k === 'f' && i > 6) return;
      const [name, t] = DOCS[i]; const approver = STAGES[i][1];
      const st = k === 'd' ? 'Approved' : k === 'w' ? 'Waiting for approval' : k === 'f' ? 'Failed' : 'Draft';
      const base = { run: r.id, runTitle: r.t, app: r.app, stage: STAGES[i][0], approver, st, owner: r.by, holder: r.holder };
      out.push({ ...base, id: `${r.id}-${i}`, name, t, v: k === 'd' ? (i === 3 ? 'v2' : 'v1') : 'v1 draft' });
      (k === 'd' && EXTRA[i] || []).forEach(([n2, t2], j) => out.push({ ...base, id: `${r.id}-${i}-x${j}`, name: n2, t: t2, v: 'v1' }));
    });
    return out;
  }), [list]);
  const mineOnly = a => a.owner === me || a.holder === me || a.approver === me;
  const visible = items.filter(a => (all || mineOnly(a)) && (type === 'All types' || a.t === type) && (status === 'all' || a.st === status) && `${a.name} ${a.run} ${a.runTitle}`.toLowerCase().includes(q.toLowerCase()));
  const tb = useTable(visible, { pageSize: 12 });
  const types = ['All types', ...new Set(items.map(a => a.t))];
  const open = a => { setSel(a); viewArtifact(a.name, a.run); };
  const access = sel ? audit.filter(e => e.target.includes(sel.run) && (e.cat === 'access' || e.target.includes(sel.name))).slice(0, 5) : [];
  return (
    <Shell active="artifacts" crumbs={['Artifacts']}>
      <div className="mx-auto flex max-w-[1320px] flex-col gap-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-0 flex-1"><h1 className="font-display text-[28px] font-semibold">Artifacts</h1><p className="mt-1 max-w-[80ch] text-[15px] text-[var(--v-ink-2)]">{all ? 'Every document and piece of evidence the platform has stored, for every work item.' : 'Documents from the work you requested, hold, or approve. A platform admin or auditor can see everything.'}</p></div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--v-line)] bg-[var(--v-surface)] px-4 py-2.5 text-[13px]"><ShieldCheck className="size-5 text-[var(--v-green)]" /><div><b className="font-medium">Evidence store</b><div className="text-[var(--v-ink-3)]">Immutable · fingerprinted · kept 7 years</div></div></div>
          {can('artifacts.export') && <Button variant="outline" className="h-10 rounded-lg" onClick={() => { exportArtifacts(`${visible.length} artifacts`); toast(`Export of ${visible.length} artifacts is being prepared. You will be notified when it is ready.`); }}><Download className="size-4" />Export {visible.length}</Button>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div role="tablist" aria-label="Status" className="flex gap-1.5">{[['all', 'All'], ['Approved', 'Approved'], ['Waiting for approval', 'Waiting'], ['Draft', 'Draft']].map(([k, l]) => <button key={k} role="tab" aria-selected={status === k} onClick={() => setStatus(k)} className={`h-8 rounded-full px-3.5 text-[13.5px] ring-1 ${status === k ? 'bg-[var(--v-inv)] text-[var(--v-inv-fg)] ring-[var(--v-inv)]' : 'bg-[var(--v-surface)] text-[var(--v-ink-2)] ring-[var(--v-line)]'}`}>{l}</button>)}</div>
          <div className="flex-1" />
          <label htmlFor="aq" className="flex h-9 items-center gap-2 rounded-lg border border-[var(--v-line)] bg-[var(--v-surface)] px-3 text-[13.5px]"><Search className="size-4 text-[var(--v-ink-3)]" /><span className="sr-only">Search artifacts</span><input id="aq" value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or work item" className="w-48 bg-transparent outline-none" /></label>
          <label htmlFor="at" className="sr-only">Type</label><select id="at" value={type} onChange={e => setType(e.target.value)} className="h-9 rounded-lg border border-[var(--v-line)] bg-[var(--v-surface)] px-3 text-[13.5px]">{types.map(t => <option key={t}>{t}</option>)}</select>
        </div>
        <div className={`grid items-start gap-6 ${sel ? 'grid-cols-[minmax(0,1fr)_420px]' : 'grid-cols-1'}`}>
          <Card className="overflow-hidden">
            <table className="w-full text-[13.5px]"><caption className="sr-only">Artifacts</caption>
              <thead><tr className="border-b border-[var(--v-line)] bg-[var(--v-sunken)] text-left text-[12.5px] text-[var(--v-ink-3)]"><SortTh label="Artifact" s={tb.by('name')} className="py-2.5 pl-5" /><SortTh label="Work item" s={tb.by('run')} className="pr-4" /><SortTh label="Stage" s={tb.by('stage')} className="pr-4" /><SortTh label="Status" s={tb.by('st')} className="pr-4" /><th className="pr-5 font-medium">Version</th></tr></thead>
              <tbody>{tb.view.map(a => (
                <tr key={a.id} onClick={() => open(a)} className={`cursor-pointer border-b border-[var(--v-line)] last:border-0 hover:bg-[var(--v-sunken)] ${sel?.id === a.id ? 'bg-[var(--v-blue-soft)]' : ''}`}>
                  <td className="py-3 pl-5"><button onClick={e => { e.stopPropagation(); open(a); }} className="flex items-center gap-2.5 text-left font-medium hover:text-[var(--v-blue)]"><FileText className="size-4 shrink-0 text-[var(--v-ink-3)]" />{a.name}</button><div className="pl-[26px] text-[12px] text-[var(--v-ink-3)]">{a.t}</div></td>
                  <td className="pr-4"><span className="font-mono text-[12px]">{a.run}</span><div className="max-w-[220px] truncate text-[12px] text-[var(--v-ink-3)]">{a.runTitle}</div></td>
                  <td className="pr-4">{a.stage}</td>
                  <td className="pr-4"><Pill tone={a.st === 'Approved' ? 'done' : a.st === 'Failed' ? 'bad' : a.st === 'Draft' ? 'mute' : 'wait'}>{a.st}</Pill></td>
                  <td className="tnum pr-5 text-[var(--v-ink-2)]">{a.v}</td>
                </tr>))}
                {!visible.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-[var(--v-ink-2)]">No artifacts match. <button onClick={() => { setQ(''); setType('All types'); setStatus('all'); }} className="font-medium text-[var(--v-blue)] underline">Clear filters</button></td></tr>}
              </tbody></table>
            <Pager t={tb} noun={all ? 'artifacts' : 'artifacts you can see'} />
          </Card>
          {sel && (
            <aside aria-label="Artifact details" className="sticky top-24 flex flex-col gap-4">
              <Card className="p-5">
                <div className="flex items-start gap-3"><FileText className="mt-0.5 size-5 text-[var(--v-blue)]" /><div className="min-w-0 flex-1"><h2 className="text-[17px] font-semibold leading-snug">{sel.name}</h2><a href={runHref(sel.run)} className="text-[13px] text-[var(--v-blue)] hover:underline">{sel.run} · {sel.runTitle}</a></div><button aria-label="Close details" onClick={() => setSel(null)} className="rounded-md p-1 hover:bg-[var(--v-sunken)]"><X className="size-4" /></button></div>
                <p className="mt-3 rounded-lg bg-[var(--v-sunken)] p-3 text-[14px] leading-relaxed">{PREVIEW[sel.t]}</p>
                <dl className="mt-4 grid grid-cols-[110px_1fr] gap-y-1.5 text-[13px]"><dt className="text-[var(--v-ink-3)]">Status</dt><dd><Pill tone={sel.st === 'Approved' ? 'done' : 'wait'}>{sel.st}</Pill></dd><dt className="text-[var(--v-ink-3)]">Approver</dt><dd className="flex items-center gap-1.5">{sel.approver ? <><Avatar p={sel.approver} size={18} />{PEOPLE[sel.approver].name}</> : 'Automatic checks'}</dd><dt className="text-[var(--v-ink-3)]">Version</dt><dd>{sel.v}</dd><dt className="text-[var(--v-ink-3)]">Fingerprint</dt><dd className="font-mono text-[12px]">{hash(sel.id)} {hash(sel.name)}</dd></dl>
                <div className="mt-4 flex gap-2">{can('artifacts.export') ? <Button size="sm" className="rounded-lg" onClick={() => { exportArtifacts(sel.name + ' · ' + sel.run); toast(`${sel.name} downloaded.`); }}><Download className="size-3.5" />Download</Button> : <span className="flex items-center gap-1.5 text-[12.5px] text-[var(--v-ink-3)]"><Lock className="size-3.5" />Your role cannot download</span>}<Button size="sm" variant="outline" className="rounded-lg" onClick={() => toast('Link copied. Only people with access can open it.')}><Link2 className="size-3.5" />Copy link</Button></div>
              </Card>
              <Card className="p-5"><h3 className="text-[14px] font-semibold">Versions</h3>
                <ol className="mt-2 flex flex-col gap-2 text-[13px]">{(sel.v === 'v2' ? [['v2', 'Approved', 'Today 14:33'], ['v1', 'Superseded: missing AC-3 reference', 'Today 14:31']] : [[sel.v, sel.st, 'Today']]).map(([v, s, t]) => <li key={v} className="flex justify-between gap-2"><span><b className="font-medium">{v}</b> · {s}</span><span className="text-[var(--v-ink-3)]">{t}</span></li>)}</ol></Card>
              <Card className="p-5"><h3 className="flex items-center gap-2 text-[14px] font-semibold"><History className="size-4" />Who has opened this</h3>
                <ol className="mt-2 flex flex-col gap-2 text-[13px]">{access.length ? access.map((e, i) => <li key={i} className="flex justify-between gap-2"><span>{NAME[e.who] || e.who} · {e.action.toLowerCase()}</span><span className="shrink-0 text-[var(--v-ink-3)]">{e.t}</span></li>) : <li className="text-[var(--v-ink-2)]">No other access recorded.</li>}</ol>
                {can('audit.view') && <a href="#v3-audit" className="mt-3 inline-block text-[13px] font-medium text-[var(--v-blue)]">Full audit log</a>}</Card>
              <Card className="px-5 py-4 text-[12.5px] text-[var(--v-ink-2)]"><b className="text-[var(--v-ink)]">Storage:</b> Evidence store, {sel.app} partition. Write-once, encrypted at rest, kept for 7 years after release.</Card>
            </aside>)}
        </div>
      </div>
    </Shell>
  );
}
