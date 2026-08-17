(()=>{
'use strict';
const ROUTE='release.watermark';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const active=()=>route()===ROUTE;
const inWatermark=t=>t instanceof Element&&!!t.closest('#pageRoot .wm4-page');

/* Watermark owns its internal DOM. Global observers should not react to local table/modal updates. */
const BaseMO=window.MutationObserver;
if(BaseMO&&!window.__octopusWatermarkObserverQuarantine){
 class WatermarkQuietObserver extends BaseMO{
  constructor(callback){
   super((records,observer)=>{
    if(active())return;
    callback(records,observer);
   });
  }
 }
 window.MutationObserver=WatermarkQuietObserver;
 window.__octopusWatermarkObserverQuarantine=true;
}

/* Runtime stability already executes watermark actions on pointerdown. Swallow the compatibility click
   before legacy document-level click delegates can see the same control a second time. */
window.addEventListener('click',e=>{
 if(!active()||!inWatermark(e.target))return;
 const control=e.target.closest('button,[role="button"],input[type="checkbox"],.wm4-thumb');
 if(!control)return;
 e.preventDefault();
 e.stopImmediatePropagation();
},true);

/* The runtime handler is registered earlier on document and has already updated search/filter state.
   Stop later generic input/change delegates from treating watermark controls as their own forms. */
document.addEventListener('input',e=>{
 if(!active()||!inWatermark(e.target))return;
 const t=e.target;
 if(t.matches('[data-wm7-search],[data-wm7-field]'))e.stopImmediatePropagation();
},true);

document.addEventListener('change',e=>{
 if(!active()||!inWatermark(e.target))return;
 const t=e.target;
 if(t.matches('[data-wm7-filter],[data-wm7-field],input[type="checkbox"]'))e.stopImmediatePropagation();
},true);

/* Keep browser scroll anchoring from compensating when the single table swaps columns/rows. */
const style=document.createElement('style');
style.id='octopus-watermark-interaction-quarantine-style';
style.textContent='#pageRoot .wm4-page{overflow-anchor:none!important}#pageRoot .wm4-card,#pageRoot [data-wm7-table]{overflow-anchor:none!important}';
document.head.appendChild(style);

window.OctopusWatermarkInteractionQuarantine={version:'1.0',active};
})();
