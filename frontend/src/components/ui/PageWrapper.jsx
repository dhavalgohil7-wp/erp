// PageWrapper.jsx — Standard page chrome with breadcrumb + status bar
import { Breadcrumb } from './Breadcrumb'

export default function PageWrapper({ breadcrumb = [], statusText, children }) {
  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Breadcrumb bar */}
      <div className="w-full px-gutter pt-space-md pb-space-sm">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <Breadcrumb items={breadcrumb} />
          {statusText && (
            <div className="flex items-center gap-space-xs px-3 py-1 bg-surface-container-lowest rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="text-[13px] text-on-surface font-semibold">{statusText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Page content */}
      <div className="w-full px-gutter pb-space-2xl">
        {children}
      </div>
    </div>
  )
}
