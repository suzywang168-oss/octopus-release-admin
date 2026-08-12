(()=>{
  'use strict';
  const STYLE_ID='octopus-i18n-table-polish';
  const HEADER_MAP={
    'operations.channel-analysis':[['剧集','核心标签','播放量','点击率','D7留存','RPM','收入','推荐分','操作'],['Series','Core Tags','Views','CTR','D7 Retention','RPM','Revenue','Score','Actions']],
    'operations.ad-intelligence':[['素材ID','平台','热词/题材','抓取量','互动率','片单命中','关联剧集','上线建议','操作'],['Asset ID','Platform','Topic / Genre','Crawled','Engagement','Catalog Match','Series','Launch Advice','Actions']],
    'operations.unblock':[['链接','片方','禁播渠道','禁播原因','检测时间','负责人','处理状态','SLA','操作'],['Link','Partner','Blocked Channel','Reason','Detected','Owner','Status','SLA','Actions']],
    'production.content':[['剧集','片方','素材版本','解析进度','剧情亮点','AI标签数','人工状态','更新时间','操作'],['Series','Partner','Asset Version','Analysis','Story Highlights','AI Tags','Review Status','Updated','Actions']],
    'production.localization':[['剧集','目标语种','翻译进度','配音进度','字幕对齐','去重风险','质检状态','预计完成','操作'],['Series','Language','Translation','Dubbing','Subtitle Sync','Duplicate Risk','QC Status','ETA','Actions']],
    'release.titles':[['剧集','目标频道','内容爆点','候选标题数','CTR预测','字符数','冲突检测','状态','操作'],['Series','Target Channel','Hook','Candidates','CTR Forecast','Characters','Conflict Check','Status','Actions']],
    'release.covers':[['剧集','目标频道','视觉爆点','候选封面','CTR预测','风格匹配','重复度','状态','操作'],['Series','Target Channel','Visual Hook','Cover Options','CTR Forecast','Style Match','Similarity','Status','Actions']],
    'release.review':[['剧集','频道','标题状态','封面状态','匹配校验','审核人','版本','整体状态','操作'],['Series','Channel','Title Status','Cover Status','Match Check','Reviewer','Version','Overall Status','Actions']],
    'release.distribution':[['剧集','频道账号','语种版本','水印模板','匹配分','上传方式','进度','状态','操作'],['Series','Channel Account','Language Version','Watermark','Match Score','Upload Method','Progress','Status','Actions']],
    'dashboard.series':[['剧集','播放量','点击率','D1留存','D7留存','RPM','收入','趋势','操作'],['Series','Views','CTR','D1 Retention','D7 Retention','RPM','Revenue','Trend','Actions']],
    'dashboard.channels':[['频道账号','平台','区域/语种','播放量','点击率','收入','爆款TOP1','健康状态','操作'],['Channel Account','Platform','Region / Language','Views','CTR','Revenue','Top Series','Health','Actions']],
    'dashboard.external':[['题材标签','外部平台','外部热度','素材增速','内部剧集数','内部CTR','机会差值','建议','操作'],['Genre Tag','External Platform','Heat','Asset Growth','Internal Series','Internal CTR','Opportunity Gap','Advice','Actions']],
    'dashboard.risk':[['风险对象','渠道','风险类型','本月次数','影响收入','解禁进度','风险等级','预警','操作'],['Risk Object','Channel','Risk Type','Monthly Cases','Revenue Impact','Recovery','Risk Level','Alert','Actions']],
    'system.channels':[['频道账号','平台','区域/语种','API状态','密钥到期','频道风格','标签配置','状态','操作'],['Channel Account','Platform','Region / Language','API Status','Key Expiry','Channel Style','Tag Setup','Status','Actions']],
    'system.assets':[['对象','类型','所属片方','版本/剧集数','授权范围','最近更新','负责人','状态','操作'],['Object','Type','Partner','Versions / Series','Rights Scope','Updated','Owner','Status','Actions']],
    'system.templates':[['模板名称','模板类型','适用频道','版本','使用次数','效果指标','更新时间','状态','操作'],['Template','Type','Channel','Version','Uses','Performance','Updated','Status','Actions']],
    'system.roles':[['角色/成员','角色类型','成员数','数据范围','核心权限','最近变更','审批人','状态','操作'],['Role / Member','Role Type','Members','Data Scope','Permissions','Updated','Approver','Status','Actions']],
    'system.tasks':[['任务ID','任务类型','业务对象','进度','运行节点','创建时间','耗时/预计','状态','操作'],['Task ID','Task Type','Business Object','Progress','Worker','Created','Duration / ETA','Status','Actions']]
  };
  const PRIMARY={
    overview:['新建发行项目','New Release Project'],
    'operations.channel-analysis':['生成选剧报告','Generate Selection Report'],
    'operations.ad-intelligence':['新建抓取任务','New Crawl Task'],
    'operations.unblock':['新建解禁工单','New Recovery Case'],
    'production.content':['上传剧集内容','Upload Series'],
    'production.localization':['创建译配任务','Create Localization Task'],
    'release.titles':['批量生成标题','Generate Titles'],
    'release.covers':['批量生成封面','Generate Covers'],
    'release.review':['进入批量审核','Batch Review'],
    'release.distribution':['新建分发任务','New Distribution Task']
  };
  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const english=()=>{
    try{if(typeof currentLang!=='undefined')return currentLang==='en'}catch{}
    return String(document.documentElement.lang||'').toLowerCase().startsWith('en');
  };
  function installStyle(){
    let s=document.getElementById(STYLE_ID);
    if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}
    s.textContent=`
      html.ol2-active .ota-toolbar,html.gml-active .ota-toolbar,.ota-toolbar{border-bottom:0!important}
      .ota-actions>.ota-preserved.otp-language,.ota-actions>.otp-language{width:66px!important;min-width:66px!important;max-width:66px!important;padding:0 8px!important;white-space:nowrap!important}
      #octopusGlobalActionHost{display:none!important}
      #pageRoot .otp-primary-row{display:none!important}
      #pageRoot .ols-data-actions .otp-list-primary{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:132px!important;height:36px!important;padding:0 16px!important;margin:0!important;border:1px solid #6683df!important;border-radius:9px!important;background:#6683df!important;color:#fff!important;font-size:9px!important;font-weight:750!important;white-space:nowrap!important;cursor:pointer!important}
      #pageRoot .v815table thead th{
        height:54px!important;
        min-height:54px!important;
        padding:0 14px!important;
        vertical-align:middle!important;
        color:var(--text)!important;
        font-size:10px!important;
        font-weight:750!important;
        line-height:1.35!important;
        letter-spacing:.005em!important;
        white-space:nowrap!important
      }
      #pageRoot .v815table thead tr{height:54px!important}
    `;
  }
  function replaceLanguageControl(){
    let control=document.querySelector('.otp-language');
    if(control)return control;
    const old=document.querySelector('.lang-toggle');
    if(!old)return null;
    control=old.cloneNode(true);
    control.classList.remove('lang-toggle');
    control.classList.add('otp-language');
    control.removeAttribute('onclick');
    old.replaceWith(control);
    return control;
  }
  function movePrimary(){
    document.querySelectorAll('#pageRoot .otp-primary-row').forEach(row=>row.remove());
    const host=document.getElementById('octopusGlobalActionHost');
    const header=document.querySelector('#pageRoot .ol2-data-head,#pageRoot .gml-data-head,#pageRoot .cad-data-head');
    if(!host||!header)return;
    let actions=header.querySelector('.ols-data-actions');
    if(!actions){actions=document.createElement('div');actions.className='ols-data-actions';const meta=header.querySelector('.ol2-data-meta,.gml-data-meta,.cad-data-meta');if(meta)actions.appendChild(meta);header.appendChild(actions)}
    const button=host.querySelector('button');
    if(button&&!actions.contains(button)){button.classList.add('otp-list-primary');actions.appendChild(button)}
  }
  function stabilize(){
    installStyle();
    const control=replaceLanguageControl();
    movePrimary();
    const r=route(),isEn=english(),headers=HEADER_MAP[r]?.[isEn?1:0];
    if(headers)document.querySelectorAll('#pageRoot .v815table thead th').forEach((th,i)=>{if(headers[i])th.textContent=headers[i]});
    const primary=document.querySelector('#octopusGlobalActionHost button,[data-primary]');
    if(primary&&PRIMARY[r])primary.textContent=PRIMARY[r][isEn?1:0];
    if(control){
      control.textContent=isEn?'中文':'EN';
      control.setAttribute('aria-label',isEn?'切换为中文':'Switch to English');
      control.title=control.getAttribute('aria-label');
    }
  }
  function switchLanguage(event){
    const target=event.target instanceof Element?event.target.closest('.otp-language'):null;
    if(!target)return;
    event.preventDefault();event.stopImmediatePropagation();
    const next=english()?'zh':'en';
    try{currentLang=next}catch{window.currentLang=next}
    document.documentElement.lang=next==='en'?'en':'zh-CN';
    target.textContent=next==='en'?'中文':'EN';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    [0,40,120,300].forEach(ms=>setTimeout(stabilize,ms));
  }
  window.addEventListener('click',switchLanguage,true);
  window.addEventListener('hashchange',()=>setTimeout(stabilize,0));
  new MutationObserver(()=>requestAnimationFrame(stabilize)).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',stabilize,{once:true});else stabilize();
  setTimeout(stabilize,400);setTimeout(stabilize,1200);
})();