(()=>{
  'use strict';

  const STYLE_ID='octopus-topbar-actions';
  const MESSAGE_ID='octopusMessageCenter';
  const SETTINGS_ID='octopusSettingsMenu';
  const DIALOG_ID='octopusTopbarDialog';
  let toolbar=null;

  const svg={
    bell:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
    gear:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04-2.82 2.82-.04-.04A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1.06 1.64V21h-4v-.06A1.8 1.8 0 0 0 8.9 19.3a1.8 1.8 0 0 0-1.98.36l-.04.04-2.82-2.82.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-1.64-1.06H3v-4h.06A1.8 1.8 0 0 0 4.7 8.9a1.8 1.8 0 0 0-.36-1.98l-.04-.04 2.82-2.82.04.04A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1.06-1.64V3h4v.06A1.8 1.8 0 0 0 15.1 4.7a1.8 1.8 0 0 0 1.98-.36l.04-.04 2.82 2.82-.04.04A1.8 1.8 0 0 0 19.4 9a1.8 1.8 0 0 0 1.64 1.06H21v4h-.06A1.8 1.8 0 0 0 19.4 15Z"/></svg>',
    close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    user:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    help:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.7 2c-1 .6-1.5 1.1-1.5 2.2M12 17h.01"/></svg>',
    appearance:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-1-.8-1.8-1.8-1.8h-1.6a2 2 0 0 1-2-2V6.8C15.6 4.7 14.1 3 12 3Z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10" cy="7.5" r=".8"/><circle cx="7.8" cy="15" r=".8"/></svg>'
  };

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      .ota-toolbar{
        position:relative!important;display:flex!important;align-items:center!important;width:100%!important;max-width:none!important;
        min-width:0!important;box-sizing:border-box!important;gap:10px!important
      }
      .ota-toolbar>input,.ota-toolbar .ota-search-host{min-width:220px!important;max-width:520px!important;flex:1 1 420px!important}
      .ota-toolbar>input{width:auto!important}
      .ota-actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;margin-left:auto!important;flex:0 0 auto!important}
      .ota-original-hidden{display:none!important}
      .ota-actions>button,.ota-actions>.ota-preserved{
        display:inline-flex!important;align-items:center!important;justify-content:center!important;height:36px!important;min-width:36px!important;
        padding:0 11px!important;margin:0!important;border:1px solid var(--line)!important;border-radius:9px!important;
        background:var(--panel2)!important;color:var(--text)!important;box-shadow:none!important;cursor:pointer!important;font-size:9px!important;font-weight:700!important
      }
      .ota-actions>.ota-preserved{width:auto!important}
      .ota-actions>button:hover,.ota-actions>.ota-preserved:hover{border-color:color-mix(in srgb,#6683df 45%,var(--line))!important;background:color-mix(in srgb,#6683df 8%,var(--panel2))!important}
      .ota-icon{position:relative;width:36px!important;padding:0!important}
      .ota-icon svg,.ota-menu-item svg,.ota-dialog-icon svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
      .ota-badge{position:absolute;top:-5px;right:-5px;display:grid;place-items:center;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border:2px solid var(--bg);border-radius:99px;background:#ff6f84;color:#fff;font-size:7px;font-weight:850;line-height:1}

      #${MESSAGE_ID}{position:fixed;inset:0;z-index:24000;display:none}
      #${MESSAGE_ID}.open{display:block}
      #${MESSAGE_ID} .ota-backdrop{position:absolute;inset:0;background:rgba(2,8,18,.45);backdrop-filter:blur(2px)}
      #${MESSAGE_ID} .ota-drawer{position:absolute;top:0;right:0;width:min(420px,94vw);height:100%;display:flex;flex-direction:column;border-left:1px solid var(--line);background:var(--panel);box-shadow:-24px 0 70px rgba(0,0,0,.35);animation:ota-slide .18s ease-out}
      @keyframes ota-slide{from{transform:translateX(28px);opacity:.65}to{transform:none;opacity:1}}
      .ota-drawer-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:20px;border-bottom:1px solid var(--line)}
      .ota-drawer-head h2{margin:0;color:var(--text);font-size:16px}.ota-drawer-head p{margin:6px 0 0;color:var(--soft);font-size:9px;line-height:1.5}
      .ota-head-tools{display:flex;align-items:center;gap:7px}.ota-text-btn{border:0;background:transparent;color:#91a8ff;font-size:9px;font-weight:750;cursor:pointer;white-space:nowrap}
      .ota-close{display:grid;place-items:center;width:32px;height:32px;padding:0;border:1px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--text);cursor:pointer}.ota-close svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
      .ota-message-list{flex:1;overflow:auto;padding:8px 14px 18px}.ota-message{position:relative;display:grid;grid-template-columns:9px minmax(0,1fr);gap:11px;width:100%;padding:14px 6px;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);text-align:left;cursor:pointer}
      .ota-message:hover{background:color-mix(in srgb,#6683df 5%,transparent)}.ota-message-dot{width:8px;height:8px;margin-top:4px;border-radius:50%;background:#6683df;box-shadow:0 0 0 4px color-mix(in srgb,#6683df 12%,transparent)}.ota-message.read .ota-message-dot{background:var(--line);box-shadow:none}
      .ota-message b{display:block;font-size:10px;line-height:1.45}.ota-message small{display:block;margin-top:5px;color:var(--soft);font-size:8px;line-height:1.55}.ota-message time{display:block;margin-top:7px;color:var(--muted);font-size:7px}

      #${SETTINGS_ID}{position:fixed;z-index:24500;display:none;width:220px;padding:7px;border:1px solid var(--line);border-radius:12px;background:var(--panel);box-shadow:0 18px 52px rgba(0,0,0,.36)}
      #${SETTINGS_ID}.open{display:block}.ota-menu-head{padding:9px 10px 10px;border-bottom:1px solid var(--line);margin-bottom:5px}.ota-menu-head b{display:block;color:var(--text);font-size:10px}.ota-menu-head small{display:block;margin-top:4px;color:var(--soft);font-size:8px}
      .ota-menu-item{display:flex;align-items:center;gap:10px;width:100%;min-height:38px;padding:0 10px;border:0;border-radius:8px;background:transparent;color:var(--soft);font-size:9px;font-weight:650;text-align:left;cursor:pointer}.ota-menu-item:hover{background:var(--panel2);color:var(--text)}.ota-menu-item svg{width:15px;height:15px}
      .ota-menu-note{margin-left:auto;color:var(--muted);font-size:7px}

      #${DIALOG_ID}{position:fixed;inset:0;z-index:25000;display:none;place-items:center;padding:20px;background:rgba(2,8,18,.64);backdrop-filter:blur(4px)}
      #${DIALOG_ID}.open{display:grid}.ota-dialog{width:min(600px,94vw);border:1px solid var(--line);border-radius:16px;background:var(--panel);box-shadow:0 28px 90px rgba(0,0,0,.46);overflow:hidden}
      .ota-dialog-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:19px 20px;border-bottom:1px solid var(--line)}.ota-dialog-title{display:flex;gap:12px}.ota-dialog-icon{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;background:color-mix(in srgb,#6683df 13%,var(--panel));color:#91a8ff;flex:0 0 auto}.ota-dialog-head h2{margin:0;color:var(--text);font-size:15px}.ota-dialog-head p{margin:6px 0 0;color:var(--soft);font-size:9px;line-height:1.5}
      .ota-dialog-body{padding:19px 20px}.ota-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ota-field{display:grid;gap:7px;color:var(--soft);font-size:8px;font-weight:700}.ota-field.full{grid-column:1/-1}.ota-field input,.ota-field select{width:100%;height:39px;box-sizing:border-box;padding:0 11px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);outline:0}.ota-help-list{display:grid;gap:8px}.ota-help-card{padding:13px;border:1px solid var(--line);border-radius:10px;background:var(--panel2)}.ota-help-card b{display:block;color:var(--text);font-size:10px}.ota-help-card p{margin:5px 0 0;color:var(--soft);font-size:8px;line-height:1.6}.ota-dialog-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--line)}.ota-dialog-btn{height:35px;padding:0 14px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);font-size:9px;font-weight:700;cursor:pointer}.ota-dialog-btn.primary{border-color:#6683df;background:#6683df;color:#fff}
      @media(max-width:720px){.ota-toolbar{flex-wrap:wrap!important}.ota-toolbar>input,.ota-toolbar .ota-search-host{max-width:none!important;flex-basis:100%!important}.ota-actions{width:100%!important}.ota-form-grid{grid-template-columns:1fr}.ota-field.full{grid-column:auto}}
    `;
  }

  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();
  function visible(element){if(!(element instanceof Element))return false;const s=getComputedStyle(element);const r=element.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0}
  function findSearch(){return [...document.querySelectorAll('input')].find(input=>/搜索项目|搜索.*任务|Search.*project/i.test(input.placeholder||''))||null}
  function findToolbar(input){
    let node=input?.parentElement;
    while(node&&node!==document.body){
      const buttons=[...node.querySelectorAll('button')].filter(visible);
      const rect=node.getBoundingClientRect();
      if(buttons.length>=3&&rect.height<130)return node;
      node=node.parentElement;
    }
    return input?.parentElement||null;
  }
  function isLanguage(button){return /^(EN|CN|中文|English)$/i.test(clean(button.textContent))||/语言|language/i.test((button.title||'')+' '+(button.getAttribute('aria-label')||''))}
  function isTheme(button){const meta=(button.title||'')+' '+(button.getAttribute('aria-label')||'')+' '+clean(button.textContent);return /主题|深色|浅色|theme|dark|light|☾|☀/i.test(meta)}
  function preserveOriginalButtons(bar,actions){
    const originals=[...bar.querySelectorAll('button')].filter(button=>!button.closest('.ota-actions'));
    let language=originals.find(isLanguage);
    let theme=originals.find(isTheme);
    if(!language)language=originals.find(button=>clean(button.textContent)==='EN');
    if(!theme)theme=originals.find(button=>button!==language&&!/\?/.test(clean(button.textContent)));
    originals.forEach(button=>button.classList.add('ota-original-hidden'));
    [language,theme].filter(Boolean).forEach(button=>{
      button.classList.remove('ota-original-hidden');button.classList.add('ota-preserved');button.type='button';actions.appendChild(button);
    });
  }

  function ensureOverlays(){
    if(!document.getElementById(MESSAGE_ID)){
      const panel=document.createElement('div');panel.id=MESSAGE_ID;panel.innerHTML=`
        <div class="ota-backdrop" data-ota-message-close></div>
        <aside class="ota-drawer" role="dialog" aria-modal="true" aria-labelledby="otaMessageTitle">
          <header class="ota-drawer-head"><div><h2 id="otaMessageTitle">消息中心</h2><p>发行任务、审核结果与风险提醒集中在这里。</p></div><div class="ota-head-tools"><button class="ota-text-btn" type="button" data-ota-read-all>全部已读</button><button class="ota-close" type="button" data-ota-message-close aria-label="关闭消息中心">${svg.close}</button></div></header>
          <div class="ota-message-list">
            <button class="ota-message" type="button" data-ota-message-route="release.review"><span class="ota-message-dot"></span><span><b>6 组标题与封面等待审核</b><small>其中 2 组存在语义不一致，建议优先处理。</small><time>10 分钟前</time></span></button>
            <button class="ota-message" type="button" data-ota-message-route="operations.unblock"><span class="ota-message-dot"></span><span><b>新增 4 条禁播风险提醒</b><small>版权授权链路不完整，申诉材料需要补充。</small><time>42 分钟前</time></span></button>
            <button class="ota-message" type="button" data-ota-message-route="system.tasks"><span class="ota-message-dot"></span><span><b>2 个 API 上传任务重试中</b><small>Facebook 限流已切换为分批上传策略。</small><time>1 小时前</time></span></button>
            <button class="ota-message read" type="button" data-ota-message-route="dashboard.series"><span class="ota-message-dot"></span><span><b>本周发行收入更新完成</b><small>高于周目标 6.4%，可查看剧集维度表现。</small><time>昨天 18:30</time></span></button>
          </div>
        </aside>`;document.body.appendChild(panel)
    }
    if(!document.getElementById(SETTINGS_ID)){
      const menu=document.createElement('div');menu.id=SETTINGS_ID;menu.setAttribute('role','menu');menu.innerHTML=`
        <div class="ota-menu-head"><b>Suzy Wang</b><small>发行运营管理员</small></div>
        <button class="ota-menu-item" type="button" data-ota-setting="profile">${svg.user}<span>个人设置</span></button>
        <button class="ota-menu-item" type="button" data-ota-setting="appearance">${svg.appearance}<span>外观设置</span><span class="ota-menu-note">跟随当前主题</span></button>
        <button class="ota-menu-item" type="button" data-ota-setting="help">${svg.help}<span>帮助中心</span></button>`;document.body.appendChild(menu)
    }
    if(!document.getElementById(DIALOG_ID)){
      const modal=document.createElement('div');modal.id=DIALOG_ID;modal.innerHTML='<section class="ota-dialog" role="dialog" aria-modal="true"><header class="ota-dialog-head"><div class="ota-dialog-title"><span class="ota-dialog-icon"></span><div><h2></h2><p></p></div></div><button class="ota-close" type="button" data-ota-dialog-close aria-label="关闭">'+svg.close+'</button></header><main class="ota-dialog-body"></main><footer class="ota-dialog-foot"></footer></section>';document.body.appendChild(modal)
    }
  }

  function unreadCount(){return document.querySelectorAll(`#${MESSAGE_ID} .ota-message:not(.read)`).length}
  function refreshBadge(){const badge=document.querySelector('.ota-message-button .ota-badge');const count=unreadCount();if(badge){badge.textContent=String(count);badge.style.display=count?'grid':'none'}}
  function toggleMessages(open){document.getElementById(SETTINGS_ID)?.classList.remove('open');document.getElementById(MESSAGE_ID)?.classList.toggle('open',open);document.body.style.overflow=open?'hidden':''}
  function closeSettings(){document.getElementById(SETTINGS_ID)?.classList.remove('open')}
  function toggleSettings(button){
    document.getElementById(MESSAGE_ID)?.classList.remove('open');
    const menu=document.getElementById(SETTINGS_ID);const next=!menu.classList.contains('open');menu.classList.toggle('open',next);if(!next)return;
    const r=button.getBoundingClientRect();menu.style.top=Math.min(innerHeight-220,r.bottom+8)+'px';menu.style.left=Math.max(8,Math.min(innerWidth-228,r.right-220))+'px';
  }
  function openDialog(type){
    closeSettings();const modal=document.getElementById(DIALOG_ID);const icon=modal.querySelector('.ota-dialog-icon');const title=modal.querySelector('h2');const sub=modal.querySelector('.ota-dialog-head p');const body=modal.querySelector('.ota-dialog-body');const foot=modal.querySelector('.ota-dialog-foot');
    if(type==='profile'){
      icon.innerHTML=svg.user;title.textContent='个人设置';sub.textContent='管理账号资料与工作偏好。';body.innerHTML='<div class="ota-form-grid"><label class="ota-field"><span>姓名</span><input value="Suzy Wang"></label><label class="ota-field"><span>角色</span><input value="发行运营管理员" readonly></label><label class="ota-field full"><span>邮箱</span><input value="suzywang168@gmail.com"></label><label class="ota-field"><span>默认语言</span><select><option>简体中文</option><option>English</option></select></label><label class="ota-field"><span>默认时区</span><select><option>UTC+8</option><option>UTC-8</option></select></label></div>';foot.innerHTML='<button class="ota-dialog-btn" type="button" data-ota-dialog-close>取消</button><button class="ota-dialog-btn primary" type="button" data-ota-save-profile>保存设置</button>';
    }else{
      icon.innerHTML=svg.help;title.textContent='帮助中心';sub.textContent='快速找到常用操作说明与支持入口。';body.innerHTML='<div class="ota-help-list"><article class="ota-help-card"><b>如何创建发行项目？</b><p>在业务总览点击“新建发行项目”，填写项目、区域、平台和负责人后进入选品阶段。</p></article><article class="ota-help-card"><b>内容生成结果在哪里查看？</b><p>进入 AI 标题生成或 AI 封面生成，在“已生成内容”列表查看、编辑或重新生成。</p></article><article class="ota-help-card"><b>消息为什么没有消失？</b><p>打开消息后会自动标记为已读，也可以在消息中心点击“全部已读”。</p></article><article class="ota-help-card"><b>需要人工支持</b><p>请联系 suzywang168@gmail.com，并附上页面名称与问题截图。</p></article></div>';foot.innerHTML='<button class="ota-dialog-btn primary" type="button" data-ota-dialog-close>我知道了</button>';
    }
    modal.classList.add('open')
  }
  function closeDialog(){document.getElementById(DIALOG_ID)?.classList.remove('open')}
  function go(route){if(!route)return;const next='#/'+route.replaceAll('.','/');toggleMessages(false);if(location.hash===next)window.dispatchEvent(new HashChangeEvent('hashchange'));else location.hash=next}

  function build(){
    installStyle();ensureOverlays();const input=findSearch();if(!input)return;const bar=findToolbar(input);if(!bar)return;toolbar=bar;bar.classList.add('ota-toolbar');
    let actions=bar.querySelector('.ota-actions');if(!actions){actions=document.createElement('div');actions.className='ota-actions';preserveOriginalButtons(bar,actions);actions.insertAdjacentHTML('beforeend',`<button class="ota-icon ota-message-button" type="button" aria-label="消息中心" title="消息中心">${svg.bell}<span class="ota-badge">3</span></button><button class="ota-icon ota-settings-button" type="button" aria-label="设置" title="设置">${svg.gear}</button>`);bar.appendChild(actions)}
    refreshBadge();
  }

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;if(!target)return;
    const messageButton=target.closest('.ota-message-button');if(messageButton){event.preventDefault();event.stopImmediatePropagation();toggleMessages(true);return}
    const settingsButton=target.closest('.ota-settings-button');if(settingsButton){event.preventDefault();event.stopImmediatePropagation();toggleSettings(settingsButton);return}
    if(target.closest('[data-ota-message-close]')){event.preventDefault();toggleMessages(false);return}
    if(target.closest('[data-ota-read-all]')){event.preventDefault();document.querySelectorAll(`#${MESSAGE_ID} .ota-message`).forEach(item=>item.classList.add('read'));refreshBadge();return}
    const item=target.closest('.ota-message');if(item){event.preventDefault();item.classList.add('read');refreshBadge();go(item.dataset.otaMessageRoute);return}
    const setting=target.closest('[data-ota-setting]');if(setting){event.preventDefault();const type=setting.dataset.otaSetting;if(type==='appearance'){const theme=toolbar?.querySelector('.ota-preserved:not(:first-child)');closeSettings();theme?.click()}else openDialog(type);return}
    if(target.closest('[data-ota-dialog-close]')){event.preventDefault();closeDialog();return}
    if(target.closest('[data-ota-save-profile]')){event.preventDefault();closeDialog();try{typeof window.toast==='function'&&window.toast('个人设置已保存')}catch{}return}
    if(!target.closest(`#${SETTINGS_ID}`)&&!target.closest('.ota-settings-button'))closeSettings();
  },true);
  window.addEventListener('keydown',event=>{if(event.key==='Escape'){toggleMessages(false);closeSettings();closeDialog()}});
  window.addEventListener('resize',closeSettings);

  let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;build()})}
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  setTimeout(schedule,400);setTimeout(schedule,1300);
})();
