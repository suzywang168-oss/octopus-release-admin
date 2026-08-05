(()=>{
  'use strict';

  const STYLE_ID = 'octopus-ui-interaction-fix-v816';
  const ROOT = '#pageRoot';

  function ensureStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      ${ROOT}, ${ROOT} .v815page, ${ROOT} .v815tw, ${ROOT} .v815acts {
        position: relative !important;
      }
      ${ROOT} .v815page { z-index: 2 !important; }

      ${ROOT} button,
      #v80nav button,
      #v815modal button {
        pointer-events: auto !important;
        cursor: pointer !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }

      ${ROOT} .v815head {
        align-items: flex-start !important;
      }
      ${ROOT} .v815head > div:first-child {
        min-width: 0 !important;
        flex: 1 1 auto !important;
      }
      ${ROOT} .v815primary {
        position: relative !important;
        z-index: 5 !important;
        flex: 0 0 auto !important;
        min-width: 118px !important;
        height: 34px !important;
        padding: 0 14px !important;
      }

      ${ROOT} .v815toolbar {
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
      }
      ${ROOT} .v815toolbar input {
        flex: 1 1 300px !important;
        min-width: 220px !important;
      }
      ${ROOT} .v815toolbar select {
        flex: 0 0 150px !important;
        width: 150px !important;
      }
      ${ROOT} .v815toolbar [data-export] {
        flex: 0 0 auto !important;
        margin-left: auto !important;
      }

      ${ROOT} .v815table th:last-child,
      ${ROOT} .v815table td:last-child {
        position: sticky !important;
        right: 0 !important;
        width: 258px !important;
        min-width: 258px !important;
        max-width: 258px !important;
        border-left: 1px solid var(--line) !important;
      }
      ${ROOT} .v815table th:last-child {
        z-index: 7 !important;
        background: var(--panel2) !important;
        text-align: center !important;
      }
      ${ROOT} .v815table td:last-child {
        z-index: 4 !important;
        background: var(--panel) !important;
      }

      ${ROOT} .v815acts {
        z-index: 6 !important;
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        align-items: center !important;
        justify-content: stretch !important;
        gap: 6px !important;
        width: 100% !important;
        min-width: 0 !important;
      }
      ${ROOT} .v815act {
        position: relative !important;
        z-index: 8 !important;
        width: 100% !important;
        min-width: 0 !important;
        height: 29px !important;
        padding: 0 7px !important;
        margin: 0 !important;
        border: 1px solid var(--line) !important;
        border-radius: 7px !important;
        background: var(--panel2) !important;
        color: var(--text) !important;
        font-size: 8px !important;
        font-weight: 600 !important;
        line-height: 1 !important;
        text-align: center !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      ${ROOT} .v815act:first-child {
        border-color: #6683df !important;
        background: color-mix(in srgb, #6683df 16%, var(--panel)) !important;
        color: #91a8ff !important;
      }
      ${ROOT} .v815act:hover,
      ${ROOT} .v815ghost:hover,
      ${ROOT} .v815primary:hover,
      #v80nav button:hover {
        filter: brightness(1.08) !important;
      }
      ${ROOT} .v815act:active,
      ${ROOT} .v815ghost:active,
      ${ROOT} .v815primary:active,
      #v80nav button:active {
        transform: translateY(1px) !important;
      }
      ${ROOT} button:focus-visible,
      #v80nav button:focus-visible,
      #v815modal button:focus-visible {
        outline: 2px solid #7d98ef !important;
        outline-offset: 2px !important;
      }

      ${ROOT} .v815flowgrid,
      ${ROOT} .v815mods {
        position: relative !important;
        z-index: 3 !important;
      }
      ${ROOT} .v815step,
      ${ROOT} .v815mod,
      #v80nav [data-r] {
        position: relative !important;
        z-index: 4 !important;
      }

      @media (max-width: 900px) {
        ${ROOT} .v815toolbar input,
        ${ROOT} .v815toolbar select {
          flex: 1 1 100% !important;
          width: 100% !important;
        }
        ${ROOT} .v815toolbar [data-export] {
          margin-left: 0 !important;
        }
        ${ROOT} .v815table th:last-child,
        ${ROOT} .v815table td:last-child {
          position: static !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function toastMessage(message){
    try{
      if(typeof window.toast==='function') window.toast(message);
    }catch{}
  }

  function openModal(title,detail){
    const modal=document.getElementById('v815modal');
    if(!modal) return;
    const heading=modal.querySelector('h3');
    const body=modal.querySelector('.v815mb');
    if(heading) heading.textContent=title || '操作';
    if(body){
      const note=document.documentElement.lang?.toLowerCase().startsWith('en')
        ? 'Interactive prototype. Confirm to submit this action.'
        : '当前为可交互原型，确认后将提交该操作。';
      body.textContent=`${detail || ''}\n\n${note}`;
      body.style.whiteSpace='pre-wrap';
    }
    modal.classList.add('open');
  }

  function closeModal(){
    document.getElementById('v815modal')?.classList.remove('open');
  }

  function routeTo(value){
    if(!value) return;
    const next='#/'+String(value).replaceAll('.','/');
    if(location.hash===next){
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }else{
      location.hash=next;
    }
  }

  function exportVisibleTable(){
    const table=document.querySelector(`${ROOT} .v815table`);
    if(!table){
      openModal('导出当前列表','当前页面暂无可导出的列表。');
      return;
    }
    const headers=Array.from(table.querySelectorAll('thead th')).slice(0,-1).map(cell=>cell.innerText.trim());
    const rows=Array.from(table.querySelectorAll('tbody tr'))
      .filter(row=>getComputedStyle(row).display!=='none')
      .map(row=>Array.from(row.cells).slice(0,-1).map(cell=>cell.innerText.trim()));
    const csv='\ufeff'+[headers,...rows].map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',')).join('\n');
    const link=document.createElement('a');
    const blobUrl=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    link.href=blobUrl;
    link.download=(location.hash.replace(/^#\/?/,'').replaceAll('/','-')||'octopus-list')+'.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(blobUrl),500);
    toastMessage('当前列表已导出');
  }

  function rowDetail(button){
    const row=button.closest('tr');
    return row ? row.innerText.replace(/\s+/g,' ').trim().slice(0,220) : document.querySelector(`${ROOT} .v815head p`)?.innerText || '';
  }

  function handleClick(event){
    const target=event.target instanceof Element ? event.target : null;
    if(!target) return;

    let button=target.closest('[data-r]');
    if(button && (button.closest('#v80nav') || button.closest(ROOT))){
      event.preventDefault();
      event.stopImmediatePropagation();
      routeTo(button.dataset.r);
      return;
    }

    button=target.closest(`${ROOT} [data-primary]`);
    if(button){
      event.preventDefault();
      event.stopImmediatePropagation();
      openModal(button.innerText.trim(),document.querySelector(`${ROOT} .v815head p`)?.innerText.trim());
      return;
    }

    button=target.closest(`${ROOT} [data-a]`);
    if(button){
      event.preventDefault();
      event.stopImmediatePropagation();
      openModal(button.dataset.a || button.innerText.trim(),rowDetail(button));
      return;
    }

    button=target.closest(`${ROOT} [data-export]`);
    if(button){
      event.preventDefault();
      event.stopImmediatePropagation();
      exportVisibleTable();
      return;
    }

    if(target.closest('#v815modal [data-close]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      closeModal();
      return;
    }

    if(target.closest('#v815modal [data-confirm]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      closeModal();
      toastMessage('操作已提交');
    }
  }

  function harden(){
    ensureStyle();
    document.querySelectorAll(`${ROOT} button, #v80nav button, #v815modal button`).forEach(button=>{
      button.type='button';
      button.disabled=false;
      button.removeAttribute('disabled');
      button.style.pointerEvents='auto';
    });
  }

  let pending=false;
  function schedule(){
    if(pending) return;
    pending=true;
    requestAnimationFrame(()=>{
      pending=false;
      harden();
    });
  }

  window.addEventListener('click',handleClick,true);
  window.addEventListener('hashchange',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','disabled']});

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  setTimeout(schedule,400);
  setTimeout(schedule,1200);
})();