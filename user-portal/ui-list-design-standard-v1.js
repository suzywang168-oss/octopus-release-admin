(()=>{
'use strict';
const ROOT='pageRoot',STYLE='octopus-list-design-standard-v1';
function css(){
 let style=document.getElementById(STYLE);
 if(!style){style=document.createElement('style');style.id=STYLE;document.head.appendChild(style)}
 style.textContent=`
#${ROOT} table:not(.prw-matrix){width:100%!important;border-collapse:collapse!important;table-layout:auto!important;background:transparent!important}
#${ROOT} table:not(.prw-matrix) thead th{height:46px!important;padding:0 14px!important;border-bottom:1px solid var(--line)!important;background:var(--panel2)!important;color:var(--soft)!important;font-size:8px!important;font-weight:650!important;line-height:1.2!important;text-align:left!important;vertical-align:middle!important;white-space:nowrap!important}
#${ROOT} table:not(.prw-matrix) tbody td{height:58px!important;padding:0 14px!important;border-bottom:1px solid var(--line)!important;color:var(--text)!important;font-size:8.5px!important;font-weight:450!important;line-height:1.45!important;text-align:left!important;vertical-align:middle!important;white-space:nowrap!important}
#${ROOT} table:not(.prw-matrix) tbody tr:last-child td{border-bottom:0!important}
#${ROOT} table:not(.prw-matrix) tbody tr:hover td{background:color-mix(in srgb,var(--panel2) 48%,transparent)!important}
#${ROOT} table:not(.prw-matrix) th:last-child,#${ROOT} table:not(.prw-matrix) td:last-child{box-sizing:border-box!important;min-width:210px!important;width:210px!important;padding-left:14px!important;padding-right:14px!important;text-align:left!important;overflow:visible!important}
#${ROOT} table:not(.prw-matrix) td:last-child>button,#${ROOT} table:not(.prw-matrix) td:last-child>div>button{box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;height:32px!important;min-width:70px!important;margin:0!important;padding:0 12px!important;border:1px solid transparent!important;border-radius:8px!important;background:transparent!important;color:var(--soft)!important;box-shadow:none!important;font-size:8px!important;font-weight:600!important;line-height:1!important;white-space:nowrap!important;cursor:pointer!important;pointer-events:auto!important}
#${ROOT} table:not(.prw-matrix) td:last-child>button:first-of-type,#${ROOT} table:not(.prw-matrix) td:last-child>div>button:first-of-type{border-color:#4f6fae!important;background:transparent!important;color:#8daaff!important}
#${ROOT} table:not(.prw-matrix) td:last-child>button+button{margin-left:8px!important}
#${ROOT} table:not(.prw-matrix) td:last-child>div:has(>button){display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;width:max-content!important;min-width:0!important;white-space:nowrap!important}
#${ROOT} table:not(.prw-matrix) td:last-child button:hover{border-color:#6683df!important;background:color-mix(in srgb,#6683df 10%,transparent)!important;color:#a9baff!important}
#${ROOT} table:not(.prw-matrix) td:last-child button:disabled{opacity:.45!important;cursor:not-allowed!important}
#${ROOT} table:not(.prw-matrix) td:not(:last-child)>b,#${ROOT} table:not(.prw-matrix) td:not(:last-child) .title-cell{font-size:8.5px!important;font-weight:600!important}
#${ROOT} .table-scroll,#${ROOT} [class*="table-wrap"]{overflow-x:auto!important}
html.octopus-light #${ROOT} table:not(.prw-matrix) td:last-child>button:first-of-type,html.octopus-light #${ROOT} table:not(.prw-matrix) td:last-child>div>button:first-of-type{border-color:#7890c6!important;color:#4e67a4!important}
@media(max-width:900px){#${ROOT} table:not(.prw-matrix) th:last-child,#${ROOT} table:not(.prw-matrix) td:last-child{min-width:190px!important;width:190px!important}}
`;
}
css();
window.OctopusListDesignStandard={version:'1.1'};
})();
