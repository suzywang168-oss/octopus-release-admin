(()=>{
  'use strict';

  const STYLE_ID = 'octopus-languages-layout-v812';
  const TARGET_HASH = '/production/languages';

  const css = `
    .oct-lang-panel {
      display: flex !important;
      align-items: center !important;
      gap: 14px !important;
      min-height: 0 !important;
      height: auto !important;
      padding: 10px 12px !important;
      margin-bottom: 12px !important;
      border: 1px solid #d9e2ef !important;
      border-radius: 12px !important;
      background: #f8fafc !important;
      box-shadow: none !important;
      overflow: visible !important;
    }

    .oct-lang-tabs {
      display: inline-flex !important;
      align-items: center !important;
      flex: 0 0 auto !important;
      width: auto !important;
      min-height: 0 !important;
      height: auto !important;
      gap: 3px !important;
      padding: 3px !important;
      margin: 0 !important;
      border: 1px solid #d6deea !important;
      border-radius: 10px !important;
      background: #eef2f7 !important;
      overflow: visible !important;
    }

    .oct-lang-tabs > * {
      flex: 0 0 auto !important;
      width: auto !important;
      min-width: 0 !important;
      margin: 0 !important;
      border: 0 !important;
    }

    .oct-lang-tab {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-width: 118px !important;
      width: auto !important;
      height: 34px !important;
      padding: 0 16px !important;
      margin: 0 !important;
      border: 0 !important;
      border-radius: 8px !important;
      background: transparent !important;
      box-shadow: none !important;
      color: #53657d !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      line-height: 1 !important;
      white-space: nowrap !important;
      transition: background-color .16s ease, box-shadow .16s ease, color .16s ease !important;
    }

    .oct-lang-tab::before,
    .oct-lang-tab::after {
      display: none !important;
      content: none !important;
    }

    .oct-lang-tab:hover {
      color: #243b64 !important;
      background: rgba(255,255,255,.62) !important;
    }

    .oct-lang-tab.oct-lang-active {
      color: #183b78 !important;
      font-weight: 650 !important;
      background: #ffffff !important;
      box-shadow: 0 1px 3px rgba(32, 53, 84, .12) !important;
    }

    .oct-lang-status {
      display: flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      flex: 1 1 auto !important;
      width: auto !important;
      min-height: 0 !important;
      height: auto !important;
      gap: 8px !important;
      padding: 0 !important;
      margin: 0 0 0 auto !important;
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      overflow: visible !important;
    }

    .oct-lang-status > * {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }

    .oct-lang-filter {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: auto !important;
      min-width: 0 !important;
      height: 32px !important;
      padding: 0 12px !important;
      margin: 0 !important;
      border: 1px solid #d4deeb !important;
      border-radius: 999px !important;
      background: #ffffff !important;
      box-shadow: none !important;
      color: #40536d !important;
      font-size: 12px !important;
      font-weight: 550 !important;
      line-height: 1 !important;
      white-space: nowrap !important;
    }

    .oct-lang-filter.oct-lang-active {
      border-color: #264b91 !important;
      background: #203f7f !important;
      color: #ffffff !important;
      box-shadow: 0 2px 6px rgba(31, 63, 127, .16) !important;
    }

    .oct-lang-summary {
      display: inline-flex !important;
      align-items: center !important;
      width: auto !important;
      min-height: 32px !important;
      padding: 0 2px 0 6px !important;
      margin: 0 !important;
      border: 0 !important;
      background: transparent !important;
      color: #718198 !important;
      font-size: 12px !important;
      font-weight: 400 !important;
      line-height: 1.45 !important;
      white-space: nowrap !important;
    }

    .oct-lang-empty-summary-row {
      display: none !important;
      min-height: 0 !important;
      height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      overflow: hidden !important;
    }

    html[data-theme='dark'] .oct-lang-panel,
    body[data-theme='dark'] .oct-lang-panel,
    body.dark .oct-lang-panel,
    body.dark-mode .oct-lang-panel {
      border-color: #2b3a51 !important;
      background: #111b2b !important;
    }

    html[data-theme='dark'] .oct-lang-tabs,
    body[data-theme='dark'] .oct-lang-tabs,
    body.dark .oct-lang-tabs,
    body.dark-mode .oct-lang-tabs {
      border-color: #34445d !important;
      background: #0b1422 !important;
    }

    html[data-theme='dark'] .oct-lang-tab,
    body[data-theme='dark'] .oct-lang-tab,
    body.dark .oct-lang-tab,
    body.dark-mode .oct-lang-tab {
      color: #9aacbf !important;
    }

    html[data-theme='dark'] .oct-lang-tab.oct-lang-active,
    body[data-theme='dark'] .oct-lang-tab.oct-lang-active,
    body.dark .oct-lang-tab.oct-lang-active,
    body.dark-mode .oct-lang-tab.oct-lang-active {
      color: #e9f0ff !important;
      background: #223656 !important;
    }

    html[data-theme='dark'] .oct-lang-filter,
    body[data-theme='dark'] .oct-lang-filter,
    body.dark .oct-lang-filter,
    body.dark-mode .oct-lang-filter {
      border-color: #34445d !important;
      background: #152238 !important;
      color: #c6d1df !important;
    }

    html[data-theme='dark'] .oct-lang-filter.oct-lang-active,
    body[data-theme='dark'] .oct-lang-filter.oct-lang-active,
    body.dark .oct-lang-filter.oct-lang-active,
    body.dark-mode .oct-lang-filter.oct-lang-active {
      border-color: #6f8fe8 !important;
      background: #3858a4 !important;
      color: #ffffff !important;
    }

    @media (max-width: 980px) {
      .oct-lang-panel {
        align-items: stretch !important;
        flex-direction: column !important;
        gap: 9px !important;
      }

      .oct-lang-tabs {
        width: 100% !important;
      }

      .oct-lang-tabs > * {
        flex: 1 1 0 !important;
      }

      .oct-lang-tab {
        width: 100% !important;
        min-width: 0 !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
      }

      .oct-lang-status {
        justify-content: flex-start !important;
        width: 100% !important;
        margin-left: 0 !important;
        flex-wrap: wrap !important;
      }
    }
  `;

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function isVisible(element) {
    if (!(element instanceof Element)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }

  function findSmallestTextElement(text, contains = false) {
    const candidates = Array.from(document.querySelectorAll('button, [role="tab"], a, label, span, p, div'))
      .filter(isVisible)
      .filter((element) => {
        const value = cleanText(element.textContent);
        return contains ? value.includes(text) : value === text;
      })
      .sort((a, b) => cleanText(a.textContent).length - cleanText(b.textContent).length || a.children.length - b.children.length);
    return candidates[0] || null;
  }

  function controlFor(element) {
    if (!element) return null;
    return element.closest('button, [role="tab"], a, [data-tab], [data-view]') || element;
  }

  function commonAncestor(elements) {
    const valid = elements.filter(Boolean);
    if (!valid.length) return null;
    let node = valid[0];
    while (node && node !== document.body) {
      if (valid.every((element) => node.contains(element))) return node;
      node = node.parentElement;
    }
    return null;
  }

  function compactAncestor(groupA, groupB) {
    let node = groupA;
    while (node && node !== document.body) {
      if (node.contains(groupB)) {
        const rect = node.getBoundingClientRect();
        if (rect.height > 0 && rect.height < 220) return node;
      }
      node = node.parentElement;
    }
    return commonAncestor([groupA, groupB]);
  }

  function looksActive(element) {
    if (!element) return false;
    const aria = element.getAttribute('aria-selected') || element.getAttribute('aria-current') || element.getAttribute('data-active');
    if (aria === 'true' || aria === 'page' || aria === 'active') return true;
    if (/\b(active|selected|current|on)\b/i.test(element.className || '')) return true;
    const style = getComputedStyle(element);
    const borderWidth = parseFloat(style.borderBottomWidth || '0');
    const borderColor = style.borderBottomColor || '';
    return borderWidth >= 2 && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent';
  }

  function markActive(items) {
    items.forEach((item) => item.classList.toggle('oct-lang-active', looksActive(item)));
    if (!items.some((item) => item.classList.contains('oct-lang-active')) && items[0]) {
      items[0].classList.add('oct-lang-active');
    }
  }

  function applyLayout() {
    if (!location.hash.includes(TARGET_HASH)) return;
    ensureStyle();

    const tabLabels = ['语种 AI 译配', '标题生成', '封面生成'];
    const tabs = tabLabels.map((label) => controlFor(findSmallestTextElement(label))).filter(Boolean);
    if (tabs.length !== tabLabels.length) return;

    const pending = controlFor(findSmallestTextElement('未生成内容库', true));
    const generated = controlFor(findSmallestTextElement('已生成结果', true));
    if (!pending || !generated) return;

    const tabGroup = commonAncestor(tabs);
    const statusGroup = commonAncestor([pending, generated]);
    if (!tabGroup || !statusGroup) return;

    const panel = compactAncestor(tabGroup, statusGroup);
    if (!panel || panel === document.body) return;

    panel.classList.add('oct-lang-panel');
    tabGroup.classList.add('oct-lang-tabs');
    statusGroup.classList.add('oct-lang-status');

    tabs.forEach((tab) => tab.classList.add('oct-lang-tab'));
    [pending, generated].forEach((filter) => filter.classList.add('oct-lang-filter'));
    markActive(tabs);
    markActive([pending, generated]);

    const summary = Array.from(document.querySelectorAll('span, p, div'))
      .filter(isVisible)
      .filter((element) => {
        const value = cleanText(element.textContent);
        return value.includes('已生成结果') && value.includes('可重新编辑') && value.length < 90;
      })
      .sort((a, b) => cleanText(a.textContent).length - cleanText(b.textContent).length)[0];

    if (summary && !statusGroup.contains(summary)) {
      const oldParent = summary.parentElement;
      summary.classList.add('oct-lang-summary');
      statusGroup.appendChild(summary);
      if (oldParent && cleanText(oldParent.textContent) === '') oldParent.classList.add('oct-lang-empty-summary-row');
    } else if (summary) {
      summary.classList.add('oct-lang-summary');
    }

    if (!panel.dataset.octLangBound) {
      panel.dataset.octLangBound = '1';
      panel.addEventListener('click', () => setTimeout(applyLayout, 60), true);
    }
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyLayout();
    });
  }

  window.addEventListener('hashchange', schedule);
  window.addEventListener('resize', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-selected', 'aria-current', 'data-active'] });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
  setTimeout(schedule, 400);
  setTimeout(schedule, 1200);
})();
