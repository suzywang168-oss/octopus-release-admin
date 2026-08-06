(()=>{
  'use strict';

  const ROOT_ID='pageRoot';
  const STYLE_ID='octopus-global-module-layout';
  const TITLE_SLOT_ID='octopusGlobalTitleSlot';
  const ROUTE_LABELS={
    operations:['分析结果与任务','汇总运营分析、风险判断与可执行任务。'],
    production:['生产任务列表','查看素材处理、AI 加工与质检进度。'],
    release:['发行任务列表','管理物料生成、审核与渠道分发任务。'],
    dashboard:['数据明细','查看核心指标、趋势与异常记录。'],
    system:['配置与记录','管理系统配置、权限与异步任务记录。']
  };

  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      html.gml-active .ota-toolbar{
        display:grid!important;
        grid-template-columns:minmax(260px,1fr) minmax(300px,420px) auto!important;
        align-items:center!important;
        gap:10px!important;
        width:100%!important;
        min-height:60px!important;
        padding:7px 0 9px!important;
        margin:0 0 8px!important;
        border-bottom:1px solid var(--line)!important;
        box-sizing:border-box!important;
        overflow:visible!important
      }
      html.gml-active #${TITLE_SLOT_ID}{
        grid-column:1!important;
        grid-row:1!important;
        min-width:0!important;
        padding:0!important
      }
      html.gml-active #${TITLE_SLOT_ID} h1{
        margin:0!important;
        color:var(--text)!important;
        font-size:20px!important;
        line-height:1.18!important;
        letter-spacing:-.02em!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important
      }
      html.gml-active #${TITLE_SLOT_ID} p{
        max-width:720px!important;
        margin:5px 0 0!important;
        color:var(--soft)!important;
        font-size:8px!important;
        line-height:1.45!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important
      }
      html.gml-active .ota-toolbar>input,
      html.gml-active .ota-toolbar .ota-search-host{
        grid-column:2!important;
        grid-row:1!important;
        order:unset!important;
        width:100%!important;
        min-width:0!important;
        max-width:none!important;
        margin:0!important;
        align-self:center!important
      }
      html.gml-active .ota-actions{
        grid-column:3!important;
        grid-row:1!important;
        order:unset!important;
        width:auto!important;
        margin:0!important;
        justify-self:end!important;
        align-self:center!important
      }

      #${ROOT_ID} .gml-source-head{display:none!important}
      #${ROOT_ID} .gml-page-actions{
        display:flex!important;
        align-items:center!important;
        justify-content:flex-end!important;
        gap:8px!important;
        min-height:36px!important;
        margin:0 0 10px!important;
        padding:0!important
      }
      #${ROOT_ID} .gml-page-actions:empty{display:none!important}
      #${ROOT_ID} .gml-page-actions.gml-editor-actions{justify-content:space-between!important}
      #${ROOT_ID} .gml-page-actions .gml-action-right{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;margin-left:auto!important}
      #${ROOT_ID} .gml-page-actions .occ-head-actions,
      #${ROOT_ID} .gml-page-actions .oge-head-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;padding:0!important;margin:0!important}
      #${ROOT_ID} .gml-page-actions .v815primary,
      #${ROOT_ID} .gml-page-actions .occ-btn,
      #${ROOT_ID} .gml-page-actions .oge-btn{
        min-height:34px!important;
        height:34px!important;
        padding:0 14px!important;
        margin:0!important;
        border-radius:9px!important;
        font-size:9px!important;
        white-space:nowrap!important
      }

      #${ROOT_ID} .gml-module-page{padding-top:0!important}
      #${ROOT_ID} .gml-module-page>.v815flow{display:none!important}
      #${ROOT_ID} .gml-module-page>.v815kpis{
        display:grid!important;
        grid-template-columns:repeat(4,minmax(0,1fr))!important;
        gap:10px!important;
        margin:0 0 12px!important
      }
      #${ROOT_ID} .gml-module-page>.v815kpis .v815kpi{
        min-height:72px!important;
        padding:13px 14px!important;
        border-radius:11px!important
      }
      #${ROOT_ID} .gml-module-page>.v815kpis .v815kpi span{font-size:8px!important}
      #${ROOT_ID} .gml-module-page>.v815kpis .v815kpi strong{margin-top:8px!important;font-size:20px!important;line-height:1!important}
      #${ROOT_ID} .gml-module-page>.v815grid{display:block!important;margin:0 0 12px!important}
      #${ROOT_ID} .gml-module-page>.v815grid>.v815card:not(.gml-insight-card){display:none!important}
      #${ROOT_ID} .gml-insight-card{
        width:100%!important;
        min-height:0!important;
        padding:0!important;
        border-radius:12px!important;
        overflow:hidden!important
      }
      #${ROOT_ID} .gml-insight-card .v815ct{
        min-height:42px!important;
        padding:0 14px!important;
        border-bottom:1px solid var(--line)!important
      }
      #${ROOT_ID} .gml-insight-card .v815ct b{font-size:10px!important}
      #${ROOT_ID} .gml-insight-card .v815ct span{font-size:8px!important}
      #${ROOT_ID} .gml-insight-card .v815ins{
        display:grid!important;
        grid-template-columns:repeat(3,minmax(0,1fr))!important;
        gap:0!important;
        padding:0!important
      }
      #${ROOT_ID} .gml-insight-card .v815ins>div{
        display:grid!important;
        grid-template-columns:8px minmax(0,1fr)!important;
        align-items:start!important;
        gap:9px!important;
        min-height:64px!important;
        padding:14px!important;
        margin:0!important;
        border-right:1px solid var(--line)!important;
        background:transparent!important
      }
      #${ROOT_ID} .gml-insight-card .v815ins>div:last-child{border-right:0!important}
      #${ROOT_ID} .gml-insight-card .v815ins i{margin-top:4px!important}
      #${ROOT_ID} .gml-insight-card .v815ins span{color:var(--text)!important;font-size:9px!important;line-height:1.6!important}

      #${ROOT_ID} .gml-data-section,
      #${ROOT_ID} .cad-data-section{
        border:1px solid var(--line)!important;
        border-radius:12px!important;
        background:var(--panel)!important;
        overflow:hidden!important
      }
      #${ROOT_ID} .gml-data-head,
      #${ROOT_ID} .cad-data-head{
        display:flex!important;
        align-items:flex-start!important;
        justify-content:space-between!important;
        gap:18px!important;
        padding:14px 14px 11px!important;
        border-bottom:1px solid var(--line)!important
      }
      #${ROOT_ID} .gml-data-head h2,
      #${ROOT_ID} .cad-data-head h2{margin:0!important;color:var(--text)!important;font-size:12px!important;line-height:1.35!important}
      #${ROOT_ID} .gml-data-head p,
      #${ROOT_ID} .cad-data-head p{margin:5px 0 0!important;color:var(--soft)!important;font-size:8px!important;line-height:1.5!important}
      #${ROOT_ID} .gml-data-meta,
      #${ROOT_ID} .cad-data-meta{
        display:inline-flex!important;
        align-items:center!important;
        min-height:27px!important;
        padding:0 9px!important;
        border:1px solid var(--line)!important;
        border-radius:999px!important;
        background:var(--panel2)!important;
        color:var(--soft)!important;
        font-size:8px!important;
        white-space:nowrap!important
      }
      #${ROOT_ID} .gml-data-section>.gen-list-switch,
      #${ROOT_ID} .cad-data-section>.gen-list-switch{margin:10px 12px 0!important}
      #${ROOT_ID} .gml-data-section>.v815toolbar,
      #${ROOT_ID} .cad-data-section>.v815toolbar{
        display:grid!important;
        grid-template-columns:minmax(260px,1fr) 170px 150px auto!important;
        gap:8px!important;
        align-items:center!important;
        margin:0!important;
        padding:10px 12px!important;
        border-bottom:1px solid var(--line)!important;
        background:color-mix(in srgb,var(--panel2) 55%,var(--panel))!important
      }
      #${ROOT_ID} .gml-data-section>.v815toolbar>*,
      #${ROOT_ID} .cad-data-section>.v815toolbar>*{
        width:100%!important;
        min-width:0!important;
        height:34px!important;
        box-sizing:border-box!important;
        margin:0!important
      }
      #${ROOT_ID} .gml-data-section>.v815toolbar button,
      #${ROOT_ID} .cad-data-section>.v815toolbar button{width:auto!important;white-space:nowrap!important}
      #${ROOT_ID} .gml-data-section>.v815tw,
      #${ROOT_ID} .cad-data-section>.v815tw{margin:0!important;border:0!important;border-radius:0!important;overflow:auto!important}
      #${ROOT_ID} .gml-data-section .v815table,
      #${ROOT_ID} .cad-data-section .v815table{border:0!important}
      #${ROOT_ID} .gml-data-section>.v815foot,
      #${ROOT_ID} .cad-data-section>.v815foot{margin:0!important;padding:10px 12px!important;border-top:1px solid var(--line)!important}

      #${ROOT_ID} .occ-page>.occ-head{display:none!important}
      #${ROOT_ID} .occ-pipeline .occ-flow{
        display:grid!important;
        grid-template-columns:repeat(5,minmax(0,1fr))!important;
        gap:9px!important
      }
      #${ROOT_ID} .occ-pipeline .occ-stage{
        min-width:0!important;
        padding:13px!important;
        text-align:left!important;
        font-family:Inter,-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",Arial,sans-serif!important
      }
      #${ROOT_ID} .occ-pipeline .occ-stage-top{display:flex!important;justify-content:space-between!important;gap:8px!important;font-size:8px!important}
      #${ROOT_ID} .occ-pipeline .occ-stage strong{display:block!important;margin-top:12px!important;font-size:22px!important;line-height:1!important}
      #${ROOT_ID} .occ-pipeline .occ-stage b{display:block!important;margin-top:6px!important;font-size:9px!important;line-height:1.4!important}
      #${ROOT_ID} .occ-pipeline .occ-stage small{display:block!important;margin-top:5px!important;font-size:8px!important;line-height:1.45!important}

      @media(max-width:1180px){
        html.gml-active .ota-toolbar{grid-template-columns:minmax(220px,1fr) minmax(260px,360px) auto!important}
        #${ROOT_ID} .occ-pipeline .occ-flow{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      }
      @media(max-width:900px){
        html.gml-active .ota-toolbar{grid-template-columns:1fr auto!important}
        html.gml-active #${TITLE_SLOT_ID}{grid-column:1/-1!important;grid-row:1!important}
        html.gml-active .ota-toolbar>input,
        html.gml-active .ota-toolbar .ota-search-host{grid-column:1!important;grid-row:2!important}
        html.gml-active .ota-actions{grid-column:2!important;grid-row:2!important}
        #${ROOT_ID} .gml-module-page>.v815kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        #${ROOT_ID} .gml-data-section>.v815toolbar,
        #${ROOT_ID} .cad-data-section>.v815toolbar{grid-template-columns:1fr 1fr!important}
        #${ROOT_ID} .gml-data-section>.v815toolbar input,
        #${ROOT_ID} .cad-data-section>.v815toolbar input{grid-column:1/-1!important}
      }
      @media(max-width:680px){
        html.gml-active .ota-toolbar{grid-template-columns:1fr!important}
        html.gml-active #${TITLE_SLOT_ID},
        html.gml-active .ota-toolbar>input,
        html.gml-active .ota-toolbar .ota-search-host,
        html.gml-active .ota-actions{grid-column:1!important;grid-row:auto!important}
        html.gml-active .ota-actions{justify-self:end!important}
        #${ROOT_ID} .gml-page-actions{align-items:stretch!important;flex-direction:column!important}
        #${ROOT_ID} .gml-page-actions .occ-head-actions,
        #${ROOT_ID} .gml-page-actions .oge-head-actions{width:100%!important}
        #${ROOT_ID} .gml-page-actions button{flex:1!important}
        #${ROOT_ID} .gml-module-page>.v815kpis{grid-template-columns:1fr!important}
        #${ROOT_ID} .gml-insight-card .v815ins{grid-template-columns:1fr!important}
        #${ROOT_ID} .gml-insight-card .v815ins>div{border-right:0!important;border-bottom:1px solid var(--line)!important}
        #${ROOT_ID} .gml-insight-card .v815ins>div:last-child{border-bottom:0!important}
        #${ROOT_ID} .gml-data-section>.v815toolbar,
        #${ROOT_ID} .cad-data-section>.v815toolbar{grid-template-columns:1fr!important}
        #${ROOT_ID} .gml-data-section>.v815toolbar input,
        #${ROOT_ID} .cad-data-section>.v815toolbar input{grid-column:auto!important}
        #${ROOT_ID} .occ-pipeline .occ-flow{grid-template-columns:1fr!important}
      }
    `;
  }

  function getPage(){
    const root=document.getElementById(ROOT_ID);
    if(!root)return null;
    return root.querySelector(':scope>.oge-page,:scope>.occ-page,:scope>.v815page');
  }

  function getSourceHead(page){
    return page?.querySelector(':scope>.oge-head,:scope>.occ-head,:scope>.v815head')||null;
  }

  function titleCopy(head){
    if(!head)return null;
    const title=clean(head.querySelector('h1,h2')?.textContent);
    const description=clean(head.querySelector('p')?.textContent);
    return title?{title,description}:null;
  }

  function ensureTitleSlot(copy){
    const toolbar=document.querySelector('.ota-toolbar');
    if(!toolbar||!copy)return;
    let slot=document.getElementById(TITLE_SLOT_ID);
    if(!slot){slot=document.createElement('div');slot.id=TITLE_SLOT_ID;toolbar.insertBefore(slot,toolbar.firstChild)}
    slot.innerHTML=`<h1></h1><p></p>`;
    slot.querySelector('h1').textContent=copy.title;
    slot.querySelector('p').textContent=copy.description;
  }

  function ensureActionBar(page,head){
    if(!page||!head)return;
    let bar=page.querySelector(':scope>.gml-page-actions');
    if(!bar){bar=document.createElement('div');bar.className='gml-page-actions';page.insertBefore(bar,page.firstChild)}

    if(head.classList.contains('oge-head')){
      bar.classList.add('gml-editor-actions');
      const back=head.querySelector('.oge-back');
      const group=head.querySelector('.oge-head-actions');
      if(back&&!bar.contains(back))bar.appendChild(back);
      if(group&&!bar.contains(group)){const right=document.createElement('div');right.className='gml-action-right';right.appendChild(group);bar.appendChild(right)}
    }else if(head.classList.contains('occ-head')){
      const group=head.querySelector('.occ-head-actions');
      if(group&&!bar.contains(group))bar.appendChild(group);
    }else{
      [...head.querySelectorAll(':scope>button')].forEach(button=>{if(!bar.contains(button))bar.appendChild(button)});
    }
    head.classList.add('gml-source-head');
  }

  function sectionCopy(currentRoute){
    const group=currentRoute.split('.')[0];
    return ROUTE_LABELS[group]||['数据与任务列表','查看当前模块的数据记录与可执行任务。'];
  }

  function refineInsight(page){
    const grid=page.querySelector(':scope>.v815grid');
    if(!grid)return;
    [...grid.querySelectorAll(':scope>.v815card')].forEach(card=>{
      const title=clean(card.querySelector('.v815ct b')?.textContent);
      if(/核心输出|Primary Output/i.test(title))card.remove();
      else if(/AI洞察|AI Insights|AI 决策摘要/i.test(title)){
        card.classList.add('gml-insight-card');
        const heading=card.querySelector('.v815ct b');
        const status=card.querySelector('.v815ct span');
        if(heading)heading.textContent='AI 决策摘要';
        if(status)status.textContent='基于当前数据实时更新';
      }
    });
  }

  function ensureDataSection(page,currentRoute){
    let section=page.querySelector(':scope>.cad-data-section,:scope>.gml-data-section');
    const toolbar=page.querySelector(':scope>.v815toolbar');
    const tableWrap=page.querySelector(':scope>.v815tw');
    const foot=page.querySelector(':scope>.v815foot');
    const switcher=page.querySelector(':scope>.gen-list-switch');

    if(!section){
      if(!toolbar||!tableWrap||!foot)return;
      const copy=sectionCopy(currentRoute);
      section=document.createElement('section');
      section.className='gml-data-section';
      section.innerHTML=`<header class="gml-data-head"><div><h2></h2><p></p></div><span class="gml-data-meta">8 条记录 · 每页 8 条</span></header>`;
      section.querySelector('h2').textContent=copy[0];
      section.querySelector('p').textContent=copy[1];
      page.appendChild(section);
    }else section.classList.add('gml-data-section');

    if(switcher&&!section.contains(switcher))section.appendChild(switcher);
    if(toolbar&&!section.contains(toolbar))section.appendChild(toolbar);
    if(tableWrap&&!section.contains(tableWrap))section.appendChild(tableWrap);
    if(foot&&!section.contains(foot))section.appendChild(foot);
  }

  const PIPELINE=[
    ['operations.channel-analysis','\u9009\u54c1\u9636\u6bb5','\u5b8c\u6210 78%','18','\u5019\u9009\u53d1\u884c\u9879\u76ee','3 \u90e8\u5f85\u51b3\u7b56',78],
    ['production.content','\u5185\u5bb9\u52a0\u5de5','\u5b8c\u6210 64%','12','\u751f\u4ea7\u5904\u7406\u4e2d','5 \u4e2a\u4efb\u52a1\u6709\u963b\u585e',64],
    ['release.titles','\u7269\u6599\u5236\u4f5c','\u5b8c\u6210 72%','24','\u5f85\u751f\u6210\u6216\u5ba1\u6838','6 \u7ec4\u7b49\u5f85\u5ba1\u6838',72],
    ['release.distribution','\u6e20\u9053\u5206\u53d1','\u5b8c\u6210 84%','19','\u5f85\u5206\u53d1\u4efb\u52a1','2 \u4e2a\u9891\u9053\u9650\u6d41',84],
    ['dashboard.series','\u76d1\u63a7\u8fed\u4ee3','\u5065\u5eb7 91%','42','\u4e0a\u7ebf\u5267\u96c6','4 \u90e8\u9700\u8981\u4f18\u5316',91]
  ];

  function repairOverviewPipeline(page){
    const pipeline=page.querySelector('.occ-pipeline');
    if(!pipeline)return;
    const title=pipeline.querySelector('.occ-section-title h2');
    const description=pipeline.querySelector('.occ-section-title p');
    const link=pipeline.querySelector('.occ-section-title .occ-link');
    if(title)title.textContent='\u53d1\u884c\u6d41\u7a0b\u8fdb\u5ea6';
    if(description)description.textContent='\u6309\u4e94\u4e2a\u5173\u952e\u9636\u6bb5\u67e5\u770b\u5f53\u524d\u4efb\u52a1\u3001\u963b\u585e\u4e0e\u5b8c\u6210\u7387\u3002';
    if(link)link.textContent='\u67e5\u770b\u5168\u90e8\u4efb\u52a1';
    const flow=pipeline.querySelector('.occ-flow');
    if(!flow)return;
    flow.innerHTML=PIPELINE.map((item,index)=>`<button class="occ-stage ${index===1?'attention':''}" type="button" data-occ-route="${item[0]}"><span class="occ-stage-top"><span>${item[1]}</span><span>${item[2]}</span></span><strong>${item[3]}</strong><b>${item[4]}</b><small>${item[5]}</small><span class="occ-progress"><i style="width:${item[6]}%"></i></span></button>`).join('');
    pipeline.setAttribute('lang','zh-CN');
    pipeline.dataset.gmlPipeline='1';
  }

  function apply(){
    installStyle();
    const page=getPage();
    const head=getSourceHead(page);
    const copy=titleCopy(head);
    const currentRoute=route();
    document.documentElement.classList.toggle('gml-active',Boolean(page&&head&&copy));
    if(!page||!head||!copy)return;

    ensureTitleSlot(copy);
    ensureActionBar(page,head);

    if(page.classList.contains('occ-page')){
      repairOverviewPipeline(page);
      return;
    }
    if(page.classList.contains('oge-page'))return;

    page.classList.add('gml-module-page');
    refineInsight(page);
    ensureDataSection(page,currentRoute);
  }

  let pending=false;
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;apply()});
  }

  window.addEventListener('hashchange',schedule);
  window.addEventListener('resize',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,350);
  setTimeout(schedule,1000);
  setTimeout(schedule,1900);
})();
