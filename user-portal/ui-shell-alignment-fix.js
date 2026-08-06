(()=>{
  'use strict';

  const STYLE_ID='octopus-shell-alignment-fix';
  const SETTINGS_ID='octopusSettingsMenu';

  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();
  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){
      style=document.createElement('style');
      style.id=STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent=`
      /* Search and utility controls stay on the right. */
      .ota-toolbar{
        justify-content:flex-end!important;
        align-items:center!important;
        gap:8px!important;
        min-height:42px!important;
        padding-top:0!important;
        margin-top:0!important;
        margin-bottom:2px!important
      }
      .ota-toolbar>input,
      .ota-toolbar .ota-search-host{
        order:2!important;
        flex:0 1 420px!important;
        width:min(420px,38vw)!important;
        min-width:280px!important;
        max-width:420px!important;
        margin-left:auto!important
      }
      .ota-actions{
        order:3!important;
        flex:0 0 auto!important;
        width:auto!important;
        margin-left:0!important
      }

      /* The native bottom-left settings center is the only settings entry. */
      .ota-settings-button{display:none!important}
      #${SETTINGS_ID}{display:none!important}

      /* Pull page titles closer to the top bar. */
      #pageRoot{padding-top:0!important}
      #pageRoot .v815page{padding-top:0!important}
      #pageRoot .v815head{
        margin-top:-10px!important;
        margin-bottom:12px!important
      }
      #pageRoot .occ-page{padding-top:0!important}
      #pageRoot .occ-head{
        margin-top:-12px!important;
        margin-bottom:14px!important
      }
      #pageRoot .occ-head h1,
      #pageRoot .v815head h1,
      #pageRoot .v815head h2{line-height:1.15!important}

      /* Keep the pipeline text legible and immune to inherited compact styles. */
      #pageRoot .occ-pipeline,
      #pageRoot .occ-pipeline button,
      #pageRoot .occ-pipeline span,
      #pageRoot .occ-pipeline b,
      #pageRoot .occ-pipeline small{
        font-family:Inter,-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",Arial,sans-serif!important;
        text-rendering:optimizeLegibility!important
      }

      @media(max-width:860px){
        .ota-toolbar{flex-wrap:wrap!important}
        .ota-toolbar>input,
        .ota-toolbar .ota-search-host{
          order:1!important;
          flex:1 1 100%!important;
          width:100%!important;
          min-width:0!important;
          max-width:none!important;
          margin-left:0!important
        }
        .ota-actions{order:2!important;margin-left:auto!important}
        #pageRoot .v815head,#pageRoot .occ-head{margin-top:-4px!important}
      }
    `;
  }

  function removeDuplicateSettings(){
    document.querySelectorAll('.ota-settings-button').forEach(button=>button.remove());
    document.getElementById(SETTINGS_ID)?.classList.remove('open');
  }

  function findSearch(){
    return [...document.querySelectorAll('input')].find(input=>
      /搜索项目|搜索.*任务|搜索.*剧集|Search.*project/i.test(input.placeholder||'')
    )||null;
  }

  function normalizeToolbar(){
    const input=findSearch();
    if(!input)return;
    input.type='search';
    input.setAttribute('aria-label','全局搜索');
    const bar=input.closest('.ota-toolbar');
    if(!bar)return;
    bar.classList.add('osa-right-search');
  }

  const PIPELINE={
    title:'\u53d1\u884c\u6d41\u7a0b\u8fdb\u5ea6',
    description:'\u70b9\u51fb\u9636\u6bb5\u76f4\u63a5\u8fdb\u5165\u5bf9\u5e94\u5de5\u4f5c\u53f0\uff0c\u91cd\u70b9\u5173\u6ce8\u9ec4\u8272\u9636\u6bb5\u3002',
    link:'\u67e5\u770b\u5168\u90e8\u4efb\u52a1',
    stages:[
      ['\u9009\u54c1\u9636\u6bb5','\u5b8c\u6210 78%','18','\u5019\u9009\u53d1\u884c\u9879\u76ee','3 \u90e8\u5f85\u51b3\u7b56'],
      ['\u5185\u5bb9\u52a0\u5de5','\u5b8c\u6210 64%','12','\u751f\u4ea7\u5904\u7406\u4e2d','5 \u4e2a\u4efb\u52a1\u6709\u963b\u585e'],
      ['\u7269\u6599\u5236\u4f5c','\u5b8c\u6210 72%','24','\u5f85\u751f\u6210\u6216\u5ba1\u6838','6 \u7ec4\u7b49\u5f85\u5ba1\u6838'],
      ['\u6e20\u9053\u5206\u53d1','\u5b8c\u6210 84%','19','\u5f85\u5206\u53d1\u4efb\u52a1','2 \u4e2a\u9891\u9053\u9650\u6d41'],
      ['\u76d1\u63a7\u8fed\u4ee3','\u5065\u5eb7 91%','42','\u4e0a\u7ebf\u5267\u96c6','4 \u90e8\u9700\u8981\u4f18\u5316']
    ]
  };

  function repairPipeline(){
    if(route()!=='overview')return;
    const pipeline=document.querySelector('#pageRoot .occ-pipeline');
    if(!pipeline)return;

    const heading=pipeline.querySelector('.occ-section-title h2');
    const description=pipeline.querySelector('.occ-section-title p');
    const link=pipeline.querySelector('.occ-section-title .occ-link');
    if(heading)heading.textContent=PIPELINE.title;
    if(description)description.textContent=PIPELINE.description;
    if(link)link.textContent=PIPELINE.link;

    pipeline.querySelectorAll('.occ-stage').forEach((stage,index)=>{
      const values=PIPELINE.stages[index];
      if(!values)return;
      const top=stage.querySelectorAll('.occ-stage-top span');
      if(top[0])top[0].textContent=values[0];
      if(top[1])top[1].textContent=values[1];
      const strong=stage.querySelector('strong');
      const label=stage.querySelector('b');
      const note=stage.querySelector('small');
      if(strong)strong.textContent=values[2];
      if(label)label.textContent=values[3];
      if(note)note.textContent=values[4];
      stage.setAttribute('lang','zh-CN');
    });
    pipeline.setAttribute('lang','zh-CN');
    pipeline.dataset.encodingRepaired='1';
  }

  let pending=false;
  function apply(){
    pending=false;
    installStyle();
    removeDuplicateSettings();
    normalizeToolbar();
    repairPipeline();
  }
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(apply);
  }

  window.addEventListener('hashchange',schedule);
  window.addEventListener('resize',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,350);
  setTimeout(schedule,1000);
  setTimeout(schedule,1900);
})();
