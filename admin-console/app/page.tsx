"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "zh" | "en";
const en: Record<string, string> = {
  平台运营: "Platform Operations",
  平台治理: "Platform Governance",
  经营分析: "Business Analytics",
  系统管理: "System Management",
  工作台首页: "Dashboard",
  合作方管理: "Partner Management",
  资源调度中心: "Resource Orchestration",
  全局风控配置: "Global Risk Control",
  渠道管理: "Channel Management",
  计费与财务中心: "Billing & Finance",
  全域数据分析: "Global Analytics",
  运维监控中心: "Operations Center",
  系统设置: "System Settings",
  系统总览: "System Overview",
  系统总览大盘: "Overview Dashboard",
  任务告警中心: "Task & Alert Center",
  待处理事项: "Pending Items",
  合作方列表: "Partner List",
  合作方成员审计: "Member Audit",
  合作方操作日志: "Activity Log",
  "AI 能力配置": "AI Capabilities",
  任务队列管控: "Task Queue",
  对象存储配置: "Object Storage",
  区域合规策略管理: "Regional Compliance",
  全局违禁词库: "Global Blocklist",
  内容审核日志: "Content Review Log",
  投放渠道管控: "Distribution Channels",
  第三方渠道拓展配置: "Channel Expansion",
  套餐管理: "Plans",
  账单流水: "Billing Records",
  欠费管控: "Overdue Control",
  财务报表导出: "Financial Reports",
  剧集品类收益分析: "Genre Revenue",
  平台流量总览: "Platform Traffic",
  "各语种/区域收益分析": "Language & Region Revenue",
  平台资源消耗统计: "Resource Consumption",
  服务健康度: "Service Health",
  接口与链路: "API & Traces",
  告警记录: "Alert History",
  管理员账号与权限: "Admin Accounts & Roles",
  系统参数配置: "System Parameters",
  消息通知模板: "Notification Templates",
  操作安全策略: "Security Policies",
  欢迎回来: "Welcome Back",
  创建管理员账号: "Create Admin Account",
  找回登录密码: "Reset Password",
  登录: "Sign In",
  注册: "Register",
  手机号: "Phone",
  邮箱: "Email",
  邮箱地址: "Email Address",
  姓名: "Name",
  密码: "Password",
  验证码: "Verification Code",
  显示: "Show",
  保持登录: "Keep me signed in",
  忘记密码: "Forgot password",
  获取验证码: "Get Code",
  登录管理中心: "Sign in to Admin",
  注册并进入: "Register & Continue",
  发送重置验证码: "Send Reset Code",
  直接进入演示后台: "Enter Demo Admin",
  返回登录: "Back to Sign In",
  管理员安全保护: "Admin Security",
  服务协议: "Terms of Service",
  隐私政策: "Privacy Policy",
  个人设置中心: "Personal Settings",
  个人资料: "Profile",
  账号安全: "Account Security",
  通知偏好: "Notifications",
  语言与外观: "Language & Appearance",
  退出登录: "Sign Out",
  保存设置: "Save Settings",
  取消: "Cancel",
  显示名称: "Display Name",
  职位: "Role",
  个人简介: "Bio",
  登录密码: "Login Password",
  修改密码: "Change Password",
  "多因素认证 MFA": "Multi-factor Authentication",
  已开启: "Enabled",
  登录设备: "Login Devices",
  管理设备: "Manage Devices",
  登录记录: "Login History",
  查看记录: "View History",
  高风险告警: "High-risk Alerts",
  合作方审核: "Partner Reviews",
  任务队列异常: "Task Queue Issues",
  财务与欠费提醒: "Finance & Overdue Alerts",
  界面语言: "Interface Language",
  时区: "Time Zone",
  深色模式: "Dark Mode",
  浅色模式: "Light Mode",
  刷新: "Refresh",
  导出: "Export",
  导出报告: "Export Report",
  "导出 CSV": "Export CSV",
  导出配置快照: "Export Config Snapshot",
  受控数据导出: "Controlled Data Export",
  确认导出: "Confirm Export",
  本次导出将写入安全审计日志:
    "This export will be recorded in the security audit log",
  "CSV 仅包含当前筛选结果；密钥、Token、存储凭证及完整个人联系方式不会写入文件。":
    "The CSV includes only filtered results. Keys, tokens, storage credentials, and full contact details are excluded.",
  导出格式: "Format",
  数据范围: "Data Scope",
  安全处理: "Security",
  敏感字段已排除: "Sensitive fields excluded",
  确认并下载: "Confirm & Download",
  更多操作: "More Actions",
  复制记录编号: "Copy Record ID",
  查看关联详情: "View Related Details",
  "导出单条 CSV": "Export Row CSV",
  标记关注: "Add to Watchlist",
  新建配置: "New Config",
  高级筛选: "Advanced Filters",
  全部状态: "All Statuses",
  全部区域: "All Regions",
  中国大陆: "Mainland China",
  北美: "North America",
  欧洲: "Europe",
  东南亚: "Southeast Asia",
  活跃合作方: "Active Partners",
  运行中任务: "Running Tasks",
  渠道成功率: "Channel Success",
  待处理风险: "Pending Risks",
  "AI 任务资源队列": "AI Resource Queue",
  区域合规风险: "Regional Compliance Risks",
  合作方审核队列: "Partner Review Queue",
  平台流量与收益: "Traffic & Revenue",
  实时动态: "Live Activity",
  查看队列: "View Queue",
  策略管理: "Manage Policies",
  新增记录: "Add Record",
  查看: "View",
  编辑: "Edit",
  删除: "Delete",
  操作: "Actions",
  保存记录: "Save Record",
  关闭: "Close",
  确认删除: "Confirm Delete",
  删除确认: "Delete Confirmation",
  记录详情: "Record Details",
  编辑记录: "Edit Record",
  当前筛选共: "Filtered",
  "每页 20 条": "20 per page",
  正常: "Normal",
  审核中: "Under Review",
  限制中: "Restricted",
  运行中: "Running",
  排队中: "Queued",
  需人工: "Manual Review",
  已完成: "Completed",
  待处理: "Pending",
  处理中: "In Progress",
  未开始: "Not Started",
  高风险: "High Risk",
  中风险: "Medium Risk",
  待接手: "Unassigned",
  生效中: "Active",
  待发布: "Pending Release",
  启用: "Enabled",
  异常: "Incident",
  观察中: "Monitoring",
  健康: "Healthy",
  部分降级: "Partially Degraded",
  已接手: "Assigned",
  提醒中: "Reminder",
  可下载: "Available",
  已归档: "Archived",
  已支付: "Paid",
  待支付: "Unpaid",
  对账中: "Reconciling",
  在售: "Available",
  合作方: "Partner",
  类型: "Type",
  合作评级: "Rating",
  成员: "Members",
  状态: "Status",
  最近活跃: "Last Active",
  角色: "Role",
  权限范围: "Access Scope",
  风险结果: "Risk Result",
  最近登录: "Last Login",
  操作编号: "Activity ID",
  操作人: "Operator",
  操作类型: "Action Type",
  影响对象: "Affected Object",
  操作时间: "Action Time",
  任务编号: "Task ID",
  任务类型: "Task Type",
  关联项目: "Related Project",
  资源池: "Resource Pool",
  进度: "Progress",
  时效: "Timing",
  区域: "Region",
  用途: "Purpose",
  生命周期: "Lifecycle",
  策略名称: "Policy Name",
  适用区域: "Applicable Region",
  规则数: "Rules",
  拦截方式: "Enforcement",
  版本: "Version",
  分类: "Category",
  适用语言: "Languages",
  命中次数: "Matches",
  风险等级: "Risk Level",
  审核编号: "Review ID",
  内容对象: "Content",
  命中规则: "Matched Rule",
  处理结果: "Result",
  审核人: "Reviewer",
  完成时间: "Completed At",
  渠道: "Channel",
  覆盖区域: "Coverage",
  已上线内容: "Published Content",
  回执延迟: "Receipt Latency",
  目标市场: "Target Market",
  接入阶段: "Integration Stage",
  商务负责人: "Business Owner",
  技术负责人: "Technical Owner",
  预计上线: "ETA",
  套餐名称: "Plan Name",
  适用对象: "Audience",
  月费: "Monthly Fee",
  包含额度: "Included Quota",
  超额单价: "Overage Rate",
  账单编号: "Invoice ID",
  账期: "Billing Period",
  应付金额: "Amount Due",
  付款状态: "Payment Status",
  到期日: "Due Date",
  负责人: "Owner",
  收入: "Revenue",
  增长: "Growth",
  日期: "Date",
  服务: "Service",
  可用性: "Availability",
  实例: "Instances",
  成功率: "Success Rate",
  持续时间: "Duration",
  管理员: "Administrator",
  管理范围: "Scope",
  最后登录: "Last Login",
  安全状态: "Security",
  账号状态: "Account Status",
  让平台运行状态: "Keep platform operations",
  "始终清晰可控。": "clear and under control.",
  "合作方、资源调度、区域风控、发行渠道与财务数据共用一套管理中枢。每一次高风险操作都有责任人和审计记录。":
    "Partners, resource orchestration, regional compliance, distribution channels, and finance share one operations hub. Every high-risk action has an owner and an audit trail.",
  "登录平台管理中心，继续处理全局任务。":
    "Sign in to continue managing global operations.",
  "完成验证后创建平台管理员身份。":
    "Verify your identity to create an administrator account.",
  "验证账号后设置新的登录密码。": "Verify your account and set a new password.",
  请输入管理员姓名: "Enter administrator name",
  请输入手机号: "Enter phone number",
  请输入密码: "Enter password",
  "至少 8 位，包含字母和数字": "At least 8 characters with letters and numbers",
  "6 位验证码": "6-digit verification code",
  "我已阅读并同意《服务协议》和《隐私政策》":
    "I have read and agree to the Terms of Service and Privacy Policy",
  "登录、权限变更与高危操作均保留审计记录":
    "Sign-ins, permission changes, and high-risk actions are audited",
  "用于平台操作记录、审批流程和协作通知。":
    "Used for platform activity, approvals, and collaboration notices.",
  "管理密码、多因素认证和登录设备。":
    "Manage your password, multi-factor authentication, and devices.",
  "选择需要接收的业务提醒和发送渠道。":
    "Choose the alerts and delivery channels you want to receive.",
  "设置当前账号的界面语言、主题和显示密度。":
    "Set the interface language, theme, and display density for this account.",
  所有个人设置变更都会写入安全日志:
    "All personal settings changes are recorded in the security log",
  简体中文: "Simplified Chinese",
};
function translateText(source: string) {
  if (en[source]) return en[source];
  let out = source;
  Object.keys(en)
    .sort((a, b) => b.length - a.length)
    .forEach((k) => {
      if (out.includes(k)) out = out.split(k).join(en[k]);
    });
  return out;
}
const originalText = new WeakMap<Text, string>();
function useAutoTranslate(lang: Lang) {
  useEffect(() => {
    const scan = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node as Text;
        if (
          !text.parentElement ||
          ["SCRIPT", "STYLE"].includes(text.parentElement.tagName) ||
          !text.data.trim()
        )
          continue;
        if (!originalText.has(text)) originalText.set(text, text.data);
        const base = originalText.get(text)!;
        const next = lang === "en" ? translateText(base) : base;
        if (text.data !== next) text.data = next;
      }
      document
        .querySelectorAll<
          HTMLInputElement | HTMLTextAreaElement
        >("input[placeholder],textarea[placeholder]")
        .forEach((el) => {
          if (!el.dataset.zhPlaceholder)
            el.dataset.zhPlaceholder = el.placeholder;
          el.placeholder =
            lang === "en"
              ? translateText(el.dataset.zhPlaceholder)
              : el.dataset.zhPlaceholder!;
        });
    };
    scan(document.body);
    const observer = new MutationObserver((ms) =>
      ms.forEach((m) => m.addedNodes.forEach(scan)),
    );
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    return () => observer.disconnect();
  }, [lang]);
}

type NavItem = {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  group: string;
};

const nav: NavItem[] = [
  {
    id: "overview",
    label: "工作台首页",
    icon: "◈",
    badge: 8,
    group: "平台运营",
  },
  {
    id: "partners",
    label: "合作方管理",
    icon: "合",
    badge: 12,
    group: "平台运营",
  },
  {
    id: "resources",
    label: "资源调度中心",
    icon: "调",
    badge: 3,
    group: "平台运营",
  },
  {
    id: "risk",
    label: "全局风控配置",
    icon: "盾",
    badge: 23,
    group: "平台治理",
  },
  {
    id: "channels",
    label: "渠道管理",
    icon: "↗",
    badge: 4,
    group: "平台治理",
  },
  {
    id: "billing",
    label: "计费与财务中心",
    icon: "¥",
    badge: 6,
    group: "经营分析",
  },
  { id: "analytics", label: "全域数据分析", icon: "析", group: "经营分析" },
  { id: "ops", label: "运维监控中心", icon: "脉", badge: 2, group: "系统管理" },
  { id: "settings", label: "系统设置", icon: "设", group: "系统管理" },
];

const meta: Record<string, { title: string; sub: string; tabs: string[] }> = {
  overview: {
    title: "系统总览",
    sub: "跨合作方、资源、渠道与风险查看平台实时运行状态",
    tabs: ["系统总览大盘", "任务告警中心", "待处理事项"],
  },
  partners: {
    title: "合作方管理",
    sub: "管理合作方准入、成员审计与全生命周期操作记录",
    tabs: ["合作方列表", "合作方成员审计", "合作方操作日志"],
  },
  resources: {
    title: "资源调度中心",
    sub: "统一配置 AI 能力、任务队列与对象存储资源",
    tabs: ["AI 能力配置", "任务队列管控", "对象存储配置"],
  },
  risk: {
    title: "全局风控配置",
    sub: "按区域管理合规策略、违禁词库与内容审核留痕",
    tabs: ["区域合规策略管理", "全局违禁词库", "内容审核日志"],
  },
  channels: {
    title: "渠道管理",
    sub: "监控投放渠道状态并快速扩展第三方渠道",
    tabs: ["投放渠道管控", "第三方渠道拓展配置"],
  },
  billing: {
    title: "计费与财务中心",
    sub: "套餐、账单、欠费与财务报表统一管理",
    tabs: ["套餐管理", "账单流水", "欠费管控", "财务报表导出"],
  },
  analytics: {
    title: "全域数据分析",
    sub: "拆解剧集、平台流量、区域收益与资源消耗",
    tabs: [
      "剧集品类收益分析",
      "平台流量总览",
      "各语种/区域收益分析",
      "平台资源消耗统计",
    ],
  },
  ops: {
    title: "运维监控中心",
    sub: "监测平台服务、接口链路、队列与基础设施健康度",
    tabs: ["服务健康度", "接口与链路", "告警记录"],
  },
  settings: {
    title: "系统设置",
    sub: "配置管理员权限、系统参数与通知模板",
    tabs: ["管理员账号与权限", "系统参数配置", "消息通知模板", "操作安全策略"],
  },
};

type TableView = {
  headers: string[];
  rows: string[][];
  action: string;
  hint: string;
};
const view = (
  headers: string[],
  rows: string[][],
  action = "批量处理",
  hint = "数据与 User Portal 实时同步",
): TableView => ({ headers, rows, action, hint });

const recordLabel = (tabName: string) =>
  tabName.replace(/管理|管控|配置|分析|统计|总览/g, "").trim() || "记录";

type ExportPolicy = "csv" | "restricted-csv" | "snapshot";
const restrictedExports = new Set([
  "resources-0",
  "resources-2",
  "risk-0",
  "risk-1",
  "settings-0",
]);
const snapshotExports = new Set(["settings-1", "settings-2", "settings-3"]);
const exportPolicyFor = (active: string, tab: number): ExportPolicy => {
  const key = `${active}-${tab}`;
  if (snapshotExports.has(key)) return "snapshot";
  if (restrictedExports.has(key)) return "restricted-csv";
  return "csv";
};

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const csvCell = (value: string) => {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

const tableViews: Record<string, TableView> = {
  "overview-1": view(
    ["告警编号", "告警类型", "来源模块", "级别", "状态", "触发时间"],
    [
      [
        "ALT-20260803-089",
        "渠道回执异常",
        "YouTube · 欧洲",
        "高风险",
        "待接手",
        "13:42",
      ],
      [
        "ALT-20260803-084",
        "任务队列拥塞",
        "AI 配音池",
        "中风险",
        "处理中",
        "13:18",
      ],
      [
        "ALT-20260803-078",
        "合作方权限越权",
        "Nordlicht Studio",
        "高风险",
        "需人工",
        "12:56",
      ],
    ],
    "批量接手",
    "按风险级别与 SLA 排序",
  ),
  "overview-2": view(
    ["待办事项", "关联对象", "负责人", "优先级", "截止时间", "状态"],
    [
      [
        "复核欧洲区违禁词命中",
        "逆光档案 S1",
        "Suzy Wang",
        "P0",
        "今天 16:00",
        "待处理",
      ],
      [
        "审批渠道扩展申请",
        "蓝鲸数字娱乐",
        "Mia Chen",
        "P1",
        "今天 18:00",
        "审核中",
      ],
      [
        "确认 7 月欠费冻结名单",
        "12 家合作方",
        "Leo Meyer",
        "P1",
        "明天 12:00",
        "未开始",
      ],
    ],
    "批量分配",
    "仅展示需要平台管理员处理的事项",
  ),
  "partners-0": view(
    ["合作方", "类型", "合作评级", "成员", "状态", "最近活跃"],
    [
      ["星火影业有限公司", "内容制作方", "S 级", "126", "正常", "08-03 13:42"],
      ["潮汐内容工作室", "内容制作方", "A 级", "48", "审核中", "08-03 12:16"],
      ["Northstar Media", "海外发行方", "A 级", "79", "正常", "08-03 11:08"],
      ["蓝鲸数字娱乐", "渠道合作方", "B 级", "35", "限制中", "08-02 18:34"],
    ],
    "邀请合作方",
  ),
  "partners-1": view(
    ["成员", "所属合作方", "角色", "权限范围", "风险结果", "最近登录"],
    [
      [
        "Mia Chen",
        "星火影业有限公司",
        "制作方管理员",
        "全部项目",
        "正常",
        "13:36",
      ],
      [
        "Nora Lee",
        "潮汐内容工作室",
        "项目管理员",
        "3 个项目",
        "待复核",
        "12:08",
      ],
      [
        "Felix Braun",
        "Northstar Media",
        "财务人员",
        "账单与结算",
        "正常",
        "昨天 22:14",
      ],
    ],
    "批量审计",
    "成员身份与权限变更审计",
  ),
  "partners-2": view(
    ["操作编号", "合作方", "操作人", "操作类型", "影响对象", "操作时间"],
    [
      [
        "LOG-90881",
        "星火影业有限公司",
        "Mia Chen",
        "新增成员",
        "6 名成员",
        "13:21",
      ],
      [
        "LOG-90874",
        "蓝鲸数字娱乐",
        "Nora Lee",
        "修改渠道配置",
        "TikTok US",
        "12:48",
      ],
      [
        "LOG-90862",
        "Northstar Media",
        "Felix Braun",
        "导出账单",
        "2026-07",
        "11:32",
      ],
    ],
    "导出日志",
    "日志保留 180 天",
  ),
  "resources-0": view(
    ["AI 能力", "供应商 / 模型", "能力类型", "调用配额", "健康度", "状态"],
    [
      [
        "多语种翻译",
        "OctoTrans v4",
        "文本模型",
        "1.2M tokens/h",
        "99.98%",
        "启用",
      ],
      [
        "角色配音",
        "VoiceMatrix 3",
        "语音模型",
        "480 tasks/h",
        "99.72%",
        "启用",
      ],
      ["成片合成", "RenderFlow 2", "视频模型", "96 tasks/h", "98.91%", "降级"],
    ],
    "新增能力",
    "模型路由与租户配额配置",
  ),
  "resources-1": view(
    ["任务编号", "任务类型", "关联项目", "资源池", "进度", "时效"],
    [
      [
        "TSK-260803-3846",
        "字幕翻译 · 德语",
        "星海漫游 S1",
        "语言模型池",
        "72%",
        "预计 14 分钟",
      ],
      [
        "TSK-260803-3812",
        "AI 配音 · 英语",
        "午夜讯号 S1",
        "语音模型池",
        "排队中",
        "队列第 12 位",
      ],
      [
        "TSK-260803-3711",
        "成片封装 · 4K",
        "潮汐指令 S1",
        "视频处理池",
        "100%",
        "耗时 23 分钟",
      ],
    ],
    "调整优先级",
    "当前 3,846 个运行任务",
  ),
  "resources-2": view(
    ["存储桶", "区域", "用途", "已用 / 配额", "生命周期", "状态"],
    [
      ["octopus-master-cn", "华东", "成片母版", "18.4 / 30 TB", "永久", "正常"],
      [
        "octopus-assets-eu",
        "法兰克福",
        "欧洲发行素材",
        "7.2 / 10 TB",
        "180 天",
        "容量预警",
      ],
      [
        "octopus-temp-us",
        "俄勒冈",
        "转码临时文件",
        "2.1 / 8 TB",
        "7 天",
        "正常",
      ],
    ],
    "新增存储桶",
    "对象存储、跨区复制与生命周期",
  ),
  "risk-0": view(
    ["策略名称", "适用区域", "规则数", "拦截方式", "版本", "状态"],
    [
      [
        "中国大陆内容合规策略",
        "中国大陆",
        "286",
        "发布前拦截",
        "v3.8",
        "生效中",
      ],
      ["EU DSA 内容策略", "欧盟 27 国", "194", "审核 + 申诉", "v2.4", "生效中"],
      ["北美未成年人策略", "美国 / 加拿大", "73", "年龄分级", "v1.9", "待发布"],
    ],
    "新建区域策略",
    "按发行目的地自动应用",
  ),
  "risk-1": view(
    ["词条 / 正则", "分类", "适用语言", "命中次数", "风险等级", "状态"],
    [
      ["极端暴力描述", "暴力", "中文 / 英文", "1,286", "高风险", "启用"],
      [
        "regulated claim pattern",
        "虚假宣传",
        "英文 / 德文",
        "342",
        "中风险",
        "启用",
      ],
      ["未成年人敏感表达", "未成年人", "12 种语言", "89", "高风险", "待复核"],
    ],
    "新增词条",
    "全局词库支持区域覆盖",
  ),
  "risk-2": view(
    ["审核编号", "内容对象", "命中规则", "处理结果", "审核人", "完成时间"],
    [
      [
        "REV-803821",
        "逆光档案 EP12",
        "EU-194-32",
        "退回修改",
        "Suzy Wang",
        "13:28",
      ],
      [
        "REV-803806",
        "午夜讯号预告片",
        "US-73-11",
        "人工通过",
        "Mia Chen",
        "12:44",
      ],
      ["REV-803772", "星海漫游海报", "CN-286-08", "自动通过", "系统", "11:52"],
    ],
    "导出审核记录",
    "审核证据链与申诉记录",
  ),
  "channels-0": view(
    ["渠道", "覆盖区域", "已上线内容", "24h 请求成功率", "回执延迟", "状态"],
    [
      ["YouTube", "全球", "1,284", "99.96%", "38s", "正常"],
      ["TikTok Series", "北美 / 东南亚", "462", "99.31%", "1m 12s", "观察中"],
      ["Dailymotion", "欧洲", "318", "97.84%", "4m 26s", "异常"],
    ],
    "新增投放渠道",
    "渠道联通性与投放状态",
  ),
  "channels-1": view(
    [
      "拓展渠道",
      "目标市场",
      "接入阶段",
      "商务负责人",
      "技术负责人",
      "预计上线",
    ],
    [
      ["Rakuten TV", "欧洲", "API 联调", "Leo Meyer", "Aaron Li", "08-18"],
      ["Tubi", "北美", "合同审核", "Suzy Wang", "—", "09-01"],
      ["LINE VOOM", "日本", "资料准备", "Mia Chen", "Ken Ito", "09-12"],
    ],
    "新建拓展计划",
    "第三方渠道接入项目管理",
  ),
  "billing-0": view(
    ["套餐名称", "适用对象", "月费", "包含额度", "超额单价", "状态"],
    [
      [
        "Partner Plan",
        "内容制作方",
        "¥19,800",
        "20,000 任务",
        "¥0.86 / 任务",
        "在售",
      ],
      [
        "Global Distributor",
        "海外发行方",
        "$6,800",
        "50 TB 流量",
        "$0.09 / GB",
        "在售",
      ],
      [
        "Enterprise Custom",
        "战略合作方",
        "定制",
        "自定义",
        "合同约定",
        "邀约制",
      ],
    ],
    "新建套餐",
    "套餐、计量项与价格版本",
  ),
  "billing-1": view(
    ["账单编号", "合作方", "账期", "应付金额", "付款状态", "到期日"],
    [
      [
        "BILL-202607-0128",
        "星火影业有限公司",
        "2026-07",
        "¥286,420",
        "已支付",
        "08-10",
      ],
      [
        "BILL-202607-0127",
        "潮汐内容工作室",
        "2026-07",
        "¥94,680",
        "待支付",
        "08-10",
      ],
      [
        "BILL-202607-0121",
        "Northstar Media",
        "2026-07",
        "$28,412",
        "对账中",
        "08-15",
      ],
    ],
    "生成账单",
    "平台账单与渠道分成流水",
  ),
  "billing-2": view(
    ["合作方", "逾期金额", "逾期天数", "当前措施", "催缴进度", "负责人"],
    [
      [
        "蓝鲸数字娱乐",
        "¥128,600",
        "18 天",
        "限制新建任务",
        "二次催缴",
        "Nora Lee",
      ],
      [
        "Moonlight Studio",
        "$7,820",
        "9 天",
        "额度降至 50%",
        "首次催缴",
        "Felix Braun",
      ],
      ["矩阵影视", "¥46,200", "3 天", "预警提醒", "邮件已送达", "Mia Chen"],
    ],
    "批量催缴",
    "欠费分级与服务限制策略",
  ),
  "billing-3": view(
    ["报表名称", "报表周期", "包含范围", "生成方式", "最近导出", "状态"],
    [
      [
        "平台收入月报",
        "2026-07",
        "订阅 + 用量 + 分成",
        "自动生成",
        "08-01 09:00",
        "可下载",
      ],
      [
        "合作方应收账龄",
        "截至 08-03",
        "全部合作方",
        "手动生成",
        "08-03 11:24",
        "可下载",
      ],
      [
        "渠道分成核算表",
        "2026 Q2",
        "18 个渠道",
        "财务复核",
        "07-28 16:10",
        "已归档",
      ],
    ],
    "新建导出任务",
    "财务报表模板与导出记录",
  ),
  "analytics-0": view(
    ["剧集品类", "上线剧集", "有效播放", "总收入", "单集收益", "环比"],
    [
      ["都市悬疑", "126", "482.6M", "¥18.42M", "¥146,190", "+18.6%"],
      ["奇幻冒险", "89", "316.8M", "¥12.76M", "¥143,371", "+9.2%"],
      ["甜宠漫剧", "214", "508.2M", "¥16.31M", "¥76,215", "-2.4%"],
    ],
    "导出品类分析",
    "按内容品类拆解收益表现",
  ),
  "analytics-1": view(
    ["日期", "PV", "UV", "任务提交量", "转化率", "峰值 QPS"],
    [
      ["08-03", "12.86M", "3.42M", "486,219", "14.2%", "8,642"],
      ["08-02", "12.21M", "3.28M", "472,806", "14.4%", "8,218"],
      ["08-01", "11.94M", "3.16M", "451,772", "14.3%", "7,986"],
    ],
    "导出流量数据",
    "平台访问与业务转化漏斗",
  ),
  "analytics-2": view(
    ["语种 / 区域", "上线内容", "播放量", "收入", "ARPU", "增长"],
    [
      ["英语 · 北美", "386", "428.6M", "$2.84M", "$0.82", "+16.8%"],
      ["德语 · DACH", "142", "96.4M", "€816K", "€1.06", "+22.4%"],
      ["日语 · 日本", "96", "128.2M", "¥186M", "¥182", "+8.7%"],
    ],
    "导出区域收益",
    "币种已按日终汇率统一换算",
  ),
  "analytics-3": view(
    ["资源类型", "本月用量", "预算使用率", "单位成本", "成本环比", "预测"],
    [
      ["GPU 推理", "286,420 h", "78%", "¥4.26 / h", "-6.2%", "月底 92%"],
      ["对象存储", "842 TB", "64%", "¥0.11 / GB", "+3.1%", "月底 71%"],
      ["CDN 流量", "18.6 PB", "83%", "¥0.074 / GB", "-8.4%", "月底 97%"],
    ],
    "导出消耗明细",
    "资源成本与预算预测",
  ),
  "ops-0": view(
    ["服务", "区域", "可用性", "P95 延迟", "实例", "状态"],
    [
      ["Admin API", "全球", "99.999%", "82ms", "48 / 48", "健康"],
      ["Render Worker", "亚洲", "99.94%", "1.8s", "186 / 192", "部分降级"],
      ["Channel Gateway", "欧洲", "99.81%", "426ms", "28 / 32", "异常"],
    ],
    "新建健康检查",
    "核心服务实时健康状态",
  ),
  "ops-1": view(
    ["接口 / 链路", "调用方", "24h 请求量", "成功率", "P95", "状态"],
    [
      [
        "POST /tasks/batch",
        "Partner Portal",
        "4.28M",
        "99.98%",
        "186ms",
        "正常",
      ],
      ["Channel → YouTube", "发行服务", "826K", "99.92%", "1.2s", "正常"],
      ["Channel → Dailymotion", "发行服务", "142K", "97.84%", "4.6s", "异常"],
    ],
    "配置链路监控",
    "端到端接口与第三方依赖",
  ),
  "ops-2": view(
    ["告警编号", "服务", "告警规则", "级别", "持续时间", "状态"],
    [
      [
        "OPS-803-441",
        "Channel Gateway EU",
        "成功率 < 98%",
        "P0",
        "38m",
        "处理中",
      ],
      [
        "OPS-803-438",
        "Render Worker APAC",
        "可用实例 < 98%",
        "P1",
        "1h 12m",
        "已接手",
      ],
      [
        "OPS-803-421",
        "Object Storage EU",
        "容量 > 70%",
        "P2",
        "4h 26m",
        "待处理",
      ],
    ],
    "批量接手",
    "运维告警处置与恢复记录",
  ),
  "settings-0": view(
    ["管理员", "角色", "管理范围", "最后登录", "安全状态", "账号状态"],
    [
      ["Suzy Wang", "超级管理员", "全局", "13:42", "MFA 已开启", "正常"],
      [
        "Mia Chen",
        "运营管理员",
        "合作方 / 渠道",
        "12:16",
        "MFA 已开启",
        "正常",
      ],
      [
        "Leo Meyer",
        "财务管理员",
        "账单 / 报表",
        "11:08",
        "需更新密码",
        "提醒中",
      ],
    ],
    "新增管理员",
    "管理员角色与数据权限",
  ),
  "settings-1": view(
    ["参数名称", "参数键", "当前值", "作用范围", "最近修改", "状态"],
    [
      [
        "任务默认 SLA",
        "task.default_sla",
        "4h",
        "全局",
        "08-02 · Suzy",
        "生效中",
      ],
      [
        "审核证据保留期",
        "audit.retention",
        "180d",
        "全局",
        "07-28 · Mia",
        "生效中",
      ],
      [
        "合作方成员上限",
        "partner.member_limit",
        "200",
        "Partner Plan",
        "07-21 · 系统",
        "生效中",
      ],
    ],
    "新增系统参数",
    "关键参数修改需要双人复核",
  ),
  "settings-2": view(
    ["模板名称", "触发场景", "发送渠道", "语言版本", "最近修改", "状态"],
    [
      ["任务失败通知", "任务终止", "站内信 / 邮件", "中英德", "08-01", "启用"],
      ["账单到期提醒", "到期前 7 天", "邮件 / 短信", "中英文", "07-29", "启用"],
      [
        "合规审核退回",
        "审核不通过",
        "站内信 / Webhook",
        "12 种语言",
        "07-26",
        "启用",
      ],
    ],
    "新建通知模板",
    "消息模板、变量与发送渠道",
  ),
  "settings-3": view(
    ["安全策略", "适用对象", "策略内容", "触发动作", "最近命中", "状态"],
    [
      [
        "管理员 MFA 强制",
        "全部管理员",
        "每 30 天验证",
        "阻止登录",
        "—",
        "启用",
      ],
      [
        "高危操作双人复核",
        "财务 / 风控",
        "删除、冻结、退款",
        "进入审批",
        "13:08",
        "启用",
      ],
      [
        "异常 IP 登录保护",
        "全部账号",
        "新地区 + 新设备",
        "二次验证",
        "昨天 22:16",
        "启用",
      ],
    ],
    "新建安全策略",
    "登录、审批与高危操作保护",
  ),
};

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [lang, setLang] = useState<Lang>("zh");
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">(
    "login",
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [active, setActive] = useState("overview");
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [dark, setDark] = useState(true);
  const [range, setRange] = useState("30 天");
  const [dbStatus, setDbStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const [records, setRecords] = useState<Record<string, string[][]>>(() =>
    Object.fromEntries(
      Object.entries(tableViews).map(([key, value]) => [
        key,
        value.rows.map((row) => [...row]),
      ]),
    ),
  );
  const current = meta[active];
  const viewKey = `${active}-${tab}`;
  const tableView = tableViews[viewKey] ?? tableViews["overview-1"];
  const currentRows = records[viewKey] ?? tableView.rows;
  const filtered = useMemo(
    () =>
      currentRows.filter((row) =>
        row.join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [currentRows, query],
  );
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };
  useAutoTranslate(lang);
  useEffect(() => {
    let activeRequest = true;
    const initialize = async () => {
      try {
        const response = await fetch("/api/admin/records", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("database unavailable");
        let payload = (await response.json()) as {
          records: Record<string, string[][]>;
        };
        if (!Object.keys(payload.records).length) {
          const bootstrap = await fetch("/api/admin/records", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              records: Object.fromEntries(
                Object.entries(tableViews).map(([key, value]) => [
                  key,
                  value.rows,
                ]),
              ),
            }),
          });
          if (!bootstrap.ok) throw new Error("database initialization failed");
          payload = (await bootstrap.json()) as {
            records: Record<string, string[][]>;
          };
        }
        if (activeRequest) {
          setRecords((currentRecords) => ({
            ...currentRecords,
            ...payload.records,
          }));
          setDbStatus("connected");
        }
      } catch {
        if (activeRequest) setDbStatus("error");
      }
    };
    void initialize();
    return () => {
      activeRequest = false;
    };
  }, []);

  const saveRows = (nextVisibleRows: string[][]) => {
    const visibleKeys = new Set(filtered.map((row) => row[0]));
    const nextRows = query
      ? [
          ...nextVisibleRows,
          ...currentRows.filter((row) => !visibleKeys.has(row[0])),
        ]
      : nextVisibleRows;
    setRecords((previous) => ({ ...previous, [viewKey]: nextRows }));
    setDbStatus("connecting");
    void fetch("/api/admin/records", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        viewKey,
        rows: nextRows,
        action: "admin_crud_update",
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("save failed");
        setDbStatus("connected");
      })
      .catch(() => {
        setDbStatus("error");
        notify("数据库保存失败，请稍后重试");
      });
  };

  if (!signedIn)
    return (
      <AuthPortal
        mode={authMode}
        setMode={setAuthMode}
        onEnter={() => setSignedIn(true)}
        lang={lang}
        setLang={setLang}
      />
    );

  return (
    <div className={dark ? "app" : "app light"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brandmark">O</div>
          <div>
            <b>Octopus</b>
            <span>RELEASE ADMIN PORTAL</span>
          </div>
        </div>
        <div className="org">
          <div className="avatar">O</div>
          <div>
            <strong>Octopus 平台总部</strong>
            <small>超级管理员 · Global</small>
          </div>
        </div>
        <nav>
          {[...new Set(nav.map((n) => n.group))].map((group) => (
            <div key={group} className="navgroup">
              <p>{group}</p>
              {nav
                .filter((n) => n.group === group)
                .map((n) => (
                  <button
                    key={n.id}
                    className={active === n.id ? "navitem active" : "navitem"}
                    onClick={() => {
                      setActive(n.id);
                      setTab(0);
                      setQuery("");
                      setDrawer(null);
                    }}
                  >
                    <i>{n.icon}</i>
                    <span>{n.label}</span>
                    {n.badge ? <em>{n.badge}</em> : null}
                  </button>
                ))}
            </div>
          ))}
        </nav>
        <div className="profile">
          <div className="avatar">S</div>
          <div>
            <b>Suzy Wang</b>
            <small>平台超级管理员</small>
          </div>
          <button
            aria-label="打开个人设置"
            onClick={() => setSettingsOpen(true)}
          >
            •••
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="sync">
            <span className={dbStatus === "error" ? "syncerror" : ""} />
            Octopus Admin Workspace
            <small>
              {dbStatus === "connected"
                ? "D1 与 User Portal 已连接"
                : dbStatus === "connecting"
                  ? "正在同步 D1 数据…"
                  : "D1 同步异常，请重试"}
            </small>
          </div>
          <label className="global-search">
            ⌕
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索合作方、任务、渠道、内容 ID"
            />
          </label>
          <button
            aria-label="Switch language"
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          >
            {lang === "zh" ? "EN" : "中"}
          </button>
          <button onClick={() => setDark(!dark)}>◐</button>
          <button onClick={() => setDrawer("帮助中心")}>?</button>
          <button className="bell" onClick={() => setDrawer("系统告警")}>
            ●<i>8</i>
          </button>
        </header>

        <section className="content">
          <div className="breadcrumb">
            Octopus&nbsp;&nbsp;/&nbsp;&nbsp;{current.title}
            &nbsp;&nbsp;/&nbsp;&nbsp;{current.tabs[tab]}
          </div>
          <div className="pagehead">
            <div>
              <h1>{current.title}</h1>
              <p>{current.sub}</p>
            </div>
            <div>
              <button className="ghost" onClick={() => notify("数据已刷新")}>
                刷新
              </button>
              {active === "overview" && tab === 0 && (
                <>
                  <button className="ghost" onClick={() => window.print()}>
                    导出报告
                  </button>
                  <button
                    className="primary"
                    onClick={() => setDrawer("新建告警规则")}
                  >
                    ＋ 新建告警规则
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="modulebar">
            <div className="moduleicon">
              {nav.find((n) => n.id === active)?.icon}
            </div>
            <div>
              <b>{current.title}</b>
              <small>{current.tabs.length} 个管理视图</small>
            </div>
            <div className="tabs">
              {current.tabs.map((t, i) => (
                <button
                  key={t}
                  className={tab === i ? "selected" : ""}
                  onClick={() => {
                    setTab(i);
                    setQuery("");
                    setDrawer(null);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="toolbar">
            <label>
              ⌕
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`搜索${current.title}记录`}
              />
            </label>
            <select>
              <option>全部状态</option>
              <option>正常</option>
              <option>处理中</option>
              <option>高风险</option>
            </select>
            <select>
              <option>全部区域</option>
              <option>中国大陆</option>
              <option>北美</option>
              <option>欧洲</option>
              <option>东南亚</option>
            </select>
            <span />
            <button className="ghost" onClick={() => setDrawer("筛选条件")}>
              高级筛选
            </button>
          </div>

          <div className="kpis">
            {[
              ["活跃合作方", "128", "较上月 +12"],
              ["运行中任务", "3,846", "峰值容量 68%"],
              ["渠道成功率", "99.82%", "过去 24 小时"],
              ["待处理风险", "23", "4 项将在 2 小时内超时"],
            ].map((k, i) => (
              <article key={k[0]} onClick={() => setDrawer(k[0])}>
                <div className={`kpi-dot c${i}`} /> <span>{k[0]}</span>
                <strong>{k[1]}</strong>
                <small>{k[2]}</small>
              </article>
            ))}
          </div>

          {active === "overview" && tab === 0 ? (
            <Dashboard range={range} setRange={setRange} open={setDrawer} />
          ) : (
            <Records
              key={viewKey}
              viewKey={viewKey}
              active={active}
              tab={tab}
              data={tableView}
              rows={filtered}
              onRowsChange={saveRows}
              notify={notify}
            />
          )}
        </section>
      </main>

      {drawer && (
        <div className="overlay" onMouseDown={() => setDrawer(null)}>
          <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
            <header>
              <div>
                <small>OCTOPUS ADMIN</small>
                <h2>{drawer}</h2>
              </div>
              <button onClick={() => setDrawer(null)}>×</button>
            </header>
            <div className="drawerbody">
              <div className="statusline">
                <span />
                平台数据同步正常
              </div>
              <h3>处理详情</h3>
              <p>
                当前操作将保留完整审计记录，并与 User Portal 的关联对象同步。
              </p>
              <label>
                配置名称
                <input defaultValue={drawer} />
              </label>
              <label>
                负责人
                <select>
                  <option>Suzy Wang</option>
                  <option>Mia Chen</option>
                  <option>Leo Meyer</option>
                </select>
              </label>
              <label>
                处理备注
                <textarea placeholder="填写本次操作的背景与说明" />
              </label>
              <div className="audit">
                <b>最近操作记录</b>
                <p>13:42 · 系统完成风险规则扫描</p>
                <p>12:16 · Mia Chen 更新了合作方资料</p>
                <p>11:08 · 渠道回执已自动归档</p>
              </div>
            </div>
            <footer>
              <button className="ghost" onClick={() => setDrawer(null)}>
                取消
              </button>
              <button
                className="primary"
                onClick={() => {
                  setDrawer(null);
                  notify("操作已保存并写入审计日志");
                }}
              >
                确认保存
              </button>
            </footer>
          </aside>
        </div>
      )}
      {settingsOpen && (
        <AccountCenter
          close={() => setSettingsOpen(false)}
          notify={notify}
          signOut={() => {
            setSettingsOpen(false);
            setSignedIn(false);
            setAuthMode("login");
          }}
          dark={dark}
          setDark={setDark}
          lang={lang}
          setLang={setLang}
        />
      )}
      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

function AuthPortal({
  mode,
  setMode,
  onEnter,
  lang,
  setLang,
}: {
  mode: "login" | "register" | "forgot";
  setMode: (m: "login" | "register" | "forgot") => void;
  onEnter: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
}) {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && !agreed) {
      setMessage("请先阅读并同意服务协议与隐私政策");
      return;
    }
    if (mode === "forgot") {
      setMessage("验证码已发送，请在 10 分钟内完成重置");
      return;
    }
    onEnter();
  };
  return (
    <main className="authpage">
      <section className="authstory">
        <div className="authbrand">
          <div className="brandmark">O</div>
          <div>
            <b>Octopus</b>
            <span>RELEASE ADMIN PORTAL</span>
          </div>
        </div>
        <div className="storycopy">
          <div className="connected">
            <i />
            Admin workspace connected to User Portal
          </div>
          <h1>
            让平台运行状态
            <br />
            <em>始终清晰可控。</em>
          </h1>
          <p>
            合作方、资源调度、区域风控、发行渠道与财务数据共用一套管理中枢。每一次高风险操作都有责任人和审计记录。
          </p>
          <div className="authstats">
            <div>
              <b>128</b>
              <span>活跃合作方</span>
            </div>
            <div>
              <b>3,846</b>
              <span>运行中任务</span>
            </div>
            <div>
              <b>99.82%</b>
              <span>渠道成功率</span>
            </div>
          </div>
        </div>
        <small>Octopus Release Admin Portal · Global operations view</small>
      </section>
      <section className="authside">
        <button
          type="button"
          className="authlang"
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
        >
          {lang === "zh" ? "EN" : "中"}
        </button>
        <form className="authcard" onSubmit={submit}>
          <header>
            <div className="authmini">O</div>
            <div>
              <small>OCTOPUS ADMIN</small>
              <h2>
                {mode === "login"
                  ? "欢迎回来"
                  : mode === "register"
                    ? "创建管理员账号"
                    : "找回登录密码"}
              </h2>
              <p>
                {mode === "login"
                  ? "登录平台管理中心，继续处理全局任务。"
                  : mode === "register"
                    ? "完成验证后创建平台管理员身份。"
                    : "验证账号后设置新的登录密码。"}
              </p>
            </div>
          </header>
          {mode !== "forgot" && (
            <div className="authswitch">
              <button
                type="button"
                className={mode === "login" ? "on" : ""}
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
              >
                登录
              </button>
              <button
                type="button"
                className={mode === "register" ? "on" : ""}
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
              >
                注册
              </button>
            </div>
          )}
          <div className="methodtabs">
            <button
              type="button"
              className={method === "phone" ? "on" : ""}
              onClick={() => setMethod("phone")}
            >
              手机号
            </button>
            <button
              type="button"
              className={method === "email" ? "on" : ""}
              onClick={() => setMethod("email")}
            >
              邮箱
            </button>
          </div>
          {mode === "register" && (
            <label>
              姓名
              <input placeholder="请输入管理员姓名" required />
            </label>
          )}
          <label>
            {method === "phone" ? "手机号" : "邮箱地址"}
            <div className="phonefield">
              {method === "phone" && (
                <select>
                  <option>+86</option>
                  <option>+1</option>
                  <option>+49</option>
                  <option>+81</option>
                </select>
              )}
              <input
                type={method === "email" ? "email" : "tel"}
                placeholder={
                  method === "phone" ? "请输入手机号" : "name@company.com"
                }
                required
              />
            </div>
          </label>
          {mode !== "forgot" && (
            <label>
              密码
              <div className="password">
                <input
                  type="password"
                  placeholder={
                    mode === "register"
                      ? "至少 8 位，包含字母和数字"
                      : "请输入密码"
                  }
                  required
                />
                <button type="button">显示</button>
              </div>
            </label>
          )}
          {(mode === "register" || mode === "forgot") && (
            <label>
              验证码
              <div className="codefield">
                <input placeholder="6 位验证码" required />
                <button
                  type="button"
                  onClick={() => setMessage("验证码已发送")}
                >
                  获取验证码
                </button>
              </div>
            </label>
          )}
          {mode === "login" && (
            <div className="authoptions">
              <label>
                <input type="checkbox" defaultChecked />
                保持登录
              </label>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setMessage("");
                }}
              >
                忘记密码
              </button>
            </div>
          )}
          {mode === "register" && (
            <label className="agreement">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              我已阅读并同意《服务协议》和《隐私政策》
            </label>
          )}
          {message && <div className="authmessage">{message}</div>}
          <button className="authprimary" type="submit">
            {mode === "login"
              ? "登录管理中心"
              : mode === "register"
                ? "注册并进入"
                : "发送重置验证码"}
          </button>
          {mode === "login" && (
            <button className="authdemo" type="button" onClick={onEnter}>
              直接进入演示后台
            </button>
          )}
          {mode === "forgot" && (
            <button
              className="authdemo"
              type="button"
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              返回登录
            </button>
          )}
          <div className="authsecure">
            <span>盾</span>
            <p>
              <b>管理员安全保护</b>
              <small>登录、权限变更与高危操作均保留审计记录</small>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}

function AccountCenter({
  close,
  notify,
  signOut,
  dark,
  setDark,
  lang,
  setLang,
}: {
  close: () => void;
  notify: (m: string) => void;
  signOut: () => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
}) {
  const [section, setSection] = useState("profile");
  const save = () => {
    notify("个人设置已保存");
    close();
  };
  return (
    <div className="accountoverlay" onMouseDown={close}>
      <section
        className="accountcenter"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header>
          <div>
            <small>PERSONAL SETTINGS</small>
            <h2>个人设置中心</h2>
          </div>
          <button aria-label="关闭" onClick={close}>
            ×
          </button>
        </header>
        <div className="accountlayout">
          <aside>
            <div className="accountuser">
              <div className="bigavatar">S</div>
              <b>Suzy Wang</b>
              <span>suzywang168@gmail.com</span>
              <em>平台超级管理员</em>
            </div>
            {[
              ["profile", "个人资料", "人"],
              ["security", "账号安全", "盾"],
              ["notice", "通知偏好", "铃"],
              ["appearance", "语言与外观", "◐"],
            ].map((x) => (
              <button
                key={x[0]}
                className={section === x[0] ? "on" : ""}
                onClick={() => setSection(x[0])}
              >
                <i>{x[2]}</i>
                {x[1]}
              </button>
            ))}
            <button className="signout" onClick={signOut}>
              <i>↪</i>退出登录
            </button>
          </aside>
          <div className="accountcontent">
            {section === "profile" && (
              <>
                <h3>个人资料</h3>
                <p>用于平台操作记录、审批流程和协作通知。</p>
                <div className="formgrid">
                  <label>
                    显示名称
                    <input defaultValue="Suzy Wang" />
                  </label>
                  <label>
                    职位
                    <input defaultValue="平台超级管理员" />
                  </label>
                  <label>
                    邮箱地址
                    <input defaultValue="suzywang168@gmail.com" />
                  </label>
                  <label>
                    手机号
                    <input defaultValue="+1 415 000 2816" />
                  </label>
                  <label className="wide">
                    个人简介
                    <textarea defaultValue="负责 Octopus 平台产品、运营、风控与全局管理。" />
                  </label>
                </div>
              </>
            )}
            {section === "security" && (
              <>
                <h3>账号安全</h3>
                <p>管理密码、多因素认证和登录设备。</p>
                <div className="settingrows">
                  <div>
                    <span>
                      <b>登录密码</b>
                      <small>最近修改于 2026-07-18</small>
                    </span>
                    <button onClick={() => notify("修改密码流程已打开")}>
                      修改密码
                    </button>
                  </div>
                  <div>
                    <span>
                      <b>多因素认证 MFA</b>
                      <small>已绑定身份验证器</small>
                    </span>
                    <em className="safe">已开启</em>
                  </div>
                  <div>
                    <span>
                      <b>登录设备</b>
                      <small>当前有 2 台可信设备</small>
                    </span>
                    <button onClick={() => notify("设备管理已打开")}>
                      管理设备
                    </button>
                  </div>
                  <div>
                    <span>
                      <b>登录记录</b>
                      <small>最近登录：San Francisco · Chrome</small>
                    </span>
                    <button onClick={() => notify("登录记录已展开")}>
                      查看记录
                    </button>
                  </div>
                </div>
              </>
            )}
            {section === "notice" && (
              <>
                <h3>通知偏好</h3>
                <p>选择需要接收的业务提醒和发送渠道。</p>
                <div className="settingrows checks">
                  {[
                    ["高风险告警", "站内信、邮件和短信"],
                    ["合作方审核", "站内信和邮件"],
                    ["任务队列异常", "站内信"],
                    ["财务与欠费提醒", "邮件和短信"],
                  ].map((x, i) => (
                    <div key={x[0]}>
                      <span>
                        <b>{x[0]}</b>
                        <small>{x[1]}</small>
                      </span>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked={i < 3} />
                        <i />
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
            {section === "appearance" && (
              <>
                <h3>语言与外观</h3>
                <p>设置当前账号的界面语言、主题和显示密度。</p>
                <div className="formgrid">
                  <label>
                    界面语言
                    <select
                      value={lang}
                      onChange={(e) => setLang(e.target.value as Lang)}
                    >
                      <option value="zh">简体中文</option>
                      <option value="en">English</option>
                    </select>
                  </label>
                  <label>
                    时区
                    <select defaultValue="pst">
                      <option value="pst">America / Los Angeles</option>
                      <option value="cn">Asia / Shanghai</option>
                      <option value="de">Europe / Berlin</option>
                    </select>
                  </label>
                </div>
                <div className="themes">
                  <button
                    className={dark ? "on" : ""}
                    onClick={() => setDark(true)}
                  >
                    <i className="darkpreview" />
                    深色模式
                  </button>
                  <button
                    className={!dark ? "on" : ""}
                    onClick={() => setDark(false)}
                  >
                    <i className="lightpreview" />
                    浅色模式
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <footer>
          <span>所有个人设置变更都会写入安全日志</span>
          <div>
            <button className="ghost" onClick={close}>
              取消
            </button>
            <button className="primary" onClick={save}>
              保存设置
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function Dashboard({
  range,
  setRange,
  open,
}: {
  range: string;
  setRange: (r: string) => void;
  open: (s: string) => void;
}) {
  return (
    <div className="dashboard-grid">
      <article className="panel queue">
        <div className="panelhead">
          <div>
            <h3>AI 任务资源队列</h3>
            <p>跨模型资源池实时负载与任务吞吐</p>
          </div>
          <button onClick={() => open("任务队列详情")}>查看队列 →</button>
        </div>
        <div className="resource">
          <div className="ring">
            <strong>68%</strong>
            <small>综合负载</small>
          </div>
          <div className="meters">
            {[
              ["GPU 推理池", "76%"],
              ["语言模型池", "63%"],
              ["音视频处理池", "54%"],
              ["对象存储 I/O", "42%"],
            ].map((m) => (
              <div key={m[0]}>
                <span>
                  {m[0]}
                  <b>{m[1]}</b>
                </span>
                <i>
                  <em style={{ width: m[1] }} />
                </i>
              </div>
            ))}
          </div>
        </div>
        <div className="queuefoot">
          <span>
            <i className="green" />
            3,846 运行中
          </span>
          <span>
            <i className="blue" />
            236 排队中
          </span>
          <span>
            <i className="amber" />
            17 需人工
          </span>
        </div>
      </article>
      <article className="panel risk">
        <div className="panelhead">
          <div>
            <h3>区域合规风险</h3>
            <p>过去 24 小时规则命中</p>
          </div>
          <button onClick={() => open("区域策略")}>策略管理 →</button>
        </div>
        <div className="map">
          <div className="mapline l1" />
          <div className="mapline l2" />
          <button className="pin p1" title="北美 · 4 项">
            4
          </button>
          <button className="pin p2 hot" title="欧洲 · 11 项">
            11
          </button>
          <button className="pin p3" title="东南亚 · 3 项">
            3
          </button>
        </div>
        <div className="risklist">
          <span>
            欧洲<b>11 高风险</b>
          </span>
          <span>
            北美<b>4 待复核</b>
          </span>
          <span>
            东南亚<b>3 观察中</b>
          </span>
        </div>
      </article>
      <article className="panel audits">
        <div className="panelhead">
          <div>
            <h3>合作方审核队列</h3>
            <p>按 SLA 与风险优先级排序</p>
          </div>
          <em>12 项</em>
        </div>
        {[
          ["潮汐内容工作室", "资质复审", "1h 26m"],
          ["Nordlicht Studio", "成员权限异常", "2h 14m"],
          ["蓝鲸数字娱乐", "渠道扩展审核", "今天 18:00"],
        ].map((x, i) => (
          <button className="auditrow" key={x[0]} onClick={() => open(x[0])}>
            <i className={i === 0 ? "red" : ""}>{x[0][0]}</i>
            <span>
              <b>{x[0]}</b>
              <small>{x[1]}</small>
            </span>
            <em>{x[2]}</em>
          </button>
        ))}
      </article>
      <article className="panel trend">
        <div className="panelhead">
          <div>
            <h3>平台流量与收益</h3>
            <p>访问、任务与净收益趋势</p>
          </div>
          <div className="seg">
            {["7 天", "30 天", "90 天"].map((r) => (
              <button
                className={range === r ? "on" : ""}
                onClick={() => setRange(r)}
                key={r}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="chart">
          <div className="axis">
            <span>1.2M</span>
            <span>800K</span>
            <span>400K</span>
            <span>0</span>
          </div>
          <svg viewBox="0 0 760 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#6585ff" stopOpacity=".32" />
                <stop offset="1" stopColor="#6585ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="area"
              d="M0 150 C70 145 80 95 150 110 S250 80 305 92 S390 45 460 60 S560 20 610 46 S700 28 760 12 L760 180 L0 180Z"
            />
            <path
              className="line"
              d="M0 150 C70 145 80 95 150 110 S250 80 305 92 S390 45 460 60 S560 20 610 46 S700 28 760 12"
            />
          </svg>
          <div className="xaxis">
            <span>07-05</span>
            <span>07-12</span>
            <span>07-19</span>
            <span>07-26</span>
            <span>08-03</span>
          </div>
        </div>
      </article>
      <article className="panel activity">
        <div className="panelhead">
          <div>
            <h3>实时动态</h3>
            <p>平台关键操作与状态变化</p>
          </div>
        </div>
        {[
          ["13:42", "系统", "风险规则扫描完成"],
          ["13:31", "渠道", "YouTube 回执恢复"],
          ["13:18", "财务", "7 月账单批次生成"],
          ["12:56", "合作方", "新增成员 6 人"],
        ].map((a, i) => (
          <button key={a[0]} onClick={() => open(a[2])}>
            <time>{a[0]}</time>
            <i className={`c${i}`} />
            <span>
              <b>{a[1]}</b>
              <small>{a[2]}</small>
            </span>
          </button>
        ))}
      </article>
    </div>
  );
}

function Records({
  viewKey,
  active,
  tab,
  data,
  rows,
  onRowsChange,
  notify,
}: {
  viewKey: string;
  active: string;
  tab: number;
  data: TableView;
  rows: string[][];
  onRowsChange: (rows: string[][]) => void;
  notify: (s: string) => void;
}) {
  type FieldSpec = {
    label: string;
    type: "text" | "number" | "date" | "datetime-local" | "select";
    placeholder: string;
    options?: string[];
    required?: boolean;
  };
  const statusOptions: Record<string, string[]> = {
    partners: ["正常", "审核中", "限制中"],
    resources: ["启用", "运行中", "排队中", "降级", "异常"],
    risk: ["生效中", "待发布", "启用", "待复核", "已完成"],
    channels: ["正常", "观察中", "异常", "接入中"],
    billing: ["在售", "已支付", "待支付", "对账中", "提醒中", "可下载"],
    ops: ["健康", "部分降级", "异常", "已恢复"],
    settings: ["正常", "启用", "停用", "待发布"],
    overview: ["待接手", "处理中", "待处理", "已完成"],
  };
  const optionMap: Record<string, string[]> = {
    类型: ["内容制作方", "海外发行方", "渠道合作方", "技术服务商"],
    合作评级: ["S 级", "A 级", "B 级", "C 级"],
    角色: ["超级管理员", "制作方管理员", "项目管理员", "财务人员", "审计员"],
    权限范围: ["全局", "全部项目", "指定项目", "账单与结算", "只读"],
    风险结果: ["正常", "待复核", "高风险", "限制中"],
    能力类型: ["文本模型", "语音模型", "视频模型", "视觉模型"],
    健康度: ["健康", "观察中", "部分降级", "异常"],
    区域: ["全球", "中国大陆", "北美", "欧洲", "东南亚", "日本"],
    生命周期: ["永久", "30 天", "90 天", "180 天", "自动归档"],
    适用区域: ["全球", "中国大陆", "欧盟 27 国", "北美", "东南亚", "日本"],
    拦截方式: ["直接拦截", "审核 + 申诉", "年龄分级", "人工复核"],
    风险等级: ["低风险", "中风险", "高风险"],
    覆盖区域: ["全球", "中国大陆", "北美", "欧洲", "东南亚", "日本"],
    付款状态: ["待支付", "已支付", "对账中", "逾期"],
    生成方式: ["自动生成", "定时生成", "手动生成"],
    发送渠道: ["站内信", "邮件", "短信", "站内信 / 邮件", "邮件 / 短信"],
    语言版本: ["中文", "英文", "中英文", "中英德", "全部语种"],
    触发动作: ["记录日志", "二次验证", "自动冻结", "人工审批"],
    优先级: ["P0", "P1", "P2", "P3"],
    级别: ["低风险", "中风险", "高风险"],
  };
  const buildField = (header: string): FieldSpec => {
    const options =
      header === "状态" || header === "账号状态"
        ? (statusOptions[active] ?? ["正常", "启用", "停用"])
        : optionMap[header];
    if (options)
      return {
        label: header,
        type: "select",
        placeholder: `请选择${header}`,
        options,
        required: true,
      };
    if (/到期日|日期$|预计上线/.test(header))
      return {
        label: header,
        type: "date",
        placeholder: `请选择${header}`,
        required: true,
      };
    if (/完成时间|操作时间|触发时间|截止时间/.test(header))
      return {
        label: header,
        type: "datetime-local",
        placeholder: `请选择${header}`,
        required: true,
      };
    if (/成员$|规则数|命中次数|逾期天数|上线剧集|上线内容/.test(header))
      return {
        label: header,
        type: "number",
        placeholder: `请输入${header}`,
        required: true,
      };
    return {
      label: header,
      type: "text",
      placeholder: `请输入${header}`,
      required: true,
    };
  };
  const fields = data.headers.map(buildField);
  const recordName = recordLabel(meta[active].tabs[tab]);
  const [dialog, setDialog] = useState<{
    type: "view" | "create" | "edit" | "delete";
    index?: number;
  } | null>(null);
  const [draft, setDraft] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [exportConfirm, setExportConfirm] = useState(false);
  const [moreIndex, setMoreIndex] = useState<number | null>(null);
  const policy = exportPolicyFor(active, tab);
  useEffect(() => {
    setDialog(null);
    setDraft([]);
    setPage(1);
    setExportConfirm(false);
    setMoreIndex(null);
  }, [viewKey]);
  useEffect(() => {
    const closeMore = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".morewrap")) {
        setMoreIndex(null);
      }
    };
    document.addEventListener("mousedown", closeMore);
    return () => document.removeEventListener("mousedown", closeMore);
  }, []);
  const beginCreate = () => {
    setDraft(fields.map((field) => field.options?.[0] ?? ""));
    setDialog({ type: "create" });
  };
  const exportRecords = () => {
    const filename = meta[active].tabs[tab].replace(/[\\/:*?"<>|]/g, "-");
    if (policy === "snapshot") {
      downloadFile(
        JSON.stringify(
          {
            module: meta[active].title,
            view: meta[active].tabs[tab],
            exportedAt: new Date().toISOString(),
            fields: data.headers,
            records: rows.map((row) =>
              Object.fromEntries(
                data.headers.map((header, i) => [header, row[i]]),
              ),
            ),
          },
          null,
          2,
        ),
        `${filename}-配置快照.json`,
        "application/json;charset=utf-8",
      );
      notify("配置快照已下载");
      return;
    }
    const csv = [data.headers, ...rows]
      .map((row) => row.map((cell) => csvCell(String(cell ?? ""))).join(","))
      .join("\r\n");
    downloadFile(`\uFEFF${csv}`, `${filename}.csv`, "text/csv;charset=utf-8");
    notify(`已导出当前筛选结果，共 ${rows.length} 条`);
  };
  const requestExport = () => {
    if (policy === "restricted-csv") setExportConfirm(true);
    else exportRecords();
  };
  const exportSingleRow = (row: string[]) => {
    const csv = [data.headers, row]
      .map((line) => line.map((cell) => csvCell(String(cell ?? ""))).join(","))
      .join("\r\n");
    downloadFile(
      `\uFEFF${csv}`,
      `${meta[active].tabs[tab]}-${row[0]}.csv`,
      "text/csv;charset=utf-8",
    );
    setMoreIndex(null);
    notify("单条记录已导出");
  };
  const beginEdit = (index: number) => {
    setDraft([...rows[index]]);
    setDialog({ type: "edit", index });
  };
  const save = () => {
    if (fields.some((field, i) => field.required && !draft[i]?.trim())) {
      notify("请先完成所有必填项");
      return;
    }
    if (dialog?.type === "create") {
      onRowsChange([[...draft], ...rows]);
      notify("新增记录已保存");
    }
    if (dialog?.type === "edit" && dialog.index !== undefined) {
      const next = rows.map((row, i) =>
        i === dialog.index ? [...draft] : row,
      );
      onRowsChange(next);
      notify("记录修改已保存");
    }
    setDialog(null);
  };
  const remove = () => {
    if (dialog?.index === undefined) return;
    const name = rows[dialog.index][0];
    onRowsChange(rows.filter((_, i) => i !== dialog.index));
    setDialog(null);
    notify(`${name} 已删除`);
  };
  return (
    <>
      <div className="records">
        <div className="recordhead">
          <div>
            <h3>{meta[active].tabs[tab]}</h3>
            <p>
              当前筛选共 {rows.length} 条 · {data.hint}
            </p>
          </div>
          <div className="recordactions">
            <button className="ghost" onClick={requestExport}>
              {policy === "snapshot" ? "导出配置快照" : "导出 CSV"}
            </button>
            <button
              className="ghost"
              onClick={() => notify(`${data.action}操作已创建`)}
            >
              {data.action}
            </button>
            <button className="primary" onClick={beginCreate}>
              ＋ 新增{recordName || "记录"}
            </button>
          </div>
        </div>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                {[...data.headers, "操作"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${active}-${tab}-${i}-${r[0]}`}>
                  {r.map((c, j) => (
                    <td key={j}>
                      {j === 0 ? (
                        <>
                          <b>{c}</b>
                          <small>
                            {active.toUpperCase()}-
                            {String(tab + 1).padStart(2, "0")}-
                            {String(i + 21).padStart(3, "0")}
                          </small>
                        </>
                      ) : j === 4 || j === 3 ? (
                        <span
                          className={`tag ${/限制|异常|高风险|需人工|待复核|退回|逾期|降级/.test(c) ? "danger" : ""}`}
                        >
                          {c}
                        </span>
                      ) : (
                        c
                      )}
                    </td>
                  ))}
                  <td className="rowactions">
                    <button
                      onClick={() => setDialog({ type: "view", index: i })}
                    >
                      查看
                    </button>
                    <button onClick={() => beginEdit(i)}>编辑</button>
                    <button
                      className="deletebtn"
                      onClick={() => setDialog({ type: "delete", index: i })}
                    >
                      删除
                    </button>
                    <span className="morewrap">
                      <button
                        aria-label={`${r[0]} 更多操作`}
                        aria-expanded={moreIndex === i}
                        onClick={() => setMoreIndex(moreIndex === i ? null : i)}
                      >
                        •••
                      </button>
                      {moreIndex === i && (
                        <span
                          className={`moremenu ${i >= rows.length - 2 ? "up" : ""}`}
                        >
                          <button
                            onClick={() => {
                              navigator.clipboard
                                ?.writeText(r[0])
                                .catch(() => undefined);
                              setMoreIndex(null);
                              notify(`${r[0]} 已复制`);
                            }}
                          >
                            <i>⧉</i>复制记录编号
                          </button>
                          <button
                            onClick={() => {
                              setDialog({ type: "view", index: i });
                              setMoreIndex(null);
                            }}
                          >
                            <i>↗</i>查看关联详情
                          </button>
                          <button onClick={() => exportSingleRow(r)}>
                            <i>↓</i>导出单条 CSV
                          </button>
                          <button
                            onClick={() => {
                              setMoreIndex(null);
                              notify(`${r[0]} 已加入关注列表`);
                            }}
                          >
                            <i>☆</i>标记关注
                          </button>
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>每页 20 条 · 当前 {rows.length} 条</span>
          <button onClick={() => setPage(Math.max(1, page - 1))}>‹</button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={page === p ? "current" : ""}
              onClick={() => {
                setPage(p);
                notify(`已切换到第 ${p} 页`);
              }}
            >
              {p}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(3, page + 1))}>›</button>
        </div>
      </div>
      {dialog && (
        <div className="crudoverlay" onMouseDown={() => setDialog(null)}>
          <section
            className="crudmodal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header>
              <div>
                <small>
                  {dialog.type === "view"
                    ? "记录详情"
                    : dialog.type === "create"
                      ? `新增${recordName || "记录"}`
                      : dialog.type === "edit"
                        ? "编辑记录"
                        : "删除确认"}
                </small>
                <h2>
                  {dialog.type === "create"
                    ? meta[active].tabs[tab]
                    : dialog.index !== undefined
                      ? rows[dialog.index]?.[0]
                      : ""}
                </h2>
              </div>
              <button aria-label="关闭" onClick={() => setDialog(null)}>
                ×
              </button>
            </header>
            {dialog.type === "delete" ? (
              <div className="deleteconfirm">
                <div className="warnicon">!</div>
                <h3>确认删除这条记录？</h3>
                <p>
                  “{dialog.index !== undefined ? rows[dialog.index]?.[0] : ""}
                  ”删除后将从当前列表移除。本次操作会写入审计日志。
                </p>
              </div>
            ) : (
              <div className="crudfields">
                {fields.map((field, i) => {
                  const value =
                    dialog.type === "view"
                      ? dialog.index !== undefined
                        ? (rows[dialog.index]?.[i] ?? "")
                        : ""
                      : (draft[i] ?? "");
                  const update = (next: string) =>
                    setDraft((prev) =>
                      prev.map((v, j) => (j === i ? next : v)),
                    );
                  return (
                    <label key={`${viewKey}-${field.label}`}>
                      <span>
                        {field.label}
                        {field.required && dialog.type !== "view" && <em>*</em>}
                      </span>
                      {field.type === "select" ? (
                        <select
                          value={value}
                          disabled={dialog.type === "view"}
                          onChange={(e) => update(e.target.value)}
                        >
                          {field.options?.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={dialog.type === "create" ? field.type : "text"}
                          value={value}
                          placeholder={field.placeholder}
                          readOnly={dialog.type === "view"}
                          required={field.required}
                          min={field.type === "number" ? 0 : undefined}
                          onChange={(e) => update(e.target.value)}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            )}
            <footer>
              <button className="ghost" onClick={() => setDialog(null)}>
                {dialog.type === "view" ? "关闭" : "取消"}
              </button>
              {dialog.type === "delete" ? (
                <button className="dangerbtn" onClick={remove}>
                  确认删除
                </button>
              ) : dialog.type !== "view" ? (
                <button className="primary" onClick={save}>
                  保存记录
                </button>
              ) : null}
            </footer>
          </section>
        </div>
      )}
      {exportConfirm && (
        <div
          className="crudoverlay"
          onMouseDown={() => setExportConfirm(false)}
        >
          <section
            className="crudmodal exportmodal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header>
              <div>
                <small>受控数据导出</small>
                <h2>确认导出 {meta[active].tabs[tab]}？</h2>
              </div>
              <button aria-label="关闭" onClick={() => setExportConfirm(false)}>
                ×
              </button>
            </header>
            <div className="exportnotice">
              <span>盾</span>
              <div>
                <b>本次导出将写入安全审计日志</b>
                <p>
                  CSV
                  仅包含当前筛选结果；密钥、Token、存储凭证及完整个人联系方式不会写入文件。
                </p>
              </div>
            </div>
            <div className="exportsummary">
              <span>
                导出格式<strong>CSV UTF-8</strong>
              </span>
              <span>
                数据范围<strong>当前筛选 · {rows.length} 条</strong>
              </span>
              <span>
                安全处理<strong>敏感字段已排除</strong>
              </span>
            </div>
            <footer>
              <button className="ghost" onClick={() => setExportConfirm(false)}>
                取消
              </button>
              <button
                className="primary"
                onClick={() => {
                  setExportConfirm(false);
                  exportRecords();
                }}
              >
                确认并下载
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
