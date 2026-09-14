/* 菜单栏右上角的假时钟（30s 精度足够） */

export function initClock() {
  const mbClock = document.getElementById('mbClock');
  function tick() {
    const d = new Date();
    mbClock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  tick();
  setInterval(tick, 30000);
}
