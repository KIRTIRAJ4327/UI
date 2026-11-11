// The prototype's own controls (reset, tour, jump to a screen), kept in the sidebar so they never cover the product.
import { useProto } from './store';

const JUMP = [['v3-home', 'Home'], ['v3-approvals', 'Approvals'], ['v3-runs', 'Runs'], ['v3-approve', 'Design'], ['v3-clarify', 'Questions'], ['v3-review', 'Code'], ['v3-release', 'Release'], ['v3-artifacts', 'Artifacts'], ['v3-admin', 'Governance'], ['v3-squads', 'Squads'], ['v3-roles', 'Roles'], ['v3-audit', 'Audit']];
export function PrototypeMenu() {
  const { reset, tour, setTour } = useProto();
  return (
    <details className="mb-2 shrink-0 rounded-lg border border-white/10 text-[12.5px] text-white">
      <summary className="cursor-pointer px-3 py-1.5 font-medium text-[#c8cde0] hover:text-white">Prototype controls</summary>
      <div className="flex flex-col gap-1 p-2 pt-0">
        <button onClick={() => setTour(!tour)} className="rounded-md bg-white/10 px-2 py-1.5 text-left hover:bg-white/20">{tour ? 'Hide the guided tour' : 'Show the guided tour'}</button>
        <button onClick={() => { reset(); location.hash = 'v3-home'; }} className="rounded-md bg-white/10 px-2 py-1.5 text-left hover:bg-white/20">Reset demo data</button>
        <nav aria-label="Jump to screen" className="flex flex-wrap gap-0.5 pt-1">{JUMP.map(([k, l]) => <a key={k} href={`#${k}`} className="rounded px-1.5 py-1 text-[#c8cde0] hover:bg-white/15 hover:text-white">{l}</a>)}</nav>
        <a href="#mockups" className="rounded-md px-2 py-1 text-[#8f97b3] hover:bg-white/15">Earlier design rounds</a>
      </div>
    </details>
  );
}
