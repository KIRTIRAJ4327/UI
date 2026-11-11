(function(){
const b=document.body,act=b.dataset.active||'';
const L=[['Inbox','inbox',3],['Runs','runs'],['Stories','stories'],['Documents','docs'],['Audit trail','audit']];
const rail=`<nav class="rail" aria-label="Primary"><div class="brand"><i>◈</i><div>Delivery Platform<small>Product delivery</small></div></div>
${L.map(x=>`<a href="#" class="${act===x[1]?'on':''}">${x[0]}${x[2]?`<span class="n">${x[2]}</span>`:''}</a>`).join('')}
<h6>Workspaces</h6><a href="#">Full Application</a><a href="#">Advisor Portal</a><a href="#">Client Services</a>
<h6>Admin</h6><a href="#">Connections <span class="chip ok" style="background:#12301f;color:#4cd08b">online</span></a>
<div class="me"><span class="av">AK</span><div><div style="color:#fff;font-weight:600">Alex Kim</div><div style="font-size:12px;color:#8b94ab">Solution Architect</div></div></div></nav>`;
const app=document.querySelector('.app');if(app&&!b.dataset.norail&&!app.querySelector('.rail'))app.insertAdjacentHTML('afterbegin',rail);
const t=document.querySelector('.top .sp');
if(t){t.insertAdjacentHTML('afterend','<span class="live" title="Live updates connected">Live</span><button class="btn ghost theme" aria-label="Toggle theme">Theme</button>');
document.querySelector('.theme').onclick=()=>{const r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark'};}
})();
