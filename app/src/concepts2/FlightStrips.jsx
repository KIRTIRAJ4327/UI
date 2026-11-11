// G · Flight strips: each run is a strip handed between role bays. Stamps record who handled it.
import { Button } from '@/components/ui/button';
import { Shell } from '@/components/kit';
import { GateGlyph } from '@/components/signature';
import { NextStep, Term, HowToRead, useToast } from '@/components/friendly';
import { cn } from '@/lib/utils';
const WS = { FA:'#2469bc', AP:'#7a4fb5', CS:'#2f7d4f' };
const BAYS = [
  ['Product Owner', [{ id:'4799', ws:'CS', t:'Statement export format', rule:'CSV column order', st:'Specify', inbay:'1h', stamps:['RQ'], q:'2 questions' }]],
  ['Solution Architect', [{ id:'4821', ws:'FA', t:'Registered Amortization limit', rule:'RA ≤ 310', st:'Design', inbay:'12m', stamps:['RQ','PO','PO'], mine:true, q:'Accept API gap?' }, { id:'4830', ws:'AP', t:'Advisor licence check', rule:'Licence active', st:'Design', inbay:'—', stamps:['RQ','PO'], next:true }]],
  ['Engineering Lead', [{ id:'4807', ws:'AP', t:'Advisor eligibility banner', rule:'Eligibility ≥ 18', st:'Build', inbay:'3h', stamps:['RQ','PO','PO','SA'], q:'Completion report' }]],
  ['Quality Lead', [{ id:'4790', ws:'AP', t:'Session timeout copy', rule:'Timeout 15 min', st:'Validate', inbay:'40m', stamps:['RQ','PO','PO','SA','EL','IL'], alert:'2 tests failed' }]],
  ['Release Manager', [{ id:'4772', ws:'FA', t:'Fee schedule update', rule:'Fee table v7', st:'Release', inbay:'5h', stamps:['RQ','PO','PO','SA','EL','IL','QL'], q:'UAT sign-off' }]],
];
const ROLE = { RQ:'Requester', PO:'Product Owner', SA:'Solution Architect', EL:'Engineering Lead', IL:'Integration Lead', QL:'Quality Lead' };
const AGENTS = [['4812','FA','Rate hold expiry','Build · writing tests'],['4815','CS','Address change audit','Impact · searching sources'],['4818','AP','Fund facts PDF link','Plan · drafting stories']];
function Strip({ s }) {
  return (
    <article className={cn('grid grid-cols-[8px_74px_1fr_92px_118px] border bg-white text-[12.5px]', s.mine ? 'border-gate ring-2 ring-gate/30' : 'border-[#cfccc3]', s.next && 'border-dashed')}>
      <span style={{ background: WS[s.ws] }} />
      <div className="border-r border-dashed border-[#cfccc3] px-2 py-1.5"><div className="font-mono text-[15px] font-semibold leading-none">{s.id}</div><div className="mt-1 font-mono text-[10.5px] text-[#5c5a54]">{s.ws} · {s.st}</div></div>
      <div className="min-w-0 border-r border-dashed border-[#cfccc3] px-2 py-1.5"><b className="block truncate font-semibold">{s.t}</b><div className="truncate font-mono text-[11px] text-[#5d5c58]">rule: {s.rule}</div></div>
      <div className="border-r border-dashed border-[#cfccc3] px-2 py-1.5"><div className="font-mono text-[10.5px] text-[#5c5a54]">{s.next ? 'ARRIVING' : 'NEEDS'}</div><div className={cn('font-mono', s.alert && 'text-red-700')}>{s.alert || s.q || s.inbay}</div></div>
      <div className="flex flex-wrap content-center gap-0.5 px-1.5">{s.stamps.map((x,i)=><span key={i} title={`Signed by ${ROLE[x]}`} className="grid h-5 w-7 place-items-center border border-done font-mono text-[11px] text-done">{x}</span>)}</div>
    </article>
  );
}
export default function FlightStrips() {
  const toast = useToast();
  return (
    <Shell active="runs" title="Handoff board" actions={<Button>New request</Button>}>
      <NextStep action="Approve and hand over" onAction={()=>toast('WI-4821 approved and handed to the Engineering Lead.')}>WI-4821 is waiting in your bay. Approve the design to hand it to the Engineering Lead.</NextStep>
      <div className="flex flex-col gap-4 p-5">
        <HowToRead items={[['Strip','One delivery run. It moves from bay to bay as each person approves it.'],['Bay','The person or role holding the strip right now.'],['Stamps','Who has already signed it, e.g. PO = Product Owner. Hover a stamp for the full name.'],['Coloured edge','Workspace: blue Full Application, purple Advisor Portal, green Client Services.'],['Agents in flight','Runs the AI is working on. They land in a bay when a person is needed.']]}/>
        <section className="border border-dashed border-brand/50 bg-brand-soft/50 p-3">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand">Agents working · 3 <span className="normal-case tracking-normal text-[#45433e]">· these land in a bay when a person is needed</span></div>
          <div className="grid grid-cols-3 gap-2">{AGENTS.map(([id,ws,t,s])=><div key={id} className="flex items-center gap-2 border border-brand/30 bg-white px-2 py-1.5"><span className="h-6 w-1.5" style={{background:WS[ws]}}/><span className="font-mono font-semibold">{id}</span><span className="truncate">{t}</span><span className="ml-auto flex items-center gap-1 text-[11.5px] text-brand"><span className="size-1.5 animate-pulse rounded-full bg-brand"/>{s}</span></div>)}</div>
        </section>
        <div className="grid grid-cols-2 gap-4">
          {BAYS.map(([role, strips])=>(
            <section key={role} className={cn('border bg-[#efede6]', role==='Solution Architect' ? 'col-span-2 border-gate' : 'border-border')}>
              <header className="flex items-center gap-2 border-b border-border px-3 py-2"><GateGlyph state={strips.length ? 'waiting' : 'future'} className="size-3.5"/><b className="font-semibold">{role}</b>{role==='Solution Architect' && <span className="bg-gate px-1.5 text-[11px] font-semibold text-white">YOUR BAY</span>}<span className="ml-auto font-mono text-[11px] text-[#5c5a54]">{strips.filter(s=>!s.next).length} waiting</span></header>
              <div className="space-y-1.5 p-2">{strips.map(s=><Strip key={s.id} s={s}/>)}</div>
              {role==='Solution Architect' && <div className="flex items-center gap-2 border-t border-border px-3 py-2"><Button size="sm" onClick={()=>toast('WI-4821 approved and handed to the Engineering Lead.')}>Approve 4821 and hand to Engineering Lead</Button><Button size="sm" variant="outline" onClick={()=>toast('WI-4821 sent back to the Product Owner with your note.')}>Send back to Product Owner</Button></div>}
            </section>))}
        </div>
      </div>
    </Shell>
  );
}
