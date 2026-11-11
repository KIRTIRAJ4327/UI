// B · Control tower: where delivery waits (by gate), and every run as a track on one aligned board.
import { Button } from '@/components/ui/button';
import { Shell, Tag, Panel } from '@/components/kit';
import { Track, GateGlyph, Narration } from '@/components/signature';
import { RUNS, STAGES } from '@/data';
const WAIT = [['Product Owner',9.5],['Solution Architect',4.2],['Engineering Lead',6.8],['Integration Lead',1.1],['Quality Lead',2.4],['Release Manager',3.0]];
export default function ControlTower() {
  const max = 10;
  return (
    <Shell active="runs" title="Control tower" actions={<Button>New request</Button>}>
      <div className="flex flex-col gap-5 p-6">
        <div className="grid grid-cols-[1.1fr_1fr] gap-5">
          <div className="space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">This week, in plain English</div>
            <Narration className="text-[20px]">14 runs are moving. Agents finished their work in <b>2.1 hours</b> on average; runs then waited <b>27 hours</b> for people. The slowest gate is <b>Product Owner</b>.</Narration>
            <div className="flex gap-6 pt-1">{[['Agent time','2.1 h','bg-brand',8],['Waiting on people','27 h','bg-gate',92]].map(([l,v,c,w])=><div key={l} className="flex-1"><div className="flex justify-between"><span className="text-[#5d5c58]">{l}</span><b>{v}</b></div><div className="mt-1 h-2 bg-[#e7e4dc]"><div className={`h-2 ${c}`} style={{width:w+'%'}}/></div></div>)}</div>
          </div>
          <Panel title="Average wait per gate (hours)"><ul className="space-y-2 p-4">{WAIT.map(([g,h])=><li key={g} className="grid grid-cols-[150px_1fr_40px] items-center gap-3"><span className="flex items-center gap-2"><GateGlyph state="waiting" className="size-3"/>{g}</span><span className="h-3 bg-[#efede6]"><span className="block h-3 bg-gate" style={{width:(h/max*100)+'%',opacity:.45+h/max*.55}}/></span><span className="text-right font-mono text-[12px]">{h}</span></li>)}</ul></Panel>
        </div>
        <Panel title="All runs · stations aligned">
          <div className="grid grid-cols-[260px_1fr_190px] items-end gap-4 border-b border-border px-4 py-2 font-mono text-[10.5px] uppercase tracking-wider text-[#8a887f]"><span>Run</span><div className="flex justify-between px-4">{STAGES.map(s=><span key={s}>{s}</span>)}</div><span>Now</span></div>
          {RUNS.map((r,i)=><div key={r.id} className={`grid grid-cols-[260px_1fr_190px] items-center gap-4 border-b border-border px-4 py-3 last:border-0 ${i===0?'bg-gate-soft/60':''}`}><div><b className="font-semibold">{r.title}</b><div className="font-mono text-[11px] text-[#8a887f]">{r.id} · {r.owner} · {r.age}</div></div><Track s={r.s} size="sm" className="px-4"/><Tag tone={r.tone}>{r.now}</Tag></div>)}
        </Panel>
      </div>
    </Shell>
  );
}
