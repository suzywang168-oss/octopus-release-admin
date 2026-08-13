(()=>{
'use strict';

const ROOT='pageRoot';
const LANG_KEY='octopus-user-v7-language';
const STYLE_ID='octopus-runtime-integrity-guard';
const CHECK_INTERVAL=1600;
let lastRecoveryAt=0;
let checking=false;

const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const en=()=>localStorage.getItem(LANG_KEY)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');
const tx=(zh,enText)=>en()?enText:zh;

const MANIFEST={
  'operations.channel-analysis':{root:'.orw-page'},
  'operations.ad-intelligence':{root:'.orw-page'},
  'production.content':{root:'.pcw-page'},
  'production.localization':{root:'.loc-page'},
  'release.titles':{root:'.gw3-page'},
  'release.covers':{root:'.gw3-page'},
  'release.review':{root:'.rvw-page',card:'.rvw-card'},
  'release.distribution':{root:'.dpw-page',card:'.dpw-card'},
  'dashboard.series':{root:'.daw-page',card:'.daw-table-card'},
  'dashboard.channels':{root:'.daw-page',card:'.daw-table-card'},
  'dashboard.external':{root:'.daw-page',card:'.daw-table-card'},
  'dashboard.risk':{root:'.daw-page',card:'.daw-table-card'},
  'system.assets':{root:'.atw-page'},
  'system.templates':{root:'.atw-page'}
};

function installStyle(){
  let style=document.getElementById(STYLE_ID);
  if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
  style.textContent=`
    /* Stable custom workspaces own their own layout and actions. */
    #${ROOT} :is(.orw-page,.pcw-page,.loc-page,.gw3-page,.rvw-page,.dpw-page,.daw-page,.atw-page){
      visibility:visible!important;opacity:1!important
    }
    #${ROOT} :is(.rvw-card,.dpw-card,.daw-table-card,.daw-panel,.daw-kpi,.atw-card){
      visibility:visible!important;opacity:1!important
    }
    #${ROOT} :is(.rvw-btn,.dpw-btn,.daw-btn,.aaf-action,.oaf-row-btn){
      visibility:visible!important;pointer-events:auto!important;position:relative!important;z-index:2!important
    }
    #${ROOT} .rvw-btn:not(:disabled),
    #${ROOT} .dpw-btn:not(:disabled),
    #${ROOT} .daw-btn:not(:disabled){opacity:1!important;cursor:pointer!important}
    #${ROOT} .rvw-btn:disabled,#${ROOT} .dpw-btn:disabled,#${ROOT} .daw-btn:disabled{opacity:.45!important;cursor:not-allowed!important}

    /* Dashboard buttons always use the dashboard's native button system. */
    #${ROOT} .daw-periods{display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important}
    #${ROOT} .daw-btn{
      display:inline-flex!important;align-items:center!important;justify-content:center!important;
      min-width:0!important;height:36px!important;padding:0 12px!important;margin:0!important;
      border:1px solid var(--line)!important;border-radius:9px!important;background:var(--panel2)!important;
      color:var(--text)!important;font-size:9px!important;font-weight:700!important;line-height:1!important;white-space:nowrap!important
    }
    #${ROOT} .daw-btn.primary,#${ROOT} .daw-btn.active{
      border-color:#6683df!important;background:#6683df!important;color:#fff!important
    }
    #${ROOT} .daw-table td:last-child{min-width:130px!important}

    /* Review and distribution action zones must remain visible. */
    #${ROOT} .rvw-head,#${ROOT} .dpw-head{overflow:visible!important}
    #${ROOT} .rvw-actions,#${ROOT} .dpw-actions{
      display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;
      visibility:visible!important;opacity:1!important;position:relative!important;z-index:3!important
    }
    #${ROOT} .dpw-flow{visibility:visible!important;opacity:1!important}

    /* Assets/partners: compact action column, no giant blank gutter. */
    #${ROOT} .atw-table{width:100%!important;table-layout:auto!important}
    #${ROOT} .atw-table th:last-child,#${ROOT} .atw-table td:last-child{
      position:sticky!important;right:0!important;width:220px!important;min-width:220px!important;max-width:220px!important;
      padding:10px 12px!important;text-align:center!important;vertical-align:middle!important;
      border-left:1px solid var(--line)!important;box-sizing:border-box!important;background:var(--panel)!important;z-index:3!important
    }
    #${ROOT} .atw-table th:last-child{background:var(--panel2)!important;z-index:4!important}
    #${ROOT} .atw-table :is(.aaf-actions,.oaf-row-actions){
      width:100%!important;min-width:0!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;flex-wrap:nowrap!important
    }
    #${ROOT} .atw-table :is(.aaf-action,.oaf-row-btn){
      min-width:0!important;height:30px!important;padding:0 9px!important;flex:0 1 auto!important;white-space:nowrap!important
    }
    @media(max-width:760px){
      #${ROOT} .atw-table th:last-child,#${ROOT} .atw-table td:last-child{position:static!important;width:auto!important;min-width:190px!important;max-width:none!important}
    }
  `;
}

function isShown(el){
  if(!el||!el.isConnected)return false;
  const s=getComputedStyle(el);
  return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>0.01;
}

function unhide(el){
  if(!el)return;
  el.hidden=false;
  el.removeAttribute('aria-hidden');
  if(el.style.display==='none')el.style.removeProperty('display');
  if(el.style.visibility==='hidden')el.style.removeProperty('visibility');
  if(el.style.opacity==='0')el.style.removeProperty('opacity');
  if(el instanceof HTMLButtonElement){el.style.removeProperty('pointer-events')}
}

function recoverRoute(reason){
  const now=Date.now();
  if(now-lastRecoveryAt<650)return;
  lastRecoveryAt=now;
  console.warn('[Octopus Integrity] requesting workspace recovery:',route(),reason);
  try{window.dispatchEvent(new Event('hashchange'))}catch{}
}

function repairDashboard(page){
  page.querySelectorAll('.daw-kpi,.daw-panel,.daw-table-card,.daw-periods,.daw-btn').forEach(unhide);

  const periods=page.querySelector('.daw-periods');
  if(periods&&!periods.querySelector('[data-daw-export]')){
    const b=document.createElement('button');
    b.type='button';b.className='daw-btn';b.dataset.dawExport='';
    b.textContent=tx('导出分析报告','Export analysis report');
    periods.appendChild(b);
  }

  const table=page.querySelector('.daw-table');
  table?.querySelectorAll('tbody tr').forEach((tr,index)=>{
    const td=tr.cells?.[tr.cells.length-1];if(!td)return;
    let b=td.querySelector('[data-daw-follow]');
    if(!b){
      td.replaceChildren();
      b=document.createElement('button');b.type='button';b.className='daw-btn primary';
      b.dataset.dawFollow=String(index);b.textContent=tx('创建跟进任务','Create follow-up');td.appendChild(b);
    }else{
      b.classList.add('daw-btn','primary');unhide(b);
    }
  });
}

function selectedReviewCount(page){return page.querySelectorAll('[data-rvw-check]:checked').length}
function repairReview(page){
  page.querySelectorAll('.rvw-card,.rvw-head,.rvw-status-tabs,.rvw-btn,.rvw-actions').forEach(unhide);
  const pending=!!page.querySelector('[data-rvw-view="pending"].active');
  const head=page.querySelector('.rvw-head');
  if(pending&&head&&!head.querySelector('[data-rvw-batch]')){
    let actions=head.querySelector('.rvw-actions');
    if(!actions){actions=document.createElement('div');actions.className='rvw-actions';head.appendChild(actions)}
    let label=actions.querySelector('.rvw-selected');
    if(!label){label=document.createElement('span');label.className='rvw-selected';actions.appendChild(label)}
    const count=selectedReviewCount(page);label.textContent=en()?`${count} selected`:`已选择 ${count} 条`;
    const b=document.createElement('button');b.type='button';b.className='rvw-btn primary';b.dataset.rvwBatch='';
    b.textContent=tx('审核所选物料','Review selected');b.disabled=count===0;actions.appendChild(b);
  }
  const count=selectedReviewCount(page),batch=page.querySelector('[data-rvw-batch]');
  if(batch){batch.disabled=count===0;unhide(batch)}
}

function repairDistribution(page){
  page.querySelectorAll('.dpw-card,.dpw-head,.dpw-tabs,.dpw-actions,.dpw-flow,.dpw-btn').forEach(unhide);
  const head=page.querySelector('.dpw-head');
  if(head&&!head.querySelector('[data-dpw-new]')){
    let actions=head.querySelector('.dpw-actions');
    if(!actions){actions=document.createElement('div');actions.className='dpw-actions';head.appendChild(actions)}
    const b=document.createElement('button');b.type='button';b.className='dpw-btn primary';b.dataset.dpwNew='';
    b.textContent=tx('新建分发任务','New distribution task');actions.prepend(b);
  }
  page.querySelectorAll('[data-dpw-config],[data-dpw-send],[data-dpw-new]').forEach(b=>{b.classList.add('dpw-btn');unhide(b)});
}

function repairAssets(page){
  const table=page.querySelector('.atw-table');if(!table)return;
  const heads=[...table.querySelectorAll('thead th')];if(!heads.length)return;
  const material=heads.length>=11;
  heads.at(-1).textContent=tx('操作','Actions');
  table.querySelectorAll('tbody tr').forEach(tr=>{
    const td=tr.cells?.[tr.cells.length-1];if(!td)return;
    const buttons=[...td.querySelectorAll('button')];
    if(material){
      const labels=en()?['View asset','View series','Download']:['查看素材','查看剧集','下载'];
      if(buttons[0]){buttons[0].textContent=labels[0];buttons[0].setAttribute('data-aaf-view-asset','');unhide(buttons[0])}
      if(buttons[1]){buttons[1].textContent=labels[1];buttons[1].setAttribute('data-aaf-view-series','');unhide(buttons[1])}
      if(buttons[2]){buttons[2].textContent=labels[2];buttons[2].setAttribute('data-aaf-download','');unhide(buttons[2])}
    }else{
      const labels=en()?['View profile','Download profile']:['查看档案','下载档案'];
      if(buttons[0]){buttons[0].textContent=labels[0];buttons[0].setAttribute('data-aaf-view-partner','');unhide(buttons[0])}
      if(buttons[1]){buttons[1].textContent=labels[1];buttons[1].setAttribute('data-aaf-download-profile-row','');unhide(buttons[1])}
    }
  });
}

function report(){
  const r=route(),root=document.getElementById(ROOT),m=MANIFEST[r];
  if(!root)return {route:r,healthy:false,reason:'pageRoot missing'};
  if(!m)return {route:r,healthy:true,managed:false};
  const page=root.querySelector(m.root);
  if(!page)return {route:r,healthy:false,reason:`workspace ${m.root} missing`};
  if(m.card&&!page.querySelector(m.card))return {route:r,healthy:false,reason:`card ${m.card} missing`};
  return {route:r,healthy:isShown(page),managed:true};
}

function check(){
  if(checking)return;checking=true;
  try{
    installStyle();
    const r=route(),root=document.getElementById(ROOT),m=MANIFEST[r];
    if(!root||!m)return;
    const page=root.querySelector(m.root);
    if(!page){recoverRoute(`missing ${m.root}`);return}
    unhide(page);
    if(m.card){const card=page.querySelector(m.card);if(!card){recoverRoute(`missing ${m.card}`);return}unhide(card)}

    if(/^dashboard\./.test(r))repairDashboard(page);
    else if(r==='release.review')repairReview(page);
    else if(r==='release.distribution')repairDistribution(page);
    else if(r==='system.assets')repairAssets(page);

    root.dataset.octopusIntegrity='healthy';
    root.dataset.octopusIntegrityRoute=r;
  }finally{checking=false}
}

window.OctopusIntegrityGuard={check,report,version:'2.0'};
window.addEventListener('hashchange',()=>{setTimeout(check,0);setTimeout(check,180);setTimeout(check,700)});
window.addEventListener('pageshow',()=>setTimeout(check,80));
window.addEventListener('octopus-language-change',()=>setTimeout(check,120));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(check,80)});

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{check();setTimeout(check,450)},{once:true});
else{check();setTimeout(check,450)}
setInterval(check,CHECK_INTERVAL);
})();