(()=>{
'use strict';
const ROOT='pageRoot',STYLE='octopus-table-test-data-v1';
function style(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`#${ROOT} tr[data-oct-test-row] td:first-child{position:relative}#${ROOT} tr[data-oct-test-row] td:first-child:after{content:'TEST';display:inline-flex;margin-left:6px;padding:2px 5px;border:1px solid var(--line);border-radius:99px;color:var(--soft);font-size:6px;vertical-align:middle}`}
function businessTable(table){if(table.closest('[role="dialog"],.modal,.atw-modal,.al3-modal,.dbh-modal,.daw-task-modal,.loc-dialog-layer,.prw-modal'))return false;const last=table.querySelector('thead th:last-child');return /^(操作|动作|action|actions)$/i.test((last?.textContent||'').replace(/\s+/g,'').trim())}
function apply(){style();document.querySelectorAll(`#${ROOT} table`).forEach(table=>{if(!businessTable(table))return;const body=table.tBodies?.[0],rows=body?[...body.rows].filter(r=>!r.dataset.octTestRow):[];if(!body||!rows.length)return;const existing=[...body.querySelectorAll('tr[data-oct-test-row]')],needed=Math.max(0,8-rows.length);if(existing.length===needed)return;existing.forEach(r=>r.remove());for(let i=rows.length;i<8;i++){const clone=rows[i%rows.length].cloneNode(true);clone.dataset.octTestRow=String(i+1);const first=clone.cells?.[0];if(first){const base=(first.textContent||'').replace(/\s+/g,' ').trim();const text=first.querySelector('b,.title-cell');if(text)text.textContent=`${base} · 检测 ${i+1}`;else if(!first.querySelector('img,video,input'))first.insertAdjacentText('beforeend',` · 检测 ${i+1}`)}body.appendChild(clone)}})}
function schedule(){queueMicrotask(()=>requestAnimationFrame(apply))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else apply();
window.addEventListener('hashchange',schedule);window.addEventListener('octopus-owned-route-change',schedule);window.addEventListener('octopus-language-change',schedule);window.addEventListener('pageshow',schedule);
document.addEventListener('click',schedule,false);document.addEventListener('change',schedule,false);document.addEventListener('input',schedule,false);
window.OctopusTableTestData={apply,version:'1.0'};
})();
