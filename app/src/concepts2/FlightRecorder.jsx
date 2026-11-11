// J · Agent activity (flight recorder): the agent's real steps for a stage.
// Drag the time slider or click a step to see what the agent saw and did at that moment.
import { useState } from 'react';
import { Shell, Tag } from '@/components/kit';
import { Track, Evidence } from '@/components/signature';
import { NextStep, HowToRead } from '@/components/friendly';
import { cn } from '@/lib/utils';
const T = 14; // minutes
// [depth, label, start, end, kind, note, saw, did, evidence]
const SPANS = [
  [0,'Find the right knowledge',0,3.2,'search','14 searches','The request text and the Full Application product rules index.','Searched the Knowledge Fabric for rules about Registered Amortization and kept 4 relevant results.',['Knowledge Fabric','4 of 12 results kept']],
  [1,'Search product rules',0.2,1.4,'tool','4 kept','12 product-rule documents mentioning amortization.','Kept the 4 that define the maximum (310) and the error behaviour.',['Product rules v4']],
  [1,'Search previous decisions',1.5,2.9,'tool','ADR-0151 reused','Earlier architecture decisions for form validation.','Found ADR-0151, which says to reuse shared validators, and followed it.',['ADR-0151']],
  [0,'Check the information',3.2,4.6,'check','3 facts checked','The maximum (310), the affected page, and the shared validator.','Confirmed all three facts against the approved spec and the code.',['spec-v3','Repository scan']],
  [0,'Write the decision record',4.6,9.1,'llm','ADR draft','Approved spec, impact assessment and the sources above.','Drafted ADR-0173: enforce the limit in the form using the shared validator.',['2,140 tokens']],
  [0,'Review quality',9.1,10.4,'check','1 issue found','Quality rule QR-12: every decision must cite an acceptance criterion.','Found that the draft did not reference AC-3 (block above max, show reason).',['Quality rule QR-12']],
  [0,'Fix its own mistake',10.4,12.2,'fix','AC-3 added','The failed quality check and acceptance criterion AC-3.','Added the AC-3 reference to the Decision section and ran the quality review again. It passed at 12m 10s.',['spec-v3 · AC-3','Diff +2 lines']],
  [0,'Save evidence',12.2,13.1,'save','adr-0173.md saved','The approved draft and all sources used.','Saved the record and its evidence with a tamper-evident hash.',['hash 9f2c…']],
  [0,'Ask for approval',13.1,13.8,'save','Gate opened','The saved record.','Opened the Solution Architect gate and notified Alex K.',['Notification sent']],
];
const C = { search:'bg-brand/70', tool:'bg-brand/40', check:'bg-done/70', llm:'bg-ink/80', fix:'bg-gate', save:'bg-[#6f6d66]' };
const fmt = m => `${Math.floor(m)}m ${String(Math.round((m % 1) * 60)).padStart(2,'0')}s`;
export default function FlightRecorder() {
  const [at, setAt] = useState(10.9);
  const cur = SPANS.findLast(x => x[2] <= at && at < x[3]) || SPANS[SPANS.length - 1];
  return (
    <Shell active="runs" title="Agent activity · WI-4821">
      <NextStep>Nothing needs you here. Use this screen to check how the agent reached its result before you approve.</NextStep>
      <div className="border-b border-border bg-white px-6 py-3"><Track s="dddw"/></div>
      <div className="flex items-center gap-2 border-b border-border bg-white px-6 py-2"><span className="text-[#45433e]">Stage:</span>{['Plan','Specify','Impact','Design'].map((s,i)=><button key={s} aria-pressed={i===3} className={cn('px-3 py-1', i===3 ? 'bg-ink text-white' : 'text-[#45433e] hover:bg-black/5')}>{s}</button>)}<span className="ml-auto text-[13px] text-[#45433e]">Took 13m 48s · 9 steps · cost $0.21 · fixed 1 of its own mistakes</span></div>
      <div className="grid flex-1 grid-cols-[1fr_380px]">
        <section className="p-6">
          <HowToRead className="mb-4" items={[['Bars','Each bar is one step the agent took; its length is how long it took.'],['Indented steps','Smaller steps inside a bigger one.'],['Red line','The moment you are looking at. Drag the slider or click a step to move it.'],['Orange bar','The agent found a problem in its own work and fixed it.']]}/>
          <div className="relative ml-[220px] mb-2 flex justify-between font-mono text-[11px] text-[#5c5a54]">{[0,2,4,6,8,10,12,14].map(m=><span key={m}>{m}m</span>)}</div>
          <div className="relative">
            {SPANS.map(([d,l,s,e,k,note],i)=>(
              <button key={i} onClick={()=>setAt(s+0.05)} aria-current={SPANS[i]===cur} className={cn('flex h-9 w-full items-center border-b border-border/60 text-left hover:bg-white', SPANS[i]===cur && 'bg-white')}>
                <span className="w-[220px] shrink-0 truncate pr-2 text-[13px]" style={{ paddingLeft: d*18 }}>{d ? '└ ' : ''}{l}</span>
                <span className="relative h-full flex-1"><span className={cn('absolute top-2.5 h-4', C[k])} style={{ left: (s/T*100)+'%', width: ((e-s)/T*100)+'%' }}/><span className={cn('absolute top-2.5 whitespace-nowrap font-mono text-[11px] text-[#45433e]', e/T > .6 ? 'pr-1 text-right' : 'pl-1')} style={e/T > .6 ? { right: (100 - s/T*100)+'%' } : { left: (e/T*100)+'%' }}>{note}</span></span>
              </button>))}
            <div className="pointer-events-none absolute top-[-28px] bottom-0 w-0.5 bg-red-700" style={{ left: `calc(220px + (100% - 220px) * ${at/T})` }}><span className="absolute -top-1 left-1 bg-red-700 px-1 font-mono text-[10.5px] text-white">{fmt(at)}</span></div>
          </div>
          <label className="mt-4 ml-[220px] flex flex-col gap-1 text-[12px] text-[#45433e]">Move through time
            <input type="range" min="0" max="13.8" step="0.1" value={at} onChange={e=>setAt(+e.target.value)} className="w-full accent-[#b42d38]"/></label>
        </section>
        <aside className="space-y-4 border-l border-border bg-white p-5" aria-live="polite">
          <div><div className="font-mono text-[11px] uppercase tracking-wider text-[#5c5a54]">At {fmt(at)}</div><b className="text-[16px]">{cur[1]}</b> {cur[4]==='fix' && <Tag tone="warn">fixed its own mistake</Tag>}</div>
          <div><div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[#5c5a54]">What the agent was looking at</div><p className="border border-border bg-paper p-3">{cur[6]}</p></div>
          <div><div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[#5c5a54]">What it did</div><p className="font-serif text-[16px] leading-relaxed">{cur[7]}</p></div>
          <Evidence items={cur[8]}/>
          <div className="flex gap-2 pt-2"><button className="border border-border px-3 py-1.5 hover:bg-paper">Show exact instructions</button><button className="border border-border px-3 py-1.5 hover:bg-paper">Show raw output</button></div>
        </aside>
      </div>
    </Shell>
  );
}
