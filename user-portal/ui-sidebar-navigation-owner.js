(()=>{
'use strict';
const NAV='v80nav',LANG='octopus-user-v7-language';
const groups=[
 ['运营导向','Operations','运营决策与风险处理',[['operations.channel-analysis','频道数据分析','Channel Analytics'],['operations.ad-intelligence','大数据投流抓取分析','Ad Intelligence'],['operations.unblock','解禁链接反馈管理','Unblock Management']]],
 ['内容生产','Content Production','素材入库与 AI 内容加工',[['production.content','剧集上传与 AI 标签','Upload & AI Tags'],['production.localization','多语种译配处理','Localization']]],
 ['发行流程','Release Workflow','物料生成与渠道分发',[['release.titles','AI 标题生成','AI Title Generation'],['release.covers','AI 封面生成','AI Cover Generation'],['release.review','物料审核','Creative Review'],['release.distribution','上传频道分发','Channel Distribution']]],
 ['数据看板','Dashboards','效果监控与风险复盘',[['dashboard.series','剧集维度看板','Series Dashboard'],['dashboard.channels','频道账号看板','Channel Dashboard'],['dashboard.external','外部投流对标看板','External Benchmark'],['dashboard.risk','风险禁播看板','Risk Dashboard']]],
 ['系统管理','System','平台底层支撑',[['system.channels','频道账号管理','Channel Accounts'],['system.assets','素材与片方库','Assets & Partners'],['system.templates','AI 模板配置','AI Templates'],['system.roles','权限角色管理','Roles & Permissions'],['system.tasks','异步任务中心','Async Task Center']]]
];
const en=()=>localStorage.getItem(LANG)==='en'||document.documentElement.lang?.toLowerCase().startsWith('en');
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function markup(){const r=route(),english=en();return `<button class="${r==='overview'?'active':''}" data-r="overview"><span>◈</span><b>${english?'Business Overview':'业务总览'}</b></button>`+groups.map((g,gi)=>`<div class="v815g"><div class="v815gh"><span class="v815no">${gi+1}</span><div><b>${english?g[1]:g[0]}</b><small>${g[2]}</small></div></div>${g[3].map((x,i)=>`<button class="v815item ${r===x[0]?'active':''}" data-r="${x[0]}"><span>${gi+1}.${i+1}</span><b>${english?x[2]:x[1]}</b></button>`).join('')}</div>`).join('')}
function apply(){const nav=document.getElementById(NAV);if(!nav)return;const html=markup();if(nav.dataset.sidebarOwner!==html){nav.innerHTML=html;nav.dataset.sidebarOwner=html}}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})}
window.addEventListener('hashchange',schedule);window.addEventListener('pageshow',schedule);window.addEventListener('octopus-language-change',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});apply();
})();
