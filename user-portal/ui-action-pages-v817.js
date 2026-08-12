(()=>{
'use strict';
const ROUTE=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CONFIG={
'对标对比':['对标分析','view','对比同标签剧集的播放、CTR、留存、RPM 与收入，查看目标剧集的优势和差距。',['对标维度','同标签样本','渠道适配','结论']],
'加入候选片单':['加入候选片单','candidate','先将当前剧集放入候选片单。完成多剧对比后，再统一生成选剧报告并创建内容生产任务。',['推荐理由','目标频道','优先级']],
'查看素材':['投流素材详情','view','查看原始素材、平台数据、热词命中与关联剧集。',['素材预览','平台表现','热词分析','关联剧集']],
'生成上线建议':['创建上线测试任务','launch','将外部素材趋势匹配到内部剧集，并明确地区、语种、频道账号、测试预算和上线时间。提交后进入频道分发队列。',['匹配剧集','地区语种','频道账号','测试预算']],
'查看链接':['禁播链接详情','view','查看原始链接、禁播平台、检测记录和当前申诉材料。',['原始链接','平台检测','禁播原因','材料记录']],
'更新工单':['更新解禁工单','edit','更新负责人、处理状态、材料进度和下一步动作。',['处理状态','负责人','补充材料','下一步']],
'查看解析':['AI 解析结果','view','查看全剧故事总结、剧情亮点、人物关系和标签置信度。',['故事总结','剧情亮点','人物关系','解析质量']],
'编辑AI标签':['编辑 AI 标签','tags','按标签体系检查并修改频道、剧情、演员、人设、场景、地域和时代标签。',['频道标签','剧情标签','人物标签','场景与地域']],
'配置入库':['配置剧集入库','ingest','该剧集来自选剧报告。请在剧集上传模块补齐素材、版本、集数和 AI 解析策略，提交后正式进入内容生产。',['素材来源','所属片方','素材版本','上传方式','集数范围','AI解析范围']],
'移出片单':['移出待入库片单','remove','从剧集上传模块移除这条待配置记录，不影响原选剧报告。',['移除原因']],
'查看任务':['译配任务详情','view','查看翻译、配音、字幕对齐、去重和质检的分步骤进度。',['翻译进度','配音进度','字幕对齐','质检记录']],
'配置译配':['配置译配任务','edit','配置目标语种、角色音色、字幕规则、去重策略和质检阈值。',['目标语种','角色音色','字幕规则','质检阈值']],
'查看3个标题':['AI 标题候选','view','同时查看三个标题候选、字符数、CTR 预测和频道匹配理由。',['候选 A','候选 B','候选 C','预测对比']],
'采用标题':['采用标题','edit','选择最终标题并确认字符合规、历史冲突和目标频道。',['采用候选','人工修改','冲突检查','目标频道']],
'预览3张封面':['AI 封面候选','view','并排预览三个封面候选及其视觉爆点、CTR 预测和重复度。',['方案 A','方案 B','方案 C','预测对比']],
'采用封面':['采用封面','edit','选择最终封面并确认裁切比例、文字安全区和频道视觉风格。',['采用方案','裁切比例','安全区','频道风格']],
'标题封面预览':['物料联合预览','creative','在同一页面检查标题、封面、语义一致性和频道适配。',['标题预览','封面预览','一致性校验','版本记录']],
'通过物料':['物料审核','approval','填写审核结论、意见和版本状态，确认通过或退回修改。',['审核结论','审核意见','版本状态','发布限制']],
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
'编辑权限':['编辑角色权限','permissions','按模块和操作级别配置角色能力、数据范围、审批规则与成员继承。',['数据范围','核心权限','审批规则','继承方式']],
'查看成员':['角色成员','members','查看当前角色下的成员、数据范围、最近活动和权限状态。',['成员列表','数据范围','最近活动','权限状态']],
'查看日志':['任务运行日志','view','查看任务节点、时间线、错误信息、重试记录和运行参数。',['运行时间线','节点日志','错误信息','运行参数']],
'重试任务':['重试任务','edit','确认重试节点、优先级和失败后的告警方式。',['重试节点','任务优先级','告警方式','运行参数']]
};
const TAGS={
'逆光心动':{'频道标签':['TikTok 北美','YouTube 英语','女性向'],'剧情标签':['豪门复仇','身份反转','真假千金','强冲突','爽剧'],'演员标签':['年轻女主','成熟男主','双强组合','高辨识度配角'],'人设标签':['复仇女主','豪门继承人','危险盟友'],'场景标签':['豪宅','董事会','雨夜'],'地域标签':['北美适配','都市'],'时代标签':['现代','当代商业']},
'契约之后':{'频道标签':['Facebook 拉美','TikTok 西语','女性向'],'剧情标签':['先婚后爱','契约婚姻','追妻火葬场','误会反转','甜虐'],'演员标签':['年轻女主','冷面男主','情侣组合'],'人设标签':['独立女主','冷面总裁','欢喜冤家'],'场景标签':['婚礼','办公室'],'地域标签':['拉美适配','都市'],'时代标签':['现代']},
'她从雨夜归来':{'频道标签':['YouTube 英语','Facebook 北美','悬疑向'],'剧情标签':['复仇','悬疑调查','失踪谜案','身份秘密','真相反转'],'演员标签':['神秘女主','调查者','危险盟友'],'人设标签':['复仇女主','神秘归来者','执着调查者'],'场景标签':['雨夜','旧宅'],'地域标签':['北美适配'],'时代标签':['现代']}
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
 #octopusRowEditor.oap-tags-mode{display:grid!important;place-items:center!important;background:rgba(2,8,18,.7)!important;backdrop-filter:blur(4px)!important}\n #octopusRowEditor.oap-tags-mode .ore-backdrop{display:none!important}\n #octopusRowEditor.oap-tags-mode .ore-panel{position:relative!important;top:auto!important;right:auto!important;width:min(920px,94vw)!important;height:auto!important;max-height:90vh!important;border:1px solid var(--line)!important;border-radius:16px!important;box-shadow:0 32px 100px rgba(0,0,0,.5)!important;overflow:hidden!important}\n #octopusRowEditor.oap-tags-mode .ore-body{max-height:calc(90vh - 132px)!important}\n #octopusRowEditor .oap-tags{grid-column:1/-1;display:grid;gap:10px}\n #octopusRowEditor .oap-tag-group{padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel2)}\n #octopusRowEditor .oap-tag-group-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}\n #octopusRowEditor .oap-tag-group-head b{color:var(--text);font-size:9px}.oap-tag-group-head span{color:var(--soft);font-size:8px}\n #octopusRowEditor .oap-tag-group textarea{width:100%;min-height:66px!important}\n #octopusRowEditor .oap-tag-total{grid-column:1/-1;color:#91a8ff;font-size:9px;font-weight:750}\n #octopusRowEditor .oap-creative{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:12px}\n #octopusRowEditor .oap-preview-panel{padding:13px;border:1px solid var(--line);border-radius:11px;background:var(--panel2)}\n #octopusRowEditor .oap-preview-panel h4{margin:0 0 10px;font-size:10px;color:var(--text)}\n #octopusRowEditor .oap-title-option{display:flex;gap:8px;padding:10px;margin-top:7px;border:1px solid var(--line);border-radius:9px;background:var(--panel);font-size:9px;line-height:1.5}.oap-title-option.active{border-color:#6683df}\n #octopusRowEditor .oap-cover-options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.oap-cover{aspect-ratio:4/5;border:1px solid var(--line);border-radius:9px;background:linear-gradient(150deg,#15233c,#71324a 52%,#0b1322);position:relative;overflow:hidden}.oap-cover:nth-child(2){background:linear-gradient(150deg,#101827,#294974,#2d1724)}.oap-cover:nth-child(3){background:linear-gradient(150deg,#291628,#985244,#111b2d)}.oap-cover.active{border:2px solid #6683df}.oap-cover span{position:absolute;left:7px;right:7px;bottom:7px;padding:6px;border-radius:6px;background:#050b14bb;color:#fff;font-size:7px}\n #octopusRowEditor .oap-checks{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.oap-check{padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--panel2)}.oap-check b{display:block;font-size:8px;color:var(--soft)}.oap-check strong{display:block;margin-top:6px;font-size:10px;color:#65d6b2}\n #octopusRowEditor .oap-approval{grid-column:1/-1;display:grid;gap:12px}.oap-decision{display:grid;grid-template-columns:1fr 1fr;gap:9px}.oap-decision label{display:flex;align-items:center;gap:8px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel2);color:var(--text);font-size:9px}.oap-decision label:has(input:checked){border-color:#6683df;background:color-mix(in srgb,#6683df 9%,var(--panel))}.oap-approval textarea{min-height:92px}.oap-approval-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}\n @media(max-width:720px){#octopusRowEditor .oap-creative,#octopusRowEditor .oap-checks,.oap-decision,.oap-approval-grid,#octopusRowEditor .oap-perm-basics,#octopusRowEditor .oap-perm-rules{grid-template-columns:1fr}}\n #octopusRowEditor .oap-permissions{grid-column:1/-1;display:grid;gap:14px}
 #octopusRowEditor .oap-perm-basics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
 #octopusRowEditor .oap-perm-basics label{display:grid;gap:7px;color:var(--soft);font-size:8px}
 #octopusRowEditor .oap-perm-basics input,#octopusRowEditor .oap-perm-basics select{height:39px;padding:0 10px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text)}
 #octopusRowEditor .oap-perm-table{width:100%;border-collapse:collapse;border:1px solid var(--line);border-radius:10px;overflow:hidden}
 #octopusRowEditor .oap-perm-table th,#octopusRowEditor .oap-perm-table td{padding:10px;border-bottom:1px solid var(--line);font-size:8px;text-align:center}
 #octopusRowEditor .oap-perm-table th:first-child,#octopusRowEditor .oap-perm-table td:first-child{text-align:left}
 #octopusRowEditor .oap-perm-table th{background:var(--panel2);color:var(--soft)}
 #octopusRowEditor .oap-perm-table input{width:15px;height:15px;accent-color:#6683df}
 #octopusRowEditor .oap-perm-rules{display:grid;grid-template-columns:1fr 1fr;gap:10px}
 #octopusRowEditor .oap-perm-rules label{display:grid;gap:7px;color:var(--soft);font-size:8px}
 #octopusRowEditor .oap-perm-rules select,#octopusRowEditor .oap-perm-rules textarea{box-sizing:border-box;width:100%;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);padding:10px}
 #octopusRowEditor .oap-perm-rules textarea{min-height:70px}
 #octopusRowEditor .oap-perm-note{padding:11px;border:1px solid color-mix(in srgb,#6683df 30%,var(--line));border-radius:9px;background:color-mix(in srgb,#6683df 7%,var(--panel));color:var(--soft);font-size:8px;line-height:1.6}
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
 drawer.classList.toggle('oap-tags-mode',mode==='tags');drawer.dataset.oapMode=mode;drawer.dataset.oapSeries=info.values[0]||'';drawer.querySelector('#oreTitle').textContent=title;
 drawer.querySelector('#oreSub').textContent=(info.values[0]||'当前记录')+' · '+(mode==='view'?'只读页面':'业务操作页面');
 let cards='';
 if(mode==='creative'){
   const series=esc(info.values[0]||'当前剧集'),channel=esc(info.values[1]||'目标频道');
   cards='<div class="oap-creative"><section class="oap-preview-panel"><h4>标题候选 · '+channel+'</h4><div class="oap-title-option active"><input type="radio" checked><span>'+series+'：她隐忍多年归来，所有人才发现真正身份</span></div><div class="oap-title-option"><input type="radio"><span>婚礼当天真相揭晓，那个被轻视的女人不再隐藏</span></div><div class="oap-title-option"><input type="radio"><span>所有证据都指向她，直到雨夜里的幕后者出现</span></div></section><section class="oap-preview-panel"><h4>封面候选 · 频道预览</h4><div class="oap-cover-options"><div class="oap-cover active"><span>方案 A · 双人对峙</span></div><div class="oap-cover"><span>方案 B · 人物特写</span></div><div class="oap-cover"><span>方案 C · 场景悬念</span></div></div></section><div class="oap-checks"><article class="oap-check"><b>标题封面语义一致性</b><strong>96% · 通过</strong></article><article class="oap-check"><b>频道风格匹配</b><strong>94% · 通过</strong></article><article class="oap-check"><b>历史重复检测</b><strong>8% · 低风险</strong></article></div></div>';
 }else if(mode==='approval'){
   cards='<div class="oap-approval"><div class="oap-decision"><label><input type="radio" name="approvalDecision" value="pass" checked>通过物料并进入分发</label><label><input type="radio" name="approvalDecision" value="return">退回标题 / 封面修改</label></div><div class="oap-approval-grid"><label class="ore-field"><label>审核版本</label><select><option>'+esc(map['版本']||'当前版本')+'</option><option>上一版本</option></select></label><label class="ore-field"><label>发布限制</label><select><option>无额外限制</option><option>仅指定频道</option><option>需版权复核</option></select></label></div><label class="ore-field"><label>审核意见</label><textarea placeholder="填写通过说明或明确指出需要修改的标题、封面及原因">标题与封面语义一致，频道风格匹配，可进入分发。</textarea></label><label class="ore-field"><label>通知对象</label><input value="物料制作负责人、频道运营"></label></div>';
 }else if(mode==='launch'){
   cards='<label class="ore-field"><label>机会来源</label><input value="外部高热素材趋势" readonly></label><label class="ore-field"><label>推荐题材</label><input value="身份反转 / 强冲突"></label><label class="ore-field"><label>目标地区 / 语种</label><select data-launch-region><option>北美 · 英语</option><option>拉美 · 西班牙语</option></select></label><label class="ore-field"><label>频道账号</label><select data-launch-channel><option>TK-US Drama</option><option>FB-Latina</option><option>YT-English</option></select></label><label class="ore-field"><label>测试预算</label><input value="$1,500"></label><label class="ore-field"><label>上线时间</label><input value="明天 18:00"></label><label class="ore-field full"><label>匹配依据与测试目标</label><textarea>外部素材近 7 天增速高，题材与内部剧集核心标签匹配；采用小流量测试，CTR 达到 7.5% 后扩大分发。</textarea></label>';
 }else if(mode==='candidate'){
   cards='<label class="ore-field" style="grid-column:1/-1"><label>入选理由</label><textarea placeholder="记录该剧集进入候选片单的原因">核心指标达到推荐阈值，建议进入候选池继续对比。</textarea></label><label class="ore-field"><label>目标频道</label><select><option>待报告统一分配</option><option>TK-US Drama</option><option>FB-Latina</option><option>YT-English</option></select></label><label class="ore-field"><label>候选优先级</label><select><option>高</option><option>中</option><option>观察</option></select></label>';
 }else if(mode==='ingest'){
   cards='<label class="ore-field"><label>素材来源</label><select><option>本地上传</option><option>对象存储链接</option><option>片方交付目录</option></select></label><label class="ore-field"><label>所属片方</label><input value="'+esc(map['片方']==='来自选剧报告'?'待选择':map['片方']||'待选择')+'" placeholder="选择或输入片方"></label><label class="ore-field"><label>素材版本</label><input value="原片 V1" placeholder="例如：原片 V1"></label><label class="ore-field"><label>上传方式</label><select><option>逐集上传</option><option>整包上传并自动拆集</option><option>复用素材库版本</option></select></label><label class="ore-field"><label>集数范围</label><input value="全剧" placeholder="例如：1-80 集"></label><label class="ore-field"><label>AI 解析范围</label><select><option>全剧解析并生成完整标签</option><option>仅解析新增集</option><option>暂不解析</option></select></label><label class="ore-field"><label>去重与质检</label><select><option>上传后自动去重并质检</option><option>仅去重</option><option>人工确认后执行</option></select></label><label class="ore-field"><label>生产备注</label><textarea placeholder="补充交付要求、版本差异或解析重点"></textarea></label>';
 }else if(mode==='remove'){
   cards='<label class="ore-field" style="grid-column:1/-1"><label>移除原因</label><textarea placeholder="填写移出待入库片单的原因">暂不进入内容生产</textarea></label>';
 }else if(mode==='permissions'){
   const role=esc(info.values[0]||'运营角色'),modules=['业务总览','运营导向','内容生产','发行流程','数据看板','系统管理'];
   cards='<div class="oap-permissions"><div class="oap-perm-basics"><label><span>角色名称</span><input data-perm-role value="'+role+'"></label><label><span>角色状态</span><select data-perm-status><option>启用</option><option>停用</option></select></label><label><span>数据范围</span><select data-perm-scope><option>分配的频道与项目</option><option>全部频道</option><option>全部项目</option><option>仅本人创建</option></select></label></div><div><div class="oap-section-title">模块权限矩阵</div><table class="oap-perm-table"><thead><tr><th>业务模块</th><th>查看</th><th>创建</th><th>编辑</th><th>审核</th><th>导出</th><th>管理</th></tr></thead><tbody>'+modules.map((m,i)=>'<tr data-perm-module="'+m+'"><td><b>'+m+'</b></td>'+['view','create','edit','approve','export','manage'].map((p,j)=>'<td><input type="checkbox" data-perm="'+p+'" '+(j===0||((i<5)&&j<3)?'checked':'')+'></td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="oap-perm-rules"><label><span>敏感操作审批</span><select data-perm-approval><option>分发、删除、密钥操作需要管理员审批</option><option>仅删除和密钥操作需要审批</option><option>所有写操作需要审批</option><option>无需审批</option></select></label><label><span>成员权限继承</span><select data-perm-inherit><option>成员继承角色权限，不允许个人扩权</option><option>允许管理员对成员追加权限</option><option>成员采用角色与项目权限交集</option></select></label><label><span>可管理频道 / 项目</span><textarea data-perm-targets>TK-US Drama，FB-Latina；全部已分配项目</textarea></label><label><span>审批人与生效时间</span><textarea data-perm-effective>审批人：Suzy Wang\n保存并审批后立即生效</textarea></label></div><div class="oap-perm-note">权限遵循最小授权原则：数据范围决定“能看到什么”，模块权限决定“能做什么”，敏感操作审批决定“何时需要二次确认”。保存后会记录角色版本和变更时间。</div></div>';
 }else if(mode==='tags'){
   const series=String(info.values[0]||'').replace(/\s+\d+$/,'').trim(),groups=TAGS[series]||TAGS['逆光心动'];
   const total=Object.values(groups).reduce((sum,tags)=>sum+tags.length,0);
   cards='<div class="oap-tag-total">完整 AI 标签 · 共 '+total+' 个</div><div class="oap-tags">'+Object.entries(groups).map(([name,tags])=>'<section class="oap-tag-group"><div class="oap-tag-group-head"><b>'+esc(name)+'</b><span>'+tags.length+' 个</span></div><textarea data-oap-tags="'+esc(name)+'">'+esc(tags.join('，'))+'</textarea></section>').join('')+'</div>';
 }else if(EXTRA[mode]){
   cards=EXTRA[mode].map(([a,b])=>'<article class="oap-card"><b>'+esc(a)+'</b><strong>'+esc(b)+'</strong></article>').join('');
   if(mode==='members')cards='<div class="oap-members">'+EXTRA.members.map(([a,b])=>'<div class="oap-member"><b>'+esc(a)+'</b><span>'+esc(b)+'</span></div>').join('')+'</div>';
 }else{
   cards=labels.map((label,i)=>{const val=valueFor(label,map,info,i);if(mode==='edit')return '<label class="ore-field"><label>'+esc(label)+'</label><input value="'+esc(val)+'"></label>';return '<article class="oap-card"><b>'+esc(label)+'</b><strong>'+esc(val)+'</strong></article>'}).join('');
 }
 drawer.querySelector('.ore-body').innerHTML='<div class="oap-summary">'+esc(summary)+'</div><div class="ore-grid"><div class="oap-section-title">'+esc(info.values[0]||'当前对象')+'</div>'+cards+'</div><div class="ore-note">'+(['view','effect','members','creative'].includes(mode)?'此页面用于审核前预览，不会修改已采用的标题或封面。':mode==='approval'?'提交后将更新物料审核状态，并通知物料制作与频道运营。':'确认后将记录本次业务操作，并更新对应任务状态。')+'</div>';
 if(mode==='tags')drawer.querySelector('.ore-panel')?.setAttribute('role','dialog');const foot=drawer.querySelector('.ore-foot');
 const readonly=['view','effect','members','creative'].includes(mode);
 const confirmLabel=mode==='permissions'?'保存权限配置':mode==='approval'?'提交审核结论':mode==='api'?'保存密钥配置':mode==='launch'?'创建上线测试任务':mode==='candidate'?'加入候选片单':mode==='ingest'?'提交入库并开始上传':mode==='remove'?'确认移出':'确认操作';
 foot.innerHTML='<button class="ore-btn" type="button" data-ore-close>关闭</button>'+(readonly?'':'<button class="ore-btn primary" type="button" data-oap-confirm>'+esc(confirmLabel)+'</button>');
 drawer.classList.add('open');return true;
}
window.addEventListener('click',e=>{const b=e.target instanceof Element?e.target.closest('[data-oap-confirm]'):null;if(!b)return;e.preventDefault();e.stopImmediatePropagation();const drawer=document.getElementById('octopusRowEditor'),mode=drawer?.dataset.oapMode,series=drawer?.dataset.oapSeries||'';if(mode==='permissions'){const matrix={};drawer.querySelectorAll('[data-perm-module]').forEach(row=>{matrix[row.dataset.permModule]={};row.querySelectorAll('[data-perm]').forEach(x=>matrix[row.dataset.perm]=x.checked)});const config={role:drawer.querySelector('[data-perm-role]')?.value,status:drawer.querySelector('[data-perm-status]')?.value,scope:drawer.querySelector('[data-perm-scope]')?.value,approval:drawer.querySelector('[data-perm-approval]')?.value,inherit:drawer.querySelector('[data-perm-inherit]')?.value,targets:drawer.querySelector('[data-perm-targets]')?.value,effective:drawer.querySelector('[data-perm-effective]')?.value,matrix,updatedAt:new Date().toISOString()};try{const all=JSON.parse(localStorage.getItem('octopus-role-permissions')||'{}');all[series]=config;localStorage.setItem('octopus-role-permissions',JSON.stringify(all))}catch{}drawer?.classList.remove('open');window.toast?.('角色权限配置已保存并生成新版本');return}else if(mode==='launch'){const launchRegion=drawer.querySelector('[data-launch-region]')?.value||'北美 · 英语',launchChannel=drawer.querySelector('[data-launch-channel]')?.value||'TK-US Drama';try{const list=JSON.parse(localStorage.getItem('octopus-launch-plans')||'[]');list.unshift({opportunity:'外部高热素材趋势',theme:'身份反转 / 强冲突',region:launchRegion,channel:launchChannel,budget:'$1,500',schedule:'明天 18:00',status:'待确定剧集',createdAt:new Date().toISOString()});localStorage.setItem('octopus-launch-plans',JSON.stringify(list))}catch{}drawer?.classList.remove('open');try{window.toast?.('上线测试需求已创建，请继续确定剧集和物料')}catch{}location.hash='#/release/distribution';return}else if(mode==='candidate'){try{const list=JSON.parse(localStorage.getItem('octopus-selection-candidates')||'[]');if(!list.some(x=>x.series===series))list.push({series,addedAt:new Date().toISOString(),status:'待生成报告'});localStorage.setItem('octopus-selection-candidates',JSON.stringify(list))}catch{}const row=[...document.querySelectorAll('.v815table tbody tr')].find(r=>r.cells?.[0]?.textContent.trim()===series);const action=[...row?.querySelectorAll('.v815act')||[]].find(x=>/加入候选片单|加入选剧报告/.test(x.textContent));if(action){action.textContent='已加入片单';action.dataset.a='已加入片单';action.disabled=true}try{window.toast?.('已加入候选片单，请继续对比或生成选剧报告')}catch{}}else if(mode==='ingest'){const row=[...document.querySelectorAll('.v815table tbody tr')].find(r=>r.cells?.[0]?.textContent.trim()===series);if(row){if(row.cells[2])row.cells[2].textContent='原片 V1';if(row.cells[3])row.cells[3].textContent='待上传';if(row.cells[5])row.cells[5].textContent='待生成';if(row.cells[6])row.cells[6].textContent='入库配置完成'}try{const list=JSON.parse(localStorage.getItem('octopus-production-candidates')||'[]');const item=list.find(x=>x.series===series);if(item){item.status='入库配置完成';item.next='上传素材并启动 AI 解析';localStorage.setItem('octopus-production-candidates',JSON.stringify(list))}}catch{}try{window.toast?.('入库配置已保存，请上传剧集素材')}catch{}}else if(mode==='remove'){[...document.querySelectorAll('.v815table tbody tr')].find(r=>r.cells?.[0]?.textContent.trim()===series)?.remove();try{const list=JSON.parse(localStorage.getItem('octopus-production-candidates')||'[]').filter(x=>x.series!==series);localStorage.setItem('octopus-production-candidates',JSON.stringify(list))}catch{}try{window.toast?.('已移出待入库片单')}catch{}}else{try{window.toast?.('操作已保存')}catch{}}drawer?.classList.remove('open')},true);
window.OctopusActionPages={open,config:CONFIG};
})();