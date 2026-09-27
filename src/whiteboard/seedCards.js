// 预制种子卡：owner 固定为 kael（管理员），访客只读。
// 布局与文案已由 Esther 亲手排版（2026-08-18），如需调整：
// 管理员拖拽/双击后，把 localStorage['wb.seedOverrides.v1'] 发回来重新固化。

export const seedCards = [
  {
    id: 'seed-vote-who',
    kind: 'seed',
    owner: 'kael',
    tpl: 'vote',
    data: {
      question: '🕵️ 你是谁派来的？',
      options: [
        { text: '📕 小红书观光团', votes: [] },
        { text: '🫂 朋友按头安利', votes: [] },
        { text: '🌀 互联网迷路误入', votes: [] },
        { text: '🤖 我是 AI，来视察的', votes: [] },
      ],
    },
    x: 631,
    y: 140,
    w: 300,
    h: 320,
    createdAt: 0,
  },
  {
    id: 'seed-welcome',
    kind: 'seed',
    owner: 'kael',
    tpl: 'washi',
    data: {
      title: '👋hello！',
      body: '来跟我一起装扮QQ空间吧～\n🪪 留一张你的名片（自我介绍卡）\n📸 贴一张拍立得，😆 扔个贴纸\n🗳️ 发起或参与一个投票\n\n只能改/删自己创建的东西，别人的碰不得哦。',
    },
    x: 951,
    y: 325,
    w: 380,
    h: 280,
    createdAt: 0,
  },
  {
    id: 'seed-about',
    kind: 'seed',
    owner: 'kael',
    tpl: 'profile',
    data: {
      avatarImg: 'avatar.png',
      name: '汤勇 Kael Odin',
      sub: 'AI 应用工程师 / 测试工程师',
      slogan: '欢迎来到我的共享白板',
      belief: '先跑通，再讲清楚。',
      links: [
        { label: '🐙 GitHub', href: 'https://github.com/kael-odin' },
        { label: '📝 我的博客', href: 'https://odin-saga.vercel.app/' },
      ],
    },
    x: 303,
    y: 478,
    w: 380,
    h: 360,
    createdAt: 0,
  },

  // ---------- 拍立得照片墙 ----------
  {
    id: 'seed-polaroid-buer',
    kind: 'seed',
    owner: 'kael',
    tpl: 'polaroid',
    data: { image: 'avatar.png', caption: 'Hello！我是汤勇！' },
    x: 701,
    y: 479,
    w: 230,
    h: 340,
    createdAt: 0,
  },
  {
    id: 'seed-polaroid-portrait',
    kind: 'seed',
    owner: 'kael',
    tpl: 'polaroid',
    data: { image: 'sticker.png', caption: '平时的一角：猫与薯片' },
    x: 943,
    y: 629,
    w: 230,
    h: 380,
    createdAt: 0,
  },
  {
    id: 'seed-polaroid-birthday',
    kind: 'seed',
    owner: 'kael',
    tpl: 'polaroid',
    data: { image: 'avatar.png', caption: '折腾是种生产力～' },
    x: 699,
    y: 840,
    w: 230,
    h: 430,
    createdAt: 0,
  },

  // ---------- 手绘卡 ----------
  {
    id: 'seed-sticky-intj',
    kind: 'seed',
    owner: 'kael',
    tpl: 'sticky',
    data: { text: '测试 🧪\n安静地守护质量' },
    x: 1183,
    y: 633,
    w: 220,
    h: 170,
    createdAt: 0,
  },
  {
    id: 'seed-darkquote',
    kind: 'seed',
    owner: 'kael',
    tpl: 'darkquote',
    data: { text: '"先跑通，再讲清楚。"', author: '汤勇' },
    x: 337,
    y: 925,
    w: 340,
    h: 190,
    createdAt: 0,
  },
];

// 留言卡可选颜色
export const messageColors = ['#ffd166', '#ff9f9f', '#a8d8ff', '#b8f0c8', '#e6c9ff', '#ffe8a3'];
