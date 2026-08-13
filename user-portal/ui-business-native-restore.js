(()=>{
'use strict';
const ROOT='pageRoot';
const NATIVE_BUTTON_ROUTES=new Set(['release.titles','release.covers','system.templates','system.roles','release.review','release.distribution']);
const SELF_METRIC_ROUTES=new Set(['release.titles','release.covers','system.templates']);
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function removeFrom(arr,value){if(!Array.isArray(arr))return;let i;while((i=arr.indexOf(value))>=0)arr.splice(i,1)}
function installCss(){let s=document.getElementById('octopus-business-native-restore');if(!s){s=document.createElement('style');s.id='octopus-business-native-restore';document.head.appendChild(s)}s.textContent=`
/* Business-owned pages keep their own action hierarchy. */
#${ROOT} .atw-table .atw-btn{height:36px!important;min-height:36px!important;max-height:36px!important;padding:0 13px!important;border-radius:9px!important;font-size:9px!important;font-weight:700!important}
#${ROOT} .prw-table .prw-btn{height:36px!important;min-height:36px!important;max-height:36px!important;padding:0 13px!important;border-radius:9px!important;font-size:9px!important;font-weight:700!important}
#${ROOT} .rvw-table .rvw-btn{height:32px!important;min-height:32px!important;max-height:32px!important;padding:0 12px!important;border-radius:8px!important;font-size:8px!important;font-weight:750!important}
#${ROOT} .rvw-head .rvw-btn,#${ROOT} .rvw-editor-actions .rvw-btn,#${ROOT} .rvw-editor-foot .rvw-btn{height:36px!important;min-height:36px!important;max-height:36px!important;padding:0 14px!important;border-radius:9px!important;font-size:9px!important}
#${ROOT} .rvw-btn.primary,#${ROOT} .rvw-row-review{border-color:#6683df!important;background:#6683df!important;color:#fff!important}
#${ROOT} .dpw-table .dpw-btn,#${ROOT} .dpw-head .dpw-btn,#${ROOT} .dpw-modal .dpw-btn{height:36px!important;min-height:36px!important;max-height:36px!important;padding:0 13px!important;border-radius:9px!important;font-size:9px!important;font-weight:700!important}
#${ROOT} .dpw-btn.primary{border-color:#6683df!important;background:#6683df!important;color:#fff!important}
#${ROOT} .gw3-row-action.v815act{width:auto!important;min-width:92px!important;height:31px!important;padding:0 12px!important;border:1px solid #6683df!important;border-radius:8px!important;background:transparent!important;color:#a9bbff!important;font-size:8px!important;font-weight:750!important}
`}
}
function releaseContracts(){
 const qa=window.OctopusListActionQA;
 if(qa?.routes)NATIVE_BUTTON_ROUTES.forEach(r=>removeFrom(qa.routes,r));
 const mi=window.OctopusMetricsInsightContract;
 if(mi?.routes)SELF_METRIC_ROUTES.forEach(r=>removeFrom(mi.routes,r));
}
function cleanupNativeButtons(){
 const r=route(),root=document.getElementById(ROOT);if(!root)return;
 if(NATIVE_BUTTON_ROUTES.has(r))root.querySelectorAll('table[data-oct-actions]').forEach(t=>{t.removeAttribute('data-oct-actions');t.style.removeProperty('--oct-action-width')});
 if(SELF_METRIC_ROUTES.has(r)){
  root.querySelectorAll('.oct-contract-kpis-generated,.oct-ai-strip').forEach(x=>x.remove());
  root.querySelectorAll('.oct-legacy-ai-insight').forEach(x=>x.classList.remove('oct-legacy-ai-insight'));
  root.querySelectorAll('.gw3-kpis.oct-contract-kpis').forEach(x=>x.classList.remove('oct-contract-kpis'));
  root.querySelector(':scope>.gw3-page,:scope>.atw-page')?.removeAttribute('data-metrics-insight');
 }
}
function apply(){installCss();releaseContracts();cleanupNativeButtons()}
window.addEventListener('hashchange',()=>{setTimeout(apply,20);setTimeout(apply,180)});
window.addEventListener('octopus-owned-route-change',()=>setTimeout(apply,40));
window.addEventListener('pageshow',()=>setTimeout(apply,100));
window.addEventListener('octopus-language-change',()=>setTimeout(apply,120));
document.addEventListener('focusout',()=>setTimeout(apply,160),true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,150),{once:true});else setTimeout(apply,40);
window.OctopusBusinessNativeRestore={apply,version:'1.3'};
})();