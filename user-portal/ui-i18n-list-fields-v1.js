(()=>{
'use strict';
const LANG_KEY='octopus-user-v7-language';
const CJK=/[\u3400-\u9fff]/;
const originals=new WeakMap(),attrOriginals=new WeakMap(),observers=new WeakMap();
let applying=false,queued=false,lastLang='';
const MAP={
// Generic table/list labels
'成员':'Member','账号':'Account','所属角色':'Assigned role','数据范围':'Data scope','个人覆盖':'Personal overrides','敏感操作审批':'Sensitive-action approval','最终权限':'Effective permissions','状态':'Status','操作':'Actions','角色':'Role','成员数':'Members','已授权模块':'Authorized modules','敏感操作规则':'Sensitive-action rules','权限版本':'Permission version','最终权限计算':'Effective permission calculation','应用规则':'Application rules',
'视频 ID':'Video ID','视频ID':'Video ID','视频素材':'Video asset','剧集信息':'Series','视频类型':'Video type','视频文件':'Video file','版本 / 语种':'Version / Language','版本/语种':'Version / Language','技术规格':'Technical specs','片方信息':'Partner','素材 ID':'Asset ID','素材ID':'Asset ID','宣传素材':'Promotional asset','物料类型':'Asset type','标题 / 文件内容':'Title / File','标题/文件内容':'Title / File','目标频道':'Target channel','版本 / 规格':'Version / Specs','版本/规格':'Version / Specs','水印要求':'Watermark','片方 ID':'Partner ID','片方ID':'Partner ID','片方名称':'Partner name','类型':'Type','关联剧集':'Linked series','授权范围':'Rights scope','授权到期':'Rights expiry','负责人':'Owner','档案联系人':'Archive contact',
'任务 ID':'Task ID','任务ID':'Task ID','来源视频':'Source video','译配视频版本':'Localized video version','语种':'Language','时长':'Duration','已添加水印':'Watermarks added','最近状态':'Latest status','可添加渠道':'Available channels','水印成片':'Watermarked video','水印模板':'Watermark template','质检状态':'QC status','完成时间':'Completed at','水印任务 ID':'Watermark task ID','水印任务ID':'Watermark task ID','目标语种':'Target language','集数':'Episodes','配音策略':'Dubbing strategy','任务状态':'Task status','翻译进度':'Translation','配音进度':'Dubbing','字幕对齐':'Subtitle alignment','字幕质量':'Subtitle quality','版本':'Version','剧集 / 集数':'Series / Episodes','剧集/集数':'Series / Episodes',
'封面':'Cover','发行标题':'Distribution title','标题':'Title','视频':'Video','风险':'Risk','审核状态':'Review status','审核人':'Reviewer','更新时间':'Updated','创建时间':'Created','计划时间':'Scheduled','推荐题材':'Recommended genre','目标地区 / 语种':'Target region / Language','目标地区/语种':'Target region / Language','建议账号':'Suggested account','测试预算':'Test budget','上线机会':'Launch opportunity','推荐素材':'Recommended creative','匹配校验':'Match check','上传方式':'Upload method','进度':'Progress','地区 / 语种':'Region / Language','地区/语种':'Region / Language','频道账号':'Channel account','内容类型':'Content type','文件内容':'File content','规格':'Specs','来源':'Source','处理结果':'Result','最近更新':'Updated','当前版本':'Current version','模板名称':'Template','模板类型':'Template type','适用频道':'Applicable channels','使用次数':'Uses','效果指标':'Performance','对象':'Object','业务对象':'Business object','运行节点':'Worker','耗时 / 预计':'Duration / ETA','耗时/预计':'Duration / ETA',
// Tabs and section names
'个人权限表':'Individual Permissions','角色综合表':'Role Summary','视频内容':'Video Content','宣传内容':'Promotional Content','片方档案':'Partner Profiles','可压制水印':'Ready for Watermarking','已压制水印':'Watermarked','频道水印任务':'Channel Watermark Tasks','待生成':'Pending Generation','已生成结果':'Generated Results','生成结果':'Generated Results','待审核物料':'Pending Review','已审核物料':'Reviewed','标题审核':'Title Review','封面审核':'Cover Review','视频审核':'Video Review','全部类型':'All types','全部视频':'All videos','全部结果':'All results','全部完成时间':'All completion times','今日完成':'Completed today','全部任务':'All tasks','全部语种':'All languages','全部状态':'All statuses','全部渠道':'All channels','全部平台':'All platforms','全部角色':'All roles','全部成员':'All members',
// Asset types / language / versions
'原片':'Master','译配成片':'Localized video','宣传视频':'Promo video','竖版封面':'Portrait cover','横版封面':'Landscape cover','宣传海报':'Promo poster','发行标题':'Distribution title','英语':'English','西班牙语':'Spanish','阿拉伯语':'Arabic','俄语':'Russian','中文':'Chinese','西语':'Spanish','阿语':'Arabic','英语 EN':'English EN','西班牙语 ES':'Spanish ES','阿拉伯语 AR':'Arabic AR','俄语 RU':'Russian RU','宣传素材':'Promotional asset',
// Statuses
'启用':'Enabled','暂停':'Paused','正常':'Normal','已入库':'In library','解析中':'Analyzing','质检通过':'QC passed','质检中':'QC in progress','待质检':'Pending QC','待处理':'Pending','已处理':'Processed','待加水印':'Watermark needed','已加水印':'Watermarked','水印已压制':'Watermark applied','水印质检通过':'Watermark QC passed','不适用':'N/A','已采用':'Selected','已审核':'Reviewed','待审核':'Pending review','已生成':'Generated','待生成':'Pending generation','复核中':'In review','已通过':'Approved','已退回':'Returned','退回修改':'Returned for edits','待修改':'Needs edits','需修改':'Needs edits','待确认':'Pending confirmation','已确认':'Confirmed','处理中':'In progress','待终审':'Pending final review','已完成':'Completed','运行中':'Running','排队中':'Queued','失败':'Failed','重试中':'Retrying','待配置':'Needs configuration','待压制':'Ready to process','压制中':'Processing','已压制':'Processed','待采用':'Pending selection','抽检中':'Sampling QC','终检中':'Final QC','参数待确认':'Parameters pending','素材待补':'Assets missing','通过':'Passed','低风险':'Low risk','中风险':'Medium risk','高风险':'High risk','无风险':'No risk','低':'Low','中':'Medium','高':'High','健康':'Healthy','待续约':'Renewal due','待补材料':'Documents pending','已授权':'Authorized','已配置':'Configured','已发布':'Published','发布中':'Publishing','待分发':'Pending distribution','分发中':'Distributing','分发成功':'Distributed','已上线':'Live','待上线':'Pending launch','待审批':'Pending approval','审批中':'Under approval','已拒绝':'Rejected',
// Permission values
'系统管理员':'System Administrator','运营负责人':'Operations Lead','数据运营':'Data Operations','物料审核员':'Creative Reviewer','频道运营':'Channel Operations','角色 + 个人覆盖':'Role + personal overrides','角色+个人覆盖':'Role + personal overrides','无':'None','允许':'Allow','禁止':'Deny','需审批':'Approval required','继承角色':'Inherit role','只读':'Read only','全部频道 · 全部项目':'All channels · All projects','分配频道 · 全部运营数据':'Assigned channels · All operations data','全部看板 · 只读业务数据':'All dashboards · Read-only business data','分配项目 · 物料审核':'Assigned projects · Creative review','分配频道 · 分发任务':'Assigned channels · Distribution tasks','允许导出数据':'Data export allowed','禁止频道密钥管理':'Channel credential management denied','允许退回物料':'Can return creatives','禁止删除任务':'Task deletion denied','高风险操作二次确认':'Secondary confirmation for high-risk actions','分发需要审批':'Distribution requires approval','导出敏感数据需审批':'Sensitive exports require approval','批量通过需要审批':'Batch approval requires approval','频道分发需要审批':'Channel distribution requires approval','正式分发需审批':'Production distribution requires approval','二次确认':'Secondary confirmation','分发与删除需审批':'Distribution and deletion require approval','敏感导出需审批':'Sensitive export requires approval',
// Localization values
'多角色自动匹配':'Automatic multi-role matching','沿用角色音色库':'Reuse character voice library','沿用上一季音色':'Reuse previous-season voices','需文化适配':'Cultural adaptation required','翻译 100%':'Translation 100%','配音 100%':'Dubbing 100%','字幕 99.2%':'Subtitles 99.2%','字幕 98.8%':'Subtitles 98.8%','字幕 97.6%':'Subtitles 97.6%','字幕 99.0%':'Subtitles 99.0%','字幕 98.9%':'Subtitles 98.9%','字幕 99.1%':'Subtitles 99.1%','字幕 98.2%':'Subtitles 98.2%','字幕 98.7%':'Subtitles 98.7%',
// Buttons / actions
'下载':'Download','下载当前表':'Download current table','导出':'Export','预览':'Preview','查看':'View','编辑':'Edit','删除':'Delete','保存':'Save','取消':'Cancel','关闭':'Close','确认':'Confirm','搜索':'Search','重置':'Reset','查看档案':'View profile','编辑个人权限':'Edit individual permissions','查看权限矩阵':'View permission matrix','保存个人权限':'Save individual permissions','保存角色权限':'Save role permissions','管理水印':'Manage watermarks','添加水印':'Add watermark','继续添加水印':'Add another watermark','去加水印':'Add watermark','查看结果':'View result','进入 AI 标题':'Open AI Titles','进入AI标题':'Open AI Titles','进入 AI 封面':'Open AI Covers','进入AI封面':'Open AI Covers','查看译配结果':'View localization result','重新压制':'Reprocess','配置水印':'Configure watermark','开始压制':'Start processing','批量开始压制':'Start batch processing','添加并开始压制':'Add & process','查看多水印结果':'View multi-watermark results','批量审核':'Batch review','单条审核':'Review','编辑标题':'Edit title','编辑封面':'Edit cover','通过物料':'Approve creative','退回修改':'Return for edits','采用':'Use','重新生成':'Regenerate','生成':'Generate','创建任务':'Create task','查看任务':'View task','继续编辑':'Continue editing','查看详情':'View details','更多':'More',
// Filters / placeholders
'搜索成员、角色、频道或项目':'Search members, roles, channels or projects','搜索宣传素材 ID、剧集、频道或文件':'Search promo asset ID, series, channel or file','搜索素材 ID、剧集 ID、片方 ID、视频、封面或标题':'Search asset ID, series ID, partner ID, video, cover or title','搜索剧集、频道、译配版本或水印模板':'Search series, channel, localized version or watermark template','搜索已压制剧集、频道、版本或模板':'Search watermarked series, channel, version or template','搜索水印任务、来源视频、剧集、频道或模板':'Search watermark task, source video, series, channel or template','全部状态':'All statuses','全部类型':'All types','标题':'Title','封面':'Cover','视频':'Video',
// Common content and metadata
'北美 · 英语':'North America · English','拉美 · 西班牙语':'LATAM · Spanish','北美 / 英语':'North America / English','拉美 / 西语':'LATAM / Spanish','全球 · 全语种':'Global · All languages','全球 · 英语':'Global · English','北美 / 拉美':'North America / LATAM','北美 / 欧洲':'North America / Europe','欧洲 / 澳洲':'Europe / Australia','内容制作方':'Content Producer','版权合作方':'Rights Partner','配音供应商':'Dubbing Vendor','发行合作方':'Distribution Partner','版权代理方':'Rights Agent','全部频道':'All channels','全部项目':'All projects','仅分配频道与项目':'Assigned channels and projects only','仅本人创建记录':'Records created by this user only',
// Series names used in demo data
'逆光心动':'Afterglow Heartbeat','契约之后':'After the Contract','她从雨夜归来':'Return from the Rain','炽热边界':'Blazing Border','重启心跳':'Restarted Heartbeat','错位千金':'Misplaced Heiress','危险婚约':'Dangerous Vows','月光失约':'Broken Moonlight','星海影业':'Starsea Pictures','晨光传媒':'Dawn Media','远山内容':'Far Mountain Content','北辰影业':'Northstar Pictures','光年内容':'Lightyear Content','蓝鲸工作室':'Blue Whale Studio','海岸版权中心':'Coast Rights Center'
};
const TOKENS={
'个人权限表':'Individual Permissions','角色综合表':'Role Summary','可压制水印':'Ready for Watermarking','已压制水印':'Watermarked','水印已压制':'Watermark applied','质检通过':'QC passed','待加水印':'Watermark needed','已加水印':'Watermarked','待审核':'Pending review','已通过':'Approved','待生成':'Pending generation','压制中':'Processing','待压制':'Ready to process','待配置':'Needs configuration','复核中':'In review','抽检中':'Sampling QC','终检中':'Final QC','处理中':'In progress','英语':'English','西班牙语':'Spanish','阿拉伯语':'Arabic','俄语':'Russian','标题':'Title','封面':'Cover','视频':'Video','剧集':'Series','成员':'Member','角色':'Role','状态':'Status','操作':'Actions'
};
const REGEX=[
[/^共\s*(\d+)\s*条[，,]?\s*每页\s*(\d+)\s*条$/,m=>`${m[1]} records · ${m[2]} per page`],
[/^共\s*(\d+)\s*条记录[，,]?\s*每页\s*(\d+)\s*条$/,m=>`${m[1]} records · ${m[2]} per page`],
[/^共\s*(\d+)\s*位成员/,m=>`${m[1]} members`],
[/^共\s*(\d+)\s*个角色/,m=>`${m[1]} roles`],
[/^已选择\s*(\d+)\s*条$/,m=>`${m[1]} selected`],
[/^已选择\s*(\d+)\s*条记录$/,m=>`${m[1]} selected`],
[/^(\d+)\s*条相似$/,m=>`${m[1]} similar`],
[/^(\d+)\s*套$/,m=>`${m[1]} sets`],
[/^(\d+)\s*集$/,m=>`${m[1]} episodes`],
[/^今日完成\s*(\d+)\s*条$/,m=>`${m[1]} completed today`],
[/^个人权限表\s*[·・]\s*(\d+)$/,m=>`Individual Permissions · ${m[1]}`],
[/^角色综合表\s*[·・]\s*(\d+)$/,m=>`Role Summary · ${m[1]}`],
[/^视频内容\s*[·・]\s*(\d+)$/,m=>`Video Content · ${m[1]}`],
[/^宣传内容\s*[·・]\s*(\d+)$/,m=>`Promotional Content · ${m[1]}`],
[/^片方档案\s*[·・]\s*(\d+)$/,m=>`Partner Profiles · ${m[1]}`],
[/^可压制水印\s*(\d+)$/,m=>`Ready for Watermarking ${m[1]}`],
[/^已压制水印\s*(\d+)$/,m=>`Watermarked ${m[1]}`],
[/^翻译\s*(\d+(?:\.\d+)?)%$/,m=>`Translation ${m[1]}%`],
[/^配音\s*(\d+(?:\.\d+)?)%$/,m=>`Dubbing ${m[1]}%`],
[/^字幕\s*(\d+(?:\.\d+)?)%$/,m=>`Subtitles ${m[1]}%`],
[/^压制中\s*(\d+(?:\.\d+)?)%$/,m=>`Processing ${m[1]}%`],
[/^安全区\s*(\d+)px$/,m=>`Safe area ${m[1]}px`],
[/^透明度\s*(\d+)%$/,m=>`Opacity ${m[1]}%`]
];
function translate(raw){
 const s=String(raw||'').trim();if(!s)return s;if(MAP[s])return MAP[s];
 for(const [re,fn] of REGEX){const m=s.match(re);if(m)return fn(m)}
 let out=s,changed=false;
 Object.keys(TOKENS).sort((a,b)=>b.length-a.length).forEach(k=>{if(out.includes(k)){out=out.split(k).join(TOKENS[k]);changed=true}});
 return changed?out:s;
}
function listRelated(node){
 const el=node.nodeType===1?node:node.parentElement;if(!el)return false;
 return !!el.closest('table,button,option,[role="option"],[role="tab"],[class*="toolbar"],[class*="tabs"],[class*="status"],[class*="chip"],[class*="foot"],[class*="actions"],[class*="filter"],[class*="head"],.wm4-modal,.wm4-dialog,.rvw-dialog-layer,.prw-modal,.al3-modal,.loc-dialog-layer');
}
function scanText(doc,en){
 const roots=[doc.getElementById('pageRoot'),doc.getElementById('octopusGlobalTitleSlot'),doc.body].filter(Boolean);
 const seen=new Set();
 roots.forEach(root=>{
  if(seen.has(root))return;seen.add(root);
  const walker=doc.createTreeWalker(root,doc.defaultView.NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName)||!node.nodeValue?.trim()||!listRelated(node))return doc.defaultView.NodeFilter.FILTER_REJECT;return doc.defaultView.NodeFilter.FILTER_ACCEPT}});
  const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
  nodes.forEach(node=>{const raw=node.nodeValue.trim();if(en){if(!CJK.test(raw))return;if(!originals.has(node))originals.set(node,node.nodeValue);const t=translate(raw);if(t===raw)return;const i=node.nodeValue.indexOf(raw);node.nodeValue=node.nodeValue.slice(0,i)+t+node.nodeValue.slice(i+raw.length)}else if(originals.has(node)){node.nodeValue=originals.get(node);originals.delete(node)}});
 });
}
function scanAttrs(doc,en){
 doc.querySelectorAll('#pageRoot [placeholder],#pageRoot [title],#pageRoot [aria-label]').forEach(el=>{
  let store=attrOriginals.get(el);if(!store){store={};attrOriginals.set(el,store)}
  for(const a of ['placeholder','title','aria-label']){const v=el.getAttribute(a);if(!v)continue;if(en&&CJK.test(v)){if(!(a in store))store[a]=v;const t=translate(v);if(t!==v)el.setAttribute(a,t)}else if(!en&&a in store){el.setAttribute(a,store[a]);delete store[a]}}
 });
}
function docsFrom(doc,out=new Set(),depth=0){if(!doc||out.has(doc)||depth>3)return out;out.add(doc);doc.querySelectorAll('iframe').forEach(f=>{try{if(f.contentDocument)docsFrom(f.contentDocument,out,depth+1)}catch{}});return out}
function watch(doc){if(observers.has(doc)||!doc?.documentElement)return;try{const O=doc.defaultView.MutationObserver,ob=new O(()=>schedule());ob.observe(doc.documentElement,{childList:true,subtree:true,characterData:true});observers.set(doc,ob)}catch{}}
function apply(){if(applying)return;applying=true;const en=localStorage.getItem(LANG_KEY)==='en';lastLang=en?'en':'zh';docsFrom(document).forEach(doc=>{watch(doc);scanText(doc,en);scanAttrs(doc,en);try{doc.documentElement.lang=en?'en':'zh-CN';doc.body?.setAttribute('data-i18n-list-fields',en?'en':'zh')}catch{}});applying=false}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
window.addEventListener('octopus-language-change',()=>{schedule();setTimeout(schedule,40);setTimeout(schedule,180);setTimeout(schedule,500)},true);
window.addEventListener('hashchange',()=>{schedule();setTimeout(schedule,80);setTimeout(schedule,260)},true);
window.addEventListener('storage',e=>{if(e.key===LANG_KEY)schedule()});
document.addEventListener('click',()=>setTimeout(schedule,30),true);
watch(document);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setInterval(()=>{const now=localStorage.getItem(LANG_KEY)==='en'?'en':'zh';if(now!==lastLang)schedule();else if(document.querySelector('iframe'))schedule()},900);
window.OctopusI18nListFields={apply,schedule,translate,version:'1.0'};
})();