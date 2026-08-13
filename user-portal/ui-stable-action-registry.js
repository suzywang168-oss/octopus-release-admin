(()=>{
'use strict';
const ROOT='pageRoot',STYLE='octopus-stable-action-registry',LANG_KEY='octopus-user-v7-language';
let scheduled=false,lastRerender=0,observer=null;
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const en=()=>localStorage.getItem(LANG_KEY)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');
const tx=(zh,enText)=>en()?enText:zh;
const SYSTEM_ACTIONS={
  'system.channels':{
    primary:['新增频道账号','Add channel account'],
    actions:[['编辑账号','Edit account'],['管理API密钥','Manage API key'],['配置频道风格','Configure channel style']]
  },
  'system.tasks':{
    primary:['查看失败任务','View failed tasks'],
    actions:[['查看日志','View logs'],['重试任务','Retry task'],['调整优先级','Adjust priority']]
  }
};
function css(){
 let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}
 s.textContent=`
 #${ROOT} :is(.rvw-btn,.dpw-btn,.atw-btn,.prw-btn,.abs-btn,.daw-btn,.v815act,.v815primary,.v815ghost){visibility:visible!important;pointer-events:auto!important;opacity:1!important}
 #${ROOT} :is(.rvw-actions,.dpw-actions,.atw-tabs,.prw-tabs,.abs-actions,.v815acts){visibility:visible!important;opacity:1!important}

 /* Dashboard: preserve hierarchy instead of forcing every action into one blue button style. */
 #${ROOT} .daw-filter{position:relative!important;top:auto!important;z-index:auto!important;padding:0!important;background:transparent!important;backdrop-filter:none!important}
 #${ROOT} .daw-periods{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;flex-wrap:wrap!important}
 #${ROOT} .daw-range-group{display:inline-flex!important;align-items:center!important;gap:2px!important;padding:3px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:var(--panel2)!important}
 #${ROOT} .daw-period-btn{height:30px!important;padding:0 11px!important;border:0!important;border-radius:7px!important;background:transparent!important;color:var(--soft)!important;font-size:8px!important;font-weight:700!important;box-shadow:none!important}
 #${ROOT} .daw-period-btn.active{background:var(--panel)!important;color:var(--text)!important;box-shadow:inset 0 0 0 1px var(--line)!important}
 #${ROOT} .daw-export-btn{height:36px!important;padding:0 13px!important;border:1px solid #6683df!important;border-radius:9px!important;background:#6683df!important;color:#fff!important;font-size:9px!important;font-weight:700!important;white-space:nowrap!important}
 #${ROOT} .daw-follow-btn{height:30px!important;padding:0 10px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--panel2)!important;color:#9db0ff!important;font-size:8px!important;font-weight:700!important;white-space:nowrap!important;box-shadow:none!important}
 #${ROOT} .daw-follow-btn:hover{border-color:#6683df!important;background:color-mix(in srgb,#6683df 8%,var(--panel2))!important}
 #${ROOT} .daw-table th:last-child,#${ROOT} .daw-table td:last-child{position:static!important;right:auto!important;z-index:auto!important;min-width:118px!important;text-align:left!important;background:inherit!important}
 #${ROOT} .daw-table th:last-child{background:var(--panel2)!important}

 /* Other business workspaces: keep their native action regions visible. */
 #${ROOT} .rvw-head,#${ROOT} .dpw-head,#${ROOT} .atw-head,#${ROOT} .prw-head{overflow:visible!important}
 #${ROOT} .rvw-actions,#${ROOT} .dpw-actions{display:flex!important;flex:0 0 auto!important;align-items:center!important;gap:8px!important}
 #${ROOT} .atw-table th:last-child,#${ROOT} .atw-table td:last-child,#${ROOT} .prw-table th:last-child,#${ROOT} .prw-table td:last-child{position:sticky!important;right:0!important;z-index:6!important;background:var(--panel)!important}
 #${ROOT} .atw-table th:last-child,#${ROOT} .prw-table th:last-child{z-index:7!important;background:var(--panel2)!important}

 /* Generic System pages (Channel Accounts / Async Tasks) keep their original action buttons. */
 #${ROOT} .sar-system-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:7px!important;flex-wrap:nowrap!important}
 #${ROOT} .sar-system-actions .v815act{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:30px!important;padding:0 9px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--panel2)!important;color:var(--text)!important;font-size:8px!important;font-weight:700!important;white-space:nowrap!important;cursor:pointer!important}
 #${ROOT} .sar-system-primary{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:34px!important;padding:0 13px!important;border:1px solid #6683df!important;border-radius:9px!important;background:#6683df!important;color:#fff!important;font-size:9px!important;font-weight:700!important;cursor:pointer!important}
 #${ROOT} .v815table th:last-child,#${ROOT} .v815table td:last-child{min-width:230px!important}
 `;
}
function mk(cls,text,attrs={}){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;Object.entries(attrs).forEach(([k,v])=>{if(k==='disabled')b.disabled=!!v;else b.setAttribute(k,String(v))});return b}
function dashboard(page){
 const filter=page.querySelector('.daw-filter');if(!filter)return false;
 let periods=filter.querySelector('.daw-periods');if(!periods){periods=document.createElement('div');periods.className='daw-periods';filter.appendChild(periods)}
 let range=periods.querySelector('.daw-range-group');
 if(!range){range=document.createElement('div');range.className='daw-range-group';periods.prepend(range)}
 [...periods.querySelectorAll(':scope>[data-daw-period]')].forEach(b=>range.appendChild(b));
 const specs=[['7d',tx('近 7 天','Last 7 days')],['30d',tx('近 30 天','Last 30 days')],['90d',tx('近 90 天','Last 90 days')]];
 specs.forEach(([v,label])=>{
   let b=range.querySelector(`[data-daw-period="${v}"]`);
   if(!b){b=mk('daw-btn daw-period-btn'+(v==='30d'?' active':''),label,{'data-daw-period':v});range.appendChild(b)}
   b.hidden=false;b.classList.add('daw-btn','daw-period-btn');b.classList.remove('primary');
 });
 let exp=periods.querySelector(':scope>[data-daw-export]');
 if(!exp){exp=periods.querySelector('[data-daw-export]');if(exp&&exp.parentElement!==periods)periods.appendChild(exp)}
 if(!exp){exp=mk('daw-btn daw-export-btn',tx('导出分析报告','Export analysis report'),{'data-daw-export':''});periods.appendChild(exp)}
 exp.hidden=false;exp.classList.add('daw-btn','daw-export-btn');exp.classList.remove('primary');
 [...page.querySelectorAll('.daw-table tbody tr')].forEach((tr,i)=>{
   const td=tr.cells?.[tr.cells.length-1];if(!td)return;
   let b=td.querySelector('[data-daw-follow]');
   if(!b){b=mk('daw-btn daw-follow-btn',tx('创建跟进任务','Create follow-up'),{'data-daw-follow':i});td.replaceChildren(b)}
   b.hidden=false;b.classList.add('daw-btn','daw-follow-btn');b.classList.remove('primary');
 });
 return true
}
function review(page){
 const pending=!!page.querySelector('[data-rvw-view="pending"].active'),head=page.querySelector('.rvw-head');if(!head)return false;
 if(pending){let actions=head.querySelector('.rvw-actions');if(!actions){actions=document.createElement('div');actions.className='rvw-actions';head.appendChild(actions)}let label=actions.querySelector('.rvw-selected');const count=page.querySelectorAll('[data-rvw-check]:checked').length;if(!label){label=document.createElement('span');label.className='rvw-selected';actions.appendChild(label)}label.textContent=en()?`${count} selected`:`已选择 ${count} 条`;let b=actions.querySelector('[data-rvw-batch]');if(!b){b=mk('rvw-btn primary',tx('审核所选物料','Review selected'),{'data-rvw-batch':'',disabled:count===0});actions.appendChild(b)}else b.disabled=count===0}
 page.querySelectorAll('.rvw-btn').forEach(b=>b.hidden=false);return true
}
function distribution(page){
 const head=page.querySelector('.dpw-head');if(!head)return false;let actions=head.querySelector('.dpw-actions');if(!actions){actions=document.createElement('div');actions.className='dpw-actions';head.appendChild(actions)}if(!actions.querySelector('[data-dpw-new]'))actions.prepend(mk('dpw-btn primary',tx('新建分发任务','New distribution task'),{'data-dpw-new':''}));page.querySelectorAll('.dpw-btn').forEach(b=>b.hidden=false);return true
}
function requestBusinessRerender(key){const now=Date.now();if(now-lastRerender<900)return;lastRerender=now;const root=document.getElementById(ROOT);if(!root)return;try{delete root.dataset[key]}catch{}window.dispatchEvent(new Event('hashchange'))}
function templates(page){const head=page.querySelector('.atw-card>.atw-head');if(!head)return false;if(!head.querySelector('[data-atw-new-template]'))head.appendChild(mk('atw-btn primary',tx('新建规则模板','New rule template'),{'data-atw-new-template':''}));const rows=[...page.querySelectorAll('.atw-table tbody tr')];if(rows.length&&rows.some(tr=>!tr.querySelector('[data-atw-edit]')))requestBusinessRerender('atw');page.querySelectorAll('.atw-btn').forEach(b=>b.hidden=false);return true}
function roles(page){const rows=[...page.querySelectorAll('.prw-table tbody tr')];if(rows.length&&rows.some(tr=>!tr.querySelector('[data-prw-person],[data-prw-role]')))requestBusinessRerender('prw');page.querySelectorAll('.prw-btn').forEach(b=>b.hidden=false);return true}
function assets(page){window.OctopusAssetsBusinessActions?.check?.();page.querySelectorAll('.atw-btn,.abs-btn').forEach(b=>b.hidden=false);return true}
function systemGeneric(root,r){
 const cfg=SYSTEM_ACTIONS[r],page=root.querySelector('.v815page');if(!cfg||!page)return false;
 let primary=page.querySelector('[data-primary]');
 if(!primary){const host=page.querySelector('.gml-page-actions')||page.querySelector('.v815head');if(host){primary=mk('v815primary sar-system-primary',tx(cfg.primary[0],cfg.primary[1]),{'data-primary':''});host.appendChild(primary)}}
 if(primary){primary.hidden=false;primary.classList.add('sar-system-primary')}
 const table=page.querySelector('.v815table');
 table?.querySelectorAll('tbody tr').forEach(tr=>{
   const td=tr.cells?.[tr.cells.length-1];if(!td)return;
   let wrap=td.querySelector('.v815acts');
   const existing=wrap?[...wrap.querySelectorAll('[data-a]')]:[];
   if(!wrap){wrap=document.createElement('div');wrap.className='v815acts sar-system-actions';td.replaceChildren(wrap)}else wrap.classList.add('sar-system-actions');
   cfg.actions.forEach(([canonical,label])=>{
     let b=existing.find(x=>x.dataset.a===canonical)||wrap.querySelector(`[data-a="${canonical}"]`);
     if(!b){b=mk('v815act',tx(canonical,label),{'data-a':canonical});wrap.appendChild(b)}
     b.hidden=false;b.textContent=tx(canonical,label);
   });
 });
 page.querySelectorAll('.v815act,.v815primary,.v815ghost').forEach(b=>{b.hidden=false;b.style.removeProperty('display');b.style.removeProperty('visibility');b.style.removeProperty('opacity');b.style.removeProperty('pointer-events')});
 return true
}
function check(){scheduled=false;css();const root=document.getElementById(ROOT);if(!root)return false;const r=route();let page=null;
 if(/^dashboard\./.test(r)){page=root.querySelector('.daw-page');return page?dashboard(page):false}
 if(r==='release.review'){page=root.querySelector('.rvw-page');return page?review(page):false}
 if(r==='release.distribution'){page=root.querySelector('.dpw-page');return page?distribution(page):false}
 if(r==='system.templates'){page=root.querySelector('.atw-page');return page?templates(page):false}
 if(r==='system.roles'){page=root.querySelector('.prw-page');return page?roles(page):false}
 if(r==='system.assets'){page=root.querySelector('.atw-page');return page?assets(page):false}
 if(r==='system.channels'||r==='system.tasks')return systemGeneric(root,r);
 return true
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(check)}
function bindObserver(){const root=document.getElementById(ROOT);if(!root)return;if(observer)observer.disconnect();observer=new MutationObserver(schedule);observer.observe(root,{childList:true,subtree:true})}
window.OctopusStableActionRegistry={check,version:'2.0'};
window.addEventListener('hashchange',()=>{setTimeout(check,0);setTimeout(check,90);setTimeout(check,360)});window.addEventListener('octopus-language-change',()=>setTimeout(check,100));window.addEventListener('pageshow',()=>setTimeout(check,80));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(check,80)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{bindObserver();setTimeout(check,150)},{once:true});else{bindObserver();setTimeout(check,150)}
setInterval(()=>{if(/^(dashboard\.|release\.review$|release\.distribution$|system\.(assets|templates|roles|channels|tasks)$)/.test(route()))check()},1200);
})();