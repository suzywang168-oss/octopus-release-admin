(()=>{
'use strict';
const STYLE='octopus-editor-modal-unifier';
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
/* AI tag editor: present the existing editor as a true modal. */
#pageRoot:has([data-pcw-tag-group]){isolation:isolate}
#pageRoot:has([data-pcw-tag-group])>.pcw-page{position:fixed!important;inset:0!important;z-index:58000!important;width:auto!important;max-width:none!important;margin:0!important;padding:20px!important;display:grid!important;place-items:center!important;overflow:auto!important;background:rgba(2,8,18,.74)!important;backdrop-filter:blur(5px)!important}
#pageRoot:has([data-pcw-tag-group])>.pcw-page>.pcw-editor-head{position:relative!important;width:min(980px,calc(100vw - 40px))!important;box-sizing:border-box!important;margin:0!important;padding:17px 58px 15px 20px!important;border:1px solid var(--line)!important;border-bottom:0!important;border-radius:16px 16px 0 0!important;background:var(--panel)!important}
#pageRoot:has([data-pcw-tag-group])>.pcw-page>.pcw-editor-head .pcw-editor-title{display:block!important}
#pageRoot:has([data-pcw-tag-group])>.pcw-page>.pcw-editor-head .pcw-back{position:absolute!important;top:14px!important;right:16px!important;width:34px!important;height:34px!important;margin:0!important;padding:0!important;font-size:0!important}
#pageRoot:has([data-pcw-tag-group])>.pcw-page>.pcw-editor-head .pcw-back:after{content:'×';font-size:18px!important}
#pageRoot:has([data-pcw-tag-group])>.pcw-page>.pcw-panel{width:min(980px,calc(100vw - 40px))!important;max-height:calc(100vh - 150px)!important;box-sizing:border-box!important;overflow:auto!important;border-radius:0 0 16px 16px!important;box-shadow:0 34px 110px rgba(0,0,0,.52)!important}
#pageRoot:has([data-pcw-tag-group])>.pcw-page>.pcw-panel>header{display:none!important}
#pageRoot:has([data-pcw-tag-group]) .pcw-tag-editor{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
#pageRoot:has([data-pcw-tag-group]) .pcw-tag-editor .pcw-field:last-child{grid-column:1/-1!important}
#pageRoot:has([data-pcw-tag-group]) .pcw-tag-editor textarea{min-height:94px!important}

/* Localization editor: modal layout, with legacy KPI / insight layers covered. */
#pageRoot:has(.loc-editor-grid)>.loc-page{position:fixed!important;inset:0!important;z-index:59000!important;width:auto!important;max-width:none!important;margin:0!important;padding:20px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:auto!important;background:rgba(2,8,18,.74)!important;backdrop-filter:blur(5px)!important}
#pageRoot:has(.loc-editor-grid)>.loc-page>.loc-back{position:fixed!important;z-index:3!important;top:31px!important;right:32px!important;width:34px!important;height:34px!important;margin:0!important;padding:0!important;font-size:0!important}
#pageRoot:has(.loc-editor-grid)>.loc-page>.loc-back:after{content:'×';font-size:18px!important}
#pageRoot:has(.loc-editor-grid) .loc-editor-grid{position:relative!important;width:min(1280px,calc(100vw - 40px))!important;max-height:calc(100vh - 40px)!important;grid-template-columns:minmax(420px,.9fr) minmax(480px,1.1fr)!important;align-items:stretch!important;overflow:auto!important;border:1px solid var(--line)!important;border-radius:16px!important;background:var(--panel)!important;box-shadow:0 34px 110px rgba(0,0,0,.52)!important}
#pageRoot:has(.loc-editor-grid) .loc-panel{border:0!important;border-radius:0!important}
#pageRoot:has(.loc-editor-grid) .loc-panel+ .loc-panel{border-left:1px solid var(--line)!important}
#pageRoot:has(.loc-editor-grid) .loc-field :is(input,select,textarea),#pageRoot:has([data-pcw-tag-group]) textarea{pointer-events:auto!important;user-select:text!important;opacity:1!important}
#pageRoot:has(.loc-editor-grid) :is(button,select,input,textarea),#pageRoot:has([data-pcw-tag-group]) :is(button,textarea){visibility:visible!important;pointer-events:auto!important;opacity:1!important}
@media(max-width:900px){#pageRoot:has(.loc-editor-grid) .loc-editor-grid{grid-template-columns:1fr!important}#pageRoot:has(.loc-editor-grid) .loc-panel+ .loc-panel{border-left:0!important;border-top:1px solid var(--line)!important}}
@media(max-width:700px){#pageRoot:has([data-pcw-tag-group]) .pcw-tag-editor{grid-template-columns:1fr!important}#pageRoot:has([data-pcw-tag-group]) .pcw-tag-editor .pcw-field:last-child{grid-column:auto!important}}
`}
function enableOptions(){
 if(!/^(production\.content|production\.localization|production\.languages)$/.test(location.hash.replace(/^#\/?/,'').replaceAll('/','.')))return;
 document.querySelectorAll('#pageRoot :is(select,option,input,textarea,button)').forEach(el=>{
  if(el.matches('input[readonly]'))return;
  el.disabled=false;
  el.removeAttribute('aria-disabled');
 });
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;css();enableOptions()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('hashchange',schedule);window.addEventListener('pageshow',schedule);
schedule();
})();
