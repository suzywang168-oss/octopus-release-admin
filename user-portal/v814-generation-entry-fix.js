(()=>{
'use strict';
const AI_ROUTES=new Set(['production.languages','release.titles','release.covers']);
function attach(frame){
  let connected=null;
  const connect=()=>{
    try{
      const doc=frame.contentDocument,win=frame.contentWindow;
      if(!doc?.body||!win||connected===win)return;
      connected=win;
      win.addEventListener('click',event=>{
        const target=event.target&&typeof event.target.closest==='function'?event.target:null;
        if(!target)return;
        const route=win.location.hash.replace(/^#\/?/,'').replaceAll('/','.')||doc.querySelector('[data-v80].active')?.dataset.v80||'';
        if(!AI_ROUTES.has(route))return;
        const config=target.closest('[data-v88-action="config"]');
        const create=target.closest('[data-v80-create]');
        if(!config&&!create)return;
        const row=config?.closest('tr');
        const generate=row?.querySelector('[data-v88-action="generate"]')||doc.querySelector('[data-v88-action="generate"]');
        if(!generate)return;
        event.preventDefault();
        event.stopImmediatePropagation();
        generate.click();
      },true);
    }catch(error){console.warn('V8.14 generation entry repair skipped',error)}
  };
  frame.addEventListener('load',()=>setTimeout(connect,100));
  setInterval(connect,700);
}
const frame=document.getElementById('portal');
if(frame)attach(frame);
else new MutationObserver((_,observer)=>{const next=document.getElementById('portal');if(next){observer.disconnect();attach(next)}}).observe(document.documentElement,{subtree:true,childList:true});
})();
