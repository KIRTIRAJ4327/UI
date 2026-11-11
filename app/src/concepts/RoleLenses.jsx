import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shell, Tag, StageBar, Panel } from '@/components/kit';
import { AUDIT, INBOX } from '@/data';
export default function RoleLenses() {
  return (
    <Shell active="inbox" title="Home">
      <Tabs defaultValue="req" className="gap-0">
        <div className="border-b bg-white px-6"><TabsList variant="line" aria-label="View as"><TabsTrigger value="req">Requester</TabsTrigger><TabsTrigger value="app">Approver</TabsTrigger><TabsTrigger value="eng">Engineer</TabsTrigger><TabsTrigger value="aud">Auditor</TabsTrigger></TabsList></div>
        <div className="p-6">
        <TabsContent value="req" className="space-y-4">
          <Panel><div className="flex items-center gap-6 p-5"><div className="flex-1"><div className="text-xs text-neutral-500">Your request</div><h2 className="text-lg">WI-4821 · Registered Amortization limit · Design</h2><p className="text-neutral-600">Stage 4 of 8. Awaiting Solution Architect review. No action required from you.</p></div><div className="w-72"><StageBar s="dddw"/><div className="mt-2 text-neutral-600">Expected release: Thursday</div></div></div></Panel>
          <div className="grid grid-cols-[1.2fr_1fr] gap-4">
            <Panel title="Start a new request"><div className="space-y-3 p-4"><Textarea aria-label="Business request" placeholder="Describe what needs to change and why…" className="h-24"/><div className="flex gap-2"><Button>Start delivery</Button><Button variant="ghost">Use a template</Button></div></div></Panel>
            <Panel title="Recent requests"><ul className="divide-y px-4">{[['Fee schedule update','ok','Released'],['Session timeout copy','bad','Needs attention'],['Statement export format','warn','1 question for you']].map(([a,t,b])=><li key={a} className="flex justify-between py-2.5">{a}<Tag tone={t}>{b}</Tag></li>)}</ul></Panel>
          </div>
        </TabsContent>
        <TabsContent value="app"><Panel title="Waiting on you · 3" right={<Button size="sm">Start with the oldest</Button>}><Table><TableBody>{INBOX.slice(0,3).map(x=><TableRow key={x.t}><TableCell><b>{x.t}</b><div className="text-neutral-500">{x.sub}</div></TableCell><TableCell><Tag tone="warn">{x.tag}</Tag></TableCell><TableCell>{x.age}</TableCell><TableCell className="text-right"><Button variant="outline" size="sm">Review</Button></TableCell></TableRow>)}</TableBody></Table></Panel></TabsContent>
        <TabsContent value="eng"><div className="grid grid-cols-2 gap-4"><Panel title="Developer task · S-01" right={<Tag tone="warn">Branch not found</Tag>}><dl className="divide-y px-4">{[['Azure Boards','Task #8812'],['Target branch','feature/amortization-max'],['Pull request','Not opened'],['Pipeline','Not started']].map(([a,b])=><div key={a} className="flex justify-between py-2.5"><dt className="text-neutral-600">{a}</dt><dd className="font-mono text-xs">{b}</dd></div>)}</dl><div className="flex gap-2 p-4"><Button>Check branch</Button><Button variant="outline">Copy developer prompt</Button></div></Panel>
          <pre className="bg-neutral-900 p-4 font-mono text-xs leading-6 text-neutral-200">{`$ git push origin feature/amortization-max\n✓ Branch found\n✓ Pull request opened #214\n… pipeline queued`}</pre></div></TabsContent>
        <TabsContent value="aud"><Panel title="Evidence trail · WI-4821" right={<Button variant="outline" size="sm">Export PDF</Button>}><Table><TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Event</TableHead><TableHead>Actor</TableHead><TableHead>Evidence</TableHead></TableRow></TableHeader><TableBody>{AUDIT.map(r=><TableRow key={r[0]}><TableCell className="font-mono text-xs">{r[0]}</TableCell><TableCell>{r[1]}</TableCell><TableCell>{r[2]}</TableCell><TableCell className="font-mono text-xs">{r[3]}</TableCell></TableRow>)}</TableBody></Table></Panel></TabsContent>
        </div>
      </Tabs>
    </Shell>
  );
}
