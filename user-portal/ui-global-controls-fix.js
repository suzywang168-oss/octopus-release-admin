(()=>{
'use strict';
const LANG_KEY='octopus-user-v7-language',THEME_KEY='octopus-v7-theme';
const UI_EN={
'关闭':'Close','取消':'Cancel','确认':'Confirm','确认操作':'Confirm','保存':'Save','保存修改':'Save changes','编辑':'Edit','删除':'Delete','返回':'Back','下一步':'Next','上一步':'Previous','完成':'Done',
'登录':'Sign in','注册':'Create account','退出登录':'Sign out','邮箱':'Email','手机号':'Phone','密码':'Password','验证码':'Verification code','获取验证码':'Send code','忘记密码':'Forgot password','创建账号':'Create account','已有账号？':'Already have an account?','还没有账号？':'New to Octopus?','进入工作空间':'Enter workspace','直接进入演示空间':'Enter demo workspace','跳过注册，进入演示空间':'Skip registration and enter demo',
'验证账号':'Verify account','手机号或邮箱':'Phone or email','企业信息':'Company details','完善工作空间':'Set up workspace','创建完成':'Workspace ready',
'业务总览':'Business Overview','运营导向':'Operations','内容生产':'Content Production','发行流程':'Release Workflow','数据看板':'Dashboards','系统管理':'System',
'运营决策与风险处理':'Operational decisions and risk handling','素材入库与AI内容加工':'Asset intake and AI processing','物料生成与渠道分发':'Creative generation and distribution','效果监控与风险复盘':'Performance monitoring and risk review','平台底层支撑':'Platform infrastructure',
'频道数据分析':'Channel Analytics','大数据投流抓取分析':'Ad Intelligence','解禁链接反馈管理':'Unblock Management','剧集上传与AI标签':'Upload & AI Tags','剧集上传与AI标签提炼':'Upload & AI Tags','多语种译配处理':'Localization','AI标题生成':'AI Title Generation','AI封面生成':'AI Cover Generation','物料审核':'Creative Review','上传频道分发':'Channel Distribution','剧集维度看板':'Series Dashboard','频道账号看板':'Channel Dashboard','外部投流对标看板':'External Benchmark','风险禁播看板':'Risk Dashboard','频道账号管理':'Channel Accounts','素材与片方库':'Assets & Partners','AI模板配置':'AI Templates','权限角色管理':'Roles & Permissions','异步任务中心':'Async Task Center',
'选品阶段':'Selection','内容加工':'Processing','物料制作':'Creative','渠道分发':'Distribution','监控迭代':'Monitoring','数据与投流判断潜力剧集':'Identify high-potential series from channel and ad data','上传、标签提炼、多语种译配':'Upload, tagging and localization','生成标题封面并人工审核':'Generate titles and covers with human review','频道校验、水印与API上传':'Channel checks, watermarking and API upload','效果复盘与禁播风险处理':'Performance review and ban-risk handling',
'以“选品 → 内容加工 → 物料制作 → 渠道分发 → 监控迭代”为主线管理全部发行项目。':'Manage every distribution project through Selection → Processing → Creative → Distribution → Monitoring.','新建发行项目':'New distribution project',
'多维查询观看次数、点击率、收入、留存与RPM，按标签推荐同类型剧集并输出选剧参考报告。':'Analyze views, CTR, revenue, retention and RPM, then recommend similar internal-library series by tags.','生成选剧参考报告':'Generate selection report',
'抓取TK、FB、YT、INS投流素材，筛选片单内有效内容并输出剧集上线建议。':'Collect TikTok, Facebook, YouTube and Instagram ad creatives, match valid titles in the internal library and produce launch recommendations.','新建抓取任务':'New crawl task',
'自动检测禁播状态，汇总链接、片方、渠道与原因，并推动解禁工单闭环。':'Detect blocked content, consolidate links, partners, channels and causes, and drive unblock tickets to closure.','新建解禁工单':'New unblock ticket',
'上传全剧素材，AI解析剧情亮点并生成频道、剧情、演员、人设、场景、地域与时代标签。':'Upload full-series assets and use AI to extract story highlights plus channel, plot, cast, character, scene, region and era tags.','上传剧集内容':'Upload series',
'完成英语、西班牙语、阿拉伯语、俄语的翻译与配音，并执行素材去重检测。':'Translate and dub English, Spanish, Arabic and Russian versions with asset deduplication checks.','创建译配任务':'Create localization task',
'理解剧情语义与爆点，一次输出3个不超过100字符的标题，适配频道风格并规避冲突。':'Generate three titles under 100 characters from story semantics and hooks, tailored to channel style with conflict checks.','批量生成标题':'Generate titles in batch',
'提取视觉爆点，一次生成3张冲突感封面，匹配频道视觉风格并支持人工替换。':'Extract visual hooks and generate three high-conflict covers matched to channel style with manual replacement support.','批量生成封面':'Generate covers in batch',
'在同一审核台预览标题与封面，完成采用、退回、修改与版本留痕。':'Review titles and covers in one workspace with approval, return, edit and version history.','进入批量审核':'Open batch review',
'校验内容与频道匹配，完成水印压制、API直传与频道-剧集错配拦截。':'Validate series-channel matching, apply watermarks, upload by API and block channel-series mismatches.','新建分发任务':'New distribution task',
'按剧集查看播放量、点击率、留存、RPM与收入表现。':'Review views, CTR, retention, RPM and revenue by series.','导出剧集报表':'Export series report',
'编辑 AI 标签':'Edit AI Tags','编辑AI标签':'Edit AI tags','创建跟进任务':'Create follow-up task','导出分析报告':'Export report','审核所选物料':'Review selected','查看解析':'View analysis','编辑账号':'Edit account','管理API密钥':'Manage API credentials','查看资料':'View details','维护授权':'Manage rights','编辑模板':'Edit template','查看效果':'View performance','编辑权限':'Edit permissions','查看成员':'View members','查看日志':'View logs','重试任务':'Retry task',
'对标对比':'Benchmark','同标签推荐':'Similar-tag recommendations','加入选剧报告':'Add to selection report','查看素材':'View creative','加入片单筛选':'Add to shortlist','生成上线建议':'Generate launch recommendation','查看链接':'View link','更新工单':'Update ticket','补充材料':'Add documents','管理版本':'Manage versions','查看任务':'View task','配置译配':'Configure localization','去重检测':'Deduplication check','查看3个标题':'View 3 titles','编辑标题':'Edit title','采用标题':'Use title','预览3张封面':'Preview 3 covers','编辑或替换':'Edit or replace','采用封面':'Use cover','标题封面预览':'Preview title & cover','通过物料':'Approve creative','退回修改':'Return for edits','发布前校验':'Pre-publish check','配置水印':'Configure watermark','查看上传':'View upload',
'近 7 天':'Last 7 days','近 30 天':'Last 30 days','近 90 天':'Last 90 days','全部地区':'All regions','全部频道':'All channels','全部状态':'All statuses','搜索当前列表':'Search current list','搜索剧集、频道或版本':'Search series, channel, or version','创建任务':'Create task','负责人':'Owner','优先级':'Priority',
'剧集':'Series','核心标签':'Core tags','播放量':'Views','观看次数':'Views','点击率':'CTR','收入':'Revenue','留存':'Retention','D1留存':'D1 retention','D7留存':'D7 retention','推荐分':'Recommendation score','频道':'Channel','频道账号':'Channel account','视频版本':'Video version','素材版本':'Asset version','语种版本':'Language version','水印模板':'Watermark template','匹配分':'Match score','上传方式':'Upload method','进度':'Progress','状态':'Status','趋势':'Trend','片方':'Partner','平台':'Platform','素材ID':'Creative ID','热词/题材':'Keyword / Genre','抓取量':'Crawled','互动率':'Engagement','片单命中':'Library match','关联剧集':'Matched series','上线建议':'Launch recommendation','链接':'Link','禁播渠道':'Blocked channel','禁播原因':'Block reason','检测时间':'Detected','处理状态':'Handling status','解析进度':'Analysis progress','剧情亮点':'Story highlights','AI标签数':'AI tags','人工状态':'Review status','目标语种':'Target language','翻译进度':'Translation','配音进度':'Dubbing','字幕对齐':'Subtitle alignment','去重风险':'Duplication risk','质检状态':'QC status','预计完成':'ETA','目标频道':'Target channel','内容爆点':'Story hook','候选标题数':'Title options','CTR预测':'CTR forecast','字符数':'Characters','冲突检测':'Conflict check','视觉爆点':'Visual hook','候选封面':'Cover options','风格匹配':'Style match','重复度':'Duplication','标题状态':'Title status','封面状态':'Cover status','匹配校验':'Match check','审核人':'Reviewer','版本':'Version','整体状态':'Overall status','更新时间':'Updated','操作':'Actions',
'近30天播放量':'30-day views','平均点击率':'Average CTR','平均RPM':'Average RPM','可推荐剧集':'Recommended series','今日抓取素材':'Creatives crawled today','片单有效命中':'Valid library matches','高潜上线建议':'High-potential launches','覆盖平台':'Platforms covered','当前禁播链接':'Blocked links','处理中工单':'Tickets in progress','本月恢复率':'Recovery rate this month','高风险频道':'High-risk channels','素材库剧集':'Series in library','AI标签完成':'AI tagging complete','待人工确认':'Awaiting review','存储占用':'Storage used','进行中任务':'Tasks in progress','平均完成时长':'Average completion time','去重风险命中':'Duplication flags','质检通过率':'QC pass rate','待生成剧集':'Series pending','今日生成标题':'Titles generated today','冲突拦截':'Conflicts blocked','平均字符数':'Average characters','今日生成封面':'Covers generated today','风格匹配率':'Style match rate','人工替换':'Manual replacements','待审核物料':'Creative pending review','今日通过':'Approved today','平均审核时长':'Average review time','待分发任务':'Distribution tasks pending','API上传中':'API uploads in progress','错配拦截':'Mismatch blocks','渠道成功率':'Channel success rate','总播放量':'Total views','平均D7留存':'Average D7 retention','总收入':'Total revenue',
'待审核 / 复核中':'Pending / In review','待审核':'Pending review','已审核':'Reviewed','已通过':'Approved','已退回':'Returned','待确认':'Pending confirmation','已确认':'Confirmed','解析中':'Analyzing','处理中':'In progress','已完成':'Completed','待终审':'Pending final review','低':'Low','中':'Medium','高':'High','无冲突':'No conflict','待采用':'Pending selection','待编辑':'Pending edit','已采用':'Selected','待替换':'Pending replacement','通过':'Passed','待修改':'Needs edits','需修改':'Needs edits','上传中':'Uploading','限流等待':'Rate-limit wait','平台审核':'Platform review','命中':'Matched','优先上线':'Priority launch','建议测试':'Test recommended','材料待补':'Documents needed','申诉中':'Appeal in progress','平台复核':'Platform review','强劲':'Strong','上升':'Rising',
'确认并创建待分发任务':'Create distribution task','保存权限配置':'Save permissions','保存密钥配置':'Save credentials','检查接入条件':'Check requirements','验证配置条件':'Validate configuration'
};
const UI_ZH=Object.fromEntries(Object.entries(UI_EN).map(([zh,en])=>[en,zh]));
const setText=(el,value)=>{if(value!=null&&el.textContent!==value)el.textContent=value};
function closeEditor(){
 const d=document.getElementById('octopusRowEditor');if(!d)return;
 d.classList.remove('open','oap-tags-mode');d.removeAttribute('data-oap-mode');
}
function syncTheme(){
 const light=localStorage.getItem(THEME_KEY)==='light';document.body.classList.toggle('light',light);
 document.querySelectorAll('[data-theme]').forEach(b=>{setText(b,light?'☾':'◐');b.title=light?'Switch to dark theme':'Switch to light theme';b.setAttribute('aria-label',b.title)});
}
function syncLegacyLanguage(next){
 try{if(typeof currentLang!=='undefined')currentLang=next}catch{}
 try{window.currentLang=next}catch{}
 try{if(typeof applyStaticLanguage==='function')applyStaticLanguage(document)}catch{}
}
function translateTextNodes(root,dict){
 if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
   const parent=node.parentElement;
   if(!parent||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(parent.tagName))return NodeFilter.FILTER_REJECT;
   return node.nodeValue&&node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
 }});
 const nodes=[];let node;
 while((node=walker.nextNode()))nodes.push(node);
 nodes.forEach(n=>{
   const raw=n.nodeValue.trim(),translated=dict[raw];
   if(!translated||translated===raw)return;
   const start=n.nodeValue.indexOf(raw);
   n.nodeValue=n.nodeValue.slice(0,start)+translated+n.nodeValue.slice(start+raw.length);
 });
}
function translateUi(){
 const en=localStorage.getItem(LANG_KEY)==='en';
 const next=en?'en':'zh';
 document.documentElement.lang=en?'en':'zh-CN';
 document.body?.setAttribute('data-language',next);
 syncLegacyLanguage(next);
 document.querySelectorAll('[data-lang-toggle]').forEach(b=>setText(b,en?'中文':'EN'));
 document.querySelectorAll('[data-zh][data-en]').forEach(el=>setText(el,en?el.dataset.en:el.dataset.zh));
 document.querySelectorAll('[data-zh-placeholder][data-en-placeholder]').forEach(el=>{const v=en?el.dataset.enPlaceholder:el.dataset.zhPlaceholder;if(el.placeholder!==v)el.placeholder=v});
 const dict=en?UI_EN:UI_ZH;
 ['authShell','authView','loginView','registerView','v80nav','pageRoot','octopusRowEditor','apfModal'].forEach(id=>translateTextNodes(document.getElementById(id),dict));
 document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{const translated=dict[el.placeholder];if(translated&&el.placeholder!==translated)el.placeholder=translated});
}
function applyLanguage(next){
 localStorage.setItem(LANG_KEY,next);
 syncLegacyLanguage(next);
 translateUi();
 try{window.dispatchEvent(new CustomEvent('octopus-language-change',{detail:{language:next}}))}catch{}
 try{window.dispatchEvent(new Event('hashchange'))}catch{}
 requestAnimationFrame(()=>translateUi());
 setTimeout(translateUi,80);
 setTimeout(translateUi,320);
 window.toast?.(next==='en'?'Switched to English':'已切换中文');
}
function suppressLegacyPointerClick(el,attr){
 const value=el.getAttribute(attr),pointer=el.style.pointerEvents;
 el.removeAttribute(attr);el.style.pointerEvents='none';
 setTimeout(()=>{
   if(!el.isConnected)return;
   el.setAttribute(attr,value??'');el.style.pointerEvents=pointer;syncTheme();translateUi();
 },420);
}
window.addEventListener('pointerdown',e=>{
 const t=e.target instanceof Element?e.target:null;if(!t)return;
 if(t.closest('#octopusRowEditor [data-ore-close]')){e.preventDefault();e.stopImmediatePropagation();closeEditor();return}
 const theme=t.closest('[data-theme]');
 if(theme){
   e.preventDefault();e.stopImmediatePropagation();
   const next=localStorage.getItem(THEME_KEY)==='light'?'dark':'light';
   localStorage.setItem(THEME_KEY,next);syncTheme();
   window.toast?.(next==='light'?(document.documentElement.lang==='en'?'Light theme enabled':'已切换浅色主题'):(document.documentElement.lang==='en'?'Dark theme enabled':'已切换深色主题'));
   suppressLegacyPointerClick(theme,'data-theme');return;
 }
 const lang=t.closest('[data-lang-toggle]');
 if(lang){
   e.preventDefault();e.stopImmediatePropagation();
   applyLanguage(localStorage.getItem(LANG_KEY)==='en'?'zh':'en');
   suppressLegacyPointerClick(lang,'data-lang-toggle');
 }
},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('octopusRowEditor')?.classList.contains('open')){e.preventDefault();closeEditor()}},true);
window.addEventListener('click',e=>{
 const t=e.target instanceof Element?e.target:null;if(!t)return;
 const theme=t.closest('[data-theme]');if(theme){e.preventDefault();e.stopImmediatePropagation();const next=localStorage.getItem(THEME_KEY)==='light'?'dark':'light';localStorage.setItem(THEME_KEY,next);syncTheme();return}
 const lang=t.closest('[data-lang-toggle]');if(lang){e.preventDefault();e.stopImmediatePropagation();applyLanguage(localStorage.getItem(LANG_KEY)==='en'?'zh':'en');return}
},true);
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;syncTheme();translateUi()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('hashchange',schedule);
window.addEventListener('octopus-language-change',schedule);
syncTheme();translateUi();setTimeout(schedule,300);setTimeout(schedule,900);
})();