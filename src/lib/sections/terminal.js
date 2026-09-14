import siteConfig from '../../config/siteConfig';

/* 终端开场白：由 siteConfig 生成的打字序列（首屏 + 循环重播共用） */
export function buildTerminalData() {
  const data = [{ type: 'cmd', prompt: '$ ', text: 'whoami' }];
  data.push({ type: 'output', prefix: '> ', text: siteConfig.name });
  data.push({ type: 'blank' });
  data.push({ type: 'cmd', prompt: '$ ', text: 'cat about.md' });
  siteConfig.bioLines.forEach((line) => data.push({ type: 'output', prefix: '> ', text: line }));
  data.push({ type: 'blank' });
  data.push({ type: 'cmd', prompt: '$ ', text: 'echo "' + siteConfig.slogan + '"' });
  data.push({ type: 'gold', prefix: '> ', text: siteConfig.slogan });
  data.push({ type: 'blank' });
  data.push({ type: 'cmd', prompt: '$ ', text: 'open ' + siteConfig.osName.toLowerCase() + '.app', cursor: true });
  return data;
}

/* 首屏终端：逐行打字 → 进度条 → 缩入屏幕（进入桌面） */
export function initTerminal(ctx) {
  const { env, state } = ctx;
  ctx.data.terminalData = buildTerminalData();
  ctx.data.terminalTitleText =
    siteConfig.nameEn.split(' ')[0].toLowerCase() + '@' + siteConfig.osName.toLowerCase() + ' ~ zsh';

  const terminalTitleEl = document.getElementById('terminalTitle');
  if (terminalTitleEl) terminalTitleEl.textContent = ctx.data.terminalTitleText;
  const goodbyeTitleEl = document.getElementById('goodbyeTitle');
  if (goodbyeTitleEl) goodbyeTitleEl.textContent = ctx.data.terminalTitleText;

  const VISITED_KEY = siteConfig.osName.toLowerCase() + '_visited';
  let isReturnVisitor = false;
  try { isReturnVisitor = !!localStorage.getItem(VISITED_KEY); } catch (e) { /* 隐私模式等 */ }

  const container = document.getElementById('terminalLines');
  const heroCta = document.getElementById('heroCta');

  function renderLine(item) {
    const div = document.createElement('div');
    div.className = 'term-line';
    if (item.type === 'blank') {
      div.innerHTML = '&nbsp;';
    } else if (item.type === 'cmd') {
      let html = '<span class="term-prompt">' + item.prompt + '</span><span class="term-cmd">' + item.text + '</span>';
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
    state.typingDone = true;
    heroCta.classList.add('visible');
    document.getElementById('pillNav').classList.remove('hidden-during-intro');
    try { localStorage.setItem(VISITED_KEY, '1'); } catch (e) { /* 忽略 */ }
  }

  function launch() {
    if (state.launched || !state.typingDone || ctx.api.currentTab() !== 'home') return;
    state.launched = true; // 防重入；桌面在缩放完成后解锁滚动

    heroCta.classList.remove('visible');
    heroCta.classList.add('hidden');

    const cursorEl = document.getElementById('mainCursor');
    if (cursorEl) cursorEl.remove();

    const launchLine = document.createElement('div');
    launchLine.className = 'term-line';
    launchLine.innerHTML = '<span class="term-output">> launching...</span>';
    container.appendChild(launchLine);
    env.setTimeout(() => launchLine.classList.add('visible'), 50);

    const progressLine = document.createElement('div');
    progressLine.className = 'term-line';
    progressLine.innerHTML = '<span class="term-prompt" id="progressText">[░░░░░░░░░░░░] 0%</span>';
    container.appendChild(progressLine);
    env.setTimeout(() => progressLine.classList.add('visible'), 300);

    let progress = 0;
    const barLength = 12;
    env.setTimeout(() => {
      const progressText = document.getElementById('progressText');
      const interval = env.setInterval(() => {
        progress += 1;
        if (progress > barLength) {
          env.clearInterval(interval);
          beginZoom();
          return;
        }
        let filled = '', empty = '';
        for (let i = 0; i < barLength; i++) {
          if (i < progress) filled += '█'; else empty += '░';
        }
        const pct = Math.round((progress / barLength) * 100);
        if (progressText) progressText.textContent = '[' + filled + empty + '] ' + pct + '%';
      }, 80);
    }, 500);
  }

  function beginZoom() {
    const wrapper = document.getElementById('macbookWrapper');
    const screen = document.getElementById('macbookScreen');
    const terminal = document.getElementById('terminal');
    const overlay = document.getElementById('transitionOverlay');

    const screenRect = screen.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const scale = Math.max(vw / screenRect.width, vh / screenRect.height) * 1.05;

    const screenCenterX = screenRect.left + screenRect.width / 2;
    const screenCenterY = screenRect.top + screenRect.height / 2;
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;
    const wrapperCenterY = wrapperRect.top + wrapperRect.height / 2;
    const offsetX = screenCenterX - wrapperCenterX;
    const offsetY = screenCenterY - wrapperCenterY;
    const tx = vw / 2 - (wrapperCenterX + offsetX * scale);
    const ty = vh / 2 - (wrapperCenterY + offsetY * scale);

    env.setTimeout(() => terminal.classList.add('scale-through'), 200);

    wrapper.classList.add('zoom-transition');
    ctx.env.requestAnimationFrame(() => {
      ctx.env.requestAnimationFrame(() => {
        wrapper.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(' + scale + ')';
      });
    });

    env.setTimeout(() => overlay.classList.add('active'), 1200);

    env.setTimeout(() => {
      // 遮罩盖住时：隐藏 hero，落回桌面顶部
      document.getElementById('heroSection').style.display = 'none';
      ctx.api.applyScrollLock();
      window.scrollTo(0, 0);
      env.setTimeout(() => overlay.classList.remove('active'), 250);
    }, 1800);
  }

  ctx.api.launch = launch;

  if (isReturnVisitor) {
    // 回访者：终端直接全部显示，随后自动进入桌面
    ctx.data.terminalData.forEach((item) => renderLine(item).classList.add('visible'));
    finishIntro();
    env.setTimeout(launch, 700);
  } else {
    // 首访：逐行打字动画
    const divs = [];
    let lineDelay = 0;
    ctx.data.terminalData.forEach((item) => {
      const div = renderLine(item);
      if (item.type === 'blank') { lineDelay += 200; }
      else if (item.type === 'cmd') { lineDelay += 400; div.style.animationDelay = lineDelay + 'ms'; lineDelay += 600; }
      else if (item.type === 'output') { lineDelay += 150; div.style.animationDelay = lineDelay + 'ms'; lineDelay += 300; }
      else if (item.type === 'gold') { lineDelay += 150; div.style.animationDelay = lineDelay + 'ms'; lineDelay += 400; }
      divs.push(div);
      env.setTimeout(() => div.classList.add('visible'), 50);
    });

    const typingTimeout = env.setTimeout(finishIntro, lineDelay + 600);

    const skipTyping = () => {
      if (state.typingDone) return;
      env.clearTimeout(typingTimeout);
      divs.forEach((d) => { d.style.animationDelay = '0ms'; d.classList.add('visible'); });
      finishIntro();
    };

    document.getElementById('heroSection').addEventListener('click', () => {
      if (!state.typingDone) skipTyping();
    });
    document.addEventListener('keydown', (e) => {
      if (!state.typingDone && e.key !== 'Enter') skipTyping();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !state.launched) launch();
  });
  document.getElementById('macbookBezel').addEventListener('click', () => {
    if (state.typingDone) launch();
  });
  heroCta.addEventListener('click', launch);
}
