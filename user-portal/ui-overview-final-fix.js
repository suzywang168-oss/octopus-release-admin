(()=>{
'use strict';
const LABELS={
title:'\u4e1a\u52a1\u603b\u89c8',
description:'\u4ee5\u201c\u9009\u54c1 \u2192 \u5185\u5bb9\u52a0\u5de5 \u2192 \u7269\u6599\u5236\u4f5c \u2192 \u6e20\u9053\u5206\u53d1 \u2192 \u76d1\u63a7\u8fed\u4ee3\u201d\u4e3a\u4e3b\u7ebf\u7ba1\u7406\u5168\u90e8\u53d1\u884c\u9879\u76ee\u3002'
};
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function style(){let s=document.getElementById('overview-final-fix-style');if(!s){s=document.createElement('style');s.id='overview-final-fix-style';document.head.appendChild(s)}s.textContent=`
#pageRoot .occ-link,#pageRoot [data-occ-route]{position:relative!important;z-index:12!important;pointer-events:auto!important;cursor:pointer!important;opacity:1!important}
#pageRoot .occ-card-head,#pageRoot .occ-section-title{position:relative!important;z-index:4!important}
`}
function title(){
 if(route()!=='overview')return;
 const slot=document.getElementById('octopusGlobalTitleSlot');
 if(slot){let h=slot.querySelector('h1'),p=slot.querySelector('p');if(!h||!p){slot.innerHTML='<h1></h1><p></p>';h=slot.querySelector('h1');p=slot.querySelector('p')}if(h.textContent!==LABELS.title)h.textContent=LABELS.title;if(p.textContent!==LABELS.description)p.textContent=LABELS.description}
 const head=document.querySelector('#pageRoot .occ-head');if(head){const h=head.querySelector('h1'),p=head.querySelector('p');if(h&&h.textContent!==LABELS.title)h.textContent=LABELS.title;if(p&&p.textContent!==LABELS.description)p.textContent=LABELS.description}
}
window.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target.closest('[data-occ-route]'):null;if(!target)return;
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
 const next='#/'+target.dataset.occRoute.replaceAll('.','/');
 if(location.hash===next)window.dispatchEvent(new HashChangeEvent('hashchange'));else location.hash=next;
},true);
let pending=false;function apply(){pending=false;style();title()}function schedule(){if(pending)return;pending=true;requestAnimationFrame(apply)}
window.addEventListener('hashchange',()=>{schedule();setTimeout(schedule,80);setTimeout(schedule,240)});
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});schedule();setTimeout(schedule,600);setTimeout(schedule,1600);
})();