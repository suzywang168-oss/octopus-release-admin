(()=>{
  'use strict';

  const STYLE_ID='octopus-shell-alignment-fix';
  const SETTINGS_ID='octopusSettingsMenu';
  const LANG_KEY='octopus-user-v7-language';
  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const en=()=>localStorage.getItem(LANG_KEY)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      .ota-toolbar{position:relative!important;z-index:3!important;justify-content:flex-end!important;align-items:center!important;gap:8px!important;min-height:44px!important;padding:0 0 7px!important;margin:0 0 7px!important;box-sizing:border-box!important}
      .ota-toolbar>input,.ota-toolbar .ota-search-host{order:2!important;flex:0 1 420px!important;width:min(420px,38vw)!important;min-width:280px!important;max-width:420px!important;margin-left:auto!important}
      .ota-actions{order:3!important;flex:0 0 auto!important;width:auto!important;margin-left:0!important}
      .ota-settings-button{display:none!important}#${SETTINGS_ID}{display:none!important}
      #pageRoot{padding-top:0!important;overflow:visible!important}
      #pageRoot .v815page,#pageRoot .occ-page{padding-top:2px!important}
      #pageRoot .v815head,#pageRoot .occ-head{position:relative!important;z-index:1!important;clear:both!important;margin-top:0!important;margin-bottom:14px!important;padding-top:3px!important}
      #pageRoot .v815head h1,#pageRoot .v815head h2,#pageRoot .occ-head h1{line-height:1.18!important}
      #pageRoot .v815head>div:last-child,#pageRoot .occ-head-actions{position:relative!important;z-index:2!important;flex-shrink:0!important}
      #pageRoot .occ-pipeline,#pageRoot .occ-pipeline button,#pageRoot .occ-pipeline span,#pageRoot .occ-pipeline b,#pageRoot .occ-pipeline small{font-family:Inter,-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",Arial,sans-serif!important;text-rendering:optimizeLegibility!important}
      @media(max-width:860px){.ota-toolbar{flex-wrap:wrap!important;padding-bottom:6px!important}.ota-toolbar>input,.ota-toolbar .ota-search-host{order:1!important;flex:1 1 100%!important;width:100%!important;min-width:0!important;max-width:none!important;margin-left:0!important}.ota-actions{order:2!important;margin-left:auto!important}#pageRoot .v815head,#pageRoot .occ-head{padding-top:2px!important}}
    `;
  }

  function removeDuplicateSettings(){
    document.querySelectorAll('.ota-settings-button').forEach(button=>button.remove());
    document.getElementById(SETTINGS_ID)?.classList.remove('open');
  }

  function findSearch(){
    return [...document.querySelectorAll('input')].find(input=>/搜索项目|搜索.*任务|搜索.*剧集|Search.*project/i.test(input.placeholder||''))||null;
  }

  function normalizeToolbar(){
    const input=findSearch();if(!input)return;
    input.type='search';
    input.setAttribute('aria-label',en()?'Global search':'全局搜索');
    const zhPlaceholder='搜索项目、任务、集数、合同或结算单';
    const enPlaceholder='Search projects, tasks, episodes, contracts, or settlements';
    if(input.placeholder===zhPlaceholder||input.placeholder===enPlaceholder)input.placeholder=en()?enPlaceholder:zhPlaceholder;
    input.closest('.ota-toolbar')?.classList.add('osa-right-search');
  }

  const PIPELINE={
    zh:{
      title:'发行流程进度',description:'点击阶段直接进入对应工作台，重点关注黄色阶段。',link:'查看全部任务',
      stages:[
        ['选品阶段','完成 78%','18','候选发行项目','3 部待决策'],
        ['内容加工','完成 64%','12','生产处理中','5 个任务有阻塞'],
        ['物料制作','完成 72%','24','待生成或审核','6 组等待审核'],
        ['渠道分发','完成 84%','19','待分发任务','2 个频道限流'],
        ['监控迭代','健康 91%','42','上线剧集','4 部需要优化']
      ]
    },
    en:{
      title:'Release Pipeline',description:'Open each stage directly and focus on stages that need attention.',link:'View all tasks',
      stages:[
        ['Selection','78% complete','18','Distribution candidates','3 awaiting decision'],
        ['Processing','64% complete','12','In production','5 blocked tasks'],
        ['Creative','72% complete','24','Pending generation or review','6 sets awaiting review'],
        ['Distribution','84% complete','19','Pending distribution','2 channels rate-limited'],
        ['Monitoring','91% healthy','42','Live series','4 need optimization']
      ]
    }
  };

  function repairPipeline(){
    if(route()!=='overview')return;
    const pipeline=document.querySelector('#pageRoot .occ-pipeline');if(!pipeline)return;
    const data=en()?PIPELINE.en:PIPELINE.zh;
    const heading=pipeline.querySelector('.occ-section-title h2');
    const description=pipeline.querySelector('.occ-section-title p');
    const link=pipeline.querySelector('.occ-section-title .occ-link');
    if(heading)heading.textContent=data.title;
    if(description)description.textContent=data.description;
    if(link)link.textContent=data.link;
    pipeline.querySelectorAll('.occ-stage').forEach((stage,index)=>{
      const values=data.stages[index];if(!values)return;
      const top=stage.querySelectorAll('.occ-stage-top span');
      if(top[0])top[0].textContent=values[0];if(top[1])top[1].textContent=values[1];
      const strong=stage.querySelector('strong'),label=stage.querySelector('b'),note=stage.querySelector('small');
      if(strong)strong.textContent=values[2];if(label)label.textContent=values[3];if(note)note.textContent=values[4];
    });
    pipeline.setAttribute('lang',en()?'en':'zh-CN');
    pipeline.dataset.encodingRepaired='1';
  }

  let pending=false;
  function apply(){pending=false;installStyle();removeDuplicateSettings();normalizeToolbar();repairPipeline()}
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(apply)}

  window.addEventListener('hashchange',schedule);
  window.addEventListener('resize',schedule);
  window.addEventListener('octopus-language-change',schedule);
  window.addEventListener('storage',e=>{if(e.key===LANG_KEY)schedule()});
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['lang']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,350);setTimeout(schedule,1000);setTimeout(schedule,1900);
})();
