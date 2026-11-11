// Admin · Roles and permissions (RBAC): what each role may do. Changes apply immediately and are audited.
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shell, Card, CardHead, Pill, Avatar } from './ui';
import { useProto, PERMS, ROLE_OF } from './store';
import { useToast } from '@/components/friendly';
import { Check, Lock } from 'lucide-react';

const LOCKED = 'Platform Admin';
const SENSITIVE = new Set(['gate.release', 'artifacts.all', 'artifacts.export', 'audit.view', 'people.manage', 'roles.manage', 'connections.manage', 'policies.manage']);
function ConfirmGrant({ p, members, onCancel, onConfirm }) {
  const cancel = useRef(null);
  useEffect(() => { cancel.current?.focus(); }, []);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#101429]/45 p-6" onMouseDown={e => e.target === e.currentTarget && onCancel()}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="cg-t" onKeyDown={e => e.key === 'Escape' && onCancel()} className="w-full max-w-[460px] rounded-2xl bg-[var(--v-surface)] p-6 shadow-2xl">
        <h2 id="cg-t" className="font-display text-[20px] font-semibold">Grant “{p.label}” to {p.role}?</h2>
        <p className="mt-2 text-[14px] text-[var(--v-ink-2)]">This is a sensitive permission. {members.length ? <>It applies straight away to <b>{members.length} {members.length === 1 ? 'person' : 'people'}</b>: {members.join(', ')}.</> : 'Nobody has this role yet, so it takes effect when someone is given it.'}</p>
        <p className="mt-2 text-[13px] text-[var(--v-ink-3)]">The change is recorded in the audit log with your name.</p>
        <div className="mt-5 flex justify-end gap-2"><Button ref={cancel} variant="outline" className="h-10 rounded-lg" onClick={onCancel}>Cancel</Button><Button className="h-10 rounded-lg" onClick={onConfirm}>Grant permission</Button></div>
      </div>
    </div>
  );
}
export default function V3Roles() {
  const { roles, togglePerm, undo } = useProto();
  const toast = useToast();
  const names = Object.keys(roles);
  const [focus, setFocus] = useState('Solution Architect');
  const [pending, setPending] = useState(null);
  const NAMES = { alex: 'Alex Kim', priya: 'Priya Nair', sam: 'Sam Okafor', dana: 'Dana Whitfield', jon: 'Jon Reyes', lena: 'Lena Brooks', tom: 'Tom Iverson', mara: 'Mara Lopez', ana: 'Ana Costa', ravi: 'Ravi Shah' };
  const membersOf = r => Object.entries(ROLE_OF).filter(([, x]) => x === r).map(([p]) => NAMES[p]);
  const members = Object.entries(ROLE_OF).filter(([, r]) => r === focus).map(([p]) => p);
  const ask = (role, key, label) => { if (SENSITIVE.has(key) && !roles[role].includes(key)) setPending({ role, key, label }); else flip(role, key, label); };
  const flip = (role, key, label) => { const on = roles[role].includes(key); const t = togglePerm(role, key); toast(`${on ? 'Removed' : 'Granted'} “${label}” ${on ? 'from' : 'to'} ${role}.`, () => undo(t)); };
  return (
    <Shell active="roles" crumbs={['Admin', 'Roles and permissions']}>
      <div className="mx-auto flex max-w-[1320px] flex-col gap-6">
        <div><h1 className="font-display text-[28px] font-semibold">Roles and permissions</h1><p className="mt-1 max-w-[80ch] text-[15px] text-[var(--v-ink-2)]">Each person gets their abilities from their role. Changes apply straight away, are recorded in the audit log, and can be undone. Platform Admin always keeps every permission, so you cannot lock yourself out.</p></div>
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-[13px]">
                <caption className="sr-only">Permissions by role</caption>
                <thead><tr className="border-b border-[var(--v-line)] bg-[var(--v-sunken)]"><th className="sticky left-0 z-10 w-64 bg-[var(--v-sunken)] py-3 pl-5 text-left font-medium text-[var(--v-ink-3)]">Permission</th>
                  {names.map(r => <th key={r} scope="col" className="px-1 py-2 align-bottom"><button onClick={() => setFocus(r)} className={`w-full rounded-md px-1.5 py-1 text-[12px] leading-tight font-semibold ${focus === r ? 'bg-[var(--v-blue-soft)] text-[var(--v-blue)]' : 'text-[var(--v-ink)] hover:bg-[var(--v-surface)]'}`}>{r}</button></th>)}</tr></thead>
                <tbody>{PERMS.map(([group, list]) => (
                  <Fragment key={group}>
                    <tr className="bg-[var(--v-surface)]"><th colSpan={names.length + 1} className="sticky left-0 px-5 pt-4 pb-1 text-left text-[12px] font-semibold uppercase tracking-wide text-[var(--v-ink-3)]">{group}</th></tr>
                    {list.map(([key, label]) => (
                      <tr key={key} className="border-b border-[var(--v-line)] hover:bg-[var(--v-sunken)]">
                        <th scope="row" className="sticky left-0 bg-[var(--v-surface)] py-2 pl-5 text-left font-normal">{label}</th>
                        {names.map(r => { const on = roles[r].includes(key); const locked = r === LOCKED; return (
                          <td key={r} className={`text-center ${focus === r ? 'bg-[var(--v-blue-soft)]/50' : ''}`}>
                            <button role="checkbox" aria-checked={on} aria-label={`${r}: ${label}`} disabled={locked} onClick={() => ask(r, key, label)} className={`grid size-6 place-items-center rounded-md border transition-colors ${on ? 'border-[var(--v-blue)] bg-[var(--v-blue)] text-white' : 'border-[var(--v-toggle-off)] bg-[var(--v-surface)] hover:border-[var(--v-blue)]'} ${locked ? 'cursor-not-allowed opacity-70' : ''} mx-auto`}>{on ? (locked ? <Lock className="size-3" /> : <Check className="size-3.5" strokeWidth={3} />) : null}</button>
                          </td>); })}
                      </tr>))}
                  </Fragment>))}</tbody>
              </table>
            </div>
          </Card>
          <div className="grid grid-cols-2 items-start gap-6">
            <Card>
              <CardHead title={focus} sub={`${roles[focus].length} of ${PERMS.flatMap(p => p[1]).length} permissions`} right={focus === LOCKED ? <Pill tone="mute">Locked</Pill> : null} />
              <div className="px-5 pb-4"><div className="text-[12.5px] font-medium text-[var(--v-ink-3)]">People with this role</div>
                <ul className="mt-2 flex flex-col gap-2">{members.length ? members.map(p => <li key={p} className="flex items-center gap-2.5 text-[13.5px]"><Avatar p={p} size={26} />{({ alex: 'Alex Kim', priya: 'Priya Nair', sam: 'Sam Okafor', dana: 'Dana Whitfield', jon: 'Jon Reyes', lena: 'Lena Brooks', tom: 'Tom Iverson', mara: 'Mara Lopez', ana: 'Ana Costa', ravi: 'Ravi Shah' })[p]}</li>) : <li className="text-[13.5px] text-[var(--v-ink-2)]">Nobody yet. Assign it in People and access.</li>}</ul>
                <a href="#v3-people" className="mt-3 inline-block text-[13px] font-medium text-[var(--v-blue)]">Manage people</a></div>
            </Card>
            <Card className="px-5 py-4 text-[13.5px] text-[var(--v-ink-2)]"><b className="text-[var(--v-ink)]">Try it:</b> remove “Approve designs” from Solution Architect, then use <b>View as → Alex Kim</b> and open the design approval. The buttons are replaced by an explanation.</Card>
          </div>
        </div>
      </div>
      {pending && <ConfirmGrant p={pending} members={membersOf(pending.role)} onCancel={() => setPending(null)} onConfirm={() => { flip(pending.role, pending.key, pending.label); setPending(null); }} />}
    </Shell>
  );
}
