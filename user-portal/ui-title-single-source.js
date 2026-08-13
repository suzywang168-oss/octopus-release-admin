(()=>{
'use strict';
const SLOT='octopusGlobalTitleSlot',STYLE='octopus-title-single-source';
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
/* The top toolbar has exactly one page-title owner. */
.ota-toolbar .workspace,.ota-toolbar .oct-shell-legacy-title{display:none!important}
.ota-toolbar>#${SLOT}{display:block!important;min-width:0!important;visibility:visible!important;opacity:1!important}
.ota-toolbar>#${SLOT} h1{margin:0!important;font-size:21px!important;line-height:1.2!important;font-weight:760!important;letter-spacing:-.02em!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.ota-toolbar>#${SLOT} p{margin:6px 0 0!important;max-width:720px!important;color:var(--soft)!important;font-size:9px!important;line-height:1.45!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
#pageRoot>.v815page>.v815head,#pageRoot>.occ-page>.occ-head,#pageRoot>.oge-page>.oge-head,#pageRoot>.gw3-page>.v815head{display:none!important}
.oct-title-duplicate{display:none!important}
`}
}
function clean(v){return String(v||'').replace(/\s+/g,' ').trim()}
function directChild(el,parent){let x=el;while(x&&x.parentElement!==parent)x=x.parentElement;return x?.parentElement===parent?x:null}
function allowedToolbarChild(ch){return ch.id===SLOT||ch.id==='octopusGlobalActionHost'||ch.classList?.contains('ota-actions')||ch.classList?.contains('ota-search-host')||ch.tagName==='INPUT'}
function apply(){
 css();
 const bar=document.querySelector('.ota-toolbar'),slot=document.getElementById(SLOT);if(!bar||!slot)return;
 /* Any old direct toolbar block that is not search/actions/title is legacy shell chrome. */
 [...bar.children].forEach(ch=>{if(allowedToolbarChild(ch)){ch.classList.remove('oct-shell-legacy-title');return}ch.classList.add('oct-shell-legacy-title')});
 document.querySelectorAll('.oct-title-duplicate').forEach(x=>x.classList.remove('oct-title-duplicate'));
 const title=clean(slot.querySelector('h1')?.textContent);if(!title)return;
 [...bar.querySelectorAll('h1,h2,h3,strong,b')].forEach(h=>{if(slot.contains(h)||clean(h.textContent)!==title)return;(directChild(h,bar)||h).classList.add('oct-title-duplicate')});
 const parent=bar.parentElement;if(parent){[...parent.children].forEach(ch=>{if(ch===bar||ch.id==='pageRoot'||ch.id==='v80nav'||ch.contains?.(bar))return;const h=ch.querySelector?.('h1,h2,h3');if(h&&clean(h.textContent)===title)ch.classList.add('oct-title-duplicate')})}
}
let pending=false;function schedule(delay=0){setTimeout(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})},delay)}
css();apply();
window.addEventListener('hashchange',()=>schedule(0));window.addEventListener('octopus-owned-route-change',()=>schedule(0));window.addEventListener('pageshow',()=>schedule(0));window.addEventListener('octopus-language-change',()=>schedule(30));window.addEventListener('resize',()=>schedule(50));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
window.OctopusTitleSingleSource={apply,version:'3.0'};
})();