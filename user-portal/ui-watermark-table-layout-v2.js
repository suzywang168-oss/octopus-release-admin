(()=>{'use strict';
const ROUTE='release.watermark',ROOT='pageRoot',STORE='octopus-watermark-jobs-v1';
let tab='ready',scheduled=false;
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const active=()=>route()===ROUTE;
const read=()=>{try{const x=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
function css(){if(document.getElementById('wmk-tabs-v3-css'))return;document.getElementById('wmk-layout-v2-css')?.remove();const s=document.createElement('style');s.id='wmk-tabs-v3-css';s.textContent=`
#${ROOT} .wmk-page>.wmk-kpis,#${ROOT} .wmk-page>.wmk-insight{display:none!important}
#${ROOT} .wmk-tabbar{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:14px;padding:12px 14px;border:1px solid var(--line);border-radius:13px;background:var(--panel)}
#${ROOT} .wmk-tabbar-copy{min-width:0}
#${ROOT} .wmk-tabbar-copy b{display:block;color:var(--text);font-size:13px}
#${ROOT} .wmk-tabbar-copy span{display:block;margin-top:4px;color:var(--soft);font-size:10px}
#${ROOT} .wmk-tabs{display:flex;align-items:center;gap:7px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--panel2)}
#${ROOT} .wmk-tab{height:34px;padding:0 13px;border:0;border-radius:7px;background:transparent;color:var(--soft);font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap}
#${ROOT} .wmk-tab b{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;margin-left:6px;padding:0 6px;border-radius:999px;background:var(--panel);color:var(--text);font-size:10px}
#${ROOT} .wmk-tab.active{background:#6683df;color:#fff}
#${ROOT} .wmk-tab.active b{background:rgba(255,255,255,.16);color:#fff}
#${ROOT} .wmk-stack{display:block!important}
#${ROOT} .wmk-stack>.wmk-card{margin:0!important}
#${ROOT} .wmk-stack>.wmk-card[hidden]{display:none!important}
#${ROOT} .wmk-head{padding:16px!important}
#${ROOT} .wmk-tools{padding:12px 14px!important}
@media(max-width:760px){#${ROOT} .wmk-tabbar{align-items:flex-start;flex-direction:column}#${ROOT} .wmk-tabs{width:100%;box-sizing:border-box}#${ROOT} .wmk-tab{flex:1}}
`;document.head.appendChild(s)}
function cleanup(page){page.querySelectorAll('.wmk-v2-note,.wmk-v2-headright').forEach(x=>x.remove());page.querySelectorAll('[data-wmk-v2-all],[data-wmk-v2-one]').forEach(x=>x.closest('th,td')?.remove())}
function counts(){const a=read();return{ready:a.filter(x=>x.status!=='质检通过').length,done:a.filter(x=>x.status==='质检通过').length}}
function enhance(){scheduled=false;if(!active())return;css();const root=document.getElementById(ROOT),page=root?.querySelector('.wmk-page');if(!page)return;cleanup(page);const stack=page.querySelector('.wmk-stack'),cards=stack?[...stack.querySelectorAll(':scope>.wmk-card')]:[];if(!stack||cards.length<2)return;let bar=page.querySelector('.wmk-tabbar');if(!bar){bar=document.createElement('div');bar.className='wmk-tabbar';stack.parentNode.insertBefore(bar,stack)}const c=counts();bar.innerHTML=`<div class="wmk-tabbar-copy"><b>频道水印任务</b><span>通过按钮切换待压制任务与已完成水印成片。</span></div><div class="wmk-tabs" role="tablist"><button class="wmk-tab ${tab==='ready'?'active':''}" type="button" data-wmk-tab="ready" role="tab" aria-selected="${tab==='ready'}">可压制水印 <b>${c.ready}</b></button><button class="wmk-tab ${tab==='done'?'active':''}" type="button" data-wmk-tab="done" role="tab" aria-selected="${tab==='done'}">已压制水印 <b>${c.done}</b></button></div>`;cards[0].hidden=tab!=='ready';cards[1].hidden=tab!=='done';page.dataset.watermarkLayout='tab-switch-v3'}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)}
document.addEventListener('click',e=>{if(!active())return;const t=e.target instanceof Element?e.target.closest('[data-wmk-tab]'):null;if(!t)return;e.preventDefault();e.stopImmediatePropagation();tab=t.dataset.wmkTab==='done'?'done':'ready';schedule()},true);
window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});schedule();
window.OctopusWatermarkTableLayout={ensure:schedule,version:'3.0'};
})();