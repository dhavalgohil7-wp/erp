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

/* ── Module tile ── */
function ModuleTile({ icon, label, badge, iconColor = 'text-primary-container' }: ModuleTileProps) {
  return (
    <div className="module-tile">
      {badge && (
        <span className={badge === 'Update' ? 'badge-update' : 'badge-new'}>{badge}</span>
      )}
      <Icon name={icon} className={`text-[24px] ${iconColor} group-hover:scale-110 transition-transform mb-1`} />
      <span className="text-[12px] font-semibold text-on-surface leading-snug line-clamp-2">{label}</span>
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
  const div1Modules = [
    { icon: 'dashboard', label: 'Overview & Analytics', path: 'overview-and-analytics', iconColor: 'text-secondary' },
    { icon: 'account_balance', label: 'Institute', path: 'institute-setup', iconColor: 'text-secondary' },
    { icon: 'calendar_month', label: 'Calendar & Events', path: 'calendar-and-events', iconColor: 'text-secondary' },
    { icon: 'quiz', label: 'Exam Planner', path: 'exam-planner', iconColor: 'text-secondary' },
    { icon: 'analytics', label: 'Analysis & Reports', path: 'analysis-and-reports', iconColor: 'text-secondary' },
    { icon: 'assignment', label: 'Academic Planner', path: 'academic-planner', iconColor: 'text-secondary' },
    { icon: 'schedule', label: 'Timetable', path: 'timetable-management', iconColor: 'text-secondary' },
    { icon: 'how_to_reg', label: 'Student Attendance', path: 'student-attendance', iconColor: 'text-secondary' },
    { icon: 'edit_note', label: 'Homework & Classwork', path: 'homework-and-classwork', iconColor: 'text-secondary' },
    { icon: 'menu_book', label: 'Lesson Planning', path: 'lesson-planning', iconColor: 'text-secondary' },
    { icon: 'cloud_upload', label: 'Material Upload', path: 'material-upload', iconColor: 'text-secondary' },
    { icon: 'verified', label: 'Certificate Generator', path: 'certificate-generator', iconColor: 'text-secondary' },
    { icon: 'sms', label: 'SMS & System Logs', path: 'sms-and-system-logs', iconColor: 'text-secondary' },
    { icon: 'cake', label: 'Birthday Hub', path: 'birthday-hub', iconColor: 'text-secondary' },
  ];

  const { setActivePath, setActiveSection } = useUIStore();
  const div2Modules = [

    { icon: 'person_add', label: 'Admission & Inquiry', path: 'admission-and-inquiry', iconColor: 'text-secondary' },
    { icon: 'payments', label: 'Fee Management', path: 'fee-management', iconColor: 'text-secondary' },
    { icon: 'badge', label: 'HR Management', path: 'hr-and-payroll', iconColor: 'text-secondary' },
    { icon: 'fingerprint', label: 'Biometric Attendance', path: 'biometric-attendance', iconColor: 'text-secondary' },
    { icon: 'directions_bus', label: 'Transportation', path: 'transportation-fleet', iconColor: 'text-secondary' },
    { icon: 'local_library', label: 'Library', path: 'library-hub', iconColor: 'text-secondary' },
    { icon: 'hotel', label: 'Hostel', path: 'hostel-management', iconColor: 'text-secondary' },
    { icon: 'account_balance_wallet', label: 'Student Wallet', path: 'student-wallet', iconColor: 'text-secondary' },
    { icon: 'restaurant', label: 'Canteen', path: 'canteen-pos', iconColor: 'text-secondary' },
    { icon: 'inventory_2', label: 'Inventory', path: 'inventory-and-assets', iconColor: 'text-secondary' },
    { icon: 'badge', label: 'Gate Pass', path: 'gate-pass-management', iconColor: 'text-secondary' },
    { icon: 'support_agent', label: 'Grievance & Complaints', path: 'grievance-and-complaints', iconColor: 'text-secondary' },
    { icon: 'receipt_long', label: 'Expense Management', path: 'expense-management', iconColor: 'text-secondary' },
  ];

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
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
                <i className="fa-solid fa-table-cells-large text-[20px]"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-headline-sm text-on-surface">Central Master Operational Console</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed/40 text-tertiary text-label-sm font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" /> 40 Modules Synchronized
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant">Bi-lateral operational console mirroring full enterprise ERP architecture</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg text-body-sm">
                <button className="px-3 py-1 rounded bg-surface-container-lowest text-label-sm text-on-surface font-semibold shadow-sm">Dual Division View</button>
                <button className="px-3 py-1 rounded text-label-sm text-secondary hover:text-on-surface transition-colors">Compact Matrix</button>
              </div>
            </div>
          </div>

          {/* Two-division grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-lg">
            {/* Division 1 */}
            <div className="flex flex-col bg-surface-container-low/60 rounded-xl p-space-md border border-surface-container">
              <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-primary-container" />
                  <h3 className="text-headline-sm text-on-surface font-bold">System Setup + Communication</h3>
                </div>
                <span className="text-label-sm px-2 py-0.5 bg-surface-container text-secondary rounded font-semibold">19 Modules</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 stagger">
                {div1Modules.map((m) => (
                  <Link
                    key={m.label}
                    to={m.path}
                    className="module-tile-link"
                    onClick={() => {
                      setActivePath(m.path)
                      setActiveSection('System Setup & Academics')
                    }}
                  >
                    <ModuleTile {...m} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Division 2 */}
            <div className="flex flex-col bg-surface-container-low/60 rounded-xl p-space-md border border-surface-container">
              <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-tertiary" />
                  <h3 className="text-headline-sm text-on-surface font-bold">All In One ERP Modules</h3>
                </div>
                <span className="text-label-sm px-2 py-0.5 bg-surface-container text-secondary rounded font-semibold">21 Modules</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 stagger">
                {div2Modules.map((m) => (
                  <Link
                    key={m.label}
                    to={m.path}
                    className="module-tile-link"
                    onClick={() => {
                      setActivePath(m.path)
                      setActiveSection('All-In-One ERP')
                    }}
                  >
                    <ModuleTile {...m} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
