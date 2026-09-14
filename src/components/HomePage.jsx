import { useEffect } from 'react';
import siteConfig from '../config/siteConfig';
import HomeTab from './tabs/HomeTab';
import WorksTab from './tabs/WorksTab';
import AboutTab from './tabs/AboutTab';

/* 页面编排：底部胶囊导航 + 三个标签页。
 * 文档标题 / 描述跟随配置，改 siteConfig 即全站生效。 */
export default function HomePage() {
  useEffect(() => {
    document.title = `${siteConfig.name} - ${siteConfig.slogan}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', siteConfig.description);
  }, []);

  return (
    <>
      <div className="transition-overlay" id="transitionOverlay"></div>
      <nav className="pill-nav hidden-during-intro" id="pillNav">
        <button data-tab="home" className="active"><span className="pill-num">01</span>主页</button>
        <button data-tab="works"><span className="pill-num">02</span>作品集</button>
        <button data-tab="about"><span className="pill-num">03</span>关于</button>
      </nav>
      <HomeTab />
      <WorksTab />
      <AboutTab />
    </>
  );
}
