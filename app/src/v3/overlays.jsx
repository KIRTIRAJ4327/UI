// Command palette (⌘K / Ctrl+K / "/") and notifications panel for the v3 shell.
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useProto } from './store';
import { Search, Bell, CornerDownLeft, FileText, Rocket, BookCheck, User, LayoutGrid, X } from 'lucide-react';

const ITEMS = [
  ['Go to', 'Home', '#v3-home', LayoutGrid], ['Go to', 'New request', '#v3-new', LayoutGrid], ['Go to', 'Approvals', '#v3-approvals', LayoutGrid], ['Go to', 'All runs', '#v3-runs', LayoutGrid],
  ['Go to', 'Business rules', '#v3-rules', LayoutGrid], ['Go to', 'Governance (admin)', '#v3-admin', LayoutGrid], ['Go to', 'Policies (admin)', '#v3-policies', LayoutGrid], ['Go to', 'Connections (admin)', '#v3-connections', LayoutGrid], ['Go to', 'Artifacts', '#v3-artifacts', LayoutGrid], ['Go to', 'Squads (admin)', '#v3-squads', LayoutGrid], ['Go to', 'Roles and permissions (admin)', '#v3-roles', LayoutGrid], ['Go to', 'Audit log (admin)', '#v3-audit', LayoutGrid],
  ['Runs', 'WI-4821 Registered Amortization limit', '#v3-run-wi-4821', Rocket], ['Runs', 'WI-4807 Advisor eligibility banner', '#v3-run-wi-4807', Rocket], ['Runs', 'WI-4772 Fee schedule update', '#v3-run-wi-4772', Rocket], ['Runs', 'WI-4799 Statement export format', '#v3-run-wi-4799', Rocket],
  ['Documents', 'ADR-0173 Enforce the Registered Amortization maximum', '#v3-approve', FileText], ['Documents', 'How the WI-4821 design was made', '#v3-evidence', FileText],
  ['Business rules', 'RA-MAX Registered Amortization must be 310 or less', '#v3-rules', BookCheck], ['Business rules', 'RATE-H Rate holds last at most 120 days', '#v3-rules', BookCheck],
  ['People', 'Priya Nair · Product Owner', '#v3-people', User], ['People', 'Jon Reyes · Engineering Lead (on leave)', '#v3-people', User], ['People', 'Lena Brooks · Engineering Lead', '#v3-people', User],
];

export function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const input = useRef(null);
  const res = useMemo(() => { const t = q.trim().toLowerCase(); return t ? ITEMS.filter(x => `${x[0]} ${x[1]}`.toLowerCase().includes(t)) : ITEMS.filter(x => x[0] === 'Go to' || x[0] === 'Runs'); }, [q]);
  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => input.current?.focus(), 0); } }, [open]);
  useEffect(() => setI(0), [q]);
  if (!open) return null;
  const go = x => { onClose(); location.hash = x[2].slice(1); };
  const key = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI(v => Math.min(v + 1, res.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI(v => Math.max(v - 1, 0)); }
    else if (e.key === 'Enter' && res[i]) { e.preventDefault(); go(res[i]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'Tab') e.preventDefault();
  };
  let last = '';
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#101429]/30 px-4 pt-[12vh] backdrop-blur-[2px]" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Search and go to" className="w-full max-w-[620px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10" onKeyDown={key}>
        <div className="flex items-center gap-3 border-b border-[var(--v-line)] px-4">
          <Search className="size-5 text-[var(--v-ink-3)]" />
          <input ref={input} value={q} onChange={e => setQ(e.target.value)} role="combobox" aria-expanded="true" aria-controls="cp-list" aria-activedescendant={res[i] ? `cp-${i}` : undefined} aria-label="Search runs, documents, rules and people" placeholder="Search runs, documents, rules and people…" className="h-14 flex-1 bg-transparent text-[15px] outline-none" />
          <kbd className="rounded border border-[var(--v-line)] px-1.5 font-mono text-[11px] text-[var(--v-ink-3)]">Esc</kbd>
        </div>
        <ul id="cp-list" role="listbox" aria-label="Results" className="max-h-[380px] overflow-y-auto p-2">
          {res.map((x, j) => {
            const head = x[0] !== last; last = x[0]; const I = x[3];
            return (
              <li key={x[1]} role="presentation">
                {head && <div className="px-3 pt-2 pb-1 text-[12px] font-medium text-[var(--v-ink-3)]">{x[0]}</div>}
                <div id={`cp-${j}`} role="option" aria-selected={j === i} onMouseMove={() => setI(j)} onClick={() => go(x)} className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[14px]', j === i && 'bg-[var(--v-blue-soft)]')}>
                  <I className="size-4 shrink-0 text-[var(--v-ink-3)]" /><span className="min-w-0 flex-1 truncate">{x[1]}</span>{j === i && <CornerDownLeft className="size-4 text-[var(--v-blue)]" />}
                </div>
              </li>);
          })}
          {!res.length && <li className="px-3 py-8 text-center text-[14px] text-[var(--v-ink-2)]">Nothing matches “{q}”. Try a run ID like WI-4821 or a person’s name.</li>}
        </ul>
        <div className="flex gap-4 border-t border-[var(--v-line)] bg-[var(--v-sunken)] px-4 py-2 text-[12px] text-[var(--v-ink-3)]"><span>↑ ↓ move</span><span>↵ open</span><span>Esc close</span></div>
      </div>
    </div>
  );
}

export function Notifications() {
  const [open, setOpen] = useState(false);
  const { notes, unread, markRead } = useProto();
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const off = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = e => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', off); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', off); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button aria-label={`Notifications, ${unread} unread`} aria-expanded={open} onClick={() => setOpen(o => !o)} className="relative grid size-9 place-items-center rounded-lg border border-[var(--v-line)] bg-white hover:bg-[var(--v-sunken)]">
        <Bell className="size-[18px]" />{unread > 0 && <span className="absolute -top-1 -right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--v-red)] px-1 text-[11px] font-semibold text-white">{unread}</span>}
      </button>
      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute right-0 top-11 z-40 w-[380px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
          <div className="flex items-center justify-between border-b border-[var(--v-line)] px-4 py-3"><b className="font-semibold">Notifications</b><div className="flex items-center gap-1"><button onClick={markRead} className="rounded-md px-2 py-1 text-[13px] font-medium text-[var(--v-blue)] hover:bg-[var(--v-blue-soft)]">Mark all read</button><button aria-label="Close notifications" onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-[var(--v-sunken)]"><X className="size-4" /></button></div></div>
          <ul className="max-h-[400px] overflow-y-auto">{notes.map(({ id, t, s, a, href, unread: u }) => (
            <li key={id}><a href={href} onClick={() => setOpen(false)} className="flex gap-3 border-b border-[var(--v-line)] px-4 py-3 last:border-0 hover:bg-[var(--v-sunken)]">
              <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', u ? 'bg-[var(--v-blue)]' : 'bg-transparent')} aria-hidden="true" />
              <span className="min-w-0 flex-1"><span className={cn('block text-[14px]', u && 'font-semibold')}>{t}</span><span className="block truncate text-[12.5px] text-[var(--v-ink-3)]">{s}</span></span>
              <span className="shrink-0 text-[12px] text-[var(--v-ink-3)]">{a}</span>{u && <span className="sr-only">Unread</span>}</a></li>))}</ul>
        </div>)}
    </div>
  );
}
