import React from 'react';
import { getTemplate, EMOJI_CHOICES } from './templates.jsx';

const INTRO_COLORS = ['#ffd166', '#ff9f9f', '#a8d8ff', '#b8f0c8', '#e6c9ff', '#ffc9de'];

// 统一的卡片创建/编辑弹窗：自我介绍 / 贴纸 / 拍立得 / 投票
export default function CardModal({ open, mode, tpl, card, onClose, onSubmit }) {
  const t = getTemplate(tpl);
  const isEdit = mode === 'edit';

  // intro
  const [emoji, setEmoji] = React.useState('😀');
  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [link, setLink] = React.useState('');
  const [color, setColor] = React.useState(INTRO_COLORS[0]);
  // sticker
  const [sticker, setSticker] = React.useState('😆');
  // polaroid
  const [image, setImage] = React.useState('');
  const [caption, setCaption] = React.useState('');
  // vote
  const [question, setQuestion] = React.useState('');
  const [options, setOptions] = React.useState(['', '']);
  // 通用文字模板（叙事卡 / 胶带卡 / 深色引用卡等带 editField 的模板）
  const [genericText, setGenericText] = React.useState('');
  const [author, setAuthor] = React.useState('');

  React.useEffect(() => {
    if (!open) return;
    const d = card?.data || {};
    setEmoji(d.emoji || '😀');
    setName(d.name || '');
    setBio(d.bio || '');
    setTags((d.tags || []).join(', '));
    setLink(d.link || '');
    setColor(d.color || INTRO_COLORS[0]);
    setSticker(d.emoji || '😆');
    setImage(d.image || '');
    setCaption(d.caption || '');
    setQuestion(d.question || '');
    setOptions(d.options ? d.options.map((o) => o.text) : ['', '']);
    setGenericText(t.editField ? d[t.editField] || '' : '');
    setAuthor(d.author || '');
  }, [open, card]);

  if (!open) return null;

  const submit = () => {
    if (tpl === 'intro') {
      if (!name.trim()) return;
      onSubmit({
        emoji,
        name: name.trim().slice(0, 12),
        bio: bio.trim().slice(0, 40),
        tags: tags.split(/[,，]/).map((s) => s.trim()).filter(Boolean).slice(0, 3),
        link: normalizeUrl(link.trim()),
        color,
      });
    } else if (tpl === 'sticker') {
      onSubmit({ emoji: sticker });
    } else if (tpl === 'polaroid') {
      if (!isEdit && !image) return;
      onSubmit({ image, caption: caption.trim().slice(0, 30) });
    } else if (tpl === 'vote') {
      const ops = options.map((s) => s.trim()).filter(Boolean).slice(0, 4);
      if (!question.trim() || ops.length < 2) return;
      onSubmit({
        question: question.trim().slice(0, 30),
        options: ops.map((text) => ({ text, votes: [] })),
      });
    } else if (t.editField) {
      const payload = { [t.editField]: genericText.trim().slice(0, 300) };
      if (tpl === 'darkquote' || tpl === 'narrative') payload.author = author.trim().slice(0, 20);
      onSubmit(payload);
    }
  };

  const canSubmit =
    tpl === 'intro' ? !!name.trim()
    : tpl === 'sticker' ? !!sticker
    : tpl === 'polaroid' ? (isEdit || !!image)
    : tpl === 'vote' ? !!(question.trim() && options.filter((s) => s.trim()).length >= 2)
    : t.editField ? !!genericText.trim()
    : false;

  return (
    <div className="wb-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="wb-modal">
        <div className="wb-modal-title">
          {isEdit ? '✏️ 编辑' : '＋ 新建'}{t.icon} {t.name}
        </div>

        {tpl === 'intro' && (
          <>
            <div className="wb-emoji-row">
              {EMOJI_CHOICES.slice(0, 12).map((e) => (
                <button key={e} className={`wb-emoji${emoji === e ? ' active' : ''}`} onClick={() => setEmoji(e)}>
                  {e}
                </button>
              ))}
            </div>
            <input className="wb-modal-input" maxLength={12} placeholder="昵称 *" value={name}
              onChange={(e) => setName(e.target.value)} autoFocus />
            <input className="wb-modal-input" maxLength={40} placeholder="一句话介绍自己（选填）" value={bio}
              onChange={(e) => setBio(e.target.value)} />
            <input className="wb-modal-input" placeholder="兴趣标签，逗号分隔，最多 3 个（选填）" value={tags}
              onChange={(e) => setTags(e.target.value)} />
            <input className="wb-modal-input" placeholder="你的主页链接（Bonjour / 小红书 / 任意）" value={link}
              onChange={(e) => setLink(e.target.value)} />
            <div className="wb-modal-colors">
              {INTRO_COLORS.map((c) => (
                <button key={c} className={`wb-color${color === c ? ' active' : ''}`}
                  style={{ background: c }} onClick={() => setColor(c)} aria-label="选择名片颜色" />
              ))}
            </div>
          </>
        )}

        {tpl === 'sticker' && (
          <div className="wb-emoji-row wb-emoji-grid">
            {EMOJI_CHOICES.map((e) => (
              <button key={e} className={`wb-emoji${sticker === e ? ' active' : ''}`} onClick={() => setSticker(e)}>
                {e}
              </button>
            ))}
          </div>
        )}

        {tpl === 'polaroid' && (
          <>
            {!isEdit && (
              <label className="wb-upload">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) compressImage(f, setImage);
                  }}
                />
                {image ? (
                  <img className="wb-upload-preview" src={image} alt="预览" />
                ) : (
                  <span>📷 点这里选一张照片</span>
                )}
              </label>
            )}
            <input className="wb-modal-input" maxLength={30} placeholder="给照片配一句话（选填）" value={caption}
              onChange={(e) => setCaption(e.target.value)} />
          </>
        )}

        {tpl === 'vote' && (
          <>
            <input className="wb-modal-input" maxLength={30} placeholder="想问大家什么？ *" value={question}
              onChange={(e) => setQuestion(e.target.value)} autoFocus />
            {options.map((op, i) => (
              <div key={i} className="wb-vote-opt-row">
                <input
                  className="wb-modal-input"
                  maxLength={16}
                  placeholder={`选项 ${i + 1}`}
                  value={op}
                  onChange={(e) => setOptions((prev) => prev.map((o, j) => (j === i ? e.target.value : o)))}
                />
                {options.length > 2 && (
                  <button className="wb-vote-opt-del"
                    onClick={() => setOptions((prev) => prev.filter((_, j) => j !== i))}>
                    ×
                  </button>
                )}
              </div>
            ))}
            {options.length < 4 && (
              <button className="wb-vote-opt-add" onClick={() => setOptions((prev) => [...prev, ''])}>
                ＋ 加一个选项
              </button>
            )}
          </>
        )}

        {!['intro', 'sticker', 'polaroid', 'vote'].includes(tpl) && t.editField && (
          <>
            <textarea
              className="wb-modal-input wb-modal-textarea"
              rows={4}
              maxLength={300}
              placeholder={t.editField === 'body' ? "写点内容…（支持换行）" : "写点什么吧…"}
              value={genericText}
              autoFocus
              onChange={(e) => setGenericText(e.target.value)}
            />
            {(tpl === 'darkquote' || tpl === 'narrative') && (
              <input className="wb-modal-input" maxLength={20} placeholder="署名（选填，如：Charles Bukowski）"
                value={author} onChange={(e) => setAuthor(e.target.value)} />
            )}
          </>
        )}

        <div className="wb-modal-actions">
          <button className="wb-modal-cancel" onClick={onClose}>取消</button>
          <button className="wb-modal-send" onClick={submit} disabled={!canSubmit}>
            {isEdit ? '保存 ✨' : '贴上去 ✨'}
          </button>
        </div>
      </div>
    </div>
  );
}

function normalizeUrl(url) {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// 压缩到最长边 720px 的 JPEG，控制存储体积
function compressImage(file, cb) {
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const r = Math.min(1, 720 / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * r);
    c.height = Math.round(img.height * r);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    cb(c.toDataURL('image/jpeg', 0.75));
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}
