import { useState, useEffect, useRef } from 'react'
import { useUIStore } from '../../store/useStore'
import Icon from '../common/Icon'
import { Link } from 'react-router-dom'

const navSections = [
  {
    label: 'System Setup',
    items: [
      { icon: 'dashboard', label: 'Overview & Analytics', path: 'overview-and-analytics' },
      { icon: 'fa-solid fa-users', label: 'Institute Management', path: 'institute-management' },
      { icon: 'fa-solid fa-calendar-check', label: 'Calendar & Analysis', path: 'calendar-and-analysis' },
      { icon: 'fa-solid fa-calendar-plus', label: 'Exam Planner & Scheduler', path: 'exam-planner-and-scheduler' },
      { icon: 'fa-solid fa-chart-pie', label: 'Analysis & Reports', path: 'analysis-and-reports' },
      { icon: 'fa-solid fa-cloud-arrow-up', label: 'Material Upload', path: 'material-upload' },
      { icon: 'fa-solid fa-gears', label: 'Settings', path: 'system-settings' },
      { icon: 'fa-solid fa-file-lines', label: 'Material Management', path: 'material-management' },
      { icon: 'fa-solid fa-server', label: 'System Logs', path: 'system-logs' },
      { icon: 'fa-solid fa-cake-candles', label: 'Birthday', path: 'birthdays' },
      { icon: 'fa-solid fa-print', label: 'Certificate Generation', path: 'certificate-generation' },
      { icon: 'fa-solid fa-inbox', label: 'Sms Log', path: 'sms-log' },
      { icon: 'fa-solid fa-list-check', label: 'Student Attendance', path: 'student-attendance' },
      { icon: 'fa-solid fa-calendar-week', label: 'Academic Planner', path: 'academic-planner' },
      { icon: 'fa-solid fa-book-bookmark', label: 'Dynamic Reports', path: 'dynamic-reports' },
      { icon: 'fa-solid fa-table-cells', label: 'Timetable Management', path: 'timetable-management' },
      { icon: 'fa-solid fa-book-open', label: 'Homework', path: 'homework' },
      { icon: 'fa-solid fa-book-open-reader', label: 'Classwork', path: 'classwork' },
      { icon: 'fa-solid fa-star', label: 'Lesson Planning', path: 'lesson-planning' },
      { icon: 'fa-solid fa-comment-dots', label: 'User Remarks', path: 'user-remarks' },
    ],
  },
  {
    label: 'All in one ERP Modules',
    items: [
      { icon: 'fa-solid fa-book', label: 'Library', path: 'library' },
      { icon: 'fa-solid fa-handshake', label: 'Hr Management', path: 'hr-management' },
      { icon: 'fa-solid fa-bus', label: 'Transportation', path: 'transportation' },
      { icon: 'fa-solid fa-money-bill-wave', label: 'Fee Management', path: 'fee-management' },
      { icon: 'fa-solid fa-circle-info', label: 'Inquiry/ Admission', path: 'inquiry-admission' },
      { icon: 'fa-solid fa-id-badge', label: 'Attendance Machine', path: 'attendance-machine' },
      { icon: 'fa-solid fa-bed', label: 'Hostel', path: 'hostel' },
      { icon: 'fa-solid fa-globe', label: 'Website Builder', path: 'website-builder' },
      { icon: 'fa-solid fa-box-archive', label: 'Target Management', path: 'target-management' },
      { icon: 'fa-solid fa-award', label: 'Result Module', path: 'result-module' },
      { icon: 'fa-solid fa-boxes-stacked', label: 'Inventory Management', path: 'inventory-management' },
      { icon: 'fa-solid fa-wallet', label: 'Wallet', path: 'wallet' },
      { icon: 'fa-solid fa-comments', label: 'Complaint / Grievance', path: 'complaint-grievance' },
      { icon: 'fa-solid fa-utensils', label: 'Canteen Management', path: 'canteen-management' },
      { icon: 'fa-solid fa-id-card', label: 'Gate Pass', path: 'gate-pass' },
      { icon: 'fa-solid fa-receipt', label: 'Expense Management', path: 'expense-management' },
      { icon: 'fa-solid fa-percent', label: 'Finance Management', path: 'finance-management' },
      { icon: 'fa-solid fa-image', label: 'Gallery', path: 'gallery' },
      { icon: 'fa-solid fa-phone', label: 'Voice Call', path: 'voice-call' },
      { icon: 'fa-solid fa-headphones', label: 'Pocket Study', path: 'pocket-study' },
      { icon: 'fa-solid fa-user-xmark', label: 'Exit Staff', path: 'exit-staff' },
    ],
  },
]

export default function Sidebar() {
  const { activePath, setActivePath, activeSection, setActiveSection, sidebarOpen, toggleSidebar } = useUIStore()
  // Accordion sections start collapsed (submodules hidden) by default on initial load
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navSections.forEach((section) => {
      initial[section.label] = true
    })
    return initial
  })
  const [filterText, setFilterText] = useState('')
  const [showAllModules, setShowAllModules] = useState<Record<string, boolean>>({})
  const isInitialMount = useRef(true)
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null)

  // Automatically expand parent accordion when a module is activated
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (activePath === 'overview-and-analytics') {
        return
      }
    }

    if (!activePath) return

    if (activePath === 'overview-and-analytics') {
      const allCollapsed: Record<string, boolean> = {}
      navSections.forEach((s) => {
        allCollapsed[s.label] = true
      })
      setCollapsedSections(allCollapsed)
      setShowAllModules({})
      return
    }

    const parentSection = navSections.find((section) =>
      section.items.some((item) => item.path === activePath)
    )

    if (parentSection) {
      setCollapsedSections((prev) => ({
        ...prev,
        [parentSection.label]: false,
      }))
      // Ensure only the selected module is shown as submenu by default
      setShowAllModules((prev) => ({
        ...prev,
        [parentSection.label]: false,
      }))
    }
  }, [activePath])

  // Also expand section when activeSection is set directly
  useEffect(() => {
    if (activeSection) {
      setCollapsedSections((prev) => ({
        ...prev,
        [activeSection]: false,
      }))
    }
  }, [activeSection])

  // Smoothly scroll the active submodule into view in the sidebar
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activePath, collapsedSections])

  const toggleSection = (label: string) => {
    setCollapsedSections((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const filteredSections = navSections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.label.toLowerCase().includes(filterText.toLowerCase())
    ),
  }))

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Sidebar with Slide Out-In Transition */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.06)] z-50 flex flex-col justify-between overflow-y-auto sidebar-slide-transition ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-low border-b border-outline-variant/20">
            <div className="flex items-center gap-space-sm overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/30">
                <i className="fa-solid fa-graduation-cap text-on-primary text-[17px]"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-bold text-on-surface tracking-tight leading-tight">
                  EduSuite Pro
                </span>
                <span className="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">
                  Enterprise ERP
                </span>
              </div>
            </div>
            {/* Slide Out Button */}
            <button
              onClick={toggleSidebar}
              className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
              type="button"
              title="Slide out sidebar"
            >
              <i className="fa-solid fa-bars-staggered text-[17px]"></i>
            </button>
          </div>

          {/* Institute Selector & Search */}
          <div className="p-space-sm">
            <div className="p-space-sm bg-surface-container-low hover:bg-surface-container rounded-xl mb-space-sm transition-colors cursor-pointer border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <i className="fa-solid fa-landmark text-primary text-[16px] w-5 text-center"></i>
                  <span className="text-[14px] text-on-surface font-semibold truncate max-w-[170px]">St. Xavier Academy</span>
                </div>
                <i className="fa-solid fa-up-down text-on-surface-variant text-[13px]"></i>
              </div>
              <div className="text-[12px] text-on-surface-variant pl-6 truncate mt-0.5">
                Main Campus • CBSE-10294
              </div>
            </div>

            <div className="relative mb-space-xs">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-on-surface-variant text-[14px]"></i>
              <input
                className="w-full bg-surface-container pl-9 pr-3 py-2 rounded-lg text-[13.5px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                placeholder="Filter modules..."
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-space-sm pb-space-lg flex flex-col gap-space-sm">
            {filteredSections.map((section) => {
              const isCollapsed = filterText.trim() ? false : !!collapsedSections[section.label]
              const hasActiveInThisSection = section.items.some((item) => item.path === activePath)
              const isShowingAll = showAllModules[section.label] || !!filterText.trim()

              // Only show the selected module as submenu under this accordion, unless user expands to view all
              const itemsToDisplay = !isShowingAll && hasActiveInThisSection
                ? section.items.filter((item) => item.path === activePath)
                : section.items

              return (
                <div key={section.label} className="flex flex-col">
                  <div
                    className="flex items-center justify-between px-space-sm py-2 text-on-surface-variant cursor-pointer select-none hover:text-on-surface transition-colors"
                    onClick={() => toggleSection(section.label)}
                  >
                    <span className="text-[11.5px] uppercase tracking-wider font-bold text-secondary">
                      {section.label}
                    </span>
                    <i className={`fa-solid text-[13px] ${isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
                  </div>

                  {!isCollapsed && (
                    <div className="flex flex-col gap-1 mt-0.5">
                      {itemsToDisplay.map((item) => (
                        <Link
                          key={item.path}
                          ref={activePath === item.path ? activeLinkRef : null}
                          to={item.path}
                          onClick={() => {
                            setActivePath(item.path)
                            setActiveSection(section.label)
                          }}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all ${activePath === item.path
                            ? 'bg-primary text-on-primary font-semibold shadow-xs shadow-primary/20'
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:translate-x-1'
                            }`}
                        >
                          <Icon name={item.icon} className="text-[16px] w-5 text-center" />
                          <span>{item.label}</span>
                        </Link>
                      ))}

                      {hasActiveInThisSection && !filterText.trim() && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowAllModules((prev) => ({
                              ...prev,
                              [section.label]: !prev[section.label],
                            }))
                          }
                          className="flex items-center gap-1.5 px-3 py-1 text-[11.5px] font-medium text-primary hover:text-primary-container hover:underline transition-colors mt-0.5"
                        >
                          <i className={`fa-solid text-[10px] ${isShowingAll ? 'fa-compress' : 'fa-list-ul'}`}></i>
                          <span>{isShowingAll ? 'Show selected module only' : `View all ${section.items.length} modules`}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </nav>
        </div >

        {/* Bottom Settings */}
        < div className="p-space-sm bg-surface-container-low border-t border-outline-variant/20" >
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActivePath('system-settings') }}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${activePath === 'system-settings'
              ? 'bg-primary text-on-primary font-semibold'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
          >
            <i className="fa-solid fa-gear text-[17px] w-5 text-center"></i>
            System Settings
          </a>
        </div >
      </aside >
    </>
  )
}
