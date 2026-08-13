(()=>{
'use strict';
const ROOT='pageRoot';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const proto=Element.prototype,desc=Object.getOwnPropertyDescriptor(proto,'innerHTML');
if(!desc?.set||proto.__octOverviewRenderLock)return;
proto.__octOverviewRenderLock=true;
Object.defineProperty(proto,'innerHTML',{
 configurable:desc.configurable,enumerable:desc.enumerable,get:desc.get,
 set:function(value){
  if(this.id===ROOT&&route()==='overview'&&this.querySelector(':scope>.occ-page')){
   const html=String(value??'');
   if(html.includes('occ-page')||html.includes('v815head')){
    console.debug('[Octopus Overview Lock] ignored redundant overview rewrite');
    return;
   }
  }
  return desc.set.call(this,value);
 }
});
window.OctopusOverviewRenderLock={version:'1.0'};
})();