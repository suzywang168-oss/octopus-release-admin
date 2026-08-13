(()=>{
'use strict';
const ROOT='pageRoot',STYLE='octopus-route-ownership-lock';
const OWNED={
 'release.review':'.rvw-page',
 'release.distribution':'.dpw-page',
 'dashboard.series':'.daw-page',
 'dashboard.channels':'.daw-page',
 'dashboard.external':'.daw-page',
 'dashboard.risk':'.daw-page',
 'system.assets':'.atw-page',
 'system.templates':'.atw-page',
 'system.roles':'.prw-page',
 'production.content':'.pcw-page',
 'production.localization':'.loc-page',
 'release.titles':'.gw3-page',
 'release.covers':'.gw3-page',
 'operations.channel-analysis':'.orw-page',
 'operations.ad-intelligence':'.orw-page'
};
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const selector=r=>OWNED[r]||'';
const signature=r=>selector(r).replace(/^\./,'');
const isOwned=r=>!!selector(r);
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`#${ROOT}[data-route-owner]{contain:layout style;}`}
function ownerAPI(r){
 if(r==='release.distribution')return window.OctopusDistributionPlanner;
 if(/^dashboard\./.test(r))return window.OctopusDashboardWorkspace||window.OctopusDashboardAnalysis;
 return null
}
function ownerPresent(root,r){try{return !!root?.querySelector(selector(r))}catch{return false}}
function wakeOwner(reason){
 const r=route();if(!isOwned(r))return;
 requestAnimationFrame(()=>{
   const root=document.getElementById(ROOT),api=ownerAPI(r);
   try{api?.ensure?.()}catch{}
   if(!ownerPresent(root,r)){try{api?.render?.()}catch{}}
   try{window.dispatchEvent(new CustomEvent('octopus-owned-route-change',{detail:{route:r,reason}}))}catch{}
 })
}
function markOwner(){const root=document.getElementById(ROOT),r=route();if(!root)return;if(isOwned(r))root.dataset.routeOwner=r;else delete root.dataset.routeOwner}
function installInnerHTMLLock(){
 const proto=Element.prototype,desc=Object.getOwnPropertyDescriptor(proto,'innerHTML');if(!desc?.set||proto.__octRouteLock)return;proto.__octRouteLock=true;
 Object.defineProperty(proto,'innerHTML',{configurable:desc.configurable,enumerable:desc.enumerable,get:desc.get,set:function(v){
   if(this.id===ROOT){const r=route();if(isOwned(r)&&!String(v??'').includes(signature(r))){console.debug('[Octopus Route Lock] blocked generic pageRoot write',r);if(!ownerPresent(this,r))wakeOwner('blocked-innerHTML');return}}
   return desc.set.call(this,v)
 }})
}
function installReplaceChildrenLock(){
 const proto=Element.prototype,native=proto.replaceChildren;if(!native||proto.__octReplaceLock)return;proto.__octReplaceLock=true;
 proto.replaceChildren=function(...nodes){if(this.id===ROOT){const r=route();if(isOwned(r)&&ownerPresent(this,r)&&nodes.length===0){console.debug('[Octopus Route Lock] blocked pageRoot clear',r);return}}return native.apply(this,nodes)}
}
function dispatchRouteChange(before,after,reason){if(before===after)return;queueMicrotask(()=>{try{window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL:location.href.replace(after,before),newURL:location.href}))}catch{window.dispatchEvent(new Event('hashchange'))}wakeOwner(reason)})}
function installHistoryBridge(){
 if(history.__octRouteBridge)return;history.__octRouteBridge=true;
 ['pushState','replaceState'].forEach(name=>{const native=history[name];history[name]=function(...args){const before=location.hash,out=native.apply(this,args),after=location.hash;dispatchRouteChange(before,after,name);return out}})
}
function ensure(){css();markOwner();const r=route(),root=document.getElementById(ROOT);if(isOwned(r)&&!ownerPresent(root,r))wakeOwner('ensure')}
installInnerHTMLLock();installReplaceChildrenLock();installHistoryBridge();
window.addEventListener('hashchange',()=>{markOwner();setTimeout(()=>wakeOwner('hashchange'),0)},true);
window.addEventListener('pageshow',()=>setTimeout(ensure,50));
window.addEventListener('octopus-language-change',()=>setTimeout(ensure,80));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(ensure,50)});
window.OctopusRouteOwnershipLock={ensure,wakeOwner,version:'1.1'};
setTimeout(ensure,0);setTimeout(ensure,180);setTimeout(ensure,700);
})();