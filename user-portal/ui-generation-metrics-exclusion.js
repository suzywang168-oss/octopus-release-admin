(()=>{
'use strict';
const OWNED=new Set(['release.titles','release.covers']);
const ROOT='pageRoot';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
function removeAll(arr,value){
  if(!Array.isArray(arr))return;
  let i;
  while((i=arr.indexOf(value))>=0)arr.splice(i,1);
}
function excludeFromContract(){
  const c=window.OctopusMetricsInsightContract;
  if(!c)return;
  OWNED.forEach(r=>removeAll(c.routes,r));
}
function cleanup(){
  excludeFromContract();
  if(!OWNED.has(route()))return;
  const root=document.getElementById(ROOT);if(!root)return;
  root.querySelectorAll('.oct-contract-kpis-generated,.oct-ai-strip').forEach(el=>el.remove());
  root.querySelectorAll('.gw3-kpis.oct-contract-kpis').forEach(el=>el.classList.remove('oct-contract-kpis'));
  root.querySelectorAll('.gw3-page').forEach(el=>el.removeAttribute('data-metrics-insight'));
}
function schedule(){
  requestAnimationFrame(cleanup);
  setTimeout(cleanup,40);
  setTimeout(cleanup,180);
}
cleanup();
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('octopus-owned-route-change',schedule);
window.addEventListener('pageshow',schedule);
window.addEventListener('octopus-language-change',schedule);
window.OctopusGenerationMetricsExclusion={apply:cleanup,routes:[...OWNED],version:'1.0'};
})();