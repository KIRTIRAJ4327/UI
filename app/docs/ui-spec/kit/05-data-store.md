# Step 5 of 31: Data store and workflow

All sample data and every action (approve, send back, release, undo…). This is the brain of the prototype; screens only call it.

## What to tell Copilot

Open this file in the editor, then paste this into Copilot Chat (Agent or Edit mode):

```text
Using #file:05-data-store.md, create the file exactly as given in the "Files" section: src/v3/store.jsx.
Copy the code character for character. Do not rename, reformat, shorten, "improve" or convert to TypeScript.
Do not leave placeholders such as "// rest of the code". When done, list the files you created with their line counts.
```

## Files

Create this file with **exactly** this content.

### File: `src/v3/store.jsx` (165 lines)

`````jsx
// Prototype state shared by every v3 screen. Decisions on one screen change the others.
// Kept in sessionStorage so a refresh keeps the demo where it was; "Reset demo" starts over.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const STAGE = ['Plan', 'Specify', 'Impact', 'Design', 'Build', 'Integrate', 'Validate', 'Release'];

const INITIAL = {
  runs: {
    'WI-4821': { id: 'WI-4821', t: 'Registered Amortization limit', app: 'Full Application', by: 'priya', s: 'dddw', state: 'wait', now: 'Design waiting for approval', holder: 'alex', age: '1 d', eta: 'Thu 13 Nov', screen: '#v3-approve', ask: 'Approve the solution design', why: 'Blocks values above 310 on Product Selection. The Pricing API is not covered.', wait: '12 min' },
    'WI-4799': { id: 'WI-4799', t: 'Statement export format', app: 'Client Services', by: 'priya', s: 'dw', state: 'wait', now: 'Questions waiting for an answer', holder: 'priya', age: '3 d', eta: 'Wed 19 Nov', screen: '#v3-clarify', ask: 'Answer 2 questions', why: 'The agent needs to know the column order before writing the specification.', wait: '1 h' },
    'WI-4807': { id: 'WI-4807', t: 'Advisor eligibility banner', app: 'Advisor Portal', by: 'jon', s: 'ddddw', state: 'wait', now: 'Build waiting for code review', holder: 'alex', age: '2 d', eta: 'Fri 14 Nov', screen: '#v3-review', ask: 'Review the completion report', why: 'Code and 6 unit tests are ready. Jon is on leave, so this came to you.', wait: '3 h', reassigned: true, backupFor: 'Engineering Lead' },
    'WI-4836': { id: 'WI-4836', t: 'Rate hold expiry notice', app: 'Full Application', by: 'alex', s: 'dda', state: 'work', now: 'Agent writing the impact assessment', holder: 'agent', age: '2 h', eta: 'Mon 17 Nov', squadGap: true },
    'WI-4830': { id: 'WI-4830', t: 'Advisor licence check', app: 'Advisor Portal', by: 'priya', s: 'ddd', state: 'work', now: 'Agent preparing the design', holder: 'agent', age: '6 h', eta: 'Tue 2 Dec', freeze: true },
    'WI-4790': { id: 'WI-4790', t: 'Session timeout copy', app: 'Advisor Portal', by: 'jon', s: 'ddddddf', state: 'bad', now: 'Validation failed: 2 tests', holder: 'jon', age: '4 d', eta: 'At risk' },
    'WI-4772': { id: 'WI-4772', t: 'Fee schedule update', app: 'Full Application', by: 'priya', s: 'dddddddw', state: 'wait', now: 'Release waiting for sign-off', holder: 'sam', age: '5 d', eta: 'Thu 13 Nov', screen: '#v3-release', ask: 'Release the fee schedule update', why: 'Validation and business sign-off are done. Choose a release window.', wait: '5 h' },
    'WI-4751': { id: 'WI-4751', t: 'Mortgage term picker labels', app: 'Full Application', by: 'priya', s: 'dddddddd', state: 'done', now: 'Released', holder: 'sam', age: '9 d', eta: 'Released 9 Nov' },
  },
  order: ['WI-4836', 'WI-4830', 'WI-4821', 'WI-4807', 'WI-4799', 'WI-4790', 'WI-4772', 'WI-4751'],
  notes: [
    { id: 'n6', to: ['sam'], t: 'Release waiting for your sign-off', s: 'WI-4772 · validation and UAT are done', a: '5 h', href: '#v3-release', unread: true },
    { id: 'n7', to: ['dana'], t: 'Approver on leave is holding a review', s: 'WI-4807 · Jon Reyes is away until Friday', a: '3 h', href: '#v3-admin', unread: true },
    { id: 'n1', to: ['alex'], t: 'Design waiting for your approval', s: 'WI-4821 · from the delivery agent', a: '12 min', href: '#v3-approve', unread: true },
    { id: 'n2', to: ['alex'], t: 'Completion report reassigned to you', s: 'WI-4807 · Jon Reyes is on leave', a: '3 h', href: '#v3-review', unread: true },
    { id: 'n3', to: ['alex'], t: 'Priya replied to your question', s: 'WI-4821 · “Can we add the server check…”', a: '10 min', href: '#v3-approve', unread: true },
    { id: 'n4', to: ['dana'], t: 'Teams notifications are failing', s: 'Connections · sign-in expired at 08:12', a: '2 h', href: '#v3-connections', unread: false },
    { id: 'n5', t: 'Term picker labels released', s: 'WI-4751 · Sam Okafor', a: 'Mon', href: '#v3-runs', unread: false },
  ],
  feed: [
    { p: 'agent', title: 'Design finished · WI-4821', who: 'The agent', t: '12 min ago' },
    { p: 'priya', title: 'Plan approved · WI-4830', who: 'Priya Nair', t: '40 min ago' },
    { p: 'agent', title: 'Fixed its own mistake · WI-4821', who: 'The agent', t: '45 min ago' },
    { p: 'sam', title: 'Released · WI-4751', who: 'Sam Okafor', t: 'Mon 16:05' },
  ],
  teamsOk: false,
  attention: ['leave', 'agent', 'freeze', 'squad'],
  nextId: 4841,
  me: 'alex',
  v: 0,
  policy: { planSoD: true },
  comments: { 'WI-4821': [{ who: 'priya', text: 'Can we add the server check as a follow-up request?', at: '2026-11-11T09:32:00Z' }] },
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
    { t: '08:40', at: '2026-11-11T08:40:00Z', ip: '10.20.4.2', who: 'agent', action: 'Validation failed after 3 attempts: 2 tests', target: 'WI-4790', cat: 'gate' },
    { t: '08:05', at: '2026-11-11T08:05:00Z', ip: '10.20.4.2', who: 'agent', action: 'Retried validation (attempt 2 of 3)', target: 'WI-4790', cat: 'gate' },
    { t: '09:42', at: '2026-11-11T09:42:00Z', ip: '10.20.4.148', who: 'agent', action: 'Saved document', target: 'ADR-0173 · WI-4821', cat: 'artifact' },
    { t: '09:40', at: '2026-11-11T09:40:00Z', ip: '10.20.4.102', who: 'agent', action: 'Opened approval gate (Solution Architect)', target: 'WI-4821', cat: 'gate' },
    { t: '09:31', at: '2026-11-11T09:31:00Z', ip: '10.20.4.185', who: 'dana', action: 'Viewed document', target: 'Impact assessment · WI-4821', cat: 'access' },
    { t: '09:12', at: '2026-11-11T09:12:00Z', ip: '10.20.4.197', who: 'priya', action: 'Approved plan', target: 'WI-4830', cat: 'gate' },
    { t: '08:12', at: '2026-11-11T08:12:00Z', ip: '10.20.4.112', who: 'system', action: 'Connection failed: Microsoft Teams sign-in expired', target: 'Connections', cat: 'system' },
    { t: 'Mon 17:20', at: '2026-11-09T17:20:00Z', ip: '10.20.4.135', who: 'dana', action: 'Changed role: Lena Brooks can approve as Integration Lead', target: 'People and access', cat: 'rbac' },
    { t: 'Mon 16:05', at: '2026-11-09T16:05:00Z', ip: '10.20.4.143', who: 'sam', action: 'Released', target: 'WI-4751', cat: 'gate' },
    { t: 'Mon 11:02', at: '2026-11-09T11:02:00Z', ip: '10.20.4.129', who: 'dana', action: 'Exported audit pack (week 45)', target: 'Governance', cat: 'access' },
  ],
};
export const STAGE_APPROVER = ['priya', 'priya', null, 'alex', 'jon', 'tom', 'mara', 'sam'];
export const ROLE_OF = { alex: 'Solution Architect', priya: 'Product Owner', sam: 'Release Manager', dana: 'Platform Admin', jon: 'Engineering Lead', lena: 'Engineering Lead', tom: 'Integration Lead', mara: 'Quality Lead', ana: 'Quality Lead', ravi: 'Solution Architect', ines: 'Auditor' };
export const PERMS = [
  ['Delivery', [['request.create', 'Start requests'], ['runs.pause', 'Pause and resume runs']]],
  ['Approval gates', [['gate.plan', 'Approve plans and specifications'], ['gate.design', 'Approve designs'], ['gate.build', 'Approve builds'], ['gate.integrate', 'Approve integration'], ['gate.validate', 'Approve validation'], ['gate.release', 'Release to production']]],
  ['Artifacts and evidence', [['artifacts.own', 'See artifacts for their own work'], ['artifacts.all', 'See every artifact'], ['artifacts.export', 'Download and export artifacts'], ['audit.view', 'See the audit log']]],
  ['Administration', [['squads.manage', 'Manage squads'], ['people.manage', 'Manage people and access'], ['roles.manage', 'Edit roles and permissions'], ['policies.manage', 'Edit policies'], ['connections.manage', 'Manage connections']]],
];
// Short title from a free-text request: first sentence, without a leading "In the ... flow," clause, cut at a word.
const titleFrom = text => { let t = (text.split('.')[0] || '').replace(/^\s*(in|on|for|within)\b[^,]{0,60},\s*/i, '').trim(); t = t.charAt(0).toUpperCase() + t.slice(1); if (t.length > 56) t = t.slice(0, 56).replace(/\s+\S*$/, '') + '…'; return t || 'New request'; };
const NAME = { alex: 'Alex Kim', priya: 'Priya Nair', sam: 'Sam Okafor', dana: 'Dana Whitfield', agent: 'The agent', jon: 'Jon Reyes', lena: 'Lena Brooks', tom: 'Tom Iverson', mara: 'Mara Lopez', ana: 'Ana Costa', ravi: 'Ravi Shah', ines: 'Ines Duarte' };
const PEOPLE_FIRST = Object.fromEntries(Object.entries(NAME).filter(([k]) => k !== 'agent').map(([k, v]) => [k, v.split(' ')[0].toLowerCase()]));

const KEY = 'delivery-prototype-v7';
const load = () => { try { const s = sessionStorage.getItem(KEY); return s ? JSON.parse(s) : INITIAL; } catch { return INITIAL; } };

const Ctx = createContext(null);
export function PrototypeProvider({ children }) {
  const actionsRef = useRef(null);
  const [st, setSt] = useState(load);
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch { /* storage unavailable: demo still works in memory */ } }, [st]);

  // Every change gets a version number. An action returns a token; Undo only works while nothing else has changed since.
  const stRef = useRef(st); stRef.current = st;
  const upd = useCallback(fn => { const before = stRef.current; const next = fn(structuredClone(before)); next.v = (before.v || 0) + 1; stRef.current = next; setSt(next); return { before, v: next.v }; }, []);
  const note = (s, t, sub, href, to) => s.notes.unshift({ id: 'n' + Date.now() + Math.random(), to, t, s: sub, a: 'now', href, unread: true });
  const log = (s, action, target, cat = 'gate', who = s.me, detail) => s.audit.unshift({ t: 'just now', at: new Date().toISOString(), ip: '10.20.4.' + (who === 'agent' ? 2 : 37), live: true, who, action, target, cat, detail });
  const feed = (s, p, title, who) => { s.feed.unshift({ p: s.me, title, who: NAME[s.me], t: 'just now' }); log(s, title.split(' · ')[0], title.split(' · ')[1] || ''); };
  const advance = (r, now, holder = 'agent', state = 'work') => { r.s = r.s.slice(0, -1) + 'd' + 'a'; r.state = state; r.now = now; r.holder = holder; r.wait = undefined; r.decidedAt = 'just now'; };

  // The agent's own integration and validation runs finish a few seconds after they start.
  useEffect(() => {
    const ids = Object.values(st.runs).filter(r => r.state === 'work' && !r.paused && !r.retrying && (r.s.length === 6 || r.s.length === 7) && r.s.at(-1) === 'a').map(r => r.id);
    if (!ids.length) return; const t = setTimeout(() => ids.forEach(id => actionsRef.current?.finishAuto(id)), 5000); return () => clearTimeout(t);
  }, [st.runs]);
  const actions = useMemo(() => ({
    approveDesign: () => upd(s => { const r = s.runs['WI-4821']; advance(r, 'Agent building the change'); feed(s, 'alex', 'Design approved · WI-4821', 'Alex Kim'); note(s, 'Build started for WI-4821', 'The agent is writing the code and unit tests', '#v3-run-wi-4821'); return s; }),
    requestDesignChanges: () => upd(s => { const r = s.runs['WI-4821']; r.state = 'work'; r.now = 'Agent revising the design'; r.holder = 'agent'; r.s = 'ddda'; r.decidedAt = 'just now'; feed(s, 'alex', 'Changes requested · WI-4821', 'Alex Kim'); return s; }),
    answerQuestions: answers => upd(s => { const r = s.runs['WI-4799']; r.answers = answers; advance(r, 'Agent writing the specification'); feed(s, s.me, 'Questions answered · WI-4799', NAME[s.me]); return s; }),
    approveBuild: () => upd(s => { const r = s.runs['WI-4807']; advance(r, 'Integration running on the merge commit'); r.reassigned = false; feed(s, 'alex', 'Build approved · WI-4807', 'Alex Kim'); note(s, 'Integration started for WI-4807', 'Tom Iverson will review the pipeline', '#v3-run-wi-4807'); return s; }),
    requestBuildChanges: () => upd(s => { const r = s.runs['WI-4807']; r.state = 'work'; r.now = 'Agent revising the code'; r.holder = 'agent'; r.s = 'dddda'; r.decidedAt = 'just now'; return s; }),
    scheduleRelease: when => upd(s => { const r = s.runs['WI-4772']; const now = when === 'Now'; r.s = now ? 'dddddddd' : 'dddddddw'; r.state = now ? 'done' : 'work'; r.scheduled = now ? null : when; r.now = now ? 'Released' : `Release scheduled ${when}`; r.eta = now ? 'Released today' : when; r.holder = 'sam'; r.decidedAt = 'just now'; feed(s, 'sam', (when === 'Now' ? 'Released' : 'Release scheduled') + ' · WI-4772', 'Sam Okafor'); return s; }),
    holdRelease: reason => upd(s => { const r = s.runs['WI-4772']; r.now = 'Release on hold'; r.state = 'bad'; r.hold = reason; r.decidedAt = 'just now'; log(s, 'Held release', 'WI-4772', 'gate', s.me, reason); note(s, 'Release held · WI-4772', reason, '#v3-run-wi-4772', ['priya', 'mara']); return s; }),
    cancelSchedule: id => upd(s => { const r = s.runs[id]; r.scheduled = null; r.s = 'dddddddw'; r.state = 'wait'; r.holder = 'sam'; r.now = 'Release waiting for sign-off'; r.eta = 'Not scheduled'; r.decidedAt = null; log(s, 'Cancelled scheduled release', id); return s; }),
    invite: p => upd(s => { (s.invites ||= []).unshift({ ...p, at: new Date().toISOString() }); log(s, `Invited ${p.email} as ${p.role}`, 'People and access', 'admin', s.me, `Applications: ${p.apps.join(', ')}`); return s; }),
    setCover: c => upd(s => { (s.covers ||= []).unshift(c); log(s, `Set up cover: ${NAME[c.by] || c.by} covers for ${NAME[c.who] || c.who} until ${c.until}`, 'People and access', 'admin'); note(s, `You are covering for ${NAME[c.who] || c.who}`, `Until ${c.until} · set by ${NAME[s.me]}`, '#v3-approvals', [c.by]); return s; }),
    createRequest: (id, text, app) => upd(s => { s.nextId++; s.runs[id] = { id, t: titleFrom(text), app, by: s.me, s: 'a', state: 'work', now: 'Agent drafting the plan', holder: 'agent', age: 'just now', eta: 'About 3 days', fresh: true }; s.order.unshift(id); feed(s, 'alex', `Request started · ${id}`, 'Alex Kim'); return s; }),
    finishPlan: id => upd(s => { const r = s.runs[id]; if (r && r.s === 'a') { r.s = 'w'; r.state = 'wait'; r.now = 'Plan waiting for approval'; const sod = s.policy.planSoD && r.by === 'priya'; r.holder = sod ? 'dana' : 'priya'; r.ask = 'Approve the delivery plan'; r.why = sod ? 'Priya Nair requested this, so separation of duties sends the plan to Dana Whitfield as second approver.' : 'The agent turned the request into 1 objective and 2 stories.'; r.wait = 'just now'; log(s, sod ? 'Opened approval gate (second approver, separation of duties)' : 'Opened approval gate (Product Owner)', id, 'gate', 'agent'); note(s, `Plan waiting for your approval`, `${id} · drafted by the agent`, `#v3-run-${id.toLowerCase()}`, [r.holder]); if (r.by !== r.holder) note(s, `Plan drafted for ${id}`, `${sod ? 'Dana Whitfield' : 'Priya Nair'} has been asked to approve it`, `#v3-run-${id.toLowerCase()}`, [r.by]); } return s; }),
    // Integrate and Validate gates: the agent finishes its run, then the named lead approves or sends back.
    finishAuto: id => upd(s => { const r = s.runs[id]; if (!r || r.state !== 'work' || r.paused || r.retrying) return s; const i = r.s.length - 1; if (r.s[i] !== 'a' || (i !== 5 && i !== 6)) return s;
      r.screen = undefined; r.s = r.s.slice(0, -1) + 'w'; r.state = 'wait'; r.wait = 'just now'; r.holder = i === 5 ? 'tom' : 'mara'; r.now = i === 5 ? 'Integration waiting for approval' : 'Validation waiting for approval';
      r.ask = i === 5 ? 'Approve the integration' : 'Approve validation'; r.why = (i === 5 ? '3 pipelines passed on the merge commit and staging is deployed.' : 'Every acceptance criterion is met and 214 of 214 regression tests pass.') + (r.sentBack ? ' Resubmitted after your feedback.' : '');
      log(s, `Opened approval gate (${i === 5 ? 'Integration Lead' : 'Quality Lead'})`, id, 'gate', 'agent'); note(s, `${i === 5 ? 'Integration' : 'Validation'} waiting for your approval`, `${id} · ${r.t}`, `#v3-run-${id.toLowerCase()}`, [r.holder]); return s; }),
    approveStage: id => upd(s => { const r = s.runs[id]; const i = r.s.length - 1; if (i === 5) { advance(r, 'Validation running: acceptance and regression tests'); feed(s, s.me, `Integration approved · ${id}`); } else if (i === 6) { r.s = r.s.slice(0, -1) + 'dw'; r.state = 'wait'; r.holder = 'sam'; r.now = 'Release waiting for sign-off'; r.ask = `Release ${r.t.toLowerCase()}`; r.why = 'Validation and acceptance testing are approved.'; r.wait = 'just now'; r.decidedAt = 'just now'; feed(s, s.me, `Validation approved · ${id}`); note(s, 'Release waiting for your sign-off', `${id} · ${r.t}`, `#v3-run-${id.toLowerCase()}`, ['sam']); } else if (i === 7) { r.scheduled = 'Thu 13 Nov, 18:00'; r.state = 'work'; r.now = 'Release scheduled Thu 13 Nov, 18:00'; r.eta = 'Thu 13 Nov, 18:00'; r.decidedAt = 'just now'; feed(s, s.me, `Release scheduled · ${id}`); } return s; }),
    sendBackStage: (id, why) => upd(s => { const r = s.runs[id]; const i = r.s.length - 1; r.s = r.s.slice(0, -1) + 'a'; r.state = 'work'; r.holder = 'agent'; r.now = i === 5 ? 'Agent fixing the integration after feedback' : 'Agent reworking after validation feedback'; r.sentBack = why; r.decidedAt = 'just now'; log(s, `Sent back ${i === 5 ? 'integration' : 'validation'}`, id, 'gate', s.me, why); return s; }),
    approvePlan: id => upd(s => { const r = s.runs[id]; advance(r, 'Agent writing the specification'); feed(s, s.me, `Plan approved · ${id}`); return s; }),
    requestPlanChanges: id => upd(s => { const r = s.runs[id]; r.state = 'work'; r.now = 'Agent revising the plan'; r.holder = 'agent'; r.s = 'a'; r.decidedAt = 'just now'; feed(s, s.me, `Plan sent back · ${id}`); return s; }),
    setMe: p => upd(s => { log(s, `Signed in as ${NAME[p]}`, 'Demo role switch', 'access', p); s.me = p; return s; }),
    togglePerm: (role, perm) => upd(s => { const l = s.roles[role]; const on = l.includes(perm); s.roles[role] = on ? l.filter(x => x !== perm) : [...l, perm]; log(s, `${on ? 'Removed' : 'Granted'} permission “${perm}” ${on ? 'from' : 'to'} ${role}`, 'Roles and permissions', 'rbac'); return s; }),
    setDev: (id, phase) => upd(s => { const r = s.runs[id]; if (!r) return s; r.dev = phase; log(s, phase === 'copied' ? 'Copied the Developer prompt for VS Code' : 'Started work in VS Code (Developer Agent)', id, 'gate', phase === 'copied' ? s.me : 'agent'); return s; }),
    viewArtifact: (name, run) => upd(s => { log(s, 'Viewed document', `${name} · ${run}`, 'access'); return s; }),
    exportArtifacts: what => upd(s => { log(s, `Exported ${what}`, 'Artifact library', 'access'); return s; }),
    resolve: key => upd(s => { s.attention = s.attention.filter(a => a !== key); log(s, { leave: 'Reassigned WI-4807 to Lena Brooks', agent: 'Assigned an engineer to WI-4790', freeze: 'Approved freeze exception for WI-4830: release stays on Tue 2 Dec', squad: 'Completed squad for WI-4836' }[key], 'Governance', 'admin'); if (key === 'leave') { s.runs['WI-4807'].holder = 'lena'; } if (key === 'squad') s.runs['WI-4836'].squadGap = false; if (key === 'freeze') { s.runs['WI-4830'].freeze = false; s.runs['WI-4830'].exception = 'Freeze exception approved'; } return s; }),
    fixTeams: () => upd(s => { s.teamsOk = true; log(s, 'Signed in to Microsoft Teams again', 'Connections', 'admin'); s.notes = s.notes.map(n => n.id === 'n4' ? { ...n, unread: false } : n); return s; }),
    markRead: () => upd(s => { s.notes.forEach(n => { if (!n.to || n.to.includes(s.me)) n.unread = false; }); return s; }),
    togglePause: id => upd(s => { const r = s.runs[id]; r.paused = !r.paused; feed(s, s.me, `${r.paused ? 'Paused' : 'Resumed'} · ${id}`); return s; }),
    setTour: on => setSt(s => ({ ...s, tour: on })),
    setWelcomed: () => setSt(s => ({ ...s, welcomed: true })),
    undo: token => { const cur = stRef.current; if (!token || cur.v !== token.v) return false; const back = { ...token.before, tour: cur.tour, welcomed: cur.welcomed }; stRef.current = back; setSt(back); return true; },
    markOne: id => upd(s => { s.notes.forEach(n => { if (n.id === id) n.unread = false; }); return s; }),
    addComment: (id, text) => upd(s => { (s.comments[id] ||= []).push({ who: s.me, text, at: new Date().toISOString() }); log(s, 'Commented', id, 'gate'); const to = [...new Set([...text.matchAll(/@([A-Za-z]+)/g)].map(m => Object.keys(PEOPLE_FIRST).find(k => PEOPLE_FIRST[k] === m[1].toLowerCase())).filter(p => p && p !== s.me))]; if (to.length) note(s, `${NAME[s.me]} mentioned you · ${id}`, text.slice(0, 80), `#v3-run-${id.toLowerCase()}`, to); return s; }),
    setPolicy: (k, val) => upd(s => { s.policy[k] = val; log(s, `${val ? 'Turned on' : 'Turned off'} policy “${k === 'planSoD' ? 'Requester cannot approve their own plan' : k}”`, 'Policies', 'admin'); return s; }),
    retryRun: id => upd(s => { const r = s.runs[id]; r.s = r.s.replace('f', 'a'); r.state = 'work'; r.now = 'Agent re-running validation with the updated tests'; r.holder = 'agent'; r.retrying = true; r.eta = 'Fri 14 Nov'; feed(s, s.me, `Validation re-run · ${id}`); return s; }),
    finishRetry: id => upd(s => { const r = s.runs[id]; if (!r.retrying) return s; r.retrying = false; r.s = r.s.replace('a', 'w'); r.state = 'wait'; r.holder = 'mara'; r.now = 'Validation waiting for approval'; r.ask = 'Approve validation'; r.why = 'All 214 regression tests now pass.'; r.wait = 'just now'; log(s, 'Validation passed after retry', id, 'gate', 'agent'); return s; }),
    assignEngineer: id => upd(s => { const r = s.runs[id]; r.holder = 'lena'; r.state = 'wait'; r.s = r.s.replace('f', 'w'); r.now = 'Engineer investigating the failed tests'; s.attention = s.attention.filter(a => a !== 'agent'); log(s, `Assigned Lena Brooks to investigate failed tests`, id, 'admin'); return s; }),
    reset: () => setSt(s => ({ ...INITIAL, welcomed: true, tour: s.tour })),
  }), [upd]);

  actionsRef.current = actions;
  const derived = useMemo(() => {
    const view = r => ({ ...r, state: r.state === 'wait' && r.holder === st.me ? 'you' : r.state, now: r.state === 'wait' ? (r.holder === st.me ? r.now.replace('waiting for approval', 'waiting for your approval').replace('waiting for an answer', 'waiting for your answer') : r.now) : r.now });
    const runs = Object.fromEntries(Object.entries(st.runs).map(([k, r]) => [k, view(r)]));
    const list = st.order.map(id => runs[id]);
    const mins = w => { const m = /(\d+)\s*(min|h|d)/.exec(w || ''); return m ? +m[1] * ({ min: 1, h: 60, d: 1440 })[m[2]] : 0; };
    const mine = list.filter(r => r.state === 'you').sort((a, b) => mins(b.wait) - mins(a.wait));
    const myNotes = st.notes.filter(n => !n.to || n.to.includes(st.me));
    const myRole = ROLE_OF[st.me];
    const perms = st.roles[myRole] || [];
    const can = p => perms.includes(p);
    // One answer to "who approves stage i of this run", used by every screen.
    const approver = (r, i) => { if (r.s[i] === 'w' && r.holder !== 'agent') return r.holder; if (r.id === 'WI-4807' && i === 4) return st.attention.includes('leave') ? 'alex' : 'lena'; return STAGE_APPROVER[i]; };
    const kpi = { inProgress: list.filter(r => r.state !== 'done').length, waitingPeople: list.filter(r => r.state === 'you' || r.state === 'wait').length, released: list.filter(r => r.state === 'done').length };
    return { raw: st.runs, runs, list, mine, myRole, can, approver, kpi, notes: myNotes, unread: myNotes.filter(n => n.unread).length };
  }, [st]);

  return <Ctx.Provider value={{ ...st, ...derived, ...actions, STAGE, NAME }}>{children}</Ctx.Provider>;
}
export const useProto = () => useContext(Ctx);
export const runHref = id => `#v3-run-${id.toLowerCase()}`;
`````

## Check before the next step

- [ ] Exports: `PrototypeProvider`, `useProto`, `runHref`, `STAGE_APPROVER`, `ROLE_OF`, `PERMS`.
- [ ] The storage key is `delivery-prototype-v7`.
- [ ] There are 8 seed runs, WI-4836 to WI-4751.

## Specification

This explains what the code above does, in words. If you later change the screen, keep to these rules.

## 7. Workflow and state

### 7.1 Stage string

Each run stores its progress as a string `s`, one character per stage reached, index = stage number:

| Code | Meaning | Visual |
|---|---|---|
| `d` | Done (approved, or passed automatically) | green ✓ |
| `w` | Waiting on a person (gate open) | amber ring |
| `a` | Agent working on this stage | blue |
| `f` | Failed (agent stopped) | red ✗ |
| (absent) | Upcoming | grey |

Example `ddddw` = Plan, Specify, Impact, Design done; Build waiting on a person. Current stage index = `s.length − 1`.

### 7.2 Run state

| `state` | Meaning |
|---|---|
| `work` | The agent is working (last character `a`), or a release is scheduled |
| `wait` | A person holds it (last character `w`) |
| `bad` | Blocked: failed or on hold |
| `done` | Released |
| `you` | **Derived, never stored**: `wait` and `holder === me`. The `now` text is also personalised ("waiting for approval" → "waiting for your approval", "waiting for an answer" → "waiting for your answer"). |

### 7.3 State machine for one stage

```
            agent finishes                     approver approves
   ┌───┐  ───────────────▶  ┌───┐  ─────────────────────────────▶  ┌───┐ → next stage starts as `a`
   │ a │                    │ w │                                   │ d │
   └───┘  ◀───────────────  └───┘                                   └───┘
     │     sent back / request changes (note required where shown)
     │
     └── agent fails 3 times ──▶ ┌───┐ ── "Update the tests and re-run" ──▶ a ── 3.5 s ──▶ w (Quality Lead)
                                 │ f │ ── "Assign an engineer" ──▶ w (held by Lena Brooks)
                                 └───┘
Impact (2) has no human gate: a → d automatically when checks pass (policy "Move past Impact…").
Release (7): w → scheduled (state work, `scheduled` set) → done at the window; or w → done ("Now");
             or w → bad (held, reason required); scheduled → w ("Cancel schedule").
```

### 7.4 Actions (store API)

Every action: clones state, bumps version `v`, persists, and returns an **undo token**. "Audit" = entry added at the top of the audit log; "Notify" = notification added for the named people.

| Action | Who / where | Effect on the run | Audit | Notify | Toast (Undo?) |
|---|---|---|---|---|---|
| `createRequest(id, text, app)` | New request | New run: `s='a'`, state work, now "Agent drafting the plan", holder agent, eta "About 3 days", `fresh`; put first in order; `nextId+1` | "Request started" | — | "WI-4841 started. The agent is drafting the plan." (no) |
| `finishPlan(id)` (auto after 4 s) | system | `s='w'`, wait, now "Plan waiting for approval", ask "Approve the delivery plan"; holder Priya, **or Dana if the requester is Priya and plan SoD is on** (why: "Priya Nair requested this, so separation of duties sends the plan to Dana Whitfield as second approver." else "The agent turned the request into 1 objective and 2 stories.") | "Opened approval gate (Product Owner)" or "(second approver, separation of duties)" by agent | holder: "Plan waiting for your approval"; requester (if different): "Plan drafted for <id>" | — |
| `approvePlan(id)` | Run page | stage → d, next `a`, now "Agent writing the specification" | "Plan approved" | — | "Plan approved. The agent is writing the specification." (yes) |
| `requestPlanChanges(id)` | Run page | `s='a'`, now "Agent revising the plan" | "Plan sent back" | — | "Plan sent back to the agent." (yes) |
| `answerQuestions(answers)` | Clarify | WI-4799: store answers, advance, now "Agent writing the specification" | "Questions answered" | — | "Answers sent. The agent is writing the specification." (yes) |
| `approveDesign()` | Approve | WI-4821: advance, now "Agent building the change" | "Design approved" | me: "Build started for WI-4821" | "Design approved. The agent has started building." (yes) |
| `requestDesignChanges()` | Approve | WI-4821: `s='ddda'`, now "Agent revising the design" | "Changes requested" | — | "Sent back to the agent with your note." (yes) |
| `setDev(id, 'copied'→'working')` | Dev agent card | `dev` phase; working 2.5 s after copied | "Copied the Developer prompt for VS Code" (me) / "Started work in VS Code (Developer Agent)" (agent) | — | "Developer prompt copied…" (no) |
| `approveBuild()` | Review | WI-4807: advance, now "Integration running on the merge commit", clears reassigned | "Build approved" | me: "Integration started for WI-4807" | "Build approved. Integration has started." (yes) |
| `requestBuildChanges()` | Review | WI-4807: `s='dddda'`, now "Agent revising the code" | — | — | "Sent back to the agent with your comment." (yes) |
| `finishAuto(id)` (auto after 5 s) | system | For a run working at Integrate (5) or Validate (6): last `a` → `w`, holder Tom / Mara, now "Integration waiting for approval" / "Validation waiting for approval", ask "Approve the integration" / "Approve validation", why "3 pipelines passed on the merge commit and staging is deployed." / "Every acceptance criterion is met and 214 of 214 regression tests pass." (+ " Resubmitted after your feedback.") | "Opened approval gate (Integration Lead / Quality Lead)" by agent | holder | — |
| `approveStage(id)` | Run page | stage 5 → advance, now "Validation running: acceptance and regression tests"; stage 6 → `…dw`, holder Sam, now "Release waiting for sign-off"; stage 7 → scheduled "Thu 13 Nov, 18:00" | "Integration approved" / "Validation approved" / "Release scheduled" | stage 6: Sam "Release waiting for your sign-off" | "Integration approved. Validation is running." / "Validation approved. The release is with Sam Okafor." / "Release scheduled for Thu 13 Nov, 18:00." (yes) |
| `sendBackStage(id, why)` | Run page dialog | last → `a`, holder agent, now "Agent fixing the integration after feedback" / "Agent reworking after validation feedback", `sentBack = why` | "Sent back integration/validation" (detail = note) | — | "Sent back to the agent with your note." (yes) |
| `scheduleRelease(when)` | Release | WI-4772: "Now" → `dddddddd` done "Released", eta "Released today"; else `dddddddw`, state work, `scheduled = when`, now "Release scheduled <when>" | "Released" / "Release scheduled" | — | see §6.9 (Undo only when scheduled) |
| `holdRelease(reason)` | Release dialog | now "Release on hold", state bad, `hold = reason` | "Held release" (detail) | Priya, Mara: "Release held · WI-4772" | "Release held. Priya and Mara have been told why." (yes) |
| `cancelSchedule(id)` | Run page | back to `dddddddw`, wait, holder Sam, eta "Not scheduled" | "Cancelled scheduled release" | — | "Scheduled release cancelled. It is back with the Release Manager." (yes) |
| `retryRun(id)` | Run (failed) | `f`→`a`, `retrying`, now "Agent re-running validation with the updated tests", eta "Fri 14 Nov" | "Validation re-run" | — | "Re-running validation with updated tests." (no) |
| `finishRetry(id)` (auto after 3.5 s) | system | `a`→`w`, holder Mara, now "Validation waiting for approval", why "All 214 regression tests now pass." | "Validation passed after retry" (agent) | — | — |
| `assignEngineer(id)` | Run (failed) | holder Lena, `f`→`w`, now "Engineer investigating the failed tests"; clears the "agent" problem | "Assigned Lena Brooks to investigate failed tests" | — | "Lena Brooks is now investigating." (yes) |
| `togglePause(id)` | Run top bar | `paused` toggles; paused runs are skipped by auto-advance | "Paused"/"Resumed" | — | "<id> paused. Nothing will move until you resume it." / "<id> resumed." (no) |
| `addComment(id, text)` | Comments, Approve note | append comment | "Commented" | each @mentioned person (not me): "<Name> mentioned you · <id>" | see §4.21 |
| `resolve(key)` | Governance, Squad | removes the problem; leave → WI-4807 holder Lena; squad → clears gap; freeze → clears freeze, sets `exception` | see §6.12 | — | see §6.12 (yes) |
| `invite(p)`, `setCover(c)` | People dialogs | adds to `invites` / `covers` | yes (category admin) | cover person | yes |
| `togglePerm(role, perm)` | Roles | add/remove permission | "Granted/Removed permission “perm” to/from Role" (rbac) | — | yes |
| `setPolicy('planSoD', v)` | Policies | policy flag | "Turned on/off policy “Requester cannot approve their own plan”" | — | (no) |
| `fixTeams()` | Connections | `teamsOk = true`, marks Teams note read | "Signed in to Microsoft Teams again" | — | yes |
| `viewArtifact(name, run)`, `exportArtifacts(what)` | Docs, Artifacts, Audit | — | "Viewed document" / "Exported …" (access) | — | — |
| `setMe(person)` | View as | `me` changes, go Home | "Signed in as <Name>" (access) | — | — |
| `markRead()`, `markOne(id)` | Notifications | unread → false | — | — | — |
| `reset()` | Prototype controls | seed data, keeps tour flag, `welcomed=true` | — | — | — |

### 7.5 Undo rule

Each action returns `{ before, v }`. `undo(token)` restores `before` **only if the current version still equals `token.v`** (nothing else changed since); it keeps the current `tour` and `welcomed` flags. Otherwise it returns false and the toast says "Cannot undo: something else has changed since."

### 7.6 Who approves a stage (`approver(run, i)`)

1. If stage `i` is waiting and held by a person → that person.
2. WI-4807 Build: Alex (named backup) while Jon is on leave, otherwise Lena.
3. Otherwise the default per stage: Priya, Priya, — (automatic), Alex, Jon, Tom, Mara, Sam.

### 7.7 Who may decide a gate (`useGate(id, perm)`)

- `decided` = run state is not `wait`.
- `blocked` = not decided and (I am not the holder **or** I lack the permission).
- **Named backup exception:** if I am the holder and the run is marked `backupFor`, I may decide without the role permission (Alex approving the Build for WI-4807).
- When blocked, the decision panel is replaced by NotYours (§4.22). The page itself stays readable.

### 7.8 Separation of duties

- Plan: when `policy.planSoD` is on and the requester is the person who would approve (Priya), the plan goes to Dana as second approver; the requester sees "You requested this, so another Product Owner must approve the plan."
- Squad editor blocks Priya (the requester) as Design or Release approver.
- People page warns on blocked role pairs.
- Policies page shows four SoD switches (one live in the prototype).

### 7.9 End-to-end journey (the video tour)

| Step | Person | Screen | Action | Result |
|---|---|---|---|---|
| 1 | Alex (Solution Architect) | Home → Approve | Read summary, tick risk, Approve design | WI-4821 → Build; toast with Undo |
| 2 | Priya (Product Owner) | Clarify | Pick answers, Send answers | WI-4799 → specification |
| 3 | Alex as backup for Jon | Review | Open a file, Approve build | WI-4807 → Integrate (agent runs 5 s) |
| 4 | Tom (Integration Lead) | Run WI-4807 | Approve integration | → Validate (agent runs 5 s) |
| 5 | Mara (Quality Lead) | Run WI-4807 | Approve validation | → Release, with Sam |
| 6 | Alex | New request | Draft the plan | WI-4841 created; plan ready in 4 s |
| 7 | Priya | Run WI-4841 | Approve plan | → Specify |
| 8 | Sam (Release Manager) | Release | Choose window, Schedule release | WI-4772 scheduled; can cancel; rollback after release |
| 9 | Dana (Platform Admin) | Governance, Squads, People, Roles, Audit | Reassign, complete squad, invite, change a permission, read the log | Problems clear; audit shows every step |

## 8. Roles and permissions

### 8.1 People and roles

| Key | Name | Role | Initials | Hue |
|---|---|---|---|---|
| alex | Alex Kim | Solution Architect | AK | #2469bc |
| priya | Priya Nair | Product Owner | PN | #7c5cc4 |
| sam | Sam Okafor | Release Manager | SO | #5a6b2b |
| dana | Dana Whitfield | Platform Admin | DW | #a0306a |
| jon | Jon Reyes | Engineering Lead (on leave until Fri 14 Nov) | JR | #0f7b6c |
| lena | Lena Brooks | Engineering Lead | LB | #12806f |
| tom | Tom Iverson | Integration Lead | TI | #6d5a2b |
| mara | Mara Lopez | Quality Lead | ML | #b4541f |
| ana | Ana Costa | Quality Lead | AC | #a84a1f |
| ravi | Ravi Shah | Solution Architect | RS | #3b6fb6 |
| ines | Ines Duarte | Auditor | ID | #55607a |
| agent | Delivery agent / "The agent" | AI | AI | #101429 |

"View as" offers: Alex, Priya, Sam, Jon, Tom, Mara, Ines, Dana. Default signed-in person: Alex.

### 8.2 Permissions (17, in four groups)

| Group | Key | Label |
|---|---|---|
| Delivery | `request.create` | Start requests |
| | `runs.pause` | Pause and resume runs |
| Approval gates | `gate.plan` | Approve plans and specifications |
| | `gate.design` | Approve designs |
| | `gate.build` | Approve builds |
| | `gate.integrate` | Approve integration |
| | `gate.validate` | Approve validation |
| | `gate.release` | Release to production |
| Artifacts and evidence | `artifacts.own` | See artifacts for their own work |
| | `artifacts.all` | See every artifact |
| | `artifacts.export` | Download and export artifacts |
| | `audit.view` | See the audit log |
| Administration | `squads.manage` | Manage squads |
| | `people.manage` | Manage people and access |
| | `roles.manage` | Edit roles and permissions |
| | `policies.manage` | Edit policies |
| | `connections.manage` | Manage connections |

Sensitive (need confirmation to grant): `gate.release`, `artifacts.all`, `artifacts.export`, `audit.view`, `people.manage`, `roles.manage`, `connections.manage`, `policies.manage`.

### 8.3 Default role matrix (● = granted)

| Permission | Platform Admin | Product Owner | Solution Architect | Engineering Lead | Integration Lead | Quality Lead | Release Manager | Auditor | Requester |
|---|---|---|---|---|---|---|---|---|---|
| request.create | ● | ● | ● | ● | | | | | ● |
| runs.pause | ● | ● | | ● | | | ● | | |
| gate.plan | ● | ● | | | | | | | |
| gate.design | ● | | ● | | | | | | |
| gate.build | ● | | | ● | | | | | |
| gate.integrate | ● | | | | ● | | | | |
| gate.validate | ● | | | | | ● | | | |
| gate.release | ● | | | | | | ● | | |
| artifacts.own | ● | ● | ● | ● | ● | ● | ● | | ● |
| artifacts.all | ● | | | | | | | ● | |
| artifacts.export | ● | | | | | | ● | ● | |
| audit.view | ● | | | | | | | ● | |
| squads.manage | ● | | | | | | | | |
| people.manage | ● | | | | | | | | |
| roles.manage | ● | | | | | | | | |
| policies.manage | ● | | | | | | | | |
| connections.manage | ● | | | | | | | | |

Platform Admin is locked (always all permissions).

### 8.4 Where permissions take effect

| Place | Rule |
|---|---|
| Admin routes | Guarded by the table in §5; without the permission → RequirePerm page |
| Sidebar Admin group | Each item only with its permission; group hidden if none |
| Command palette | Admin destinations only with permission |
| Gate decision panels | `useGate` (§7.7) |
| Run page late gates | `gate.integrate` / `gate.validate` / `gate.release` |
| Plan approval on run page | `gate.plan` + SoD |
| Pause / Resume | `runs.pause` |
| Retry failed run | `runs.pause` or requester |
| Assign engineer, Manage squad links, admin card on Home | `squads.manage` |
| Roll back, Cancel schedule | `gate.release` |
| Artifacts scope | `artifacts.all` → everything, else own work |
| Export / download | `artifacts.export` (document .md download also allowed with `artifacts.own`) |
| Audit links | `audit.view` |

### 9.1 Run

```js
{
  id: 'WI-4821', t: 'Registered Amortization limit', app: 'Full Application',
  by: 'priya',                 // requester
  s: 'dddw',                   // stage string (§7.1)
  state: 'wait',               // work | wait | bad | done   ('you' is derived)
  now: 'Design waiting for approval',
  holder: 'alex',              // person key or 'agent'
  age: '1 d', eta: 'Thu 13 Nov', wait: '12 min',
  screen: '#v3-approve',       // gate screen, if any
  ask: 'Approve the solution design',
  why: 'Blocks values above 310 on Product Selection. The Pricing API is not covered.',
  // optional: reassigned, backupFor, squadGap, freeze, exception, paused, retrying, fresh, dev ('copied'|'working'),
  //           answers [[q,a]], sentBack, hold, scheduled, decidedAt
}
```

### 9.2 Seed runs (in list order)

| ID | Title | App | By | s | state | Now | Holder | Age | ETA | Special |
|---|---|---|---|---|---|---|---|---|---|---|
| WI-4836 | Rate hold expiry notice | Full Application | alex | dda | work | Agent writing the impact assessment | agent | 2 h | Mon 17 Nov | squadGap |
| WI-4830 | Advisor licence check | Advisor Portal | priya | ddd | work | Agent preparing the design | agent | 6 h | Tue 2 Dec | freeze |
| WI-4821 | Registered Amortization limit | Full Application | priya | dddw | wait | Design waiting for approval | alex | 1 d | Thu 13 Nov | screen approve, wait 12 min |
| WI-4807 | Advisor eligibility banner | Advisor Portal | jon | ddddw | wait | Build waiting for code review | alex | 2 d | Fri 14 Nov | screen review, reassigned, backupFor Engineering Lead, wait 3 h |
| WI-4799 | Statement export format | Client Services | priya | dw | wait | Questions waiting for an answer | priya | 3 d | Wed 19 Nov | screen clarify, ask "Answer 2 questions", wait 1 h |
| WI-4790 | Session timeout copy | Advisor Portal | jon | ddddddf | bad | Validation failed: 2 tests | jon | 4 d | At risk | |
| WI-4772 | Fee schedule update | Full Application | priya | dddddddw | wait | Release waiting for sign-off | sam | 5 d | Thu 13 Nov | screen release, wait 5 h |
| WI-4751 | Mortgage term picker labels | Full Application | priya | dddddddd | done | Released | sam | 9 d | Released 9 Nov | |

`nextId` starts at 4841. Asks and whys for the waiting runs: WI-4807 "Review the completion report" / "Code and 6 unit tests are ready. Jon is on leave, so this came to you."; WI-4799 "Answer 2 questions" / "The agent needs to know the column order before writing the specification."; WI-4772 "Release the fee schedule update" / "Validation and business sign-off are done. Choose a release window."

### 9.3 Seed notifications, feed, comments, problems, audit

- Notifications (to, title, sub, age, link, unread): sam "Release waiting for your sign-off" "WI-4772 · validation and UAT are done" 5 h → release ●; dana "Approver on leave is holding a review" "WI-4807 · Jon Reyes is away until Friday" 3 h → admin ●; alex "Design waiting for your approval" "WI-4821 · from the delivery agent" 12 min → approve ●; alex "Completion report reassigned to you" "WI-4807 · Jon Reyes is on leave" 3 h → review ●; alex "Priya replied to your question" "WI-4821 · “Can we add the server check…”" 10 min → approve ●; dana "Teams notifications are failing" "Connections · sign-in expired at 08:12" 2 h → connections (read); everyone "Term picker labels released" "WI-4751 · Sam Okafor" Mon → runs (read).
- Feed: agent "Design finished · WI-4821" 12 min ago; Priya "Plan approved · WI-4830" 40 min ago; agent "Fixed its own mistake · WI-4821" 45 min ago; Sam "Released · WI-4751" Mon 16:05.
- Comments: WI-4821 — Priya, 2026-11-11 09:32 UTC: "Can we add the server check as a follow-up request?"
- Open admin problems: leave, agent, freeze, squad. `teamsOk: false`. `policy.planSoD: true`.
- Audit seed (time, who, action, target, category, IP): 08:40 agent Validation failed after 3 attempts: 2 tests · WI-4790 · gate · 10.20.4.2; 08:05 agent Retried validation (attempt 2 of 3) · WI-4790 · gate; 09:42 agent Saved document · ADR-0173 · WI-4821 · artifact; 09:40 agent Opened approval gate (Solution Architect) · WI-4821 · gate; 09:31 dana Viewed document · Impact assessment · WI-4821 · access; 09:12 priya Approved plan · WI-4830 · gate; 08:12 system Connection failed: Microsoft Teams sign-in expired · Connections · system; Mon 17:20 dana Changed role: Lena Brooks can approve as Integration Lead · People and access · rbac; Mon 16:05 sam Released · WI-4751 · gate; Mon 11:02 dana Exported audit pack (week 45) · Governance · access. All dated 9–11 Nov 2026 UTC.
- Audit entry shape: `{ t, at (ISO), ip, who, action, target, cat (gate|access|rbac|admin|artifact|system), detail?, live? }`. New entries: IP `10.20.4.37` for people, `10.20.4.2` for the agent.

### 9.4 Persistence

- All prototype state in `sessionStorage['delivery-prototype-v7']` (JSON, saved on every change; failures ignored). Each viewer gets their own copy. Theme in `localStorage['delivery-theme']`.
- Production replaces this with the API (§11 Phase 9).
