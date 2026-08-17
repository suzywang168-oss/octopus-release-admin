(()=>{
'use strict';
const ROUTE='system.assets';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const activePromo=()=>route()===ROUTE&&!!document.querySelector('#pageRoot .al3-card [data-al3-tab="promo"].active');
let queued=false;
function ensure(){
  queued=false;
  if(!activePromo())return;
  try{window.OctopusPromoWatermarkReviewBridge?.patch?.()}catch(err){console.warn('[PromoFilterStability]',err)}
}
function schedule(){
  if(queued)return;
  queued=true;
  queueMicrotask(()=>requestAnimationFrame(ensure));
}
function installObserver(){
  const root=document.getElementById('pageRoot');
  if(!root||root.dataset.promoStableObserver==='1')return;
  root.dataset.promoStableObserver='1';
  let Observer=window.MutationObserver;
  try{if(parent&&parent!==window&&parent.MutationObserver)Observer=parent.MutationObserver}catch{}
  const ob=new Observer(()=>schedule());
  ob.observe(root,{childList:true,subtree:true});
  window.__octopusPromoStableObserver=ob;
}
function boot(){installObserver();schedule()}
window.addEventListener('hashchange',()=>{setTimeout(boot,0);setTimeout(schedule,80)},true);
window.addEventListener('octopus-owned-route-change',()=>{setTimeout(boot,0);setTimeout(schedule,80)},true);
window.addEventListener('pageshow',()=>setTimeout(boot,40),true);
document.addEventListener('click',e=>{if(!activePromo()&&!e.target.closest?.('[data-al3-tab="promo"]'))return;setTimeout(schedule,0);setTimeout(schedule,60)},true);
document.addEventListener('change',e=>{if(!activePromo())return;if(e.target.matches?.('[data-promo-kind-filter],[data-al3-search],select')){queueMicrotask(schedule);setTimeout(schedule,20)}},true);
document.addEventListener('input',e=>{if(!activePromo())return;if(e.target.matches?.('[data-promo-visible-search],[data-al3-search]')){queueMicrotask(schedule);setTimeout(schedule,20)}},true);
setInterval(()=>{if(activePromo())schedule()},900);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.OctopusPromoFilterStability={ensure,schedule,version:'1.0'};
})();
