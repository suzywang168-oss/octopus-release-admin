(()=>{
'use strict';
const SLOT='octopusGlobalTitleSlot',STYLE='octopus-title-single-source';
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
.ota-toolbar #${SLOT}{display:block!important;min-width:0!important}.ota-toolbar #${SLOT} h1{margin:0!important;font-size:21px!important;line-height:1.2!important;font-weight:760!important;letter-spacing:-.02em!important}.ota-toolbar #${SLOT} p{margin:6px 0 0!important;max-width:720px!important;color:var(--soft)!important;font-size:9px!important;line-height:1.45!important}.oct-title-duplicate{display:none!important}
`}
function clean(v){return String(v||'').replace(/\s+/g,' ').trim()}
function directChild(el,parent){let x=el;while(x&&x.parentElement!==parent)x=x.parentElement;return x?.parentElement===parent?x:null}
function apply(){css();const bar=document.querySelector('.ota-toolbar'),slot=document.getElementById(SLOT);if(!bar||!slot)return;bar.querySelectorAll('.oct-title-duplicate').forEach(x=>x.classList.remove('oct-title-duplicate'));const title=clean(slot.querySelector('h1')?.textContent);if(!title)return;
 [...bar.querySelectorAll('h1,h2,h3,strong')].forEach(h=>{if(slot.contains(h)||clean(h.textContent)!==title)return;const block=directChild(h,bar)||h;block.classList.add('oct-title-duplicate')});
 const parent=bar.parentElement;if(parent){[...parent.children].forEach(ch=>{if(ch===bar||ch.id==='pageRoot'||ch.id==='v80nav'||ch.contains?.(bar))return;const h=ch.querySelector?.('h1,h2,h3');if(h&&clean(h.textContent)===title)ch.classList.add('oct-title-duplicate')})}
}
let pending=false;function schedule(delay=0){setTimeout(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})},delay)}
window.addEventListener('hashchange',()=>{schedule(0);schedule(140)});window.addEventListener('pageshow',()=>schedule(80));window.addEventListener('octopus-language-change',()=>schedule(100));window.addEventListener('resize',()=>schedule(80));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(160),{once:true});else schedule(160);setTimeout(()=>schedule(),700);
window.OctopusTitleSingleSource={apply,version:'1.0'};
})();