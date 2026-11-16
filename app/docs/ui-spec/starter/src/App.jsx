// Hash router for the product: 19 screens, permission guards, the narrow-screen notice and "not found".
import { useEffect, useState } from 'react';
import V3Home from '@/v3/Home';
import V3New from '@/v3/NewRequest';
import V3Run from '@/v3/Run';
import V3Approve from '@/v3/Approve';
import V3Clarify from '@/v3/Clarify';
import V3Evidence from '@/v3/Evidence';
import V3Admin from '@/v3/Admin';
import V3Runs from '@/v3/Runs';
import V3Review from '@/v3/Review';
import V3Release from '@/v3/Release';
import V3Rules from '@/v3/Rules';
import V3People from '@/v3/People';
import V3Policies from '@/v3/Policies';
import V3Connections from '@/v3/Connections';
import V3Roles from '@/v3/Roles';
import V3Artifacts from '@/v3/Artifacts';
import V3Audit from '@/v3/Audit';
import V3Squads from '@/v3/Squads';
import V3Squad from '@/v3/Squad';
import { RequirePerm } from '@/v3/gate';
import { useTheme } from '@/v3/theme';

const ApprovalsList = () => <V3Runs approvals />;
// route → screen component
export const ROUTES = {
  'v3-home': V3Home, 'v3-new': V3New, 'v3-runs': V3Runs, 'v3-approvals': ApprovalsList, 'v3-run': V3Run,
  'v3-approve': V3Approve, 'v3-clarify': V3Clarify, 'v3-evidence': V3Evidence, 'v3-review': V3Review, 'v3-release': V3Release,
  'v3-rules': V3Rules, 'v3-artifacts': V3Artifacts,
  'v3-admin': V3Admin, 'v3-squads': V3Squads, 'v3-squad': V3Squad, 'v3-people': V3People, 'v3-roles': V3Roles,
  'v3-policies': V3Policies, 'v3-connections': V3Connections, 'v3-audit': V3Audit,
};
// route → permission needed to open it
const GUARD = { 'v3-admin': 'squads.manage', 'v3-squad': 'squads.manage', 'v3-squads': 'squads.manage', 'v3-people': 'people.manage', 'v3-policies': 'policies.manage', 'v3-connections': 'connections.manage', 'v3-roles': 'roles.manage', 'v3-audit': 'audit.view' };

const startHash = () => { const h = location.hash.slice(1); if (h) return h; history.replaceState(null, '', '#v3-home'); return 'v3-home'; };
const useHash = () => { const [h, setH] = useState(startHash); useEffect(() => { const f = () => setH(location.hash.slice(1) || 'v3-home'); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []); return h; };

// Phones and narrow windows: the platform is built for laptop screens, so explain that and offer the desktop layout in a scrollable frame.
const useNarrow = () => { const q = '(max-width: 899px)'; const [n, setN] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches); useEffect(() => { const m = matchMedia(q); const f = () => setN(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []); return n; };
function NarrowGate({ onContinue }) {
  const { resolved } = useTheme();
  return (
    <div data-mode={resolved} className="v3 flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] rounded-2xl bg-[var(--v-surface)] p-6 shadow-lg ring-1 ring-black/5">
        <div className="text-[13px] text-[var(--v-ink-3)]">Clickable prototype</div>
        <h1 className="mt-1 font-display text-[24px] leading-tight font-semibold">Unified Product Delivery Platform</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--v-ink-2)]">This platform is designed for laptops and larger screens, where approvers review documents side by side with their decision. Open this link on a computer for the best experience.</p>
        <button onClick={onContinue} className="mt-5 h-11 w-full rounded-lg bg-[var(--v-blue)] font-medium text-white">Show the desktop layout anyway</button>
        <p className="mt-3 text-center text-[12.5px] text-[var(--v-ink-3)]">You will need to scroll sideways.</p>
      </div>
    </div>
  );
}
const NotFound = () => <div className="v3 grid min-h-screen place-items-center p-8 text-center"><div><h1 className="font-display text-[26px] font-semibold">This page does not exist</h1><p className="mt-2 text-[15px] text-[var(--v-ink-2)]">The link may be out of date.</p><a href="#v3-home" className="mt-5 inline-block rounded-lg bg-[var(--v-blue)] px-5 py-2.5 font-medium text-white">Go to home</a></div></div>;

export default function App() {
  const h = useHash();
  const narrow = useNarrow();
  const [wide, setWide] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, [h]);
  // #v3-run-wi-4821 (optionally /design or /story-2) and #v3-squad-wi-4836 carry the work item in the address
  const runId = h.startsWith('v3-run-') ? h.slice(7).split('/')[0].toUpperCase() : null;
  const squadId = h.startsWith('v3-squad-') ? h.slice(9).toUpperCase() : null;
  const guardKey = squadId ? 'v3-squad' : h;
  const C = ROUTES[h];
  if (narrow && !wide) return <NarrowGate onContinue={() => setWide(true)} />;
  if (!C && !runId && !squadId) return <NotFound />;
  const page = runId ? <V3Run key={runId} id={runId} /> : squadId ? <V3Squad key={squadId} id={squadId} /> : <C />;
  const body = GUARD[guardKey] ? <RequirePerm perm={GUARD[guardKey]} active={guardKey.slice(3)} crumbs={['Admin']}>{page}</RequirePerm> : page;
  return narrow ? <div style={{ overflowX: 'auto', maxWidth: '100vw' }}><div style={{ minWidth: 1280 }}>{body}</div></div> : body;
}
