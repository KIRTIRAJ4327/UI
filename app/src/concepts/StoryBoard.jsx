// C · Two-lane board: the same 8 stages, split into what agents are doing and what people are holding.
import { Button } from '@/components/ui/button';
import { Shell } from '@/components/kit';
import { GateGlyph } from '@/components/signature';
import { STAGES, GATES } from '@/data';
import { cn } from '@/lib/utils';
const AGENT = { Specify:[['S-12','Statement export format','Drafting criteria']], Design:[['S-02','Inline validation message','Writing ADR']], Build:[['S-07','Advisor eligibility banner','Running unit tests']], Validate:[['S-05','Session timeout copy','Retrying 2 failed tests','bad']] };
const HUMAN = { Specify:[['S-09','Does 310 apply to renewals?','Product Owner · 1h']], Design:[['S-01','Block amortization above 310','Solution Architect · 12m']], Build:[['S-04','Developer completion report','Engineering Lead · 3h']], Release:[['S-03','Fee schedule update','Business UAT · 5h']] };
const Card = ({ c, human }) => <article className={cn('mb-1.5 border bg-white p-2', human ? 'border-l-4 border-border border-l-gate' : 'border-border', c[3]==='bad' && 'border-red-700')}><div className="font-mono text-[10.5px] text-[#65635c]">{c[0]}</div><b className="block text-[12.5px] font-semibold leading-snug">{c[1]}</b><div className={cn('mt-1 text-[12px]', c[3]==='bad'?'text-red-700':'text-[#5d5c58]')}>{c[2]}</div></article>;
export default function TwoLaneBoard() {
  return (
    <Shell active="board" title="Stories" actions={<Button>New request</Button>}>
      <div className="overflow-x-auto p-6"><div className="grid min-w-[1100px] grid-cols-[120px_repeat(8,1fr)] border border-border bg-white">
        <div className="border-b border-border"/>{STAGES.map(s=><div key={s} className="border-b border-l border-border px-2 py-2"><b className="font-semibold">{s}</b>{GATES[s] && <div className="flex items-center gap-1 text-[11px] text-[#65635c]"><GateGlyph className="size-3"/>{GATES[s]}</div>}</div>)}
        <div className="border-b border-border bg-brand-soft p-3"><b className="text-brand">Agents</b><div className="text-[12px] text-[#5d5c58]">Working now · 4</div></div>
        {STAGES.map(s=><div key={s} className="min-h-[190px] border-b border-l border-border bg-brand-soft/40 p-1.5">{(AGENT[s]||[]).map(c=><Card key={c[0]} c={c}/>)}</div>)}
        <div className="bg-gate-soft p-3"><b className="text-gate">People</b><div className="text-[12px] text-[#5d5c58]">Holding at a gate · 4</div></div>
        {STAGES.map(s=><div key={s} className="min-h-[190px] border-l border-border bg-gate-soft/50 p-1.5">{(HUMAN[s]||[]).map(c=><Card key={c[0]} c={c} human/>)}</div>)}
      </div>
      <p className="mt-3 font-serif text-[15px] italic text-[#5d5c58]">Everything in the lower lane is waiting on a person. Cards move right only when a gate is approved.</p></div>
    </Shell>
  );
}
