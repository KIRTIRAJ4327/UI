// K · Command console: delegate in one line; the platform answers with live UI, not pages.
import { Button } from '@/components/ui/button';
import { Shell, Tag, Kbd } from '@/components/kit';
import { Track, GateGlyph, Narration, Evidence } from '@/components/signature';
const Cmd = ({ children, t }) => <div className="flex items-baseline gap-3 font-mono text-[13px]"><span className="text-brand">›</span><span className="text-ink">{children}</span><span className="ml-auto text-[11px] text-[#8a887f]">{t}</span></div>;
export default function CommandConsole() {
  return (
    <Shell rail={false} title="Console">
      <div className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-6 px-6 py-8">
        <section className="space-y-3">
          <Cmd t="09:12">what needs me today</Cmd>
          <div className="border border-border bg-white">
            {[['Solution Architect','Approve design · WI-4821','12m','dddw'],['Product Owner','2 questions · WI-4799','1h','ddw'],['Engineering Lead','Completion report · WI-4807','3h','ddddw']].map(([g,t,a,s],i)=><div key={i} className="grid grid-cols-[22px_1fr_200px_44px] items-center gap-3 border-b border-border px-4 py-2.5 last:border-0"><GateGlyph state="waiting" className="size-3.5"/><div><b>{t}</b><div className="text-[12px] text-[#77756e]">{g} gate</div></div><Track s={s} size="sm"/><span className="text-right font-mono text-[12px]">{a}</span></div>)}
          </div>
        </section>
        <section className="space-y-3">
          <Cmd t="09:14">approve 4821 design</Cmd>
          <div className="border-l-4 border-gate bg-white p-4">
            <Narration className="text-[16px]">Before I approve: this design leaves the <b>Pricing API</b> able to accept values above 310. Do you accept that gap?</Narration>
            <div className="mt-3 flex gap-2"><Button size="sm">Yes, approve with gap <Kbd>Y</Kbd></Button><Button size="sm" variant="outline">No, widen scope to API <Kbd>N</Kbd></Button><Button size="sm" variant="ghost">Show ADR-0173</Button></div>
          </div>
        </section>
        <section className="space-y-3">
          <Cmd t="09:15">why is 4790 failing</Cmd>
          <div className="border border-border bg-white p-4">
            <Narration className="text-[16px]">Two regression tests expect the old 20-minute timeout. The change set it to 15 minutes, as the spec requires, so the <b>tests are out of date, not the code</b>.</Narration>
            <table className="mt-3 w-full text-[12.5px]"><tbody>{[['session.spec.js › warns at 18 min','expected 18, got 13'],['logout.spec.js › auto logout','expected 20, got 15']].map(([a,b])=><tr key={a} className="border-t border-border"><td className="py-1.5 font-mono">{a}</td><td className="text-red-700">{b}</td></tr>)}</tbody></table>
            <Evidence className="mt-3" items={['spec-v2 · AC-1 (15 min)','CI run #5521','Agent retried 1 of 3']}/>
            <div className="mt-3 flex gap-2"><Button size="sm">Let the agent update the tests</Button><Button size="sm" variant="outline">Assign to Jon R.</Button></div>
          </div>
        </section>
        <div className="h-4"/>
        <div className="sticky bottom-16 mt-auto border-2 border-ink bg-white shadow-[0_8px_0_#101429]">
          <div className="flex items-center gap-3 px-4 py-3 font-mono text-[14px]"><span className="text-brand">›</span><span>start: block advisors from saving a Registered Amortization above 310 on the API too<span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-ink align-middle"/></span></div>
          <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-2 text-[12px]">{['approve …','why is … failing','start: …','show trace …','who is holding …','what changed in rule …'].map(s=><span key={s} className="border border-border bg-paper px-2 py-0.5 font-mono">{s}</span>)}<span className="ml-auto text-[#8a887f]"><Kbd>↵</Kbd> run · <Kbd>Tab</Kbd> complete</span></div>
        </div>
      </div>
    </Shell>
  );
}
