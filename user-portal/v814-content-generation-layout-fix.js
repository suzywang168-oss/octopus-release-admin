(()=>{
  'use strict';

  const TAB_LABELS=['语种 AI 译配','标题生成','封面生成'];
  const STYLE_ID='v814-content-generation-layout-style';
  const PATCHED='v814ContentGenerationPatched';

  const clean=value=>(value||'').replace(/\s+/g,' ').trim();

  function findControlByText(doc,label){
    const walker=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(clean(node.nodeValue)!==label) continue;
      const parent=node.parentElement;
      if(!parent) continue;
      return parent.closest('button,[role="tab"],[role="button"],a')||parent;
    }
    return null;
  }

  function commonAncestor(elements){
    let candidate=elements[0];
    while(candidate&&candidate!==candidate.ownerDocument.body){
      if(elements.every(element=>candidate.contains(element))) return candidate;
      candidate=candidate.parentElement;
    }
    return null;
  }

  function findCounter(doc,pattern){
    const candidates=[...doc.querySelectorAll('button,[role="button"],a,div,span')]
      .filter(element=>pattern.test(clean(element.textContent)))
      .sort((a,b)=>a.childElementCount-b.childElementCount);
    const match=candidates[0];
    if(!match) return null;
    return match.closest('button,[role="button"],a')||match;
  }

  function findGenerateButton(doc){
    const controls=[...doc.querySelectorAll('button,[role="button"],a')];
    const scored=controls.map(control=>{
      const label=clean(control.textContent);
      let score=0;
      if(label==='开始译配') score=120;
      else if(label==='开始生成') score=115;
      else if(/^开始.*生成/.test(label)) score=110;
      else if(/批量生成/.test(label)) score=100;
      else if(/生成标题|生成封面/.test(label)) score=90;
      else if(/创建译配任务/.test(label)) score=40;
      return {control,score};
    }).filter(item=>item.score>0);
    scored.sort((a,b)=>b.score-a.score);
    return scored[0]?.control||null;
  }

  function installStyle(doc){
    if(doc.getElementById(STYLE_ID)) return;
    const style=doc.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      [data-v814-removed-generation-tabs="true"]{display:none!important}
      .v814-generation-action-row{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:8px!important}
      .v814-generation-result-switch{display:inline-flex;align-items:center;gap:6px;margin-left:2px}
      .v814-generation-result-switch>*{height:32px!important;min-height:32px!important;padding:0 12px!important;border-radius:9px!important;font-size:12px!important;line-height:30px!important;white-space:nowrap!important}
      @media(max-width:760px){
        .v814-generation-action-row{gap:6px!important}
        .v814-generation-result-switch{width:100%;margin-left:0}
        .v814-generation-result-switch>*{flex:1;text-align:center}
      }
    `;
    doc.head.appendChild(style);
  }

  function patch(doc){
    if(!doc?.body) return;
    installStyle(doc);

    const tabs=TAB_LABELS.map(label=>findControlByText(doc,label));
    if(tabs.some(tab=>!tab)) return;

    const pending=findCounter(doc,/^未生成(?:内容库|内容)?\s*\d+$/);
    const generated=findCounter(doc,/^已生成(?:结果)?\s*\d+$/);
    const generateButton=findGenerateButton(doc);
    if(!pending||!generated||!generateButton) return;

    let actionRow=generateButton.parentElement;
    if(!actionRow) return;
    actionRow.classList.add('v814-generation-action-row');

    let switcher=doc.querySelector('.v814-generation-result-switch');
    if(!switcher){
      switcher=doc.createElement('div');
      switcher.className='v814-generation-result-switch';
      generateButton.insertAdjacentElement('afterend',switcher);
    }
    if(pending.parentElement!==switcher) switcher.appendChild(pending);
    if(generated.parentElement!==switcher) switcher.appendChild(generated);

    const tabBar=commonAncestor(tabs);
    if(tabBar&&tabBar!==doc.body){
      tabBar.dataset.v814RemovedGenerationTabs='true';
      tabBar.setAttribute('aria-hidden','true');
    }

    doc.body.dataset[PATCHED]='true';
  }

  function attach(frame){
    const connect=()=>{
      try{
        const doc=frame.contentDocument;
        if(!doc?.body) return;
        patch(doc);
        const observer=new MutationObserver(()=>patch(doc));
        observer.observe(doc.body,{subtree:true,childList:true,characterData:true});
      }catch(error){
        console.warn('V8.14 generation layout patch skipped',error);
      }
    };
    frame.addEventListener('load',()=>setTimeout(connect,80));
    setTimeout(connect,300);
  }

  const frame=document.getElementById('portal');
  if(frame) attach(frame);
  else new MutationObserver((_,observer)=>{
    const next=document.getElementById('portal');
    if(next){observer.disconnect();attach(next)}
  }).observe(document.documentElement,{subtree:true,childList:true});
})();
