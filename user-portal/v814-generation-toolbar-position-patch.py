from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

old_header = "bar.className='v810-list-head'+(AI_EDIT.has(active)?' v814-generation-head':'');bar.innerHTML="
new_header = "bar.className='v810-list-head'+(AI_EDIT.has(active)?' v814-generation-head':'');if(AI_EDIT.has(active))bar.dataset.generationList=generationList;bar.innerHTML="
if source.count(old_header) != 1:
    raise SystemExit('V8.14 generation header signature changed')
source = source.replace(old_header, new_header, 1)

old_merge = "function mergeGenerationHeader(){if(!AI_EDIT.has(active))return;let bar=document.querySelector('#pageRoot .v814-generation-head'),controls=bar?.querySelector('.v814-list-controls'),toolbar=document.querySelector('#pageRoot .toolbar.v87-compact'),left=toolbar?.querySelector('.toolbar-left');if(!bar||!controls||!left)return;controls.replaceChildren(...left.children);toolbar.remove()}"
new_merge = "function mergeGenerationHeader(){if(!AI_EDIT.has(active))return;let bar=document.querySelector('#pageRoot .v814-generation-head'),controls=bar?.querySelector('.v814-list-controls'),actions=bar?.querySelector('.v810-list-actions'),toolbar=document.querySelector('#pageRoot .toolbar.v87-compact'),left=toolbar?.querySelector('.toolbar-left');if(!bar||!controls||!left)return;controls.replaceChildren(...left.children);let bulk=controls.querySelector('.v81-bulk');if(bulk&&actions){bulk.remove();actions.prepend(bulk)}toolbar.remove()}"
if source.count(old_merge) != 1:
    raise SystemExit('V8.14 generation header merge signature changed')
source = source.replace(old_merge, new_merge, 1)

css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-generation-toolbar-position-style'))return;
const style=document.createElement('style');
style.id='v814-generation-toolbar-position-style';
style.textContent=`
#pageRoot .v814-generation-head .v814-list-controls{order:1!important}
#pageRoot .v814-generation-head .v810-list-actions{order:2!important;margin-left:auto!important}
#pageRoot .v814-generation-head .v810-list-actions .v81-bulk{display:flex!important;align-items:center!important;gap:7px!important;flex:none!important;white-space:nowrap!important}
#pageRoot .v814-generation-head[data-generation-list="results"] .v810-list-actions .v81-bulk{display:none!important}
#pageRoot .v814-generation-head .v814-list-controls .v85-list-tabs{order:1!important}
#pageRoot .v814-generation-head .v814-list-controls .v85-result-note{order:2!important}
@media(max-width:680px){
  #pageRoot .v814-generation-head .v810-list-actions{width:100%!important;justify-content:flex-end!important;order:3!important}
}
`;
document.head.appendChild(style);
})();
'''
source += css
path.write_text(source, encoding='utf-8')
