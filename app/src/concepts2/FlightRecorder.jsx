// J · Flight recorder: the agent's real trace for a stage, scrubbable, with what it saw at each moment.
import { Shell, Tag } from '@/components/kit';
import { Track, Evidence } from '@/components/signature';
import { cn } from '@/lib/utils';
const T = 14; // minutes
const SPANS = [
  [0,'Find the right knowledge',0,3.2,'search','Knowledge Fabric · 14 queries'],
  [1,'Search product rules',0.2,1.4,'tool','12 hits · 4 kept'],
  [1,'Search previous ADRs',1.5,2.9,'tool','ADR-0151 reused'],
  [0,'Check the information',3.2,4.6,'check','3 facts verified'],
  [0,'Prepare the result',4.6,9.1,'llm','ADR draft · 2,140 tokens'],
  [0,'Review quality',9.1,10.4,'check','1 issue: AC-3 not referenced'],
  [0,'Correct issues',10.4,12.2,'fix','Added AC-3 link · re-checked'],
  [0,'Save evidence',12.2,13.1,'save','adr-0173.md · hash 9f2c…'],
  [0,'Prepare next step',13.1,13.8,'save','Gate opened for Solution Architect'],
];
const C = { search:'bg-brand/70', tool:'bg-brand/40', check:'bg-done/70', llm:'bg-ink/80', fix:'bg-gate', save:'bg-[#8a887f]' };
const AT = 10.9;
export default function FlightRecorder() {
  return (
    <Shell active="runs" title="Flight recorder · WI-4821">
      <div className="border-b border-border bg-white px-6 py-3"><Track s="dddw"/></div>
      <div className="flex items-center gap-2 border-b border-border bg-white px-6 py-2">{['Plan','Specify','Impact','Design'].map((s,i)=><button key={s} className={cn('px-3 py-1', i===3 ? 'bg-ink text-white' : 'text-[#5d5c58] hover:bg-black/5')}>{s}</button>)}<span className="ml-auto font-mono text-[12px] text-[#5d5c58]">Design · 13m 48s · 9 steps · 6,410 tokens · $0.21 · 1 self-correction</span></div>
      <div className="grid flex-1 grid-cols-[1fr_380px]">
        <section className="p-6">
          <div className="relative ml-[220px] mb-2 flex justify-between font-mono text-[10.5px] text-[#8a887f]">{[0,2,4,6,8,10,12,14].map(m=><span key={m}>{m}m</span>)}</div>
          <div className="relative">
            {SPANS.map(([d,l,s,e,k,note],i)=>(
              <div key={i} className="flex h-9 items-center border-b border-border/60">
                <div className="w-[220px] shrink-0 truncate pr-2 text-[12.5px]" style={{ paddingLeft: d*18 }}>{d ? '└ ' : ''}{l}</div>
                <div className="relative h-full flex-1"><span className={cn('absolute top-2.5 h-4', C[k])} style={{ left: (s/T*100)+'%', width: ((e-s)/T*100)+'%' }}/><span className={cn('absolute top-2.5 whitespace-nowrap font-mono text-[10.5px] text-[#5d5c58]', e/T > .6 ? 'pr-1 text-right' : 'pl-1')} style={e/T > .6 ? { right: (100 - s/T*100)+'%' } : { left: (e/T*100)+'%' }}>{note}</span></div>
              </div>))}
            <div className="pointer-events-none absolute top-[-28px] bottom-0 w-0.5 bg-red-700" style={{ left: `calc(220px + (100% - 220px) * ${AT/T})` }}><span className="absolute -top-1 left-1 bg-red-700 px-1 font-mono text-[10px] text-white">10:54</span></div>
          </div>
          <input type="range" min="0" max="14" step="0.1" defaultValue={AT} aria-label="Scrub trace" className="mt-4 ml-[220px] w-[calc(100%-220px)] accent-[#b42d38]"/>
          <p className="mt-3 font-serif text-[15px] italic text-[#5d5c58]">The 7-step checklist from the current console, replaced by what the agent actually did and for how long.</p>
        </section>
        <aside className="space-y-4 border-l border-border bg-white p-5">
          <div><div className="font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">At 10m 54s</div><b className="text-[15px]">Correct issues</b> <Tag tone="warn">self-correction</Tag></div>
          <div><div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">What the agent saw</div><pre className="whitespace-pre-wrap border border-border bg-paper p-3 font-mono text-[11.5px] leading-5">{`quality_review:
  result: fail
  rule: every decision cites an acceptance criterion
  missing: AC-3 (block above max, show reason)`}</pre></div>
          <div><div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">What it did</div><p className="font-serif text-[15px]">Added the AC-3 reference to the Decision section and ran the quality review again. It passed at 12m 10s.</p></div>
          <Evidence items={['spec-v3 · AC-3','Quality rule QR-12','Diff +2 lines']}/>
          <div className="flex gap-2 pt-2"><button className="border border-border px-3 py-1.5 hover:bg-paper">Show prompt</button><button className="border border-border px-3 py-1.5 hover:bg-paper">Show raw output</button></div>
        </aside>
      </div>
    </Shell>
  );
}
