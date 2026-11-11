import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shell, Tag, Dot, StageBar, Panel } from '@/components/kit';
import { RUNS } from '@/data';
const KPI = [['Active runs','14','3 started today'],['Waiting on a person','5','Oldest: 6h'],['Median request → release','3.2 d','−0.4 d vs last month'],['First-pass approval rate','82%','18% returned for changes']];
export default function MissionControl() {
  return (
    <Shell active="runs" title="Runs" actions={<Button>New request</Button>}>
      <div className="flex flex-col gap-4 p-6">
        <div className="grid grid-cols-4 gap-4">{KPI.map(([l,v,s])=><div key={l} className="border bg-white p-4"><div className="text-xs text-neutral-500">{l}</div><div className="text-3xl font-light">{v}</div><div className="text-neutral-600">{s}</div></div>)}</div>
        <div className="grid grid-cols-[1fr_360px] items-start gap-4">
          <Panel>
            <Tabs defaultValue="all" className="border-b px-3 pt-2"><TabsList variant="line"><TabsTrigger value="all">All 14</TabsTrigger><TabsTrigger value="p">Needs a person 5</TabsTrigger><TabsTrigger value="a">Agent working 7</TabsTrigger><TabsTrigger value="b">Blocked 1</TabsTrigger></TabsList></Tabs>
            <Table><TableHeader><TableRow><TableHead>Run</TableHead><TableHead className="w-56">Progress</TableHead><TableHead>Current step</TableHead><TableHead>Owner</TableHead><TableHead>Age</TableHead></TableRow></TableHeader>
              <TableBody>{RUNS.map((r,i)=><TableRow key={r.id} data-state={i===0?'selected':undefined}><TableCell><b className="font-semibold">{r.title}</b><div className="font-mono text-xs text-neutral-500">{r.id} · {r.ws}</div></TableCell><TableCell><StageBar s={r.s}/></TableCell><TableCell><Tag tone={r.tone}>{r.now}</Tag></TableCell><TableCell>{r.owner}</TableCell><TableCell>{r.age}</TableCell></TableRow>)}</TableBody></Table>
          </Panel>
          <Panel title="Registered Amortization limit" right={<Tag tone="warn">Needs you</Tag>}>
            <ol className="space-y-3 p-4">{[['ok','Plan approved','Priya N. · yesterday 14:02'],['ok','Specification approved','2 questions answered'],['ok','Impact assessed','3 components · 1 repository'],['warn','Design waiting for Alex K.','12 minutes']].map(([t,a,b])=><li key={a} className="flex gap-2.5"><span className="pt-1.5"><Dot tone={t}/></span><div><b className="font-semibold">{a}</b><div className="text-neutral-600">{b}</div></div></li>)}</ol>
            <div className="flex gap-2 px-4 pb-4"><Button>Review design</Button><Button variant="outline">Open run</Button></div>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}
