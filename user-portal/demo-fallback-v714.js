(()=>{
const DEMO_KEY='octopus-demo-mode';
const TOKEN_KEY='octopus-api-token';
const PROFILE_KEY='octopus-api-profile';
const API_KEY='octopus-api-base';
const demoProfile={
  name:'Suzy Wang',
  contact:'demo@octopus.local',
  organization:{id:'demo-org',name:'Octopus Demo Studio',type:'内容制作方'},
  role:'producer_admin',
  permissions:['*'],
  demo:true
};
function t(cn,en){return typeof currentLang!=='undefined'&&currentLang==='en'?en:cn}
function enterDemo(){
  localStorage.setItem(DEMO_KEY,'1');
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
  sessionStorage.setItem('octopus-demo-session','1');
  if(typeof window.enter==='function'){
    window.enter(demoProfile);
    setTimeout(()=>{
      try{typeof window.route==='function'&&window.route('overview')}catch{}
      try{typeof window.toast==='function'&&window.toast(t('已进入演示空间，数据保存在当前浏览器','Demo workspace opened. Data is stored in this browser.'))}catch{}
    },120);
  }
}
function exitDemo(){
  localStorage.removeItem(DEMO_KEY);
  sessionStorage.removeItem('octopus-demo-session');
}
function makeButton(id,label){
  const b=document.createElement('button');
  b.type='button';
  b.id=id;
  b.className='secondary demo-entry-btn';
  b.textContent=label;
  b.addEventListener('click',enterDemo);
  return b;
}
function install(){
  const login=document.getElementById('loginForm');
  if(login&&!document.getElementById('directDemoLogin')){
    const b=makeButton('directDemoLogin',t('直接进入演示空间','Enter demo workspace'));
    const submit=login.querySelector('.submit,button[type="submit"]');
    if(submit)submit.insertAdjacentElement('afterend',b);else login.appendChild(b);
  }
  const register=document.getElementById('registerForm');
  if(register&&!document.getElementById('directDemoRegister')){
    const host=register.querySelector('[data-enter]')?.parentElement||register;
    const b=makeButton('directDemoRegister',t('跳过注册，进入演示空间','Skip registration and enter demo'));
    host.appendChild(b);
  }
  document.querySelectorAll('button').forEach(btn=>{
    const text=(btn.textContent||'').trim();
    if((/演示账号|演示空间|demo account/i.test(text))&&!btn.dataset.demoBound){
      btn.dataset.demoBound='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();enterDemo()},true);
    }
  });
}
const style=document.createElement('style');
style.textContent=`
.demo-entry-btn{width:100%!important;margin-top:10px!important;min-height:42px!important;border:1px solid #355171!important;background:#11243a!important;color:#dce7f2!important;font-weight:700!important;letter-spacing:.01em!important}
.demo-entry-btn:hover{background:#172e49!important;border-color:#52729a!important;color:#fff!important}
.demo-mode-badge{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:1px solid #355171;border-radius:8px;background:#11243a;color:#bcd0e4;font-size:8px}
`;
document.head.appendChild(style);
window.OctopusEnterDemo=enterDemo;
window.OctopusExitDemo=exitDemo;
install();
new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
let auto=false;
try{auto=new URLSearchParams(window.parent.location.search).get('demo')==='1'}catch{}
if(auto||localStorage.getItem(DEMO_KEY)==='1')setTimeout(enterDemo,420);
})();