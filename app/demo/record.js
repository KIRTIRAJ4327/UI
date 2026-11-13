// Records the narrated product tour. Each scene shows its caption, performs real clicks, and stays on screen
// at least as long as its narration. Scene start times are written to scenes.json for the audio mix.
const { chromium } = require('playwright'); const fs = require('fs');
const D = JSON.parse(fs.readFileSync('durations.json')); const N = Object.fromEntries(JSON.parse(fs.readFileSync('narration.json')));
const U = 'http://localhost:4173/'; const SL = '/tmp/claude-0/-home-user-UI/88bfff22-1691-53d5-ab19-4aff22ef43ff/scratchpad/report/slides.html';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: 'raw4', size: { width: 1440, height: 900 } } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://localhost:4173' });
  const p = await ctx.newPage(); const t0 = Date.now(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const wait = ms => p.waitForTimeout(ms);
  const overlay = async text => p.evaluate(text => {
    let c = document.getElementById('demo-cap');
    if (!c) {
      const st = document.createElement('style'); st.textContent = '#demo-cap{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);max-width:1060px;z-index:2147483647;background:rgba(12,16,32,.86);color:#fff;font:500 19px/1.45 Inter,system-ui,sans-serif;padding:12px 22px;border-radius:12px;pointer-events:none;box-shadow:0 8px 30px rgba(0,0,0,.25);text-align:center}#demo-cur{position:fixed;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:rgba(36,105,188,.35);border:2px solid #2469bc;z-index:2147483646;pointer-events:none;transition:left .25s ease,top .25s ease,transform .15s}#demo-cur.down{transform:scale(.7)}div[role=status].bottom-20{bottom:150px!important}';
      document.documentElement.appendChild(st);
      c = document.createElement('div'); c.id = 'demo-cap'; document.documentElement.appendChild(c);
      const cur = document.createElement('div'); cur.id = 'demo-cur'; cur.style.left = '720px'; cur.style.top = '450px'; document.documentElement.appendChild(cur);
      addEventListener('mousemove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; }, true);
      addEventListener('mousedown', () => cur.classList.add('down'), true); addEventListener('mouseup', () => cur.classList.remove('down'), true);
    }
    c.textContent = text; c.style.display = text ? 'block' : 'none';
  }, text);
  const scenes = []; let cur = null, curText = '', timers = [];
  const chunks = t => { const out = []; let b = ''; for (const sen of t.match(/[^.?!:]+[.?!:]+\s*/g) || [t]) { if ((b + sen).length > 150 && b) { out.push(b.trim()); b = sen; } else b += sen; } if (b.trim()) out.push(b.trim()); return out; };
  const scene = async (k, fn) => {
    const start = (Date.now() - t0) / 1000; cur = k; const parts = chunks(N[k]); const total = parts.join('').length; let acc = 0;
    const caps = parts.map(pt => { const at = 0.3 + D[k] * acc / total; acc += pt.length; return { at, text: pt }; });
    curText = caps[0].text; await overlay(curText);
    timers = caps.slice(1).map(c => setTimeout(() => { curText = c.text; overlay(curText).catch(() => {}); }, c.at * 1000));
    scenes.push({ k, start, caps });
    await fn();
    const left = start + D[k] + 0.8 - (Date.now() - t0) / 1000; if (left > 0) await wait(left * 1000);
    timers.forEach(clearTimeout); scenes[scenes.length - 1].end = (Date.now() - t0) / 1000;
  };
  const slide = k => scene(k, async () => { await p.goto('file://' + SL + '#' + k); await overlay(curText); });
  const click = async loc => { await loc.scrollIntoViewIfNeeded(); await loc.hover(); await wait(350); await loc.click(); };
  const nav = async h => { await p.evaluate(h => { location.hash = h; }, h); await wait(900); await overlay(curText); };
  const as = async who => { await p.selectOption('#viewas', who); await wait(700); await overlay(curText); };
  const scroll = async y => { await p.mouse.wheel(0, y); await wait(700); };

  await p.goto(U + '#v3-home'); await p.evaluate(() => { sessionStorage.clear(); try { localStorage.setItem('delivery-theme', 'light'); } catch {} });
  await p.goto('file://' + SL + '#title'); await wait(600);
  for (const k of ['title', 'why', 'strain', 'maturity', 'canada', 'purpose']) await slide(k);
  await p.goto(U + '#v3-home'); await wait(1200);
  await scene('intro', async () => { await wait(D.intro * 1000 - 1200); await click(p.getByRole('button', { name: 'Explore on my own' })); });
  await scene('home', async () => { await wait(1500); await p.getByRole('link', { name: 'Approve the solution design' }).hover(); });
  await scene('design', async () => { await click(p.getByRole('link', { name: 'Approve the solution design' })); await wait(2500); await click(p.getByRole('tab', { name: 'Full technical' })); await wait(2500); await click(p.getByRole('tab', { name: 'Plain summary' })); });
  await scene('panel', async () => { await click(p.getByRole('button', { name: 'How it was made' })); await wait(3500); await p.locator('#ap-q').click(); await p.keyboard.type('What is the main risk?', { delay: 45 }); await p.keyboard.press('Enter'); await wait(D.panel * 1000 - 6500); await p.keyboard.press('Escape'); });
  await scene('approve', async () => { await click(p.getByLabel('I accept that the Pricing API is not covered by this change')); await wait(900); await click(p.getByRole('button', { name: 'Approve design' })); await wait(1500); await overlay(curText); });
  await scene('docs', async () => { await scroll(500); await click(p.getByRole('button', { name: /Block values above 310/ }).first()); await wait(5000); await click(p.getByRole('dialog').getByRole('button', { name: 'Delivery plan' })); await wait(6000); await p.keyboard.press('Escape'); await wait(500); });
  await scene('vscode', async () => { const r = p.getByRole('region', { name: /Developer Agent in VS Code/ }); await r.scrollIntoViewIfNeeded(); await wait(1500); await click(p.getByRole('button', { name: 'Copy Developer prompt' })); await wait(4000); await click(p.getByRole('button', { name: 'Developer assignment ready' })); await wait(5000); await p.keyboard.press('Escape'); });
  await scene('clarify', async () => { await as('priya'); await nav('v3-clarify'); await wait(1500); await click(p.getByLabel('No, open accounts only')); await wait(1200); await click(p.getByRole('button', { name: 'Send answers' })); await wait(1500); await overlay(curText); await p.getByText('Answers to the agent’s questions').scrollIntoViewIfNeeded(); });
  await scene('review', async () => { await as('alex'); await nav('v3-review'); await wait(1500); await click(p.getByRole('button', { name: /Dashboard\.jsx/ })); await wait(2500); await click(p.getByRole('button', { name: 'Approve build' })); await wait(1200); await overlay(curText); });
  await scene('gates', async () => { await wait(4800); await as('tom'); await nav('v3-run-wi-4807'); await wait(1800); await click(p.getByRole('button', { name: 'Approve integration' })); await wait(5600); await as('mara'); await nav('v3-run-wi-4807'); await wait(1500); await click(p.getByRole('button', { name: 'Approve validation' })); await wait(800); await as('alex'); });
  await scene('newreq', async () => { await nav('v3-new'); await wait(1200); await click(p.getByRole('button', { name: 'Draft the plan' })); await wait(5200); await overlay(curText); const h = await p.evaluate(() => location.hash.slice(1)); await as('priya'); await nav(h); await wait(800); await click(p.getByRole('button', { name: 'Approve plan' })); await wait(800); await overlay(curText); });
  await scene('release', async () => { await as('sam'); await nav('v3-release'); await wait(2000); await scroll(300); await click(p.getByRole('button', { name: 'Schedule release' })); await wait(1500); await overlay(curText); await nav('v3-run-wi-4772'); });
  await scene('govern', async () => { await as('dana'); await nav('v3-admin'); await wait(3500); await nav('v3-squads'); await wait(1200); await click(p.getByRole('link', { name: 'Fix squad' }).first()); await wait(1200); await overlay(curText); const a = p.getByRole('button', { name: 'Assign' }); await click(a.first()); await wait(400); await click(a.last()); await wait(400); await click(p.getByRole('button', { name: 'Save squad' })); await wait(1000); await overlay(curText); });
  await scene('people', async () => { await nav('v3-people'); await click(p.getByRole('button', { name: 'Invite person' })); await p.locator('#iv-e').pressSequentially('new.reviewer@example.com', { delay: 30 }); await wait(500); await click(p.getByRole('button', { name: 'Send invitation' })); await wait(1200); await overlay(curText); });
  await scene('audit', async () => { await nav('v3-audit'); await wait(3000); await scroll(400); });
  await scene('dark', async () => { await nav('v3-home'); await wait(300); await click(p.getByRole('button', { name: /^Theme:/ })); await wait(900); await overlay(curText); });
  for (const k of ['layers', 'speckit', 'versus', 'position', 'answer']) await slide(k);
  await p.goto(U + '#v3-run-wi-4821'); await wait(900);
  await scene('close', async () => { await nav('v3-run-wi-4821'); await wait(2500); });
  await overlay(''); await wait(800);
  const total = (Date.now() - t0) / 1000;
  fs.writeFileSync('scenes.json', JSON.stringify({ total, scenes, errs }, null, 1));
  const v = p.video(); await ctx.close(); fs.renameSync(await v.path(), 'tour.webm'); await b.close();
  console.log('total', total.toFixed(1), 's; errors', errs);
})().catch(e => { console.error(e); process.exit(1); });
