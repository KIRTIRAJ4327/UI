// Prototype state shared by every v3 screen. Decisions on one screen change the others.
// Kept in sessionStorage so a refresh keeps the demo where it was; "Reset demo" starts over.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const STAGE = ['Plan', 'Specify', 'Impact', 'Design', 'Build', 'Integrate', 'Validate', 'Release'];

const INITIAL = {
  runs: {
    'WI-4821': { id: 'WI-4821', t: 'Registered Amortization limit', app: 'Full Application', by: 'priya', s: 'dddw', state: 'wait', now: 'Design waiting for approval', holder: 'alex', age: '1 d', eta: 'Thu 13 Nov', screen: '#v3-approve', ask: 'Approve the solution design', why: 'Blocks values above 310 on Product Selection. The Pricing API is not covered.', wait: '12 min' },
    'WI-4799': { id: 'WI-4799', t: 'Statement export format', app: 'Client Services', by: 'priya', s: 'dw', state: 'wait', now: 'Questions waiting for an answer', holder: 'alex', age: '3 d', eta: 'Wed 19 Nov', screen: '#v3-clarify', ask: 'Answer 2 questions', why: 'The agent needs to know the column order before writing the specification.', wait: '1 h' },
    'WI-4807': { id: 'WI-4807', t: 'Advisor eligibility banner', app: 'Advisor Portal', by: 'jon', s: 'ddddw', state: 'wait', now: 'Build waiting for code review', holder: 'alex', age: '2 d', eta: 'Fri 14 Nov', screen: '#v3-review', ask: 'Review the completion report', why: 'Code and 6 unit tests are ready. Jon is on leave, so this came to you.', wait: '3 h', reassigned: true, backupFor: 'Engineering Lead' },
    'WI-4836': { id: 'WI-4836', t: 'Rate hold expiry notice', app: 'Full Application', by: 'alex', s: 'dda', state: 'work', now: 'Agent writing the impact assessment', holder: 'agent', age: '2 h', eta: 'Mon 17 Nov', squadGap: true },
    'WI-4830': { id: 'WI-4830', t: 'Advisor licence check', app: 'Advisor Portal', by: 'priya', s: 'ddd', state: 'work', now: 'Agent preparing the design', holder: 'agent', age: '6 h', eta: 'Tue 2 Dec', freeze: true },
    'WI-4790': { id: 'WI-4790', t: 'Session timeout copy', app: 'Advisor Portal', by: 'jon', s: 'ddddddf', state: 'bad', now: 'Validation failed: 2 tests', holder: 'jon', age: '4 d', eta: 'At risk' },
    'WI-4772': { id: 'WI-4772', t: 'Fee schedule update', app: 'Full Application', by: 'priya', s: 'dddddddw', state: 'wait', now: 'Release waiting for sign-off', holder: 'sam', age: '5 d', eta: 'Thu 13 Nov', screen: '#v3-release', ask: 'Release the fee schedule update', why: 'Validation and business sign-off are done. Choose a release window.', wait: '5 h' },
    'WI-4751': { id: 'WI-4751', t: 'Mortgage term picker labels', app: 'Full Application', by: 'priya', s: 'dddddddd', state: 'done', now: 'Released', holder: 'sam', age: '9 d', eta: 'Released 6 Nov' },
  },
  order: ['WI-4836', 'WI-4830', 'WI-4821', 'WI-4807', 'WI-4799', 'WI-4790', 'WI-4772', 'WI-4751'],
  notes: [
    { id: 'n1', t: 'Design waiting for your approval', s: 'WI-4821 · from the delivery agent', a: '12 min', href: '#v3-approve', unread: true },
    { id: 'n2', t: 'Completion report reassigned to you', s: 'WI-4807 · Jon Reyes is on leave', a: '3 h', href: '#v3-review', unread: true },
    { id: 'n3', t: 'Priya replied to your question', s: 'WI-4821 · “Can we add the server check…”', a: '10 min', href: '#v3-approve', unread: true },
    { id: 'n4', t: 'Teams notifications are failing', s: 'Connections · sign-in expired at 08:12', a: '2 h', href: '#v3-connections', unread: false },
    { id: 'n5', t: 'Fee schedule update released', s: 'WI-4751 · Sam Okafor', a: 'Tue', href: '#v3-runs', unread: false },
  ],
  feed: [
    { p: 'agent', title: 'Design finished · WI-4821', who: 'The agent', t: '12 min ago' },
    { p: 'priya', title: 'Plan approved · WI-4830', who: 'Priya Nair', t: '40 min ago' },
    { p: 'agent', title: 'Fixed its own mistake · WI-4821', who: 'The agent', t: '45 min ago' },
    { p: 'sam', title: 'Released · WI-4751', who: 'Sam Okafor', t: 'Tue 16:05' },
  ],
  teamsOk: false,
  attention: ['leave', 'agent', 'freeze', 'squad'],
  nextId: 4841,
  me: 'alex',
  tour: false,
  welcomed: false,
  roles: {
    'Platform Admin': ['request.create', 'gate.plan', 'gate.design', 'gate.build', 'gate.integrate', 'gate.validate', 'gate.release', 'runs.pause', 'artifacts.own', 'artifacts.all', 'artifacts.export', 'audit.view', 'squads.manage', 'people.manage', 'roles.manage', 'policies.manage', 'connections.manage'],
    'Product Owner': ['request.create', 'gate.plan', 'runs.pause', 'artifacts.own'],
    'Solution Architect': ['request.create', 'gate.design', 'artifacts.own'],
    'Engineering Lead': ['request.create', 'gate.build', 'runs.pause', 'artifacts.own'],
    'Integration Lead': ['gate.integrate', 'artifacts.own'],
    'Quality Lead': ['gate.validate', 'artifacts.own'],
    'Release Manager': ['gate.release', 'runs.pause', 'artifacts.own', 'artifacts.export'],
    'Auditor': ['artifacts.all', 'artifacts.export', 'audit.view'],
    'Requester': ['request.create', 'artifacts.own'],
  },
  audit: [
    { t: '09:42', who: 'agent', action: 'Saved document', target: 'ADR-0173 · WI-4821', cat: 'artifact' },
    { t: '09:40', who: 'agent', action: 'Opened approval gate (Solution Architect)', target: 'WI-4821', cat: 'gate' },
    { t: '09:31', who: 'dana', action: 'Viewed document', target: 'Impact assessment · WI-4821', cat: 'access' },
    { t: '09:12', who: 'priya', action: 'Approved plan', target: 'WI-4830', cat: 'gate' },
    { t: '08:12', who: 'system', action: 'Connection failed: Microsoft Teams sign-in expired', target: 'Connections', cat: 'system' },
    { t: 'Mon 17:20', who: 'dana', action: 'Changed role: Lena Brooks can approve as Integration Lead', target: 'People and access', cat: 'rbac' },
    { t: 'Mon 16:05', who: 'sam', action: 'Released', target: 'WI-4751', cat: 'gate' },
    { t: 'Mon 11:02', who: 'dana', action: 'Exported audit pack (week 45)', target: 'Governance', cat: 'access' },
  ],
};
export const ROLE_OF = { alex: 'Solution Architect', priya: 'Product Owner', sam: 'Release Manager', dana: 'Platform Admin', jon: 'Engineering Lead', lena: 'Engineering Lead', tom: 'Integration Lead', mara: 'Quality Lead', ana: 'Quality Lead', ravi: 'Solution Architect' };
export const PERMS = [
  ['Delivery', [['request.create', 'Start requests'], ['runs.pause', 'Pause and resume runs']]],
  ['Approval gates', [['gate.plan', 'Approve plans and specifications'], ['gate.design', 'Approve designs'], ['gate.build', 'Approve builds'], ['gate.integrate', 'Approve integration'], ['gate.validate', 'Approve validation'], ['gate.release', 'Release to production']]],
  ['Artifacts and evidence', [['artifacts.own', 'See artifacts for their own work'], ['artifacts.all', 'See every artifact'], ['artifacts.export', 'Download and export artifacts'], ['audit.view', 'See the audit log']]],
  ['Administration', [['squads.manage', 'Manage squads'], ['people.manage', 'Manage people and access'], ['roles.manage', 'Edit roles and permissions'], ['policies.manage', 'Edit policies'], ['connections.manage', 'Manage connections']]],
];
// Short title from a free-text request: first sentence, without a leading "In the ... flow," clause, cut at a word.
const titleFrom = text => { let t = (text.split('.')[0] || '').replace(/^\s*(in|on|for|within)\b[^,]{0,60},\s*/i, '').trim(); t = t.charAt(0).toUpperCase() + t.slice(1); if (t.length > 56) t = t.slice(0, 56).replace(/\s+\S*$/, '') + '…'; return t || 'New request'; };
const NAME = { alex: 'Alex Kim', priya: 'Priya Nair', sam: 'Sam Okafor', dana: 'Dana Whitfield', agent: 'The agent', jon: 'Jon Reyes', lena: 'Lena Brooks' };

const KEY = 'delivery-prototype-v5';
const load = () => { try { const s = sessionStorage.getItem(KEY); return s ? JSON.parse(s) : INITIAL; } catch { return INITIAL; } };

const Ctx = createContext(null);
export function PrototypeProvider({ children }) {
  const [st, setSt] = useState(load);
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch { /* storage unavailable: demo still works in memory */ } }, [st]);

  const prev = useRef(null);
  const upd = useCallback(fn => setSt(s => { prev.current = s; return fn(structuredClone(s)); }), []);
  const note = (s, t, sub, href) => s.notes.unshift({ id: 'n' + Date.now() + Math.random(), t, s: sub, a: 'now', href, unread: true });
  const log = (s, action, target, cat = 'gate', who = s.me) => s.audit.unshift({ t: 'just now', who, action, target, cat });
  const feed = (s, p, title, who) => { s.feed.unshift({ p: s.me, title, who: NAME[s.me], t: 'just now' }); log(s, title.split(' · ')[0], title.split(' · ')[1] || ''); };
  const advance = (r, now, holder = 'agent', state = 'work') => { r.s = r.s.slice(0, -1) + 'd' + 'a'; r.state = state; r.now = now; r.holder = holder; r.wait = undefined; r.decidedAt = 'just now'; };

  const actions = useMemo(() => ({
    approveDesign: () => upd(s => { const r = s.runs['WI-4821']; advance(r, 'Agent building the change'); feed(s, 'alex', 'Design approved · WI-4821', 'Alex Kim'); note(s, 'Build started for WI-4821', 'The agent is writing the code and unit tests', '#v3-run-wi-4821'); return s; }),
    requestDesignChanges: () => upd(s => { const r = s.runs['WI-4821']; r.state = 'work'; r.now = 'Agent revising the design'; r.holder = 'agent'; r.s = 'ddda'; r.decidedAt = 'just now'; feed(s, 'alex', 'Changes requested · WI-4821', 'Alex Kim'); return s; }),
    answerQuestions: () => upd(s => { const r = s.runs['WI-4799']; advance(r, 'Agent writing the specification'); feed(s, 'alex', 'Questions answered · WI-4799', 'Alex Kim'); return s; }),
    approveBuild: () => upd(s => { const r = s.runs['WI-4807']; advance(r, 'Integration running on the merge commit'); r.reassigned = false; feed(s, 'alex', 'Build approved · WI-4807', 'Alex Kim'); note(s, 'Integration started for WI-4807', 'Tom Iverson will review the pipeline', '#v3-run-wi-4807'); return s; }),
    requestBuildChanges: () => upd(s => { const r = s.runs['WI-4807']; r.state = 'work'; r.now = 'Agent revising the code'; r.holder = 'agent'; r.s = 'dddda'; r.decidedAt = 'just now'; return s; }),
    scheduleRelease: when => upd(s => { const r = s.runs['WI-4772']; r.s = 'dddddddd'; r.state = 'done'; r.now = when === 'Now' ? 'Released' : `Release scheduled ${when}`; r.eta = when === 'Now' ? 'Released today' : when; r.holder = 'sam'; r.decidedAt = 'just now'; feed(s, 'sam', (when === 'Now' ? 'Released' : 'Release scheduled') + ' · WI-4772', 'Sam Okafor'); return s; }),
    holdRelease: () => upd(s => { const r = s.runs['WI-4772']; r.now = 'Release on hold'; r.state = 'bad'; r.decidedAt = 'just now'; return s; }),
    createRequest: (id, text, app) => upd(s => { s.nextId++; s.runs[id] = { id, t: titleFrom(text), app, by: s.me, s: 'a', state: 'work', now: 'Agent drafting the plan', holder: 'agent', age: 'just now', eta: 'About 3 days', fresh: true }; s.order.unshift(id); feed(s, 'alex', `Request started · ${id}`, 'Alex Kim'); return s; }),
    finishPlan: id => upd(s => { const r = s.runs[id]; if (r && r.s === 'a') { r.s = 'w'; r.state = 'wait'; r.now = 'Plan waiting for approval'; r.holder = 'priya'; r.ask = 'Approve the delivery plan'; r.why = 'The agent turned the request into 1 objective and 2 stories.'; r.wait = 'just now'; log(s, 'Opened approval gate (Product Owner)', id, 'gate', 'agent'); note(s, `Plan drafted for ${id}`, 'Priya Nair has been asked to approve it', `#v3-run-${id.toLowerCase()}`); } return s; }),
    approvePlan: id => upd(s => { const r = s.runs[id]; advance(r, 'Agent writing the specification'); feed(s, s.me, `Plan approved · ${id}`); return s; }),
    requestPlanChanges: id => upd(s => { const r = s.runs[id]; r.state = 'work'; r.now = 'Agent revising the plan'; r.holder = 'agent'; r.s = 'a'; r.decidedAt = 'just now'; feed(s, s.me, `Plan sent back · ${id}`); return s; }),
    setMe: p => upd(s => { log(s, `Signed in as ${NAME[p]}`, 'Demo role switch', 'access', p); s.me = p; return s; }),
    togglePerm: (role, perm) => upd(s => { const l = s.roles[role]; const on = l.includes(perm); s.roles[role] = on ? l.filter(x => x !== perm) : [...l, perm]; log(s, `${on ? 'Removed' : 'Granted'} permission “${perm}” ${on ? 'from' : 'to'} ${role}`, 'Roles and permissions', 'rbac'); return s; }),
    viewArtifact: (name, run) => upd(s => { log(s, 'Viewed document', `${name} · ${run}`, 'access'); return s; }),
    exportArtifacts: what => upd(s => { log(s, `Exported ${what}`, 'Artifact library', 'access'); return s; }),
    resolve: key => upd(s => { s.attention = s.attention.filter(a => a !== key); log(s, { leave: 'Reassigned WI-4807 to Lena Brooks', agent: 'Assigned an engineer to WI-4790', freeze: 'Approved freeze exception for WI-4830', squad: 'Completed squad for WI-4836' }[key], 'Governance', 'admin'); if (key === 'leave') { s.runs['WI-4807'].holder = 'lena'; } if (key === 'squad') s.runs['WI-4836'].squadGap = false; if (key === 'freeze') { s.runs['WI-4830'].freeze = false; s.runs['WI-4830'].eta = 'Thu 4 Dec'; } return s; }),
    fixTeams: () => upd(s => { s.teamsOk = true; log(s, 'Signed in to Microsoft Teams again', 'Connections', 'admin'); s.notes = s.notes.map(n => n.id === 'n4' ? { ...n, unread: false } : n); return s; }),
    markRead: () => upd(s => { s.notes.forEach(n => { n.unread = false; }); return s; }),
    togglePause: id => upd(s => { const r = s.runs[id]; r.paused = !r.paused; feed(s, s.me, `${r.paused ? 'Paused' : 'Resumed'} · ${id}`); return s; }),
    setTour: on => setSt(s => ({ ...s, tour: on })),
    setWelcomed: () => setSt(s => ({ ...s, welcomed: true })),
    undo: () => { if (prev.current) { setSt(prev.current); prev.current = null; } },
    reset: () => setSt(s => ({ ...INITIAL, welcomed: true, tour: s.tour })),
  }), [upd]);

  const derived = useMemo(() => {
    const view = r => ({ ...r, state: r.state === 'wait' && r.holder === st.me ? 'you' : r.state, now: r.state === 'wait' ? (r.holder === st.me ? r.now.replace('waiting for approval', 'waiting for your approval').replace('waiting for an answer', 'waiting for your answer') : r.now) : r.now });
    const runs = Object.fromEntries(Object.entries(st.runs).map(([k, r]) => [k, view(r)]));
    const list = st.order.map(id => runs[id]);
    const mine = list.filter(r => r.state === 'you');
    const myRole = ROLE_OF[st.me];
    const perms = st.roles[myRole] || [];
    const can = p => perms.includes(p);
    return { raw: st.runs, runs, list, mine, myRole, can, unread: st.notes.filter(n => n.unread).length };
  }, [st]);

  return <Ctx.Provider value={{ ...st, ...derived, ...actions, STAGE, NAME }}>{children}</Ctx.Provider>;
}
export const useProto = () => useContext(Ctx);
export const runHref = id => `#v3-run-${id.toLowerCase()}`;
