// v3 shared UI: one coherent product built on the client's existing console tokens.
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CommandPalette, Notifications } from './overlays';
import { useProto } from './store';
import { TourBar, Welcome } from './tour';
import { PrototypeMenu } from './protomenu';
import { useTheme, ThemeToggle } from './theme';
import { Home, FilePlus2, Inbox, Rocket, BookCheck, ShieldCheck, Search, Settings, Check, X, LayoutDashboard, UsersRound, Scale, Contact, Plug, KeyRound, History } from 'lucide-react';

export const PEOPLE = {
  priya: { name: 'Priya Nair', role: 'Product Owner', init: 'PN', hue: '#7c5cc4' },
  alex:  { name: 'Alex Kim', role: 'Solution Architect', init: 'AK', hue: '#2469bc' },
  jon:   { name: 'Jon Reyes', role: 'Engineering Lead', init: 'JR', hue: '#0f7b6c' },
  mara:  { name: 'Mara Lopez', role: 'Quality Lead', init: 'ML', hue: '#b4541f' },
  sam:   { name: 'Sam Okafor', role: 'Release Manager', init: 'SO', hue: '#5a6b2b' },
  agent: { name: 'Delivery agent', role: 'AI', init: 'AI', hue: '#101429' },
  dana:  { name: 'Dana Whitfield', role: 'Platform Admin', init: 'DW', hue: '#a0306a' },
  ravi:  { name: 'Ravi Shah', role: 'Solution Architect', init: 'RS', hue: '#3b6fb6' },
  lena:  { name: 'Lena Brooks', role: 'Engineering Lead', init: 'LB', hue: '#12806f' },
  tom:   { name: 'Tom Iverson', role: 'Integration Lead', init: 'TI', hue: '#6d5a2b' },
  ana:   { name: 'Ana Costa', role: 'Quality Lead', init: 'AC', hue: '#a84a1f' },
  ines:  { name: 'Ines Duarte', role: 'Auditor', init: 'ID', hue: '#55607a' },
};
export const STAGES = [
  ['Plan','priya'],['Specify','priya'],['Impact',null],['Design','alex'],['Build','jon'],['Integrate','tom'],['Validate','mara'],['Release','sam'],
];

export const Avatar = ({ p, size = 28, ring }) => {
  const x = PEOPLE[p];
  return <span title={`${x.name}, ${x.role}`} className={cn('inline-grid shrink-0 place-items-center rounded-full font-semibold text-white', ring && 'ring-2 ring-white')} style={{ width: size, height: size, background: x.hue, fontSize: size * 0.38 }}>{x.init}</span>;
};

const TONE = {
  you:  'bg-[var(--v-amber-soft)] text-[var(--v-amber)]',
  wait: 'bg-[var(--v-amber-soft)] text-[var(--v-amber)]',
  work: 'bg-[var(--v-blue-soft)] text-[var(--v-blue)]',
  done: 'bg-[var(--v-green-soft)] text-[var(--v-green)]',
  bad:  'bg-[var(--v-red-soft)] text-[var(--v-red)]',
  mute: 'bg-[var(--v-sunken)] text-[var(--v-ink-2)]',
};
export const Pill = ({ tone = 'mute', dot = true, children, className }) => (
  <span className={cn('inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12.5px] font-medium', TONE[tone], className)}>
    {dot && <span className={cn('size-1.5 rounded-full bg-current', tone === 'work' && 'animate-pulse')} />}{children}
  </span>
);

/* Stage stepper. states: d done, w waiting on a person, a agent working, '' upcoming. */
export function Stepper({ s, compact, label }) {
  const cur = Math.max(s.length, 1);
  if (compact && label) return (
    <div className="flex flex-col gap-1"><Stepper s={s} compact /><span className="text-[12px] text-[var(--v-ink-3)]">Stage {cur} of 8 · {STAGES[cur - 1][0]}</span></div>
  );
  if (compact) return (
    <div className="flex items-center gap-1" role="img" aria-label={`Stage ${cur} of 8, ${STAGES[cur - 1][0]}`}>
      {STAGES.map(([n], i) => <span key={n} title={n} className={cn('h-1.5 flex-1 rounded-full', s[i] === 'd' ? 'bg-[var(--v-green)]' : s[i] === 'w' ? 'bg-[#e0a000]' : s[i] === 'a' ? 'bg-[var(--v-blue)]' : s[i] === 'f' ? 'bg-[var(--v-red)]' : 'bg-[var(--v-line)]')} />)}
    </div>
  );
  return (
    <ol className="grid grid-cols-8" aria-label="Delivery stages">
      {STAGES.map(([n, who], i) => {
        const k = s[i];
        return (
          <li key={n} className="relative flex flex-col items-center gap-2 text-center">
            {i > 0 && <span aria-hidden="true" className={cn('absolute top-[13px] right-1/2 h-0.5 w-full', k ? 'bg-[var(--v-green)]' : 'bg-[var(--v-line)]')} />}
            <span className={cn('relative z-10 grid size-7 place-items-center rounded-full border-2 text-[12px] font-semibold',
              k === 'd' && 'border-[var(--v-green)] bg-[var(--v-green)] text-white',
              k === 'w' && 'border-[#e0a000] bg-[var(--v-amber-soft)] text-[var(--v-amber)] ring-4 ring-[#e0a000]/20',
              k === 'a' && 'border-[var(--v-blue)] bg-[var(--v-surface)] text-[var(--v-blue)]',
              k === 'f' && 'border-[var(--v-red)] bg-[var(--v-red)] text-white ring-4 ring-[var(--v-red)]/20',
              !k && 'border-[var(--v-line)] bg-[var(--v-surface)] text-[var(--v-ink-3)]')}>
              {k === 'd' ? <Check className="size-4" strokeWidth={3} /> : k === 'f' ? <X className="size-4" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn('text-[13px]', k === 'w' ? 'font-semibold' : k === 'f' ? 'font-semibold text-[var(--v-red)]' : 'text-[var(--v-ink-2)]')}>{n}{k === 'f' && <span className="sr-only"> (failed)</span>}</span>
            {who ? <span className="flex items-center gap-1 text-[11.5px] text-[var(--v-ink-3)]"><Avatar p={who} size={16} />{PEOPLE[who].name.split(' ')[0]}</span> : <span className="text-[11.5px] text-[var(--v-ink-3)]">Automatic</span>}
          </li>
        );
      })}
    </ol>
  );
}

export const Card = ({ className, children, ...r }) => <section className={cn('rounded-2xl border border-[var(--v-line)] bg-[var(--v-surface)] shadow-[0_1px_2px_rgba(16,20,41,.04),0_8px_24px_-12px_rgba(16,20,41,.10)]', className)} {...r}>{children}</section>;
export const CardHead = ({ title, sub, right }) => <header className="flex items-start gap-3 px-5 pt-4 pb-3"><div className="min-w-0 flex-1"><h2 className="text-[15px] font-semibold">{title}</h2>{sub && <p className="text-[13px] text-[var(--v-ink-3)]">{sub}</p>}</div>{right}</header>;

const CRUMB = { Home: '#v3-home', Requests: '#v3-runs', Runs: '#v3-runs', Approvals: '#v3-approvals', Admin: '#v3-admin', Squads: '#v3-squads', 'Business rules': '#v3-rules', 'WI-4821': '#v3-run-wi-4821', 'WI-4807': '#v3-run-wi-4807', 'WI-4772': '#v3-run-wi-4772', 'WI-4799': '#v3-run-wi-4799' };
const NAV = [['home','Home',Home],['new','New request',FilePlus2],['approvals','Approvals',Inbox,3],['run','Runs',Rocket],['rules','Business rules',BookCheck],['artifacts','Artifacts',ShieldCheck]];
const ADMIN_NAV = [['admin','Governance',LayoutDashboard,'squads.manage'],['squads','Squads',UsersRound,'squads.manage'],['people','People and access',Contact,'people.manage'],['roles','Roles and permissions',KeyRound,'roles.manage'],['policies','Policies',Scale,'policies.manage'],['connections','Connections',Plug,'connections.manage'],['audit','Audit log',History,'audit.view']];
export function Shell({ active, crumbs = [], actions, children, admin, user }) {
  const me = useProto().me;
  const [cp, setCp] = useState(false);
  const proto = useProto();
  const { resolved } = useTheme();
  useEffect(() => {
    const k = e => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '');
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setCp(true); }
      else if (e.key === '/' && !typing) { e.preventDefault(); setCp(true); }
    };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, []);
  return (
    <div className="v3 grid min-h-screen grid-cols-[248px_1fr]" data-mode={resolved}>
      <a href="#v3main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[var(--v-surface)] focus:px-3 focus:py-2">Skip to content</a>
      <aside aria-label="Sidebar" className="sticky top-0 flex h-screen flex-col gap-1 bg-[var(--v-side)] px-3 py-4 text-[#c8cde0]">
        <div className="mb-5 flex items-center gap-2.5 px-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-[var(--v-blue)]"><svg viewBox="0 0 20 20" className="size-5" aria-hidden="true"><path d="M4 15V5l6 5 6-5v10" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/></svg></span>
          <div className="leading-tight"><div className="font-display text-[15px] font-semibold text-white">Delivery Platform</div><div className="text-[12px] text-[#8f97b3]">Full Application team</div></div>
        </div>
        <nav aria-label="Primary" className="-mx-1 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-1 pb-3">
        {NAV.map(([k, l, I, n0]) => { const n = k === 'approvals' ? proto.mine.length : n0; return (
          <a key={k} href={{run:'#v3-runs'}[k] || `#v3-${k}`} aria-current={active === k ? 'page' : undefined} className={cn('flex h-9 items-center gap-3 rounded-lg px-2.5 text-[14px] transition-colors hover:bg-white/5 hover:text-white', active === k && 'bg-white/10 font-medium text-white')}>
            <I className="size-[18px]" strokeWidth={1.8} />{l}{n > 0 && <span className="ml-auto rounded-full bg-[#e0a000] px-1.5 text-[11.5px] font-semibold text-[var(--v-ink)]">{n}</span>}
          </a>); })}
        {ADMIN_NAV.some(x => proto.can(x[3])) && <>
          <div className="mt-5 mb-1 px-2.5 text-[12px] font-medium text-[#8f97b3]">Admin</div>
          {ADMIN_NAV.filter(x => proto.can(x[3])).map(([k, l, I]) => (
            <a key={k} href={`#v3-${k}`} aria-current={active === k ? 'page' : undefined} className={cn('flex h-9 items-center gap-3 rounded-lg px-2.5 text-[14px] transition-colors hover:bg-white/5 hover:text-white', active === k && 'bg-white/10 font-medium text-white')}><I className="size-[18px]" strokeWidth={1.8} />{l}</a>))}
        </>}
        </nav>
        <PrototypeMenu />
        <div className="flex shrink-0 flex-col gap-1.5 rounded-xl bg-white/5 px-2.5 py-2">
          <div className="flex items-center gap-2.5"><Avatar p={me} size={32} /><div className="min-w-0 leading-tight"><div className="truncate text-[14px] font-medium text-white">{PEOPLE[me].name}</div><div className="truncate text-[12px] text-[#8f97b3]">{proto.myRole}</div></div></div>
          <label htmlFor="viewas" className="text-[11.5px] text-[#8f97b3]">View as</label>
          <select id="viewas" value={me} onChange={e => { proto.setMe(e.target.value); location.hash = 'v3-home'; }} className="h-8 rounded-md border border-white/15 bg-[#1c2140] px-2 text-[13px] text-white">
            <option value="alex">Alex Kim · Solution Architect</option><option value="priya">Priya Nair · Product Owner</option><option value="sam">Sam Okafor · Release Manager</option><option value="jon">Jon Reyes · Engineering Lead</option><option value="ines">Ines Duarte · Auditor</option><option value="dana">Dana Whitfield · Platform Admin</option>
          </select>
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[var(--v-line)] bg-[var(--v-bg)]/90 px-8 backdrop-blur">
          <nav aria-label="Breadcrumb"><ol className="flex min-w-0 items-center gap-2 text-[14px] text-[var(--v-ink-3)]">{crumbs.map((c, i) => { const last = i === crumbs.length - 1; const href = CRUMB[c]; return <li key={c} className="flex items-center gap-2">{i > 0 && <span aria-hidden="true">/</span>}{last ? <span aria-current="page" className="font-medium text-[var(--v-ink)]">{c}</span> : href ? <a href={href} className="rounded hover:text-[var(--v-ink)] hover:underline">{c}</a> : <span>{c}</span>}</li>; })}</ol></nav>
          <div className="flex-1" />
          <button onClick={() => setCp(true)} aria-keyshortcuts="Control+K Meta+K /" className="flex h-9 w-72 items-center gap-2 rounded-lg border border-[var(--v-line)] bg-[var(--v-surface)] px-3 text-[13.5px] text-[var(--v-ink-3)] hover:border-[var(--v-line-strong)]"><Search className="size-4" />Search requests, rules, people<kbd className="ml-auto rounded border border-[var(--v-line)] px-1.5 font-mono text-[11px]">⌘K</kbd></button>
          <ThemeToggle />
          <Notifications />
          {actions}
        </header>
        <TourBar />
        <main id="v3main" className="flex-1 px-8 py-7">{children}</main>
        <Welcome />
        <CommandPalette open={cp} onClose={() => setCp(false)} />
      </div>
    </div>
  );
}
