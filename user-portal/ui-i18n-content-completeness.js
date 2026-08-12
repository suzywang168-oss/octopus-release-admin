(()=>{
  'use strict';

  const LANG_KEY='octopus-user-v7-language';
  const CJK=/[\u3400-\u9fff]/;
  const originals=new WeakMap();
  let applying=false,queued=false;

  const EN={
    '运营决策与风险处理':'Operational decisions and risk handling','素材入库与AI内容加工':'Asset intake and AI processing','物料生成与渠道分发':'Creative generation and distribution','效果监控与风险复盘':'Performance monitoring and risk review','平台底层支撑':'Platform infrastructure',
    '数据与投流判断潜力剧集':'Identify high-potential series from channel and ad data','上传、标签提炼、多语种译配':'Upload, tagging and localization','生成标题封面并人工审核':'Generate titles and covers with human review','频道校验、水印与API上传':'Channel checks, watermarking and API upload','效果复盘与禁播风险处理':'Performance review and ban-risk handling',
    '以“选品 → 内容加工 → 物料制作 → 渠道分发 → 监控迭代”为主线管理全部发行项目。':'Manage every distribution project through Selection → Processing → Creative → Distribution → Monitoring.','新建发行项目':'New distribution project',
    '多维查询观看次数、点击率、收入、留存与RPM，按标签推荐同类型剧集并输出选剧参考报告。':'Analyze views, CTR, revenue, retention and RPM, then recommend similar internal-library series by tag.','生成选剧参考报告':'Generate selection report',
    '抓取TK、FB、YT、INS投流素材，筛选片单内有效内容并输出剧集上线建议。':'Collect TikTok, Facebook, YouTube and Instagram ad creatives, match valid internal-library titles and produce launch recommendations.','新建抓取任务':'New crawl task',
    '自动检测禁播状态，汇总链接、片方、渠道与原因，并推动解禁工单闭环。':'Detect blocked content, consolidate links, partners, channels and causes, and drive unblock tickets to closure.','新建解禁工单':'New unblock ticket',
    '上传全剧素材，AI解析剧情亮点并生成频道、剧情、演员、人设、场景、地域与时代标签。':'Upload full-series assets and use AI to extract story highlights plus channel, plot, cast, character, scene, region and era tags.','上传剧集内容':'Upload series',
    '完成英语、西班牙语、阿拉伯语、俄语的翻译与配音，并执行素材去重检测。':'Translate and dub English, Spanish, Arabic and Russian versions with asset deduplication checks.','创建译配任务':'Create localization task',
    '理解剧情语义与爆点，一次输出3个不超过100字符的标题，适配频道风格并规避冲突。':'Generate three titles under 100 characters from story semantics and hooks, tailored to channel style with conflict checks.','批量生成标题':'Generate titles in batch',
    '提取视觉爆点，一次生成3张冲突感封面，匹配频道视觉风格并支持人工替换。':'Extract visual hooks and generate three high-conflict covers matched to channel style with manual replacement support.','批量生成封面':'Generate covers in batch',
    '在同一审核台预览标题与封面，完成采用、退回、修改与版本留痕。':'Review titles and covers in one workspace with approval, return, edit and version history.','进入批量审核':'Open batch review',
    '校验内容与频道匹配，完成水印压制、API直传与频道-剧集错配拦截。':'Validate series-channel matching, apply watermarks, upload by API and block channel-series mismatches.','新建分发任务':'New distribution task',
    '按剧集查看播放量、点击率、留存、RPM与收入表现。':'Review views, CTR, retention, RPM and revenue by series.','导出剧集报表':'Export series report',
    '查看频道账号收益、播放表现、健康状态与爆款剧集排行。':'Review channel revenue, viewing performance, account health and top-performing series.','导出频道报表':'Export channel report',
    '对比外部平台投流素材、投放热度与本平台剧集表现。':'Compare external paid-media creatives and heat with internal series performance.','生成对标报告':'Generate benchmark report',
    '集中查看禁播统计、解禁进度、渠道风险与预警趋势。':'Review block statistics, recovery progress, channel risk and alert trends in one place.','导出风险报告':'Export risk report',
    '维护TK、FB、YT、INS账号、API密钥、频道风格与标签配置。':'Manage TikTok, Facebook, YouTube and Instagram accounts, API credentials, channel styles and tag settings.','新增频道账号':'Add channel account',
    '统一管理短剧素材、版本记录与片方合作信息。':'Manage short-drama assets, version history and partner information in one place.','新增素材或片方':'Add asset or partner',
    '配置标题Prompt、封面风格、水印模板与标签体系。':'Configure title prompts, cover styles, watermark templates and tag systems.','新建AI模板':'New AI template','新建 AI 模板':'New AI template',
    '管理运营、内容与管理员角色的数据范围和操作权限。':'Manage data scope and operational permissions for operations, content and admin roles.','新增角色':'Add role',
    '统一查看译配、标题封面、批量上传任务及失败重试。':'Monitor localization, title/cover generation, bulk uploads and failed retries in one place.','查看失败任务':'View failed tasks',

    'AI洞察与建议':'AI Insights & Recommendations','实时更新':'Live','核心输出':'Primary Output','预览输出':'Preview output','导出':'Export','导出当前列表':'Export list','搜索当前列表':'Search current list','全部平台/类型':'All platforms / types','全部状态':'All statuses','共 8 条记录，每页 8 条':'8 records · 8 per page',
    '汇总当前数据、AI判断、人工选择与风险提示，形成可下载、可流转的业务结果。':'Combine current data, AI judgments, human choices and risk signals into a downloadable, shareable business output.',
    '业务架构':'Business architecture','5个一级模块 · 18个子模块':'5 primary modules · 18 submodules','今日决策提醒':'Today’s decision alerts','3部剧集达到上线建议阈值':'3 series reached the launch-recommendation threshold','6组物料等待审核':'6 creative sets are awaiting review','2个API密钥即将到期':'2 API credentials are expiring soon','4条禁播链接待补材料':'4 blocked links need supporting documents','俄语译配节点负载86%':'Russian localization node load is at 86%',
    '进行中发行项目':'Active distribution projects','今日待办':'Tasks today','本月上线剧集':'Series launched this month','风险工单':'Risk tickets',

    '近30天播放量':'30-day views','平均点击率':'Average CTR','平均RPM':'Average RPM','可推荐剧集':'Recommended series','今日抓取素材':'Creatives crawled today','片单有效命中':'Valid library matches','高潜上线建议':'High-potential launches','覆盖平台':'Platforms covered','当前禁播链接':'Blocked links','处理中工单':'Tickets in progress','本月恢复率':'Recovery rate this month','高风险频道':'High-risk channels','素材库剧集':'Series in library','AI标签完成':'AI tagging complete','待人工确认':'Awaiting review','存储占用':'Storage used','进行中任务':'Tasks in progress','平均完成时长':'Average completion time','去重风险命中':'Duplication flags','质检通过率':'QC pass rate','待生成剧集':'Series pending','今日生成标题':'Titles generated today','冲突拦截':'Conflicts blocked','平均字符数':'Average characters','今日生成封面':'Covers generated today','风格匹配率':'Style match rate','人工替换':'Manual replacements','待审核物料':'Creative pending review','今日通过':'Approved today','退回修改':'Returned for edits','平均审核时长':'Average review time','待分发任务':'Distribution tasks pending','API上传中':'API uploads in progress','错配拦截':'Mismatch blocks','渠道成功率':'Channel success rate','总播放量':'Total views','平均D7留存':'Average D7 retention','总收入':'Total revenue','活跃频道账号':'Active channel accounts','本月账号收益':'Channel revenue this month','爆款剧集':'Top series','账号健康率':'Account health rate','外部素材样本':'External creative samples','内部可对标剧集':'Internal benchmark series','高潜差距机会':'High-potential gaps','外部热度指数':'External heat index','本月禁播数':'Blocks this month','恢复链接':'Recovered links','平均解禁时长':'Average recovery time','高风险预警':'High-risk alerts','频道账号':'Channel accounts','API已授权':'API authorized','密钥近30天到期':'Keys expiring in 30 days','风格模板覆盖':'Style template coverage','剧集素材':'Series assets','合作片方':'Partners','待补授权':'Rights documents pending','标题Prompt':'Title prompts','封面风格':'Cover styles','水印模板':'Watermark templates','标签体系':'Tag systems','成员总数':'Total members','角色模板':'Role templates','高权限成员':'Privileged members','待审批权限':'Permissions pending approval','运行中任务':'Running tasks','排队任务':'Queued tasks','今日失败':'Failed today','任务成功率':'Task success rate',

    '剧集':'Series','核心标签':'Core tags','播放量':'Views','点击率':'CTR','D1留存':'D1 retention','D7留存':'D7 retention','RPM':'RPM','收入':'Revenue','推荐分':'Recommendation score','素材ID':'Creative ID','平台':'Platform','热词/题材':'Topic / Genre','抓取量':'Crawled','互动率':'Engagement','片单命中':'Library match','关联剧集':'Matched series','上线建议':'Launch recommendation','链接':'Link','片方':'Partner','禁播渠道':'Blocked channel','禁播原因':'Block reason','检测时间':'Detected','负责人':'Owner','处理状态':'Handling status','SLA':'SLA','素材版本':'Asset version','解析进度':'Analysis progress','剧情亮点':'Story highlights','AI标签数':'AI tags','人工状态':'Review status','更新时间':'Updated','目标语种':'Target language','翻译进度':'Translation','配音进度':'Dubbing','字幕对齐':'Subtitle alignment','去重风险':'Duplication risk','质检状态':'QC status','预计完成':'ETA','目标频道':'Target channel','内容爆点':'Story hook','候选标题数':'Title options','CTR预测':'CTR forecast','字符数':'Characters','冲突检测':'Conflict check','视觉爆点':'Visual hook','候选封面':'Cover options','风格匹配':'Style match','重复度':'Duplication','频道':'Channel','标题状态':'Title status','封面状态':'Cover status','匹配校验':'Match check','审核人':'Reviewer','版本':'Version','整体状态':'Overall status','频道账号':'Channel account','语种版本':'Language version','水印模板':'Watermark template','匹配分':'Match score','上传方式':'Upload method','进度':'Progress','状态':'Status','趋势':'Trend','区域/语种':'Region / Language','爆款TOP1':'Top Series','健康状态':'Health','题材标签':'Genre Tag','外部平台':'External Platform','外部热度':'External Heat','素材增速':'Creative Growth','内部剧集数':'Internal Series','内部CTR':'Internal CTR','机会差值':'Opportunity Gap','建议':'Advice','风险对象':'Risk Object','风险类型':'Risk Type','本月次数':'Monthly Cases','影响收入':'Revenue Impact','解禁进度':'Recovery','风险等级':'Risk Level','预警':'Alert','API状态':'API Status','密钥到期':'Key Expiry','频道风格':'Channel Style','标签配置':'Tag Setup','对象':'Object','类型':'Type','所属片方':'Partner','版本/剧集数':'Versions / Series','授权范围':'Rights Scope','最近更新':'Updated','模板名称':'Template','模板类型':'Type','适用频道':'Channel','使用次数':'Uses','效果指标':'Performance','角色/成员':'Role / Member','角色类型':'Role Type','成员数':'Members','数据范围':'Data Scope','核心权限':'Permissions','最近变更':'Updated','审批人':'Approver','任务ID':'Task ID','任务类型':'Task Type','业务对象':'Business Object','运行节点':'Worker','创建时间':'Created','耗时/预计':'Duration / ETA','操作':'Actions',

    '对标对比':'Benchmark','同标签推荐':'Similar-tag recommendations','加入选剧报告':'Add to selection report','查看素材':'View creative','加入片单筛选':'Add to shortlist','生成上线建议':'Generate launch recommendation','查看链接':'View link','更新工单':'Update ticket','补充材料':'Add documents','查看解析':'View analysis','编辑AI标签':'Edit AI tags','管理版本':'Manage versions','查看任务':'View task','配置译配':'Configure localization','去重检测':'Deduplication check','查看3个标题':'View 3 titles','编辑标题':'Edit title','采用标题':'Use title','预览3张封面':'Preview 3 covers','编辑或替换':'Edit or replace','采用封面':'Use cover','标题封面预览':'Preview title & cover','通过物料':'Approve creative','发布前校验':'Pre-publish check','配置水印':'Configure watermark','查看上传':'View upload','查看趋势':'View trend','版本对比':'Compare versions','诊断建议':'Diagnostic advice','账号详情':'Account details','爆款排行':'Top-series ranking','健康诊断':'Health diagnosis','查看外部素材':'View external creatives','对标内部剧集':'Benchmark internal series','生成机会建议':'Generate opportunity advice','查看风险明细':'View risk details','进入解禁工单':'Open unblock ticket','设置预警':'Set alert','编辑账号':'Edit account','管理API密钥':'Manage API credentials','配置频道风格':'Configure channel style','查看资料':'View details','维护授权':'Manage rights','编辑模板':'Edit template','复制模板':'Duplicate template','查看效果':'View performance','编辑权限':'Edit permissions','查看成员':'View members','复制角色':'Duplicate role','查看日志':'View logs','重试任务':'Retry task','调整优先级':'Adjust priority',

    '待审核':'Pending review','通过':'Passed','待修改':'Needs edits','需修改':'Needs edits','已通过':'Approved','待确认':'Pending confirmation','已确认':'Confirmed','解析中':'Analyzing','处理中':'In progress','待终审':'Pending final review','已完成':'Completed','低':'Low','中':'Medium','高':'High','无冲突':'No conflict','待采用':'Pending selection','待编辑':'Pending edit','已采用':'Selected','待替换':'Pending replacement','上传中':'Uploading','限流等待':'Rate-limit wait','平台审核':'Platform review','命中':'Matched','优先上线':'Priority launch','建议测试':'Test recommended','材料待补':'Documents needed','申诉中':'Appeal in progress','平台复核':'Platform review','强劲':'Strong','上升':'Rising','健康':'Healthy','扩大供给':'Expand supply','正向':'Positive','扩大投放':'Scale spend','补充素材':'Add creatives','暂停批量上传':'Pause bulk uploads','补充主体材料':'Add entity documents','加强预审':'Strengthen pre-review','已授权':'Authorized','已配置':'Configured','正常':'Normal','待续期':'Renewal due','待补材料':'Documents pending','启用':'Enabled','运行中':'Running','重试中':'Retrying','失败':'Failed',

    '逆光心动':'Afterglow Heartbeat','契约之后':'After the Contract','她从雨夜归来':'Return from the Rain','雨夜归来':'Return from the Rain','星海影业':'Starsea Pictures','晨光传媒':'Dawn Media','远山内容':'Far Mountain Content','豪门复仇 · 女强':'Heiress Revenge · Strong Female Lead','先婚后爱 · 都市':'Marriage First, Love Later · Urban','复仇 · 悬疑':'Revenge · Suspense','身份反转':'Identity Twist','家庭冲突':'Family Conflict','契约婚姻':'Contract Marriage','版权素材重复':'Duplicate copyrighted asset','频道内容重复':'Duplicate channel content','音乐版权命中':'Music copyright match','原片 V3':'Master V3','原片 V2':'Master V2','精剪 V1':'Edited V1','英语':'English','西班牙语':'Spanish','阿拉伯语':'Arabic','俄语':'Russian','北美 / 英语':'North America / English','拉美 / 西语':'Latin America / Spanish','全球 / 英语':'Global / English','重复内容':'Duplicate content','授权链路':'Rights chain','社区规范':'Community standards','强冲突美剧风':'High-conflict US drama','情绪戏剧风':'Emotional drama','电影海报风':'Cinematic poster','全球新媒体':'Global new media','拉美 / 欧洲':'Latin America / Europe','运营负责人':'Operations Lead','运营专员':'Operations Specialist','内容负责人':'Content Lead','运营角色':'Operations role','内容角色':'Content role','全部频道':'All channels','分配频道':'Assigned channels','全部素材':'All assets','分析 / 选剧 / 分发':'Analytics / Selection / Distribution','分析 / 标题封面':'Analytics / Titles & Covers','上传 / 标签 / 译配':'Upload / Tags / Localization','译配任务':'Localization task','批量上传':'Bulk upload','标题生成':'Title generation'
  };

  const REGEX=[
    [/^AI已找到(\d+)部与目标标签相似的高潜剧集$/,m=>`AI found ${m[1]} high-potential series with similar target tags`],
    [/^《逆光心动》与目标频道受众重合度(\d+)%$/,m=>`Afterglow Heartbeat has ${m[1]}% audience overlap with the target channel`],
    [/^建议优先测试英语版并使用悬念型物料$/,()=>`Prioritize testing the English version with suspense-led creatives`],
    [/^TK近(\d+)天“身份反转”素材增速(\d+)%$/,m=>`TikTok “Identity Twist” creatives grew ${m[2]}% over the last ${m[1]} days`],
    [/^FB“家庭冲突”题材投流持续稳定$/,()=>`Facebook spend on “Family Conflict” remains stable`],
    [/^片单中(\d+)部剧集同时命中两个以上平台热词$/,m=>`${m[1]} internal-library series match trending keywords on two or more platforms`],
    [/^系统检测到(\d+)条新禁播链接$/,m=>`The system detected ${m[1]} new blocked links`],
    [/^版权素材重复占本周原因的(\d+)%$/,m=>`Duplicate copyrighted assets account for ${m[1]}% of this week’s causes`],
    [/^建议先核对素材版本并补充授权链路$/,()=>`Verify the asset version first and complete the rights chain`],
    [/^AI已完成全剧解析并提炼(\d+)个剧情爆点$/,m=>`AI completed full-series analysis and extracted ${m[1]} story hooks`],
    [/^演员、人设与场景标签置信度均高于(\d+)%$/,m=>`Cast, character and scene tag confidence is above ${m[1]}%`],
    [/^频道标签与历史爆款匹配度(\d+)%$/,m=>`Channel tags have ${m[1]}% match with historical hits`],
    [/^英语译配台词覆盖率([\d.]+)%$/,m=>`English localization dialogue coverage is ${m[1]}%`],
    [/^西语版本检测到(\d+)%的画面重复$/,m=>`The Spanish version has ${m[1]}% duplicated visuals`],
    [/^阿语版本需人工复核角色称谓与文化适配$/,()=>`The Arabic version needs human review for character forms of address and cultural adaptation`],
    [/^模型已学习目标频道近(\d+)天的(\d+)个高点击标题$/,m=>`The model learned from ${m[2]} high-CTR titles on the target channel over the last ${m[1]} days`],
    [/^频道偏好“身份反转 \+ 强冲突 \+ 结果悬念”结构$/,()=>`The channel favors “identity twist + strong conflict + outcome suspense” structures`],
    [/^系统实时提示字符数和历史标题冲突$/,()=>`The system flags character count and historical title conflicts in real time`],
    [/^高CTR封面集中使用双人对峙与强光影$/,()=>`High-CTR covers concentrate on two-person confrontation and dramatic lighting`],
    [/^推荐女主正面、男主背影与豪门场景构图$/,()=>`Recommended composition: female lead facing camera, male lead from behind, upscale setting`],
    [/^系统同步检测频道视觉重复度$/,()=>`The system simultaneously checks visual duplication within the channel`],
    [/^(\d+)组标题与封面存在语义不一致$/,m=>`${m[1]} title-and-cover sets have semantic mismatches`],
    [/^(\d+)个标题接近100字符上限$/,m=>`${m[1]} titles are close to the 100-character limit`],
    [/^(\d+)张封面视觉重复度超过20%$/,m=>`${m[1]} covers exceed 20% visual duplication`],
    [/^逆光心动已通过频道-剧集匹配校验$/,()=>`Afterglow Heartbeat passed the channel-series match check`],
    [/^水印与字幕区冲突已自动调整$/,()=>`Watermark and subtitle-area conflicts were automatically adjusted`],
    [/^Facebook API限流已切换分批上传策略$/,()=>`Facebook API rate limiting switched the task to batched uploads`],
    [/^逆光心动同时领跑播放、CTR与RPM$/,()=>`Afterglow Heartbeat leads views, CTR and RPM simultaneously`],
    [/^炽热边界播放增长但留存下降$/,()=>`Blazing Border is growing in views but declining in retention`],
    [/^俄语版本RPM高于均值但规模偏小$/,()=>`The Russian version has above-average RPM but limited scale`],
    [/^TK-US Drama本月收入增长(\d+)%$/,m=>`TK-US Drama revenue is up ${m[1]}% this month`],
    [/^FB-Latina点击率稳定但上传频率偏低$/,()=>`FB-Latina CTR is stable, but upload frequency is low`],
    [/^INS-Romance互动下降，建议更新视觉模板$/,()=>`INS-Romance engagement is declining; update the visual template`],
    [/^身份反转外部热度领先内部供给(\d+)%$/,m=>`External heat for Identity Twist exceeds internal supply by ${m[1]}%`],
    [/^契约婚姻内部CTR优于外部均值$/,()=>`Internal CTR for Contract Marriage outperforms the external average`],
    [/^Instagram外部素材更依赖高饱和视觉$/,()=>`External Instagram creatives rely more heavily on high-saturation visuals`],
    [/^Facebook禁播量下降但授权问题仍集中$/,()=>`Facebook blocks are declining, but rights issues remain concentrated`],
    [/^TikTok重复内容风险上升$/,()=>`TikTok duplicate-content risk is rising`],
    [/^(\d+)个频道接近平台风险阈值$/,m=>`${m[1]} channels are approaching platform risk thresholds`],
    [/^(\d+)个API密钥将在30天内到期$/,m=>`${m[1]} API credentials will expire within 30 days`],
    [/^(\d+)个频道尚未配置内容标签白名单$/,m=>`${m[1]} channels still lack content-tag allowlists`],
    [/^建议为INS-Romance更新视觉风格模板$/,()=>`Update the visual-style template for INS-Romance`],
    [/^星海影业有(\d+)部剧集缺少海外授权附件$/,m=>`Starsea Pictures has ${m[1]} series missing overseas-rights attachments`],
    [/^逆光心动存在(\d+)个有效素材版本$/,m=>`Afterglow Heartbeat has ${m[1]} valid asset versions`],
    [/^(\d+)个旧版本已超过保留期$/,m=>`${m[1]} old versions have exceeded the retention period`],
    [/^US-Conflict-V5采用率最高$/,()=>`US-Conflict-V5 has the highest adoption rate`],
    [/^Latina-Emotion-V3与频道高CTR素材最匹配$/,()=>`Latina-Emotion-V3 best matches the channel’s high-CTR creatives`],
    [/^新增身份反转标签后推荐准确率提升([\d.]+)%$/,m=>`Recommendation accuracy improved ${m[1]}% after adding the Identity Twist tag`],
    [/^(\d+)名外部成员拥有超出项目范围的下载权限$/,m=>`${m[1]} external members have download permissions beyond project scope`],
    [/^内容角色无法查看频道收益，符合最小权限原则$/,()=>`Content roles cannot view channel revenue, consistent with least-privilege principles`],
    [/^建议为解禁专员增加风险看板只读权限$/,()=>`Grant unblock specialists read-only access to the risk dashboard`],
    [/^Facebook批量上传受限流影响$/,()=>`Facebook bulk uploads are affected by rate limits`],
    [/^俄语配音节点负载达到(\d+)%$/,m=>`Russian dubbing node load has reached ${m[1]}%`],
    [/^标题生成失败主要由频道模板缺失引起$/,()=>`Title-generation failures are mainly caused by missing channel templates`]
  ];

  const TOKEN={
    '身份反转':'Identity Twist','家庭冲突':'Family Conflict','契约婚姻':'Contract Marriage','复仇爽剧':'Revenge Drama','豪门千金身份反转':'Heiress identity twist','契约婚姻反转追妻':'Contract marriage twist / win-her-back','雨夜归来复仇真相':'Rainy-night return / revenge truth','双人对峙 / 豪门':'Two-person confrontation / upscale family','婚礼 / 撕毁契约':'Wedding / torn contract','雨夜 / 复仇眼神':'Rain / revenge gaze','英语 V2':'English V2','西语 V1':'Spanish V1','英语 V3':'English V3','9个版本':'9 versions','7个版本':'7 versions','24部剧集':'24 series','授权待补4部':'Rights pending for 4 series','采用率47%':'Adoption 47%','冲突率1.2%':'Conflict rate 1.2%','高':'High','中':'Medium','低':'Low'
  };

  const translate=(raw)=>{
    if(!raw)return raw;
    if(EN[raw])return EN[raw];
    for(const [re,fn] of REGEX){const m=raw.match(re);if(m)return fn(m)}
    let out=raw;
    Object.keys(TOKEN).sort((a,b)=>b.length-a.length).forEach(k=>{out=out.split(k).join(TOKEN[k])});
    return out;
  };

  function roots(){
    return ['authShell','authView','loginView','registerView','v80nav','pageRoot','octopusRowEditor','apfModal','v815modal']
      .map(id=>document.getElementById(id)).filter(Boolean);
  }

  function scanText(root,en){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const p=node.parentElement;
      if(!p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;
      return node.nodeValue&&node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(node=>{
      const raw=node.nodeValue.trim();
      if(en){
        if(!CJK.test(raw))return;
        if(!originals.has(node))originals.set(node,node.nodeValue);
        const translated=translate(raw);
        if(translated===raw)return;
        const start=node.nodeValue.indexOf(raw);
        node.nodeValue=node.nodeValue.slice(0,start)+translated+node.nodeValue.slice(start+raw.length);
      }else if(originals.has(node)){
        node.nodeValue=originals.get(node);
        originals.delete(node);
      }
    });
  }

  function scanAttrs(root,en){
    root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
      ['placeholder','title','aria-label'].forEach(attr=>{
        const value=el.getAttribute(attr);if(!value)return;
        const key='i18nZh'+attr.replace(/-([a-z])/g,(_,c)=>c.toUpperCase()).replace(/^./,c=>c.toUpperCase());
        if(en&&CJK.test(value)){
          if(!el.dataset[key])el.dataset[key]=value;
          const translated=translate(value);if(translated!==value)el.setAttribute(attr,translated);
        }else if(!en&&el.dataset[key]){
          el.setAttribute(attr,el.dataset[key]);delete el.dataset[key];
        }
      });
    });
  }

  function apply(){
    if(applying)return;applying=true;
    const en=localStorage.getItem(LANG_KEY)==='en';
    document.documentElement.lang=en?'en':'zh-CN';
    roots().forEach(root=>{scanText(root,en);scanAttrs(root,en)});
    document.body?.setAttribute('data-i18n-complete',en?'en':'zh');
    applying=false;
  }

  function schedule(){
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;apply()});
  }

  window.addEventListener('octopus-language-change',()=>{schedule();setTimeout(schedule,70);setTimeout(schedule,260)});
  window.addEventListener('hashchange',()=>{schedule();setTimeout(schedule,40);setTimeout(schedule,180)});
  window.addEventListener('storage',e=>{if(e.key===LANG_KEY)schedule()});
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  setTimeout(schedule,500);setTimeout(schedule,1400);
  window.OctopusI18nContentCompleteness={apply,schedule};
})();
