/* ============================================================================
 *  站点交互编排入口
 *
 *  职责只有两件事：
 *  1. 给定时器 / 动画帧包一层「可追踪」的壳，卸载时统一清理（React 严格模式友好）
 *  2. 按依赖顺序初始化各交互模块（src/lib/sections/*），共享 ctx 上下文
 * ==========================================================================*/
import siteConfig from '../config/siteConfig';
import { initTabs } from './sections/tabs';
import { initClock } from './sections/clock';
import { initTerminal } from './sections/terminal';
import { initWindows } from './sections/windows';
import { initWallpaper } from './sections/wallpaper';
import { initSticker } from './sections/sticker';
import { initExitLoop } from './sections/exitLoop';

let hasInitialized = false;

export function initializeSite() {
  if (hasInitialized) return undefined;
  hasInitialized = true;

  /* ---- 可追踪的定时器 / 动画帧 ---- */
  const timeoutIds = new Set();
  const intervalIds = new Set();
  const animationFrameIds = new Set();
  const nativeSetTimeout = window.setTimeout.bind(window);
  const nativeClearTimeout = window.clearTimeout.bind(window);
  const nativeSetInterval = window.setInterval.bind(window);
  const nativeClearInterval = window.clearInterval.bind(window);
  const nativeRequestAnimationFrame = window.requestAnimationFrame.bind(window);
  const nativeCancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  /* ---- 共享上下文：各模块通过 ctx.state / ctx.data / ctx.api 协作 ---- */
  const ctx = {
    config: siteConfig,
    env: {
      setTimeout: (fn, delay) => {
        const id = nativeSetTimeout(() => { timeoutIds.delete(id); fn(); }, delay);
        timeoutIds.add(id);
        return id;
      },
      clearTimeout: (id) => { timeoutIds.delete(id); nativeClearTimeout(id); },
      setInterval: (fn, delay) => {
        const id = nativeSetInterval(fn, delay);
        intervalIds.add(id);
        return id;
      },
      clearInterval: (id) => { intervalIds.delete(id); nativeClearInterval(id); },
      requestAnimationFrame: (fn) => {
        const id = nativeRequestAnimationFrame((t) => { animationFrameIds.delete(id); fn(t); });
        animationFrameIds.add(id);
        return id;
      },
    },
    state: { typingDone: false, launched: false, looping: false },
    data: {},
    api: {},
  };

  /* ---- 记录所有事件监听，供 dispose 统一摘除 ---- */
  const listenerRecords = [];
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    listenerRecords.push([this, type, listener, options]);
    return originalAddEventListener.call(this, type, listener, options);
  };

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---- 按依赖顺序初始化：tabs 先行（其他模块依赖 currentTab / scrollLock） ---- */
  initTabs(ctx);
  initClock(ctx);
  initTerminal(ctx);
  initWindows(ctx);
  initWallpaper(ctx);
  initSticker(ctx);
  initExitLoop(ctx);

  // 应用初始 hash 路由（放在最后，等所有模块就绪）
  ctx.api.switchTab();

  return function disposeSite() {
    timeoutIds.forEach((id) => nativeClearTimeout(id));
    intervalIds.forEach((id) => nativeClearInterval(id));
    animationFrameIds.forEach((id) => nativeCancelAnimationFrame(id));
    listenerRecords.forEach(([target, type, listener, options]) => {
      originalRemoveEventListener.call(target, type, listener, options);
    });
    if (EventTarget.prototype.addEventListener !== originalAddEventListener) {
      EventTarget.prototype.addEventListener = originalAddEventListener;
    }
    hasInitialized = false;
  };
}
