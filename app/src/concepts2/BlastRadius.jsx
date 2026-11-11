// H · Blast radius: approve by seeing what the change touches, ring by ring, and what it does not.
import { Button } from '@/components/ui/button';
import { Shell, Panel } from '@/components/kit';
import { Track, GateGlyph, Evidence } from '@/components/signature';
const R1 = [['ProductSelection.jsx','edit'],['amortizationValidator.js','edit'],['messages.en.json','add'],['selection.test.js','add'],['validator.test.js','edit']];
const R2 = [['Full Application UI','touched'],['Product Selection flow','touched'],['Shared validation lib','touched']];
const R3 = [['Pricing API','untouched'],['Advisor Portal','untouched'],['Client Services','untouched'],['Batch import','untouched']];
const pos = (i, n, r, off = 0) => { const a = (i / n) * Math.PI * 2 + off - Math.PI / 2; return [380 + r * Math.cos(a), 300 + r * Math.sin(a)]; };
export default function BlastRadius() {
  return (
    <Shell active="runs" title="Impact review · WI-4821">
      <div className="border-b border-border bg-white px-6 py-3"><Track s="dddw"/></div>
      <div className="grid flex-1 grid-cols-[1fr_380px]">
        <figure className="relative m-0 overflow-hidden" aria-label="Change impact map">
          <svg viewBox="0 0 760 600" className="h-full max-h-[calc(100vh-130px)] w-full">
            {[125,215,288].map((r,i)=><circle key={r} cx="380" cy="300" r={r} fill="none" stroke={i===2?'#cfccc3':'#dedbd2'} strokeDasharray={i===2?'4 5':''}/>)}
            {[['Files changed',125],['Areas touched',215],['Not changed',288]].map(([l,r])=><text key={l} x="380" y={300-r+14} textAnchor="middle" className="fill-[#8a887f] font-mono text-[10px] uppercase tracking-wider">{l}</text>)}
            {R1.map((n,i)=>{const[x,y]=pos(i,R1.length,125,.63);return <line key={n[0]} x1="380" y1="300" x2={x} y2={y} stroke="#2469bc" strokeOpacity=".35"/>})}
            {R2.map((n,i)=>{const[x,y]=pos(i,R2.length,215,1.1);const[a,b]=pos(i,R1.length,125,.63);return <line key={n[0]} x1={a} y1={b} x2={x} y2={y} stroke="#b7791f" strokeOpacity=".4"/>})}
            <g><rect x="335" y="280" width="90" height="40" fill="#101429"/><text x="380" y="297" textAnchor="middle" className="fill-white text-[12px] font-semibold">RA ≤ 310</text><text x="380" y="312" textAnchor="middle" className="fill-white/60 font-mono text-[9.5px]">business rule</text></g>
            {R1.map((n,i)=>{const[x,y]=pos(i,R1.length,125,.63);return <g key={n[0]}><circle cx={x} cy={y} r="6" fill="#2469bc"/><text x={x} y={y+18} textAnchor="middle" className="fill-[#101429] font-mono text-[10.5px]">{n[0]}</text><text x={x} y={y-10} textAnchor="middle" className="fill-[#2469bc] font-mono text-[9px] uppercase">{n[1]}</text></g>})}
            {R2.map((n,i)=>{const[x,y]=pos(i,R2.length,215,1.1);return <g key={n[0]}><rect x={x-6} y={y-6} width="12" height="12" fill="#b7791f"/><text x={x} y={y+20} textAnchor="middle" className="fill-[#101429] text-[11.5px] font-semibold">{n[0]}</text></g>})}
            {R3.map((n,i)=>{const[x,y]=pos(i,R3.length,288,.75);return <g key={n[0]}><rect x={x-6} y={y-6} width="12" height="12" fill="#f7f6f2" stroke="#9a978e" strokeDasharray="2 2"/><text x={x} y={y+20} textAnchor="middle" className="fill-[#77756e] text-[11.5px]">{n[0]}</text></g>})}
            <g><line x1="380" y1="300" x2={pos(0,4,288,.75)[0]} y2={pos(0,4,288,.75)[1]} stroke="#b42d38" strokeDasharray="3 4"/></g>
          </svg>
          <figcaption className="absolute top-4 left-6 max-w-sm border-l-4 border-red-700 bg-white p-3 text-[12.5px]"><b>Gap:</b> the rule also applies to the <b>Pricing API</b>, but this change does not reach it. Direct API calls can still submit values above 310.</figcaption>
        </figure>
        <aside className="flex flex-col gap-4 border-l border-border bg-white p-5">
          <div className="flex items-center gap-2"><GateGlyph state="waiting"/><b className="font-semibold">Solution Architect gate</b></div>
          <div className="grid grid-cols-3 border border-border text-center">{[['5','files'],['3','areas'],['4','untouched']].map(([n,l])=><div key={l} className="border-r border-border p-2 last:border-0"><div className="text-2xl font-light">{n}</div><div className="text-[12px] text-[#77756e]">{l}</div></div>)}</div>
          <Panel title="Changes"><ul className="space-y-1 p-3 text-[12.5px]"><li>Product Selection blocks values above 310</li><li>Shared validator gains a maximum</li><li>1 new message string, 2 test files</li></ul></Panel>
          <Panel title="Does not change"><ul className="space-y-1 p-3 text-[12.5px] text-[#5d5c58]"><li>Pricing API validation <span className="text-red-700">(gap)</span></li><li>Advisor Portal, Client Services</li><li>Batch import of applications</li></ul></Panel>
          <Evidence items={['Impact scan of 1 repo','Baseline build green','Call graph depth 3']}/>
          <div className="mt-auto flex flex-col gap-2"><Button>Approve with API gap accepted</Button><Button variant="outline">Widen scope to include API</Button></div>
        </aside>
      </div>
    </Shell>
  );
}
