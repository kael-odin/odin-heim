import { useEffect, useRef, useState } from 'react';

/* TAB: system —— 共享白板：无限画布（留言便签 + 贴纸），对标 hiesther.me/#system
 * 功能：Drag 平移 / Scroll 缩放（指针为中心）/ ✍️留言 / +贴一张 / 卡片列表定位 / 本地持久化 */

const STORE_KEY = 'kael_os_canvas_v2';
const NOTE_COLORS = ['#FFF3B0', '#FFD6A5', '#C9F2C7', '#CDE7FF', '#F6C6D0'];
const STICKER_EMOJIS = ['⭐', '🤖', '🧪', '🐱', '☕', '🎉', '💡', '🔥', '🚀', '🧠', '❤️', '😎'];
const MIN_SCALE = 0.3;
const MAX_SCALE = 2.5;

const SEED_ITEMS = [
  { id: 'seed-n0', type: 'note', x: -180, y: -140, color: 0, text: '欢迎来到共享白板 ✨\n点右上「✍️ 留言」写下你想说的话，或「+ 贴一张」丢个贴纸。', who: '汤勇 Kael Odin' },
  { id: 'seed-n1', type: 'note', x: 60, y: -40, color: 2, text: '正在折腾的东西都会贴在这里：榜单、镜像站、小工具……', who: '汤勇 Kael Odin' },
  { id: 'seed-n2', type: 'note', x: -220, y: 80, color: 3, text: '先跑通，再讲清楚。', who: '座右铭' },
  { id: 'seed-s0', type: 'sticker', x: 260, y: -150, emoji: '⭐', who: '站长' },
  { id: 'seed-s1', type: 'sticker', x: 300, y: 60, emoji: '🤖', who: '站长' },
  { id: 'seed-s2', type: 'sticker', x: -80, y: 170, emoji: '🧪', who: '站长' },
];

function loadItems() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* 隐私模式等 */ }
  return SEED_ITEMS.map((it) => ({ ...it }));
}

export default function SystemTab() {
  const boardRef = useRef(null);
  const [items, setItems] = useState([]);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [panelOpen, setPanelOpen] = useState(true);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const dragRef = useRef(null);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const persist = (next) => {
    setItems(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch { /* 存不下就留在内存 */ }
  };

  /* --- 缩放：以指针为锚点 --- */
  const onWheel = (e) => {
    e.preventDefault();
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setView((v) => {
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor));
      // 保持指针下的画布坐标不动：new = p - (p - old) * (new/old)
      const x = px - ((px - v.x) * scale) / v.scale;
      const y = py - ((py - v.y) * scale) / v.scale;
      return { x, y, scale };
    });
  };

  /* --- 拖拽：空白平移 / 元素移动 --- */
  const onPointerDown = (e, itemId) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = itemId
      ? { kind: 'item', id: itemId, startX: e.clientX, startY: e.clientY, originX: 0, originY: 0 }
      : { kind: 'pan', startX: e.clientX, startY: e.clientY, originX: view.x, originY: view.y };
  };

  const onPointerMove = (e) => {
    const st = dragRef.current;
    if (!st) return;
    if (st.kind === 'pan') {
      setView((v) => ({ ...v, x: st.originX + (e.clientX - st.startX), y: st.originY + (e.clientY - st.startY) }));
      return;
    }
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const dx = (e.clientX - st.startX) / view.scale;
    const dy = (e.clientY - st.startY) / view.scale;
    if (!st.id || !st.originX) {
      // 记录起点对应的元素原坐标
      const it = items.find((i) => i.id === st.id);
      if (!it) return;
      st.originX = it.x;
      st.originY = it.y;
    }
    const next = items.map((it) => (it.id === st.id ? { ...it, x: st.originX + dx, y: st.originY + dy } : it));
    setItems(next);
  };

  const endDrag = () => {
    if (dragRef.current?.kind === 'item') persist(items);
    dragRef.current = null;
  };

  /* --- 留言：视口中心放一张便签 --- */
  const addNote = () => {
    const board = boardRef.current;
    if (!board) return;
    const text = window.prompt('写一条留言：');
    if (!text || !text.trim()) return;
    const rect = board.getBoundingClientRect();
    const cx = (rect.width / 2 - view.x) / view.scale;
    const cy = (rect.height / 2 - view.y) / view.scale;
    const item = {
      id: 'n' + Date.now(), type: 'note',
      x: cx - 95, y: cy - 40,
      color: Math.floor(Math.random() * NOTE_COLORS.length),
      text: text.trim(), who: '访客',
    };
    persist([...items, item]);
  };

  /* --- 贴一张：emoji 贴纸 --- */
  const addSticker = (emoji) => {
    const board = boardRef.current;
    setEmojiPicker(false);
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const cx = (rect.width / 2 - view.x) / view.scale;
    const cy = (rect.height / 2 - view.y) / view.scale;
    const item = { id: 's' + Date.now(), type: 'sticker', x: cx - 28, y: cy - 28, emoji, who: '访客' };
    persist([...items, item]);
  };

  /* --- 卡片列表点击：把元素带到视口中心 --- */
  const focusItem = (it) => {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    setView((v) => ({ ...v, x: rect.width / 2 - it.x * v.scale - 60, y: rect.height / 2 - it.y * v.scale - 30 }));
  };

  const fitView = () => setView({ x: 0, y: 0, scale: 1 });

  const removeItem = (id) => persist(items.filter((it) => it.id !== id));

  const worldStyle = {
    transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
    transformOrigin: '0 0',
  };
  const dotBg = {
    backgroundImage: `radial-gradient(#d8d3c4 1px, transparent 1px)`,
    backgroundSize: `${24 * view.scale}px ${24 * view.scale}px`,
    backgroundPosition: `${view.x}px ${view.y}px`,
  };

  return (
    <main className="tab-page" id="page-system">
      <div className="system-page system-page-full">
        {/* 顶栏工具条 */}
        <div className="canvas-toolbar">
          <span className="canvas-badge">🟡 共享白板</span>
          <div className="canvas-actions">
            <button className="canvas-btn canvas-btn-primary" onClick={addNote}>✍️ 留言</button>
            <div className="canvas-btn-group">
              <button className="canvas-btn" onClick={() => setEmojiPicker((v) => !v)}>+ 贴一张</button>
              {emojiPicker && (
                <div className="canvas-emoji-pop">
                  {STICKER_EMOJIS.map((e) => (
                    <button key={e} className="canvas-emoji" onClick={() => addSticker(e)}>{e}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="canvas-zoom">
            <span className="canvas-zoom-label">{Math.round(view.scale * 100)}%</span>
            <button className="canvas-btn" onClick={() => setView((v) => ({ ...v, scale: Math.max(MIN_SCALE, v.scale / 1.2) }))}>−</button>
            <button className="canvas-btn" onClick={() => setView((v) => ({ ...v, scale: Math.min(MAX_SCALE, v.scale * 1.2) }))}>+</button>
            <button className="canvas-btn" title="适应视图" onClick={fitView}>⊞</button>
          </div>
        </div>

        <div className="canvas-layout">
          {/* 左侧卡片列表 */}
          {panelOpen && (
            <aside className="canvas-panel">
              <div className="canvas-panel-title">✦ 卡片列表</div>
              <div className="canvas-panel-list">
                {items.length === 0 && <div className="canvas-panel-empty">还没有卡片，去画布上创建吧</div>}
                {items.map((it) => (
                  <button key={it.id} className="canvas-panel-item" onClick={() => focusItem(it)}>
                    <span className="canvas-panel-dot" style={{ background: it.type === 'note' ? NOTE_COLORS[(it.color ?? 0) % NOTE_COLORS.length] : 'transparent' }}>
                      {it.type === 'sticker' ? it.emoji : ''}
                    </span>
                    <span className="canvas-panel-text">{it.type === 'note' ? (it.text || '').slice(0, 18) : (it.emoji || '') + ' 贴纸'}</span>
                    <span className="canvas-panel-who">{it.who === '站长' ? 'Kael' : it.who}</span>
                  </button>
                ))}
              </div>
              <button className="canvas-panel-toggle" onClick={() => setPanelOpen(false)}>收起列表 ‹</button>
            </aside>
          )}
          {!panelOpen && (
            <button className="canvas-panel-toggle canvas-panel-toggle-closed" onClick={() => setPanelOpen(true)}>› 卡片列表</button>
          )}

          {/* 无限画布 */}
          <div
            className="canvas-board"
            ref={boardRef}
            onWheel={onWheel}
            onPointerDown={(e) => onPointerDown(e)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            style={dotBg}
          >
            <div className="canvas-hint">Scroll 缩放 · Drag 移动画布 · 双击留言</div>
            <div className="canvas-world" style={worldStyle}>
              {items.map((it) =>
                it.type === 'note' ? (
                  <div
                    key={it.id}
                    className="canvas-note"
                    style={{ left: it.x, top: it.y, background: NOTE_COLORS[(it.color ?? 0) % NOTE_COLORS.length] }}
                    onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e, it.id); }}
                    onDoubleClick={(e) => { e.stopPropagation(); removeItem(it.id); }}
                    title="拖动移动 · 双击删除"
                  >
                    <div className="canvas-note-text">{it.text}</div>
                    <div className="canvas-note-meta">—— {it.who}</div>
                  </div>
                ) : (
                  <div
                    key={it.id}
                    className="canvas-sticker"
                    style={{ left: it.x, top: it.y }}
                    title="拖动移动 · 双击删除"
                    onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e, it.id); }}
                    onDoubleClick={(e) => { e.stopPropagation(); removeItem(it.id); }}
                  >
                    {it.img ? <img src={it.img} alt="贴纸" draggable={false} /> : <span>{it.emoji}</span>}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
