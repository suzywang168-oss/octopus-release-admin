(()=>{
  'use strict';

  const ROOT='#pageRoot';
  const STYLE_ID='octopus-row-editor-layout';
  const DRAWER_ID='octopusRowEditor';
  const STORAGE_KEY='octopus-row-editor-records-v1';
  let activeRow=null;
  let activeAction='';

  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  function route(){
    return location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  }

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){
      style=document.createElement('style');
      style.id=STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent=`
      .workspace{display:none!important}
      #crudMenu,#crudMask,.crud-menu,.crud-mask{display:none!important}

      ${ROOT} .v815table th:last-child,
      ${ROOT} .v815table td:last-child{
        position:sticky!important;
        right:0!important;
        width:214px!important;
        min-width:214px!important;
        max-width:214px!important;
        padding:10px 12px!important;
        border-left:1px solid var(--line)!important
      }
      ${ROOT} .v815table th:last-child{
        z-index:8!important;
        background:var(--panel2)!important;
        text-align:center!important
      }
      ${ROOT} .v815table td:last-child{
        z-index:7!important;
        background:var(--panel)!important;
        overflow:hidden!important
      }
      ${ROOT} .v815acts{
        display:grid!important;
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:8px!important;
        align-items:center!important;
        width:100%!important;
        min-width:0!important;
        white-space:nowrap!important
      }
      ${ROOT} .v815act{
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        width:100%!important;
        min-width:0!important;
        height:30px!important;
        padding:0 8px!important;
        margin:0!important;
        border:1px solid var(--line)!important;
        border-radius:8px!important;
        background:var(--panel2)!important;
        color:var(--text)!important;
        font-size:8px!important;
        font-weight:650!important;
        line-height:1!important;
        white-space:nowrap!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
        pointer-events:auto!important;
        cursor:pointer!important
      }
      ${ROOT} .v815act:first-child{
        border-color:#6683df!important;
        background:color-mix(in srgb,#6683df 13%,var(--panel))!important;
        color:#91a8ff!important
      }
      ${ROOT} .v815act:hover{filter:brightness(1.1)!important}
      ${ROOT} .v815act:active{transform:translateY(1px)!important}

      #${DRAWER_ID}{position:fixed;inset:0;z-index:20000;display:none;place-items:center;padding:24px;box-sizing:border-box}
      #${DRAWER_ID}.open{display:grid}
      #${DRAWER_ID} .ore-backdrop{position:absolute;inset:0;background:rgba(2,8,18,.68);backdrop-filter:blur(4px)}
      #${DRAWER_ID} .ore-panel{
        position:relative;z-index:1;width:min(820px,96vw);height:auto;max-height:90vh;display:flex;flex-direction:column;
        border:1px solid var(--line);border-radius:16px;background:var(--panel);box-shadow:0 32px 100px rgba(0,0,0,.5);
        overflow:hidden;animation:ore-in .18s ease-out
      }
      @keyframes ore-in{from{transform:translateY(12px) scale(.985);opacity:.55}to{transform:none;opacity:1}}
      #${DRAWER_ID} .ore-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:20px 22px;border-bottom:1px solid var(--line)}
      #${DRAWER_ID} .ore-head h2{margin:0;color:var(--text);font-size:17px}
      #${DRAWER_ID} .ore-head p{margin:7px 0 0;color:var(--soft);font-size:9px;line-height:1.55}
      #${DRAWER_ID} .ore-close{width:32px;height:32px;border:1px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--text);cursor:pointer;font-size:17px}
      #${DRAWER_ID} .ore-body{flex:1;overflow:auto;padding:20px 22px}
      #${DRAWER_ID} .ore-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
      #${DRAWER_ID} .ore-field{display:grid;gap:7px;min-width:0}
      #${DRAWER_ID} .ore-field.full{grid-column:1/-1}
      #${DRAWER_ID} .ore-field label{color:var(--soft);font-size:8px;font-weight:650}
      #${DRAWER_ID} input,#${DRAWER_ID} select,#${DRAWER_ID} textarea{
        width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:9px;background:var(--panel2);
        color:var(--text);font:9px/1.5 system-ui;padding:10px 11px;outline:0
      }
      #${DRAWER_ID} input,#${DRAWER_ID} select{height:39px}
      #${DRAWER_ID} textarea{min-height:94px;resize:vertical}
      #${DRAWER_ID} input:focus,#${DRAWER_ID} select:focus,#${DRAWER_ID} textarea:focus{border-color:#6683df;box-shadow:0 0 0 3px color-mix(in srgb,#6683df 15%,transparent)}
      #${DRAWER_ID} .ore-value{min-height:39px;box-sizing:border-box;padding:10px 11px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);font-size:9px;line-height:1.55;overflow-wrap:anywhere}
      #${DRAWER_ID} .ore-note{margin-top:16px;padding:12px;border:1px solid color-mix(in srgb,#6683df 28%,var(--line));border-radius:10px;background:color-mix(in srgb,#6683df 8%,var(--panel));color:var(--soft);font-size:8px;line-height:1.65}
      #${DRAWER_ID} .ore-foot{display:flex;align-items:center;justify-content:flex-end;gap:9px;padding:14px 22px;border-top:1px solid var(--line);background:var(--panel)}
      #${DRAWER_ID} .ore-btn{height:35px;padding:0 15px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);font-size:9px;font-weight:650;cursor:pointer}
      #${DRAWER_ID} .ore-btn.primary{border-color:#6683df;background:#6683df;color:#fff}
      @media(max-width:720px){
        ${ROOT} .v815table th:last-child,${ROOT} .v815table td:last-child{position:static!important}
        #${DRAWER_ID} .ore-grid{grid-template-columns:1fr}
        #${DRAWER_ID} .ore-field.full{grid-column:auto}
      }
    `;
  }

  function removeLegacyActions(){
    document.querySelectorAll('#crudMenu,#crudMask,.crud-menu,.crud-mask').forEach(node=>node.remove());
    document.querySelectorAll(`${ROOT} table tbody tr`).forEach(row=>{
      if(row.closest('.loc-table,.pcw-table,.rvw-table,.gw3-table'))return;
      const cell=row.cells[row.cells.length-1];
      if(!cell)return;
      cell.querySelectorAll('button:not(.v815act),.crud-edit,.crud-remove,.crud-readonly-note,[data-more],[data-crud-edit],[data-crud-remove]').forEach(node=>node.remove());
      [...cell.querySelectorAll('button,span,a')].forEach(node=>{
        const text=node.textContent.trim();
        if(['编辑','归档','副本','复制','更多','Edit','Archive','Duplicate'].includes(text)&&!node.classList.contains('v815act'))node.remove();
      });
      const group=cell.querySelector('.v815acts');
      if(group)[...group.querySelectorAll('.v815act')].slice(2).forEach(button=>button.remove());
    });
  }

  function ensureDrawer(){
    let drawer=document.getElementById(DRAWER_ID);
    if(drawer)return drawer;
    drawer=document.createElement('div');
    drawer.id=DRAWER_ID;
    drawer.innerHTML=`
      <div class="ore-backdrop" data-ore-close></div>
      <aside class="ore-panel" role="dialog" aria-modal="true" aria-labelledby="oreTitle">
        <header class="ore-head"><div><h2 id="oreTitle"></h2><p id="oreSub"></p></div><button class="ore-close" type="button" data-ore-close>×</button></header>
        <main class="ore-body"><div class="ore-grid" id="oreFields"></div><div class="ore-note" id="oreNote"></div></main>
        <footer class="ore-foot"><button class="ore-btn" type="button" data-ore-close>取消</button><button class="ore-btn primary" type="button" data-ore-save>保存修改</button></footer>
      </aside>`;
    document.body.appendChild(drawer);
    return drawer;
  }

  function editableAction(action){
    if(/查看|预览|详情|日志|趋势|排行|诊断|对比/.test(action)&&!/编辑|配置|更新/.test(action))return false;
    return /编辑|配置|更新|加入|采用|补充|维护|管理|通过|重试|调整|设置|生成|校验|检测/.test(action);
  }

  function rowInfo(button){
    const row=button.closest('tr');
    const table=row?.closest('table');
    if(!row||!table)return null;
    const headers=[...table.querySelectorAll('thead th')].slice(0,-1).map(cell=>cell.innerText.trim());
    const cells=[...row.cells].slice(0,-1);
    return {row,headers,cells,values:cells.map(cell=>cell.innerText.trim())};
  }

  function fieldControl(header,value,index,editable){
    const full=/标签|亮点|建议|原因|权限|说明|范围/.test(header)||String(value).length>36;
    const klass=`ore-field${full?' full':''}`;
    if(!editable||index===0)return `<div class="${klass}"><label>${esc(header)}</label><div class="ore-value">${esc(value||'—')}</div></div>`;
    if(/状态|进度|风险|等级/.test(header)){
      return `<div class="${klass}"><label>${esc(header)}</label><select data-ore-field="${index}"><option selected>${esc(value)}</option><option>待处理</option><option>处理中</option><option>已完成</option><option>已通过</option></select></div>`;
    }
    if(full)return `<div class="${klass}"><label>${esc(header)}</label><textarea data-ore-field="${index}">${esc(value)}</textarea></div>`;
    return `<div class="${klass}"><label>${esc(header)}</label><input data-ore-field="${index}" value="${esc(value)}"></div>`;
  }

  function openEditor(button){
    const info=rowInfo(button);
    if(!info)return;
    if(window.OctopusActionPages?.open?.(button,info))return;
    activeRow=info.row;
    activeAction=button.dataset.a||button.innerText.trim()||'记录操作';
    const editable=editableAction(activeAction);
    const drawer=ensureDrawer();
    drawer.querySelector('#oreTitle').textContent=activeAction;
    drawer.querySelector('#oreSub').textContent=`${info.values[0]||'当前记录'} · ${editable?'编辑页面':'详情页面'}`;
    drawer.querySelector('#oreFields').innerHTML=info.headers.map((header,index)=>fieldControl(header,info.values[index],index,editable)).join('')+
      (editable&&/AI标签/.test(activeAction)?'<div class="ore-field full"><label>AI 标签</label><textarea data-ore-tags placeholder="使用逗号分隔标签">'+esc((info.values.find(value=>value.includes('/')||value.includes('·'))||'').replaceAll(' / ',', '))+'</textarea></div>':'');
    drawer.querySelector('#oreNote').textContent=editable
      ?'保存后会立即更新当前列表中的记录，并在本机保留本次原型修改。'
      :'当前为只读详情。需要调整数据时，请返回列表选择编辑或配置操作。';
    const save=drawer.querySelector('[data-ore-save]');
    save.style.display=editable?'inline-flex':'none';
    drawer.classList.add('open');
    setTimeout(()=>drawer.querySelector('input,textarea,select,[data-ore-close]')?.focus(),30);
  }

  function closeEditor(){
    document.getElementById(DRAWER_ID)?.classList.remove('open');
    activeRow=null;
    activeAction='';
  }

  function saveEditor(){
    const drawer=document.getElementById(DRAWER_ID);
    if(!drawer||!activeRow)return;
    drawer.querySelectorAll('[data-ore-field]').forEach(field=>{
      const index=Number(field.dataset.oreField);
      const cell=activeRow.cells[index];
      if(cell)cell.textContent=field.value.trim()||'—';
    });
    const key=`${route()}::${[...activeRow.cells].slice(0,-1).map(cell=>cell.innerText.trim()).join('|')}`;
    let data={};
    try{data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{}
    data[key]={action:activeAction,values:[...activeRow.cells].slice(0,-1).map(cell=>cell.innerText.trim()),updatedAt:new Date().toISOString()};
    localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
    try{if(typeof window.toast==='function')window.toast('修改已保存')}catch{}
    closeEditor();
  }

  function routeTo(value){
    if(!value)return;
    const next='#/'+String(value).replaceAll('.','/');
    if(location.hash===next)window.dispatchEvent(new HashChangeEvent('hashchange'));
    else location.hash=next;
  }

  function handleClick(event){
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;

    if(target.closest(`#${DRAWER_ID} [data-ore-close]`)){
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();closeEditor();return;
    }
    if(target.closest(`#${DRAWER_ID} [data-ore-save]`)){
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();saveEditor();return;
    }

    const action=target.closest(`${ROOT} .v815act[data-a]`);
    if(action){
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      document.getElementById('v815modal')?.classList.remove('open');
      openEditor(action);return;
    }

    const nav=target.closest('[data-r]');
    if(nav&&(nav.closest('#v80nav')||nav.closest(ROOT))){
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();routeTo(nav.dataset.r);
    }
  }

  let pending=false;
  function apply(){
    pending=false;
    installStyle();
    ensureDrawer();
    removeLegacyActions();
    document.querySelectorAll(`${ROOT} .v815act,#v80nav button`).forEach(button=>{
      button.type='button';button.disabled=false;button.removeAttribute('disabled');button.style.pointerEvents='auto';
    });
  }
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(apply);
  }

  window.addEventListener('click',handleClick,true);
  window.addEventListener('keydown',event=>{if(event.key==='Escape')closeEditor()});
  window.addEventListener('hashchange',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,300);setTimeout(schedule,900);setTimeout(schedule,1800);
})();