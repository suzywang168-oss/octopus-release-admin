(()=>{
'use strict';
const LANG_KEY='octopus-ui-language-v78';
const copy={
 'zh-CN':{
  title:'管理员登录',
  sub:'当前平台仅开放 Admin 账号登录。',
  account:'管理员邮箱或手机号',
  accountPh:'请输入管理员账号',
  password:'密码',
  submit:'登录管理后台',
  badge:'ADMIN ACCESS ONLY',
  demo:'演示管理员账号',
  remember:'保持登录',
  security:'登录活动将进入安全审计记录'
 },
 'en-US':{
  title:'Admin Sign-in',
  sub:'This platform currently supports Admin accounts only.',
  account:'Admin email or phone number',
  accountPh:'Enter your admin account',
  password:'Password',
  submit:'Sign in to Admin Console',
  badge:'ADMIN ACCESS ONLY',
  demo:'Demo admin account',
  remember:'Keep me signed in',
  security:'Sign-in activity is recorded in the security audit log'
 }
};
let last='';
function currentLang(){return localStorage.getItem(LANG_KEY)==='en-US'?'en-US':'zh-CN'}
function setLabel(label,text){
 if(!label)return;
 const input=label.querySelector('input,select');
 [...label.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());
 label.insertBefore(document.createTextNode(text),input||label.firstChild);
}
function apply(){
 const gate=document.querySelector('#authGate');
 if(!gate)return false;
 const lang=currentLang(),t=copy[lang];
 const authSwitch=gate.querySelector('.auth-switch');
 if(authSwitch)authSwitch.remove();
 gate.querySelectorAll('[data-panel="register"],[data-panel="reset"]').forEach(el=>{el.hidden=true;el.classList.remove('active')});
 gate.querySelectorAll('[data-view="register"],[data-view="reset"]').forEach(el=>el.remove());
 gate.querySelectorAll('.auth-entry-links,.auth-back').forEach(el=>el.remove());
 const forgot=gate.querySelector('#authLogin .auth-link');
 if(forgot)forgot.remove();
 const options=gate.querySelector('#authLogin .auth-options');
 if(options)options.style.justifyContent='flex-start';
 const login=gate.querySelector('[data-panel="login"]');
 if(login){login.hidden=false;login.classList.add('active')}
 const title=gate.querySelector('#authTitle');if(title)title.textContent=t.title;
 const sub=gate.querySelector('#authSub');if(sub)sub.textContent=t.sub;
 const accountInput=gate.querySelector('#authLogin [name="account"]');
 const passwordInput=gate.querySelector('#authLogin [name="password"]');
 setLabel(accountInput?.closest('label'),t.account);
 setLabel(passwordInput?.closest('label'),t.password);
 if(accountInput)accountInput.placeholder=t.accountPh;
 const remember=gate.querySelector('#authLogin [name="remember"]')?.closest('label');
 if(remember){
  const input=remember.querySelector('input');
  [...remember.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());
  remember.appendChild(document.createTextNode(t.remember));
  if(input&&remember.firstChild!==input)remember.prepend(input);
 }
 const submit=gate.querySelector('#authLogin .auth-submit');if(submit)submit.textContent=t.submit;
 const demo=gate.querySelector('.auth-demo');
 if(demo){
  const b=demo.querySelector('b');if(b)b.textContent=t.demo;
 }
 let badge=gate.querySelector('.admin-only-badge');
 if(!badge){
  badge=document.createElement('div');badge.className='admin-only-badge';
  gate.querySelector('.auth-head')?.prepend(badge);
 }
 badge.textContent=t.badge;
 let foot=gate.querySelector('.auth-foot');if(foot)foot.textContent=t.security;
 document.documentElement.lang=lang;
 last=lang;
 return true;
}
const style=document.createElement('style');
style.textContent=`
.auth-switch,.auth-entry-links,.auth-back,[data-panel="register"],[data-panel="reset"]{display:none!important}
.admin-only-badge{display:inline-flex;align-items:center;height:24px;margin-bottom:14px;padding:0 9px;border:1px solid rgba(91,124,255,.34);border-radius:7px;background:rgba(91,124,255,.10);color:#9eb0ff;font-size:7px;font-weight:760;letter-spacing:.08em}
#authLogin .auth-options{justify-content:flex-start!important}
`;
document.head.appendChild(style);
let attempts=0;
const timer=setInterval(()=>{
 const ok=apply();
 attempts++;
 if(ok&&attempts>8)clearInterval(timer);
 if(attempts>80)clearInterval(timer);
},120);
window.addEventListener('storage',e=>{if(e.key===LANG_KEY)apply()});
document.addEventListener('click',()=>setTimeout(()=>{if(currentLang()!==last)apply()},30),true);
})();
// redeploy trigger 2026-07-31T18:15+08:00
