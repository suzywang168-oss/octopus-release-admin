(()=>{
const DEMO_KEY='octopus-demo-mode';
const TOKEN_KEY='octopus-api-token';
const PROFILE_KEY='octopus-api-profile';
const API_KEY='octopus-api-base';
const demoProfile={
  name:'Suzy Wang',
  contact:'demo@octopus.local',
  organization:{id:'demo-org',name:'Octopus Demo Studio',type:'内容制作方'},
  role:'producer_admin',
  permissions:['*'],
  demo:true
};
function t(cn,en){return typeof currentLang!=='undefined'&&currentLang==='en'?en:cn}
function enterDemo(){
  localStorage.setItem(DEMO_KEY,'1');
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
  sessionStorage.setItem('octopus-demo-session','1');
  if(typeof window.enter==='function'){
    window.enter(demoProfile);
    setTimeout(()=>{
      try{typeof window.route==='function'&&window.route('overview')}catch{}
      try{typeof window.toast==='function'&&window.toast(t('已进入演示空间，数据保存在当前浏览器','Demo workspace opened. Data is stored in this browser.'))}catch{}
    },120);
  }
}
function exitDemo(){
  localStorage.removeItem(DEMO_KEY);
  sessionStorage.removeItem('octopus-demo-session');
}
function makeButton(id,label){
  const b=document.createElement('button');
  b.type='button';
  b.id=id;
  b.className='secondary demo-entry-btn';
  b.textContent=label;
  b.addEventListener('click',enterDemo);
  return b;
}
function install(){
  const login=document.getElementById('loginForm');
  if(login&&!document.getElementById('directDemoLogin')){
    const b=makeButton('directDemoLogin',t('直接进入演示空间','Enter demo workspace'));
    const submit=login.querySelector('.submit,button[type="submit"]');
    if(submit)submit.insertAdjacentElement('afterend',b);else login.appendChild(b);
  }
  const register=document.getElementById('registerForm');
  if(register&&!document.getElementById('directDemoRegister')){
    const host=register.querySelector('[data-enter]')?.parentElement||register;
    const b=makeButton('directDemoRegister',t('跳过注册，进入演示空间','Skip registration and enter demo'));
    host.appendChild(b);
  }
  document.querySelectorAll('button').forEach(btn=>{
    const text=(btn.textContent||'').trim();
    if((/演示账号|演示空间|demo account/i.test(text))&&!btn.dataset.demoBound){
      btn.dataset.demoBound='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();enterDemo()},true);
    }
  });
}
const style=document.createElement('style');
style.textContent=`
.demo-entry-btn{width:100%!important;margin-top:10px!important;min-height:42px!important;border:1px solid #355171!important;background:#11243a!important;color:#dce7f2!important;font-weight:700!important;letter-spacing:.01em!important}
.demo-entry-btn:hover{background:#172e49!important;border-color:#52729a!important;color:#fff!important}
.demo-mode-badge{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:1px solid #355171;border-radius:8px;background:#11243a;color:#bcd0e4;font-size:8px}
`;
document.head.appendChild(style);
window.OctopusEnterDemo=enterDemo;
window.OctopusExitDemo=exitDemo;
install();
new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
let auto=false;
try{auto=new URLSearchParams(window.parent.location.search).get('demo')==='1'}catch{}
if(auto||localStorage.getItem(DEMO_KEY)==='1')setTimeout(enterDemo,420);
})();

/* Product plan V8.0: operations, AI production and channel publishing. */
(()=>{
const P={
'ops.analytics':{g:'运营导向',i:'⌁',t:'频道数据分析',d:'按频道、标签和剧集类型分析观看、点击、收入、留存与 RPM，AI 推荐同类型内容。',a:'生成选题建议',tech:'数据分析',k:[['总观看','28.6M','+18.4%'],['点击率','6.82%','目标 6.5%'],['30 日留存','24.1%','+3.7pt'],['综合 RPM','$4.86','YT 最佳']],h:['频道','内容类型','观看次数','点击率','收入','留存','RPM','AI 建议'],r:[['YouTube · StoryOrbit','悬疑短剧','12.8M','7.42%','$61,904','27.8%','$5.32','追加反转型剧集'],['TikTok · MiniDrama Lab','都市情感','8.4M','8.16%','$24,822','18.9%','$3.18','缩短前 3 秒铺垫'],['Facebook · Octopus Stories','家庭伦理','4.7M','5.02%','$19,035','29.6%','$4.91','复用高留存演员组合']]},
'ops.crawl':{g:'运营导向',i:'⬡',t:'投流大数据抓取',d:'抓取 TikTok、Facebook、YouTube、Instagram 投流素材，筛选片单并结合频道表现提出上线建议。',a:'新建抓取任务',tech:'数据抓取与分析',k:[['今日素材','18,642','4 个渠道'],['有效片单','1,286','已去重'],['高潜素材','164','CTR > 7%'],['待采纳建议','23','9 个频道']],h:['抓取任务','渠道','素材量','去重后','高潜片单','状态','上线建议','更新'],r:[['欧美短剧热榜 · 0804','TikTok','6,482','4,219','68','已完成','优先测试 12 部反转剧','14:32'],['长视频剧情广告库','YouTube','3,106','2,884','41','已完成','补充 16:9 横版素材','13:08'],['Meta 高转化片单','Facebook','5,940','3,107','35','分析中','等待收入归因','进行中']]},
'ops.unblock':{g:'运营导向',i:'↺',t:'解禁链接反馈',d:'自动识别禁播情况，归纳禁播链接、片方与禁播方，并导出反馈清单。',a:'提交解禁反馈',tech:'数据归纳总结',k:[['本周禁播','47','6 个频道'],['AI 已归因','43','91.5%'],['已提交解禁','31','平均 18 小时'],['恢复上线','22','恢复率 71%']],h:['禁播链接','平台 / 频道','剧集','识别原因','片方','禁播方','状态','反馈时间'],r:[['YT · …/8K2Q','YouTube · StoryOrbit','逆光档案 EP12','版权重复声明','星火影业','NorthStar Media','待补权属','今天 11:26'],['TK · …/7391842','TikTok · MiniDrama Lab','午夜讯号 EP06','限制元素','海浪制作','TikTok Trust','已提交申诉','今天 09:42'],['FB · …/4801','Facebook · Octopus Stories','星海漫游 EP09','音轨误判','星火影业','Meta Rights','已恢复','昨天 18:10']]},
'production.upload':{g:'内容生产',i:'片',t:'内容上传与 AI 提炼',d:'上传全剧后，AI 总结故事、提炼亮点并生成频道、剧情、演员、人设、场景、地域和时代标签。',a:'上传全剧',tech:'AI 提炼',k:[['待处理','8 部','326 集'],['提炼完成','74.6%','9分42秒/部'],['标签准确率','93.8%','人工采纳'],['重复拦截','17 处','已阻止入库']],h:['内容 / 版本','集数','上传','故事总结','亮点','标签','去重','状态'],r:[['星海漫游 S1 · Master','12 集','100%','已生成','8 个','42','无重复','待人工确认'],['午夜讯号 S1 · Clean','8 集','100%','已生成','6 个','35','EP03 重复','处理中'],['逆光档案 S2 · v1','16 集','68%','等待上传','—','—','未执行','上传中']]},
'production.languages':{g:'内容生产',i:'译',t:'语种 AI 译配',d:'为英语、西班牙语、阿拉伯语和俄语版本执行翻译、配音、字幕对齐与内容去重。',a:'创建译配任务',tech:'AI 译配与去重',k:[['语言任务','46','英/西/阿/俄'],['完成剧集','312 集','本周 +84'],['字幕对齐','98.7%','目标 ≥98%'],['译配去重','29 段','节省 4.6h']],h:['剧集','语种','翻译','AI 配音','字幕对齐','去重','质检','完成时间'],r:[['星海漫游 EP01–12','英语 EN','100%','100%','99.2%','已完成','通过','已交付'],['星海漫游 EP01–12','西班牙语 ES','100%','86%','98.9%','已完成','抽检中','今天 20:00'],['午夜讯号 EP01–08','阿拉伯语 AR','74%','42%','97.8%','5 段','处理中','明天 14:00'],['潮汐指令 EP01–24','俄语 RU','100%','100%','99.0%','已完成','通过','已交付']]},
'release.titles':{g:'发行流程',i:'T',t:'AI 标题生成',d:'AI 理解语义和爆点并匹配频道风格；限制 100 字符（空格计数），3 个标题并发且可人工编辑。',a:'生成 3 个标题',tech:'历史记忆与同类学习',k:[['今日生成','186 组','558 个标题'],['采用率','72.4%','+6.1pt'],['字符合规','100%','≤100'],['风格一致性','94.2%','历史学习']],h:['剧集 / 频道','标题 A','标题 B','标题 C','字符数','匹配度','采用','编辑人'],r:[['逆光档案 EP12 · StoryOrbit','她查的是旧案，凶手却在等她','第十二份档案揭开所有谎言','所有人都忘了那场雨，除了她','18/16/19','96%','A 已采用','Suzy Wang'],['午夜讯号 EP06 · MiniDrama Lab','凌晨三点，她收到未来的求救','这个号码只在午夜打来','别接那通来自明天的电话','17/14/15','93%','待选择','Mia Chen']]},
'release.covers':{g:'发行流程',i:'▧',t:'AI 封面生成',d:'AI 提取剧情爆点生成强冲突封面并保持频道风格；3 张并发，支持人工介入编辑。',a:'生成 3 张封面',tech:'历史记忆与同类学习',k:[['今日生成','84 组','252 张'],['采用率','68.1%','B 版最高'],['频道一致性','95.4%','高 CTR 学习'],['人工编辑','21 张','8.3%']],h:['剧集 / 频道','爆点','候选图','频道风格','冲突度','人工编辑','采用','生成时间'],r:[['逆光档案 EP12 · StoryOrbit','证据与对峙','3 张','冷蓝悬疑','96','调整人物视线','封面 B','14:12'],['午夜讯号 EP06 · MiniDrama Lab','午夜来电与追逐','3 张','高饱和竖版','92','无需编辑','待选择','13:48'],['星海漫游 EP09 · Reel Fiction','失联飞船与双生角色','3 张','星际电影感','89','强化角色冲突','封面 A','11:30']]},
'release.publish':{g:'发行流程',i:'↗',t:'频道上传与发布',d:'内容匹配频道后上传，调用频道水印库压制，并通过 API 直传目标平台。',a:'新建上传任务',tech:'内容生成、频道水印库与 API',k:[['待上传','36','11 个频道'],['API 成功率','98.4%','近 7 天'],['水印模板','24 套','安全区校验'],['今日发布','62 条','4 个平台']],h:['内容版本','目标频道','平台','水印','标题 / 封面','上传方式','状态','计划时间'],r:[['逆光档案 EP12 · EN','StoryOrbit','YouTube','SO-WIDE-03','已锁定','API 直传','等待审核','今天 18:00'],['午夜讯号 EP06 · ES','MiniDrama Lab','TikTok','MDL-VERT-02','待选封面','API 直传','准备中','今天 20:30'],['星海漫游 EP09 · EN','Reel Fiction','Instagram','RF-VERT-01','已锁定','API 直传','已排期','明天 09:00']]}
};
const G=[['工作台',[['overview','◈','项目总览'],['todo','◉','待办任务']]],['运营导向',[['ops.analytics','⌁','数据分析'],['ops.crawl','⬡','大数据抓取'],['ops.unblock','↺','解禁链接反馈']]],['内容生产',[['production.upload','片','内容上传'],['production.languages','译','语种 AI 译配']]],['发行流程',[['release.titles','T','标题生成'],['release.covers','▧','封面生成'],['release.publish','↗','上传频道']]],['组织与账户',[['org.members','♙','成员权限'],['org.quota','存','资源额度']]]];
let active='';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function style(){if(document.getElementById('v80style'))return;let s=document.createElement('style');s.id='v80style';s.textContent='.v80-ai{display:grid;grid-template-columns:1.25fr .75fr;gap:12px;margin-bottom:12px}.v80-ai>article{padding:16px}.v80-ai h3{margin:0 0 7px;font-size:11px}.v80-ai p{margin:0;color:var(--muted);font-size:8px;line-height:1.7}.v80-modal{position:fixed;inset:0;z-index:160;display:grid;place-items:center;background:rgba(2,8,16,.72)}.v80-modal form{width:min(680px,calc(100vw - 28px));padding:22px;border:1px solid var(--line);border-radius:14px;background:var(--panel)}.v80-modal h2{margin:0 0 6px}.v80-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}.v80-fields label{display:grid;gap:6px;color:var(--soft);font-size:8px}.v80-fields label:last-child{grid-column:1/-1}.v80-fields input,.v80-fields select,.v80-fields textarea{padding:9px;border:1px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--text)}.v80-fields textarea{min-height:80px}.v80-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.nav-item small{margin-left:auto}@media(max-width:760px){.v80-ai,.v80-fields{grid-template-columns:1fr}.v80-fields label:last-child{grid-column:auto}}';document.head.appendChild(s)}
function nav(){let n=document.getElementById('nav');if(!n)return;let current=active||location.hash.replace(/^#\//,'').replaceAll('/','.')||'overview',html=G.map(([g,x])=>'<div class="nav-group"><div class="nav-label">'+g+'</div>'+x.map(([r,i,t])=>'<button type="button" class="nav-item '+(current===r?'active':'')+'" data-v80="'+r+'"><span class="nav-icon">'+i+'</span><span>'+t+'</span></button>').join('')+'</div>').join('');if(n.innerHTML!==html)n.innerHTML=html;n.dataset.v80='1'}
const pill=v=>'<span class="pill '+(/完成|通过|恢复|交付|锁定|排期/.test(v)?'good':/待|等待|确认/.test(v)?'warn':/中|上传|准备|分析/.test(v)?'info':'neutral')+'">'+e(v)+'</span>';
function render(){let c=P[active];if(!c)return;style();nav();document.querySelectorAll('[data-v80]').forEach(b=>b.classList.toggle('active',b.dataset.v80===active));document.getElementById('pageRoot').innerHTML='<section class="page"><div class="page-head"><div><div class="crumbs"><span>Octopus</span><i>/</i><span>'+c.g+'</span><i>/</i><b>'+c.t+'</b></div><h1>'+c.t+'</h1><p>'+c.d+'</p></div><div class="head-actions"><button class="btn" data-v80-export>导出 CSV</button><button class="btn primary" data-v80-create>'+c.a+'</button></div></div><div class="v80-ai"><article class="card"><h3>AI 工作流</h3><p>'+c.d+'</p></article><article class="card"><span style="font-size:7px;color:var(--muted)">技术支持</span><h3 style="margin-top:9px">'+c.tech+'</h3></article></div><div class="kpis">'+c.k.map(x=>'<article class="card kpi"><span>'+x[0]+'</span><strong>'+x[1]+'</strong><small>'+x[2]+'</small></article>').join('')+'</div><div class="toolbar"><div class="toolbar-left"><div class="searchbox">⌕ <input data-v80-search placeholder="搜索当前模块"></div><select class="control"><option>全部状态</option><option>处理中</option><option>已完成</option></select></div><button class="btn" data-v80-refresh>刷新数据</button></div><article class="card table-card"><div class="table-scroll"><table><thead><tr>'+c.h.map(h=>'<th>'+h+'</th>').join('')+'<th>操作</th></tr></thead><tbody>'+c.r.map((r,i)=>'<tr data-v80-row="'+i+'">'+r.map((v,j)=>'<td>'+(j===0?'<span class="title-cell">'+e(v)+'</span>':/状态|质检|采用/.test(c.h[j])?pill(v):e(v))+'</td>').join('')+'<td><button class="text-btn">查看详情</button></td></tr>').join('')+'</tbody></table></div></article><div class="grid-2 equal"><article class="card card-pad"><div class="card-head"><div><h3>AI 建议与下一步</h3><p>建议仅基于当前模块数据。</p></div></div><div class="metric-row"><span>优先处理</span><b>'+e(c.r[0][0])+'</b></div><div class="metric-row"><span>人工确认点</span><b>提交前可编辑与审核</b></div></article><article class="card card-pad"><div class="card-head"><div><h3>同步与审计</h3><p>Admin 受保护写入，Portal 读取脱敏数据。</p></div>'+pill('同步正常')+'</div><div class="metric-row"><span>最近同步</span><b>12 秒前</b></div><div class="metric-row"><span>操作记录</span><b>完整保留</b></div></article></div></section>'}
const F={
'ops.analytics':['分析范围','标签类型','统计周期','运营问题'],
'ops.crawl':['抓取渠道','关键词 / 类型','时间范围','筛选与上线标准'],
'ops.unblock':['禁播链接','平台与频道','片方 / 禁播方','反馈与申诉材料'],
'production.upload':['内容名称','上传方式 / 地址','标签范围','AI 提炼要求'],
'production.languages':['内容版本','目标语种','处理范围','去重规则'],
'release.titles':['剧集版本','目标频道','标题语言','爆点与禁用词'],
'release.covers':['剧集版本','目标频道','画面比例','人物与冲突要求'],
'release.publish':['内容版本','目标频道','水印模板','发布时间与发布检查']
};
function modal(detail){let c=P[active],x=document.createElement('div');x.className='v80-modal';let labels=F[active]||[];x.innerHTML=detail?'<form><h2>'+e(detail[0])+'</h2><p>'+c.t+' · 当前记录详情</p>'+c.h.map((h,i)=>'<div class="metric-row"><span>'+h+'</span><b>'+e(detail[i])+'</b></div>').join('')+'<div class="v80-actions"><button type="button" class="btn" data-close>关闭</button><button type="button" class="btn primary" data-next>继续处理</button></div></form>':'<form><h2>'+c.a+'</h2><p>'+c.d+'</p><div class="v80-fields">'+labels.map((l,i)=>'<label><span>'+l+'</span>'+(i===labels.length-1?'<textarea required></textarea>':'<input required>')+'</label>').join('')+'</div><div class="v80-actions"><button type="button" class="btn" data-close>取消</button><button class="btn primary">确认并开始</button></div></form>';document.body.appendChild(x);x.querySelector('[data-close]').onclick=()=>x.remove();x.querySelector('[data-next]')?.addEventListener('click',()=>{x.remove();modal()});x.querySelector('form').onsubmit=q=>{q.preventDefault();x.remove();toast('任务已创建并进入处理队列')}}
function csv(){let c=P[active],z=[c.h,...c.r].map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+z],{type:'text/csv'}));a.download='octopus-'+active+'.csv';a.click()}
document.addEventListener('click',q=>{let r=q.target.closest('[data-v80]')?.dataset.v80;if(r){q.preventDefault();q.stopImmediatePropagation();if(P[r]){active=r;render()}else{active='';route(r);setTimeout(nav)}return}if(!active)return;if(q.target.closest('[data-v80-create]')){q.stopImmediatePropagation();modal()}else if(q.target.closest('[data-v80-export]')){q.stopImmediatePropagation();csv()}else if(q.target.closest('[data-v80-refresh]')){q.stopImmediatePropagation();toast('数据已更新')}else{let i=q.target.closest('[data-v80-row]')?.dataset.v80Row;if(i!==undefined){q.stopImmediatePropagation();modal(P[active].r[+i])}}},true);
document.addEventListener('input',q=>{if(active&&q.target.matches('[data-v80-search]'))document.querySelectorAll('#pageRoot tbody tr').forEach(tr=>tr.style.display=tr.innerText.toLowerCase().includes(q.target.value.toLowerCase())?'':'none')},true);
function boot(){if(!document.getElementById('nav'))return setTimeout(boot,100);style();nav();new MutationObserver(nav).observe(document.getElementById('nav'),{childList:true});let h=location.hash.replace(/^#\//,'').replaceAll('/','.');if(/^(production|release)\.contracts$/.test(h)){route('overview');h='overview'}if(P[h]){active=h;render()}setInterval(()=>{let x=location.hash.replace(/^#\//,'').replaceAll('/','.');if(/^(production|release)\.contracts$/.test(x)){active='';route('overview');toast('合同中心已从 User Portal 下线')}},250)}boot();
})();
