import { Fragment } from 'react';
import SplitText from '@/components/SplitText';
import { cn } from '@/lib/utils';
import { Inbox, PlayCircle, LayoutGrid, FileText, ScrollText, Search, Plug } from 'lucide-react';

const TONE = { ok:'bg-emerald-50 text-emerald-800', warn:'bg-amber-50 text-amber-900', bad:'bg-red-50 text-red-800', info:'bg-blue-50 text-blue-800', mute:'bg-neutral-200 text-neutral-700' };
export const Tag = ({ tone='mute', children, className }) => <span className={cn('inline-flex h-5 items-center px-2 text-xs whitespace-nowrap rounded-sm', TONE[tone], className)}>{children}</span>;
const SEG = { d:'bg-emerald-700', a:'bg-blue-600', w:'bg-amber-400', f:'bg-red-700' };
export const StageBar = ({ s, className }) => <div className={cn('flex gap-0.5', className)} aria-label={`${s.replace(/[^d]/g,'').length} of 8 stages complete`}>{Array.from({length:8},(_,i)=><i key={i} className={cn('h-1 flex-1', SEG[s[i]]||'bg-neutral-200')}/>)}</div>;
export const Dot = ({ tone }) => <span className={cn('inline-block size-2 rounded-full', {ok:'bg-emerald-700',warn:'bg-amber-400',bad:'bg-red-700',info:'bg-blue-600'}[tone]||'bg-neutral-300')}/>;
export const Kbd = ({ children }) => <kbd className="rounded-sm border border-b-2 px-1 font-mono text-[11px] text-neutral-600 bg-white">{children}</kbd>;

// SplitText used once per screen for the page title: subtle word fade, respects reduced motion.
export const Title = ({ children, className }) => <SplitText text={children} tag="h1" splitType="words" effect="fade" delay={40} duration={0.5} textAlign="left" trigger="load" className={cn('text-xl font-normal text-neutral-900', className)} />;

const NAV = [['inbox','Inbox',Inbox,3],['runs','Runs',PlayCircle],['board','Stories',LayoutGrid],['docs','Documents',FileText],['audit','Audit trail',ScrollText]];
export function Shell({ active, title, actions, children, rail = true }) {
  return (
    <div className={cn('grid min-h-screen bg-background text-neutral-900', rail ? 'grid-cols-[232px_1fr]' : 'grid-cols-1')}>
      {rail && <nav aria-label="Primary" className="sticky top-0 flex h-screen flex-col border-r bg-white">
        <div className="flex h-12 items-center gap-2.5 bg-neutral-900 px-4 font-semibold text-white"><span className="size-4 bg-white"/>Delivery Platform</div>
        {NAV.map(([k,l,I,n])=> <a key={k} href="#" className={cn('flex h-8 items-center gap-2.5 px-4 hover:bg-neutral-100', active===k && 'bg-neutral-200 font-semibold shadow-[inset_3px_0_0_var(--primary)]')}><I className="size-4 text-neutral-500"/>{l}{n && <span className="ml-auto bg-primary px-1.5 text-xs text-white">{n}</span>}</a>)}
        <div className="mt-4 px-4 pb-1 text-xs text-neutral-500">Workspaces</div>
        {['Full Application','Advisor Portal','Client Services'].map(w=><a key={w} href="#" className="flex h-8 items-center px-4 hover:bg-neutral-100">{w}</a>)}
        <div className="mt-4 px-4 pb-1 text-xs text-neutral-500">Admin</div>
        <a href="#" className="flex h-8 items-center gap-2.5 px-4 hover:bg-neutral-100"><Plug className="size-4 text-neutral-500"/>Connections<Tag tone="ok" className="ml-auto">online</Tag></a>
        <div className="mt-auto flex items-center gap-2.5 border-t px-4 py-3"><span className="grid size-7 place-items-center rounded-full bg-neutral-700 text-xs font-semibold text-white">AK</span><div><div className="font-semibold">Alex Kim</div><div className="text-xs text-neutral-500">Solution Architect</div></div></div>
      </nav>}
      <main className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b bg-white px-6">
          {typeof title === 'string' ? <Title>{title}</Title> : title}
          <div className="flex-1"/>
          <span className="flex items-center gap-1.5 text-neutral-600"><span className="size-2 rounded-full bg-emerald-600"/>Live</span>
          <div className="flex h-8 w-64 items-center gap-2 border-b border-neutral-500 bg-neutral-100 px-2.5 text-neutral-500"><Search className="size-4"/>Search<span className="ml-auto"><Kbd>⌘K</Kbd></span></div>
          {actions}
        </header>
        {children}
      </main>
    </div>
  );
}
export const Panel = ({ title, right, children, className }) => <section className={cn('border bg-white', className)}>{title && <header className="flex h-10 items-center gap-2 border-b bg-neutral-50 px-4"><h2 className="text-sm font-semibold">{title}</h2><div className="flex-1"/>{right}</header>}{children}</section>;
export { Fragment };
