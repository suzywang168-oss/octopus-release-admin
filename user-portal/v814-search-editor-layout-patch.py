from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

# Replace the generic record editor with a stable, label-above-control form.
start = source.index('function recordEditor(row,index){')
end = source.index('\nfunction archiveRecord(', start)
record_editor = r'''function recordEditor(row,index){
  let c=P[active];
  if(!c||!row){toast('未找到可编辑记录');return}
  let box=document.createElement('div');
  box.className='v80-modal';
  box.dataset.v814Action='recordEdit';
  const isLongLabel=label=>/建议|说明|备注|原因|目标|材料|描述|反馈|策略|范围/.test(label);
  const isStatusLabel=label=>/状态/.test(label);
  let fields=c.h.map((label,i)=>{
    const value=row[i]??'';
    const full=i===0||isLongLabel(label);
    let control='';
    if(isStatusLabel(label)){
      const options=[value,'待处理','处理中','已完成','已采纳','已归档'].filter((item,pos,list)=>item&&list.indexOf(item)===pos);
      control='<select data-v814-field="'+i+'">'+options.map(item=>'<option '+(item===value?'selected':'')+'>'+e(item)+'</option>').join('')+'</select>';
    }else if(isLongLabel(label)){
      control='<textarea data-v814-field="'+i+'" rows="3">'+e(value)+'</textarea>';
    }else{
      control='<input type="text" data-v814-field="'+i+'" value="'+e(value)+'">';
    }
    return '<label class="v814-record-field '+(full?'full':'')+'"><span>'+e(label)+'</span>'+control+'</label>';
  }).join('');
  box.innerHTML='<form class="v814-action-dialog v814-record-editor"><div class="v81-editor-head"><div><h2>编辑 · '+e(row[0])+'</h2><p>'+e(c.t)+' · 修改字段后保存，列表会立即同步更新。</p></div><button type="button" class="btn" data-close>关闭</button></div><div class="v814-action-body"><div class="v814-record-grid">'+fields+'</div><label class="v814-record-field full v814-change-note"><span>修改说明</span><textarea data-v814-reason rows="3" placeholder="说明本次修改原因和影响范围"></textarea></label></div><div class="v81-savebar"><button type="button" class="btn" data-close>取消</button><div><button type="button" class="btn primary" data-v814-save-record>保存修改</button></div></div></form>';
  document.body.appendChild(box);
  box.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>box.remove());
  box.querySelector('[data-v814-save-record]').onclick=()=>{
    box.querySelectorAll('[data-v814-field]').forEach(input=>{
      const fieldIndex=Number(input.dataset.v814Field);
      row[fieldIndex]=input.value.trim()||'—';
    });
    box.remove();render();toast('记录已更新');
  };
  box.querySelector('[data-v814-field="0"]')?.focus();
}'''
source = source[:start] + record_editor + source[end:]

# Turn the top global search into a real current-list search, while retaining module navigation on Enter.
old_input = "document.addEventListener('input',q=>{if(active&&q.target.matches('[data-v80-search]'))document.querySelectorAll('#pageRoot tbody tr').forEach(tr=>tr.style.display=tr.innerText.toLowerCase().includes(q.target.value.toLowerCase())?'':'none')},true);"
new_input = r'''let v814SearchTimer=0;
function v814SearchRows(term,rerender=true){
  term=String(term||'').trim().toLowerCase();
  const data=AI_EDIT.has(active)?genRows():(P[active]?.r||[]);
  const matches=term?data.map((row,index)=>({row,index})).filter(item=>item.row.join(' ').toLowerCase().includes(term)):data.map((row,index)=>({row,index}));
  if(term&&matches.length&&rerender){
    pageState[pageKey()]=Math.floor(matches[0].index/PAGE_SIZE)+1;
    render();
  }
  requestAnimationFrame(()=>{
    document.querySelectorAll('#pageRoot tbody tr').forEach(tr=>{
      if(!term){tr.style.display='';return}
      tr.style.display=tr.innerText.toLowerCase().includes(term)?'':'none';
    });
    let status=document.getElementById('v814SearchStatus');
    const input=document.getElementById('globalSearch');
    if(input&&!status){status=document.createElement('span');status.id='v814SearchStatus';status.setAttribute('aria-live','polite');input.insertAdjacentElement('afterend',status)}
    if(status)status.textContent=term?(matches.length?'找到 '+matches.length+' 条':'未找到记录'):'';
  });
  return matches;
}
document.addEventListener('input',q=>{
  if(!active)return;
  if(q.target.matches('[data-v80-search]')){
    document.querySelectorAll('#pageRoot tbody tr').forEach(tr=>tr.style.display=tr.innerText.toLowerCase().includes(q.target.value.toLowerCase())?'':'none');
    return;
  }
  if(q.target.id==='globalSearch'){
    clearTimeout(v814SearchTimer);
    v814SearchTimer=setTimeout(()=>v814SearchRows(q.target.value,true),120);
  }
},true);'''
if source.count(old_input) != 1:
    raise SystemExit('V8.14 search input signature changed')
source = source.replace(old_input, new_input, 1)

old_keydown = "document.addEventListener('keydown',q=>{if(q.key!=='Enter'||q.target.id!=='globalSearch')return;let term=q.target.value.trim().toLowerCase(),hit=Object.entries(P).find(([r,c])=>(r+c.g+c.t+c.d).toLowerCase().includes(term));if(hit){q.preventDefault();q.stopImmediatePropagation();activateModule(hit[0]);render();toast('已打开“'+hit[1].t+'”')}else if(active){q.preventDefault();q.stopImmediatePropagation();toast('新版模块中未找到“'+q.target.value.trim()+'”')}},true);"
new_keydown = r'''document.addEventListener('keydown',q=>{
  if(q.key!=='Enter'||q.target.id!=='globalSearch')return;
  q.preventDefault();q.stopImmediatePropagation();
  const raw=q.target.value.trim(),term=raw.toLowerCase();
  if(!term){v814SearchRows('',false);return}
  const matches=v814SearchRows(term,true);
  if(matches.length){toast('当前列表找到 '+matches.length+' 条记录');return}
  const hit=Object.entries(P).find(([route,c])=>(route+c.g+c.t+c.d).toLowerCase().includes(term));
  if(hit){activateModule(hit[0]);render();q.target.value='';v814SearchRows('',false);toast('已打开“'+hit[1].t+'”')}
  else toast('未找到“'+raw+'”');
},true);'''
if source.count(old_keydown) != 1:
    raise SystemExit('V8.14 global-search keydown signature changed')
source = source.replace(old_keydown, new_keydown, 1)

css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-search-editor-layout-style'))return;
const style=document.createElement('style');
style.id='v814-search-editor-layout-style';
style.textContent=`
#v814SearchStatus{display:inline-flex;align-items:center;margin-left:7px;color:var(--muted);font-size:9px;white-space:nowrap}
.v814-record-editor{width:min(880px,calc(100vw - 32px))!important;max-height:calc(100vh - 48px)!important;overflow:auto!important;padding:0!important}
.v814-record-editor .v814-action-body{padding:20px 22px!important}
.v814-record-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px 16px!important;margin:0!important}
.v814-record-field{display:grid!important;grid-template-columns:minmax(0,1fr)!important;align-content:start!important;gap:7px!important;min-width:0!important;margin:0!important}
.v814-record-field.full{grid-column:1/-1!important}
.v814-record-field>span{display:block!important;margin:0!important;color:var(--soft)!important;font-size:10px!important;font-weight:700!important;line-height:1.35!important}
.v814-record-field input,.v814-record-field select,.v814-record-field textarea{display:block!important;width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:0!important;padding:10px 11px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--panel2)!important;color:var(--text)!important;font:inherit!important;line-height:1.45!important}
.v814-record-field input,.v814-record-field select{height:38px!important}
.v814-record-field textarea{min-height:82px!important;resize:vertical!important}
.v814-change-note{margin-top:16px!important;padding-top:16px!important;border-top:1px solid var(--line)!important}
.v814-record-editor .v81-savebar{position:sticky!important;bottom:0!important}
@media(max-width:700px){.v814-record-grid{grid-template-columns:1fr!important}.v814-record-field.full{grid-column:auto!important}.v814-record-editor .v814-action-body{padding:16px!important}}
`;
document.head.appendChild(style);
})();
'''
source += css
path.write_text(source, encoding='utf-8')
