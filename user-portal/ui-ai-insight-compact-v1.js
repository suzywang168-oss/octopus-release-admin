(()=>{
'use strict';
const STYLE='octopus-ai-insight-compact-v1';
function install(){
 let s=document.getElementById(STYLE);if(s)return;
 s=document.createElement('style');s.id=STYLE;s.textContent=`
/* Global AI insight compact contract */
#pageRoot .oct-ai-strip{
  grid-template-columns:180px repeat(3,minmax(0,1fr))!important;
  min-height:68px!important;
  margin:0 0 12px!important;
  border-radius:14px!important;
}
#pageRoot .oct-ai-head,#pageRoot .oct-ai-item{
  min-height:68px!important;
  height:68px!important;
  padding:10px 16px!important;
  box-sizing:border-box!important;
}
#pageRoot .oct-ai-head{justify-content:center!important}
#pageRoot .oct-ai-head b{font-size:12px!important;line-height:1.25!important}
#pageRoot .oct-ai-head span{margin-top:4px!important;font-size:8px!important;line-height:1.3!important}
#pageRoot .oct-ai-item{
  grid-template-columns:8px minmax(0,1fr)!important;
  gap:9px!important;
  align-items:center!important;
  font-size:9px!important;
  line-height:1.4!important;
}
#pageRoot .oct-ai-dot{width:6px!important;height:6px!important;margin-top:0!important}
#pageRoot .oct-ai-copy{
  display:-webkit-box!important;
  -webkit-box-orient:vertical!important;
  -webkit-line-clamp:2!important;
  overflow:hidden!important;
}
/* Watermark standalone insight */
#pageRoot .wm4-insight{
  min-height:44px!important;
  margin-bottom:12px!important;
  padding:7px 12px!important;
  gap:8px!important;
  border-radius:10px!important;
  font-size:9px!important;
  line-height:1.35!important;
}
#pageRoot .wm4-insight strong{font-size:9px!important}
#pageRoot .wm4-insight .wm4-btn{height:30px!important;padding:0 10px!important;font-size:9px!important}
@media(max-width:1100px){
 #pageRoot .oct-ai-strip{grid-template-columns:160px repeat(3,minmax(0,1fr))!important}
 #pageRoot .oct-ai-head{grid-column:auto!important;border-bottom:0!important}
 #pageRoot .oct-ai-item:nth-child(3){border-left:1px solid color-mix(in srgb,#6683df 24%,var(--line))!important}
}
@media(max-width:820px){
 #pageRoot .oct-ai-strip{grid-template-columns:1fr!important}
 #pageRoot .oct-ai-head,#pageRoot .oct-ai-item{height:auto!important;min-height:52px!important}
 #pageRoot .oct-ai-item{border-left:0!important;border-top:1px solid var(--line)!important}
}
`;
 document.head.appendChild(s);
}
install();
window.addEventListener('pageshow',install);
window.OctopusAIInsightCompact={install,version:'1.0'};
})();
