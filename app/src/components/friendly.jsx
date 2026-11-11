// Friendliness helpers used across concepts: a clear next step, plain-language terms,
// a how-to-read legend, and feedback with undo for every decision.
import { createContext, useContext, useState, useCallback, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HelpCircle, ArrowRight } from 'lucide-react';

/* One sentence that says what this screen wants from you, with the main action. */
export function NextStep({ children, action, onAction, secondary }) {
  return (
    <div role="region" aria-label="Your next step" className="flex items-center gap-4 border-b border-gate/40 bg-gate-soft px-6 py-3">
      <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-gate"><ArrowRight className="size-3.5" />Your next step</span>
      <p className="min-w-0 flex-1 text-[14px]">{children}</p>
      {secondary}
      {action && <Button onClick={onAction}>{action}</Button>}
    </div>
  );
}

/* A term with its plain-language meaning on hover and focus. */
export const Term = ({ children, means }) => (
  <abbr title={means} tabIndex={0} className="cursor-help underline decoration-dotted decoration-1 underline-offset-2">{children}</abbr>
);

/* "How to read this" disclosure: closed by default for experts, one click for newcomers. */
export function HowToRead({ items, className }) {
  return (
    <details className={cn('group border border-border bg-white text-[13px]', className)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 font-semibold"><HelpCircle className="size-4 text-brand" />How to read this screen<span className="ml-auto text-[12px] font-normal text-[#5c5a54] group-open:hidden">Show</span><span className="ml-auto hidden text-[12px] font-normal text-[#5c5a54] group-open:inline">Hide</span></summary>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 border-t border-border px-3 py-2.5">{items.map(([k, v]) => <Fragment key={k}><dt className="font-semibold">{k}</dt><dd className="text-[#45433e]">{v}</dd></Fragment>)}</dl>
    </details>
  );
}

/* Toast with undo: every decision is confirmed and reversible for a few seconds. */
const ToastCtx = createContext(() => {});
export function ToastProvider({ children }) {
  const [t, setT] = useState(null);
  const show = useCallback((msg) => { setT(msg); clearTimeout(window.__toast); window.__toast = setTimeout(() => setT(null), 6000); }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center">
        {t && <div className="pointer-events-auto flex items-center gap-4 bg-ink px-4 py-2.5 text-white shadow-lg"><span>{t}</span><button onClick={() => setT(null)} className="font-semibold text-[#9cc3ff] underline underline-offset-2">Undo</button></div>}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);
