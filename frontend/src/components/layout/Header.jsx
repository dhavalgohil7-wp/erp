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
          <span className="material-symbols-outlined text-[24px]">
            {sidebarOpen ? 'menu_open' : 'menu'}
          </span>
        </button>

        {/* Search */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">search</span>
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
          <span className="material-symbols-outlined text-primary text-[20px]">school</span>
          <span className="text-[13.5px] font-semibold">2024-2025 Term 2</span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_drop_down</span>
        </div>

        {/* Quick Action */}
        <button
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary rounded-lg text-[13.5px] font-semibold hover:opacity-90 transition-all shadow-sm shadow-primary/25 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="hidden sm:inline">Quick Action</span>
        </button>

        {/* Chat */}
        <button
          className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          type="button"
          title="Chat"
        >
          <span className="material-symbols-outlined text-[22px]">chat</span>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          type="button"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface"></span>
        </button>

        {/* Theme Toggle */}
        <button
          className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          type="button"
          onClick={toggleDark}
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[22px]">{isDark ? 'dark_mode' : 'light_mode'}</span>
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
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
        </div>
      </div>
    </header>
  )
}
