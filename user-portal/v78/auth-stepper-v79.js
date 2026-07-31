(()=>{
const style=document.createElement('style');
style.textContent=`.reg-progress{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:4px 0 16px}.reg-progress .reg-step{position:relative;display:grid;grid-template-columns:24px minmax(0,1fr);gap:7px;align-items:center;min-height:38px;padding:7px 8px;border:1px solid #203853;border-radius:9px;background:#0a1727;color:#71869f;transition:.18s}.reg-progress .reg-step:not(:last-child):after{content:"";position:absolute;right:-9px;top:50%;width:9px;height:1px;background:#28415f}.reg-progress .reg-num{width:24px;height:24px;display:grid;place-items:center;border-radius:7px;background:#142640;color:#8096b1;font-size:8px;font-style:normal;font-weight:800}.reg-progress .reg-copy b,.reg-progress .reg-copy small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.reg-progress .reg-copy b{font-size:8px}.reg-progress .reg-copy small{margin-top:2px;font-size:6px;color:#5d728b}.reg-progress .reg-step.on{border-color:rgba(91,124,255,.58);background:rgba(91,124,255,.10);color:#eef3ff}.reg-progress .reg-step.on .reg-num{background:#5b7cff;color:#fff}.reg-progress .reg-step.current{box-shadow:0 0 0 2px rgba(91,124,255,.10)}body.light .reg-progress .reg-step{background:#fff;border-color:#d7e1ee;color:#718095}body.light .reg-progress .reg-step.on{background:#eef2ff;border-color:#8ea3ff;color:#20304b}body.light .reg-progress .reg-num{background:#edf2f7;color:#697b92}body.light .reg-progress .reg-step.on .reg-num{background:#5b7cff;color:#fff}@media(max-width:560px){.reg-progress{gap:5px}.reg-progress .reg-step{grid-template-columns:22px 1fr;padding:6px}.reg-progress .reg-num{width:22px;height:22px}.reg-progress .reg-copy small{display:none}}`;
document.head.appendChild(style);
const progress=document.querySelector('.reg-progress');
if(!progress)return;
progress.setAttribute('aria-label','注册进度');
progress.innerHTML=`
<div class="reg-step on current" data-reg-bar="1"><i class="reg-num">1</i><span class="reg-copy"><b data-zh="验证账号" data-en="Verify account">验证账号</b><small data-zh="手机号或邮箱" data-en="Phone or email">手机号或邮箱</small></span></div>
<div class="reg-step" data-reg-bar="2"><i class="reg-num">2</i><span class="reg-copy"><b data-zh="企业信息" data-en="Company details">企业信息</b><small data-zh="完善工作空间" data-en="Set up workspace">完善工作空间</small></span></div>
<div class="reg-step" data-reg-bar="3"><i class="reg-num">3</i><span class="reg-copy"><b data-zh="创建完成" data-en="Workspace ready">创建完成</b><small data-zh="进入工作空间" data-en="Enter workspace">进入工作空间</small></span></div>`;
function syncCurrent(){const steps=[...progress.querySelectorAll('[data-reg-bar]')];const active=steps.filter(x=>x.classList.contains('on')).at(-1)||steps[0];steps.forEach(x=>x.classList.toggle('current',x===active));}
function syncLanguage(){const english=window.currentLang==='en';progress.querySelectorAll('[data-zh]').forEach(x=>x.textContent=x.dataset[english?'en':'zh']);}
let lock=false;
new MutationObserver(()=>{if(lock)return;lock=true;syncCurrent();lock=false}).observe(progress,{subtree:true,attributes:true,attributeFilter:['class']});
document.addEventListener('click',e=>{if(e.target.closest('[data-lang-toggle]'))setTimeout(syncLanguage,0)});
syncCurrent();syncLanguage();
})();