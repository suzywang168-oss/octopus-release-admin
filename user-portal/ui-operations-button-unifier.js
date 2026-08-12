(()=>{
  'use strict';

  const ROUTES=new Set(['operations.channel-analysis','operations.ad-intelligence']);
  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';

  function unify(){
    if(!ROUTES.has(route()))return;
    document.querySelectorAll('#pageRoot [data-orw-add]').forEach(button=>{
      // Reuse the portal-wide row action button system instead of the ORW primary button style.
      if(button.className!=='v815act orw-unified-action'){
        button.className='v815act orw-unified-action';
      }
      button.type='button';
      button.disabled=false;
      button.removeAttribute('disabled');
      button.style.pointerEvents='auto';
    });
  }

  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      unify();
    });
  }

  window.addEventListener('hashchange',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  schedule();
})();
