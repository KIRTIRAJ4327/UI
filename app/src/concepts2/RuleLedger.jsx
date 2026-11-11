// L · Rule ledger: the business rule is the primary object, with where it is and is not enforced.
import { Button } from '@/components/ui/button';
import { Shell, Tag, Panel } from '@/components/kit';
import { GateGlyph, Narration, Evidence } from '@/components/signature';
import { NextStep, useToast } from '@/components/friendly';
import { Check, X, Minus } from 'lucide-react';
const LAYERS = [
  ['Product Selection form','Full Application UI','planned','WI-4821','In design'],
  ['Shared amortization validator','Validation library','planned','WI-4821','In design'],
  ['Pricing API','Server','no','—','No run covers this'],
  ['Batch application import','Server','no','—','No run covers this'],
  ['Advisor Portal quote tool','Advisor Portal','yes','WI-4511','Since Mar 2026'],
  ['Product rules (source of truth)','Knowledge Fabric','yes','—','Documented, v4'],
];
const Ic = ({ s }) => s==='yes' ? <span className="grid size-5 place-items-center bg-done text-white"><Check className="size-3.5"/></span> : s==='no' ? <span className="grid size-5 place-items-center bg-red-700 text-white"><X className="size-3.5"/></span> : <span className="grid size-5 place-items-center border-2 border-gate text-gate"><Minus className="size-3"/></span>;
export default function RuleLedger() {
  const toast = useToast();
  return (
    <Shell active="docs" title="Rules">
      <NextStep action="Start run for Pricing API" onAction={()=>toast('Request drafted: enforce RA ≤ 310 in the Pricing API. Review it before starting.')}>The Pricing API and batch import don't check this rule yet. Start a run to close the gap.</NextStep>
      <div className="grid grid-cols-[240px_1fr]">
        <nav className="border-r border-border bg-[#f1efe9] py-3" aria-label="Rules">
          <div className="px-4 pb-1 font-mono text-[11px] uppercase tracking-wider text-[#65635c]">Full Application · 48 rules</div>
          {[['RA-MAX','Registered Amortization ≤ 310','part'],['RA-MIN','Amortization ≥ 5 years','yes'],['FEE-07','Fee table v7','yes'],['RATE-H','Rate hold ≤ 120 days','part'],['KYC-02','Two IDs before approval','yes'],['ADDR-1','Address change audited','no']].map(([id,t,s],i)=><a key={id} href="#" className={`flex items-center gap-2 px-4 py-2 ${i===0?'bg-white shadow-[inset_3px_0_0_var(--brand)]':''}`}><span className={`size-2 ${s==='yes'?'bg-done':s==='no'?'bg-red-700':'bg-gate'}`}/><span className="min-w-0"><span className="block font-mono text-[11px] text-[#5c5a54]">{id}</span><span className="block truncate text-[12.5px]">{t}</span></span></a>)}
        </nav>
        <section className="space-y-5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1"><div className="font-mono text-[11px] uppercase tracking-wider text-[#65635c]">Business rule · RA-MAX · owner Priya N.</div><h2 className="text-[26px] font-medium tracking-tight">Registered Amortization must be ≤ 310</h2></div>
            <div className="border border-gate bg-gate-soft px-4 py-2 text-right"><div className="font-mono text-[11px] uppercase text-gate">Enforcement</div><div className="text-xl font-light">Checked in 2 of 6 places</div><div className="text-[12px] text-[#45433e]">2 more in progress</div></div>
          </div>
          <Narration>This rule is documented and enforced in the Advisor Portal. Run <b>WI-4821</b> will add it to the Full Application form. <span className="bg-red-50">Nothing yet stops the Pricing API or batch imports from accepting larger values.</span></Narration>
          <Panel title="Where the rule is checked">
            <table className="w-full text-[13px]"><thead><tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wider text-[#65635c]"><th className="px-4 py-2 font-normal"></th><th className="font-normal">Place</th><th className="font-normal">System</th><th className="font-normal">Run</th><th className="font-normal">Status</th><th/></tr></thead>
            <tbody>{LAYERS.map(([l,s,st,r,n])=><tr key={l} className="border-b border-border last:border-0"><td className="px-4 py-2.5"><Ic s={st}/></td><td className="font-semibold">{l}</td><td className="text-[#5d5c58]">{s}</td><td className="font-mono text-[12px] text-brand">{r}</td><td className={st==='no'?'text-red-700':'text-[#5d5c58]'}>{n}</td><td className="pr-4 text-right">{st==='no' && <Button size="sm" variant="outline" onClick={()=>toast(`Request drafted for ${l}. Review it before starting.`)}>Start a run</Button>}</td></tr>)}</tbody></table>
          </Panel>
          <div className="grid grid-cols-2 gap-5">
            <Panel title="History of this rule"><ol className="space-y-2.5 p-4 text-[12.5px]">{[['Nov 11','WI-4821 opened: enforce in Full Application form','waiting'],['Mar 2026','WI-4511 released: Advisor Portal quote tool','passed'],['Jan 2026','Rule raised from 300 to 310 (product rules v4)','passed'],['Aug 2025','Rule created by Product (v1)','passed']].map(([d,t,s])=><li key={d} className="grid grid-cols-[70px_16px_1fr] gap-2"><span className="font-mono text-[#65635c]">{d}</span><GateGlyph state={s} className="size-3.5"/><span>{t}</span></li>)}</ol></Panel>
            <Panel title="Related rules"><ul className="divide-y divide-border px-4 text-[12.5px]">{[['RA-MIN','Amortization ≥ 5 years','ok','enforced'],['RATE-H','Rate hold ≤ 120 days','warn','partial'],['PRD-SEL','Product eligibility by province','ok','enforced']].map(([a,b,t,s])=><li key={a} className="flex items-center justify-between py-2"><span><span className="font-mono text-[11px] text-[#5c5a54]">{a}</span> {b}</span><Tag tone={t}>{s}</Tag></li>)}</ul><Evidence className="mx-4 mb-3" items={['Knowledge Fabric v4','3 repositories scanned']}/></Panel>
          </div>
        </section>
      </div>
    </Shell>
  );
}
