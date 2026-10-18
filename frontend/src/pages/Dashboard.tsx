import { useState, useMemo } from 'react'
import PageWrapper from '../components/ui/PageWrapper'
import Icon from '../components/common/Icon'
import { Link } from 'react-router-dom'
import { useUIStore } from '../store/useStore'


interface AttendanceChartProps {
  color: string
  gradId: string
  path: string
}

/* ── Mini SVG line chart for attendance cards ── */
function AttendanceChart({ color, gradId, path }: AttendanceChartProps) {
  return (
    <div className="relative w-full h-28 my-1">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 280 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="10" y1="15" x2="270" y2="15" stroke="#C7C4D8" strokeDasharray="2 2" strokeWidth="0.75" opacity="0.5" />
        <line x1="10" y1="45" x2="270" y2="45" stroke="#C7C4D8" strokeDasharray="2 2" strokeWidth="0.75" opacity="0.5" />
        <line x1="10" y1="75" x2="270" y2="75" stroke="#C7C4D8" strokeDasharray="2 2" strokeWidth="0.75" opacity="0.5" />
        <path d={`${path} L 260 78 L 20 78 Z`} fill={`url(#${gradId})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {[[20, 52], [80, 35], [140, 40], [200, 28], [260, 16]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i === 4 ? 4 : 3.5}
            fill={i === 4 ? color : '#fff'} stroke={color} strokeWidth="2" />
        ))}
      </svg>
    </div>
  )
}

interface DashboardKpiProps {
  icon: string
  iconBg?: string
  label: string
  value: string
  sub?: string
  trend?: string
  trendLabel?: string
  link?: string
}

/* ── KPI number card ── */
function KpiCard({ icon, iconBg = '', label, value, sub, trend, link }: DashboardKpiProps) {
  return (
    <div className="card p-space-md flex flex-col gap-3.5 animate-fade-in hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon name={icon} className="text-[20px] text-primary" />
        </div>
        {trend && (
          <span className="text-[12.5px] px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        {sub && <div className="text-[13.5px] text-secondary mt-1">{sub}</div>}
      </div>
      <div className="pt-2.5 border-t border-surface-container flex items-center justify-between">
        <span className="text-[13px] text-on-surface-variant font-medium">{label}</span>
        {link && (
          <button className="text-[13px] text-primary font-semibold hover:underline flex items-center gap-1.5">
            {link} <i className="fa-solid fa-arrow-right text-[12px]"></i>
          </button>
        )}
      </div>
    </div>
  )
}

interface ModuleTileProps {
  icon: string
  label: string
  badge?: string
  badgeType?: string
  iconColor?: string
}

/* ── Module tile matching the user's screenshot & ERP theme ── */
function ModuleTile({ icon, label, badge, iconColor }: ModuleTileProps) {
  return (
    <div className="erp-module-card group h-full">
      {badge && (
        <span className={badge === 'Update' ? 'badge-update' : 'badge-new'}>{badge}</span>
      )}
      <div className="erp-module-icon-wrap">
        <Icon name={icon} className={`erp-module-icon ${iconColor ?? ''}`} />
      </div>
      <span className="erp-module-label">{label}</span>
    </div>
  )
}

interface BirthdayRowProps {
  initials: string
  name: string
  role: string
  btnLabel: string
  avatarBg: string
  avatarText: string
}

/* ── Birthday row ── */
function BirthdayRow({ initials, name, role, btnLabel, avatarBg, avatarText }: BirthdayRowProps) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
      <div className="flex items-center gap-space-xs">
        <div className={`w-9 h-9 rounded-full ${avatarBg} ${avatarText} font-bold flex items-center justify-center text-[13px]`}>
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-on-surface">{name}</span>
          <span className="text-[12.5px] text-secondary">{role}</span>
        </div>
      </div>
      <button className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-primary text-[12.5px] font-semibold transition-all shadow-sm border border-outline-variant/30">
        {btnLabel}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   DASHBOARD — OVERVIEW & ANALYTICS
═══════════════════════════════════════════════ */
export default function Dashboard() {
  const { setActivePath, setActiveSection } = useUIStore();
  const [viewMode, setViewMode] = useState<'dual' | 'matrix'>('dual')
  const [searchQuery, setSearchQuery] = useState('')

  // Division 1: System Setup (19 modules matching screenshot)
  const div1Modules = [
    { icon: 'fa-solid fa-users', label: 'Institute Management', path: 'institute-management' },
    { icon: 'fa-solid fa-calendar-check', label: 'Calendar & Analysis', path: 'calendar-and-analysis' },
    { icon: 'fa-solid fa-calendar-plus', label: 'Exam Planner & Scheduler', path: 'exam-planner-and-scheduler' },
    { icon: 'fa-solid fa-chart-pie', label: 'Analysis & Reports', path: 'analysis-and-reports' },
    { icon: 'fa-solid fa-arrow-up-from-bracket', label: 'Material Upload', path: 'material-upload' },
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
  ];

  // Division 2: All in one ERP Modules (21 modules matching screenshot)
  const div2Modules = [
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
  ];

  const filteredDiv1 = useMemo(() => {
    if (!searchQuery.trim()) return div1Modules;
    return div1Modules.filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredDiv2 = useMemo(() => {
    if (!searchQuery.trim()) return div2Modules;
    return div2Modules.filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const allModulesCombined = useMemo(() => {
    return [
      ...filteredDiv1.map(m => ({ ...m, division: 'System Setup' })),
      ...filteredDiv2.map(m => ({ ...m, division: 'All in one ERP Modules' })),
    ];
  }, [filteredDiv1, filteredDiv2]);

  return (
    <PageWrapper
      breadcrumb={['Dashboard', 'Overview & Analytics']}
      statusText="Campus Status: Active • 98.4% On-time Operations"
    >
      <div className="flex flex-col w-full gap-space-lg">

        {/* ── Welcome Banner ── */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-primary-fixed/30 to-tertiary-fixed/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-xs flex-wrap mb-1">
                <span className="text-on-surface-variant text-label-sm">Wednesday, Oct 24, 2024 • Academic Term 2</span>
              </div>
              <h1 className="text-headline-lg text-on-surface mt-1">
                Welcome back, Dr. Sarah Jenkins{' '}
                <span className="inline-block hover:rotate-12 transition-transform cursor-pointer">👋</span>
              </h1>
              <p className="text-body-md text-on-surface-variant mt-1">
                Here is your comprehensive real-time institutional overview across 3,480 students and 248 staff members.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-space-xs">
              <button className="btn-primary group" type="button">
                <i className="fa-solid fa-user-check text-[15px] group-hover:scale-110 transition-transform"></i>
                Mark Daily Attendance
              </button>
              <button className="btn-secondary" type="button">
                <i className="fa-solid fa-credit-card text-[15px] text-tertiary"></i>
                Record Fee Payment
              </button>
              <button className="btn-secondary" type="button">
                <i className="fa-solid fa-user-plus text-[15px] text-primary"></i>
                + New Admission
              </button>
              <button className="btn-ghost" title="Export Digest" type="button">
                <i className="fa-solid fa-download text-[15px]"></i>
                Export Digest
              </button>
            </div>
          </div>
        </div>

        {/* ── Central Master Console ── */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30">
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                <i className="fa-solid fa-table-cells-large text-[20px]"></i>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-headline-sm text-on-surface font-bold">Central Master Operational Console</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-label-sm font-semibold flex items-center gap-1.5 border border-primary/20">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> 40 Modules Synchronized
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant">Bi-lateral operational console mirroring full enterprise ERP architecture</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Quick Filter Search */}
              <div className="relative min-w-[200px]">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-secondary text-[13px]"></i>
                <input
                  type="text"
                  placeholder="Quick find module..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low text-body-sm text-on-surface placeholder:text-secondary/70 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-secondary hover:text-on-surface text-[12px]"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg text-body-sm border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setViewMode('dual')}
                  className={`px-3 py-1 rounded text-label-sm font-semibold transition-all ${
                    viewMode === 'dual'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs text-primary'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  <i className="fa-solid fa-columns mr-1.5 text-[11px]"></i>Dual Division View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('matrix')}
                  className={`px-3 py-1 rounded text-label-sm font-semibold transition-all ${
                    viewMode === 'matrix'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs text-primary'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  <i className="fa-solid fa-grip mr-1.5 text-[11px]"></i>Compact Matrix
                </button>
              </div>
            </div>
          </div>

          {/* Module View Content */}
          {viewMode === 'dual' ? (
            /* Two-division grid mirroring screenshot layout */
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-lg">
              {/* Division 1: System Setup (19 Modules) */}
              <div className="flex flex-col bg-surface-container-low/40 rounded-2xl p-space-md border border-outline-variant/30 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-surface-container">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <h3 className="text-[17px] font-bold text-on-surface tracking-tight">System Setup</h3>
                  </div>
                  <span className="text-[12px] px-2.5 py-0.5 bg-primary/10 text-primary rounded-full font-semibold border border-primary/20">
                    {filteredDiv1.length} Modules
                  </span>
                </div>
                {filteredDiv1.length === 0 ? (
                  <div className="py-12 text-center text-secondary text-body-sm">
                    No modules match "{searchQuery}" in System Setup
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredDiv1.map((m) => (
                      <Link
                        key={m.label}
                        to={m.path}
                        className="block focus:outline-none"
                        onClick={() => {
                          setActivePath(m.path)
                          setActiveSection('System Setup')
                        }}
                      >
                        <ModuleTile {...m} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Division 2: All in one ERP Modules (21 Modules) */}
              <div className="flex flex-col bg-surface-container-low/40 rounded-2xl p-space-md border border-outline-variant/30 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-surface-container">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                    <h3 className="text-[17px] font-bold text-on-surface tracking-tight">All in one ERP Modules</h3>
                  </div>
                  <span className="text-[12px] px-2.5 py-0.5 bg-tertiary-fixed/60 text-tertiary rounded-full font-semibold border border-tertiary/20">
                    {filteredDiv2.length} Modules
                  </span>
                </div>
                {filteredDiv2.length === 0 ? (
                  <div className="py-12 text-center text-secondary text-body-sm">
                    No modules match "{searchQuery}" in ERP Modules
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredDiv2.map((m) => (
                      <Link
                        key={m.label}
                        to={m.path}
                        className="block focus:outline-none"
                        onClick={() => {
                          setActivePath(m.path)
                          setActiveSection('All in one ERP Modules')
                        }}
                      >
                        <ModuleTile {...m} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Compact Matrix View (All 40 Modules in unified matrix) */
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between text-body-sm text-secondary">
                <span>Showing <strong>{allModulesCombined.length}</strong> integrated enterprise modules</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {allModulesCombined.map((m) => (
                  <Link
                    key={m.label}
                    to={m.path}
                    className="block focus:outline-none"
                    onClick={() => {
                      setActivePath(m.path)
                      setActiveSection(m.division)
                    }}
                  >
                    <ModuleTile {...m} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md stagger">
          <KpiCard icon="groups" iconBg="bg-primary-fixed/50" label="Total Students" value="3,480"
            sub="Enrolled this session" trend="+2.1%" link="View All" />
          <KpiCard icon="badge" iconBg="bg-tertiary-fixed/30" label="Staff & Faculty" value="248"
            sub="Active employees" trend="+3" link="HR Module" />
          <KpiCard icon="how_to_reg" iconBg="bg-primary-container/10" label="Today's Attendance" value="95.2%"
            sub="3,312 / 3,480 present" trend="168 absent" link="Register" />
          <KpiCard icon="payments" iconBg="bg-secondary-fixed/50" label="Fee Collection MTD" value="₹8.4L"
            sub="Month-to-date" trend="+12%" link="Fee Module" />
        </div>



        {/* ── 3-Col Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Birthdays */}
          <div className="card p-space-md flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary-fixed/50 flex items-center justify-center text-primary">
                    <i className="fa-solid fa-cake-candles text-[17px]"></i>
                  </div>
                  <div>
                    <h3 className="text-headline-sm text-on-surface">Today's Birthdays</h3>
                    <p className="text-body-sm text-on-surface-variant">3 Campus Celebrants</p>
                  </div>
                </div>
                <span className="badge-status bg-tertiary-fixed text-on-tertiary-fixed">🎉 Party Mode</span>
              </div>
              <div className="space-y-2 mt-space-sm">
                <BirthdayRow initials="EW" name="Emily Watson" role="Student • Grade 8-A" btnLabel="Send SMS"
                  avatarBg="bg-primary-fixed" avatarText="text-primary" />
                <BirthdayRow initials="MV" name="Marcus Vance" role="Faculty • Physics Dept" btnLabel="Send Wish"
                  avatarBg="bg-tertiary-fixed" avatarText="text-tertiary" />
                <BirthdayRow initials="AP" name="Aaliyah Patel" role="Student • Grade 11-B" btnLabel="Send SMS"
                  avatarBg="bg-secondary-fixed" avatarText="text-on-secondary-fixed" />
              </div>
            </div>
            <div className="pt-space-sm mt-space-sm border-t border-surface-container flex items-center justify-between">
              <span className="text-label-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                Automated greetings: Active
              </span>
              <button className="text-label-sm text-primary font-semibold hover:underline">Batch Wishes</button>
            </div>
          </div>

          {/* Student Attendance chart */}
          <div className="card p-space-md flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                    <i className="fa-solid fa-users text-[17px]"></i>
                  </div>
                  <div>
                    <h3 className="text-headline-sm text-on-surface">Student Attendance</h3>
                    <p className="text-body-sm text-on-surface-variant">Daily Roll-call Rate</p>
                  </div>
                </div>
                <span className="badge-status bg-tertiary-fixed text-on-tertiary-fixed">95.2% Present</span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="stat-value">3,312</span>
                  <span className="text-body-sm text-secondary font-medium">/ 3,480</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-tertiary font-semibold flex items-center">
                    <i className="fa-solid fa-arrow-up text-[12px] mr-1"></i>+1.4%
                  </span>
                  <span className="text-secondary">168 Absent</span>
                </div>
              </div>
              <AttendanceChart
                color="#4F46E5" gradId="gradStudent"
                path="M 20 52 C 55 26, 95 62, 140 40 C 185 20, 220 32, 260 16"
              />
              <div className="flex justify-between items-center px-1 text-[11px] text-secondary">
                {[['Mon', '94.1%'], ['Tue', '95.8%'], ['Wed', '94.6%'], ['Thu', '95.2%'], ['Fri', '96.0%']].map(([d, v], i) => (
                  <div key={d} className="text-center">
                    <span className={`block font-semibold ${i === 4 ? 'text-primary' : ' text-on-surface'}`}>{d}</span>
                    <span className={`text-[10px] ${i === 4 ? 'text-primary font-semibold' : ''}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-space-sm mt-space-sm border-t border-surface-container flex items-center justify-between">
              <span className="text-label-sm text-secondary font-medium">On-time: <strong className="text-on-surface">98.1%</strong></span>
              <button className="text-label-sm text-primary font-semibold hover:underline flex items-center gap-1.5">
                View Register <i className="fa-solid fa-arrow-right text-[12px]"></i>
              </button>
            </div>
          </div>

          {/* Teacher Attendance chart */}
          <div className="card p-space-md flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                    <i className="fa-solid fa-graduation-cap text-[17px]"></i>
                  </div>
                  <div>
                    <h3 className="text-headline-sm text-on-surface">Teacher Attendance</h3>
                    <p className="text-body-sm text-on-surface-variant">Faculty & Staff Present</p>
                  </div>
                </div>
                <span className="badge-status bg-tertiary-fixed text-on-tertiary-fixed">98.4% Present</span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="stat-value">244</span>
                  <span className="text-body-sm text-secondary font-medium">/ 248</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-tertiary font-semibold flex items-center">
                    <i className="fa-solid fa-arrow-up text-[12px] mr-1"></i>+0.6%
                  </span>
                  <span className="text-secondary">4 on Leave</span>
                </div>
              </div>
              <AttendanceChart
                color="#006e4b" gradId="gradTeacher"
                path="M 20 44 C 60 30, 90 14, 140 18 C 190 22, 220 34, 260 22"
              />
              <div className="flex justify-between items-center px-1 text-[11px] text-secondary">
                {[['Mon', '97.5%'], ['Tue', '98.2%'], ['Wed', '99.1%'], ['Thu', '98.4%'], ['Fri', '98.8%']].map(([d, v], i) => (
                  <div key={d} className="text-center">
                    <span className={`block font-semibold ${i === 4 ? 'text-tertiary-container' : ' text-on-surface'}`}>{d}</span>
                    <span className={`text-[10px] ${i === 4 ? 'text-tertiary-container font-semibold' : ''}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-space-sm mt-space-sm border-t border-surface-container flex items-center justify-between">
              <span className="text-label-sm text-secondary font-medium">Punctuality: <strong className="text-on-surface">99.2%</strong></span>
              <button className="text-label-sm text-primary font-semibold hover:underline flex items-center gap-1.5">
                Staff Roster <i className="fa-solid fa-arrow-right text-[12px]"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
