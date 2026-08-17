(()=>{'use strict';
const ROUTE='release.watermark',ROOT='pageRoot',STORE='octopus-watermark-jobs-v1';
const selected={ready:new Set(),done:new Set()};
let scheduled=false;
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const active=()=>route()===ROUTE;
const read=()=>{try{const x=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
const write=x=>localStorage.setItem(STORE,JSON.stringify(x));
function css(){if(document.getElementById('wmk-layout-v2-css'))return;const s=document.createElement('style');s.id='wmk-layout-v2-css';s.textContent=`
#${ROOT} .wmk-page>.wmk-kpis,#${ROOT} .wmk-page>.wmk-insight{display:none!important}
#${ROOT} .wmk-stack{gap:18px!important}
#${ROOT} .wmk-card{border-radius:15px!important;background:var(--panel)!important}
#${ROOT} .wmk-head{align-items:flex-start!important;padding:18px 18px 16px!important;gap:20px!important}
#${ROOT} .wmk-head>div:first-child{min-width:280px;flex:1}
#${ROOT} .wmk-head h2{font-size:15px!important;line-height:1.3!important}
#${ROOT} .wmk-head p{max-width:720px;margin-top:7px!important;font-size:11px!important;line-height:1.6!important}
#${ROOT} .wmk-v2-note{display:inline-flex;align-items:center;max-width:720px;margin-top:10px;padding:7px 10px;border:1px solid color-mix(in srgb,#6683df 45%,var(--line));border-radius:8px;background:color-mix(in srgb,#6683df 8%,var(--panel));color:var(--soft);font-size:10px;line-height:1.45}
#${ROOT} .wmk-v2-note b{margin-right:6px;color:var(--text);font-weight:700}
#${ROOT} .wmk-v2-headright{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;max-width:650px}
#${ROOT} .wmk-v2-stat{display:flex;align-items:center;justify-content:center;gap:7px;height:38px;padding:0 12px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--soft);font-size:10px;white-space:nowrap}
#${ROOT} .wmk-v2-stat b{color:var(--text);font-size:11px}
#${ROOT} .wmk-v2-stat.selection b{color:#9fb2ff}
#${ROOT} .wmk-v2-headright .wmk-btn{height:38px!important;border-radius:9px!important;padding:0 13px!important;font-size:10px!important}
#${ROOT} .wmk-tools{grid-template-columns:minmax(360px,1fr) 180px!important;gap:10px!important;padding:12px 14px!important;background:transparent!important}
#${ROOT} .wmk-tools.single{grid-template-columns:1fr 180px!important}
#${ROOT} .wmk-tools input,#${ROOT} .wmk-tools select{height:38px!important;border-radius:8px!important;font-size:10px!important}
#${ROOT} .wmk-table th,#${ROOT} .wmk-table td{font-size:10px!important}
#${ROOT} .wmk-table th:first-child,#${ROOT} .wmk-table td:first-child{width:38px;padding-left:16px!important;padding-right:4px!important}
#${ROOT} .wmk-v2-check{width:14px;height:14px;accent-color:#6683df;cursor:pointer}
#${ROOT} .wmk-foot{font-size:10px!important}
@media(max-width:1050px){#${ROOT} .wmk-head{flex-direction:column!important}#${ROOT} .wmk-v2-headright{max-width:none;width:100%;justify-content:flex-start}}
@media(max-width:720px){#${ROOT} .wmk-tools,#${ROOT} .wmk-tools.single{grid-template-columns:1fr!important}#${ROOT} .wmk-v2-headright{display:grid;grid-template-columns:1fr 1fr}#${ROOT} .wmk-v2-stat,#${ROOT} .wmk-v2-headright .wmk-btn{width:100%}}
`;document.head.appendChild(s)}
function taskId(row,kind){if(kind==='ready')return row.querySelector('[data-wmk-edit]')?.dataset.wmkEdit||'';return row.querySelector('[data-wmk-result]')?.dataset.wmkResult||row.querySelector('[data-wmk-redo]')?.dataset.wmkRedo||''}
function injectChecks(card,kind){const table=card.querySelector('.wmk-table');if(!table)return;const headRow=table.querySelector('thead tr');if(headRow&&!headRow.querySelector('[data-wmk-v2-all]')){const th=document.createElement('th');th.innerHTML=`<input class="wmk-v2-check" type="checkbox" data-wmk-v2-all="${kind}" aria-label="全选">`;headRow.insertBefore(th,headRow.firstChild)}
 table.querySelectorAll('tbody tr').forEach(row=>{if(row.querySelector('[data-wmk-v2-one]'))return;const id=taskId(row,kind);if(!id){const only=row.children.length===1?row.firstElementChild:null;if(only?.hasAttribute('colspan'))only.setAttribute('colspan',String((Number(only.getAttribute('colspan'))||9)+1));return}const td=document.createElement('td');td.innerHTML=`<input class="wmk-v2-check" type="checkbox" data-wmk-v2-one="${kind}" data-id="${id}" aria-label="选择 ${id}">`;row.insertBefore(td,row.firstChild);td.querySelector('input').checked=selected[kind].has(id)});
 const all=table.querySelector(`[data-wmk-v2-all="${kind}"]`);const boxes=[...table.querySelectorAll(`[data-wmk-v2-one="${kind}"]`)];if(all){const checked=boxes.filter(x=>x.checked).length;all.checked=boxes.length>0&&checked===boxes.length;all.indeterminate=checked>0&&checked<boxes.length}}
function header(card,kind,stats){const head=card.querySelector('.wmk-head');if(!head)return;const left=head.firstElementChild;if(!left)return;const old=head.querySelector('.wmk-head-right');old?.remove();let note=left.querySelector('.wmk-v2-note');if(!note){note=document.createElement('div');note.className='wmk-v2-note';left.appendChild(note)}
 const right=document.createElement('div');right.className='wmk-v2-headright';right.dataset.wmkV2Head=kind;
 if(kind==='ready'){
  note.innerHTML='<b>水印规则</b>模板根据目标频道自动匹配，压制前可调整安全区、位置与透明度。';
  right.innerHTML=`<span class="wmk-v2-stat">可压制水印 <b>${stats.ready}</b></span><span class="wmk-v2-stat">压制中 <b>${stats.running}</b></span><span class="wmk-v2-stat selection">已选择 <b data-wmk-v2-selected="ready">${selected.ready.size}</b> 条</span><button class="wmk-btn" type="button" data-wmk-v2-localization>查看译配结果</button><button class="wmk-btn primary" type="button" data-wmk-v2-batch-ready>批量开始压制</button>`;
 }else{
  note.innerHTML='<b>结果规则</b>这里只展示质检通过的水印成片，可预览、重新压制或继续进入 AI 标题生成。';
  right.innerHTML=`<span class="wmk-v2-stat">已压制水印 <b>${stats.done}</b></span><span class="wmk-v2-stat">今日完成 <b>${stats.today}</b></span><span class="wmk-v2-stat selection">已选择 <b data-wmk-v2-selected="done">${selected.done.size}</b> 条</span><button class="wmk-btn" type="button" data-wmk-v2-batch-redo>批量重新压制</button><button class="wmk-btn primary" type="button" data-wmk-v2-batch-title>批量进入 AI 标题</button>`;
 }
 head.appendChild(right)}
function normalizeTools(card,kind){const tools=card.querySelector('.wmk-tools');if(!tools)return;tools.classList.remove('single');const input=tools.querySelector('input');const select=tools.querySelector('select');if(input)input.placeholder=kind==='ready'?'搜索剧集、频道、译配版本或水印模板':'搜索已压制剧集、频道、版本或模板';if(!select&&kind==='done'){const s=document.createElement('select');s.innerHTML='<option>全部完成时间</option><option>今日完成</option><option>近 3 天</option>';s.dataset.wmkV2DoneFilter='1';tools.appendChild(s)}}
function enhance(){scheduled=false;if(!active())return;css();const root=document.getElementById(ROOT),page=root?.querySelector('.wmk-page');if(!page)return;const cards=[...page.querySelectorAll('.wmk-stack>.wmk-card')];if(cards.length<2)return;const a=read(),done=a.filter(x=>x.status==='质检通过'),ready=a.filter(x=>x.status!=='质检通过'),running=ready.filter(x=>String(x.status).includes('压制中')).length,today=done.filter(x=>String(x.finishedAt||'').startsWith('08-17')).length;const stats={ready:ready.length,running,done:done.length,today};header(cards[0],'ready',stats);header(cards[1],'done',stats);normalizeTools(cards[0],'ready');normalizeTools(cards[1],'done');injectChecks(cards[0],'ready');injectChecks(cards[1],'done');page.dataset.watermarkLayout='task-workspace-v2'}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)}
function rerender(msg){window.OctopusWatermarkWorkspace?.render?.();schedule();if(msg)window.toast?.(msg)}
function changeOne(kind,id,checked){checked?selected[kind].add(id):selected[kind].delete(id);schedule()}
document.addEventListener('change',e=>{if(!active())return;const t=e.target instanceof Element?e.target:null;if(!t)return;const one=t.closest('[data-wmk-v2-one]');if(one){changeOne(one.dataset.wmkV2One,one.dataset.id,one.checked);return}const all=t.closest('[data-wmk-v2-all]');if(all){const kind=all.dataset.wmkV2All;document.querySelectorAll(`[data-wmk-v2-one="${kind}"]`).forEach(x=>{x.checked=all.checked;changeOne(kind,x.dataset.id,all.checked)});schedule()}},true);
document.addEventListener('click',e=>{if(!active())return;const t=e.target instanceof Element?e.target:null;if(!t)return;
 if(t.closest('[data-wmk-v2-localization]')){e.preventDefault();location.hash='#/production/localization';return}
 if(t.closest('[data-wmk-v2-batch-ready]')){e.preventDefault();if(!selected.ready.size){window.toast?.('请先选择需要压制水印的视频');return}const a=read();a.forEach(x=>{if(selected.ready.has(x.id)&&x.status!=='质检通过')x.status='压制中 1%'});write(a);selected.ready.clear();rerender('已将选中视频加入水印压制队列');return}
 if(t.closest('[data-wmk-v2-batch-redo]')){e.preventDefault();if(!selected.done.size){window.toast?.('请先选择需要重新压制的成片');return}const a=read();a.forEach(x=>{if(selected.done.has(x.id)){x.status='待压制';x.finishedAt=''}});write(a);selected.done.clear();rerender('已将选中成片退回可压制水印列表');return}
 if(t.closest('[data-wmk-v2-batch-title]')){e.preventDefault();if(!selected.done.size){window.toast?.('请先选择要进入 AI 标题生成的成片');return}const ids=[...selected.done];localStorage.setItem('octopus-watermark-title-handoff-v1',JSON.stringify({ids,at:Date.now()}));selected.done.clear();location.hash='#/release/titles';return}
},true);
window.addEventListener('hashchange',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});schedule();
window.OctopusWatermarkTableLayout={ensure:schedule,version:'2.0'};
})();