// K · Command console: type what you want in plain words; answers arrive as working cards.
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Kbd } from '@/components/kit';
import { Track, GateGlyph, Narration, Evidence } from '@/components/signature';
import { useToast } from '@/components/friendly';
const Cmd = ({ children, t }) => <div className="flex items-baseline gap-3 font-mono text-[13px]"><span className="text-brand" aria-hidden="true">›</span><span className="text-ink">{children}</span><span className="ml-auto text-[11px] text-[#5c5a54]">{t}</span></div>;
const SUGGEST = [['What needs me?','what needs me today'],['Approve a run','approve 4821 design'],['Why is a run failing?','why is 4790 failing'],['Start a new request','start: '],['Who is holding a run?','who is holding 4799']];
export default function CommandConsole() {
  const toast = useToast();
  const [q, setQ] = useState('start: block advisors from saving a Registered Amortization above 310 on the API too');
  const [extra, setExtra] = useState([]);
  const input = useRef(null);
  const run = e => { e.preventDefault(); if (!q.trim()) return; setExtra(x => [...x, q]); setQ(''); };
  return (
    <Shell rail={false} title="Ask or delegate">
      <div className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-6 px-6 py-8">
        <p className="font-serif text-[16px] italic text-[#45433e]">Type what you want in plain words. Answers come back as cards you can act on. Nothing happens without your confirmation.</p>
        <section className="space-y-3">
          <Cmd t="09:12">what needs me today</Cmd>
          <div className="border border-border bg-white">
            {[['Solution Architect','Approve design · WI-4821','12m','dddw'],['Product Owner','2 questions · WI-4799','1h','ddw'],['Engineering Lead','Completion report · WI-4807','3h','ddddw']].map(([g,t,a,s],i)=><div key={i} className="grid grid-cols-[22px_1fr_200px_70px] items-center gap-3 border-b border-border px-4 py-2.5 last:border-0"><GateGlyph state="waiting" className="size-3.5"/><div><b>{t}</b><div className="text-[12px] text-[#45433e]">waiting on {g}</div></div><Track s={s} size="sm"/><span className="text-right text-[12px] text-[#45433e]">waiting {a}</span></div>)}
          </div>
        </section>
        <section className="space-y-3">
          <Cmd t="09:14">approve 4821 design</Cmd>
          <div className="border-l-4 border-gate bg-white p-4">
            <Narration className="text-[16px]">Before I approve: this design leaves the <b>Pricing API</b> able to accept values above 310. Do you accept that gap?</Narration>
            <div className="mt-3 flex gap-2"><Button size="sm" onClick={()=>toast('WI-4821 design approved. API gap recorded as an accepted risk.')}>Yes, approve and accept the gap</Button><Button size="sm" variant="outline" onClick={()=>toast('Sent back: the agent will add the Pricing API to the scope.')}>No, include the API</Button><Button size="sm" variant="ghost">Read the decision record</Button></div>
          </div>
        </section>
        <section className="space-y-3">
          <Cmd t="09:15">why is 4790 failing</Cmd>
          <div className="border border-border bg-white p-4">
            <Narration className="text-[16px]">Two older tests still expect a 20-minute timeout. The change sets it to 15 minutes, as the spec requires, so the <b>tests are out of date, not the code</b>.</Narration>
            <table className="mt-3 w-full text-[12.5px]"><caption className="sr-only">Failing tests</caption><tbody>{[['session.spec.js › warns at 18 min','expected 18, got 13'],['logout.spec.js › auto logout','expected 20, got 15']].map(([a,b])=><tr key={a} className="border-t border-border"><td className="py-1.5 font-mono">{a}</td><td className="text-red-700">{b}</td></tr>)}</tbody></table>
            <Evidence className="mt-3" items={['Spec v2 · AC-1 (15 min)','CI run #5521','Agent retried 1 of 3 times']}/>
            <div className="mt-3 flex gap-2"><Button size="sm" onClick={()=>toast('The agent will update the 2 tests and re-run validation.')}>Let the agent update the tests</Button><Button size="sm" variant="outline" onClick={()=>toast('Assigned to Jon R.')}>Assign to Jon R.</Button></div>
          </div>
        </section>
        {extra.map((c,i)=><section key={i} className="space-y-3"><Cmd t="now">{c}</Cmd><div className="border border-border bg-white p-4"><Narration className="text-[16px]">{c.startsWith('start:') ? <>I drafted a request from that. <b>Review the plan</b> before anything starts.</> : <>Looking into it. I’ll answer here.</>}</Narration>{c.startsWith('start:') && <div className="mt-3 flex gap-2"><Button size="sm">Review the draft plan</Button><Button size="sm" variant="ghost" onClick={()=>setExtra(x=>x.filter((_,j)=>j!==i))}>Discard</Button></div>}</div></section>)}
        <form onSubmit={run} className="sticky bottom-16 mt-auto border-2 border-ink bg-white shadow-[0_6px_0_#101429]">
          <label className="flex items-center gap-3 px-4 py-3"><span className="font-mono text-brand" aria-hidden="true">›</span><span className="sr-only">Command</span>
            <input ref={input} value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask a question or tell the platform what to do…" className="flex-1 bg-transparent font-mono text-[14px] outline-none placeholder:text-[#6f6d66]"/>
            <Button type="submit" size="sm">Send</Button></label>
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border px-4 py-2 text-[12px]"><span className="text-[#45433e]">Try:</span>{SUGGEST.map(([l,c])=><button type="button" key={l} onClick={()=>{setQ(c); input.current?.focus();}} className="border border-border bg-paper px-2 py-0.5 hover:border-brand">{l}</button>)}<span className="ml-auto text-[#45433e]"><Kbd>↵</Kbd> send</span></div>
        </form>
      </div>
    </Shell>
  );
}
