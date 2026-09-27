import React from 'react';

// 卡片模板系统
// editField: 双击用 textarea 内联编辑该字段
// editModal: 双击重新打开创建弹窗编辑
// 两者皆无 = 不可编辑内容（只能删除/互动）

export const TEMPLATES = [
  // —— 访客可创建 ——
  { id: 'intro', name: '自我介绍卡', icon: '🪪', w: 300, h: 230, editModal: true, visitor: true },
  { id: 'sticker', name: '贴纸卡', icon: '😆', w: 150, h: 100, editModal: true, visitor: true },
  { id: 'polaroid', name: '拍立得卡', icon: '📸', w: 230, h: 380, editField: 'caption', visitor: true },
  { id: 'vote', name: '投票卡', icon: '🗳️', w: 300, h: 320, editField: 'question', visitor: true },
  // —— 仅管理员预制 ——
  { id: 'washi', name: '胶带卡', icon: '📦', w: 360, h: 280, editField: 'body' },
  { id: 'profile', name: '个人卡', icon: '👤', w: 380, h: 430 },
  { id: 'sticky', name: '便利贴', icon: '🗒️', w: 220, h: 170, editField: 'text' },
  { id: 'darkquote', name: '深色引用卡', icon: '❝', w: 340, h: 190, editField: 'text' },
  { id: 'narrative', name: '叙事卡', icon: '📖', w: 400, h: 230, editField: 'text' },
];

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

export function isEditable(tplId) {
  const t = getTemplate(tplId);
  return t.editField != null || !!t.editModal;
}

// 内联编辑（textarea）用的主文本字段
export function editableText(tpl, data) {
  const f = getTemplate(tpl).editField;
  if (!f) return null;
  const v = data?.[f];
  return typeof v === 'string' ? v : '';
}

export function withEditedText(tpl, data, text) {
  const f = getTemplate(tpl).editField;
  if (!f) return data;
  return { ...data, [f]: text };
}

// 贴纸/头像可选 emoji
export const EMOJI_CHOICES = [
  '😀', '😂', '🥹', '😍', '🤔', '😴', '🙃', '😎',
  '🥳', '😭', '👍', '🫶', '❤️', '🔥', '✨', '🎉',
  '🍀', '🌙', '⭐', '🐱', '🐶', '🍉', '☕', '🚀',
];

// ---------- 模板渲染 ----------
export default function TemplateBody({ tpl, data, myToken, movedRef, onVote, onShowQr }) {
  switch (tpl) {
    case 'intro':
      return <IntroCard data={data} />;
    case 'sticker':
      return <StickerCard data={data} />;
    case 'polaroid':
      return <PolaroidCard data={data} />;
    case 'vote':
      return <VoteCard data={data} myToken={myToken} movedRef={movedRef} onVote={onVote} />;
    case 'profile':
      return <ProfileCard data={data} movedRef={movedRef} onShowQr={onShowQr} />;
    case 'sticky':
      return <div className="sticky-text">{data?.text}</div>;
    case 'darkquote':
      return (
        <>
          <div className="darkquote-text">{data?.text}</div>
          {data?.author && <div className="darkquote-author">— {data.author}</div>}
        </>
      );
    case 'narrative':
      return (
        <>
          <div className="narrative-text">{data?.text}</div>
          {data?.author && <div className="narrative-author">— {data.author}</div>}
        </>
      );
    case 'washi':
    default:
      return <WashiCard data={data} />;
  }
}

// 🪪 自我介绍卡：社交电子名片
function IntroCard({ data }) {
  return (
    <>
      <div className="intro-head">
        <span className="intro-avatar-bare">{data?.emoji || '😀'}</span>
        <div className="intro-id">
          <div className="intro-name">{data?.name || '神秘访客'}</div>
          {data?.bio && <div className="intro-bio">{data.bio}</div>}
        </div>
      </div>
      {data?.tags?.length > 0 && (
        <div className="intro-tags">
          {data.tags.map((t, i) => (
            <span key={i} className="intro-tag">#{t}</span>
          ))}
        </div>
      )}
      {data?.link && (
        <a
          className="intro-link"
          href={data.link}
          target="_blank"
          rel="noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
        >
          🔗 {linkLabel(data.link)} →
        </a>
      )}
    </>
  );
}

function linkLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '我的主页';
  }
}

// 😆 贴纸卡
function StickerCard({ data }) {
  return <div className="sticker-emoji">{data?.emoji || '😆'}</div>;
}

// 📸 拍立得卡
function PolaroidCard({ data }) {
  return (
    <>
      {data?.image ? (
        <img className="polaroid-img" src={data.image} alt={data?.caption || '拍立得'} draggable={false} />
      ) : (
        <div className="polaroid-empty">📷</div>
      )}
      <div className="polaroid-caption">{data?.caption || ''}</div>
    </>
  );
}

// 🗳️ 投票卡：单选，点一下投票，再点取消
function VoteCard({ data, myToken, movedRef, onVote }) {
  const options = data?.options || [];
  const total = options.reduce((s, o) => s + (o.votes?.length || 0), 0);
  return (
    <>
      <div className="vote-q">{data?.question}</div>
      <div className="vote-ops">
        {options.map((op, i) => {
          const n = op.votes?.length || 0;
          const pct = total ? Math.round((n / total) * 100) : 0;
          const mine = !!myToken && op.votes?.includes(myToken);
          return (
            <button
              key={i}
              className={`vote-op${mine ? ' mine' : ''}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (movedRef?.current) return; // 拖动卡片时不触发投票
                onVote?.(i);
              }}
            >
              <span className="vote-fill" style={{ width: `${pct}%` }} />
              <span className="vote-op-text">{op.text}</span>
              <span className="vote-op-n">{n}</span>
            </button>
          );
        })}
      </div>
      <div className="vote-total">{total} 人投过 · 点选项投票</div>
    </>
  );
}

// 📦 胶带卡（预制装饰）
function WashiCard({ data }) {
  return (
    <>
      {data?.title && <div className="washi-title">{data.title}</div>}
      {data?.body && <div className="washi-body">{data.body}</div>}
    </>
  );
}

// 👤 个人卡（预制：站主名片）
function ProfileCard({ data, movedRef, onShowQr }) {
  return (
    <>
      <div className="card-profile-header">
        {data?.avatarImg ? (
          <img className="profile-avatar-img" src={data.avatarImg} alt={data?.name || '头像'} draggable={false} />
        ) : (
          <div className="profile-avatar">{data?.avatar || '👩‍💻'}</div>
        )}
        <div className="profile-name">{data?.name}</div>
        {data?.sub && <div className="profile-sub">{data.sub}</div>}
        {data?.tag && <span className="profile-tag">{data.tag}</span>}
      </div>
      <div className="card-profile-body">
        {data?.slogan && <div className="profile-slogan">{data.slogan}</div>}
        {data?.belief && <div className="profile-belief">{data.belief}</div>}
        {data?.quote && <div className="profile-quote">{data.quote}</div>}
        {data?.links && data.links.length > 0 && (
          <div className="profile-links">
            {data.links.map((l, i) =>
              l.qr ? (
                <button
                  key={i}
                  className="profile-link"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (movedRef?.current) return; // 拖动卡片时不触发
                    onShowQr?.(l.qr);
                  }}
                >
                  {l.label}
                </button>
              ) : (
                <a key={i} className="profile-link" href={l.href} target="_blank" rel="noreferrer" onPointerDown={(e) => e.stopPropagation()}>
                  {l.label}
                </a>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}
