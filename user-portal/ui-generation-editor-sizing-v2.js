(()=>{
'use strict';
const STYLE='octopus-generation-editor-sizing-v2';
function apply(){
 let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}
 s.textContent=`
/* Title editor is text-heavy, so keep it materially narrower than the cover editor. */
#pageRoot[data-gw3-route="release.titles"] .gw3-modal{padding:18px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-modal-shell{width:min(900px,calc(100vw - 56px))!important;max-width:900px!important;height:min(680px,calc(100vh - 56px))!important;max-height:calc(100vh - 56px)!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-editor-grid{grid-template-columns:minmax(310px,.76fr) minmax(0,1.24fr)!important;gap:10px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-context{padding:8px 10px!important;margin-bottom:9px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-panel-head{padding:10px 12px 9px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-panel-body{padding:10px 12px 12px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-form{gap:8px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-field textarea{min-height:56px!important;max-height:78px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-title-list{gap:7px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-title-card{grid-template-columns:24px minmax(0,1fr)!important;gap:8px!important;padding:8px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-radio{width:19px!important;height:19px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-title-card.selected .gw3-radio:after{width:8px!important;height:8px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-title-input{min-height:48px!important;max-height:66px!important;padding:7px 8px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-meta{margin-top:5px!important;gap:4px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-modal-head{padding:12px 15px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-modal-body{padding:10px 14px!important}
#pageRoot[data-gw3-route="release.titles"] .gw3-modal-foot{padding:9px 14px!important}
@media(max-width:820px){#pageRoot[data-gw3-route="release.titles"] .gw3-modal-shell{width:calc(100vw - 20px)!important;height:calc(100vh - 20px)!important;max-height:calc(100vh - 20px)!important}#pageRoot[data-gw3-route="release.titles"] .gw3-editor-grid{grid-template-columns:1fr!important}}
`;
}
apply();
window.addEventListener('pageshow',apply);
window.OctopusGenerationEditorSizing={apply,version:'2.0'};
})();