(()=>{
'use strict';
const TITLES={
overview:['\u4e1a\u52a1\u603b\u89c8','\u4ee5\u201c\u9009\u54c1 \u2192 \u5185\u5bb9\u52a0\u5de5 \u2192 \u7269\u6599\u5236\u4f5c \u2192 \u6e20\u9053\u5206\u53d1 \u2192 \u76d1\u63a7\u8fed\u4ee3\u201d\u4e3a\u4e3b\u7ebf\u7ba1\u7406\u5168\u90e8\u53d1\u884c\u9879\u76ee\u3002'],
'operations.channel-analysis':['\u9891\u9053\u6570\u636e\u5206\u6790','\u591a\u7ef4\u67e5\u8be2\u89c2\u770b\u6b21\u6570\u3001\u70b9\u51fb\u7387\u3001\u6536\u5165\u3001\u7559\u5b58\u4e0e RPM\uff0c\u6309\u6807\u7b7e\u63a8\u8350\u540c\u7c7b\u578b\u5267\u96c6\u5e76\u8f93\u51fa\u9009\u5267\u53c2\u8003\u62a5\u544a\u3002'],
'operations.ad-intelligence':['\u5927\u6570\u636e\u6295\u6d41\u6293\u53d6\u5206\u6790','\u6293\u53d6 TikTok\u3001Facebook\u3001YouTube\u3001Instagram \u6295\u6d41\u7d20\u6750\uff0c\u7b5b\u9009\u7247\u5355\u5e76\u8f93\u51fa\u4e0a\u7ebf\u5efa\u8bae\u3002'],
'operations.unblock':['\u89e3\u7981\u94fe\u63a5\u53cd\u9988\u7ba1\u7406','\u81ea\u52a8\u68c0\u6d4b\u7981\u64ad\u72b6\u6001\uff0c\u6c47\u603b\u94fe\u63a5\u3001\u7247\u65b9\u3001\u6e20\u9053\u4e0e\u539f\u56e0\uff0c\u5e76\u63a8\u52a8\u89e3\u7981\u5de5\u5355\u95ed\u73af\u3002'],
'production.content':['\u5267\u96c6\u4e0a\u4f20\u4e0e AI \u6807\u7b7e\u63d0\u70bc','\u4e0a\u4f20\u5168\u5267\u7d20\u6750\uff0cAI \u89e3\u6790\u5267\u60c5\u4eae\u70b9\u5e76\u751f\u6210\u9891\u9053\u3001\u5267\u60c5\u3001\u6f14\u5458\u3001\u4eba\u8bbe\u3001\u573a\u666f\u3001\u5730\u57df\u4e0e\u65f6\u4ee3\u6807\u7b7e\u3002'],
'production.localization':['\u591a\u8bed\u79cd\u8bd1\u914d\u5904\u7406','\u4ece\u5f85\u751f\u6210\u5185\u5bb9\u521b\u5efa\u8bd1\u914d\u4efb\u52a1\uff0c\u5e76\u5728\u5df2\u751f\u6210\u7ed3\u679c\u4e2d\u67e5\u770b\u3001\u7f16\u8f91\u3001\u8bd5\u542c\u3001\u91cd\u65b0\u751f\u6210\u548c\u91c7\u7528\u7248\u672c\u3002'],
'release.titles':['AI \u6807\u9898\u751f\u6210','\u7406\u89e3\u5267\u60c5\u8bed\u4e49\u4e0e\u7206\u70b9\uff0c\u4e00\u6b21\u8f93\u51fa\u591a\u4e2a\u6807\u9898\u5019\u9009\uff0c\u9002\u914d\u9891\u9053\u98ce\u683c\u5e76\u652f\u6301\u4eba\u5de5\u7f16\u8f91\u3002'],
'release.covers':['AI \u5c01\u9762\u751f\u6210','\u63d0\u53d6\u89c6\u89c9\u7206\u70b9\u751f\u6210\u5c01\u9762\u5019\u9009\uff0c\u5339\u914d\u9891\u9053\u89c6\u89c9\u98ce\u683c\u5e76\u652f\u6301\u4eba\u5de5\u66ff\u6362\u3002'],
'release.review':['\u7269\u6599\u5ba1\u6838','\u5728\u540c\u4e00\u5ba1\u6838\u53f0\u9884\u89c8\u6807\u9898\u4e0e\u5c01\u9762\uff0c\u5b8c\u6210\u91c7\u7528\u3001\u9000\u56de\u3001\u4fee\u6539\u4e0e\u7248\u672c\u7559\u75d5\u3002'],
'release.distribution':['\u4e0a\u4f20\u9891\u9053\u5206\u53d1','\u6821\u9a8c\u5185\u5bb9\u4e0e\u9891\u9053\u5339\u914d\uff0c\u5b8c\u6210\u6c34\u5370\u538b\u5236\u3001API \u76f4\u4f20\u4e0e\u9519\u914d\u62e6\u622a\u3002'],
'dashboard.series':['\u5267\u96c6\u7ef4\u5ea6\u770b\u677f','\u6309\u5267\u96c6\u67e5\u770b\u64ad\u653e\u91cf\u3001\u70b9\u51fb\u7387\u3001\u7559\u5b58\u3001RPM \u4e0e\u6536\u5165\u8868\u73b0\u3002'],
'dashboard.channels':['\u9891\u9053\u8d26\u53f7\u770b\u677f','\u67e5\u770b\u9891\u9053\u8d26\u53f7\u6536\u76ca\u3001\u64ad\u653e\u8868\u73b0\u3001\u5065\u5eb7\u72b6\u6001\u4e0e\u7206\u6b3e\u5267\u96c6\u6392\u884c\u3002'],
'dashboard.external':['\u5916\u90e8\u6295\u6d41\u5bf9\u6807\u770b\u677f','\u5bf9\u6bd4\u5916\u90e8\u5e73\u53f0\u6295\u6d41\u7d20\u6750\u3001\u6295\u653e\u70ed\u5ea6\u4e0e\u672c\u5e73\u53f0\u5267\u96c6\u8868\u73b0\u3002'],
'dashboard.risk':['\u98ce\u9669\u7981\u64ad\u770b\u677f','\u96c6\u4e2d\u67e5\u770b\u7981\u64ad\u7edf\u8ba1\u3001\u89e3\u7981\u8fdb\u5ea6\u3001\u6e20\u9053\u98ce\u9669\u4e0e\u9884\u8b66\u8d8b\u52bf\u3002'],
'system.channels':['\u9891\u9053\u8d26\u53f7\u7ba1\u7406','\u7ef4\u62a4\u9891\u9053\u8d26\u53f7\u3001API \u5bc6\u94a5\u3001\u9891\u9053\u98ce\u683c\u4e0e\u6807\u7b7e\u914d\u7f6e\u3002'],
'system.assets':['\u7d20\u6750\u4e0e\u7247\u65b9\u5e93','\u7edf\u4e00\u7ba1\u7406\u77ed\u5267\u7d20\u6750\u3001\u7248\u672c\u8bb0\u5f55\u4e0e\u7247\u65b9\u5408\u4f5c\u4fe1\u606f\u3002'],
'system.templates':['AI \u6a21\u677f\u914d\u7f6e','\u914d\u7f6e\u6807\u9898 Prompt\u3001\u5c01\u9762\u98ce\u683c\u3001\u6c34\u5370\u6a21\u677f\u4e0e\u6807\u7b7e\u4f53\u7cfb\u3002'],
'system.roles':['\u6743\u9650\u89d2\u8272\u7ba1\u7406','\u7ba1\u7406\u8fd0\u8425\u3001\u5185\u5bb9\u4e0e\u7ba1\u7406\u5458\u89d2\u8272\u7684\u6570\u636e\u8303\u56f4\u548c\u64cd\u4f5c\u6743\u9650\u3002'],
'system.tasks':['\u5f02\u6b65\u4efb\u52a1\u4e2d\u5fc3','\u7edf\u4e00\u67e5\u770b\u8bd1\u914d\u3001\u6807\u9898\u5c01\u9762\u3001\u6279\u91cf\u4e0a\u4f20\u4efb\u52a1\u53ca\u5931\u8d25\u91cd\u8bd5\u3002']
};
const EN_TITLES={
overview:['Business Overview','Manage the full release workflow from content selection and production to material creation, channel distribution, and optimization.'],
'operations.channel-analysis':['Channel Data Analysis','Analyze views, CTR, revenue, retention and RPM, then produce data-backed content-selection reports.'],
'operations.ad-intelligence':['Paid Media Intelligence','Collect and analyze TikTok, Facebook, YouTube and Instagram campaign materials and launch opportunities.'],
'operations.unblock':['Restriction Resolution','Track blocked links, causes, owners and appeal cases through resolution.'],
'production.content':['Series Upload & AI Tags','Upload series materials, extract story highlights and manage complete AI tag sets.'],
'production.localization':['Multilingual Localization','Create and manage translation, dubbing, subtitles, quality checks and generated video versions.'],
'release.titles':['AI Title Generation','Generate channel-specific title candidates and support manual editing.'],
'release.covers':['AI Cover Generation','Generate and edit channel-specific cover candidates.'],
'release.review':['Material Review','Review titles and covers together, approve, return and retain version history.'],
'release.distribution':['Channel Distribution','Match approved content and materials to channels, validate and create distribution tasks.'],
'dashboard.series':['Series Analytics','Analyze series performance across views, CTR, retention, RPM and revenue.'],
'dashboard.channels':['Channel Analytics','Analyze channel revenue, performance, health and top-performing series.'],
'dashboard.external':['External Benchmarking','Compare external campaign trends with internal series performance.'],
'dashboard.risk':['Risk & Restriction Analytics','Analyze restriction trends, resolution progress, channel risk and alerts.'],
'system.channels':['Channel Account Management','Manage channel accounts, OAuth/API configuration, channel styles and tags.'],
'system.assets':['Material & Partner Library','Manage series materials, versions, rights and content partners.'],
'system.templates':['AI Template Configuration','Configure title prompts, cover styles, watermark templates and tag systems.'],
'system.roles':['Roles & Permissions','Manage role data scopes, module permissions and approval policies.'],
'system.tasks':['Async Task Center','Monitor localization, generation, upload and retry tasks.']
};
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function style(){let s=document.getElementById('route-title-spacing-style');if(!s){s=document.createElement('style');s.id='route-title-spacing-style';document.head.appendChild(s)}s.textContent=`.ota-toolbar #octopusGlobalActionHost,.ota-toolbar [data-primary],.ota-toolbar .otp-list-primary{display:none!important}#pageRoot>.v815page:not(.gw3-page),#pageRoot>.occ-page,#pageRoot>.oge-page{padding-top:22px!important}.gw3-page{padding-top:24px!important}`}
function fix(){
 style();
 const isEn=localStorage.getItem('octopus-user-v7-language')==='en',data=(isEn?EN_TITLES:TITLES)[route()];if(!data)return;
 const slot=document.getElementById('octopusGlobalTitleSlot');if(!slot)return;
 let h=slot.querySelector('h1'),p=slot.querySelector('p');if(!h||!p){slot.innerHTML='<h1></h1><p></p>';h=slot.querySelector('h1');p=slot.querySelector('p')}
 if(h.textContent!==data[0])h.textContent=data[0];if(p.textContent!==data[1])p.textContent=data[1];const lang=isEn?'en':'zh-CN';if(h.getAttribute('lang')!==lang)h.setAttribute('lang',lang);if(p.getAttribute('lang')!==lang)p.setAttribute('lang',lang);
}
window.addEventListener('hashchange',()=>{setTimeout(fix,0);setTimeout(fix,80);setTimeout(fix,240)});let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;fix()})}).observe(document.documentElement,{childList:true,subtree:true});fix();setTimeout(fix,400);setTimeout(fix,1200);
})();