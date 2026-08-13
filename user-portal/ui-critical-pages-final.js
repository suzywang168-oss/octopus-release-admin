(()=>{
'use strict';
const ROOT='pageRoot',STYLE_ID='octopus-runtime-integrity-guard-v4';
const INTERVAL=1800,GRACE=520,COOLDOWN=1100;
let routeChangedAt=Date.now(),lastRecovery=0,lastRoute='';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function css(){let s=document.getElementById(STYLE_ID);if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}s.textContent=`
#${ROOT} :is(.rvw-btn,.dpw-btn,.daw-btn,.atw-btn,.prw-btn,.abs-btn,.v815act,.v815primary,.v815ghost){visibility:visible!important;pointer-events:auto!important;position:relative!important;z-index:2!important}
#${ROOT} :is(.rvw-btn,.dpw-btn,.daw-btn,.atw-btn,.prw-btn,.abs-btn,.v815act,.v815primary,.v815ghost):not(:disabled){opacity:1!important;cursor:pointer!important}
#${ROOT} :is(.rvw-page,.dpw-page,.daw-page,.atw-page,.prw-page,.v815page){visibility:visible!important;opacity:1!important}
#${ROOT} :is(.rvw-card,.dpw-card,.daw-table-card,.atw-card,.prw-card){visibility:visible!important;opacity:1!important}
#${ROOT} .daw-periods,#${ROOT} .rvw-actions,#${ROOT} .dpw-actions,#${ROOT} .atw-tabs,#${ROOT} .prw-tabs,#${ROOT} .v815acts{visibility:visible!important;opacity:1!important}
`}
function clearState(root){['atw','prw','daw','pcw','gw3','route'].forEach(k=>{try{delete root.dataset[k]}catch{}})}
function recover(reason){const now=Date.now();if(now-lastRecovery<COOLDOWN||now-routeChangedAt<GRACE)return;lastRecovery=now;const root=document.getElementById(ROOT);if(!root)return;console.warn('[Octopus Integrity v4] recover workspace',route(),reason);root.replaceChildren();clearState(root);try{window.dispatchEvent(new Event('hashchange'))}catch{}}
function showButtons(page,selector){page.querySelectorAll(selector).forEach(b=>{b.hidden=false;b.style.removeProperty('pointer-events');b.style.removeProperty('display');b.style.removeProperty('visibility');b.style.removeProperty('opacity')})}
function check(){css();const r=route(),root=document.getElementById(ROOT);if(!root)return;if(r!==lastRoute){lastRoute=r;routeChangedAt=Date.now();return}
 window.OctopusStableActionRegistry?.check?.();
 if(r==='system.assets'){
   const page=root.querySelector('.atw-page');if(!page){recover('assets workspace missing');return}
   window.OctopusAssetsBusinessActions?.check?.();showButtons(page,'.atw-btn,.abs-btn');return
 }
 if(r==='system.templates'){
   const page=root.querySelector('.atw-page');if(!page){recover('template workspace missing');return}
   showButtons(page,'.atw-btn');return
 }
 if(r==='system.roles'){
   const page=root.querySelector('.prw-page');if(!page){recover('roles workspace missing');return}
   showButtons(page,'.prw-btn');return
 }
 if(r==='system.channels'||r==='system.tasks'){
   const page=root.querySelector('.v815page');if(!page){recover('system workspace missing');return}
   showButtons(page,'.v815act,.v815primary,.v815ghost');return
 }
 if(r==='release.review'){
   const page=root.querySelector('.rvw-page');if(!page||(!page.querySelector('.rvw-card')&&!page.querySelector('[data-rvw-submit]'))){recover('review workspace missing');return}
   showButtons(page,'.rvw-btn');return
 }
 if(r==='release.distribution'){
   const page=root.querySelector('.dpw-page');if(!page||!page.querySelector('.dpw-card')){recover('distribution workspace/card missing');return}
   showButtons(page,'.dpw-btn');return
 }
 if(/^dashboard\./.test(r)){
   const page=root.querySelector('.daw-page');if(!page||!page.querySelector('.daw-table-card')){recover('dashboard workspace/card missing');return}
   showButtons(page,'.daw-btn');return
 }
 const manifest={'production.content':'.pcw-page','production.localization':'.loc-page','release.titles':'.gw3-page','release.covers':'.gw3-page','operations.channel-analysis':'.orw-page','operations.ad-intelligence':'.orw-page'};
 if(manifest[r]&&!root.querySelector(manifest[r]))recover(`workspace ${manifest[r]} missing`)
}
window.OctopusIntegrityGuard={check,version:'4.1'};
window.addEventListener('hashchange',()=>{lastRoute=route();routeChangedAt=Date.now();setTimeout(check,GRACE+40);setTimeout(check,1100)});
window.addEventListener('pageshow',()=>setTimeout(check,600));window.addEventListener('octopus-language-change',()=>setTimeout(check,650));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(check,600)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(check,650),{once:true});else setTimeout(check,650);
setInterval(check,INTERVAL);
})();