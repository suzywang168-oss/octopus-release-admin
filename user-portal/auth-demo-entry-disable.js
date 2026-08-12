(()=>{
  'use strict';

  const DEMO_KEY='octopus-demo-mode';
  const DEMO_SESSION='octopus-demo-session';
  const DEMO_TEXT=/使用演示账号|直接进入演示空间|跳过注册，进入演示空间|demo account|enter demo workspace|skip registration and enter demo/i;

  window.__OCTOPUS_DISABLE_DEMO__=true;

  // Clear legacy demo state before demo-fallback initializes.
  try{localStorage.removeItem(DEMO_KEY)}catch{}
  try{sessionStorage.removeItem(DEMO_SESSION)}catch{}

  // Remove ?demo=1 so the legacy fallback cannot auto-enter demo mode.
  try{
    const parentUrl=new URL(window.parent.location.href);
    if(parentUrl.searchParams.has('demo')){
      parentUrl.searchParams.delete('demo');
      window.parent.history.replaceState(null,'',parentUrl.pathname+(parentUrl.search||'')+(parentUrl.hash||''));
    }
  }catch{}

  // Important: keep legacy demo nodes in the DOM and only hide them.
  // Removing them caused two MutationObservers to continuously remove/recreate
  // the same buttons, which could keep the portal stuck on feature loading.
  const style=document.createElement('style');
  style.id='octopus-disable-demo-style';
  style.textContent=`
    #directDemoLogin,
    #directDemoRegister,
    .demo-entry-btn{display:none!important;visibility:hidden!important;pointer-events:none!important}
  `;
  document.head.appendChild(style);

  function isDemoEntry(target){
    if(!(target instanceof Element))return false;
    const button=target.closest('button,a,[role="button"]');
    if(!button)return false;
    if(button.id==='directDemoLogin'||button.id==='directDemoRegister'||button.classList.contains('demo-entry-btn'))return true;
    const host=button.closest('#loginForm,#registerForm,.auth-card,.auth-panel,.login-card,.register-card');
    return !!host&&DEMO_TEXT.test((button.textContent||'').trim());
  }

  // Defensive event guard without any DOM mutation observer.
  window.addEventListener('pointerdown',e=>{
    if(isDemoEntry(e.target)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);
  window.addEventListener('click',e=>{
    if(isDemoEntry(e.target)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);
})();
