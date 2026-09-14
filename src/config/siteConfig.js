/* ============================================================================
 *  siteConfig.js —— 站点唯一配置文件
 *
 *  把这个文件里的占位内容改成你自己的信息，整站就会跟着变：
 *  终端自我介绍、桌面图标、弹窗、作品集、关于页、联系方式……
 *
 *  图片占位：public/avatar.svg（换成你自己的图片时保持文件名，或改 sticker.src）
 *  注意：src 请用相对路径（如 avatar.svg），不要以 / 开头，以兼容 GitHub Pages 子路径部署
 * ==========================================================================*/

export const siteConfig = {
  /* ---------- 基础身份（全部替换成你自己的） ---------- */
  osName: 'MyOS', // 菜单栏左上角的系统名，也是浏览器标签标题前缀
  name: '你的名字', // 终端 whoami 的输出，也是网站标题
  nameEn: 'Your Name', // 英文名 / 拼音（用于 subtitle、页脚等）
  slogan: '1 person + AI = 1 team', // 终端里金色高亮的口号
  role: '斜杠青年 / 创造者 / 终身学习者', // 一行身份标签
  description: '这里是你的名字的个人主页——一个以「操作系统」为灵感的互动空间，记录我在做的事情、写过的文字和做过的项目。', // SEO 描述

  /* ---------- 终端开场白（whoami 之后的自我介绍） ----------
   * 每行一条，会逐行打字机式输出。建议 2~4 行。 */
  bioLines: [
    '一个认真生活、认真创造的人',
    '兴趣：写代码 / 做设计 / 折腾各种新工具',
    '正在：用 AI 打造自己的第二大脑',
  ],

  /* ---------- 顶部导航副标题（作品集页） ---------- */
  navSubtitle: '你的名字 · 你的标签 · 你的坐标 → 你正在做的事',

  /* ---------- 联系方式 ---------- */
  email: 'you@example.com',
  socials: [
    // icon 用 emoji，label 会显示在终端告别屏上
    { icon: '📮', label: 'Email', text: 'you@example.com', href: 'mailto:you@example.com' },
    { icon: '🐙', label: 'GitHub', text: '@yourname', href: 'https://github.com/yourname' },
    // { icon: '📕', label: '小红书', text: '@你的账号', href: 'https://www.xiaohongshu.com/user/xxx' },
    // { icon: '💬', label: '微信公众号', text: '你的公众号', href: '#' },
  ],

  /* ---------- 告别屏格言 & 页脚 ---------- */
  quote: '“种一棵树最好的时间是十年前，其次是现在。”',
  quoteAuthor: '谚语',
  footer: '© 2026 Your Name · Built with AI & attitude',

  /* ---------- 桌面贴纸（可拖拽的那个小头像） ----------
   * 把 public/avatar.svg 换成你的头像 / IP 形象即可 */
  sticker: { src: 'avatar.svg', alt: '我的头像贴纸' },

  /* ---------- 首屏语义化导航（对 SEO 和无障碍友好，可选） ---------- */
  navLinks: [
    { label: '我的博客', href: 'https://example.com/blog' },
    { label: '项目集', href: 'https://example.com/projects' },
    { label: '关于我', href: 'https://example.com/about' },
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
    { type: 'link', label: '博客.md', href: 'https://example.com/blog', art: 'md', style: { top: '24px', right: '24px' } },
    { type: 'link', label: '读书笔记', href: 'https://example.com/notes', art: 'html', style: { top: '114px', right: '24px' } },
    { type: 'link', label: '随笔', href: 'https://example.com/essays', art: 'md', style: { top: '204px', right: '24px' } },
    { type: 'link', label: '相册', href: 'https://example.com/gallery', art: 'image', image: { src: 'avatar.svg', alt: '' }, style: { top: '294px', right: '24px' } },
    { type: 'window', label: '我的项目', win: 'win-projects', art: 'folder', style: { top: '24px', right: '114px' } },
    { type: 'link', label: 'GitHub', href: 'https://github.com/yourname', art: 'git', style: { top: '114px', right: '114px' } },
    { type: 'window', label: '联系我', win: 'win-contact', art: 'folder', style: { top: '204px', right: '114px' } },
    { type: 'window', label: 'AI 助手', win: 'win-assistant', art: 'image', image: { src: 'avatar.svg', alt: 'AI' }, style: { top: '294px', right: '114px' } },
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
      { icon: '💻', title: '合作方向 A', desc: '比如：技术咨询 / 项目协作<br />替换成你的合作方向' },
      { icon: '🎓', title: '合作方向 B', desc: '比如：分享 / 咨询 / 教学<br />替换成你的合作方向' },
    ],
  },

  /* ============================================================
   *  「我的项目」文件夹弹窗
   *  双击里面的文件图标会在新窗口中打开对应链接
   * ============================================================ */
  projects: [
    { label: '项目一 · 简介', href: 'https://example.com/project-1' },
    { label: '项目二 · 简介', href: 'https://example.com/project-2' },
    { label: '项目三 · 简介', href: 'https://example.com/project-3' },
    { label: 'GitHub Repo', href: 'https://github.com/yourname/your-repo' },
  ],

  /* ============================================================
   *  「AI 助手」演示弹窗（仿聊天界面，可整段删掉 desktopIcons 里对应图标）
   * ============================================================ */
  assistant: {
    name: '小助手',
    link: 'https://example.com', // “正在接入中”的跳转链接
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
      title: '写作',
      description: '在这里描述你这个维度的创作内容——写了什么、为什么写、收获了什么。',
      links: [
        ['📝', 'https://example.com/post-1', '文章一：标题占位'],
        ['📝', 'https://example.com/post-2', '文章二：标题占位'],
        ['→', 'https://example.com/blog', '更多内容：我的博客'],
      ],
    },
    {
      number: 'dim_02',
      title: '项目',
      description: '介绍你做过的项目——解决了什么问题、用了什么技术、达到了什么效果。',
      links: [
        ['🔧', 'https://example.com/project-1', '项目一：标题占位'],
        ['💻', 'https://github.com/yourname', 'GitHub 主页'],
      ],
    },
    {
      number: 'dim_03',
      title: '设计',
      description: '你的设计作品或视觉表达——海报、插画、网页等。',
      links: [['🎨', 'https://example.com/design', '作品集占位链接']],
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
      ['姓名', '你的名字（Your Name）'],
      ['坐标', '你的城市'],
      ['正在做', '一件让你兴奋的事'],
      ['可通过', '页面上的「联系我」图标找到'],
    ],
    skillsTitle: '已安装的「技能 App」',
    skills: ['技能一', '技能二', '技能三', '技能四', '技能五', '……替换成你的'],
    quote: '在这里写一句你的人生信条。',
  },
};

export default siteConfig;
