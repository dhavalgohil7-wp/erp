import { useState } from 'react'
import { useUIStore } from '../../store/useStore'

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  const { sidebarOpen, toggleSidebar } = useUIStore()

  const toggleDark = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-gutter flex items-center justify-between gap-space-md header-slide-transition border-b border-outline-variant/20 ${
        sidebarOpen ? 'lg:left-72 left-0' : 'left-0'
      }`}
    >
      {/* Left: Sidebar Toggle + Search */}
      <div className="flex items-center gap-space-sm flex-1 max-w-xl">
        {/* Sidebar Slide In/Out Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center"
          type="button"
          title={sidebarOpen ? "Slide out sidebar" : "Slide in sidebar"}
        >
          <i className={`fa-solid text-[18px] ${sidebarOpen ? 'fa-bars-staggered' : 'fa-bars'}`}></i>
        </button>

        {/* Search */}
        <div className="relative w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-on-surface-variant text-[15px]"></i>
          <input
            className="w-full bg-surface-container-low pl-10 pr-16 py-2 rounded-lg text-[14px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 transition-all"
            placeholder="Search students, faculty, vouchers, modules..."
            type="text"
          />
          <kbd className="absolute right-2.5 top-2.5 px-2 py-0.5 text-[11px] font-semibold text-on-secondary-container bg-surface-container rounded border border-outline-variant/30">
            Cmd+K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-space-sm">
        {/* Academic Term */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container rounded-lg text-on-surface border border-outline-variant/20 cursor-pointer transition-colors">
          <i className="fa-solid fa-graduation-cap text-primary text-[15px]"></i>
          <span className="text-[13.5px] font-semibold">2024-2025 Term 2</span>
          <i className="fa-solid fa-caret-down text-on-surface-variant text-[13px]"></i>
        </div>

        {/* Quick Action */}
        <button
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary rounded-lg text-[13.5px] font-semibold hover:opacity-90 transition-all shadow-sm shadow-primary/25 cursor-pointer"
          type="button"
        >
          <i className="fa-solid fa-plus text-[14px]"></i>
          <span className="hidden sm:inline">Quick Action</span>
        </button>

        {/* Chat */}
        <button
          className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          type="button"
          title="Chat"
        >
          <i className="fa-solid fa-comments text-[17px]"></i>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          type="button"
          title="Notifications"
        >
          <i className="fa-solid fa-bell text-[17px]"></i>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface"></span>
        </button>

        {/* Theme Toggle */}
        <button
          className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          type="button"
          onClick={toggleDark}
          title="Toggle Theme"
        >
          <i className={`fa-solid text-[17px] ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>

        <div className="h-6 w-px bg-outline-variant/50 mx-1"></div>

        {/* Profile */}
        <div className="flex items-center gap-space-sm pl-1 cursor-pointer hover:bg-surface-container-low p-1.5 rounded-lg transition-colors">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary text-[14px] font-bold shadow-xs">
            SJ
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-[14px] font-semibold text-on-surface leading-tight">Dr. Sarah Jenkins</span>
            <span className="text-[12px] font-medium text-secondary leading-tight mt-0.5">Super Admin • Principal</span>
          </div>
          <i className="fa-solid fa-chevron-down text-on-surface-variant text-[12px]"></i>
        </div>
      </div>
    </header>
  )
}
