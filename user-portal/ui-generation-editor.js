(()=>{
  'use strict';

  const ROOT_ID='pageRoot';
  const STYLE_ID='octopus-generation-editor';
  const STORAGE_KEY='octopus-generation-editor-v1';
  const ROUTES={
    'release.titles':{type:'title',noun:'标题',pageTitle:'标题生成与编辑',description:'编辑生成参数、比较候选标题，并选择最终用于频道发布的版本。'},
    'release.covers':{type:'cover',noun:'封面',pageTitle:'封面生成与编辑',description:'配置画面方向、人物与视觉风格，在同一页面比较并选择最终封面。'}
  };

  let state=null;
  let savedMarkup='';

  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      #${ROOT_ID} .oge-page{max-width:1500px;margin:0 auto;padding:10px 2px 34px;color:var(--text)}
      #${ROOT_ID} .oge-head{display:flex;align-items:flex-start;justify-content:space-between;gap:22px;margin:0 0 16px;padding:0 2px;position:relative;z-index:1}
      #${ROOT_ID} .oge-head-main{min-width:0}
      #${ROOT_ID} .oge-back{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0;border:0;background:transparent;color:#91a8ff;font-size:9px;font-weight:750;cursor:pointer}
      #${ROOT_ID} .oge-head h1{margin:5px 0 0;color:var(--text);font-size:24px;line-height:1.2;letter-spacing:-.02em}
      #${ROOT_ID} .oge-head p{max-width:760px;margin:7px 0 0;color:var(--soft);font-size:10px;line-height:1.6}
      #${ROOT_ID} .oge-head-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex:0 0 auto;padding-top:28px}
      #${ROOT_ID} .oge-btn{display:inline-flex;align-items:center;justify-content:center;height:36px;padding:0 14px;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--text);font-size:9px;font-weight:750;white-space:nowrap;cursor:pointer}
      #${ROOT_ID} .oge-btn:hover{background:var(--panel2)}
      #${ROOT_ID} .oge-btn.primary{border-color:#6683df;background:#6683df;color:#fff}
      #${ROOT_ID} .oge-btn.ghost{background:transparent}

      #${ROOT_ID} .oge-context{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;padding:10px 12px;border:1px solid var(--line);border-radius:11px;background:var(--panel)}
      #${ROOT_ID} .oge-context b{font-size:10px;color:var(--text)}
      #${ROOT_ID} .oge-chip{display:inline-flex;align-items:center;min-height:25px;padding:0 9px;border:1px solid var(--line);border-radius:999px;background:var(--panel2);color:var(--soft);font-size:8px;font-weight:650}
      #${ROOT_ID} .oge-context-status{margin-left:auto;color:#91a8ff;font-size:8px;font-weight:750}

      #${ROOT_ID} .oge-grid{display:grid;grid-template-columns:minmax(360px,.82fr) minmax(520px,1.18fr);gap:14px;align-items:start}
      #${ROOT_ID} .oge-panel{border:1px solid var(--line);border-radius:14px;background:var(--panel);overflow:hidden}
      #${ROOT_ID} .oge-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:15px 16px 12px;border-bottom:1px solid var(--line)}
      #${ROOT_ID} .oge-panel-head h2{margin:0;color:var(--text);font-size:13px;line-height:1.35}
      #${ROOT_ID} .oge-panel-head p{margin:5px 0 0;color:var(--soft);font-size:8px;line-height:1.5}
      #${ROOT_ID} .oge-panel-body{padding:15px 16px 18px}
      #${ROOT_ID} .oge-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      #${ROOT_ID} .oge-field{display:grid;gap:7px;min-width:0;color:var(--soft);font-size:8px;font-weight:700}
      #${ROOT_ID} .oge-field.full{grid-column:1/-1}
      #${ROOT_ID} .oge-field input,#${ROOT_ID} .oge-field select,#${ROOT_ID} .oge-field textarea{
        width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);font:9px/1.55 system-ui;outline:0
      }
      #${ROOT_ID} .oge-field input,#${ROOT_ID} .oge-field select{height:38px;padding:0 10px}
      #${ROOT_ID} .oge-field textarea{min-height:84px;padding:10px;resize:vertical}
      #${ROOT_ID} .oge-field input:focus,#${ROOT_ID} .oge-field select:focus,#${ROOT_ID} .oge-field textarea:focus{border-color:#6683df;box-shadow:0 0 0 3px color-mix(in srgb,#6683df 14%,transparent)}
      #${ROOT_ID} .oge-readonly{display:flex;align-items:center;min-height:38px;box-sizing:border-box;padding:0 10px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);font-size:9px}
      #${ROOT_ID} .oge-checks{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
      #${ROOT_ID} .oge-check{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:0 9px;border:1px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--soft);font-size:8px;font-weight:650;cursor:pointer}
      #${ROOT_ID} .oge-check input{width:13px;height:13px;margin:0}
      #${ROOT_ID} .oge-tip{margin-top:13px;padding:11px 12px;border:1px solid color-mix(in srgb,#6683df 24%,var(--line));border-radius:9px;background:color-mix(in srgb,#6683df 7%,var(--panel));color:var(--soft);font-size:8px;line-height:1.65}

      #${ROOT_ID} .oge-candidates{display:grid;gap:10px}
      #${ROOT_ID} .oge-title-card{display:grid;grid-template-columns:28px minmax(0,1fr);gap:11px;padding:12px;border:1px solid var(--line);border-radius:11px;background:var(--panel2);cursor:pointer;transition:border-color .16s ease,background .16s ease}
      #${ROOT_ID} .oge-title-card:hover{border-color:color-mix(in srgb,#6683df 38%,var(--line))}
      #${ROOT_ID} .oge-title-card.selected{border-color:#6683df;background:color-mix(in srgb,#6683df 8%,var(--panel))}
      #${ROOT_ID} .oge-radio{display:grid;place-items:center;width:22px;height:22px;margin-top:2px;border:1px solid var(--line);border-radius:50%;background:var(--panel)}
      #${ROOT_ID} .oge-title-card.selected .oge-radio:after{content:'';width:10px;height:10px;border-radius:50%;background:#6683df}
      #${ROOT_ID} .oge-title-input{width:100%;min-height:62px;box-sizing:border-box;padding:9px 10px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--text);font:10px/1.55 system-ui;resize:vertical;outline:0}
      #${ROOT_ID} .oge-title-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:8px;color:var(--soft);font-size:8px}
      #${ROOT_ID} .oge-title-meta span{display:inline-flex;align-items:center;min-height:23px;padding:0 7px;border-radius:999px;background:var(--panel);white-space:nowrap}
      #${ROOT_ID} .oge-title-meta .good{color:#65d6b2}.oge-title-meta .warn{color:#ffbe69}

      #${ROOT_ID} .oge-cover-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      #${ROOT_ID} .oge-cover-card{padding:8px;border:1px solid var(--line);border-radius:11px;background:var(--panel2);cursor:pointer;transition:border-color .16s ease,transform .16s ease}
      #${ROOT_ID} .oge-cover-card:hover{transform:translateY(-1px);border-color:color-mix(in srgb,#6683df 38%,var(--line))}
      #${ROOT_ID} .oge-cover-card.selected{border-color:#6683df;box-shadow:0 0 0 2px color-mix(in srgb,#6683df 12%,transparent)}
      #${ROOT_ID} .oge-cover-art{position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:8px;background:#182338}
      #${ROOT_ID} .oge-cover-art:before,#${ROOT_ID} .oge-cover-art:after{content:'';position:absolute;border-radius:50%;filter:blur(2px)}
      #${ROOT_ID} .oge-cover-art.v1{background:linear-gradient(150deg,#16233b 5%,#6e263c 48%,#0b1220 100%)}
      #${ROOT_ID} .oge-cover-art.v1:before{width:68%;height:68%;left:-12%;top:8%;background:rgba(255,211,161,.28)}
      #${ROOT_ID} .oge-cover-art.v1:after{width:54%;height:54%;right:-8%;bottom:5%;background:rgba(91,111,196,.35)}
      #${ROOT_ID} .oge-cover-art.v2{background:linear-gradient(165deg,#0c1425 8%,#263e69 52%,#20121c 100%)}
      #${ROOT_ID} .oge-cover-art.v2:before{width:58%;height:76%;right:3%;top:-4%;background:rgba(235,198,157,.25)}
      #${ROOT_ID} .oge-cover-art.v2:after{width:72%;height:38%;left:-14%;bottom:7%;background:rgba(201,52,91,.26)}
      #${ROOT_ID} .oge-cover-art.v3{background:linear-gradient(140deg,#1b1222 0%,#8b4d3d 44%,#111b2c 100%)}
      #${ROOT_ID} .oge-cover-art.v3:before{width:78%;height:48%;left:-16%;top:14%;background:rgba(255,223,177,.24)}
      #${ROOT_ID} .oge-cover-art.v3:after{width:48%;height:70%;right:-6%;bottom:-8%;background:rgba(61,90,172,.34)}
      #${ROOT_ID} .oge-cover-copy{position:absolute;left:10px;right:10px;bottom:10px;z-index:2;padding:8px;border-radius:7px;background:rgba(4,9,17,.68);backdrop-filter:blur(5px)}
      #${ROOT_ID} .oge-cover-copy b{display:block;color:#fff;font-size:9px;line-height:1.35}
      #${ROOT_ID} .oge-cover-copy small{display:block;margin-top:4px;color:rgba(255,255,255,.68);font-size:7px}
      #${ROOT_ID} .oge-cover-meta{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-top:8px;color:var(--soft);font-size:7px}
      #${ROOT_ID} .oge-cover-meta strong{color:var(--text);font-size:8px}
      #${ROOT_ID} .oge-cover-tools{display:flex;gap:7px;margin-top:10px}
      #${ROOT_ID} .oge-cover-tools button{flex:1;height:29px;border:1px solid var(--line);border-radius:7px;background:var(--panel);color:var(--soft);font-size:8px;cursor:pointer}

      #${ROOT_ID} .oge-bottom{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:14px;padding:12px 14px;border:1px solid var(--line);border-radius:11px;background:var(--panel)}
      #${ROOT_ID} .oge-bottom small{color:var(--soft);font-size:8px;line-height:1.5}
      #${ROOT_ID} .oge-bottom-actions{display:flex;align-items:center;gap:8px;flex:0 0 auto}

      @media(max-width:1120px){#${ROOT_ID} .oge-grid{grid-template-columns:1fr}#${ROOT_ID} .oge-cover-grid{grid-template-columns:repeat(3,minmax(180px,1fr));overflow:auto;padding-bottom:4px}}
      @media(max-width:760px){#${ROOT_ID} .oge-head{flex-direction:column}#${ROOT_ID} .oge-head-actions{width:100%;padding-top:0}#${ROOT_ID} .oge-head-actions .oge-btn{flex:1}#${ROOT_ID} .oge-form{grid-template-columns:1fr}#${ROOT_ID} .oge-field.full{grid-column:auto}#${ROOT_ID} .oge-cover-grid{grid-template-columns:1fr}#${ROOT_ID} .oge-bottom{align-items:stretch;flex-direction:column}#${ROOT_ID} .oge-bottom-actions{width:100%}#${ROOT_ID} .oge-bottom-actions .oge-btn{flex:1}}
    `;
  }

  function rowContext(button){
    const row=button?.closest('tr');
    const table=row?.closest('table');
    if(!row||!table)return null;
    const headers=[...table.querySelectorAll('thead th')].slice(0,-1).map(cell=>cell.textContent.trim());
    const values=[...row.cells].slice(0,-1).map(cell=>cell.textContent.trim());
    const map={};headers.forEach((header,index)=>map[header]=values[index]);
    return {row,headers,values,map};
  }

  function titleCandidates(series,hook){
    const name=series||'逆光心动';
    const core=hook||'身份反转与复仇真相';
    return [
      `${name}：所有人都以为她失去一切，直到真正身份被揭开`,
      `她隐忍多年重回豪门，只为让背叛者亲眼看见真相`,
      `婚礼当天身份反转，那个被轻视的女人终于不再隐藏`
    ].map((text,index)=>({text,ctr:['8.9%','8.4%','8.1%'][index],conflict:index===1?'1 条相似':'无冲突',hook:core}));
  }

  function buildTitleEditor(config,ctx,action){
    const series=ctx?.values[0]||'逆光心动';
    const channel=ctx?.values[1]||'TK-US Drama';
    const hook=ctx?.values[2]||'豪门千金身份反转';
    state.candidates=titleCandidates(series,hook);
    state.selected=0;
    return `
      <div class="oge-page" data-generation-editor="title">
        ${headerMarkup(config,series,channel,action)}
        ${contextMarkup(series,channel,hook)}
        <div class="oge-grid">
          <section class="oge-panel">
            <header class="oge-panel-head"><div><h2>生成参数</h2><p>先明确频道、语言、内容爆点和标题约束。</p></div></header>
            <div class="oge-panel-body">
              <div class="oge-form">
                <label class="oge-field"><span>剧集</span><span class="oge-readonly">${esc(series)}</span></label>
                <label class="oge-field"><span>目标频道</span><select data-oge-setting="channel"><option selected>${esc(channel)}</option><option>TK-US Drama</option><option>FB-Latina</option><option>YT-English</option></select></label>
                <label class="oge-field"><span>输出语言</span><select data-oge-setting="language"><option>English</option><option>Español</option><option>简体中文</option></select></label>
                <label class="oge-field"><span>标题结构</span><select data-oge-setting="structure"><option>身份反转 + 强冲突 + 结果悬念</option><option>情绪爆发 + 关系反转</option><option>秘密揭露 + 高能结果</option></select></label>
                <label class="oge-field full"><span>核心内容爆点</span><textarea data-oge-setting="hook">${esc(hook)}</textarea></label>
                <label class="oge-field"><span>字符上限</span><input type="number" min="40" max="100" value="100" data-oge-setting="limit"></label>
                <label class="oge-field"><span>生成数量</span><select><option>3 个候选</option><option>5 个候选</option></select></label>
                <div class="oge-field full"><span>生成约束</span><div class="oge-checks"><label class="oge-check"><input type="checkbox" checked>冲突检测</label><label class="oge-check"><input type="checkbox" checked>频道风格匹配</label><label class="oge-check"><input type="checkbox" checked>敏感词过滤</label></div></div>
                <label class="oge-field full"><span>补充指令</span><textarea data-oge-setting="prompt" placeholder="例如：突出女主身份反转，不直接剧透结局，避免使用感叹号。">突出女主身份反转与复仇动机，保留结果悬念，语气强烈但不剧透结局。</textarea></label>
              </div>
              <div class="oge-tip">系统会同时检查字符数、历史标题冲突、频道风格匹配和点击率预测。生成后仍可直接修改每一个候选标题。</div>
            </div>
          </section>
          <section class="oge-panel">
            <header class="oge-panel-head"><div><h2>候选标题</h2><p>选择一个方案继续编辑，采用前仍可重新生成。</p></div><button class="oge-btn ghost" type="button" data-oge-generate>重新生成</button></header>
            <div class="oge-panel-body"><div class="oge-candidates" data-oge-title-list>${titleCards()}</div></div>
          </section>
        </div>
        ${bottomMarkup('选择候选标题后保存草稿，或直接采用并返回已生成内容列表。')}
      </div>`;
  }

  function titleCards(){
    return state.candidates.map((item,index)=>`
      <article class="oge-title-card ${state.selected===index?'selected':''}" data-oge-select="${index}">
        <span class="oge-radio"></span>
        <div><textarea class="oge-title-input" data-oge-title="${index}">${esc(item.text)}</textarea><div class="oge-title-meta"><span data-oge-count="${index}">${item.text.length} / 100 字符</span><span class="good">CTR 预测 ${item.ctr}</span><span class="${item.conflict==='无冲突'?'good':'warn'}">${item.conflict}</span></div></div>
      </article>`).join('');
  }

  function buildCoverEditor(config,ctx,action){
    const series=ctx?.values[0]||'逆光心动';
    const channel=ctx?.values[1]||'TK-US Drama';
    const hook=ctx?.values[2]||'双人对峙 / 豪门';
    state.selected=0;
    return `
      <div class="oge-page" data-generation-editor="cover">
        ${headerMarkup(config,series,channel,action)}
        ${contextMarkup(series,channel,hook)}
        <div class="oge-grid">
          <section class="oge-panel">
            <header class="oge-panel-head"><div><h2>视觉参数</h2><p>定义人物、场景、画面结构与频道视觉规范。</p></div></header>
            <div class="oge-panel-body">
              <div class="oge-form">
                <label class="oge-field"><span>剧集</span><span class="oge-readonly">${esc(series)}</span></label>
                <label class="oge-field"><span>目标频道</span><select data-oge-setting="channel"><option selected>${esc(channel)}</option><option>TK-US Drama</option><option>FB-Latina</option><option>YT-English</option></select></label>
                <label class="oge-field"><span>画面比例</span><select><option>4:5 竖版封面</option><option>9:16 竖屏</option><option>16:9 横版</option></select></label>
                <label class="oge-field"><span>视觉风格</span><select><option>电影感强冲突</option><option>高饱和情绪海报</option><option>写实人物关系</option></select></label>
                <label class="oge-field full"><span>视觉爆点</span><textarea data-oge-setting="hook">${esc(hook)}</textarea></label>
                <label class="oge-field"><span>人物主体</span><select><option>女主正面 + 男主背影</option><option>双人正面对峙</option><option>单人情绪特写</option></select></label>
                <label class="oge-field"><span>场景</span><select><option>豪门大厅</option><option>雨夜街道</option><option>婚礼现场</option><option>医院走廊</option></select></label>
                <label class="oge-field full"><span>画面提示词</span><textarea data-oge-setting="prompt">强烈人物对峙，女主占据视觉中心，豪门场景，冷暖光源冲突，保留标题安全区，适配短剧频道封面。</textarea></label>
                <label class="oge-field full"><span>排除内容</span><textarea data-oge-setting="negative">避免多人群像、模糊五官、文字乱码、过度暴露、手部畸形和复杂背景。</textarea></label>
              </div>
              <div class="oge-tip">封面结果会同步检测频道风格匹配、画面重复度、人物清晰度和标题安全区。可上传自定义图片替换任一候选。</div>
            </div>
          </section>
          <section class="oge-panel">
            <header class="oge-panel-head"><div><h2>候选封面</h2><p>点击封面选择最终版本，也可以上传图片替换。</p></div><button class="oge-btn ghost" type="button" data-oge-generate>重新生成</button></header>
            <div class="oge-panel-body">
              <div class="oge-cover-grid" data-oge-cover-list>${coverCards(series)}</div>
              <input type="file" accept="image/*" hidden data-oge-upload-input>
            </div>
          </section>
        </div>
        ${bottomMarkup('选择候选封面后保存草稿，或采用当前封面并返回已生成内容列表。')}
      </div>`;
  }

  function coverCards(series){
    const labels=['身份揭晓','危险关系','复仇归来'];
    const scores=['CTR 9.1%','CTR 8.7%','CTR 8.3%'];
    return labels.map((label,index)=>`
      <article class="oge-cover-card ${state.selected===index?'selected':''}" data-oge-select="${index}">
        <div class="oge-cover-art v${index+1}" data-oge-cover-art="${index}"><div class="oge-cover-copy"><b>${esc(series)} · ${label}</b><small>频道定制封面方案 ${index+1}</small></div></div>
        <div class="oge-cover-meta"><strong>${scores[index]}</strong><span>${[96,94,92][index]}% 风格匹配</span></div>
        <div class="oge-cover-tools"><button type="button" data-oge-preview="${index}">放大预览</button><button type="button" data-oge-upload="${index}">上传替换</button></div>
      </article>`).join('');
  }

  function headerMarkup(config,series,channel,action){
    return `<header class="oge-head"><div class="oge-head-main"><button class="oge-back" type="button" data-oge-back>‹ 返回${config.noun}列表</button><h1>${esc(config.pageTitle)}</h1><p>${esc(config.description)} 当前操作：${esc(action||'编辑生成内容')}。</p></div><div class="oge-head-actions"><button class="oge-btn" type="button" data-oge-save>保存草稿</button><button class="oge-btn primary" type="button" data-oge-adopt>采用当前方案</button></div></header>`;
  }

  function contextMarkup(series,channel,hook){
    return `<div class="oge-context"><b>${esc(series)}</b><span class="oge-chip">${esc(channel)}</span><span class="oge-chip">${esc(hook)}</span><span class="oge-context-status">编辑中 · 自动保存已开启</span></div>`;
  }

  function bottomMarkup(note){
    return `<footer class="oge-bottom"><small>${esc(note)}</small><div class="oge-bottom-actions"><button class="oge-btn" type="button" data-oge-back>取消并返回</button><button class="oge-btn" type="button" data-oge-save>保存草稿</button><button class="oge-btn primary" type="button" data-oge-adopt>采用当前方案</button></div></footer>`;
  }

  function openEditor(button){
    const config=ROUTES[route()];
    if(!config)return;
    const root=document.getElementById(ROOT_ID);
    if(!root)return;
    const context=rowContext(button);
    savedMarkup=root.innerHTML;
    state={route:route(),config,context,selected:0,action:button?.dataset?.a||button?.textContent?.trim()||`编辑${config.noun}`};
    root.dataset.generationEditor='1';
    root.innerHTML=config.type==='title'?buildTitleEditor(config,context,state.action):buildCoverEditor(config,context,state.action);
    window.scrollTo?.({top:0,behavior:'smooth'});
  }

  function closeEditor(){
    if(!state)return;
    const root=document.getElementById(ROOT_ID);
    if(root&&savedMarkup){root.innerHTML=savedMarkup;delete root.dataset.generationEditor}
    state=null;savedMarkup='';
    requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
  }

  function updateSnapshot(status){
    if(!savedMarkup||!state?.context?.values?.[0])return;
    const shell=document.createElement('div');shell.innerHTML=savedMarkup;
    const series=state.context.values[0];
    const row=[...shell.querySelectorAll('tbody tr')].find(item=>item.cells[0]?.textContent.trim()===series);
    if(row&&row.cells.length>1)row.cells[row.cells.length-2].textContent=status;
    savedMarkup=shell.innerHTML;
  }

  function persist(status){
    if(!state)return;
    const root=document.getElementById(ROOT_ID);
    const fields={};root?.querySelectorAll('[data-oge-setting]').forEach(field=>fields[field.dataset.ogeSetting]=field.value);
    const titles=[...root?.querySelectorAll('[data-oge-title]')||[]].map(field=>field.value.trim());
    let data={};try{data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{}
    const series=state.context?.values?.[0]||'current';
    data[`${state.route}:${series}`]={route:state.route,series,selected:state.selected,fields,titles,status,updatedAt:new Date().toISOString()};
    localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
    updateSnapshot(status);
  }

  function toast(message){try{typeof window.toast==='function'&&window.toast(message)}catch{}}

  function regenerate(){
    if(!state)return;
    const root=document.getElementById(ROOT_ID);
    if(state.config.type==='title'){
      const series=state.context?.values?.[0]||'逆光心动';
      const hook=root.querySelector('[data-oge-setting="hook"]')?.value.trim()||'身份反转';
      state.candidates=[
        `${series}：她在所有人面前揭开身份，背叛者终于付出代价`,
        `他们夺走她的一切，却不知道她才是真正的继承人`,
        `重回豪门的第一天，她让那场精心设计的骗局彻底崩塌`
      ].map((text,index)=>({text,ctr:['9.0%','8.6%','8.2%'][index],conflict:'无冲突',hook}));
      state.selected=0;
      const list=root.querySelector('[data-oge-title-list]');if(list)list.innerHTML=titleCards();
    }else{
      root.querySelectorAll('.oge-cover-art').forEach((art,index)=>{
        art.classList.remove('v1','v2','v3');art.classList.add(`v${((index+1)%3)+1}`);
      });
      state.selected=0;selectCandidate(0);
    }
    toast(`已重新生成 3 个${state.config.noun}方案`);
  }

  function selectCandidate(index){
    if(!state)return;state.selected=index;
    const root=document.getElementById(ROOT_ID);
    root?.querySelectorAll('[data-oge-select]').forEach(card=>card.classList.toggle('selected',Number(card.dataset.ogeSelect)===index));
  }

  function saveDraft(){persist('已保存');toast(`${state.config.noun}草稿已保存`)}
  function adopt(){persist('已采用');toast(`已采用当前${state.config.noun}方案`);closeEditor()}

  function handleClick(event){
    const target=event.target instanceof Element?event.target:null;if(!target)return;
    const current=route();

    if(!state&&ROUTES[current]){
      const action=target.closest(`#${ROOT_ID} .v815act[data-a]`);
      if(action){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();openEditor(action);return}
      const primary=target.closest(`#${ROOT_ID} [data-primary]`);
      if(primary){
        const first=document.querySelector(`#${ROOT_ID} .v815table tbody tr .v815act[data-a]`);
        if(first){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();openEditor(first);return}
      }
    }

    if(!state||!target.closest(`#${ROOT_ID} [data-generation-editor]`))return;
    if(target.closest('[data-oge-back]')){event.preventDefault();event.stopImmediatePropagation();closeEditor();return}
    if(target.closest('[data-oge-save]')){event.preventDefault();event.stopImmediatePropagation();saveDraft();return}
    if(target.closest('[data-oge-adopt]')){event.preventDefault();event.stopImmediatePropagation();adopt();return}
    if(target.closest('[data-oge-generate]')){event.preventDefault();event.stopImmediatePropagation();regenerate();return}
    const select=target.closest('[data-oge-select]');if(select&&!target.closest('textarea,button,input,select')){event.preventDefault();selectCandidate(Number(select.dataset.ogeSelect));return}
    const upload=target.closest('[data-oge-upload]');if(upload){event.preventDefault();state.uploadIndex=Number(upload.dataset.ogeUpload);document.querySelector('[data-oge-upload-input]')?.click();return}
    const preview=target.closest('[data-oge-preview]');if(preview){event.preventDefault();selectCandidate(Number(preview.dataset.ogePreview));toast('已选中该封面，可采用或上传替换');return}
  }

  function handleInput(event){
    const target=event.target;if(!state||!(target instanceof HTMLTextAreaElement))return;
    if(target.matches('[data-oge-title]')){
      const index=Number(target.dataset.ogeTitle);const count=document.querySelector(`[data-oge-count="${index}"]`);if(count)count.textContent=`${target.value.length} / 100 字符`;
      state.candidates[index].text=target.value;
    }
  }

  function handleChange(event){
    const input=event.target;if(!state||!(input instanceof HTMLInputElement)||!input.matches('[data-oge-upload-input]')||!input.files?.[0])return;
    const file=input.files[0];const reader=new FileReader();reader.onload=()=>{
      const art=document.querySelector(`[data-oge-cover-art="${state.uploadIndex||0}"]`);if(art){art.style.backgroundImage=`url(${reader.result})`;art.style.backgroundSize='cover';art.style.backgroundPosition='center'}
      selectCandidate(state.uploadIndex||0);toast('替换图片已载入');
    };reader.readAsDataURL(file);
  }

  installStyle();
  window.addEventListener('click',handleClick,true);
  window.addEventListener('input',handleInput,true);
  window.addEventListener('change',handleChange,true);
  window.addEventListener('hashchange',()=>{state=null;savedMarkup=''});
  window.addEventListener('keydown',event=>{if(event.key==='Escape'&&state)closeEditor()});
})();
