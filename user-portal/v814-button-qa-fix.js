(()=>{
  'use strict';

  const STYLE_ID='v814-button-qa-style';
  const ACTION_TITLES={
    enter:'项目详情',progress:'项目进度',analysis:'频道数据详情',compare:'选题方案',assets:'素材样本',materials:'申诉材料',asset:'源内容',extract:'AI 提炼结果',config:'生成配置',source:'生成依据',preview:'预览',detail:'记录详情',link:'原始链接',listen:'译配试听',handoff:'转交任务'
  };

  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();
  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const toast=message=>{try{typeof window.toast==='function'?window.toast(message):console.info(message)}catch{console.info(message)}};

  function installStyle(doc){
    if(doc.getElementById(STYLE_ID)) return;
    const style=doc.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      .v80-modal{overflow:auto!important;align-items:flex-start!important;justify-items:center!important;padding:24px!important;box-sizing:border-box!important}
      .v80-modal>form{max-height:calc(100vh - 48px)!important;overflow:auto!important;margin:auto!important;box-sizing:border-box!important}
      .v814-qa-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px;box-sizing:border-box;background:rgba(2,8,16,.76);backdrop-filter:blur(4px)}
      .v814-qa-dialog{width:min(960px,calc(100vw - 32px));max-height:calc(100vh - 48px);overflow:auto;margin:auto;border:1px solid var(--line,#29415f);border-radius:15px;background:var(--panel,#0f1d2f);color:var(--text,#eef5ff);box-shadow:0 22px 70px rgba(0,0,0,.48)}
      .v814-qa-head{position:sticky;top:0;z-index:2;display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:18px 20px;border-bottom:1px solid var(--line,#29415f);background:var(--panel,#0f1d2f)}
      .v814-qa-head h2{margin:0 0 5px;font-size:18px}.v814-qa-head p{margin:0;color:var(--muted,#93a6bd);font-size:12px;line-height:1.55}
      .v814-qa-close{flex:none;height:34px;padding:0 13px;border:1px solid var(--line,#29415f);border-radius:9px;background:var(--panel2,#14263d);color:var(--text,#eef5ff);cursor:pointer}
      .v814-qa-body{padding:18px 20px}.v814-qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .v814-qa-card{padding:14px;border:1px solid var(--line,#29415f);border-radius:11px;background:var(--panel2,#14263d)}
      .v814-qa-card h3{margin:0 0 11px;font-size:13px}.v814-qa-field{display:grid;gap:6px;margin:0 0 10px;color:var(--soft,#c2cfde);font-size:11px}
      .v814-qa-field input,.v814-qa-field select,.v814-qa-field textarea{width:100%;box-sizing:border-box;padding:9px 10px;border:1px solid var(--line,#29415f);border-radius:8px;background:var(--panel,#0f1d2f);color:var(--text,#eef5ff);font:inherit}
      .v814-qa-field textarea{min-height:96px;resize:vertical}.v814-qa-metrics{display:grid;gap:8px}.v814-qa-metric{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--line,#29415f);font-size:11px}.v814-qa-metric:last-child{border-bottom:0}.v814-qa-metric span{color:var(--muted,#93a6bd)}
      .v814-qa-actions{position:sticky;bottom:0;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 20px;border-top:1px solid var(--line,#29415f);background:var(--panel,#0f1d2f)}
      .v814-qa-actions>div{display:flex;gap:8px;flex-wrap:wrap}.v814-qa-btn{height:36px;padding:0 14px;border:1px solid var(--line,#29415f);border-radius:9px;background:var(--panel2,#14263d);color:var(--text,#eef5ff);font-weight:650;cursor:pointer}.v814-qa-btn.primary{border-color:#6683df;background:#5b7cff;color:#fff}.v814-qa-btn.danger{color:#ff9da6}
      .v814-audio{display:grid;grid-template-columns:40px 1fr auto;align-items:center;gap:10px}.v814-audio-play{width:38px;height:38px;border:0;border-radius:50%;background:#5b7cff;color:#fff;cursor:pointer}.v814-audio-bar{height:7px;border-radius:999px;background:var(--line,#29415f);overflow:hidden}.v814-audio-bar:before{content:'';display:block;width:34%;height:100%;background:#6f8dff}.v814-audio-time{font-size:11px;color:var(--muted,#93a6bd)}
      @media(max-width:760px){.v814-qa-overlay{padding:10px}.v814-qa-dialog{width:100%;max-height:calc(100vh - 20px)}.v814-qa-grid{grid-template-columns:1fr}.v814-qa-head,.v814-qa-body,.v814-qa-actions{padding-left:14px;padding-right:14px}.v814-qa-actions{align-items:stretch;flex-direction:column}.v814-qa-actions>div{width:100%}.v814-qa-btn{flex:1}}
    `;
    doc.head.appendChild(style);
  }

  function rowValues(target){
    const row=target?.closest('tr');
    if(!row) return [];
    return [...row.cells].map(cell=>clean(cell.innerText)).filter(Boolean);
  }

  function rowTitle(values){return values.find(value=>value&&!/^选择\s/.test(value))||'当前记录'}

  function closeExisting(doc){doc.querySelectorAll('.v814-qa-overlay').forEach(node=>node.remove())}

  function openDialog(doc,{title,subtitle='',body='',primary='完成',secondary='取消',onPrimary=null,onSecondary=null}){
    closeExisting(doc);
    const overlay=doc.createElement('div');
    overlay.className='v814-qa-overlay';
    overlay.innerHTML=`<section class="v814-qa-dialog" role="dialog" aria-modal="true"><header class="v814-qa-head"><div><h2>${title}</h2><p>${subtitle}</p></div><button type="button" class="v814-qa-close" data-v814-close>关闭</button></header><div class="v814-qa-body">${body}</div><footer class="v814-qa-actions"><button type="button" class="v814-qa-btn" data-v814-secondary>${secondary}</button><div><button type="button" class="v814-qa-btn primary" data-v814-primary>${primary}</button></div></footer></section>`;
    doc.body.appendChild(overlay);
    const close=()=>overlay.remove();
    overlay.querySelector('[data-v814-close]').onclick=close;
    overlay.querySelector('[data-v814-secondary]').onclick=()=>{onSecondary?.();close()};
    overlay.querySelector('[data-v814-primary]').onclick=()=>{onPrimary?.(overlay);close()};
    overlay.addEventListener('click',event=>{if(event.target===overlay) close()});
    const esc=event=>{if(event.key==='Escape'){close();doc.removeEventListener('keydown',esc,true)}};
    doc.addEventListener('keydown',esc,true);
    return overlay;
  }

  function detailBody(values,action){
    const labels=['记录','字段 2','字段 3','字段 4','字段 5','字段 6','字段 7','状态'];
    return `<div class="v814-qa-grid"><section class="v814-qa-card"><h3>${ACTION_TITLES[action]||'记录详情'}</h3><div class="v814-qa-metrics">${values.slice(0,8).map((value,index)=>`<div class="v814-qa-metric"><span>${labels[index]||`字段 ${index+1}`}</span><b>${value}</b></div>`).join('')}</div></section><section class="v814-qa-card"><h3>下一步</h3><label class="v814-qa-field"><span>处理备注</span><textarea placeholder="补充本次处理说明"></textarea></label><label class="v814-qa-field"><span>负责人</span><select><option>Suzy Wang</option><option>Mia Chen</option><option>Leo Meyer</option></select></label></section></div>`;
  }

  function generationBody(currentRoute,values,batchNames=[]){
    const title=rowTitle(values);
    const batch=batchNames.length>1?`<div class="v814-qa-metric"><span>批量内容</span><b>${batchNames.length} 项</b></div>`:'';
    if(currentRoute==='production.languages') return `<div class="v814-qa-grid"><section class="v814-qa-card"><h3>01 · 译配范围</h3><label class="v814-qa-field"><span>内容版本</span><input value="${title}"></label><label class="v814-qa-field"><span>目标语种</span><select><option>英语 EN</option><option>西班牙语 ES</option><option>阿拉伯语 AR</option><option>俄语 RU</option></select></label><label class="v814-qa-field"><span>集数范围</span><input value="全剧"></label></section><section class="v814-qa-card"><h3>02 · 角色与音色</h3><label class="v814-qa-field"><span>主角音色</span><select><option>自动匹配 · Ava Warm</option><option>人工指定 · Sophia</option></select></label><label class="v814-qa-field"><span>配角音色</span><select><option>按声纹自动分配</option><option>沿用上一集</option></select></label><label class="v814-qa-field"><span>语速与情绪</span><input value="1.0x · 剧情自适应"></label></section><section class="v814-qa-card"><h3>03 · 字幕与人工校对</h3><label class="v814-qa-field"><span>字幕文本</span><textarea>00:00:04,200 --> 00:00:07,800\nWe should not have come back here.</textarea></label></section><section class="v814-qa-card"><h3>04 · 生成检查</h3><div class="v814-qa-metrics">${batch}<div class="v814-qa-metric"><span>字幕对齐目标</span><b>≥ 98%</b></div><div class="v814-qa-metric"><span>重复片段</span><b>自动检测</b></div><div class="v814-qa-metric"><span>质检</span><b>AI 初检 + 人工复核</b></div></div></section></div>`;
    if(currentRoute==='release.titles') return `<div class="v814-qa-grid"><section class="v814-qa-card"><h3>01 · 生成依据</h3><label class="v814-qa-field"><span>剧集版本</span><input value="${title}"></label><label class="v814-qa-field"><span>目标频道</span><input value="StoryOrbit"></label><label class="v814-qa-field"><span>剧情爆点</span><textarea>身份反转、强冲突、结果悬念。</textarea></label></section><section class="v814-qa-card"><h3>02 · 标题候选</h3>${[1,2,3].map((n,index)=>`<label class="v814-qa-field"><span>候选 ${String.fromCharCode(65+index)}</span><input maxlength="100" value="${['她查的是旧案，凶手却在等她','第十二份档案揭开所有谎言','所有人都忘了那场雨，除了她'][index]}"></label>`).join('')}</section><section class="v814-qa-card"><h3>03 · 人工编辑</h3><label class="v814-qa-field"><span>编辑说明</span><textarea>强化开头冲突，保留人物悬念，避免剧透结局。</textarea></label></section><section class="v814-qa-card"><h3>04 · 保存检查</h3><div class="v814-qa-metrics">${batch}<div class="v814-qa-metric"><span>字符限制</span><b>≤ 100</b></div><div class="v814-qa-metric"><span>频道风格</span><b>已匹配</b></div><div class="v814-qa-metric"><span>历史冲突</span><b>实时检测</b></div></div></section></div>`;
    return `<div class="v814-qa-grid"><section class="v814-qa-card"><h3>01 · 封面候选</h3><div class="v814-qa-metrics">${batch}<div class="v814-qa-metric"><span>内容版本</span><b>${title}</b></div><div class="v814-qa-metric"><span>候选方案</span><b>A / B / C</b></div><div class="v814-qa-metric"><span>画面比例</span><b>9:16</b></div></div></section><section class="v814-qa-card"><h3>02 · 人工编辑</h3><label class="v814-qa-field"><span>视觉焦点</span><select><option>主角面部 + 冲突物件</option><option>双人对峙</option><option>关键场景</option></select></label><label class="v814-qa-field"><span>编辑指令</span><textarea>人物向中心移动，提高标题安全区对比。</textarea></label></section><section class="v814-qa-card"><h3>03 · 文案与安全区</h3><label class="v814-qa-field"><span>封面短句</span><input value="她发现了不该存在的证据"></label><label class="v814-qa-field"><span>文字位置</span><select><option>底部安全区</option><option>顶部左侧</option><option>不加文字</option></select></label></section><section class="v814-qa-card"><h3>04 · 输出检查</h3><div class="v814-qa-metrics"><div class="v814-qa-metric"><span>频道一致性</span><b>95.4%</b></div><div class="v814-qa-metric"><span>视觉重复度</span><b>已检测</b></div><div class="v814-qa-metric"><span>人工复核</span><b>保存前确认</b></div></div></section></div>`;
  }

  function openGeneration(doc,currentRoute,values,batchNames=[],mode='generate'){
    const names=batchNames.length?batchNames:[rowTitle(values)];
    const title=currentRoute==='production.languages'?'语种 AI 译配':currentRoute==='release.titles'?'AI 标题生成':'AI 封面生成';
    openDialog(doc,{title:`${title} · ${names[0]}`,subtitle:batchNames.length>1?`已选择 ${batchNames.length} 项，保存后创建批量任务。`:'参数可人工编辑，保存后进入生成队列。',body:generationBody(currentRoute,values,batchNames),primary:mode==='edit'?'保存新版本':'确认并生成',secondary:'保存草稿',onPrimary:()=>toast(mode==='edit'?'新版本已保存':'生成任务已创建'),onSecondary:()=>toast('草稿已保存')});
  }

  function updateVisibleStatus(target,text){
    const row=target.closest('tr');
    if(!row) return;
    const cells=[...row.cells];
    const cell=cells.slice().reverse().find(item=>/待|中|失败|完成|采纳|恢复|生成/.test(clean(item.innerText)))||cells.at(-2);
    if(cell) cell.textContent=text;
  }

  function download(values){
    const blob=new Blob([values.join('\n')],{type:'text/plain;charset=utf-8'});
    const anchor=document.createElement('a');
    anchor.href=URL.createObjectURL(blob);
    anchor.download=`${rowTitle(values).replace(/[^\w\u3400-\u9fff-]+/g,'-')}.txt`;
    anchor.click();
    setTimeout(()=>URL.revokeObjectURL(anchor.href),1000);
    toast('下载已开始');
  }

  function copy(values){
    const text=values.slice(1,4).join('\n')||values.join('\n');
    navigator.clipboard?.writeText(text).then(()=>toast('内容已复制')).catch(()=>toast('复制失败，请手动复制'));
  }

  function selectedRows(doc){
    return [...doc.querySelectorAll('[data-v81-select]:checked')].map(input=>rowValues(input)).filter(values=>values.length);
  }

  function intercept(doc,frameWindow){
    installStyle(doc);
    frameWindow.addEventListener('click',event=>{
      const target=event.target instanceof Element?event.target:null;
      if(!target) return;
      if(target.closest('.v814-qa-overlay')) return;

      const actionButton=target.closest('[data-v88-action]');
      if(actionButton){
        event.preventDefault();event.stopImmediatePropagation();
        const action=actionButton.dataset.v88Action||'detail';
        const values=rowValues(actionButton);
        const currentRoute=route();
        if(action==='generate'||action==='edit'){openGeneration(doc,currentRoute,values,[],action);return}
        if(action==='download'){download(values);return}
        if(action==='copy'){copy(values);return}
        if(action==='listen'){
          openDialog(doc,{title:`译配试听 · ${rowTitle(values)}`,subtitle:'试听控件保持在当前页面，不再跳转到空白页面。',body:'<section class="v814-qa-card"><div class="v814-audio"><button type="button" class="v814-audio-play">▶</button><div class="v814-audio-bar"></div><span class="v814-audio-time">00:18 / 01:06</span></div></section>',primary:'关闭',secondary:'下载片段'});return
        }
        if(action==='process'){updateVisibleStatus(actionButton,'处理中');toast('任务已进入处理状态');return}
        if(action==='adopt'){updateVisibleStatus(actionButton,'已采纳');toast('已加入候选池');return}
        if(action==='retry'){updateVisibleStatus(actionButton,'重试中');toast('任务已重新进入队列');return}
        if(action==='handoff'){
          openDialog(doc,{title:`转交任务 · ${rowTitle(values)}`,subtitle:'选择新的负责人后保存。',body:'<section class="v814-qa-card"><label class="v814-qa-field"><span>转交给</span><select><option>Mia Chen</option><option>Leo Meyer</option><option>Nora Li</option></select></label><label class="v814-qa-field"><span>说明</span><textarea></textarea></label></section>',primary:'确认转交',onPrimary:()=>toast('任务已转交')});return
        }
        openDialog(doc,{title:`${ACTION_TITLES[action]||'记录详情'} · ${rowTitle(values)}`,subtitle:'所有列表操作均在当前页面完成，不再打开空白或黑屏页面。',body:detailBody(values,action),primary:action==='link'?'关闭':'保存处理',onPrimary:()=>action!=='link'&&toast('处理结果已保存')});
        return;
      }

      const bulk=target.closest('[data-v81-bulk],[data-v81-edit-selected]');
      if(bulk){
        event.preventDefault();event.stopImmediatePropagation();
        const rows=selectedRows(doc);
        if(!rows.length){toast('请先勾选至少一部剧');return}
        openGeneration(doc,route(),rows[0],rows.map(row=>rowTitle(row)),bulk.matches('[data-v81-edit-selected]')?'edit':'generate');
        return;
      }

      const direct=target.closest('[data-v81-edit],[data-v81-generate],[data-v81-detail]');
      if(direct){
        event.preventDefault();event.stopImmediatePropagation();
        const values=rowValues(direct);
        if(direct.matches('[data-v81-detail]')) openDialog(doc,{title:`记录详情 · ${rowTitle(values)}`,body:detailBody(values,'detail'),primary:'关闭'});
        else openGeneration(doc,route(),values,[],direct.matches('[data-v81-edit]')?'edit':'generate');
        return;
      }

      const row=target.closest('[data-v80-row]');
      if(row&&!target.closest('button,input,select,a,textarea')){
        event.preventDefault();event.stopImmediatePropagation();
        const values=rowValues(row);
        openDialog(doc,{title:`记录详情 · ${rowTitle(values)}`,subtitle:'点击列表行查看完整信息。',body:detailBody(values,'detail'),primary:'关闭'});
      }
    },true);
  }

  function attach(frame){
    let connectedWindow=null;
    const connect=()=>{
      try{
        const doc=frame.contentDocument;
        const frameWindow=frame.contentWindow;
        if(!doc?.body||!frameWindow||connectedWindow===frameWindow) return;
        connectedWindow=frameWindow;
        intercept(doc,frameWindow);
      }catch(error){console.warn('V8.14 button QA patch skipped',error)}
    };
    frame.addEventListener('load',()=>setTimeout(connect,120));
    setInterval(connect,800);
  }

  const frame=document.getElementById('portal');
  if(frame) attach(frame);
  else new MutationObserver((_,observer)=>{const next=document.getElementById('portal');if(next){observer.disconnect();attach(next)}}).observe(document.documentElement,{subtree:true,childList:true});
})();
