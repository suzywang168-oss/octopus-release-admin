(()=>{
'use strict';
const normalize=value=>{
 const raw=String(value||'#/overview');
 return raw.startsWith('#/')?raw:'#/'+raw.replace(/^#?\/?/,'');
};
let wanted='#/overview';
try{wanted=normalize(window.parent.location.hash||location.hash||'#/overview')}catch{wanted=normalize(location.hash)}
const started=performance.now(),lockMs=900;
const locked=()=>performance.now()-started<lockMs;
function enforce(){
 if(!locked()||location.hash===wanted)return;
 history.replaceState(null,'',location.pathname+location.search+wanted);
}
['pushState','replaceState'].forEach(name=>{
 const native=history[name].bind(history);
 history[name]=function(state,title,url){
  if(locked()&&url!=null){
   const next=new URL(String(url),location.href).hash;
   if(next&&normalize(next)!==wanted)return null;
  }
  return native(state,title,url);
 };
});
window.addEventListener('hashchange',enforce,true);
if(location.hash!==wanted)history.replaceState(null,'',location.pathname+location.search+wanted);
if(wanted==='#/overview'){
 try{window.OctopusOverviewCommandCenter?.render?.()}catch{}
 requestAnimationFrame(()=>{try{window.OctopusOverviewCommandCenter?.ensure?.()}catch{}});
}
setTimeout(()=>window.removeEventListener('hashchange',enforce,true),lockMs+40);
window.OctopusInitialRouteStabilizer={wanted,ready:true,version:'1.0'};
})();
