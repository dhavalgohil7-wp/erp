import { useState } from 'react'
import { useUIStore } from '../../store/useStore'

const navSections = [
  {
    label: 'System Setup & Academics',
    items: [
      { icon: 'dashboard', label: 'Overview & Analytics', path: 'overview-and-analytics' },
      { icon: 'account_balance', label: 'Institute', path: 'institute-setup' },
      { icon: 'calendar_month', label: 'Calendar & Events', path: 'calendar-and-events' },
      { icon: 'quiz', label: 'Exam Planner', path: 'exam-planner' },
      { icon: 'analytics', label: 'Analysis & Reports', path: 'analysis-and-reports' },
      { icon: 'assignment', label: 'Academic Planner', path: 'academic-planner' },
      { icon: 'schedule', label: 'Timetable', path: 'timetable-management' },
      { icon: 'how_to_reg', label: 'Student Attendance', path: 'student-attendance' },
      { icon: 'edit_note', label: 'Homework & Classwork', path: 'homework-and-classwork' },
      { icon: 'menu_book', label: 'Lesson Planning', path: 'lesson-planning' },
      { icon: 'cloud_upload', label: 'Material Upload', path: 'material-upload' },
      { icon: 'verified', label: 'Certificate Generator', path: 'certificate-generator' },
      { icon: 'sms', label: 'SMS & System Logs', path: 'sms-and-system-logs' },
      { icon: 'cake', label: 'Birthday Hub', path: 'birthday-hub' },
    ],
  },
  {
    label: 'All-In-One ERP',
    items: [
      { icon: 'person_add', label: 'Admission & Inquiry', path: 'admission-and-inquiry' },
      { icon: 'payments', label: 'Fee Management', path: 'fee-management' },
      { icon: 'badge', label: 'HR Management', path: 'hr-and-payroll' },
      { icon: 'fingerprint', label: 'Biometric Attendance', path: 'biometric-attendance' },
      { icon: 'directions_bus', label: 'Transportation', path: 'transportation-fleet' },
      { icon: 'local_library', label: 'Library', path: 'library-hub' },
      { icon: 'hotel', label: 'Hostel', path: 'hostel-management' },
      { icon: 'account_balance_wallet', label: 'Student Wallet', path: 'student-wallet' },
      { icon: 'restaurant', label: 'Canteen', path: 'canteen-pos' },
      { icon: 'inventory_2', label: 'Inventory', path: 'inventory-and-assets' },
      { icon: 'badge', label: 'Gate Pass', path: 'gate-pass-management' },
      { icon: 'support_agent', label: 'Grievance & Complaints', path: 'grievance-and-complaints' },
      { icon: 'receipt_long', label: 'Expense Management', path: 'expense-management' },
    ],
  },
]

export default function Sidebar() {
  const { activePath, setActivePath, sidebarOpen, toggleSidebar } = useUIStore()
  const [collapsedSections, setCollapsedSections] = useState({})
  const [filterText, setFilterText] = useState('')

  const toggleSection = (label) => {
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
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.06)] z-50 flex flex-col justify-between overflow-y-auto sidebar-slide-transition ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-low border-b border-outline-variant/20">
            <div className="flex items-center gap-space-sm overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/30">
                <span className="material-symbols-outlined text-on-primary text-[20px]">school</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-bold text-on-surface tracking-tight leading-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
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
              <span className="material-symbols-outlined text-[22px]">menu_open</span>
            </button>
          </div>

          {/* Institute Selector & Search */}
          <div className="p-space-sm">
            <div className="p-space-sm bg-surface-container-low hover:bg-surface-container rounded-xl mb-space-sm transition-colors cursor-pointer border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">corporate_fare</span>
                  <span className="text-[14px] text-on-surface font-semibold truncate max-w-[170px]">St. Xavier Academy</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">unfold_more</span>
              </div>
              <div className="text-[12px] text-on-surface-variant pl-6 truncate mt-0.5">
                Main Campus • CBSE-10294
              </div>
            </div>

            <div className="relative mb-space-xs">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-on-surface-variant text-[19px]">search</span>
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
            {filteredSections.map((section) => (
              <div key={section.label} className="flex flex-col">
                <div
                  className="flex items-center justify-between px-space-sm py-2 text-on-surface-variant cursor-pointer select-none hover:text-on-surface transition-colors"
                  onClick={() => toggleSection(section.label)}
                >
                  <span className="text-[11.5px] uppercase tracking-wider font-bold text-secondary">
                    {section.label}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">
                    {collapsedSections[section.label] ? 'expand_more' : 'expand_less'}
                  </span>
                </div>

                {!collapsedSections[section.label] && (
                  <div className="flex flex-col gap-1 mt-0.5">
                    {section.items.map((item) => (
                      <a
                        key={item.path}
                        href="#"
                        onClick={(e) => { e.preventDefault(); setActivePath(item.path) }}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all ${
                          activePath === item.path
                            ? 'bg-primary text-on-primary font-semibold shadow-xs shadow-primary/20'
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:translate-x-1'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Settings */}
        <div className="p-space-sm bg-surface-container-low border-t border-outline-variant/20">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActivePath('system-settings') }}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
              activePath === 'system-settings'
                ? 'bg-primary text-on-primary font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            System Settings
          </a>
        </div>
      </aside>
    </>
  )
}
