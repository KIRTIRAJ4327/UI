#!/usr/bin/env python3
"""Generates the step-by-step build kit in kit/ from the starter source and UI-BUILD-SPEC.md, so the two never drift."""
import os, re
H = os.path.dirname(os.path.abspath(__file__)); ST = os.path.join(H, 'starter'); KIT = os.path.join(H, 'kit')
spec = open(os.path.join(H, 'UI-BUILD-SPEC.md')).read()
def sec(num):
    """Text of spec section num ('6.1', '4.5', '3', …) up to the next heading of the same or higher level."""
    m = re.search(r'^(#{2,3}) ' + re.escape(num) + r'[ .][^\n]*\n', spec, re.M)
    if not m: raise SystemExit('missing section ' + num)
    lvl = len(m.group(1)); rest = spec[m.end():]
    n = re.search(r'^#{2,' + str(lvl) + r'} ', rest, re.M)
    body = rest[:n.start()] if n else rest
    return (m.group(0) + body).replace('\n---\n', '\n').strip()
F = '`' * 5
def code(path):
    src = open(os.path.join(ST, path)).read().rstrip('\n')
    lang = {'jsx': 'jsx', 'js': 'js', 'css': 'css', 'json': 'json', 'html': 'html', 'md': 'markdown', 'svg': 'xml'}.get(path.rsplit('.', 1)[-1], '')
    return f'### File: `{path}` ({src.count(chr(10)) + 1} lines)\n\n{F}{lang}\n{src}\n{F}\n'
STEPS = [
 ('01-project-setup', 'Project setup', 'Create the project, install the packages and add the entry files. Nothing shows on screen yet.',
  ['package.json', 'vite.config.js', 'jsconfig.json', 'components.json', 'index.html', 'public/favicon.svg', '.gitignore', '.github/copilot-instructions.md', 'src/lib/utils.js', 'src/main.jsx'], ['2'], [],
  ['`npm install` finishes without errors.', 'The files exist at exactly these paths.', 'Do not run the app yet: `src/App.jsx` arrives in step 12.']),
 ('02-styles-and-tokens', 'Styles and design tokens', 'One stylesheet holds every colour, font and radius for light and dark mode. Every later file depends on these token names.',
  ['src/index.css'], ['3'], [],
  ['The file contains the `.v3` block and the `.v3[data-mode="dark"]` block.', 'No colour is changed, renamed or removed.']),
 ('03-base-components', 'Buttons, checkbox and toast', 'The two shadcn components the product uses, and the toast with Undo.',
  ['src/components/ui/button.jsx', 'src/components/ui/checkbox.jsx', 'src/components/friendly.jsx'], ['4.2', '4.20'], [],
  ['`friendly.jsx` exports `ToastProvider` and `useToast`.', 'Button has variants default, outline, secondary, ghost, destructive, link.']),
 ('04-animated-components', 'Animated components for Home', 'Three ready-made components used only on the Home screen: the animated title, the activity list and the spotlight card. Copy them unchanged.',
  ['src/components/SplitText.jsx', 'src/components/AnimatedList.jsx', 'src/components/SpotlightCard.jsx'], ['3.7'], [],
  ['Each file has a default export with the same name as the file.']),
 ('05-data-store', 'Data store and workflow', 'All sample data and every action (approve, send back, release, undo…). This is the brain of the prototype; screens only call it.',
  ['src/v3/store.jsx'], ['7', '8', '9.1', '9.2', '9.3', '9.4'], [],
  ['Exports: `PrototypeProvider`, `useProto`, `runHref`, `STAGE_APPROVER`, `ROLE_OF`, `PERMS`.', 'The storage key is `delivery-prototype-v7`.', 'There are 8 seed runs, WI-4836 to WI-4751.']),
 ('06-theme-and-shell', 'Theme, shared UI and the app frame', 'Light/dark theme, then the shared pieces every screen uses: Avatar, Pill, Stepper, Card and the Shell (sidebar + top bar).',
  ['src/v3/theme.jsx', 'src/v3/ui.jsx', 'src/v3/protomenu.jsx'], ['4.1', '4.3', '4.4', '4.5', '4.6', '4.7', '4.24'], ['01-home.png', '29-home-dark.png'],
  ['`ui.jsx` exports `PEOPLE`, `STAGES`, `Avatar`, `Pill`, `Stepper`, `Card`, `CardHead`, `Shell`.', 'The sidebar is 248px wide and lists 6 primary items plus the Admin group.']),
 ('07-search-notifications-tour', 'Search, notifications, welcome and tour', 'The command palette (Ctrl/⌘+K), the notifications bell, the welcome dialog and the guided tour bar.',
  ['src/v3/overlays.jsx', 'src/v3/tour.jsx'], ['4.16', '4.17', '4.23'], ['26-command-palette.png', '27-notifications.png', '30-welcome.png', '31-tour-bar.png'],
  ['`overlays.jsx` exports `CommandPalette` and `Notifications`.', '`tour.jsx` exports `useSteps`, `TourBar`, `Welcome`.']),
 ('08-shared-helpers', 'Access rules, tables, form dialogs and comments', 'Four small helper files: who may decide a gate, sortable tables with paging, the modal form, and comments/activity.',
  ['src/v3/gate.jsx', 'src/v3/table.jsx', 'src/v3/forms.jsx', 'src/v3/collab.jsx'], ['4.11', '4.14', '4.21', '4.22', '7.7'], ['23-no-access.png', '28-form-dialog.png'],
  ['`gate.jsx` exports `useGate`, `NotYours`, `RequirePerm`.', '`table.jsx` exports `useTable`, `SortTh`, `Pager`.', '`forms.jsx` exports `FormDialog`, `Field`, `inputCls`.', '`collab.jsx` exports `when`, `Comments`, `Activity`.']),
 ('09-agent-panel', '"How the agent did this" panel', 'The side sheet that shows confidence, doubts, sources, checks, steps, cost, and lets the reviewer ask the agent a question.',
  ['src/v3/agentpanel.jsx'], ['4.18', '9.6'], ['24-agent-panel.png'],
  ['Exports `AgentPanelButton`.', 'Content exists for all 8 stages (0 to 7).']),
 ('10-documents', 'Document viewer, stories and the Developer Agent card', 'Every document opens in place with its storage record. Also the Stories card and the VS Code Developer Agent card used on the run page.',
  ['src/v3/docs.jsx'], ['4.19', '9.5'], ['25-document-viewer.png'],
  ['Exports: `KINDS`, `KIND_NAME`, `storiesFor`, `saveFile`, `copyText`, `useDoc`, `DocProvider`, `StoryBar`, `StoriesCard`, `DevAgentCard`.']),
 ('11-screen-home', 'Screen 1: Home', 'What is waiting for the signed-in person, their requests and recent activity.', ['src/v3/Home.jsx'], ['6.1'], ['01-home.png', '29-home-dark.png'], []),
 ('12-router-first-run', 'Router, and the first run of the app', 'The router that maps each address to a screen. To run the app before all screens exist, use the temporary version below, then replace it with the final version at step 31.',
  ['src/App.jsx'], ['5'], [], []),
 ('13-screen-new-request', 'Screen 2: New request', 'Describe a change in plain words and preview what will happen.', ['src/v3/NewRequest.jsx'], ['6.2'], ['02-new-request.png'], []),
 ('14-screen-runs-approvals', 'Screen 3: Runs and Approvals', 'Every work item in one filterable, sortable list. The same file also renders Approvals.', ['src/v3/Runs.jsx'], ['6.3'], ['03-runs.png', '04-approvals.png'], []),
 ('15-screen-run-overview', 'Screen 4: Run overview', 'Where one work item is, who holds it, what happens next, and all its documents.', ['src/v3/Run.jsx'], ['6.4'], ['05-run-overview.png', '21-run-failed.png', '22-run-release-wait.png'], []),
 ('16-screen-approve-design', 'Screen 5: Approve a design', 'Read the design in plain or technical form, accept the stated risk, then approve or request changes.', ['src/v3/Approve.jsx'], ['6.5'], ['06-approve-design.png'], []),
 ('17-screen-clarify', 'Screen 6: Answer questions', 'The agent asks; the requester picks an option for each question.', ['src/v3/Clarify.jsx'], ['6.6'], ['07-clarify.png'], []),
 ('18-screen-evidence', 'Screen 7: How the design was made', 'The full trace of the agent\'s steps, sources and record for one stage.', ['src/v3/Evidence.jsx'], ['6.7'], ['08-evidence.png'], []),
 ('19-screen-code-review', 'Screen 8: Code review (Build gate)', 'What was built, the changed files, the automatic checks, and the decision.', ['src/v3/Review.jsx'], ['6.8'], ['09-code-review.png'], []),
 ('20-screen-release', 'Screen 9: Release', 'Readiness list, release notes, release window, change ticket, hold and confirm.', ['src/v3/Release.jsx'], ['6.9'], ['10-release.png', '28-form-dialog.png'], []),
 ('21-screen-business-rules', 'Screen 10: Business rules', 'Each rule, where it is checked and where it is not.', ['src/v3/Rules.jsx'], ['6.10'], ['11-business-rules.png'], []),
 ('22-screen-artifacts', 'Screen 11: Artifacts', 'Every stored document across all work items, with versions and access history.', ['src/v3/Artifacts.jsx'], ['6.11'], ['12-artifacts.png'], []),
 ('23-screen-governance', 'Screen 12: Governance (admin)', 'Everything running, what needs an admin, where work waits.', ['src/v3/Admin.jsx'], ['6.12'], ['13-governance.png'], []),
 ('24-screen-squads', 'Screen 13: Squads (admin)', 'Who approves each stage of every work item.', ['src/v3/Squads.jsx'], ['6.13'], ['14-squads.png'], []),
 ('25-screen-squad-editor', 'Screen 14: Squad for one work item (admin)', 'Assign an approver and a backup to every gate, with live policy checks.', ['src/v3/Squad.jsx'], ['6.14'], ['15-squad-detail.png'], []),
 ('26-screen-people', 'Screen 15: People and access (admin)', 'Who can approve what, in which application, who is away, and the invite and cover forms.', ['src/v3/People.jsx'], ['6.15'], ['16-people.png'], []),
 ('27-screen-roles', 'Screen 16: Roles and permissions (admin)', 'The matrix of 9 roles against 17 permissions.', ['src/v3/Roles.jsx'], ['6.16'], ['17-roles.png', '23-no-access.png'], []),
 ('28-screen-policies', 'Screen 17: Policies (admin)', 'Approval targets, separation of duties, freezes, agent limits and spend.', ['src/v3/Policies.jsx'], ['6.17'], ['18-policies.png'], []),
 ('29-screen-connections', 'Screen 18: Connections (admin)', 'Health of the connected systems.', ['src/v3/Connections.jsx'], ['6.18'], ['19-connections.png'], []),
 ('30-screen-audit-log', 'Screen 19: Audit log (admin)', 'Every action, filterable, with a verifiable chain.', ['src/v3/Audit.jsx'], ['6.19'], ['20-audit-log.png'], []),
 ('31-final-router-and-checks', 'Final router and full acceptance check', 'Replace the temporary router with the final one, then run the whole checklist.', ['src/App.jsx'], ['10', '12', '13'], [], []),
]
ROUTE = {'Home': 'v3-home', 'NewRequest': 'v3-new', 'Runs': 'v3-runs', 'Run': 'v3-run-wi-4821', 'Approve': 'v3-approve', 'Clarify': 'v3-clarify', 'Evidence': 'v3-evidence', 'Review': 'v3-review', 'Release': 'v3-release', 'Rules': 'v3-rules', 'Artifacts': 'v3-artifacts', 'Admin': 'v3-admin', 'Squads': 'v3-squads', 'Squad': 'v3-squad-wi-4836', 'People': 'v3-people', 'Roles': 'v3-roles', 'Policies': 'v3-policies', 'Connections': 'v3-connections', 'Audit': 'v3-audit'}
VIEWAS = {'Clarify': 'Priya Nair', 'Release': 'Sam Okafor', 'Admin': 'Dana Whitfield', 'Squads': 'Dana Whitfield', 'Squad': 'Dana Whitfield', 'People': 'Dana Whitfield', 'Roles': 'Dana Whitfield', 'Policies': 'Dana Whitfield', 'Connections': 'Dana Whitfield', 'Audit': 'Dana Whitfield', 'Artifacts': 'Dana Whitfield'}
TEMP_APP = open(os.path.join(H, 'temp-App.jsx')).read().rstrip('\n')
index = []
for n, (slug, title, goal, files, secs, shots, checks) in enumerate(STEPS, 1):
    is_screen = slug[3:].startswith('screen-'); name = files[0].split('/')[-1][:-4] if is_screen else None
    o = [f'# Step {n} of {len(STEPS)}: {title}', '', goal, '']
    o += ['## What to tell Copilot', '', 'Open this file in the editor, then paste this into Copilot Chat (Agent or Edit mode):', '', '```text']
    if slug == '12-router-first-run':
        o += ['Using #file:12-router-first-run.md, create src/App.jsx with exactly the code under "Temporary router".', 'Do not add imports for screens that do not exist yet. Then run `npm run dev` and tell me the URL.']
    elif slug == '31-final-router-and-checks':
        o += ['Using #file:31-final-router-and-checks.md, replace src/App.jsx with exactly the code in the file section.', 'Then run `npm run build` and `npm run lint` and report any error without changing other files.']
    else:
        o += [f'Using #file:{slug}.md, create ' + (f'{len(files)} files' if len(files) > 1 else 'the file') + ' exactly as given in the "Files" section: ' + ', '.join(files) + '.',
              'Copy the code character for character. Do not rename, reformat, shorten, "improve" or convert to TypeScript.', 'Do not leave placeholders such as "// rest of the code". When done, list the files you created with their line counts.']
        if is_screen and name != 'Home': o += [f'Then add the route for this screen in src/App.jsx as described under "Wire it into the router".']
    o += ['```', '']
    if shots:
        o += ['## What it should look like', '', 'Reference screenshots (1440 × 900):', ''] + [f'- `../screens/{s}`' for s in shots] + ['']
        o += [f'![{shots[0]}](../screens/{shots[0]})', '']
    if slug == '12-router-first-run':
        o += ['## Temporary router', '', 'This version only knows Home, so the app can run now. Each screen step tells you which two lines to add.', '', f'### File: `src/App.jsx` (temporary)\n\n{F}jsx\n{TEMP_APP}\n{F}\n',
              '## Check before the next step', '', '- [ ] `npm run dev` starts and the browser shows the Welcome dialog, then Home as Alex Kim with "2 decisions are waiting for you".', '- [ ] The sidebar, top bar, search (Ctrl/⌘+K), bell and theme toggle work.', '- [ ] "View as" switches person. Links to screens you have not built yet show "This page does not exist" for now.', '', '## Specification', '', sec('5'), '']
    else:
        o += ['## Files', '', f'Create {"these files" if len(files) > 1 else "this file"} with **exactly** this content.', '']
        for f in files: o += [code(f)]
        if name == 'Home':
            o += ['## Check', '', 'Home cannot be opened yet: the router arrives in the next step, and the check for Home is there.', '']
        elif is_screen:
            comp = 'V3' + {'NewRequest': 'New'}.get(name, name)
            o += ['## Wire it into the router', '', 'If you are using the temporary router from step 12, add these two lines to `src/App.jsx` (the final router in step 31 already has them):', '',
                  '```jsx', f"import {comp} from '@/v3/{name}';   // with the other imports"]
            key = {'Run': 'v3-run', 'Squad': 'v3-squad'}.get(name, ROUTE[name])
            o += [f"  '{key}': {comp},                 // inside ROUTES"]
            if name == 'Runs': o += ["  'v3-approvals': () => <V3Runs approvals />,   // inside ROUTES"]
            o += ['```', '']
            o += ['## Check before the next step', '', f'- [ ] Open `#{ROUTE[name]}`' + (f' with **View as → {VIEWAS[name]}**' if name in VIEWAS else ' as Alex Kim') + f'. It matches `../screens/{shots[0]}`.',
                  '- [ ] Every button and link on the screen does what the specification below says.', '- [ ] Switch the theme to dark: nothing is unreadable and no white boxes remain.', '- [ ] No errors in the browser console.', '']
        elif checks:
            o += ['## Check before the next step', ''] + [f'- [ ] {c}' for c in checks] + ['']
        if slug == '31-final-router-and-checks':
            o += ['## Check: the whole product', '', 'Work through §12 below. Every box must be ticked.', '']
        o += ['## Specification', '', 'This explains what the code above does, in words. If you later change the screen, keep to these rules.', '']
        for s in secs: o += [sec(s), '']
    txt = '\n'.join(o).rstrip() + '\n'
    open(os.path.join(KIT, slug + '.md'), 'w').write(txt)
    index.append((n, slug, title, files, len(txt)))
# START HERE
o = ['# Build kit: start here', '',
     'This kit rebuilds the Unified Product Delivery Platform UI exactly as shown in the stakeholder video: 19 screens, light and dark mode, all dialogs and panels.', '',
     '## Two ways to use it', '',
     '### Option A (recommended): start from the working project', '',
     'The folder `../starter/` is the complete, working product. Nothing needs to be generated.', '',
     '```bash', 'cd starter', 'npm install', 'npm run dev        # open the printed address; it lands on #v3-home', '```', '',
     'Use Copilot only to **change or extend** it. The file `starter/.github/copilot-instructions.md` gives Copilot the project rules automatically.', '',
     '### Option B: rebuild it step by step with Copilot', '',
     'Use this when the code must be created inside another repository. There are 31 steps. Each step is one file in this folder with the complete code for that step, a prompt to paste into Copilot, a screenshot, and a check.', '',
     '**Why steps:** Copilot cannot hold the whole product in one request. One screen per request fits, and you check each one before moving on.', '',
     '**Rules for every step**', '',
     '1. Do the steps in order. Do not skip the checks.', '2. Give Copilot one step file at a time (attach it with `#file:` or open it and reference it).', '3. Ask Copilot to copy the code exactly. If it shortens a file or writes "rest of the code here", reject the result and ask again for that file only.',
     '4. Compare each file\'s line count with the count printed in the step file.', '5. The app first runs at step 12. From then on, check each screen in the browser against its screenshot in `../screens/`.', '',
     '## The steps', '', '| Step | File | What it builds | Code files |', '|---|---|---|---|']
for n, slug, title, files, size in index:
    o.append(f'| {n} | `{slug}.md` | {title} | {", ".join("`" + f.split("/")[-1] + "`" for f in files)} |')
o += ['', '## Screen list', '', '| Address | Screen | Step | View as | Screenshot |', '|---|---|---|---|---|']
for n, slug, title, files, size in index:
    if slug[3:].startswith('screen-'):
        name = files[0].split('/')[-1][:-4]; shot = [s for s in STEPS[n-1][5]][0]
        o.append(f'| `#{ROUTE[name]}` | {title.split(": ", 1)[1]} | {n} | {VIEWAS.get(name, "Alex Kim")} | `{shot}` |')
        if name == 'Runs': o.append(f'| `#v3-approvals` | Approvals | {n} | Alex Kim | `04-approvals.png` |')
o += ['', '## Other files', '', '- `../UI-BUILD-SPEC.md`: the full written specification (styles, components, workflow, roles, data, phased plan, acceptance checklist). Each step file includes the parts it needs.', '- `../screens/`: 31 reference screenshots.', '- `../starter/`: the working project (Option A).', '',
      '## If something looks wrong', '', '| Symptom | Likely cause | Fix |', '|---|---|---|',
      '| Plain unstyled page | `src/index.css` not imported or Tailwind plugin missing | Check `src/main.jsx` imports `./index.css` and `vite.config.js` has `tailwindcss()` |',
      '| Colours missing, boxes transparent | A token name was changed | Re-copy `src/index.css` from step 2 |',
      '| "Cannot find module @/…" | Alias missing | Check `vite.config.js` and `jsconfig.json` from step 1 |',
      '| A screen is half built | Copilot shortened the file | Compare the line count; re-do that one file |',
      '| White page with an error about `useProto` | Providers missing | Re-copy `src/main.jsx` from step 1 |',
      '| Fonts look different | Font packages not installed | `npm install` again; check the `@fontsource` imports at the top of `index.css` |', '']
open(os.path.join(KIT, '00-START-HERE.md'), 'w').write('\n'.join(o))
for n, slug, title, files, size in index: print(f'{n:2d} {slug:34s} {size/1024:6.1f} KB')
