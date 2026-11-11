import { Button } from '@/components/ui/button';
import { Shell, Tag, StageBar } from '@/components/kit';
import { STAGES, GATES } from '@/data';
import { cn } from '@/lib/utils';
const CARDS = { Plan:[['S-12','Statement export format','ok','Approved']], Specify:[['S-09','Does 310 apply to renewals?','warn','2 questions','dw',1]], Design:[['S-01','Block amortization above 310','warn','Review ADR','dddw',1],['S-02','Inline validation message','info','Agent working']], Build:[['S-07','Advisor eligibility banner','info','Running tests','dddda']], Validate:[['S-05','Session timeout copy','bad','2 tests failed']], Release:[['S-03','Fee schedule update','ok','Released']] };
export default function StoryBoard() {
  return (
    <Shell active="board" title="Stories" actions={<Button>New request</Button>}>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex gap-1.5"><Tag tone="info">All workspaces</Tag><Tag>Needs a person 2</Tag><Tag>Mine</Tag><Tag>Failed 1</Tag></div>
        <div className="grid grid-cols-8 gap-2">{STAGES.map(st=>(
          <section key={st} className="min-h-[520px] border bg-neutral-50 p-2">
            <h3 className="mb-2 flex justify-between text-sm font-semibold">{st}<span className="font-normal text-neutral-500">{(CARDS[st]||[]).length}</span></h3>
            {GATES[st] && <div className="mb-2 border border-dashed px-2 py-1 text-center text-xs text-neutral-500">Gate · {GATES[st]}</div>}
            {(CARDS[st]||[]).map(([id,t,tone,tag,s,need])=>(
              <article key={id} className={cn('mb-2 border bg-white p-2.5', need && 'border-l-4 border-l-amber-400', tone==='bad' && 'border-red-700')}>
                <div className="font-mono text-xs text-neutral-500">{id}</div><b className="my-1 block font-semibold">{t}</b><Tag tone={tone}>{tag}</Tag>{s && <StageBar s={s} className="mt-2"/>}
              </article>))}
          </section>))}</div>
        <p className="text-neutral-500">Amber edge = waiting on a person. Cards move only when a gate is passed; there is no drag-and-drop.</p>
      </div>
    </Shell>
  );
}
