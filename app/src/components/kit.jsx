import { Fragment } from 'react';
import SplitText from '@/components/SplitText';
import { GateGlyph } from '@/components/signature';
import { cn } from '@/lib/utils';
import { Inbox, PlayCircle, LayoutGrid, FileText, ScrollText, Search, Plug } from 'lucide-react';

const TONE = { ok:'bg-emerald-50 text-emerald-800', warn:'bg-amber-50 text-amber-900', bad:'bg-red-50 text-red-800', info:'bg-blue-50 text-blue-800', mute:'bg-neutral-200 text-neutral-700' };
export const Tag = ({ tone='mute', children, className }) => <span className={cn('inline-flex h-5 items-center px-2 text-xs whitespace-nowrap rounded-sm', TONE[tone], className)}>{children}</span>;
const SEG = { d:'bg-emerald-700', a:'bg-blue-600', w:'bg-amber-400', f:'bg-red-700' };
export const StageBar = ({ s, className }) => <div className={cn('flex gap-0.5', className)} aria-label={`${s.replace(/[^d]/g,'').length} of 8 stages complete`}>{Array.from({length:8},(_,i)=><i key={i} className={cn('h-1 flex-1', SEG[s[i]]||'bg-neutral-200')}/>)}</div>;
export const Dot = ({ tone }) => <span className={cn('inline-block size-2 rounded-full', {ok:'bg-emerald-700',warn:'bg-amber-400',bad:'bg-red-700',info:'bg-blue-600'}[tone]||'bg-neutral-300')}/>;
export const Kbd = ({ children }) => <kbd className="rounded-sm border border-b-2 px-1 font-mono text-[11px] text-neutral-600 bg-white">{children}</kbd>;

// SplitText used once per screen for the page title: subtle word fade, respects reduced motion.
export const Title = ({ children, className }) => <SplitText text={children} tag="h1" splitType="words" effect="fade" delay={40} duration={0.5} textAlign="left" trigger="load" className={cn('text-xl font-medium tracking-tight', className)} />;

const NAV = [['inbox','Gate queue',Inbox,3],['runs','Runs',PlayCircle],['board','Stories',LayoutGrid],['docs','Documents',FileText],['audit','Evidence ledger',ScrollText]];
export function Shell({ active, title, actions, children, rail = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="sticky top-0 z-20 flex h-12 items-center gap-3 bg-ink px-4 text-white">
        <span className="flex items-center gap-2 pr-4 font-semibold tracking-tight"><span className="grid size-7 place-items-center bg-brand"><GateGlyph state="light" /></span>Delivery Platform</span>
        <span className="h-5 w-px bg-white/15" />
        <div className="min-w-0 [&_h1]:text-white [&_h1]:text-[15px]">{typeof title === 'string' ? <Title>{title}</Title> : title}</div>
        <div className="flex-1" />
        <span className="flex items-center gap-1.5 text-white/70"><span className="size-2 rounded-full bg-emerald-400" />Live</span>
        <div className="flex h-8 w-60 items-center gap-2 bg-white/10 px-2.5 text-white/60"><Search className="size-4" />Search<span className="ml-auto font-mono text-[11px]">⌘K</span></div>
        {actions}
      </header>
      <div className={cn('grid flex-1', rail ? 'grid-cols-[220px_1fr]' : 'grid-cols-1')}>
        {rail && <nav aria-label="Primary" className="sticky top-12 flex h-[calc(100vh-48px)] flex-col border-r border-border bg-paper py-3">
          {NAV.map(([k,l,I,n]) => <a key={k} href="#" className={cn('flex h-8 items-center gap-2.5 px-4 hover:bg-black/[.04]', active===k && 'bg-white font-semibold shadow-[inset_3px_0_0_var(--brand)]')}><I className="size-4 text-[#77756e]" />{l}{n && <span className="ml-auto bg-gate px-1.5 text-[11px] font-semibold text-white">{n}</span>}</a>)}
          <div className="mt-5 px-4 pb-1 font-mono text-[10.5px] uppercase tracking-wider text-[#8a887f]">Gates waiting</div>
          {[['Solution Architect',1],['Product Owner',1],['Engineering Lead',1],['Release Manager',0]].map(([g,n]) => <a key={g} href="#" className="flex h-7 items-center gap-2 px-4 text-[12.5px] hover:bg-black/[.04]"><GateGlyph state={n ? 'waiting' : 'future'} className="size-3" />{g}<span className="ml-auto text-[#8a887f]">{n}</span></a>)}
          <div className="mt-5 px-4 pb-1 font-mono text-[10.5px] uppercase tracking-wider text-[#8a887f]">Workspaces</div>
          {['Full Application','Advisor Portal','Client Services'].map(w => <a key={w} href="#" className="flex h-7 items-center px-4 text-[12.5px] hover:bg-black/[.04]">{w}</a>)}
          <a href="#" className="mt-auto flex h-8 items-center gap-2.5 px-4 text-[12.5px]"><Plug className="size-4 text-[#77756e]" />Connections<span className="ml-auto text-done">● online</span></a>
          <div className="flex items-center gap-2.5 border-t border-border px-4 pt-3"><span className="grid size-7 place-items-center bg-ink text-xs font-semibold text-white">AK</span><div><div className="font-semibold">Alex Kim</div><div className="text-xs text-[#77756e]">Solution Architect</div></div></div>
        </nav>}
        <main className="flex min-w-0 flex-col">{children}</main>
      </div>
    </div>
  );
}
export const Panel = ({ title, right, children, className }) => <section className={cn('border border-border bg-white', className)}>{title && <header className="flex h-10 items-center gap-2 border-b border-border px-4"><h2 className="font-mono text-[11px] font-normal uppercase tracking-wider text-[#77756e]">{title}</h2><div className="flex-1"/>{right}</header>}{children}</section>;
export { Fragment };
