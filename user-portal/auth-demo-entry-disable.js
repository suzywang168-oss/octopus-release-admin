(()=>{
  'use strict';

  const DEMO_KEY='octopus-demo-mode';
  const DEMO_SESSION='octopus-demo-session';
  const DEMO_IDS=['directDemoLogin','directDemoRegister'];
  const DEMO_TEXT=/使用演示账号|直接进入演示空间|跳过注册，进入演示空间|demo account|enter demo workspace|skip registration and enter demo/i;

  window.__OCTOPUS_DISABLE_DEMO__=true;

  // Clear legacy demo state before demo-fallback initializes, so refresh/login cannot auto-enter the old demo route.
  try{localStorage.removeItem(DEMO_KEY)}catch{}
  try{sessionStorage.removeItem(DEMO_SESSION)}catch{}

  // Remove ?demo=1 from the outer URL as well, otherwise the legacy fallback schedules auto-entry.
  try{
    const parentUrl=new URL(window.parent.location.href);
    if(parentUrl.searchParams.has('demo')){
      parentUrl.searchParams.delete('demo');
      window.parent.history.replaceState(null,'',parentUrl.pathname+(parentUrl.search||'')+(parentUrl.hash||''));
    }
  }catch{}

  function demoEntry(el){
    if(!(el instanceof Element))return null;
    const button=el.closest('button,a,[role="button"]');
    if(!button)return null;
    if(DEMO_IDS.includes(button.id))return button;
    const authHost=button.closest('#loginForm,#registerForm,.auth-card,.auth-panel,.login-card,.register-card');
    return authHost&&DEMO_TEXT.test((button.textContent||'').trim())?button:null;
  }

  function removeEntries(root=document){
    DEMO_IDS.forEach(id=>root.getElementById?.(id)?.remove());
    root.querySelectorAll?.('#loginForm button,#registerForm button,#loginForm a,#registerForm a,.auth-card button,.auth-panel button').forEach(el=>{
      if(DEMO_TEXT.test((el.textContent||'').trim()))el.remove();
    });
  }

  // Defensive capture guard in case legacy code inserts a demo entry between mutation frames.
  window.addEventListener('pointerdown',e=>{
    const entry=demoEntry(e.target);
    if(entry){
      e.preventDefault();
      e.stopImmediatePropagation();
      entry.remove();
    }
  },true);
  window.addEventListener('click',e=>{
    const entry=demoEntry(e.target);
    if(entry){
      e.preventDefault();
      e.stopImmediatePropagation();
      entry.remove();
    }
  },true);

  removeEntries();
  new MutationObserver(()=>removeEntries()).observe(document.documentElement,{childList:true,subtree:true});
})();
