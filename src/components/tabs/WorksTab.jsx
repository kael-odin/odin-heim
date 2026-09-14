import siteConfig from '../../config/siteConfig';

/* 标签页 2：作品集（工作流三栏 + 作品卡片） */
export default function WorksTab() {
  const c = siteConfig;
  return (
    <main className="tab-page" id="page-works">
      <div className="works-page">
        <div className="workflow-screen">
          <h1 className="workflow-headline">{c.slogan}</h1>
          <p className="workflow-subtitle">{c.navSubtitle}</p>
          <div className="workflow-columns">
            {c.workflowColumns.map((column) => (
              <div className="workflow-col" key={column.title}>
                <div className="workflow-col-title">{column.title}</div>
                <div className="workflow-col-line"></div>
                {column.items.map(([label, description]) => (
                  <div className="workflow-item" key={label}>
                    <span className="workflow-item-label">{label}</span>
                    <span className="workflow-item-desc">{description}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="section-label" style={{ marginTop: '64px' }}>ls works/</div>
        <h2 className="section-heading">作品集</h2>
        <div className="works-grid">
          {c.works.map((dimension) => (
            <div className="work-dim" key={dimension.number}>
              <div className="dim-num">{dimension.number}</div>
              <h3>{dimension.title}</h3>
              {dimension.description && <p className="dim-desc">{dimension.description}</p>}
              {dimension.links && (
                <div className="dim-works-list">
                  {dimension.links.map(([icon, href, label]) => (
                    <a className="dim-work-item" href={href} target="_blank" rel="noreferrer" key={label}>
                      <span className="dim-work-icon">{icon}</span>
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              )}
              {dimension.empty && <div className="dim-empty">{dimension.empty}</div>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
