(()=>{
'use strict';
const ROOT='pageRoot',LANG_KEY='octopus-user-v7-language',STYLE_ID='octopus-critical-pages-final';
let scheduled=false,lastRoute='';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const en=()=>localStorage.getItem(LANG_KEY)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');
const text=(zh,enText)=>en()?enText:zh;

function style(){
 let s=document.getElementById(STYLE_ID);if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}
 s.textContent=`
 /* Assets & partners: keep the action column compact and visually attached to the row. */
 #${ROOT} .atw-table{width:100%!important;table-layout:auto!important}
 #${ROOT} .atw-table th:last-child,#${ROOT} .atw-table td:last-child{
   position:sticky!important;right:0!important;width:204px!important;min-width:204px!important;max-width:204px!important;
   padding-left:12px!important;padding-right:12px!important;text-align:center!important;border-left:1px solid var(--line)!important;
   box-sizing:border-box!important;background:var(--panel)!important;z-index:3!important
 }
 #${ROOT} .atw-table th:last-child{background:var(--panel2)!important;z-index:4!important}
 #${ROOT} .atw-table .aaf-actions,#${ROOT} .atw-table .oaf-row-actions{
   width:100%!important;min-width:0!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important
 }
 #${ROOT} .atw-table .aaf-action,#${ROOT} .atw-table .oaf-row-btn{
   min-width:0!important;height:30px!important;padding:0 10px!important;flex:0 1 auto!important
 }
 #${ROOT} .atw-table tbody tr{min-height:56px!important}
 #${ROOT} .atw-table td{vertical-align:middle!important}

 /* Critical workspaces must never be hidden by generic layout patches. */
 #${ROOT} :is(.daw-page,.rvw-page,.dpw-page){display:block!important;visibility:visible!important;opacity:1!important}
 #${ROOT} :is(.daw-kpi,.daw-panel,.daw-table-card,.rvw-card,.dpw-card){display:block!important;visibility:visible!important;opacity:1!important}
 #${ROOT} :is(.daw-btn,.rvw-btn,.dpw-btn){visibility:visible!important;opacity:1!important;pointer-events:auto!important}
 #${ROOT} .rvw-btn:disabled,#${ROOT} .dpw-btn:disabled{opacity:.45!important}
 #${ROOT} :is(.rvw-actions,.dpw-actions,.daw-periods){display:flex!important;visibility:visible!important;opacity:1!important}

 /* Restore lightweight KPI cards above review and distribution so the page hierarchy is clear. */
 #${ROOT} .cpf-summary{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important;margin:0 0 14px!important}
 #${ROOT} .cpf-kpi{min-height:82px!important;padding:15px 16px!important;border:1px solid var(--line)!important;border-radius:12px!important;background:var(--panel)!important;box-sizing:border-box!important}
 #${ROOT} .cpf-kpi span{display:block!important;color:var(--soft)!important;font-size:8px!important}
 #${ROOT} .cpf-kpi strong{display:block!important;margin-top:9px!important;color:var(--text)!important;font-size:18px!important;line-height:1!important}
 html.octopus-light #${ROOT} .cpf-kpi{background:#f7f8f9!important;border-color:#d9dfe5!important}

 #${ROOT} .cpf-dashboard-action{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:36px!important;padding:0 13px!important;border:1px solid #6683df!important;border-radius:9px!important;background:#6683df!important;color:#fff!important;font-size:9px!important;font-weight:700!important;cursor:pointer!important}
 #${ROOT} .cpf-table-action{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:30px!important;padding:0 10px!important;border:1px solid #6683df!important;border-radius:8px!important;background:#6683df!important;color:#fff!important;font-size:8px!important;font-weight:700!important;cursor:pointer!important}
 @media(max-width:900px){#${ROOT} .cpf-summary{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
 @media(max-width:620px){#${ROOT} .cpf-summary{grid-template-columns:1fr!important}#${ROOT} .atw-table th:last-child,#${ROOT} .atw-table td:last-child{position:static!important;width:auto!important;min-width:190px!important;max-width:none!important}}
 `;
}

function repairAssets(){
 if(route()!=='system.assets')return;
 const table=document.querySelector(`#${ROOT} .atw-table`);if(!table)return;
 const heads=[...table.querySelectorAll('thead th')];if(!heads.length)return;
 const material=heads.length>=11;
 heads.at(-1).textContent=text('操作','Actions');
 table.querySelectorAll('tbody tr').forEach(tr=>{
   const td=tr.cells?.[tr.cells.length-1];if(!td)return;
   const buttons=[...td.querySelectorAll('button')];
   if(material){
     if(buttons[0]){buttons[0].textContent=text('查看素材','View asset');buttons[0].setAttribute('data-aaf-view-asset','')}
     if(buttons[1]){buttons[1].textContent=text('查看剧集','View series');buttons[1].setAttribute('data-aaf-view-series','')}
     if(buttons[2]){buttons[2].textContent=text('下载','Download');buttons[2].setAttribute('data-aaf-download','')}
   }else{
     if(buttons[0]){buttons[0].textContent=text('查看档案','View profile');buttons[0].setAttribute('data-aaf-view-partner','')}
     if(buttons[1]){buttons[1].textContent=text('下载档案','Download profile');buttons[1].setAttribute('data-aaf-download-profile-row','')}
   }
   const wrap=td.querySelector('.aaf-actions,.oaf-row-actions');if(wrap)wrap.style.removeProperty('min-width');
 });
}

function repairDashboard(){
 if(!/^dashboard\./.test(route()))return;
 const page=document.querySelector(`#${ROOT} .daw-page`);if(!page)return;
 let periods=page.querySelector('.daw-periods');
 if(!periods){
   const filter=page.querySelector('.daw-filter');if(filter){periods=document.createElement('div');periods.className='daw-periods';filter.appendChild(periods)}
 }
 if(periods){
   const existingPeriods=periods.querySelectorAll('[data-daw-period]');
   if(!existingPeriods.length){
     ['7d','30d','90d'].forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='daw-btn'+(v==='30d'?' active':'');b.dataset.dawPeriod=v;b.textContent=en()?['Last 7 days','Last 30 days','Last 90 days'][i]:['近 7 天','近 30 天','近 90 天'][i];periods.appendChild(b)})
   }
   if(!periods.querySelector('[data-daw-export]')){const b=document.createElement('button');b.type='button';b.className='cpf-dashboard-action';b.dataset.dawExport='';b.textContent=text('导出分析报告','Export analysis report');periods.appendChild(b)}
 }
 const table=page.querySelector('.daw-table');
 table?.querySelectorAll('tbody tr').forEach((tr,i)=>{
   const td=tr.cells?.[tr.cells.length-1];if(!td)return;
   if(!td.querySelector('[data-daw-follow]')){td.innerHTML='';const b=document.createElement('button');b.type='button';b.className='cpf-table-action';b.dataset.dawFollow=String(i);b.textContent=text('创建跟进任务','Create follow-up');td.appendChild(b)}
 });
}

function summaryCounts(selector){return [...document.querySelectorAll(selector)].map(x=>x.textContent.replace(/\s+/g,' ').trim())}
function ensureReviewSummary(){
 const page=document.querySelector(`#${ROOT} .rvw-page`);if(!page||page.querySelector('.cpf-review-summary'))return;
 const labels=summaryCounts(`#${ROOT} .rvw-status-tabs .rvw-btn`);
 const nums=labels.map(s=>(s.match(/(\d+)\s*$/)||[])[1]||'0');
 const selected=(page.querySelector('.rvw-selected')?.textContent.match(/(\d+)/)||[])[1]||'0';
 const s=document.createElement('section');s.className='cpf-summary cpf-review-summary';
 const data=en()?[['Pending / reviewing',nums[0]||'0'],['Approved',nums[1]||'0'],['Returned',nums[2]||'0'],['Selected',selected]]:[['待审核 / 复核中',nums[0]||'0'],['已通过',nums[1]||'0'],['已退回',nums[2]||'0'],['当前选择',selected]];
 s.innerHTML=data.map(x=>`<article class="cpf-kpi"><span>${x[0]}</span><strong>${x[1]}</strong></article>`).join('');
 page.prepend(s);
}
function repairReview(){
 if(route()!=='release.review')return;
 const page=document.querySelector(`#${ROOT} .rvw-page`);if(!page)return;
 const card=page.querySelector('.rvw-card');if(card){card.style.removeProperty('display');card.style.removeProperty('visibility')}
 const head=card?.querySelector('.rvw-head');
 const pending=!!page.querySelector('[data-rvw-view="pending"].active');
 if(head&&pending&&!head.querySelector('.rvw-actions')){
   const actions=document.createElement('div');actions.className='rvw-actions';actions.innerHTML=`<span class="rvw-selected">${text('已选择 0 条','0 selected')}</span><button type="button" class="rvw-btn primary" data-rvw-batch disabled>${text('审核所选物料','Review selected')}</button>`;head.appendChild(actions)
 }
 ensureReviewSummary();
}

function ensureDistributionSummary(){
 const page=document.querySelector(`#${ROOT} .dpw-page`);if(!page||page.querySelector('.cpf-distribution-summary'))return;
 const demandText=page.querySelector('[data-dpw-tab="demands"]')?.textContent||'';
 const readyText=page.querySelector('[data-dpw-tab="ready"]')?.textContent||'';
 const demand=(demandText.match(/(\d+)\s*$/)||[])[1]||'0',ready=(readyText.match(/(\d+)\s*$/)||[])[1]||'0';
 const rows=[...page.querySelectorAll('.dpw-table tbody tr')],sent=rows.filter(tr=>/已分发|Distributed/i.test(tr.textContent)).length;
 const s=document.createElement('section');s.className='cpf-summary cpf-distribution-summary';
 const data=en()?[['Launch demands',demand],['Ready to distribute',ready],['Distributed',String(sent)],['Channel API','Healthy']]:[['上线需求',demand],['待分发任务',ready],['已分发',String(sent)],['频道 API','正常']];
 s.innerHTML=data.map(x=>`<article class="cpf-kpi"><span>${x[0]}</span><strong>${x[1]}</strong></article>`).join('');page.prepend(s)
}
function repairDistribution(){
 if(route()!=='release.distribution')return;
 const page=document.querySelector(`#${ROOT} .dpw-page`);if(!page)return;
 const card=page.querySelector('.dpw-card');if(card){card.style.removeProperty('display');card.style.removeProperty('visibility')}
 const head=card?.querySelector('.dpw-head');
 if(head&&!head.querySelector('[data-dpw-new]')){
   let actions=head.querySelector('.dpw-actions');if(!actions){actions=document.createElement('div');actions.className='dpw-actions';head.appendChild(actions)}
   const b=document.createElement('button');b.type='button';b.className='dpw-btn primary';b.dataset.dpwNew='';b.textContent=text('新建分发任务','New distribution task');actions.prepend(b)
 }
 if(card&&!card.querySelector('.dpw-flow')){
   const flow=document.createElement('div');flow.className='dpw-flow';flow.innerHTML=en()?'<div class="dpw-step"><b>01 Opportunity</b>Region, account and goal</div><div class="dpw-step"><b>02 Select series</b>Choose video and version</div><div class="dpw-step"><b>03 Select creatives</b>Use approved title and cover</div><div class="dpw-step"><b>04 Validate & distribute</b>Create channel task</div>':'<div class="dpw-step"><b>01 上线机会</b>记录地区、账号和测试目标</div><div class="dpw-step"><b>02 确定剧集</b>选择视频内容与版本</div><div class="dpw-step"><b>03 选择物料</b>匹配已审核标题和封面</div><div class="dpw-step"><b>04 校验分发</b>创建正式频道任务</div>';
   const headEl=card.querySelector('.dpw-head');headEl?.insertAdjacentElement('afterend',flow)
 }
 ensureDistributionSummary();
}

function recoverIfBroken(){
 const r=route(),root=document.getElementById(ROOT);if(!root)return;
 const needs=(r==='release.review'&&!root.querySelector('.rvw-page'))||(r==='release.distribution'&&!root.querySelector('.dpw-page'))||(/^dashboard\./.test(r)&&!root.querySelector('.daw-page'));
 if(!needs||root.dataset.cpfRecovered===r)return;
 root.dataset.cpfRecovered=r;
 setTimeout(()=>{
   const still=(r==='release.review'&&!root.querySelector('.rvw-page'))||(r==='release.distribution'&&!root.querySelector('.dpw-page'))||(/^dashboard\./.test(r)&&!root.querySelector('.daw-page'));
   if(still){root.innerHTML='';window.dispatchEvent(new Event('hashchange'))}
 },120);
}
function apply(){scheduled=false;style();recoverIfBroken();repairAssets();repairDashboard();repairReview();repairDistribution()}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply)}
function onRoute(){const r=route(),root=document.getElementById(ROOT);if(root&&r!==lastRoute){root.removeAttribute('data-cpf-recovered');lastRoute=r}setTimeout(schedule,0);setTimeout(schedule,160)}
window.addEventListener('hashchange',onRoute);window.addEventListener('octopus-language-change',()=>{setTimeout(schedule,0);setTimeout(schedule,120)});window.addEventListener('storage',e=>{if(e.key===LANG_KEY)schedule()});
const boot=()=>{const root=document.getElementById(ROOT);if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});onRoute()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
setTimeout(schedule,400);setTimeout(schedule,1100);
})();