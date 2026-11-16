// Small modal form used by admin and release actions, so every action opens a real form instead of a message.
// Focus moves into the dialog, Tab stays inside it, Esc closes it and focus returns to the button that opened it.
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function FormDialog({ title, sub, submitLabel, disabled, onSubmit, onClose, children, tone }) {
  const box = useRef(null); const back = useRef(document.activeElement);
  useEffect(() => { box.current?.querySelector('input,select,textarea')?.focus(); const b = back.current; return () => setTimeout(() => b?.focus?.(), 0); }, []);
  const keys = e => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
    if (e.key === 'Tab') { const els = [...box.current.querySelectorAll('button:not([disabled]),input,select,textarea')]; const a = els[0], z = els[els.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  };
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#101429]/45 p-6" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form ref={box} role="dialog" aria-modal="true" aria-labelledby="fd-t" onKeyDown={keys} onSubmit={e => { e.preventDefault(); if (!disabled) onSubmit(); }} className="w-full max-w-[480px] overflow-hidden rounded-2xl border border-[var(--v-line)] bg-[var(--v-surface)] text-[var(--v-ink)] shadow-2xl">
        <header className="flex items-start gap-3 border-b border-[var(--v-line)] px-6 py-4">
          <div className="min-w-0 flex-1"><h2 id="fd-t" className="text-[17px] font-semibold">{title}</h2>{sub && <p className="mt-0.5 text-[13px] text-[var(--v-ink-3)]">{sub}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1.5 hover:bg-[var(--v-sunken)]"><X className="size-4" /></button>
        </header>
        <div className="flex flex-col gap-4 px-6 py-5 text-[14px]">{children}</div>
        <footer className="flex justify-end gap-2 border-t border-[var(--v-line)] bg-[var(--v-sunken)] px-6 py-3">
          <Button type="button" variant="ghost" className="h-10 rounded-lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={disabled} variant={tone === 'danger' ? 'destructive' : 'default'} className="h-10 rounded-lg px-5">{submitLabel}</Button>
        </footer>
      </form>
    </div>
  );
}

export const Field = ({ id, label, help, children }) => (
  <div><label htmlFor={id} className="block text-[13.5px] font-medium">{label}</label><div className="mt-1.5">{children}</div>{help && <p id={`${id}-help`} className="mt-1 text-[12.5px] text-[var(--v-ink-3)]">{help}</p>}</div>
);
export const inputCls = 'h-10 w-full rounded-lg border border-[var(--v-line-strong)] bg-[var(--v-surface)] px-3 text-[14px] outline-none focus:border-[var(--v-blue)] focus:ring-4 focus:ring-[var(--v-blue)]/15';
