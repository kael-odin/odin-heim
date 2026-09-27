import React from 'react';
import TemplateBody, { getTemplate, isEditable } from './templates.jsx';

// 一张卡：种子卡（esther 只读给访客）或访客卡（owner 可编辑/删除）
export default function CardView({
  card,
  myToken,
  canEdit,
  editing,
  editText,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onPointerDown,
  onStartEdit,
  onBringFront,
  onVote,
  onShowQr,
  movedRef,
}) {
  const isMessage = card.kind === 'message' && !card.tpl;
  const isMine = card.owner === myToken;
  const tpl = getTemplate(card.tpl);
  const editable = !!card.tpl && isEditable(card.tpl);
  const tplClass = `${TPL_CLASS[card.tpl] || ''}${card.tpl === 'sticky' && card.data?.blue ? ' blue-sticky' : ''}`;
  const style = {
    left: card.x,
    top: card.y,
    width: card.w || tpl.w,
    minHeight: card.h || tpl.h,
    zIndex: card.z || 1,
    cursor: canEdit ? undefined : 'default', // 别人的卡：不可拖动
  };

  return (
    <div
      className={`wb-card ${tplClass}${isMessage ? ' wb-card-message' : ''}${editing ? ' editing' : ''}`}
      id={card.id}
      style={style}
      onPointerDown={(e) => {
        e.stopPropagation(); // 阻止冒泡到画布（否则卡片拖拽会被平移覆盖）
        onPointerDown(e, card);
      }}
      onMouseEnter={onBringFront}
      onDoubleClick={(e) => {
        if (!canEdit || (!editable && !isMessage)) return;
        e.stopPropagation();
        onStartEdit(card);
      }}
    >
      {canEdit && (
        <div className="wb-card-actions">
          {!editing && (editable || isMessage) && (
            <button
              className="wb-card-act"
              title="编辑"
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit(card);
              }}
            >
              ✎
            </button>
          )}
          <button
            className="wb-card-act wb-card-del"
            title="删除"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card);
            }}
          >
            ×
          </button>
        </div>
      )}

      {isMessage && (
        <div className="wb-card-head">
          <span className="wb-card-avatar" style={{ background: avatarColor(card.owner) }}>
            {(card.name || '匿').charAt(0)}
          </span>
          <span className="wb-card-name">
            {card.name || '匿名'}
            {isMine && <em className="wb-card-mine">我</em>}
          </span>
          <span className="wb-card-time">{formatTime(card.createdAt)}</span>
        </div>
      )}

      {editing ? (
        <textarea
          className="wb-card-edit"
          value={editText}
          autoFocus
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={onSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              onCancelEdit();
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              onSaveEdit();
            }
          }}
        />
      ) : card.tpl ? (
        <div className="wb-card-body">
          <TemplateBody
            tpl={card.tpl}
            data={card.data}
            myToken={myToken}
            movedRef={movedRef}
            onVote={onVote ? (idx) => onVote(card, idx) : undefined}
            onShowQr={onShowQr}
          />
        </div>
      ) : (
        <pre className="wb-card-text">{card.text}</pre>
      )}
    </div>
  );
}

function avatarColor(token) {
  let h = 0;
  for (let i = 0; i < token.length; i++) h = (h * 31 + token.charCodeAt(i)) % 360;
  return `hsl(${h}, 60%, 55%)`;
}

const TPL_CLASS = {
  intro: 'card-intro',
  sticker: 'card-sticker',
  polaroid: 'card-polaroid',
  vote: 'card-vote',
  washi: 'card-washi',
  profile: 'card-profile',
  sticky: 'card-sticky',
  darkquote: 'card-darkquote',
  narrative: 'card-narrative',
};

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
}
