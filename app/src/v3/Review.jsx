// Build gate: review the developer completion report and the code change before integration.
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Card, CardHead, Pill, Stepper } from './ui';
import { useToast } from '@/components/friendly';
import { CheckCircle2, FileCode2, GitPullRequest } from 'lucide-react';
import { useProto } from './store';
import { useGate, NotYours } from './gate';

const FILES = [
  ['src/advisor/EligibilityBanner.jsx', '+42 −0', [
    ['ctx', 'import { useAdvisor } from "../session";'],
    ['add', 'export function EligibilityBanner() {'],
    ['add', '  const { age, licenceActive } = useAdvisor();'],
    ['add', '  if (age >= 18 && licenceActive) return null;'],
    ['add', '  return <Banner tone="warning">{t("eligibility.blocked")}</Banner>;'],
    ['add', '}'],
  ]],
  ['src/advisor/Dashboard.jsx', '+2 −0', [['ctx', '<Header />'], ['add', '<EligibilityBanner />'], ['ctx', '<ClientList />']]],
  ['src/i18n/en.json', '+1 −0', [['add', '"eligibility.blocked": "You can view clients but cannot submit applications until your licence is active."']]],
  ['src/advisor/EligibilityBanner.test.jsx', '+58 −0', null],
];
const CHECKS = [['Unit tests', '6 of 6 passed'], ['Baseline build', 'Green before and after'], ['Scope', 'Only files named in the design were changed'], ['Lint and formatting', 'No issues'], ['Accessibility', 'Banner announced to screen readers']];

export default function V3Review() {
  const toast = useToast();
  const { runs, approveBuild, requestBuildChanges, undo } = useProto();
  const g = useGate('WI-4807', 'gate.build');
  const run = g.run;
  const decided = g.decided;
  const go = () => { location.hash = 'v3-run-wi-4807'; };
  const [open, setOpen] = useState(0);
  return (
    <Shell active="approvals" crumbs={['Approvals', 'WI-4807', 'Code review']}>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6">
        <div className="flex flex-wrap items-start gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2"><span className="font-mono text-[12.5px] text-[var(--v-ink-3)]">WI-4807 · Advisor Portal</span><Pill tone="you">Build · reassigned to you</Pill></div>
            <h1 className="mt-1 font-display text-[28px] font-semibold">Review the code for the eligibility banner</h1>
            <p className="mt-1 max-w-[72ch] text-[15px] text-[var(--v-ink-2)]">The agent built the approved design and tested it. You are the named backup for Jon Reyes, who is on leave, so you can approve this build even though your role is Solution Architect. If you approve, the change moves to integration.</p>
          </div>
          <div className="w-56 pt-2"><Stepper s="ddddw" compact /><div className="mt-1.5 text-[12.5px] text-[var(--v-ink-3)]">Stage 5 of 8 · Build</div></div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHead title="What was built" />
              <p className="px-5 pb-4 text-[14.5px] leading-relaxed">Advisors who are under 18 or whose licence is not active now see a warning banner on their dashboard. They can still view clients but cannot submit applications. Four files changed: one new component, one line on the dashboard, one message, and a test file.</p>
            </Card>
            <Card className="overflow-hidden">
              <CardHead title="Changed files" sub="4 files · +103 lines" right={<a href="#v3-review" className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--v-blue)]"><GitPullRequest className="size-4" />Pull request #214</a>} />
              <ul className="border-t border-[var(--v-line)]">
                {FILES.map(([f, n, lines], i) => (
                  <li key={f} className="border-b border-[var(--v-line)] last:border-0">
                    <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-[var(--v-sunken)]"><FileCode2 className="size-4 text-[var(--v-ink-3)]" /><span className="font-mono text-[13px]">{f}</span><span className="ml-auto font-mono text-[12.5px] text-[var(--v-green)]">{n}</span></button>
                    {open === i && (lines ? <pre className="overflow-x-auto border-t border-[var(--v-line)] bg-[#fbfcfb] py-2 font-mono text-[12.5px] leading-6">{lines.map(([k, l], j) => <div key={j} className={`px-5 ${k === 'add' ? 'bg-[var(--v-green-soft)]' : ''}`}><span className="mr-3 inline-block w-3 select-none text-[var(--v-ink-3)]">{k === 'add' ? '+' : ' '}</span>{l}</div>)}</pre>
                      : <p className="border-t border-[var(--v-line)] px-5 py-3 text-[13px] text-[var(--v-ink-2)]">6 tests covering under 18, inactive licence, both conditions and the eligible case.</p>)}
                  </li>))}
              </ul>
            </Card>
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardHead title="Automatic checks" right={<Pill tone="done">All passed</Pill>} />
              <ul className="flex flex-col gap-2.5 px-5 pb-5">{CHECKS.map(([a, b]) => <li key={a} className="flex items-start gap-2.5 text-[13.5px]"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--v-green)]" /><span><b className="font-medium">{a}</b><span className="block text-[var(--v-ink-2)]">{b}</span></span></li>)}</ul>
            </Card>
            {g.blocked && <NotYours g={g} />}
          {decided && <Card className="p-5"><div className="flex items-center gap-2 text-[var(--v-green)]"><CheckCircle2 className="size-5" /><b>Decision recorded</b></div><p className="mt-2 text-[14px] text-[var(--v-ink-2)]">You have decided on this build. Current status: {run.now}.</p><div className="mt-4 flex flex-col gap-2"><Button asChild className="h-10 rounded-lg"><a href="#v3-run-wi-4807">Open the run</a></Button><Button asChild variant="outline" className="h-10 rounded-lg"><a href="#v3-home">Back to home</a></Button></div></Card>}
            {!decided && !g.blocked && <Card className="p-5">
              <h2 className="text-[17px] font-semibold">Approve the build?</h2>
              <p className="mt-1 text-[13.5px] text-[var(--v-ink-2)]">Next: Tom Iverson runs integration on the merge commit.</p>
              <label htmlFor="rnote" className="mt-4 block text-[13.5px] font-medium">Comment <span className="font-normal text-[var(--v-ink-3)]">(optional)</span></label>
              <textarea id="rnote" rows={2} className="mt-1.5 w-full rounded-lg border border-[var(--v-line)] p-2.5 text-[14px] outline-none focus:border-[var(--v-blue)] focus:ring-4 focus:ring-[var(--v-blue)]/15" />
              <div className="mt-4 flex flex-col gap-2"><Button onClick={() => { const t = approveBuild(); toast('Build approved. Integration has started.', () => undo(t)); go(); }} className="h-11 rounded-lg text-[15px]">Approve build</Button><Button variant="outline" onClick={() => { const t = requestBuildChanges(); toast('Sent back to the agent with your comment.', () => undo(t)); go(); }} className="h-11 rounded-lg text-[15px]">Request changes</Button></div>
            </Card>}
          </aside>
        </div>
      </div>
    </Shell>
  );
}
