// D · Narrated run: the run told as a short story, with evidence under every claim.
import { Button } from '@/components/ui/button';
import { Shell, Tag, Panel, Title } from '@/components/kit';
import { Track, GateGlyph, Narration, Evidence, Trace } from '@/components/signature';
import { REQUEST, TRACE } from '@/data';
const CH = [
  ['Tue 14:02','Plan','The request became one objective and two stories. Priya approved the plan without changes.',['4 sources','Plan quality check passed']],
  ['Tue 16:20','Specify','Eight acceptance criteria were written. Two questions came back; Priya confirmed renewals are included.',['spec-v3','2 clarifications on record']],
  ['Wed 11:05','Impact','Only the Product Selection page, the shared validator and one test suite are touched. No other portal is affected.',['1 repository','3 components','Baseline build green']],
];
export default function NarratedRun() {
  return (
    <Shell active="runs" title={<div className="flex items-center gap-2"><Title>Registered Amortization limit</Title><span className="font-mono text-[11px] text-white/60">WI-4821</span></div>} actions={<Button variant="secondary">Stop run</Button>}>
      <div className="border-b border-border bg-white px-8 py-4"><Track s="dddw" /></div>
      <div className="grid grid-cols-[1fr_340px] items-start gap-8 px-8 py-6">
        <article className="max-w-[720px]">
          {CH.map(([t,st,txt,ev])=>(
            <section key={st} className="grid grid-cols-[88px_1fr] gap-4 pb-6">
              <div className="pt-1 text-right"><div className="font-mono text-[11px] text-[#65635c]">{t}</div><div className="mt-0.5 flex items-center justify-end gap-1 text-[12px] text-done"><GateGlyph state="passed" className="size-3"/>{st}</div></div>
              <div><Narration>{txt}</Narration><Evidence items={ev} className="mt-2"/></div>
            </section>))}
          <section className="grid grid-cols-[88px_1fr] gap-4 pb-6">
            <div className="pt-1 text-right"><div className="font-mono text-[11px] text-[#65635c]">Now</div><div className="mt-0.5 flex items-center justify-end gap-1 text-[12px] font-semibold text-gate"><GateGlyph state="waiting" className="size-3"/>Design</div></div>
            <div className="border-l-4 border-gate bg-white p-5">
              <Narration>The design is ready, and this is where the run stops for you. The agent recommends checking the limit in the form only. <span className="bg-gate-soft">The API will still accept values above 310</span> until a follow-up story fixes it.</Narration>
              <Evidence items={['ADR-0173','9 sources','Quality check passed']} className="mt-3"/>
              <div className="mt-4 flex gap-2"><Button>Approve gate</Button><Button variant="outline">Send back with changes</Button><Button variant="ghost">Read ADR-0173</Button></div>
            </div>
          </section>
          <section className="grid grid-cols-[88px_1fr] gap-4 text-[#65635c]"><div className="text-right font-mono text-[11px]">Next</div><p className="font-serif italic">After approval, the agent builds the change and its unit tests. This usually takes about 20 minutes.</p></section>
        </article>
        <aside className="sticky top-16 space-y-4">
          <Panel title="The request"><p className="p-4 font-serif text-[15px] leading-relaxed">“{REQUEST}”</p></Panel>
          <Panel title="Rule trace · ≤ 310"><Trace steps={TRACE} className="p-4"/></Panel>
          <Panel title="Connected"><ul className="space-y-1.5 p-4 text-[12.5px]"><li>Azure Boards · Task #8812</li><li>Repo · full-application-ui</li><li>Knowledge Fabric · 9 sources</li></ul></Panel>
        </aside>
      </div>
    </Shell>
  );
}
