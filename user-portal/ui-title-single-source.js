(()=>{
'use strict';
const STYLE='octopus-title-single-source',LANG='octopus-user-v7-language',FLOAT='octopusGlobalTitleSlot';
const ALIAS={'production.languages':'production.localization','ops.analytics':'operations.channel-analysis','ops.crawl':'operations.ad-intelligence','ops.unblock':'operations.unblock','production.upload':'production.content','release.publish':'release.distribution'};
const META={
 overview:['业务总览','Business Overview','以选品、内容加工、物料制作、渠道分发和监控迭代为主线管理全部发行项目。','Manage distribution projects across selection, processing, creative, distribution and monitoring.'],
 'operations.channel-analysis':['频道数据分析','Channel Analytics','以频道为单位分析已上传剧集表现，并推荐库内相似剧集加入发行。','Analyze uploaded series by channel and recommend similar library titles for distribution.'],
 'operations.ad-intelligence':['大数据投流抓取分析','Ad Intelligence','广泛分析外部投流素材与表现，并推荐库内相似剧集加入发行。','Analyze external paid-media performance and recommend similar library titles for distribution.'],
 'operations.unblock':['解禁链接反馈管理','Unblock Management','自动检测禁播状态，汇总链接、片方、渠道与原因，并推动解禁工单闭环。','Track blocked links, owners, channels and causes through recovery workflows.'],
 'production.content':['剧集上传与AI标签','Upload & AI Tags','上传全剧素材，完成AI解析、剧情亮点提炼、标签生成与人工确认。','Upload full-series assets for AI parsing, highlights, tags and human review.'],
 'production.localization':['多语种译配处理','Localization','完成多语种翻译、配音、字幕对齐、质检与素材去重处理。','Manage multilingual translation, dubbing, subtitle alignment, QC and deduplication.'],
 'release.titles':['AI标题生成','AI Title Generation','从未生成内容中选择剧集，批量生成标题，并进入独立编辑流程完成修改与采用。','Generate titles in batches, then edit and adopt the final version in the dedicated workflow.'],
 'release.covers':['AI封面生成','AI Cover Generation','从未生成内容中选择剧集，批量生成封面，并进入独立编辑流程完成选择与采用。','Generate covers in batches, then review and adopt the final version in the dedicated workflow.'],
 'release.review':['物料审核','Creative Review','逐条或批量审核标题与封面物料，保留审核结论、意见与版本记录。','Review title and cover creatives individually or in batches with full decision history.'],
 'release.distribution':['上传频道分发','Channel Distribution','校验剧集、语种版本、审核物料包与频道账号后执行正式分发。','Validate content, language, approved creative and channel account before distribution.'],
 'dashboard.series':['剧集维度看板','Series Dashboard','按剧集查看播放量、点击率、留存、RPM、收入与趋势。','Track views, CTR, retention, RPM, revenue and trends by series.'],
 'dashboard.channels':['频道账号看板','Channel Dashboard','按频道账号查看平台、受众、播放、CTR、RPM、收入与账号健康度。','Track platform, audience, views, CTR, RPM, revenue and health by channel.'],
 'dashboard.external':['外部投流对标看板','External Benchmark','对比外部投流素材、投放热度、成本指标与库内可匹配剧集。','Benchmark external creatives, spend signals, cost metrics and internal title matches.'],
 'dashboard.risk':['风险禁播看板','Risk Dashboard','集中查看禁播风险、影响范围、SLA、负责人、处理状态与恢复结果。','Track blocks, impact, SLA, owners, resolution status and recovery outcomes.'],
 'system.channels':['频道账号管理','Channel Accounts','维护TikTok、Facebook、YouTube、Instagram账号、API密钥、频道风格与标签配置。','Manage channel accounts, API credentials, channel styles and tag configuration.'],
 'system.assets':['素材与片方库','Assets & Partners','统一管理短剧素材、版本记录、授权信息与片方合作档案。','Manage series assets, versions, rights information and partner records.'],
 'system.templates':['AI模板配置','AI Templates','配置标题Prompt、封面风格、水印模板与标签体系。','Configure title prompts, cover styles, watermark templates and tag systems.'],
 'system.roles':['权限角色管理','Roles & Permissions','按个人与角色管理数据范围、操作权限、继承规则与审批要求。','Manage data scope, action permissions, inheritance and approvals by person and role.'],
 'system.tasks':['异步任务中心','Async Task Center','统一查看译配、生成、上传等异步任务的运行状态、日志与失败重试。','Track async localization, generation and upload jobs, logs and retries.']
};
const isEn=()=>localStorage.getItem(LANG)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');
const route=()=>{const raw=location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';return ALIAS[raw]||raw};
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
/* The fixed shell workspace is the only visible page title. */
html body .workspace.oct-fixed-title-owner{display:block!important;visibility:visible!important;opacity:1!important;width:auto!important;min-width:0!important;max-width:none!important;height:auto!important;margin:0!important;padding:0!important;border:0!important;overflow:visible!important;position:relative!important;inset:auto!important;transform:none!important;text-align:left!important}
html body .workspace.oct-fixed-title-owner b,html body .workspace.oct-fixed-title-owner strong,html body .workspace.oct-fixed-title-owner h1,html body .workspace.oct-fixed-title-owner h2{display:block!important;margin:0!important;color:var(--text)!important;font-size:16px!important;line-height:1.25!important;font-weight:760!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important}
html body .workspace.oct-fixed-title-owner small,html body .workspace.oct-fixed-title-owner p{display:block!important;margin:7px 0 0!important;color:var(--soft)!important;font-size:8px!important;line-height:1.45!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important}
html body #${FLOAT},html.ol2-active body #${FLOAT},html.gml-active body #${FLOAT}{display:none!important;visibility:hidden!important;width:0!important;min-width:0!important;max-width:0!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;pointer-events:none!important}
/* With the floating title gone, toolbar contains search/actions only. */
html body .ota-toolbar,html.ol2-active body .ota-toolbar,html.gml-active body .ota-toolbar{display:flex!important;grid-template-columns:none!important;grid-template-rows:none!important;align-items:center!important;justify-content:flex-end!important;gap:10px!important;width:100%!important;max-width:none!important;min-width:0!important;min-height:44px!important;margin:0!important;padding:0 0 7px!important;transform:none!important;position:relative!important;inset:auto!important;box-sizing:border-box!important}
html body .ota-toolbar>input,html body .ota-toolbar>.ota-search-host,html.ol2-active body .ota-toolbar>input,html.ol2-active body .ota-toolbar>.ota-search-host,html.gml-active body .ota-toolbar>input,html.gml-active body .ota-toolbar>.ota-search-host{order:1!important;grid-column:auto!important;grid-row:auto!important;flex:1 1 420px!important;width:min(520px,46vw)!important;min-width:260px!important;max-width:520px!important;margin:0 0 0 auto!important}
html body .ota-toolbar>#octopusGlobalActionHost,html.ol2-active body .ota-toolbar>#octopusGlobalActionHost,html.gml-active body .ota-toolbar>#octopusGlobalActionHost{order:2!important;grid-column:auto!important;grid-row:auto!important;flex:0 0 auto!important}
html body .ota-toolbar>.ota-actions,html.ol2-active body .ota-toolbar>.ota-actions,html.gml-active body .ota-toolbar>.ota-actions{order:3!important;grid-column:auto!important;grid-row:auto!important;flex:0 0 auto!important;margin-left:0!important}
#pageRoot>.v815page>.v815head,#pageRoot>.occ-page>.occ-head,#pageRoot>.oge-page>.oge-head,#pageRoot>.gw3-page>.v815head{display:none!important}
@media(max-width:860px){html body .ota-toolbar,html.ol2-active body .ota-toolbar,html.gml-active body .ota-toolbar{flex-wrap:wrap!important}html body .ota-toolbar>input,html body .ota-toolbar>.ota-search-host{flex:1 1 100%!important;width:100%!important;max-width:none!important;min-width:0!important}.ota-toolbar>.ota-actions{margin-left:auto!important}}
`}
}
function findFixed(){
 let w=document.querySelector('.workspace');
 if(w)return w;
 const float=document.getElementById(FLOAT),bar=document.querySelector('.ota-toolbar');
 const candidates=[...document.querySelectorAll('div,section,header')].filter(el=>{
  if(el===float||el.contains(float)||el.contains(bar)||el.closest('#v80nav,#pageRoot,[role="dialog"]'))return false;
  const text=clean(el.querySelector(':scope>b,:scope>strong,:scope>h1,:scope>h2')?.textContent);if(!text)return false;
  const r=el.getBoundingClientRect();return r.top>=0&&r.top<150&&r.width>120&&r.width<620&&r.height>20&&r.height<130;
 });
 return candidates[0]||null;
}
function ensureFixed(){
 let w=findFixed();
 if(!w){const bar=document.querySelector('.ota-toolbar');if(!bar?.parentElement)return null;w=document.createElement('div');w.className='workspace';w.innerHTML='<b></b><small></small>';bar.parentElement.insertBefore(w,bar)}
 w.classList.remove('oct-shell-legacy-title','oct-title-duplicate');w.classList.add('oct-fixed-title-owner');
 return w;
}
let writing=false,observer=null,observed=null;
function write(){
 css();const r=route(),m=META[r];if(!m)return;const w=ensureFixed();if(!w)return;const en=isEn(),title=en?m[1]:m[0],desc=en?m[3]:m[2];
 let h=w.querySelector(':scope>b,:scope>strong,:scope>h1,:scope>h2'),p=w.querySelector(':scope>small,:scope>p');
 writing=true;if(!h){h=document.createElement('b');w.prepend(h)}if(!p){p=document.createElement('small');w.appendChild(p)}
 if(clean(h.textContent)!==title)h.textContent=title;if(clean(p.textContent)!==desc)p.textContent=desc;w.dataset.routeTitle=r;document.title=`Octopus · ${title}`;writing=false;
 if(observed!==w){observer?.disconnect();observer=new MutationObserver(()=>{if(!writing)requestAnimationFrame(write)});observer.observe(w,{childList:true,subtree:true,characterData:true});observed=w}
}
let raf=0;function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(write)}
css();write();
window.addEventListener('hashchange',schedule);window.addEventListener('popstate',schedule);window.addEventListener('octopus-owned-route-change',schedule);window.addEventListener('pageshow',schedule);window.addEventListener('octopus-language-change',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',write,{once:true});
window.OctopusTitleSingleSource={apply:write,meta:META,version:'6.1'};
})();