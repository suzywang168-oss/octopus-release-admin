(()=>{
'use strict';
const STYLE='octopus-runtime-stability-v2';
const OWNED=new Set([
 'overview',
 'operations.channel-analysis','operations.ad-intelligence',
 'production.content','production.localization',
 'release.watermark','release.titles','release.covers','release.review','release.distribution',
 'dashboard.series','dashboard.channels','dashboard.external','dashboard.risk',
 'system.assets','system.templates','system.roles'
]);
const QUIET_OBSERVERS=new Set([
 'ui-navigation-action-cleanup.js','ui-interaction-fix-v816.js','ui-shell-alignment-fix.js',
 'ui-global-module-layout.js','ui-layout-v2.js','ui-layout-spacing-fix.js',
 'ui-generation-workspace-v3.js','ui-title-layout-stability.js','ui-route-title-normalizer.js','ui-action-placement-final.js'
]);
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const scriptName=()=>{try{return new URL(document.currentScript?.src||'',location.href).pathname.split('/').pop()}catch{return ''}};
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
/* The global title slot is the only top-toolbar title. */
.ota-toolbar .workspace{display:none!important}
.ota-toolbar>#octopusGlobalTitleSlot{display:block!important;min-width:0!important}
/* Route changes are DOM swaps, not animated layout transitions. */
html.oct-route-switching #pageRoot,html.oct-route-switching #pageRoot *{transition:none!important;animation:none!important}
`}
css();

const NativeMO=window.MutationObserver;
if(NativeMO&&!window.__octopusStableMutationObserver){
 class StableMutationObserver{
  constructor(callback){
   this.owner=scriptName();
   const owner=this.owner;
   this.native=new NativeMO((records,observer)=>{
    if(owner==='portal-architecture-v815.js'&&OWNED.has(route()))return;
    callback(records,observer);
   });
  }
  observe(target,options){
   const whole=(target===document.documentElement||target===document.body||options?.subtree);
   if(whole&&QUIET_OBSERVERS.has(this.owner))return;
   return this.native.observe(target,options);
  }
  disconnect(){return this.native.disconnect()}
  takeRecords(){return this.native.takeRecords()}
 }
 window.MutationObserver=StableMutationObserver;
 window.__octopusStableMutationObserver=true;
}

const nativeAdd=window.addEventListener.bind(window);
if(!window.__octopusStableWindowEvents){
 window.addEventListener=function(type,listener,options){
  const owner=scriptName();
  if(owner==='portal-architecture-v815.js'&&type==='hashchange'&&typeof listener==='function'){
   return nativeAdd(type,function(ev){if(OWNED.has(route())||ev?.octopusLayoutOnly)return;return listener.call(this,ev)},options);
  }
  if(owner==='ui-action-placement-final.js'&&type==='pointerdown')return;
  return nativeAdd(type,listener,options);
 };
 window.__octopusStableWindowEvents=true;
}

const nativeTimeout=window.setTimeout.bind(window);
if(!window.__octopusStableTimeout){
 window.setTimeout=function(fn,delay,...args){
  const owner=scriptName();
  if(owner==='portal-architecture-v815.js'&&Number(delay)>=400&&typeof fn==='function'){
   return nativeTimeout(()=>{if(!OWNED.has(route()))fn(...args)},delay);
  }
  return nativeTimeout(fn,delay,...args);
 };
 window.__octopusStableTimeout=true;
}

/* Register before legacy global click handlers. Dedicated system dialogs own these four actions end to end. */
nativeAdd('click',e=>{
 const api=window.OctopusSystemManagementDialogs;if(!api)return;
 const target=e.target instanceof Element?e.target.closest('button,a,[role="button"],[data-oct-system-action],[data-a]'):null;if(!target)return;
 const internal=target.closest?.('#octopusSystemManagementDialog [data-smd-action]');
 if(internal){const action=internal.dataset.smdAction||'';if(api.handleInternal?.(action,internal)){e.preventDefault();e.stopImmediatePropagation()}return}
 const kind=api.detectTrigger?.(target);if(!kind)return;
 e.preventDefault();e.stopImmediatePropagation();api.open?.(kind,target);
},true);

function syncNav(r=route()){
 document.querySelectorAll('#v80nav [data-r]').forEach(b=>b.classList.toggle('active',b.dataset.r===r));
}
function layoutOnly(){
 const ev=new Event('hashchange');
 try{Object.defineProperty(ev,'octopusLayoutOnly',{value:true})}catch{ev.octopusLayoutOnly=true}
 window.dispatchEvent(ev);
}
function pokeOwners(){
 const r=route();
 try{
  if(r==='overview')window.OctopusOverviewCommandCenter?.ensure?.();
  else if(r==='production.content')window.OctopusContentWorkspace?.ensure?.();
  else if(r==='production.localization')window.OctopusLocalizationWorkspace?.ensure?.();
  else if(r==='release.watermark')window.OctopusWatermarkSingleWorkspace?.ensure?.();
  else if(r==='release.distribution')window.OctopusDistributionPlanner?.ensure?.();
  else if(/^dashboard\./.test(r))window.OctopusDashboardWorkspace?.ensure?.();
  else if(r==='system.assets')window.OctopusAssetsBusinessActions?.check?.();
 }catch{}
 try{window.OctopusMetricsInsightContract?.ensure?.()}catch{}
 try{window.OctopusTitleSingleSource?.apply?.()}catch{}
 try{window.OctopusBusinessNativeRestore?.apply?.()}catch{}
}
function markSwitch(){
 document.documentElement.classList.add('oct-route-switching');
 nativeTimeout(()=>document.documentElement.classList.remove('oct-route-switching'),90);
}

document.addEventListener('click',e=>{
 const t=e.target instanceof Element?e.target.closest('[data-r]'):null;
 if(!t)return;
 const r=t.dataset.r;
 if(!OWNED.has(r)){
  markSwitch();
  nativeTimeout(()=>{syncNav(r);layoutOnly();requestAnimationFrame(pokeOwners)},0);
  return;
 }
 e.preventDefault();e.stopImmediatePropagation();
 const oldURL=location.href,next='#/'+r.replaceAll('.','/');
 markSwitch();
 history.pushState(null,'',next);
 syncNav(r);
 const ev=typeof HashChangeEvent==='function'?new HashChangeEvent('hashchange',{oldURL,newURL:location.href}):new Event('hashchange');
 window.dispatchEvent(ev);
 window.dispatchEvent(new CustomEvent('octopus-owned-route-change',{detail:{route:r}}));
 requestAnimationFrame(pokeOwners);
 nativeTimeout(pokeOwners,60);
},true);

nativeAdd('hashchange',e=>{if(e?.octopusLayoutOnly)return;markSwitch();syncNav();requestAnimationFrame(pokeOwners)});
nativeAdd('popstate',()=>{
 markSwitch();syncNav();
 if(OWNED.has(route())){
  window.dispatchEvent(new Event('hashchange'));
  window.dispatchEvent(new CustomEvent('octopus-owned-route-change',{detail:{route:route()}}));
 }else nativeTimeout(layoutOnly,0);
 requestAnimationFrame(pokeOwners);
});
nativeAdd('pageshow',()=>{syncNav();requestAnimationFrame(pokeOwners)});
window.OctopusRuntimeStability={owned:OWNED,syncNav,pokeOwners,layoutOnly,version:'2.5'};
})();