(()=>{
  'use strict';

  const STYLE_ID='v814-content-generation-layout-style';

  function installStyle(doc){
    if(doc.getElementById(STYLE_ID)) return;
    const style=doc.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #pageRoot .v82-tabs{display:none!important}
      #pageRoot .v82-console.v814-console-empty{display:none!important}
      #pageRoot .toolbar.v87-compact{display:flex!important;align-items:center!important;min-height:36px!important}
      #pageRoot .toolbar.v87-compact .toolbar-left{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:8px!important}
      #pageRoot .v814-generation-result-tabs{display:inline-flex!important;align-items:center!important;gap:6px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important}
      #pageRoot .v814-generation-result-tabs .v85-list-tab{height:32px!important;min-height:32px!important;padding:0 12px!important;margin:0!important;border-radius:9px!important;font-size:12px!important;line-height:30px!important;white-space:nowrap!important}
      #pageRoot .v814-generation-result-tabs .v85-list-tab b{font-size:11px!important}
      #pageRoot .v81-bulk{display:inline-flex!important;align-items:center!important;gap:7px!important;padding-right:0!important;border-right:0!important}
      #pageRoot .v81-bulk + .v814-generation-result-tabs{margin-left:2px!important}
      @media(max-width:760px){
        #pageRoot .toolbar.v87-compact .toolbar-left{align-items:stretch!important}
        #pageRoot .v814-generation-result-tabs{width:100%!important}
        #pageRoot .v814-generation-result-tabs .v85-list-tab{flex:1!important;justify-content:center!important}
      }
    `;
    doc.head.appendChild(style);
  }

  function apply(doc){
    if(!doc?.body) return;
    installStyle(doc);

    const root=doc.getElementById('pageRoot');
    if(!root) return;

    const consoleCard=root.querySelector('.v82-console');
    const moduleTabs=consoleCard?.querySelector('.v82-tabs');
    const resultTabs=consoleCard?.querySelector('.v85-list-tabs')||root.querySelector('.v85-list-tabs');
    const toolbarLeft=root.querySelector('.toolbar.v87-compact .toolbar-left')||root.querySelector('.toolbar-left');
    const bulk=toolbarLeft?.querySelector('.v81-bulk');

    if(moduleTabs) moduleTabs.setAttribute('aria-hidden','true');
    if(resultTabs&&toolbarLeft){
      resultTabs.classList.add('v814-generation-result-tabs');
      if(bulk){
        if(resultTabs.previousElementSibling!==bulk) bulk.insertAdjacentElement('afterend',resultTabs);
      }else if(resultTabs.parentElement!==toolbarLeft){
        toolbarLeft.prepend(resultTabs);
      }
    }

    if(consoleCard){
      const meaningful=[...consoleCard.children].some(child=>child!==moduleTabs&&child!==resultTabs&&getComputedStyle(child).display!=='none');
      consoleCard.classList.toggle('v814-console-empty',!meaningful);
    }
  }

  function attach(frame){
    let observedDoc=null;
    let observer=null;
    const connect=()=>{
      try{
        const doc=frame.contentDocument;
        if(!doc?.body) return;
        if(observedDoc===doc){apply(doc);return}
        observer?.disconnect();
        observedDoc=doc;
        apply(doc);
        observer=new MutationObserver(()=>apply(doc));
        observer.observe(doc.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-selected']});
      }catch(error){
        console.warn('V8.14 generation layout patch skipped',error);
      }
    };
    frame.addEventListener('load',()=>setTimeout(connect,100));
    setInterval(connect,700);
  }

  const frame=document.getElementById('portal');
  if(frame) attach(frame);
  else new MutationObserver((_,observer)=>{
    const next=document.getElementById('portal');
    if(next){observer.disconnect();attach(next)}
  }).observe(document.documentElement,{subtree:true,childList:true});
})();
