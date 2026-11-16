// Temporary router: add one import and one ROUTES line per screen as you build it. Replaced by the final router in step 31.
import { useEffect, useState } from 'react';
import V3Home from '@/v3/Home';
import { RequirePerm } from '@/v3/gate';

export const ROUTES = {
  'v3-home': V3Home,
};
const GUARD = { 'v3-admin': 'squads.manage', 'v3-squad': 'squads.manage', 'v3-squads': 'squads.manage', 'v3-people': 'people.manage', 'v3-policies': 'policies.manage', 'v3-connections': 'connections.manage', 'v3-roles': 'roles.manage', 'v3-audit': 'audit.view' };

const startHash = () => { const h = location.hash.slice(1); if (h) return h; history.replaceState(null, '', '#v3-home'); return 'v3-home'; };
const useHash = () => { const [h, setH] = useState(startHash); useEffect(() => { const f = () => setH(location.hash.slice(1) || 'v3-home'); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []); return h; };
const NotFound = () => <div className="v3 grid min-h-screen place-items-center p-8 text-center"><div><h1 className="font-display text-[26px] font-semibold">This page does not exist</h1><p className="mt-2 text-[15px] text-[var(--v-ink-2)]">It may not be built yet.</p><a href="#v3-home" className="mt-5 inline-block rounded-lg bg-[var(--v-blue)] px-5 py-2.5 font-medium text-white">Go to home</a></div></div>;

export default function App() {
  const h = useHash();
  useEffect(() => { window.scrollTo(0, 0); }, [h]);
  const runId = h.startsWith('v3-run-') ? h.slice(7).split('/')[0].toUpperCase() : null;
  const squadId = h.startsWith('v3-squad-') ? h.slice(9).toUpperCase() : null;
  const key = runId ? 'v3-run' : squadId ? 'v3-squad' : h;
  const C = ROUTES[key];
  if (!C) return <NotFound />;
  const page = runId ? <C key={runId} id={runId} /> : squadId ? <C key={squadId} id={squadId} /> : <C />;
  return GUARD[key] ? <RequirePerm perm={GUARD[key]} active={key.slice(3)} crumbs={['Admin']}>{page}</RequirePerm> : page;
}
