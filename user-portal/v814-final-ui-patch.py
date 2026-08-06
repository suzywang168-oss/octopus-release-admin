from pathlib import Path
import sys

path=Path(sys.argv[1])
source=path.read_text(encoding='utf-8')

old_gen="""const GEN_ACTIONS={
'production.languages':{pending:[['generate','开始译配'],['config','译配配置']],results:[['edit','重新编辑'],['listen','试听'],['download','下载']]},
'release.titles':{pending:[['generate','生成标题'],['source','查看内容']],results:[['edit','重新编辑'],['copy','复制标题'],['detail','详情']]},
'release.covers':{pending:[['generate','生成封面'],['source','查看剧情']],results:[['edit','重新编辑'],['preview','预览'],['download','下载']]}
};"""
new_gen="""const GEN_ACTIONS={
'production.languages':{pending:[['generate','开始译配'],['config','译配配置']],results:[['edit','重新编辑'],['listen','试听'],['download','下载']]},
'release.titles':{pending:[['generate','生成标题']],results:[['edit','重新编辑'],['copy','复制标题'],['detail','详情']]},
'release.covers':{pending:[['generate','生成封面']],results:[['edit','重新编辑'],['preview','预览'],['download','下载']]}
};"""
if source.count(old_gen)!=1:
    raise SystemExit('V8.14 generation action map signature changed')
source=source.replace(old_gen,new_gen,1)

old_list="""const LIST_ACTIONS={
'overview':[['enter','进入项目'],['progress','查看进度']],
'todo':[['process','开始处理'],['handoff','转交']],
'ops.analytics':[['analysis','查看分析'],['compare','同类对比']],
'ops.crawl':[['assets','查看素材'],['adopt','采纳片单']],
'ops.unblock':[['link','查看禁播链接'],['materials','补充材料']],
'production.upload':[['asset','查看源内容'],['extract','查看 AI 提炼']],
'release.publish':[['preview','发布预览'],['retry','重试任务']]
};"""
new_list="""const LIST_ACTIONS={
'overview':[['enter','进入项目'],['progress','查看进度']],
'todo':[['process','开始处理'],['handoff','转交']],
'ops.analytics':[['analysis','查看分析'],['compare','同类对比']],
'ops.crawl':[['assets','查看素材'],['adopt','采纳片单'],['recordEdit','编辑'],['recordArchive','归档']],
'ops.unblock':[['link','查看禁播链接'],['materials','补充材料'],['recordEdit','编辑'],['recordArchive','归档']],
'production.upload':[['asset','查看源内容'],['extract','查看 AI 提炼'],['recordEdit','编辑'],['recordArchive','归档']],
'release.publish':[['preview','发布预览'],['retry','重试任务'],['recordEdit','编辑'],['recordArchive','归档']]
};"""
if source.count(old_list)!=1:
    raise SystemExit('V8.14 list action map signature changed')
source=source.replace(old_list,new_list,1)

start=source.index('function arrangeHeader(){')
end=source.index('\nfunction contentConsole()',start)
new_header=r'''function arrangeHeader(){let head=document.querySelector('#pageRoot .page-head'),workspace=document.querySelector('.workspace'),title=workspace?.querySelector('b'),sub=workspace?.querySelector('small');if(!head)return;let desc=head.querySelector('p')?.textContent||'';if(title&&P[active])title.textContent=P[active].t;if(sub)sub.textContent=desc;let actions=head.querySelector('.head-actions'),bar=document.createElement('div');bar.className='v810-list-head'+(AI_EDIT.has(active)?' v814-generation-head':'');bar.innerHTML='<strong>列表记录</strong>'+(AI_EDIT.has(active)?'<div class="v814-list-controls"></div>':'')+'<div class="v810-list-actions"></div>';let actionBox=bar.querySelector('.v810-list-actions');if(actions){if(AI_EDIT.has(active)){let exportBtn=actions.querySelector('[data-v80-export]');actions.querySelector('[data-v80-create]')?.remove();if(exportBtn)actionBox.append(exportBtn)}else actionBox.append(...actions.children)}let kpis=document.querySelector('#pageRoot .kpis');(kpis||head).insertAdjacentElement('afterend',bar);head.remove()}
function mergeGenerationHeader(){if(!AI_EDIT.has(active))return;let bar=document.querySelector('#pageRoot .v814-generation-head'),controls=bar?.querySelector('.v814-list-controls'),toolbar=document.querySelector('#pageRoot .toolbar.v87-compact'),left=toolbar?.querySelector('.toolbar-left');if(!bar||!controls||!left)return;controls.replaceChildren(...left.children);toolbar.remove()}'''
source=source[:start]+new_header+source[end:]

start=source.index('function renderRich(){')
end=source.index('\nrender=renderRich;',start)
new_render=r'''function renderRich(){renderBase();richStyle();splitStyle();moveSearchAndClean();installListActions();arrangeHeader();if(!AI_EDIT.has(active)){paginateBase();return}let allRows=genRows(),offset=(currentPage()-1)*PAGE_SIZE,rows=allRows.slice(offset,offset+PAGE_SIZE),table=document.querySelector('#pageRoot table'),head=table?.querySelector('thead tr'),body=table?.querySelector('tbody');if(!head||!body)return;body.innerHTML=rows.map((r,i)=>'<tr data-v80-row="'+(offset+i)+'">'+r.map((v,j)=>'<td>'+(j===0?'<span class="title-cell">'+e(v)+'</span>':/状态|质检|采用/.test(P[active].h[j])?pill(v):e(v))+'</td>').join('')+'<td></td></tr>').join('');let left=document.querySelector('#pageRoot .toolbar-left');if(generationList==='pending'){head.insertAdjacentHTML('afterbegin','<th><input class="v81-check" type="checkbox" data-v81-all aria-label="全选"></th>');body.querySelectorAll('tr').forEach((tr,i)=>{let idx=offset+i;tr.insertAdjacentHTML('afterbegin','<td><input class="v81-check" type="checkbox" data-v81-select="'+idx+'" aria-label="选择 '+e(rows[i][0])+'"></td>');tr.lastElementChild.innerHTML=actionHtml(GEN_ACTIONS[active].pending,idx)});let action=CONTENT_FLOW.find(([r])=>r===active)?.[2]||'批量生成';left?.insertAdjacentHTML('afterbegin','<div class="v81-bulk"><button class="btn small primary" data-v81-bulk>'+action+'</button><span class="v81-count" data-v81-count>已选 0 项</span></div>'+contentConsole())}else{body.querySelectorAll('tr').forEach((tr,i)=>tr.lastElementChild.innerHTML=actionHtml(GEN_ACTIONS[active].results,offset+i));left?.insertAdjacentHTML('afterbegin',contentConsole()+'<span class="v85-result-note">共 '+allRows.length+' 条已生成结果，可重新编辑并保存新版本</span>')}moveSearchAndClean();mergeGenerationHeader();addPagination(allRows.length)}'''
source=source[:start]+new_render+source[end:]

handler_pos=source.index('function handleListAction(btn){')
new_editors=r'''function recordEditor(row,index){let c=P[active];if(!c||!row){toast('未找到可编辑记录');return}let box=document.createElement('div');box.className='v80-modal';box.dataset.v814Action='recordEdit';let fields=c.h.map((label,i)=>'<label class="plan-field '+(i===0?'full':'')+'"><span>'+e(label)+'</span>'+(i===c.h.length-1?'<textarea data-v814-field="'+i+'">'+e(row[i]??'')+'</textarea>':'<input type="text" data-v814-field="'+i+'" value="'+e(row[i]??'')+'">')+'</label>').join('');box.innerHTML='<form class="v814-action-dialog v814-record-editor"><div class="v81-editor-head"><div><h2>编辑 · '+e(row[0])+'</h2><p>'+e(c.t)+' · 保存后立即更新列表，并保留本地操作记录。</p></div><button type="button" class="btn" data-close>关闭</button></div><div class="v814-action-body"><div class="v814-record-grid">'+fields+'</div><label class="plan-field"><span>修改说明</span><textarea data-v814-reason placeholder="说明本次修改原因和影响范围"></textarea></label></div><div class="v81-savebar"><button type="button" class="btn" data-close>取消</button><div><button type="button" class="btn primary" data-v814-save-record>保存修改</button></div></div></form>';document.body.appendChild(box);box.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>box.remove());box.querySelector('[data-v814-save-record]').onclick=()=>{box.querySelectorAll('[data-v814-field]').forEach(input=>{let i=+input.dataset.v814Field;row[i]=input.value.trim()||'—'});box.remove();render();toast('记录已更新')};box.querySelector('[data-v814-field="0"]')?.focus()}
function archiveRecord(row,index){let c=P[active];if(!c||!row){toast('未找到可归档记录');return}let box=document.createElement('div');box.className='v80-modal';box.dataset.v814Action='recordArchive';box.innerHTML='<form class="v814-action-dialog v814-archive-dialog"><div class="v81-editor-head"><div><h2>归档 · '+e(row[0])+'</h2><p>'+e(c.t)+' · 归档后将从当前列表移除，但不会清除审计记录。</p></div><button type="button" class="btn" data-close>关闭</button></div><div class="v814-action-body"><section class="v81-panel"><h3>归档确认</h3><div class="metric-row"><span>记录</span><b>'+e(row[0])+'</b></div><div class="metric-row"><span>当前状态</span><b>'+e(row.at(-1)??'—')+'</b></div><label class="plan-field"><span>归档原因</span><textarea data-v814-archive-reason placeholder="请输入归档原因"></textarea></label></section></div><div class="v81-savebar"><button type="button" class="btn" data-close>取消</button><div><button type="button" class="btn primary" data-v814-confirm-archive>确认归档</button></div></div></form>';document.body.appendChild(box);box.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>box.remove());box.querySelector('[data-v814-confirm-archive]').onclick=()=>{let rows=P[active]?.r||[];let realIndex=rows.indexOf(row);if(realIndex>=0)rows.splice(realIndex,1);box.remove();render();toast('记录已归档')}}
'''
source=source[:handler_pos]+new_editors+source[handler_pos:]

old_handler="function handleListAction(btn){let action=btn.dataset.v88Action,i=+btn.dataset.v88Index,rows=AI_EDIT.has(active)?genRows():P[active].r,row=rows[i];if(!row){toast('未找到当前记录，请刷新后重试');return}if(action==='generate'||action==='edit'||(action==='config'&&AI_EDIT.has(active))){editor(i,action==='edit'?'edit':'generate');return}"
new_handler="function handleListAction(btn){let action=btn.dataset.v88Action,i=+btn.dataset.v88Index,rows=AI_EDIT.has(active)?genRows():P[active].r,row=rows[i];if(!row){toast('未找到当前记录，请刷新后重试');return}if(action==='recordEdit'){recordEditor(row,i);return}if(action==='recordArchive'){archiveRecord(row,i);return}if(action==='generate'||action==='edit'||(action==='config'&&AI_EDIT.has(active))){editor(i,action==='edit'?'edit':'generate');return}"
if source.count(old_handler)!=1:
    raise SystemExit('V8.14 list handler signature changed')
source=source.replace(old_handler,new_handler,1)

css=r'''
(()=>{
'use strict';
if(document.getElementById('v814-final-ui-style'))return;
const style=document.createElement('style');
style.id='v814-final-ui-style';
style.textContent=`
#pageRoot .v814-generation-head{display:flex!important;align-items:center!important;gap:10px!important;flex-wrap:nowrap!important;min-height:40px!important;padding:0!important}
#pageRoot .v814-generation-head>strong{flex:none!important;white-space:nowrap!important}
#pageRoot .v814-list-controls{display:flex!important;align-items:center!important;gap:8px!important;flex:1 1 auto!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none!important}
#pageRoot .v814-list-controls::-webkit-scrollbar{display:none!important}
#pageRoot .v814-list-controls>*{flex:none!important}
#pageRoot .v814-list-controls .v85-result-note{white-space:nowrap!important}
#pageRoot .v814-generation-head .v810-list-actions{display:flex!important;align-items:center!important;gap:7px!important;flex:none!important}
#pageRoot .v814-generation-head .v810-list-actions [data-v80-create]{display:none!important}
.v814-record-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;margin-bottom:12px!important}
.v814-record-grid .full{grid-column:1/-1!important}
.v814-record-editor .v814-action-body,.v814-archive-dialog .v814-action-body{padding:18px 22px!important}
@media(max-width:900px){#pageRoot .v814-generation-head{gap:7px!important}#pageRoot .v814-generation-head>strong{display:none!important}}
@media(max-width:680px){#pageRoot .v814-generation-head{align-items:stretch!important;flex-wrap:wrap!important}#pageRoot .v814-list-controls{order:2;width:100%!important}#pageRoot .v814-generation-head .v810-list-actions{margin-left:auto!important}.v814-record-grid{grid-template-columns:1fr!important}.v814-record-grid .full{grid-column:auto!important}}
`;
document.head.appendChild(style);
})();
'''
source+=css
path.write_text(source,encoding='utf-8')
