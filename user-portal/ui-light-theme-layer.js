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
        --bg:#f5f7fb!important;
        --panel:#ffffff!important;
        --panel2:#f7f8fb!important;
        --text:#111827!important;
        --soft:#667085!important;
        --line:#dbe0e8!important;
        --muted:#8a94a6!important;
        --shadow:0 10px 30px rgba(17,24,39,.06)!important;
        background:#f5f7fb!important;
        color:#111827!important
      }

      html.octopus-light body,
      html.octopus-light #app,
      html.octopus-light #shell,
      html.octopus-light #v80shell,
      html.octopus-light #pageRoot,
      html.octopus-light .v815main,
      html.octopus-light .v815content{
        background:#f5f7fb!important;
        color:#111827!important
      }

      html.octopus-light #v80nav,
      html.octopus-light .v815side,
      html.octopus-light .ota-toolbar,
      html.octopus-light .v815top,
      html.octopus-light .v815header{
        background:#ffffff!important;
        color:#111827!important;
        border-color:#dbe0e8!important
      }

      html.octopus-light :is(
        .v815page,.v815card,.v815kpi,.v815tw,.v815table,
        .orw-page,.orw-card,.orw-kpi,.orw-shell,
        .cad-data-section,.cad-insight-card,
        .occ-card,.oge-card,.gml-data-section,.ol2-data-section,
        .otp-list-card,.pcw-card,.rvw-card,.dpw-card,.loc-card,
        #octopusRowEditor .ore-panel,#apfModal .apf-modal
      ){
        background:#ffffff!important;
        color:#111827!important;
        border-color:#dbe0e8!important;
        box-shadow:none!important
      }

      html.octopus-light :is(
        .v815table th,.orw-table th,
        .v815toolbar,.orw-note,
        .v815ct,.cad-data-head,.orw-head,
        .ore-head,.ore-foot,.apf-modal-head,.apf-modal-foot
      ){
        background:#f7f8fb!important;
        color:#111827!important;
        border-color:#dbe0e8!important
      }

      html.octopus-light :is(.v815table td,.orw-table td){
        background:#ffffff!important;
        color:#111827!important;
        border-color:#e1e5ec!important
      }

      html.octopus-light :is(
        input,select,textarea,
        .v815input,.v815select,
        .ore-value,.cad-data-meta
      ){
        background:#ffffff!important;
        color:#111827!important;
        border-color:#cfd5df!important;
        box-shadow:none!important
      }
      html.octopus-light :is(input,textarea)::placeholder{color:#98a2b3!important}
      html.octopus-light select option{background:#ffffff!important;color:#111827!important}

      html.octopus-light :is(
        button:not(.primary):not(.apf-primary):not(.v815primary),
        .v815act,.orw-btn:not(.primary),.ore-btn:not(.primary),.apf-modal-btn:not(.primary),.apf-export
      ){
        background:#ffffff!important;
        color:#344054!important;
        border-color:#cfd5df!important
      }
      html.octopus-light :is(
        .primary,.apf-primary,.v815primary,
        .orw-btn.primary,.ore-btn.primary,.apf-modal-btn.primary
      ){
        background:#5b74d6!important;
        color:#ffffff!important;
        border-color:#5b74d6!important
      }

      html.octopus-light :is(
        .v815item,.v815gh,.v815ct span,.v815head p,.orw-head p,
        .orw-note,.orw-foot,.ore-head p,.ore-note,.apf-modal-head p,
        .cad-data-head p,.cad-data-meta
      ){color:#667085!important}

      html.octopus-light #v80nav .v815g.is-active-group,
      html.octopus-light #v80nav .v815item.active{
        background:#eef2ff!important;
        border-color:#c7d2fe!important;
        color:#1f2937!important
      }
      html.octopus-light #v80nav .v815item:hover{background:#f4f6fb!important;color:#111827!important}

      html.octopus-light :is(.orw-modal,#octopusRowEditor,#apfModal){
        background:rgba(15,23,42,.18)!important
      }
      html.octopus-light #octopusRowEditor .ore-backdrop{background:rgba(15,23,42,.18)!important}

      html.octopus-light .orw-source,
      html.octopus-light .cad-tag-chip{
        background:#eef2ff!important;
        color:#4056a8!important;
        border-color:#c7d2fe!important
      }

      html.octopus-light hr,
      html.octopus-light [class*="divider"],
      html.octopus-light [class*="border"]{border-color:#dbe0e8!important}

      html.octopus-light *{scrollbar-color:#c5ccd8 #f5f7fb}
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
