from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding="utf-8")

old_console = '''function contentConsole(){return '<article class="card v82-console"><div class="v82-tabs">'+CONTENT_FLOW.map(([r,t])=>'<button type="button" class="v82-tab '+(active===r?'active':'')+'" data-v82-module="'+r+'">'+t+'</button>').join('')+'</div><div class="v85-list-tabs"><button type="button" class="v85-list-tab '+(generationList==='pending'?'active':'')+'" data-v85-list="pending">未生成内容库 <b>'+GEN_DATA[active].pending.length+'</b></button><button type="button" class="v85-list-tab '+(generationList==='results'?'active':'')+'" data-v85-list="results">已生成结果 <b>'+GEN_DATA[active].results.length+'</b></button></div></article>'}'''
new_console = '''function contentConsole(){return '<div class="v85-list-tabs v814-stable-list-tabs"><button type="button" class="v85-list-tab '+(generationList==='pending'?'active':'')+'" data-v85-list="pending">未生成内容库 <b>'+GEN_DATA[active].pending.length+'</b></button><button type="button" class="v85-list-tab '+(generationList==='results'?'active':'')+'" data-v85-list="results">已生成结果 <b>'+GEN_DATA[active].results.length+'</b></button></div>'}'''
if source.count(old_console) != 1:
    raise SystemExit("V8.14 content console signature changed")
source = source.replace(old_console, new_console, 1)

start = source.index("function renderRich(){")
end = source.index("\nrender=renderRich;", start)
new_render = '''function renderRich(){renderBase();richStyle();splitStyle();moveSearchAndClean();installListActions();arrangeHeader();if(!AI_EDIT.has(active)){paginateBase();return}let allRows=genRows(),offset=(currentPage()-1)*PAGE_SIZE,rows=allRows.slice(offset,offset+PAGE_SIZE),table=document.querySelector('#pageRoot table'),head=table?.querySelector('thead tr'),body=table?.querySelector('tbody');if(!head||!body)return;body.innerHTML=rows.map((r,i)=>'<tr data-v80-row="'+(offset+i)+'">'+r.map((v,j)=>'<td>'+(j===0?'<span class="title-cell">'+e(v)+'</span>':/状态|质检|采用/.test(P[active].h[j])?pill(v):e(v))+'</td>').join('')+'<td></td></tr>').join('');let left=document.querySelector('#pageRoot .toolbar-left');if(generationList==='pending'){head.insertAdjacentHTML('afterbegin','<th><input class="v81-check" type="checkbox" data-v81-all aria-label="全选"></th>');body.querySelectorAll('tr').forEach((tr,i)=>{let idx=offset+i;tr.insertAdjacentHTML('afterbegin','<td><input class="v81-check" type="checkbox" data-v81-select="'+idx+'" aria-label="选择 '+e(rows[i][0])+'"></td>');tr.lastElementChild.innerHTML=actionHtml(GEN_ACTIONS[active].pending,idx)});let action=CONTENT_FLOW.find(([r])=>r===active)?.[2]||'批量生成';left?.insertAdjacentHTML('afterbegin','<div class="v81-bulk"><button class="btn small primary" data-v81-bulk>'+action+'</button><span class="v81-count" data-v81-count>已选 0 项</span></div>'+contentConsole())}else{body.querySelectorAll('tr').forEach((tr,i)=>tr.lastElementChild.innerHTML=actionHtml(GEN_ACTIONS[active].results,offset+i));left?.insertAdjacentHTML('afterbegin',contentConsole()+'<span class="v85-result-note">共 '+allRows.length+' 条已生成结果，可重新编辑并保存新版本</span>')}moveSearchAndClean();addPagination(allRows.length)}'''
source = source[:start] + new_render + source[end:]

old_action = "if(action==='generate'||action==='edit'){editor(i,action);return}if(['enter','progress','analysis','compare','assets','materials','asset','extract','config','source','preview','detail'].includes(action)){modal(row);return}"
new_action = "if(action==='generate'||action==='edit'||(action==='config'&&AI_EDIT.has(active))){editor(i,action==='edit'?'edit':'generate');return}if(['enter','progress','analysis','compare','assets','materials','asset','extract','source','preview','detail'].includes(action)){modal(row);return}"
if source.count(old_action) != 1:
    raise SystemExit("V8.14 list action signature changed")
source = source.replace(old_action, new_action, 1)

old_create = "else if(q.target.closest('[data-v80-create]')){q.preventDefault();q.stopImmediatePropagation();modal()}"
new_create = "else if(q.target.closest('[data-v80-create]')){q.preventDefault();q.stopImmediatePropagation();if(AI_EDIT.has(active))editor(contentIndex(active),'generate');else modal()}"
if source.count(old_create) != 1:
    raise SystemExit("V8.14 create action signature changed")
source = source.replace(old_create, new_create, 1)

stable_ui = r'''
(()=>{
'use strict';
if(document.getElementById('v814-stable-ui'))return;
const style=document.createElement('style');
style.id='v814-stable-ui';
style.textContent=`
#pageRoot .toolbar.v87-compact{display:flex!important;align-items:center!important;min-height:38px!important;margin:0 0 10px!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
#pageRoot .toolbar.v87-compact .toolbar-left{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:8px!important;width:100%!important}
#pageRoot .v81-bulk{display:inline-flex!important;align-items:center!important;gap:7px!important;padding:0!important;border:0!important}
#pageRoot .v814-stable-list-tabs{display:inline-flex!important;align-items:center!important;gap:6px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important}
#pageRoot .v814-stable-list-tabs .v85-list-tab{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;height:32px!important;min-height:32px!important;padding:0 12px!important;margin:0!important;border-radius:9px!important;font-size:9px!important;line-height:1!important;white-space:nowrap!important}
#pageRoot .v814-stable-list-tabs .v85-list-tab b{font-size:9px!important}
.v80-modal{display:flex!important;align-items:flex-start!important;justify-content:center!important;overflow:auto!important;padding:24px!important;box-sizing:border-box!important}
.v80-modal>form{box-sizing:border-box!important;margin:auto!important}
.v80-modal>form:not(.v81-editor){width:min(720px,calc(100vw - 32px))!important;max-height:calc(100vh - 48px)!important;overflow:auto!important;padding:22px!important}
.v81-editor{width:min(1040px,calc(100vw - 32px))!important;max-height:calc(100vh - 48px)!important;overflow:auto!important;padding:0!important;border-radius:14px!important}
.v81-editor-head{position:sticky!important;top:0!important;z-index:4!important;display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:18px!important;margin:0!important;padding:20px 22px 16px!important;border-bottom:1px solid var(--line)!important;background:var(--panel)!important}
.v81-editor-head h2{margin:0 0 6px!important;font-size:16px!important;line-height:1.35!important}.v81-editor-head p{margin:0!important;color:var(--muted)!important;font-size:9px!important;line-height:1.55!important}
.v81-editor-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;padding:18px 22px!important}
.v81-panel{min-width:0!important;padding:15px!important;border:1px solid var(--line)!important;border-radius:11px!important;background:var(--panel2)!important;overflow:hidden!important}
.v81-panel h3{margin:0 0 12px!important;font-size:11px!important;line-height:1.35!important}
.v81-panel .plan-field,.v81-panel>label{display:grid!important;gap:6px!important;margin:0 0 11px!important;color:var(--soft)!important;font-size:9px!important}
.v81-panel input[type=text],.v81-panel input:not([type]),.v81-panel select,.v81-panel textarea{display:block!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;padding:9px 10px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--panel)!important;color:var(--text)!important;font:inherit!important;line-height:1.45!important}
.v81-panel textarea{min-height:96px!important;resize:vertical!important}
.v81-option{display:grid!important;grid-template-columns:20px minmax(0,1fr) auto!important;align-items:center!important;gap:8px!important;margin:8px 0!important;padding:10px!important}.v81-option small{white-space:nowrap!important;color:var(--muted)!important}
.v81-cover-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.v81-cover{min-width:0!important}
.v81-panel .metric-row{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:12px!important;padding:8px 0!important;border-bottom:1px solid var(--line)!important;font-size:9px!important}.v81-panel .metric-row:last-child{border-bottom:0!important}.v81-panel .metric-row span{color:var(--muted)!important}.v81-panel .metric-row b{text-align:right!important;overflow-wrap:anywhere!important}
.v81-savebar{position:sticky!important;bottom:0!important;z-index:4!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;margin:0!important;padding:14px 22px!important;border-top:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:0 -10px 24px rgba(0,0,0,.08)!important}
.v81-savebar>div{display:flex!important;gap:8px!important;flex-wrap:wrap!important}
@media(max-width:760px){#pageRoot .toolbar.v87-compact .toolbar-left{align-items:stretch!important}#pageRoot .v814-stable-list-tabs{width:100%!important}#pageRoot .v814-stable-list-tabs .v85-list-tab{flex:1!important}.v80-modal{padding:10px!important}.v81-editor{width:100%!important;max-height:calc(100vh - 20px)!important}.v81-editor-head{padding:16px!important}.v81-editor-grid{grid-template-columns:1fr!important;padding:14px 16px!important}.v81-savebar{align-items:stretch!important;flex-direction:column!important;padding:12px 16px!important}.v81-savebar>div{width:100%!important}.v81-savebar .btn{flex:1!important}.v81-cover-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
`;
document.head.appendChild(style);
})();
'''

source += stable_ui
path.write_text(source, encoding="utf-8")
