(()=>{
'use strict';
const ROOT='pageRoot',STYLE='octopus-route-ownership-lock';
const owned={
 'release.review':['rvw-page','rvw-editor-card'],
 'release.distribution':['dpw-page','data-dpw-owner="v2"'],
 'dashboard.series':['daw-page'],
 'dashboard.channels':['daw-page'],
 'dashboard.external':['daw-page'],
 'dashboard.risk':['daw-page'],
 'system.assets':['atw-page'],
 'system.templates':['atw-page'],
 'system.roles':['prw-page'],
 'production.content':['pcw-page'],
 'production.localization':['loc-page'],
 'release.titles':['gw3-page'],
 'release.covers':['gw3-page'],
 'operations.channel-analysis':['orw-page'],
 'operations.ad-intelligence':['orw-page']
};
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const sigs=r=>owned[r]||null;
const matches=(html,r)=>{const a=sigs(r);return !!a&&a.some(s=>String(html||'').includes(s))};
const currentOwned=()=>!!sigs(route());
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`#${ROOT}[data-route-owner]{contain:layout style;}`}
function ownerAPI(r){
 if(r==='release.distribution')return window.OctopusDistributionPlanner;
 if(r==='dashboard.series'||r==='dashboard.channels'||r==='dashboard.external'||r==='dashboard.risk')return window.OctopusDashboardWorkspace||window.OctopusDashboardAnalysis;
 return null
}
function wakeOwner(reason){const r=route();if(!sigs(r))return;requestAnimationFrame(()=>{const api=ownerAPI(r);try{api?.ensure?.();if(!document.getElementById(ROOT)?.querySelector(sigs(r).map(x=>'.'+x.replace(/\[.*$/,'')).join(',')))api?.render?.()}catch{};try{window.dispatchEvent(new CustomEvent('octopus-owned-route-change',{detail:{route:r,reason}}))}catch{}})}
function markOwner(){const root=document.getElementById(ROOT),r=route();if(!root)return;if(sigs(r))root.dataset.routeOwner=r;else delete root.dataset.routeOwner}
function installInnerHTMLLock(){
 const proto=Element.prototype,desc=Object.getOwnPropertyDescriptor(proto,'innerHTML');if(!desc?.set||proto.__octRouteLock)return;proto.__octRouteLock=true;
 Object.defineProperty(proto,'innerHTML',{configurable:desc.configurable,enumerable:desc.enumerable,get:desc.get,set:function(v){
   if(this.id===ROOT&&currentOwned()){
     const r=route(),hasOwned=[...(this.children||[])].some(el=>sigs(r).some(s=>el.outerHTML?.includes(s)));
     if(!matches(v,r)){
       console.debug('[Octopus Route Lock] blocked generic pageRoot write',r);
       if(!hasOwned)wakeOwner('blocked-innerHTML');
       return v;
     }
   }
   return desc.set.call(this,v)
 }});
}
function installReplaceChildrenLock(){const proto=Element.prototype,native=proto.replaceChildren;if(!native||proto.__octReplaceLock)return;proto.__octReplaceLock=true;proto.replaceChildren=function(...nodes){if(this.id===ROOT&&currentOwned()){const r=route(),hasOwned=[...this.children].some(el=>sigs(r).some(s=>el.outerHTML?.includes(s)));if(hasOwned&&nodes.length===0){console.debug('[Octopus Route Lock] blocked pageRoot clear',r);return}}return native.apply(this,nodes)}}
function installHistoryBridge(){
 if(history.__octRouteBridge)return;history.__octRouteBridge=true;
 const wrap=name=>{const native=history[name];history[name]=function(...args){const before=location.hash,out=native.apply(this,args),after=location.hash;if(after!==before){queueMicrotask(()=>{try{window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL:location.href.replace(after,before),newURL:location.href}))}catch{window.dispatchEvent(new Event('hashchange'))};wakeOwner(name)})}return out}};
 wrap('pushState');wrap('replaceState')
}
function ensure(){css();markOwner();if(currentOwned()){const root=document.getElementById(ROOT),r=route();if(root&&!root.querySelector(sigs(r).map(s=>s.startsWith('data-')?'[data-dpw-owner="v2"]':'.'+s).join(',')))wakeOwner('ensure')}}
installInnerHTMLLock();installReplaceChildrenLock();installHistoryBridge();
window.addEventListener('hashchange',()=>{markOwner();setTimeout(()=>wakeOwner('hashchange'),0)},true);
window.addEventListener('pageshow',()=>setTimeout(ensure,50));window.addEventListener('octopus-language-change',()=>setTimeout(ensure,80));
window.OctopusRouteOwnershipLock={ensure,wakeOwner,version:'1.0'};
setTimeout(ensure,0);setTimeout(ensure,180);setTimeout(ensure,700);
})();