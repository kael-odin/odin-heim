import siteConfig from '../config/siteConfig';

let hasInitialized = false;

export function initializeSite() {
  if (hasInitialized) return undefined;
  hasInitialized = true;

  const listenerRecords = [];
  const timeoutIds = new Set();
  const intervalIds = new Set();
  const animationFrameIds = new Set();
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  const nativeSetTimeout = window.setTimeout.bind(window);
  const nativeClearTimeout = window.clearTimeout.bind(window);
  const nativeSetInterval = window.setInterval.bind(window);
  const nativeClearInterval = window.clearInterval.bind(window);
  const nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window);
  const nativeCancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    listenerRecords.push([this, type, listener, options]);
    return originalAddEventListener.call(this, type, listener, options);
  };

  function setTimeout(callback, delay, ...args) {
    const timeoutId = nativeSetTimeout(() => {
      timeoutIds.delete(timeoutId);
      callback(...args);
    }, delay);
    timeoutIds.add(timeoutId);
    return timeoutId;
  }

  function clearTimeout(timeoutId) {
    timeoutIds.delete(timeoutId);
    nativeClearTimeout(timeoutId);
  }

  function setInterval(callback, delay, ...args) {
    const intervalId = nativeSetInterval(callback, delay, ...args);
    intervalIds.add(intervalId);
    return intervalId;
  }

  function clearInterval(intervalId) {
    intervalIds.delete(intervalId);
    nativeClearInterval(intervalId);
  }

  function requestAnimationFrame(callback) {
    const frameId = nativeRequestAnimationFrame((timestamp) => {
      animationFrameIds.delete(frameId);
      callback(timestamp);
    });
    animationFrameIds.add(frameId);
    return frameId;
  }

  'use strict';

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ===== 终端标题（配置驱动） ===== */
  var terminalTitleText = siteConfig.nameEn.split(' ')[0].toLowerCase() + '@' + siteConfig.osName.toLowerCase() + ' ~ zsh';
  var terminalTitleEl = document.getElementById('terminalTitle');
  if (terminalTitleEl) terminalTitleEl.textContent = terminalTitleText;
  var goodbyeTitleEl = document.getElementById('goodbyeTitle');
  if (goodbyeTitleEl) goodbyeTitleEl.textContent = terminalTitleText;

  /* ===== STATE ===== */
  var typingDone = false;
  var launched = false;   // user has zoomed into the desktop
  var looping = false;

  /* ============================================
     TAB ROUTER (hash-based)
     ============================================ */
  var TABS = ['home', 'works', 'about'];
  var pillNav = document.getElementById('pillNav');

  function currentTab() {
    var h = location.hash.replace('#', '');
    return TABS.indexOf(h) >= 0 ? h : 'home';
  }

  function applyScrollLock() {
    // Scroll locked only on home tab before launch
    var lock = currentTab() === 'home' && !launched;
    document.documentElement.classList.toggle('scroll-unlocked', !lock);
  }

  function switchTab(tab) {
    TABS.forEach(function(t) {
      document.getElementById('page-' + t).classList.toggle('active', t === tab);
    });
    pillNav.querySelectorAll('button').forEach(function(b) {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    // Force top: immediately and after layout settles (defeats scroll anchoring)
    window.scrollTo(0, 0);
    requestAnimationFrame(function() {
      window.scrollTo(0, 0);
      requestAnimationFrame(function() { window.scrollTo(0, 0); });
    });
    applyScrollLock();
  }

  pillNav.addEventListener('click', function(e) {
    var btn = e.target.closest('button');
    if (btn) location.hash = btn.dataset.tab;
  });
  window.addEventListener('hashchange', function() {
    switchTab(currentTab());
  });

  /* ============================================
     MENUBAR CLOCK
     ============================================ */
  var mbClock = document.getElementById('mbClock');
  function tickClock() {
    var d = new Date();
    mbClock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  tickClock();
  setInterval(tickClock, 30000);

  /* ============================================
     TERMINAL TYPING (first visit) / SKIP (return)
     ============================================ */
  var VISITED_KEY = siteConfig.osName.toLowerCase() + '_visited';
  var isReturnVisitor = false;
  try { isReturnVisitor = !!localStorage.getItem(VISITED_KEY); } catch (e) {}

  /* 终端开场白：由 siteConfig 生成 */
  var terminalData = [{ type: 'cmd', prompt: '$ ', text: 'whoami' }];
  terminalData.push({ type: 'output', prefix: '> ', text: siteConfig.name });
  terminalData.push({ type: 'blank' });
  terminalData.push({ type: 'cmd', prompt: '$ ', text: 'cat about.md' });
  siteConfig.bioLines.forEach(function(line) {
    terminalData.push({ type: 'output', prefix: '> ', text: line });
  });
  terminalData.push({ type: 'blank' });
  terminalData.push({ type: 'cmd', prompt: '$ ', text: 'echo "' + siteConfig.slogan + '"' });
  terminalData.push({ type: 'gold', prefix: '> ', text: siteConfig.slogan });
  terminalData.push({ type: 'blank' });
  terminalData.push({ type: 'cmd', prompt: '$ ', text: 'open ' + siteConfig.osName.toLowerCase() + '.app', cursor: true });

  var container = document.getElementById('terminalLines');
  var heroCta = document.getElementById('heroCta');

  function renderLine(item) {
    var div = document.createElement('div');
    div.className = 'term-line';
    if (item.type === 'blank') {
      div.innerHTML = '&nbsp;';
    } else if (item.type === 'cmd') {
      var html = '<span class="term-prompt">' + item.prompt + '</span><span class="term-cmd">' + item.text + '</span>';
      if (item.cursor) html += '<span class="cursor" id="mainCursor"></span>';
      div.innerHTML = html;
    } else if (item.type === 'output') {
      div.innerHTML = '<span class="term-output">' + item.prefix + item.text + '</span>';
    } else if (item.type === 'gold') {
      div.innerHTML = '<span class="term-gold">' + item.prefix + item.text + '</span>';
    }
    container.appendChild(div);
    return div;
  }

  function finishIntro() {
    typingDone = true;
    heroCta.classList.add('visible');
    pillNav.classList.remove('hidden-during-intro');
    try { localStorage.setItem(VISITED_KEY, '1'); } catch (e) {}
  }

  if (isReturnVisitor) {
    // Return visitor: terminal shows instantly (no typing), then auto zoom into desktop
    terminalData.forEach(function(item) { renderLine(item).classList.add('visible'); });
    finishIntro();
    setTimeout(launch, 700);
  } else {
    // First visit: full line-by-line typing intro
    var divs = [];
    var lineDelay = 0;
    terminalData.forEach(function(item) {
      var div = renderLine(item);
      if (item.type === 'blank') { lineDelay += 200; }
      else if (item.type === 'cmd') { lineDelay += 400; div.style.animationDelay = lineDelay + 'ms'; lineDelay += 600; }
      else if (item.type === 'output') { lineDelay += 150; div.style.animationDelay = lineDelay + 'ms'; lineDelay += 300; }
      else if (item.type === 'gold') { lineDelay += 150; div.style.animationDelay = lineDelay + 'ms'; lineDelay += 400; }
      divs.push(div);
      setTimeout(function() { div.classList.add('visible'); }, 50);
    });

    var typingTimeout = setTimeout(finishIntro, lineDelay + 600);

    var skipTyping = function() {
      if (typingDone) return;
      clearTimeout(typingTimeout);
      divs.forEach(function(d) { d.style.animationDelay = '0ms'; d.classList.add('visible'); });
      finishIntro();
    };

    document.getElementById('heroSection').addEventListener('click', function() {
      if (!typingDone) skipTyping();
    });
    document.addEventListener('keydown', function(e) {
      if (!typingDone && e.key !== 'Enter') skipTyping();
    });
  }

  /* ============================================
     LAUNCH: terminal → progress bar → ZOOM INTO SCREEN
     ============================================ */
  function launch() {
    if (launched || !typingDone || currentTab() !== 'home') return;
    launched = true; // guard re-entry; desktop unlocks after zoom

    heroCta.classList.remove('visible');
    heroCta.classList.add('hidden');

    var cursorEl = document.getElementById('mainCursor');
    if (cursorEl) cursorEl.remove();

    var launchLine = document.createElement('div');
    launchLine.className = 'term-line';
    launchLine.innerHTML = '<span class="term-output">> launching...</span>';
    container.appendChild(launchLine);
    setTimeout(function() { launchLine.classList.add('visible'); }, 50);

    var progressLine = document.createElement('div');
    progressLine.className = 'term-line';
    progressLine.innerHTML = '<span class="term-prompt" id="progressText">[░░░░░░░░░░░░] 0%</span>';
    container.appendChild(progressLine);
    setTimeout(function() { progressLine.classList.add('visible'); }, 300);

    var progress = 0;
    var barLength = 12;
    setTimeout(function() {
      var progressText = document.getElementById('progressText');
      var interval = setInterval(function() {
        progress += 1;
        if (progress > barLength) {
          clearInterval(interval);
          beginZoom();
          return;
        }
        var filled = '', empty = '';
        for (var i = 0; i < barLength; i++) {
          if (i < progress) filled += '█'; else empty += '░';
        }
        var pct = Math.round((progress / barLength) * 100);
        if (progressText) progressText.textContent = '[' + filled + empty + '] ' + pct + '%';
      }, 80);
    }, 500);
  }

  function beginZoom() {
    var wrapper = document.getElementById('macbookWrapper');
    var screen = document.getElementById('macbookScreen');
    var terminal = document.getElementById('terminal');
    var overlay = document.getElementById('transitionOverlay');

    var screenRect = screen.getBoundingClientRect();
    var vw = window.innerWidth, vh = window.innerHeight;
    var scale = Math.max(vw / screenRect.width, vh / screenRect.height) * 1.05;

    var screenCenterX = screenRect.left + screenRect.width / 2;
    var screenCenterY = screenRect.top + screenRect.height / 2;
    var wrapperRect = wrapper.getBoundingClientRect();
    var wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;
    var wrapperCenterY = wrapperRect.top + wrapperRect.height / 2;
    var offsetX = screenCenterX - wrapperCenterX;
    var offsetY = screenCenterY - wrapperCenterY;
    var tx = vw / 2 - (wrapperCenterX + offsetX * scale);
    var ty = vh / 2 - (wrapperCenterY + offsetY * scale);

    setTimeout(function() { terminal.classList.add('scale-through'); }, 200);

    wrapper.classList.add('zoom-transition');
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        wrapper.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(' + scale + ')';
      });
    });

    setTimeout(function() { overlay.classList.add('active'); }, 1200);

    setTimeout(function() {
      // While covered: hide hero, land on desktop top
      document.getElementById('heroSection').style.display = 'none';
      applyScrollLock();
      window.scrollTo(0, 0);
      setTimeout(function() { overlay.classList.remove('active'); }, 250);
    }, 1800);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !launched) launch();
  });
  document.getElementById('macbookBezel').addEventListener('click', function() {
    if (typingDone) launch();
  });
  heroCta.addEventListener('click', launch);

  /* ============================================
     DESKTOP WINDOW MANAGER
     ============================================ */
  var surface = document.getElementById('desktopSurface');
  var winZ = 100;
  var openCount = 0;

  function addResize(win) {
    var handle = document.createElement('div');
    handle.className = 'os-resize';
    win.appendChild(handle);
    handle.addEventListener('pointerdown', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var startX = e.clientX, startY = e.clientY;
      var startW = win.offsetWidth, startH = win.offsetHeight;
      var iframes = win.querySelectorAll('iframe');
      iframes.forEach(function(f) { f.style.pointerEvents = 'none'; });
      function onMove(ev) {
        var newW = Math.max(280, startW + ev.clientX - startX);
        var newH = Math.max(200, startH + ev.clientY - startY);
        win.style.width = newW + 'px';
        win.style.height = newH + 'px';
      }
      function onUp() {
        iframes.forEach(function(f) { f.style.pointerEvents = ''; });
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

  function openWindow(tplId) {
    // If already open, bring to front
    var existing = surface.querySelector('.os-window[data-from="' + tplId + '"]');
    if (existing) { existing.style.zIndex = ++winZ; return; }

    var tpl = document.getElementById(tplId);
    if (!tpl) return;
    var sourceWindow = templateWindow(tpl);
    if (!sourceWindow) return;
    var win = sourceWindow.cloneNode(true);
    win.dataset.from = tplId;

    // Build chrome: macOS traffic lights + invisible drag bar
    var dragbar = document.createElement('div');
    dragbar.className = 'os-dragbar';
    win.insertBefore(dragbar, win.firstChild);

    var traffic = document.createElement('div');
    traffic.className = 'os-traffic';
    traffic.innerHTML = '<span class="tl-close"></span><span class="tl-min"></span><span class="tl-max"></span>';
    win.insertBefore(traffic, win.firstChild);

    var closeBtn = traffic.querySelector('.tl-close');

    // Cascade position (chat window centered, others cascade)
    var isSmall = window.innerWidth <= 768;
    var isChat = win.classList.contains('chat-window');
    if (isChat) {
      var surfW = surface.offsetWidth || window.innerWidth;
      var surfH = surface.offsetHeight || window.innerHeight;
      var winW = Math.min(720, surfW * 0.92);
      var winH = Math.min(560, surfH * 0.78);
      win.style.left = Math.max(8, (surfW - winW) / 2) + 'px';
      win.style.top = Math.max(8, (surfH - winH) / 2 - 20) + 'px';
    } else {
      var baseX = isSmall ? 12 : 150;
      var baseY = isSmall ? 60 : 60;
      var offset = (openCount % 5) * (isSmall ? 16 : 36);
      win.style.left = (baseX + offset) + 'px';
      win.style.top = (baseY + offset) + 'px';
    }
    win.style.zIndex = ++winZ;
    openCount++;

    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      win.remove();
    });

    // Bring to front on any press
    win.addEventListener('pointerdown', function() { win.style.zIndex = ++winZ; });

    // Drag by dragbar
    dragbar.addEventListener('pointerdown', function(e) {
      if (e.target === closeBtn) return;
      e.preventDefault();
      var startX = e.clientX, startY = e.clientY;
      var origX = win.offsetLeft, origY = win.offsetTop;
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

    // "open works" style jump buttons
    win.querySelectorAll('[data-goto]').forEach(function(btn) {
      btn.addEventListener('click', function() { location.hash = btn.dataset.goto; });
    });

    addResize(win);
    surface.appendChild(win);
  }

  function openIframeWindow(url, title) {
    // If already open, bring to front
    var existing = surface.querySelector('.os-window[data-href-src="' + url + '"]');
    if (existing) { existing.style.zIndex = ++winZ; return; }

    var win = document.createElement('div');
    win.className = 'os-window';
    win.dataset.hrefSrc = url;

    var dragbar = document.createElement('div');
    dragbar.className = 'os-dragbar';
    win.appendChild(dragbar);

    var traffic = document.createElement('div');
    traffic.className = 'os-traffic';
    traffic.innerHTML = '<span class="tl-close"></span><span class="tl-min"></span><span class="tl-max"></span>';
    win.appendChild(traffic);

    var body = document.createElement('div');
    body.className = 'os-body os-body-iframe';
    var iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:0 0 10px 10px;overscroll-behavior:contain;';
    body.appendChild(iframe);
    win.appendChild(body);

    var isSmall = window.innerWidth <= 768;
    var surfW = surface.offsetWidth || window.innerWidth;
    var surfH = surface.offsetHeight || window.innerHeight;
    var winW = Math.min(700, surfW * 0.88);
    var winH = Math.min(520, surfH * 0.75);
    win.style.width = winW + 'px';
    win.style.height = winH + 'px';
    var offset = (openCount % 5) * (isSmall ? 16 : 30);
    win.style.left = Math.max(8, (surfW - winW) / 2 + offset) + 'px';
    win.style.top = Math.max(8, (surfH - winH) / 2 - 20 + offset) + 'px';
    win.style.zIndex = ++winZ;
    openCount++;

    traffic.querySelector('.tl-close').addEventListener('click', function(e) {
      e.stopPropagation();
      win.remove();
    });
    win.addEventListener('pointerdown', function() { win.style.zIndex = ++winZ; });
    dragbar.addEventListener('pointerdown', function(e) {
      e.preventDefault();
      var startX = e.clientX, startY = e.clientY;
      var origX = win.offsetLeft, origY = win.offsetTop;
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

    // External open button (top-right)
    var extBtn = document.createElement('div');
    extBtn.className = 'os-external';
    extBtn.title = '在新窗口打开';
    extBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
    extBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      window.open(url, '_blank');
    });
    win.appendChild(extBtn);

    addResize(win);
    surface.appendChild(win);
  }

  // Make icons draggable + clickable (macOS style)
  surface.querySelectorAll('.dicon').forEach(function(icon) {
    var wasDragged = false;
    icon.addEventListener('pointerdown', function(e) {
      if (e.button !== 0) return;
      e.preventDefault();
      wasDragged = false;
      var startX = e.clientX, startY = e.clientY;
      // Convert right-positioned to left-positioned
      var rect = icon.getBoundingClientRect();
      var surfRect = surface.getBoundingClientRect();
      var origX = rect.left - surfRect.left;
      var origY = rect.top - surfRect.top;
      icon.style.right = 'auto';
      icon.style.left = origX + 'px';
      icon.style.top = origY + 'px';

      function onMove(ev) {
        var dx = ev.clientX - startX;
        var dy = ev.clientY - startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) wasDragged = true;
        icon.style.left = (origX + dx) + 'px';
        icon.style.top = (origY + dy) + 'px';
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
    icon.addEventListener('dblclick', function() {
      if (icon.dataset.href) {
        openIframeWindow(icon.dataset.href, icon.querySelector('.dicon-label').textContent);
      } else if (icon.dataset.win) {
        openWindow(icon.dataset.win);
      }
    });
  });

  surface.addEventListener('click', function(e) {
    var closeAction = e.target.closest('[data-close-window]');
    if (closeAction) closeAction.closest('.os-window').remove();
  });

  // Folder icon dblclick → open iframe window on desktop
  surface.addEventListener('dblclick', function(e) {
    // Handle data-win (open template window)
    var fiWin = e.target.closest('.folder-icon[data-win]');
    if (fiWin) {
      openWindow(fiWin.dataset.win);
      return;
    }
    var fi = e.target.closest('.folder-icon[data-href]');
    if (!fi) return;
    var url = fi.dataset.href;
    var label = fi.querySelector('.folder-icon-label').textContent;
    openIframeWindow(url, label);
  });

  /* ============================================
     STAR WALLPAPER MOUSE INTERACTION
     ============================================ */
  (function() {
    var wpStars = surface.querySelectorAll('.wp-star');
    var mx = -9999, my = -9999;
    var radius = 130;

    surface.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
    });

    function updateStars() {
      wpStars.forEach(function(star) {
        var rect = star.getBoundingClientRect();
        var sx = rect.left + rect.width / 2;
        var sy = rect.top + rect.height / 2;
        var dx = sx - mx;
        var dy = sy - my;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          var force = (1 - dist / radius) * 20;
          var angle = Math.atan2(dy, dx);
          var pushX = Math.cos(angle) * force;
          var pushY = Math.sin(angle) * force;
          var scale = 1 + (1 - dist / radius) * 0.4;
          star.style.setProperty('--push', 'translate(' + pushX + 'px, ' + pushY + 'px) scale(' + scale + ')');
          star.classList.add('disturbed');
        } else {
          star.style.setProperty('--push', 'translate(0, 0) scale(1)');
          star.classList.remove('disturbed');
        }
      });
      requestAnimationFrame(updateStars);
    }
    requestAnimationFrame(updateStars);

    // Click to spawn a star
    surface.addEventListener('click', function(e) {
      // Don't spawn on icon/window interactions
      if (e.target.closest('.dicon, .os-window, .desktop-sticker')) return;
      var star = document.createElement('span');
      star.className = 'click-star';
      star.textContent = '\u2726';
      var size = 6 + Math.random() * 10;
      star.style.fontSize = size + 'px';
      star.style.left = (e.clientX - size / 2) + 'px';
      star.style.top = (e.clientY - size / 2) + 'px';
      document.body.appendChild(star);
      setTimeout(function() { star.remove(); }, 750);
    });
  })();

  /* ============================================
     DRAGGABLE STICKER
     ============================================ */
  (function() {
    var sticker = document.getElementById('desktopSticker');
    if (!sticker) return;
    sticker.addEventListener('pointerdown', function(e) {
      e.preventDefault();
      var startX = e.clientX, startY = e.clientY;
      var origX = sticker.offsetLeft, origY = sticker.offsetTop;
      // Switch from bottom/right to top/left positioning
      sticker.style.bottom = 'auto';
      sticker.style.right = 'auto';
      sticker.style.left = origX + 'px';
      sticker.style.top = origY + 'px';

      function onMove(ev) {
        sticker.style.left = (origX + ev.clientX - startX) + 'px';
        sticker.style.top = (origY + ev.clientY - startY) + 'px';
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
  })();

  /* ============================================
     EXIT ZOOM-OUT (scroll-driven)
     ============================================ */
  var exitSection = document.getElementById('exitSection');
  var exitCanvasContent = document.getElementById('exitCanvasContent');
  var exitMacbook = document.getElementById('exitMacbook');
  var goodbyeScreen = document.getElementById('goodbyeScreen');
  var exitScreenEl = document.getElementById('exitScreen');

  var isMobile = window.innerWidth <= 768;
  var screenW = isMobile ? 348 : 680;
  var screenH = isMobile ? 260 : 440;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  var ticking = false;
  function onScroll() {
    if (!launched || looping || currentTab() !== 'home') return;
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function() {
      ticking = false;

      var rect = exitSection.getBoundingClientRect();
      var sectionHeight = exitSection.offsetHeight;
      var vh = window.innerHeight;
      var scrolled = -rect.top;
      var scrollableDistance = sectionHeight - vh;
      if (scrollableDistance <= 0) return;

      var progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // Phase 1: 0 → 0.5 - MacBook scales down from full-screen to normal
      var p1 = Math.min(1, progress / 0.5);
      var ep = easeInOutCubic(p1);
      exitMacbook.style.opacity = 1;
      var baseScale = Math.max(window.innerWidth / screenW, vh / screenH) * 1.05;
      var macScale = baseScale - (baseScale - 1) * ep;
      exitMacbook.style.transform = 'scale(' + macScale + ')';

      // Phase 2: 0.3 → 0.6 - goodbye screen fades in
      if (progress >= 0.3) {
        var p2 = Math.min(1, (progress - 0.3) / 0.3);
        goodbyeScreen.classList.add('visible');
        goodbyeScreen.style.opacity = easeInOutCubic(p2);
      } else {
        goodbyeScreen.classList.remove('visible');
        goodbyeScreen.style.opacity = 0;
      }

      // Phase 3: 0.6 → 1 - settled
      if (progress >= 0.6) {
        exitMacbook.style.transform = 'scale(1)';
        goodbyeScreen.style.opacity = 1;
        goodbyeScreen.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function() {
    isMobile = window.innerWidth <= 768;
    screenW = isMobile ? 348 : 680;
    screenH = isMobile ? 260 : 440;
  });

  /* ============================================
     LOOP: Say Hi → terminal types → Enter → desktop
     ============================================ */
  function triggerLoop() {
    if (looping || !launched) return;
    looping = true;

    goodbyeScreen.style.transition = 'opacity 0.6s ease';
    goodbyeScreen.style.opacity = '0';
    exitScreenEl.style.transition = 'background 0.6s ease';
    exitScreenEl.style.background = '#2B7FD8';

    setTimeout(function() {
      var termArea = document.createElement('div');
      termArea.id = 'loopTerminal';
      termArea.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:#2B7FD8;padding:16px 20px;font-family:"Fira Code",monospace;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.9);overflow:hidden;z-index:10;';

      var titlebar = document.createElement('div');
      titlebar.style.cssText = 'display:flex;align-items:center;gap:7px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.15);margin-bottom:14px;';
      ['#ff5f57','#ffbd2e','#28ca41'].forEach(function(c) {
        var dot = document.createElement('span');
        dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:' + c + ';';
        titlebar.appendChild(dot);
      });
      var titleText = document.createElement('span');
      titleText.style.cssText = 'color:rgba(255,255,255,0.5);font-size:11px;margin-left:auto;margin-right:auto;font-family:sans-serif;';
      titleText.textContent = terminalTitleText;
      titlebar.appendChild(titleText);
      termArea.appendChild(titlebar);

      var termLines = document.createElement('div');
      termArea.appendChild(termLines);
      exitScreenEl.appendChild(termArea);

      var lineDelay = 0;
      var loopTypingDone = false;
      var loopLaunched = false;

      terminalData.forEach(function(item) {
        var div = document.createElement('div');
        div.style.cssText = 'white-space:pre-wrap;opacity:0;transform:translateY(6px);transition:opacity 0.3s ease,transform 0.3s ease;';
        if (item.type === 'blank') { div.innerHTML = '&nbsp;'; lineDelay += 200; }
        else if (item.type === 'cmd') {
          var html = '<span style="color:#F4D758;font-weight:700">' + item.prompt + '</span><span style="color:#fff;font-weight:500">' + item.text + '</span>';
          if (item.cursor) html += '<span style="display:inline-block;width:9px;height:17px;background:#fff;vertical-align:middle;margin-left:2px;animation:blink 1s step-end infinite" id="loopCursor"></span>';
          div.innerHTML = html;
          lineDelay += 400;
        } else if (item.type === 'output') {
          div.innerHTML = '<span style="color:rgba(255,255,255,0.85)">' + item.prefix + item.text + '</span>';
          lineDelay += 150;
        } else if (item.type === 'gold') {
          div.innerHTML = '<span style="background:#F4D758;color:#1E5BA8;font-weight:700;font-size:13px;padding:1px 6px;border-radius:3px">' + item.prefix + item.text + '</span>';
          lineDelay += 150;
        }
        termLines.appendChild(div);
        (function(el, delay) {
          setTimeout(function() { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, delay);
        })(div, lineDelay);
        if (item.type === 'cmd') lineDelay += 600;
        else if (item.type === 'output') lineDelay += 300;
        else if (item.type === 'gold') lineDelay += 400;
      });

      setTimeout(function() {
        loopTypingDone = true;
        var hint = document.createElement('div');
        hint.style.cssText = 'text-align:center;margin-top:16px;font-size:11px;color:rgba(30,91,168,0.5);opacity:0;transition:opacity 0.5s ease;';
        hint.textContent = 'press enter to launch ↵';
        termLines.appendChild(hint);
        setTimeout(function() { hint.style.opacity = '1'; }, 100);
      }, lineDelay + 600);

      function skipLoopTyping() {
        if (loopTypingDone) return;
        loopTypingDone = true;
        termLines.querySelectorAll('div').forEach(function(l) {
          l.style.opacity = '1';
          l.style.transform = 'translateY(0)';
        });
      }

      function loopLaunch() {
        if (loopLaunched || !loopTypingDone) return;
        loopLaunched = true;

        var cursor = document.getElementById('loopCursor');
        if (cursor) cursor.remove();

        var launchLine = document.createElement('div');
        launchLine.style.cssText = 'white-space:pre-wrap;opacity:0;transition:opacity 0.3s ease;';
        launchLine.innerHTML = '<span style="color:#2B7FD8">> launching...</span>';
        termLines.appendChild(launchLine);
        setTimeout(function() { launchLine.style.opacity = '1'; }, 50);

        setTimeout(function() {
          var overlay = document.getElementById('transitionOverlay');
          overlay.classList.add('active');

          setTimeout(function() {
            if (termArea.parentNode) termArea.parentNode.removeChild(termArea);

            // Reset exit section state
            exitMacbook.style.transition = 'none';
            exitMacbook.style.transform = '';
            exitMacbook.style.opacity = '1';
            goodbyeScreen.classList.remove('visible');
            goodbyeScreen.style.opacity = '0';
            goodbyeScreen.style.transition = 'none';
            exitScreenEl.style.background = '';
            exitScreenEl.style.transition = 'none';
            exitCanvasContent.style.transform = '';
            exitCanvasContent.style.opacity = '1';
            exitCanvasContent.style.filter = '';

            // Land back on the desktop top
            window.scrollTo(0, 0);
            void document.body.offsetHeight;

            exitMacbook.style.transition = '';
            goodbyeScreen.style.transition = '';
            exitScreenEl.style.transition = '';

            setTimeout(function() {
              overlay.classList.remove('active');
              looping = false;
            }, 300);
          }, 400);
        }, 500);
      }

      function onLoopKey(e) {
        if (e.key === 'Enter') loopLaunch();
        else if (!loopTypingDone) skipLoopTyping();
      }
      function onLoopClick() {
        if (!loopTypingDone) { skipLoopTyping(); return; }
        loopLaunch();
      }
      document.addEventListener('keydown', onLoopKey);
      exitScreenEl.addEventListener('click', onLoopClick);

      var cleanupInterval = setInterval(function() {
        if (!looping) {
          document.removeEventListener('keydown', onLoopKey);
          exitScreenEl.removeEventListener('click', onLoopClick);
          clearInterval(cleanupInterval);
        }
      }, 500);
    }, 700);
  }

  document.getElementById('backToTopLink').addEventListener('click', function(e) {
    e.preventDefault();
    triggerLoop();
  });

  // Auto-trigger loop when user keeps scrolling at the very bottom
  var lastScrollY = 0;
  window.addEventListener('scroll', function() {
    if (!launched || looping || currentTab() !== 'home') return;
    var currentY = window.scrollY || window.pageYOffset;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (currentY >= maxScroll - 50 && currentY > lastScrollY) triggerLoop();
    lastScrollY = currentY;
  }, { passive: true });

  // Init
  switchTab(currentTab());

  return function disposeSite() {
    timeoutIds.forEach((timeoutId) => nativeClearTimeout(timeoutId));
    intervalIds.forEach((intervalId) => nativeClearInterval(intervalId));
    animationFrameIds.forEach((frameId) => nativeCancelAnimationFrame(frameId));
    listenerRecords.forEach(([target, type, listener, options]) => {
      originalRemoveEventListener.call(target, type, listener, options);
    });
    if (EventTarget.prototype.addEventListener !== originalAddEventListener) {
      EventTarget.prototype.addEventListener = originalAddEventListener;
    }
    hasInitialized = false;
  };
}
