/* ============================================================
   数据文件 —— 平时只改这一个
   ============================================================ */

var SITE = {
    name:   '小雷导航',
    // 侧栏常驻显示一级分类（此项已废弃：一级分类固定展开，
    // 二级分类改为鼠标移到一级上时从右侧浮出）

    // 「加载更多」：每个二级类目默认显示多少个网址，点一次再多显示这么多
    //   loadMoreStep        → 手机端（<=1000px），默认 10
    //   loadMoreStepDesktop → 桌面端（>1000px），默认 20
    //   某一项设为 0 表示该端不做分批，全部直接显示
    loadMoreStep: 10,
    loadMoreStepDesktop: 20,

    // 世界时钟：显示在首页顶部（精选宫格上方），横向排列
    //   enabled    → false 则整个模块不显示
    //   showSeconds→ 是否显示秒
    //   zones      → 要显示哪些城市（timezone 用 IANA 标准名）
    clock: {
        enabled: true,
        showSeconds: true,
        zones: [
            { city: '北京',   tz: 'Asia/Shanghai',      flag: '🇨🇳' },
            { city: '东京',   tz: 'Asia/Tokyo',         flag: '🇯🇵' },
            { city: '伦敦',   tz: 'Europe/London',      flag: '🇬🇧' },
            { city: '柏林',   tz: 'Europe/Berlin',      flag: '🇩🇪' },
            { city: '纽约',   tz: 'America/New_York',   flag: '🇺🇸' },
            { city: '洛杉矶', tz: 'America/Los_Angeles',flag: '🇺🇸' }
        ]
    },
    // 卡片简介显示方式：
    //   'always'（默认）简介一直显示
    //   'fade'  默认隐藏、鼠标移入淡入 —— 占位保留，卡片高度恒定，零抖动
    //   'pop'   简介完全不占空间，卡片更紧凑，悬停时以浮层气泡从卡片下方浮出
    descMode: 'always',
    logo:   '🧭',
    slogan: '求知 · 探索 · 发现',
    footer: '本站仅收录公开网站链接，版权归原站所有',
    icp:    ''
};

/* ------------------------------------------------------------
   顶部菜单（可选）
   children 有值时会渲染成下拉子菜单
------------------------------------------------------------ */
var TOP_MENU = [
    { name: '首页',   url: '#' },
    { name: '垂直分类', url: '#', children: [
        { name: 'AI 工具',   url: '#cat-1' },
        { name: '开发工具',  url: '#cat-4' },
        { name: '设计素材',  url: '#cat-5' },
        { name: '学习教育',  url: '#cat-6' },
        { name: '生活服务',  url: '#cat-7' }
    ]},
    { name: '站长工具', url: '#cat-9' },
    { name: '关于',   url: '#' }
];

/* ------------------------------------------------------------
   侧栏顶部快捷项（在分类之前显示，可留空）
------------------------------------------------------------ */
var SIDE_QUICK = [
    { name: '首页',     icon: '🏠', url: '#' },
    { name: '每日热榜', icon: '🔥', url: '#' }
];

/* ------------------------------------------------------------
   首页精选（五宫格大卡，参考益族网 slide_2_mkbox）
   建议 5 个，多了会自动换行
   badge: 右上角小徽章文字，如 GO / NEW / HOT
------------------------------------------------------------ */
var FEATURED = [
    { name: 'GitHub',      url: 'https://github.com/',      desc: '代码托管与协作平台', badge: 'GO'  },
    { name: 'DeepSeek',    url: 'https://chat.deepseek.com/', desc: '国产高性能大模型',   badge: 'AI'  },
    { name: '哔哩哔哩',     url: 'https://www.bilibili.com/', desc: '视频弹幕网站',       badge: 'NEW' },
    { name: 'Figma',       url: 'https://www.figma.com/',   desc: '在线界面设计协作',    badge: 'HOT' },
    { name: '中国大学MOOC', url: 'https://www.icourse163.org/', desc: '高校慕课平台',     badge: '学'  }
];

/* 顶栏「一言」
   HITOKOTO_LIST → 静态句子库，每次刷新随机取一条，并每隔若干秒自动轮换
                   留空数组则回退到 HITOKOTO 单句（再留空则不显示）
   HITOKOTO_INTERVAL → 轮换间隔（毫秒），设为 0 表示只显示一条不轮换
*/
var HITOKOTO_LIST = [
    '求知 · 探索 · 发现',
    '工欲善其事，必先利其器',
    '信息检索的能力，是当代最被低估的超能力',
    '把常用的工具放在手边，把心思留给真正的问题',
    '好的导航不是收藏得多，而是找得到',
    '互联网上 99% 的问题，都已经有人遇到过',
    '收藏夹的价值，取决于你多久会打开它一次',
    '工具是手段，不是目的',
    '把时间花在创造上，而不是寻找上',
    '保持好奇，保持耐心',
    '简单、够用、不折腾',
    '知识的边界越广，未知的边界越长',
    '每一次搜索，都是一次与世界对话',
    '慢一点，比较快',
    '有用的东西，值得被记住'
];
var HITOKOTO_INTERVAL = 20000;   // 20 秒换一句；设 0 则不轮换
var HITOKOTO = '';

/* ------------------------------------------------------------
   超级搜索：切换搜索引擎
   tpl 里用 {q} 占位关键词
------------------------------------------------------------ */
var SEARCH_GROUPS = [
    { name: '常用', items: [
        { name: '百度',   tpl: 'https://www.baidu.com/s?wd={q}' },
        { name: '必应',   tpl: 'https://cn.bing.com/search?q={q}' },
        { name: '谷歌',   tpl: 'https://www.google.com/search?q={q}' },
        { name: '搜狗',   tpl: 'https://www.sogou.com/web?query={q}' }
    ]},
    { name: '搜索', items: [
        { name: '百度',   tpl: 'https://www.baidu.com/s?wd={q}' },
        { name: '必应',   tpl: 'https://cn.bing.com/search?q={q}' },
        { name: '头条',   tpl: 'https://so.toutiao.com/search?keyword={q}' },
        { name: '秘塔',   tpl: 'https://metaso.cn/search?q={q}' }
    ]},
    { name: '工具', items: [
        { name: 'GitHub', tpl: 'https://github.com/search?q={q}' },
        { name: 'npm',    tpl: 'https://www.npmjs.com/search?q={q}' },
        { name: 'MDN',    tpl: 'https://developer.mozilla.org/zh-CN/search?q={q}' },
        { name: 'Stack Overflow', tpl: 'https://stackoverflow.com/search?q={q}' }
    ]},
    { name: '社区', items: [
        { name: '知乎',   tpl: 'https://www.zhihu.com/search?q={q}' },
        { name: '微博',   tpl: 'https://s.weibo.com/weibo?q={q}' },
        { name: 'B站',    tpl: 'https://search.bilibili.com/all?keyword={q}' },
        { name: 'V2EX',   tpl: 'https://www.google.com/search?q=site:v2ex.com+{q}' }
    ]},
    { name: '生活', items: [
        { name: '淘宝',   tpl: 'https://s.taobao.com/search?q={q}' },
        { name: '京东',   tpl: 'https://search.jd.com/Search?keyword={q}' },
        { name: '豆瓣',   tpl: 'https://search.douban.com/movie/subject_search?search_text={q}' },
        { name: '12306',  tpl: 'https://www.12306.cn/' }
    ]},
    { name: '视频', items: [
        { name: 'B站',    tpl: 'https://search.bilibili.com/all?keyword={q}' },
        { name: '爱奇艺', tpl: 'https://so.iqiyi.com/so/q_{q}' },
        { name: 'YouTube',tpl: 'https://www.youtube.com/results?search_query={q}' }
    ]}
];

/* ------------------------------------------------------------
   分类与网址
   ------------------------------------------------------------
   groups: 二级分组。只有一个且名为空时，不显示二级标题
   sites : name / url / desc（desc 可留空，会显示域名）
           icon 可选，填图片路径或 emoji；不填自动按域名抓图标
------------------------------------------------------------ */
var CATEGORIES = [
    {
        name: '常用推荐', icon: '⭐',
        groups: [
            { name: '', icon: '', sites: [
                { name: 'GitHub', url: 'https://github.com/', desc: '代码托管与协作平台', tags:['代码','开源'] },
                { name: 'Gitee', url: 'https://gitee.com/', desc: '国内代码托管平台' },
                { name: '吾爱破解', url: 'https://www.52pojie.cn/', desc: '软件安全与逆向技术论坛' },
                { name: '精易论坛', url: 'https://bbs.125.la/', desc: '易语言编程交流社区' },
                { name: '殁漂遥', url: 'https://www.mpyit.com/', desc: '个人技术博客' },
                { name: '阿里图标库', url: 'https://www.iconfont.cn/', desc: '矢量图标素材库' },
                { name: '包图网', url: 'https://ibaotu.com/', desc: '设计素材下载' },
                { name: '千图网', url: 'https://www.58pic.com/', desc: '图片素材下载' },
                { name: 'FreeMP3', url: 'http://tool.liumingye.cn/music/', desc: '在线音乐搜索' },
                { name: 'VIP视频解析', url: 'http://tool.liumingye.cn/video/', desc: '视频在线解析' },
                { name: '时光相册', url: 'https://photo.zmki.cn/', desc: '在线相册存储' },
                { name: '哔哩哔哩', url: 'https://www.bilibili.com/', desc: '视频弹幕网站', tags:['视频','弹幕'] },
            ]},
        ]
    },
    {
        name: 'AI 工具', icon: '🤖',
        groups: [
            { name: '对话助手', icon: '💬', sites: [
                { name: 'ChatGPT', url: 'https://chat.openai.com/', desc: 'OpenAI 智能对话助手' },
                { name: 'Claude', url: 'https://claude.ai/', desc: 'Anthropic 推出的 AI 助手' },
                { name: 'DeepSeek', url: 'https://chat.deepseek.com/', desc: '国产高性能大模型对话', tags:['AI','对话'] },
                { name: 'Kimi', url: 'https://kimi.moonshot.cn/', desc: '长文本处理 AI 助手' },
                { name: '豆包', url: 'https://www.doubao.com/', desc: '字节跳动 AI 对话助手' },
                { name: '通义千问', url: 'https://tongyi.aliyun.com/', desc: '阿里云大模型对话' },
                { name: '文心一言', url: 'https://yiyan.baidu.com/', desc: '百度大模型对话' },
                { name: '智谱清言', url: 'https://chatglm.cn/', desc: '清华系大模型对话' },
            ]},
            { name: 'AI 绘图', icon: '🎨', sites: [
                { name: '即梦', url: 'https://jimeng.jianying.com/', desc: 'AI 图片与视频生成' },
                { name: '可灵', url: 'https://klingai.com/', desc: 'AI 视频与图片创作' },
                { name: 'Midjourney', url: 'https://www.midjourney.com/', desc: '知名 AI 绘画工具' },
                { name: 'LiblibAI', url: 'https://www.liblib.art/', desc: '国内 AI 绘画模型社区' },
                { name: '堆友', url: 'https://d.design/', desc: '阿里出品的 AI 设计工具' },
            ]},
            { name: 'AI 搜索', icon: '🔎', sites: [
                { name: '秘塔搜索', url: 'https://metaso.cn/', desc: 'AI 驱动的语义搜索' },
                { name: '天工 AI', url: 'https://www.tiangong.cn/', desc: 'AI 搜索与内容生成' },
                { name: 'Perplexity', url: 'https://www.perplexity.ai/', desc: '带引用来源的 AI 搜索' },
            ]},
        ]
    },
    {
        name: '影视资源', icon: '🎬',
        groups: [
            { name: '在线', icon: '▶️', sites: [
                { name: '不太灵影视', url: 'https://www.butailing.com/', desc: '在线影视播放' },
                { name: '555电影', url: 'https://55npv.wiki/', desc: '在线电影观看' },
                { name: '电影先生', url: 'https://dyxs.me/', desc: '在线影视资源' },
                { name: '可可影视', url: 'https://dl.kekedy.app/', desc: '在线视频站点' },
                { name: '爱看影院', url: 'https://www.3ayy.com/', desc: '在线观影' },
                { name: '搜片', url: 'https://soupian.one/', desc: '影视搜索' },
            ]},
            { name: '下载', icon: '⬇️', sites: [
                { name: '磁力熊', url: 'https://www.cilixiong.com/', desc: '磁力资源搜索' },
                { name: '音范丝', url: 'https://www.yinfans.me/', desc: '影视资源下载' },
                { name: 'MP4电影', url: 'https://www.domp4.cc/', desc: '电影下载' },
                { name: '修罗影视', url: 'https://xlys.me/', desc: '影视下载' },
                { name: 'SeedHub', url: 'https://www.seedhub.cc/', desc: '种子资源搜索' },
                { name: '豌豆PRO', url: 'https://wandou.la/', desc: '资源搜索' },
                { name: '人人电影网', url: 'https://www.rrdynb.com/', desc: '电影下载' },
                { name: '校长影视', url: 'https://xzys.fun/', desc: '影视资源' },
                { name: '苏苏影视', url: 'https://susuifa.com/', desc: '影视下载' },
            ]},
            { name: '动漫', icon: '🌸', sites: [
                { name: 'AGE动漫', url: 'https://www.agemys.cc/', desc: '动漫在线观看' },
                { name: 'bimi动漫', url: 'http://www.bimiacg4.net/', desc: '动漫视频' },
                { name: '克拉TV', url: 'https://www.kelatv.com/', desc: '动漫影视' },
                { name: '不可视境界线', url: 'https://acgcn.ml/', desc: '动漫资源' },
                { name: 'OmoFun', url: 'https://omofun.tv/', desc: '动漫在线' },
                { name: '去看吧', url: 'https://www.k6dm.com/', desc: '动漫观看' },
                { name: '樱花动漫', url: 'http://www.dmh8.com/', desc: '动漫在线' },
                { name: '卡通站', url: 'https://www.antoc.cn/', desc: '动漫资源' },
                { name: '趣动漫', url: 'http://www.qdmsh.com/', desc: '动漫观看' },
                { name: '蜜柑计划', url: 'https://mikanani.me/', desc: '动漫种子' },
                { name: 'KOTOMI', url: 'https://moe4sale.in/', desc: '动漫资源' },
                { name: '动漫花园', url: 'https://share.dmhy.org/', desc: '动漫种子分享' },
            ]},
            { name: '美剧', icon: '🎞️', sites: [
                { name: '人人影视', url: 'https://yyets.dmesg.app/', desc: '美剧字幕与资源' },
                { name: 'AG美剧', url: 'https://agmov.com/', desc: '美剧在线' },
                { name: 'NO视频', url: 'https://www.novipnoad.com/', desc: '美剧观看' },
                { name: '爱美剧', url: 'https://www.imeiju.org/', desc: '美剧资源' },
                { name: '美剧天堂', url: 'https://www.meijutt.tv/', desc: '美剧下载' },
                { name: '在线之家', url: 'https://www.zxzj.me/', desc: '美剧在线' },
            ]},
        ]
    },
    {
        name: '软件工具', icon: '🛠️',
        groups: [
            { name: '软件博客', icon: '📝', sites: [
                { name: '果核剥壳', url: 'https://www.ghxi.com/', desc: '软件分享博客' },
                { name: '小众软件', url: 'https://www.appinn.com/', desc: '软件推荐' },
                { name: '异次元软件', url: 'https://www.iplaysoft.com/', desc: '软件资讯' },
                { name: '423down', url: 'https://www.423down.com/', desc: '软件下载' },
                { name: '芊芊精典', url: 'https://myqqjd.com/', desc: '软件资源' },
                { name: '易破解', url: 'https://www.ypojie.com/', desc: '软件资源站' },
            ]},
            { name: '在线工具', icon: '🔧', sites: [
                { name: '草料二维码', url: 'https://cli.im/', desc: '二维码生成' },
                { name: 'Bigjpg', url: 'https://bigjpg.com/', desc: '图片无损放大' },
                { name: '白描', url: 'https://web.baimiaoapp.com/', desc: 'OCR 文字识别' },
                { name: '短视频解析', url: 'http://www.dspjx.com/', desc: '短视频解析' },
                { name: '在线PS图片', url: 'https://www.uupoop.com/', desc: '在线图像编辑' },
                { name: 'PhotoKit', url: 'https://photokit.com/editor/?lang=zh', desc: '在线图片编辑' },
                { name: '在线音频编辑', url: 'https://vocalremover.org/ch/', desc: '音频处理' },
                { name: '395公章', url: 'http://www.395.net.cn/', desc: '在线印章制作' },
                { name: '易词云', url: 'https://www.yciyun.com/', desc: '词云生成' },
                { name: '在线屏幕录制', url: 'https://toolwa.com/record/', desc: '屏幕录制' },
                { name: '在线图片修复', url: 'https://zh.pixfix.com/', desc: '图片修复' },
                { name: '太美工具', url: 'https://tiomg.org/', desc: '在线工具合集' },
                { name: 'iLovePDF', url: 'https://www.ilovepdf.com/zh-cn', desc: 'PDF 在线处理' },
                { name: 'ALL TO ALL', url: 'https://www.alltoall.net/', desc: '文件格式转换' },
                { name: '67工具箱', url: 'https://www.67tool.com/', desc: '在线工具箱' },
                { name: 'YEELOGO', url: 'http://www.yeelogo.com/', desc: 'Logo 设计' },
                { name: 'Moises.ai', url: 'https://studio.moises.ai/', desc: 'AI 音频分离' },
        { name: 'ProcessOn',   url: 'https://www.processon.com/',  desc: '在线流程图思维导图' },
        { name: '幕布',         url: 'https://mubu.com/',          desc: '大纲笔记与思维导图' },
        { name: 'Canva 可画',   url: 'https://www.canva.cn/',      desc: '在线设计与海报制作' },
        { name: '创客贴',       url: 'https://www.chuangkit.com/',  desc: '在线平面设计工具' },
        { name: '稿定设计',     url: 'https://www.gaoding.com/',    desc: '在线抠图与设计' },
        { name: 'removebg',     url: 'https://www.remove.bg/',     desc: '一键自动去除背景' },
        { name: 'TinyPNG',      url: 'https://tinypng.com/',       desc: '图片无损压缩' }
    ]},
        ]
    },
    {
        name: '开发工具', icon: '💻',
        groups: [
            { name: '社区问答', icon: '👨‍💻', sites: [
                { name: 'Stack Overflow', url: 'https://stackoverflow.com/', desc: '全球程序员问答社区', tags:['问答','编程'] },
                { name: '掘金', url: 'https://juejin.cn/', desc: '国内技术内容社区' },
                { name: 'SegmentFault', url: 'https://segmentfault.com/', desc: '技术问题问答平台' },
                { name: 'CSDN', url: 'https://www.csdn.net/', desc: '中文技术社区', tags:['技术','社区'] },
                { name: '博客园', url: 'https://www.cnblogs.com/', desc: '开发者博客平台' },
                { name: 'V2EX', url: 'https://www.v2ex.com/', desc: '创意工作者社区', tags:['社区','创意'] },
            ]},
            { name: '文档教程', icon: '📚', sites: [
                { name: 'MDN', url: 'https://developer.mozilla.org/zh-CN/', desc: 'Web 技术权威文档', tags:['文档','前端'] },
                { name: '菜鸟教程', url: 'https://www.runoob.com/', desc: '编程入门教程', tags:['编程','教程'] },
                { name: 'Vue.js', url: 'https://cn.vuejs.org/', desc: '渐进式前端框架', tags:['框架','前端'] },
                { name: 'React', url: 'https://react.dev/', desc: '用户界面构建库', tags:['框架','前端'] },
                { name: 'TailwindCSS', url: 'https://tailwindcss.com/', desc: '原子化 CSS 框架' },
                { name: 'Vite', url: 'https://cn.vitejs.dev/', desc: '新一代前端构建工具' },
            ]},
            { name: '在线运行', icon: '⚡', sites: [
                { name: 'CodePen', url: 'https://codepen.io/', desc: '前端代码在线演示' },
                { name: 'CodeSandbox', url: 'https://codesandbox.io/', desc: '在线代码编辑器' },
                { name: 'JSFiddle', url: 'https://jsfiddle.net/', desc: '轻量代码片段测试' },
            ]},
        ]
    },
    {
        name: '设计素材', icon: '🎨',
        groups: [
            { name: '灵感社区', icon: '💡', sites: [
                { name: '站酷', url: 'https://www.zcool.com.cn/', desc: '设计师互动平台', tags:['设计','素材'] },
                { name: '花瓣网', url: 'https://huaban.com/', desc: '设计灵感采集' },
                { name: '优设', url: 'https://ui.cn/', desc: '设计师学习平台' },
                { name: 'Dribbble', url: 'https://dribbble.com/', desc: '国际设计作品社区' },
                { name: 'Behance', url: 'https://www.behance.net/', desc: 'Adobe 创意作品集' },
            ]},
            { name: '图片素材', icon: '🖼️', sites: [
                { name: 'Unsplash', url: 'https://unsplash.com/', desc: '高质量免费图库' },
                { name: 'Pexels', url: 'https://www.pexels.com/', desc: '免费图片与视频' },
                { name: 'Pixabay', url: 'https://pixabay.com/', desc: '免费正版素材库' },
                { name: '觅元素', url: 'https://www.51yuansu.com/', desc: '免抠设计元素' },
                { name: '千库网', url: 'https://588ku.com/', desc: '设计素材下载' },
            ]},
            { name: '设计工具', icon: '✏️', sites: [
                { name: 'Figma', url: 'https://www.figma.com/', desc: '在线界面设计协作', tags:['设计','协作'] },
                { name: '即时设计', url: 'https://js.design/', desc: '国产在线设计工具' },
                { name: '稿定设计', url: 'https://www.gaoding.com/', desc: '在线平面设计' },
                { name: '创客贴', url: 'https://www.chuangkit.com/', desc: '海报与图片设计' },
                { name: '图怪兽', url: 'https://818ps.com/', desc: '在线图片设计' },
            ]},
        ]
    },
    {
        name: '学习教育', icon: '📖',
        groups: [
            { name: '在线课程', icon: '🎓', sites: [
                { name: '中国大学MOOC', url: 'https://www.icourse163.org/', desc: '高校慕课平台', tags:['学习','课程'] },
                { name: '网易公开课', url: 'https://open.163.com/', desc: '国内外名校课程' },
                { name: '学堂在线', url: 'https://www.xuetangx.com/', desc: '清华慕课平台' },
                { name: 'Coursera', url: 'https://www.coursera.org/', desc: '国际在线课程' },
                { name: 'edX', url: 'https://www.edx.org/', desc: '名校开放课程' },
            ]},
            { name: '阅读学习', icon: '📕', sites: [
                { name: '微信读书', url: 'https://weread.qq.com/', desc: '社交化阅读平台' },
                { name: '豆瓣读书', url: 'https://book.douban.com/', desc: '书评与书单' },
                { name: '智慧教育平台', url: 'https://basic.smartedu.cn/', desc: '中小学教育资源' },
                { name: '多邻国', url: 'https://www.duolingo.com/', desc: '游戏化语言学习' },
            ]},
            { name: '求职招聘', icon: '💼', sites: [
                { name: 'BOSS直聘', url: 'https://www.zhipin.com/', desc: '直聊式招聘平台' },
                { name: '智联招聘', url: 'https://www.zhaopin.com/', desc: '综合招聘服务' },
                { name: '前程无忧', url: 'https://www.51job.com/', desc: '招聘求职平台' },
                { name: '拉勾网', url: 'https://www.lagou.com/', desc: '互联网垂直招聘' },
            ]},
        ]
    },
    {
        name: '生活服务', icon: '🏠',
        groups: [
            { name: '出行旅行', icon: '✈️', sites: [
                { name: '12306', url: 'https://www.12306.cn/', desc: '铁路官方购票' },
                { name: '携程旅行', url: 'https://www.ctrip.com/', desc: '机票酒店预订' },
                { name: '去哪儿', url: 'https://www.qunar.com/', desc: '旅行比价平台' },
                { name: '高德地图', url: 'https://www.amap.com/', desc: '地图导航服务' },
                { name: '百度地图', url: 'https://map.baidu.com/', desc: '地图与生活服务' },
            ]},
            { name: '网购商城', icon: '🛒', sites: [
                { name: '淘宝', url: 'https://www.taobao.com/', desc: '综合网购平台' },
                { name: '京东', url: 'https://www.jd.com/', desc: '自营电商与物流' },
                { name: '拼多多', url: 'https://www.pinduoduo.com/', desc: '拼团购物平台' },
                { name: '闲鱼', url: 'https://www.goofish.com/', desc: '二手交易平台' },
            ]},
            { name: '便民查询', icon: '📮', sites: [
                { name: '快递100', url: 'https://www.kuaidi100.com/', desc: '快递物流查询' },
                { name: '中国天气网', url: 'https://www.weather.com.cn/', desc: '权威天气预报' },
                { name: '支付宝', url: 'https://www.alipay.com/', desc: '生活缴费与支付' },
                { name: '大众点评', url: 'https://www.dianping.com/', desc: '本地生活服务' },
            ]},
        ]
    },
    {
        name: '社区资讯', icon: '💬',
        groups: [
            { name: '资讯', icon: '📰', sites: [
                { name: 'IT之家', url: 'https://www.ithome.com/', desc: 'IT 数码资讯' },
                { name: '微博热榜', url: 'https://s.weibo.com/top/summary', desc: '实时热点榜' },
                { name: '今日头条', url: 'https://www.toutiao.com/', desc: '新闻聚合推荐' },
                { name: '36氪', url: 'https://www.36kr.com/', desc: '科技创投资讯' },
                { name: '少数派', url: 'https://sspai.com/', desc: '效率工具与技巧' },
                { name: '中关村在线', url: 'https://www.zol.com.cn/', desc: '科技产品资讯' },
                { name: '知微事见', url: 'https://ef.zhiweidata.com/', desc: '舆情事件分析' },
                { name: '大数据导航', url: 'http://hao.199it.com/', desc: '数据行业资讯' },
                { name: '今日热榜', url: 'https://tophub.today/', desc: '全平台热榜聚合' },
            ]},
            { name: '社区', icon: '👥', sites: [
                { name: '百度贴吧', url: 'http://tieba.baidu.com/', desc: '兴趣主题社区' },
                { name: '知乎', url: 'https://www.zhihu.com/', desc: '问答与内容社区', tags:['问答','社区'] },
            ]},
        ]
    },
    {
        name: '站长工具', icon: '🔍',
        groups: [
            { name: 'SEO 查询', icon: '📊', sites: [
                { name: '站长工具', url: 'https://tool.chinaz.com/', desc: '综合站长工具箱' },
                { name: '爱站网', url: 'https://www.aizhan.com/', desc: 'SEO 与备案查询' },
                { name: 'ICP 备案查询', url: 'https://icp.aizhan.com/', desc: '域名备案信息' },
                { name: '友情链接检测', url: 'https://link.chinaz.com/', desc: '友链查询分析' },
                { name: '网站测速', url: 'https://ping.chinaz.com/', desc: '多地 Ping 检测' },
                { name: '权重查询', url: 'https://rank.chinaz.com/all/', desc: '网站权重查询' },
            ]},
        ]
    },
    {
        name: '友情链接', icon: '🔗',
        groups: [
            { name: '', icon: '', sites: [
                { name: '一为导航', url: 'https://nav.iowen.cn/', desc: '开源导航站项目' },
                { name: 'MDN Web 文档', url: 'https://developer.mozilla.org/zh-CN/', desc: 'Web 技术文档' },
                { name: 'W3Schools', url: 'https://www.w3schools.com/', desc: 'Web 技术教程' },
                { name: 'GitHub Education', url: 'https://education.github.com/', desc: '开发者教育资源' },
            ]},
        ]
    },
];

/* ============================================================
   多语言配置
   ------------------------------------------------------------
   LANGS  → 可切换的语言（code 为语言码，region 显示在列表左侧）
   UI_*   → 界面文案词典。缺哪种语言就补哪一列，没填的回退简体中文
   CAT_*  → 分类名 / 分组名 / 菜单名
   DESC_* → 站点简介（以中文原文为 key；只示范了部分，其余回退中文）
   CITY_* → 世界时钟城市名
   SITE_* → 站名 / 标语 / 页脚
   HITO_* → 各语言一言句子库
   ============================================================ */

var LANGS = [
    { code: 'zh', region: 'CN', label: '简体中文', flag: '🇨🇳' },
    { code: 'zh-TW', region: 'CN', label: '繁體中文', flag: '🇨🇳' },
    { code: 'en', region: 'US', label: 'English', flag: '🇺🇸' }
];

/* 界面文案（{name}/{n} 为占位符）*/
var UI_I18N = {
    'title_suffix': { zh:'求知探索 乐于分享', 'zh-TW':'網址導航', en:'Web Directory' },
    'theme': { zh:'主题切换', 'zh-TW':'主題切換', en:'Theme' },
    'search_ph': { zh:'输入关键词搜索…', 'zh-TW':'輸入關鍵詞搜索…', en:'Search for anything…' },
    'search_in': { zh:'在 {name} 中搜索', 'zh-TW':'在 {name} 中搜索', en:'Search on {name}' },
    'inner_ph': { zh:'搜索本站收录的网站…', 'zh-TW':'搜索本站收錄的網站…', en:'Search sites in this directory…' },
    'empty': { zh:'没有找到匹配的网站', 'zh-TW':'沒有找到匹配的網站', en:'No matching sites found' },
    'load_more': { zh:'加载更多（还有 {n} 个）', 'zh-TW':'加載更多（還有 {n} 個）', en:'Load more ({n} left)' },
    'lang_title': { zh:'语言', 'zh-TW':'語言', en:'Language' },
    'skip': { zh:'跳到主内容', 'zh-TW':'跳到主內容', en:'Skip to main content' },
    'open_menu': { zh:'打开菜单', 'zh-TW':'打開菜單', en:'Open menu' },
    'close_menu': { zh:'关闭菜单', 'zh-TW':'關閉菜單', en:'Close menu' },
    'site_search': { zh:'站内搜索', 'zh-TW':'站內搜索', en:'Search this site' },
    'toggle_theme': { zh:'切换主题', 'zh-TW':'切換主題', en:'Toggle theme' },
    'to_top': { zh:'返回顶部', 'zh-TW':'返回頂部', en:'Back to top' },
    'lang_btn': { zh:'切换语言', 'zh-TW':'切換語言', en:'Language' }
};

/* 分类名 / 分组名 / 菜单名 */
var CAT_I18N = {
    '常用推荐': { zh:'常用推荐', 'zh-TW':'常用推薦', en:'Recommended' },
    'AI 工具': { zh:'AI 工具', 'zh-TW':'AI 工具', en:'AI Tools' },
    '影视资源': { zh:'影视资源', 'zh-TW':'影視資源', en:'Movies & TV' },
    '软件工具': { zh:'软件工具', 'zh-TW':'軟體工具', en:'Software' },
    '开发工具': { zh:'开发工具', 'zh-TW':'開發工具', en:'Dev Tools' },
    '设计素材': { zh:'设计素材', 'zh-TW':'設計素材', en:'Design Assets' },
    '学习教育': { zh:'学习教育', 'zh-TW':'學習教育', en:'Learning' },
    '生活服务': { zh:'生活服务', 'zh-TW':'生活服務', en:'Lifestyle' },
    '社区资讯': { zh:'社区资讯', 'zh-TW':'社區資訊', en:'Community' },
    '站长工具': { zh:'站长工具', 'zh-TW':'站長工具', en:'Webmaster' },
    '友情链接': { zh:'友情链接', 'zh-TW':'友情鏈接', en:'Friends' },
    '对话助手': { zh:'对话助手', 'zh-TW':'對話助手', en:'Chatbots' },
    'AI 绘图': { zh:'AI 绘图', 'zh-TW':'AI 繪圖', en:'AI Art' },
    'AI 搜索': { zh:'AI 搜索', 'zh-TW':'AI 搜索', en:'AI Search' },
    '在线': { zh:'在线', 'zh-TW':'在線', en:'Streaming' },
    '下载': { zh:'下载', 'zh-TW':'下載', en:'Downloads' },
    '动漫': { zh:'动漫', 'zh-TW':'動漫', en:'Anime' },
    '美剧': { zh:'美剧', 'zh-TW':'美劇', en:'US Series' },
    '软件博客': { zh:'软件博客', 'zh-TW':'軟體博客', en:'Software Blogs' },
    '在线工具': { zh:'在线工具', 'zh-TW':'在線工具', en:'Online Tools' },
    '社区问答': { zh:'社区问答', 'zh-TW':'社區問答', en:'Q&A' },
    '文档教程': { zh:'文档教程', 'zh-TW':'文檔教程', en:'Docs & Tutorials' },
    '在线运行': { zh:'在线运行', 'zh-TW':'在線運行', en:'Online IDE' },
    '灵感社区': { zh:'灵感社区', 'zh-TW':'靈感社區', en:'Inspiration' },
    '图片素材': { zh:'图片素材', 'zh-TW':'圖片素材', en:'Images' },
    '设计工具': { zh:'设计工具', 'zh-TW':'設計工具', en:'Design Tools' },
    '在线课程': { zh:'在线课程', 'zh-TW':'在線課程', en:'Courses' },
    '阅读学习': { zh:'阅读学习', 'zh-TW':'閱讀學習', en:'Reading' },
    '求职招聘': { zh:'求职招聘', 'zh-TW':'求職招聘', en:'Jobs' },
    '出行旅行': { zh:'出行旅行', 'zh-TW':'出行旅行', en:'Travel' },
    '网购商城': { zh:'网购商城', 'zh-TW':'網購商城', en:'Shopping' },
    '便民查询': { zh:'便民查询', 'zh-TW':'便民查詢', en:'Utilities' },
    '资讯': { zh:'资讯', 'zh-TW':'資訊', en:'News' },
    '社区': { zh:'社区', 'zh-TW':'社區', en:'Forums' },
    'SEO 查询': { zh:'SEO 查询', 'zh-TW':'SEO 查詢', en:'SEO' },
    '首页': { zh:'首页', 'zh-TW':'首頁', en:'Home' },
    '每日热榜': { zh:'每日热榜', 'zh-TW':'每日熱榜', en:'Daily Hot' },
    '垂直分类': { zh:'垂直分类', 'zh-TW':'垂直分類', en:'Categories' },
    '关于': { zh:'关于', 'zh-TW':'關於', en:'About' },
    '常用': { zh:'常用', 'zh-TW':'常用', en:'Popular' },
    '搜索': { zh:'搜索', 'zh-TW':'搜索', en:'Search' },
    '工具': { zh:'工具', 'zh-TW':'工具', en:'Tools' },
    '生活': { zh:'生活', 'zh-TW':'生活', en:'Life' },
    '视频': { zh:'视频', 'zh-TW':'視頻', en:'Video' }
};

/* 搜索引擎名（专有名词转罗马字）*/
var ENG_I18N = {
    '百度': { zh:'百度', 'zh-TW':'百度', en:'Baidu' },
    '必应': { zh:'必应', 'zh-TW':'必應', en:'Bing' },
    '谷歌': { zh:'谷歌', 'zh-TW':'谷歌', en:'Google' },
    '搜狗': { zh:'搜狗', 'zh-TW':'搜狗', en:'Sogou' },
    '头条': { zh:'头条', 'zh-TW':'頭條', en:'Toutiao' },
    '秘塔': { zh:'秘塔', 'zh-TW':'秘塔', en:'Metaso' },
    '微博': { zh:'微博', 'zh-TW':'微博', en:'Weibo' },
    'B站': { zh:'B站', 'zh-TW':'B站', en:'Bilibili' },
    '知乎': { zh:'知乎', 'zh-TW':'知乎', en:'Zhihu' },
    '豆瓣': { zh:'豆瓣', 'zh-TW':'豆瓣', en:'Douban' },
    '淘宝': { zh:'淘宝', 'zh-TW':'淘寶', en:'Taobao' },
    '京东': { zh:'京东', 'zh-TW':'京東', en:'JD' },
    '爱奇艺': { zh:'爱奇艺', 'zh-TW':'愛奇藝', en:'iQIYI' }
};

/* 世界时钟城市名 */
var CITY_I18N = {
    '北京': { zh:'北京', 'zh-TW':'北京', en:'Beijing' },
    '东京': { zh:'东京', 'zh-TW':'東京', en:'Tokyo' },
    '伦敦': { zh:'伦敦', 'zh-TW':'倫敦', en:'London' },
    '柏林': { zh:'柏林', 'zh-TW':'柏林', en:'Berlin' },
    '纽约': { zh:'纽约', 'zh-TW':'紐約', en:'New York' },
    '洛杉矶': { zh:'洛杉矶', 'zh-TW':'洛杉磯', en:'Los Angeles' }
};

/* 站点简介（以中文为 key，未收录的回退中文）*/
var DESC_I18N = {
    '代码托管与协作平台': { zh:'代码托管与协作平台', 'zh-TW':'代碼託管與協作平台', en:'Code hosting & collaboration' },
    '国内代码托管平台': { zh:'国内代码托管平台', 'zh-TW':'國內代碼託管平台', en:'Chinese code hosting' },
    '软件安全与逆向技术论坛': { zh:'软件安全与逆向技术论坛', 'zh-TW':'軟體安全與逆向技術論壇', en:'Reverse engineering forum' },
    '易语言编程交流社区': { zh:'易语言编程交流社区', 'zh-TW':'易語言編程交流社區', en:'E-language dev community' },
    '个人技术博客': { zh:'个人技术博客', 'zh-TW':'個人技術博客', en:'Personal tech blog' },
    '矢量图标素材库': { zh:'矢量图标素材库', 'zh-TW':'矢量圖標素材庫', en:'Vector icon library' },
    '设计素材下载': { zh:'设计素材下载', 'zh-TW':'設計素材下載', en:'Design assets download' },
    '图片素材下载': { zh:'图片素材下载', 'zh-TW':'圖片素材下載', en:'Image assets download' },
    '在线音乐搜索': { zh:'在线音乐搜索', 'zh-TW':'在線音樂搜索', en:'Online music search' },
    '视频在线解析': { zh:'视频在线解析', 'zh-TW':'視頻在線解析', en:'Online video parser' },
    '在线相册存储': { zh:'在线相册存储', 'zh-TW':'在線相冊存儲', en:'Online photo album' },
    '视频弹幕网站': { zh:'视频弹幕网站', 'zh-TW':'視頻彈幕網站', en:'Video & danmaku community' },
    '国产高性能大模型': { zh:'国产高性能大模型', 'zh-TW':'國產高性能大模型', en:'Chinese high-performance LLM' },
    '在线界面设计协作': { zh:'在线界面设计协作', 'zh-TW':'在線界面設計協作', en:'Online interface design' },
    '高校慕课平台': { zh:'高校慕课平台', 'zh-TW':'高校慕課平台', en:'University MOOC platform' },
    'OpenAI 智能对话助手': { zh:'OpenAI 智能对话助手', 'zh-TW':'OpenAI 智能對話助手', en:'OpenAI conversational assistant' },
    'Anthropic 推出的 AI 助手': { zh:'Anthropic 推出的 AI 助手', 'zh-TW':'Anthropic 推出的 AI 助手', en:'AI assistant by Anthropic' },
    '国产高性能大模型对话': { zh:'国产高性能大模型对话', 'zh-TW':'國產高性能大模型對話', en:'Chinese LLM chat' },
    '长文本处理 AI 助手': { zh:'长文本处理 AI 助手', 'zh-TW':'長文本處理 AI 助手', en:'Long-context AI assistant' },
    'AI 图片与视频生成': { zh:'AI 图片与视频生成', 'zh-TW':'AI 圖片與視頻生成', en:'AI image & video generation' },
    'AI 驱动的语义搜索': { zh:'AI 驱动的语义搜索', 'zh-TW':'AI 驅動的語義搜索', en:'AI-powered semantic search' },
    '带引用来源的 AI 搜索': { zh:'带引用来源的 AI 搜索', 'zh-TW':'帶引用來源的 AI 搜索', en:'AI search with citations' },
    'AI 搜索与内容生成': { zh:'AI 搜索与内容生成', 'zh-TW':'AI 搜索與內容生成', en:'AI search & content generation' },
    'AI 视频与图片创作': { zh:'AI 视频与图片创作', 'zh-TW':'AI 視頻與圖片創作', en:'AI video & image creation' },
    'AI 音频分离': { zh:'AI 音频分离', 'zh-TW':'AI 音頻分離', en:'AI audio separation' },
    'Adobe 创意作品集': { zh:'Adobe 创意作品集', 'zh-TW':'Adobe 創意作品集', en:'Adobe creative portfolio' },
    'IT 数码资讯': { zh:'IT 数码资讯', 'zh-TW':'IT 數碼資訊', en:'IT & gadget news' },
    'Logo 设计': { zh:'Logo 设计', 'zh-TW':'Logo 設計', en:'Logo design' },
    'OCR 文字识别': { zh:'OCR 文字识别', 'zh-TW':'OCR 文字識別', en:'OCR text recognition' },
    'PDF 在线处理': { zh:'PDF 在线处理', 'zh-TW':'PDF 在線處理', en:'Online PDF toolkit' },
    'SEO 与备案查询': { zh:'SEO 与备案查询', 'zh-TW':'SEO 與備案查詢', en:'SEO & ICP filing lookup' },
    'Web 技术教程': { zh:'Web 技术教程', 'zh-TW':'Web 技術教程', en:'Web technology tutorials' },
    'Web 技术文档': { zh:'Web 技术文档', 'zh-TW':'Web 技術文檔', en:'Web technology docs' },
    'Web 技术权威文档': { zh:'Web 技术权威文档', 'zh-TW':'Web 技術權威文檔', en:'Authoritative web docs (MDN)' },
    '一键自动去除背景': { zh:'一键自动去除背景', 'zh-TW':'一鍵自動去除背景', en:'One-click background removal' },
    '中小学教育资源': { zh:'中小学教育资源', 'zh-TW':'中小學教育資源', en:'K-12 education resources' },
    '中文技术社区': { zh:'中文技术社区', 'zh-TW':'中文技術社區', en:'Chinese tech community' },
    '书评与书单': { zh:'书评与书单', 'zh-TW':'書評與書單', en:'Book reviews & lists' },
    '二手交易平台': { zh:'二手交易平台', 'zh-TW':'二手交易平臺', en:'Second-hand marketplace' },
    '二维码生成': { zh:'二维码生成', 'zh-TW':'二維碼生成', en:'QR code generator' },
    '互联网垂直招聘': { zh:'互联网垂直招聘', 'zh-TW':'互聯網垂直招聘', en:'Internet industry recruiting' },
    '免抠设计元素': { zh:'免抠设计元素', 'zh-TW':'免摳設計元素', en:'Cut-out design elements' },
    '免费图片与视频': { zh:'免费图片与视频', 'zh-TW':'免費圖片與視頻', en:'Free images & video' },
    '免费正版素材库': { zh:'免费正版素材库', 'zh-TW':'免費正版素材庫', en:'Free licensed stock library' },
    '全平台热榜聚合': { zh:'全平台热榜聚合', 'zh-TW':'全平臺熱榜聚合', en:'Trending topics aggregator' },
    '全球程序员问答社区': { zh:'全球程序员问答社区', 'zh-TW':'全球程序員問答社區', en:'Global Q&A for programmers' },
    '兴趣主题社区': { zh:'兴趣主题社区', 'zh-TW':'興趣主題社區', en:'Interest-based community' },
    '创意工作者社区': { zh:'创意工作者社区', 'zh-TW':'創意工作者社區', en:'Community for creatives' },
    '前端代码在线演示': { zh:'前端代码在线演示', 'zh-TW':'前端代碼在線演示', en:'Online frontend playground' },
    '动漫在线': { zh:'动漫在线', 'zh-TW':'動漫在線', en:'Anime streaming' },
    '动漫在线观看': { zh:'动漫在线观看', 'zh-TW':'動漫在線觀看', en:'Watch anime online' },
    '动漫影视': { zh:'动漫影视', 'zh-TW':'動漫影視', en:'Anime & film' },
    '动漫种子': { zh:'动漫种子', 'zh-TW':'動漫種子', en:'Anime torrents' },
    '动漫种子分享': { zh:'动漫种子分享', 'zh-TW':'動漫種子分享', en:'Anime torrent sharing' },
    '动漫观看': { zh:'动漫观看', 'zh-TW':'動漫觀看', en:'Anime watching' },
    '动漫视频': { zh:'动漫视频', 'zh-TW':'動漫視頻', en:'Anime video' },
    '动漫资源': { zh:'动漫资源', 'zh-TW':'動漫資源', en:'Anime resources' },
    '原子化 CSS 框架': { zh:'原子化 CSS 框架', 'zh-TW':'原子化 CSS 框架', en:'Atomic CSS framework (Tailwind)' },
    '友链查询分析': { zh:'友链查询分析', 'zh-TW':'友鏈查詢分析', en:'Backlink &友链 analysis' },
    '名校开放课程': { zh:'名校开放课程', 'zh-TW':'名校開放課程', en:'Open courses from top universities' },
    '国产在线设计工具': { zh:'国产在线设计工具', 'zh-TW':'國產在線設計工具', en:'Chinese online design tool' },
    '国内 AI 绘画模型社区': { zh:'国内 AI 绘画模型社区', 'zh-TW':'國內 AI 繪畫模型社區', en:'Chinese AI art model community' },
    '国内外名校课程': { zh:'国内外名校课程', 'zh-TW':'國內外名校課程', en:'Courses from top universities' },
    '国内技术内容社区': { zh:'国内技术内容社区', 'zh-TW':'國內技術內容社區', en:'Chinese tech content community' },
    '国际在线课程': { zh:'国际在线课程', 'zh-TW':'國際在線課程', en:'International online courses' },
    '国际设计作品社区': { zh:'国际设计作品社区', 'zh-TW':'國際設計作品社區', en:'Global design portfolio community' },
    '图片修复': { zh:'图片修复', 'zh-TW':'圖片修復', en:'Photo restoration' },
    '图片无损压缩': { zh:'图片无损压缩', 'zh-TW':'圖片無損壓縮', en:'Lossless image compression' },
    '图片无损放大': { zh:'图片无损放大', 'zh-TW':'圖片無損放大', en:'AI image upscaling' },
    '在线代码编辑器': { zh:'在线代码编辑器', 'zh-TW':'在線代碼編輯器', en:'Online code editor' },
    '在线印章制作': { zh:'在线印章制作', 'zh-TW':'在線印章製作', en:'Online stamp maker' },
    '在线图像编辑': { zh:'在线图像编辑', 'zh-TW':'在線圖像編輯', en:'Online image editing' },
    '在线图片编辑': { zh:'在线图片编辑', 'zh-TW':'在線圖片編輯', en:'Online photo editing' },
    '在线图片设计': { zh:'在线图片设计', 'zh-TW':'在線圖片設計', en:'Online graphic design' },
    '在线工具合集': { zh:'在线工具合集', 'zh-TW':'在線工具合集', en:'Online tools collection' },
    '在线工具箱': { zh:'在线工具箱', 'zh-TW':'在線工具箱', en:'Online toolbox' },
    '在线平面设计': { zh:'在线平面设计', 'zh-TW':'在線平面設計', en:'Online graphic design' },
    '在线平面设计工具': { zh:'在线平面设计工具', 'zh-TW':'在線平面設計工具', en:'Online graphic design tool' },
    '在线影视播放': { zh:'在线影视播放', 'zh-TW':'在線影視播放', en:'Online movie streaming' },
    '在线影视资源': { zh:'在线影视资源', 'zh-TW':'在線影視資源', en:'Online film resources' },
    '在线抠图与设计': { zh:'在线抠图与设计', 'zh-TW':'在線摳圖與設計', en:'Online cutout & design' },
    '在线流程图思维导图': { zh:'在线流程图思维导图', 'zh-TW':'在線流程圖思維導圖', en:'Online flowchart & mind map' },
    '在线电影观看': { zh:'在线电影观看', 'zh-TW':'在線電影觀看', en:'Watch movies online' },
    '在线观影': { zh:'在线观影', 'zh-TW':'在線觀影', en:'Online viewing' },
    '在线视频站点': { zh:'在线视频站点', 'zh-TW':'在線視頻站點', en:'Online video site' },
    '在线设计与海报制作': { zh:'在线设计与海报制作', 'zh-TW':'在線設計與海報製作', en:'Online design & poster maker' },
    '地图与生活服务': { zh:'地图与生活服务', 'zh-TW':'地圖與生活服務', en:'Maps & local services' },
    '地图导航服务': { zh:'地图导航服务', 'zh-TW':'地圖導航服務', en:'Map & navigation' },
    '域名备案信息': { zh:'域名备案信息', 'zh-TW':'域名備案信息', en:'Domain ICP filing' },
    '多地 Ping 检测': { zh:'多地 Ping 检测', 'zh-TW':'多地 Ping 檢測', en:'Multi-location ping test' },
    '大纲笔记与思维导图': { zh:'大纲笔记与思维导图', 'zh-TW':'大綱筆記與思維導圖', en:'Outline notes & mind maps' },
    '字节跳动 AI 对话助手': { zh:'字节跳动 AI 对话助手', 'zh-TW':'字節跳動 AI 對話助手', en:'ByteDance AI assistant (Doubao)' },
    '实时热点榜': { zh:'实时热点榜', 'zh-TW':'實時熱點榜', en:'Real-time trending list' },
    '屏幕录制': { zh:'屏幕录制', 'zh-TW':'屏幕錄製', en:'Screen recording' },
    '开发者博客平台': { zh:'开发者博客平台', 'zh-TW':'開發者博客平臺', en:'Developer blogging platform' },
    '开发者教育资源': { zh:'开发者教育资源', 'zh-TW':'開發者教育資源', en:'Developer education resources' },
    '开源导航站项目': { zh:'开源导航站项目', 'zh-TW':'開源導航站項目', en:'Open-source navigation site' },
    '影视下载': { zh:'影视下载', 'zh-TW':'影視下載', en:'Movie downloads' },
    '影视搜索': { zh:'影视搜索', 'zh-TW':'影視搜索', en:'Movie search' },
    '影视资源': { zh:'影视资源', 'zh-TW':'影視資源', en:'Film & TV resources' },
    '影视资源下载': { zh:'影视资源下载', 'zh-TW':'影視資源下載', en:'Film & TV downloads' },
    '快递物流查询': { zh:'快递物流查询', 'zh-TW':'快遞物流查詢', en:'Express & logistics tracking' },
    '技术问题问答平台': { zh:'技术问题问答平台', 'zh-TW':'技術問題問答平臺', en:'Tech Q&A platform' },
    '招聘求职平台': { zh:'招聘求职平台', 'zh-TW':'招聘求職平臺', en:'Job search platform' },
    '拼团购物平台': { zh:'拼团购物平台', 'zh-TW':'拼團購物平臺', en:'Group-buying shopping' },
    '效率工具与技巧': { zh:'效率工具与技巧', 'zh-TW':'效率工具與技巧', en:'Productivity tools & tips' },
    '数据行业资讯': { zh:'数据行业资讯', 'zh-TW':'數據行業資訊', en:'Data industry news' },
    '文件格式转换': { zh:'文件格式转换', 'zh-TW':'文件格式轉換', en:'File format conversion' },
    '新一代前端构建工具': { zh:'新一代前端构建工具', 'zh-TW':'新一代前端構建工具', en:'Next-gen frontend build tool (Vite)' },
    '新闻聚合推荐': { zh:'新闻聚合推荐', 'zh-TW':'新聞聚合推薦', en:'News aggregation' },
    '旅行比价平台': { zh:'旅行比价平台', 'zh-TW':'旅行比價平臺', en:'Travel price comparison' },
    '本地生活服务': { zh:'本地生活服务', 'zh-TW':'本地生活服務', en:'Local lifestyle services' },
    '机票酒店预订': { zh:'机票酒店预订', 'zh-TW':'機票酒店預訂', en:'Flight & hotel booking' },
    '权威天气预报': { zh:'权威天气预报', 'zh-TW':'權威天氣預報', en:'Authoritative weather forecast' },
    '海报与图片设计': { zh:'海报与图片设计', 'zh-TW':'海報與圖片設計', en:'Poster & image design' },
    '清华慕课平台': { zh:'清华慕课平台', 'zh-TW':'清華慕課平臺', en:'MOOC platform (XuetangX)' },
    '清华系大模型对话': { zh:'清华系大模型对话', 'zh-TW':'清華系大模型對話', en:'Tsinghua LLM chat (ChatGLM)' },
    '渐进式前端框架': { zh:'渐进式前端框架', 'zh-TW':'漸進式前端框架', en:'Progressive frontend framework (Vue)' },
    '游戏化语言学习': { zh:'游戏化语言学习', 'zh-TW':'遊戲化語言學習', en:'Gamified language learning' },
    '生活缴费与支付': { zh:'生活缴费与支付', 'zh-TW':'生活繳費與支付', en:'Bill payment' },
    '用户界面构建库': { zh:'用户界面构建库', 'zh-TW':'用戶界面構建庫', en:'UI library (React)' },
    '电影下载': { zh:'电影下载', 'zh-TW':'電影下載', en:'Movie downloads' },
    '百度大模型对话': { zh:'百度大模型对话', 'zh-TW':'百度大模型對話', en:'Baidu LLM chat (Ernie)' },
    '直聊式招聘平台': { zh:'直聊式招聘平台', 'zh-TW':'直聊式招聘平臺', en:'Direct-chat recruiting' },
    '知名 AI 绘画工具': { zh:'知名 AI 绘画工具', 'zh-TW':'知名 AI 繪畫工具', en:'Popular AI art tool (Midjourney)' },
    '短视频解析': { zh:'短视频解析', 'zh-TW':'短視頻解析', en:'Short video parser' },
    '磁力资源搜索': { zh:'磁力资源搜索', 'zh-TW':'磁力資源搜索', en:'Magnet link search' },
    '社交化阅读平台': { zh:'社交化阅读平台', 'zh-TW':'社交化閱讀平臺', en:'Social reading platform' },
    '种子资源搜索': { zh:'种子资源搜索', 'zh-TW':'種子資源搜索', en:'Torrent search' },
    '科技产品资讯': { zh:'科技产品资讯', 'zh-TW':'科技產品資訊', en:'Tech product news' },
    '科技创投资讯': { zh:'科技创投资讯', 'zh-TW':'科技創投資訊', en:'Tech & VC news' },
    '综合招聘服务': { zh:'综合招聘服务', 'zh-TW':'綜合招聘服務', en:'General recruitment service' },
    '综合站长工具箱': { zh:'综合站长工具箱', 'zh-TW':'綜合站長工具箱', en:'Webmaster toolbox' },
    '综合网购平台': { zh:'综合网购平台', 'zh-TW':'綜合網購平臺', en:'Online shopping platform' },
    '编程入门教程': { zh:'编程入门教程', 'zh-TW':'編程入門教程', en:'Programming tutorials for beginners' },
    '网站权重查询': { zh:'网站权重查询', 'zh-TW':'網站權重查詢', en:'Site authority check' },
    '美剧下载': { zh:'美剧下载', 'zh-TW':'美劇下載', en:'US drama downloads' },
    '美剧在线': { zh:'美剧在线', 'zh-TW':'美劇在線', en:'US drama streaming' },
    '美剧字幕与资源': { zh:'美剧字幕与资源', 'zh-TW':'美劇字幕與資源', en:'US drama subtitles & resources' },
    '美剧观看': { zh:'美剧观看', 'zh-TW':'美劇觀看', en:'Watch US dramas' },
    '美剧资源': { zh:'美剧资源', 'zh-TW':'美劇資源', en:'US drama resources' },
    '自营电商与物流': { zh:'自营电商与物流', 'zh-TW':'自營電商與物流', en:'Self-run ecommerce & logistics' },
    '舆情事件分析': { zh:'舆情事件分析', 'zh-TW':'輿情事件分析', en:'Public opinion analysis' },
    '设计师互动平台': { zh:'设计师互动平台', 'zh-TW':'設計師互動平臺', en:'Designer community' },
    '设计师学习平台': { zh:'设计师学习平台', 'zh-TW':'設計師學習平臺', en:'Design learning platform' },
    '设计灵感采集': { zh:'设计灵感采集', 'zh-TW':'設計靈感採集', en:'Design inspiration collection' },
    '词云生成': { zh:'词云生成', 'zh-TW':'詞雲生成', en:'Word cloud generator' },
    '资源搜索': { zh:'资源搜索', 'zh-TW':'資源搜索', en:'Resource search' },
    '软件下载': { zh:'软件下载', 'zh-TW':'軟件下載', en:'Software downloads' },
    '软件分享博客': { zh:'软件分享博客', 'zh-TW':'軟件分享博客', en:'Software blog' },
    '软件推荐': { zh:'软件推荐', 'zh-TW':'軟件推薦', en:'Software recommendations' },
    '软件资源': { zh:'软件资源', 'zh-TW':'軟件資源', en:'Software resources' },
    '软件资源站': { zh:'软件资源站', 'zh-TW':'軟件資源站', en:'Software resource site' },
    '软件资讯': { zh:'软件资讯', 'zh-TW':'軟件資訊', en:'Software news' },
    '轻量代码片段测试': { zh:'轻量代码片段测试', 'zh-TW':'輕量代碼片段測試', en:'Lightweight code snippet testing' },
    '铁路官方购票': { zh:'铁路官方购票', 'zh-TW':'鐵路官方購票', en:'Official railway ticketing (12306)' },
    '问答与内容社区': { zh:'问答与内容社区', 'zh-TW':'問答與內容社區', en:'Q&A & content community (Zhihu)' },
    '阿里云大模型对话': { zh:'阿里云大模型对话', 'zh-TW':'阿里雲大模型對話', en:'Alibaba Cloud LLM chat (Qwen)' },
    '阿里出品的 AI 设计工具': { zh:'阿里出品的 AI 设计工具', 'zh-TW':'阿里出品的 AI 設計工具', en:'Alibaba AI design tool' },
    '音频处理': { zh:'音频处理', 'zh-TW':'音頻處理', en:'Audio processing' },
    '高质量免费图库': { zh:'高质量免费图库', 'zh-TW':'高質量免費圖庫', en:'High-quality free photo library' }
};

/* 站名 / 标语 / 页脚 */
var SITE_I18N = {
    'name': { zh:'我的导航', 'zh-TW':'我的導航', en:'My Directory' },
    'slogan': { zh:'求知 · 探索 · 发现', 'zh-TW':'求知 · 探索 · 發現', en:'Explore · Discover · Learn' },
    'footer': { zh:'本站仅收录公开网站链接，版权归原站所有', 'zh-TW':'本站僅收錄公開網站連結，版權歸原站所有', en:'This site lists public links only; copyright belongs to original sites' }
};

/* 各语言一言句子库（按语言码索引）*/
var HITO_I18N = {
    zh: [ '求知 · 探索 · 发现', '工欲善其事，必先利其器', '好的导航不是收藏得多，而是找得到', '把时间花在创造上，而不是寻找上', '保持好奇，保持耐心' ],
    'zh-TW': [ '求知 · 探索 · 發現', '工欲善其事，必先利其器', '好的導航不是收藏得多，而是找得到', '把時間花在創造上，而不是尋找上', '保持好奇，保持耐心' ],
    en: [ 'Explore · Discover · Learn', 'A good directory is not about how much you save, but how fast you find', 'Spend time creating, not searching', 'Stay curious, stay patient', 'Simple, useful, no fuss' ]
};
