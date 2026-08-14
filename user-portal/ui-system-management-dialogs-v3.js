(()=>{
'use strict';
const ROOT='octopusSystemManagementDialog',STYLE='octopus-system-management-dialogs-v3',LANG='octopus-user-v7-language';
const route=()=>location.hash.replace(/^#\/?/,'').replaceAll('/','.')||'overview';
const en=()=>localStorage.getItem(LANG)==='en'||String(document.documentElement.lang||'').toLowerCase().startsWith('en');
const tx=(z,e)=>en()?e:z;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const normalize=s=>clean(s).replace(/\s+/g,'').toLowerCase();
const isAction=(raw,kind)=>{
 const x=normalize(raw);
 const map={account:['编辑账号','editaccount','editchannel'],api:['管理api密钥','apimanagement','manageapikey','manageapicredentials'],logs:['查看日志','viewlogs','viewlog'],retry:['重试任务','retrytask','retry']};
 return map[kind].some(v=>x.includes(normalize(v)));
};
function style(){let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.head.appendChild(s)}s.textContent=`
#${ROOT}{position:fixed;inset:0;z-index:52000;display:grid;place-items:center;padding:22px;background:rgba(2,8,18,.68);backdrop-filter:blur(5px)}
#${ROOT} .smd-shell{width:min(1040px,96vw);max-height:92vh;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--line);border-radius:17px;background:var(--panel);box-shadow:0 34px 110px rgba(0,0,0,.48)}
#${ROOT} .smd-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:18px 20px;border-bottom:1px solid var(--line)}
#${ROOT} .smd-head h2{margin:0;color:var(--text);font-size:16px;line-height:1.3}#${ROOT} .smd-head p{margin:6px 0 0;color:var(--soft);font-size:9px;line-height:1.55}
#${ROOT} .smd-close{display:grid;place-items:center;width:34px;height:34px;padding:0;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);font-size:18px;cursor:pointer}
#${ROOT} .smd-body{overflow:auto;padding:18px 20px 22px}
#${ROOT} .smd-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:16px}
#${ROOT} .smd-summary-card{min-height:62px;padding:11px 12px;border:1px solid var(--line);border-radius:10px;background:var(--panel2)}
#${ROOT} .smd-summary-card span{display:block;color:var(--soft);font-size:7.5px}#${ROOT} .smd-summary-card b{display:block;margin-top:7px;color:var(--text);font-size:9px;line-height:1.45;word-break:break-word}
#${ROOT} .smd-section{margin-top:14px;padding:14px;border:1px solid var(--line);border-radius:12px;background:color-mix(in srgb,var(--panel2) 56%,var(--panel))}
#${ROOT} .smd-section:first-child{margin-top:0}#${ROOT} .smd-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}#${ROOT} .smd-section-head h3{margin:0;color:var(--text);font-size:11px}#${ROOT} .smd-section-head p{margin:4px 0 0;color:var(--soft);font-size:8px;line-height:1.5}
#${ROOT} .smd-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}#${ROOT} .smd-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}
#${ROOT} .smd-field{display:grid;gap:7px;color:var(--soft);font-size:8px;font-weight:700}#${ROOT} .smd-field.full{grid-column:1/-1}
#${ROOT} .smd-field input,#${ROOT} .smd-field select,#${ROOT} .smd-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--text);outline:0;font:9px/1.5 system-ui}#${ROOT} .smd-field input,#${ROOT} .smd-field select{height:39px;padding:0 10px}#${ROOT} .smd-field textarea{min-height:78px;padding:10px;resize:vertical}
#${ROOT} .smd-inline{display:flex;align-items:center;gap:8px;flex-wrap:wrap}#${ROOT} .smd-chip{display:inline-flex;align-items:center;min-height:26px;padding:0 9px;border:1px solid var(--line);border-radius:999px;background:var(--panel);color:var(--soft);font-size:8px}#${ROOT} .smd-chip.ok{color:#65d6b2}#${ROOT} .smd-chip.warn{color:#f6c466}#${ROOT} .smd-chip.bad{color:#ff8798}
#${ROOT} .smd-state{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 12px;border:1px solid color-mix(in srgb,#6683df 30%,var(--line));border-radius:10px;background:color-mix(in srgb,#6683df 7%,var(--panel));font-size:8px}#${ROOT} .smd-state b{display:block;color:var(--text);font-size:9px}#${ROOT} .smd-state span{display:block;margin-top:4px;color:var(--soft);line-height:1.5}
#${ROOT} .smd-timeline{display:grid;gap:0}#${ROOT} .smd-step{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:10px;padding:10px 0;border-bottom:1px solid var(--line)}#${ROOT} .smd-step:last-child{border-bottom:0}#${ROOT} .smd-dot{display:grid;place-items:center;width:18px;height:18px;border-radius:50%;background:color-mix(in srgb,#6683df 14%,var(--panel));color:#91a8ff;font-size:7px;font-weight:800}#${ROOT} .smd-step.ok .smd-dot{background:color-mix(in srgb,#65d6b2 16%,var(--panel));color:#65d6b2}#${ROOT} .smd-step.bad .smd-dot{background:color-mix(in srgb,#ff8798 15%,var(--panel));color:#ff8798}#${ROOT} .smd-step b{display:block;color:var(--text);font-size:9px}#${ROOT} .smd-step small{display:block;margin-top:4px;color:var(--soft);font-size:8px;line-height:1.5}#${ROOT} .smd-step time{color:var(--muted);font-size:7px;white-space:nowrap}
#${ROOT} .smd-code{margin:0;max-height:180px;overflow:auto;padding:12px;border:1px solid var(--line);border-radius:9px;background:var(--bg);color:var(--soft);font:8px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-word}
#${ROOT} .smd-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#${ROOT} .smd-check{display:flex;align-items:flex-start;gap:8px;padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--soft);font-size:8px;line-height:1.5}#${ROOT} .smd-check input{width:14px;height:14px;margin:1px 0 0;accent-color:#6683df}
#${ROOT} .smd-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 20px;border-top:1px solid var(--line)}#${ROOT} .smd-foot-left,#${ROOT} .smd-foot-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#${ROOT} .smd-btn{display:inline-flex;align-items:center;justify-content:center;height:35px;padding:0 13px;border:1px solid var(--line);border-radius:9px;background:var(--panel2);color:var(--text);font-size:8.5px;font-weight:750;cursor:pointer;white-space:nowrap}#${ROOT} .smd-btn.primary{border-color:#6683df;background:#6683df;color:#fff}#${ROOT} .smd-btn.danger{border-color:color-mix(in srgb,#ff8798 50%,var(--line));color:#ff9baa}#${ROOT} .smd-btn:disabled{opacity:.48;cursor:not-allowed}
html.octopus-light #${ROOT}{background:rgba(25,34,45,.22)}html.octopus-light #${ROOT} .smd-shell{box-shadow:0 28px 90px rgba(31,41,55,.18)}
@media(max-width:820px){#${ROOT}{padding:10px}#${ROOT} .smd-summary,#${ROOT} .smd-grid,#${ROOT} .smd-grid.three,#${ROOT} .smd-checks{grid-template-columns:1fr}#${ROOT} .smd-field.full{grid-column:auto}#${ROOT} .smd-foot{align-items:stretch;flex-direction:column}#${ROOT} .smd-foot-left,#${ROOT} .smd-foot-right{width:100%}#${ROOT} .smd-btn{flex:1}}
`}
}
function rowInfo(button){
 const tr=button?.closest?.('tr'),table=tr?.closest?.('table');
 const headers=table?[...table.querySelectorAll('thead th')].map(x=>clean(x.textContent)):[];
 const values=tr?[...tr.cells].map(x=>clean(x.textContent)):[];
 const pairs={};headers.forEach((h,i)=>pairs[h]=values[i]||'');
 return {headers,values,pairs,primary:values[0]||clean(button?.closest?.('tr')?.textContent)||tx('当前记录','Current record')};
}
function val(info,rx,fallback){const key=Object.keys(info.pairs||{}).find(k=>rx.test(k));return key?info.pairs[key]||fallback:fallback}
function baseSummary(info,kind){
 if(kind==='account')return [[tx('频道账号','Channel account'),info.primary],[tx('平台','Platform'),val(info,/平台|Platform/i,'TikTok')],[tx('地区 / 语种','Region / language'),val(info,/地区|语种|Region|Language/i,tx('北美 · 英语','North America · English'))],[tx('当前状态','Status'),val(info,/状态|Status/i,tx('正常','Active'))]];
 if(kind==='api')return [[tx('频道账号','Channel account'),info.primary],[tx('平台 API','Platform API'),val(info,/平台|Platform/i,'TikTok Content Posting API')],[tx('授权状态','Authorization'),tx('已配置 · 待轮换','Configured · rotation due')],[tx('最近检测','Last check'),'2026-08-13 16:42']];
 return [[tx('任务 ID','Task ID'),val(info,/任务.?ID|Task.?ID/i,'JOB-20260813-1842')],[tx('任务类型','Task type'),val(info,/类型|Task type/i,tx('频道上传','Channel upload'))],[tx('目标频道','Target channel'),val(info,/频道|Channel/i,'TK-US Drama')],[tx('当前状态','Status'),val(info,/状态|Status/i,kind==='retry'?tx('失败 · 可重试','Failed · retryable'):tx('执行失败','Failed'))]];
}
const summaryHtml=data=>`<div class="smd-summary">${data.map(([a,b])=>`<div class="smd-summary-card"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('')}</div>`;
function field(label,html,full=false){return `<label class="smd-field${full?' full':''}"><span>${esc(label)}</span>${html}</label>`}
function accountBody(info){
 const platform=val(info,/平台|Platform/i,'TikTok'),account=info.primary,region=val(info,/地区|Region/i,tx('北美','North America')),language=val(info,/语种|Language/i,tx('英语','English')),owner=val(info,/负责人|Owner/i,'Suzy Wang');
 return `${summaryHtml(baseSummary(info,'account'))}
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('账号基础信息','Account basics')}</h3><p>${tx('维护平台账号、地区语种和责任归属。','Maintain platform identity, market and ownership.')}</p></div><span class="smd-chip ok">${tx('账号可用','Account active')}</span></div><div class="smd-grid three">
 ${field(tx('频道账号名称','Channel name'),`<input data-smd-field="name" value="${esc(account)}">`)}
 ${field(tx('平台','Platform'),`<select data-smd-field="platform"><option${platform.includes('TikTok')?' selected':''}>TikTok</option><option${platform.includes('YouTube')?' selected':''}>YouTube</option><option>Facebook</option><option>Instagram</option></select>`)}
 ${field(tx('平台账号 ID / Handle','Platform ID / handle'),`<input data-smd-field="handle" value="${esc(val(info,/账号.?ID|Handle/i,'@'+account.replace(/\s+/g,'').toLowerCase()))}">`)}
 ${field(tx('地区','Region'),`<select data-smd-field="region"><option>${esc(region)}</option><option>${tx('北美','North America')}</option><option>${tx('拉美','Latin America')}</option><option>${tx('全球','Global')}</option></select>`)}
 ${field(tx('默认语种','Default language'),`<select data-smd-field="language"><option>${esc(language)}</option><option>${tx('英语','English')}</option><option>${tx('西班牙语','Spanish')}</option><option>${tx('阿拉伯语','Arabic')}</option></select>`)}
 ${field(tx('负责人','Owner'),`<select data-smd-field="owner"><option>${esc(owner)}</option><option>Mia Chen</option><option>Leo Meyer</option><option>Suzy Wang</option></select>`)}
 ${field(tx('账号状态','Account status'),`<select data-smd-field="status"><option>${tx('启用','Enabled')}</option><option>${tx('暂停分发','Pause distribution')}</option><option>${tx('只读观察','Read-only')}</option><option>${tx('归档','Archived')}</option></select>`)}
 ${field(tx('平台授权','Platform authorization'),`<select data-smd-field="auth"><option>${tx('已授权','Authorized')}</option><option>${tx('待重新授权','Reauthorization required')}</option><option>${tx('未连接','Not connected')}</option></select>`)}
 ${field(tx('风格模板','Style template'),`<select data-smd-field="style"><option>Drama High CTR V4</option><option>Romance Soft V2</option><option>Suspense Dark V3</option></select>`)}
 </div></section>
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('发布与内容策略','Publishing & content policy')}</h3><p>${tx('定义默认发布模式、时段、频次与内容限制。','Set default publishing mode, schedule, cadence and content rules.')}</p></div></div><div class="smd-grid three">
 ${field(tx('默认发布方式','Default publishing mode'),`<select data-smd-field="publishMode"><option>API ${tx('直传','direct publish')}</option><option>${tx('上传草稿后人工发布','Upload draft, publish manually')}</option><option>${tx('仅人工上传','Manual upload only')}</option></select>`)}
 ${field(tx('默认发布时间','Default publish time'),`<input data-smd-field="publishTime" type="time" value="18:00">`)}
 ${field(tx('发布频率','Publishing cadence'),`<select data-smd-field="cadence"><option>${tx('每天 3 条','3 posts / day')}</option><option>${tx('每天 2 条','2 posts / day')}</option><option>${tx('每周 10 条','10 posts / week')}</option></select>`)}
 ${field(tx('标题策略','Title policy'),`<select data-smd-field="titlePolicy"><option>${tx('身份反转 + 强冲突 + 结果悬念','Identity reveal + conflict + suspense')}</option><option>${tx('情绪钩子 + 关系冲突','Emotion hook + relationship conflict')}</option></select>`)}
 ${field(tx('封面策略','Cover policy'),`<select data-smd-field="coverPolicy"><option>${tx('人物强对峙 / 高对比','Character confrontation / high contrast')}</option><option>${tx('人物特写 / 留白标题区','Close-up / title safe area')}</option></select>`)}
 ${field(tx('水印策略','Watermark policy'),`<select data-smd-field="watermark"><option>${tx('频道标准水印','Channel standard watermark')}</option><option>${tx('无水印','No watermark')}</option><option>${tx('按物料包配置','Use package setting')}</option></select>`)}
 ${field(tx('频道内容策略','Channel content policy'),`<textarea data-smd-field="policy">${tx('优先发行身份反转、豪门复仇和强冲突短剧；避免高度重复封面，标题需通过历史冲突检测。','Prioritize identity-reveal, revenge and high-conflict series. Avoid repetitive covers and require title conflict checks.')}</textarea>`,true)}
 ${field(tx('风险与发布限制','Risk & publishing restrictions'),`<textarea data-smd-field="risk">${tx('版权材料不完整、平台安全区冲突或敏感词未通过时禁止自动发布。','Block auto-publishing when rights evidence is incomplete, safe zones conflict, or sensitive-word checks fail.')}</textarea>`,true)}
 </div></section>
 <section class="smd-section"><div class="smd-state"><div><b>${tx('平台连接状态','Platform connection')}</b><span>${tx('最近同步 4 分钟前 · API 延迟 142 ms · 上传权限正常','Last sync 4 min ago · API latency 142 ms · upload scope healthy')}</span></div><div class="smd-inline"><span class="smd-chip ok">OAuth 2.0</span><span class="smd-chip ok">${tx('可发布','Publish ready')}</span></div></div></section>`;
}
function apiBody(info){
 return `${summaryHtml(baseSummary(info,'api'))}
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('API 与授权配置','API & authorization')}</h3><p>${tx('密钥原文不写入浏览器存储，仅记录是否已配置。','Secret values are never stored in browser storage; only configuration state is kept.')}</p></div><span class="smd-chip warn">${tx('98 天后到期','Expires in 98 days')}</span></div><div class="smd-grid">
 ${field(tx('平台 API','Platform API'),`<select data-smd-field="apiPlatform"><option>TikTok Content Posting API</option><option>YouTube Data API v3</option><option>Meta Graph API</option></select>`)}
 ${field(tx('授权模式','Authorization mode'),`<select data-smd-field="authMode"><option>OAuth 2.0</option><option>${tx('系统服务账号','System service account')}</option></select>`)}
 ${field('OAuth Client ID',`<input data-smd-field="clientId" value="oct_prod_${Math.random().toString(36).slice(2,10)}">`,true)}
 ${field('Client Secret',`<input data-smd-field="secret" type="password" placeholder="••••••••••••••••">`,true)}
 ${field(tx('回调地址','Callback URL'),`<input data-smd-field="callback" value="https://api.octopus.example.com/oauth/callback">`,true)}
 ${field(tx('授权范围 Scopes','Scopes'),`<textarea data-smd-field="scopes">video.upload, video.publish, analytics.read, account.read</textarea>`,true)}
 </div></section>
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('Token 生命周期与轮换','Token lifecycle & rotation')}</h3><p>${tx('控制到期提醒、轮换频率、Webhook 和失败告警。','Control expiration alerts, rotation cadence, webhook and failure notifications.')}</p></div></div><div class="smd-grid three">
 ${field(tx('Access Token 状态','Access token status'),`<input value="${tx('已配置 · 已加密保存于后端','Configured · encrypted on backend')}" readonly>`)}
 ${field(tx('到期时间','Expiration'),`<input type="date" data-smd-field="expires" value="2026-11-19">`)}
 ${field(tx('到期提醒','Expiration alert'),`<select data-smd-field="reminder"><option>${tx('提前 30 天','30 days before')}</option><option>${tx('提前 14 天','14 days before')}</option><option>${tx('提前 7 天','7 days before')}</option></select>`)}
 ${field(tx('自动轮换策略','Rotation policy'),`<select data-smd-field="rotation"><option>${tx('到期前 14 天自动轮换','Auto-rotate 14 days before expiry')}</option><option>${tx('仅提醒，人工轮换','Notify only, manual rotation')}</option></select>`)}
 ${field('Webhook URL',`<input data-smd-field="webhook" value="https://api.octopus.example.com/channel/events">`)}
 ${field(tx('平台限流策略','Rate-limit strategy'),`<select data-smd-field="rateLimit"><option>${tx('指数退避 + 分批上传','Exponential backoff + batched upload')}</option><option>${tx('固定 60 秒重试','Retry every 60 seconds')}</option></select>`)}
 </div></section>
 <section class="smd-section"><div class="smd-state"><div><b>${tx('真实连通性检查','Live connectivity')}</b><span data-smd-api-state>${tx('最近测试：正常 · 142 ms · 上传、发布、数据读取权限均通过','Last test: healthy · 142 ms · upload, publish and analytics scopes passed')}</span></div><button type="button" class="smd-btn" data-smd-action="test-api">${tx('重新测试','Test again')}</button></div></section>
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('安全策略','Security policy')}</h3><p>${tx('生产环境建议只允许后端访问密钥，并保留审计记录。','Production credentials should be backend-only with complete audit logs.')}</p></div></div><div class="smd-checks"><label class="smd-check"><input type="checkbox" checked data-smd-field="backendOnly"><span>${tx('密钥只允许后端读取，前端永不回显原文','Backend-only secret access; never reveal plaintext in the client')}</span></label><label class="smd-check"><input type="checkbox" checked data-smd-field="audit"><span>${tx('每次轮换、测试和授权范围变更写入审计日志','Audit every rotation, connectivity test and scope change')}</span></label><label class="smd-check"><input type="checkbox" checked data-smd-field="approval"><span>${tx('变更 Client Secret 需要管理员二次确认','Admin approval required for Client Secret changes')}</span></label><label class="smd-check"><input type="checkbox" checked data-smd-field="ip"><span>${tx('生产 API 调用限制在允许的服务端 IP 范围','Restrict production API calls to allowed backend IP ranges')}</span></label></div></section>`;
}
function logsBody(info){
 const requestId=val(info,/请求.?ID|Request.?ID/i,'req_20260813_1842_a7f9'),taskId=val(info,/任务.?ID|Task.?ID/i,'JOB-20260813-1842');
 const response={request_id:requestId,platform:'TikTok',endpoint:'/v2/post/publish',http_status:429,error_code:'rate_limit_exceeded',message:'Too many requests in current quota window',retry_after_seconds:60,trace_id:'trc_82a7c19d'};
 return `${summaryHtml(baseSummary(info,'logs'))}
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('执行时间线','Execution timeline')}</h3><p>${tx('展示任务从入队到失败的完整节点。','Full execution path from queueing to failure.')}</p></div><span class="smd-chip bad">${tx('失败节点：平台发布','Failed at platform publish')}</span></div><div class="smd-timeline">
 <div class="smd-step ok"><span class="smd-dot">1</span><div><b>${tx('任务入队','Queued')}</b><small>${tx('校验剧集、频道、语种和审核物料包映射','Validated series, channel, language and approved package mapping')}</small></div><time>16:38:02</time></div>
 <div class="smd-step ok"><span class="smd-dot">2</span><div><b>${tx('生成上传负载','Payload prepared')}</b><small>${tx('标题、封面、水印、字幕和平台参数准备完成','Title, cover, watermark, subtitles and platform parameters prepared')}</small></div><time>16:38:04</time></div>
 <div class="smd-step ok"><span class="smd-dot">3</span><div><b>${tx('分片上传完成','Chunk upload complete')}</b><small>${tx('视频文件上传成功，共 8 个分片','Video uploaded successfully in 8 chunks')}</small></div><time>16:40:51</time></div>
 <div class="smd-step bad"><span class="smd-dot">4</span><div><b>${tx('平台发布失败','Platform publish failed')}</b><small>HTTP 429 · rate_limit_exceeded · retry-after 60s</small></div><time>16:41:07</time></div>
 <div class="smd-step"><span class="smd-dot">5</span><div><b>${tx('进入重试队列','Moved to retry queue')}</b><small>${tx('自动重试暂停，等待人工确认重试策略','Automatic retry paused pending manual retry policy confirmation')}</small></div><time>16:41:08</time></div>
 </div></section>
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('请求与平台响应','Request & platform response')}</h3><p>${tx('用于排查平台 API 错误、限流和授权问题。','Use this to diagnose API errors, rate limits and authorization failures.')}</p></div><div class="smd-inline"><span class="smd-chip">${esc(requestId)}</span><button type="button" class="smd-btn" data-smd-action="copy-request" data-smd-request="${esc(requestId)}">${tx('复制请求 ID','Copy request ID')}</button></div></div><pre class="smd-code">${esc(JSON.stringify(response,null,2))}</pre></section>
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('运行参数','Runtime parameters')}</h3><p>${tx('本次任务实际执行时使用的关键参数。','Key parameters used by this task run.')}</p></div></div><div class="smd-grid three">
 ${field(tx('任务优先级','Priority'),'<input value="P1 · High" readonly>')}${field(tx('最大重试次数','Max retries'),'<input value="3" readonly>')}${field(tx('当前重试次数','Retry attempts'),'<input value="1" readonly>')}${field(tx('上传并发','Upload concurrency'),'<input value="3" readonly>')}${field(tx('请求超时','Request timeout'),'<input value="90s" readonly>')}${field(tx('退避策略','Backoff'),'<input value="Exponential · 60/120/240s" readonly>')}
 </div></section>
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('重试记录','Retry history')}</h3><p>${tx('保留自动与人工重试轨迹。','History of automatic and manual retry attempts.')}</p></div></div><div class="smd-timeline"><div class="smd-step bad"><span class="smd-dot">1</span><div><b>${tx('自动重试 #1','Auto retry #1')}</b><small>HTTP 429 · rate_limit_exceeded</small></div><time>16:42:09</time></div><div class="smd-step"><span class="smd-dot">2</span><div><b>${tx('人工重试','Manual retry')}</b><small>${tx('尚未执行','Not started')}</small></div><time>—</time></div></div></section>`;
}
function retryBody(info){
 return `${summaryHtml(baseSummary(info,'retry'))}
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('失败诊断','Failure diagnosis')}</h3><p>${tx('系统已识别失败节点，默认保留成功步骤，只重试失败后的链路。','The failed node is identified. Successful steps are preserved by default.')}</p></div><span class="smd-chip bad">HTTP 429 · rate_limit_exceeded</span></div><div class="smd-state"><div><b>${tx('建议重试策略','Recommended retry strategy')}</b><span>${tx('等待平台限流窗口恢复后，从“平台发布”节点继续，不重复上传视频分片。','Wait for the rate-limit window to recover, then resume at Platform Publish without re-uploading video chunks.')}</span></div><span class="smd-chip warn">${tx('建议 60 秒后','In 60 sec')}</span></div></section>
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('重试配置','Retry configuration')}</h3><p>${tx('确认范围、优先级、次数和执行时间。','Confirm scope, priority, retry count and execution time.')}</p></div></div><div class="smd-grid three">
 ${field(tx('失败节点','Failed node'),`<select data-smd-field="failedNode"><option>${tx('平台发布','Platform publish')}</option><option>${tx('分片上传','Chunk upload')}</option><option>${tx('发布前校验','Pre-publish validation')}</option></select>`)}
 ${field(tx('重试范围','Retry scope'),`<select data-smd-field="scope"><option>${tx('从失败节点继续','Resume from failed node')}</option><option>${tx('仅重试当前节点','Retry current node only')}</option><option>${tx('从头重新执行','Restart entire task')}</option></select>`)}
 ${field(tx('任务优先级','Priority'),`<select data-smd-field="priority"><option>P1 · High</option><option>P2 · Normal</option><option>P3 · Low</option></select>`)}
 ${field(tx('最大重试次数','Max retries'),`<select data-smd-field="maxRetries"><option>3</option><option>5</option><option>1</option></select>`)}
 ${field(tx('延迟策略','Delay strategy'),`<select data-smd-field="backoff"><option>${tx('指数退避 60 / 120 / 240 秒','Exponential 60 / 120 / 240 sec')}</option><option>${tx('固定 60 秒','Fixed 60 sec')}</option><option>${tx('立即重试','Retry immediately')}</option></select>`)}
 ${field(tx('计划执行时间','Scheduled time'),`<input data-smd-field="schedule" type="datetime-local">`)}
 ${field(tx('负责人','Owner'),`<select data-smd-field="owner"><option>Suzy Wang</option><option>Mia Chen</option><option>Leo Meyer</option></select>`)}
 ${field(tx('失败告警','Failure alert'),`<select data-smd-field="alert"><option>${tx('站内通知 + 邮件','In-app + email')}</option><option>${tx('仅站内通知','In-app only')}</option><option>${tx('站内通知 + Slack','In-app + Slack')}</option></select>`)}
 ${field(tx('重试标签','Retry label'),`<input data-smd-field="label" value="rate-limit-retry">`)}
 ${field(tx('重试备注','Retry note'),`<textarea data-smd-field="note">${tx('平台限流导致发布失败，保留已上传视频，从发布节点继续。','Platform rate limit caused publish failure. Keep uploaded video and resume at publish node.')}</textarea>`,true)}
 </div></section>
 <section class="smd-section"><div class="smd-section-head"><div><h3>${tx('执行规则','Execution rules')}</h3><p>${tx('避免重复执行已经成功的步骤。','Avoid repeating steps that already succeeded.')}</p></div></div><div class="smd-checks"><label class="smd-check"><input type="checkbox" checked data-smd-field="skipSuccess"><span>${tx('跳过已经成功的分片上传与校验节点','Skip already-successful upload and validation nodes')}</span></label><label class="smd-check"><input type="checkbox" checked data-smd-field="preservePayload"><span>${tx('保留原始标题、封面和发布参数','Preserve original title, cover and publish payload')}</span></label><label class="smd-check"><input type="checkbox" checked data-smd-field="abortOnAuth"><span>${tx('若检测到授权失效则终止重试并转人工处理','Abort and escalate if authorization has expired')}</span></label><label class="smd-check"><input type="checkbox" data-smd-field="force"><span>${tx('忽略限流建议强制立即执行（不推荐）','Force immediate execution despite rate-limit advice')}</span></label></div></section>`;
}
function titleFor(kind){return {account:tx('编辑频道账号','Edit channel account'),api:tx('管理 API 密钥','Manage API credentials'),logs:tx('任务运行日志','Task execution log'),retry:tx('重试异步任务','Retry async task')}[kind]}
function subFor(kind){return {account:tx('维护频道资料、内容策略、授权状态和发布规则。','Maintain channel profile, content policy, authorization and publishing rules.'),api:tx('管理平台授权、密钥生命周期、权限范围与真实连通性。','Manage platform auth, credential lifecycle, scopes and live connectivity.'),logs:tx('查看任务时间线、平台响应、运行参数和完整重试记录。','Inspect the execution timeline, platform response, runtime parameters and retry history.'),retry:tx('从失败节点安全恢复任务，避免重复上传或重复执行。','Safely resume from failure without duplicating uploads or completed work.')}[kind]}
function bodyFor(kind,info){return kind==='account'?accountBody(info):kind==='api'?apiBody(info):kind==='logs'?logsBody(info):retryBody(info)}
function footerFor(kind){
 if(kind==='logs')return `<div class="smd-foot-left"><button type="button" class="smd-btn" data-smd-action="download-log">${tx('下载完整日志','Download full log')}</button></div><div class="smd-foot-right"><button type="button" class="smd-btn primary" data-smd-action="close">${tx('关闭','Close')}</button></div>`;
 if(kind==='retry')return `<div class="smd-foot-left"><button type="button" class="smd-btn" data-smd-action="precheck">${tx('重新校验任务','Revalidate task')}</button></div><div class="smd-foot-right"><button type="button" class="smd-btn" data-smd-action="close">${tx('取消','Cancel')}</button><button type="button" class="smd-btn primary" data-smd-action="save-retry">${tx('确认并加入重试队列','Confirm retry')}</button></div>`;
 if(kind==='api')return `<div class="smd-foot-left"><button type="button" class="smd-btn" data-smd-action="rotate">${tx('创建密钥轮换任务','Create rotation task')}</button></div><div class="smd-foot-right"><button type="button" class="smd-btn" data-smd-action="close">${tx('取消','Cancel')}</button><button type="button" class="smd-btn primary" data-smd-action="save-api">${tx('保存 API 配置','Save API configuration')}</button></div>`;
 return `<div class="smd-foot-left"></div><div class="smd-foot-right"><button type="button" class="smd-btn" data-smd-action="close">${tx('取消','Cancel')}</button><button type="button" class="smd-btn primary" data-smd-action="save-account">${tx('保存账号配置','Save account')}</button></div>`;
}
function open(kind,button){
 style();close();const info=rowInfo(button);const host=document.createElement('div');host.id=ROOT;host.dataset.smdKind=kind;host.dataset.smdKey=info.primary;host.innerHTML=`<section class="smd-shell" role="dialog" aria-modal="true"><header class="smd-head"><div><h2>${esc(titleFor(kind))}</h2><p>${esc(subFor(kind))}</p></div><button type="button" class="smd-close" data-smd-action="close" aria-label="${tx('关闭','Close')}">×</button></header><div class="smd-body">${bodyFor(kind,info)}</div><footer class="smd-foot">${footerFor(kind)}</footer></section>`;document.body.appendChild(host);return true;
}
function close(){document.getElementById(ROOT)?.remove()}
function values(){const host=document.getElementById(ROOT),out={};host?.querySelectorAll('[data-smd-field]').forEach(x=>{const k=x.dataset.smdField;if(x.type==='checkbox')out[k]=x.checked;else if(k==='secret')out.secretConfigured=Boolean(x.value);else out[k]=x.value});return out}
function saveLocal(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function download(name,data){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function toast(msg){try{window.toast?.(msg)}catch{}}
function handleInternal(action,target){
 const host=document.getElementById(ROOT);if(!host)return false;
 if(action==='close'){close();return true}
 if(action==='save-account'){saveLocal('octopus-system-channel-account:'+host.dataset.smdKey,{...values(),updatedAt:new Date().toISOString()});toast(tx('频道账号配置已保存','Channel account saved'));close();return true}
 if(action==='save-api'){saveLocal('octopus-system-api-config:'+host.dataset.smdKey,{...values(),secret:undefined,updatedAt:new Date().toISOString()});toast(tx('API 配置已保存，密钥原文未写入浏览器存储','API settings saved; secret plaintext was not stored in the browser'));close();return true}
 if(action==='test-api'){const state=host.querySelector('[data-smd-api-state]');if(state){state.textContent=tx('正在测试 OAuth、上传、发布与数据权限…','Testing OAuth, upload, publish and analytics scopes…');setTimeout(()=>{if(document.body.contains(state))state.textContent=tx('测试通过 · 128 ms · 4/4 权限正常 · Token 有效','Passed · 128 ms · 4/4 scopes healthy · token valid')},700)}toast(tx('已发起连通性测试','Connectivity test started'));return true}
 if(action==='rotate'){toast(tx('已创建密钥轮换任务，需管理员确认后执行','Credential rotation task created; admin approval required'));return true}
 if(action==='copy-request'){const id=target?.dataset.smdRequest||'';navigator.clipboard?.writeText(id);toast(tx('请求 ID 已复制','Request ID copied'));return true}
 if(action==='download-log'){download('octopus-task-log.json',{task:host.dataset.smdKey,exportedAt:new Date().toISOString(),status:'failed',request_id:host.querySelector('[data-smd-request]')?.dataset.smdRequest||'req_20260813_1842_a7f9',timeline:['queued','payload_prepared','upload_complete','publish_failed','retry_pending'],error:{http_status:429,code:'rate_limit_exceeded'}});toast(tx('完整日志已下载','Full log downloaded'));return true}
 if(action==='precheck'){toast(tx('校验完成：授权有效、已上传视频可复用，建议从平台发布节点继续','Validation passed: auth is valid, uploaded video is reusable, resume at platform publish'));return true}
 if(action==='save-retry'){saveLocal('octopus-system-retry:'+host.dataset.smdKey,{...values(),status:'queued',createdAt:new Date().toISOString()});toast(tx('任务已加入重试队列','Task added to retry queue'));close();return true}
 return false;
}
function detectTrigger(button){if(!button)return null;const raw=[button.dataset?.octSystemAction,button.dataset?.a,button.getAttribute?.('aria-label'),button.title,button.textContent].filter(Boolean).join(' ');const r=route();if(r==='system.channels'){if(isAction(raw,'account'))return'account';if(isAction(raw,'api'))return'api'}if(r==='system.tasks'){if(isAction(raw,'logs'))return'logs';if(isAction(raw,'retry'))return'retry'}return null}
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(ROOT)){e.preventDefault();close()}},true);
window.OctopusSystemManagementDialogs={open,close,detectTrigger,handleInternal,version:'3.0'};
})();