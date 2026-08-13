(()=>{
'use strict';
const ROOT='pageRoot',STYLE='octopus-stable-action-registry',LANG_KEY='octopus-user-v7-language';
let scheduled=false,lastRerender=0,observer=null;
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const en=()=>localStorage.getItem(LANG_KEY)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');
const tx=(zh,enText)=>en()?enText:zh;
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
#${ROOT} :is(.daw-btn,.rvw-btn,.dpw-btn,.atw-btn,.prw-btn,.abs-btn){display:inline-flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;pointer-events:auto!important;opacity:1!important;position:relative!important;z-index:5!important}
#${ROOT} :is(.daw-periods,.rvw-actions,.dpw-actions,.atw-tabs,.prw-tabs,.abs-actions){display:flex!important;visibility:visible!important;opacity:1!important}
#${ROOT} .daw-filter{position:sticky!important;top:0!important;z-index:18!important;padding:8px 0!important;background:color-mix(in srgb,var(--bg) 94%,transparent)!important;backdrop-filter:blur(8px)!important}
#${ROOT} .daw-table th:last-child,#${ROOT} .daw-table td:last-child{position:sticky!important;right:0!important;z-index:7!important;background:var(--panel)!important;min-width:132px!important;text-align:center!important}
#${ROOT} .daw-table th:last-child{z-index:8!important;background:var(--panel2)!important}
#${ROOT} .daw-table td:last-child .daw-btn{min-width:104px!important;white-space:nowrap!important}
#${ROOT} .rvw-head,#${ROOT} .dpw-head,#${ROOT} .atw-head,#${ROOT} .prw-head{overflow:visible!important}
#${ROOT} .rvw-actions,#${ROOT} .dpw-actions{flex:0 0 auto!important;align-items:center!important;gap:8px!important}
#${ROOT} .atw-table th:last-child,#${ROOT} .atw-table td:last-child,#${ROOT} .prw-table th:last-child,#${ROOT} .prw-table td:last-child{position:sticky!important;right:0!important;z-index:6!important;background:var(--panel)!important}
#${ROOT} .atw-table th:last-child,#${ROOT} .prw-table th:last-child{z-index:7!important;background:var(--panel2)!important}
html.octopus-light #${ROOT} .daw-filter{background:rgba(244,246,248,.94)!important}
`}
function mk(cls,text,attrs={}){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;Object.entries(attrs).forEach(([k,v])=>{if(k==='disabled')b.disabled=!!v;else b.setAttribute(k,String(v))});return b}
function dashboard(page){
 let filter=page.querySelector('.daw-filter');if(!filter)return false;
 let periods=filter.querySelector('.daw-periods');if(!periods){periods=document.createElement('div');periods.className='daw-periods';filter.appendChild(periods)}
 const specs=[['7d',tx('近 7 天','Last 7 days')],['30d',tx('近 30 天','Last 30 days')],['90d',tx('近 90 天','Last 90 days')]];
 specs.forEach(([v,label])=>{let b=periods.querySelector(`[data-daw-period="${v}"]`);if(!b){b=mk('daw-btn'+(v==='30d'?' active':''),label,{'data-daw-period':v});periods.appendChild(b)}else{b.hidden=false;b.classList.add('daw-btn')}});
 let exp=periods.querySelector('[data-daw-export]');if(!exp){exp=mk('daw-btn',tx('导出分析报告','Export analysis report'),{'data-daw-export':''});periods.appendChild(exp)}else{exp.hidden=false;exp.classList.add('daw-btn')}
 const rows=[...page.querySelectorAll('.daw-table tbody tr')];rows.forEach((tr,i)=>{const td=tr.cells?.[tr.cells.length-1];if(!td)return;let b=td.querySelector('[data-daw-follow]');if(!b){b=mk('daw-btn primary',tx('创建跟进任务','Create follow-up'),{'data-daw-follow':i});td.replaceChildren(b)}else{b.hidden=false;b.classList.add('daw-btn','primary')}});
 return true
}
function review(page){
 const pending=!!page.querySelector('[data-rvw-view="pending"].active');const head=page.querySelector('.rvw-head');if(!head)return false;
 if(pending){let actions=head.querySelector('.rvw-actions');if(!actions){actions=document.createElement('div');actions.className='rvw-actions';head.appendChild(actions)}let label=actions.querySelector('.rvw-selected');const count=page.querySelectorAll('[data-rvw-check]:checked').length;if(!label){label=document.createElement('span');label.className='rvw-selected';actions.appendChild(label)}label.textContent=en()?`${count} selected`:`已选择 ${count} 条`;let b=actions.querySelector('[data-rvw-batch]');if(!b){b=mk('rvw-btn primary',tx('审核所选物料','Review selected'),{'data-rvw-batch':'',disabled:count===0});actions.appendChild(b)}else b.disabled=count===0}
 page.querySelectorAll('.rvw-btn').forEach(b=>{b.hidden=false});return true
}
function distribution(page){
 const head=page.querySelector('.dpw-head');if(!head)return false;let actions=head.querySelector('.dpw-actions');if(!actions){actions=document.createElement('div');actions.className='dpw-actions';head.appendChild(actions)}if(!actions.querySelector('[data-dpw-new]'))actions.prepend(mk('dpw-btn primary',tx('新建分发任务','New distribution task'),{'data-dpw-new':''}));page.querySelectorAll('.dpw-btn').forEach(b=>b.hidden=false);return true
}
function requestBusinessRerender(key){const now=Date.now();if(now-lastRerender<900)return;lastRerender=now;const root=document.getElementById(ROOT);if(!root)return;try{delete root.dataset[key]}catch{}window.dispatchEvent(new Event('hashchange'))}
function templates(page){const head=page.querySelector('.atw-card>.atw-head');if(!head)return false;if(!head.querySelector('[data-atw-new-template]'))head.appendChild(mk('atw-btn primary',tx('新建规则模板','New rule template'),{'data-atw-new-template':''}));const rows=[...page.querySelectorAll('.atw-table tbody tr')];if(rows.length&&rows.some(tr=>!tr.querySelector('[data-atw-edit]')))requestBusinessRerender('atw');page.querySelectorAll('.atw-btn').forEach(b=>b.hidden=false);return true}
function roles(page){const rows=[...page.querySelectorAll('.prw-table tbody tr')];if(rows.length&&rows.some(tr=>!tr.querySelector('[data-prw-person],[data-prw-role]')))requestBusinessRerender('prw');page.querySelectorAll('.prw-btn').forEach(b=>b.hidden=false);return true}
function assets(page){window.OctopusAssetsBusinessActions?.check?.();page.querySelectorAll('.atw-btn,.abs-btn').forEach(b=>b.hidden=false);return true}
function check(){scheduled=false;css();const root=document.getElementById(ROOT);if(!root)return false;const r=route();let page=null;
 if(/^dashboard\./.test(r)){page=root.querySelector('.daw-page');return page?dashboard(page):false}
 if(r==='release.review'){page=root.querySelector('.rvw-page');return page?review(page):false}
 if(r==='release.distribution'){page=root.querySelector('.dpw-page');return page?distribution(page):false}
 if(r==='system.templates'){page=root.querySelector('.atw-page');return page?templates(page):false}
 if(r==='system.roles'){page=root.querySelector('.prw-page');return page?roles(page):false}
 if(r==='system.assets'){page=root.querySelector('.atw-page');return page?assets(page):false}
 return true
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(check)}
function bindObserver(){const root=document.getElementById(ROOT);if(!root)return;if(observer)observer.disconnect();observer=new MutationObserver(schedule);observer.observe(root,{childList:true,subtree:true})}
window.OctopusStableActionRegistry={check,version:'1.0'};
window.addEventListener('hashchange',()=>{setTimeout(check,0);setTimeout(check,90);setTimeout(check,360)});window.addEventListener('octopus-language-change',()=>setTimeout(check,100));window.addEventListener('pageshow',()=>setTimeout(check,80));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(check,80)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{bindObserver();setTimeout(check,150)},{once:true});else{bindObserver();setTimeout(check,150)}
setInterval(()=>{if(/^(dashboard\.|release\.review$|release\.distribution$|system\.(assets|templates|roles)$)/.test(route()))check()},1200);
})();