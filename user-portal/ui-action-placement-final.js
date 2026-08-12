(()=>{
'use strict';
const PRIMARY={
'operations.channel-analysis':'生成选剧报告','operations.ad-intelligence':'新建抓取任务','operations.unblock':'新建解禁工单',
'production.content':'上传剧集内容','production.localization':'创建译配任务',
'release.review':'进入批量审核','release.distribution':'新建分发任务',
'dashboard.series':'导出剧集报表','dashboard.channels':'导出频道报表','dashboard.external':'生成对标报告','dashboard.risk':'导出风险报告',
'system.channels':'新增频道账号','system.assets':'新增素材或片方','system.templates':'新建 AI 模板','system.roles':'新增角色','system.tasks':'查看失败任务'
};
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function style(){let s=document.getElementById('action-placement-final-style');if(!s){s=document.createElement('style');s.id='action-placement-final-style';document.head.appendChild(s)}s.textContent=`
.ota-toolbar>#octopusGlobalActionHost,.ota-toolbar .otp-primary-row,.ota-toolbar>[data-primary],.ota-toolbar>.v815primary{display:none!important}
#octopusGlobalActionHost{display:none!important}
#pageRoot .apf-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:9px!important}
#pageRoot .apf-export{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:36px!important;padding:0 14px!important;border:1px solid var(--line)!important;border-radius:9px!important;background:var(--panel2)!important;color:var(--text)!important;font-size:9px!important;cursor:pointer!important}
#pageRoot .apf-primary{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:132px!important;height:36px!important;padding:0 16px!important;border:1px solid #6683df!important;border-radius:9px!important;background:#6683df!important;color:#fff!important;font-size:9px!important;font-weight:750!important;cursor:pointer!important}
`}
function apply(){
 style();const r=route();
 const host=document.getElementById('octopusGlobalActionHost');if(host&&host.childElementCount)host.replaceChildren();
 document.querySelectorAll('.ota-toolbar [data-primary],.ota-toolbar .otp-list-primary,.ota-toolbar .v815primary').forEach(b=>b.remove());
 if(['release.titles','release.covers','production.localization','overview'].includes(r))return;
 const page=document.querySelector('#pageRoot>:is(.v815page,.occ-page,.oge-page)');const toolbar=page?.querySelector('.v815toolbar');const label=PRIMARY[r];if(!page||!toolbar||!label)return;
 const header=page.querySelector('.ol2-data-head,.gml-data-head,.cad-data-head,.otp-list-head');if(!header)return;
 let actions=header.querySelector('.ols-data-actions,.otp-list-actions,.apf-actions');if(!actions){actions=document.createElement('div');header.appendChild(actions)}actions.classList.add('apf-actions');
 const exportButton=actions.querySelector('[data-export],.otp-list-export,.apf-export')||toolbar.querySelector('[data-export]');
 if(exportButton){exportButton.classList.add('apf-export');if(exportButton.parentElement!==actions)actions.appendChild(exportButton)}
 [...actions.querySelectorAll('button')].forEach(button=>{if(button!==exportButton&&!button.classList.contains('apf-primary'))button.remove()});
 let primary=actions.querySelector('.apf-primary');if(!primary){primary=document.createElement('button');primary.type='button';primary.className='apf-primary';primary.dataset.apfRoute=r;actions.appendChild(primary)}
 if(primary.dataset.apfRoute!==r)primary.dataset.apfRoute=r;if(primary.textContent!==label)primary.textContent=label;
 header.querySelectorAll('.ol2-data-meta,.gml-data-meta,.cad-data-meta,.otp-list-meta').forEach(n=>n.remove());
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})}
window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});schedule();setTimeout(schedule,500);setTimeout(schedule,1400);
})();