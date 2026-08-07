from pathlib import Path
import sys

path = Path(sys.argv[1])
source = path.read_text(encoding='utf-8')

marker = "function handleListAction(btn){"
if source.count(marker) != 1:
    raise SystemExit('V8.14 list action handler signature changed')

helper = r'''function overviewProjectRoute(row){
  const stage=String(row?.[1]||'').replace(/\s+/g,'');
  if(/内容上传|内容提炼|内容生产/.test(stage))return 'production.upload';
  if(/译配/.test(stage))return 'production.languages';
  if(/封面/.test(stage)&&!/标题/.test(stage))return 'release.covers';
  if(/标题/.test(stage))return 'release.titles';
  if(/频道发布|发布/.test(stage))return 'release.publish';
  return 'production.upload';
}
function overviewProjectList(route,row){
  const stage=String(row?.[1]||'');
  if(route==='production.languages'){
    const progress=String(row?.[3]||'');
    return /质检|完成|100%|已交付|通过/.test(stage+' '+progress)?'results':'pending';
  }
  if(route==='release.titles'){
    const output=String(row?.[4]||'');
    return /\d+\s*标题|已锁定|已完成|完成/.test(output)?'results':'pending';
  }
  if(route==='release.covers'){
    const output=String(row?.[4]||'');
    return /\d+\s*封面|已锁定|已完成|完成/.test(output)?'results':'pending';
  }
  return 'pending';
}
function enterOverviewProject(row){
  const target=overviewProjectRoute(row);
  if(!P[target]){toast('未找到当前项目对应模块');return}
  if(AI_EDIT.has(target)){
    const list=overviewProjectList(target,row);
    generationListByModule[target]=list;
  }
  activateModule(target);
  pageState[pageKey()]=1;
  const search=document.getElementById('globalSearch');
  if(search)search.value='';
  render();
  toast('已进入「'+P[target].t+'」 · '+String(row?.[0]||'当前项目'));
}
'''
source = source.replace(marker, helper + marker, 1)

needle = "if(!row){toast('未找到当前记录，请刷新后重试');return}if(action==='recordEdit')"
replacement = "if(!row){toast('未找到当前记录，请刷新后重试');return}if(action==='enter'&&active==='overview'){enterOverviewProject(row);return}if(action==='recordEdit')"
if source.count(needle) != 1:
    raise SystemExit('V8.14 overview enter action signature changed')
source = source.replace(needle, replacement, 1)

path.write_text(source, encoding='utf-8', newline='\n')
