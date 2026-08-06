(()=>{
  'use strict';

  const ROOT_ID='pageRoot';
  const STYLE_ID='octopus-layout-v2';
  const TITLE_ID='octopusGlobalTitleSlot';
  const ACTION_ID='octopusGlobalActionHost';
  const TARGET_VERSION='2';

  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      html.ol2-active body{background:var(--bg)!important}
      html.ol2-active .ota-toolbar{
        display:grid!important;
        grid-template-columns:minmax(300px,1fr) minmax(280px,390px) auto auto!important;
        align-items:center!important;
        gap:10px!important;
        width:100%!important;
        min-height:66px!important;
        padding:8px 0 10px!important;
        margin:0 0 14px!important;
        border-bottom:1px solid var(--line)!important;
        box-sizing:border-box!important;
        overflow:visible!important
      }
      html.ol2-active #${TITLE_ID}{grid-column:1!important;min-width:0!important;padding:0!important}
      html.ol2-active #${TITLE_ID} h1{
        margin:0!important;color:var(--text)!important;font-size:21px!important;line-height:1.18!important;
        letter-spacing:-.02em!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
      }
      html.ol2-active #${TITLE_ID} p{
        max-width:720px!important;margin:5px 0 0!important;color:var(--soft)!important;font-size:8px!important;
        line-height:1.45!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
      }
      html.ol2-active .ota-toolbar>input,
      html.ol2-active .ota-toolbar .ota-search-host{
        grid-column:2!important;width:100%!important;min-width:0!important;max-width:none!important;
        margin:0!important;height:36px!important;box-sizing:border-box!important
      }
      html.ol2-active #${ACTION_ID}{
        grid-column:3!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;
        gap:8px!important;min-width:0!important
      }
      html.ol2-active #${ACTION_ID}:empty{display:none!important}
      html.ol2-active #${ACTION_ID} button{
        display:inline-flex!important;align-items:center!important;justify-content:center!important;height:36px!important;
        min-width:112px!important;padding:0 14px!important;margin:0!important;border-radius:9px!important;
        white-space:nowrap!important;font-size:9px!important;font-weight:750!important;cursor:pointer!important
      }
      html.ol2-active .ota-actions{
        grid-column:4!important;width:auto!important;margin:0!important;justify-self:end!important;align-self:center!important
      }

      #${ROOT_ID}{padding-top:0!important}
      #${ROOT_ID}>.v815page,#${ROOT_ID}>.occ-page{max-width:1480px!important;margin:0 auto!important;padding:0 0 34px!important}
      #${ROOT_ID} .gml-source-head,#${ROOT_ID} .v815head,#${ROOT_ID} .occ-head{display:none!important}
      #${ROOT_ID} .gml-page-actions{display:none!important}
      #${ROOT_ID} .v815flow{display:none!important}

      #${ROOT_ID} .ol2-standard>.v815kpis{
        display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important;margin:0 0 14px!important
      }
      #${ROOT_ID} .ol2-standard>.v815kpis .v815kpi{
        min-height:82px!important;padding:14px 16px!important;border:1px solid var(--line)!important;
        border-radius:12px!important;background:var(--panel)!important;box-sizing:border-box!important
      }
      #${ROOT_ID} .ol2-standard>.v815kpis .v815kpi span{color:var(--soft)!important;font-size:8px!important}
      #${ROOT_ID} .ol2-standard>.v815kpis .v815kpi strong{display:block!important;margin-top:9px!important;font-size:21px!important;line-height:1!important}

      #${ROOT_ID} .ol2-standard>.v815grid{display:block!important;margin:0 0 14px!important}
      #${ROOT_ID} .ol2-standard>.v815grid>.v815card:not(.ol2-insight){display:none!important}
      #${ROOT_ID} .ol2-insight{
        width:100%!important;min-height:0!important;padding:0!important;border:1px solid var(--line)!important;
        border-radius:12px!important;background:var(--panel)!important;overflow:hidden!important
      }
      #${ROOT_ID} .ol2-insight .v815ct{
        display:flex!important;align-items:center!important;justify-content:space-between!important;min-height:40px!important;
        padding:0 14px!important;border-bottom:1px solid var(--line)!important
      }
      #${ROOT_ID} .ol2-insight .v815ct b{font-size:10px!important}
      #${ROOT_ID} .ol2-insight .v815ct span{font-size:8px!important;color:var(--soft)!important}
      #${ROOT_ID} .ol2-insight .v815ins{
        display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:0!important;padding:0!important
      }
      #${ROOT_ID} .ol2-insight .v815ins>div{
        display:grid!important;grid-template-columns:8px minmax(0,1fr)!important;align-items:start!important;gap:9px!important;
        min-height:58px!important;padding:13px 14px!important;margin:0!important;border-right:1px solid var(--line)!important;
        background:transparent!important;box-sizing:border-box!important
      }
      #${ROOT_ID} .ol2-insight .v815ins>div:last-child{border-right:0!important}
      #${ROOT_ID} .ol2-insight .v815ins i{margin-top:4px!important}
      #${ROOT_ID} .ol2-insight .v815ins span{color:var(--text)!important;font-size:9px!important;line-height:1.55!important}

      #${ROOT_ID} .ol2-data-section,
      #${ROOT_ID} .gml-data-section,
      #${ROOT_ID} .cad-data-section{
        border:1px solid var(--line)!important;border-radius:13px!important;background:var(--panel)!important;overflow:hidden!important
      }
      #${ROOT_ID} .ol2-data-head,
      #${ROOT_ID} .gml-data-head,
      #${ROOT_ID} .cad-data-head{
        display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:18px!important;
        padding:14px 14px 12px!important;border-bottom:1px solid var(--line)!important
      }
      #${ROOT_ID} .ol2-data-head h2,
      #${ROOT_ID} .gml-data-head h2,
      #${ROOT_ID} .cad-data-head h2{margin:0!important;color:var(--text)!important;font-size:13px!important;line-height:1.35!important}
      #${ROOT_ID} .ol2-data-head p,
      #${ROOT_ID} .gml-data-head p,
      #${ROOT_ID} .cad-data-head p{margin:5px 0 0!important;color:var(--soft)!important;font-size:8px!important;line-height:1.5!important}
      #${ROOT_ID} .ol2-data-meta,
      #${ROOT_ID} .gml-data-meta,
      #${ROOT_ID} .cad-data-meta{
        display:inline-flex!important;align-items:center!important;min-height:27px!important;padding:0 9px!important;
        border:1px solid var(--line)!important;border-radius:999px!important;background:var(--panel2)!important;
        color:var(--soft)!important;font-size:8px!important;white-space:nowrap!important
      }
      #${ROOT_ID} .ol2-data-section>.gen-list-switch,
      #${ROOT_ID} .gml-data-section>.gen-list-switch,
      #${ROOT_ID} .cad-data-section>.gen-list-switch{margin:10px 12px 0!important}
      #${ROOT_ID} .ol2-data-section>.v815toolbar,
      #${ROOT_ID} .gml-data-section>.v815toolbar,
      #${ROOT_ID} .cad-data-section>.v815toolbar{
        display:grid!important;grid-template-columns:minmax(260px,1fr) 170px 150px auto!important;gap:8px!important;
        align-items:center!important;margin:0!important;padding:10px 12px!important;border-bottom:1px solid var(--line)!important;
        background:color-mix(in srgb,var(--panel2) 58%,var(--panel))!important
      }
      #${ROOT_ID} .ol2-data-section>.v815toolbar>*,
      #${ROOT_ID} .gml-data-section>.v815toolbar>*,
      #${ROOT_ID} .cad-data-section>.v815toolbar>*{
        width:100%!important;min-width:0!important;height:34px!important;box-sizing:border-box!important;margin:0!important
      }
      #${ROOT_ID} .ol2-data-section>.v815toolbar button,
      #${ROOT_ID} .gml-data-section>.v815toolbar button,
      #${ROOT_ID} .cad-data-section>.v815toolbar button{width:auto!important;white-space:nowrap!important}
      #${ROOT_ID} .ol2-data-section>.v815tw,
      #${ROOT_ID} .gml-data-section>.v815tw,
      #${ROOT_ID} .cad-data-section>.v815tw{margin:0!important;border:0!important;border-radius:0!important;overflow:auto!important}
      #${ROOT_ID} .ol2-data-section .v815table,
      #${ROOT_ID} .gml-data-section .v815table,
      #${ROOT_ID} .cad-data-section .v815table{width:100%!important;border:0!important;border-collapse:separate!important;border-spacing:0!important}
      #${ROOT_ID} .v815table thead th{
        position:sticky!important;top:0!important;z-index:5!important;height:38px!important;padding:0 11px!important;
        background:var(--panel2)!important;color:var(--soft)!important;font-size:8px!important;font-weight:750!important
      }
      #${ROOT_ID} .v815table tbody td{height:46px!important;padding:8px 11px!important;font-size:8.5px!important;line-height:1.45!important}
      #${ROOT_ID} .v815table tbody tr:hover td{background:color-mix(in srgb,#6683df 4%,var(--panel))!important}
      #${ROOT_ID} .ol2-data-section>.v815foot,
      #${ROOT_ID} .gml-data-section>.v815foot,
      #${ROOT_ID} .cad-data-section>.v815foot{
        margin:0!important;padding:10px 12px!important;border-top:1px solid var(--line)!important;background:var(--panel)!important
      }
      #${ROOT_ID} .v815acts{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}
      #${ROOT_ID} .v815act{height:29px!important;padding:0 8px!important;font-size:8px!important}

      #${ROOT_ID} .ol2-overview{max-width:1480px!important}
      #${ROOT_ID} .ol2-overview .occ-top-grid{margin-top:0!important}
      #${ROOT_ID} .ol2-pipeline-card{padding:0!important;overflow:hidden!important}
      #${ROOT_ID} .ol2-pipeline-head{
        display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:16px!important;
        padding:14px 15px 12px!important;border-bottom:1px solid var(--line)!important
      }
      #${ROOT_ID} .ol2-pipeline-head h2{margin:0!important;font-size:13px!important;color:var(--text)!important}
      #${ROOT_ID} .ol2-pipeline-head p{margin:5px 0 0!important;font-size:8px!important;color:var(--soft)!important;line-height:1.5!important}
      #${ROOT_ID} .ol2-pipeline-head button{height:30px!important;padding:0 10px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--panel2)!important;color:var(--text)!important;font-size:8px!important;cursor:pointer!important}
      #${ROOT_ID} .ol2-pipeline-grid{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:0!important}
      #${ROOT_ID} .ol2-pipeline-stage{
        position:relative!important;display:block!important;min-width:0!important;padding:14px!important;border:0!important;
        border-right:1px solid var(--line)!important;background:transparent!important;color:var(--text)!important;text-align:left!important;cursor:pointer!important
      }
      #${ROOT_ID} .ol2-pipeline-stage:last-child{border-right:0!important}
      #${ROOT_ID} .ol2-pipeline-stage:hover{background:color-mix(in srgb,#6683df 5%,var(--panel))!important}
      #${ROOT_ID} .ol2-pipeline-stage.attention{background:color-mix(in srgb,#ffbe69 5%,var(--panel))!important}
      #${ROOT_ID} .ol2-pipeline-top{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;color:var(--soft)!important;font-size:8px!important}
      #${ROOT_ID} .ol2-pipeline-stage strong{display:block!important;margin-top:12px!important;font-size:22px!important;line-height:1!important}
      #${ROOT_ID} .ol2-pipeline-stage b{display:block!important;margin-top:6px!important;font-size:9px!important;line-height:1.4!important}
      #${ROOT_ID} .ol2-pipeline-stage small{display:block!important;margin-top:5px!important;color:var(--soft)!important;font-size:8px!important;line-height:1.45!important}
      #${ROOT_ID} .ol2-progress{display:block!important;height:4px!important;margin-top:12px!important;border-radius:999px!important;background:var(--line)!important;overflow:hidden!important}
      #${ROOT_ID} .ol2-progress i{display:block!important;height:100%!important;border-radius:inherit!important;background:#6683df!important}
      #${ROOT_ID} .ol2-pipeline-stage.attention .ol2-progress i{background:#ffbe69!important}

      @media(max-width:1180px){
        html.ol2-active .ota-toolbar{grid-template-columns:minmax(240px,1fr) minmax(240px,340px) auto auto!important}
        #${ROOT_ID} .ol2-pipeline-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
        #${ROOT_ID} .ol2-pipeline-stage{border-bottom:1px solid var(--line)!important}
      }
      @media(max-width:940px){
        html.ol2-active .ota-toolbar{grid-template-columns:1fr auto!important}
        html.ol2-active #${TITLE_ID}{grid-column:1/-1!important;grid-row:1!important}
        html.ol2-active .ota-toolbar>input,
        html.ol2-active .ota-toolbar .ota-search-host{grid-column:1!important;grid-row:2!important}
        html.ol2-active #${ACTION_ID}{grid-column:2!important;grid-row:2!important}
        html.ol2-active .ota-actions{grid-column:2!important;grid-row:1!important}
        #${ROOT_ID} .ol2-standard>.v815kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        #${ROOT_ID} .ol2-data-section>.v815toolbar,
        #${ROOT_ID} .gml-data-section>.v815toolbar,
        #${ROOT_ID} .cad-data-section>.v815toolbar{grid-template-columns:1fr 1fr!important}
        #${ROOT_ID} .ol2-data-section>.v815toolbar input,
        #${ROOT_ID} .gml-data-section>.v815toolbar input,
        #${ROOT_ID} .cad-data-section>.v815toolbar input{grid-column:1/-1!important}
      }
      @media(max-width:680px){
        html.ol2-active .ota-toolbar{grid-template-columns:1fr!important}
        html.ol2-active #${TITLE_ID},html.ol2-active .ota-toolbar>input,html.ol2-active .ota-toolbar .ota-search-host,
        html.ol2-active #${ACTION_ID},html.ol2-active .ota-actions{grid-column:1!important;grid-row:auto!important}
        html.ol2-active #${ACTION_ID},html.ol2-active .ota-actions{justify-self:stretch!important}
        html.ol2-active #${ACTION_ID} button{width:100%!important}
        #${ROOT_ID} .ol2-standard>.v815kpis{grid-template-columns:1fr!important}
        #${ROOT_ID} .ol2-insight .v815ins{grid-template-columns:1fr!important}
        #${ROOT_ID} .ol2-insight .v815ins>div{border-right:0!important;border-bottom:1px solid var(--line)!important}
        #${ROOT_ID} .ol2-insight .v815ins>div:last-child{border-bottom:0!important}
        #${ROOT_ID} .ol2-data-section>.v815toolbar,
        #${ROOT_ID} .gml-data-section>.v815toolbar,
        #${ROOT_ID} .cad-data-section>.v815toolbar{grid-template-columns:1fr!important}
        #${ROOT_ID} .ol2-data-section>.v815toolbar input,
        #${ROOT_ID} .gml-data-section>.v815toolbar input,
        #${ROOT_ID} .cad-data-section>.v815toolbar input{grid-column:auto!important}
        #${ROOT_ID} .ol2-pipeline-grid{grid-template-columns:1fr!important}
        #${ROOT_ID} .ol2-pipeline-stage{border-right:0!important}
      }
    `;
  }

  function getRoot(){return document.getElementById(ROOT_ID)}
  function getPage(){
    const root=getRoot();
    return root?.querySelector(':scope>.occ-page,:scope>.v815page,:scope>.oge-page')||null;
  }

  function syncTitle(){
    const bar=document.querySelector('.ota-toolbar');
    const page=getPage();
    if(!bar||!page)return;
    let slot=document.getElementById(TITLE_ID);
    if(!slot){slot=document.createElement('div');slot.id=TITLE_ID;bar.insertBefore(slot,bar.firstChild)}

    const source=page.querySelector(':scope>.occ-head,:scope>.v815head,:scope>.oge-head');
    const title=clean(source?.querySelector('h1,h2')?.textContent)||clean(slot.querySelector('h1')?.textContent);
    const description=clean(source?.querySelector('p')?.textContent)||clean(slot.querySelector('p')?.textContent);
    if(title){
      if(!slot.querySelector('h1'))slot.innerHTML='<h1></h1><p></p>';
      slot.querySelector('h1').textContent=title;
      slot.querySelector('p').textContent=description;
    }
  }

  function syncActions(){
    const bar=document.querySelector('.ota-toolbar');
    const page=getPage();
    if(!bar||!page)return;
    let host=document.getElementById(ACTION_ID);
    if(!host){host=document.createElement('div');host.id=ACTION_ID;const actions=bar.querySelector('.ota-actions');bar.insertBefore(host,actions||null)}

    const currentRoute=route();
    if(page.classList.contains('oge-page')){
      if(host.dataset.route!==currentRoute){host.replaceChildren();host.dataset.route=currentRoute}
      return;
    }

    const candidates=[...page.querySelectorAll(':scope>.gml-page-actions button,:scope>.v815head [data-primary],:scope>.occ-head-actions button')]
      .filter(button=>!button.closest(`#${ACTION_ID}`));
    if(candidates.length){
      const chosen=currentRoute==='overview'?candidates.slice(-1):candidates.filter(button=>button.hasAttribute('data-primary')).slice(0,1);
      const buttons=chosen.length?chosen:candidates.slice(-1);
      host.replaceChildren(...buttons);
      host.dataset.route=currentRoute;
    }else if(host.dataset.route!==currentRoute){
      host.replaceChildren();host.dataset.route=currentRoute;
    }
  }

  function ensureInsight(page){
    const grid=page.querySelector(':scope>.v815grid');
    if(!grid)return;
    const cards=[...grid.querySelectorAll(':scope>.v815card')];
    cards.forEach(card=>{
      const title=clean(card.querySelector('.v815ct b')?.textContent);
      if(/核心输出|Primary Output/i.test(title))card.remove();
      else if(/AI洞察|AI Insights|AI 决策摘要/i.test(title)){
        card.classList.add('ol2-insight');
        const heading=card.querySelector('.v815ct b');
        const status=card.querySelector('.v815ct span');
        if(heading)heading.textContent='AI 决策摘要';
        if(status)status.textContent='基于当前数据实时更新';
      }
    });
  }

  function ensureDataSection(page){
    if(page.querySelector(':scope>.gml-data-section,:scope>.cad-data-section,:scope>.ol2-data-section'))return;
    const toolbar=page.querySelector(':scope>.v815toolbar');
    const tableWrap=page.querySelector(':scope>.v815tw');
    const foot=page.querySelector(':scope>.v815foot');
    if(!toolbar||!tableWrap||!foot)return;

    const group=route().split('.')[0];
    const labels={
      operations:['分析结果与任务','汇总分析结果、风险判断与后续动作。'],
      production:['生产任务列表','查看素材处理、AI 加工、质检与交付进度。'],
      release:['发行任务列表','管理物料生成、审核、发布与渠道分发。'],
      dashboard:['数据明细','查看核心指标、趋势变化与异常记录。'],
      system:['配置与记录','管理账号、权限、模板与系统任务。']
    };
    const copy=labels[group]||['任务列表','查看当前模块的业务记录与处理状态。'];
    const section=document.createElement('section');
    section.className='ol2-data-section';
    section.innerHTML=`<header class="ol2-data-head"><div><h2>${copy[0]}</h2><p>${copy[1]}</p></div><span class="ol2-data-meta">8 条记录 · 实时更新</span></header>`;
    page.appendChild(section);
    section.append(toolbar,tableWrap,foot);
  }

  function normalizeStandardPage(){
    const page=getPage();
    if(!page||page.classList.contains('occ-page')||page.classList.contains('oge-page'))return;
    page.classList.add('ol2-standard');
    ensureInsight(page);
    ensureDataSection(page);
  }

  const pipelineStages=[
    ['\u9009\u54c1\u9636\u6bb5','78%','18','\u5019\u9009\u53d1\u884c\u9879\u76ee','3 \u90e8\u5f85\u51b3\u7b56','operations.channel-analysis',78,false],
    ['\u5185\u5bb9\u52a0\u5de5','64%','12','\u751f\u4ea7\u5904\u7406\u4e2d','5 \u4e2a\u4efb\u52a1\u6709\u963b\u585e','production.content',64,true],
    ['\u7269\u6599\u5236\u4f5c','72%','24','\u5f85\u751f\u6210\u6216\u5ba1\u6838','6 \u7ec4\u7b49\u5f85\u5ba1\u6838','release.titles',72,false],
    ['\u6e20\u9053\u5206\u53d1','84%','19','\u5f85\u5206\u53d1\u4efb\u52a1','2 \u4e2a\u9891\u9053\u9650\u6d41','release.distribution',84,false],
    ['\u76d1\u63a7\u8fed\u4ee3','91%','42','\u4e0a\u7ebf\u5267\u96c6','4 \u90e8\u9700\u8981\u4f18\u5316','dashboard.series',91,false]
  ];

  function rebuildPipeline(){
    if(route()!=='overview')return;
    const page=getPage();
    const pipeline=page?.querySelector('.occ-pipeline');
    if(!page||!pipeline)return;
    page.classList.add('ol2-overview');
    if(pipeline.dataset.ol2Version===TARGET_VERSION&&pipeline.querySelector('.ol2-pipeline-grid'))return;

    pipeline.classList.add('ol2-pipeline-card');
    pipeline.innerHTML=`
      <header class="ol2-pipeline-head">
        <div><h2>\u53d1\u884c\u6d41\u7a0b\u8fdb\u5ea6</h2><p>\u4ece\u9009\u54c1\u5230\u76d1\u63a7\u8fed\u4ee3\uff0c\u76f4\u63a5\u5b9a\u4f4d\u963b\u585e\u9636\u6bb5\u548c\u5f85\u5904\u7406\u4efb\u52a1\u3002</p></div>
        <button type="button" data-occ-route="system.tasks">\u67e5\u770b\u5168\u90e8\u4efb\u52a1</button>
      </header>
      <div class="ol2-pipeline-grid">
        ${pipelineStages.map(item=>`<button class="ol2-pipeline-stage${item[7]?' attention':''}" type="button" data-occ-route="${item[5]}"><span class="ol2-pipeline-top"><span>${item[0]}</span><span>${item[1]}</span></span><strong>${item[2]}</strong><b>${item[3]}</b><small>${item[4]}</small><span class="ol2-progress"><i style="width:${item[6]}%"></i></span></button>`).join('')}
      </div>`;
    pipeline.dataset.ol2Version=TARGET_VERSION;
    pipeline.setAttribute('lang','zh-CN');
  }

  let pending=false;
  function apply(){
    pending=false;
    installStyle();
    document.documentElement.classList.add('ol2-active');
    syncTitle();
    syncActions();
    normalizeStandardPage();
    rebuildPipeline();
  }
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(apply)}

  window.addEventListener('hashchange',()=>{document.getElementById(ACTION_ID)?.removeAttribute('data-route');schedule()});
  window.addEventListener('resize',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,350);setTimeout(schedule,900);setTimeout(schedule,1800);
})();
