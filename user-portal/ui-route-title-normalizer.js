(()=>{
'use strict';
const TITLES={
overview:['业务总览','以“选品 → 内容加工 → 物料制作 → 渠道分发 → 监控迭代”为主线管理全部发行项目。'],
'operations.channel-analysis':['频道数据分析','多维查询观看次数、点击率、收入、留存与 RPM，按标签推荐同类型剧集并输出选剧参考报告。'],
'operations.ad-intelligence':['大数据投流抓取分析','抓取 TikTok、Facebook、YouTube、Instagram 投流素材，筛选片单并输出上线建议。'],
'operations.unblock':['解禁链接反馈管理','自动检测禁播状态，汇总链接、片方、渠道与原因，并推动解禁工单闭环。'],
'production.content':['剧集上传与 AI 标签提炼','上传全剧素材，AI 解析剧情亮点并生成频道、剧情、演员、人设、场景、地域与时代标签。'],
'production.localization':['多语种译配处理','从待生成内容创建译配任务，并在已生成结果中查看、编辑、试听、重新生成和采用版本。'],
'release.titles':['AI 标题生成','理解剧情语义与爆点，一次输出多个标题候选，适配频道风格并支持人工编辑。'],
'release.covers':['AI 封面生成','提取视觉爆点生成封面候选，匹配频道视觉风格并支持人工替换。'],
'release.review':['物料审核','在同一审核台预览标题与封面，完成采用、退回、修改与版本留痕。'],
'release.distribution':['上传频道分发','校验内容与频道匹配，完成水印压制、API 直传与错配拦截。'],
'dashboard.series':['剧集维度看板','按剧集查看播放量、点击率、留存、RPM 与收入表现。'],
'dashboard.channels':['频道账号看板','查看频道账号收益、播放表现、健康状态与爆款剧集排行。'],
'dashboard.external':['外部投流对标看板','对比外部平台投流素材、投放热度与本平台剧集表现。'],
'dashboard.risk':['风险禁播看板','集中查看禁播统计、解禁进度、渠道风险与预警趋势。'],
'system.channels':['频道账号管理','维护频道账号、API 密钥、频道风格与标签配置。'],
'system.assets':['素材与片方库','统一管理短剧素材、版本记录与片方合作信息。'],
'system.templates':['AI 模板配置','配置标题 Prompt、封面风格、水印模板与标签体系。'],
'system.roles':['权限角色管理','管理运营、内容与管理员角色的数据范围和操作权限。'],
'system.tasks':['异步任务中心','统一查看译配、标题封面、批量上传任务及失败重试。']
};
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function style(){let s=document.getElementById('route-title-spacing-style');if(!s){s=document.createElement('style');s.id='route-title-spacing-style';document.head.appendChild(s)}s.textContent=`.ota-toolbar #octopusGlobalActionHost,.ota-toolbar [data-primary],.ota-toolbar .otp-list-primary{display:none!important}#pageRoot>.v815page:not(.gw3-page),#pageRoot>.occ-page,#pageRoot>.oge-page{padding-top:22px!important}.gw3-page{padding-top:24px!important}`}
function fix(){
 style();
 const data=TITLES[route()];if(!data)return;
 const slot=document.getElementById('octopusGlobalTitleSlot');if(!slot)return;
 let h=slot.querySelector('h1'),p=slot.querySelector('p');if(!h||!p){slot.innerHTML='<h1></h1><p></p>';h=slot.querySelector('h1');p=slot.querySelector('p')}
 h.textContent=data[0];p.textContent=data[1];h.setAttribute('lang','zh-CN');p.setAttribute('lang','zh-CN');
}
window.addEventListener('hashchange',()=>setTimeout(fix,0));new MutationObserver(()=>requestAnimationFrame(fix)).observe(document.documentElement,{childList:true,subtree:true,characterData:true});fix();setTimeout(fix,400);setTimeout(fix,1200);
})();