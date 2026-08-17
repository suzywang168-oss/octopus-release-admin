(()=>{
'use strict';
const STYLE='octopus-runtime-stability-v2';
const OWNED=new Set([
 'overview',
 'operations.channel-analysis','operations.ad-intelligence',
 'production.content','production.localization',
 'release.watermark','release.titles','release.covers','release.review','release.distribution',
 'dashboard.series','dashboard.channels','dashboard.external','dashboard.risk',
 'system.assets','system.templates','system.roles'
]);
const QUIET_OBSERVERS=new Set([
 'ui-navigation-action-cleanup.js','ui-interaction-fix-v816.js','ui-shell-alignment-fix.js',
 'ui-global-module-layout.js','ui-layout-v2.js','ui-layout-spacing-fix.js',
 'ui-generation-workspace-v3.js','ui-title-layout-stability.js','ui-route-title-normalizer.js','ui-action-placement-final.js'
]);
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const scriptName=()=>{try{return new URL(document.currentScript?.src||'',location.href).pathname.split('/').pop()}catch{return ''}};
function css(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
.ota-toolbar .workspace{display:none!important}
.ota-toolbar>#octopusGlobalTitleSlot{display:block!important;min-width:0!important}
html.oct-route-switching #pageRoot,html.oct-route-switching #pageRoot *{transition:none!important;animation:none!important}
`}
css();

const NativeMO=window.MutationObserver;
if(NativeMO&&!window.__octopusStableMutationObserver){
 class StableMutationObserver{
  constructor(callback){
   this.owner=scriptName();
   const owner=this.owner;
   this.native=new NativeMO((records,observer)=>{
    if(owner==='portal-architecture-v815.js'&&OWNED.has(route()))return;
    callback(records,observer);
   });
  }
  observe(target,options){
   const whole=(target===document.documentElement||target===document.body||options?.subtree);
   if(whole&&QUIET_OBSERVERS.has(this.owner))return;
   return this.native.observe(target,options);
  }
  disconnect(){return this.native.disconnect()}
  takeRecords(){return this.native.takeRecords()}
 }
 window.MutationObserver=StableMutationObserver;
 window.__octopusStableMutationObserver=true;
}

const nativeAdd=window.addEventListener.bind(window);
if(!window.__octopusStableWindowEvents){
 window.addEventListener=function(type,listener,options){
  const owner=scriptName();
  if(owner==='portal-architecture-v815.js'&&type==='hashchange'&&typeof listener==='function'){
   return nativeAdd(type,function(ev){if(OWNED.has(route())||ev?.octopusLayoutOnly)return;return listener.call(this,ev)},options);
  }
  if(owner==='ui-action-placement-final.js'&&type==='pointerdown')return;
  /* v7 only paints the watermark workspace. Stable interactions below own all user events. */
  if(owner==='ui-watermark-single-workspace-v7.js'&&['pointerdown','input','change','hashchange','octopus-owned-route-change','pageshow'].includes(type))return;
  return nativeAdd(type,listener,options);
 };
 window.__octopusStableWindowEvents=true;
}

const nativeTimeout=window.setTimeout.bind(window);
if(!window.__octopusStableTimeout){
 window.setTimeout=function(fn,delay,...args){
  const owner=scriptName();
  if(owner==='portal-architecture-v815.js'&&Number(delay)>=400&&typeof fn==='function'){
   return nativeTimeout(()=>{if(!OWNED.has(route()))fn(...args)},delay);
  }
  return nativeTimeout(fn,delay,...args);
 };
 window.__octopusStableTimeout=true;
}

nativeAdd('click',e=>{
 const api=window.OctopusSystemManagementDialogs;if(!api)return;
 const target=e.target instanceof Element?e.target.closest('button,a,[role="button"],[data-oct-system-action],[data-a]'):null;if(!target)return;
 const internal=target.closest?.('#octopusSystemManagementDialog [data-smd-action]');
 if(internal){const action=internal.dataset.smdAction||'';if(api.handleInternal?.(action,internal)){e.preventDefault();e.stopImmediatePropagation()}return}
 const kind=api.detectTrigger?.(target);if(!kind)return;
 e.preventDefault();e.stopImmediatePropagation();api.open?.(kind,target);
},true);

/* Stable, local-only watermark interactions. Never replace #pageRoot after the first paint. */
const WM_VIDEO='octopus-watermark-videos-v3',WM_JOB='octopus-watermark-jobs-v3';
let wmTab='ready',wmQuery='',wmFilter='all',wmSelected=new Set();
const wmRead=k=>{try{const a=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(a)?a:[]}catch{return[]}};
const wmVideos=()=>wmRead(WM_VIDEO),wmJobs=()=>wmRead(WM_JOB),wmSave=a=>localStorage.setItem(WM_JOB,JSON.stringify(a));
const wmEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function wmVisibleVideos(){const js=wmJobs();return wmVideos().filter(v=>{const hit=!wmQuery||[v.id,v.series,v.version,v.lang].join(' ').toLowerCase().includes(wmQuery.toLowerCase());if(!hit)return false;const a=js.filter(x=>x.videoId===v.id);if(wmFilter==='none')return !a.length;if(wmFilter==='multi')return a.length>=2;if(wmFilter==='running')return a.some(x=>String(x.status).includes('压制中'));return true})}
function wmVisibleDone(){const js=wmJobs();return js.filter(x=>x.status==='质检通过').filter(x=>{const hit=!wmQuery||[x.id,x.videoId,x.series,x.version,x.channel,x.template].join(' ').toLowerCase().includes(wmQuery.toLowerCase());if(!hit)return false;if(wmFilter==='multi')return js.filter(y=>y.status==='质检通过'&&y.videoId===x.videoId).length>=2;if(wmFilter==='today')return String(x.finishedAt||'').startsWith('08-17');return true})}
function wmLast(videoId){const a=wmJobs().filter(x=>x.videoId===videoId);return a[a.length-1]||null}
function wmReadyRows(){const list=wmVisibleVideos(),js=wmJobs();if(!list.length)return '<tr><td colspan="10"><div class="wm4-empty">没有符合条件的可压制视频</div></td></tr>';return list.map(v=>{const a=js.filter(x=>x.videoId===v.id),last=wmLast(v.id);return `<tr><td><input type="checkbox" data-wm7-check="${v.id}" ${wmSelected.has(v.id)?'checked':''}></td><td>${wmEsc(v.id)}</td><td><b>${wmEsc(v.series)}</b></td><td>${wmEsc(v.version)}</td><td>${wmEsc(v.lang)}</td><td>${wmEsc(v.duration)}</td><td><span class="wm4-count"><b>${a.length}</b> 套</span></td><td>${last?`<span class="wm4-status ${last.status==='质检通过'?'done':String(last.status).includes('压制中')?'run':''}">${wmEsc(last.status)}</span>`:'<span style="color:var(--soft)">尚未添加</span>'}</td><td>TK / YT / FB</td><td><div class="wm4-row-actions"><button class="wm4-btn ghost" data-wm7-preview="${v.id}">预览</button><button class="wm4-btn" data-wm7-manage="${v.id}">管理水印</button></div></td></tr>`}).join('')}
function wmDoneRows(){const list=wmVisibleDone();if(!list.length)return '<tr><td colspan="10"><div class="wm4-empty">暂无符合条件的已压制水印</div></td></tr>';return list.map(x=>`<tr><td>${wmEsc(x.id)}</td><td>${wmEsc(x.videoId)}</td><td><b>${wmEsc(x.series)}</b></td><td>${wmEsc(x.version)}</td><td>${wmEsc(x.channel)}</td><td><button class="wm4-thumb" data-wm7-result="${x.id}"><video muted preload="metadata" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video></button></td><td>${wmEsc(x.template)}</td><td><span class="wm4-status done">质检通过</span></td><td>${wmEsc(x.finishedAt||'刚刚')}</td><td><div class="wm4-row-actions"><button class="wm4-btn" data-wm7-result="${x.id}">查看结果</button><button class="wm4-btn ghost" data-wm7-title="${x.id}">进入 AI 标题</button></div></td></tr>`).join('')}
function wmTable(){if(wmTab==='ready')return `<div class="wm4-wrap"><table class="wm4-table"><thead><tr><th><input type="checkbox" data-wm7-all></th><th>视频 ID</th><th>剧集</th><th>译配视频版本</th><th>语种</th><th>时长</th><th>已添加水印</th><th>最近状态</th><th>可添加渠道</th><th>操作</th></tr></thead><tbody>${wmReadyRows()}</tbody></table></div><footer class="wm4-foot"><span>共 ${wmVisibleVideos().length} 条可压制视频</span><span>‹　1　›</span></footer>`;return `<div class="wm4-wrap"><table class="wm4-table"><thead><tr><th>水印任务 ID</th><th>来源视频</th><th>剧集</th><th>译配版本</th><th>目标频道</th><th>水印成片</th><th>水印模板</th><th>质检状态</th><th>完成时间</th><th>操作</th></tr></thead><tbody>${wmDoneRows()}</tbody></table></div><footer class="wm4-foot"><span>共 ${wmVisibleDone().length} 条已压制水印</span><span>‹　1　›</span></footer>`}
function wmFilterOptions(){return wmTab==='ready'?'<option value="all">全部视频</option><option value="none">尚未添加水印</option><option value="multi">已有多套水印</option><option value="running">存在压制中任务</option>':'<option value="all">全部结果</option><option value="today">今日完成</option><option value="multi">同视频多水印</option>'}
function wmSyncSelection(){const n=wmSelected.size;document.querySelectorAll('[data-wm7-selected],[data-wm7-selected-kpi]').forEach(x=>x.textContent=n);const b=document.querySelector('[data-wm7-add]');if(b)b.disabled=!n;const all=document.querySelector('[data-wm7-all]');if(all){const a=wmVisibleVideos();all.checked=!!a.length&&a.every(v=>wmSelected.has(v.id));all.indeterminate=a.some(v=>wmSelected.has(v.id))&&!all.checked}}
function wmUpdateKpis(){const cards=[...document.querySelectorAll('#pageRoot .wm4-kpi b')],js=wmJobs();if(cards[0])cards[0].textContent=wmVideos().length;if(cards[1])cards[1].textContent=wmSelected.size;if(cards[2])cards[2].textContent=js.filter(x=>String(x.status).includes('压制中')).length;if(cards[3])cards[3].textContent=js.filter(x=>x.status==='质检通过').length}
function wmRefreshTable(){const host=document.querySelector('[data-wm7-table]');if(host)host.innerHTML=wmTable();wmSyncSelection();wmUpdateKpis()}
function wmApplyTab(next,filter='all'){
 wmTab=next;wmFilter=filter;wmQuery='';wmSelected.clear();
 document.querySelectorAll('[data-wm7-tab]').forEach(b=>b.classList.toggle('active',b.dataset.wm7Tab===wmTab));
 const p=document.querySelector('#pageRoot .wm4-copy p');if(p)p.textContent=wmTab==='ready'?'先从译配成片中选择视频，再添加一套或多套频道水印。一个视频可以对应多个水印任务。':'按水印任务展示已完成成片，同一个来源视频可以出现多次，对应不同频道或水印模板。';
 const note=document.querySelector('#pageRoot .wm4-note');if(note)note.innerHTML=wmTab==='ready'?'<b>业务规则</b>选择视频是第一步，添加时支持一次配置多套水印。':'<b>业务规则</b>每一条记录代表一个独立水印成片，可继续进入 AI 标题生成。';
 document.querySelectorAll('[data-wm7-selected],[data-wm7-localization],[data-wm7-add]').forEach(x=>x.style.display=wmTab==='ready'?'':'none');
 const search=document.querySelector('[data-wm7-search]');if(search){search.value='';search.placeholder=wmTab==='ready'?'搜索剧集、视频 ID、语种或译配版本':'搜索水印任务、来源视频、剧集、频道或模板'}
 const sel=document.querySelector('[data-wm7-filter]');if(sel){sel.innerHTML=wmFilterOptions();sel.value=wmFilter}
 wmRefreshTable();
}
function wmScheme(){const id='S'+Date.now()+Math.random().toString(16).slice(2,6);return `<div class="wm7-scheme" data-wm7-scheme="${id}"><label class="wm7-field">目标频道<select data-wm7-field="channel"><option>TK-US Drama</option><option>YT-English</option><option>FB-Latina</option><option>TK-Latina</option><option>FB-Global</option></select></label><label class="wm7-field">水印模板<select data-wm7-field="template"><option>US-Drama-02</option><option>YT-Minimal</option><option>Latina-01</option><option>Latina-Compact</option><option>FB-Corner-01</option></select></label><label class="wm7-field">位置 / 安全区<select data-wm7-field="position"><option>右上 · 安全区 32px</option><option>右下 · 安全区 28px</option><option>左上 · 安全区 36px</option><option>左下 · 安全区 30px</option></select></label><label class="wm7-field">透明度<input data-wm7-field="opacity" value="72%"></label><button class="wm7-remove" data-wm7-remove="${id}">×</button></div>`}
function wmCloseModal(){document.querySelector('.wm7-modal')?.remove()}
function wmOpenAdd(ids=[...wmSelected]){wmSelected=new Set(ids);const vs=wmVideos().filter(v=>wmSelected.has(v.id));if(!vs.length)return;wmCloseModal();document.getElementById('pageRoot')?.insertAdjacentHTML('beforeend',`<div class="wm7-modal"><section class="wm7-shell"><header class="wm7-head"><div><b>为已选视频添加水印</b><div style="margin-top:5px;color:var(--soft);font-size:10px">${vs.length} 个视频 · 支持为同一视频添加多套水印</div></div><button class="wm4-btn" data-wm7-close>×</button></header><div class="wm7-body"><div class="wm7-summary">${vs.map(v=>`<span class="wm7-chip"><b>${wmEsc(v.series)}</b> · ${wmEsc(v.version)}</span>`).join('')}</div><div class="wm7-section"><div><b>水印方案</b><span>　同一个视频可以添加多套方案</span></div><button class="wm4-btn" data-wm7-add-scheme>＋ 添加一套水印</button></div><div data-wm7-schemes>${wmScheme()}</div></div><footer class="wm7-foot"><button class="wm4-btn" data-wm7-close>取消</button><button class="wm4-btn primary" data-wm7-confirm>添加并开始压制</button></footer></section></div>`)}
function wmOpenPreview(id){const v=wmVideos().find(x=>x.id===id);if(!v)return;wmCloseModal();document.getElementById('pageRoot')?.insertAdjacentHTML('beforeend',`<div class="wm7-modal"><section class="wm7-shell"><header class="wm7-head"><div><b>${wmEsc(v.series)} · ${wmEsc(v.version)}</b><div style="margin-top:5px;color:var(--soft);font-size:10px">来源视频 ${v.id}</div></div><button class="wm4-btn" data-wm7-close>×</button></header><div class="wm7-body"><div class="wm7-preview"><video controls preload="metadata" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video></div></div><footer class="wm7-foot"><button class="wm4-btn" data-wm7-close>关闭</button></footer></section></div>`)}
function wmOpenManage(id){const v=wmVideos().find(x=>x.id===id),a=wmJobs().filter(x=>x.videoId===id);if(!v)return;wmCloseModal();document.getElementById('pageRoot')?.insertAdjacentHTML('beforeend',`<div class="wm7-modal"><section class="wm7-shell"><header class="wm7-head"><div><b>${wmEsc(v.series)} · 水印任务</b><div style="margin-top:5px;color:var(--soft);font-size:10px">${wmEsc(v.version)} · 当前 ${a.length} 套水印</div></div><button class="wm4-btn" data-wm7-close>×</button></header><div class="wm7-body">${a.length?a.map(x=>`<div class="wm7-job"><div><b>${wmEsc(x.channel)} · ${wmEsc(x.template)}</b><small>${x.id} · ${wmEsc(x.position)} · ${wmEsc(x.opacity)}</small></div><span class="wm4-status ${x.status==='质检通过'?'done':'run'}">${wmEsc(x.status)}</span></div>`).join(''):'<div class="wm4-empty">这个视频还没有添加水印</div>'}</div><footer class="wm7-foot"><button class="wm4-btn" data-wm7-close>关闭</button><button class="wm4-btn primary" data-wm7-add-one="${id}">继续添加水印</button></footer></section></div>`)}
function wmOpenResult(id){const x=wmJobs().find(y=>y.id===id);if(!x)return;wmCloseModal();document.getElementById('pageRoot')?.insertAdjacentHTML('beforeend',`<div class="wm7-modal"><section class="wm7-shell"><header class="wm7-head"><div><b>${wmEsc(x.series)} · ${wmEsc(x.channel)}</b><div style="margin-top:5px;color:var(--soft);font-size:10px">${x.videoId} · ${wmEsc(x.version)}</div></div><button class="wm4-btn" data-wm7-close>×</button></header><div class="wm7-body"><div class="wm7-preview watermarked"><video controls preload="metadata" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video></div><div class="wm7-summary" style="margin-top:12px"><span class="wm7-chip">模板 <b>${wmEsc(x.template)}</b></span><span class="wm7-chip">位置 <b>${wmEsc(x.position)}</b></span><span class="wm7-chip">透明度 <b>${wmEsc(x.opacity)}</b></span><span class="wm7-chip">完成 <b>${wmEsc(x.finishedAt)}</b></span></div></div><footer class="wm7-foot"><button class="wm4-btn" data-wm7-close>关闭</button><button class="wm4-btn primary" data-wm7-title="${x.id}">进入 AI 标题</button></footer></section></div>`)}
function wmConfirm(){const rows=[...document.querySelectorAll('[data-wm7-scheme]')],vs=wmVideos().filter(v=>wmSelected.has(v.id));if(!rows.length||!vs.length)return;const schemes=rows.map(r=>({channel:r.querySelector('[data-wm7-field="channel"]')?.value||'TK-US Drama',template:r.querySelector('[data-wm7-field="template"]')?.value||'US-Drama-02',position:r.querySelector('[data-wm7-field="position"]')?.value||'右上 · 安全区 32px',opacity:r.querySelector('[data-wm7-field="opacity"]')?.value||'72%'}));const a=wmJobs();let n=Math.max(3200,...a.map(x=>Number(String(x.id).replace(/\D/g,''))).filter(Number.isFinite))+1;for(const v of vs)for(const s of schemes)a.push({id:'WMK-'+n++,videoId:v.id,series:v.series,version:v.version,channel:s.channel,template:s.template,position:s.position,opacity:s.opacity,status:'压制中 1%',createdAt:'08-17 18:00'});wmSave(a);const total=vs.length*schemes.length;wmSelected.clear();wmCloseModal();wmRefreshTable();try{window.toast?.(`已生成 ${total} 个水印任务并开始压制`)}catch{}}
function wmNav(hash){if(location.hash!==hash)history.pushState(null,'',hash)}
function wmPointer(e){if(route()!=='release.watermark')return;const t=e.target instanceof Element?e.target.closest('[data-wm7-tab],[data-wm7-show-multi],[data-wm7-localization],[data-wm7-add],[data-wm7-check],[data-wm7-all],[data-wm7-preview],[data-wm7-manage],[data-wm7-result],[data-wm7-title],[data-wm7-close],[data-wm7-add-scheme],[data-wm7-remove],[data-wm7-confirm],[data-wm7-add-one]'):null;if(!t||t.disabled)return;e.preventDefault();e.stopImmediatePropagation();
 if(t.dataset.wm7Tab){wmApplyTab(t.dataset.wm7Tab);return}
 if(t.hasAttribute('data-wm7-show-multi')){wmApplyTab('done','multi');return}
 if(t.hasAttribute('data-wm7-localization')){wmNav('#/production/localization');return}
 if(t.dataset.wm7Check){wmSelected.has(t.dataset.wm7Check)?wmSelected.delete(t.dataset.wm7Check):wmSelected.add(t.dataset.wm7Check);t.checked=wmSelected.has(t.dataset.wm7Check);wmSyncSelection();wmUpdateKpis();return}
 if(t.hasAttribute('data-wm7-all')){const a=wmVisibleVideos(),yes=!a.every(v=>wmSelected.has(v.id));a.forEach(v=>yes?wmSelected.add(v.id):wmSelected.delete(v.id));wmRefreshTable();return}
 if(t.hasAttribute('data-wm7-add')){wmOpenAdd();return}
 if(t.dataset.wm7Preview){wmOpenPreview(t.dataset.wm7Preview);return}
 if(t.dataset.wm7Manage){wmOpenManage(t.dataset.wm7Manage);return}
 if(t.dataset.wm7Result){wmOpenResult(t.dataset.wm7Result);return}
 if(t.dataset.wm7Title){localStorage.setItem('octopus-watermark-title-handoff-v1',JSON.stringify({ids:[t.dataset.wm7Title],at:Date.now()}));wmNav('#/release/titles');return}
 if(t.hasAttribute('data-wm7-close')){wmCloseModal();return}
 if(t.hasAttribute('data-wm7-add-scheme')){document.querySelector('[data-wm7-schemes]')?.insertAdjacentHTML('beforeend',wmScheme());return}
 if(t.dataset.wm7Remove){const rows=document.querySelectorAll('[data-wm7-scheme]');if(rows.length<=1){try{window.toast?.('至少保留一套水印方案')}catch{}return}t.closest('[data-wm7-scheme]')?.remove();return}
 if(t.hasAttribute('data-wm7-confirm')){wmConfirm();return}
 if(t.dataset.wm7AddOne){wmOpenAdd([t.dataset.wm7AddOne]);return}
}
nativeAdd('pointerdown',wmPointer,true);
document.addEventListener('input',e=>{if(route()!=='release.watermark'||!e.target?.matches?.('[data-wm7-search]'))return;wmQuery=e.target.value;wmRefreshTable()},true);
document.addEventListener('change',e=>{if(route()!=='release.watermark'||!e.target?.matches?.('[data-wm7-filter]'))return;wmFilter=e.target.value;wmRefreshTable()},true);

function syncNav(r=route()){document.querySelectorAll('#v80nav [data-r]').forEach(b=>b.classList.toggle('active',b.dataset.r===r))}
function layoutOnly(){const ev=new Event('hashchange');try{Object.defineProperty(ev,'octopusLayoutOnly',{value:true})}catch{ev.octopusLayoutOnly=true}window.dispatchEvent(ev)}
function pokeOwners(){const r=route();try{if(r==='overview')window.OctopusOverviewCommandCenter?.ensure?.();else if(r==='production.content')window.OctopusContentWorkspace?.ensure?.();else if(r==='production.localization')window.OctopusLocalizationWorkspace?.ensure?.();else if(r==='release.watermark')window.OctopusWatermarkSingleWorkspace?.ensure?.();else if(r==='release.distribution')window.OctopusDistributionPlanner?.ensure?.();else if(/^dashboard\./.test(r))window.OctopusDashboardWorkspace?.ensure?.();else if(r==='system.assets')window.OctopusAssetsBusinessActions?.check?.()}catch{}try{window.OctopusMetricsInsightContract?.ensure?.()}catch{}try{window.OctopusTitleSingleSource?.apply?.()}catch{}try{window.OctopusBusinessNativeRestore?.apply?.()}catch{}}
function markSwitch(){document.documentElement.classList.add('oct-route-switching');nativeTimeout(()=>document.documentElement.classList.remove('oct-route-switching'),90)}

document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target.closest('[data-r]'):null;if(!t)return;const r=t.dataset.r;if(!OWNED.has(r)){markSwitch();nativeTimeout(()=>{syncNav(r);layoutOnly();requestAnimationFrame(pokeOwners)},0);return}e.preventDefault();e.stopImmediatePropagation();const oldURL=location.href,next='#/'+r.replaceAll('.','/');markSwitch();history.pushState(null,'',next);syncNav(r);const ev=typeof HashChangeEvent==='function'?new HashChangeEvent('hashchange',{oldURL,newURL:location.href}):new Event('hashchange');window.dispatchEvent(ev);window.dispatchEvent(new CustomEvent('octopus-owned-route-change',{detail:{route:r}}));requestAnimationFrame(pokeOwners);nativeTimeout(pokeOwners,60)},true);

nativeAdd('hashchange',e=>{if(e?.octopusLayoutOnly)return;markSwitch();syncNav();requestAnimationFrame(pokeOwners)});
nativeAdd('popstate',()=>{markSwitch();syncNav();if(OWNED.has(route())){window.dispatchEvent(new Event('hashchange'));window.dispatchEvent(new CustomEvent('octopus-owned-route-change',{detail:{route:route()}}))}else nativeTimeout(layoutOnly,0);requestAnimationFrame(pokeOwners)});
nativeAdd('pageshow',()=>{syncNav();requestAnimationFrame(pokeOwners)});
window.OctopusRuntimeStability={owned:OWNED,syncNav,pokeOwners,layoutOnly,version:'2.6'};
})();