# Step 3 of 31: Buttons, checkbox and toast

The two shadcn components the product uses, and the toast with Undo.

## What to tell Copilot

Open this file in the editor, then paste this into Copilot Chat (Agent or Edit mode):

```text
Using #file:03-base-components.md, create 3 files exactly as given in the "Files" section: src/components/ui/button.jsx, src/components/ui/checkbox.jsx, src/components/friendly.jsx.
Copy the code character for character. Do not rename, reformat, shorten, "improve" or convert to TypeScript.
Do not leave placeholders such as "// rest of the code". When done, list the files you created with their line counts.
```

## Files

Create these files with **exactly** this content.

### File: `src/components/ui/button.jsx` (63 lines)

`````jsx
import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
`````

### File: `src/components/ui/checkbox.jsx` (32 lines)

`````jsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
`````

### File: `src/components/friendly.jsx` (51 lines)

`````jsx
// Friendliness helpers used across concepts: a clear next step, plain-language terms,
// a how-to-read legend, and feedback with undo for every decision.
import { createContext, useContext, useState, useCallback, useEffect, Fragment } from 'react';
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
  const show = useCallback((msg, undo) => { setT({ msg, undo, at: Date.now() }); clearTimeout(window.__toast); window.__toast = setTimeout(() => setT(null), undo ? 8000 : 5000); }, []);
  // A toast belongs to the page it was raised on: leaving that page (other than the action's own redirect) dismisses it.
  useEffect(() => { const f = () => setT(x => x && Date.now() - x.at > 1500 ? null : x); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center">
        {t && <div className="pointer-events-auto flex items-center gap-4 rounded-lg bg-[#101429] px-4 py-2.5 text-white shadow-lg"><span>{t.msg}</span>{t.undo && <button onClick={() => { const ok = t.undo(); setT({ msg: ok === false ? 'Cannot undo: something else has changed since.' : 'Undone.', at: Date.now() }); }} className="font-semibold text-[#9cc3ff] underline underline-offset-2">Undo</button>}</div>}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);
`````

## Check before the next step

- [ ] `friendly.jsx` exports `ToastProvider` and `useToast`.
- [ ] Button has variants default, outline, secondary, ghost, destructive, link.

## Specification

This explains what the code above does, in words. If you later change the screen, keep to these rules.

### 4.2 Button (shadcn, product sizes)

Base: `inline-flex items-center justify-center rounded-lg text-sm font-medium`, focus ring `focus-visible:ring-3 ring-ring/50`, `active:translate-y-px`, disabled `opacity-50 pointer-events-none`, icons 16px.

| Variant | Look | Used for |
|---|---|---|
| `default` | `bg-primary text-white hover:bg-primary/80` | The one main action per area |
| `outline` | border, surface background, `hover:bg-muted` | Secondary actions (Send back, Request changes, Hold, Test) |
| `ghost` | no border, `hover:bg-muted` | Cancel, Clear, Discard, "All runs" |
| `destructive` | `bg-destructive/10 text-destructive` | Danger submit in FormDialog (`tone="danger"`) |

Product heights override shadcn defaults: top-bar actions `h-9 rounded-lg px-4`; panel actions `h-10 rounded-lg px-5`; decision buttons `h-11 rounded-lg text-[15px]` full width; small in-card `size="sm"` (`h-7`) with `rounded-lg`. The red "Release to production" button is `bg-[var(--v-red)] hover:bg-[#93201a]`.

### 4.20 Toast with Undo

- One toast at a time, bottom centre: container `pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center`, `role="status" aria-live="polite"`; toast `rounded-lg bg-[#101429] px-4 py-2.5 text-white shadow-lg`, optional ‹Undo› (`font-semibold text-[#9cc3ff] underline`).
- Duration 8 s with Undo, 5 s without. Navigating away (hash change more than 1.5 s after the toast appeared) dismisses it.
- Undo calls `undo(token)`; it succeeds only if nothing else changed since (§7.5). Result toast: "Undone." or "Cannot undo: something else has changed since."
