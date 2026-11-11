import { Button } from '@/components/ui/button';
import { Shell, Tag, Dot, Kbd, Panel } from '@/components/kit';
import { INBOX } from '@/data';
import { cn } from '@/lib/utils';
export default function InboxConcept() {
  return (
    <Shell active="inbox" title="Inbox" actions={<Button>New delivery request</Button>}>
      <div className="grid flex-1 grid-cols-[400px_1fr]">
        <aside className="border-r bg-white">
          <div className="flex gap-1.5 border-b p-3"><Tag tone="info">Needs me 3</Tag><Tag>Mentioned 1</Tag><Tag>Watching 6</Tag></div>
          {INBOX.map((x,i)=>(
            <button key={i} className={cn('grid w-full grid-cols-[10px_1fr_auto] gap-3 border-b px-4 py-3 text-left hover:bg-neutral-50', i===0 && 'bg-neutral-100 shadow-[inset_3px_0_0_var(--primary)]')}>
              <span className="pt-1.5"><Dot tone={x.tone}/></span>
              <span><b className="block font-semibold">{x.t}</b><span className="block text-neutral-600">{x.sub}</span><Tag tone={x.tone} className="mt-1.5">{x.tag}</Tag></span>
              <span className="text-xs text-neutral-500">{x.age}</span>
            </button>))}
        </aside>
        <section className="flex max-w-5xl flex-col gap-4 p-6">
          <div className="flex items-center gap-2"><Tag tone="warn">Stage 4 of 8 · Design</Tag><span className="font-mono text-xs text-neutral-500">WI-4821</span><span className="ml-auto text-neutral-500">Requested by Priya N.</span></div>
          <div><h2 className="text-xl font-normal">Approve solution design · ADR-0173</h2><p className="text-neutral-600">Proposed: client-side limit on Product Selection, reusing the existing validator. 2 open risks.</p></div>
          <div className="grid grid-cols-2 gap-4">
            <Panel title="What changes"><ul className="list-disc p-4 pl-8"><li>Registered Amortization blocks values above 310</li><li>Inline message explains the maximum</li><li>No change to other portals</li></ul></Panel>
            <Panel title="Reason for review"><p className="p-4">Business rule enforced in the UI only. Policy requires Solution Architect sign-off before Build.<br/><span className="text-neutral-500">Evidence: 9 sources · quality check passed</span></p></Panel>
          </div>
          <Panel title="Decision document · ADR-0173" right={<Button variant="ghost" size="sm">Open full view</Button>}>
            <div className="space-y-3 p-4"><p>Enforce the maximum in the Product Selection form using the shared amortization validator. <mark className="border-b-2 border-amber-400 bg-amber-50">The server-side maximum is not changed in this story.</mark></p>
            <table className="w-full"><thead><tr className="border-b text-left text-xs"><th className="py-1.5">Risk</th><th>Severity</th><th>Mitigation</th></tr></thead><tbody>
              <tr className="border-b"><td className="py-2">Direct API call bypasses the limit</td><td><Tag tone="warn">Medium</Tag></td><td>Follow-up story for server validation</td></tr>
              <tr><td className="py-2">Message copy not approved by Compliance</td><td><Tag>Low</Tag></td><td>Tracked as UAT item</td></tr></tbody></table></div>
          </Panel>
          <div className="sticky bottom-0 -mx-6 flex items-center gap-2 border-t bg-white px-6 py-3">
            <Button>Approve &amp; continue <Kbd>A</Kbd></Button><Button variant="outline">Request changes <Kbd>R</Kbd></Button><Button variant="ghost">Ask a question <Kbd>C</Kbd></Button>
            <span className="ml-auto text-neutral-500"><Kbd>J</Kbd> <Kbd>K</Kbd> next / previous</span>
          </div>
        </section>
      </div>
    </Shell>
  );
}
