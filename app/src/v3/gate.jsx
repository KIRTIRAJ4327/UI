// Role-based access for decisions and admin pages.
import { Button } from '@/components/ui/button';
import { Card, Avatar, PEOPLE, Shell } from './ui';
import { useProto, ROLE_OF, PERMS } from './store';
import { Lock, ShieldX } from 'lucide-react';
import { useToast } from '@/components/friendly';

const LABEL = Object.fromEntries(PERMS.flatMap(([, l]) => l));

/* For a gated decision: who holds it, whether it is already decided, and whether the signed-in person may decide. */
export function useGate(id, perm) {
  const { runs, raw, me, can, myRole } = useProto();
  const r = raw[id];
  const decided = r.state !== 'wait';
  const notHolder = r.holder !== me;
  // A named backup approver gets the gate permission for that one work item.
  const noPerm = !can(perm) && !(r.holder === me && r.backupFor);
  return { run: runs[id], raw: r, decided, blocked: !decided && (notHolder || noPerm), notHolder, noPerm, perm, me, myRole };
}

export function NotYours({ g }) {
  const h = g.raw.holder;
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-[var(--v-ink-2)]"><Lock className="size-5" /><b className="text-[var(--v-ink)]">View only</b></div>
      <p className="mt-2 text-[14px] text-[var(--v-ink-2)]">
        {g.noPerm ? <>Your role, <b>{g.myRole}</b>, does not include “{LABEL[g.perm]}”.</> : <>This decision is assigned to someone else.</>}
      </p>
      <div className="mt-3 flex items-center gap-3 rounded-lg bg-[var(--v-sunken)] p-3"><Avatar p={h} size={30} /><div className="text-[13.5px]"><b className="font-medium">{PEOPLE[h]?.name}</b><div className="text-[var(--v-ink-3)]">{ROLE_OF[h] || PEOPLE[h]?.role} · decides this gate</div></div></div>
      <p className="mt-3 text-[13px] text-[var(--v-ink-3)]">You can read everything on this page and leave a comment. Try <b>View as</b> at the bottom of the menu to switch person.</p>
    </Card>
  );
}

/* Wrap an admin page: people without the permission see why, instead of the page. */
export function RequirePerm({ perm, active, crumbs, children }) {
  const { can, myRole } = useProto();
  const toast = useToast();
  if (can(perm)) return children;
  return (
    <Shell active={active} crumbs={crumbs}>
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 py-20 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-[var(--v-red-soft)] text-[var(--v-red)]"><ShieldX className="size-7" /></span>
        <h1 className="font-display text-[24px] font-semibold">You do not have access to this page</h1>
        <p className="text-[15px] text-[var(--v-ink-2)]">It needs the permission “{LABEL[perm]}”. Your role, <b>{myRole}</b>, does not include it.</p>
        <p className="text-[14px] text-[var(--v-ink-3)]">A platform admin can grant it in Roles and permissions.</p>
        <div className="mt-2 flex gap-2"><Button asChild className="h-10 rounded-lg"><a href="#v3-home">Go to home</a></Button><Button variant="outline" className="h-10 rounded-lg" onClick={() => toast('Access request sent to Dana Whitfield.')}>Request access</Button></div>
      </div>
    </Shell>
  );
}
