/* 告别屏：滚动驱动 MacBook 缩回正常大小并淡入告别终端；
 * 到达底部后自动「重播」——终端重新打字，按 Enter 回到桌面 */

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function initExitLoop(ctx) {
  const { env, state } = ctx;
  const exitSection = document.getElementById('exitSection');
  const exitMacbook = document.getElementById('exitMacbook');
  const goodbyeScreen = document.getElementById('goodbyeScreen');
  const exitScreenEl = document.getElementById('exitScreen');

  let isMobile = window.innerWidth <= 768;
  let screenW = isMobile ? 348 : 680;
  let screenH = isMobile ? 260 : 440;

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    screenW = isMobile ? 348 : 680;
    screenH = isMobile ? 260 : 440;
  });

  let ticking = false;
  function onScroll() {
    if (!state.launched || state.looping || ctx.api.currentTab() !== 'home') return;
    if (ticking) return;
    ticking = true;

    ctx.env.requestAnimationFrame(() => {
      ticking = false;

      const rect = exitSection.getBoundingClientRect();
      const sectionHeight = exitSection.offsetHeight;
      const vh = window.innerHeight;
      const scrolled = -rect.top;
      const scrollableDistance = sectionHeight - vh;
      if (scrollableDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // 阶段 1（0 → 0.5）：MacBook 从全屏缩回正常大小
      const p1 = Math.min(1, progress / 0.5);
      const ep = easeInOutCubic(p1);
      exitMacbook.style.opacity = 1;
      const baseScale = Math.max(window.innerWidth / screenW, vh / screenH) * 1.05;
      const macScale = baseScale - (baseScale - 1) * ep;
      exitMacbook.style.transform = 'scale(' + macScale + ')';

      // 阶段 2（0.3 → 0.6）：告别终端淡入
      if (progress >= 0.3) {
        const p2 = Math.min(1, (progress - 0.3) / 0.3);
        goodbyeScreen.classList.add('visible');
        goodbyeScreen.style.opacity = easeInOutCubic(p2);
      } else {
        goodbyeScreen.classList.remove('visible');
        goodbyeScreen.style.opacity = 0;
      }

      // 阶段 3（0.6 → 1）：定格
      if (progress >= 0.6) {
        exitMacbook.style.transform = 'scale(1)';
        goodbyeScreen.style.opacity = 1;
        goodbyeScreen.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 重播：蓝色终端重新打字 → Enter → 回到桌面顶部 */
  function triggerLoop() {
    if (state.looping || !state.launched) return;
    state.looping = true;

    goodbyeScreen.style.transition = 'opacity 0.6s ease';
    goodbyeScreen.style.opacity = '0';
    exitScreenEl.style.transition = 'background 0.6s ease';
    exitScreenEl.style.background = '#2B7FD8';

    env.setTimeout(() => {
      const termArea = document.createElement('div');
      termArea.id = 'loopTerminal';
      termArea.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:#2B7FD8;padding:16px 20px;font-family:"Fira Code",monospace;font-size:13px;line-height:1.7;color:rgba(255,255,255,0.9);overflow:hidden;z-index:10;';

      const titlebar = document.createElement('div');
      titlebar.style.cssText = 'display:flex;align-items:center;gap:7px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.15);margin-bottom:14px;';
      ['#ff5f57', '#ffbd2e', '#28ca41'].forEach((c) => {
        const dot = document.createElement('span');
        dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:' + c + ';';
        titlebar.appendChild(dot);
      });
      const titleText = document.createElement('span');
      titleText.style.cssText = 'color:rgba(255,255,255,0.5);font-size:11px;margin-left:auto;margin-right:auto;font-family:sans-serif;';
      titleText.textContent = ctx.data.terminalTitleText;
      titlebar.appendChild(titleText);
      termArea.appendChild(titlebar);

      const termLines = document.createElement('div');
      termArea.appendChild(termLines);
      exitScreenEl.appendChild(termArea);

      let lineDelay = 0;
      let loopTypingDone = false;
      let loopLaunched = false;

      ctx.data.terminalData.forEach((item) => {
        const div = document.createElement('div');
        div.style.cssText = 'white-space:pre-wrap;opacity:0;transform:translateY(6px);transition:opacity 0.3s ease,transform 0.3s ease;';
        if (item.type === 'blank') { div.innerHTML = '&nbsp;'; lineDelay += 200; }
        else if (item.type === 'cmd') {
          let html = '<span style="color:#F4D758;font-weight:700">' + item.prompt + '</span><span style="color:#fff;font-weight:500">' + item.text + '</span>';
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
        ((el, delay) => {
          env.setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, delay);
        })(div, lineDelay);
        if (item.type === 'cmd') lineDelay += 600;
        else if (item.type === 'output') lineDelay += 300;
        else if (item.type === 'gold') lineDelay += 400;
      });

      env.setTimeout(() => {
        loopTypingDone = true;
        const hint = document.createElement('div');
        hint.style.cssText = 'text-align:center;margin-top:16px;font-size:11px;color:rgba(30,91,168,0.5);opacity:0;transition:opacity 0.5s ease;';
        hint.textContent = 'press enter to launch ↵';
        termLines.appendChild(hint);
        env.setTimeout(() => { hint.style.opacity = '1'; }, 100);
      }, lineDelay + 600);

      function skipLoopTyping() {
        if (loopTypingDone) return;
        loopTypingDone = true;
        termLines.querySelectorAll('div').forEach((l) => {
          l.style.opacity = '1';
          l.style.transform = 'translateY(0)';
        });
      }

      function loopLaunch() {
        if (loopLaunched || !loopTypingDone) return;
        loopLaunched = true;

        const cursor = document.getElementById('loopCursor');
        if (cursor) cursor.remove();

        const launchLine = document.createElement('div');
        launchLine.style.cssText = 'white-space:pre-wrap;opacity:0;transition:opacity 0.3s ease;';
        launchLine.innerHTML = '<span style="color:#2B7FD8">> launching...</span>';
        termLines.appendChild(launchLine);
        env.setTimeout(() => { launchLine.style.opacity = '1'; }, 50);

        env.setTimeout(() => {
          const overlay = document.getElementById('transitionOverlay');
          overlay.classList.add('active');

          env.setTimeout(() => {
            if (termArea.parentNode) termArea.parentNode.removeChild(termArea);

            // 复位告别屏状态
            exitMacbook.style.transition = 'none';
            exitMacbook.style.transform = '';
            exitMacbook.style.opacity = '1';
            goodbyeScreen.classList.remove('visible');
            goodbyeScreen.style.opacity = '0';
            goodbyeScreen.style.transition = 'none';
            exitScreenEl.style.background = '';
            exitScreenEl.style.transition = 'none';

            // 落回桌面顶部
            window.scrollTo(0, 0);
            void document.body.offsetHeight;

            exitMacbook.style.transition = '';
            goodbyeScreen.style.transition = '';
            exitScreenEl.style.transition = '';

            env.setTimeout(() => {
              overlay.classList.remove('active');
              state.looping = false;
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

      const cleanupInterval = env.setInterval(() => {
        if (!state.looping) {
          document.removeEventListener('keydown', onLoopKey);
          exitScreenEl.removeEventListener('click', onLoopClick);
          env.clearInterval(cleanupInterval);
        }
      }, 500);
    }, 700);
  }

  document.getElementById('backToTopLink').addEventListener('click', (e) => {
    e.preventDefault();
    triggerLoop();
  });

  // 在最底部继续往下滚时自动重播
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    if (!state.launched || state.looping || ctx.api.currentTab() !== 'home') return;
    const currentY = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (currentY >= maxScroll - 50 && currentY > lastScrollY) triggerLoop();
    lastScrollY = currentY;
  }, { passive: true });
}
