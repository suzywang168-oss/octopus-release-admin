(()=>{
'use strict';
const ROOT='pageRoot',STYLE_ID='octopus-runtime-integrity-guard-v4';
const INTERVAL=1800,GRACE=520,COOLDOWN=1300;
let routeChangedAt=Date.now(),lastRecovery=0,lastRoute='';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function editing(){if(window.OctopusStableActionRegistry?.editing?.())return true;const a=document.activeElement;if(a&&/^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName))return true;return !!document.querySelector('#octopusRowEditor.open,.atw-modal,.prw-modal,.rvw-editor-top,.dpw-modal,.dsao-modal,.oar-modal,.gw3-modal,.business-modal,.ubw-layer')}
function css(){let s=document.getElementById(STYLE_ID);if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}s.textContent=`#${ROOT} :is(.rvw-btn,.dpw-btn,.daw-btn,.atw-btn,.prw-btn,.abs-btn,.v815act,.v815primary,.v815ghost,.gw3-primary,.gw3-secondary,.gw3-row-action){visibility:visible!important;pointer-events:auto!important}#${ROOT} :is(.rvw-page,.dpw-page,.daw-page,.atw-page,.prw-page,.gw3-page,.v815page){visibility:visible!important;opacity:1!important}#${ROOT} :is(.rvw-card,.rvw-editor-card,.dpw-card,.daw-table-card,.atw-card,.prw-card,.gw3-card){visibility:visible!important;opacity:1!important}`}
function clearState(root){['atw','prw','daw','pcw','gw3','route'].forEach(k=>{try{delete root.dataset[k]}catch{}})}
function recover(reason){if(editing())return;const now=Date.now();if(now-lastRecovery<COOLDOWN||now-routeChangedAt<GRACE)return;lastRecovery=now;const root=document.getElementById(ROOT);if(!root)return;console.warn('[Octopus Integrity] recover workspace',route(),reason);root.replaceChildren();clearState(root);try{window.dispatchEvent(new Event('hashchange'))}catch{}}
function showButtons(page,selector){if(editing())return;page.querySelectorAll(selector).forEach(b=>{b.hidden=false;b.style.removeProperty('pointer-events');b.style.removeProperty('display');b.style.removeProperty('visibility');b.style.removeProperty('opacity')})}
function check(){css();const r=route(),root=document.getElementById(ROOT);if(!root||editing())return;if(r!==lastRoute){lastRoute=r;routeChangedAt=Date.now();return}window.OctopusStableActionRegistry?.check?.();
 if(r==='system.assets'){const p=root.querySelector('.atw-page');if(!p){recover('assets workspace missing');return}window.OctopusAssetsBusinessActions?.check?.();showButtons(p,'.atw-btn,.abs-btn');return}
 if(r==='system.templates'){const p=root.querySelector('.atw-page');if(!p){recover('template workspace missing');return}showButtons(p,'.atw-btn');return}
 if(r==='system.roles'){const p=root.querySelector('.prw-page');if(!p){recover('roles workspace missing');return}showButtons(p,'.prw-btn');return}
 if(r==='system.channels'||r==='system.tasks'){const p=root.querySelector('.v815page');if(!p){recover('system workspace missing');return}showButtons(p,'.v815act,.v815primary,.v815ghost');return}
 if(r==='release.review'){const p=root.querySelector('.rvw-page'),valid=p&&(p.querySelector('.rvw-card,.rvw-editor-card')||p.querySelector('[data-rvw-single-submit],[data-rvw-batch-submit]'));if(!valid){recover('review workspace missing');return}showButtons(p,'.rvw-btn');return}
 if(r==='release.distribution'){window.OctopusDistributionPlanner?.ensure?.();const p=root.querySelector('.dpw-page');if(p)showButtons(p,'.dpw-btn');return}
 if(r==='release.titles'||r==='release.covers'){const p=root.querySelector('.gw3-page');if(!p){recover('generation workspace missing');return}showButtons(p,'.gw3-primary,.gw3-secondary,.gw3-row-action,.gw3-tab');return}
 if(/^dashboard\./.test(r)){const p=root.querySelector('.daw-page');if(!p||!p.querySelector('.daw-table-card')){recover('dashboard workspace/card missing');return}showButtons(p,'.daw-btn');return}
 const manifest={'production.content':'.pcw-page','production.localization':'.loc-page','operations.channel-analysis':'.orw-page','operations.ad-intelligence':'.orw-page'};if(manifest[r]&&!root.querySelector(manifest[r]))recover(`workspace ${manifest[r]} missing`)
}
window.OctopusIntegrityGuard={check,editing,version:'4.7'};window.addEventListener('hashchange',()=>{lastRoute=route();routeChangedAt=Date.now();setTimeout(check,700)});window.addEventListener('pageshow',()=>setTimeout(check,700));window.addEventListener('octopus-language-change',()=>setTimeout(check,700));document.addEventListener('focusout',()=>setTimeout(check,260),true);document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(check,700)});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(check,700),{once:true});else setTimeout(check,700);setInterval(check,INTERVAL);
})();
