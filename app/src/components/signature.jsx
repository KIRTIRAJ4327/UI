// Signature components: the visual language of the delivery platform.
import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import { STAGES, GATES } from '@/data';

/* Gate glyph: two posts and a bar. The platform's mark and its symbol for a human checkpoint. */
export function GateGlyph({ state = 'future', className }) {
  const c = { passed: 'var(--done)', waiting: 'var(--gate)', future: '#b9b6ad', light: '#fff' }[state];
  return (
    <svg viewBox="0 0 16 16" className={cn('size-4 shrink-0', className)} aria-hidden="true">
      <rect x="2" y="2" width="2.5" height="12" fill={c} /><rect x="11.5" y="2" width="2.5" height="12" fill={c} />
      <rect x="2" y="5" width="12" height="2.5" fill={c} />
    </svg>
  );
}

/* Delivery track: 8 stations. Agent stages are circles; human gates sit on the line between them.
   s = per-stage state string: d done, a agent working, w waiting on a person, f failed. */
export function Track({ s = '', size = 'lg', className }) {
  const lg = size === 'lg';
  const cur = s.length - 1;
  return (
    <ol className={cn('flex items-start', className)} aria-label={`Stage ${Math.max(cur + 1, 1)} of 8`}>
      {STAGES.map((st, i) => {
        const k = s[i];
        const gate = GATES[st];
        const gateState = k === 'd' ? 'passed' : k === 'w' ? 'waiting' : 'future';
        return (
          <Fragment key={st}>
            <li className={cn('flex flex-col items-center', lg ? 'w-14' : 'w-4')}>
              <span className={cn('grid place-items-center rounded-full border-2 bg-white',
                lg ? 'size-5' : 'size-3',
                k === 'd' && 'border-done bg-done',
                k === 'a' && 'border-brand ring-4 ring-brand/15',
                k === 'w' && 'border-gate',
                k === 'f' && 'border-red-700 bg-red-700',
                !k && 'border-[#cfccc3]')}>
                {lg && k === 'd' && <svg viewBox="0 0 12 12" className="size-3"><path d="M2.5 6.2l2.2 2.2 4.8-5" stroke="#fff" strokeWidth="1.8" fill="none" /></svg>}
                {lg && k === 'a' && <span className="size-2 animate-pulse rounded-full bg-brand" />}
              </span>
              {lg && <span className={cn('mt-1.5 text-center text-[11.5px] leading-tight', i === cur ? 'font-semibold text-ink' : 'text-[#6b6a66]')}>{st}</span>}
            </li>
            {i < 7 && (
              <li aria-hidden="true" className={cn('relative flex flex-1 items-center', lg ? 'h-5' : 'h-3')}>
                <span className={cn('h-0.5 w-full', s[i + 1] ? 'bg-done' : 'bg-[#dedbd2]')} />
                {gate && <span className="absolute left-1/2 -translate-x-1/2 bg-paper px-0.5" title={`${gate} gate`}>
                  <GateGlyph state={s[i + 1] ? 'passed' : gateState} className={lg ? 'size-4' : 'size-3'} />
                </span>}
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}

/* Plain-English narration: the platform's voice, set in a reading serif. */
export const Narration = ({ children, className }) => (
  <p className={cn('font-serif text-[17px] leading-relaxed text-ink', className)}>{children}</p>
);

/* Evidence strip: what the claim is based on. */
export const Evidence = ({ items, className }) => (
  <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-dashed border-border pt-2 text-[12px] text-[#5d5c58]', className)}>
    <span className="font-mono uppercase tracking-wider text-[11px] text-[#65635c]">Evidence</span>
    {items.map(x => <span key={x} className="flex items-center gap-1.5"><span className="size-1.5 bg-done" />{x}</span>)}
  </div>
);

/* Trace chain: one business rule followed from request to tests. */
export const Trace = ({ steps, className }) => (
  <ol className={cn('flex flex-wrap items-center gap-1.5', className)}>
    {steps.map(([k, v], i) => (
      <Fragment key={k}>
        <li className="border border-border bg-white px-2 py-1"><span className="block font-mono text-[10.5px] uppercase tracking-wider text-[#65635c]">{k}</span><span className="text-[12.5px]">{v}</span></li>
        {i < steps.length - 1 && <li aria-hidden="true" className="text-[#b9b6ad]">→</li>}
      </Fragment>
    ))}
  </ol>
);

/* Waiting clock: how long a gate has been waiting against its service target. */
export const Waiting = ({ mins, target = 240, label }) => {
  const pct = Math.min(100, (mins / target) * 100);
  return (
    <div className="flex items-center gap-2 text-[12px] text-[#5d5c58]">
      <span className="relative h-1 w-16 bg-[#e7e4dc]"><span className={cn('absolute inset-y-0 left-0', pct > 75 ? 'bg-red-700' : 'bg-gate')} style={{ width: pct + '%' }} /></span>
      {label}
    </div>
  );
};
