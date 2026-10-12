import PageWrapper from '../components/ui/PageWrapper'

/* ── Mini SVG line chart for attendance cards ── */
function AttendanceChart({ color, gradId, path }) {
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

/* ── KPI number card ── */
function KpiCard({ icon, iconBg, label, value, sub, trend, trendLabel, link }) {
  return (
    <div className="card p-space-md flex flex-col gap-3.5 animate-fade-in hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <span className="material-symbols-outlined text-[24px] text-primary">{icon}</span>
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
          <button className="text-[13px] text-primary font-semibold hover:underline flex items-center gap-1">
            {link} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Module tile ── */
function ModuleTile({ icon, label, badge, badgeType = 'new', iconColor = 'text-primary-container' }) {
  return (
    <div className="module-tile">
      {badge && (
        <span className={badge === 'Update' ? 'badge-update' : 'badge-new'}>{badge}</span>
      )}
      <span className={`material-symbols-outlined text-[28px] ${iconColor} group-hover:scale-110 transition-transform mb-1`}>
        {icon}
      </span>
      <span className="text-[12px] font-semibold text-on-surface leading-snug line-clamp-2">{label}</span>
    </div>
  )
}

/* ── Birthday row ── */
function BirthdayRow({ initials, name, role, btnLabel, avatarBg, avatarText }) {
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
    { icon: 'account_balance', label: 'Institute Management', iconColor: 'text-primary-container' },
    { icon: 'calendar_month',  label: 'Calendar & Analysis',  iconColor: 'text-secondary' },
    { icon: 'event_available', label: 'Exam Planner',         badge: 'Term 2', iconColor: 'text-primary-container' },
    { icon: 'insights',        label: 'Analysis & Reports',   iconColor: 'text-secondary' },
    { icon: 'cloud_upload',    label: 'Material Upload',      iconColor: 'text-primary-container' },
    { icon: 'settings',        label: 'Settings',             iconColor: 'text-secondary' },
    { icon: 'folder_shared',   label: 'Material Mgmt',        iconColor: 'text-secondary' },
    { icon: 'terminal',        label: 'System Logs',          iconColor: 'text-primary-container' },
    { icon: 'cake',            label: 'Birthday',             iconColor: 'text-tertiary' },
    { icon: 'workspace_premium', label: 'Certificates',       badge: 'Update', iconColor: 'text-primary-container' },
    { icon: 'sms',             label: 'SMS Log',              iconColor: 'text-secondary' },
    { icon: 'how_to_reg',      label: 'Attendance',           iconColor: 'text-tertiary' },
    { icon: 'date_range',      label: 'Acad. Planner',        badge: 'Update', iconColor: 'text-primary-container' },
    { icon: 'analytics',       label: 'Dynamic Reports',      iconColor: 'text-secondary' },
    { icon: 'schedule',        label: 'Timetable',            iconColor: 'text-primary-container' },
    { icon: 'menu_book',       label: 'Homework',             iconColor: 'text-secondary' },
    { icon: 'auto_stories',    label: 'Classwork',            badge: 'New',    iconColor: 'text-tertiary' },
    { icon: 'star',            label: 'Lesson Plan',          badge: 'New',    iconColor: 'text-primary-container' },
    { icon: 'rate_review',     label: 'User Remarks',         badge: 'New',    iconColor: 'text-secondary' },
  ]

  const div2Modules = [
    { icon: 'local_library',          label: 'Library',        badge: 'Update', iconColor: 'text-tertiary' },
    { icon: 'badge',                  label: 'HR Mgmt',        iconColor: 'text-primary-container' },
    { icon: 'directions_bus',         label: 'Transport',      iconColor: 'text-secondary' },
    { icon: 'payments',               label: 'Fee Mgmt',       iconColor: 'text-tertiary' },
    { icon: 'person_add',             label: 'Inquiry / Admin',badge: 'Update', iconColor: 'text-primary-container' },
    { icon: 'fingerprint',            label: 'Att. Machine',   iconColor: 'text-primary-container' },
    { icon: 'hotel',                  label: 'Hostel',         iconColor: 'text-secondary' },
    { icon: 'language',               label: 'Web Builder',    iconColor: 'text-primary-container' },
    { icon: 'track_changes',          label: 'Target Mgmt',    iconColor: 'text-secondary' },
    { icon: 'stars',                  label: 'Result Module',  iconColor: 'text-tertiary' },
    { icon: 'inventory_2',            label: 'Inventory',      badge: 'New', iconColor: 'text-secondary' },
    { icon: 'account_balance_wallet', label: 'Wallet',         iconColor: 'text-secondary' },
    { icon: 'report_problem',         label: 'Complaints',     iconColor: 'text-primary-container' },
    { icon: 'restaurant',             label: 'Canteen',        iconColor: 'text-secondary' },
    { icon: 'qr_code_scanner',        label: 'Gate Pass',      iconColor: 'text-primary-container' },
    { icon: 'receipt_long',           label: 'Expense',        badge: 'New', iconColor: 'text-tertiary' },
    { icon: 'price_change',           label: 'Finance',        iconColor: 'text-primary-container' },
    { icon: 'photo_library',          label: 'Gallery',        badge: 'New', iconColor: 'text-secondary' },
    { icon: 'call',                   label: 'Voice Call',     badge: 'New', iconColor: 'text-primary-container' },
    { icon: 'headphones',             label: 'Pocket Study',   badge: 'New', iconColor: 'text-primary-container' },
    { icon: 'person_remove',          label: 'Exit Staff',     badge: 'New', iconColor: 'text-secondary' },
  ]

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
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-label-sm text-secondary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                  Campus Online • 98.4% System Health
                </span>
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
                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">how_to_reg</span>
                Mark Daily Attendance
              </button>
              <button className="btn-secondary" type="button">
                <span className="material-symbols-outlined text-[18px] text-tertiary">payments</span>
                Record Fee Payment
              </button>
              <button className="btn-secondary" type="button">
                <span className="material-symbols-outlined text-[18px] text-primary">person_add</span>
                + New Admission
              </button>
              <button className="btn-ghost" title="Export Digest" type="button">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Digest
              </button>
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
                    <span className="material-symbols-outlined text-[20px]">cake</span>
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
                    <span className="material-symbols-outlined text-[20px]">groups</span>
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
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+1.4%
                  </span>
                  <span className="text-secondary">168 Absent</span>
                </div>
              </div>
              <AttendanceChart
                color="#4F46E5" gradId="gradStudent"
                path="M 20 52 C 55 26, 95 62, 140 40 C 185 20, 220 32, 260 16"
              />
              <div className="flex justify-between items-center px-1 text-[11px] text-secondary">
                {[['Mon','94.1%'],['Tue','95.8%'],['Wed','94.6%'],['Thu','95.2%'],['Fri','96.0%']].map(([d,v],i) => (
                  <div key={d} className="text-center">
                    <span className={`block font-semibold ${i===4?'text-primary':' text-on-surface'}`}>{d}</span>
                    <span className={`text-[10px] ${i===4?'text-primary font-semibold':''}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-space-sm mt-space-sm border-t border-surface-container flex items-center justify-between">
              <span className="text-label-sm text-secondary font-medium">On-time: <strong className="text-on-surface">98.1%</strong></span>
              <button className="text-label-sm text-primary font-semibold hover:underline flex items-center gap-0.5">
                View Register <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Teacher Attendance chart */}
          <div className="card p-space-md flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">school</span>
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
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+0.6%
                  </span>
                  <span className="text-secondary">4 on Leave</span>
                </div>
              </div>
              <AttendanceChart
                color="#006e4b" gradId="gradTeacher"
                path="M 20 44 C 60 30, 90 14, 140 18 C 190 22, 220 34, 260 22"
              />
              <div className="flex justify-between items-center px-1 text-[11px] text-secondary">
                {[['Mon','97.5%'],['Tue','98.2%'],['Wed','99.1%'],['Thu','98.4%'],['Fri','98.8%']].map(([d,v],i) => (
                  <div key={d} className="text-center">
                    <span className={`block font-semibold ${i===4?'text-tertiary-container':' text-on-surface'}`}>{d}</span>
                    <span className={`text-[10px] ${i===4?'text-tertiary-container font-semibold':''}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-space-sm mt-space-sm border-t border-surface-container flex items-center justify-between">
              <span className="text-label-sm text-secondary font-medium">Punctuality: <strong className="text-on-surface">99.2%</strong></span>
              <button className="text-label-sm text-primary font-semibold hover:underline flex items-center gap-0.5">
                Staff Roster <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Central Master Console ── */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[24px]">grid_view</span>
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
                  <ModuleTile key={m.label} {...m} />
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
                  <ModuleTile key={m.label} {...m} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
