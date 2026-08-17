(()=>{
'use strict';
const COVER_ROUTE='#/release/covers';
const txt=(el)=>String(el?.textContent||'').trim();
function primary(btn){
 if(!btn)return;
 btn.classList.add('wm-action-primary');
 btn.classList.remove('wm-action-text');
 btn.style.setProperty('height','36px','important');
 btn.style.setProperty('padding','0 12px','important');
 btn.style.setProperty('border','1px solid #426ca6','important');
 btn.style.setProperty('border-radius','8px','important');
 btn.style.setProperty('background','transparent','important');
 btn.style.setProperty('color','var(--text)','important');
 btn.style.setProperty('font-weight','700','important');
 btn.style.setProperty('box-shadow','none','important');
}
function textAction(btn){
 if(!btn)return;
 btn.classList.add('wm-action-text');
 btn.classList.remove('wm-action-primary');
 btn.style.setProperty('height','34px','important');
 btn.style.setProperty('min-height','34px','important');
 btn.style.setProperty('padding','0 3px','important');
 btn.style.setProperty('border','0','important');
 btn.style.setProperty('border-radius','0','important');
 btn.style.setProperty('background','transparent','important');
 btn.style.setProperty('color','var(--text)','important');
 btn.style.setProperty('font-weight','600','important');
 btn.style.setProperty('box-shadow','none','important');
}
function modalSecondary(btn){
 if(!btn)return;
 btn.style.setProperty('height','36px','important');
 btn.style.setProperty('padding','0 12px','important');
 btn.style.setProperty('border','1px solid var(--line)','important');
 btn.style.setProperty('border-radius','8px','important');
 btn.style.setProperty('background','var(--panel2)','important');
 btn.style.setProperty('color','var(--text)','important');
 btn.style.setProperty('font-weight','700','important');
}
function ensureCover(container,id,modal=false){
 if(!container)return null;
 let btn=container.querySelector('[data-wm7-cover]');
 if(!btn){
  btn=document.createElement('button');
  btn.type='button';
  btn.className='wm4-btn';
  btn.dataset.wm7Cover=id||'';
  btn.textContent='进入 AI 封面';
  if(modal){
   const title=container.querySelector('[data-wm7-title]');
   if(title)container.insertBefore(btn,title);else container.appendChild(btn);
  }else container.appendChild(btn);
 }
 return btn;
}
function styleRows(){
 document.querySelectorAll('.wm4-row-actions').forEach(actions=>{
  actions.style.setProperty('display','flex','important');
  actions.style.setProperty('align-items','center','important');
  actions.style.setProperty('gap','14px','important');
  actions.style.setProperty('white-space','nowrap','important');
  const preview=actions.querySelector('[data-wm7-preview]');
  const manage=actions.querySelector('[data-wm7-manage]');
  const result=actions.querySelector('[data-wm7-result]');
  const title=actions.querySelector('[data-wm7-title]');
  if(preview){primary(preview);textAction(manage)}
  if(result){
   primary(result);
   textAction(title);
   const cover=ensureCover(actions,title?.dataset.wm7Title||result?.dataset.wm7Result||'',false);
   textAction(cover);
  }
 });
}
function styleModal(){
 document.querySelectorAll('.wm7-modal .wm7-foot').forEach(foot=>{
  const title=foot.querySelector('[data-wm7-title]');
  if(!title)return;
  const cover=ensureCover(foot,title.dataset.wm7Title||'',true);
  modalSecondary(cover);
  const close=foot.querySelector('[data-wm7-close]');
  modalSecondary(close);
  title.style.setProperty('height','36px','important');
  title.style.setProperty('padding','0 14px','important');
  title.style.setProperty('border','1px solid #6683df','important');
  title.style.setProperty('border-radius','8px','important');
  title.style.setProperty('background','#6683df','important');
  title.style.setProperty('color','#fff','important');
  title.style.setProperty('font-weight','700','important');
 });
}
function patch(){styleRows();styleModal()}
function go(e){
 const t=e.target instanceof Element?e.target.closest('[data-wm7-cover]'):null;
 if(!t)return;
 e.preventDefault();
 e.stopImmediatePropagation();
 if(location.hash!==COVER_ROUTE)history.pushState(null,'',COVER_ROUTE);
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
 let pending=false;
 new MutationObserver(()=>{
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{pending=false;patch()});
 }).observe(root,{subtree:true,childList:true});
}
patch();
window.OctopusWatermarkActionStyle={patch,version:'2.0-explicit'};
})();
