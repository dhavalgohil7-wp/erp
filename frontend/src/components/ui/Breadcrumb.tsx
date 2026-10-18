// Breadcrumb.tsx
export function Breadcrumb({ items = [] }: { items?: string[] }) {
  return (
    <div className="flex items-center gap-2 text-on-surface-variant text-[14px]">
      <i className="fa-solid fa-house text-[13px]"></i>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <i className="fa-solid fa-chevron-right text-[10px] text-on-surface-variant/60"></i>
          <span className={i === items.length - 1 ? 'text-on-surface font-semibold' : 'text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer'}>
            {item}
          </span>
        </span>
      ))}
    </div>
  )
}
