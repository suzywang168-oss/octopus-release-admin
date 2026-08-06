from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding="utf-8")

old_list = "let list=q.target.closest('[data-v85-list]');if(list){q.preventDefault();q.stopImmediatePropagation();generationList=list.dataset.v85List;render();return}"
new_list = "let list=q.target.closest('[data-v85-list]');if(list){q.preventDefault();q.stopImmediatePropagation();let next=list.dataset.v85List;if(next!=='pending'&&next!=='results')return;if(next!==generationList){generationList=next;pageState[pageKey()]=1}render();return}"
if source.count(old_list) != 1:
    raise SystemExit("V8.14 generated-list click signature changed")
source = source.replace(old_list, new_list, 1)

old_boot = "function boot(){if(!document.getElementById('nav'))return setTimeout(boot,100);style();nav();let h=location.hash.replace(/^#\\//,'').replaceAll('/','.');if(/^(production|release)\\.contracts$/.test(h)){route('overview');h='overview'}if(P[h]){active=h;render()}setInterval(()=>{let x=location.hash.replace(/^#\\//,'').replaceAll('/','.');if(/^(production|release)\\.contracts$/.test(x)){active='';route('overview');toast('合同中心已从 User Portal 下线')}nav()},250)}boot();"
new_boot = "function boot(){if(!document.getElementById('nav'))return setTimeout(boot,100);style();let readRoute=()=>location.hash.replace(/^#\\//,'').replaceAll('/','.')||'overview';let syncRoute=()=>{let x=readRoute();if(/^(production|release)\\.contracts$/.test(x)){route('overview');x='overview';toast('合同中心已从 User Portal 下线')}if(P[x]&&x!==active){active=x;render();return}nav()};let h=readRoute();if(/^(production|release)\\.contracts$/.test(h)){route('overview');h='overview'}if(P[h]){active=h;render()}else nav();window.addEventListener('hashchange',syncRoute)}boot();"
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
#pageRoot .v814-stable-list-tabs{position:relative!important;z-index:3!important}
#pageRoot .v814-stable-list-tabs .v85-list-tab{transition:background-color .12s ease,border-color .12s ease,color .12s ease!important}
#pageRoot .v814-stable-list-tabs .v85-list-tab.active{pointer-events:none!important}
`;
document.head.appendChild(style);
})();
'''
source += stability_css
path.write_text(source, encoding="utf-8")
