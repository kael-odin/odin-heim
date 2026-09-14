import siteConfig from '../../config/siteConfig';

/* 标签页 3：关于（仿 macOS「关于本机」面板） */
export default function AboutTab() {
  const c = siteConfig.about;
  return (
    <main className="tab-page" id="page-about">
      <div className="about-page">
        <div className="about-panel">
          <div className="about-titlebar">
            <span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span>
            <span className="about-title-text">{siteConfig.osName} · {c.headline}</span>
          </div>
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
            {c.lines.map(([k, v]) => (
              <div className="about-spec" key={k}><span className="about-spec-label">{k}</span><span>{v}</span></div>
            ))}
          </div>
          <div className="about-skills">
            <div className="about-skills-title">{c.skillsTitle}</div>
            <div className="about-skill-tags">
              {c.skills.map((s) => <span className="about-skill-tag" key={s}>{s}</span>)}
            </div>
          </div>
          <div className="about-quote">{c.quote}</div>
        </div>
      </div>
    </main>
  );
}
