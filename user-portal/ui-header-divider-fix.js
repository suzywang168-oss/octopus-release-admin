(()=>{
'use strict';
const STYLE='octopus-header-divider-fix';
function css(){
 let s=document.getElementById(STYLE);
 if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}
 s.textContent=`
/* Exactly one divider for the whole header. */
html body .oct-header-single-divider,
html.gml-active body .oct-header-single-divider,
html.ol2-active body .oct-header-single-divider{
  position:relative!important;
  border-top:0!important;
  border-bottom:1px solid var(--line)!important;
  box-shadow:none!important;
  padding-bottom:7px!important;
  margin-bottom:16px!important;
  overflow:visible!important
}
/* Kill every competing toolbar/workspace line, including the higher-specificity legacy gml rule. */
html body .oct-header-single-divider>.workspace,
html body .oct-header-single-divider>.ota-toolbar,
html.gml-active body .oct-header-single-divider>.workspace,
html.gml-active body .oct-header-single-divider>.ota-toolbar,
html.ol2-active body .oct-header-single-divider>.workspace,
html.ol2-active body .oct-header-single-divider>.ota-toolbar,
html.gml-active body .ota-toolbar,
html.ol2-active body .ota-toolbar{
  border-top:0!important;
  border-bottom:0!important;
  box-shadow:none!important
}
html.gml-active body .ota-toolbar,
html.ol2-active body .ota-toolbar,
html body .ota-toolbar{
  margin-bottom:0!important;
  padding-bottom:0!important
}
html body .oct-header-single-divider>.workspace:before,
html body .oct-header-single-divider>.workspace:after,
html body .oct-header-single-divider>.ota-toolbar:before,
html body .oct-header-single-divider>.ota-toolbar:after,
html.gml-active body .ota-toolbar:before,
html.gml-active body .ota-toolbar:after{
  display:none!important;
  content:none!important;
  border:0!important;
  box-shadow:none!important
}
html body .workspace.oct-fixed-title-owner,
html body .workspace.oct-shell-title-owner{
  border:0!important;
  box-shadow:none!important;
  padding-bottom:0!important;
  overflow:visible!important
}
/* Subtitle stays on one line. */
html body .workspace.oct-fixed-title-owner>small,
html body .workspace.oct-shell-title-owner>small{
  display:block!important;
  margin:5px 0 0!important;
  width:auto!important;
  max-width:min(1100px,76vw)!important;
  height:auto!important;
  line-height:1.4!important;
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
  word-break:normal!important
}
`;
}
function commonParent(a,b){
 if(!a||!b)return null;
 let p=a.parentElement;
 while(p&&p!==document.body){if(p.contains(b))return p;p=p.parentElement}
 return null;
}
function apply(){
 css();
 const w=document.querySelector('.workspace.oct-fixed-title-owner,.workspace.oct-shell-title-owner,.workspace');
 const bar=document.querySelector('.ota-toolbar');
 if(!w||!bar)return;
 document.querySelectorAll('.oct-header-single-divider').forEach(x=>x.classList.remove('oct-header-single-divider'));
 const host=commonParent(w,bar);
 if(host)host.classList.add('oct-header-single-divider');
}
let raf=0;const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(apply)};
apply();setTimeout(apply,60);setTimeout(apply,180);
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('octopus-owned-route-change',schedule);
window.addEventListener('pageshow',schedule);
window.addEventListener('octopus-language-change',schedule);
window.OctopusHeaderDividerFix={apply,version:'1.2'};
})();