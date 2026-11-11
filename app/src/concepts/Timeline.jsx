import { Button } from '@/components/ui/button';
import { Shell, Tag, StageBar, Panel, Title } from '@/components/kit';
import { REQUEST } from '@/data';
import { Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
const EV = [
  ['d','Plan approved','One objective, 2 stories. Approved by Priya N., Tue 14:02.'],
  ['d','Specification approved','8 acceptance criteria. 2 clarifications answered (renewals included: yes).'],
  ['d','Impact assessed','Product Selection page, shared validator, 1 test suite. No other applications affected.'],
];
const Node = ({ k, children }) => <span className={cn('grid size-6 place-items-center rounded-full border-2 bg-white text-xs', k==='d'&&'border-emerald-700 text-emerald-700', k==='w'&&'border-amber-400 bg-amber-50 text-amber-800', !k&&'border-neutral-300 text-neutral-500')}>{children}</span>;
export default function Timeline() {
  return (
    <Shell active="runs" title={<div className="flex items-center gap-2"><Title>Registered Amortization limit</Title><span className="font-mono text-xs text-neutral-500">WI-4821</span><Tag tone="warn">Waiting for you</Tag></div>} actions={<Button variant="outline">Stop run</Button>}>
      <div className="grid grid-cols-[1fr_340px] items-start gap-6 p-6">
        <ol className="max-w-3xl">
          {EV.map(([k,t,d])=><li key={t} className="grid grid-cols-[24px_1fr] gap-3 pb-5"><Node k={k}><Check className="size-3.5"/></Node><div><b className="font-semibold">{t}</b><p className="text-neutral-600">{d}</p><button className="text-primary">Show evidence</button></div></li>)}
          <li className="grid grid-cols-[24px_1fr] gap-3 pb-5"><Node k="w"><AlertTriangle className="size-3.5"/></Node><div>
            <b className="font-semibold">Design · decision required</b>
            <p className="text-neutral-600">Recommendation: enforce the limit in the client using the existing validator. Server-side validation is not changed in this story.</p>
            <div className="mt-2 border border-l-4 border-l-amber-400 bg-white p-4"><div className="text-xs text-neutral-500">Solution Architect decision</div><p className="my-2">Approve ADR-0173. Accepted risk: the API continues to accept values above 310.</p><div className="flex gap-2"><Button>Approve &amp; continue</Button><Button variant="outline">Request changes</Button><Button variant="ghost">Open full document</Button></div></div>
          </div></li>
          <li className="grid grid-cols-[24px_1fr] gap-3 pb-5"><Node>5</Node><div><b className="font-semibold text-neutral-600">Next: Build</b><p className="text-neutral-500">Starts after approval. Estimated 20 minutes.</p></div></li>
          <li className="grid grid-cols-[24px_1fr] gap-3"><Node>…</Node><p className="text-neutral-500">Integrate · Validate · Release</p></li>
        </ol>
        <aside className="sticky top-16 space-y-4">
          <Panel title="Journey"><div className="p-4"><StageBar s="dddw"/><b className="mt-2 block font-semibold">Stage 4 of 8 · Design</b><div className="text-neutral-600">Elapsed 1d 2h · est. 2d remaining</div></div></Panel>
          <Panel title="Original request"><p className="p-4">{REQUEST}</p></Panel>
          <Panel title="Connected systems"><ul className="space-y-1 p-4"><li>Azure Boards · Task #8812</li><li>Repository · full-application-ui</li><li>Knowledge Fabric · 9 sources</li></ul></Panel>
        </aside>
      </div>
    </Shell>
  );
}
