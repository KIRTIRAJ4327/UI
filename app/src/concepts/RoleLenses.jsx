// F · Role lenses: one run, explained four ways.
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shell, Tag, Panel } from '@/components/kit';
import { Track, GateGlyph, Narration, Evidence, Trace, Waiting } from '@/components/signature';
import { AUDIT, QUEUE, TRACE } from '@/data';
export default function RoleLenses() {
  return (
    <Shell active="inbox" title="Home">
      <Tabs defaultValue="req" className="gap-0">
        <div className="flex items-center gap-4 border-b border-border bg-white px-6"><span className="font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">Explain it as</span><TabsList variant="line" aria-label="View as"><TabsTrigger value="req">Requester</TabsTrigger><TabsTrigger value="app">Approver</TabsTrigger><TabsTrigger value="eng">Engineer</TabsTrigger><TabsTrigger value="aud">Auditor</TabsTrigger></TabsList></div>
        <div className="mx-auto max-w-6xl p-6">
        <TabsContent value="req" className="space-y-5">
          <div className="border border-border bg-white p-6"><div className="font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">Your request · WI-4821</div><Narration className="mt-2 text-[22px]">Your Registered Amortization change is <b>halfway there</b>. An architect is checking the design now. You don’t need to do anything; we expect it live on <b>Thursday</b>.</Narration><Track s="dddw" className="mt-5"/></div>
          <div className="grid grid-cols-[1.3fr_1fr] gap-5">
            <Panel title="Ask for a change"><div className="space-y-3 p-4"><Textarea aria-label="Business request" placeholder="Describe the change in your own words. The platform turns it into a plan for you to approve." className="h-24"/><Button>Start delivery</Button></div></Panel>
            <Panel title="Your other requests"><ul className="divide-y divide-border px-4">{[['Fee schedule update','ok','Live'],['Session timeout copy','bad','Needs a fix'],['Statement export format','warn','1 question for you']].map(([a,t,b])=><li key={a} className="flex justify-between py-2.5">{a}<Tag tone={t}>{b}</Tag></li>)}</ul></Panel>
          </div>
        </TabsContent>
        <TabsContent value="app"><Panel title="Gates waiting on you">{QUEUE.map(g=>g.items.map(x=><div key={x.id} className="grid grid-cols-[1fr_180px_160px_auto] items-center gap-4 border-b border-border px-4 py-3 last:border-0"><div><div className="flex items-center gap-2 text-[12px] text-[#8a887f]"><GateGlyph state="waiting" className="size-3"/>{g.gate}</div><b>{x.t}</b><div className="text-[#5d5c58]">{x.run}</div></div><Track s={x.s} size="sm"/><Waiting mins={x.mins} label={x.mins<60?x.mins+'m':Math.round(x.mins/60)+'h'}/><Button variant="outline" size="sm">Review</Button></div>))}</Panel></TabsContent>
        <TabsContent value="eng"><div className="grid grid-cols-2 gap-5"><Panel title="Developer task · S-01" right={<Tag tone="warn">Branch not found</Tag>}><dl className="divide-y divide-border px-4">{[['Azure Boards','Task #8812'],['Target branch','feature/amortization-max'],['Pull request','Not opened'],['Pipeline','Not started']].map(([a,b])=><div key={a} className="flex justify-between py-2.5"><dt className="text-[#5d5c58]">{a}</dt><dd className="font-mono text-[12px]">{b}</dd></div>)}</dl><div className="flex gap-2 p-4"><Button>Check branch</Button><Button variant="outline">Copy developer prompt</Button></div></Panel>
          <div className="space-y-4"><Panel title="Rule trace"><Trace steps={TRACE} className="p-4"/></Panel><pre className="bg-ink p-4 font-mono text-[12px] leading-6 text-white/80">{`$ git push origin feature/amortization-max\n✓ branch found\n✓ pull request #214 opened\n… pipeline queued`}</pre></div></div></TabsContent>
        <TabsContent value="aud"><Panel title="Evidence ledger · WI-4821" right={<Button variant="outline" size="sm">Export signed PDF</Button>}><ol>{AUDIT.map(r=><li key={r[0]} className="grid grid-cols-[110px_24px_1fr_120px_140px] items-center gap-3 border-b border-border px-4 py-2.5 last:border-0"><span className="font-mono text-[12px] text-[#8a887f]">{r[0]}</span><GateGlyph state={r[2]==='Agent'?'future':'passed'} className="size-3"/><span>{r[1]}</span><span>{r[2]}</span><span className="font-mono text-[12px] text-brand">{r[3]}</span></li>)}</ol><Evidence items={['Hash-chained','Tamper-evident','Retained 7 years']} className="mx-4 mb-3"/></Panel></TabsContent>
        </div>
      </Tabs>
    </Shell>
  );
}
