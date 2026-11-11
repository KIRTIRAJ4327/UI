// I · Release train: runs on a calendar, gates as milestones, freeze windows and collisions.
import { Button } from '@/components/ui/button';
import { Shell } from '@/components/kit';
import { GateGlyph } from '@/components/signature';
import { cn } from '@/lib/utils';
const DAYS = ['10','11','12','13','14','17','18','19','20','21','24','25','26','27','28','1','2','3','4','5'];
const MON = i => i < 15 ? 'Nov' : 'Dec';
const TODAY = 1;
// [id, title, workspace, start, end, gates [[day, state, role]], bar colour, touches]
const ROWS = [
  ['WI-4821','Registered Amortization limit','Full Application',0,8,[[0,'passed','PO'],[1,'waiting','SA'],[4,'future','EL'],[6,'future','QL'],[8,'future','RM']],'validator'],
  ['WI-4772','Fee schedule update','Full Application',-3,4,[[0,'passed','QL'],[3,'waiting','RM']],'validator'],
  ['WI-4807','Advisor eligibility banner','Advisor Portal',-1,6,[[1,'waiting','EL'],[4,'future','QL'],[6,'future','RM']],''],
  ['WI-4799','Statement export format','Client Services',0,12,[[1,'waiting','PO'],[5,'future','SA'],[12,'future','RM']],''],
  ['WI-4790','Session timeout copy','Advisor Portal',-4,9,[[2,'future','QL'],[9,'future','RM']],'blocked'],
  ['WI-4830','Advisor licence check','Advisor Portal',2,18,[[3,'future','SA'],[14,'future','RM']],'freeze'],
];
const COL = 52;
export default function ReleaseTrain() {
  return (
    <Shell active="runs" title="Release calendar" actions={<Button variant="secondary">Export to CAB</Button>}>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex gap-4 text-[12.5px] text-[#5d5c58]"><span className="flex items-center gap-1.5"><GateGlyph state="passed" className="size-3"/>gate passed</span><span className="flex items-center gap-1.5"><GateGlyph state="waiting" className="size-3"/>gate waiting</span><span className="flex items-center gap-1.5"><GateGlyph className="size-3"/>gate planned</span><span className="flex items-center gap-1.5"><span className="h-3 w-5 bg-[repeating-linear-gradient(45deg,#b42d38_0_2px,transparent_2px_6px)]"/>change freeze</span><span className="flex items-center gap-1.5"><span className="h-0.5 w-5 bg-red-700"/>collision</span></div>
        <div className="overflow-x-auto border border-border bg-white">
          <div className="relative" style={{ width: 260 + DAYS.length * COL }}>
            <div className="sticky top-0 flex border-b border-border bg-[#efede6]"><div className="w-[260px] shrink-0 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-[#77756e]">Run</div>{DAYS.map((d,i)=><div key={i} style={{width:COL}} className={cn('shrink-0 border-l border-border py-1 text-center', i===TODAY && 'bg-brand text-white')}><div className="font-mono text-[10px] opacity-70">{MON(i)}</div><div className="font-semibold">{d}</div></div>)}</div>
            <div className="pointer-events-none absolute top-0 bottom-0 bg-[repeating-linear-gradient(45deg,rgba(180,45,56,.12)_0_3px,transparent_3px_9px)]" style={{ left: 260 + 15*COL, width: 3*COL }}><span className="absolute top-12 left-1 bg-white px-1 text-[11px] font-semibold text-red-700">Month-end freeze</span></div>
            <div className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-brand" style={{ left: 260 + TODAY*COL + COL/2 }}/>
            {ROWS.map(([id,t,ws,s,e,g,flag])=>(
              <div key={id} className="relative flex h-16 items-center border-b border-border">
                <div className="w-[260px] shrink-0 px-3"><b className="block truncate font-semibold">{t}</b><span className="font-mono text-[11px] text-[#77756e]">{id} · {ws}</span></div>
                <div className={cn('absolute h-2.5', flag==='blocked'?'bg-red-200':'bg-brand/25')} style={{ left: 260 + Math.max(s,0)*COL + 6, width: (e - Math.max(s,0))*COL }} />
                {g.map(([d,st,r],i)=><span key={i} className="absolute flex flex-col items-center" style={{ left: 260 + d*COL + COL/2 - 10, top: 10 }}><GateGlyph state={st}/><span className={cn('font-mono text-[9.5px]', st==='waiting'?'font-semibold text-gate':'text-[#77756e]')}>{r}</span></span>)}
                <span className="absolute font-mono text-[10.5px] text-[#5d5c58]" style={{ left: 260 + e*COL + COL - 4, top: 24 }}>▶ live</span>
                {flag==='validator' && <span className="absolute left-[200px] top-1 bg-red-700 px-1 font-mono text-[10px] text-white">COLLISION</span>}
                {flag==='freeze' && <span className="absolute bg-red-50 px-1.5 text-[11px] text-red-700" style={{ left: 260 + 15*COL + 4, top: 40 }}>release lands in freeze</span>}
              </div>))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="border-l-4 border-red-700 bg-white p-3"><b>Collision:</b> WI-4772 and WI-4821 both change <span className="font-mono">amortizationValidator.js</span> this week. Release 4772 first, then rebase 4821.<div className="mt-2 flex gap-2"><Button size="sm">Sequence them</Button><Button size="sm" variant="ghost">View both diffs</Button></div></div>
          <div className="border-l-4 border-gate bg-white p-3"><b>Freeze:</b> WI-4830 would release inside the month-end freeze (Dec 1–3). Earliest safe date: Dec 4.<div className="mt-2 flex gap-2"><Button size="sm" variant="outline">Move to Dec 4</Button><Button size="sm" variant="ghost">Request exception</Button></div></div>
        </div>
      </div>
    </Shell>
  );
}
