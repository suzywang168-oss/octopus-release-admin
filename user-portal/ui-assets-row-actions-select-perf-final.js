(()=>{
'use strict';
const ROOT='pageRoot',LANG_KEY='octopus-user-v7-language',STYLE_ID='octopus-assets-row-actions-select-perf-final';
let scheduled=false;
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const en=()=>localStorage.getItem(LANG_KEY)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');
function installStyle(){
 let s=document.getElementById(STYLE_ID);if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}
 s.textContent=`
 #${ROOT} .aaf-actions.oaf-row-actions,#${ROOT} .oaf-row-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:7px!important;min-width:224px!important;visibility:visible!important;opacity:1!important}
 #${ROOT} .aaf-action.oaf-row-btn,#${ROOT} .oaf-row-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:30px!important;min-width:82px!important;padding:0 10px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--panel2)!important;color:var(--text)!important;font-size:8px!important;font-weight:720!important;line-height:1!important;white-space:nowrap!important;cursor:pointer!important;pointer-events:auto!important;visibility:visible!important;opacity:1!important}
 #${ROOT} .aaf-action.oaf-row-btn.primary,#${ROOT} .oaf-row-btn.primary{border-color:color-mix(in srgb,#6683df 48%,var(--line))!important;background:color-mix(in srgb,#6683df 10%,var(--panel))!important;color:#9fb2ff!important}
 #${ROOT} .aaf-action.oaf-row-btn:hover,#${ROOT} .oaf-row-btn:hover{border-color:#6683df!important;background:color-mix(in srgb,#6683df 12%,var(--panel))!important;color:var(--text)!important}
 #${ROOT} .atw-table th:last-child,#${ROOT} .atw-table td:last-child{min-width:240px!important;width:240px!important;text-align:right!important;overflow:visible!important}
 #${ROOT} .oip-native-version{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;overflow:hidden!important;clip-path:inset(50%)!important}
 #${ROOT} .oip-version-wrap{display:grid!important;gap:8px!important}
 #${ROOT} .oip-version-options{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
 #${ROOT} .oip-version-choice{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;min-height:40px!important;padding:0 12px!important;border:1px solid var(--line)!important;border-radius:9px!important;background:var(--panel2)!important;color:var(--text)!important;font-size:9px!important;font-weight:700!important;text-align:left!important;cursor:pointer!important;transition:border-color .12s ease,background .12s ease,box-shadow .12s ease!important}
 #${ROOT} .oip-version-choice:after{content:'';flex:0 0 auto;width:7px;height:7px;border:1px solid var(--soft);border-radius:50%}
 #${ROOT} .oip-version-choice.active{border-color:#6683df!important;background:color-mix(in srgb,#6683df 12%,var(--panel))!important;box-shadow:0 0 0 2px color-mix(in srgb,#6683df 8%,transparent)!important}
 #${ROOT} .oip-version-choice.active:after{border-color:#6683df;background:#6683df;box-shadow:0 0 0 3px color-mix(in srgb,#6683df 15%,transparent)}
 #${ROOT} .oip-version-note{color:var(--soft)!important;font-size:7px!important;line-height:1.45!important}
 html.octopus-light #${ROOT} .aaf-action.oaf-row-btn,html.octopus-light #${ROOT} .oaf-row-btn{background:#eef2f5!important;border-color:#d6dde4!important;color:#4d5660!important}
 html.octopus-light #${ROOT} .aaf-action.oaf-row-btn.primary,html.octopus-light #${ROOT} .oaf-row-btn.primary{background:#e9edf8!important;border-color:#cbd5ef!important;color:#4f63b4!important}
 html.octopus-light #${ROOT} .oip-version-choice{background:#eef2f5!important;border-color:#d6dde4!important;color:#353b43!important}
 html.octopus-light #${ROOT} .oip-version-choice.active{background:#e6eaf5!important;border-color:#9eaddb!important}
 @media(max-width:760px){#${ROOT} .oip-version-options{grid-template-columns:1fr!important}#${ROOT} .oaf-row-actions{min-width:0!important;flex-wrap:wrap!important}}
 `;
}
function actionLabels(material){
 if(material)return en()?['View asset','View series','Download']:['查看素材','查看剧集','下载'];
 return en()?['View profile','Download profile']:['查看档案','下载档案'];
}
function ensureButton(button,label,datasetName,primary=false){
 if(!button)return;
 button.type='button';button.classList.add('aaf-action','oaf-row-btn');if(primary)button.classList.add('primary');
 if(label&&button.textContent!==label)button.textContent=label;
 if(datasetName&&!button.hasAttribute(datasetName))button.setAttribute(datasetName,'');
}
function repairAssetActions(){
 if(route()!=='system.assets')return;
 const page=document.querySelector(`#${ROOT} .atw-page`),table=page?.querySelector('.atw-table');if(!table)return;
 const heads=[...table.querySelectorAll('thead th')];if(!heads.length)return;
 const material=heads.length>=11,labels=actionLabels(material),lastHead=heads.at(-1);
 if(lastHead&&lastHead.textContent!==(en()?'Actions':'操作'))lastHead.textContent=en()?'Actions':'操作';
 table.querySelectorAll('tbody tr').forEach(tr=>{
   const td=tr.cells?.[tr.cells.length-1];if(!td)return;
   let wrap=td.querySelector('.aaf-actions,.oaf-row-actions');
   if(!wrap){
     wrap=document.createElement('div');wrap.className='aaf-actions oaf-row-actions';
     if(material){wrap.innerHTML='<button></button><button></button><button></button>'}else{wrap.innerHTML='<button></button><button></button>'}
     td.replaceChildren(wrap);
   }else wrap.classList.add('oaf-row-actions');
   const bs=[...wrap.querySelectorAll('button')];
   if(material){
     while(bs.length<3){const b=document.createElement('button');wrap.appendChild(b);bs.push(b)}
     ensureButton(bs[0],labels[0],'data-aaf-view-asset',true);ensureButton(bs[1],labels[1],'data-aaf-view-series');ensureButton(bs[2],labels[2],'data-aaf-download');
   }else{
     while(bs.length<2){const b=document.createElement('button');wrap.appendChild(b);bs.push(b)}
     ensureButton(bs[0],labels[0],'data-aaf-view-partner',true);ensureButton(bs[1],labels[1],'data-aaf-download-profile-row');
     bs.slice(2).forEach(b=>b.remove());
   }
 });
}
function enhanceVersionSelector(){
 const modal=document.querySelector(`#${ROOT} .orw-modal`);if(!modal)return;
 const select=modal.querySelector('select[data-orw-version]');if(!select||select.dataset.oipEnhanced==='1')return;
 select.dataset.oipEnhanced='1';select.classList.add('oip-native-version');
 const wrap=document.createElement('div');wrap.className='oip-version-wrap';
 const options=document.createElement('div');options.className='oip-version-options';
 [...select.options].forEach((opt,index)=>{
   const b=document.createElement('button');b.type='button';b.className='oip-version-choice'+(select.value===opt.value||(!select.value&&index===0)?' active':'');
   b.dataset.oipVersion=opt.value;b.textContent=opt.textContent;options.appendChild(b);
 });
 const note=document.createElement('div');note.className='oip-version-note';note.textContent=en()?'Choose the version directly. The page is not rebuilt.':'直接选择版本，不打开原生下拉，也不会重绘页面。';
 wrap.append(options,note);select.insertAdjacentElement('afterend',wrap);
}
function syncVersionChoice(button){
 const modal=button.closest('.orw-modal'),select=modal?.querySelector('select[data-orw-version]');if(!select)return;
 select.value=button.dataset.oipVersion||'';
 modal.querySelectorAll('.oip-version-choice').forEach(b=>b.classList.toggle('active',b===button));
}
function apply(){scheduled=false;installStyle();repairAssetActions();enhanceVersionSelector()}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply)}
document.addEventListener('pointerdown',e=>{
 const b=e.target instanceof Element?e.target.closest('.oip-version-choice'):null;if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();syncVersionChoice(b);
},true);
document.addEventListener('click',e=>{
 const t=e.target instanceof Element?e.target:null;if(!t)return;
 if(t.closest('[data-atw-asset-tab]'))setTimeout(schedule,0);
},true);
window.addEventListener('hashchange',schedule);window.addEventListener('octopus-language-change',()=>{schedule();setTimeout(schedule,80)});window.addEventListener('storage',e=>{if(e.key===LANG_KEY)schedule()});
const boot=()=>{const root=document.getElementById(ROOT);if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});schedule()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
setTimeout(schedule,350);setTimeout(schedule,1000);
})();
