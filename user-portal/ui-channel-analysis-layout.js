(()=>{
  'use strict';

  const ROOT_ID='pageRoot';
  const STYLE_ID='octopus-channel-analysis-layout';
  const TARGET_ROUTE='operations.channel-analysis';

  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      html.cad-active .ota-toolbar{
        min-height:38px!important;
        padding-bottom:3px!important;
        margin-bottom:0!important
      }

      #${ROOT_ID} .cad-page{
        max-width:none!important;
        padding-top:0!important;
        padding-bottom:34px!important
      }
      #${ROOT_ID} .cad-page>.v815flow{display:none!important}

      #${ROOT_ID} .cad-page>.v815head{
        display:flex!important;
        align-items:flex-start!important;
        justify-content:space-between!important;
        gap:22px!important;
        margin:0 0 12px!important;
        padding:2px 0 12px!important;
        border-bottom:1px solid var(--line)!important
      }
      #${ROOT_ID} .cad-page>.v815head>div:first-child{min-width:0!important}
      #${ROOT_ID} .cad-page>.v815head h1{
        margin:0!important;
        font-size:25px!important;
        line-height:1.15!important;
        letter-spacing:-.025em!important
      }
      #${ROOT_ID} .cad-page>.v815head p{
        max-width:820px!important;
        margin:6px 0 0!important;
        color:var(--soft)!important;
        font-size:9px!important;
        line-height:1.55!important
      }
      #${ROOT_ID} .cad-page>.v815head .v815primary{
        flex:0 0 auto!important;
        align-self:flex-start!important;
        min-width:132px!important;
        height:34px!important;
        margin:0!important;
        padding:0 14px!important;
        border-radius:9px!important;
        font-size:9px!important;
        white-space:nowrap!important
      }

      #${ROOT_ID} .cad-page>.v815kpis{
        display:grid!important;
        grid-template-columns:repeat(4,minmax(0,1fr))!important;
        gap:10px!important;
        margin:0 0 12px!important
      }
      #${ROOT_ID} .cad-page>.v815kpis .v815kpi{
        min-height:72px!important;
        padding:13px 14px!important;
        border-radius:11px!important;
        background:var(--panel)!important
      }
      #${ROOT_ID} .cad-page>.v815kpis .v815kpi span{
        font-size:8px!important;
        color:var(--soft)!important
      }
      #${ROOT_ID} .cad-page>.v815kpis .v815kpi strong{
        margin-top:8px!important;
        font-size:20px!important;
        line-height:1!important
      }

      #${ROOT_ID} .cad-page>.v815grid{
        display:block!important;
        margin:0 0 12px!important
      }
      #${ROOT_ID} .cad-page>.v815grid>.v815card:not(.cad-insight-card){display:none!important}
      #${ROOT_ID} .cad-insight-card{
        width:100%!important;
        min-height:0!important;
        padding:0!important;
        border-radius:12px!important;
        overflow:hidden!important
      }
      #${ROOT_ID} .cad-insight-card .v815ct{
        min-height:42px!important;
        padding:0 14px!important;
        border-bottom:1px solid var(--line)!important
      }
      #${ROOT_ID} .cad-insight-card .v815ct b{font-size:10px!important}
      #${ROOT_ID} .cad-insight-card .v815ct span{font-size:8px!important}
      #${ROOT_ID} .cad-insight-card .v815ins{
        display:grid!important;
        grid-template-columns:repeat(3,minmax(0,1fr))!important;
        gap:0!important;
        padding:0!important
      }
      #${ROOT_ID} .cad-insight-card .v815ins>div{
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
      #${ROOT_ID} .cad-insight-card .v815ins>div:last-child{border-right:0!important}
      #${ROOT_ID} .cad-insight-card .v815ins i{margin-top:4px!important}
      #${ROOT_ID} .cad-insight-card .v815ins span{
        color:var(--text)!important;
        font-size:9px!important;
        line-height:1.6!important
      }

      #${ROOT_ID} .cad-data-section{
        border:1px solid var(--line)!important;
        border-radius:12px!important;
        background:var(--panel)!important;
        overflow:hidden!important
      }
      #${ROOT_ID} .cad-data-head{
        display:flex!important;
        align-items:flex-start!important;
        justify-content:space-between!important;
        gap:18px!important;
        padding:14px 14px 11px!important;
        border-bottom:1px solid var(--line)!important
      }
      #${ROOT_ID} .cad-data-head h2{
        margin:0!important;
        color:var(--text)!important;
        font-size:12px!important;
        line-height:1.35!important
      }
      #${ROOT_ID} .cad-data-head p{
        margin:5px 0 0!important;
        color:var(--soft)!important;
        font-size:8px!important;
        line-height:1.5!important
      }
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
      #${ROOT_ID} .cad-data-section>.v815toolbar>*{
        width:100%!important;
        min-width:0!important;
        height:34px!important;
        box-sizing:border-box!important;
        margin:0!important
      }
      #${ROOT_ID} .cad-data-section>.v815toolbar button{width:auto!important;white-space:nowrap!important}
      #${ROOT_ID} .cad-data-section>.v815tw{
        margin:0!important;
        border:0!important;
        border-radius:0!important;
        overflow:auto!important
      }
      #${ROOT_ID} .cad-data-section .v815table{border:0!important}
      #${ROOT_ID} .cad-data-section>.v815foot{
        margin:0!important;
        padding:10px 12px!important;
        border-top:1px solid var(--line)!important
      }

      @media(max-width:1100px){
        #${ROOT_ID} .cad-page>.v815kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        #${ROOT_ID} .cad-data-section>.v815toolbar{grid-template-columns:1fr 1fr!important}
        #${ROOT_ID} .cad-data-section>.v815toolbar input{grid-column:1/-1!important}
      }
      @media(max-width:760px){
        #${ROOT_ID} .cad-page>.v815head{flex-direction:column!important}
        #${ROOT_ID} .cad-page>.v815head .v815primary{width:100%!important}
        #${ROOT_ID} .cad-page>.v815kpis{grid-template-columns:1fr!important}
        #${ROOT_ID} .cad-insight-card .v815ins{grid-template-columns:1fr!important}
        #${ROOT_ID} .cad-insight-card .v815ins>div{border-right:0!important;border-bottom:1px solid var(--line)!important}
        #${ROOT_ID} .cad-insight-card .v815ins>div:last-child{border-bottom:0!important}
        #${ROOT_ID} .cad-data-section>.v815toolbar{grid-template-columns:1fr!important}
        #${ROOT_ID} .cad-data-section>.v815toolbar input{grid-column:auto!important}
      }
    `;
  }

  function buildDataSection(page){
    const toolbar=page.querySelector(':scope>.v815toolbar');
    const tableWrap=page.querySelector(':scope>.v815tw');
    const foot=page.querySelector(':scope>.v815foot');
    if(!toolbar||!tableWrap||!foot)return;

    let section=page.querySelector(':scope>.cad-data-section');
    if(!section){
      section=document.createElement('section');
      section.className='cad-data-section';
      section.innerHTML=`
        <header class="cad-data-head">
          <div><h2>剧集表现与推荐</h2><p>按播放、点击、留存、RPM 和推荐分筛选剧集，并将高潜内容加入选剧报告。</p></div>
          <span class="cad-data-meta">8 条结果 · 实时数据</span>
        </header>`;
      page.appendChild(section);
    }
    section.append(toolbar,tableWrap,foot);
  }

  function refineInsights(page){
    const grid=page.querySelector(':scope>.v815grid');
    if(!grid)return;
    const cards=[...grid.querySelectorAll(':scope>.v815card')];
    cards.forEach(card=>{
      const title=clean(card.querySelector('.v815ct b')?.textContent);
      if(/核心输出|Primary Output/i.test(title)){
        card.remove();
      }else if(/AI洞察|AI Insights/i.test(title)){
        card.classList.add('cad-insight-card');
        const heading=card.querySelector('.v815ct b');
        const status=card.querySelector('.v815ct span');
        if(heading)heading.textContent='AI 决策摘要';
        if(status)status.textContent='基于当前筛选实时更新';
      }
    });
  }

  function apply(){
    installStyle();
    const active=route()===TARGET_ROUTE;
    document.documentElement.classList.toggle('cad-active',active);
    if(!active)return;

    const root=document.getElementById(ROOT_ID);
    const page=root?.querySelector(':scope>.v815page');
    if(!page||root.dataset.route!==TARGET_ROUTE)return;

    page.classList.add('cad-page');
    page.querySelector(':scope>.v815flow')?.remove();

    const primary=page.querySelector(':scope>.v815head .v815primary');
    if(primary){
      primary.textContent='生成选剧报告';
      primary.setAttribute('aria-label','生成选剧报告');
    }

    refineInsights(page);
    buildDataSection(page);
    page.dataset.channelLayout='refined';
  }

  let scheduled=false;
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;apply()});
  }

  window.addEventListener('hashchange',schedule);
  window.addEventListener('resize',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,350);
  setTimeout(schedule,1100);
  setTimeout(schedule,1900);
})();
