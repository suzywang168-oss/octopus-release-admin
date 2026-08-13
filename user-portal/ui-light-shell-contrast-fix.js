(()=>{
'use strict';
const THEME_KEY='octopus-v7-theme',STYLE='octopus-light-shell-contrast-fix';
const light=()=>localStorage.getItem(THEME_KEY)==='light'||document.documentElement.classList.contains('octopus-light')||document.body?.classList.contains('light');
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
html.octopus-light #v80nav,body.light #v80nav{background:#e9eef2!important;color:#27313b!important;border-color:#d4dde5!important}
html.octopus-light #v80nav button,body.light #v80nav button{color:#56616f!important;opacity:1!important}
html.octopus-light #v80nav button *,body.light #v80nav button *{opacity:1!important}
html.octopus-light #v80nav button:hover,body.light #v80nav button:hover{background:#e0e7ed!important;color:#2d3742!important}
html.octopus-light #v80nav button.active,html.octopus-light #v80nav .v815item.active,body.light #v80nav button.active,body.light #v80nav .v815item.active{background:#dce4f2!important;color:#2e406e!important;border-color:transparent!important;box-shadow:inset 3px 0 #6683df!important}
html.octopus-light #v80nav .v815gh,body.light #v80nav .v815gh{color:#37424e!important;opacity:1!important}
html.octopus-light #v80nav .v815gh small,body.light #v80nav .v815gh small{color:#7e8996!important;opacity:1!important}
html.octopus-light #v80nav .v815no,body.light #v80nav .v815no{background:#dbe3ea!important;color:#788492!important}
html.octopus-light #v80nav .oct-l-brand-title,body.light #v80nav .oct-l-brand-title{color:#28323d!important;opacity:1!important;text-shadow:none!important}
html.octopus-light #v80nav .oct-l-brand-sub,body.light #v80nav .oct-l-brand-sub{color:#8290a0!important;opacity:1!important}
html.octopus-light #v80nav .oct-l-brand-mark,body.light #v80nav .oct-l-brand-mark{background:#5f7cf0!important;color:#fff!important;border-color:#5f7cf0!important;box-shadow:none!important;opacity:1!important}
html.octopus-light #v80nav .oct-l-tenant-card,body.light #v80nav .oct-l-tenant-card{background:#f2f5f7!important;border-color:#d8e0e7!important;color:#34404c!important;box-shadow:0 1px 2px rgba(35,47,61,.025)!important;opacity:1!important}
html.octopus-light #v80nav .oct-l-tenant-card *,body.light #v80nav .oct-l-tenant-card *{opacity:1!important}
html.octopus-light #v80nav .oct-l-tenant-name,body.light #v80nav .oct-l-tenant-name{color:#394653!important}
html.octopus-light #v80nav .oct-l-tenant-sub,body.light #v80nav .oct-l-tenant-sub{color:#8693a0!important}
html.octopus-light #v80nav .oct-l-tenant-mark,body.light #v80nav .oct-l-tenant-mark{background:#e1e8ee!important;color:#536577!important;border-color:#d9e2e9!important;box-shadow:none!important}
html.octopus-light #v80nav .oct-l-user-card,body.light #v80nav .oct-l-user-card{background:#e3e9ee!important;border-color:#cbd6df!important;color:#29343f!important;box-shadow:none!important;opacity:1!important}
html.octopus-light #v80nav .oct-l-user-card *,body.light #v80nav .oct-l-user-card *{opacity:1!important}
html.octopus-light #v80nav .oct-l-user-name,body.light #v80nav .oct-l-user-name{color:#26313c!important}
html.octopus-light #v80nav .oct-l-user-sub,body.light #v80nav .oct-l-user-sub{color:#84919e!important}
html.octopus-light #v80nav .oct-l-user-mark,body.light #v80nav .oct-l-user-mark{background:#356b96!important;color:#fff!important;border-color:#356b96!important;box-shadow:none!important}
html.octopus-light #v80nav .oct-l-user-more,body.light #v80nav .oct-l-user-more{color:#93a2b2!important}
`}
function leaves(root){return [...root.querySelectorAll('*')].filter(el=>!el.children.length&&el.textContent.trim())}
function textLeaf(root,re){return leaves(root).find(el=>re.test(el.textContent.trim()))||null}
function cardFor(el,minH=58,maxH=150){const nav=document.getElementById('v80nav');if(!el||!nav)return null;let p=el.parentElement,best=null;while(p&&p!==nav){const r=p.getBoundingClientRect();if(r.width>180&&r.height>=minH&&r.height<=maxH)best=p;p=p.parentElement}return best}
function squareIn(card){if(!card)return null;const all=[...card.querySelectorAll('div,span')];return all.find(el=>{const r=el.getBoundingClientRect();return r.width>=32&&r.width<=90&&r.height>=32&&r.height<=90&&Math.abs(r.width-r.height)<12})||null}
function clear(nav){nav.querySelectorAll('.oct-l-brand-title,.oct-l-brand-sub,.oct-l-brand-mark,.oct-l-tenant-card,.oct-l-tenant-name,.oct-l-tenant-sub,.oct-l-tenant-mark,.oct-l-user-card,.oct-l-user-name,.oct-l-user-sub,.oct-l-user-mark,.oct-l-user-more').forEach(el=>el.classList.remove('oct-l-brand-title','oct-l-brand-sub','oct-l-brand-mark','oct-l-tenant-card','oct-l-tenant-name','oct-l-tenant-sub','oct-l-tenant-mark','oct-l-user-card','oct-l-user-name','oct-l-user-sub','oct-l-user-mark','oct-l-user-more'))}
function mark(){css();const nav=document.getElementById('v80nav');if(!nav)return;clear(nav);if(!light())return;
 const brand=textLeaf(nav,/^Octopus$/i);if(brand){brand.classList.add('oct-l-brand-title');const sub=textLeaf(nav,/Release User Portal/i);sub?.classList.add('oct-l-brand-sub');const block=cardFor(brand,52,125)||brand.parentElement?.parentElement;const markEl=squareIn(block);markEl?.classList.add('oct-l-brand-mark')}
 const tenantSub=textLeaf(nav,/Partner Plan|内容制作方|Content Partner/i),tenantName=tenantSub?textLeaf(nav,/影业|传媒|内容|Studio|Media|Pictures/i):null;const tenantCard=cardFor(tenantSub||tenantName,70,150);if(tenantCard){tenantCard.classList.add('oct-l-tenant-card');tenantName?.classList.add('oct-l-tenant-name');tenantSub?.classList.add('oct-l-tenant-sub');squareIn(tenantCard)?.classList.add('oct-l-tenant-mark')}
 const userName=textLeaf(nav,/^Suzy Wang$/i),userCard=cardFor(userName,70,145);if(userCard){userCard.classList.add('oct-l-user-card');userName?.classList.add('oct-l-user-name');const userLeaves=leaves(userCard);userLeaves.find(x=>/制作方管理员|全部项目|Administrator|All projects/i.test(x.textContent.trim()))?.classList.add('oct-l-user-sub');squareIn(userCard)?.classList.add('oct-l-user-mark');userLeaves.find(x=>/^\.\.\.$/.test(x.textContent.trim())||x.textContent.trim()==='•••')?.classList.add('oct-l-user-more')}
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;mark()})}
window.addEventListener('hashchange',schedule);window.addEventListener('pageshow',schedule);window.addEventListener('resize',schedule);window.addEventListener('octopus-language-change',()=>setTimeout(schedule,80));window.addEventListener('storage',e=>{if(e.key===THEME_KEY)schedule()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(schedule,120),{once:true});else setTimeout(schedule,120);setTimeout(schedule,650);
window.OctopusLightShellContrast={apply:mark,version:'1.0'};
})();