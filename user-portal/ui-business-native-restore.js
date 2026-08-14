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

/* Compact AI title / cover editor. Keep the whole dialog inside the viewport. */
html.gw3-active #${ROOT} .gw3-modal{padding:16px!important;box-sizing:border-box!important}
html.gw3-active #${ROOT} .gw3-modal-shell{width:min(1040px,calc(100vw - 48px))!important;max-width:1040px!important;height:min(760px,calc(100vh - 48px))!important;max-height:calc(100vh - 48px)!important;min-height:0!important;overflow:hidden!important}
html.gw3-active #${ROOT} .gw3-modal-head{flex:0 0 auto!important;padding:13px 16px!important}
html.gw3-active #${ROOT} .gw3-modal-head h2{font-size:14px!important}
html.gw3-active #${ROOT} .gw3-modal-head p{margin-top:4px!important}
html.gw3-active #${ROOT} .gw3-modal-body{flex:1 1 auto!important;min-height:0!important;overflow:auto!important;overscroll-behavior:contain!important;padding:12px 16px!important}
html.gw3-active #${ROOT} .gw3-modal-foot{flex:0 0 auto!important;position:relative!important;z-index:2!important;padding:11px 16px!important;background:var(--panel)!important}
html.gw3-active #${ROOT} .gw3-context{margin-bottom:10px!important;padding:9px 11px!important}
html.gw3-active #${ROOT} .gw3-editor-grid{grid-template-columns:minmax(320px,.72fr) minmax(0,1.28fr)!important;gap:12px!important;align-items:start!important}
html.gw3-active #${ROOT} .gw3-panel{min-width:0!important}
html.gw3-active #${ROOT} .gw3-panel-head{padding:12px 14px 10px!important}
html.gw3-active #${ROOT} .gw3-panel-head h2{font-size:12px!important}
html.gw3-active #${ROOT} .gw3-panel-body{padding:12px 14px 14px!important;min-width:0!important}
html.gw3-active #${ROOT} .gw3-form{gap:9px!important}
html.gw3-active #${ROOT} .gw3-field{gap:5px!important}
html.gw3-active #${ROOT} .gw3-field input,html.gw3-active #${ROOT} .gw3-field select{height:34px!important;padding:0 10px!important}
html.gw3-active #${ROOT} .gw3-field textarea{min-height:64px!important;max-height:110px!important;padding:8px 10px!important}
html.gw3-active #${ROOT} .gw3-note{margin-top:10px!important;padding:9px 10px!important}
html.gw3-active #${ROOT} .gw3-cover-grid{grid-template-columns:repeat(3,minmax(150px,1fr))!important;gap:9px!important;min-width:0!important}
html.gw3-active #${ROOT} .gw3-cover-card{min-width:0!important;padding:7px!important}
html.gw3-active #${ROOT} .gw3-cover-art{height:240px!important;aspect-ratio:auto!important}
html.gw3-active #${ROOT} .gw3-cover-copy{left:8px!important;right:8px!important;bottom:8px!important;padding:7px!important}
html.gw3-active #${ROOT} .gw3-meta{gap:5px!important;margin-top:6px!important}
html.gw3-active #${ROOT} .gw3-meta span{min-height:21px!important;padding:0 6px!important}
html.gw3-active #${ROOT} .gw3-title-list{gap:9px!important}
html.gw3-active #${ROOT} .gw3-title-card{padding:10px!important}
html.gw3-active #${ROOT} .gw3-title-input{min-height:58px!important}
@media(max-width:900px){html.gw3-active #${ROOT} .gw3-modal{padding:10px!important}html.gw3-active #${ROOT} .gw3-modal-shell{width:calc(100vw - 20px)!important;height:calc(100vh - 20px)!important;max-height:calc(100vh - 20px)!important}html.gw3-active #${ROOT} .gw3-editor-grid{grid-template-columns:1fr!important}html.gw3-active #${ROOT} .gw3-cover-grid{grid-template-columns:repeat(3,minmax(170px,1fr))!important;overflow-x:auto!important;padding-bottom:4px!important}}
`}
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
  /* Generation/template workspaces own their KPI + insight blocks. Remove only global-contract copies. */
  root.querySelectorAll('.oct-contract-kpis-generated,.oct-ai-strip').forEach(x=>x.remove());
  root.querySelectorAll('.oct-legacy-ai-insight').forEach(x=>x.classList.remove('oct-legacy-ai-insight'));
  root.querySelectorAll('.gw3-kpis.oct-contract-kpis').forEach(x=>x.classList.remove('oct-contract-kpis'));
  root.querySelector(':scope>.gw3-page,:scope>.atw-page')?.removeAttribute('data-metrics-insight');
 }
}
function apply(){installCss();releaseContracts();cleanupNativeButtons()}
window.addEventListener('hashchange',()=>{apply();setTimeout(apply,120)});
window.addEventListener('octopus-owned-route-change',()=>{apply();setTimeout(apply,80)});
window.addEventListener('pageshow',()=>setTimeout(apply,60));
window.addEventListener('octopus-language-change',()=>setTimeout(apply,80));
document.addEventListener('focusout',()=>setTimeout(apply,120),true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
setTimeout(apply,120);
window.OctopusBusinessNativeRestore={apply,version:'1.5'};
})();
