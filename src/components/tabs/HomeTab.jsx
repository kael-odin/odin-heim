import siteConfig from '../../config/siteConfig';
import { wallpaperStars } from '../../data/wallpaperStars';
import { DesktopIcon } from '../DesktopIcons';
import { WindowTemplates } from '../windows';

/* 标签页 1：主页（终端启动 → OS 桌面 → 告别屏） */

function SemanticSummary() {
  const c = siteConfig;
  return (
    <header className="semantic-summary">
      <h1 id="site-heading">{c.name}：个人主页</h1>
      <p>{c.description}</p>
      <nav aria-label="网站主要内容">
        {c.navLinks.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="heroSection">
      <div className="macbook-wrapper" id="macbookWrapper">
        <div className="macbook-screen-bezel" id="macbookBezel">
          <div className="macbook-notch"></div>
          <div className="macbook-screen" id="macbookScreen">
            <div className="terminal" id="terminal">
              <div className="terminal-titlebar">
                <span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span>
                <span className="terminal-title" id="terminalTitle"></span>
              </div>
              <div id="terminalLines"></div>
            </div>
          </div>
        </div>
        <div className="macbook-hinge"></div><div className="macbook-base"></div><div className="macbook-shadow"></div>
      </div>
      <div className="hero-cta" id="heroCta"><div className="cta-text">Press Enter to Launch</div><div className="cta-arrow">↓</div></div>
    </section>
  );
}

function Desktop() {
  const c = siteConfig;
  function goto(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab) location.hash = tab;
  }
  return (
    <div className="desktop" id="desktop">
      <div className="desktop-menubar">
        <span className="mb-logo">{c.osName}</span>
        {c.menuItems.map((item) => item.tab
          ? <button key={item.label} className="mb-item" data-tab={item.tab} onClick={goto}>{item.label}</button>
          : <span key={item.label} className="mb-item">{item.label}</span>)}
        <span className="mb-clock" id="mbClock">--:--</span>
      </div>
      <div className="desktop-surface" id="desktopSurface">
        {wallpaperStars.map((style, index) => <span key={index} className="wp-star" style={style}>✦</span>)}
        <div className="desktop-sticker" id="desktopSticker"><img src={c.sticker.src} alt={c.sticker.alt} /></div>
        <div className="desktop-icons">{c.desktopIcons.map((icon) => <DesktopIcon key={icon.label} icon={icon} />)}</div>
        <WindowTemplates />
      </div>
    </div>
  );
}

function ExitSection() {
  const c = siteConfig;
  return (
    <section className="exit-section" id="exitSection">
      <div className="exit-sticky" id="exitSticky">
        <div className="exit-macbook-wrapper" id="exitMacbook" style={{ opacity: 1 }}>
          <div className="exit-bezel" id="exitBezel">
            <div className="exit-notch"></div>
            <div className="exit-screen" id="exitScreen">
              <div className="goodbye-screen" id="goodbyeScreen">
                <div className="goodbye-titlebar">
                  <span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span>
                  <span className="goodbye-title-text" id="goodbyeTitle"></span>
                </div>
                <div className="goodbye-body">
                  <div className="goodbye-terminal">
                    <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">echo "see you"</span></div>
                    <div className="gt-line gt-output">See you next time.</div>
                    <div className="gt-line">&nbsp;</div>
                    <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">cat contact.md</span></div>
                    {c.socials.map((s) => (
                      <div className="gt-line gt-output" key={s.label}>{s.icon} {s.label} <a href={s.href} target="_blank" rel="noreferrer">{s.text}</a></div>
                    ))}
                    <div className="gt-line">&nbsp;</div>
                    <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">fortune</span></div>
                    <div className="gt-line gt-dim">{c.quote} — {c.quoteAuthor}</div>
                    <div className="gt-line">&nbsp;</div>
                    <div className="gt-line"><span className="gt-prompt">$ </span><span className="gt-cmd">exit</span></div>
                    <div className="gt-line gt-output"><span className="gt-gold">[Process completed]</span></div>
                  </div>
                </div>
                <div className="goodbye-footer">{c.footer}</div>
              </div>
            </div>
          </div>
          <div className="exit-hinge"></div><div className="exit-base"></div><div className="exit-shadow"></div>
        </div>
      </div>
      <div className="back-to-top"><a href="#" id="backToTopLink"><span className="back-arrow">↑</span>回到开始 · Back to Start</a></div>
    </section>
  );
}

export default function HomeTab() {
  return (
    <main className="tab-page active" id="page-home" aria-labelledby="site-heading">
      <SemanticSummary />
      <Hero />
      <Desktop />
      <ExitSection />
    </main>
  );
}
