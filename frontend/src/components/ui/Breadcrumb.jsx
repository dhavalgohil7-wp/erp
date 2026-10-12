// Breadcrumb.jsx
export function Breadcrumb({ items = [] }) {
  return (
    <div className="flex items-center gap-1.5 text-on-surface-variant text-[14px]">
      <span className="material-symbols-outlined text-[18px]">home</span>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/60">chevron_right</span>
          <span className={i === items.length - 1 ? 'text-on-surface font-semibold' : 'text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer'}>
            {item}
          </span>
        </span>
      ))}
    </div>
  )
}
