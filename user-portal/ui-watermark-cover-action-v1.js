(()=>{
'use strict';
const ROUTE='#/release/covers';
function patch(){
 document.querySelectorAll('[data-wm7-title]').forEach(titleBtn=>{
  const actions=titleBtn.closest('.wm4-row-actions');
  if(!actions||actions.querySelector('[data-wm7-cover]'))return;
  const btn=document.createElement('button');
  btn.className='wm4-btn ghost';
  btn.type='button';
  btn.dataset.wm7Cover=titleBtn.dataset.wm7Title||'';
  btn.textContent='进入 AI 封面';
  actions.appendChild(btn);
 });
}
function go(e){
 const t=e.target instanceof Element?e.target.closest('[data-wm7-cover]'):null;
 if(!t)return;
 e.preventDefault();
 e.stopImmediatePropagation();
 if(location.hash!==ROUTE)history.pushState(null,'',ROUTE);
}
window.addEventListener('pointerdown',go,true);
window.addEventListener('click',e=>{
 const t=e.target instanceof Element?e.target.closest('[data-wm7-cover]'):null;
 if(!t)return;
 e.preventDefault();
 e.stopImmediatePropagation();
},true);
const root=document.getElementById('pageRoot');
if(root){
 const mo=new MutationObserver(()=>queueMicrotask(patch));
 mo.observe(root,{subtree:true,childList:true});
}
patch();
window.OctopusWatermarkCoverAction={patch,version:'1.0'};
})();
