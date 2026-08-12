(()=>{
  'use strict';

  const DEMO_KEY='octopus-demo-mode';
  const TOKEN_KEY='octopus-api-token';
  const PROFILE_KEY='octopus-api-profile';
  const DEMO_SESSION='octopus-demo-session';
  const DIRECT_TEXT=/^(直接进入演示空间|Enter demo workspace|跳过注册，进入演示空间|Skip registration and enter demo)$/i;
  const LEGACY_TEXT=/^(使用演示账号|Use demo account|Demo account)$/i;
  const demoProfile={
    name:'Suzy Wang',
    contact:'demo@octopus.local',
    organization:{id:'demo-org',name:'Octopus Demo Studio',type:'内容制作方'},
    role:'producer_admin',
    permissions:['*'],
    demo:true
  };

  window.__OCTOPUS_DISABLE_DEMO__=false;
  document.getElementById('octopus-disable-demo-style')?.remove();

  function removeLegacyDemoAccountButtons(){
    document.querySelectorAll('#loginForm button,#loginForm a,#registerForm button,#registerForm a,.auth-card button,.auth-panel button').forEach(button=>{
      const text=(button.textContent||'').trim();
      if(LEGACY_TEXT.test(text)&&button.id!=='directDemoLogin'&&!button.classList.contains('demo-entry-btn'))button.remove();
    });
  }

  function entryFrom(target){
    if(!(target instanceof Element))return null;
    const button=target.closest('button,a,[role="button"]');
    if(!button)return null;
    if(button.id==='directDemoLogin'||button.id==='directDemoRegister'||button.classList.contains('demo-entry-btn'))return button;
    const host=button.closest('#loginForm,#registerForm,.auth-card,.auth-panel,.login-card,.register-card');
    return host&&DIRECT_TEXT.test((button.textContent||'').trim())?button:null;
  }

  function activateDemo(){
    try{localStorage.setItem(DEMO_KEY,'1')}catch{}
    try{localStorage.removeItem(TOKEN_KEY)}catch{}
    try{localStorage.removeItem(PROFILE_KEY)}catch{}
    try{sessionStorage.setItem(DEMO_SESSION,'1')}catch{}

    let entered=false;
    try{
      if(typeof window.enter==='function'){
        window.enter(demoProfile);
        entered=true;
      }
    }catch(e){console.warn('Demo enter fallback',e)}

    const appShell=document.getElementById('appShell');
    if(appShell)appShell.classList.remove('hidden');
    ['authShell','authView','loginView','registerView'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));

    const target='#/overview';
    if(location.hash!==target)history.replaceState(null,'',location.pathname+location.search+target);
    try{window.dispatchEvent(new Event('hashchange'))}catch{}
    requestAnimationFrame(()=>{
      try{window.dispatchEvent(new Event('hashchange'))}catch{}
      window.toast?.(document.documentElement.lang==='en'?'Demo workspace opened':'已进入演示工作区');
    });

    return entered||!!appShell;
  }

  function consume(entry,e){
    e.preventDefault();
    e.stopImmediatePropagation();
    activateDemo();
    const previous=entry.style.pointerEvents;
    entry.style.pointerEvents='none';
    setTimeout(()=>{if(entry.isConnected)entry.style.pointerEvents=previous},520);
  }

  removeLegacyDemoAccountButtons();
  setTimeout(removeLegacyDemoAccountButtons,180);
  setTimeout(removeLegacyDemoAccountButtons,720);
  window.addEventListener('octopus-language-change',()=>setTimeout(removeLegacyDemoAccountButtons,0));

  window.addEventListener('pointerdown',e=>{
    const entry=entryFrom(e.target);
    if(entry)consume(entry,e);
  },true);

  window.addEventListener('click',e=>{
    const entry=entryFrom(e.target);
    if(entry)consume(entry,e);
  },true);

  window.OctopusEnterDemoCurrent=activateDemo;
})();