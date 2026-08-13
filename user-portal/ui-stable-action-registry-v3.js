(()=>{
'use strict';
const ROOT='pageRoot';
let scheduled=false,observer=null,lastRerender=0;
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const managed=()=>['release.review','release.distribution','system.assets','system.templates','system.roles'].includes(route());
function css(){let s=document.getElementById('octopus-stable-action-registry-v3');if(!s){s=document.createElement('style');s.id='octopus-stable-action-registry-v3';document.head.appendChild(s)}s.textContent=`
#${ROOT} :is(.rvw-btn,.dpw-btn,.atw-btn,.prw-btn,.abs-btn){visibility:visible!important;opacity:1!important;pointer-events:auto!important}
#${ROOT} :is(.rvw-actions,.dpw-actions,.atw-tabs,.prw-tabs,.abs-actions){visibility:visible!important;opacity:1!important}
#${ROOT} .rvw-head,#${ROOT} .dpw-head,#${ROOT} .atw-head,#${ROOT} .prw-head{overflow:visible!important}
#${ROOT} .rvw-actions,#${ROOT} .dpw-actions{display:flex!important;align-items:center!important;gap:8px!important}
`}
function rerender(key){const now=Date.now();if(now-lastRerender<1000)return;lastRerender=now;const root=document.getElementById(ROOT);if(!root)return;try{delete root.dataset[key]}catch{};window.dispatchEvent(new Event('hashchange'))}
function review(root){const p=root.querySelector('.rvw-page');if(!p)return;const pending=p.querySelector('[data-rvw-view="pending"].active');if(pending&&!p.querySelector('[data-rvw-batch]'))rerender('route');p.querySelectorAll('.rvw-btn').forEach(b=>b.hidden=false)}
function distribution(root){const p=root.querySelector('.dpw-page');if(!p)return;if(!p.querySelector('[data-dpw-new]')||!p.querySelector('[data-dpw-config],[data-dpw-send]'))rerender('route');p.querySelectorAll('.dpw-btn').forEach(b=>b.hidden=false)}
function assets(root){window.OctopusAssetsBusinessActions?.check?.();root.querySelectorAll('.atw-btn,.abs-btn').forEach(b=>b.hidden=false)}
function templates(root){const p=root.querySelector('.atw-page');if(!p)return;if(!p.querySelector('[data-atw-new-template]')||[...p.querySelectorAll('.atw-table tbody tr')].some(tr=>!tr.querySelector('[data-atw-edit]')))rerender('atw');p.querySelectorAll('.atw-btn').forEach(b=>b.hidden=false)}
function roles(root){const p=root.querySelector('.prw-page');if(!p)return;if([ ...p.querySelectorAll('.prw-table tbody tr')].some(tr=>!tr.querySelector('[data-prw-person],[data-prw-role]')))rerender('prw');p.querySelectorAll('.prw-btn').forEach(b=>b.hidden=false)}
function check(){scheduled=false;css();const root=document.getElementById(ROOT);if(!root)return;const r=route();if(r==='release.review')review(root);else if(r==='release.distribution')distribution(root);else if(r==='system.assets')assets(root);else if(r==='system.templates')templates(root);else if(r==='system.roles')roles(root)}
function schedule(){if(!managed()||scheduled)return;scheduled=true;requestAnimationFrame(check)}
function bind(){const root=document.getElementById(ROOT);if(!root)return;observer?.disconnect();observer=new MutationObserver(schedule);observer.observe(root,{childList:true,subtree:true})}
window.OctopusStableActionRegistry={check,version:'3.0'};
window.addEventListener('hashchange',()=>{setTimeout(check,80);setTimeout(check,360)});window.addEventListener('octopus-language-change',()=>setTimeout(check,120));window.addEventListener('pageshow',()=>setTimeout(check,120));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{bind();setTimeout(check,180)},{once:true});else{bind();setTimeout(check,180)}
})();