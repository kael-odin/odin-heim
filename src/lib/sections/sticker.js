/* 桌面贴纸：可以拖着到处放的小头像 */

export function initSticker() {
  const sticker = document.getElementById('desktopSticker');
  if (!sticker) return;
  sticker.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    const origX = sticker.offsetLeft, origY = sticker.offsetTop;
    // 从 bottom/left 定位切换到 top/left，才能自由拖动
    sticker.style.bottom = 'auto';
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
}
