(()=>{
  'use strict';

  const ROOT_ID='pageRoot';
  const STYLE_ID='octopus-generation-workspace-v2';
  const ACTION_HOST_ID='octopusGlobalActionHost';
  const TITLE_SLOT_ID='octopusGlobalTitleSlot';
  const STORAGE_KEY='octopus-generation-workspace-v2';

  const DATA={
    'release.titles':{
      kind:'title',noun:'标题',listTitle:'标题生成任务',listDescription:'先在未生成列表选择内容，再批量生成；生成结果可进入独立编辑页修改并采用。',
      columns:['剧集','目标频道','内容爆点','候选标题数','CTR预测','字符数','冲突检测','状态'],
      pending:[
        ['逆光心动','TK-US Drama','豪门千金身份反转','—','—','—','待检测','待生成'],
        ['契约之后','FB-Latina','契约婚姻反转追妻','—','—','—','待检测','待生成'],
        ['她从雨夜归来','YT-English','雨夜归来复仇真相','—','—','—','素材完整','参数待确认'],
        ['炽热边界','TK-US Drama','禁忌关系强冲突','—','—','—','素材完整','待生成'],
        ['重启心跳','FB-Latina','失忆重逢情绪拉扯','—','—','—','素材完整','待生成'],
        ['错位千金','YT-English','身份错位逆袭','—','—','—','待检测','素材待补'],
        ['危险婚约','TK-US Drama','婚约骗局真相揭露','—','—','—','素材完整','待生成'],
        ['月光失约','FB-Latina','久别重逢误会解除','—','—','—','素材完整','待生成']
      ],
      generated:[
        ['逆光心动','TK-US Drama','豪门千金身份反转','3','8.9%','86','无冲突','已生成'],
        ['契约之后','FB-Latina','契约婚姻反转追妻','3','8.2%','94','1条相似','待确认'],
        ['她从雨夜归来','YT-English','雨夜归来复仇真相','3','7.8%','78','无冲突','已采用'],
        ['炽热边界','TK-US Drama','禁忌关系强冲突','3','8.1%','82','无冲突','已生成'],
        ['重启心跳','FB-Latina','失忆重逢情绪拉扯','3','7.6%','91','2条相似','待确认'],
        ['错位千金','YT-English','身份错位逆袭','3','8.4%','76','无冲突','已采用'],
        ['危险婚约','TK-US Drama','婚约骗局真相揭露','3','8.0%','88','无冲突','已生成'],
        ['月光失约','FB-Latina','久别重逢误会解除','3','7.5%','89','1条相似','已生成']
      ]
    },
    'release.covers':{
      kind:'cover',noun:'封面',listTitle:'封面生成任务',listDescription:'未生成内容进入生产队列，已生成内容进入独立编辑页完成选择、替换与采用。',
      columns:['剧集','目标频道','视觉爆点','候选封面','CTR预测','风格匹配','重复度','状态'],
      pending:[
        ['逆光心动','TK-US Drama','双人对峙 / 豪门','—','—','—','待检测','待生成'],
        ['契约之后','FB-Latina','婚礼 / 撕毁契约','—','—','—','待检测','待生成'],
        ['她从雨夜归来','YT-English','雨夜 / 复仇眼神','—','—','—','素材完整','参数待确认'],
        ['炽热边界','TK-US Drama','火场 / 危险距离','—','—','—','素材完整','待生成'],
        ['重启心跳','FB-Latina','医院 / 失忆重逢','—','—','—','素材完整','待生成'],
        ['错位千金','YT-English','双女主 / 身份错位','—','—','—','待检测','素材待补'],
        ['危险婚约','TK-US Drama','婚戒 / 阴影人物','—','—','—','素材完整','待生成'],
        ['月光失约','FB-Latina','车站 / 久别重逢','—','—','—','素材完整','待生成']
      ],
      generated:[
        ['逆光心动','TK-US Drama','双人对峙 / 豪门','3张','9.1%','96%','8%','已生成'],
        ['契约之后','FB-Latina','婚礼 / 撕毁契约','3张','8.5%','94%','12%','待确认'],
        ['她从雨夜归来','YT-English','雨夜 / 复仇眼神','3张','8.0%','92%','6%','已采用'],
        ['炽热边界','TK-US Drama','火场 / 危险距离','3张','8.6%','95%','9%','已生成'],
        ['重启心跳','FB-Latina','医院 / 失忆重逢','3张','7.9%','91%','14%','待确认'],
        ['错位千金','YT-English','双女主 / 身份错位','3张','8.3%','93%','7%','已采用'],
        ['危险婚约','TK-US Drama','婚戒 / 阴影人物','3张','8.2%','94%','10%','已生成'],
        ['月光失约','FB-Latina','车站 / 久别重逢','3张','7.7%','90%','11%','已生成']
      ]
    }
  };

  const tabs={};
  const selected={};
  let editor=null;
  let pending=false;

  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const root=()=>document.getElementById(ROOT_ID);
  const toast=message=>{try{window.toast?.(message)}catch{}};

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      html.gw2-active #${ACTION_HOST_ID}{display:none!important}
      #${ROOT_ID} .gw2-list-header{display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:74px;padding:16px 16px 14px;border-bottom:1px solid var(--line);box-sizing:border-box}
      #${ROOT_ID} .gw2-list-copy{min-width:0}
      #${ROOT_ID} .gw2-list-copy h2{margin:0;color:var(--text);font-size:14px;line-height:1.3}
      #${ROOT_ID} .gw2-list-copy p{margin:6px 0 0;color:var(--soft);font-size:8px;line-height:1.55}
      #${ROOT_ID} .gw2-list-tools{display:flex;align-items:center;justify-content:flex-end;gap:9px;flex:0 0 auto}
      #${ROOT_ID} .gw2-tabs{display:inline-flex;align-items:center;gap:3px;padding:3px;border:1px solid var(--line);border-radius:10px;background:var(--panel2)}
      #${ROOT_ID} .gw2-tab{height:30px;padding:0 12px;border:0;border-radius:7px;background:transparent;color:var(--soft);font-size:8px;font-weight:750;white-space:nowrap;cursor:pointer}
      #${ROOT_ID} .gw2-tab.active{background:var(--panel);color:var(--text);box-shadow:0 2px 9px rgba(0,0,0,.18)}
      #${ROOT_ID} .gw2-tab em{margin-left:5px;font-style:normal;opacity:.72}
      #${ROOT_ID} .gw2-primary,#${ROOT_ID} .gw2-secondary{display:inline-flex;align-items:center;justify-content:center;height:34px;padding:0 13px;border-radius:9px;font-size:9px;font-weight:760;white-space:nowrap;cursor:pointer}
      #${ROOT_ID} .gw2-primary{border:1px solid #6683df;background:#6683df;color:#fff}
      #${ROOT_ID} .gw2-secondary{border:1px solid var(--line);background:var(--panel2);color:var(--text)}
      #${ROOT_ID} .gw2-count{display:inline-flex;align-items:center;min-height:28px;padding:0 9px;border:1px solid var(--line);border-radius:999px;background:var(--panel2);color:var(--soft);font-size:8px;white-space:nowrap}
      #${ROOT_ID} .gw2-table th:first-child,#${ROOT_ID} .gw2-table td:first-child{width:42px;text-align:center!important;padding-left:8px!important;padding-right:8px!important}
      #${ROOT_ID} .gw2-table input[type=checkbox]{width:14px;height:14px;margin:0;accent-color:#6683df;cursor:pointer}
      #${ROOT_ID} .gw2-status{font-weight:760}
      #${ROOT_ID} .gw2-status.done{color:#65d6b2}.gw2-status.wait{color:#91a8ff}.gw2-status.warn{color:#ffbe69}
      #${ROOT_ID} .gw2-row-action{display:inline-flex;align-items:center;justify-content:center;height:30px;min-width:88px;padding:0 11px;border:1px solid #6683df;border-radius:8px;background:transparent;color:#a9bbff;font-size:8px;font-weight:750;white-space:nowrap;cursor:pointer}
      #${ROOT_ID} .gw2-row-action:hover{background:color-mix(in srgb,#6683df 12%,transparent)}
      #${ROOT_ID} .gw2-editor{max-width:1440px;margin:0 auto;padding:8px 0 52px;color:var(--text)}
      #${ROOT_ID} .gw2-editor-nav{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}
      #${ROOT_ID} .gw2-back{display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 11px;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--text);font-size:9px;font-weight:740;cursor:pointer}
      #${ROOT_ID} .gw2-editor-nav-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px}
      #${ROOT_ID} .gw2-context{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:16px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
      #${ROOT_ID} .gw2-context strong{font-size:10px}.gw2-chip{display:inline-flex;align-items:center;min-height:27px;padding:0 9px;border:1px solid var(--line);border-radius:999px;background:var(--panel2);color:var(--soft);font-size:8px}
      #${ROOT_ID} .gw2-context-state{margin-left:auto;color:#91a8ff;font-size:8px;font-weight:750}
      #${ROOT_ID} .gw2-editor-grid{display:grid;grid-template-columns:minmax(390px,.82fr) minmax(560px,1.18fr);gap:16px;align-items:start}
      #${ROOT_ID} .gw2-panel{border:1px solid var(--line);border-radius:14px;background:var(--panel);overflow:hidden}
      #${ROOT_ID} .gw2-panel-head{padding:16px 17px 13px;border-bottom:1px solid var(--line)}
      #${ROOT_ID} .gw2-panel-head h2{margin:0;font-size:14px;line-height:1.35}.gw2-panel-head p{margin:6px 0 0;color:var(--soft);font-size:8px;line-height:1.55}
      #${ROOT_ID} .gw2-panel-body{padding:16px 17px 18px}
      #${ROOT_ID} .gw2-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
      #${ROOT_ID} .gw2-field{display:grid;gap:7px;min-width:0;color:var(--soft);font-size:8px;font-weight:700}.gw2-field.full{grid-column:1/-1}
      #${ROOT_ID} .gw2-field input,#${ROOT_ID} .gw2-field select,#${ROOT_ID} .gw2-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);font:9px/1.55 system-ui;outline:0}
      #${ROOT_ID} .gw2-field input,#${ROOT_ID} .gw2-field select{height:40px;padding:0 11px}.gw2-field textarea{min-height:92px;padding:10px 11px;resize:vertical}
      #${ROOT_ID} .gw2-field input:focus,#${ROOT_ID} .gw2-field select:focus,#${ROOT_ID} .gw2-field textarea:focus{border-color:#6683df;box-shadow:0 0 0 3px color-mix(in srgb,#6683df 14%,transparent)}
      #${ROOT_ID} .gw2-options{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.gw2-option{display:inline-flex;align-items:center;gap:6px;min-height:31px;padding:0 9px;border:1px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--soft);font-size:8px;cursor:pointer}.gw2-option input{width:13px;height:13px;margin:0}
      #${ROOT_ID} .gw2-note{margin-top:14px;padding:11px 12px;border:1px solid color-mix(in srgb,#6683df 25%,var(--line));border-radius:9px;background:color-mix(in srgb,#6683df 7%,var(--panel));color:var(--soft);font-size:8px;line-height:1.65}
      #${ROOT_ID} .gw2-title-list{display:grid;gap:11px}.gw2-title-card{display:grid;grid-template-columns:28px minmax(0,1fr);gap:11px;padding:12px;border:1px solid var(--line);border-radius:11px;background:var(--panel2);cursor:pointer}.gw2-title-card.selected{border-color:#6683df;background:color-mix(in srgb,#6683df 8%,var(--panel))}
      #${ROOT_ID} .gw2-radio{display:grid;place-items:center;width:22px;height:22px;margin-top:3px;border:1px solid var(--line);border-radius:50%;background:var(--panel)}.gw2-title-card.selected .gw2-radio:after{content:'';width:10px;height:10px;border-radius:50%;background:#6683df}
      #${ROOT_ID} .gw2-title-input{width:100%;min-height:68px;box-sizing:border-box;padding:10px 11px;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--text);font:10px/1.55 system-ui;resize:vertical;outline:0}
      #${ROOT_ID} .gw2-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:8px}.gw2-meta span{display:inline-flex;align-items:center;min-height:24px;padding:0 8px;border-radius:999px;background:var(--panel);color:var(--soft);font-size:8px}.gw2-meta .good{color:#65d6b2}.gw2-meta .warn{color:#ffbe69}
      #${ROOT_ID} .gw2-cover-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.gw2-cover-card{padding:9px;border:1px solid var(--line);border-radius:12px;background:var(--panel2);cursor:pointer}.gw2-cover-card.selected{border-color:#6683df;box-shadow:0 0 0 2px color-mix(in srgb,#6683df 12%,transparent)}
      #${ROOT_ID} .gw2-cover-art{position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:9px;background:#182338}.gw2-cover-art.v1{background:linear-gradient(150deg,#17233b 5%,#713149 48%,#0b1220 100%)}.gw2-cover-art.v2{background:linear-gradient(165deg,#0c1425 8%,#304b7b 52%,#281722 100%)}.gw2-cover-art.v3{background:linear-gradient(140deg,#201527 0%,#985543 44%,#111b2c 100%)}
      #${ROOT_ID} .gw2-cover-art:before{content:'';position:absolute;width:58%;height:72%;left:10%;top:8%;border-radius:48% 48% 42% 42%;background:rgba(255,222,186,.25);filter:blur(2px)}.gw2-cover-art:after{content:'';position:absolute;width:62%;height:34%;right:-8%;bottom:5%;border-radius:50%;background:rgba(79,103,190,.35);filter:blur(3px)}
      #${ROOT_ID} .gw2-cover-copy{position:absolute;left:10px;right:10px;bottom:10px;padding:8px;border-radius:7px;background:rgba(4,9,17,.72);backdrop-filter:blur(5px)}.gw2-cover-copy b{display:block;color:#fff;font-size:9px;line-height:1.35}.gw2-cover-copy small{display:block;margin-top:4px;color:rgba(255,255,255,.7);font-size:7px}
      #${ROOT_ID} .gw2-cover-info{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-top:9px;color:var(--soft);font-size:8px}.gw2-cover-info strong{color:var(--text)}
      #${ROOT_ID} .gw2-editor-footer{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:16px;padding:13px 14px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}.gw2-editor-footer small{color:var(--soft);font-size:8px;line-height:1.55}.gw2-footer-actions{display:flex;align-items:center;gap:8px}
      @media(max-width:1100px){#${ROOT_ID} .gw2-editor-grid{grid-template-columns:1fr}#${ROOT_ID} .gw2-cover-grid{grid-template-columns:repeat(3,minmax(180px,1fr));overflow:auto}}
      @media(max-width:800px){#${ROOT_ID} .gw2-list-header{align-items:flex-start;flex-direction:column}.gw2-list-tools{width:100%;justify-content:space-between;flex-wrap:wrap}.gw2-editor-grid{grid-template-columns:1fr}.gw2-form{grid-template-columns:1fr}.gw2-field.full{grid-column:auto}.gw2-editor-nav{align-items:flex-start;flex-direction:column}.gw2-editor-nav-actions{width:100%}.gw2-editor-nav-actions button{flex:1}.gw2-cover-grid{grid-template-columns:1fr}.gw2-editor-footer{align-items:stretch;flex-direction:column}.gw2-footer-actions{width:100%}.gw2-footer-actions button{flex:1}}
    `;
  }

  function config(){return DATA[route()]||null}
  function currentTab(){return tabs[route()]||'pending'}
  function selectedSet(){const key=`${route()}:${currentTab()}`;return selected[key]||(selected[key]=new Set())}
  function statusClass(value){if(/已生成|已采用|完成/.test(value))return'done';if(/待确认|参数|素材待补|相似/.test(value))return'warn';return'wait'}
  function clearTopAction(){const host=document.getElementById(ACTION_HOST_ID);if(host)host.replaceChildren()}
  function setTitle(title,description){const slot=document.getElementById(TITLE_SLOT_ID);if(!slot)return;let h=slot.querySelector('h1'),p=slot.querySelector('p');if(!h){slot.innerHTML='<h1></h1><p></p>';h=slot.querySelector('h1');p=slot.querySelector('p')}h.textContent=title;p.textContent=description}
  function getSection(){return root()?.querySelector('.ol2-data-section,.gml-data-section,.cad-data-section')||null}
  function ensureSection(page){let section=getSection();if(section)return section;const toolbar=page.querySelector(':scope>.v815toolbar');const wrap=page.querySelector(':scope>.v815tw');const foot=page.querySelector(':scope>.v815foot');if(!toolbar||!wrap||!foot)return null;section=document.createElement('section');section.className='ol2-data-section';page.appendChild(section);section.append(toolbar,wrap,foot);return section}
  function listHeaderMarkup(cfg,tab){const count=selectedSet().size;const action=tab==='pending'?`批量生成${cfg.noun}`:`导出已生成${cfg.noun}`;return `<header class="gw2-list-header"><div class="gw2-list-copy"><h2>${cfg.listTitle}</h2><p>${cfg.listDescription}</p></div><div class="gw2-list-tools"><div class="gw2-tabs" role="tablist"><button class="gw2-tab ${tab==='pending'?'active':''}" type="button" data-gw2-tab="pending">未生成内容<em>${cfg.pending.length}</em></button><button class="gw2-tab ${tab==='generated'?'active':''}" type="button" data-gw2-tab="generated">已生成内容<em>${cfg.generated.length}</em></button></div><span class="gw2-count">已选择 ${count} 条</span><button class="gw2-primary" type="button" data-gw2-batch>${action}</button></div></header>`}
  function rowMarkup(row,index,tab){const checked=selectedSet().has(index)?' checked':'';const action=tab==='pending'?'生成并编辑':'查看并编辑';return `<tr data-gw2-row="${index}"><td><input type="checkbox" data-gw2-select="${index}"${checked}></td>${row.map((value,i)=>`<td${i===row.length-1?` class="gw2-status ${statusClass(value)}"`:''}>${esc(value)}</td>`).join('')}<td><button class="gw2-row-action" type="button" data-gw2-open="${index}">${action}</button></td></tr>`}
  function renderList(){if(editor)return;const cfg=config();const page=root()?.querySelector(':scope>.v815page');if(!cfg||!page)return;document.documentElement.classList.add('gw2-active');clearTopAction();const section=ensureSection(page);if(!section)return;const tab=currentTab();let header=section.querySelector(':scope>.gw2-list-header');if(!header){header=document.createElement('div');section.insertBefore(header,section.firstChild)}header.outerHTML=listHeaderMarkup(cfg,tab);section.querySelector(':scope>.gen-list-switch')?.remove();section.querySelector(':scope>.ol2-data-head,:scope>.gml-data-head,:scope>.cad-data-head')?.remove();const table=section.querySelector('.v815table');if(!table)return;table.classList.add('gw2-table');const rows=tab==='pending'?cfg.pending:cfg.generated;table.innerHTML=`<thead><tr><th><input type="checkbox" data-gw2-select-all aria-label="全选"></th>${cfg.columns.map(column=>`<th>${esc(column)}</th>`).join('')}<th>操作</th></tr></thead><tbody>${rows.map((row,index)=>rowMarkup(row,index,tab)).join('')}</tbody>`;const foot=section.querySelector('.v815foot');if(foot){const spans=foot.querySelectorAll('span');if(spans[0])spans[0].textContent=`共 ${rows.length} 条${tab==='pending'?'未生成':'已生成'}记录，每页 8 条`;if(spans[1])spans[1].textContent='‹　1　›'}const input=section.querySelector('[data-search]');if(input)input.placeholder=`搜索${cfg.noun}生成任务`}
  function titleCandidates(series){return [`${series}：所有人都以为她失去一切，直到真正身份被揭开`,`她隐忍多年重回豪门，只为让背叛者亲眼看见真相`,`婚礼当天身份反转，那个被轻视的女人终于不再隐藏`]}
  function titleEditor(cfg,row){const titles=titleCandidates(row[0]);return `<div class="gw2-editor" data-gw2-editor="title"><div class="gw2-editor-nav"><button class="gw2-back" type="button" data-gw2-back>← 返回${cfg.noun}列表</button><div class="gw2-editor-nav-actions"><button class="gw2-secondary" type="button" data-gw2-save>保存草稿</button><button class="gw2-secondary" type="button" data-gw2-regenerate>重新生成</button><button class="gw2-primary" type="button" data-gw2-adopt>采用当前标题</button></div></div><div class="gw2-context"><strong>${esc(row[0])}</strong><span class="gw2-chip">${esc(row[1])}</span><span class="gw2-chip">${esc(row[2])}</span><span class="gw2-context-state">自动保存已开启</span></div><div class="gw2-editor-grid"><section class="gw2-panel"><header class="gw2-panel-head"><h2>内容与生成设置</h2><p>先确认内容爆点、频道风格和标题限制，再生成候选结果。</p></header><div class="gw2-panel-body"><div class="gw2-form"><label class="gw2-field"><span>剧集</span><input value="${esc(row[0])}" readonly></label><label class="gw2-field"><span>目标频道</span><select data-gw2-field="channel"><option>${esc(row[1])}</option><option>TK-US Drama</option><option>FB-Latina</option><option>YT-English</option></select></label><label class="gw2-field"><span>输出语言</span><select data-gw2-field="language"><option>英语</option><option>西班牙语</option><option>阿拉伯语</option></select></label><label class="gw2-field"><span>标题结构</span><select data-gw2-field="structure"><option>身份反转 + 强冲突 + 结果悬念</option><option>情绪钩子 + 关系冲突</option><option>事件开场 + 真相揭露</option></select></label><label class="gw2-field"><span>字符上限</span><input type="number" min="30" max="100" value="100" data-gw2-field="limit"></label><label class="gw2-field"><span>候选数量</span><select data-gw2-field="count"><option>3</option><option>5</option></select></label><label class="gw2-field full"><span>内容爆点</span><textarea data-gw2-field="hook">${esc(row[2])}</textarea></label><label class="gw2-field full"><span>补充生成指令</span><textarea data-gw2-field="instruction">强调女主身份反转和情绪冲突，结尾保留悬念，避免剧透最终结局。</textarea></label><div class="gw2-field full"><span>生成校验</span><div class="gw2-options"><label class="gw2-option"><input type="checkbox" checked>敏感词检测</label><label class="gw2-option"><input type="checkbox" checked>历史标题冲突</label><label class="gw2-option"><input type="checkbox" checked>频道风格匹配</label></div></div></div><div class="gw2-note">建议：目标频道近期高点击标题更偏好“身份反转 + 强冲突 + 结果悬念”，标题长度建议控制在 70–90 字符。</div></div></section><section class="gw2-panel"><header class="gw2-panel-head"><h2>候选标题</h2><p>直接编辑标题内容，选择一条作为最终采用版本。</p></header><div class="gw2-panel-body"><div class="gw2-title-list">${titles.map((text,i)=>`<article class="gw2-title-card ${i===0?'selected':''}" data-gw2-candidate="${i}"><span class="gw2-radio"></span><div><textarea class="gw2-title-input" data-gw2-title="${i}">${esc(text)}</textarea><div class="gw2-meta"><span>候选 ${i+1}</span><span>CTR 预测 ${['8.9%','8.4%','8.1%'][i]}</span><span class="${i===1?'warn':'good'}">${i===1?'1 条相似':'无冲突'}</span><span data-gw2-length="${i}">${text.length} 字符</span></div></div></article>`).join('')}</div></div></section></div><div class="gw2-editor-footer"><small>保存草稿不会改变当前已采用版本；点击“采用当前标题”后会更新已生成列表状态。</small><div class="gw2-footer-actions"><button class="gw2-secondary" type="button" data-gw2-save>保存草稿</button><button class="gw2-primary" type="button" data-gw2-adopt>采用当前标题</button></div></div></div>`}
  function coverEditor(cfg,row){const labels=['强冲突对峙','人物情绪特写','剧情场景悬念'];return `<div class="gw2-editor" data-gw2-editor="cover"><div class="gw2-editor-nav"><button class="gw2-back" type="button" data-gw2-back>← 返回${cfg.noun}列表</button><div class="gw2-editor-nav-actions"><button class="gw2-secondary" type="button" data-gw2-save>保存草稿</button><button class="gw2-secondary" type="button" data-gw2-regenerate>重新生成</button><button class="gw2-primary" type="button" data-gw2-adopt>采用当前封面</button></div></div><div class="gw2-context"><strong>${esc(row[0])}</strong><span class="gw2-chip">${esc(row[1])}</span><span class="gw2-chip">${esc(row[2])}</span><span class="gw2-context-state">候选封面 3 张</span></div><div class="gw2-editor-grid"><section class="gw2-panel"><header class="gw2-panel-head"><h2>视觉与生成设置</h2><p>配置人物、场景、构图和频道风格，生成可直接发布的封面候选。</p></header><div class="gw2-panel-body"><div class="gw2-form"><label class="gw2-field"><span>剧集</span><input value="${esc(row[0])}" readonly></label><label class="gw2-field"><span>目标频道</span><select data-gw2-field="channel"><option>${esc(row[1])}</option><option>TK-US Drama</option><option>FB-Latina</option><option>YT-English</option></select></label><label class="gw2-field"><span>画面比例</span><select data-gw2-field="ratio"><option>4:5</option><option>9:16</option><option>16:9</option></select></label><label class="gw2-field"><span>视觉风格</span><select data-gw2-field="style"><option>电影感强冲突</option><option>高饱和情绪海报</option><option>极简人物特写</option></select></label><label class="gw2-field"><span>人物主体</span><select data-gw2-field="subject"><option>女主正面 + 男主背影</option><option>双人对峙</option><option>女主单人特写</option></select></label><label class="gw2-field"><span>文字安全区</span><select data-gw2-field="safe"><option>底部 28%</option><option>顶部 22%</option><option>不保留文字区</option></select></label><label class="gw2-field full"><span>视觉提示词</span><textarea data-gw2-field="prompt">${esc(row[2])}，强情绪光影，人物关系紧张，电影级构图，主体清晰，适配移动端频道封面。</textarea></label><label class="gw2-field full"><span>排除内容</span><textarea data-gw2-field="negative">避免多人杂乱、手部畸形、过多文字、低对比度、频道历史封面高度重复。</textarea></label><div class="gw2-field full"><span>生成校验</span><div class="gw2-options"><label class="gw2-option"><input type="checkbox" checked>频道风格匹配</label><label class="gw2-option"><input type="checkbox" checked>视觉重复检测</label><label class="gw2-option"><input type="checkbox" checked>安全区检测</label></div></div></div><div class="gw2-note">建议：双人对峙与强光影在当前频道 CTR 表现更高，人物脸部建议占画面 35%–45%。</div></div></section><section class="gw2-panel"><header class="gw2-panel-head"><h2>候选封面</h2><p>选择一张作为最终版本，也可以重新生成或替换本地图片。</p></header><div class="gw2-panel-body"><div class="gw2-cover-grid">${labels.map((label,i)=>`<article class="gw2-cover-card ${i===0?'selected':''}" data-gw2-candidate="${i}"><div class="gw2-cover-art v${i+1}"><div class="gw2-cover-copy"><b>${esc(row[0])}</b><small>${label}</small></div></div><div class="gw2-cover-info"><strong>方案 ${i+1}</strong><span>CTR ${['9.1%','8.6%','8.2%'][i]}</span></div><div class="gw2-meta"><span>风格匹配 ${['96%','94%','92%'][i]}</span><span class="good">重复度 ${['8%','11%','6%'][i]}</span></div></article>`).join('')}</div></div></section></div><div class="gw2-editor-footer"><small>采用封面后会写入已生成列表；原版本仍保留在历史版本中。</small><div class="gw2-footer-actions"><button class="gw2-secondary" type="button" data-gw2-save>保存草稿</button><button class="gw2-primary" type="button" data-gw2-adopt>采用当前封面</button></div></div></div>`}
  function openEditor(index){const cfg=config();if(!cfg)return;const tab=currentTab();const rows=tab==='pending'?cfg.pending:cfg.generated;const row=rows[index];if(!row)return;editor={route:route(),tab,index,row:[...row],selected:0,snapshot:root().innerHTML};clearTopAction();setTitle(`${cfg.noun}生成与编辑`,cfg.kind==='title'?'编辑生成参数、比较候选标题，并选择最终用于频道发布的版本。':'配置视觉方向、比较候选封面，并选择最终用于频道发布的版本。');root().innerHTML=cfg.kind==='title'?titleEditor(cfg,row):coverEditor(cfg,row)}
  function closeEditor(adopted=false){if(!editor)return;const cfg=DATA[editor.route];if(adopted){const source=(editor.tab==='pending'?cfg.pending:cfg.generated)[editor.index];if(editor.tab==='pending'){const generated=[...source];generated[3]=cfg.kind==='title'?'3':'3张';generated[4]=cfg.kind==='title'?'8.7%':'8.9%';generated[5]=cfg.kind==='title'?'84':'95%';generated[6]=cfg.kind==='title'?'无冲突':'8%';generated[7]='已采用';cfg.generated.unshift(generated);cfg.pending.splice(editor.index,1);tabs[editor.route]='generated'}else source[source.length-1]='已采用'}const snapshot=editor.snapshot;const currentRoute=editor.route;editor=null;root().innerHTML=snapshot;const cfg2=DATA[currentRoute];setTitle(cfg2.kind==='title'?'AI标题生成':'AI封面生成',cfg2.kind==='title'?'理解剧情语义与爆点，一次输出3个不超过100字符的标题，适配频道风格并规避冲突。':'提取视觉爆点，一次生成3张冲突感封面，匹配频道视觉风格并支持人工替换。');setTimeout(renderList,0)}
  function saveEditor(){if(!editor)return;const fields={};root().querySelectorAll('[data-gw2-field]').forEach(field=>fields[field.dataset.gw2Field]=field.value);const titles=[...root().querySelectorAll('[data-gw2-title]')].map(field=>field.value);let data={};try{data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{}data[`${editor.route}:${editor.row[0]}`]={fields,titles,selected:editor.selected,updatedAt:new Date().toISOString()};localStorage.setItem(STORAGE_KEY,JSON.stringify(data));toast('草稿已保存')}
  function regenerate(){if(!editor)return;if(DATA[editor.route].kind==='title'){const series=editor.row[0];const next=[`${series}：她被所有人轻视，直到隐藏身份让全场沉默`,`她以为这是一场交易婚姻，却不知道复仇真相早已逼近`,`所有证据都指向她，直到雨夜里真正的幕后者现身`];root().querySelectorAll('[data-gw2-title]').forEach((field,i)=>{field.value=next[i];const length=root().querySelector(`[data-gw2-length="${i}"]`);if(length)length.textContent=`${next[i].length} 字符`})}else root().querySelectorAll('.gw2-cover-card').forEach((card,i)=>{const art=card.querySelector('.gw2-cover-art');art.className=`gw2-cover-art v${((i+1)%3)+1}`});toast(`已重新生成 3 个${DATA[editor.route].noun}候选`)}
  function exportGenerated(cfg){const rows=cfg.generated;const csv='\ufeff'+[cfg.columns,...rows].map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=`${cfg.kind}-generated.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
  function batchAction(){const cfg=config();if(!cfg)return;if(currentTab()==='generated'){exportGenerated(cfg);return}const set=selectedSet();if(!set.size){toast('请先勾选需要生成的内容');return}[...set].sort((a,b)=>b-a).forEach(index=>{const source=cfg.pending[index];if(!source)return;const generated=[...source];generated[3]=cfg.kind==='title'?'3':'3张';generated[4]=cfg.kind==='title'?'8.5%':'8.7%';generated[5]=cfg.kind==='title'?'82':'94%';generated[6]=cfg.kind==='title'?'无冲突':'9%';generated[7]='已生成';cfg.generated.unshift(generated);cfg.pending.splice(index,1)});set.clear();tabs[route()]='generated';toast(`批量生成已完成`);renderList()}
  function handleClick(event){const target=event.target instanceof Element?event.target:null;if(!target)return;const tab=target.closest('[data-gw2-tab]');if(tab){event.preventDefault();tabs[route()]=tab.dataset.gw2Tab;selectedSet().clear();renderList();return}const all=target.closest('[data-gw2-select-all]');if(all){const cfg=config();const rows=currentTab()==='pending'?cfg.pending:cfg.generated;const set=selectedSet();set.clear();if(all.checked)rows.forEach((_,i)=>set.add(i));renderList();return}const checkbox=target.closest('[data-gw2-select]');if(checkbox){const set=selectedSet(),index=Number(checkbox.dataset.gw2Select);checkbox.checked?set.add(index):set.delete(index);renderList();return}const batch=target.closest('[data-gw2-batch]');if(batch){event.preventDefault();batchAction();return}const open=target.closest('[data-gw2-open]');if(open){event.preventDefault();openEditor(Number(open.dataset.gw2Open));return}if(target.closest('[data-gw2-back]')){event.preventDefault();closeEditor(false);return}if(target.closest('[data-gw2-save]')){event.preventDefault();saveEditor();return}if(target.closest('[data-gw2-regenerate]')){event.preventDefault();regenerate();return}if(target.closest('[data-gw2-adopt]')){event.preventDefault();saveEditor();const noun=DATA[editor.route].noun;closeEditor(true);toast(`已采用当前${noun}方案`);return}const candidate=target.closest('[data-gw2-candidate]');if(candidate&&editor){editor.selected=Number(candidate.dataset.gw2Candidate);root().querySelectorAll('[data-gw2-candidate]').forEach(card=>card.classList.toggle('selected',card===candidate))}}
  function handleInput(event){const field=event.target instanceof HTMLTextAreaElement?event.target:null;if(!field||!field.matches('[data-gw2-title]'))return;const length=root().querySelector(`[data-gw2-length="${field.dataset.gw2Title}"]`);if(length)length.textContent=`${field.value.length} 字符`}
  function apply(){pending=false;installStyle();const cfg=config();if(!cfg){document.documentElement.classList.remove('gw2-active');if(editor)editor=null;return}document.documentElement.classList.add('gw2-active');clearTopAction();if(!editor)renderList()}
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(apply)}
  document.addEventListener('click',handleClick,false);document.addEventListener('input',handleInput,false);window.addEventListener('hashchange',()=>{editor=null;schedule()});new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();setTimeout(schedule,350);setTimeout(schedule,900);setTimeout(schedule,1800);
})();
