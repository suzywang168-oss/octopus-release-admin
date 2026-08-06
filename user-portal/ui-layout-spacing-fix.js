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
        width:calc(100% - 48px)!important;
        max-width:1480px!important;
        min-height:96px!important;
        padding:22px 0 18px!important;
        margin:24px auto 28px!important;
        box-sizing:border-box!important;
      }
      html.ol2-active #octopusGlobalTitleSlot{
        align-self:center!important;
        padding-top:2px!important;
      }
      html.ol2-active #octopusGlobalTitleSlot h1{
        font-size:23px!important;
        line-height:1.2!important;
      }
      html.ol2-active #octopusGlobalTitleSlot p{
        margin-top:8px!important;
        font-size:9px!important;
        line-height:1.6!important;
      }

      #${ROOT_ID}>.v815page,
      #${ROOT_ID}>.occ-page,
      #${ROOT_ID}>.oge-page{
        width:calc(100% - 48px)!important;
        max-width:1480px!important;
        margin:0 auto!important;
        padding-top:2px!important;
        padding-bottom:64px!important;
        box-sizing:border-box!important;
      }

      #${ROOT_ID} .ol2-standard>.v815kpis{
        gap:16px!important;
        margin-bottom:24px!important;
      }
      #${ROOT_ID} .ol2-standard>.v815kpis .v815kpi{
        min-height:104px!important;
        padding:20px!important;
        border-radius:14px!important;
      }
      #${ROOT_ID} .ol2-standard>.v815kpis .v815kpi span{
        font-size:9px!important;
        line-height:1.45!important;
      }
      #${ROOT_ID} .ol2-standard>.v815kpis .v815kpi strong{
        margin-top:14px!important;
        font-size:23px!important;
      }

      #${ROOT_ID} .ol2-standard>.v815grid{
        margin-bottom:28px!important;
      }
      #${ROOT_ID} .ol2-insight{
        border-radius:14px!important;
      }
      #${ROOT_ID} .ol2-insight .v815ct{
        min-height:54px!important;
        padding:0 18px!important;
      }
      #${ROOT_ID} .ol2-insight .v815ct b{font-size:11px!important}
      #${ROOT_ID} .ol2-insight .v815ct span{font-size:8.5px!important}
      #${ROOT_ID} .ol2-insight .v815ins>div{
        min-height:84px!important;
        padding:18px!important;
      }
      #${ROOT_ID} .ol2-insight .v815ins span{
        font-size:9px!important;
        line-height:1.65!important;
      }

      #${ROOT_ID} .ol2-data-section,
      #${ROOT_ID} .gml-data-section,
      #${ROOT_ID} .cad-data-section{
        margin-top:4px!important;
        margin-bottom:28px!important;
        border-radius:16px!important;
      }
      #${ROOT_ID} .ol2-data-head,
      #${ROOT_ID} .gml-data-head,
      #${ROOT_ID} .cad-data-head{
        align-items:center!important;
        min-height:82px!important;
        padding:20px 18px 18px!important;
        box-sizing:border-box!important;
      }
      #${ROOT_ID} .ol2-data-head h2,
      #${ROOT_ID} .gml-data-head h2,
      #${ROOT_ID} .cad-data-head h2{
        font-size:15px!important;
        line-height:1.35!important;
      }
      #${ROOT_ID} .ol2-data-head p,
      #${ROOT_ID} .gml-data-head p,
      #${ROOT_ID} .cad-data-head p{
        margin-top:7px!important;
        font-size:9px!important;
        line-height:1.6!important;
      }

      #${ROOT_ID} .ols-data-actions{
        display:flex!important;
        align-items:center!important;
        justify-content:flex-end!important;
        gap:10px!important;
        flex:0 0 auto!important;
      }
      #${ROOT_ID} .ols-data-actions .ol2-data-meta,
      #${ROOT_ID} .ols-data-actions .gml-data-meta,
      #${ROOT_ID} .ols-data-actions .cad-data-meta{margin:0!important}
      #${ROOT_ID} .ol2-data-meta,
      #${ROOT_ID} .gml-data-meta,
      #${ROOT_ID} .cad-data-meta{
        min-height:30px!important;
        padding:0 11px!important;
        font-size:8.5px!important;
      }
      #${ROOT_ID} .ols-export-btn{
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        height:36px!important;
        min-width:112px!important;
        padding:0 14px!important;
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
        gap:10px!important;
        padding:14px 16px!important;
      }
      #${ROOT_ID} .ol2-data-section>.v815toolbar>*,
      #${ROOT_ID} .gml-data-section>.v815toolbar>*,
      #${ROOT_ID} .cad-data-section>.v815toolbar>*{
        min-height:38px!important;
        font-size:9px!important;
      }
      #${ROOT_ID} .v815table thead th{
        height:48px!important;
        padding:0 14px!important;
        font-size:8.5px!important;
        line-height:1.4!important;
      }
      #${ROOT_ID} .v815table tbody td{
        height:58px!important;
        padding:12px 14px!important;
        font-size:9px!important;
        line-height:1.6!important;
      }
      #${ROOT_ID} .v815acts{gap:8px!important}
      #${ROOT_ID} .v815act{
        min-height:34px!important;
        padding:0 10px!important;
        font-size:8.5px!important;
      }
      #${ROOT_ID} .ol2-data-section>.v815foot,
      #${ROOT_ID} .gml-data-section>.v815foot,
      #${ROOT_ID} .cad-data-section>.v815foot{
        min-height:48px!important;
        padding:13px 16px!important;
        font-size:8.5px!important;
      }

      @media(max-width:1100px){
        html.ol2-active .ota-toolbar,
        #${ROOT_ID}>.v815page,
        #${ROOT_ID}>.occ-page,
        #${ROOT_ID}>.oge-page{width:calc(100% - 32px)!important}
      }
      @media(max-width:900px){
        html.ol2-active .ota-toolbar{
          min-height:0!important;
          padding-top:18px!important;
          padding-bottom:16px!important;
          margin:16px auto 22px!important;
        }
        #${ROOT_ID}>.v815page,#${ROOT_ID}>.occ-page,#${ROOT_ID}>.oge-page{padding-top:2px!important}
        #${ROOT_ID} .ol2-standard>.v815kpis .v815kpi{min-height:96px!important}
      }
      @media(max-width:680px){
        html.ol2-active .ota-toolbar,
        #${ROOT_ID}>.v815page,
        #${ROOT_ID}>.occ-page,
        #${ROOT_ID}>.oge-page{width:calc(100% - 22px)!important}
        html.ol2-active .ota-toolbar{margin-top:12px!important}
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
