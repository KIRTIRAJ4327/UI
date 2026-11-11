import { Button } from '@/components/ui/button';
import { Shell, Card, CardHead, Pill, Avatar, Stepper } from './ui';
import { FileText, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

const DOCS = [['Delivery plan','Plan','Approved by Priya',true],['Specification · 8 acceptance criteria','Specify','Approved by Priya',true],['Impact assessment','Impact','Checked automatically',true],['Architecture decision ADR-0173','Design','Waiting for you',false]];
export default function V3Run() {
  return (
    <Shell active="run" crumbs={['Runs', 'WI-4821']} actions={<Button variant="outline" className="h-9 rounded-lg">Pause run</Button>}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
        <div className="flex flex-wrap items-start gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2"><span className="font-mono text-[12.5px] text-[var(--v-ink-3)]">WI-4821 · Full Application</span><Pill tone="you">Waiting for you</Pill></div>
            <h1 className="mt-1 font-display text-[28px] font-semibold">Registered Amortization limit</h1>
            <p className="mt-1 max-w-[70ch] text-[15px] text-[var(--v-ink-2)]">Stop advisors entering a Registered Amortization above 310 on the Product Selection page.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--v-line)] bg-white px-4 py-3"><Avatar p="priya" size={34} /><div className="leading-tight"><div className="text-[12.5px] text-[var(--v-ink-3)]">Requested by</div><div className="font-medium">Priya Nair</div></div><div className="mx-2 h-8 w-px bg-[var(--v-line)]" /><div className="leading-tight"><div className="text-[12.5px] text-[var(--v-ink-3)]">Expected release</div><div className="font-medium">Thu 13 Nov</div></div></div>
        </div>

        <Card className="px-6 py-6"><Stepper s="dddw" /></Card>

        <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
          <Card className="overflow-hidden">
            <div className="flex items-start gap-4 border-b border-[#f0d9a8] bg-[var(--v-amber-soft)] px-6 py-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[var(--v-amber)]"><AlertTriangle className="size-5" /></span>
              <div className="min-w-0 flex-1"><h2 className="text-[17px] font-semibold">Design is ready for your approval</h2><p className="mt-0.5 text-[14px] text-[var(--v-ink-2)]">The agent proposes enforcing the limit in the form only. One risk needs your judgement before Build can start.</p></div>
              <Button asChild className="h-10 shrink-0 rounded-lg px-5"><a href="#v3-approve">Review design<ArrowRight className="size-4" /></a></Button>
            </div>
            <div className="grid grid-cols-3 divide-x divide-[var(--v-line)]">
              {[['What changes','Product Selection blocks values above 310 and explains why.'],['What does not','The Pricing API and batch import still accept any value.'],['If you approve','The agent builds it with unit tests, about 20 minutes, then Jon reviews.']].map(([h, t]) => <div key={h} className="px-6 py-5"><h3 className="text-[13px] font-semibold text-[var(--v-ink-3)]">{h}</h3><p className="mt-1 text-[14.5px] leading-relaxed">{t}</p></div>)}
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHead title="Documents" sub="Created at each stage" />
              <ul className="flex flex-col px-3 pb-3">{DOCS.map(([t, st, by, ok]) => <li key={t}><a href={ok ? '#v3-evidence' : '#v3-approve'} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-[var(--v-sunken)]"><FileText className="size-[18px] shrink-0 text-[var(--v-ink-3)]" /><div className="min-w-0 flex-1"><div className="truncate font-medium">{t}</div><div className="text-[12.5px] text-[var(--v-ink-3)]">{st} · {by}</div></div>{ok ? <CheckCircle2 className="size-4 text-[var(--v-green)]" /> : <span className="size-2 rounded-full bg-[#e0a000]" />}</a></li>)}</ul>
            </Card>
            <Card>
              <CardHead title="Stories" />
              <ul className="flex flex-col gap-3 px-5 pb-5">{[['Block values above 310','Design · waiting for you','you'],['Show the reason inline','Design · agent working','work']].map(([t, s, tone]) => <li key={t} className="flex items-center justify-between gap-2"><span className="font-medium">{t}</span><Pill tone={tone}>{s.split(' · ')[1].replace(/^./, c => c.toUpperCase())}</Pill></li>)}</ul>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
