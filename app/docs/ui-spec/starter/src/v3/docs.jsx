// Document viewer: every artifact the agent produces opens in place, as the document itself (not a summary),
// with its storage record (metadata and versions in Azure SQL, the file in Azure Blob Storage) and its links
// to Azure Boards and Azure Repos. Also: stories for a run, and the standalone Developer Agent in VS Code.
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProto } from './store';
import { useTheme } from './theme';
import { useToast } from '@/components/friendly';
import { Pill, Avatar, PEOPLE, STAGES } from './ui';
import { X, FileText, Database, HardDrive, Fingerprint, Download, Link2, Copy, Code2, Eye, GitPullRequest, SquareKanban, Check, Circle, Loader2, Laptop } from 'lucide-react';

export const KINDS = ['plan', 'spec', 'impact', 'design', 'completion', 'integration', 'validation', 'release'];
export const KIND_NAME = { plan: 'Delivery plan', spec: 'Specification', impact: 'Impact assessment', design: 'Architecture decision record', completion: 'Developer completion report', integration: 'Integration evidence', validation: 'Validation report', release: 'Release record', story: 'Story', assignment: 'Developer assignment', 'handoff-test': 'Tester handoff' };
const KIND_STAGE = { plan: 0, story: 0, spec: 1, impact: 2, design: 3, assignment: 3, 'handoff-test': 3, completion: 4, integration: 5, validation: 6, release: 7 };
const REPO = { 'Full Application': 'full-application-ui', 'Advisor Portal': 'advisor-portal-web', 'Client Services': 'client-services-app' };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28);
const num = id => parseInt(id.replace(/\D/g, ''), 10);

// Stories: the plan splits a request into stories; each is specified, designed and built one at a time.
const STORY_TEXT = {
  'WI-4821': [['Block values above 310 on Product Selection', 'an advisor', 'the form to stop me entering a Registered Amortization above 310', 'applications never break the product rule'], ['Explain the limit next to the field', 'an advisor', 'to see why the value was rejected', 'I can correct it without calling support']],
  'WI-4807': [['Show the eligibility banner on the advisor dashboard', 'an advisor', 'to see which clients are eligible for the new product', 'I can contact them first'], ['Announce the banner to screen readers', 'an advisor using a screen reader', 'the banner to be announced once', 'I get the same information']],
  'WI-4799': [['Export statements in the bank’s column order', 'a client services agent', 'the export to match the bank reconciliation layout', 'the bank can load it without edits'], ['Leave closed accounts out of the export', 'a client services agent', 'closed accounts excluded', 'clients only see live accounts']],
};
export function storiesFor(r) {
  const base = STORY_TEXT[r.id] || [[`${r.t}: change the ${r.app} screens`, 'an advisor', `the ${r.t.toLowerCase()} change on the ${r.app} screens`, 'the request is delivered'], [`${r.t}: tests and release notes`, 'a release manager', 'tests and release notes for the change', 'the change can be released safely']];
  const S = [1, 3, 4], NAMES = ['Specifying', 'Designing', 'Building'];
  return base.map(([title, who, want, so], i) => {
    let prog, status;
    if (i === 0) { prog = S.filter(x => r.s[x] === 'd').length; status = prog === 3 ? 'Built' : r.s[S[prog]] ? NAMES[prog] : 'Planned'; }
    else if (r.s[5] || r.state === 'done') { prog = 3; status = 'Built'; }
    else if (r.s[4] === 'd') { prog = 0; status = 'Specifying'; }
    else { prog = 0; status = 'Queued: starts after story 1 is built'; }
    return { n: i + 1, id: `${r.id}-S${i + 1}`, title, who, want, so, prog, status };
  });
}

function contentFor(r, kind, story) {
  const app = r.app, repo = REPO[app] || 'app-web', st = storiesFor(r), rich = r.id === 'WI-4821';
  const C = {
    plan: [
      { h: 'Objective' }, { p: rich ? 'Stop advisors entering a Registered Amortization above the documented maximum of 310 on the Product Selection page, and tell them why.' : `${r.t} on ${app}, as described in the business request.` },
      { h: 'Stories' }, { stories: st },
      { h: 'Out of scope' }, { ul: rich ? ['The Pricing API (follow-up request suggested)', 'Batch import'] : ['Other applications', 'API changes'] },
      { h: 'Agent assumptions' }, { ul: [`Only ${app} is affected`, 'No API change in this request'] },
      { h: 'Traceability' }, { p: `Business request ${r.id} → ${st.length} stories → acceptance criteria in the specification.` },
    ],
    story: story && [
      { callout: `As ${story.who}, I want ${story.want}, so that ${story.so}.` },
      { h: 'Acceptance criteria' }, { ol: rich && story.n === 1 ? ['Given a value above 310, when the advisor leaves the field, the form shows the limit next to it.', 'Given a value above 310, submission is blocked.', 'Given a value of 310 or below, the form behaves as today.'] : rich ? ['The message names the maximum and the rule source.', 'The message is announced to screen readers once.'] : ['The change behaves as described in the request.', 'Existing behaviour is unchanged elsewhere.', 'Unit tests cover the new behaviour.'] },
      { h: 'Delivery order' }, { p: story.n === 1 ? 'First story. It is specified, designed and built before story 2 starts.' : 'Starts when story 1 has been built, so each change is reviewed on its own.' },
      { h: 'Status' }, { progress: story },
    ],
    spec: [
      { h: 'Business rules' }, { table: { head: ['Rule', 'Source', 'Value'], rows: rich ? [['RA-MAX', 'Product rules v4', '310'], ['RA-MSG', 'Advisor copy guide', 'Plain language, names the limit']] : [['R-1', 'Business request', 'As written'], ['R-2', 'Knowledge Fabric', 'Existing behaviour kept']] } },
      { h: 'Acceptance criteria' }, { ol: rich ? ['AC-1 The field accepts values from 1 to 310.', 'AC-2 The limit comes from the shared rule, not a hard-coded number.', 'AC-3 Above 310, the form blocks submission and shows the reason next to the field.', 'AC-4 The message is announced to screen readers.'] : ['AC-1 The change matches the request.', 'AC-2 Nothing else changes.', 'AC-3 Covered by unit tests.'] },
      { h: 'Non-functional requirements' }, { ul: ['WCAG 2.2 AA', 'No new service or data store', 'Validation runs in under 50 ms'] },
    ],
    impact: [
      { h: 'Affected components' }, { table: { head: ['Component', 'Repository', 'Change'], rows: rich ? [['Product Selection page', repo, 'Modified'], ['Shared amortization validator', repo, 'Modified'], ['Validator unit tests', repo, 'Added'], ['Pricing API', 'pricing-service', 'Not changed (gap)']] : [[`${app} screens`, repo, 'Modified'], ['Unit tests', repo, 'Added']] } },
      { diagram: rich ? ['Product Selection page', 'Shared validator', 'Pricing API'] : [`${app} screens`, 'Shared rules', 'Backend API'] },
      { h: 'Dependencies' }, { p: 'No other application consumes the changed components. One repository, one pipeline.' },
    ],
    design: [
      { h: 'Decision' }, { p: rich ? 'Enforce the maximum in the Product Selection form by extending the shared amortization validator with the RA-MAX rule. No new service is added.' : `Implement the change in ${repo} using the existing shared patterns.` },
      { h: 'Options considered' }, { table: { head: ['Option', 'Outcome'], rows: [['Extend the shared validator', 'Chosen: reuses ADR-0151, one place to change'], ['Hard-code the limit in the form', 'Rejected: drifts from the rule source'], ['Enforce in the Pricing API', 'Deferred: server change outside this request']] } },
      { h: 'Accepted risk' }, { callout: 'The Pricing API still accepts any value. A follow-up request is suggested.' },
      { diagram: rich ? ['Product Selection page', 'Shared validator', 'Pricing API'] : [`${app} screens`, 'Shared rules', 'Backend API'] },
      { h: 'Changes since v1' }, { diff: [['+', 'AC-3 cited for the blocking behaviour'], ['−', 'Unreferenced claim that the API is covered']] },
    ],
    assignment: [
      { h: 'For the developer' }, { p: `Run the standalone Developer Agent in VS Code against ${repo}. It works on a feature branch, links the Azure Boards task and opens a pull request in Azure Repos. The completion report comes back to the platform automatically.` },
      { h: 'Developer prompt' }, { code: devPrompt(r) },
      { h: 'Files the design allows to change' }, { ul: rich ? ['src/pages/ProductSelection.jsx', 'src/validation/amortizationValidator.js', 'src/validation/__tests__/amortizationValidator.test.js'] : [`${repo}/src/**`] },
      { h: 'Rules' }, { ul: ['Do not add unapproved services, write behaviour or derived logic.', 'Only change the files named in the design.', 'Every change cites an acceptance criterion.'] },
    ],
    'handoff-test': [{ h: 'What to test' }, { ol: ['Each acceptance criterion in the specification', 'Regression suite for the changed page', 'Screen reader announcement'] }, { h: 'Test data' }, { p: 'Values 1, 309, 310, 311 and 999.' }],
    completion: [
      { h: 'Summary' }, { p: `The Developer Agent in VS Code implemented the approved design on branch feature/${r.id.toLowerCase()}-${slug(r.t)}.` },
      { table: { head: ['File', 'Change'], rows: [['src/validation/amortizationValidator.js', '+38 −4'], ['src/pages/ProductSelection.jsx', '+22 −3'], ['…/amortizationValidator.test.js', '+41'], ['src/i18n/en.json', '+2']] } },
      { ul: ['6 of 6 unit tests pass', 'Baseline build green before and after', `Pull request #${200 + num(r.id) % 50} in Azure Repos`] },
    ],
    integration: [{ table: { head: ['Pipeline', 'Result', 'Duration'], rows: [[`${repo}-ci`, 'Passed', '6 min'], [`${repo}-deploy-staging`, 'Passed', '4 min'], ['contract-tests', 'Passed', '3 min']] } }],
    validation: [{ ul: r.state === 'bad' ? ['212 of 214 regression tests pass', '2 tests expect the old 20-minute timeout'] : ['All acceptance criteria met', '214 of 214 regression tests pass', 'UAT signed off by the Product Owner'] }],
    release: [{ table: { head: ['Item', 'Value'], rows: [['Version', '2026.11.3'], ['Change ticket', 'CHG0041872'], ['Window', r.state === 'done' ? 'Mon 9 Nov 16:00' : 'Not scheduled'], ['Rollback', 'Tested in staging']] } }],
  };
  return C[kind] || C.plan;
}
const devPrompt = r => `You are the Developer Agent for ${r.id} (${r.t}).\nRepository: ${REPO[r.app] || 'app-web'} · base branch: main\nRead the approved design (ADR) and developer handoff from the platform.\nImplement only the approved changes, add unit tests, and open a pull request.\nLink Azure Boards task #${88000 + num(r.id) % 1000}. Post the completion report when done.`;


// Save a generated file: on the shared link the viewer confirms the save; locally it is a normal download.
export async function saveFile(filename, data, toast) {
  const dl = window.claude?.use ? await window.claude.use('downloads').catch(() => null) : undefined;
  if (dl) { try { await dl.save({ filename, data }); toast(`${filename} saved.`); } catch (e) { toast(e?.code === 'declined' ? 'Download cancelled.' : 'Downloads are not available in this view.'); } return; }
  if (dl === null) { toast('Downloads are not available in this view.'); return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'text/markdown' })); a.download = filename; a.click(); toast(`${filename} downloaded.`);
}
export const copyText = (text, toast, okMsg) => (navigator.clipboard?.writeText(text) || Promise.reject()).then(() => toast(okMsg), () => toast('Copy is blocked in this view. Open the Developer assignment and select the prompt to copy it.'));

const toMd = (title, blocks) => [`# ${title}`, ...blocks.filter(Boolean).map(b => b.h ? `\n## ${b.h}` : b.p ? b.p : b.callout ? `> ${b.callout}` : b.ul ? b.ul.map(x => `- ${x}`).join('\n') : b.ol ? b.ol.map((x, i) => `${i + 1}. ${x}`).join('\n') : b.code ? '```\n' + b.code + '\n```' : b.table ? [`| ${b.table.head.join(' | ')} |`, `|${b.table.head.map(() => '---').join('|')}|`, ...b.table.rows.map(x => `| ${x.join(' | ')} |`)].join('\n') : b.stories ? b.stories.map(s => `${s.n}. ${s.title} (${s.status})`).join('\n') : b.diff ? b.diff.map(([s, t]) => `${s === '+' ? '+' : '-'} ${t}`).join('\n') : b.diagram ? `\n\`${b.diagram.join(' → ')}\`` : '')].join('\n');

const Ctx = createContext({ openDoc: () => {} });
export const useDoc = () => useContext(Ctx);
export function DocProvider({ children }) {
  const [doc, setDoc] = useState(null);
  const { viewArtifact } = useProto();
  const last = useRef(null);
  const openDoc = d => { last.current = document.activeElement; setDoc(d); viewArtifact(d.story ? `Story ${d.story} · ${d.run}` : KIND_NAME[d.kind], d.run); };
  const close = () => { setDoc(null); const m = location.hash.match(/^(#v3-run-wi-\d+)\//); if (m) history.replaceState(null, '', m[1]); setTimeout(() => last.current?.focus?.(), 0); };
  // Deep links: #v3-run-wi-4821/design or #v3-run-wi-4821/story-2 open the run with that document on top
  useEffect(() => {
    const f = () => { const m = location.hash.match(/^#v3-run-(wi-\d+)\/(story-(\d)|[a-z-]+)$/); setDoc(m ? { run: m[1].toUpperCase(), kind: m[3] ? 'story' : m[2], story: m[3] ? +m[3] : undefined } : null); };
    f(); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f);
  }, []);
  return <Ctx.Provider value={{ openDoc }}>{children}{doc && <Viewer doc={doc} onClose={close} openDoc={openDoc} />}</Ctx.Provider>;
}

function Viewer({ doc, onClose, openDoc }) {
  const { runs, can, NAME } = useProto(); const { resolved } = useTheme(); const toast = useToast();
  const r = runs[doc.run]; const closeBtn = useRef(null); const [tab, setTab] = useState('doc');
  useEffect(() => { closeBtn.current?.focus(); }, [doc]);
  if (!r) return null;
  const story = doc.story ? storiesFor(r)[doc.story - 1] : null;
  const kind = story ? 'story' : doc.kind;
  const stage = KIND_STAGE[kind]; const k = r.s[stage];
  const approved = k === 'd'; const status = story ? story.status : approved ? 'Approved' : k === 'w' ? 'Waiting for approval' : k === 'f' ? 'Failed' : 'Draft';
  const title = story ? `Story ${story.n}: ${story.title}` : KIND_NAME[kind];
  const blocks = contentFor(r, kind, story);
  const ver = kind === 'design' && r.id === 'WI-4821' ? 'v2' : 'v1';
  const id = `${r.id}/${story ? story.id : kind}`;
  const blob = `artifacts/${slug(r.app)}/${r.id.toLowerCase()}/${story ? `story-${story.n}` : kind}-${ver}.md`;
  const sqlId = 18000 + num(r.id) % 1000 * 7 + (stage || 0) * 3 + (story ? story.n : 0);
  const approver = STAGES[stage]?.[1];
  const md = toMd(title, blocks);
  const trap = e => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
    if (e.key === 'Tab') { const els = [...e.currentTarget.querySelectorAll('button:not([disabled]),a[href],textarea,[tabindex="0"]')]; const a = els[0], z = els[els.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  };
  return (
    <div className="v3 contents" data-mode={resolved}>
      <div className="fixed inset-0 z-[60] grid place-items-center bg-[#101429]/45 p-6" onMouseDown={e => e.target === e.currentTarget && onClose()}>
        <div role="dialog" aria-modal="true" aria-labelledby="dv-t" onKeyDown={trap} className="flex max-h-[92vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-2xl border border-[var(--v-line)] bg-[var(--v-surface)] text-[var(--v-ink)] shadow-2xl">
          <header className="flex items-start gap-3 border-b border-[var(--v-line)] px-6 py-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--v-blue-soft)] text-[var(--v-blue)]"><FileText className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--v-ink-3)]"><span className="font-mono">{r.id}</span><span>·</span><span>{r.t}</span><span>·</span><span>{STAGES[stage]?.[0]} stage</span></div>
              <h2 id="dv-t" className="mt-0.5 font-display text-[19px] font-semibold leading-snug">{title}</h2>
            </div>
            <Pill tone={/Approved|Built/.test(status) ? 'done' : status === 'Failed' ? 'bad' : /Draft|Queued|Planned/.test(status) ? 'mute' : 'wait'}>{status}</Pill>
            <span className="rounded-md bg-[var(--v-sunken)] px-2 py-0.5 font-mono text-[12px]">{ver}</span>
            <button ref={closeBtn} onClick={onClose} aria-label="Close document" className="rounded-md p-1.5 hover:bg-[var(--v-sunken)]"><X className="size-4" /></button>
          </header>
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_300px]">
            <div className="flex min-h-0 flex-col">
              <div role="tablist" aria-label="View" className="flex gap-1 border-b border-[var(--v-line)] px-6 pt-2 text-[13.5px]">
                {[['doc', 'Document', Eye], ['md', 'Markdown source', Code2]].map(([t, l, I]) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 ${tab === t ? 'border-[var(--v-blue)] font-medium text-[var(--v-ink)]' : 'border-transparent text-[var(--v-ink-3)] hover:text-[var(--v-ink)]'}`}><I className="size-4" />{l}</button>)}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6" tabIndex={0} aria-label="Document content">
                {tab === 'md' ? <pre className="whitespace-pre-wrap rounded-lg bg-[var(--v-sunken)] p-4 font-mono text-[12.5px] leading-relaxed">{md}</pre>
                  : <article className="mx-auto max-w-[680px] text-[14.5px] leading-[1.7]">{blocks.filter(Boolean).map((b, i) => <Block key={i} b={b} r={r} openDoc={openDoc} toast={toast} />)}</article>}
              </div>
            </div>
            <aside aria-label="Record" className="overflow-y-auto border-l border-[var(--v-line)] bg-[var(--v-sunken)] px-5 py-5 text-[13px]">
              <dl className="grid grid-cols-[92px_1fr] gap-x-2 gap-y-2">
                <dt className="text-[var(--v-ink-3)]">Author</dt><dd>Delivery agent</dd>
                <dt className="text-[var(--v-ink-3)]">Approver</dt><dd className="flex items-center gap-1.5">{approver ? <><Avatar p={approver} size={18} />{PEOPLE[approver].name}</> : 'Automatic'}</dd>
                <dt className="text-[var(--v-ink-3)]">Requested by</dt><dd>{NAME[r.by] || r.by}</dd>
              </dl>
              <h3 className="mt-5 text-[12px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)]">Stored</h3>
              <ul className="mt-2 flex flex-col gap-2.5">
                <li className="flex gap-2"><HardDrive className="mt-0.5 size-4 shrink-0 text-[var(--v-ink-3)]" /><span className="min-w-0"><b className="font-medium">Azure Blob Storage</b><span className="block break-all font-mono text-[11.5px] text-[var(--v-ink-2)]">{blob}</span></span></li>
                <li className="flex gap-2"><Database className="mt-0.5 size-4 shrink-0 text-[var(--v-ink-3)]" /><span><b className="font-medium">Azure SQL</b><span className="block font-mono text-[11.5px] text-[var(--v-ink-2)]">dbo.Artifacts · id {sqlId}</span><span className="block text-[12px] text-[var(--v-ink-3)]">Versions, approvals and access</span></span></li>
                <li className="flex gap-2"><Fingerprint className="mt-0.5 size-4 shrink-0 text-[var(--v-ink-3)]" /><span><b className="font-medium">Fingerprint</b><span className="block font-mono text-[11.5px] text-[var(--v-ink-2)]"><Sha md={md} /></span><span className="block text-[12px] text-[var(--v-ink-3)]">SHA-256 of this version</span></span></li>
              </ul>
              <h3 className="mt-5 text-[12px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)]">Linked</h3>
              <ul className="mt-2 flex flex-col gap-1.5">
                <li className="flex items-center gap-2"><SquareKanban className="size-4 text-[var(--v-ink-3)]" />Azure Boards #{88000 + num(r.id) % 1000}</li>
                {stage >= 3 && <li className="flex items-center gap-2"><GitPullRequest className="size-4 text-[var(--v-ink-3)]" />{r.s.length > 4 ? `PR #${200 + num(r.id) % 50} · Azure Repos` : 'PR opens at Build'}</li>}
                {kind === 'plan' && storiesFor(r).map(s => <li key={s.n}><button onClick={() => openDoc({ run: r.id, kind: 'story', story: s.n })} className="text-left text-[var(--v-blue)] hover:underline">Story {s.n}: {s.title}</button></li>)}
                {kind === 'story' && <li><button onClick={() => openDoc({ run: r.id, kind: 'plan' })} className="text-[var(--v-blue)] hover:underline">Delivery plan</button></li>}
              </ul>
              <div className="mt-5 flex flex-col gap-2">
                {can('artifacts.export') || can('artifacts.own') ? <Button variant="outline" size="sm" className="justify-start rounded-lg" onClick={() => saveFile(`${r.id}-${story ? `story-${story.n}` : kind}-${ver}.md`, md, toast)}><Download className="size-3.5" />Download .md</Button> : null}
                <Button variant="outline" size="sm" className="justify-start rounded-lg" onClick={() => copyText(`${location.origin}${location.pathname}#v3-run-${r.id.toLowerCase()}/${story ? `story-${story.n}` : kind}`, toast, 'Link copied.')}><Link2 className="size-3.5" />Copy link</Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sha({ md }) {
  const [sha, setSha] = useState(null);
  useEffect(() => { let live = true; crypto.subtle?.digest('SHA-256', new TextEncoder().encode(md)).then(b => { if (live) setSha([...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')); }).catch(() => {}); return () => { live = false; }; }, [md]);
  return sha ? <span title={`sha256:${sha}`}>sha256:{sha.slice(0, 16)}…</span> : 'Calculating…';
}

function Block({ b, r, openDoc, toast }) {
  if (b.h) return <h3 className="mb-2 mt-6 text-[13px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)] first:mt-0">{b.h}</h3>;
  if (b.p) return <p className="mb-3">{b.p}</p>;
  if (b.callout) return <p className="mb-3 rounded-lg border-l-4 border-[var(--v-blue)] bg-[var(--v-blue-soft)] px-4 py-3">{b.callout}</p>;
  if (b.ul) return <ul className="mb-3 list-disc space-y-1 pl-5">{b.ul.map(x => <li key={x}>{x}</li>)}</ul>;
  if (b.ol) return <ol className="mb-3 list-decimal space-y-1 pl-5">{b.ol.map(x => <li key={x}>{x}</li>)}</ol>;
  if (b.code) return <div className="mb-3 overflow-hidden rounded-lg border border-[var(--v-line)]"><div className="flex items-center justify-between border-b border-[var(--v-line)] bg-[var(--v-sunken)] px-3 py-1.5 text-[12px] text-[var(--v-ink-3)]"><span>Paste into the Agent in VS Code</span><button onClick={() => copyText(b.code, toast, 'Developer prompt copied. Paste it into the Agent in VS Code.')} className="flex items-center gap-1 rounded px-1.5 py-0.5 font-medium text-[var(--v-blue)] hover:bg-[var(--v-surface)]"><Copy className="size-3.5" />Copy</button></div><pre className="whitespace-pre-wrap px-4 py-3 font-mono text-[12.5px] leading-relaxed">{b.code}</pre></div>;
  if (b.table) return <div className="mb-3 overflow-hidden rounded-lg border border-[var(--v-line)]"><table className="w-full text-[13.5px]"><thead><tr className="bg-[var(--v-sunken)] text-left text-[12.5px] text-[var(--v-ink-3)]">{b.table.head.map(h => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead><tbody>{b.table.rows.map((row, i) => <tr key={i} className="border-t border-[var(--v-line)]">{row.map((c, j) => <td key={j} className={`px-3 py-2 ${/gap|Not changed/.test(c) ? 'text-[var(--v-amber)]' : ''}`}>{c}</td>)}</tr>)}</tbody></table></div>;
  if (b.stories) return <ol className="mb-3 flex flex-col gap-2">{b.stories.map(s => <li key={s.n}><button onClick={() => openDoc({ run: r.id, kind: 'story', story: s.n })} className="flex w-full items-center gap-3 rounded-lg border border-[var(--v-line)] px-3 py-2.5 text-left hover:border-[var(--v-blue)] hover:bg-[var(--v-blue-soft)]"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--v-sunken)] text-[12px] font-semibold">{s.n}</span><span className="min-w-0 flex-1"><b className="block font-medium">{s.title}</b><span className="text-[12.5px] text-[var(--v-ink-3)]">As {s.who}, I want {s.want}</span></span><StoryBar s={s} /></button></li>)}</ol>;
  if (b.progress) return <div className="mb-3 flex items-center gap-3"><StoryBar s={b.progress} wide /><span className="text-[13px] text-[var(--v-ink-2)]">{b.progress.status}</span></div>;
  if (b.diff) return <ul className="mb-3 overflow-hidden rounded-lg border border-[var(--v-line)] font-mono text-[12.5px]">{b.diff.map(([s, t]) => <li key={t} className={`px-3 py-1.5 ${s === '+' ? 'bg-[var(--v-green-soft)]' : 'bg-[var(--v-red-soft)]'}`}><span aria-hidden>{s} </span><span className="sr-only">{s === '+' ? 'Added: ' : 'Removed: '}</span>{t}</li>)}</ul>;
  if (b.diagram) { const [a, m, z] = b.diagram; return (
    <figure className="mb-4 rounded-lg border border-[var(--v-line)] bg-[var(--v-sunken)] p-4">
      <svg viewBox="0 0 620 90" className="w-full" role="img" aria-label={`${a} uses ${m}. ${z} is not changed.`}>
        <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--v-ink-3)" /></marker></defs>
        {[[10, a, 'var(--v-blue)'], [225, m, 'var(--v-blue)'], [440, z, 'var(--v-amber)']].map(([x, t, c], i) => <g key={t}><rect x={x} y="22" width="170" height="46" rx="8" fill="var(--v-surface)" stroke={c} strokeWidth="1.5" strokeDasharray={i === 2 ? '5 4' : ''} /><text x={x + 85} y="50" textAnchor="middle" fontSize="13" fill="var(--v-ink)">{t}</text></g>)}
        <line x1="182" y1="45" x2="222" y2="45" stroke="var(--v-ink-3)" strokeWidth="1.5" markerEnd="url(#ar)" />
        <line x1="397" y1="45" x2="437" y2="45" stroke="var(--v-ink-3)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#ar)" />
      </svg>
      <figcaption className="mt-1 text-[12px] text-[var(--v-ink-3)]">Solid: changed in this request. Dashed: not changed.</figcaption>
    </figure>); }
  return null;
}

export function StoryBar({ s, wide }) {
  return <span className={`flex shrink-0 gap-1 ${wide ? 'w-48' : 'w-24'}`} aria-label={`${s.status}: ${s.prog} of 3 steps done`} role="img">{['Specify', 'Design', 'Build'].map((t, i) => <span key={t} title={t} className={`h-1.5 flex-1 rounded-full ${i < s.prog ? 'bg-[var(--v-green)]' : i === s.prog && !/Queued|Planned|Built/.test(s.status) ? 'bg-[var(--v-amber)]' : 'bg-[var(--v-line-strong)]'}`} />)}</span>;
}

// Stories card for the run page
export function StoriesCard({ r }) {
  const { openDoc } = useDoc(); const st = storiesFor(r);
  if (r.s.length < 1 || r.s[0] !== 'd' && r.s[0] !== 'w') return null;
  return (
    <section aria-labelledby="st-h" className="rounded-xl border border-[var(--v-line)] bg-[var(--v-surface)]">
      <div className="flex items-start justify-between gap-3 px-6 pt-5"><div><h2 id="st-h" className="text-[16px] font-semibold">Stories</h2><p className="text-[13px] text-[var(--v-ink-3)]">Each story is specified, designed and built one at a time.</p></div><button onClick={() => openDoc({ run: r.id, kind: 'plan' })} className="text-[13px] font-medium text-[var(--v-blue)] hover:underline">Open the plan</button></div>
      <ol className="flex flex-col gap-1 px-3 py-3">{st.map(s => <li key={s.n}><button onClick={() => openDoc({ run: r.id, kind: 'story', story: s.n })} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[var(--v-sunken)]"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--v-sunken)] text-[12px] font-semibold">{s.n}</span><span className="min-w-0 flex-1"><b className="block truncate font-medium">{s.title}</b><span className="text-[12.5px] text-[var(--v-ink-3)]">{s.status}</span></span><StoryBar s={s} /></button></li>)}</ol>
    </section>
  );
}

// Build stage: the Developer Agent is standalone and runs in VS Code. The platform prepares the assignment and tracks it.
export function DevAgentCard({ r }) {
  const { openDoc } = useDoc(); const { setDev, runs } = useProto(); const toast = useToast();
  const phase = runs[r.id]?.dev;
  useEffect(() => { if (phase === 'copied') { const t = setTimeout(() => setDev(r.id, 'working'), 2500); return () => clearTimeout(t); } }, [phase, r.id, setDev]);
  if (r.s.length < 5) return null;
  const built = r.s[4] === 'd' || r.s[4] === 'w';
  const pr = 200 + num(r.id) % 50, task = 88000 + num(r.id) % 1000, branch = `feature/${r.id.toLowerCase()}-${slug(r.t)}`;
  const steps = [
    ['Developer assignment ready', 'Handoff and prompt prepared from the approved design', true, () => openDoc({ run: r.id, kind: 'assignment' })],
    ['Developer Agent started in VS Code', built ? 'Started by Lena Brooks' : phase === 'working' ? 'Connected · last heartbeat just now' : phase === 'copied' ? 'Waiting for the agent to connect…' : 'Copy the prompt and paste it into the Agent in VS Code', built || phase === 'working', null, phase === 'copied'],
    [`Branch and Azure Boards task #${task}`, branch, built || phase === 'working', null],
    [`Pull request #${pr} in Azure Repos`, built ? 'Opened · checks green' : 'Opens when the agent finishes', built, null],
    ['Completion report received', built ? '4 files changed · 6 of 6 tests pass' : 'Comes back to the platform automatically', built, built ? () => openDoc({ run: r.id, kind: 'completion' }) : null],
  ];
  return (
    <section aria-labelledby="dev-h" className="rounded-xl border border-[var(--v-line)] bg-[var(--v-surface)]">
      <div className="flex flex-wrap items-start gap-3 px-6 pt-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--v-sunken)]"><Laptop className="size-5 text-[var(--v-ink-2)]" /></span>
        <div className="min-w-0 flex-1"><h2 id="dev-h" className="text-[16px] font-semibold">Build · Developer Agent in VS Code</h2><p className="text-[13px] text-[var(--v-ink-3)]">The agent runs standalone on the developer’s machine. The platform prepares its assignment and tracks the result.</p></div>
        {!built && phase !== 'working' && <Button className="h-9 rounded-lg" onClick={() => { copyText(devPrompt(r), toast, 'Developer prompt copied. Paste it into the Agent in VS Code.'); setDev(r.id, 'copied'); }}><Copy className="size-4" />Copy Developer prompt</Button>}
      </div>
      <ol className="flex flex-col px-6 py-4">{steps.map(([t, sub, ok, open, busy], i) => (
        <li key={t} className="relative flex gap-3 pb-3 last:pb-0">
          {i < steps.length - 1 && <span className="absolute left-[9px] top-6 h-[calc(100%-18px)] w-px bg-[var(--v-line)]" aria-hidden />}
          <span className={`relative grid size-5 shrink-0 place-items-center rounded-full ${ok ? 'bg-[var(--v-green)] text-white' : 'bg-[var(--v-surface)] text-[var(--v-ink-3)] ring-1 ring-[var(--v-line-strong)]'}`}>{ok ? <Check className="size-3" strokeWidth={3} /> : busy ? <Loader2 className="size-3 animate-spin" /> : <Circle className="size-2" />}</span>
          <div className="min-w-0 flex-1 text-[13.5px]"><div className="font-medium">{open ? <button onClick={open} className="text-left hover:text-[var(--v-blue)] hover:underline">{t}</button> : t}<span className="sr-only">{ok ? ', done' : ', not yet'}</span></div><div className="truncate text-[12.5px] text-[var(--v-ink-3)]">{sub}</div></div>
        </li>))}</ol>
    </section>
  );
}
