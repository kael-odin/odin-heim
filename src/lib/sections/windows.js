/* 窗口管理器：克隆隐藏模板生成窗口（拖拽 / 缩放 / 红绿灯 / 置顶），
 * 并接线桌面图标（双击打开 iframe 或模板窗口）与文件夹内图标 */

export function initWindows(ctx) {
  const surface = document.getElementById('desktopSurface');
  let winZ = 100;
  let openCount = 0;

  function addResize(win) {
    const handle = document.createElement('div');
    handle.className = 'os-resize';
    win.appendChild(handle);
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX, startY = e.clientY;
      const startW = win.offsetWidth, startH = win.offsetHeight;
      const iframes = win.querySelectorAll('iframe');
      iframes.forEach((f) => { f.style.pointerEvents = 'none'; });
      function onMove(ev) {
        const newW = Math.max(280, startW + ev.clientX - startX);
        const newH = Math.max(200, startH + ev.clientY - startY);
        win.style.width = newW + 'px';
        win.style.height = newH + 'px';
      }
      function onUp() {
        iframes.forEach((f) => { f.style.pointerEvents = ''; });
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
  }

  function templateWindow(tpl) {
    return tpl.content ? tpl.content.firstElementChild : tpl.firstElementChild;
  }

  function decorateChrome(win) {
    // 组装窗口 chrome：macOS 红绿灯 + 透明拖拽条
    const dragbar = document.createElement('div');
    dragbar.className = 'os-dragbar';
    win.insertBefore(dragbar, win.firstChild);

    const traffic = document.createElement('div');
    traffic.className = 'os-traffic';
    traffic.innerHTML = '<span class="tl-close"></span><span class="tl-min"></span><span class="tl-max"></span>';
    win.insertBefore(traffic, win.firstChild);

    const closeBtn = traffic.querySelector('.tl-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      win.remove();
    });

    win.addEventListener('pointerdown', () => { win.style.zIndex = ++winZ; });

    dragbar.addEventListener('pointerdown', (e) => {
      if (e.target === closeBtn) return;
      e.preventDefault();
      const startX = e.clientX, startY = e.clientY;
      const origX = win.offsetLeft, origY = win.offsetTop;
      function onMove(ev) {
        win.style.left = (origX + ev.clientX - startX) + 'px';
        win.style.top = (origY + ev.clientY - startY) + 'px';
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });

    addResize(win);
  }

  function openWindow(tplId) {
    // 已打开则置顶
    const existing = surface.querySelector('.os-window[data-from="' + tplId + '"]');
    if (existing) { existing.style.zIndex = ++winZ; return; }

    const tpl = document.getElementById(tplId);
    if (!tpl) return;
    const sourceWindow = templateWindow(tpl);
    if (!sourceWindow) return;
    const win = sourceWindow.cloneNode(true);
    win.dataset.from = tplId;

    // 层叠位置（聊天窗口居中，其余层叠）
    const isSmall = window.innerWidth <= 768;
    const isChat = win.classList.contains('chat-window');
    if (isChat) {
      const surfW = surface.offsetWidth || window.innerWidth;
      const surfH = surface.offsetHeight || window.innerHeight;
      const winW = Math.min(720, surfW * 0.92);
      const winH = Math.min(560, surfH * 0.78);
      win.style.left = Math.max(8, (surfW - winW) / 2) + 'px';
      win.style.top = Math.max(8, (surfH - winH) / 2 - 20) + 'px';
    } else {
      const baseX = isSmall ? 12 : 150;
      const baseY = isSmall ? 60 : 60;
      const offset = (openCount % 5) * (isSmall ? 16 : 36);
      win.style.left = (baseX + offset) + 'px';
      win.style.top = (baseY + offset) + 'px';
    }
    win.style.zIndex = ++winZ;
    openCount++;

    decorateChrome(win);

    // 「跳转到某页」类按钮
    win.querySelectorAll('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', () => { location.hash = btn.dataset.goto; });
    });

    surface.appendChild(win);
  }

  function openIframeWindow(url, title) {
    // 已打开则置顶
    const existing = surface.querySelector('.os-window[data-href-src="' + url + '"]');
    if (existing) { existing.style.zIndex = ++winZ; return; }

    const win = document.createElement('div');
    win.className = 'os-window';
    win.dataset.hrefSrc = url;

    decorateChrome(win);

    const body = document.createElement('div');
    body.className = 'os-body os-body-iframe';
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.title = title;
    iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:0 0 10px 10px;overscroll-behavior:contain;';
    body.appendChild(iframe);
    win.appendChild(body);

    const isSmall = window.innerWidth <= 768;
    const surfW = surface.offsetWidth || window.innerWidth;
    const surfH = surface.offsetHeight || window.innerHeight;
    const winW = Math.min(700, surfW * 0.88);
    const winH = Math.min(520, surfH * 0.75);
    win.style.width = winW + 'px';
    win.style.height = winH + 'px';
    const offset = (openCount % 5) * (isSmall ? 16 : 30);
    win.style.left = Math.max(8, (surfW - winW) / 2 + offset) + 'px';
    win.style.top = Math.max(8, (surfH - winH) / 2 - 20 + offset) + 'px';
    win.style.zIndex = ++winZ;
    openCount++;

    // 右上角「新窗口打开」按钮
    const extBtn = document.createElement('div');
    extBtn.className = 'os-external';
    extBtn.title = '在新窗口打开';
    extBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
    extBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.open(url, '_blank');
    });
    win.appendChild(extBtn);

    surface.appendChild(win);
  }

  // 桌面图标：可拖拽 + 双击打开（macOS 风格）
  surface.querySelectorAll('.dicon').forEach((icon) => {
    icon.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const startX = e.clientX, startY = e.clientY;
      // 把 right 定位换算成 left，才能自由拖动
      const rect = icon.getBoundingClientRect();
      const surfRect = surface.getBoundingClientRect();
      const origX = rect.left - surfRect.left;
      const origY = rect.top - surfRect.top;
      icon.style.right = 'auto';
      icon.style.left = origX + 'px';
      icon.style.top = origY + 'px';

      function onMove(ev) {
        icon.style.left = (origX + ev.clientX - startX) + 'px';
        icon.style.top = (origY + ev.clientY - startY) + 'px';
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
    icon.addEventListener('dblclick', () => {
      if (icon.dataset.href) {
        openIframeWindow(icon.dataset.href, icon.querySelector('.dicon-label').textContent);
      } else if (icon.dataset.win) {
        openWindow(icon.dataset.win);
      }
    });
  });

  surface.addEventListener('click', (e) => {
    const closeAction = e.target.closest('[data-close-window]');
    if (closeAction) closeAction.closest('.os-window').remove();
  });

  // 窗口内文件夹图标双击 → 打开 iframe 窗口
  surface.addEventListener('dblclick', (e) => {
    const fiWin = e.target.closest('.folder-icon[data-win]');
    if (fiWin) {
      openWindow(fiWin.dataset.win);
      return;
    }
    const fi = e.target.closest('.folder-icon[data-href]');
    if (!fi) return;
    openIframeWindow(fi.dataset.href, fi.querySelector('.folder-icon-label').textContent);
  });
}
