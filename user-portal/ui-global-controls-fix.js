(()=>{
'use strict';
const LANG_KEY='octopus-user-v7-language',THEME_KEY='octopus-v7-theme';
const UI_EN={
'关闭':'Close','取消':'Cancel','确认操作':'Confirm','保存修改':'Save changes','编辑 AI 标签':'Edit AI Tags',
'创建跟进任务':'Create follow-up task','导出分析报告':'Export report','审核所选物料':'Review selected',
'待审核 / 复核中':'Pending / In review','已通过':'Approved','已退回':'Returned','全部状态':'All statuses',
'搜索当前列表':'Search current list','搜索剧集、频道或版本':'Search series, channel, or version',
'查看解析':'View analysis','编辑AI标签':'Edit AI tags','编辑账号':'Edit account','管理API密钥':'Manage API credentials',
'查看资料':'View details','维护授权':'Manage rights','编辑模板':'Edit template','查看效果':'View performance',
'编辑权限':'Edit permissions','查看成员':'View members','查看日志':'View logs','重试任务':'Retry task',
'近 7 天':'Last 7 days','近 30 天':'Last 30 days','近 90 天':'Last 90 days',
'全部地区':'All regions','全部频道':'All channels','创建任务':'Create task','负责人':'Owner','优先级':'Priority',
'剧集':'Series','频道账号':'Channel account','视频版本':'Video version','操作':'Actions','状态':'Status',
'采用标题':'Selected title','采用封面':'Selected cover','地区 / 语种':'Region / Language','更新时间':'Updated',
'确认并创建待分发任务':'Create distribution task','新建分发任务':'New distribution task',
'保存权限配置':'Save permissions','保存密钥配置':'Save credentials','检查接入条件':'Check requirements','验证配置条件':'Validate configuration'
};
function closeEditor(){
 const d=document.getElementById('octopusRowEditor');if(!d)return;
 d.classList.remove('open','oap-tags-mode');d.removeAttribute('data-oap-mode');
}
function syncTheme(){
 const light=localStorage.getItem(THEME_KEY)==='light';document.body.classList.toggle('light',light);
 document.querySelectorAll('[data-theme]').forEach(b=>{b.textContent=light?'☾':'◐';b.title=light?'Switch to dark theme':'Switch to light theme';b.setAttribute('aria-label',b.title)});
}
function translateUi(){
 const en=localStorage.getItem(LANG_KEY)==='en';document.documentElement.lang=en?'en':'zh-CN';
 document.querySelectorAll('[data-lang-toggle]').forEach(b=>b.textContent=en?'中文':'EN');
 if(!en)return;
 document.querySelectorAll('button,th,option,label span,.rvw-foot,.dpw-foot').forEach(el=>{if(el.children.length)return;const raw=el.textContent.trim(),translated=UI_EN[raw];if(translated)el.textContent=translated});
 document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{const t=UI_EN[el.placeholder];if(t)el.placeholder=t});
}
window.addEventListener('pointerdown',e=>{
 const t=e.target instanceof Element?e.target:null;if(!t)return;
 if(t.closest('#octopusRowEditor [data-ore-close]')){e.preventDefault();e.stopImmediatePropagation();closeEditor()}
},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('octopusRowEditor')?.classList.contains('open')){e.preventDefault();closeEditor()}},true);
window.addEventListener('click',e=>{
 const t=e.target instanceof Element?e.target:null;if(!t)return;
 const theme=t.closest('[data-theme]');if(theme){e.preventDefault();e.stopImmediatePropagation();const next=localStorage.getItem(THEME_KEY)==='light'?'dark':'light';localStorage.setItem(THEME_KEY,next);syncTheme();window.toast?.(next==='light'?'已切换浅色主题':'已切换深色主题');return}
 const lang=t.closest('[data-lang-toggle]');if(lang){e.preventDefault();e.stopImmediatePropagation();const next=localStorage.getItem(LANG_KEY)==='en'?'zh':'en';localStorage.setItem(LANG_KEY,next);location.reload()}
},true);
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;syncTheme();translateUi()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('hashchange',schedule);syncTheme();translateUi();setTimeout(schedule,400);setTimeout(schedule,1200);
})();