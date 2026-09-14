/* Hash 路由 + 滚动锁：主页未「开机」前锁滚动，其余页面可滚动 */

const TABS = ['home', 'works', 'about'];

export function initTabs(ctx) {
  const pillNav = document.getElementById('pillNav');

  function currentTab() {
    const h = location.hash.replace('#', '');
    return TABS.indexOf(h) >= 0 ? h : 'home';
  }

  function applyScrollLock() {
    // 仅 home 页在进入桌面前锁滚动
    const lock = currentTab() === 'home' && !ctx.state.launched;
    document.documentElement.classList.toggle('scroll-unlocked', !lock);
  }

  function switchTab(tab) {
    TABS.forEach((t) => {
      document.getElementById('page-' + t).classList.toggle('active', t === tab);
    });
    pillNav.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    // 立即 + 布局稳定后各强制回顶一次（对抗浏览器的滚动锚定）
    window.scrollTo(0, 0);
    ctx.env.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      ctx.env.requestAnimationFrame(() => window.scrollTo(0, 0));
    });
    applyScrollLock();
  }

  pillNav.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) location.hash = btn.dataset.tab;
  });
  window.addEventListener('hashchange', () => switchTab(currentTab()));

  ctx.api.currentTab = currentTab;
  ctx.api.applyScrollLock = applyScrollLock;
  ctx.api.switchTab = () => switchTab(currentTab());
}
