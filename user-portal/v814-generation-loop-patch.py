from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

# 1) Persist generation state and provide a real pending -> result -> next-module workflow.
marker = "};\nconst G=["
if source.count(marker) != 1:
    raise SystemExit('V8.14 generation data marker changed')
helpers = r''' };
const GEN_LOOP_STORE='octopus-v814-generation-loop-v2';
function persistGenerationLoop(){
  try{localStorage.setItem(GEN_LOOP_STORE,JSON.stringify(GEN_DATA))}catch{}
}
function hydrateGenerationLoop(){
  try{
    const saved=JSON.parse(localStorage.getItem(GEN_LOOP_STORE)||'null');
    if(!saved)return;
    Object.keys(GEN_DATA).forEach(route=>{
      ['pending','results'].forEach(list=>{
        if(Array.isArray(saved?.[route]?.[list]))GEN_DATA[route][list]=saved[route][list];
      });
    });
  }catch{}
}
function generationResultRow(route,row){
  const x=[...row],name=String(row?.[0]||'未命名内容').split('·')[0].trim();
  if(route==='production.languages'){
    x[2]='100%';x[3]='100%';x[4]='99.1%';x[5]='已完成';x[6]='待人工确认';x[7]='刚刚完成';
  }else if(route==='release.titles'){
    x[1]=name+'：她发现了不该存在的证据';
    x[2]='所有人都忘了那场雨，除了她';
    x[3]='最后一次通话揭开了真正的凶手';
    x[4]=[x[1],x[2],x[3]].map(v=>String(v).length).join('/');
    x[5]='95%';x[6]='待选择';x[7]='AI Workflow';
  }else if(route==='release.covers'){
    x[2]='3 张';x[4]='94';x[5]='待人工确认';x[6]='待选择';x[7]='刚刚生成';
  }
  return x;
}
function collectGenerationEditor(box,route,base){
  const x=generationResultRow(route,base);
  if(route==='production.languages'){
    const selects=box.querySelectorAll('select'),inputs=box.querySelectorAll('input[type="text"]');
    if(selects[0]?.value)x[1]=selects[0].value;
    if(inputs[0]?.value)x[0]=inputs[0].value;
    x[2]='100%';x[3]='100%';x[4]='99.2%';x[5]='已完成';x[6]='通过';x[7]='已交付';
  }else if(route==='release.titles'){
    const candidates=[...box.querySelectorAll('.v81-option input[type="text"]')];
    candidates.slice(0,3).forEach((input,i)=>{if(input.value.trim())x[i+1]=input.value.trim()});
    x[4]=[x[1],x[2],x[3]].map(v=>String(v).length).join('/');
    x[5]='96%';
    const radios=[...box.querySelectorAll('.v81-option input[type="radio"]')];
    const selected=Math.max(0,radios.findIndex(input=>input.checked));
    x[6]=String.fromCharCode(65+selected)+' 已采用';x[7]='Suzy Wang';
  }else if(route==='release.covers'){
    const radios=[...box.querySelectorAll('.v81-cover input[type="radio"]')];
    const selected=Math.max(0,radios.findIndex(input=>input.checked));
    const textInputs=[...box.querySelectorAll('.v81-panel input[type="text"]')];
    const textareas=[...box.querySelectorAll('.v81-panel textarea')];
    if(textInputs[0]?.value)x[3]=textInputs[0].value;
    if(textareas[0]?.value)x[5]=textareas[0].value.slice(0,28);
    x[2]='3 张';x[4]='96';x[6]='封面 '+String.fromCharCode(65+selected);x[7]='刚刚保存';
  }
  return x;
}
function switchGenerationList(route,list){
  generationList=list;
  if(typeof generationListByModule!=='undefined')generationListByModule[route]=list;
  if(typeof pageState!=='undefined')pageState[route+'|'+list]=1;
}
function commitGenerationEditor(box,kind='save',message=''){
  const route=box.dataset.generationRoute||active,list=box.dataset.list||generationList,index=Number(box.dataset.index),bucket=GEN_DATA[route]?.[list],base=bucket?.[index];
  if(!base){toast('生成记录已变化，请刷新后重试');box.remove();return}
  if(kind==='draft'){
    if(route==='production.languages'){base[6]='草稿';base[7]='待提交'}
    else if(route==='release.titles'){base[6]='草稿';base[7]='Suzy Wang'}
    else if(route==='release.covers'){base[6]='草稿';base[7]='刚刚保存'}
    persistGenerationLoop();box.remove();render();toast(message||'草稿已保存');return;
  }
  const result=collectGenerationEditor(box,route,base);
  if(list==='pending'){
    GEN_DATA[route].pending.splice(index,1);
    GEN_DATA[route].results.unshift(result);
    switchGenerationList(route,'results');
    message=message||'生成完成，结果已入库';
  }else{
    GEN_DATA[route].results[index]=result;
    switchGenerationList(route,'results');
    message=message||'新版本已保存并采用';
  }
  persistGenerationLoop();box.remove();render();toast(message);
}
function regenerateGenerationEditor(box){
  const route=box.dataset.generationRoute||active;
  if(route==='release.titles'){
    const titleInputs=[...box.querySelectorAll('.v81-option input[type="text"]')];
    const seed=String(Date.now()).slice(-2);
    const values=['她回到旧城，所有人却都在等她 '+seed,'第十二份档案藏着被删除的名字 '+seed,'那通来自明天的电话再次响起 '+seed];
    titleInputs.forEach((input,i)=>{input.value=values[i];const small=input.parentElement?.querySelector('small');if(small)small.textContent=values[i].length+' / 100'});
    toast('已生成一组新的标题候选');
  }else if(route==='release.covers'){
    box.querySelectorAll('.v81-cover span').forEach((span,i)=>span.innerHTML='方案 '+String.fromCharCode(65+i)+'<br>新构图候选 '+(i+1));
    toast('已生成一组新的封面候选');
  }else{
    toast('译配参数已重新计算，字幕与音色候选已更新');
  }
}
function addUniqueGenerationPending(route,row){
  const key=String(row[0]).split('·')[0].trim();
  const exists=['pending','results'].some(list=>GEN_DATA[route][list].some(item=>String(item[0]).split('·')[0].trim()===key));
  if(!exists)GEN_DATA[route].pending.unshift(row);
}
function nextGenerationStep(row){
  const route=active,name=String(row[0]).split('·')[0].trim();
  if(route==='production.languages'){
    addUniqueGenerationPending('release.titles',[name+' · StoryOrbit','—','—','—','—','待生成','未生成','—']);
    persistGenerationLoop();
    if(typeof activateModule==='function')activateModule('release.titles');else active='release.titles';
    switchGenerationList('release.titles','pending');render();toast('已进入标题生成，内容已加入未生成列表');
  }else if(route==='release.titles'){
    addUniqueGenerationPending('release.covers',[String(row[0]),'关键冲突','待生成','冷蓝悬疑','—','—','未生成','—']);
    persistGenerationLoop();
    if(typeof activateModule==='function')activateModule('release.covers');else active='release.covers';
    switchGenerationList('release.covers','pending');render();toast('已进入封面生成，标题结果已同步');
  }else if(route==='release.covers'){
    const publish=P['release.publish'].r;
    if(!publish.some(item=>String(item[0]).split('·')[0].trim()===name))publish.unshift([String(row[0]),'StoryOrbit','YouTube','SO-VERT-01','标题 / 封面已锁定','API 直传','待提交','待排期']);
    if(typeof activateModule==='function')activateModule('release.publish');else active='release.publish';
    render();toast('已生成发布任务，可继续检查并提交频道');
  }
}
hydrateGenerationLoop();
const G=['''
source = source.replace(marker, helpers, 1)

# 2) Replace result actions with a clear next-step action in every generation module.
old_actions = """const GEN_ACTIONS={
'production.languages':{pending:[['generate','开始译配'],['config','译配配置']],results:[['edit','重新编辑'],['listen','试听'],['download','下载']]},
'release.titles':{pending:[['generate','生成标题']],results:[['edit','重新编辑'],['copy','复制标题'],['detail','详情']]},
'release.covers':{pending:[['generate','生成封面']],results:[['edit','重新编辑'],['preview','预览'],['download','下载']]}
};"""
new_actions = """const GEN_ACTIONS={
'production.languages':{pending:[['generate','开始译配'],['config','译配配置']],results:[['edit','重新编辑'],['listen','试听'],['download','下载'],['next','进入标题生成']]},
'release.titles':{pending:[['generate','生成标题']],results:[['edit','重新编辑'],['copy','复制标题'],['detail','详情'],['next','进入封面生成']]},
'release.covers':{pending:[['generate','生成封面']],results:[['edit','重新编辑'],['preview','预览'],['download','下载'],['next','提交发布']]}
};"""
if source.count(old_actions) != 1:
    raise SystemExit('V8.14 generation action map changed before loop patch')
source = source.replace(old_actions, new_actions, 1)

# 3) Open pending records with generated candidates and remember the source list.
old_editor_start = "function editor(i,mode='edit'){let c=P[active],r=genRows()[i];if(!c||!r){toast('未找到可编辑记录，请刷新列表后重试');return}let box=document.createElement('div');box.className='v80-modal';box.dataset.index=i;let body='';"
new_editor_start = "function editor(i,mode='edit'){let c=P[active],sourceRow=genRows()[i];if(!c||!sourceRow){toast('未找到可编辑记录，请刷新列表后重试');return}let sourceList=generationList,r=sourceList==='pending'?generationResultRow(active,sourceRow):[...sourceRow],box=document.createElement('div');box.className='v80-modal';box.dataset.index=i;box.dataset.generationRoute=active;box.dataset.list=sourceList;box.dataset.mode=mode;let body='';"
if source.count(old_editor_start) != 1:
    raise SystemExit('V8.14 generation editor entry changed')
source = source.replace(old_editor_start, new_editor_start, 1)

# 4) Replace editor save controls with draft, regenerate, confirm-generation and save-version behavior.
editor_pos = source.index("function editor(i,mode='edit')")
tail_start = source.index("box.innerHTML='<form class=\"v81-editor\">", editor_pos)
tail_end = source.index("\nfunction bulkGenerate", tail_start)
new_tail = r'''let pending=box.dataset.list==='pending',primaryLabel=pending?'确认生成并入库':'保存新版本并采用';
box.innerHTML='<form class="v81-editor"><div class="v81-editor-head"><div><h2>'+e(c.t)+' · '+e(r[0])+'</h2><p>'+(pending?'完成参数配置后生成，结果将自动进入“已生成结果”。':'编辑当前结果并保存新版本，随后可进入下一环节。')+'</p></div><button type="button" class="btn" data-close>关闭</button></div><div class="v814-loop-steps"><span class="done">1 配置</span><i>›</i><span class="done">2 AI 生成</span><i>›</i><span>3 人工确认</span><i>›</i><span>4 结果入库</span></div>'+body+'<div class="v81-savebar">'+(pending?'<button type="button" class="btn" data-v81-draft>保存草稿</button>':'<button type="button" class="btn" data-close>取消</button>')+'<div><button type="button" class="btn" data-v81-regenerate>重新生成候选</button> <button type="button" class="btn primary" data-v81-save>'+primaryLabel+'</button></div></div></form>';
document.body.appendChild(box);
box.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>box.remove());
box.querySelector('[data-v81-draft]')?.addEventListener('click',()=>commitGenerationEditor(box,'draft','草稿已保存，仍保留在未生成内容库'));
box.querySelector('[data-v81-save]').onclick=()=>commitGenerationEditor(box,'save',pending?'生成完成，结果已进入已生成列表':'新版本已保存并采用');
box.querySelectorAll('[data-v81-regenerate]').forEach(button=>button.onclick=()=>regenerateGenerationEditor(box));
}'''
source = source[:tail_start] + new_tail + source[tail_end:]

# 5) Batch generation must move selected rows into the result library.
bulk_start = source.index('function bulkGenerate(')
bulk_end = source.index('\nfunction actionModal', bulk_start)
new_bulk = r'''function bulkGenerate(editOnly=false){
  const ids=selected();
  if(!ids.length){toast('请先勾选至少一部剧');return}
  if(editOnly){editor(ids[0],'edit');return}
  if(generationList!=='pending'){toast('请在未生成内容库中选择内容');return}
  const route=active,results=[];
  [...ids].sort((a,b)=>b-a).forEach(index=>{
    const row=GEN_DATA[route].pending[index];
    if(!row)return;
    GEN_DATA[route].pending.splice(index,1);
    results.unshift(generationResultRow(route,row));
  });
  GEN_DATA[route].results.unshift(...results);
  persistGenerationLoop();switchGenerationList(route,'results');render();
  toast('已完成 '+results.length+' 项生成任务，结果已入库');
}'''
source = source[:bulk_start] + new_bulk + source[bulk_end:]

# 6) Connect the new next-step actions.
handler_marker = "if(action==='recordArchive'){archiveRecord(row,i);return}if(action==='generate'||action==='edit'||(action==='config'&&AI_EDIT.has(active))){editor(i,action==='edit'?'edit':'generate');return}"
handler_replacement = "if(action==='recordArchive'){archiveRecord(row,i);return}if(action==='generate'||action==='edit'||(action==='config'&&AI_EDIT.has(active))){editor(i,action==='edit'?'edit':'generate');return}if(action==='next'){nextGenerationStep(row);return}"
if source.count(handler_marker) != 1:
    raise SystemExit('V8.14 generation handler changed')
source = source.replace(handler_marker, handler_replacement, 1)

# 7) Explain the closed loop and show useful empty states.
source = source.replace("共 '+allRows.length+' 条已生成结果，可重新编辑并保存新版本", "共 '+allRows.length+' 条结果 · 可编辑、采用并进入下一环节")
empty_marker = "body.innerHTML=rows.map((r,i)=>'<tr data-v80-row=\"'+(offset+i)+'\">'+r.map((v,j)=>'<td>'+(j===0?'<span class=\"title-cell\">'+e(v)+'</span>':/状态|质检|采用/.test(P[active].h[j])?pill(v):e(v))+'</td>').join('')+'<td></td></tr>').join('');let left="
empty_replacement = "body.innerHTML=rows.map((r,i)=>'<tr data-v80-row=\"'+(offset+i)+'\">'+r.map((v,j)=>'<td>'+(j===0?'<span class=\"title-cell\">'+e(v)+'</span>':/状态|质检|采用/.test(P[active].h[j])?pill(v):e(v))+'</td>').join('')+'<td></td></tr>').join('');if(!rows.length)body.innerHTML='<tr><td colspan=\"10\"><div class=\"v814-empty\">'+(generationList==='pending'?'暂无未生成内容，已完成内容可在“已生成结果”中查看。':'暂无已生成结果，请先从“未生成内容库”发起生成。')+'</div></td></tr>';let left="
if source.count(empty_marker) != 1:
    raise SystemExit('V8.14 generation table render signature changed')
source = source.replace(empty_marker, empty_replacement, 1)

# 8) Editor buttons must not be mistaken for navigation links.
old_click = "document.addEventListener('click',q=>{let list=q.target.closest('[data-v85-list]');"
new_click = "document.addEventListener('click',q=>{if(q.target.closest('.v80-modal'))return;let list=q.target.closest('[data-v85-list]');"
if source.count(old_click) != 1:
    raise SystemExit('V8.14 primary click router changed')
source = source.replace(old_click, new_click, 1)

loop_css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-generation-loop-style'))return;
const style=document.createElement('style');
style.id='v814-generation-loop-style';
style.textContent=`
.v814-loop-steps{display:flex;align-items:center;gap:8px;margin:0;padding:11px 22px;border-bottom:1px solid var(--line);background:var(--panel2);color:var(--muted);font-size:9px;white-space:nowrap;overflow-x:auto}
.v814-loop-steps span{display:inline-flex;align-items:center;height:25px;padding:0 9px;border:1px solid var(--line);border-radius:999px;background:var(--panel)}
.v814-loop-steps span.done{border-color:#6683df;color:#dfe7ff;background:#263863}
.v814-loop-steps i{font-style:normal;color:var(--muted)}
.v814-empty{padding:32px 18px;text-align:center;color:var(--muted);font-size:10px}
#pageRoot .v814-generation-head .v814-list-controls{min-width:420px!important}
#pageRoot .v814-generation-head .v85-list-tab b{font-variant-numeric:tabular-nums}
@media(max-width:760px){.v814-loop-steps{padding:10px 16px}.v814-loop-steps span{height:23px;padding:0 8px}#pageRoot .v814-generation-head .v814-list-controls{min-width:0!important}}
`;
document.head.appendChild(style);
})();
'''
source += loop_css

path.write_text(source, encoding='utf-8')