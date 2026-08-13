(()=>{
'use strict';
const SLOT='octopusGlobalTitleSlot',STYLE='octopus-title-single-source',LANG='octopus-user-v7-language';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
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
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
/* Route metadata is the only page-title source. Legacy shell titles never occupy layout space. */
.workspace,.oct-shell-legacy-title{display:none!important}
.oct-title-shell>.ota-toolbar{grid-column:1/-1!important;grid-row:1!important;width:100%!important;max-width:none!important;margin-left:0!important;justify-self:stretch!important;box-sizing:border-box!important}
.ota-toolbar{display:grid!important;grid-template-columns:minmax(260px,1fr) minmax(300px,520px) auto auto!important;align-items:center!important;gap:10px!important;width:100%!important;max-width:none!important;margin-left:0!important}
.ota-toolbar>#${SLOT}{display:block!important;grid-column:1!important;grid-row:1!important;min-width:0!important;width:100%!important;margin:0!important;padding:0!important;justify-self:stretch!important;align-self:center!important;text-align:left!important;visibility:visible!important;opacity:1!important;transform:none!important;position:relative!important;left:auto!important;right:auto!important;top:auto!important}
.ota-toolbar>#${SLOT} h1{margin:0!important;color:var(--text)!important;font-size:21px!important;line-height:1.2!important;font-weight:760!important;letter-spacing:-.02em!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important}
.ota-toolbar>#${SLOT} p{margin:6px 0 0!important;max-width:720px!important;color:var(--soft)!important;font-size:9px!important;line-height:1.45!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:left!important}
.ota-toolbar>input,.ota-toolbar>.ota-search-host{grid-column:2!important;margin-left:0!important}
.ota-toolbar>#octopusGlobalActionHost{grid-column:3!important}
.ota-toolbar>.ota-actions{grid-column:4!important;margin-left:0!important}
#pageRoot>.v815page>.v815head,#pageRoot>.occ-page>.occ-head,#pageRoot>.oge-page>.oge-head,#pageRoot>.gw3-page>.v815head{display:none!important}
.oct-title-duplicate{display:none!important}
@media(max-width:940px){.ota-toolbar{grid-template-columns:1fr auto!important}.ota-toolbar>#${SLOT}{grid-column:1/-1!important;grid-row:1!important}.ota-toolbar>input,.ota-toolbar>.ota-search-host{grid-column:1!important;grid-row:2!important}.ota-toolbar>#octopusGlobalActionHost{grid-column:2!important;grid-row:2!important}.ota-toolbar>.ota-actions{grid-column:2!important;grid-row:1!important}}
@media(max-width:680px){.ota-toolbar{grid-template-columns:1fr!important}.ota-toolbar>#${SLOT},.ota-toolbar>input,.ota-toolbar>.ota-search-host,.ota-toolbar>#octopusGlobalActionHost,.ota-toolbar>.ota-actions{grid-column:1!important;grid-row:auto!important}}
`}
}
function ensureSlot(){const bar=document.querySelector('.ota-toolbar');if(!bar)return null;const parent=bar.parentElement;if(parent)parent.classList.add('oct-title-shell');document.querySelectorAll('.workspace').forEach(x=>x.classList.add('oct-shell-legacy-title'));let slot=document.getElementById(SLOT);if(!slot){slot=document.createElement('div');slot.id=SLOT;bar.insertBefore(slot,bar.firstChild)}return slot}
function writeRouteTitle(){const slot=ensureSlot(),m=META[route()];if(!slot||!m)return;const en=isEn(),title=en?m[1]:m[0],desc=en?m[3]:m[2];let h=slot.querySelector('h1'),p=slot.querySelector('p');if(!h||!p){slot.innerHTML='<h1></h1><p></p>';h=slot.querySelector('h1');p=slot.querySelector('p')}if(h.textContent!==title)h.textContent=title;if(p.textContent!==desc)p.textContent=desc;slot.dataset.routeTitle=route();document.title=`Octopus · ${title}`}
function removeDuplicatePageHeads(){const slot=document.getElementById(SLOT);if(!slot)return;const title=(slot.querySelector('h1')?.textContent||'').replace(/\s+/g,' ').trim();document.querySelectorAll('.oct-title-duplicate').forEach(x=>x.classList.remove('oct-title-duplicate'));if(!title)return;document.querySelectorAll('header h1,header h2,.topbar h1,.topbar h2').forEach(h=>{if(slot.contains(h))return;if((h.textContent||'').replace(/\s+/g,' ').trim()===title)h.closest('.workspace,.v815head,.occ-head,.oge-head')?.classList.add('oct-title-duplicate')})}
function apply(){css();writeRouteTitle();removeDuplicatePageHeads()}
let raf=0;function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(apply)}
css();apply();
window.addEventListener('hashchange',schedule);window.addEventListener('popstate',schedule);window.addEventListener('octopus-owned-route-change',schedule);window.addEventListener('pageshow',schedule);window.addEventListener('octopus-language-change',schedule);window.addEventListener('resize',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
window.OctopusTitleSingleSource={apply,meta:META,version:'4.0'};
})();