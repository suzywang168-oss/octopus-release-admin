(()=>{
  'use strict';

  const ROOT_ID='pageRoot';
  const STYLE_ID='octopus-layout-spacing-fix';
  const ACTION_ID='octopusGlobalActionHost';

  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const isDashboard=()=>route().startsWith('dashboard.');
  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      html.ol2-active .ota-toolbar{
        min-height:78px!important;
        padding:15px 0 14px!important;
        margin:0 0 22px!important;
      }
      html.ol2-active #octopusGlobalTitleSlot h1{font-size:22px!important}
      html.ol2-active #octopusGlobalTitleSlot p{margin-top:7px!important;line-height:1.55!important}

      #${ROOT_ID}>.v815page,
      #${ROOT_ID}>.occ-page,
      #${ROOT_ID}>.oge-page{
        max-width:1440px!important;
        margin:0 auto!important;
        padding-top:8px!important;
        padding-bottom:48px!important;
      }

      #${ROOT_ID} .ol2-standard>.v815kpis{
        gap:14px!important;
        margin-bottom:20px!important;
      }
      #${ROOT_ID} .ol2-standard>.v815kpis .v815kpi{
        min-height:92px!important;
        padding:17px 18px!important;
      }
      #${ROOT_ID} .ol2-standard>.v815kpis .v815kpi strong{
        margin-top:12px!important;
        font-size:22px!important;
      }

      #${ROOT_ID} .ol2-standard>.v815grid{
        margin-bottom:22px!important;
      }
      #${ROOT_ID} .ol2-insight .v815ct{
        min-height:48px!important;
        padding:0 16px!important;
      }
      #${ROOT_ID} .ol2-insight .v815ins>div{
        min-height:72px!important;
        padding:16px!important;
      }

      #${ROOT_ID} .ol2-data-section,
      #${ROOT_ID} .gml-data-section,
      #${ROOT_ID} .cad-data-section{
        margin-top:2px!important;
        border-radius:14px!important;
      }
      #${ROOT_ID} .ol2-data-head,
      #${ROOT_ID} .gml-data-head,
      #${ROOT_ID} .cad-data-head{
        align-items:center!important;
        min-height:66px!important;
        padding:16px 16px 14px!important;
        box-sizing:border-box!important;
      }
      #${ROOT_ID} .ol2-data-head h2,
      #${ROOT_ID} .gml-data-head h2,
      #${ROOT_ID} .cad-data-head h2{font-size:13px!important}
      #${ROOT_ID} .ol2-data-head p,
      #${ROOT_ID} .gml-data-head p,
      #${ROOT_ID} .cad-data-head p{margin-top:6px!important;line-height:1.55!important}

      #${ROOT_ID} .ols-data-actions{
        display:flex!important;
        align-items:center!important;
        justify-content:flex-end!important;
        gap:9px!important;
        flex:0 0 auto!important;
      }
      #${ROOT_ID} .ols-data-actions .ol2-data-meta,
      #${ROOT_ID} .ols-data-actions .gml-data-meta,
      #${ROOT_ID} .ols-data-actions .cad-data-meta{margin:0!important}
      #${ROOT_ID} .ols-export-btn{
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        height:34px!important;
        min-width:108px!important;
        padding:0 13px!important;
        margin:0!important;
        border:1px solid #6683df!important;
        border-radius:9px!important;
        background:#6683df!important;
        color:#fff!important;
        font-size:9px!important;
        font-weight:750!important;
        white-space:nowrap!important;
        cursor:pointer!important;
      }
      #${ROOT_ID} .ols-export-btn:hover{filter:brightness(1.06)!important}

      #${ROOT_ID} .ol2-data-section>.v815toolbar,
      #${ROOT_ID} .gml-data-section>.v815toolbar,
      #${ROOT_ID} .cad-data-section>.v815toolbar{
        padding:12px 14px!important;
      }
      #${ROOT_ID} .v815table th{height:42px!important}
      #${ROOT_ID} .v815table td{height:48px!important}
      #${ROOT_ID} .ol2-data-section>.v815foot,
      #${ROOT_ID} .gml-data-section>.v815foot,
      #${ROOT_ID} .cad-data-section>.v815foot{
        padding:12px 14px!important;
      }

      @media(max-width:900px){
        html.ol2-active .ota-toolbar{min-height:0!important;padding-top:12px!important;margin-bottom:18px!important}
        #${ROOT_ID}>.v815page,#${ROOT_ID}>.occ-page,#${ROOT_ID}>.oge-page{padding-top:4px!important}
      }
      @media(max-width:680px){
        #${ROOT_ID} .ol2-data-head,
        #${ROOT_ID} .gml-data-head,
        #${ROOT_ID} .cad-data-head{align-items:flex-start!important;flex-direction:column!important}
        #${ROOT_ID} .ols-data-actions{width:100%!important;justify-content:space-between!important}
        #${ROOT_ID} .ols-export-btn{flex:1!important}
      }
    `;
  }

  function dataHeader(){
    return document.querySelector(`#${ROOT_ID} .ol2-data-head,#${ROOT_ID} .gml-data-head,#${ROOT_ID} .cad-data-head`);
  }

  function findExportButton(){
    const host=document.getElementById(ACTION_ID);
    if(!host)return null;
    return [...host.querySelectorAll('button')].find(button=>/导出.*报表|导出剧集报表|Export.*report/i.test(clean(button.textContent)))||null;
  }

  function moveDashboardExport(){
    const header=dataHeader();
    if(!header)return;

    let actions=header.querySelector('.ols-data-actions');
    if(!actions){
      actions=document.createElement('div');
      actions.className='ols-data-actions';
      const meta=header.querySelector('.ol2-data-meta,.gml-data-meta,.cad-data-meta');
      if(meta)actions.appendChild(meta);
      header.appendChild(actions);
    }

    if(!isDashboard()){
      const moved=actions.querySelector('[data-ols-export]');
      const host=document.getElementById(ACTION_ID);
      if(moved&&host){moved.classList.remove('ols-export-btn');moved.removeAttribute('data-ols-export');host.appendChild(moved)}
      return;
    }

    const exportButton=findExportButton();
    if(exportButton){
      exportButton.classList.add('ols-export-btn');
      exportButton.dataset.olsExport='1';
      actions.appendChild(exportButton);
    }
  }

  let pending=false;
  function apply(){
    pending=false;
    installStyle();
    moveDashboardExport();
  }
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(apply)}

  window.addEventListener('hashchange',schedule);
  window.addEventListener('resize',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,350);setTimeout(schedule,900);setTimeout(schedule,1800);
})();
