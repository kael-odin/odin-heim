import { useEffect, useRef } from 'react';

/* TAB: system —— 共享白板：整页 iframe 懒加载（100% 上游 esther-website-1 实现） */
export default function SystemTab() {
  const frameRef = useRef(null);
  useEffect(() => {
    const f = frameRef.current;
    if (f && !f.src && f.dataset.src) f.src = f.dataset.src;
  }, []);
  return (
    <main className="tab-page" id="page-system">
      <div className="canvas-page">
        <iframe ref={frameRef} data-src={`${import.meta.env.BASE_URL}whiteboard.html`} id="canvasFrame" title="Kael's Whiteboard"></iframe>
        <div className="canvas-hint">Scroll 缩放 · Drag 移动画布</div>
      </div>
    </main>
  );
}
