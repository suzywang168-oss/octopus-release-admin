(()=>{
  'use strict';

  const STYLE_ID='octopus-clean-navigation-actions';
  const ACTIONS={
    'operations.channel-analysis':['对标对比','加入选剧报告'],
    'operations.ad-intelligence':['查看素材','生成上线建议'],
    'operations.unblock':['查看链接','更新工单'],
    'production.content':['查看解析','编辑AI标签'],
    'production.localization':['查看任务','配置译配'],
    'release.titles':['查看3个标题','采用标题'],
    'release.covers':['预览3张封面','采用封面'],
    'release.review':['标题封面预览','通过物料'],
    'release.distribution':['发布前校验','查看上传'],
    'dashboard.series':['查看趋势','诊断建议'],
    'dashboard.channels':['账号详情','健康诊断'],
    'dashboard.external':['查看外部素材','生成机会建议'],
    'dashboard.risk':['查看风险明细','进入解禁工单'],
    'system.channels':['编辑账号','管理API密钥'],
    'system.assets':['查看资料','维护授权'],
    'system.templates':['编辑模板','查看效果'],
    'system.roles':['编辑权限','查看成员'],
    'system.tasks':['查看日志','重试任务']
  };

  function currentRoute(){
    return location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #v80nav .v815no,
      #v80nav .v815item>span,
      .v815flow .v815no,
      .v815mods .v815mod>span{display:none!important}
      #v80nav .v815gh{padding-left:10px!important;align-items:center!important}
      #v80nav .v815item{padding-left:14px!important}
      .v815flowgrid{grid-template-columns:repeat(5,minmax(132px,1fr))!important;min-width:700px!important}
      .v815step{align-items:center!important;justify-content:flex-start!important}
      .v815mods .v815mod{padding-top:13px!important}
      .v815acts{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;gap:5px!important;min-width:max-content!important;white-space:nowrap!important}
      .v815act{flex:0 0 auto!important;white-space:nowrap!important;padding:0 8px!important}
      .v815table th:last-child,.v815table td:last-child{width:1%!important;min-width:150px!important}
    `;
    document.head.appendChild(style);
  }

  function trimActions(){
    const keep=ACTIONS[currentRoute()];
    document.querySelectorAll('.v815acts').forEach(group=>{
      const buttons=[...group.querySelectorAll('.v815act')];
      if(!buttons.length)return;
      if(keep?.length){
        buttons.forEach(button=>{
          if(!keep.includes(button.textContent.trim()))button.remove();
        });
      }
      [...group.querySelectorAll('.v815act')].slice(2).forEach(button=>button.remove());
    });
  }

  let scheduled=false;
  function apply(){
    scheduled=false;
    installStyle();
    trimActions();
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(apply);
  }

  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('hashchange',schedule);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  schedule();
})();
