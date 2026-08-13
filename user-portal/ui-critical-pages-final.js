(()=>{
'use strict';
const ROOT='pageRoot',STYLE_ID='octopus-runtime-integrity-guard-v3';
const INTERVAL=1800,GRACE=520,COOLDOWN=1100;
let routeChangedAt=Date.now(),lastRecovery=0,lastRoute='';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function css(){let s=document.getElementById(STYLE_ID);if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}s.textContent=`
#${ROOT} :is(.rvw-btn,.dpw-btn,.daw-btn,.atw-btn,.prw-btn,.abs-btn){visibility:visible!important;pointer-events:auto!important;position:relative!important;z-index:2!important}
#${ROOT} :is(.rvw-btn,.dpw-btn,.daw-btn,.atw-btn,.prw-btn,.abs-btn):not(:disabled){opacity:1!important;cursor:pointer!important}
#${ROOT} :is(.rvw-page,.dpw-page,.daw-page,.atw-page,.prw-page){visibility:visible!important;opacity:1!important}
#${ROOT} :is(.rvw-card,.dpw-card,.daw-table-card,.atw-card,.prw-card){visibility:visible!important;opacity:1!important}
#${ROOT} .daw-periods,#${ROOT} .rvw-actions,#${ROOT} .dpw-actions,#${ROOT} .atw-tabs,#${ROOT} .prw-tabs{visibility:visible!important;opacity:1!important}
`}
function shown(el){if(!el||!el.isConnected)return false;const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>0.01}
function clearState(root){['atw','prw','daw','pcw','gw3','route'].forEach(k=>{try{delete root.dataset[k]}catch{}})}
function recover(reason){const now=Date.now();if(now-lastRecovery<COOLDOWN||now-routeChangedAt<GRACE)return;lastRecovery=now;const root=document.getElementById(ROOT);if(!root)return;console.warn('[Octopus Integrity v3] recover',route(),reason);root.replaceChildren();clearState(root);try{window.dispatchEvent(new Event('hashchange'))}catch{}}
function requireAll(page,selectors){return selectors.every(s=>page.querySelector(s))}
function check(){css();const r=route(),root=document.getElementById(ROOT);if(!root)return;if(r!==lastRoute){lastRoute=r;routeChangedAt=Date.now();return}
 if(r==='system.assets'){
   const page=root.querySelector('.atw-page');if(!page){recover('assets workspace missing');return}
   window.OctopusAssetsBusinessActions?.check?.();
   page.querySelectorAll('.atw-btn,.abs-btn').forEach(b=>{b.hidden=false;b.style.removeProperty('pointer-events');b.style.removeProperty('visibility');b.style.removeProperty('opacity')});
   return
 }
 if(r==='system.templates'){
   const page=root.querySelector('.atw-page');if(!page){recover('template workspace missing');return}
   if(!requireAll(page,['[data-atw-new-template]','[data-atw-edit]'])){recover('template actions missing');return}
   page.querySelectorAll('.atw-btn').forEach(b=>{b.hidden=false;b.style.removeProperty('pointer-events');b.style.removeProperty('display');b.style.removeProperty('visibility');b.style.removeProperty('opacity')});return
 }
 if(r==='system.roles'){
   const page=root.querySelector('.prw-page');if(!page){recover('roles workspace missing');return}
   if(!page.querySelector('[data-prw-tab]')||!page.querySelector('[data-prw-person],[data-prw-role]')){recover('permission actions missing');return}
   page.querySelectorAll('.prw-btn').forEach(b=>{b.hidden=false;b.style.removeProperty('pointer-events');b.style.removeProperty('display');b.style.removeProperty('visibility');b.style.removeProperty('opacity')});return
 }
 if(r==='release.review'){
   const page=root.querySelector('.rvw-page');if(!page||!page.querySelector('.rvw-card')){recover('review workspace/card missing');return}
   const pending=page.querySelector('[data-rvw-view="pending"].active');if(pending&&!page.querySelector('[data-rvw-batch]')){recover('review action missing');return}
   page.querySelectorAll('.rvw-btn').forEach(b=>{b.hidden=false;b.style.removeProperty('pointer-events')});return
 }
 if(r==='release.distribution'){
   const page=root.querySelector('.dpw-page');if(!page||!page.querySelector('.dpw-card')){recover('distribution workspace/card missing');return}
   if(!page.querySelector('[data-dpw-new]')||!page.querySelector('[data-dpw-tab]')||!page.querySelector('[data-dpw-config],[data-dpw-send]')){recover('distribution actions missing');return}
   page.querySelectorAll('.dpw-btn').forEach(b=>{b.hidden=false;b.style.removeProperty('pointer-events')});return
 }
 if(/^dashboard\./.test(r)){
   const page=root.querySelector('.daw-page');if(!page||!page.querySelector('.daw-table-card')){recover('dashboard workspace/card missing');return}
   if(!page.querySelector('[data-daw-period]')||!page.querySelector('[data-daw-export]')||!page.querySelector('[data-daw-follow]')){recover('dashboard actions missing');return}
   page.querySelectorAll('.daw-btn').forEach(b=>{b.hidden=false;b.classList.add('daw-btn');b.style.removeProperty('pointer-events');b.style.removeProperty('display');b.style.removeProperty('visibility');b.style.removeProperty('opacity')});return
 }
 const manifest={'production.content':'.pcw-page','production.localization':'.loc-page','release.titles':'.gw3-page','release.covers':'.gw3-page','operations.channel-analysis':'.orw-page','operations.ad-intelligence':'.orw-page'};
 if(manifest[r]&&!root.querySelector(manifest[r]))recover(`workspace ${manifest[r]} missing`)
}
window.OctopusIntegrityGuard={check,version:'3.0'};
window.addEventListener('hashchange',()=>{lastRoute=route();routeChangedAt=Date.now();setTimeout(check,GRACE+40);setTimeout(check,1100)});
window.addEventListener('pageshow',()=>setTimeout(check,600));window.addEventListener('octopus-language-change',()=>setTimeout(check,650));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(check,600)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(check,650),{once:true});else setTimeout(check,650);
setInterval(check,INTERVAL);
})();