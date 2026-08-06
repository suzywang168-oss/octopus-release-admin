(()=>{
  'use strict';

  const ROOT='#pageRoot';
  const STYLE_ID='octopus-content-generation-lists';
  const ROUTES={
    'release.titles':{
      noun:'标题',
      pendingActions:['开始生成','编辑参数'],
      generatedActions:['查看标题','重新生成'],
      pending:[
        ['逆光心动','TK-US Drama','豪门千金身份反转','—','—','—','待检测','待生成'],
        ['契约之后','FB-Latina','契约婚姻反转追妻','—','—','—','待检测','待生成'],
        ['她从雨夜归来','YT-English','雨夜归来复仇真相','—','—','—','待检测','参数待确认'],
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
      noun:'封面',
      pendingActions:['开始生成','编辑参数'],
      generatedActions:['查看封面','重新生成'],
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

  const activeTab={};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'
  }[char]));

  function route(){
    return location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  }

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){
      style=document.createElement('style');
      style.id=STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent=`
      ${ROOT} .gen-list-switch{
        display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 10px;
        padding:10px 12px;border:1px solid var(--line);border-radius:11px;background:var(--panel)
      }
      ${ROOT} .gen-list-copy b{display:block;color:var(--text);font-size:9px;font-weight:800}
      ${ROOT} .gen-list-copy small{display:block;margin-top:4px;color:var(--soft);font-size:7px;line-height:1.45}
      ${ROOT} .gen-list-tabs{display:inline-flex;align-items:center;gap:3px;padding:3px;border:1px solid var(--line);border-radius:10px;background:var(--panel2)}
      ${ROOT} .gen-list-tab{
        height:29px;padding:0 12px;border:0;border-radius:7px;background:transparent;color:var(--soft);
        font-size:8px;font-weight:700;white-space:nowrap;cursor:pointer
      }
      ${ROOT} .gen-list-tab:hover{color:var(--text)}
      ${ROOT} .gen-list-tab.active{background:var(--panel);color:var(--text);box-shadow:0 2px 8px rgba(0,0,0,.16)}
      ${ROOT} .gen-list-tab em{margin-left:5px;font-style:normal;color:inherit;opacity:.7}
      ${ROOT} .gen-status{font-weight:750!important}
      ${ROOT} .gen-status[data-state="done"]{color:#65d6b2!important}
      ${ROOT} .gen-status[data-state="waiting"]{color:#91a8ff!important}
      ${ROOT} .gen-status[data-state="attention"]{color:#ffbe69!important}
      @media(max-width:760px){
        ${ROOT} .gen-list-switch{align-items:flex-start;flex-direction:column}
        ${ROOT} .gen-list-tabs{width:100%}
        ${ROOT} .gen-list-tab{flex:1 1 0;padding:0 8px}
      }
    `;
  }

  function stateFor(value){
    if(/已生成|已采用|完成/.test(value))return'done';
    if(/待确认|参数|素材待补/.test(value))return'attention';
    return'waiting';
  }

  function rowHtml(row,actions){
    const status=row[row.length-1];
    return `<tr>${row.map((value,index)=>`<td${index===row.length-1?` class="gen-status" data-state="${stateFor(value)}"`:''}>${esc(value)}</td>`).join('')}<td><div class="v815acts">${actions.map(action=>`<button type="button" class="v815act" data-a="${esc(action)}">${esc(action)}</button>`).join('')}</div></td></tr>`;
  }

  function ensureSwitch(config,current){
    const toolbar=document.querySelector(`${ROOT} .v815toolbar`);
    if(!toolbar)return null;
    let block=document.querySelector(`${ROOT} .gen-list-switch`);
    if(!block){
      block=document.createElement('section');
      block.className='gen-list-switch';
      toolbar.parentNode.insertBefore(block,toolbar);
    }
    block.innerHTML=`
      <div class="gen-list-copy"><b>${config.noun}生成内容</b><small>在待生成任务与已生成结果之间切换，避免把生产队列和结果记录混在同一张表里。</small></div>
      <div class="gen-list-tabs" role="tablist">
        <button type="button" class="gen-list-tab ${current==='pending'?'active':''}" data-generation-tab="pending">未生成内容<em>${config.pending.length}</em></button>
        <button type="button" class="gen-list-tab ${current==='generated'?'active':''}" data-generation-tab="generated">已生成内容<em>${config.generated.length}</em></button>
      </div>`;
    return block;
  }

  function renderList(force=false){
    const currentRoute=route();
    const config=ROUTES[currentRoute];
    if(!config){
      document.querySelector(`${ROOT} .gen-list-switch`)?.remove();
      return;
    }
    const table=document.querySelector(`${ROOT} .v815table`);
    const body=table?.tBodies?.[0];
    if(!table||!body)return;
    const current=activeTab[currentRoute]||'pending';
    ensureSwitch(config,current);
    const signature=`${currentRoute}:${current}`;
    if(!force&&table.dataset.generationSignature===signature)return;

    const rows=current==='generated'?config.generated:config.pending;
    const actions=current==='generated'?config.generatedActions:config.pendingActions;
    body.innerHTML=rows.map(row=>rowHtml(row,actions)).join('');
    table.dataset.generationSignature=signature;

    const input=document.querySelector(`${ROOT} [data-search]`);
    if(input)input.value='';
    const foot=document.querySelector(`${ROOT} .v815foot`);
    if(foot){
      const spans=foot.querySelectorAll('span');
      if(spans[0])spans[0].textContent=`共 ${rows.length} 条${current==='generated'?'已生成':'未生成'}记录，每页 8 条`;
      if(spans[1])spans[1].textContent='‹　1　›';
    }
    const primary=document.querySelector(`${ROOT} [data-primary]`);
    if(primary)primary.textContent=current==='generated'?`导出已生成${config.noun}`:`批量生成${config.noun}`;
  }

  function handleClick(event){
    const tab=event.target instanceof Element?event.target.closest('[data-generation-tab]'):null;
    if(!tab||!tab.closest(ROOT))return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const currentRoute=route();
    if(!ROUTES[currentRoute])return;
    activeTab[currentRoute]=tab.dataset.generationTab;
    renderList(true);
  }

  let scheduled=false;
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      installStyle();
      renderList();
    });
  }

  document.addEventListener('click',handleClick,true);
  window.addEventListener('hashchange',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,500);
  setTimeout(schedule,1400);
})();
