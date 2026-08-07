from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

old_pending = "let action=CONTENT_FLOW.find(([r])=>r===active)?.[2]||'批量生成';left?.insertAdjacentHTML('afterbegin','<div class=\"v81-bulk\"><button class=\"btn small primary\" data-v81-bulk>'+action+'</button><span class=\"v81-count\" data-v81-count>已选 0 项</span></div>'+contentConsole())"
new_pending = "left?.insertAdjacentHTML('afterbegin',contentConsole())"
if source.count(old_pending) != 1:
    raise SystemExit('V8.14 pending generation toolbar signature changed')
source = source.replace(old_pending, new_pending, 1)

old_tail = "moveSearchAndClean();mergeGenerationHeader();addPagination(allRows.length)"
new_tail = "moveSearchAndClean();mergeGenerationHeader();let actionBox=document.querySelector('#pageRoot .v814-generation-head .v810-list-actions');if(generationList==='pending'&&actionBox){actionBox.insertAdjacentHTML('afterbegin','<div class=\"v81-bulk v814-bulk-right\"><span class=\"v81-count\" data-v81-count>已选 0 项</span><button class=\"btn small primary\" data-v81-bulk>批量生成</button></div>')}addPagination(allRows.length)"
if source.count(old_tail) != 1:
    raise SystemExit('V8.14 generation header merge signature changed')
source = source.replace(old_tail, new_tail, 1)

css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-bulk-action-position-style'))return;
const style=document.createElement('style');
style.id='v814-bulk-action-position-style';
style.textContent=`
#pageRoot .v814-generation-head .v810-list-actions{margin-left:auto!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;flex:none!important}
#pageRoot .v814-bulk-right{display:flex!important;align-items:center!important;gap:8px!important;margin:0!important;padding:0!important;border:0!important;white-space:nowrap!important}
#pageRoot .v814-bulk-right .v81-count{order:1!important;margin:0!important;white-space:nowrap!important}
#pageRoot .v814-bulk-right [data-v81-bulk]{order:2!important;margin:0!important;white-space:nowrap!important}
#pageRoot .v814-generation-head .v810-list-actions [data-v80-export]{margin:0!important;white-space:nowrap!important}
@media(max-width:760px){
  #pageRoot .v814-generation-head .v810-list-actions{width:100%!important;margin-left:0!important;justify-content:flex-end!important}
}
`;
document.head.appendChild(style);
})();
'''
source += css
path.write_text(source, encoding='utf-8', newline='\n')
