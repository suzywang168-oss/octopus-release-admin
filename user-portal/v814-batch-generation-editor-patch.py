from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

commit_start = source.index('function commitGenerationEditor(')
commit_end = source.index('\nfunction regenerateGenerationEditor', commit_start)
new_commit = r'''function commitGenerationEditor(box,kind='save',message=''){
  const route=box.dataset.generationRoute||active,list=box.dataset.list||generationList,index=Number(box.dataset.index),bucket=GEN_DATA[route]?.[list],base=bucket?.[index];
  let batchIndexes=[];
  try{batchIndexes=JSON.parse(box.dataset.batchIndexes||'[]')}catch{}
  batchIndexes=[...new Set(batchIndexes.map(Number).filter(value=>Number.isInteger(value)&&value>=0&&bucket?.[value]))];
  if(!base){toast('生成记录已变化，请刷新后重试');box.remove();return}
  const targets=batchIndexes.length?batchIndexes:[index];
  if(kind==='draft'){
    targets.forEach(targetIndex=>{
      const row=bucket?.[targetIndex];if(!row)return;
      if(route==='production.languages'){row[6]='草稿';row[7]='待提交'}
      else if(route==='release.titles'){row[6]='草稿';row[7]='Suzy Wang'}
      else if(route==='release.covers'){row[6]='草稿';row[7]='刚刚保存'}
    });
    persistGenerationLoop();box.remove();render();toast(message||(targets.length>1?'批量草稿已保存':'草稿已保存'));return;
  }
  if(list==='pending'&&batchIndexes.length){
    const results=[];
    [...batchIndexes].sort((a,b)=>b-a).forEach(targetIndex=>{
      const row=GEN_DATA[route].pending[targetIndex];
      if(!row)return;
      results.unshift(collectGenerationEditor(box,route,row));
      GEN_DATA[route].pending.splice(targetIndex,1);
    });
    GEN_DATA[route].results.unshift(...results);
    switchGenerationList(route,'results');
    message=message||'已完成 '+results.length+' 项批量生成，结果已入库';
  }else{
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
  }
  persistGenerationLoop();box.remove();render();toast(message);
}'''
source = source[:commit_start] + new_commit + source[commit_end:]

bulk_start = source.index('function bulkGenerate(')
bulk_end = source.index('\nfunction actionModal', bulk_start)
new_bulk = r'''function bulkGenerate(editOnly=false){
  const ids=selected();
  if(!ids.length){toast('请先勾选至少一部剧');return}
  if(generationList!=='pending'){toast('请在未生成内容库中选择内容');return}
  editor(ids[0],editOnly?'edit':'generate');
  const boxes=[...document.querySelectorAll('.v80-modal[data-generation-route]')],box=boxes.at(-1);
  if(!box){toast('生成编辑页面打开失败，请重试');return}
  box.dataset.batchIndexes=JSON.stringify(ids);
  box.dataset.batchCount=String(ids.length);
  const title=box.querySelector('.v81-editor-head h2');
  const description=box.querySelector('.v81-editor-head p');
  if(title)title.textContent='批量生成 · 已选 '+ids.length+' 项';
  if(description)description.textContent='统一确认本批内容的生成参数，启动 AI 后进入人工确认，确认后才写入已生成结果。';
  if(typeof setGenerationEditorStep==='function')setGenerationEditorStep(box,1,'已选择 '+ids.length+' 项，请确认统一配置后启动 AI 生成。');
}'''
source = source[:bulk_start] + new_bulk + source[bulk_end:]

css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-batch-editor-style'))return;
const style=document.createElement('style');
style.id='v814-batch-editor-style';
style.textContent=`
.v80-modal[data-batch-count] .v81-editor-head h2{display:flex!important;align-items:center!important;gap:8px!important}
.v80-modal[data-batch-count] .v814-loop-status{background:rgba(44,65,114,.34)!important}
`;
document.head.appendChild(style);
})();
'''
source += css
path.write_text(source, encoding='utf-8')
