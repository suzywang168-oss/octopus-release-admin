(()=>{
  'use strict';

  const LANG_KEY='octopus-user-v7-language';
  const STYLE_ID='octopus-title-i18n-light-polish';
  const TARGET_ROUTE='release.titles';
  let scheduled=false;
  let applying=false;

  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const isEnglish=()=>localStorage.getItem(LANG_KEY)==='en';

  const TEXT_EN={
    'AI标题生成':'AI Title Generation',
    '从未生成内容中选择剧集，批量生成标题，并进入独立编辑页完成修改与采用。':'Select series from pending content, generate titles in batch, then edit and adopt the final version in a dedicated editor.',
    '标题生成与编辑':'Title Generation & Editing',
    '配置生成参数、比较候选结果并选择最终版本。':'Configure generation settings, compare candidates, and select the final version.',
    '自动保存已开启':'Autosave is on',
    '内容与生成设置':'Content & Generation Settings',
    '确认内容爆点、频道风格和标题限制。':'Confirm the story hook, channel style, and title constraints.',
    '剧集':'Series',
    '目标频道':'Target Channel',
    '输出语言':'Output Language',
    '英语':'English',
    '西班牙语':'Spanish',
    '阿拉伯语':'Arabic',
    '标题结构':'Title Structure',
    '身份反转 + 强冲突 + 结果悬念':'Identity reveal + strong conflict + outcome suspense',
    '情绪钩子 + 关系冲突':'Emotional hook + relationship conflict',
    '事件开场 + 真相揭露':'Event opening + truth reveal',
    '字符上限':'Character Limit',
    '候选数量':'Number of Candidates',
    '内容爆点':'Story Hook',
    '补充生成指令':'Additional Generation Instructions',
    '生成校验':'Generation Checks',
    '敏感词检测':'Sensitive-word check',
    '历史标题冲突':'Historical-title conflict',
    '频道风格匹配':'Channel-style match',
    '建议标题长度控制在 70–90 字符，并优先使用“身份反转 + 强冲突 + 结果悬念”结构。':'Keep titles around 70–90 characters and prioritize the “identity reveal + strong conflict + outcome suspense” structure.',
    '候选标题':'Candidate Titles',
    '直接编辑内容并选择最终版本。':'Edit candidates directly and select the final version.',
    '无冲突':'No conflict',
    '1 条相似':'1 similar title',
    '2 条相似':'2 similar titles',
    '保存草稿':'Save Draft',
    '重新生成':'Regenerate',
    '采用当前标题':'Adopt Current Title',
    '关闭':'Close',
    '编辑生成参数、比较候选标题，并选择最终用于频道发布的版本。':'Edit generation settings, compare candidate titles, and choose the final version for channel publishing.'
  };
  const TEXT_ZH=Object.fromEntries(Object.entries(TEXT_EN).map(([zh,en])=>[en,zh]));

  const VALUE_EN={
    '强调身份反转和情绪冲突，结尾保留悬念，避免剧透最终结局。':'Emphasize the identity reveal and emotional conflict, keep suspense at the end, and avoid spoiling the final outcome.',
    '豪门千金身份反转':'Heiress identity reveal',
    '契约婚姻反转追妻':'Contract-marriage reversal and pursuit',
    '雨夜归来复仇真相':'Rainy-night return, revenge, and truth',
    '禁忌关系强冲突':'Forbidden relationship with strong conflict',
    '失忆重逢情绪拉扯':'Amnesia reunion and emotional tension',
    '身份错位逆袭':'Swapped identity and comeback',
    '婚约骗局真相揭露':'Engagement scam and truth reveal',
    '久别重逢误会解除':'Long-separated reunion and misunderstanding resolved'
  };
  const VALUE_ZH=Object.fromEntries(Object.entries(VALUE_EN).map(([zh,en])=>[en,zh]));

  const CANDIDATE_EN=[
    'Everyone thought she had lost everything, until her true identity was revealed.',
    'She endured in silence for years and returned to make every betrayer face the truth.',
    'Her identity flips on the wedding day, and the woman everyone dismissed finally stops hiding.'
  ];

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){style=document.createElement('style');style.id=STYLE_ID;document.head.appendChild(style)}
    style.textContent=`
      html.octopus-light #pageRoot .gw3-page{background:transparent!important;color:#20242b!important}
      html.octopus-light #pageRoot .gw3-modal{background:rgba(24,31,43,.16)!important;backdrop-filter:blur(8px)!important}
      html.octopus-light #pageRoot .gw3-modal-shell{
        background:#ffffff!important;border-color:#dfe3e8!important;
        box-shadow:0 22px 60px rgba(28,35,48,.14),0 2px 10px rgba(28,35,48,.05)!important
      }
      html.octopus-light #pageRoot :is(.gw3-modal-head,.gw3-modal-foot){background:#fbfcfd!important;border-color:#e7e9ed!important}
      html.octopus-light #pageRoot .gw3-modal-head h2{color:#20242b!important}
      html.octopus-light #pageRoot .gw3-modal-head p{color:#737a85!important}
      html.octopus-light #pageRoot .gw3-modal-close{background:#ffffff!important;color:#5f6670!important;border-color:#dfe3e8!important;box-shadow:0 1px 2px rgba(28,35,48,.04)!important}
      html.octopus-light #pageRoot .gw3-modal-close:hover{background:#f4f6f8!important;color:#20242b!important}
      html.octopus-light #pageRoot .gw3-context{background:#ffffff!important;border-color:#e2e6eb!important;box-shadow:0 1px 2px rgba(28,35,48,.025)!important}
      html.octopus-light #pageRoot .gw3-chip{background:#f6f7f9!important;color:#69717c!important;border-color:#e1e5ea!important}
      html.octopus-light #pageRoot .gw3-context-state{color:#6175c8!important}
      html.octopus-light #pageRoot .gw3-panel{background:#ffffff!important;border-color:#e0e4e9!important;box-shadow:0 1px 2px rgba(28,35,48,.025),0 7px 18px rgba(28,35,48,.025)!important}
      html.octopus-light #pageRoot .gw3-panel-head{background:#fcfcfd!important;border-color:#e8eaee!important}
      html.octopus-light #pageRoot .gw3-panel-head h2{color:#252931!important}
      html.octopus-light #pageRoot .gw3-panel-head p{color:#7a818b!important}
      html.octopus-light #pageRoot .gw3-field{color:#626a75!important}
      html.octopus-light #pageRoot .gw3-field :is(input,select,textarea),
      html.octopus-light #pageRoot .gw3-title-input{
        background:#fbfcfd!important;color:#252931!important;border-color:#d9dee5!important;
        box-shadow:inset 0 1px 0 rgba(28,35,48,.012)!important
      }
      html.octopus-light #pageRoot .gw3-field :is(input,select,textarea):focus,
      html.octopus-light #pageRoot .gw3-title-input:focus{
        background:#ffffff!important;border-color:#96a6df!important;box-shadow:0 0 0 3px rgba(83,104,198,.08)!important
      }
      html.octopus-light #pageRoot .gw3-option{background:#f8f9fb!important;color:#5f6772!important;border-color:#e0e4e9!important}
      html.octopus-light #pageRoot .gw3-note{background:#f7f8fc!important;color:#68707b!important;border-color:#dfe4f2!important}
      html.octopus-light #pageRoot .gw3-title-card{background:#fafbfc!important;border-color:#e0e4e9!important}
      html.octopus-light #pageRoot .gw3-title-card:hover{background:#f7f8fa!important;border-color:#d4d9e0!important}
      html.octopus-light #pageRoot .gw3-title-card.selected{background:#f3f5fc!important;border-color:#9ba9df!important;box-shadow:0 0 0 2px rgba(83,104,198,.055)!important}
      html.octopus-light #pageRoot .gw3-radio{background:#ffffff!important;border-color:#cfd5dd!important}
      html.octopus-light #pageRoot .gw3-meta{color:#737b86!important}
      html.octopus-light #pageRoot .gw3-meta span{background:#f1f3f6!important}
      html.octopus-light #pageRoot .gw3-good{color:#2e8b70!important}
      html.octopus-light #pageRoot .gw3-warn{color:#a66d20!important}
      html.octopus-light #pageRoot .gw3-secondary{background:#ffffff!important;color:#505863!important;border-color:#dce1e7!important;box-shadow:0 1px 1px rgba(28,35,48,.025)!important}
      html.octopus-light #pageRoot .gw3-secondary:hover{background:#f5f6f8!important;color:#272c33!important;border-color:#cfd5dc!important}
      html.octopus-light #pageRoot .gw3-primary{background:#566bc2!important;border-color:#566bc2!important;color:#ffffff!important;box-shadow:0 1px 2px rgba(45,57,111,.14)!important}
      html.octopus-light #pageRoot .gw3-primary:hover{background:#4e61b3!important;border-color:#4e61b3!important}
      html.octopus-light #pageRoot .gw3-row-action.v815act{color:#5266bb!important;border-color:#d5dcf2!important;background:#fafbff!important}
      html.octopus-light #pageRoot .gw3-row-action.v815act:hover{background:#f1f4fd!important;border-color:#c8d1ef!important}
    `;
  }

  function translateText(raw,en){
    const table=en?TEXT_EN:TEXT_ZH;
    if(table[raw])return table[raw];
    if(en){
      let m=raw.match(/^候选\s*(\d+)$/);if(m)return `Candidate ${m[1]}`;
      m=raw.match(/^(\d+)\s*字符$/);if(m)return `${m[1]} chars`;
    }else{
      let m=raw.match(/^Candidate\s*(\d+)$/i);if(m)return `候选 ${m[1]}`;
      m=raw.match(/^(\d+)\s*chars$/i);if(m)return `${m[1]} 字符`;
    }
    return raw;
  }

  function translateTextNodes(root,en){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const p=node.parentElement;
      if(!p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;
      return node.nodeValue&&node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    const nodes=[];let node;while((node=walker.nextNode()))nodes.push(node);
    nodes.forEach(node=>{
      const raw=node.nodeValue.trim();
      const next=translateText(raw,en);
      if(next===raw)return;
      const start=node.nodeValue.indexOf(raw);
      node.nodeValue=node.nodeValue.slice(0,start)+next+node.nodeValue.slice(start+raw.length);
    });
  }

  function translateAria(root,en){
    root.querySelectorAll('[aria-label]').forEach(el=>{
      const raw=(el.getAttribute('aria-label')||'').trim();
      const next=translateText(raw,en);
      if(next!==raw)el.setAttribute('aria-label',next);
    });
  }

  function translateValues(root,en){
    const table=en?VALUE_EN:VALUE_ZH;
    root.querySelectorAll('textarea[data-gw3-field],input[data-gw3-field]').forEach(el=>{
      if(el.dataset.octI18nDirty==='1')return;
      const raw=el.value.trim();
      const next=table[raw];
      if(next)el.value=next;
    });

    const titleAreas=[...root.querySelectorAll('textarea[data-gw3-title]')];
    titleAreas.forEach((el,index)=>{
      if(el.dataset.octI18nDirty==='1')return;
      if(en){
        if(!el.dataset.octZhValue)el.dataset.octZhValue=el.value;
        if(/[\u3400-\u9fff]/.test(el.value))el.value=CANDIDATE_EN[index]||el.value;
      }else if(el.dataset.octZhValue && !/[\u3400-\u9fff]/.test(el.value)){
        el.value=el.dataset.octZhValue;
      }
    });

    root.querySelectorAll('textarea,input').forEach(el=>{
      if(el.dataset.octI18nBound==='1')return;
      el.dataset.octI18nBound='1';
      el.addEventListener('input',()=>{el.dataset.octI18nDirty='1'},{passive:true});
    });
  }

  function apply(){
    if(applying||route()!==TARGET_ROUTE)return;
    const root=document.getElementById('pageRoot');
    if(!root)return;
    applying=true;
    try{
      const en=isEnglish();
      translateTextNodes(root,en);
      translateAria(root,en);
      translateValues(root,en);
      root.dataset.titleI18n=en?'en':'zh';
    }finally{applying=false}
  }

  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;apply()});
  }

  installStyle();
  window.addEventListener('octopus-language-change',()=>{schedule();setTimeout(schedule,80);setTimeout(schedule,260)});
  window.addEventListener('hashchange',()=>{schedule();setTimeout(schedule,80)});
  window.addEventListener('storage',e=>{if(e.key===LANG_KEY)schedule()});
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  setTimeout(schedule,500);
  setTimeout(schedule,1200);
})();
