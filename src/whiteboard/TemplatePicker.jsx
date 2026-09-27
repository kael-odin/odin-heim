import React from 'react';
import { TEMPLATES } from './templates.jsx';

// 模板选择器：访客只能选 visitor 模板，管理员可选全部（含预制装饰卡）
// HIDDEN：不在菜单里出现（但已有卡片仍正常渲染）
const HIDDEN_TPLS = ['profile', 'sticky', 'darkquote'];

export default function TemplatePicker({ open, admin, onClose, onPick }) {
  if (!open) return null;
  const list = (admin ? TEMPLATES : TEMPLATES.filter((t) => t.visitor)).filter(
    (t) => !HIDDEN_TPLS.includes(t.id)
  );

  return (
    <div className="wb-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="wb-modal wb-picker">
        <div className="wb-modal-title">✦ 想贴点什么？</div>
        <div className="wb-template-grid">
          {list.map((t) => (
            <button key={t.id} className="wb-template-item" onClick={() => onPick(t.id)}>
              <div className="wb-template-icon">{t.icon}</div>
              <div className="wb-template-name">{t.name}</div>
            </button>
          ))}
        </div>
        {!admin && (
          <div className="wb-picker-note">创建后只有你能编辑/删除它</div>
        )}
        <div className="wb-modal-actions">
          <button className="wb-modal-cancel" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
