(()=>{
'use strict';
const ROOT='pageRoot',STYLE='octopus-list-design-standard-v1';
function css(){
 let style=document.getElementById(STYLE);
 if(!style){style=document.createElement('style');style.id=STYLE;document.head.appendChild(style)}
 style.textContent=`
#${ROOT} table.oct-list-standard{width:100%!important;border-collapse:collapse!important;table-layout:auto!important;background:transparent!important}
#${ROOT} table.oct-list-standard thead th{height:46px!important;padding:0 14px!important;border-bottom:1px solid var(--line)!important;background:var(--panel2)!important;color:var(--soft)!important;font-size:8px!important;font-weight:650!important;line-height:1.2!important;text-align:left!important;vertical-align:middle!important;white-space:nowrap!important}
#${ROOT} table.oct-list-standard tbody td{height:58px!important;padding:0 14px!important;border-bottom:1px solid var(--line)!important;color:var(--text)!important;font-size:8.5px!important;font-weight:450!important;line-height:1.45!important;text-align:left!important;vertical-align:middle!important;white-space:nowrap!important}
#${ROOT} table.oct-list-standard tbody tr:last-child td{border-bottom:0!important}
#${ROOT} table.oct-list-standard tbody tr:hover td{background:color-mix(in srgb,var(--panel2) 48%,transparent)!important}
#${ROOT} table.oct-list-standard th.oct-list-action-cell,#${ROOT} table.oct-list-standard td.oct-list-action-cell{box-sizing:border-box!important;min-width:210px!important;width:210px!important;padding-left:14px!important;padding-right:14px!important;text-align:left!important;overflow:visible!important}
#${ROOT} table.oct-list-standard td.oct-list-action-cell>button,#${ROOT} table.oct-list-standard td.oct-list-action-cell .oct-list-actions>button{box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;height:32px!important;min-width:70px!important;margin:0!important;padding:0 12px!important;border:1px solid transparent!important;border-radius:8px!important;background:transparent!important;color:var(--soft)!important;box-shadow:none!important;font-size:8px!important;font-weight:600!important;line-height:1!important;white-space:nowrap!important;cursor:pointer!important;pointer-events:auto!important}
#${ROOT} table.oct-list-standard td.oct-list-action-cell>button:first-of-type,#${ROOT} table.oct-list-standard td.oct-list-action-cell .oct-list-actions>button:first-of-type{border-color:#4f6fae!important;background:transparent!important;color:#8daaff!important}
#${ROOT} table.oct-list-standard td.oct-list-action-cell>button+button{margin-left:8px!important}
#${ROOT} table.oct-list-standard td.oct-list-action-cell .oct-list-actions{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;width:max-content!important;min-width:0!important;white-space:nowrap!important}
#${ROOT} table.oct-list-standard td.oct-list-action-cell button:hover{border-color:#6683df!important;background:color-mix(in srgb,#6683df 10%,transparent)!important;color:#a9baff!important}
#${ROOT} table.oct-list-standard td.oct-list-action-cell button:disabled{opacity:.45!important;cursor:not-allowed!important}
#${ROOT} table.oct-list-standard td:not(.oct-list-action-cell)>b,#${ROOT} table.oct-list-standard td:not(.oct-list-action-cell) .title-cell{font-size:8.5px!important;font-weight:600!important}
#${ROOT} .table-scroll,#${ROOT} [class*="table-wrap"]{overflow-x:auto!important}
html.octopus-light #${ROOT} table.oct-list-standard td.oct-list-action-cell>button:first-of-type,html.octopus-light #${ROOT} table.oct-list-standard td.oct-list-action-cell .oct-list-actions>button:first-of-type{border-color:#7890c6!important;color:#4e67a4!important}
@media(max-width:900px){#${ROOT} table.oct-list-standard th.oct-list-action-cell,#${ROOT} table.oct-list-standard td.oct-list-action-cell{min-width:190px!important;width:190px!important}}
`;
}
function isActionHead(th){return /^(操作|动作|action|actions)$/i.test((th?.textContent||'').replace(/\s+/g,'').trim())}
function apply(){
 css();
 document.querySelectorAll(`#${ROOT} table`).forEach(table=>{
  if(table.closest('.prw-modal,.dbh-modal,.daw-task-modal,.loc-dialog-layer'))return;
  const heads=[...table.querySelectorAll(':scope>thead>tr>th')],lastHead=heads.at(-1);
  if(!lastHead||!isActionHead(lastHead))return;
  table.classList.add('oct-list-standard');lastHead.classList.add('oct-list-action-cell');
  table.querySelectorAll(':scope>tbody>tr').forEach(tr=>{
   const cell=tr.cells?.[tr.cells.length-1];if(!cell)return;cell.classList.add('oct-list-action-cell');
   const buttons=[...cell.querySelectorAll('button')];
   const parent=buttons.length&&buttons.every(b=>b.parentElement===buttons[0].parentElement)?buttons[0].parentElement:null;
   if(parent&&parent!==cell)parent.classList.add('oct-list-actions');
  });
 });
}
function settle(){[20,180,650].forEach(delay=>setTimeout(()=>requestAnimationFrame(apply),delay))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
window.addEventListener('hashchange',settle);window.addEventListener('octopus-owned-route-change',settle);window.addEventListener('octopus-language-change',settle);window.addEventListener('pageshow',settle);
window.OctopusListDesignStandard={apply,version:'1.0'};
})();
