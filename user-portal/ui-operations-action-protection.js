(()=>{
  'use strict';

  const ROUTES=new Set(['operations.channel-analysis','operations.ad-intelligence']);
  const ROOT_ID='pageRoot';
  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';

  function active(){return ROUTES.has(route())}

  function protect(){
    if(!active())return;
    const root=document.getElementById(ROOT_ID);
    if(!root)return;

    root.querySelectorAll('.orw-table').forEach(table=>{
      // ui-interaction-fix-v816 skips tables carrying this compatibility class.
      // ORW owns its action lifecycle and must not be rewritten by the legacy cleaner.
      table.classList.add('gw3-table','orw-owned-actions');
    });

    root.querySelectorAll('.orw-action-table tbody').forEach(tbody=>{
      [...tbody.rows].forEach((row,index)=>{
        const cell=row.cells[row.cells.length-1];
        if(!cell)return;
        let button=cell.querySelector('[data-orw-add]');
        if(!button){
          button=document.createElement('button');
          button.type='button';
          button.className='orw-btn primary';
          button.dataset.orwAdd=String(index);
          button.textContent='加入发行';
          cell.replaceChildren(button);
        }
        button.disabled=false;
        button.removeAttribute('disabled');
        button.style.pointerEvents='auto';
      });
    });
  }

  let scheduled=false;
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(()=>{
      scheduled=false;
      protect();
    });
  }

  window.addEventListener('hashchange',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  schedule();
})();
