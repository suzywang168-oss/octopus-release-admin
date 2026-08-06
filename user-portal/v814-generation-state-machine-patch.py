from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

editor_marker = "function editor(i,mode='edit'){"
if source.count(editor_marker) != 1:
    raise SystemExit('V8.14 editor marker changed before state-machine patch')

helpers = r'''function generationStepMarkup(){return '<div class="v814-loop-steps" data-v814-stepper><span data-v814-step="1">1 配置</span><i>›</i><span data-v814-step="2">2 AI 生成</span><i>›</i><span data-v814-step="3">3 人工确认</span><i>›</i><span data-v814-step="4">4 结果入库</span></div>'}
function setGenerationEditorStep(box,step,message=''){
  if(!box?.isConnected)return;
  box.dataset.step=String(step);
  box.querySelectorAll('[data-v814-step]').forEach(node=>{
    const value=Number(node.dataset.v814Step);
    node.classList.toggle('done',value<step);
    node.classList.toggle('current',value===step);
    node.classList.toggle('waiting',value>step);
  });
  const status=box.querySelector('[data-v814-status]');
  if(status)status.innerHTML=step===2?'<span class="v814-spinner"></span><b>'+e(message||'AI 正在生成候选结果…')+'</b>':'<b>'+e(message||({1:'请先确认配置，再启动 AI 生成。',3:'AI 生成已完成，请人工选择或编辑结果。',4:'正在写入已生成结果并保存版本…'}[step]||''))+'</b>';
  const locked=step===2||step===4;
  box.querySelectorAll('input,select,textarea').forEach(control=>control.disabled=locked);
  const draft=box.querySelector('[data-v81-draft]');if(draft){draft.hidden=step!==1;draft.disabled=locked}
  const start=box.querySelector('[data-v814-start]');if(start){start.hidden=step!==1;start.disabled=locked}
  box.querySelectorAll('[data-v81-regenerate]').forEach(button=>{button.hidden=step!==3;button.disabled=locked});
  const save=box.querySelector('[data-v81-save]');if(save){save.hidden=step!==3;save.disabled=locked}
}
function runGenerationEditorAI(box,isRegenerate=false){
  if(!box?.isConnected)return;
  setGenerationEditorStep(box,2,isRegenerate?'AI 正在重新生成候选结果…':'AI 正在读取配置并生成候选结果…');
  window.setTimeout(()=>{
    if(!box.isConnected)return;
    regenerateGenerationEditor(box);
    setGenerationEditorStep(box,3,isRegenerate?'新的候选结果已生成，请人工确认。':'AI 生成已完成，请人工选择或编辑结果。');
  },900);
}
function finishGenerationEditor(box,pending){
  if(!box?.isConnected)return;
  setGenerationEditorStep(box,4,pending?'正在将生成结果写入“已生成结果”…':'正在保存新版本并更新采用结果…');
  window.setTimeout(()=>{
    if(!box.isConnected)return;
    commitGenerationEditor(box,'save',pending?'生成完成，结果已进入已生成列表':'新版本已保存并采用');
  },420);
}
function bindGenerationEditorFlow(box,pending){
  box.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>box.remove());
  box.querySelector('[data-v81-draft]')?.addEventListener('click',()=>commitGenerationEditor(box,'draft','草稿已保存，仍保留在未生成内容库'));
  box.querySelector('[data-v814-start]')?.addEventListener('click',()=>runGenerationEditorAI(box,false));
  box.querySelectorAll('[data-v81-regenerate]').forEach(button=>button.onclick=()=>runGenerationEditorAI(box,true));
  box.querySelector('[data-v81-save]')?.addEventListener('click',()=>finishGenerationEditor(box,pending));
  setGenerationEditorStep(box,pending?1:3,pending?'请先确认配置，再启动 AI 生成。':'当前结果已载入，可人工编辑、重新生成或保存新版本。');
}
'''
source = source.replace(editor_marker, helpers + editor_marker, 1)

editor_pos = source.index(editor_marker)
tail_start = source.index("if(!body){toast('当前模块的编辑器尚未初始化');return}", editor_pos)
tail_end = source.index("\nfunction bulkGenerate", tail_start)
new_tail = r'''if(!body){toast('当前模块的编辑器尚未初始化');return}
let pending=box.dataset.list==='pending',primaryLabel=pending?'确认结果并入库':'保存新版本并采用';
box.innerHTML='<form class="v81-editor"><div class="v81-editor-head"><div><h2>'+e(c.t)+' · '+e(r[0])+'</h2><p>'+(pending?'先确认参数，再启动 AI 生成；完成后人工确认并入库。':'当前结果已载入，可重新生成候选或保存新版本。')+'</p></div><button type="button" class="btn" data-close>关闭</button></div>'+generationStepMarkup()+'<div class="v814-loop-status" data-v814-status></div>'+body+'<div class="v81-savebar">'+(pending?'<button type="button" class="btn" data-v81-draft>保存草稿</button>':'<button type="button" class="btn" data-close>取消</button>')+'<div><button type="button" class="btn primary" data-v814-start>开始 AI 生成</button> <button type="button" class="btn" data-v81-regenerate>重新生成候选</button> <button type="button" class="btn primary" data-v81-save>'+primaryLabel+'</button></div></div></form>';
document.body.appendChild(box);
bindGenerationEditorFlow(box,pending);
}'''
source = source[:tail_start] + new_tail + source[tail_end:]

css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-generation-state-style'))return;
const style=document.createElement('style');
style.id='v814-generation-state-style';
style.textContent=`
.v814-loop-steps span{transition:border-color .16s ease,background-color .16s ease,color .16s ease,opacity .16s ease}
.v814-loop-steps span.done{border-color:#47658f;color:#9fb5cf;background:#162a42}
.v814-loop-steps span.current{border-color:#708eff;color:#fff;background:#2c4172;box-shadow:0 0 0 2px rgba(91,124,255,.12)}
.v814-loop-steps span.waiting{border-color:var(--line);color:var(--muted);background:var(--panel);opacity:.72}
.v814-loop-status{display:flex;align-items:center;min-height:42px;padding:10px 22px;border-bottom:1px solid var(--line);background:rgba(20,38,61,.58);color:var(--soft);font-size:10px}
.v814-loop-status b{font-weight:650}
.v814-spinner{width:14px;height:14px;margin-right:9px;border:2px solid rgba(111,141,255,.25);border-top-color:#6f8dff;border-radius:50%;animation:v814spin .72s linear infinite}
.v81-editor[data-step="2"] .v81-editor-grid,.v81-editor[data-step="4"] .v81-editor-grid{opacity:.62;pointer-events:none}
.v81-editor [hidden]{display:none!important}
@keyframes v814spin{to{transform:rotate(360deg)}}
`;
document.head.appendChild(style);
})();
'''
source += css
path.write_text(source, encoding='utf-8')
