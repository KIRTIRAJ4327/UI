import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shell, Tag, Dot, Kbd, Title } from '@/components/kit';
import { STAGES } from '@/data';
import { cn } from '@/lib/utils';
export default function Workbench() {
  const st = 'dddw';
  return (
    <Shell rail={false} title={<div className="flex items-center gap-2"><span className="text-neutral-500">Runs /</span><Title>Registered Amortization limit</Title><span className="font-mono text-xs text-neutral-500">WI-4821</span></div>} actions={<Tag tone="warn">Design · in review</Tag>}>
      <div className="grid h-[calc(100vh-48px)] grid-cols-[220px_1fr_340px]">
        <nav aria-label="Stages" className="overflow-auto border-r bg-white py-3">
          <div className="px-4 pb-1 text-xs text-neutral-500">Stages</div>
          {STAGES.map((s,i)=><a key={s} href="#" className={cn('flex h-8 items-center gap-2.5 px-4', i===3?'bg-neutral-100 font-semibold shadow-[inset_3px_0_0_var(--primary)]':'text-neutral-600')}><Dot tone={{d:'ok',w:'warn'}[st[i]]}/>{i+1} {s}{st[i]==='d'&&<span className="ml-auto text-xs text-neutral-400">✓</span>}</a>)}
          <div className="px-4 pt-4 pb-1 text-xs text-neutral-500">Documents · Design</div>
          {['ADR-0173','Solution design','Developer handoff','Tester handoff'].map((d,i)=><a key={d} href="#" className={cn('flex h-8 items-center px-4', i===0?'font-semibold':'text-neutral-600')}>{d}</a>)}
        </nav>
        <article className="overflow-auto px-10 py-7"><div className="mx-auto max-w-3xl space-y-4">
          <div className="flex gap-1.5"><Tag tone="info">Summary</Tag><Tag>Decision</Tag><Tag>Impact</Tag><Tag>Risks</Tag><Tag>Evidence</Tag><span className="ml-auto"><Tag>Stakeholder ⇄ Technical</Tag></span></div>
          <h2 className="text-lg font-semibold">ADR-0173 · Enforce Registered Amortization maximum in the UI</h2>
          <p className="text-neutral-600">Status: Proposed · Author: Design agent · Quality check passed</p>
          <h3 className="font-semibold">Decision</h3>
          <p>Use the shared amortization validator on Product Selection to reject values above 310 and show an inline message. <mark className="border-b-2 border-amber-400 bg-amber-50">The API continues to accept any value.</mark></p>
          <h3 className="font-semibold">Impact</h3>
          <div className="border bg-white"><Table><TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Change</TableHead><TableHead>Tests</TableHead></TableRow></TableHeader><TableBody>
            {[['ProductSelection','Add validation','3 new'],['amortizationValidator','Add max constant','1 updated'],['Messages','New string','—']].map(r=><TableRow key={r[0]}>{r.map(c=><TableCell key={c} className={c===r[0]?'font-mono text-xs':''}>{c}</TableCell>)}</TableRow>)}
          </TableBody></Table></div>
        </div></article>
        <aside className="flex flex-col gap-4 overflow-auto border-l bg-white p-4">
          <div><div className="text-xs text-neutral-500">Your decision</div><h3 className="font-semibold">Solution Architect gate</h3></div>
          <div className="space-y-2.5 border p-3">{[['Scope matches the approved specification',true],['Reuses an existing approved pattern',true],['I accept the API-bypass risk',false],['Copy sign-off is tracked',false]].map(([l,c])=><label key={l} className="flex items-start gap-2.5"><Checkbox defaultChecked={c} className="mt-0.5"/>{l}</label>)}</div>
          <Button>Approve &amp; continue <Kbd>⌘↵</Kbd></Button><Button variant="outline">Request changes</Button>
          <div><div className="text-xs text-neutral-500">Comments · 1</div><div className="mt-1.5 border-l-[3px] border-primary bg-neutral-50 p-2.5"><b>Priya N.</b> <span className="text-neutral-500">· 10m</span><br/>Can we add the server check as a follow-up story?</div></div>
          <div><div className="text-xs text-neutral-500">Audit · this document</div><p className="text-neutral-600">Generated 14:31 · Quality pass 14:33 · Opened by you 14:40</p></div>
        </aside>
      </div>
    </Shell>
  );
}
