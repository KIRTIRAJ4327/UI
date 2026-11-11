// Shared table behaviour: sortable headers (with aria-sort), paging and a result count.
import { useMemo, useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export function useTable(rows, { sort: initial = null, dir: initialDir = 'asc', pageSize = 10, getters = {} } = {}) {
  const [sort, setSort] = useState(initial);
  const [dir, setDir] = useState(initialDir);
  const [page, setPage] = useState(0);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const get = getters[sort] || (r => r[sort]);
    return [...rows].sort((a, b) => { const x = get(a), y = get(b); const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y)); return dir === 'asc' ? c : -c; });
  }, [rows, sort, dir, getters]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => { if (page >= pages) setPage(0); }, [pages, page]);
  const view = sorted.slice(page * pageSize, page * pageSize + pageSize);
  const by = key => ({ active: sort === key, dir, onClick: () => { if (sort === key) setDir(d => (d === 'asc' ? 'desc' : 'asc')); else { setSort(key); setDir('asc'); } setPage(0); } });
  return { view, by, page, pages, setPage, total: sorted.length, from: sorted.length ? page * pageSize + 1 : 0, to: Math.min(sorted.length, (page + 1) * pageSize) };
}

export function SortTh({ label, s, className = '' }) {
  const Icon = s.active ? (s.dir === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;
  return (
    <th aria-sort={s.active ? (s.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`font-medium ${className}`}>
      <button onClick={s.onClick} className={`-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-white hover:text-[var(--v-ink)] ${s.active ? 'text-[var(--v-ink)]' : ''}`}>{label}<Icon className="size-3.5 opacity-70" /></button>
    </th>
  );
}

export function Pager({ t, noun = 'items' }) {
  return (
    <div className="flex items-center gap-3 border-t border-[var(--v-line)] px-5 py-3 text-[13px] text-[var(--v-ink-3)]">
      <span className="tnum">{t.total ? `${t.from}–${t.to} of ${t.total} ${noun}` : `No ${noun}`}</span>
      <div className="ml-auto flex items-center gap-1">
        <button aria-label="Previous page" disabled={t.page === 0} onClick={() => t.setPage(t.page - 1)} className="grid size-8 place-items-center rounded-md border border-[var(--v-line)] bg-white disabled:opacity-40"><ChevronLeft className="size-4" /></button>
        <span className="tnum px-2">Page {t.page + 1} of {t.pages}</span>
        <button aria-label="Next page" disabled={t.page >= t.pages - 1} onClick={() => t.setPage(t.page + 1)} className="grid size-8 place-items-center rounded-md border border-[var(--v-line)] bg-white disabled:opacity-40"><ChevronRight className="size-4" /></button>
      </div>
    </div>
  );
}
