import { Shell, Card, CardHead, Pill } from './ui';
import { Search, CheckCircle2, PenLine, Wrench, Save, Bell, FileText } from 'lucide-react';

const STEPS = [
  [Search,'Found the relevant rules','Searched product rules and earlier decisions. Kept 4 of 12 results.','3m 12s','done'],
  [CheckCircle2,'Checked the facts','Confirmed the maximum (310), the affected page and the validator against the specification.','1m 24s','done'],
  [PenLine,'Wrote the decision record','Drafted ADR-0173 from the approved specification and the sources.','4m 30s','done'],
  [Wrench,'Found and fixed a mistake','Its own quality check found the draft did not reference AC-3. It added the reference and checked again.','3m 06s','fix'],
  [Save,'Saved the evidence','Stored the record and sources with a tamper-evident fingerprint.','54s','done'],
  [Bell,'Asked for approval','Sent the design to Alex Kim.','42s','done'],
];
export default function V3Evidence() {
  return (
    <Shell active="evidence" crumbs={['Runs', 'WI-4821', 'How the design was made']}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
        <div><h1 className="font-display text-[28px] font-semibold">How the design was made</h1><p className="mt-1 max-w-[70ch] text-[15px] text-[var(--v-ink-2)]">Every step the agent took for the Design stage, what it used, and what it checked. Use this when you want to verify the work before approving.</p></div>
        <div className="grid grid-cols-4 gap-4">{[['Time taken','13 min 48 s'],['Sources used','4'],['Quality checks','6 of 6 passed'],['Cost','$0.21']].map(([l, v]) => <Card key={l} className="px-5 py-4"><div className="text-[13px] text-[var(--v-ink-3)]">{l}</div><div className="tnum mt-0.5 font-display text-[22px] font-semibold">{v}</div></Card>)}</div>
        <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
          <Card>
            <CardHead title="Steps" sub="In the order they happened" />
            <ol className="relative flex flex-col px-5 pb-5">
              {STEPS.map(([I, t, d, time, k], i) => (
                <li key={t} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < STEPS.length - 1 && <span aria-hidden="true" className="absolute top-10 bottom-0 left-[19px] w-0.5 bg-[var(--v-line)]" />}
                  <span className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full ${k === 'fix' ? 'bg-[var(--v-amber-soft)] text-[var(--v-amber)]' : 'bg-[var(--v-green-soft)] text-[var(--v-green)]'}`}><I className="size-[18px]" /></span>
                  <div className="min-w-0 flex-1 pt-1.5"><div className="flex items-center gap-2"><b className="font-semibold">{t}</b>{k === 'fix' && <Pill tone="wait" dot={false}>Self-corrected</Pill>}<span className="tnum ml-auto text-[13px] text-[var(--v-ink-3)]">{time}</span></div><p className="mt-0.5 text-[14px] text-[var(--v-ink-2)]">{d}</p></div>
                </li>))}
            </ol>
          </Card>
          <div className="flex flex-col gap-6">
            <Card><CardHead title="Sources" /><ul className="flex flex-col gap-1 px-3 pb-3">{[['Product rules v4','Knowledge Fabric'],['Specification v3','Approved by Priya Nair'],['ADR-0151','Earlier decision'],['amortizationValidator.js','full-application-ui']].map(([a, b]) => <li key={a} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--v-sunken)]"><FileText className="size-[18px] text-[var(--v-ink-3)]" /><div><div className="font-medium">{a}</div><div className="text-[12.5px] text-[var(--v-ink-3)]">{b}</div></div></li>)}</ul></Card>
            <Card><CardHead title="Record" sub="For audit" /><dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-5 pb-5 text-[13.5px]"><dt className="text-[var(--v-ink-3)]">Saved</dt><dd>Wed 12 Nov, 14:33</dd><dt className="text-[var(--v-ink-3)]">Fingerprint</dt><dd className="font-mono text-[12.5px]">9f2c 41ab 77e0</dd><dt className="text-[var(--v-ink-3)]">Model</dt><dd>GPT-5.4</dd><dt className="text-[var(--v-ink-3)]">Kept for</dt><dd>7 years</dd></dl></Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
