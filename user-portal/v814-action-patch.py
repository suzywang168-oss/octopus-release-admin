from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

old_actions = """const LIST_ACTIONS={
'overview':[['enter','进入项目'],['progress','查看进度']],
'todo':[['process','开始处理'],['handoff','转交']],
'ops.analytics':[['analysis','查看分析'],['compare','同类对比']],
'ops.crawl':[['assets','查看素材'],['adopt','采纳片单']],
'ops.unblock':[['link','打开链接'],['materials','补充材料']],
'production.upload':[['asset','查看内容'],['extract','查看提炼']],
'release.publish':[['preview','发布预览'],['retry','重试任务']]
};"""
new_actions = """const LIST_ACTIONS={
'overview':[['enter','进入项目'],['progress','查看进度']],
'todo':[['process','开始处理'],['handoff','转交']],
'ops.analytics':[['analysis','查看分析'],['compare','同类对比']],
'ops.crawl':[['assets','查看素材'],['adopt','采纳片单']],
'ops.unblock':[['link','查看禁播链接'],['materials','补充材料']],
'production.upload':[['asset','查看源内容'],['extract','查看 AI 提炼']],
'release.publish':[['preview','发布预览'],['retry','重试任务']]
};"""
if source.count(old_actions) != 1:
    raise SystemExit('V8.14 list-action map signature changed')
source = source.replace(old_actions, new_actions, 1)

old_editor = "function editor(i,mode='edit'){let c=P[active],r=genRows()[i],box=document.createElement('div');"
new_editor = "function editor(i,mode='edit'){let c=P[active],r=genRows()[i];if(!c||!r){toast('未找到可编辑记录，请刷新列表后重试');return}let box=document.createElement('div');"
if source.count(old_editor) != 1:
    raise SystemExit('V8.14 editor entry signature changed')
source = source.replace(old_editor, new_editor, 1)

old_box = "box.innerHTML='<form class=\"v81-editor\"><div class=\"v81-editor-head\">"
new_box = "if(!body){toast('当前模块的编辑器尚未初始化');return}box.innerHTML='<form class=\"v81-editor\"><div class=\"v81-editor-head\">"
if source.count(old_box) != 1:
    raise SystemExit('V8.14 editor body signature changed')
source = source.replace(old_box, new_box, 1)

start = source.index('function handleListAction(btn){')
end = source.index('\nfunction contentIndex(', start)
new_handlers = r'''function actionModal(action,row){
let c=P[active];if(!c||!row){toast('未找到当前记录');return}
let box=document.createElement('div');box.className='v80-modal';box.dataset.v814Action=action;
let titleMap={enter:'项目详情',progress:'项目进度',analysis:'频道数据分析',compare:'同类内容对比',assets:'抓取素材样本',materials:'补充解禁材料',asset:'源内容预览',extract:'AI 提炼结果',source:'生成依据',preview:active==='release.covers'?'封面预览':'发布预览',detail:'版本记录',handoff:'转交任务',link:'禁播链接详情',listen:'译配试听'};
let title=titleMap[action]||'记录详情',body='';
let field=(label,value)=>'<div class="metric-row"><span>'+e(label)+'</span><b>'+e(value??'—')+'</b></div>';
let rows=(items)=>items.map(([label,value])=>field(label,value)).join('');
if(action==='enter')body='<div class="v814-action-grid"><section class="v81-panel"><h3>项目概览</h3>'+rows([['项目',row[0]],['当前阶段',row[1]],['负责人',row[6]],['下一节点',row[7]]])+'</section><section class="v81-panel"><h3>模块进度</h3>'+rows([['内容生产',row[2]],['AI 译配',row[3]],['标题 / 封面',row[4]],['频道发布',row[5]]])+'</section></div>';
else if(action==='progress')body='<div class="v814-timeline"><div><b>01 内容生产</b><span>'+e(row[2])+'</span></div><div><b>02 AI 译配</b><span>'+e(row[3])+'</span></div><div><b>03 标题与封面</b><span>'+e(row[4])+'</span></div><div><b>04 频道发布</b><span>'+e(row[5])+'</span></div></div>';
else if(action==='analysis')body='<div class="v814-action-grid"><section class="v81-panel"><h3>频道表现</h3>'+rows([['频道',row[0]],['内容类型',row[1]],['观看次数',row[2]],['点击率',row[3]],['收入',row[4]],['留存',row[5]],['RPM',row[6]]])+'</section><section class="v81-panel"><h3>AI 运营建议</h3><textarea>'+e(row[7])+'；建议结合近 30 天高留存内容继续验证。</textarea><div class="metric-row"><span>置信度</span><b>92.6%</b></div></section></div>';
else if(action==='compare')body='<div class="v814-compare"><article><span>当前频道</span><b>'+e(row[3])+' CTR</b><small>'+e(row[5])+' 留存</small></article><article><span>同类中位数</span><b>6.18% CTR</b><small>21.4% 留存</small></article><article><span>同类前 10%</span><b>8.04% CTR</b><small>30.2% 留存</small></article></div><section class="v81-panel" style="margin-top:12px"><h3>差异结论</h3><p>当前内容的点击率与留存均高于同类中位数，可继续追加相同标签与演员组合。</p></section>';
else if(action==='assets')body='<div class="v814-action-grid"><section class="v81-panel"><h3>任务数据</h3>'+rows([['抓取任务',row[0]],['渠道',row[1]],['素材量',row[2]],['去重后',row[3]],['高潜片单',row[4]],['状态',row[5]]])+'</section><section class="v81-panel"><h3>素材样本</h3><div class="v814-assets"><div>01 · 强冲突开场 <b>CTR 8.7%</b></div><div>02 · 身份反转 <b>CTR 8.2%</b></div><div>03 · 结果悬念 <b>CTR 7.9%</b></div></div></section></div>';
else if(action==='materials')body='<div class="v814-action-grid"><section class="v81-panel"><h3>禁播记录</h3>'+rows([['链接',row[0]],['平台 / 频道',row[1]],['剧集',row[2]],['识别原因',row[3]],['状态',row[6]]])+'</section><section class="v81-panel"><h3>补充材料</h3><label class="plan-field"><span>材料类型</span><select><option>版权授权书</option><option>音乐使用证明</option><option>内容说明</option></select></label><label class="plan-field"><span>材料说明</span><textarea placeholder="说明权利来源与申诉依据"></textarea></label><label class="plan-field"><span>附件</span><input type="file"></label></section></div>';
else if(action==='asset')body='<div class="v814-action-grid"><section class="v81-panel"><h3>源文件信息</h3>'+rows([['内容 / 版本',row[0]],['集数',row[1]],['上传进度',row[2]],['去重检查',row[6]],['当前状态',row[7]]])+'</section><section class="v81-panel"><h3>剧集预览</h3><div class="v814-video"><button type="button" class="v814-play">▶</button><div><b>'+e(row[0])+'</b><small>EP01 · 00:00 / 02:18</small></div></div><div class="v814-episode-list"><span>EP01 已上传</span><span>EP02 已上传</span><span>EP03 已上传</span></div></section></div>';
else if(action==='extract')body='<div class="v814-action-grid"><section class="v81-panel"><h3>故事总结</h3><textarea>一组调查员追查异常信号，逐步发现失踪事件与旧档案之间的关联。关键人物的真实身份在最后一集发生反转。</textarea><h3 style="margin-top:12px">剧情亮点</h3><div class="v814-tags"><span>身份反转</span><span>限时追查</span><span>封闭空间</span><span>强悬念结尾</span></div></section><section class="v81-panel"><h3>提炼与标签</h3>'+rows([['提炼状态',row[3]],['亮点数量',row[4]],['标签数量',row[5]],['重复检测',row[6]],['人工确认',row[7]]])+'<label class="plan-field"><span>人工修订说明</span><textarea placeholder="补充或修正 AI 提炼结果"></textarea></label></section></div>';
else if(action==='source')body='<div class="v814-action-grid"><section class="v81-panel"><h3>内容摘要</h3>'+rows([['内容版本',row[0]],['目标频道 / 语种',row[1]],['当前状态',row[6]]])+'<p>主角发现关键证据，人物关系发生反转，结尾留下强悬念。</p></section><section class="v81-panel"><h3>生成约束</h3><div class="v814-tags"><span>避免剧透</span><span>保持频道风格</span><span>突出冲突</span><span>保留人物名</span></div></section></div>';
else if(action==='preview'&&active==='release.covers')body='<div class="v814-cover-preview"><article><b>方案 A</b><span>'+e(row[1])+'</span></article><article class="active"><b>方案 B · 当前采用</b><span>'+e(row[1])+'</span></article><article><b>方案 C</b><span>'+e(row[1])+'</span></article></div>';
else if(action==='preview')body='<div class="v814-action-grid"><section class="v81-panel"><h3>发布配置</h3>'+rows([['发布任务',row[0]],['频道',row[1]],['版本',row[2]],['标题 / 封面',row[3]],['发布时间',row[6]],['状态',row[7]]])+'</section><section class="v81-panel"><h3>发布检查</h3><div class="v814-checks"><span>✓ 视频规格通过</span><span>✓ 字幕与音轨通过</span><span>✓ 标题封面已锁定</span><span>✓ 频道权限有效</span></div></section></div>';
else if(action==='detail')body='<section class="v81-panel"><h3>版本变更记录</h3><div class="v814-history"><div><b>v3 · 当前版本</b><span>Suzy Wang · 今天 14:12</span><p>人工调整候选并保存采用。</p></div><div><b>v2</b><span>AI Workflow · 今天 13:58</span><p>重新生成三个候选结果。</p></div><div><b>v1</b><span>AI Workflow · 今天 13:42</span><p>首次生成。</p></div></div></section>';
else if(action==='handoff')body='<div class="v814-action-grid"><section class="v81-panel"><h3>当前任务</h3>'+rows([['待办',row[0]],['关联内容',row[2]],['优先级',row[3]],['当前负责人',row[4]],['截止时间',row[5]]])+'</section><section class="v81-panel"><h3>转交设置</h3><label class="plan-field"><span>新负责人</span><select><option>Mia Chen</option><option>Leo Meyer</option><option>Nora Li</option></select></label><label class="plan-field"><span>转交说明</span><textarea placeholder="说明转交原因和下一步"></textarea></label></section></div>';
else if(action==='link')body='<div class="v814-action-grid"><section class="v81-panel"><h3>禁播链接</h3><label class="plan-field"><span>链接标识</span><input type="text" value="'+e(row[0])+'" readonly></label>'+rows([['平台 / 频道',row[1]],['剧集',row[2]],['禁播原因',row[3]],['片方',row[4]],['禁播方',row[5]],['状态',row[6]]])+'</section><section class="v81-panel"><h3>处理建议</h3><p>先核对权属与音轨，再补充授权材料并提交平台复核。</p><label class="plan-field"><span>内部备注</span><textarea></textarea></label></section></div>';
else if(action==='listen')body='<section class="v81-panel"><h3>'+e(row[0])+' · '+e(row[1])+'</h3><div class="v814-audio"><button type="button" class="v814-play">▶</button><div class="v814-wave"><i></i></div><span>00:18 / 01:06</span></div><label class="plan-field"><span>试听字幕</span><textarea>We should not have come back here. The signal is coming from inside the ship.</textarea></label></section>';
else body='<section class="v81-panel"><h3>记录详情</h3>'+c.h.map((h,i)=>field(h,row[i])).join('')+'</section>';
let primary={materials:'保存材料',extract:'保存修订',handoff:'确认转交',link:'复制链接'}[action]||'完成';
box.innerHTML='<form class="v814-action-dialog"><div class="v81-editor-head"><div><h2>'+e(title)+' · '+e(row[0])+'</h2><p>'+e(c.t)+' · 当前操作会保留审计记录。</p></div><button type="button" class="btn" data-close>关闭</button></div><div class="v814-action-body">'+body+'</div><div class="v81-savebar"><button type="button" class="btn" data-close>取消</button><div><button type="button" class="btn primary" data-v814-confirm>'+e(primary)+'</button></div></div></form>';
document.body.appendChild(box);box.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>box.remove());box.querySelector('[data-v814-confirm]').onclick=()=>{if(action==='link')navigator.clipboard?.writeText(String(row[0]));box.remove();toast(action==='handoff'?'任务已转交':action==='materials'?'材料已保存':action==='extract'?'AI 提炼修订已保存':action==='link'?'链接已复制':'操作已完成')};
}
function handleListAction(btn){let action=btn.dataset.v88Action,i=+btn.dataset.v88Index,rows=AI_EDIT.has(active)?genRows():P[active].r,row=rows[i];if(!row){toast('未找到当前记录，请刷新后重试');return}if(action==='generate'||action==='edit'||(action==='config'&&AI_EDIT.has(active))){editor(i,action==='edit'?'edit':'generate');return}if(['enter','progress','analysis','compare','assets','materials','asset','extract','source','preview','detail','handoff','link','listen'].includes(action)){actionModal(action,row);return}if(action==='process'){row[6]='处理中';render();toast('任务已进入处理状态');return}if(action==='adopt'){row[5]='已采纳';render();toast('片单已采纳并进入上线评估');return}if(action==='retry'){row[6]='重试中';render();toast('发布任务已重新进入队列');return}if(action==='copy'){let text=row.slice(1,4).join('\n');navigator.clipboard?.writeText(text);toast('标题候选已复制');return}if(action==='download'){let url=URL.createObjectURL(new Blob([row.join('\n')],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=String(row[0]).replaceAll(' ','-')+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);toast('结果文件已开始下载');return}toast('该操作暂不可用')}
'''
source = source[:start] + new_handlers + source[end:]

old_guard = "if(!active)return;if(q.target.closest('[data-v81-select],[data-v81-all]'))"
new_guard = "if(!active)return;if(q.target.closest('.crud-edit,.crud-remove,[data-more],[data-crud-close],[data-crud-save],[data-crud-confirm-remove],[data-crud-extra],[data-crud-menu-remove]'))return;if(q.target.closest('[data-v81-select],[data-v81-all]'))"
if source.count(old_guard) != 1:
    raise SystemExit('V8.14 CRUD click guard signature changed')
source = source.replace(old_guard, new_guard, 1)

action_css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-action-style'))return;
const style=document.createElement('style');
style.id='v814-action-style';
style.textContent=`
.v814-action-dialog{width:min(980px,calc(100vw - 32px))!important;max-height:calc(100vh - 48px)!important;overflow:auto!important;padding:0!important;border-radius:14px!important}
.v814-action-body{padding:18px 22px!important}.v814-action-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
.v814-action-dialog p{color:var(--soft)!important;font-size:9px!important;line-height:1.65!important}.v814-action-dialog input[type=file]{font-size:9px!important}
.v814-timeline{display:grid!important;gap:10px!important}.v814-timeline>div{display:grid!important;grid-template-columns:180px 1fr!important;gap:12px!important;padding:13px 14px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:var(--panel2)!important}.v814-timeline span{color:var(--soft)!important}
.v814-compare{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}.v814-compare article{display:grid!important;gap:7px!important;padding:15px!important;border:1px solid var(--line)!important;border-radius:11px!important;background:var(--panel2)!important}.v814-compare span,.v814-compare small{color:var(--muted)!important;font-size:9px!important}.v814-compare b{font-size:16px!important}
.v814-assets,.v814-episode-list,.v814-checks,.v814-history{display:grid!important;gap:8px!important}.v814-assets>div,.v814-episode-list span,.v814-checks span,.v814-history>div{padding:10px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--panel)!important;font-size:9px!important}.v814-assets>div{display:flex!important;justify-content:space-between!important;gap:10px!important}
.v814-video{display:flex!important;align-items:center!important;gap:12px!important;min-height:128px!important;padding:16px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:linear-gradient(145deg,#10213a,#263f61)!important}.v814-video div{display:grid!important;gap:5px!important}.v814-video small{color:#aec0d6!important}.v814-play{display:grid!important;place-items:center!important;width:42px!important;height:42px!important;padding:0!important;border:0!important;border-radius:50%!important;background:#5b7cff!important;color:#fff!important;cursor:pointer!important}
.v814-tags{display:flex!important;flex-wrap:wrap!important;gap:7px!important}.v814-tags span{display:inline-flex!important;padding:6px 9px!important;border:1px solid var(--line)!important;border-radius:999px!important;background:var(--panel)!important;color:var(--soft)!important;font-size:8px!important}
.v814-cover-preview{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important}.v814-cover-preview article{display:flex!important;flex-direction:column!important;justify-content:flex-end!important;min-height:300px!important;padding:16px!important;border:2px solid transparent!important;border-radius:12px!important;background:linear-gradient(145deg,#1c3151,#75586f)!important;color:#fff!important}.v814-cover-preview article:nth-child(2){background:linear-gradient(145deg,#65405a,#d18663)!important}.v814-cover-preview article:nth-child(3){background:linear-gradient(145deg,#194d65,#7f9b93)!important}.v814-cover-preview article.active{border-color:#7e98ff!important}.v814-cover-preview span{margin-top:6px!important;font-size:9px!important}
.v814-history>div{display:grid!important;grid-template-columns:1fr auto!important;gap:4px 12px!important}.v814-history p{grid-column:1/-1!important;margin:0!important}.v814-history span{color:var(--muted)!important;font-size:8px!important}
.v814-audio{display:grid!important;grid-template-columns:42px 1fr auto!important;align-items:center!important;gap:10px!important;margin:0 0 14px!important}.v814-wave{height:8px!important;overflow:hidden!important;border-radius:99px!important;background:var(--line)!important}.v814-wave i{display:block!important;width:38%!important;height:100%!important;background:#6f8dff!important}
@media(max-width:760px){.v814-action-grid,.v814-compare,.v814-cover-preview{grid-template-columns:1fr!important}.v814-action-body{padding:14px 16px!important}.v814-timeline>div{grid-template-columns:1fr!important}.v814-cover-preview article{min-height:220px!important}}
`;
document.head.appendChild(style);
})();
'''
source += action_css
path.write_text(source, encoding='utf-8')
