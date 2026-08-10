#!/usr/bin/env python3
from pathlib import Path
import sys


path = Path(sys.argv[1])
source = path.read_text(encoding="utf-8")

g_marker = "const G=[['工作台',[['overview','◈','项目总览'],['todo','◉','待办任务']]],['运营导向',[['ops.analytics','⌁','数据分析'],['ops.crawl','⬡','大数据抓取'],['ops.unblock','↺','解禁链接反馈']]],['内容生产',[['production.upload','片','内容上传'],['production.languages','译','语种 AI 译配']]],['发行流程',[['release.titles','T','标题生成'],['release.covers','▧','封面生成'],['release.publish','↗','上传频道']]]];"
g_replacement = g_marker + "\nconst GE=[['Workspace',[['overview','◈','Project Overview'],['todo','◉','Action Items']]],['Operations',[['ops.analytics','⌁','Data Analytics'],['ops.crawl','⬡','Data Monitoring'],['ops.unblock','↺','Blocked Link Recovery']]],['Content Production',[['production.upload','片','Content Upload'],['production.languages','译','AI Localization']]],['Distribution',[['release.titles','T','Title Generation'],['release.covers','▧','Cover Generation'],['release.publish','↗','Channel Publishing']]]];\nconst EN_ROUTE_MAP={'overview':'overview','todo':'todo','ops.analytics':'metrics','ops.crawl':'release.performance','ops.unblock':'release.performance','production.upload':'production.assets','production.languages':'production.localization','release.titles':'release.submissions','release.covers':'release.submissions','release.publish':'release.submissions'};"
if g_marker not in source:
    raise SystemExit("Unable to locate the V8.14 navigation model")
source = source.replace(g_marker, g_replacement, 1)

nav_old = ",html=G.map(([g,x])=>"
nav_new = ",html=(typeof currentLang!=='undefined'&&currentLang==='en'?GE:G).map(([g,x])=>"
if nav_old not in source:
    raise SystemExit("Unable to locate the V8.14 navigation renderer")
source = source.replace(nav_old, nav_new, 1)

render_old = "function render(){let c=P[active];if(!c)return;style();nav();"
render_new = "function render(){let c=P[active];if(!c)return;if(typeof currentLang!=='undefined'&&currentLang==='en'&&typeof renderEnglishRoute==='function'){let englishRoute=EN_ROUTE_MAP[active]||'overview';if(typeof EN_CONFIGS==='object'&&EN_CONFIGS[englishRoute]){style();nav();document.querySelectorAll('[data-v80]').forEach(b=>b.classList.toggle('active',b.dataset.v80===active));if(typeof state==='object')state.route=englishRoute;document.getElementById('pageRoot').innerHTML=renderEnglishRoute(englishRoute);history.replaceState(null,'','#/'+active.replaceAll('.','/'));return}}style();nav();"
if render_old not in source:
    raise SystemExit("Unable to locate the V8.14 page renderer")
source = source.replace(render_old, render_new, 1)

path.write_text(source, encoding="utf-8", newline="\n")
