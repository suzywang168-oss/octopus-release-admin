(()=>{
'use strict';
const normalize=value=>{
 const raw=String(value||'#/overview');
 return raw.startsWith('#/')?raw:'#/'+raw.replace(/^#?\/?/,'');
};
let wanted='#/overview';
try{wanted=normalize(window.parent.location.hash||location.hash||'#/overview')}catch{wanted=normalize(location.hash)}
const syncRouteClass=()=>document.documentElement.classList.toggle('oct-overview-route',location.hash==='#/overview');
syncRouteClass();
window.addEventListener('hashchange',syncRouteClass,true);
if(location.hash!==wanted)history.replaceState(null,'',location.pathname+location.search+wanted);
syncRouteClass();
if(wanted==='#/overview'){
 try{window.OctopusOverviewCommandCenter?.render?.()}catch{}
 requestAnimationFrame(()=>{try{window.OctopusOverviewCommandCenter?.ensure?.()}catch{}});
}
window.OctopusInitialRouteStabilizer={wanted,ready:true,version:'2.0'};
})();
