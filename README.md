# MyOS Homepage 🖥️

一个以「操作系统」为灵感的互动个人主页模板：访客先看到一台正在打字的终端，按下 Enter「开机」后，进入一个仿 macOS 的桌面——可拖拽的图标、可缩放的窗口、会躲鼠标的星星壁纸，以及一个会和你道别的告别屏。

> 原始设计与交互出自 [ESTHER不二](https://hiesther.me/) 的个人网站（[esther-website-1](https://github.com/esthersjw/esther-website-1)），本模板在其基础上将所有个人信息替换为占位内容，并重构为**改一个配置文件就能变成你自己的主页**。遵循原作 [CC BY-NC 4.0](./LICENSE) 许可（署名 - 非商业性使用）。

| 终端开机 | 个人桌面 |
| --- | --- |
| ![终端开机](docs/screenshot-terminal.png) | ![个人桌面](docs/screenshot-desktop.png) |
| **AI 助手窗口** | **关于页** |
| ![AI 助手窗口](docs/screenshot-assistant.png) | ![关于页](docs/screenshot-about.png) |

## ✨ 特性

- 🖱️ **零后端、零数据库** —— 纯静态站点，构建产物可直接部署到 GitHub Pages / Vercel / Netlify
- ⚙️ **单文件配置** —— 所有内容（名字、简介、社交链接、桌面图标、作品集、关于页）集中在 [`src/config/siteConfig.js`](src/config/siteConfig.js)
- 🖥️ **完整 OS 隐喻** —— 终端开机动画 → 桌面 → 窗口管理器（拖拽 / 缩放 / 红绿灯按钮）→ 告别屏循环
- 📱 **移动端适配**，并支持 `prefers-reduced-motion`
- ♿ **无障碍友好** —— 保留语义化摘要与键盘操作

## 🚀 快速开始

```bash
npm install
npm run dev      # 本地开发，默认 http://localhost:5173
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

要求 Node.js ≥ 18。

## 🎨 把模板变成你的（只需 3 步）

### 第 1 步：改配置

打开 [`src/config/siteConfig.js`](src/config/siteConfig.js)，把占位内容替换成你自己的信息。每个字段都有中文注释：

| 配置项 | 控制的内容 |
| --- | --- |
| `name` / `nameEn` / `role` / `slogan` | 终端 `whoami` 开场白、浏览器标题、作品集副标题 |
| `bioLines` | 终端里逐行打出的自我介绍（2~4 行） |
| `email` / `socials` | 「联系我」窗口与告别屏的联系方式 |
| `sticker` | 桌面左下角可拖拽的头像贴纸 |
| `desktopIcons` | 桌面图标：链接 / 内置窗口 / 图标外观 / 位置 |
| `contact` / `projects` / `assistant` | 三个内置弹窗的内容 |
| `workflowColumns` / `works` | 作品集页的工作流三栏与作品卡片 |
| `about` | 「关于」标签页（仿关于本机面板） |

### 第 2 步：换图片

把 [`public/avatar.svg`](public/avatar.svg) 替换成你的头像或 IP 形象（保持文件名不变最省事；换了文件名就同步改 `sticker.src`）。[`public/favicon.svg`](public/favicon.svg) 同理。

### 第 3 步：改配色（可选）

主题色集中在 [`src/styles/site.css`](src/styles/site.css) 顶部的 `:root` 变量里：

```css
--blue: #2B7FD8;    /* 主色 */
--yellow: #F4D758;  /* 高亮 / 口号 */
--red: #E84A5F;     /* 点缀 */
--cream: #fefcf6;   /* 米白底色 */
```

> 小提示：桌面图标位置由 `desktopIcons` 里每个图标的 `style.top / style.right` 控制，随手改数值即可重新布局。

## 🌐 部署到 GitHub Pages

仓库已内置 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)，推送后自动构建部署：

1. 把本仓库推到你的 GitHub
2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**
3. 等待 Actions 跑完，访问 `https://<你的用户名>.github.io/<仓库名>/`

也可以用 Vercel / Netlify：框架选 Vite，构建命令 `npm run build`，产物目录 `dist`。

## 📁 项目结构

```
├── index.html                    # 入口 HTML（标题/描述由配置运行时覆盖）
├── public/
│   ├── avatar.svg                # 占位头像贴纸 ← 换成你的
│   └── favicon.svg
└── src/
    ├── config/siteConfig.js      # ★ 站点唯一配置文件
    ├── components/
    │   ├── HomePage.jsx          # 页面结构（主页 / 作品集 / 关于 + 内置弹窗）
    │   └── homeData.js           # 壁纸星星（纯装饰）
    ├── lib/siteController.js     # 交互控制器：开机动画 / 窗口管理 / 告别循环
    └── styles/site.css           # 全部样式与动画
```

## 📄 许可证

本模板衍生自 [ESTHER不二](https://hiesther.me/) 的个人网站设计，依其原始许可以 [CC BY-NC 4.0](./LICENSE)（署名 - 非商业性使用 4.0 国际）发布：

- ✅ 可自由使用、修改、二次分发（需保留署名）
- ❌ 不得用于商业目的

如果你也做出了自己的版本，欢迎给原作作者和本仓库都点个 Star ⭐
