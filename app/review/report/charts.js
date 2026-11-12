// Shared chart builders (inline SVG strings). Colours come from CSS variables so both themes work.
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const DATA = {
  personas: [
    ['Business requester / Product Owner', 11, 5, 4], ['Solution Architect', 10, 9, 7], ['Developer / Engineering Lead', 7, 11, 9],
    ['Integration Lead', 5, 7, 8], ['Quality Lead / tester', 7, 7, 5], ['Release Manager', 11, 7, 7],
    ['Platform Admin', 9, 5, 7], ['Auditor / risk and compliance', 9, 4, 2], ['Executive sponsor', 5, 1, 4]],
  criteria: [['Works in their natural tool', 1.78, 1.67, 2.11], ['Understands what the AI did', 2.11, 1.44, 0.89], ['Control: approve, stop, send back', 1.67, 1.44, 1.56], ['Evidence kept automatically', 2.67, 1.67, 1.33]],
  walk: [['Tools a person must open', 3, 6, 6], ['Waits for a person', 8, 6, 6], ['Enforced, recorded approvals', 7, 2, 2], ['Approvals before code is written', 3, 0, 0]],
  regions: [['United States', 2.0, 1.5, 2.5], ['United Kingdom', 1.75, 1.5, 2.0], ['Australia', 1.75, 1.5, 2.0], ['Canada', 1.5, 1.0, 2.0], ['EU and Switzerland', 1.5, 1.0, 2.0], ['Singapore', 1.5, 1.0, 2.0], ['China', 1.5, 1.0, 2.0], ['UAE', 1.5, 1.0, 2.0], ['Brazil', 1.5, 1.0, 2.0], ['Hong Kong', 1.25, 1.0, 1.5], ['Japan', 1.25, 1.0, 1.5], ['India', 1.0, 0.5, 1.5], ['Saudi Arabia', 1.0, 0.5, 1.5]],
  trust: [['Developers who use AI at work', 90, 'DORA 2025'], ['Developers who would trust AI with an important decision', 6.6, 'Stack Overflow 2026'], ['UK financial firms with AI agents in production', 80, 'BoE / FCA 2026'], ['UK financial firms that allow agents broad autonomy', 2, 'BoE / FCA 2026']],
  impact: [['Tasks completed per developer', 33.7], ['Bugs per developer', 54], ['Incidents per pull request', 242.7], ['Median pull-request review time', 441.5]],
  stages: [['Writing new code', 71, 'DORA 2025'], ['Documentation', 64, 'DORA 2025'], ['Creating test cases', 62, 'DORA 2025'], ['Debugging', 61, 'Stack Overflow 2026'], ['Code review', 56, 'DORA 2025'], ['Deploy and operate', 20, 'Stack Overflow 2026']],
  evident: [[1, 'JPMorgan Chase', 'US'], [2, 'Capital One', 'US'], [3, 'RBC', 'Canada'], [4, 'Commonwealth Bank', 'Australia'], [10, 'TD', 'Canada'], [11, 'HSBC', 'UK'], [20, 'BMO', 'Canada'], [21, 'CIBC', 'Canada'], [25, 'DBS', 'Singapore'], [30, 'Scotiabank', 'Canada']],
};
const SERIES = ['Our platform (prototype)', 'Spec-driven in the repo (Spec Kit, Kiro)', 'IDE only (AI agent + Azure DevOps)'];
function legend(names) { return `<div class="lg">${names.map((n, i) => `<span><i style="background:var(--c${i + 1})"></i>${esc(n)}</span>`).join('')}</div>`; }
// Horizontal grouped bars: rows [label, a, b, c]
function grouped(rows, max, { w = 900, lab = 300, fmt = v => v, barH = 11, gap = 3, rowGap = 14 } = {}) {
  const rowH = 3 * barH + 2 * gap + rowGap, h = rows.length * rowH + 28, x0 = lab, pw = w - lab - 44;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Grouped bar chart">`;
  for (let t = 0; t <= 4; t++) { const x = x0 + pw * t / 4; s += `<line x1="${x}" y1="0" x2="${x}" y2="${h - 24}" stroke="var(--grid)"/><text x="${x}" y="${h - 8}" text-anchor="middle" class="tk">${fmt(max * t / 4)}</text>`; }
  rows.forEach(([l, ...v], i) => { const y = i * rowH + 4; s += `<text x="${lab - 12}" y="${y + 1.5 * barH + gap + 4}" text-anchor="end" class="lb">${esc(l)}</text>`;
    v.forEach((val, j) => { const bw = Math.max(2, pw * val / max), by = y + j * (barH + gap); s += `<rect x="${x0}" y="${by}" width="${bw}" height="${barH}" rx="3" fill="var(--c${j + 1})"><title>${esc(l)} · ${SERIES[j]}: ${fmt(val)}</title></rect><text x="${x0 + bw + 6}" y="${by + barH - 1.5}" class="vl">${fmt(val)}</text>`; }); });
  return s + '</svg>';
}
// Single-series horizontal bars: rows [label, value, note]
function bars(rows, max, { w = 900, lab = 430, unit = '%', color = 'var(--c1)', barH = 20, rowGap = 16, colors } = {}) {
  const rowH = barH + rowGap, h = rows.length * rowH + 6, pw = w - lab - 190;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Bar chart">`;
  rows.forEach(([l, v, note], i) => { const y = i * rowH + 2, bw = Math.max(3, pw * v / max);
    s += `<text x="${lab - 12}" y="${y + barH - 5}" text-anchor="end" class="lb">${esc(l)}</text><rect x="${lab}" y="${y}" width="${bw}" height="${barH}" rx="4" fill="${colors ? colors[i] : color}"><title>${esc(l)}: ${v}${unit}</title></rect><text x="${lab + bw + 8}" y="${y + barH - 5}" class="vl b">${v}${unit}</text>${note ? `<text x="${w}" y="${y + barH - 5}" text-anchor="end" class="tk">${esc(note)}</text>` : ''}`; });
  return s + '</svg>';
}
// Level with range: rows [label, level, low, high]
function ranges(rows, { w = 900, lab = 190, hi = 'Canada' } = {}) {
  const rowH = 30, top = 40, h = rows.length * rowH + top + 34, pw = w - lab - 30, X = v => lab + pw * v / 4;
  const names = ['L0 None', 'L1 Assisted coding', 'L2 Task agents', 'L3 Governed delivery', 'L4 Policy-driven'];
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Maturity level by region with ranges">`;
  s += `<rect x="${X(3) - 46}" y="${top - 8}" width="92" height="${rows.length * rowH + 8}" rx="8" fill="var(--band)"/><text x="${X(3)}" y="14" text-anchor="middle" class="tk b">Where this platform aims</text>`;
  names.forEach((n, i) => { s += `<line x1="${X(i)}" y1="${top - 8}" x2="${X(i)}" y2="${h - 30}" stroke="var(--grid)"/><text x="${X(i)}" y="${h - 10}" text-anchor="${i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}" class="tk">${n}</text>`; });
  rows.forEach(([l, v, lo, hi2], i) => { const y = top + i * rowH + 12, on = l === hi;
    s += `<text x="${lab - 14}" y="${y + 4}" text-anchor="end" class="lb${on ? ' b' : ''}">${esc(l)}</text><line x1="${X(lo)}" y1="${y}" x2="${X(hi2)}" y2="${y}" stroke="${on ? 'var(--c1)' : 'var(--mute)'}" stroke-width="4" stroke-linecap="round" opacity="${on ? .45 : .5}"/><circle cx="${X(v)}" cy="${y}" r="${on ? 8 : 6}" fill="${on ? 'var(--c1)' : 'var(--ink2)'}" stroke="var(--surface)" stroke-width="2"><title>${esc(l)}: about level ${v} (range ${lo} to ${hi2})</title></circle>`; });
  return s + '</svg>';
}
if (typeof module !== 'undefined') module.exports = { DATA, SERIES, legend, grouped, bars, ranges, esc };
