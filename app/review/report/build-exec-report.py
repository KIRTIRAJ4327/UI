#!/usr/bin/env python3
"""Builds ai-delivery-approaches.html (executive report). Charts are inline SVG built here so the PDF needs no script."""
import html, os
HERE = os.path.dirname(os.path.abspath(__file__))
esc = html.escape

# ---------- evidence labels ----------
S = '<span class="ev s">Read in source</span>'
X = '<span class="ev x">Published summary</span>'
V = '<span class="ev v">Vendor claim</span>'
J = '<span class="ev j">Our judgement</span>'
R = '<span class="ev p">Reference design</span>'

# ---------- chart helpers ----------
def bars(rows, mx, unit='%', lab=290, w=740, bar_h=22, gap=14, prefix=''):
    """rows: (label, value, colour var, source)"""
    h = len(rows) * (bar_h + gap) + 8
    pw = w - lab - (200 if any(r[3] for r in rows) else 60)
    o = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="Bar chart">']
    for i, (l, v, c, src) in enumerate(rows):
        y = i * (bar_h + gap) + 4
        bw = max(3, pw * v / mx)
        o.append(f'<text x="{lab-12}" y="{y+bar_h/2+4.5}" text-anchor="end" class="lb">{esc(l)}</text>')
        o.append(f'<path d="M{lab},{y} h{bw-4} a4,4 0 0 1 4,4 v{bar_h-8} a4,4 0 0 1 -4,4 h-{bw-4} z" fill="var(--{c})"/>')
        o.append(f'<text x="{lab+bw+8}" y="{y+bar_h/2+4.5}" class="lb b">{prefix}{v:g}{unit}</text>')
        o.append(f'<text x="{w}" y="{y+bar_h/2+4.5}" text-anchor="end" class="tk">{esc(src)}</text>')
    o.append('</svg>')
    return ''.join(o)

COLS = ['Spec Kit|core', 'Spec Kit|+ add-ons', 'AWS|AI-DLC', 'GitHub|Agent HQ', 'GitLab|Duo', 'Atlassian|Rovo',
        'Service-|Now', 'Harness', 'Thought-|works', 'Reference|design']
KIND = ['t', 't', 't', 'p', 'p', 'p', 'p', 'p', 'p', 'r']
N = None
ROWS = [
    ('Scope of the lifecycle', None),
    ('Written requirement before code', [3, 3, 3, 1, 2, 2, 1, 0, 3, 3]),
    ('Design and impact analysis',      [2, 2, 3, 1, 1, 1, 1, 1, N, 3]),
    ('Code written by an agent',        [3, 3, 3, 3, 3, 3, 2, 1, 3, 2]),
    ('Verification and test gates',     [2, 3, 3, 2, 3, 1, 2, 3, 2, 2]),
    ('Release, deploy and rollback',    [0, 1, 2, 2, 3, 1, 3, 3, N, 3]),
    ('Depth of governance', None),
    ('Human approval gates',            [1, 3, 3, 2, 2, 3, 3, 3, N, 3]),
    ('Named roles, separation of duties', [0, 2, 0, 2, 2, 3, 3, 3, N, 3]),
    ('Central audit trail',             [0, 2, 2, 2, 2, 3, 3, 3, 2, 3]),
    ('Usable by non-developers',        [0, 1, 0, 1, 1, 3, 3, 1, N, 3]),
    ('Practicalities', None),
    ('Work across several repositories', [0, 2, N, 2, 2, 2, 1, 2, N, 2]),
    ('Choice of agent and model',       [3, 3, 3, 3, 3, 2, 2, 2, N, 1]),
    ('In production use today',         [3, 2, 3, 2, 3, 3, 2, 3, 2, 0]),
]

def heat(w=800, lab=222):
    cw = (w - lab) / len(COLS); ch = 30; top = 46
    n = len(ROWS); h = top + n * ch + 6
    op = {0: 0.0, 1: 0.22, 2: 0.52, 3: 0.92}
    o = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="Capability matrix, scored 0 to 3">']
    for j, c in enumerate(COLS):
        x = lab + j * cw + cw / 2
        parts = c.split('|')
        for k, p in enumerate(parts):
            o.append(f'<text x="{x}" y="{16 + k*14 + (7 if len(parts)==1 else 0)}" text-anchor="middle" class="tk b" style="fill:var(--ink2)">{esc(p)}</text>')
    y = top
    for name, vals in ROWS:
        if vals is None:
            o.append(f'<text x="0" y="{y+20}" class="lb b" style="fill:var(--accent)">{esc(name)}</text>')
            y += ch; continue
        o.append(f'<text x="{lab-12}" y="{y+ch/2+4}" text-anchor="end" class="lb">{esc(name)}</text>')
        for j, v in enumerate(vals):
            x = lab + j * cw
            if v is None:
                o.append(f'<rect x="{x+1}" y="{y+1}" width="{cw-2}" height="{ch-2}" rx="4" fill="none" stroke="var(--line)" stroke-dasharray="3 3"/>')
                o.append(f'<text x="{x+cw/2}" y="{y+ch/2+4}" text-anchor="middle" class="tk">?</text>')
                continue
            o.append(f'<rect x="{x+1}" y="{y+1}" width="{cw-2}" height="{ch-2}" rx="4" fill="var(--sunken)"/>')
            if v:
                o.append(f'<rect x="{x+1}" y="{y+1}" width="{cw-2}" height="{ch-2}" rx="4" fill="var(--c1)" fill-opacity="{op[v]}"/>')
            col = '#fff' if v == 3 else 'var(--ink)'
            o.append(f'<text x="{x+cw/2}" y="{y+ch/2+4.5}" text-anchor="middle" class="lb b" style="fill:{col}">{v}</text>')
        y += ch
    o.append('</svg>')
    return ''.join(o)

def mean(idx, j):
    vs = [ROWS[i][1][j] for i in idx if ROWS[i][1][j] is not None]
    return sum(vs) / len(vs)

def scatter(w=760, h=450):
    L, T, PW, PH = 70, 26, w - 170, h - 86
    X = lambda v: L + PW * v / 3; Y = lambda v: T + PH * (1 - v / 3)
    o = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="Positioning chart: lifecycle scope against governance depth">']
    o.append(f'<rect x="{X(1.5)}" y="{T}" width="{PW/2}" height="{PH/2}" fill="var(--band)" opacity=".55"/>')
    for v in (0, 1, 2, 3):
        o.append(f'<line x1="{X(v)}" y1="{T}" x2="{X(v)}" y2="{T+PH}" stroke="var(--grid)"/><line x1="{L}" y1="{Y(v)}" x2="{L+PW}" y2="{Y(v)}" stroke="var(--grid)"/>')
        o.append(f'<text x="{X(v)}" y="{T+PH+18}" text-anchor="middle" class="tk">{v}</text><text x="{L-10}" y="{Y(v)+4}" text-anchor="end" class="tk">{v}</text>')
    o.append(f'<text x="{L+PW/2}" y="{h-12}" text-anchor="middle" class="lb">Scope of the lifecycle covered (average of five rows)</text>')
    o.append(f'<text transform="translate(18,{T+PH/2}) rotate(-90)" text-anchor="middle" class="lb">Depth of governance (average of four rows)</text>')
    o.append(f'<text x="{L+PW-8}" y="{T+PH/2-10}" text-anchor="end" class="tk b" style="fill:var(--accent)">Broad scope, deep governance</text>')
    off = {0: (10, 4), 1: (-11, 4, 'end'), 2: (-11, 4, 'end'), 3: (-11, 4, 'end'), 4: (11, 4), 5: (-11, 4, 'end'), 6: (10, 18), 7: (11, 4), 8: (0, -13, 'middle'), 9: (11, 4)}
    fill = {'t': 'var(--c2)', 'p': 'var(--c1)', 'r': 'var(--c3)'}
    pts = []
    for j, c in enumerate(COLS):
        x, y = mean([1, 2, 3, 4, 5], j), mean([7, 8, 9, 10], j)
        pts.append((c, x, y))
        d = off[j]; anc = d[2] if len(d) > 2 else 'start'
        o.append(f'<circle cx="{X(x)}" cy="{Y(y)}" r="7" fill="{fill[KIND[j]]}" stroke="var(--surface)" stroke-width="2"/>')
        name = c.replace('|', ' ').replace('- ', '')
        if j == 8: name += ' *'
        o.append(f'<text x="{X(x)+d[0]}" y="{Y(y)+d[1]}" text-anchor="{anc}" class="lb">{esc(name)}</text>')
    o.append('</svg>')
    return ''.join(o), pts

def flow(w=820):
    def strip(y, title, sub, steps, colour, marks):
        n = len(steps); gap = 8; x0 = 0; bw = (w - gap * (n - 1)) / n
        s = [f'<text x="0" y="{y}" class="lb b">{esc(title)}</text><text x="0" y="{y+17}" class="tk">{esc(sub)}</text>']
        for i, st in enumerate(steps):
            x = x0 + i * (bw + gap)
            s.append(f'<rect x="{x}" y="{y+28}" width="{bw}" height="34" rx="8" fill="var(--surface)" stroke="var(--{colour})" stroke-width="1.5"/>')
            s.append(f'<text x="{x+bw/2}" y="{y+50}" text-anchor="middle" class="lb b">{esc(st)}</text>')
            m = marks[i]
            if m:
                s.append(f'<circle cx="{x+bw/2-len(m)*3.1-9}" cy="{y+78}" r="4" fill="var(--{colour})"/><text x="{x+bw/2+4}" y="{y+82}" text-anchor="middle" class="tk">{esc(m)}</text>')
        return ''.join(s)
    o = [f'<svg viewBox="0 0 {w} 232" role="img" aria-label="Two delivery flows compared">']
    o.append(strip(14, 'Spec-driven toolkit', 'Runs in the repository and the agent chat. One developer drives every step.',
                   ['Rules', 'Specify', 'Plan', 'Tasks', 'Implement', 'Converge'], 'c2',
                   ['', 'developer', 'developer', '', 'developer', 'developer']))
    o.append(strip(130, 'Governed delivery platform', 'Runs in a shared system of record. A named role approves each stage.',
                   ['Plan', 'Specify', 'Impact', 'Design', 'Build', 'Integrate', 'Validate', 'Release'], 'c1',
                   ['product owner', 'product owner', 'architect', 'architect', 'eng. lead', 'integration', 'quality', 'release mgr']))
    o.append('</svg>')
    return ''.join(o)

def layers(w=760):
    L = [('3', 'Governed delivery platforms', 'Decide who may approve, record what happened, and control release.',
          'GitHub Agent HQ · GitLab Duo Agent Platform · Atlassian Rovo and Jira agents|ServiceNow · Harness · IBM Bob · Thoughtworks AI/works', 'c1'),
         ('2', 'Spec-driven toolkits', 'Make the agent work from a written requirement, plan and task list.',
          'GitHub Spec Kit · AWS AI-DLC · OpenSpec · BMad Method · Kiro specs', 'c2'),
         ('1', 'Coding agents', 'Write and change the code.',
          'Claude Code · Cursor · GitHub Copilot · OpenAI Codex · Kiro · Devin · Gemini', 'c3')]
    bh = 104; o = [f'<svg viewBox="0 0 {w} {len(L)*(bh+10)}" role="img" aria-label="Three layers of AI-driven software delivery">']
    for i, (n, t, d, p, c) in enumerate(L):
        y = i * (bh + 10)
        o.append(f'<rect x="0" y="{y}" width="{w}" height="{bh}" rx="12" fill="var(--surface)" stroke="var(--line)"/>')
        o.append(f'<rect x="0" y="{y}" width="8" height="{bh}" rx="4" fill="var(--{c})"/>')
        o.append(f'<text x="28" y="{y+28}" class="lb b" style="font-size:16px">Layer {n}: {esc(t)}</text>')
        o.append(f'<text x="28" y="{y+49}" class="lb" style="fill:var(--ink2)">{esc(d)}</text>')
        for k, line in enumerate(p.split('|')):
            o.append(f'<text x="28" y="{y+72+k*17}" class="tk" style="font-size:12.5px">{esc(line)}</text>')
    o.append('</svg>')
    return ''.join(o)

sc_svg, pts = scatter()

def legend(items):
    return '<div class="lg">' + ''.join(f'<span><i style="background:var(--{c})"></i>{esc(t)}</span>' for c, t in items) + '</div>'

head = open(os.path.join(HERE, 'ai-delivery-report.html')).read().split('<div class="wrap">')[0]
head = head.replace('<title>AI Delivery Report</title>', '<title>AI Delivery Approaches</title>')
head = head.replace('</style>', '''.ev{font-size:11.5px;font-weight:600;border-radius:999px;padding:1px 8px;white-space:nowrap}
.ev.s{background:var(--band);color:var(--accent)}.ev.x,.ev.j{background:var(--sunken);color:var(--ink2)}.ev.v,.ev.p{background:var(--warn-bg);color:var(--ink2);border:1px solid var(--warn-line)}
td code,li code,p code{font-size:.92em;background:var(--sunken);padding:1px 5px;border-radius:5px}
.big{font:600 20px/1.35 var(--display);max-width:60ch}.num{display:grid;grid-template-columns:34px 1fr;gap:6px 12px;align-items:start}
.num b.n{font:600 15px/26px var(--display);width:26px;height:26px;border-radius:50%;background:var(--accent);color:var(--surface);text-align:center}
.num p{max-width:68ch}.sw{display:inline-block;width:22px;height:14px;border-radius:3px;vertical-align:-2px;margin-right:6px;background:var(--sunken);position:relative;overflow:hidden}
.two{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:6px}.two span{font-size:14.5px;color:var(--ink2)}
.sw i{position:absolute;inset:0;background:var(--c1)}
</style>''')

body = f'''<div class="wrap">
<header><div class="eyebrow">Executive report · 13 November 2026</div>
<h1>AI-driven software delivery: specifications or governance?</h1>
<p class="lede" style="margin-top:12px">Two ways to put AI agents to work on real software changes, what each one does, who sells it, and how to choose. Written for technology and business leaders in regulated organisations.</p></header>
<nav class="toc" aria-label="Contents"><a href="#summary">Summary</a><a href="#why">1 Why this matters</a><a href="#map">2 The market</a><a href="#sdd">3 Spec-driven toolkits</a><a href="#gov">4 Governed platforms</a><a href="#compare">5 Comparison</a><a href="#reason">6 Reasoning</a><a href="#do">7 What to do</a><a href="#method">Method and sources</a></nav>

<div class="note"><b>How to read the evidence.</b> Each fact carries a label. {S} we read it in the tool's public source code on 13 November 2026. {X} it comes from a published summary of a study or news report; we did not open the original. {V} the vendor says so, and nobody independent has confirmed it. {R} it is true of a governed delivery console we designed and prototyped; that prototype runs on demo data. {J} our own conclusion.</div>

<section id="summary"><h2>Summary</h2>
<p class="big" style="margin-top:12px">AI now writes code faster than organisations can review, approve and release it. The two approaches in this report attack that problem from opposite ends, and most large organisations will need both.</p>
<div class="num" style="margin-top:18px">
<b class="n">1</b><p><b>Spec-driven toolkits control what the agent is asked to build.</b> The team writes the requirement, plan and tasks before any code. The leading toolkits are free, open source and mature: GitHub Spec Kit is at version 1.4 and AWS AI-DLC at 2.11. {S}</p>
<b class="n">2</b><p><b>Governed delivery platforms control who approves the work and what is released.</b> Every large delivery vendor shipped or announced one in 2026: GitHub, GitLab, Atlassian, ServiceNow, Harness, IBM and Thoughtworks. {V}</p>
<b class="n">3</b><p><b>The two are converging.</b> Toolkits are adding approval gates and audit trails. Platforms are adding planning and specification agents. {S} {V}</p>
<b class="n">4</b><p><b>Neither has independent proof of better outcomes yet.</b> The largest study of written specifications found no effect on defects. Platform results are vendor-reported. {X}</p>
<b class="n">5</b><p><b>Our advice: adopt a toolkit now, put governance in the system of record you already own, and build custom only for what vendors do not cover.</b> Today that gap is the experience for business approvers and one evidence record across tools. {J}</p>
</div></section>

<section id="why"><div class="eyebrow">Section 1</div><h2>Why this matters: the constraint has moved</h2>
<p style="margin-top:10px">For two years the question was whether AI could write useful code. That is settled. The new constraint is everything that happens after the code is written.</p>
<div class="panel keep" style="margin-top:14px"><h3>More code is produced, and review takes longer</h3>
{legend([('c1', 'Output'), ('c2', 'Review burden')])}
{bars([('Code produced per firm', 30, 'c1', 'Harvard working paper, 718 firms'), ('Pull requests merged, high-adoption teams', 98, 'c1', 'Faros AI, 10,000 developers'), ('Time from submission to approval', 56, 'c2', 'Harvard / Jellyfish, 655 firms'), ('Pull request review time', 91, 'c2', 'Faros AI, 10,000 developers')], 110, unit='%', prefix='+')}
<p class="src">Change associated with AI adoption. {X} Two versions of the Harvard paper report 49% and 56% for approval time; we show the later one.</p></div>
<div class="grid2" style="margin-top:16px">
<div class="panel"><h3>Developers use AI but do not trust it with decisions</h3>
{bars([('Use AI assistants or agents', 66, 'c1', ''), ('Trust it only when easy to verify', 48, 'c1', ''), ('Trust it for important decisions', 7, 'c2', '')], 100, lab=210, w=400)}
<p class="src">Stack Overflow Developer Survey 2026. {X}</p></div>
<div class="panel"><h3>When review cannot keep up, it gets skipped</h3>
<div class="two"><div><b style="display:block;font:600 34px/1.1 var(--display);color:var(--accent)">48%</b><span>of merged changes were reviewed before a company-wide AI mandate</span></div><div><b style="display:block;font:600 34px/1.1 var(--display);color:var(--c2)">21%</b><span>were reviewed afterwards</span></div></div>
<p class="src">One enterprise, studied over time (arXiv 2607.01904). {X}</p></div></div>
<ul style="margin-top:14px">
<li><b>Delivery stability falls as AI use rises.</b> Google's DORA research links AI adoption to higher throughput and also to more instability. {X}</li>
<li><b>Returns are not yet visible.</b> McKinsey's 2026 survey reports that 80% of workers see productivity gains, but only 6% of organisations attribute significant earnings to AI. {X}</li>
<li><b>So the value is no longer in generating code.</b> It is in making sure the right thing is built, checked and released under control. That is what both approaches in this report try to do. {J}</li></ul></section>

<section id="map"><div class="eyebrow">Section 2</div><h2>The market in three layers</h2>
<p style="margin-top:10px">AI-driven software delivery is easier to understand as three layers. Each layer depends on the one below it. This report compares layers 2 and 3.</p>
<div class="panel keep" style="margin-top:14px">{layers()}</div>
<ul style="margin-top:14px">
<li><b>Layer 1 is a settled, crowded market.</b> Gartner's first Magic Quadrant for Enterprise AI Coding Agents (May 2026) names Anthropic, Cursor, GitHub and OpenAI as Leaders, with AWS, Google, Alibaba Cloud and Cognition as Challengers. {X}</li>
<li><b>Layer 2 is open source and moving fast.</b> All four toolkits we read had commits in the two days before this report. {S}</li>
<li><b>Layer 3 is where the large vendors are now competing.</b> Each one extends the system of record it already owns: repository, tracker, service desk or pipeline. {J}</li>
</ul></section>

<section id="sdd"><div class="eyebrow">Section 3</div><h2>Approach A: spec-driven toolkits</h2>
<p style="margin-top:10px">In spec-driven development the team writes down what to build and why before the agent writes code. The requirement, the plan and the task list are text files kept in the repository beside the code. The agent is told to work from those files and nothing else.</p>

<h3 style="margin-top:20px">The leading toolkits</h3>
<div class="panel scroll"><div><table>
<tr><th>Toolkit</th><th>Owner and licence</th><th>Version read</th><th>What stands out</th></tr>
<tr><td><b>GitHub Spec Kit</b></td><td>GitHub; MIT; free</td><td>1.4.0, 10 Nov 2026</td><td>Drives 43 coding agents. 198 community extensions and 42 presets. Workflows with human review gates. Private catalogs for approved add-ons</td></tr>
<tr><td><b>AWS AI-DLC</b></td><td>AWS Labs; MIT-0; free</td><td>2.11.4, 13 Nov 2026</td><td>5 phases and 33 stages from idea to operation. 14 agents. 11 workflow profiles, from "Express" (7 stages) to "Enterprise" (30). Approval gates and a 134-event audit trail</td></tr>
<tr><td><b>OpenSpec</b></td><td>Fission AI; MIT; free</td><td>2.0.0, 11 Nov 2026</td><td>Lightweight. Describes each change as a proposal against existing behaviour, so it suits existing systems</td></tr>
<tr><td><b>BMad Method</b></td><td>Community; MIT; free</td><td>6.12 stable, 12 Nov 2026</td><td>Agile framing with role-based agents. Sizes the process to the change</td></tr>
<tr><td><b>Kiro specs</b></td><td>AWS; commercial</td><td>Not read</td><td>Built into the Kiro editor. Requirements, design and tasks, each approved by the developer. Enterprise sign-on and policy controls</td></tr>
</table></div><p class="src">Rows 1 to 4 {S}. Kiro {X}.</p></div>

<h3 style="margin-top:20px">How a change moves through Spec Kit</h3>
<div class="panel scroll"><div><table>
<tr><th>Step</th><th>What the developer runs</th><th>What it produces</th></tr>
<tr><td>Once</td><td><code>constitution</code></td><td>The project's standing rules</td></tr>
<tr><td>1</td><td><code>specify</code>, then optional <code>clarify</code></td><td>The specification: what and why</td></tr>
<tr><td>2</td><td><code>plan</code></td><td>The technical approach</td></tr>
<tr><td>3</td><td><code>tasks</code>, then optional <code>analyze</code></td><td>The task list, and a report of inconsistencies</td></tr>
<tr><td>4</td><td><code>implement</code></td><td>Code and tests</td></tr>
<tr><td>5</td><td><code>converge</code></td><td>A check of the code against the specification. Unbuilt work is added as new tasks</td></tr>
</table></div><p class="src">{S} It also ships separate, shorter processes for bug fixing and for assessing an idea.</p></div>

<div class="grid2" style="margin-top:16px">
<div class="panel"><h3>What it does well</h3><ul>
<li><b>Free and available now.</b> No procurement.</li>
<li><b>No lock-in.</b> Works with almost any coding agent.</li>
<li><b>Fits how developers work.</b> Everything is in the repository and versioned by Git.</li>
<li><b>Adaptable.</b> Presets, extensions and workflows let a team shape the process.</li>
<li><b>Community add-ons fill gaps.</b> Multi-repository dispatch, Azure DevOps with human sign-off, Jira and Linear sync all exist.</li>
</ul><p class="src">{S}</p></div>
<div class="panel"><h3>Where it falls short</h3><ul>
<li><b>Built for developers only.</b> No screen for a product owner, release manager or auditor.</li>
<li><b>Approval has no identity in the core.</b> A gate is a prompt in a terminal. AWS AI-DLC's gates are "not assigned to any specific role", one reviewer notes.</li>
<li><b>Documents drift from code.</b> Spec Kit's core has "no dedicated command" to reconcile them.</li>
<li><b>Add-ons are unvetted.</b> Maintainers "do not review, audit, endorse, or support" community code.</li>
<li><b>Stops before release.</b> Deployment and rollback are left to other tools.</li>
<li><b>Heavy for small changes.</b> Thoughtworks' Technology Radar reports "verbose markdown" and "instruction bloat", and rates Spec Kit "Assess", not "Adopt".</li>
</ul><p class="src">{S} for the quoted Spec Kit text; {X} for the reviewer and Thoughtworks.</p></div></div>

<h3 style="margin-top:20px">Does it improve outcomes?</h3>
<div class="panel scroll"><div><table>
<tr><th>Study</th><th>Finding</th><th>Weight to give it</th></tr>
<tr><td>Hill, ESEM 2026. 88,052 pull requests, 119 open-source projects</td><td>Specification quality predicted neither defects (p = 0.164) nor rework (p = 0.860)</td><td>Peer reviewed. But it measured ordinary specifications, mostly links to issues. No project in the sample used a spec-driven toolkit</td></tr>
<tr><td>Uvik benchmark, 2026. 50 tickets</td><td>0.46 defects per merged ticket with a spec workflow, 0.86 without</td><td>Vendor-produced and small</td></tr>
<tr><td>Farrag, arXiv 2605.01160</td><td>Argues that specification discipline, not model capability, is the binding constraint on dependable AI-written software</td><td>A review and a three-team pilot, not a controlled trial</td></tr>
<tr><td>OrangeLoops case study, 2026</td><td>Code generation was much faster. Stabilising, integration and review still took four days</td><td>One project</td></tr>
</table></div><p class="src">All {X}. No independent study has yet isolated the effect of a spec-driven toolkit on defects or delivery time.</p></div>
</section>

<section id="gov"><div class="eyebrow">Section 4</div><h2>Approach B: governed delivery platforms</h2>
<p style="margin-top:10px">A governed delivery platform treats an AI agent like a new member of staff inside an existing control framework. The agent may do the work, but a named person approves each important step, the approval is recorded, and release is controlled by policy.</p>

<h3 style="margin-top:20px">A reference design</h3>
<p>To make the category concrete we use a governed delivery console that we designed and prototyped. It is a design, not a product. It shows the full pattern in one place.</p>
<div class="panel keep" style="margin-top:12px">{flow()}
<p class="src">Dots show who approves. {S} for the toolkit flow; {R} for the platform flow.</p></div>
<div class="panel scroll" style="margin-top:14px"><div><table>
<tr><th>Element</th><th>In the reference design</th></tr>
<tr><td>Stages</td><td>Eight, from plan to release, with a named approver and a backup for each</td></tr>
<tr><td>Roles</td><td>Nine roles against seventeen permissions. A requester cannot approve their own plan</td></tr>
<tr><td>Evidence</td><td>Every document is versioned and fingerprinted. One audit log covers decisions, access and permission changes</td></tr>
<tr><td>Explanation</td><td>Each approval screen shows how the agent reached its output: sources, checks, confidence and open doubts</td></tr>
<tr><td>Build</td><td>Handed to a separate coding agent in the developer's editor</td></tr>
<tr><td>Release</td><td>Scheduling, freeze windows, hold with a recorded reason, and rollback</td></tr>
<tr><td>Limits</td><td>A prototype on demo data. One fixed workflow for every size of change. A manual hand-off to the coding agent. One tool ecosystem</td></tr>
</table></div><p class="src">{R}</p></div>

<h3 style="margin-top:20px">Enterprise products that follow this pattern</h3>
<div class="panel scroll"><div><table>
<tr><th>Vendor and product</th><th>Status</th><th>How it governs agents</th><th>Starts from</th></tr>
<tr><td><b>GitHub</b> Agent HQ, with Copilot coding agent</td><td>Announced late 2025. Governance controls reported in public preview</td><td>One "mission control" for agents from Anthropic, OpenAI, Google, Cognition and xAI. Admin policies, audit logging, agent identity, limits on which branches agents may change</td><td>The repository</td></tr>
<tr><td><b>Microsoft</b> Azure Boards with Copilot coding agent</td><td>Generally available</td><td>A work item is assigned to the agent, which opens a pull request. Custom agents and model selection. Microsoft advises moving repositories to GitHub for the full experience</td><td>The work tracker</td></tr>
<tr><td><b>GitLab</b> Duo Agent Platform</td><td>Generally available since 15 Jan 2026</td><td>Planner and Security Analyst agents, plus external agents such as Claude Code and Codex. Flows run as pipeline jobs under an identity that never exceeds the triggering person's access</td><td>The repository and pipeline</td></tr>
<tr><td><b>Atlassian</b> Rovo Studio, agents in Jira, Rovo Dev</td><td>Generally available, 2026</td><td>Agents are assigned work items and act within Jira's existing permissions and approval workflows. Roles, approvals, versioning and audit controls. Agent changes land in the same history as human work</td><td>The work tracker</td></tr>
<tr><td><b>ServiceNow</b> Build Agent, App Engine Management Center, AI Control Tower</td><td>Build Agent generally available. Expanded Control Tower due August 2026</td><td>Deployment approvals, release management and lifecycle governance. Control Tower discovers, observes and can stop any agent acting outside its permissions</td><td>The service desk and change record</td></tr>
<tr><td><b>Harness</b> Autonomous Worker Agents, Agent DLC</td><td>Launched mid-2026</td><td>The same policy-as-code, access roles, approvals and change windows that gate human deployments also gate agents. Approvals can be triggered by risk, not applied to everything</td><td>The delivery pipeline</td></tr>
<tr><td><b>IBM</b> Bob</td><td>Generally available since 28 Apr 2026</td><td>Role-based agents across planning, design, coding, testing and deployment. Policy enforcement and human-in-the-loop controls. IBM reports 80,000 internal users</td><td>The developer's editor</td></tr>
<tr><td><b>Thoughtworks</b> AI/works on Agent/works</td><td>Launched Jan 2026. Version 2.0 in Aug 2026</td><td>Legacy analysis, requirements, specification generation, code and tests in one platform. A "Knowledge Fabric" of enterprise context. Runs on a governed agent control plane</td><td>A consulting engagement</td></tr>
<tr><td><b>AWS</b> Kiro autonomous agent and frontier agents</td><td>Preview</td><td>Agents work in sandboxes and open pull requests for people to review. Also publishes the open-source AI-DLC method described in Section 3</td><td>The cloud account</td></tr>
<tr><td><b>Cognition</b> Devin Enterprise</td><td>Generally available</td><td>Single sign-on, audit logs, private deployment. Named users include Goldman Sachs and Citi</td><td>The coding agent</td></tr>
</table></div><p class="src">Mostly {V}, taken from announcements and trade coverage {X}. We have not tested any of these products. Features in preview may have changed.</p></div>
<ul style="margin-top:14px">
<li><b>Every vendor starts from the record it already owns.</b> None of them offers one approval record across the tracker, the repository, the pipeline and the service desk. {J}</li>
<li><b>Most are still built for technical users.</b> Atlassian and ServiceNow are the exceptions, because their existing users include business staff. {J}</li>
<li><b>Banks are already using them.</b> Reported developer productivity gains are modest: 5 to 15% at Citi and 10 to 20% at JPMorgan. The Evident AI Index reports that only 1% of bank AI use cases disclosed a financial return in 2026. {X}</li>
</ul></section>

<section id="compare"><div class="eyebrow">Section 5</div><h2>Comparison</h2>
<p style="margin-top:10px">We scored each option on twelve capabilities, from 0 (absent) to 3 (strong and built in). The scores are our reading of public source code, documentation and announcements. They are not test results.</p>
<div class="panel scroll keep" style="margin-top:14px"><h3>Capability matrix</h3>
<div class="lg"><span><span class="sw"></span>0 absent</span><span><span class="sw"><i style="opacity:.22"></i></span>1 partial, or through an add-on</span><span><span class="sw"><i style="opacity:.52"></i></span>2 present</span><span><span class="sw"><i style="opacity:.92"></i></span>3 strong and built in</span><span>? not enough public evidence</span></div>
<div>{heat()}</div>
<p class="src">{J} "Spec Kit + add-ons" includes the community multi-repository and Azure DevOps packages. "Reference design" is a prototype, which is why it scores 0 for production use.</p></div>

<div class="panel keep" style="margin-top:16px"><h3>Where each option sits</h3>
{legend([('c2', 'Spec-driven toolkit'), ('c1', 'Governed delivery platform'), ('c3', 'Reference design (prototype)')])}
{sc_svg}
<p class="src">{J} Each point is the average of the matrix rows above. Unknown cells are left out. * Thoughtworks is placed on four of nine rows only.</p></div>

<h3 style="margin-top:20px">What the charts show</h3>
<ul>
<li><b>Toolkits score high on requirements and code, and low on governance.</b> Spec Kit's core scores 0 on roles, audit and non-developer access.</li>
<li><b>Add-ons move toolkits a long way up.</b> With community packages, Spec Kit reaches the level of the weaker platforms on governance. Those packages are single-author and unvetted.</li>
<li><b>Platforms score high on governance and release, and lower on requirements.</b> Most start work at a ticket, not at a reviewed specification.</li>
<li><b>No shipping product reaches the top-right corner on every row.</b> The reference design does on paper, but it is not built.</li>
</ul><p class="src">{J}</p>

<h3 style="margin-top:20px">Side by side</h3>
<div class="panel scroll"><div><table>
<tr><th>Question</th><th>Spec-driven toolkit</th><th>Governed delivery platform</th></tr>
<tr><td>What does it control?</td><td>The input: what the agent is asked to build</td><td>The process: who approves and what is released</td></tr>
<tr><td>Who uses it?</td><td>Developers</td><td>Developers, plus approvers, release and risk staff</td></tr>
<tr><td>Where does the record live?</td><td>Text files in the repository</td><td>A shared system of record</td></tr>
<tr><td>What does approval mean?</td><td>The developer moves to the next step</td><td>A named role signs off, and it is logged</td></tr>
<tr><td>Cost to start</td><td>None. Open source</td><td>Licence, integration and change management</td></tr>
<tr><td>Time to start</td><td>Hours</td><td>Months</td></tr>
<tr><td>Main risk</td><td>Documents nobody outside engineering reads; unvetted add-ons</td><td>Slow, heavy process; dependence on one vendor</td></tr>
<tr><td>Evidence of benefit</td><td>Weak and mixed</td><td>Vendor-reported only</td></tr>
</table></div><p class="src">{J}, summarising Sections 3 and 4.</p></div>
</section>

<section id="reason"><div class="eyebrow">Section 6</div><h2>Reasoning: how to think about the choice</h2>
<div class="num" style="margin-top:14px">
<b class="n">1</b><p><b>They are different kinds of control, so they do not substitute for each other.</b> A specification is a preventive control: it reduces the chance the wrong thing is built. An approval record is an authorising control: it proves a responsible person accepted the result. Auditors and regulators ask for the second. Engineers benefit most from the first.</p>
<b class="n">2</b><p><b>The bottleneck is review, and only one approach addresses it directly.</b> Toolkits add documents to review. Platforms can route, batch and risk-tier approvals. Harness, for example, triggers approval by policy and impact. A platform that applies every gate to every change will make the bottleneck worse.</p>
<b class="n">3</b><p><b>The layers are merging.</b> AWS AI-DLC already has gates, an audit trail and an "Enterprise" profile. A Spec Kit add-on has named sign-offs tied to a fingerprint of the signed files. From the other side, GitLab and Thoughtworks have planning and specification agents. Within one or two years the large vendors are likely to offer both layers together.</p>
<b class="n">4</b><p><b>That changes the case for building your own.</b> A custom governed platform now competes with the roadmaps of GitHub, GitLab, Atlassian and ServiceNow. It is worth building only where they are weak: a clear experience for business approvers, one evidence record across several tools, and explanations of what the agent did.</p>
<b class="n">5</b><p><b>Regulation raises the floor but has not set a deadline for most of this.</b> The European Union has postponed high-risk AI obligations to December 2027. Existing rules on change management and separation of duties already apply to AI-written changes, whoever wrote them.</p>
</div><p class="src">{J}, drawing on Sections 1 to 5. The EU date is {X}.</p>

<h3 style="margin-top:20px">Which to choose</h3>
<div class="panel scroll"><div><table>
<tr><th>If your situation is</th><th>Start with</th><th>Why</th></tr>
<tr><td>Engineering teams already use coding agents with little structure</td><td>A spec-driven toolkit</td><td>Free, fast, and improves the quality of what agents are asked to do</td></tr>
<tr><td>You must show auditors who approved each change</td><td>Governance in your existing system of record</td><td>Your tracker or pipeline vendor now offers agent controls, and your approvers already use it</td></tr>
<tr><td>Changes cross many teams, repositories and tools</td><td>Both layers, connected</td><td>A toolkit per repository, with one platform holding approvals and release</td></tr>
<tr><td>Business owners must approve in plain language</td><td>A platform with strong non-developer access, or a custom front end</td><td>Toolkits and most platforms assume a technical user</td></tr>
<tr><td>Most changes are small and low risk</td><td>A light toolkit profile and risk-based approvals</td><td>Full process on every change will be bypassed</td></tr>
</table></div><p class="src">{J}</p></div>
</section>

<section id="do"><div class="eyebrow">Section 7</div><h2>What to do</h2>
<div class="num" style="margin-top:14px">
<b class="n">1</b><p><b>Adopt a spec-driven toolkit in engineering now.</b> Start with one team and one toolkit. Use a light profile for small changes.</p>
<b class="n">2</b><p><b>Turn on the agent governance your current vendors already ship.</b> Ask each one for agent identity, audit logging, approval policy and a stop control before buying anything new.</p>
<b class="n">3</b><p><b>Build custom only for the gap.</b> Today that is the business approver's experience and a single evidence record across tools. Connect to toolkits and platforms; do not replace them.</p>
<b class="n">4</b><p><b>Measure review time and failed changes, not lines of code.</b> Take a baseline before the pilot. Without one, no claim of benefit can be tested.</p>
<b class="n">5</b><p><b>Tier approvals by risk from the first day.</b> Reserve full sign-off for changes that need it.</p>
<b class="n">6</b><p><b>Treat community add-ons as third-party software.</b> Review the code, pin the version, and host approved packages in a private catalog.</p>
</div>
<div class="panel scroll" style="margin-top:16px"><h3>A ninety-day plan</h3><div><table>
<tr><th>Days</th><th>Action</th><th>Result</th></tr>
<tr><td>1 to 30</td><td>Record a baseline for one team: review time, lead time, failed changes. Choose one toolkit and one small set of approved add-ons</td><td>A baseline and an approved setup</td></tr>
<tr><td>31 to 60</td><td>Run real changes through the toolkit. Switch on agent audit and approval policy in the existing tracker or pipeline</td><td>Twenty or more changes delivered with a record of who approved</td></tr>
<tr><td>61 to 90</td><td>Compare against the baseline. List what approvers and auditors still could not see or do</td><td>A decision on what, if anything, to build</td></tr>
</table></div><p class="src">{J}</p></div>
</section>

<section id="method"><h2>Method, limits and sources</h2><ul style="margin-top:10px">
<li><b>Source reading.</b> We cloned seven public repositories on 13 November 2026 and read their documentation, catalogs and templates. We did not install or run them, so behaviour is as documented, not as observed.</li>
<li><b>Published summaries.</b> Studies, surveys and product news come from search summaries of the named sources. We could not open the original pages. Check any figure before quoting it outside your organisation.</li>
<li><b>Scores.</b> The matrix and positioning chart are our judgement. Two analysts could reasonably differ by one point on any cell. Cells marked "?" had too little public evidence to score.</li>
<li><b>Not covered.</b> Pricing, security certification, and hands-on product testing. Google's agent products are omitted because reports about their status conflict.</li>
<li><b>Conflicts we noticed.</b> Sources disagree on whether Gartner named three or four Leaders, on Kiro's general-availability date, and on the Harvard paper's approval-time figure.</li>
</ul>
<h3 style="margin-top:18px">Read in source</h3><ul>
<li><a href="https://github.com/github/spec-kit">github/spec-kit</a> (commit of 12 Nov 2026)</li>
<li><a href="https://github.com/awslabs/aidlc-workflows">awslabs/aidlc-workflows</a> (13 Nov 2026)</li>
<li><a href="https://github.com/Fission-AI/OpenSpec">Fission-AI/OpenSpec</a> · <a href="https://github.com/bmad-code-org/BMAD-METHOD">bmad-code-org/BMAD-METHOD</a></li>
<li>Spec Kit add-ons: <a href="https://github.com/joaopaschuino/spec-kit-multirepo">multi-repo</a>, <a href="https://github.com/sakitA/spec-kit-preset-multi-repo-branching">multi-repo-branching</a>, <a href="https://github.com/praveenlavu/spec-kit-ado">Azure DevOps</a></li>
</ul>
<h3 style="margin-top:18px">Research and surveys</h3><ul>
<li><a href="https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ESEM.2026.84">Hill, "Specification Artifacts in Open-Source Pull Request Workflows Do Not Reduce Defects", ESEM 2026</a></li>
<li><a href="https://arxiv.org/abs/2605.01160">Farrag, "The Productivity-Reliability Paradox", arXiv 2605.01160</a></li>
<li><a href="https://arxiv.org/pdf/2607.01904">"AI Writes Faster Than Humans Can Review", arXiv 2607.01904</a></li>
<li><a href="https://complexdiscovery.com/harvard-researchers-find-ai-coding-agents-shifted-the-bottleneck-to-code-review/">Harvard working paper on coding agents and code review (coverage)</a></li>
<li><a href="https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/">DORA reports on AI-assisted development (InfoQ)</a></li>
<li><a href="https://survey.stackoverflow.co/2026/ai/data">Stack Overflow Developer Survey 2026</a></li>
<li><a href="https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-ai-revolution-in-software-development">McKinsey, "The AI revolution in software development"</a></li>
<li><a href="https://virtualizationreview.com/articles/2026/06/05/ai-firms-push-cloud-giants-from-leaders-quadrant-in-gartner-ai-coding-report.aspx">Gartner Magic Quadrant for Enterprise AI Coding Agents, 2026 (coverage)</a></li>
<li><a href="https://www.thoughtworks.com/radar/languages-and-frameworks/github-spec-kit">Thoughtworks Technology Radar: GitHub Spec Kit</a></li>
<li><a href="https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html">Böckeler, "Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl"</a></li>
<li><a href="https://uvik.net/blog/spec-driven-development-benchmark/">Uvik benchmark</a> · <a href="https://orangeloops.com/2026/05/spec-driven-development-with-ai-a-spec-kit-claude-code-case-study/">OrangeLoops case study</a></li>
</ul>
<h3 style="margin-top:18px">Vendors and market</h3><ul>
<li><a href="https://venturebeat.com/ai/githubs-agent-hq-aims-to-solve-enterprises-biggest-ai-coding-problem-too">GitHub Agent HQ (VentureBeat)</a> · <a href="https://devblogs.microsoft.com/devops/github-copilot-for-azure-boards/">Azure Boards and Copilot coding agent</a></li>
<li><a href="https://about.gitlab.com/press/releases/2026-01-15-gitlab-announces-duo-agent-platform-general-availability/">GitLab Duo Agent Platform general availability</a></li>
<li><a href="https://www.atlassian.com/blog/company-news/rovo-team-26">Atlassian Team '26: Rovo</a> · <a href="https://www.atlassian.com/blog/jira/governed-agent-loops">governed agent loops</a></li>
<li><a href="https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-Build-Agent-now-works-inside-every-major-AI-coding-tool-governed-by-default">ServiceNow Build Agent</a> · <a href="https://thenewstack.io/servicenow-ai-governance-agents/">AI Control Tower (The New Stack)</a></li>
<li><a href="https://www.harness.io/blog/introducing-harness-agent-dlc">Harness Agent DLC</a> · <a href="https://www.harness.io/blog/policy-as-code">policy as code</a></li>
<li><a href="https://uk.newsroom.ibm.com/Introducing-IBM-Bob-AI-Development-Partner">IBM Bob</a> · <a href="https://www.theregister.com/2026/04/28/ibms_ai_coding_partner_bob/">The Register's coverage</a></li>
<li><a href="https://www.thoughtworks.com/ai/works/release/august-2026-V2-release">Thoughtworks AI/works 2.0</a> · <a href="https://www.thoughtworks.com/en-us/about-us/news/2026/thoughtworks-launches-agent-works">Agent/works</a></li>
<li><a href="https://www.exploreagentic.ai/insights/ai-dlc/">AWS AI-DLC explained</a> · <a href="https://sacra.com/research/cognition">Cognition (Sacra)</a></li>
<li><a href="https://www.forbes.com/sites/bernardmarr/2026/08/06/how-goldman-sachs-is-using-agentic-ai-for-software-engineering-at-scale/">Goldman Sachs and agentic engineering (Forbes)</a></li>
<li><a href="https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/">EU AI Act: postponed high-risk deadlines (Gibson Dunn)</a></li>
</ul></section>
</div>'''
open(os.path.join(HERE, 'ai-delivery-approaches.html'), 'w').write(head + body)
for c, x, y in pts: print(f'{c:22s} scope {x:.2f} governance {y:.2f}')
