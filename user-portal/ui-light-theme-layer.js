(()=>{
  'use strict';

  const STYLE_ID='octopus-light-theme-layer';
  const THEME_KEY='octopus-v7-theme';

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){
      style=document.createElement('style');
      style.id=STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent=`
      html.octopus-light,
      html.octopus-light body,
      body.light{
        color-scheme:light!important;
        --bg:#f4f5f7!important;
        --panel:#ffffff!important;
        --panel2:#f7f8fa!important;
        --text:#1c1d21!important;
        --soft:#6f737b!important;
        --line:#e3e5e8!important;
        --muted:#9aa0a8!important;
        --shadow:0 1px 2px rgba(16,24,40,.035),0 8px 24px rgba(16,24,40,.035)!important;
        background:#f4f5f7!important;
        color:#1c1d21!important
      }

      html.octopus-light body,
      html.octopus-light #app,
      html.octopus-light #shell,
      html.octopus-light #v80shell,
      html.octopus-light #pageRoot,
      html.octopus-light .v815main,
      html.octopus-light .v815content{
        background:#f4f5f7!important;
        color:#1c1d21!important
      }

      html.octopus-light #v80nav,
      html.octopus-light .v815side{
        background:#f9fafb!important;
        color:#1c1d21!important;
        border-color:#e5e7eb!important;
        box-shadow:inset -1px 0 0 rgba(17,24,39,.025)!important
      }

      html.octopus-light :is(.ota-toolbar,.v815top,.v815header){
        background:rgba(255,255,255,.94)!important;
        color:#1c1d21!important;
        border-color:#e5e7eb!important;
        box-shadow:0 1px 0 rgba(17,24,39,.025)!important;
        backdrop-filter:blur(14px)!important
      }

      html.octopus-light :is(
        .v815card,.v815kpi,.v815tw,.v815flow,
        .orw-card,.orw-kpi,.orw-shell,
        .cad-data-section,.cad-insight-card,
        .occ-card,.oge-card,.gml-data-section,.ol2-data-section,
        .otp-list-card,.pcw-card,.rvw-card,.dpw-card,.loc-card,
        #octopusRowEditor .ore-panel,#apfModal .apf-modal
      ){
        background:#ffffff!important;
        color:#1c1d21!important;
        border-color:#e3e5e8!important;
        box-shadow:0 1px 2px rgba(16,24,40,.025),0 6px 18px rgba(16,24,40,.025)!important
      }

      html.octopus-light :is(
        .v815table th,.orw-table th,
        .v815ct,.cad-data-head,.orw-head,
        .ore-head,.ore-foot,.apf-modal-head,.apf-modal-foot
      ){
        background:#f8f9fa!important;
        color:#34373d!important;
        border-color:#e7e9ec!important
      }

      html.octopus-light .v815toolbar{
        background:transparent!important;
        border-color:transparent!important;
        box-shadow:none!important
      }

      html.octopus-light :is(.v815table td,.orw-table td){
        background:#ffffff!important;
        color:#25272b!important;
        border-color:#eceef0!important
      }
      html.octopus-light :is(.v815table tbody tr:hover td,.orw-table tbody tr:hover td){background:#fafbfc!important}

      html.octopus-light :is(
        input,select,textarea,
        .v815input,.v815select,
        .ore-value,.cad-data-meta
      ){
        background:#ffffff!important;
        color:#25272b!important;
        border-color:#d9dde2!important;
        box-shadow:0 1px 1px rgba(16,24,40,.02)!important
      }
      html.octopus-light :is(input,select,textarea):focus{
        outline:none!important;
        border-color:#aab5df!important;
        box-shadow:0 0 0 3px rgba(83,104,198,.09)!important
      }
      html.octopus-light :is(input,textarea)::placeholder{color:#a2a7af!important}
      html.octopus-light select option{background:#ffffff!important;color:#25272b!important}

      html.octopus-light :is(
        .v815ghost,.orw-btn:not(.primary),.ore-btn:not(.primary),
        .apf-modal-btn:not(.primary),.apf-export
      ){
        background:#ffffff!important;
        color:#4f555f!important;
        border-color:#dfe2e6!important;
        box-shadow:0 1px 1px rgba(16,24,40,.02)!important
      }
      html.octopus-light :is(
        .v815ghost,.orw-btn:not(.primary),.ore-btn:not(.primary),
        .apf-modal-btn:not(.primary),.apf-export
      ):hover{
        background:#f7f8fa!important;
        color:#23262b!important;
        border-color:#d4d8de!important
      }

      html.octopus-light :is(.v815act,.orw-unified-action){
        background:transparent!important;
        color:#636a74!important;
        border-color:transparent!important;
        box-shadow:none!important
      }
      html.octopus-light :is(.v815act,.orw-unified-action):first-child{
        color:#556bc8!important;
        border-color:#d7dcf1!important;
        background:#fafbff!important
      }
      html.octopus-light :is(.v815act,.orw-unified-action):hover{
        background:#f1f3f6!important;
        color:#25272b!important;
        border-color:#e5e7eb!important
      }

      html.octopus-light #v80nav button{
        background:transparent!important;
        border-color:transparent!important;
        color:#737983!important;
        box-shadow:none!important
      }
      html.octopus-light #v80nav button:hover{
        background:#f0f2f4!important;
        color:#25272b!important
      }
      html.octopus-light #v80nav button.active,
      html.octopus-light #v80nav .v815item.active{
        background:#eef1fa!important;
        border-color:transparent!important;
        color:#27345f!important;
        box-shadow:inset 2px 0 #6074c7!important
      }
      html.octopus-light #v80nav .v815no{
        background:#eef0f3!important;
        color:#6b717a!important
      }
      html.octopus-light #v80nav .v815gh{color:#41454d!important}

      html.octopus-light .v815step{
        background:#fafbfc!important;
        color:#6b717a!important;
        border-color:#e7e9ec!important;
        box-shadow:none!important
      }
      html.octopus-light .v815step:hover{background:#f5f6f8!important;color:#34373d!important}
      html.octopus-light .v815step.active{
        background:#f0f2fa!important;
        color:#28345f!important;
        border-color:#d5daf0!important;
        box-shadow:inset 0 0 0 1px rgba(96,116,199,.04)!important
      }

      html.octopus-light :is(
        .primary,.apf-primary,.v815primary,
        .orw-btn.primary,.ore-btn.primary,.apf-modal-btn.primary
      ){
        background:#586dc5!important;
        color:#ffffff!important;
        border-color:#586dc5!important;
        box-shadow:0 1px 2px rgba(46,58,110,.14)!important
      }
      html.octopus-light :is(
        .primary,.apf-primary,.v815primary,
        .orw-btn.primary,.ore-btn.primary,.apf-modal-btn.primary
      ):hover{
        background:#4f63b6!important;
        border-color:#4f63b6!important
      }

      html.octopus-light :is(
        .v815item,.v815gh small,.v815ct span,.v815head p,.orw-head p,
        .orw-note,.orw-foot,.ore-head p,.ore-note,.apf-modal-head p,
        .cad-data-head p,.cad-data-meta,.v815foot
      ){color:#747a84!important}

      html.octopus-light .orw-note{
        background:#f8f9fc!important;
        color:#6b717a!important;
        border-color:#e7e9ef!important
      }
      html.octopus-light .orw-source,
      html.octopus-light .cad-tag-chip{
        background:#f2f4fb!important;
        color:#4e61ad!important;
        border-color:#d9def1!important
      }

      html.octopus-light :is(.orw-modal,#octopusRowEditor,#apfModal,#v815modal){
        background:rgba(29,33,41,.20)!important;
        backdrop-filter:blur(3px)!important
      }
      html.octopus-light #octopusRowEditor .ore-backdrop{background:rgba(29,33,41,.20)!important}

      html.octopus-light hr,
      html.octopus-light [class*="divider"],
      html.octopus-light [class*="border"]{border-color:#e3e5e8!important}

      html.octopus-light *{scrollbar-color:#c9cdd3 #f4f5f7}
    `;
  }

  function sync(){
    const light=localStorage.getItem(THEME_KEY)==='light';
    document.documentElement.classList.toggle('octopus-light',light);
    document.body?.classList.toggle('light',light);
    document.documentElement.style.colorScheme=light?'light':'dark';
    document.body?.setAttribute('data-theme-mode',light?'light':'dark');
  }

  installStyle();
  sync();
  window.addEventListener('storage',e=>{if(e.key===THEME_KEY)sync()});
  window.addEventListener('hashchange',sync);
  const observer=new MutationObserver(()=>requestAnimationFrame(sync));
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-theme-mode']});
  setTimeout(sync,250);
  setTimeout(sync,900);
})();
