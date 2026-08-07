from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

handler = "function handleListAction(btn){"
if source.count(handler) != 1:
    raise SystemExit('V8.14 list action handler signature changed before todo routing patch')

helpers = r'''function todoTaskRoute(row){
  const module=String(row?.[1]||'').replace(/\s+/g,'');
  const text=[row?.[0],row?.[1],row?.[2],row?.[7]].filter(Boolean).join(' ');
  if(/标题/.test(module)||/标题生成|选择.*标题|编辑.*标题/.test(text))return 'release.titles';
  if(/封面/.test(module)||/封面生成|选择.*封面|编辑.*封面/.test(text))return 'release.covers';
  if(/译配|字幕|配音/.test(module)||/译配|字幕对齐|配音/.test(text))return 'production.languages';
  if(/解禁|申诉|禁播/.test(module)||/解禁|申诉|权属|禁播/.test(text))return 'ops.unblock';
  if(/上传|提炼|内容生产/.test(module)||/上传|AI 提炼|内容提炼/.test(text))return 'production.upload';
  if(/投流|抓取|素材/.test(module)||/抓取|投流素材|片单/.test(text))return 'ops.crawl';
  if(/数据|分析/.test(module)||/频道数据|运营分析/.test(text))return 'ops.analytics';
  if(/发布|频道上传|上线/.test(module)||/发布|频道上传|排期|上线/.test(text))return 'release.publish';
  return '';
}
function todoTaskGenerationList(route,row){
  if(!AI_EDIT.has(route))return 'pending';
  const text=[row?.[0],row?.[3],row?.[6],row?.[7]].filter(Boolean).join(' ');
  return /确认|复核|质检|选择|编辑|已生成|已完成/.test(text)?'results':'pending';
}
function enterTodoTask(row){
  const target=todoTaskRoute(row);
  if(!target||!P[target]){toast('未找到该待办对应的业务模块');return}
  if(row?.length>6)row[6]='处理中';
  if(AI_EDIT.has(target)){
    const list=todoTaskGenerationList(target,row);
    generationListByModule[target]=list;
  }
  activateModule(target);
  pageState[pageKey()]=1;
  const search=document.getElementById('globalSearch');
  if(search)search.value='';
  render();
  toast('已进入「'+P[target].t+'」 · '+String(row?.[2]||row?.[0]||'当前任务'));
}
'''
source = source.replace(handler, helpers + handler, 1)

old_process = "if(action==='process'){row[6]='处理中';render();toast('任务已进入处理状态');return}"
new_process = "if(action==='process'&&active==='todo'){enterTodoTask(row);return}"
if source.count(old_process) != 1:
    raise SystemExit('V8.14 todo process action signature changed')
source = source.replace(old_process, new_process, 1)

close_html = '<button type="button" class="btn" data-close>关闭</button>'
close_icon = '<button type="button" class="btn v814-icon-close" data-close aria-label="关闭" title="关闭"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg></button>'
close_count = source.count(close_html)
if close_count < 3:
    raise SystemExit(f'Expected multiple V8.14 text close controls, found {close_count}')
source = source.replace(close_html, close_icon)

css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-todo-route-close-icon-style'))return;
const style=document.createElement('style');
style.id='v814-todo-route-close-icon-style';
style.textContent=`
.v80-modal .v814-icon-close{
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  flex:none!important;
  width:32px!important;
  min-width:32px!important;
  height:32px!important;
  min-height:32px!important;
  padding:0!important;
  border-radius:9px!important;
}
.v80-modal .v814-icon-close svg{
  width:15px!important;
  height:15px!important;
  fill:none!important;
  stroke:currentColor!important;
  stroke-width:1.8!important;
  stroke-linecap:round!important;
}
.v80-modal .v814-icon-close:hover{background:var(--panel2)!important;color:#fff!important}
`;
document.head.appendChild(style);
})();
'''
source += css

path.write_text(source, encoding='utf-8', newline='\n')
