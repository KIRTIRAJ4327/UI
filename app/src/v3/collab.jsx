// Comments and activity for a work item. Comments are stored with the run and recorded in the audit log.
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHead, Avatar, PEOPLE } from './ui';
import { useProto } from './store';
import { useToast } from '@/components/friendly';

export const when = iso => { if (!iso) return ''; const d = new Date(iso); const mins = Math.round((Date.now() - d) / 60000); if (mins < 1) return 'just now'; if (mins < 60) return `${mins} min ago`; return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC'; };
const MENTION = /@(Priya|Alex|Sam|Dana|Jon|Lena|Tom|Mara)\b/g;

export function Comments({ id, title = 'Discussion' }) {
  const { comments, addComment } = useProto();
  const toast = useToast();
  const [text, setText] = useState('');
  const list = comments[id] || [];
  const post = () => { const t = text.trim(); if (!t) return; addComment(id, t); setText(''); const m = [...t.matchAll(MENTION)].map(x => x[1]); toast(m.length ? `Comment posted. ${m.join(', ')} ${m.length > 1 ? 'were' : 'was'} notified.` : 'Comment posted.'); };
  return (
    <Card>
      <CardHead title={title} sub={`${list.length} comment${list.length === 1 ? '' : 's'}`} />
      <ul className="flex flex-col gap-3 px-5">{list.map((c, i) => (
        <li key={i} className="flex gap-3"><Avatar p={c.who} size={28} /><div className="min-w-0 flex-1 rounded-xl rounded-tl-sm bg-[var(--v-sunken)] px-3 py-2 text-[14px]"><b className="font-medium">{PEOPLE[c.who]?.name}</b> <span className="text-[12px] text-[var(--v-ink-3)]">{when(c.at)}</span><p className="whitespace-pre-wrap">{c.text.split(MENTION).map((part, j) => j % 2 ? <span key={j} className="rounded bg-[var(--v-blue-soft)] px-1 font-medium text-[var(--v-blue)]">@{part}</span> : part)}</p></div></li>))}
      </ul>
      <form className="px-5 pt-3 pb-5" onSubmit={e => { e.preventDefault(); post(); }}>
        <label htmlFor={`c-${id}`} className="sr-only">Add a comment</label>
        <textarea id={`c-${id}`} rows={2} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) post(); }} placeholder="Add a comment. Type @ and a name to notify someone." className="w-full rounded-lg border border-[var(--v-line)] p-2.5 text-[14px] outline-none focus:border-[var(--v-blue)] focus:ring-4 focus:ring-[var(--v-blue)]/15" />
        <div className="mt-2 flex items-center justify-between"><span className="text-[12px] text-[var(--v-ink-3)]">Ctrl + Enter to post</span><Button type="submit" size="sm" disabled={!text.trim()} className="rounded-lg">Post</Button></div>
      </form>
    </Card>
  );
}

export function Activity({ id }) {
  const { audit, NAME } = useProto();
  const rows = audit.filter(e => e.target.includes(id)).slice(0, 8);
  return (
    <Card>
      <CardHead title="Activity" sub="Everything that happened on this work item" right={<a href="#v3-audit" className="text-[13px] font-medium text-[var(--v-blue)]">Audit log</a>} />
      <ol className="flex flex-col gap-2.5 px-5 pb-5 text-[13.5px]">
        {rows.length ? rows.map((e, i) => <li key={i} className="grid grid-cols-[24px_1fr_auto] items-start gap-2.5">{NAME[e.who] ? <Avatar p={e.who} size={22} /> : <span className="size-[22px] rounded-full bg-[var(--v-sunken)]" />}<span><b className="font-medium">{NAME[e.who] || 'System'}</b> {e.action.charAt(0).toLowerCase() + e.action.slice(1)}</span><span className="text-[12px] text-[var(--v-ink-3)]">{when(e.at)}</span></li>)
          : <li className="text-[var(--v-ink-2)]">No activity recorded yet.</li>}
      </ol>
    </Card>
  );
}
