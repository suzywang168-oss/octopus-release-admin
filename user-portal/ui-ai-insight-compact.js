(()=>{
'use strict';
const STYLE='octopus-ai-insight-compact';
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
/* One compact AI insight rail across every module main page. */
#pageRoot:has(>.occ-page)>.oct-contract-kpis{display:none!important}
#pageRoot>.occ-page{display:flex!important;flex-direction:column!important}
#pageRoot>.occ-page>.occ-kpis{order:1!important}
#pageRoot>.occ-page>.occ-top-grid{order:2!important}
#pageRoot>.occ-page>.occ-bottom-grid{order:3!important}
#pageRoot>.occ-page>.occ-projects{order:4!important}
#pageRoot .oct-ai-strip{grid-template-columns:minmax(170px,.58fr) repeat(3,minmax(0,1fr))!important;min-height:52px!important;margin-bottom:12px!important;border-radius:12px!important}
#pageRoot .oct-ai-strip .oct-ai-head,#pageRoot .oct-ai-strip .oct-ai-item{min-height:52px!important;padding:9px 16px!important}
#pageRoot .oct-ai-strip .oct-ai-head{justify-content:center!important}
#pageRoot .oct-ai-strip .oct-ai-head b{font-size:10px!important;line-height:1.25!important}
#pageRoot .oct-ai-strip .oct-ai-head span{margin-top:3px!important;font-size:7px!important;line-height:1.2!important}
#pageRoot .oct-ai-strip .oct-ai-item{grid-template-columns:7px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;font-size:8px!important;line-height:1.35!important}
#pageRoot .oct-ai-strip .oct-ai-dot{width:5px!important;height:5px!important;margin-top:0!important}
#pageRoot .oct-ai-strip .oct-ai-copy{display:-webkit-box!important;overflow:hidden!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important}

#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai){min-height:52px!important;margin-bottom:12px!important;border-radius:12px!important;display:grid!important;grid-template-columns:minmax(170px,.58fr) minmax(0,3fr)!important;overflow:hidden!important}
#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai) .v815ct{min-height:52px!important;padding:9px 16px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;border-bottom:0!important}
#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai) .v815ct b{font-size:10px!important}
#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai) .v815ct span{margin-top:3px!important;font-size:7px!important}
#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai) .v815ins{min-height:52px!important;padding:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important}
#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai) .v815ins>div{min-height:52px!important;margin:0!important;padding:9px 14px!important;display:flex!important;align-items:center!important;border-left:1px solid var(--line)!important;border-bottom:0!important;font-size:8px!important;line-height:1.35!important}
#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai) .v815ins span{display:-webkit-box!important;overflow:hidden!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;font-size:8px!important;line-height:1.35!important}

/* Editors and dialogs should never carry the main-page insight rail. */
#pageRoot:has(.pcw-editor-grid)>.oct-ai-strip,#pageRoot:has([data-pcw-tag-group])>.oct-ai-strip,#pageRoot:has(.loc-editor-grid)>.oct-ai-strip,#pageRoot:has(.gw3-modal)>.oct-ai-strip{display:none!important}
@media(max-width:900px){#pageRoot .oct-ai-strip,#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai){grid-template-columns:150px minmax(0,1fr)!important}#pageRoot .oct-ai-strip .oct-ai-item:nth-of-type(n+3),#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai) .v815ins>div:nth-child(n+3){display:none!important}}
@media(max-width:620px){#pageRoot .oct-ai-strip,#pageRoot :is(.gml-insight-card,.cad-insight-card,.ol2-insight,.oct-compact-ai){grid-template-columns:1fr!important}#pageRoot .oct-ai-strip .oct-ai-head{display:none!important}#pageRoot .oct-ai-strip .oct-ai-item{border-left:0!important}#pageRoot .oct-ai-strip .oct-ai-item:nth-of-type(n+2){display:none!important}}
`}
function markLegacy(){
 document.querySelectorAll('#pageRoot .v815card').forEach(card=>{
  const title=card.querySelector('.v815ct b')?.textContent?.replace(/\s+/g,'').toLowerCase()||'';
  if(title.includes('ai洞察与建议')||title.includes('aiinsights'))card.classList.add('oct-compact-ai');
 });
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;css();markLegacy()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('hashchange',schedule);window.addEventListener('octopus-language-change',schedule);schedule();
})();
