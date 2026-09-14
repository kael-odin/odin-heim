/* 壁纸星星：鼠标靠近会躲开；点击空白处种下一颗一闪而过的星星 */

export function initWallpaper(ctx) {
  const surface = document.getElementById('desktopSurface');
  let mx = -9999, my = -9999;
  const radius = 130;

  surface.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function updateStars() {
    surface.querySelectorAll('.wp-star').forEach((star) => {
      const rect = star.getBoundingClientRect();
      const sx = rect.left + rect.width / 2;
      const sy = rect.top + rect.height / 2;
      const dx = sx - mx;
      const dy = sy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const force = (1 - dist / radius) * 20;
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * force;
        const pushY = Math.sin(angle) * force;
        const scale = 1 + (1 - dist / radius) * 0.4;
        star.style.setProperty('--push', 'translate(' + pushX + 'px, ' + pushY + 'px) scale(' + scale + ')');
        star.classList.add('disturbed');
      } else {
        star.style.setProperty('--push', 'translate(0, 0) scale(1)');
        star.classList.remove('disturbed');
      }
    });
    ctx.env.requestAnimationFrame(updateStars);
  }
  ctx.env.requestAnimationFrame(updateStars);

  surface.addEventListener('click', (e) => {
    // 图标 / 窗口 / 贴纸上点击不种星
    if (e.target.closest('.dicon, .os-window, .desktop-sticker')) return;
    const star = document.createElement('span');
    star.className = 'click-star';
    star.textContent = '\u2726';
    const size = 6 + Math.random() * 10;
    star.style.fontSize = size + 'px';
    star.style.left = (e.clientX - size / 2) + 'px';
    star.style.top = (e.clientY - size / 2) + 'px';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 750);
  });
}
