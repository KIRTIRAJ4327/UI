const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 1200 }, colorScheme: 'light' });
  await p.emulateMedia({ colorScheme: 'light' });
  await p.setContent('<!doctype html><html lang="en"><head><meta charset=utf8><title>AI-driven software delivery</title></head><body>' + fs.readFileSync('ai-delivery-approaches.html', 'utf8') + '</body></html>');
  await p.addStyleTag({ content: `
    @page{size:Letter;margin:16mm 14mm}
    body{background:#fff!important}.wrap{max-width:none;padding:0!important}
    .note,svg,h2,h3,tr,.grid2 .panel,.kpi .panel{break-inside:avoid}thead{display:table-header-group}
    h2,h3{break-after:avoid}
    section{break-before:auto}
    #sdd,#gov,#compare,#reason{break-before:page}.keep{break-inside:avoid}tr:first-child{break-after:avoid}h3{break-after:avoid}h3+.panel{break-before:avoid}.num{break-inside:auto}.num p,.num b{break-inside:avoid}.panel{padding:12px 16px!important}
    .kpi{grid-template-columns:repeat(4,1fr)!important;gap:10px}.kpi .panel{padding:14px!important}.kpi .panel b{font-size:22px!important}.kpi span{font-size:12.5px!important}
    .wrap{gap:16px!important}h2{margin-top:14px!important}li{margin:3px 0}
    .scroll>div{min-width:0!important}.scroll{overflow:visible!important}
    nav.toc{display:none}
    a{color:#2469bc;text-decoration:none}
  `});
  await p.waitForTimeout(1200);
  await p.pdf({ path: 'AI-Driven-Delivery-Executive-Report.pdf', format: 'Letter', printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>', footerTemplate: '<div style="font:9px Inter,Arial,sans-serif;color:#6b7389;width:100%;padding:0 14mm;display:flex;justify-content:space-between"><span>AI-driven software delivery · Executive report · 13 November 2026</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>', margin: { top: '16mm', bottom: '18mm', left: '14mm', right: '14mm' } });
  await b.close();
})();
