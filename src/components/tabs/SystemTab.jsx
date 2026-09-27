import { useEffect, useRef, useState } from 'react';
import siteConfig from '../../config/siteConfig';

/* TAB: system —— 共享画布：留言便签 + 可拖拽贴纸（本地持久化） */

const STORE_KEY = 'kael_os_canvas_v1';
const NOTE_COLORS = ['#FFF3B0', '#FFD6A5', '#C9F2C7', '#CDE7FF', '#F6C6D0'];

const SEED_NOTES = [
  { x: 0.06, y: 0.10, color: 0, text: '欢迎来到我的系统画布 ✨\n双击任意空白处，写下你想说的话。', who: '汤勇 Kael Odin' },
  { x: 0.42, y: 0.24, color: 2, text: '正在折腾的东西都会贴在这里：榜单、镜像站、小工具……', who: '汤勇 Kael Odin' },
  { x: 0.14, y: 0.58, color: 3, text: '对某个项目有想法？留一张便签，我会逐条看。', who: '汤勇 Kael Odin' },
  { x: 0.62, y: 0.62, color: 1, text: '先跑通，再讲清楚。', who: '座右铭' },
];

const SEED_STICKERS = [
  { x: 0.78, y: 0.12, src: 'avatar.png', size: 84, label: '我的头像贴纸' },
  { x: 0.30, y: 0.34, emoji: '🤖', size: 56, label: 'AI 贴纸' },
  { x: 0.86, y: 0.55, emoji: '🧪', size: 52, label: '测试贴纸' },
  { x: 0.55, y: 0.08, emoji: '⭐', size: 48, label: '星星贴纸' },
];

export default function SystemTab() {
  const boardRef = useRef(null);
  const dragState = useRef(null);
  const [notes, setNotes] = useState([]);
  const [stickers, setStickers] = useState([]);

  /* 初始化：读 localStorage，否则用种子数据 */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        setNotes(d.notes ?? []);
        setStickers(d.stickers ?? []);
        return;
      }
    } catch (e) { /* 隐私模式等：直接用种子 */ }
    setNotes(SEED_NOTES.map((n, i) => ({ id: 'n' + i, ...n })));
    setStickers(SEED_STICKERS.map((s, i) => ({ id: 's' + i, ...s })));
  }, []);

  const persist = (nextNotes, nextStickers) => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ notes: nextNotes, stickers: nextStickers }));
    } catch (e) { /* 存不下就只留在内存 */ }
  };

  /* 通用拖拽：pointer 事件 + 百分比坐标存储 */
  const startDrag = (e, id, kind) => {
    const board = boardRef.current;
    if (!board) return;
    const items = kind === 'note' ? notes : stickers;
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const rect = board.getBoundingClientRect();
    dragState.current = { id, kind, rect, dx: e.clientX - (rect.left + item.x * rect.width), dy: e.clientY - (rect.top + item.y * rect.height) };
    e.target.setPointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    const onMove = (e) => {
      const st = dragState.current;
      if (!st) return;
      const x = Math.min(0.94, Math.max(0, (e.clientX - st.rect.left - st.dx) / st.rect.width));
      const y = Math.min(0.88, Math.max(0, (e.clientY - st.rect.top - st.dy) / st.rect.height));
      if (st.kind === 'note') {
        setNotes((prev) => { const next = prev.map((n) => (n.id === st.id ? { ...n, x, y } : n)); persist(next, stickers); return next; });
      } else {
        setStickers((prev) => { const next = prev.map((s) => (s.id === st.id ? { ...s, x, y } : s)); persist(notes, next); return next; });
      }
    };
    const onUp = () => { dragState.current = null; };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, [notes, stickers]);

  /* 双击空白处新增便签 */
  const onBoardDblClick = (e) => {
    if (e.target.closest('.canvas-note') || e.target.closest('.canvas-sticker')) return;
    const rect = boardRef.current.getBoundingClientRect();
    const text = window.prompt('写一张留言便签：');
    if (!text || !text.trim()) return;
    const x = Math.min(0.74, Math.max(0.02, (e.clientX - rect.left) / rect.width));
    const y = Math.min(0.8, Math.max(0.02, (e.clientY - rect.top) / rect.height));
    const next = [...notes, {
      id: 'n' + Date.now(), x, y,
      color: Math.floor(Math.random() * NOTE_COLORS.length),
      text: text.trim(), who: '访客',
    }];
    setNotes(next);
    persist(next, stickers);
  };

  const removeNote = (id) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    persist(next, stickers);
  };

  return (
    <main className="tab-page" id="page-system">
      <div className="system-page">
        <div className="section-label">system/</div>
        <h2 className="section-heading">共享画布</h2>
        <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 14, color: '#8a8578', margin: '12px 0 28px' }}>
          一块随手涂写的白板：双击空白处留言，拖动便签和贴纸布置你喜欢的样子。内容保存在你的浏览器本地。
        </p>
        <div className="canvas-board" ref={boardRef} onDoubleClick={onBoardDblClick}>
          {notes.map((n) => (
            <div
              key={n.id}
              className="canvas-note"
              style={{ left: n.x * 100 + '%', top: n.y * 100 + '%', background: NOTE_COLORS[n.color % NOTE_COLORS.length] }}
              onPointerDown={(e) => startDrag(e, n.id, 'note')}
            >
              <button className="canvas-note-del" title="删除便签" onClick={(e) => { e.stopPropagation(); removeNote(n.id); }}>×</button>
              <div className="canvas-note-text">{n.text}</div>
              <div className="canvas-note-meta">—— {n.who}</div>
            </div>
          ))}
          {stickers.map((s) => (
            <div
              key={s.id}
              className="canvas-sticker"
              style={{ left: s.x * 100 + '%', top: s.y * 100 + '%', width: s.size, height: s.size, fontSize: s.emoji ? s.size * 0.7 : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={s.label}
              onPointerDown={(e) => startDrag(e, s.id, 'sticker')}
            >
              {s.emoji ? <span>{s.emoji}</span> : <img src={s.src} alt={s.label} draggable="false" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />}
            </div>
          ))}
          <div className="canvas-hint">双击空白处写留言 · 拖动便签与贴纸 · 数据仅保存在本地浏览器</div>
        </div>
      </div>
    </main>
  );
}
