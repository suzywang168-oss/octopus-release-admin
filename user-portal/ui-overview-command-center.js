(()=>{
  'use strict';

  const ROOT='pageRoot';
  const STYLE_ID='octopus-overview-command-center';
  const MODAL_ID='octopusOverviewProjectModal';

  const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
  const go=value=>{
    const next='#/'+String(value).replaceAll('.','/');
    if(location.hash===next)window.dispatchEvent(new HashChangeEvent('hashchange'));
    else location.hash=next;
  };

  function installStyle(){
    let style=document.getElementById(STYLE_ID);
    if(!style){
      style=document.createElement('style');
      style.id=STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent=`
      #${ROOT} .occ-page{max-width:1540px;margin:0 auto;padding:2px 2px 28px;color:var(--text)}
      #${ROOT} .occ-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:18px}
      #${ROOT} .occ-eyebrow{display:inline-flex;align-items:center;gap:7px;margin-bottom:8px;color:#91a8ff;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
      #${ROOT} .occ-eyebrow:before{content:'';width:7px;height:7px;border-radius:50%;background:#6683df;box-shadow:0 0 0 4px color-mix(in srgb,#6683df 16%,transparent)}
      #${ROOT} .occ-head h1{margin:0;color:var(--text);font-size:27px;line-height:1.18;letter-spacing:-.02em}
      #${ROOT} .occ-head p{max-width:720px;margin:9px 0 0;color:var(--soft);font-size:12px;line-height:1.65}
      #${ROOT} .occ-head-actions{display:flex;align-items:center;gap:9px;flex:0 0 auto}
      #${ROOT} .occ-btn{height:38px;padding:0 15px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--text);font-size:11px;font-weight:750;cursor:pointer;white-space:nowrap}
      #${ROOT} .occ-btn:hover{background:var(--panel2)}
      #${ROOT} .occ-btn.primary{border-color:#6683df;background:#6683df;color:#fff}

      #${ROOT} .occ-top-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(330px,.75fr);gap:14px;margin-bottom:14px}
      #${ROOT} .occ-card{border:1px solid var(--line);border-radius:15px;background:var(--panel);overflow:hidden}
      #${ROOT} .occ-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:17px 18px 13px;border-bottom:1px solid var(--line)}
      #${ROOT} .occ-card-head h2{margin:0;color:var(--text);font-size:14px;line-height:1.35}
      #${ROOT} .occ-card-head p{margin:5px 0 0;color:var(--soft);font-size:9px;line-height:1.55}
      #${ROOT} .occ-card-head a,#${ROOT} .occ-link{border:0;background:transparent;color:#91a8ff;font-size:9px;font-weight:750;cursor:pointer;white-space:nowrap}

      #${ROOT} .occ-priorities{display:grid;gap:8px;padding:12px}
      #${ROOT} .occ-priority{display:grid;grid-template-columns:38px minmax(0,1fr) auto;align-items:center;gap:12px;width:100%;padding:12px;border:1px solid transparent;border-radius:11px;background:var(--panel2);color:var(--text);text-align:left;cursor:pointer}
      #${ROOT} .occ-priority:hover{border-color:color-mix(in srgb,#6683df 36%,var(--line));transform:translateY(-1px)}
      #${ROOT} .occ-priority-no{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:color-mix(in srgb,#6683df 15%,var(--panel));color:#91a8ff;font-size:9px;font-weight:850}
      #${ROOT} .occ-priority b{display:block;font-size:11px;line-height:1.4}
      #${ROOT} .occ-priority small{display:block;margin-top:4px;color:var(--soft);font-size:9px;line-height:1.45}
      #${ROOT} .occ-priority-tag{padding:5px 8px;border-radius:99px;background:var(--panel);color:var(--soft);font-size:8px;font-weight:700;white-space:nowrap}
      #${ROOT} .occ-priority-tag.urgent{background:rgba(255,111,132,.10);color:#ff8da2}

      #${ROOT} .occ-risk-list{display:grid;gap:0;padding:4px 16px 10px}
      #${ROOT} .occ-risk-item{display:grid;grid-template-columns:9px minmax(0,1fr) auto;align-items:start;gap:10px;padding:13px 0;border-bottom:1px solid var(--line);cursor:pointer}
      #${ROOT} .occ-risk-item:last-child{border-bottom:0}
      #${ROOT} .occ-risk-dot{width:8px;height:8px;margin-top:4px;border-radius:50%;background:#ffbe69;box-shadow:0 0 0 4px rgba(255,190,105,.09)}
      #${ROOT} .occ-risk-dot.red{background:#ff6f84;box-shadow:0 0 0 4px rgba(255,111,132,.09)}
      #${ROOT} .occ-risk-item b{display:block;font-size:10px;line-height:1.4}
      #${ROOT} .occ-risk-item small{display:block;margin-top:4px;color:var(--soft);font-size:8px;line-height:1.45}
      #${ROOT} .occ-risk-value{color:var(--text);font-size:12px;font-weight:850}

      #${ROOT} .occ-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px;margin-bottom:14px}
      #${ROOT} .occ-kpi{position:relative;padding:15px 16px;border:1px solid var(--line);border-radius:13px;background:var(--panel);overflow:hidden}
      #${ROOT} .occ-kpi:after{content:'';position:absolute;right:-18px;bottom:-32px;width:84px;height:84px;border-radius:50%;background:color-mix(in srgb,#6683df 7%,transparent)}
      #${ROOT} .occ-kpi-label{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--soft);font-size:9px;font-weight:650}
      #${ROOT} .occ-kpi strong{display:block;margin-top:9px;color:var(--text);font-size:24px;line-height:1}
      #${ROOT} .occ-kpi-foot{display:flex;align-items:center;gap:7px;margin-top:9px;color:var(--soft);font-size:8px}
      #${ROOT} .occ-trend{padding:3px 6px;border-radius:99px;background:rgba(73,210,167,.10);color:#65d6b2;font-weight:800}
      #${ROOT} .occ-trend.warn{background:rgba(255,190,105,.10);color:#ffbe69}

      #${ROOT} .occ-bottom-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(330px,.75fr);gap:14px}
      #${ROOT} .occ-pipeline{padding:17px 18px 18px}
      #${ROOT} .occ-section-title{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:16px}
      #${ROOT} .occ-section-title h2{margin:0;color:var(--text);font-size:14px}
      #${ROOT} .occ-section-title p{margin:5px 0 0;color:var(--soft);font-size:9px}
      #${ROOT} .occ-flow{display:grid;grid-template-columns:repeat(5,minmax(120px,1fr));gap:8px;overflow:auto;padding-bottom:2px}
      #${ROOT} .occ-stage{position:relative;min-width:120px;padding:13px;border:1px solid var(--line);border-radius:11px;background:var(--panel2);color:var(--text);text-align:left;cursor:pointer}
      #${ROOT} .occ-stage:hover{border-color:color-mix(in srgb,#6683df 42%,var(--line))}
      #${ROOT} .occ-stage-top{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--soft);font-size:8px;font-weight:750}
      #${ROOT} .occ-stage strong{display:block;margin-top:11px;font-size:19px;line-height:1}
      #${ROOT} .occ-stage b{display:block;margin-top:7px;font-size:9px;line-height:1.4}
      #${ROOT} .occ-stage small{display:block;margin-top:4px;color:var(--soft);font-size:8px;line-height:1.4}
      #${ROOT} .occ-progress{height:4px;margin-top:11px;border-radius:99px;background:var(--line);overflow:hidden}
      #${ROOT} .occ-progress i{display:block;height:100%;border-radius:inherit;background:#6683df}
      #${ROOT} .occ-stage.attention .occ-progress i{background:#ffbe69}

      #${ROOT} .occ-health{padding:3px 16px 12px}
      #${ROOT} .occ-health-row{padding:13px 0;border-bottom:1px solid var(--line)}
      #${ROOT} .occ-health-row:last-child{border-bottom:0}
      #${ROOT} .occ-health-line{display:flex;align-items:center;justify-content:space-between;gap:12px}
      #${ROOT} .occ-health-line b{font-size:9px}
      #${ROOT} .occ-health-line span{color:var(--text);font-size:10px;font-weight:850}
      #${ROOT} .occ-health-track{height:5px;margin-top:9px;border-radius:99px;background:var(--panel2);overflow:hidden}
      #${ROOT} .occ-health-track i{display:block;height:100%;border-radius:inherit;background:#6683df}
      #${ROOT} .occ-health-row small{display:block;margin-top:7px;color:var(--soft);font-size:8px;line-height:1.45}

      #${ROOT} .occ-projects{margin-top:14px}
      #${ROOT} .occ-project-table{width:100%;border-collapse:collapse;table-layout:fixed}
      #${ROOT} .occ-project-table th{padding:11px 16px;border-bottom:1px solid var(--line);color:var(--soft);font-size:8px;font-weight:750;text-align:left}
      #${ROOT} .occ-project-table td{padding:13px 16px;border-bottom:1px solid var(--line);color:var(--text);font-size:9px;vertical-align:middle}
      #${ROOT} .occ-project-table tbody tr:last-child td{border-bottom:0}
      #${ROOT} .occ-project-table tbody tr:hover{background:color-mix(in srgb,#6683df 4%,transparent)}
      #${ROOT} .occ-project-name b{display:block;font-size:10px}
      #${ROOT} .occ-project-name small{display:block;margin-top:4px;color:var(--soft);font-size:8px}
      #${ROOT} .occ-status{display:inline-flex;align-items:center;min-height:24px;padding:0 8px;border-radius:99px;background:rgba(73,210,167,.10);color:#65d6b2;font-size:8px;font-weight:750}
      #${ROOT} .occ-status.warn{background:rgba(255,190,105,.10);color:#ffbe69}
      #${ROOT} .occ-status.bad{background:rgba(255,111,132,.10);color:#ff8da2}
      #${ROOT} .occ-row-action{height:30px;padding:0 10px;border:1px solid var(--line);border-radius:8px;background:var(--panel2);color:var(--text);font-size:8px;font-weight:750;cursor:pointer}

      #${MODAL_ID}{position:fixed;inset:0;z-index:22000;display:none;place-items:center;padding:20px;background:rgba(2,8,18,.68);backdrop-filter:blur(4px)}
      #${MODAL_ID}.open{display:grid}
      #${MODAL_ID} .ocm-dialog{width:min(620px,94vw);border:1px solid var(--line);border-radius:16px;background:var(--panel);box-shadow:0 28px 90px rgba(0,0,0,.45)}
      #${MODAL_ID} .ocm-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--line)}
      #${MODAL_ID} h2{margin:0;color:var(--text);font-size:16px}
      #${MODAL_ID} p{margin:6px 0 0;color:var(--soft);font-size:9px}
      #${MODAL_ID} .ocm-close{width:32px;height:32px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);cursor:pointer}
      #${MODAL_ID} .ocm-body{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:18px 20px}
      #${MODAL_ID} label{display:grid;gap:7px;color:var(--soft);font-size:8px;font-weight:700}
      #${MODAL_ID} label.full{grid-column:1/-1}
      #${MODAL_ID} input,#${MODAL_ID} select{width:100%;height:39px;box-sizing:border-box;padding:0 11px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);outline:0}
      #${MODAL_ID} .ocm-foot{display:flex;justify-content:flex-end;gap:9px;padding:14px 20px;border-top:1px solid var(--line)}

      @media(max-width:1120px){
        #${ROOT} .occ-top-grid,#${ROOT} .occ-bottom-grid{grid-template-columns:1fr}
        #${ROOT} .occ-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
      }
      @media(max-width:720px){
        #${ROOT} .occ-head{flex-direction:column}
        #${ROOT} .occ-head-actions{width:100%}
        #${ROOT} .occ-btn{flex:1}
        #${ROOT} .occ-kpis{grid-template-columns:1fr}
        #${ROOT} .occ-priority{grid-template-columns:34px minmax(0,1fr)}
        #${ROOT} .occ-priority-tag{display:none}
        #${MODAL_ID} .ocm-body{grid-template-columns:1fr}
        #${MODAL_ID} label.full{grid-column:auto}
      }
    `;
  }

  function markup(){
    return `<div class="v815page occ-page">
      <header class="occ-head">
        <div>
          <span class="occ-eyebrow">Release Operations Command Center</span>
          <h1>业务总览</h1>
          <p>这里不是模块目录，而是今天的发行决策入口。先处理会影响上线、收入和渠道安全的事项，再查看流程与结果。</p>
        </div>
        <div class="occ-head-actions">
          <button class="occ-btn" type="button" data-occ-route="system.tasks">查看任务中心</button>
          <button class="occ-btn primary" type="button" data-occ-new>新建发行项目</button>
        </div>
      </header>

      <section class="occ-top-grid">
        <article class="occ-card">
          <div class="occ-card-head">
            <div><h2>今日优先事项</h2><p>按照对上线结果的影响排序，处理完即可推进本周发行目标。</p></div>
            <button class="occ-link" type="button" data-occ-route="operations.channel-analysis">进入选品分析</button>
          </div>
          <div class="occ-priorities">
            <button class="occ-priority" type="button" data-occ-route="operations.channel-analysis">
              <span class="occ-priority-no">P1</span><span><b>确认 3 部高潜剧集的上线顺序</b><small>选品分均超过 88，需确认英语版首发频道与测试预算。</small></span><span class="occ-priority-tag urgent">今天截止</span>
            </button>
            <button class="occ-priority" type="button" data-occ-route="release.review">
              <span class="occ-priority-no">P2</span><span><b>完成 6 组标题与封面审核</b><small>其中 2 组存在语义不一致，可能影响点击率预测。</small></span><span class="occ-priority-tag">待审核</span>
            </button>
            <button class="occ-priority" type="button" data-occ-route="operations.unblock">
              <span class="occ-priority-no">P3</span><span><b>补齐 4 条禁播链接的申诉材料</b><small>预计影响收入 $18.4K，优先处理版权授权链路。</small></span><span class="occ-priority-tag">18h SLA</span>
            </button>
          </div>
        </article>

        <article class="occ-card">
          <div class="occ-card-head"><div><h2>风险与阻塞</h2><p>仅展示会阻断生产或发行的异常。</p></div><button class="occ-link" type="button" data-occ-route="dashboard.risk">查看风险看板</button></div>
          <div class="occ-risk-list">
            <div class="occ-risk-item" data-occ-route="operations.unblock"><span class="occ-risk-dot red"></span><span><b>禁播链接待处理</b><small>版权重复与音乐版权命中最集中</small></span><strong class="occ-risk-value">4</strong></div>
            <div class="occ-risk-item" data-occ-route="system.channels"><span class="occ-risk-dot"></span><span><b>API 密钥即将到期</b><small>涉及 TikTok 与 Facebook 频道</small></span><strong class="occ-risk-value">2</strong></div>
            <div class="occ-risk-item" data-occ-route="production.localization"><span class="occ-risk-dot"></span><span><b>俄语译配节点高负载</b><small>当前负载 86%，预计延迟 22 分钟</small></span><strong class="occ-risk-value">86%</strong></div>
          </div>
        </article>
      </section>

      <section class="occ-kpis">
        <article class="occ-kpi"><div class="occ-kpi-label"><span>本月上线剧集</span><span>目标 50</span></div><strong>42</strong><div class="occ-kpi-foot"><span class="occ-trend">+18%</span><span>较上月同期</span></div></article>
        <article class="occ-kpi"><div class="occ-kpi-label"><span>平均点击率</span><span>目标 7.0%</span></div><strong>6.82%</strong><div class="occ-kpi-foot"><span class="occ-trend">+0.6pp</span><span>标题封面优化后</span></div></article>
        <article class="occ-kpi"><div class="occ-kpi-label"><span>本月发行收入</span><span>目标 $1.6M</span></div><strong>$1.42M</strong><div class="occ-kpi-foot"><span class="occ-trend">+24%</span><span>完成目标 88.8%</span></div></article>
        <article class="occ-kpi"><div class="occ-kpi-label"><span>风险工单</span><span>本周新增 8</span></div><strong>21</strong><div class="occ-kpi-foot"><span class="occ-trend warn">-3</span><span>较昨日净减少</span></div></article>
      </section>

      <section class="occ-bottom-grid">
        <article class="occ-card occ-pipeline">
          <div class="occ-section-title"><div><h2>发行流程进度</h2><p>点击阶段直接进入对应工作台，重点关注黄色阶段。</p></div><button class="occ-link" type="button" data-occ-route="system.tasks">查看全部任务</button></div>
          <div class="occ-flow">
            <button class="occ-stage" type="button" data-occ-route="operations.channel-analysis"><span class="occ-stage-top"><span>选品阶段</span><span>完成 78%</span></span><strong>18</strong><b>候选发行项目</b><small>3 部待决策</small><span class="occ-progress"><i style="width:78%"></i></span></button>
            <button class="occ-stage attention" type="button" data-occ-route="production.content"><span class="occ-stage-top"><span>内容加工</span><span>完成 64%</span></span><strong>12</strong><b>生产处理中</b><small>5 个任务有阻塞</small><span class="occ-progress"><i style="width:64%"></i></span></button>
            <button class="occ-stage" type="button" data-occ-route="release.titles"><span class="occ-stage-top"><span>物料制作</span><span>完成 72%</span></span><strong>24</strong><b>待生成或审核</b><small>6 组等待审核</small><span class="occ-progress"><i style="width:72%"></i></span></button>
            <button class="occ-stage" type="button" data-occ-route="release.distribution"><span class="occ-stage-top"><span>渠道分发</span><span>完成 84%</span></span><strong>19</strong><b>待分发任务</b><small>2 个频道限流</small><span class="occ-progress"><i style="width:84%"></i></span></button>
            <button class="occ-stage" type="button" data-occ-route="dashboard.series"><span class="occ-stage-top"><span>监控迭代</span><span>健康 91%</span></span><strong>42</strong><b>上线剧集</b><small>4 部需要优化</small><span class="occ-progress"><i style="width:91%"></i></span></button>
          </div>
        </article>

        <article class="occ-card">
          <div class="occ-card-head"><div><h2>本周业务健康度</h2><p>结果指标与流程质量的组合判断。</p></div><button class="occ-link" type="button" data-occ-route="dashboard.series">查看数据看板</button></div>
          <div class="occ-health">
            <div class="occ-health-row"><div class="occ-health-line"><b>发行目标完成度</b><span>88%</span></div><div class="occ-health-track"><i style="width:88%"></i></div><small>本月已上线 42 / 50 部剧集</small></div>
            <div class="occ-health-row"><div class="occ-health-line"><b>物料审核通过率</b><span>86%</span></div><div class="occ-health-track"><i style="width:86%"></i></div><small>主要问题为标题封面语义不一致</small></div>
            <div class="occ-health-row"><div class="occ-health-line"><b>渠道上传成功率</b><span>97.2%</span></div><div class="occ-health-track"><i style="width:97.2%"></i></div><small>Facebook 限流任务已进入分批上传</small></div>
          </div>
        </article>
      </section>

      <section class="occ-card occ-projects">
        <div class="occ-card-head"><div><h2>重点发行项目</h2><p>按上线时间与风险优先级排序，集中查看当前阶段、负责人和下一步动作。</p></div><button class="occ-link" type="button" data-occ-route="dashboard.series">查看全部剧集</button></div>
        <div style="overflow:auto">
          <table class="occ-project-table">
            <thead><tr><th style="width:25%">项目 / 版本</th><th>当前阶段</th><th>目标频道</th><th>上线时间</th><th>负责人</th><th>状态</th><th style="width:90px">操作</th></tr></thead>
            <tbody>
              <tr><td class="occ-project-name"><b>逆光心动</b><small>英语版 · 30 集</small></td><td>物料审核</td><td>TikTok US</td><td>08-15 18:00</td><td>Mia Chen</td><td><span class="occ-status warn">待处理 2 项</span></td><td><button class="occ-row-action" data-occ-route="release.review">去处理</button></td></tr>
              <tr><td class="occ-project-name"><b>契约婚姻</b><small>西语版 · 42 集</small></td><td>频道分发</td><td>Facebook LATAM</td><td>08-16 12:00</td><td>Leo Meyer</td><td><span class="occ-status">上传中 76%</span></td><td><button class="occ-row-action" data-occ-route="release.distribution">查看进度</button></td></tr>
              <tr><td class="occ-project-name"><b>王妃归来</b><small>英语版 · 36 集</small></td><td>监控迭代</td><td>YouTube US</td><td>已上线</td><td>Suzy Wang</td><td><span class="occ-status bad">CTR 低于目标</span></td><td><button class="occ-row-action" data-occ-route="dashboard.series">看数据</button></td></tr>
              <tr><td class="occ-project-name"><b>风暴之后</b><small>德语版 · 28 集</small></td><td>内容加工</td><td>TikTok DE</td><td>08-18 20:00</td><td>Nora Li</td><td><span class="occ-status">正常推进</span></td><td><button class="occ-row-action" data-occ-route="production.localization">查看任务</button></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>`;
  }

  function ensureModal(){
    let modal=document.getElementById(MODAL_ID);
    if(modal)return modal;
    modal=document.createElement('div');
    modal.id=MODAL_ID;
    modal.innerHTML=`<section class="ocm-dialog" role="dialog" aria-modal="true" aria-labelledby="ocmTitle">
      <header class="ocm-head"><div><h2 id="ocmTitle">新建发行项目</h2><p>先创建基础项目，后续再进入选品、内容加工和渠道配置。</p></div><button class="ocm-close" type="button" data-ocm-close>×</button></header>
      <div class="ocm-body">
        <label class="full">项目名称<input id="ocmName" placeholder="例如：逆光心动海外发行"></label>
        <label>负责人<select><option>Suzy Wang</option><option>Mia</option><option>Leo</option></select></label>
        <label>首发区域<select><option>北美 / 英语</option><option>拉美 / 西语</option><option>全球 / 英语</option></select></label>
        <label>目标平台<select><option>TikTok</option><option>Facebook</option><option>YouTube</option><option>Instagram</option></select></label>
        <label>优先级<select><option>普通</option><option>高</option><option>紧急</option></select></label>
      </div>
      <footer class="ocm-foot"><button class="occ-btn" type="button" data-ocm-close>取消</button><button class="occ-btn primary" type="button" data-ocm-create>创建并进入选品</button></footer>
    </section>`;
    document.body.appendChild(modal);
    return modal;
  }

  function renderOverview(force=false){
    if(route()!=='overview')return;
    const root=document.getElementById(ROOT);
    if(!root)return;
    installStyle();
    ensureModal();
    if(!force&&root.dataset.occOverview==='1'&&root.querySelector('.occ-page'))return;
    root.innerHTML=markup();
    root.dataset.route='overview';
    root.dataset.occOverview='1';
    document.title='Octopus · 业务总览';
  }

  window.OctopusOverviewCommandCenter={
    ensure(){renderOverview(false)},
    render(){renderOverview(true)},
    version:'2.0'
  };

  function handleClick(event){
    const target=event.target instanceof Element?event.target:null;
    if(!target)return;
    const routeTarget=target.closest('[data-occ-route]');
    if(routeTarget){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      go(routeTarget.dataset.occRoute);
      return;
    }
    if(target.closest('[data-occ-new]')){
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      ensureModal().classList.add('open');
      setTimeout(()=>document.getElementById('ocmName')?.focus(),30);
      return;
    }
    if(target.closest('[data-ocm-close]')){
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      ensureModal().classList.remove('open');
      return;
    }
    if(target.closest('[data-ocm-create]')){
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      const name=document.getElementById('ocmName')?.value.trim();
      if(!name){document.getElementById('ocmName')?.focus();return}
      ensureModal().classList.remove('open');
      try{if(typeof window.toast==='function')window.toast('发行项目已创建')}catch{}
      go('operations.channel-analysis');
    }
  }

  let scheduled=false;
  function schedule(force=false){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;renderOverview(force)});
  }

  document.addEventListener('click',handleClick,true);
  window.addEventListener('hashchange',()=>schedule(true));
  window.addEventListener('keydown',event=>{if(event.key==='Escape')ensureModal().classList.remove('open')});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(true),{once:true});else schedule(true);
  setTimeout(()=>schedule(false),500);
})();
