import { useEffect } from 'react';
import siteConfig from '../config/siteConfig';
import {
  wallpaperStars,
} from './homeData';

/* 把配置里的 art 字段映射成 CSS 图标类名与扩展角标 */
function iconArt(icon) {
  switch (icon.art) {
    case 'md': return { className: 'dicon-art file ext-md', ext: '.md' };
    case 'html': return { className: 'dicon-art file ext-html', ext: '.html' };
    case 'git': return { className: 'dicon-art file ext-git', ext: '.git' };
    case 'folder': return { className: 'dicon-art folder', ext: undefined };
    case 'image': return { className: 'dicon-art file', ext: undefined };
    default: return { className: 'dicon-art file ext-md', ext: '.md' };
  }
}

function DesktopIcon({ icon }) {
  const art = iconArt(icon);
  return (
    <div className="dicon" data-href={icon.href} data-win={icon.win} style={icon.style}>
      <div className={art.className} data-ext={art.ext}>
        {icon.image && <img src={icon.image.src} alt={icon.image.alt} loading="lazy" />}
      </div>
      <div className="dicon-label">{icon.label}</div>
    </div>
  );
}

function FolderIcon({ href, win, extension, label }) {
  return (
    <div className="folder-icon" data-href={href} data-win={win}>
      <div className={`folder-icon-art file${extension === '.git' ? ' ext-git' : ' ext-html'}`} data-ext={extension}></div>
      <div className="folder-icon-label">{label}</div>
    </div>
  );
}

/* ---------- 内置弹窗模板（display:none 的内容，双击桌面图标时克隆打开） ---------- */
function WindowTemplates() {
  const c = siteConfig;
  return (
    <>
      {/* 使用指南：首次进入桌面的友好引导 */}
      <div id="win-hello" className="window-template" style={{ display: 'none' }}>
        <div className="os-window" data-title="使用指南" data-url={c.email} style={{ width: '360px' }}>
          <div className="os-body win-sayhi">
            <div className="sayhi-heading">欢迎来到 {c.osName} 👋</div>
            <div className="sayhi-sub">{c.name} 的数字小天地</div>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">🖱️</div>
                <div className="service-title">双击图标</div>
                <div className="service-desc">打开网页、文件夹或小窗口<br />图标还能随意拖动</div>
              </div>
              <div className="service-card">
                <div className="service-icon">🪟</div>
                <div className="service-title">窗口可拖可缩</div>
                <div className="service-desc">拖顶部移动，拖右下角缩放<br />点红色按钮关闭</div>
              </div>
            </div>
            <div className="sayhi-links">
              <span>✨ 点击桌面可以种下一颗星星</span>
            </div>
          </div>
        </div>
      </div>

      {/* 联系我 */}
      <div id="win-contact" className="window-template" style={{ display: 'none' }}>
        <div className="os-window" data-title={c.contact.title} data-url={c.email}>
          <div className="os-body win-sayhi">
            <div className="sayhi-heading">{c.contact.heading}</div>
            <div className="sayhi-sub">{c.contact.sub}</div>
            {c.contact.services.length > 0 && (
              <div className="services-grid">
                {c.contact.services.map((s) => (
                  <div className="service-card" key={s.title}>
                    <div className="service-icon">{s.icon}</div>
                    <div className="service-title">{s.title}</div>
                    <div className="service-desc" dangerouslySetInnerHTML={{ __html: s.desc }} />
                  </div>
                ))}
              </div>
            )}
            <div className="sayhi-links">
              {c.socials.map((s) => (
                <span key={s.label}> {s.icon} <a href={s.href} target="_blank" rel="noreferrer">{s.text}</a></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 我的项目（文件夹） */}
      <div id="win-projects" className="window-template" style={{ display: 'none' }}>
        <div className="os-window" data-title="我的项目" data-url={c.email} style={{ width: '380px' }}>
          <div className="os-body win-folder">
            {c.projects.map((p) => (
              <FolderIcon
                key={p.label}
                href={p.href}
                extension={p.href && p.href.includes('github.com') ? '.git' : '.html'}
                label={p.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 关于本站（彩蛋：套娃警告） */}
      <div id="win-meta" className="window-template" style={{ display: 'none' }}>
        <div className="os-window" data-title="⚠️" data-url="" style={{ width: '340px' }}>
          <div className="os-body" style={{ padding: '36px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '52px', marginBottom: '20px' }}>⚠️</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px' }}>无法打开「本站」</div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, marginBottom: '24px' }}>因为你已经在里面了。<br />请勿套娃🙅</div>
            <div data-close-window style={{ display: 'inline-block', background: '#2B7FD8', color: '#fff', padding: '8px 28px', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>好吧，我知道了</div>
          </div>
        </div>
      </div>

      {/* AI 助手演示窗口（仿聊天界面） */}
      <div id="win-assistant" className="window-template" style={{ display: 'none' }}>
        <div className="os-window chat-window" data-title={c.assistant.name} data-url={c.assistant.link}>
          <div className="os-body" style={{ padding: 0, maxHeight: 'none', height: '100%', overflow: 'hidden' }}>
            <div className="chat-inner">
              <div className="chat-sidebar">
                <div className="chat-sidebar-avatar"><img src={c.sticker.src} alt={c.assistant.name} loading="lazy" /></div>
                <div className="chat-sidebar-mic">
                  <svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
                </div>
              </div>
              <div className="chat-main">
                <div className="chat-topbar"><span className="chat-tab active">对话</span><span className="chat-tab">灵感</span><span className="chat-tab">待办</span><span className="chat-tab">接入</span></div>
                <div className="chat-search">
                  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" fill="none" stroke="#aaa" strokeWidth="2" /><path d="M21 21l-4.35-4.35" fill="none" stroke="#aaa" strokeWidth="2" /></svg>
                  <span>搜索聊天记录...</span>
                </div>
                <div className="chat-chat">
                  {c.assistant.dialog.map((m, i) => m.role === 'user' ? (
                    <div className="chat-msg-user" key={i}><div className="chat-bubble">{m.text}</div></div>
                  ) : (
                    <div className="chat-msg-bot" key={i}>
                      <div className="chat-bot-avatar"><img src={c.sticker.src} alt={c.assistant.name} loading="lazy" /></div>
                      <div className="chat-bot-content" dangerouslySetInnerHTML={{ __html: `<div>${m.text}</div>` }} />
                    </div>
                  ))}
                </div>
                <div className="chat-input-bar">
                  <div className="chat-input-container">
                    <div className="chat-input-text">输入消息...</div>
                    <div className="chat-input-toolbar">
                      <div className="chat-toolbar-left">
                        <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M16 12v1a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" /></svg>
                      </div>
                      <div className="chat-toolbar-right"><span className="chat-model-tag">Max</span><div className="chat-send-btn"><svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg></div></div>
                    </div>
                    <div className="chat-coming-soon"><a href={c.assistant.link} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>coming soon - 正在接入中 ✨</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- 标签页 1：主页（终端启动 → OS 桌面 → 告别屏） ---------- */
function HomeTab() {
  const c = siteConfig;
  return (
    <main className="tab-page active" id="page-home" aria-labelledby="site-heading">
      <header className="semantic-summary">
        <h1 id="site-heading">{c.name}：个人主页</h1>
        <p>{c.description}</p>
        <nav aria-label="网站主要内容">
          {c.navLinks.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
        </nav>
      </header>
      <section className="hero-section" id="heroSection">
        <div className="macbook-wrapper" id="macbookWrapper">
          <div className="macbook-screen-bezel" id="macbookBezel">
            <div className="macbook-notch"></div>
            <div className="macbook-screen" id="macbookScreen"><div className="terminal" id="terminal"><div className="terminal-titlebar"><span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span><span className="terminal-title" id="terminalTitle"></span></div><div id="terminalLines"></div></div></div>
          </div>
          <div className="macbook-hinge"></div><div className="macbook-base"></div><div className="macbook-shadow"></div>
        </div>
        <div className="hero-cta" id="heroCta"><div className="cta-text">Press Enter to Launch</div><div className="cta-arrow">↓</div></div>
      </section>

      <div className="desktop" id="desktop">
        <div className="desktop-menubar"><span className="mb-logo">{c.osName}</span>{c.menuItems.map((m) => <span className="mb-item" key={m}>{m}</span>)}<span className="mb-clock" id="mbClock">--:--</span></div>
        <div className="desktop-surface" id="desktopSurface">
          {wallpaperStars.map((style, index) => <span key={index} className="wp-star" style={style}>✦</span>)}
          <div className="desktop-sticker" id="desktopSticker"><img src={c.sticker.src} alt={c.sticker.alt} /></div>
          <div className="desktop-icons">{c.desktopIcons.map((icon) => <DesktopIcon key={icon.label} icon={icon} />)}</div>
          <WindowTemplates />
        </div>
      </div>

      <section className="exit-section" id="exitSection">
        <div className="exit-sticky" id="exitSticky">
          <div className="exit-canvas-content" id="exitCanvasContent" style={{ display: 'none' }}></div>
          <div className="exit-macbook-wrapper" id="exitMacbook" style={{ opacity: 1 }}>
            <div className="exit-bezel" id="exitBezel"><div className="exit-notch"></div><div className="exit-screen" id="exitScreen"><div className="goodbye-screen" id="goodbyeScreen">
              <div className="goodbye-titlebar"><span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span><span className="goodbye-title-text" id="goodbyeTitle"></span></div>
              <div className="goodbye-body"><div className="goodbye-terminal">
                <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">echo "see you"</span></div><div className="gt-line gt-output">See you next time.</div><div className="gt-line">&nbsp;</div>
                <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">cat contact.md</span></div>
                {c.socials.map((s) => <div className="gt-line gt-output" key={s.label}>{s.icon} {s.label} <a href={s.href} target="_blank" rel="noreferrer">{s.text}</a></div>)}
                <div className="gt-line">&nbsp;</div>
                <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">fortune</span></div><div className="gt-line gt-dim">{c.quote} — {c.quoteAuthor}</div><div className="gt-line">&nbsp;</div>
                <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">exit</span></div><div className="gt-line gt-output"><span className="gt-gold">[Process completed]</span></div>
              </div></div>
              <div className="goodbye-footer">{c.footer}</div>
            </div></div></div>
            <div className="exit-hinge"></div><div className="exit-base"></div><div className="exit-shadow"></div>
          </div>
        </div>
        <div className="back-to-top"><a href="#" id="backToTopLink"><span className="back-arrow">↑</span>回到开始 · Back to Start</a></div>
      </section>
    </main>
  );
}

/* ---------- 标签页 2：作品集 ---------- */
function WorksTab() {
  const c = siteConfig;
  return (
    <main className="tab-page" id="page-works">
      <div className="works-page">
        <div className="workflow-screen">
          <h1 className="workflow-headline">{c.slogan}</h1>
          <p className="workflow-subtitle">{c.navSubtitle}</p>
          <div className="workflow-columns">
            {c.workflowColumns.map((column) => <div className="workflow-col" key={column.title}><div className="workflow-col-title">{column.title}</div><div className="workflow-col-line"></div>{column.items.map(([label, description]) => <div className="workflow-item" key={label}><span className="workflow-item-label">{label}</span><span className="workflow-item-desc">{description}</span></div>)}</div>)}
          </div>
        </div>
        <div className="section-label" style={{ marginTop: '64px' }}>ls works/</div><h2 className="section-heading">作品集</h2>
        <div className="works-grid">
          {c.works.map((dimension) => <div className="work-dim" key={dimension.number}><div className="dim-num">{dimension.number}</div><h3>{dimension.title}</h3>{dimension.description && <p className="dim-desc">{dimension.description}</p>}{dimension.links && <div className="dim-works-list">{dimension.links.map(([icon, href, label]) => <a className="dim-work-item" href={href} target="_blank" rel="noreferrer" key={label}><span className="dim-work-icon">{icon}</span><span>{label}</span></a>)}</div>}{dimension.empty && <div className="dim-empty">{dimension.empty}</div>}</div>)}
        </div>
      </div>
    </main>
  );
}

/* ---------- 标签页 3：关于（仿「关于本机」面板） ---------- */
function AboutTab() {
  const c = siteConfig.about;
  return (
    <main className="tab-page" id="page-about">
      <div className="about-page">
        <div className="about-panel">
          <div className="about-titlebar"><span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span><span className="about-title-text">{siteConfig.osName} · {c.headline}</span></div>
          <div className="about-hero">
            <img className="about-avatar" src={siteConfig.sticker.src} alt={siteConfig.sticker.alt} />
            <div className="about-os">
              <div className="about-os-name">{siteConfig.osName}</div>
              <div className="about-os-version">{c.osVersion}</div>
            </div>
          </div>
          <div className="about-specs">
            <div className="about-spec"><span className="about-spec-label">芯片</span><span>{c.chip}</span></div>
            <div className="about-spec"><span className="about-spec-label">内存</span><span>{c.memory}</span></div>
            {c.lines.map(([k, v]) => <div className="about-spec" key={k}><span className="about-spec-label">{k}</span><span>{v}</span></div>)}
          </div>
          <div className="about-skills">
            <div className="about-skills-title">{c.skillsTitle}</div>
            <div className="about-skill-tags">{c.skills.map((s) => <span className="about-skill-tag" key={s}>{s}</span>)}</div>
          </div>
          <div className="about-quote">{c.quote}</div>
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  // 文档标题 / 描述跟随配置，改配置即全站生效
  useEffect(() => {
    document.title = `${siteConfig.name} - ${siteConfig.slogan}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', siteConfig.description);
  }, []);

  return (
    <>
      <div className="transition-overlay" id="transitionOverlay"></div>
      <nav className="pill-nav hidden-during-intro" id="pillNav"><button data-tab="home" className="active"><span className="pill-num">01</span>主页</button><button data-tab="works"><span className="pill-num">02</span>作品集</button><button data-tab="about"><span className="pill-num">03</span>关于</button></nav>
      <HomeTab />
      <WorksTab />
      <AboutTab />
    </>
  );
}
