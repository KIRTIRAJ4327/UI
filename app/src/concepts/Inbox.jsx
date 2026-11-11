// A · Gate queue: decisions grouped by the gate they belong to, with waiting time against target.
import { Button } from '@/components/ui/button';
import { Shell, Kbd, Panel } from '@/components/kit';
import { Track, GateGlyph, Narration, Evidence, Trace, Waiting } from '@/components/signature';
import { QUEUE, TRACE } from '@/data';
import { cn } from '@/lib/utils';
export default function GateQueue() {
  return (
    <Shell active="inbox" title="Gate queue" actions={<Button>New request</Button>}>
      <div className="grid flex-1 grid-cols-[380px_1fr]">
        <aside className="border-r border-border">
          <div className="px-4 py-3 font-serif text-[15px] italic text-[#5d5c58]">3 decisions are waiting on you. The oldest has waited 3 hours.</div>
          {QUEUE.map(g => (
            <section key={g.gate}>
              <h2 className="flex items-center gap-2 border-y border-border bg-[#efede6] px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#5d5c58]"><GateGlyph state="waiting" className="size-3" />{g.gate} gate</h2>
              {g.items.map(x => (
                <button key={x.id} className={cn('block w-full space-y-2 border-b border-border px-4 py-3 text-left hover:bg-white', x.sel && 'bg-white shadow-[inset_3px_0_0_var(--gate)]')}>
                  <div className="flex justify-between"><b className="font-semibold">{x.t}</b><span className="font-mono text-[11px] text-[#65635c]">{x.id}</span></div>
                  <div className="text-[#5d5c58]">{x.run}</div>
                  <Track s={x.s} size="sm" />
                  <Waiting mins={x.mins} label={`${x.mins < 60 ? x.mins + 'm' : Math.round(x.mins / 60) + 'h'} of 4h target`} />
                </button>))}
            </section>))}
        </aside>
        <section className="flex max-w-5xl flex-col gap-5 px-8 py-6">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-[#65635c]">WI-4821 · Full Application · requested by Priya N.</div>
          <h2 className="-mt-3 text-2xl font-medium tracking-tight">Registered Amortization limit</h2>
          <Track s="dddw" className="border border-border bg-white px-4 py-3" />
          <Narration>Design is finished. The agent proposes blocking values above 310 on the Product Selection page, using the validator the form already has. <span className="bg-gate-soft">Nothing on the server changes</span>, so you are being asked to accept that gap.</Narration>
          <div className="border-l-4 border-gate bg-white">
            <div className="flex items-center gap-2 border-b border-border px-5 py-2.5"><GateGlyph state="waiting" /><b className="font-semibold">Solution Architect gate</b><span className="ml-auto"><Waiting mins={12} label="12m of 4h target" /></span></div>
            <div className="grid grid-cols-2 gap-6 px-5 py-4">
              <div><div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-[#65635c]">You approve</div><ul className="list-disc space-y-1 pl-4"><li>Client-side maximum of 310</li><li>Inline message explaining the maximum</li><li>ADR-0173 as the record of decision</li></ul></div>
              <div><div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-[#65635c]">You accept the risk</div><ul className="list-disc space-y-1 pl-4"><li><b>Medium</b>: direct API calls can bypass the limit</li><li><b>Low</b>: message copy not yet signed off</li></ul></div>
            </div>
            <Evidence className="mx-5 mb-4" items={['9 knowledge sources','Quality check passed','Scope matches spec v3','No other portals affected']} />
          </div>
          <Panel title="Rule trace"><Trace steps={TRACE} className="p-4" /></Panel>
          <div className="sticky bottom-0 -mx-8 flex items-center gap-2 border-t border-border bg-paper px-8 py-3">
            <Button>Approve gate <Kbd>A</Kbd></Button><Button variant="outline">Send back with changes <Kbd>R</Kbd></Button><Button variant="ghost">Read ADR-0173</Button>
            <span className="ml-auto text-[#65635c]"><Kbd>J</Kbd> <Kbd>K</Kbd> next decision</span>
          </div>
        </section>
      </div>
    </Shell>
  );
}
