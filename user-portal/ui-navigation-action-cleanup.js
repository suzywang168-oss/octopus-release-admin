(()=>{
  'use strict';

  const STYLE_ID='octopus-clean-navigation-actions';
  const ACTIONS={
    'operations.channel-analysis':['对标对比','加入选剧报告','加入候选片单','已加入片单'],
    'operations.ad-intelligence':['查看素材','生成上线建议'],
    'operations.unblock':['查看链接','更新工单'],
    'production.content':['查看解析','编辑AI标签','配置入库','移出片单'],
    'production.localization':['查看任务','配置译配'],
    'release.titles':['开始生成','编辑参数','查看标题','重新生成','查看3个标题','采用标题'],
    'release.covers':['开始生成','编辑参数','查看封面','重新生成','预览3张封面','采用封面'],
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
    let style=document.getElementById(STYLE_ID);
    if(!style){
      style=document.createElement('style');
      style.id=STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent=`
      #v80nav{padding:10px 10px 28px!important}
      #v80nav .v815no,
      #v80nav .v815item>span,
      .v815flow .v815no,
      .v815mods .v815mod>span{display:none!important}

      #v80nav>button[data-r="overview"]{
        min-height:38px!important;
        margin-bottom:8px!important;
        padding:0 12px!important;
        border:1px solid var(--line)!important;
        border-radius:10px!important;
        background:var(--panel2)!important;
        font-size:9px!important;
        font-weight:750!important
      }
      #v80nav>button[data-r="overview"].active{
        border-color:color-mix(in srgb,#6683df 58%,var(--line))!important;
        background:color-mix(in srgb,#6683df 15%,var(--panel))!important
      }

      #v80nav .v815g{
        position:relative!important;
        margin:12px 0 0!important;
        padding:10px 7px 8px!important;
        border:1px solid transparent!important;
        border-radius:12px!important;
        transition:background .16s ease,border-color .16s ease!important
      }
      #v80nav .v815g+.v815g{margin-top:7px!important}
      #v80nav .v815g.is-active-group{
        border-color:color-mix(in srgb,#6683df 28%,var(--line))!important;
        background:color-mix(in srgb,#6683df 7%,var(--panel))!important
      }
      #v80nav .v815gh{
        position:relative!important;
        display:flex!important;
        align-items:flex-start!important;
        gap:8px!important;
        padding:1px 6px 9px 10px!important
      }
      #v80nav .v815gh:before{
        content:''!important;
        position:absolute!important;
        left:0!important;
        top:5px!important;
        width:4px!important;
        height:18px!important;
        border-radius:99px!important;
        background:var(--line)!important
      }
      #v80nav .v815g.is-active-group .v815gh:before{background:#6683df!important}
      #v80nav .v815gh b{
        display:block!important;
        color:var(--text)!important;
        font-size:9px!important;
        font-weight:800!important;
        line-height:1.35!important;
        letter-spacing:.01em!important
      }
      #v80nav .v815gh small{
        display:block!important;
        margin-top:3px!important;
        color:var(--soft)!important;
        font-size:7px!important;
        line-height:1.35!important
      }
      #v80nav .v815item{
        position:relative!important;
        width:calc(100% - 13px)!important;
        min-height:32px!important;
        margin:2px 0 0 13px!important;
        padding:7px 10px 7px 17px!important;
        border:0!important;
        border-left:1px solid var(--line)!important;
        border-radius:0 8px 8px 0!important;
        background:transparent!important;
        color:var(--soft)!important;
        font-size:8px!important;
        font-weight:600!important
      }
      #v80nav .v815item:before{
        content:''!important;
        position:absolute!important;
        left:-3px!important;
        top:50%!important;
        width:5px!important;
        height:5px!important;
        transform:translateY(-50%)!important;
        border-radius:50%!important;
        background:var(--line)!important
      }
      #v80nav .v815item:hover{
        background:var(--panel2)!important;
        color:var(--text)!important
      }
      #v80nav .v815item.active{
        border-left-color:#6683df!important;
        background:color-mix(in srgb,#6683df 15%,var(--panel))!important;
        color:var(--text)!important;
        box-shadow:none!important
      }
      #v80nav .v815item.active:before{
        left:-4px!important;
        width:7px!important;
        height:7px!important;
        background:#6683df!important;
        box-shadow:0 0 0 3px color-mix(in srgb,#6683df 18%,transparent)!important
      }

      .v815flowgrid{grid-template-columns:repeat(5,minmax(132px,1fr))!important;min-width:700px!important}
      .v815step{align-items:center!important;justify-content:flex-start!important}
      .v815mods .v815mod{padding-top:13px!important}
      .v815acts{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;gap:5px!important;min-width:max-content!important;white-space:nowrap!important}
      .v815act{flex:0 0 auto!important;white-space:nowrap!important;padding:0 8px!important}
      .v815table th:last-child,.v815table td:last-child{width:1%!important;min-width:150px!important}
    `;
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

  function markActiveGroups(){
    document.querySelectorAll('#v80nav .v815g').forEach(group=>{
      group.classList.toggle('is-active-group',!!group.querySelector('.v815item.active'));
    });
  }

  let scheduled=false;
  function apply(){
    scheduled=false;
    installStyle();
    trimActions();
    markActiveGroups();
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(apply);
  }

  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('hashchange',schedule);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  schedule();
})();
