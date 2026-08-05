(()=>{
  'use strict';

  const STYLE_ID = 'octopus-ui-qa-v813';
  const ROOT_SELECTOR = '#pageRoot';

  const DEEP_ROUTES = new Set([
    'overview', 'todo', 'ops.analytics', 'ops.crawl', 'ops.unblock',
    'production.upload', 'production.languages', 'release.titles', 'release.covers', 'release.publish'
  ]);
  let pendingDeepRoute = null;

  function routeFromHash() {
    const route = location.hash.replace(/^#\//, '').replaceAll('/', '.');
    return DEEP_ROUTES.has(route) ? route : null;
  }

  function rememberDeepRoute() {
    const route = routeFromHash();
    if (route && route !== 'overview') pendingDeepRoute = route;
  }

  function syncDeepRoute() {
    if (!pendingDeepRoute) return;
    const shell = document.getElementById('appShell');
    if (!shell || shell.classList.contains('hidden')) return;
    const button = Array.from(document.querySelectorAll('[data-v80]')).find((item) => item.dataset.v80 === pendingDeepRoute);
    if (!button) return;
    const target = pendingDeepRoute;
    pendingDeepRoute = null;
    if (!button.classList.contains('active') || location.hash.replace(/^#\//, '').replaceAll('/', '.') !== target) button.click();
  }

  function ensureEncoding() {
    let meta = document.querySelector('meta[charset]');
    if (!meta) {
      meta = document.createElement('meta');
      document.head.prepend(meta);
    }
    meta.setAttribute('charset', 'utf-8');
    try {
      document.documentElement.lang = typeof currentLang !== 'undefined' && currentLang === 'en' ? 'en' : 'zh-CN';
    } catch {
      document.documentElement.lang = 'zh-CN';
    }
  }

  const css = `
    html, body, button, input, select, textarea {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif !important;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    ${ROOT_SELECTOR} .v82-console {
      display: grid !important;
      grid-template-columns: minmax(410px, max-content) minmax(260px, 1fr) !important;
      align-items: center !important;
      gap: 12px !important;
      min-height: 0 !important;
      height: auto !important;
      margin: 0 0 12px !important;
      padding: 9px 10px !important;
      overflow: visible !important;
      border-radius: 12px !important;
    }

    ${ROOT_SELECTOR} .v82-tabs {
      display: inline-flex !important;
      align-items: center !important;
      width: max-content !important;
      min-width: 0 !important;
      gap: 3px !important;
      padding: 3px !important;
      margin: 0 !important;
      border: 1px solid var(--line) !important;
      border-radius: 9px !important;
      background: var(--panel2) !important;
      overflow: visible !important;
    }

    ${ROOT_SELECTOR} .v82-tab {
      flex: 0 0 auto !important;
      min-width: 122px !important;
      width: auto !important;
      height: 34px !important;
      padding: 0 15px !important;
      border: 0 !important;
      border-radius: 7px !important;
      background: transparent !important;
      box-shadow: none !important;
      color: var(--soft) !important;
      font-size: 10px !important;
      font-weight: 600 !important;
      line-height: 1 !important;
      white-space: nowrap !important;
    }

    ${ROOT_SELECTOR} .v82-tab:last-child {
      border-right: 0 !important;
    }

    ${ROOT_SELECTOR} .v82-tab:hover {
      background: color-mix(in srgb, var(--panel) 68%, transparent) !important;
      color: var(--text) !important;
    }

    ${ROOT_SELECTOR} .v82-tab.active {
      background: var(--panel) !important;
      color: var(--text) !important;
      box-shadow: 0 1px 4px rgba(0,0,0,.13) !important;
    }

    ${ROOT_SELECTOR} .v85-list-tabs {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      justify-self: end !important;
      width: auto !important;
      min-width: 0 !important;
      gap: 6px !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      background: transparent !important;
    }

    ${ROOT_SELECTOR} .v85-list-tab {
      display: inline-flex !important;
      align-items: center !important;
      gap: 5px !important;
      width: auto !important;
      min-width: 0 !important;
      height: 32px !important;
      padding: 0 12px !important;
      margin: 0 !important;
      border-radius: 999px !important;
      font-size: 9px !important;
      line-height: 1 !important;
      white-space: nowrap !important;
    }

    ${ROOT_SELECTOR} .v85-list-tab b {
      font-size: 9px !important;
      font-variant-numeric: tabular-nums;
    }

    ${ROOT_SELECTOR} .toolbar.v87-compact {
      min-height: 32px !important;
      margin: 0 0 9px !important;
    }

    ${ROOT_SELECTOR} .toolbar.v87-compact:has(.v85-result-note):not(:has(.v81-bulk)) {
      display: none !important;
    }

    ${ROOT_SELECTOR} .v85-result-note {
      font-size: 9px !important;
      line-height: 1.45 !important;
    }

    ${ROOT_SELECTOR} .table-card th,
    ${ROOT_SELECTOR} .table-card td {
      font-size: 9px !important;
      line-height: 1.45 !important;
    }

    ${ROOT_SELECTOR} .text-btn {
      min-height: 25px !important;
      padding: 3px 5px !important;
      font-size: 9px !important;
      line-height: 1.2 !important;
      white-space: nowrap !important;
    }

    ${ROOT_SELECTOR} button:not(:disabled):active {
      transform: translateY(1px);
    }

    @media (max-width: 1050px) {
      ${ROOT_SELECTOR} .v82-console {
        grid-template-columns: 1fr !important;
        align-items: stretch !important;
      }
      ${ROOT_SELECTOR} .v82-tabs {
        width: 100% !important;
      }
      ${ROOT_SELECTOR} .v82-tab {
        flex: 1 1 0 !important;
        min-width: 0 !important;
      }
      ${ROOT_SELECTOR} .v85-list-tabs {
        justify-self: start !important;
        justify-content: flex-start !important;
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

  function looksMojibake(text) {
    return /\uFFFD|Ã.|Â.|â[\u0080-\u00BF]|æ[\u0080-\u00BF]|ç[\u0080-\u00BF]|å[\u0080-\u00BF]|é[\u0080-\u00BF]|è[\u0080-\u00BF]/.test(text);
  }

  function cjkCount(text) {
    return (text.match(/[\u3400-\u9fff]/g) || []).length;
  }

  const CP1252_BYTES = new Map([
    ['€',0x80],['‚',0x82],['ƒ',0x83],['„',0x84],['…',0x85],['†',0x86],['‡',0x87],['ˆ',0x88],['‰',0x89],
    ['Š',0x8a],['‹',0x8b],['Œ',0x8c],['Ž',0x8e],['‘',0x91],['’',0x92],['“',0x93],['”',0x94],
    ['•',0x95],['–',0x96],['—',0x97],['˜',0x98],['™',0x99],['š',0x9a],['›',0x9b],['œ',0x9c],['ž',0x9e],['Ÿ',0x9f]
  ]);

  function repairString(value) {
    const text = String(value ?? '');
    if (!looksMojibake(text)) return text;
    const chars = Array.from(text);
    const bytes = [];
    for (const char of chars) {
      const cp = char.codePointAt(0);
      if (cp <= 255) bytes.push(cp);
      else if (CP1252_BYTES.has(char)) bytes.push(CP1252_BYTES.get(char));
      else return text;
    }
    try {
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bytes));
      if (!decoded.includes('\uFFFD') && (cjkCount(decoded) > cjkCount(text) || !looksMojibake(decoded))) return decoded;
    } catch {}
    return text;
  }

  function repairTree(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return looksMojibake(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const fixed = repairString(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
    });
    root.querySelectorAll?.('[placeholder], [title], [aria-label]').forEach((element) => {
      ['placeholder', 'title', 'aria-label'].forEach((name) => {
        const value = element.getAttribute(name);
        if (!value) return;
        const fixed = repairString(value);
        if (fixed !== value) element.setAttribute(name, fixed);
      });
    });
  }

  function hardenButtons(root = document) {
    root.querySelectorAll?.(`${ROOT_SELECTOR} button:not([type])`).forEach((button) => {
      button.type = 'button';
    });
    root.querySelectorAll?.(`${ROOT_SELECTOR} button`).forEach((button) => {
      if (!button.getAttribute('aria-label')) {
        const label = (button.innerText || button.textContent || '').replace(/\s+/g, ' ').trim();
        if (label) button.setAttribute('aria-label', label);
      }
    });
  }

  let scheduled = false;
  function apply() {
    scheduled = false;
    ensureEncoding();
    ensureStyle();
    repairTree(document.body);
    hardenButtons(document);
    syncDeepRoute();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(apply);
  }

  window.addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-v80-export]');
    if (!button) return;
    setTimeout(() => {
      try { typeof toast === 'function' && toast('CSV 已导出'); } catch {}
    }, 0);
  }, true);

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => {
    rememberDeepRoute();
    schedule();
  });
  document.addEventListener('submit', (event) => {
    if (!event.target.matches?.('#loginForm, #registerForm')) return;
    rememberDeepRoute();
    setTimeout(schedule, 180);
  }, true);
  document.addEventListener('click', (event) => {
    if (!event.target.closest?.('[data-demo], #directDemoLogin, #directDemoRegister, [data-enter]')) return;
    rememberDeepRoute();
    setTimeout(schedule, 180);
  }, true);
  rememberDeepRoute();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  setTimeout(schedule, 500);
})();
