(()=>{
'use strict';
const ROOT='pageRoot',STYLE='octopus-editor-control-fix';
const modalSelector='.loc-dialog-layer,.rvw-dialog-layer,.gw3-modal[data-gw3-modal]';
function insideControl(target){
 if(!(target instanceof Element)||!target.closest(modalSelector))return false;
 return !!target.closest('select,input,textarea,label,.gw3-option,.rvw-choice,[data-gw3-candidate]');
}
function shield(event){
 if(!insideControl(event.target))return;
 /* Keep legacy page-level handlers from swallowing native form interaction. */
 event.stopPropagation();
}
function css(){
 let s=document.getElementById(STYLE);
 if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}
 s.textContent=`
 #${ROOT} :is(.loc-dialog-layer,.rvw-dialog-layer,.gw3-modal[data-gw3-modal]) :is(select,input:not([readonly]),textarea,label,.gw3-option,.rvw-choice,[data-gw3-candidate]){pointer-events:auto!important;user-select:auto!important}
 #${ROOT} :is(.loc-dialog-layer,.rvw-dialog-layer,.gw3-modal[data-gw3-modal]) select{cursor:pointer!important}
 #${ROOT} :is(.loc-dialog-layer,.rvw-dialog-layer,.gw3-modal[data-gw3-modal]) :is(input[type="radio"],input[type="checkbox"]){cursor:pointer!important;accent-color:#6683df!important}
 `;
}
['pointerdown','mousedown','click'].forEach(type=>window.addEventListener(type,shield,true));
window.addEventListener('change',event=>{
 const t=event.target;
 if(!(t instanceof HTMLInputElement||t instanceof HTMLSelectElement)||!t.closest(modalSelector))return;
 t.dataset.octEditorSelected='1';
 if(t.matches('input[name="single-title"],input[name="single-cover"]')){
  const title=document.querySelector('input[name="single-title"]:checked')?.value;
  const cover=document.querySelector('input[name="single-cover"]:checked')?.value;
  const result=document.querySelector('[data-rvw-result]');
  if(result)result.textContent=title==='标题通过'&&cover==='封面通过'?'通过并进入分发':'退回修改';
 }
},true);
css();
})();
