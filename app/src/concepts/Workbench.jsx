// E · Evidence review: the document reads like a document, every claim cites its source.
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shell, Kbd, Title } from '@/components/kit';
import { Track, GateGlyph, Waiting } from '@/components/signature';
const Cite = ({ n }) => <sup className="ml-0.5 cursor-pointer bg-brand-soft px-1 font-mono text-[10px] text-brand">{n}</sup>;
const SRC = [['1','Knowledge Fabric','Product rules · Registered Amortization maximum = 310'],['2','Spec v3','AC-3: block values above maximum, show reason'],['3','full-application-ui','src/product/ProductSelection.jsx'],['4','full-application-ui','src/validation/amortizationValidator.js'],['5','ADR-0151','Prior decision: reuse shared validators']];
export default function EvidenceReview() {
  return (
    <Shell rail={false} title={<div className="flex items-center gap-2"><span className="text-white/60">Runs /</span><Title>Registered Amortization limit</Title></div>}>
      <div className="border-b border-border bg-white px-6 py-3"><Track s="dddw"/></div>
      <div className="grid h-[calc(100vh-128px)] grid-cols-[1fr_300px_320px]">
        <article className="overflow-auto px-12 py-8"><div className="mx-auto max-w-[680px] font-serif text-[17px] leading-[1.7]">
          <div className="font-sans font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">Architecture decision record · ADR-0173 · Proposed</div>
          <h2 className="mt-1 mb-4 font-sans text-[26px] font-medium leading-tight tracking-tight">Enforce the Registered Amortization maximum on Product Selection</h2>
          <h3 className="mt-6 font-sans text-[13px] font-semibold uppercase tracking-wider">Context</h3>
          <p>Business rules state that Registered Amortization may not exceed 310<Cite n="1"/>. The approved specification requires the form to block higher values and explain why<Cite n="2"/>.</p>
          <h3 className="mt-6 font-sans text-[13px] font-semibold uppercase tracking-wider">Decision</h3>
          <p>Add the maximum to the shared amortization validator<Cite n="4"/> and call it from the Product Selection form<Cite n="3"/>, following the existing pattern for shared validators<Cite n="5"/>. <mark className="bg-gate-soft">The API is not changed in this story.</mark></p>
          <h3 className="mt-6 font-sans text-[13px] font-semibold uppercase tracking-wider">Consequences</h3>
          <p>Advisors see the limit immediately. Direct API calls can still submit higher values; a follow-up story is proposed.</p>
        </div></article>
        <aside className="overflow-auto border-l border-border bg-[#f1efe9] p-4">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[#8a887f]">Sources cited · 5</div>
          <ol className="space-y-2">{SRC.map(([n,a,b])=><li key={n} className="border border-border bg-white p-2.5"><div className="flex items-center gap-2"><span className="bg-brand-soft px-1 font-mono text-[10px] text-brand">{n}</span><b className="text-[12.5px]">{a}</b></div><div className="mt-1 break-words font-mono text-[11.5px] text-[#5d5c58]">{b}</div></li>)}</ol>
        </aside>
        <aside className="flex flex-col gap-4 overflow-auto border-l border-border bg-white p-5">
          <div className="flex items-center gap-2"><GateGlyph state="waiting"/><b className="font-semibold">Solution Architect gate</b></div>
          <Waiting mins={12} label="12m of 4h target"/>
          <div className="space-y-3 border-y border-border py-4">{[['Scope matches the approved specification',true],['Follows an existing approved pattern',true],['I accept: API can bypass the limit',false],['I accept: copy sign-off is pending',false]].map(([l,c])=><label key={l} className="flex items-start gap-2.5"><Checkbox defaultChecked={c} className="mt-0.5"/>{l}</label>)}</div>
          <Button>Approve gate <Kbd>⌘↵</Kbd></Button><Button variant="outline">Send back with changes</Button>
          <div className="mt-2 border-l-[3px] border-brand bg-paper p-3"><b>Priya N.</b> <span className="text-[#8a887f]">· 10m</span><p className="font-serif text-[15px]">Can we add the server check as a follow-up story?</p></div>
        </aside>
      </div>
    </Shell>
  );
}
