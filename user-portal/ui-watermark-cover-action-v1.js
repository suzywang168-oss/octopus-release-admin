(()=>{
'use strict';
const ROUTE='#/release/covers';
function ensureStyle(){
 let s=document.getElementById('wm-cover-action-style');
 if(s)return;
 s=document.createElement('style');
 s.id='wm-cover-action-style';
 s.textContent=`
 .wm4-row-actions{align-items:center;gap:12px!important}
 .wm4-row-actions>.wm4-btn:first-child{height:36px!important;padding:0 12px!important;border:1px solid #426ca6!important;border-radius:8px!important;background:transparent!important;color:var(--text)!important;font-weight:700!important}
 .wm4-row-actions>.wm4-btn:not(:first-child){height:auto!important;min-height:34px!important;padding:0 3px!important;border:0!important;border-radius:0!important;background:transparent!important;color:var(--text)!important;font-weight:600!important;box-shadow:none!important}
 .wm4-row-actions>.wm4-btn:not(:first-child):hover{color:#8aa5ff!important;text-decoration:none!important}
 .wm7-foot [data-wm7-cover]{border-color:var(--line)!important;background:var(--panel2)!important;color:var(--text)!important}
 `;
 document.head.appendChild(s);
}
function addCoverButton(container,id,modal=false){
 if(!container||container.querySelector('[data-wm7-cover]'))return;
 const btn=document.createElement('button');
 btn.className=modal?'wm4-btn':'wm4-btn ghost';
 btn.type='button';
 btn.dataset.wm7Cover=id||'';
 btn.textContent='进入 AI 封面';
 if(modal){
  const titleBtn=container.querySelector('[data-wm7-title]');
  if(titleBtn)container.insertBefore(btn,titleBtn);
  else container.appendChild(btn);
 }else container.appendChild(btn);
}
function patch(){
 ensureStyle();
 document.querySelectorAll('.wm4-row-actions [data-wm7-title]').forEach(titleBtn=>{
  addCoverButton(titleBtn.closest('.wm4-row-actions'),titleBtn.dataset.wm7Title||'',false);
 });
 document.querySelectorAll('.wm7-modal .wm7-foot [data-wm7-title]').forEach(titleBtn=>{
  addCoverButton(titleBtn.closest('.wm7-foot'),titleBtn.dataset.wm7Title||'',true);
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
 let queued=false;
 const mo=new MutationObserver(()=>{
  if(queued)return;
  queued=true;
  queueMicrotask(()=>{queued=false;patch()});
 });
 mo.observe(root,{subtree:true,childList:true});
}
patch();
window.OctopusWatermarkCoverAction={patch,version:'1.1'};
})();
