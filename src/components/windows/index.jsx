import siteConfig from '../../config/siteConfig';
import { FolderIcon } from '../DesktopIcons';

/* ---------- 使用指南：首次进入桌面的友好引导 ---------- */
function HelloWindow() {
  const c = siteConfig;
  return (
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
  );
}

/* ---------- 联系我 ---------- */
function ContactWindow() {
  const c = siteConfig.contact;
  return (
    <div className="os-window" data-title={c.title} data-url={siteConfig.email}>
      <div className="os-body win-sayhi">
        <div className="sayhi-heading">{c.heading}</div>
        <div className="sayhi-sub">{c.sub}</div>
        {c.services.length > 0 && (
          <div className="services-grid">
            {c.services.map((s) => (
              <div className="service-card" key={s.title}>
                <div className="service-icon">{s.icon}</div>
                <div className="service-title">{s.title}</div>
                <div className="service-desc" dangerouslySetInnerHTML={{ __html: s.desc }} />
              </div>
            ))}
          </div>
        )}
        <div className="sayhi-links">
          {siteConfig.socials.map((s) => (
            <span key={s.label}> {s.icon} <a href={s.href} target="_blank" rel="noreferrer">{s.text}</a></span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 我的项目（文件夹） ---------- */
function ProjectsWindow() {
  return (
    <div className="os-window" data-title="我的项目" data-url={siteConfig.email} style={{ width: '380px' }}>
      <div className="os-body win-folder">
        {siteConfig.projects.map((p) => (
          <FolderIcon
            key={p.label}
            href={p.href}
            extension={p.href && p.href.includes('github.com') ? '.git' : '.html'}
            label={p.label}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- 关于本站（彩蛋：套娃警告） ---------- */
function MetaWindow() {
  return (
    <div className="os-window" data-title="⚠️" data-url="" style={{ width: '340px' }}>
      <div className="os-body" style={{ padding: '36px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '20px' }}>⚠️</div>
        <div style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px' }}>无法打开「本站」</div>
        <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, marginBottom: '24px' }}>因为你已经在里面了。<br />请勿套娃🙅</div>
        <div data-close-window style={{ display: 'inline-block', background: '#2B7FD8', color: '#fff', padding: '8px 28px', borderRadius: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>好吧，我知道了</div>
      </div>
    </div>
  );
}

/* ---------- AI 助手演示窗口（仿聊天界面） ---------- */
function AssistantWindow() {
  const a = siteConfig.assistant;
  const avatar = { src: siteConfig.sticker.src, alt: a.name };
  return (
    <div className="os-window chat-window" data-title={a.name} data-url={a.link}>
      <div className="os-body" style={{ padding: 0, maxHeight: 'none', height: '100%', overflow: 'hidden' }}>
        <div className="chat-inner">
          <div className="chat-sidebar">
            <div className="chat-sidebar-avatar"><img src={avatar.src} alt={avatar.alt} loading="lazy" /></div>
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
              {a.dialog.map((m, i) => m.role === 'user' ? (
                <div className="chat-msg-user" key={i}><div className="chat-bubble">{m.text}</div></div>
              ) : (
                <div className="chat-msg-bot" key={i}>
                  <div className="chat-bot-avatar"><img src={avatar.src} alt={avatar.alt} loading="lazy" /></div>
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
                <div className="chat-coming-soon"><a href={a.link} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>coming soon - 正在接入中 ✨</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 隐藏的窗口模板库：id 规则为 win-*，与 siteConfig.desktopIcons 的 win 字段对应 */
const TEMPLATES = [
  ['win-hello', HelloWindow],
  ['win-contact', ContactWindow],
  ['win-projects', ProjectsWindow],
  ['win-meta', MetaWindow],
  ['win-assistant', AssistantWindow],
];

export function WindowTemplates() {
  return (
    <>
      {TEMPLATES.map(([id, Comp]) => (
        <div key={id} id={id} className="window-template" style={{ display: 'none' }}>
          <Comp />
        </div>
      ))}
    </>
  );
}
