from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

old_key = "const GEN_LOOP_STORE='octopus-v814-generation-loop-v2';"
new_key = "const GEN_LOOP_STORE='octopus-v814-generation-loop-v3-clean';"
if source.count(old_key) != 1:
    raise SystemExit('V8.14 generation storage key signature changed')
source = source.replace(old_key, new_key, 1)

# Harden hydration so stale or incompatible list data can never blank the table again.
old_hydrate = """function hydrateGenerationLoop(){
  try{
    const saved=JSON.parse(localStorage.getItem(GEN_LOOP_STORE)||'null');
    if(!saved)return;
    Object.keys(GEN_DATA).forEach(route=>{
      ['pending','results'].forEach(list=>{
        if(Array.isArray(saved?.[route]?.[list]))GEN_DATA[route][list]=saved[route][list];
      });
    });
  }catch{}
}"""
new_hydrate = """function hydrateGenerationLoop(){
  try{
    const saved=JSON.parse(localStorage.getItem(GEN_LOOP_STORE)||'null');
    if(!saved)return;
    Object.keys(GEN_DATA).forEach(route=>{
      ['pending','results'].forEach(list=>{
        const rows=saved?.[route]?.[list];
        const valid=Array.isArray(rows)&&rows.every(row=>Array.isArray(row)&&row.length>=8&&row.every(value=>typeof value==='string'));
        if(valid)GEN_DATA[route][list]=rows;
      });
    });
  }catch{}
}"""
if source.count(old_hydrate) != 1:
    raise SystemExit('V8.14 generation hydration signature changed')
source = source.replace(old_hydrate, new_hydrate, 1)

css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-list-recovery-style'))return;
const style=document.createElement('style');
style.id='v814-list-recovery-style';
style.textContent=`
#pageRoot .table-card,
#pageRoot .table-card table,
#pageRoot .table-card button,
#pageRoot .table-card input,
#pageRoot .table-card select{
  font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC","Segoe UI",sans-serif!important;
  text-rendering:optimizeLegibility!important;
  -webkit-font-smoothing:antialiased!important;
}
#pageRoot .table-card table{table-layout:auto!important}
#pageRoot .table-card thead th{
  height:44px!important;
  padding:10px 13px!important;
  font-size:11px!important;
  line-height:1.35!important;
  font-weight:700!important;
  letter-spacing:0!important;
  color:var(--soft)!important;
  white-space:nowrap!important;
}
#pageRoot .table-card tbody td{
  min-height:50px!important;
  padding:12px 13px!important;
  font-size:12px!important;
  line-height:1.5!important;
  font-weight:500!important;
  letter-spacing:0!important;
  color:var(--text)!important;
  white-space:nowrap!important;
  vertical-align:middle!important;
}
#pageRoot .table-card tbody .title-cell{
  font-size:12.5px!important;
  font-weight:700!important;
  color:var(--text)!important;
}
#pageRoot .table-card .pill,
#pageRoot .table-card [class*="status"]{
  font-size:10.5px!important;
  line-height:1.3!important;
}
#pageRoot .table-card .btn,
#pageRoot .table-card .v815act,
#pageRoot .table-card [data-v88-action]{
  min-height:30px!important;
  padding:0 10px!important;
  font-size:10.5px!important;
  line-height:1!important;
}
#pageRoot .v814-empty{
  padding:18px 12px!important;
  font-size:11.5px!important;
  line-height:1.6!important;
  color:var(--muted)!important;
}
#pageRoot .v814-stable-list-tabs .v85-list-tab{
  font-size:11px!important;
  font-weight:700!important;
}
#pageRoot .v814-stable-list-tabs .v85-list-tab b{
  font-size:10.5px!important;
}
#pageRoot .v81-count,#pageRoot .v85-result-note{
  font-size:10px!important;
}
`;
document.head.appendChild(style);
})();
'''
source += css
path.write_text(source, encoding='utf-8', newline='\n')
