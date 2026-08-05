(()=>{
  'use strict';

  const VERSION = 'v814';
  const STYLE_ID = `octopus-release-flow-${VERSION}`;
  const ROOT = '#pageRoot';

  const FLOW = [
    ['ops.analytics', '数据回流与选题', 'Performance & Planning', '01'],
    ['ops.crawl', '素材趋势抓取', 'Trend Intelligence', '02'],
    ['production.upload', '内容入库提炼', 'Content Intake', '03'],
    ['production.languages', '多语言译配', 'Localization', '04'],
    ['release.titles', '标题生成', 'Title Generation', '05'],
    ['release.covers', '封面生成', 'Cover Generation', '06'],
    ['release.publish', '发布配置与上传', 'Publishing', '07'],
    ['ops.unblock', '上线监控与申诉', 'Monitoring & Appeals', '08']
  ];

  const PAGES = {
    overview: {
      zh: ['项目总览', '按发行链路查看每个项目的当前节点、阻塞与下一动作。', '新建发行项目'],
      en: ['Project Overview', 'Track each project by release stage, blocker, and next action.', 'Create release project']
    },
    todo: {
      zh: ['待办任务', '集中处理发行流程中的人工确认、异常、依赖与截止任务。', '新建待办'],
      en: ['To-dos', 'Handle approvals, exceptions, dependencies, and deadlines across the release flow.', 'Create to-do']
    },
    'ops.analytics': {
      zh: ['数据回流与选题', '汇总频道表现、收入与留存，形成下一轮选题和频道策略。', '生成选题方案'],
      en: ['Performance & Planning', 'Turn channel performance, revenue, and retention into the next content plan.', 'Generate content plan']
    },
    'ops.crawl': {
      zh: ['素材趋势抓取', '抓取并去重外部投流素材，将高潜内容沉淀为候选选题。', '新建抓取任务'],
      en: ['Trend Intelligence', 'Collect and deduplicate paid-media trends, then save high-potential ideas.', 'Create crawl task']
    },
    'production.upload': {
      zh: ['内容入库与提炼', '完成全剧上传、去重、故事总结、爆点提炼与标签确认。', '上传内容'],
      en: ['Content Intake', 'Upload, deduplicate, summarize, extract hooks, and confirm metadata.', 'Upload content']
    },
    'production.languages': {
      zh: ['多语言译配', '完成翻译、配音、字幕对齐、去重与人工质检。', '创建译配任务'],
      en: ['Localization', 'Complete translation, dubbing, subtitle alignment, deduplication, and QA.', 'Create localization task']
    },
    'release.titles': {
      zh: ['标题生成', '基于内容爆点和频道历史表现生成、编辑并采用标题。', '批量生成标题'],
      en: ['Title Generation', 'Generate, edit, and approve titles using story hooks and channel history.', 'Generate titles']
    },
    'release.covers': {
      zh: ['封面生成', '基于视觉爆点和频道风格生成、编辑并采用封面。', '批量生成封面'],
      en: ['Cover Generation', 'Generate, edit, and approve covers using visual hooks and channel style.', 'Generate covers']
    },
    'release.publish': {
      zh: ['发布配置与上传', '完成频道匹配、水印、标题封面锁定、排期和平台上传。', '新建发布任务'],
      en: ['Publishing', 'Configure channel, watermark, packaging, schedule, and platform upload.', 'Create publish task']
    },
    'ops.unblock': {
      zh: ['上线监控与申诉', '跟踪平台审核、禁播原因、申诉材料、恢复结果与处理时效。', '新建申诉工单'],
      en: ['Monitoring & Appeals', 'Track review, takedowns, evidence, appeals, restoration, and SLA.', 'Create appeal case']
    }
  };

  const zh = () => !String(document.documentElement.lang || '').toLowerCase().startsWith('en');

  function route() {
    return location.hash.replace(/^#\/?/, '').replaceAll('/', '.') || 'overview';
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      ${ROOT} .v814-flow-card {
        margin: 0 0 12px;
        padding: 10px;
        border: 1px solid var(--line);
        border-radius: 12px;
        background: var(--panel);
        overflow-x: auto;
      }
      ${ROOT} .v814-flow-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin: 0 2px 9px;
      }
      ${ROOT} .v814-flow-head strong { font-size: 10px; color: var(--text); }
      ${ROOT} .v814-flow-head span { font-size: 8px; color: var(--muted); }
      ${ROOT} .v814-flow-steps {
        display: grid;
        grid-template-columns: repeat(8, minmax(116px, 1fr));
        gap: 6px;
        min-width: 980px;
      }
      ${ROOT} .v814-flow-step {
        display: grid;
        grid-template-columns: 25px 1fr;
        align-items: center;
        gap: 7px;
        min-height: 42px;
        padding: 6px 8px;
        border: 1px solid var(--line);
        border-radius: 9px;
        background: var(--panel2);
        color: var(--soft);
        text-align: left;
        cursor: pointer;
      }
      ${ROOT} .v814-flow-step:hover { border-color: #7189d9; color: var(--text); }
      ${ROOT} .v814-flow-step.active {
        border-color: #6683df;
        background: color-mix(in srgb, #6683df 16%, var(--panel2));
        color: var(--text);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, #6683df 35%, transparent);
      }
      ${ROOT} .v814-step-no {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        border-radius: 7px;
        background: var(--panel);
        font-size: 8px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }
      ${ROOT} .v814-flow-step b { font-size: 8px; line-height: 1.25; }
      ${ROOT} .table-card th:last-child,
      ${ROOT} .table-card td:last-child { min-width: 218px; width: 218px; }
      ${ROOT} .v814-action-cell { white-space: nowrap; }
      ${ROOT} .v814-action-cell .text-btn {
        min-height: 27px !important;
        margin: 0 4px 0 0 !important;
        padding: 4px 8px !important;
        border: 1px solid transparent !important;
        border-radius: 7px !important;
        background: transparent !important;
        color: var(--soft) !important;
        font-size: 8px !important;
        font-weight: 650 !important;
        cursor: pointer !important;
      }
      ${ROOT} .v814-action-cell .text-btn:hover {
        border-color: var(--line) !important;
        background: var(--panel2) !important;
        color: var(--text) !important;
      }
      ${ROOT} .v814-action-cell .v814-main-action {
        border-color: color-mix(in srgb, #6683df 44%, var(--line)) !important;
        background: color-mix(in srgb, #6683df 12%, var(--panel)) !important;
        color: #86a0ff !important;
      }
      #v80nav .nav-label.v814-flow-label { margin-top: 12px; }
      #v80nav .nav-item .v814-nav-no {
        display: inline-grid;
        place-items: center;
        min-width: 21px;
        height: 21px;
        border-radius: 6px;
        background: var(--panel2);
        font-size: 7px;
        font-weight: 800;
      }
      @media (max-width: 760px) {
        ${ROOT} .v814-flow-head { align-items: flex-start; flex-direction: column; gap: 4px; }
        ${ROOT} .table-card th:last-child,
        ${ROOT} .table-card td:last-child { min-width: 190px; width: 190px; }
      }
    `;
    document.head.appendChild(style);
  }

  function rebuildNav() {
    const nav = document.getElementById('v80nav');
    if (!nav) return;
    const r = route();
    const langZh = zh();
    const work = [
      ['overview', '◈', langZh ? '项目总览' : 'Project Overview'],
      ['todo', '◉', langZh ? '待办任务' : 'To-dos']
    ];
    const after = [['ops.unblock', '08', langZh ? '上线监控与申诉' : 'Monitoring & Appeals']];
    const flow = FLOW.slice(0, 7).map(([id, cn, en, no]) => [id, no, langZh ? cn : en]);
    const group = (label, items, flowGroup = false) => `
      <div class="nav-group">
        <div class="nav-label ${flowGroup ? 'v814-flow-label' : ''}">${label}</div>
        ${items.map(([id, icon, labelText]) => `
          <button type="button" class="nav-item ${r === id ? 'active' : ''}" data-v80="${id}">
            <span class="${flowGroup || id === 'ops.unblock' ? 'v814-nav-no' : 'nav-icon'}">${icon}</span>
            <span>${labelText}</span>
          </button>`).join('')}
      </div>`;
    const html = group(langZh ? '工作台' : 'Workspace', work)
      + group(langZh ? '发行流程' : 'Release Flow', flow, true)
      + group(langZh ? '发行后运营' : 'Post-release', after, true);
    if (nav.dataset.v814Html !== html) {
      nav.innerHTML = html;
      nav.dataset.v814Html = html;
    }
  }

  function addFlowCard() {
    const r = route();
    if (!FLOW.some(([id]) => id === r)) {
      document.querySelector(`${ROOT} .v814-flow-card`)?.remove();
      return;
    }
    const root = document.querySelector(ROOT);
    if (!root) return;
    let card = root.querySelector('.v814-flow-card');
    const langZh = zh();
    const html = `
      <div class="v814-flow-head">
        <strong>${langZh ? '发行全流程' : 'End-to-end release flow'}</strong>
        <span>${langZh ? '上线结果回流到第 01 步，形成持续优化闭环' : 'Publishing results feed back into step 01 for continuous optimization'}</span>
      </div>
      <div class="v814-flow-steps">
        ${FLOW.map(([id, cn, en, no]) => `
          <button type="button" class="v814-flow-step ${r === id ? 'active' : ''}" data-v80="${id}">
            <span class="v814-step-no">${no}</span><b>${langZh ? cn : en}</b>
          </button>`).join('')}
      </div>`;
    if (!card) {
      card = document.createElement('section');
      card.className = 'v814-flow-card';
      const anchor = root.querySelector('.kpis, .v82-console, .v810-list-head, .toolbar, .table-card');
      if (anchor) anchor.insertAdjacentElement('beforebegin', card);
      else root.prepend(card);
    }
    if (card.dataset.v814Content !== html) {
      card.innerHTML = html;
      card.dataset.v814Content = html;
    }
  }

  function updatePageContext() {
    const r = route();
    const item = PAGES[r];
    if (!item) return;
    const data = zh() ? item.zh : item.en;
    const title = document.querySelector('.workspace b');
    const subtitle = document.querySelector('.workspace small');
    if (title && title.textContent !== data[0]) title.textContent = data[0];
    if (subtitle && subtitle.textContent !== data[1]) subtitle.textContent = data[1];
    const create = document.querySelector(`${ROOT} [data-v80-create]`);
    if (create && create.textContent !== data[2]) create.textContent = data[2];
    const nextTitle = `Octopus · ${data[0]}`;
    if (document.title !== nextTitle) document.title = nextTitle;
  }

  function stateText(row) {
    return (row?.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function listMode() {
    const activeTab = document.querySelector(`${ROOT} [data-v85-list].active`);
    const value = activeTab?.dataset.v85List || '';
    return value || ((activeTab?.textContent || '').includes('已生成') ? 'results' : 'pending');
  }

  function actionsFor(r, row) {
    const text = stateText(row);
    const en = !zh();
    const item = (code, cn, english) => [code, en ? english : cn];
    if (r === 'overview') return [item('enter', '查看项目', 'Open project'), item('progress', '推进下一节点', 'Advance stage')];
    if (r === 'todo') return [item('process', '立即处理', 'Start'), item('handoff', '转交任务', 'Reassign')];
    if (r === 'ops.analytics') return [item('analysis', '查看频道数据', 'View data'), item('compare', '生成选题方案', 'Create content plan')];
    if (r === 'ops.crawl') return [item('assets', '查看素材样本', 'View samples'), item('adopt', '加入候选池', 'Add to candidate pool')];
    if (r === 'ops.unblock') {
      if (/已恢复|restored/i.test(text)) return [item('materials', '查看恢复结果', 'View restoration'), item('link', '打开原链接', 'Open source link')];
      if (/已提交|材料已提交|确认中|submitted|in review/i.test(text)) return [item('materials', '查看申诉进度', 'View appeal'), item('link', '核对原链接', 'Check source link')];
      return [item('materials', '补充申诉材料', 'Add evidence'), item('link', '核对原链接', 'Check source link')];
    }
    if (r === 'production.upload') {
      if (/上传中|等待上传|uploading|waiting for upload/i.test(text)) return [item('asset', '继续上传', 'Continue upload'), item('extract', '查看上传任务', 'View upload task')];
      return [item('extract', '查看提炼结果', 'View extraction'), item('asset', '查看源内容', 'View source content')];
    }
    if (r === 'production.languages') {
      return listMode() === 'results'
        ? [item('edit', '编辑译配', 'Edit localization'), item('listen', '试听', 'Preview audio'), item('download', '下载版本', 'Download version')]
        : [item('config', '配置译配', 'Configure'), item('generate', '开始译配', 'Start localization')];
    }
    if (r === 'release.titles') {
      return listMode() === 'results'
        ? [item('edit', '编辑标题', 'Edit title'), item('copy', '复制采用标题', 'Copy approved title'), item('detail', '版本记录', 'Version history')]
        : [item('generate', '生成标题', 'Generate titles'), item('source', '查看内容爆点', 'View content hooks')];
    }
    if (r === 'release.covers') {
      return listMode() === 'results'
        ? [item('edit', '编辑封面', 'Edit cover'), item('preview', '预览封面', 'Preview cover'), item('download', '下载原图', 'Download original')]
        : [item('generate', '生成封面', 'Generate covers'), item('source', '查看视觉要点', 'View visual brief')];
    }
    if (r === 'release.publish') {
      if (/失败|异常|重试|failed|error|retry/i.test(text)) return [item('preview', '查看失败原因', 'View failure'), item('retry', '重新入队', 'Retry')];
      if (/上传\s*\d+%|进行中|uploading|in progress/i.test(text)) return [item('preview', '查看上传进度', 'View progress'), item('detail', '发布配置', 'Publish settings')];
      if (/等待审核|已排期|under review|scheduled/i.test(text)) return [item('preview', '查看平台状态', 'Platform status'), item('detail', '发布详情', 'Publish details')];
      return [item('preview', '发布前检查', 'Preflight check'), item('detail', '配置发布', 'Configure publishing')];
    }
    return [item('detail', '查看详情', 'View details')];
  }

  function replaceActions() {
    const r = route();
    const rows = document.querySelectorAll(`${ROOT} tbody tr`);
    rows.forEach((row, index) => {
      const cell = row.lastElementChild;
      if (!cell || cell.tagName !== 'TD') return;
      const rowIndex = row.dataset.v80Row ?? index;
      const actions = actionsFor(r, row);
      const html = actions.map(([code, label], i) => `
        <button type="button" class="text-btn ${i === 0 ? 'v814-main-action' : ''}" data-v88-action="${code}" data-v88-index="${rowIndex}" title="${label}">${label}</button>`).join('');
      if (cell.dataset.v814Actions !== html) {
        cell.classList.add('v814-action-cell');
        cell.innerHTML = html;
        cell.dataset.v814Actions = html;
      }
    });
  }

  let scheduled = false;
  function apply() {
    scheduled = false;
    ensureStyle();
    rebuildNav();
    updatePageContext();
    addFlowCard();
    replaceActions();
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(apply);
  }

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'lang'] });
  window.addEventListener('hashchange', schedule);
  window.addEventListener('resize', schedule);
  document.addEventListener('click', (event) => {
    if (event.target.closest?.('[data-v80], [data-v85-list], [data-v810-page], .lang-toggle')) setTimeout(schedule, 80);
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  setTimeout(schedule, 450);
  setTimeout(schedule, 1200);
})();
