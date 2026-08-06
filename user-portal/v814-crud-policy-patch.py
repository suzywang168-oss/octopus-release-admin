from pathlib import Path
import sys

path=Path(sys.argv[1])
source=path.read_text(encoding='utf-8')
marker='const css=`'
if source.count(marker)!=1:
    raise SystemExit('V8.14 CRUD css marker changed')
policy_patch="""Object.assign(policies,{
  'ops.analytics':{noun:['频道分析','Channel analysis'],extras:['history']},
  'ops.crawl':{noun:['抓取任务','Crawl task'],create:1,edit:1,remove:'archive',extras:['duplicate','history']},
  'ops.unblock':{noun:['解禁反馈','Unblock request'],create:1,edit:1,remove:'withdraw',extras:['history']},
  'production.upload':{noun:['内容版本','Content version'],create:1,edit:1,remove:'archive',extras:['duplicate','history']},
  'production.languages':{noun:['译配版本','Localized version'],extras:[]},
  'release.titles':{noun:['标题版本','Title version'],extras:[]},
  'release.covers':{noun:['封面版本','Cover version'],extras:[]},
  'release.publish':{noun:['发布任务','Publish task'],create:1,edit:1,remove:'cancel',extras:['duplicate','history']}
});
"""
source=source.replace(marker,policy_patch+marker,1)
old="hs.slice(0,6).map((h,i)=>"
new="hs.slice(0,Math.min(8,vals.length)).map((h,i)=>"
if source.count(old)!=1:
    raise SystemExit('V8.14 CRUD edit-field signature changed')
source=source.replace(old,new,1)
path.write_text(source,encoding='utf-8')
