import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shell, Card, Pill, Avatar } from './ui';
import { useToast } from '@/components/friendly';
import { AlertTriangle, BookOpen, Link2, CheckCircle2 } from 'lucide-react';
import { useProto } from './store';
import { useGate, NotYours } from './gate';
import { Comments } from './collab';

const Cite = ({ n }) => <a href="#src" className="ml-0.5 rounded bg-[var(--v-blue-soft)] px-1 align-[2px] font-mono text-[10.5px] text-[var(--v-blue)]">{n}</a>;
export default function V3Approve() {
  const toast = useToast();
  const [risk, setRisk] = useState(false);
  const [note, setNote] = useState('');
  const [mode, setMode] = useState('summary');
  const { runs, approveDesign, requestDesignChanges, undo, addComment } = useProto();
  const g = useGate('WI-4821', 'gate.design');
  const run = g.run;
  const decided = g.decided;
  const go = () => { location.hash = 'v3-run-wi-4821'; };
  return (
    <Shell active="approvals" crumbs={['Approvals', 'WI-4821', 'Design']}>
      <div className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)_380px] items-start gap-6">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[var(--v-line)] px-7 py-4">
            <BookOpen className="size-5 text-[var(--v-ink-3)]" /><div className="min-w-0 flex-1"><div className="text-[12.5px] text-[var(--v-ink-3)]">Architecture decision · written by the delivery agent · quality check passed</div><div className="font-medium">ADR-0173</div></div>
            <div role="tablist" aria-label="Detail level" className="flex rounded-lg bg-[var(--v-sunken)] p-1 text-[13px]">{[['summary','Plain summary'],['full','Full technical']].map(([k, l]) => <button key={k} role="tab" aria-selected={mode === k} onClick={() => setMode(k)} className={`rounded-md px-3 py-1.5 ${mode === k ? 'bg-white font-medium shadow-sm' : 'text-[var(--v-ink-2)]'}`}>{l}</button>)}</div>
          </div>
          <article className="mx-auto max-w-[680px] px-7 py-8 text-[15.5px] leading-[1.75]">
            <h1 className="font-display text-[26px] font-semibold leading-tight">Enforce the Registered Amortization maximum on Product Selection</h1>
            {mode === 'summary' ? <>
              <h2 className="mt-7 text-[13px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)]">In one paragraph</h2>
              <p className="mt-2">Advisors will no longer be able to enter more than 310 in Registered Amortization on the Product Selection page. They will see a short message explaining the limit. The check reuses the validator the form already uses, so no new service is added<Cite n="1" />.</p>
              <div className="mt-6 flex gap-3 rounded-xl border border-[#f0d9a8] bg-[var(--v-amber-soft)] p-4"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-[var(--v-amber)]" /><div><b>The gap you are accepting</b><p className="mt-1 text-[14.5px]">The Pricing API is not changed. A system calling the API directly could still save a value above 310. Priya has suggested a follow-up request to close it.</p></div></div>
              <h2 className="mt-7 text-[13px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)]">What gets changed</h2>
              <ul className="mt-2 list-disc pl-5"><li>Product Selection form: blocks values above 310<Cite n="2" /></li><li>Shared amortization validator: gains the maximum<Cite n="3" /></li><li>One new message for advisors, and 3 new unit tests</li></ul>
            </> : <>
              <h2 className="mt-7 text-[13px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)]">Context</h2><p className="mt-2">Product rules v4 set the maximum Registered Amortization to 310<Cite n="4" />. Acceptance criterion AC-3 requires the form to block higher values and show the reason<Cite n="2" />.</p>
              <h2 className="mt-7 text-[13px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)]">Decision</h2><p className="mt-2">Add <code className="font-mono text-[13.5px]">MAX_REGISTERED_AMORTIZATION = 310</code> to <code className="font-mono text-[13.5px]">amortizationValidator.js</code> and call it from <code className="font-mono text-[13.5px]">ProductSelection.jsx</code>, following ADR-0151 (reuse shared validators)<Cite n="1" />.</p>
              <h2 className="mt-7 text-[13px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)]">Consequences</h2><p className="mt-2">Client-side enforcement only. Server-side validation in the Pricing API is out of scope for this story.</p>
            </>}
            <h2 id="src" className="mt-8 text-[13px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)]">Sources</h2>
            <ol className="mt-2 flex flex-col gap-1.5 text-[13.5px]">{['ADR-0151 · Reuse shared validators','Specification v3 · AC-3','full-application-ui · src/validation/amortizationValidator.js','Knowledge Fabric · Product rules v4'].map((s, i) => <li key={s} className="flex items-center gap-2"><span className="w-5 font-mono text-[var(--v-blue)]">{i + 1}</span><Link2 className="size-3.5 text-[var(--v-ink-3)]" />{s}</li>)}</ol>
          </article>
        </Card>

        <aside className="sticky top-24 flex flex-col gap-4">
          {g.blocked && <NotYours g={g} />}
          {decided && <Card className="p-5"><div className="flex items-center gap-2 text-[var(--v-green)]"><CheckCircle2 className="size-5" /><b>Decision recorded</b></div><p className="mt-2 text-[14px] text-[var(--v-ink-2)]">You have decided on this design. Current status: {run.now}.</p><div className="mt-4 flex flex-col gap-2"><Button asChild className="h-10 rounded-lg"><a href="#v3-run-wi-4821">Open the run</a></Button><Button asChild variant="outline" className="h-10 rounded-lg"><a href="#v3-home">Back to home</a></Button></div></Card>}
          {!decided && !g.blocked && <Card className="p-5">
            <div className="flex items-center gap-2"><Pill tone="you">Your decision</Pill><span className="text-[13px] text-[var(--v-ink-3)]">waiting {run.wait || '12 min'}</span></div>
            <h2 className="mt-3 text-[18px] font-semibold">Approve the design?</h2>
            <p className="mt-1 text-[14px] text-[var(--v-ink-2)]">If you approve, the agent starts building. Jon Reyes reviews the code next.</p>
            <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[var(--v-sunken)] p-4 text-[14px]">
              {['Scope matches the approved specification','Reuses an existing approved pattern','Unit tests are planned for each change'].map(t => <div key={t} className="flex items-start gap-2.5"><span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[var(--v-green)] text-[10px] text-white">✓</span>{t}<span className="sr-only">(checked by the platform)</span></div>)}
              <label htmlFor="risk" className="flex cursor-pointer items-start gap-2.5 border-t border-[var(--v-line)] pt-3 font-medium"><Checkbox id="risk" checked={risk} onCheckedChange={v => setRisk(!!v)} className="mt-0.5" />I accept that the Pricing API is not covered by this change</label>
            </div>
            <label htmlFor="note" className="mt-4 block text-[13.5px] font-medium">Note for the team <span className="font-normal text-[var(--v-ink-3)]">(optional)</span></label>
            <textarea id="note" rows={2} value={note} onChange={e => setNote(e.target.value)} aria-describedby="note-help" placeholder="e.g. Please raise a follow-up for the API." className="mt-1.5 w-full rounded-lg border border-[var(--v-line)] p-2.5 text-[14px] outline-none focus:border-[var(--v-blue)] focus:ring-4 focus:ring-[var(--v-blue)]/15" />
            <p id="note-help" className="mt-1 text-[12.5px] text-[var(--v-ink-3)]">Optional to approve. Required to request changes; it is added to the discussion.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button disabled={!risk} onClick={() => { if (note.trim()) addComment('WI-4821', note.trim()); const t = approveDesign(); toast('Design approved. The agent has started building.', () => undo(t)); go(); }} className="h-11 rounded-lg text-[15px]">Approve design</Button>
              {!risk && <p className="text-center text-[12.5px] text-[var(--v-ink-3)]">Tick the risk above to approve</p>}
              <Button variant="outline" disabled={note.trim().length < 5} title={note.trim().length < 5 ? 'Add a note saying what should change' : undefined} onClick={() => { addComment('WI-4821', `Changes requested: ${note.trim()}`); const t = requestDesignChanges(); toast('Sent back to the agent with your note.', () => undo(t)); go(); }} className="h-11 rounded-lg text-[15px]">Request changes</Button>
            </div>
          </Card>}
          <Comments id="WI-4821" />
        </aside>
      </div>
    </Shell>
  );
}
