/* ============================================================================
 *  siteConfig.js —— 站点唯一配置文件
 *
 *  把这个文件里的占位内容改成你自己的信息，整站就会跟着变：
 *  终端自我介绍、桌面图标、弹窗、作品集、关于页、联系方式……
 *
 *  图片占位：public/avatar.png（换成你自己的图片时保持文件名，或改 sticker.src）
 *  注意：src 请用相对路径（如 avatar.png），不要以 / 开头，以兼容 GitHub Pages 子路径部署
 * ==========================================================================*/

export const siteConfig = {
  /* ---------- 基础身份（全部替换成你自己的） ---------- */
  osName: 'MyOS', // 菜单栏左上角的系统名，也是浏览器标签标题前缀
  name: '汤勇', // 终端 whoami 的输出，也是网站标题
  nameEn: 'Kael Odin', // 英文名 / 拼音（用于 subtitle、页脚等）
  slogan: '1 person + AI = 1 team', // 终端里金色高亮的口号
  role: 'AI 应用工程师 / 测试工程师 / 开源爱好者', // 一行身份标签
  description: '汤勇（Kael Odin）的个人主页——AI 应用工程师 / 测试工程师：大模型私有化部署、企业知识库、自动化测试与开源工具。', // SEO 描述

  /* ---------- 终端开场白（whoami 之后的自我介绍） ----------
   * 每行一条，会逐行打字机式输出。建议 2~4 行。 */
  bioLines: [
    '测试工程师：守护三条代理/数据采集产品线的质量',
    'AI 落地：llama.cpp 私有化部署 / FastGPT 知识库',
    '业余：把想法做成开源工具与自动化流水线',
  ],

  /* ---------- 顶部导航副标题（作品集页） ---------- */
  navSubtitle: '汤勇 Kael Odin · AI 应用工程师 / 测试工程师 · 江苏徐州',

  /* ---------- 联系方式 ---------- */
  email: 'sczxtangyong@163.com',
  socials: [
    // icon 用 emoji，label 会显示在终端告别屏上
    { icon: '📮', label: 'Email', text: 'sczxtangyong@163.com', href: 'mailto:sczxtangyong@163.com' },
    { icon: '🐙', label: 'GitHub', text: '@kael-odin', href: 'https://github.com/kael-odin' },
    { icon: '📝', label: 'Blog', text: 'odin-saga.vercel.app', href: 'https://odin-saga.vercel.app/' },
  ],

  /* ---------- 告别屏格言 & 页脚 ---------- */
  quote: '“种一棵树最好的时间是十年前，其次是现在。”',
  quoteAuthor: '谚语',
  footer: '© 2026 汤勇 Kael Odin · Built with AI & attitude',

  /* ---------- 桌面贴纸（可拖拽的那个小头像） ----------
   * 把 public/avatar.svg 换成你的头像 / IP 形象即可 */
  sticker: { src: 'avatar.png', alt: '汤勇的头像贴纸' },

  /* ---------- 首屏语义化导航（对 SEO 和无障碍友好，可选） ---------- */
  navLinks: [
    { label: '我的博客', href: 'https://odin-saga.vercel.app/' },
    { label: '项目集', href: 'https://github.com/kael-odin?tab=repositories' },
    { label: '关于我', href: 'https://kael-odin.github.io/odin-bifrost/about/' },
  ],

  /* ---------- 菜单栏（OS 桌面顶部，可点击跳转到对应标签页） ----------
   * tab 可填 'home' | 'works' | 'about'；不填 tab 则仅作装饰展示 */
  menuItems: [
    { label: 'About', tab: 'about' },
    { label: 'Works', tab: 'works' },
    { label: 'Now', tab: '' },
  ],

  /* ============================================================
   *  桌面图标
   *  type: 'link'   → 双击后在系统窗口里以 iframe 打开 href
   *  type: 'window' → 双击后打开内置弹窗（win 必须与 HomePage.jsx 里 WindowTemplates
   *                    的弹窗 id 一致：win-hello / win-contact / win-projects /
   *                    win-assistant / win-meta）
   *  art:  'md' | 'html' | 'git' | 'png' | 'folder' | 'image' | 'birthday'
   *        （图标外观：md/html/git/png 带对应扩展角标，image 显示自定义图片，
   *          birthday 是礼物盒彩蛋图标）
   *  style: 桌面位置。默认从右上角排两列，可自由调整 top / right
   * ============================================================ */
  desktopIcons: [
    { type: 'link', label: '博客.md', href: 'https://odin-saga.vercel.app/', art: 'md', style: { top: '24px', right: '24px' } },
    { type: 'link', label: '学术Skill榜', href: 'https://github.com/kael-odin/awesome-academic-research-skills', art: 'md', style: { top: '114px', right: '24px' } },
    { type: 'link', label: '提示词镜像', href: 'https://kael-odin.github.io/prompts-chat-zh/', art: 'md', style: { top: '204px', right: '24px' } },
    { type: 'link', label: 'Amadeus-Agent', href: 'https://github.com/kael-odin/Amadeus-Agent', art: 'html', style: { top: '294px', right: '24px' } },
    { type: 'window', label: '我的项目', win: 'win-projects', art: 'folder', style: { top: '24px', right: '114px' } },
    { type: 'link', label: 'GitHub', href: 'https://github.com/kael-odin', art: 'git', style: { top: '114px', right: '114px' } },
    { type: 'window', label: '联系我', win: 'win-contact', art: 'folder', style: { top: '204px', right: '114px' } },
    { type: 'window', label: 'AI 助手', win: 'win-assistant', art: 'image', image: { src: 'avatar.png', alt: 'AI' }, style: { top: '294px', right: '114px' } },
    { type: 'window', label: '使用指南', win: 'win-hello', art: 'folder', style: { top: '24px', right: '204px' } },
    { type: 'window', label: '关于本站', win: 'win-meta', art: 'folder', style: { top: '114px', right: '204px' } },
  ],

  /* ============================================================
   *  「联系我」弹窗
   * ============================================================ */
  contact: {
    title: '联系我',
    heading: '来找我玩 ✨',
    sub: '期待与你连接',
    services: [
      // 两张服务/合作卡片，不需要就删掉
      { icon: '🤖', title: 'AI 落地', desc: 'llama.cpp 私有化部署 / FastGPT 知识库<br />模型与 Agent 工具选型评测' },
      { icon: '🧪', title: '测试工程', desc: '接口测试 / 抓包分析<br />Playwright Web UI 自动化' },
    ],
  },

  /* ============================================================
   *  「我的项目」文件夹弹窗
   *  双击里面的文件图标会在新窗口中打开对应链接
   * ============================================================ */
  projects: [
    { label: '学术 Skill 每日榜 · 85★', href: 'https://github.com/kael-odin/awesome-academic-research-skills' },
    { label: '提示词中文镜像 · 2205 条', href: 'https://kael-odin.github.io/prompts-chat-zh/' },
    { label: 'Amadeus-Agent · 单文件工作台', href: 'https://github.com/kael-odin/Amadeus-Agent' },
    { label: 'openworker 中文汉化 · 27★', href: 'https://github.com/kael-odin/openworker' },
  ],

  /* ============================================================
   *  「AI 助手」演示弹窗（仿聊天界面，可整段删掉 desktopIcons 里对应图标）
   * ============================================================ */
  assistant: {
    name: '小助手',
    link: 'https://github.com/kael-odin', // “正在接入中”的跳转链接
    dialog: [
      { role: 'user', text: '嗨，跟来看主页的朋友打个招呼吧' },
      { role: 'bot', text: '嘿，我是站长的小助手（占位演示）。<br /><br />把这里换成你和你的 AI 助手的真实对话，或者删掉这个图标。' },
      { role: 'user', text: '好的，就展示到这吧 😄' },
      { role: 'bot', text: '随时来聊。' },
    ],
  },

  /* ============================================================
   *  作品集页
   *  workflowColumns: 顶部三列工作流概览
   *  works: 作品维度卡片。links: [emoji, href, 标签]；empty: 占位文案
   * ============================================================ */
  workflowColumns: [
    {
      title: 'INPUT · 输入',
      items: [
        ['阅读', '记录读过的书、文章和灵感碎片'],
        ['观察', '收集行业动态与优秀案例'],
        ['思考', '把输入沉淀成自己的框架'],
      ],
    },
    {
      title: 'CREATE · 创造',
      items: [
        ['写作', '博客、教程、随笔与分享'],
        ['项目', '用代码把想法做成能用的小工具'],
        ['设计', '海报、页面与个人品牌物料'],
      ],
    },
    {
      title: 'SHARE · 分享',
      items: [
        ['发布', '博客 / 社媒 / 开源社区'],
        ['交流', '和同好互相反馈、共同成长'],
        ['复盘', '定期回顾，让方法论可复用'],
      ],
    },
  ],
  works: [
    {
      number: 'dim_01',
      title: '开源',
      description: '业余持续输出：把踩坑过程沉淀成模板、镜像站与自动化榜单。',
      links: [
        ['📊', 'https://github.com/kael-odin/awesome-academic-research-skills', '学术 Skill 每日榜 · 85★'],
        ['🔤', 'https://kael-odin.github.io/prompts-chat-zh/', '提示词中文镜像 · 2205 条'],
        ['→', 'https://github.com/kael-odin?tab=repositories', '更多仓库'],
      ],
    },
    {
      number: 'dim_02',
      title: '项目',
      description: '工作与创业中的工程实践——大模型私有化部署、知识库与小程序。',
      links: [
        ['🤖', 'https://github.com/kael-odin/Amadeus-Agent', 'Amadeus-Agent 工作台'],
        ['💻', 'https://github.com/kael-odin', 'GitHub 主页'],
      ],
    },
    {
      number: 'dim_03',
      title: '写作',
      description: '博客记录项目复盘、工具评测与折腾过程。',
      links: [['📝', 'https://odin-saga.vercel.app/', '我的博客 · odin-saga']],
    },
    {
      number: 'dim_04',
      title: '更多',
      empty: '持续探索中 →',
    },
  ],

  /* ============================================================
   *  「关于」标签页（仿 macOS「关于本机」面板）
   * ============================================================ */
  about: {
    headline: 'About This Me',
    osVersion: 'MyOS 1.0 (Personal Edition)',
    chip: '一颗认真生活的大脑',
    memory: '无限的热情 × 有限的睡眠',
    lines: [
      // 键值对行：[标签, 内容]
      ['姓名', '汤勇（Kael Odin）'],
      ['坐标', '中国 · 江苏 · 徐州'],
      ['正在做', '代理/数据采集产品线的测试工程与大模型私有化部署'],
      ['可通过', 'sczxtangyong@163.com · GitHub @kael-odin'],
    ],
    skillsTitle: '已安装的「技能 App」',
    skills: ['Playwright 自动化', 'Postman / 抓包', 'llama.cpp 部署', 'FastGPT / RAG', 'Python / Java / SQL', 'GitHub Actions'],
    quote: '先跑通，再讲清楚。',
  },
};

export default siteConfig;
