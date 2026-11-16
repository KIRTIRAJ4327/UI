// Light / dark / system theme for the product. "System" follows the page's data-theme (set by the host
// when someone picks a theme there) and otherwise the operating system. The choice is remembered per viewer.
import { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

const KEY = 'delivery-theme';
const read = () => { try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; } };
const systemMode = () => {
  const host = document.documentElement.getAttribute('data-theme');
  if (host === 'dark' || host === 'light') return host;
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const Ctx = createContext({ mode: 'system', resolved: 'light', setMode: () => {} });
export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(read);
  const [sys, setSys] = useState(systemMode);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)'); const f = () => setSys(systemMode());
    mq.addEventListener('change', f);
    const mo = new MutationObserver(f); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { mq.removeEventListener('change', f); mo.disconnect(); };
  }, []);
  const setMode = m => { setModeState(m); try { localStorage.setItem(KEY, m); } catch { /* not stored; still applies for this visit */ } };
  const resolved = mode === 'system' ? sys : mode;
  useEffect(() => { document.body.style.background = resolved === 'dark' ? '#0d111d' : '#eef1ed'; }, [resolved]);
  return <Ctx.Provider value={{ mode, resolved, setMode }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);

const ORDER = ['light', 'dark', 'system'];
const ICON = { light: Sun, dark: Moon, system: Monitor };
const LABEL = { light: 'Light', dark: 'Dark', system: 'System' };
export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const I = ICON[mode]; const next = ORDER[(ORDER.indexOf(mode) + 1) % 3];
  return (
    <button onClick={() => setMode(next)} aria-label={`Theme: ${LABEL[mode]}. Switch to ${LABEL[next]}`} title={`Theme: ${LABEL[mode]}`} className="grid size-9 place-items-center rounded-lg border border-[var(--v-line)] bg-[var(--v-surface)] text-[var(--v-ink-2)] hover:bg-[var(--v-sunken)]">
      <I className="size-[18px]" />
    </button>
  );
}
