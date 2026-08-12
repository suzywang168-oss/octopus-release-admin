(()=>{
'use strict';
const ROUTE=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CONFIG={
'对标对比':['对标分析','view','对比同标签剧集的播放、CTR、留存、RPM 与收入，查看目标剧集的优势和差距。',['对标维度','同标签样本','渠道适配','结论']],
'加入选剧报告':['加入选剧报告','edit','确认推荐理由、优先级与目标频道后，将当前剧集加入选剧报告。',['推荐理由','报告分组','目标频道','优先级']],
'查看素材':['投流素材详情','view','查看原始素材、平台数据、热词命中与关联剧集。',['素材预览','平台表现','热词分析','关联剧集']],
'生成上线建议':['上线建议','edit','根据外部热度、互动率和片单命中生成可执行的上线计划。',['建议频道','建议语种','上线优先级','建议时间']],
'查看链接':['禁播链接详情','view','查看原始链接、禁播平台、检测记录和当前申诉材料。',['原始链接','平台检测','禁播原因','材料记录']],
'更新工单':['更新解禁工单','edit','更新负责人、处理状态、材料进度和下一步动作。',['处理状态','负责人','补充材料','下一步']],
'查看解析':['AI 解析结果','view','查看全剧故事总结、剧情亮点、人物关系和标签置信度。',['故事总结','剧情亮点','人物关系','解析质量']],
'编辑AI标签':['编辑 AI 标签','edit','按标签体系检查并修改频道、剧情、演员、人设、场景、地域和时代标签。',['频道标签','剧情标签','人物标签','场景与地域']],
'查看任务':['译配任务详情','view','查看翻译、配音、字幕对齐、去重和质检的分步骤进度。',['翻译进度','配音进度','字幕对齐','质检记录']],
'配置译配':['配置译配任务','edit','配置目标语种、角色音色、字幕规则、去重策略和质检阈值。',['目标语种','角色音色','字幕规则','质检阈值']],
'查看3个标题':['AI 标题候选','view','同时查看三个标题候选、字符数、CTR 预测和频道匹配理由。',['候选 A','候选 B','候选 C','预测对比']],
'采用标题':['采用标题','edit','选择最终标题并确认字符合规、历史冲突和目标频道。',['采用候选','人工修改','冲突检查','目标频道']],
'预览3张封面':['AI 封面候选','view','并排预览三个封面候选及其视觉爆点、CTR 预测和重复度。',['方案 A','方案 B','方案 C','预测对比']],
'采用封面':['采用封面','edit','选择最终封面并确认裁切比例、文字安全区和频道视觉风格。',['采用方案','裁切比例','安全区','频道风格']],
'标题封面预览':['物料联合预览','view','在同一页面检查标题、封面、语义一致性和频道适配。',['标题预览','封面预览','一致性校验','版本记录']],
'通过物料':['物料审核','edit','填写审核结论、意见和版本状态，确认通过或退回修改。',['审核结论','审核意见','版本状态','发布限制']],
'发布前校验':['发布前校验','view','检查剧集、频道、语种、水印、标题封面和授权范围是否匹配。',['内容校验','频道校验','水印校验','授权校验']],
'查看上传':['上传任务详情','view','查看 API 上传进度、分片状态、平台响应和失败重试记录。',['上传进度','平台响应','重试记录','预计完成']],
'查看趋势':['剧集趋势','view','查看播放、CTR、D1/D7 留存、RPM 与收入的时间趋势。',['播放趋势','点击趋势','留存趋势','收入趋势']],
'诊断建议':['剧集诊断建议','view','基于关键指标定位增长机会、衰减风险和下一步优化动作。',['核心问题','影响指标','优化建议','预期提升']],
'账号详情':['频道账号详情','view','查看频道基础资料、区域语种、授权状态、收益和爆款内容。',['账号资料','授权状态','收益表现','爆款剧集']],
'健康诊断':['频道健康诊断','view','查看 API、密钥、发布频率、违规风险和收入健康度。',['API 健康','密钥状态','发布健康','风险提示']],
'查看外部素材':['外部素材库','view','查看外部平台素材样本、投放热度、增长速度和内部匹配剧集。',['素材样本','外部热度','增长速度','内部匹配']],
'生成机会建议':['机会建议','edit','将外部趋势转化为题材供给、素材测试和频道上线建议。',['机会方向','建议题材','测试频道','执行优先级']],
'查看风险明细':['风险明细','view','查看风险对象、历史次数、影响收入、解禁进度和相关工单。',['风险记录','影响评估','解禁进度','关联工单']],
'进入解禁工单':['解禁工单','edit','进入对应工单更新材料、负责人、处理状态和 SLA。',['工单状态','负责人','申诉材料','SLA']],
'编辑账号':['编辑频道账号','edit','维护频道资料、区域语种、风格模板和账号状态。',['账号资料','区域与语种','频道风格','账号状态']],
'管理API密钥':['API 密钥管理','api','管理授权密钥、权限范围、到期时间与连接测试。',['密钥状态','权限范围','到期时间','连通性']],
'查看资料':['素材与片方资料','view','查看对象资料、素材版本、授权范围、负责人和更新记录。',['基础资料','版本记录','授权范围','更新记录']],
'维护授权':['维护授权','edit','更新授权区域、平台范围、有效期和证明附件状态。',['授权区域','平台范围','有效期','证明附件']],
'编辑模板':['编辑 AI 模板','edit','维护模板内容、适用频道、版本和发布状态。',['模板内容','适用频道','版本说明','发布状态']],
'查看效果':['模板效果','effect','查看模板使用量、采用率、CTR 提升、版本对比与渠道表现。',['采用率','CTR 提升','版本对比','渠道表现']],
'编辑权限':['编辑角色权限','edit','配置数据范围、核心权限、审批规则和成员继承方式。',['数据范围','核心权限','审批规则','继承方式']],
'查看成员':['角色成员','members','查看当前角色下的成员、数据范围、最近活动和权限状态。',['成员列表','数据范围','最近活动','权限状态']],
'查看日志':['任务运行日志','view','查看任务节点、时间线、错误信息、重试记录和运行参数。',['运行时间线','节点日志','错误信息','运行参数']],
'重试任务':['重试任务','edit','确认重试节点、优先级和失败后的告警方式。',['重试节点','任务优先级','告警方式','运行参数']]
};
const EXTRA={
api:[['当前密钥','•••• •••• •••• 7A2F'],['授权范围','读取频道 · 上传内容 · 查询数据'],['到期时间','2026-11-18 · 剩余 98 天'],['连接状态','最近检测正常 · 142 ms']],
effect:[['近30天使用','1,286 次'],['结果采用率','47.2% · 较上一版 +6.4pt'],['CTR 提升','+0.8pt'],['最佳渠道','TK-US Drama']],
members:[['Mia Chen','运营负责人 · 全部频道'],['Leo Meyer','运营专员 · 分配频道'],['Nora Li','审核成员 · 只读'],['Suzy Wang','管理员 · 全部权限']]
};
function style(){
 if(document.getElementById('octopus-action-pages-style'))return;
 const s=document.createElement('style');s.id='octopus-action-pages-style';s.textContent=`
 #octopusRowEditor .oap-summary{margin:0 0 16px;padding:12px 13px;border:1px solid var(--line);border-radius:10px;background:var(--panel2);color:var(--soft);font-size:9px;line-height:1.65}
 #octopusRowEditor .oap-section-title{grid-column:1/-1;margin:3px 0 -2px;color:var(--text);font-size:10px;font-weight:800}
 #octopusRowEditor .oap-card{min-height:78px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel2)}
 #octopusRowEditor .oap-card b{display:block;color:var(--soft);font-size:8px}
 #octopusRowEditor .oap-card strong{display:block;margin-top:8px;color:var(--text);font-size:10px;line-height:1.5}
 #octopusRowEditor .oap-members{grid-column:1/-1;display:grid;gap:7px}
 #octopusRowEditor .oap-member{display:flex;justify-content:space-between;gap:12px;padding:11px 12px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);font-size:9px}
 #octopusRowEditor .oap-member span{color:var(--soft)}
 `;document.head.appendChild(s)
}
function context(info){const map={};info.headers.forEach((h,i)=>map[h]=info.values[i]);return map}
function valueFor(label,map,info,index){
 const pairs=Object.entries(map);
 if(/状态/.test(label))return pairs.find(([k])=>/状态/.test(k))?.[1]||'正常';
 if(/进度/.test(label))return pairs.find(([k])=>/进度|完成/.test(k))?.[1]||'待更新';
 if(/频道/.test(label))return pairs.find(([k])=>/频道|平台/.test(k))?.[1]||'按目标频道';
 if(/负责人/.test(label))return pairs.find(([k])=>/负责人|审核人/.test(k))?.[1]||'Suzy Wang';
 if(/版本/.test(label))return pairs.find(([k])=>/版本/.test(k))?.[1]||'当前版本';
 if(/时间|到期/.test(label))return pairs.find(([k])=>/时间|到期|更新/.test(k))?.[1]||'按计划执行';
 return info.values[Math.min(index+1,info.values.length-1)]||'待配置';
}
function open(button,info){
 const action=button.dataset.a||button.textContent.trim(),cfg=CONFIG[action];if(!cfg)return false;
 style();const [title,mode,summary,labels]=cfg,map=context(info),drawer=document.getElementById('octopusRowEditor');if(!drawer)return false;
 drawer.querySelector('#oreTitle').textContent=title;
 drawer.querySelector('#oreSub').textContent=(info.values[0]||'当前记录')+' · '+(mode==='view'?'只读页面':'业务操作页面');
 let cards='';
 if(EXTRA[mode]){
   cards=EXTRA[mode].map(([a,b])=>'<article class="oap-card"><b>'+esc(a)+'</b><strong>'+esc(b)+'</strong></article>').join('');
   if(mode==='members')cards='<div class="oap-members">'+EXTRA.members.map(([a,b])=>'<div class="oap-member"><b>'+esc(a)+'</b><span>'+esc(b)+'</span></div>').join('')+'</div>';
 }else{
   cards=labels.map((label,i)=>{const val=valueFor(label,map,info,i);if(mode==='edit')return '<label class="ore-field"><label>'+esc(label)+'</label><input value="'+esc(val)+'"></label>';return '<article class="oap-card"><b>'+esc(label)+'</b><strong>'+esc(val)+'</strong></article>'}).join('');
 }
 drawer.querySelector('.ore-body').innerHTML='<div class="oap-summary">'+esc(summary)+'</div><div class="ore-grid"><div class="oap-section-title">'+esc(info.values[0]||'当前对象')+'</div>'+cards+'</div><div class="ore-note">'+(mode==='view'||mode==='effect'||mode==='members'?'此页面仅展示与当前操作相关的信息，不会修改列表数据。':'确认后将记录本次业务操作，并更新对应任务状态。')+'</div>';
 const foot=drawer.querySelector('.ore-foot');
 foot.innerHTML='<button class="ore-btn" type="button" data-ore-close>关闭</button>'+((mode==='view'||mode==='effect'||mode==='members')?'':'<button class="ore-btn primary" type="button" data-oap-confirm>'+esc(mode==='api'?'保存密钥配置':'确认操作')+'</button>');
 drawer.classList.add('open');return true;
}
window.addEventListener('click',e=>{const b=e.target instanceof Element?e.target.closest('[data-oap-confirm]'):null;if(!b)return;e.preventDefault();e.stopImmediatePropagation();document.getElementById('octopusRowEditor')?.classList.remove('open');try{window.toast?.('操作已保存')}catch{}},true);
window.OctopusActionPages={open,config:CONFIG};
})();