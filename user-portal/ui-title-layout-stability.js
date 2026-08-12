(()=>{
  'use strict';
  const STYLE_ID='octopus-title-layout-stability';
  function install(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      /* The toolbar is the single source of truth for module titles. */
      #pageRoot>.v815page>.v815head,
      #pageRoot>.v815page>.gml-source-head,
      #pageRoot>.occ-page>.occ-head,
      #pageRoot>.oge-page>.oge-head{
        display:none!important;
      }

      /* Neutralize the old channel-specific header/layout override. */
      #pageRoot>.v815page.cad-page{
        width:calc(100% - 48px)!important;
        max-width:1480px!important;
        margin:0 auto!important;
        padding-top:2px!important;
        padding-bottom:64px!important;
        box-sizing:border-box!important;
      }
      #pageRoot>.v815page.cad-page>.v815head{display:none!important}

      /* Keep the visible global title aligned with the relaxed shell. */
      html.ol2-active .ota-toolbar,
      html.gml-active .ota-toolbar{
        position:relative!important;
        display:grid!important;
        grid-template-columns:minmax(260px,1fr) minmax(320px,520px) auto!important;
        grid-template-rows:auto!important;
        align-items:center!important;
        gap:14px!important;
        width:calc(100% - 48px)!important;
        max-width:1480px!important;
        min-height:72px!important;
        margin:18px auto 24px!important;
        padding:0 0 14px!important;
        box-sizing:border-box!important;
      }
      html.ol2-active #octopusGlobalTitleSlot,
      html.gml-active #octopusGlobalTitleSlot{
        grid-column:1!important;
        grid-row:1!important;
        min-width:0!important;
        align-self:center!important;
        padding:0!important;
      }
      html.ol2-active .ota-toolbar>input,html.gml-active .ota-toolbar>input,
      html.ol2-active .ota-toolbar .ota-search-host,html.gml-active .ota-toolbar .ota-search-host{
        grid-column:2!important;grid-row:1!important;width:100%!important;min-width:0!important;margin:0!important
      }
      html.ol2-active .ota-actions,html.gml-active .ota-actions{
        grid-column:3!important;grid-row:1!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;margin:0!important
      }
      html.ol2-active #octopusGlobalTitleSlot h1,html.gml-active #octopusGlobalTitleSlot h1{
        margin:0!important;
        font-size:23px!important;
        line-height:1.2!important;
      }
      html.ol2-active #octopusGlobalTitleSlot p,html.gml-active #octopusGlobalTitleSlot p{
        margin:8px 0 0!important;
        line-height:1.6!important;
      }

      @media(max-width:1100px){
        #pageRoot>.v815page.cad-page,
        html.ol2-active .ota-toolbar{width:calc(100% - 32px)!important}
      }
      @media(max-width:680px){
        #pageRoot>.v815page.cad-page,
        html.ol2-active .ota-toolbar{width:calc(100% - 22px)!important}
        html.ol2-active .ota-toolbar{margin-top:12px!important}
      }
    `;
  }
  let pending=false;
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;install()})}
  window.addEventListener('hashchange',schedule);
  window.addEventListener('resize',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,350);setTimeout(schedule,1000);setTimeout(schedule,1800);
})();
