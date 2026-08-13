(()=>{
'use strict';
const SLOT='octopusGlobalTitleSlot',STYLE='octopus-title-single-source',LANG='octopus-user-v7-language';
const hashRoute=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const isEn=()=>localStorage.getItem(LANG)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');
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
const TITLE_SET=new Set(Object.values(META).flatMap(x=>[x[0],x[1]]));
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
function navRoute(){
 const nav=document.getElementById('v80nav');if(!nav)return'';
 const active=nav.querySelector('[data-r].active,[data-r][aria-current="page"],[data-r][data-active="true"],.active[data-r]');
 return active?.dataset.r&&META[active.dataset.r]?active.dataset.r:'';
}
function rootRoute(){
 const root=document.getElementById('pageRoot');if(!root)return'';
 const owned=root.dataset.routeOwner;if(owned&&META[owned])return owned;
 const specific=[['.loc-page','production.localization'],['.pcw-page','production.content'],['.rvw-page','release.review'],['.dpw-page','release.distribution'],['.gw3-page[data-gw3-view]',''],['.orw-page','']];
 for(const [sel,r] of specific){if(root.querySelector(':scope>'+sel)){if(r)return r;break}}
 const gw=root.dataset.gw3Route;if(gw&&META[gw])return gw;
 const current=root.dataset.route;if(current&&META[current])return current;
 return'';
}
function resolvedRoute(){return navRoute()||rootRoute()||hashRoute()}
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
/* Exactly one visible title block: the route-driven global slot. */
.workspace,.oct-shell-legacy-title,.oct-title-duplicate{display:none!important;width:0!important;min-width:0!important;max-width:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}
.oct-title-shell{grid-template-columns:minmax(0,1fr)!important}
.oct-title-shell>.oct-toolbar-column,.oct-title-shell .oct-toolbar-column{grid-column:1/-1!important;width:100%!important;max-width:none!important;margin-left:0!important;justify-self:stretch!important}
.ota-toolbar{display:grid!important;grid-template-columns:minmax(280px,1fr) minmax(300px,520px) auto auto!important;align-items:center!important;gap:10px!important;width:100%!important;max-width:none!important;margin:0!important;padding-left:0!important;box-sizing:border-box!important}
.ota-toolbar>#${SLOT}{display:block!important;grid-column:1!important;grid-row:1!important;min-width:0!important;width:100%!important;margin:0!important;padding:0!important;justify-self:stretch!important;align-self:center!important;text-align:left!important;visibility:visible!important;opacity:1!important;transform:none!important;position:relative!important;inset:auto!important}
.ota-toolbar>#${SLOT} h1{margin:0!important;color:var(--text)!important;font-size:21px!important;line-height:1.2!important;font-weight:760!important;letter-spacing:-.02em!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important}
.ota-toolbar>#${SLOT} p{margin:6px 0 0!important;max-width:720px!important;color:var(--soft)!important;font-size:9px!important;line-height:1.45!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important}
.ota-toolbar>input,.ota-toolbar>.ota-search-host{grid-column:2!important;margin-left:0!important}
.ota-toolbar>#octopusGlobalActionHost{grid-column:3!important}
.ota-toolbar>.ota-actions{grid-column:4!important;margin-left:0!important}
#pageRoot>.v815page>.v815head,#pageRoot>.occ-page>.occ-head,#pageRoot>.oge-page>.oge-head,#pageRoot>.gw3-page>.v815head{display:none!important}
@media(max-width:940px){.ota-toolbar{grid-template-columns:1fr auto!important}.ota-toolbar>#${SLOT}{grid-column:1/-1!important;grid-row:1!important}.ota-toolbar>input,.ota-toolbar>.ota-search-host{grid-column:1!important;grid-row:2!important}.ota-toolbar>#octopusGlobalActionHost{grid-column:2!important;grid-row:2!important}.ota-toolbar>.ota-actions{grid-column:2!important;grid-row:1!important}}
@media(max-width:680px){.ota-toolbar{grid-template-columns:1fr!important}.ota-toolbar>#${SLOT},.ota-toolbar>input,.ota-toolbar>.ota-search-host,.ota-toolbar>#octopusGlobalActionHost,.ota-toolbar>.ota-actions{grid-column:1!important;grid-row:auto!important}}
`}
}
function commonAncestor(a,b){const set=new Set();for(let x=a;x;x=x.parentElement)set.add(x);for(let y=b;y;y=y.parentElement)if(set.has(y))return y;return null}
function directChild(node,parent){let x=node;while(x&&x.parentElement!==parent)x=x.parentElement;return x?.parentElement===parent?x:null}
function findLegacyTitleBlocks(bar,slot){
 const barRect=bar.getBoundingClientRect();
 document.querySelectorAll('h1,h2,h3,b,strong').forEach(el=>{
  if(slot.contains(el)||el.closest('#v80nav,#pageRoot,[role="dialog"],.smd-shell,.ota-drawer'))return;
  const text=clean(el.textContent);if(!TITLE_SET.has(text))return;
  const rect=el.getBoundingClientRect();if(rect.bottom<0||rect.top>Math.max(180,barRect.bottom+40))return;
  let block=el;
  for(let x=el.parentElement;x&&x!==document.body;x=x.parentElement){
   if(x.contains(bar)||x.querySelector?.('#v80nav,#pageRoot'))break;
   const r=x.getBoundingClientRect();
   if(r.height>0&&r.height<=150&&r.width>0&&r.width<=620)block=x;else break;
  }
  block.classList.add('oct-shell-legacy-title');
  const common=commonAncestor(block,bar);
  if(common&&common!==document.body){
   const cr=common.getBoundingClientRect();
   if(cr.height>0&&cr.height<=190){
    common.classList.add('oct-title-shell');
    const toolbarColumn=directChild(bar,common);if(toolbarColumn)toolbarColumn.classList.add('oct-toolbar-column');
   }
  }
 });
}
function ensureSlot(){
 const bar=document.querySelector('.ota-toolbar');if(!bar)return null;
 let slot=document.getElementById(SLOT);if(!slot){slot=document.createElement('div');slot.id=SLOT;bar.insertBefore(slot,bar.firstChild)}
 findLegacyTitleBlocks(bar,slot);
 const parent=bar.parentElement;if(parent)parent.classList.add('oct-toolbar-column');
 return slot;
}
let writing=false;
function writeRouteTitle(){
 const slot=ensureSlot(),r=resolvedRoute(),m=META[r];if(!slot||!m)return;
 const en=isEn(),title=en?m[1]:m[0],desc=en?m[3]:m[2];let h=slot.querySelector('h1'),p=slot.querySelector('p');
 writing=true;
 if(!h||!p){slot.innerHTML='<h1></h1><p></p>';h=slot.querySelector('h1');p=slot.querySelector('p')}
 if(h.textContent!==title)h.textContent=title;if(p.textContent!==desc)p.textContent=desc;
 slot.dataset.routeTitle=r;document.title=`Octopus · ${title}`;writing=false;
}
function removeDuplicatePageHeads(){
 const slot=document.getElementById(SLOT);if(!slot)return;const title=clean(slot.querySelector('h1')?.textContent);if(!title)return;
 document.querySelectorAll('header h1,header h2,.topbar h1,.topbar h2').forEach(h=>{if(slot.contains(h))return;if(clean(h.textContent)===title)h.closest('.workspace,.v815head,.occ-head,.oge-head')?.classList.add('oct-title-duplicate')});
}
function apply(){css();writeRouteTitle();removeDuplicatePageHeads()}
let raf=0;function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(apply)}
function observeStableSources(){
 const slot=document.getElementById(SLOT);if(slot&&!slot.__octTitleObserver){slot.__octTitleObserver=true;new MutationObserver(()=>{if(!writing)schedule()}).observe(slot,{childList:true,subtree:true,characterData:true})}
 const nav=document.getElementById('v80nav');if(nav&&!nav.__octTitleObserver){nav.__octTitleObserver=true;new MutationObserver(schedule).observe(nav,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-current','data-active']})}
}
function boot(){apply();observeStableSources();setTimeout(()=>{apply();observeStableSources()},80)}
css();boot();
window.addEventListener('hashchange',boot);window.addEventListener('popstate',boot);window.addEventListener('octopus-owned-route-change',boot);window.addEventListener('pageshow',boot);window.addEventListener('octopus-language-change',boot);window.addEventListener('resize',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
window.OctopusTitleSingleSource={apply,meta:META,resolvedRoute,version:'5.0'};
})();