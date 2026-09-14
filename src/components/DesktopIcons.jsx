/* 桌面图标渲染：把 siteConfig 的 art 字段映射为 CSS 图标外观 */

function iconArt(icon) {
  switch (icon.art) {
    case 'md': return { className: 'dicon-art file ext-md', ext: '.md' };
    case 'html': return { className: 'dicon-art file ext-html', ext: '.html' };
    case 'git': return { className: 'dicon-art file ext-git', ext: '.git' };
    case 'png': return { className: 'dicon-art file ext-png', ext: '.png' };
    case 'folder': return { className: 'dicon-art folder', ext: undefined };
    case 'image': return { className: 'dicon-art file', ext: undefined };
    case 'birthday': return { className: 'dicon-art birthday-icon', ext: undefined, birthday: true };
    default: return { className: 'dicon-art file ext-md', ext: '.md' };
  }
}

/* 桌面图标（可拖拽，双击打开） */
export function DesktopIcon({ icon }) {
  const art = iconArt(icon);
  return (
    <div className="dicon" data-href={icon.href} data-win={icon.win} style={icon.style}>
      <div className={art.className} data-ext={art.ext}>
        {icon.image && <img src={icon.image.src} alt={icon.image.alt} loading="lazy" />}
        {art.birthday && <span className="birthday-icon-mark">B</span>}
      </div>
      <div className="dicon-label">{icon.label}</div>
    </div>
  );
}

/* 窗口内的小文件图标（双击在系统窗口中打开链接） */
export function FolderIcon({ href, win, extension, label }) {
  return (
    <div className="folder-icon" data-href={href} data-win={win}>
      <div className={`folder-icon-art file${extension === '.git' ? ' ext-git' : ' ext-html'}`} data-ext={extension}></div>
      <div className="folder-icon-label">{label}</div>
    </div>
  );
}
