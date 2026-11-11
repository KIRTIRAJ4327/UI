import { Button } from '@/components/ui/button';
import SplitText from '@/components/SplitText';
import CountUp from '@/components/CountUp';
import AnimatedList from '@/components/AnimatedList';
import SpotlightCard from '@/components/SpotlightCard';
import { Shell, Card, CardHead, Pill, Avatar, Stepper } from './ui';
import { Clock, ArrowRight, Plus } from 'lucide-react';

const WAITING = [
  { id: 'WI-4821', title: 'Registered Amortization limit', ask: 'Approve the solution design', why: 'Blocks values above 310 on Product Selection. The Pricing API is not covered.', from: 'priya', wait: '12 min', s: 'dddw', href: '#v3-approve', urgent: false },
  { id: 'WI-4799', title: 'Statement export format', ask: 'Answer 2 questions', why: 'The agent needs to know the column order before writing the specification.', from: 'priya', wait: '1 h', s: 'dw', href: '#v3-clarify' },
  { id: 'WI-4807', title: 'Advisor eligibility banner', ask: 'Review the completion report', why: 'Code and 6 unit tests are ready. Jon is on leave, so this came to you.', from: 'jon', wait: '3 h', s: 'ddddw', href: '#v3-review', urgent: true },
];
const MINE = [['Fee schedule update','done','Released Tuesday','dddddddd'],['Session timeout copy','bad','2 tests failing','dddddda'],['Rate hold expiry','work','Agent is building','dddda']];
const FEED = [['agent','Design finished · WI-4821','The agent','12 min ago'],['priya','Plan approved · WI-4830','Priya Nair','40 min ago'],['agent','Fixed its own mistake · WI-4821','The agent','45 min ago'],['sam','Released · WI-4772','Sam Okafor','Tue 16:05']];

export default function V3Home() {
  return (
    <Shell active="home" crumbs={['Home']} actions={<Button className="h-9 rounded-lg px-4"><Plus className="size-4" />New request</Button>}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-7">
        <div className="flex flex-wrap items-end gap-6">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] text-[var(--v-ink-3)]">Tuesday 11 November</p>
            <SplitText text="3 decisions are waiting for you" tag="h1" splitType="words" effect="fade" delay={45} duration={0.5} textAlign="left" trigger="load" className="font-display text-[30px] font-semibold leading-tight" />
          </div>
          <dl className="flex gap-3">
            {[['In progress',7,0,''],['Released this week',4,0,''],['Average time to release',3.2,1,' days']].map(([l, v, d, suf]) => (
              <div key={l} className="rounded-xl border border-[var(--v-line)] bg-white px-4 py-2.5"><dt className="text-[12.5px] text-[var(--v-ink-3)]">{l}</dt><dd className="tnum font-display text-[20px] font-semibold"><CountUp to={v} decimals={d} suffix={suf} duration={1.2} trigger="load" /></dd></div>))}
          </dl>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6">
          <SpotlightCard theme="light" spotlightColor="rgba(36,105,188,0.18)" intensity={0.12} spotlightSize={420} borderGlow={0.35} flare={false} className="!rounded-2xl !border !border-[var(--v-line)] !bg-white !p-0 shadow-[0_1px_2px_rgba(16,20,41,.04),0_8px_24px_-12px_rgba(16,20,41,.10)]">
            <CardHead title="Waiting for you" sub="Oldest first. Each one names exactly what you are deciding." />
            <ul className="divide-y divide-[var(--v-line)] border-t border-[var(--v-line)]">
              {WAITING.map(w => (
                <li key={w.id} className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-3 px-5 py-4 hover:bg-[var(--v-sunken)]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[12px] text-[var(--v-ink-3)]">{w.id}</span><span className="text-[13px] text-[var(--v-ink-3)]">{w.title}</span>{w.urgent && <Pill tone="bad">Reassigned to you</Pill>}</div>
                    <a href={w.href} className="mt-0.5 block text-[16px] font-semibold hover:text-[var(--v-blue)]">{w.ask}</a>
                    <p className="mt-1 max-w-[62ch] text-[13.5px] text-[var(--v-ink-2)]">{w.why}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="flex items-center gap-1.5 text-[13px] text-[var(--v-amber)]"><Clock className="size-3.5" />Waiting {w.wait}</span>
                    <Button asChild className="h-9 rounded-lg"><a href={w.href}>Review<ArrowRight className="size-4" /></a></Button>
                  </div>
                  <div className="col-span-2 flex items-center gap-3"><Avatar p={w.from} size={22} /><span className="text-[12.5px] text-[var(--v-ink-3)]">from {w.from === 'priya' ? 'Priya Nair' : 'Jon Reyes'}</span><div className="ml-auto w-48"><Stepper s={w.s} compact /></div></div>
                </li>))}
            </ul>
          </SpotlightCard>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHead title="Your requests" right={<a href="#v3-new" className="text-[13px] font-medium text-[var(--v-blue)]">New</a>} />
              <ul className="flex flex-col gap-3 px-5 pb-5">
                {MINE.map(([t, tone, st, s]) => <li key={t} className="flex flex-col gap-1.5"><div className="flex items-center justify-between gap-2"><span className="truncate font-medium">{t}</span><Pill tone={tone}>{st}</Pill></div><Stepper s={s} compact /></li>)}
              </ul>
            </Card>
            <Card>
              <CardHead title="Recent activity" />
              <div className="px-2 pb-3"><AnimatedList ariaLabel="Recent activity" theme="light" frame={false} showGradients={false} displayScrollbar={false} selectOnHover={false} enableArrowNavigation={false} animateOnce width="100%" maxHeight={400} gap={2} radius={10} accentColor="#2469bc"
                items={FEED.map(([p, title, who, t]) => ({ icon: <Avatar p={p} size={30} />, title, description: `${who} · ${t}` }))} /></div>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
