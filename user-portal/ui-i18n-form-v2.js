(()=>{
'use strict';
const LANG_KEY='octopus-user-v7-language';
const originals=new WeakMap(),attrs=new WeakMap(),values=new WeakMap();
let applying=false,pending=false;
const en=()=>localStorage.getItem(LANG_KEY)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');

const ZH_EN={
'异步任务中心':'Async Task Center','统一查看译配、标题封面、批量上传任务及失败重试。':'Monitor localization, title/cover generation, bulk uploads, failures, and retries in one place.',
'搜索项目、任务、集数、合同或结算单':'Search projects, tasks, episodes, contracts, or settlements','全局搜索':'Global search',
'业务工作流':'Business Workflow','保存草稿':'Save Draft','取消':'Cancel','确认':'Confirm','确认创建':'Confirm & Create','关闭':'Close','提交前检查':'Pre-submit Checks','提交后将发生':'After Submission','数据同步':'Data Synchronization','此项为必填':'Required','请选择':'Select','请输入':'Enter','请输入详细说明':'Enter details',
'当前记录':'Current Record','下一动作':'Next Action','责任人':'Owner','计划完成时间':'Planned Completion','补充附件':'Additional Attachments','处理说明':'Processing Notes',
'项目':'Project','剧集':'Series','剧集名称':'Series Name','片方':'Partner','素材':'Asset','素材版本':'Asset Version','素材类型':'Asset Type','源母片版本':'Source Master Version','发行版本':'Distribution Version','视频版本':'Video Version',
'目标语言与地区':'Target Language & Locale','目标语言':'Target Language','输出语言':'Output Language','目标语种':'Target Language','地区 / 语种':'Region / Language','地区与时区':'Territory & Timezone','发行区域':'Territories','集数范围':'Episode Range','提报集数':'Episodes','目标渠道':'Target Channels','申请渠道':'Requested Channels','频道':'Channel','频道账号':'Channel Account',
'生产范围':'Localization Scope','翻译方式':'Translation Method','配音策略':'Dubbing Strategy','术语表 / 角色名表':'Glossary / Character Names','字幕规范':'Subtitle Specification','地区版交付日':'Locale Delivery Date','地区验收要求':'Regional Acceptance Criteria',
'计划首发窗口开始':'Launch Window Start','计划首发窗口结束':'Launch Window End','发行包内容':'Package Contents','活动 / Campaign 名称':'Campaign Name','发行方式':'Distribution Model','提报确认':'Submission Confirmations','渠道策略与特殊说明':'Channel Strategy & Notes',
'已批准提报':'Approved Submission','首集上线时间':'First Episode Launch','更新节奏':'Release Cadence','素材冻结时间':'Asset Freeze Deadline','上线负责人':'Launch Owner','上线前检查':'Preflight Checks','失败回退策略':'Fallback Strategy','通知对象':'Notifications','特殊时段与渠道说明':'Special Timing & Channel Notes',
'名称':'Name','类型':'Type','状态':'Status','版本':'Version','语言':'Language','语种':'Language','地区':'Region','范围':'Scope','开始时间':'Start Time','结束时间':'End Time','截止时间':'Deadline','创建时间':'Created','更新时间':'Updated','负责人':'Owner','说明':'Notes','备注':'Notes','内容':'Content','配置':'Configuration','规则':'Rules','模板':'Template','审核':'Review','审核状态':'Review Status','发布状态':'Publish Status','授权范围':'Rights Scope','合同':'Contract','账号':'Account','文件':'File','任务':'Task','任务名称':'Task Name','任务类型':'Task Type','优先级':'Priority',
'新增':'Add','新建':'Create','编辑':'Edit','查看':'View','下载':'Download','上传':'Upload','导出':'Export','删除':'Delete','保存':'Save','提交':'Submit','搜索':'Search','筛选':'Filter','选择':'Select','操作':'Actions',
'英语':'English','西班牙语':'Spanish','阿拉伯语':'Arabic','俄语':'Russian','德语':'German','日语':'Japanese','中文':'Chinese','全球':'Global','北美':'North America','欧洲':'Europe','东南亚':'Southeast Asia','日本':'Japan','拉美':'Latin America',
'AI 初译 + 人工审校':'AI Draft + Human Edit','专业译员全人工':'Professional Human Translation','客户提供译文':'Client-provided Translation','克隆原角色音色':'Clone Original Character Voices','匹配平台音色库':'Match Platform Voice Library','真人配音':'Human Voice Actors','仅字幕，不配音':'Subtitles Only',
'对白翻译':'Dialogue Translation','字幕制作':'Subtitle Production','角色配音':'Character Dubbing','标题与简介本地化':'Title & Synopsis Localization','封面文字本地化':'Cover Text Localization',
'成片与字幕':'Final Assets & Subtitles','标题与简介':'Title & Synopsis','横竖版封面':'Landscape & Portrait Covers','版权与授权文件':'Rights Documents','内容分级信息':'Content Rating Metadata','渠道追踪参数':'Channel Tracking Parameters',
'平台代发行':'Platform-managed Distribution','制作方自运营，平台提供渠道连接':'Producer-operated with Platform Connectivity','联合投放':'Joint Campaign',
'成片已通过平台验收':'Assets Passed Platform Acceptance','授权地域覆盖所选区域':'Rights Cover Selected Territories','包装素材不存在第三方侵权':'Packaging Has No Third-party Infringement','同意平台按渠道规则进行适配':'Allow Platform Channel Adaptation',
'全集一次上线':'Full Season at Once','每日 2 集':'2 Episodes Daily','每周 3 集':'3 Episodes Weekly','自定义节奏':'Custom Cadence','自动重试 3 次后人工接管':'Retry 3 Times then Manual Takeover','切换备用渠道账号':'Switch to Backup Channel Account','暂停后等待制作方确认':'Pause and Await Producer Confirmation',
'制作负责人':'Production Owner','平台运营':'Platform Operations','数据团队':'Data Team','财务团队':'Finance Team','运行中':'Running','排队中':'Queued','失败':'Failed','待审核':'Pending Review','已通过':'Approved','待确认':'Pending Confirmation','处理中':'In Progress'
};
const EN_ZH=Object.fromEntries(Object.entries(ZH_EN).map(([z,e])=>[e,z]));
const TOKENS=Object.entries({
'素材':'Asset','剧集':'Series','片方':'Partner','频道':'Channel','标题':'Title','封面':'Cover','任务':'Task','项目':'Project','角色':'Role','成员':'Member','权限':'Permission','状态':'Status','类型':'Type','版本':'Version','语言':'Language','语种':'Language','地区':'Region','范围':'Scope','时间':'Time','日期':'Date','负责人':'Owner','说明':'Notes','备注':'Notes','内容':'Content','配置':'Configuration','规则':'Rules','模板':'Template','审核':'Review','发布':'Publish','分发':'Distribution','译配':'Localization','授权':'Rights','合同':'Contract','收益':'Revenue','结算':'Settlement','账号':'Account','密钥':'Credentials','文件':'File','名称':'Name','新增':'Add','新建':'Create','编辑':'Edit','查看':'View','下载':'Download','保存':'Save','删除':'Delete','取消':'Cancel','确认':'Confirm','提交':'Submit','上传':'Upload','导出':'Export','搜索':'Search','筛选':'Filter','选择':'Select','全部':'All','当前':'Current','目标':'Target','计划':'Planned','创建':'Create','更新':'Update'
}).sort((a,b)=>b[0].length-a[0].length);

function splitPipe(raw,toEn){if(!raw.includes('|'))return null;const a=raw.split('|').map(x=>x.trim());return toEn?(a[1]||a[0]):a[0]}
function translate(raw,toEn,allowFallback=false){
  const text=String(raw||'').trim();if(!text)return text;
  const piped=splitPipe(text,toEn);if(piped!==null)return piped;
  const table=toEn?ZH_EN:EN_ZH;if(table[text])return table[text];
  if(!toEn||!allowFallback||text.length>28)return text;
  let out=text,changed=false;
  TOKENS.forEach(([z,e])=>{if(out.includes(z)){out=out.split(z).join(' '+e+' ');changed=true}});
  return changed?out.replace(/\s+/g,' ').replace(/\s+([/·:：,+])/g,'$1').replace(/([/·:：,+])\s+/g,'$1 ').trim():text;
}
function inUi(el){return !!el.closest('form,[role="dialog"],#modalMask,#drawerMask,#v815modal,#octopusRowEditor,#apfModal,.business-modal,.gw3-modal,.gw3-editor-grid,.atw-modal,[class*="drawer"],[class*="editor"],[class*="form"]')}
function eligibleTextParent(el){return inUi(el)||el.matches('button,label,legend,th,h1,h2,h3,h4,[role="button"],[role="tab"],option')}

function translateTextNodes(toEn){
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){
    const p=node.parentElement;if(!p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName)||!node.nodeValue?.trim())return NodeFilter.FILTER_REJECT;
    return eligibleTextParent(p)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
  }});
  const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
  nodes.forEach(node=>{
    const raw=node.nodeValue.trim();
    if(toEn){
      if(!originals.has(node))originals.set(node,node.nodeValue);
      const next=translate(raw,true,true);if(next===raw)return;
      const i=node.nodeValue.indexOf(raw);node.nodeValue=node.nodeValue.slice(0,i)+next+node.nodeValue.slice(i+raw.length);
    }else if(originals.has(node)){node.nodeValue=originals.get(node);originals.delete(node)}
  });
}
function translateAttrs(toEn){
  document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{
    if(!inUi(el)&&!el.matches('input,select,textarea,button'))return;
    ['placeholder','aria-label','title'].forEach(attr=>{
      const raw=el.getAttribute(attr);if(!raw)return;
      let store=attrs.get(el);if(!store){store={};attrs.set(el,store)}
      if(toEn){if(!(attr in store))store[attr]=raw;const next=translate(raw,true,true);if(next!==raw)el.setAttribute(attr,next)}
      else if(attr in store){el.setAttribute(attr,store[attr]);delete store[attr]}
    });
  });
}
function translateValues(toEn){
  document.querySelectorAll('textarea,input[type="text"],input:not([type])').forEach(el=>{
    if(!inUi(el)||el.dataset.octI18nDirty==='1')return;
    const raw=el.value?.trim();if(!raw)return;
    if(toEn){
      if(!values.has(el))values.set(el,el.value);
      const next=translate(raw,true,false);if(next!==raw)el.value=next;
    }else if(values.has(el)){el.value=values.get(el);values.delete(el)}
    if(!el.dataset.octI18nBound){el.dataset.octI18nBound='1';el.addEventListener('input',()=>{el.dataset.octI18nDirty='1'},{passive:true})}
  });
}
function apply(){
  pending=false;if(applying||!document.body)return;applying=true;
  try{const toEn=en();translateTextNodes(toEn);translateAttrs(toEn);translateValues(toEn);document.body.dataset.formI18n=toEn?'en':'zh'}finally{applying=false}
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(apply)}
window.addEventListener('octopus-language-change',()=>{schedule();setTimeout(schedule,80);setTimeout(schedule,260)});
window.addEventListener('hashchange',schedule);window.addEventListener('storage',e=>{if(e.key===LANG_KEY)schedule()});
document.addEventListener('click',e=>{if(e.target.closest('[data-lang-toggle]')){setTimeout(schedule,0);setTimeout(schedule,120);setTimeout(schedule,360)}},true);
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['lang']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,500);setTimeout(schedule,1300);
})();
