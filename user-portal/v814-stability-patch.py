from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding="utf-8")

old_state = "let generationList='pending';"
new_state = "let generationList='pending';const generationListByModule=Object.fromEntries([...AI_EDIT].map(route=>[route,'pending']));function activateModule(route){if(AI_EDIT.has(active))generationListByModule[active]=generationList;active=route;try{state.route=route}catch{}if(AI_EDIT.has(route))generationList=generationListByModule[route]||'pending'}"
if source.count(old_state) != 1:
    raise SystemExit("V8.14 generation-list state signature changed")
source = source.replace(old_state, new_state, 1)

old_list = "let list=q.target.closest('[data-v85-list]');if(list){q.preventDefault();q.stopImmediatePropagation();generationList=list.dataset.v85List;render();return}"
new_list = "let list=q.target.closest('[data-v85-list]');if(list){q.preventDefault();q.stopImmediatePropagation();let next=list.dataset.v85List;if(!AI_EDIT.has(active)||(next!=='pending'&&next!=='results'))return;generationList=next;generationListByModule[active]=next;pageState[pageKey()]=1;render();return}"
if source.count(old_list) != 1:
    raise SystemExit("V8.14 generated-list click signature changed")
source = source.replace(old_list, new_list, 1)

old_module = "let module=q.target.closest('[data-v82-module]');if(module){q.preventDefault();q.stopImmediatePropagation();active=module.dataset.v82Module;render();return}"
new_module = "let module=q.target.closest('[data-v82-module]');if(module){q.preventDefault();q.stopImmediatePropagation();activateModule(module.dataset.v82Module);render();return}"
if source.count(old_module) != 1:
    raise SystemExit("V8.14 content-module click signature changed")
source = source.replace(old_module, new_module, 1)

old_route = "let el=q.target.closest('[data-v80],[data-route]'),r=el?.dataset.v80||el?.dataset.route;if(r&&P[r]){q.preventDefault();q.stopImmediatePropagation();active=r;render();return}"
new_route = "let el=q.target.closest('[data-v80],[data-route]'),r=el?.dataset.v80||el?.dataset.route;if(r&&P[r]){q.preventDefault();q.stopImmediatePropagation();activateModule(r);render();return}"
if source.count(old_route) != 1:
    raise SystemExit("V8.14 navigation click signature changed")
source = source.replace(old_route, new_route, 1)

old_search = "if(hit){q.preventDefault();q.stopImmediatePropagation();active=hit[0];render();toast('已打开“'+hit[1].t+'”')}"
new_search = "if(hit){q.preventDefault();q.stopImmediatePropagation();activateModule(hit[0]);render();toast('已打开“'+hit[1].t+'”')}"
if source.count(old_search) != 1:
    raise SystemExit("V8.14 global-search route signature changed")
source = source.replace(old_search, new_search, 1)

old_boot = "function boot(){if(!document.getElementById('nav'))return setTimeout(boot,100);style();nav();let h=location.hash.replace(/^#\\//,'').replaceAll('/','.');if(/^(production|release)\\.contracts$/.test(h)){route('overview');h='overview'}if(P[h]){active=h;render()}setInterval(()=>{let x=location.hash.replace(/^#\\//,'').replaceAll('/','.');if(/^(production|release)\\.contracts$/.test(x)){active='';route('overview');toast('合同中心已从 User Portal 下线')}nav()},250)}boot();"
new_boot = "function boot(){if(!document.getElementById('nav'))return setTimeout(boot,100);style();let readRoute=()=>location.hash.replace(/^#\\//,'').replaceAll('/','.')||'overview';let syncRoute=()=>{let x=readRoute();if(/^(production|release)\\.contracts$/.test(x)){route('overview');x='overview';toast('合同中心已从 User Portal 下线')}if(P[x]&&x!==active){activateModule(x);render();return}nav()};let h=readRoute();if(/^(production|release)\\.contracts$/.test(h)){route('overview');h='overview'}if(P[h]){activateModule(h);render()}else nav();window.addEventListener('hashchange',syncRoute)}boot();"
if source.count(old_boot) != 1:
    raise SystemExit("V8.14 navigation polling signature changed")
source = source.replace(old_boot, new_boot, 1)

stability_css = r'''
(()=>{
'use strict';
if(document.getElementById('v814-stability-style'))return;
const style=document.createElement('style');
style.id='v814-stability-style';
style.textContent=`
#v80nav{contain:layout style!important}
#pageRoot{overflow-anchor:none!important}
#pageRoot .v814-stable-list-tabs{position:relative!important;z-index:3!important;pointer-events:auto!important}
#pageRoot .v814-stable-list-tabs .v85-list-tab{position:relative!important;z-index:4!important;pointer-events:auto!important;cursor:pointer!important;transition:background-color .12s ease,border-color .12s ease,color .12s ease!important}
#pageRoot .v814-stable-list-tabs .v85-list-tab.active{cursor:default!important}
`;
document.head.appendChild(style);
})();
'''
source += stability_css
path.write_text(source, encoding="utf-8")
