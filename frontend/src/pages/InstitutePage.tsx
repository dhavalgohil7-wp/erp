import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/ui/PageWrapper'
import Icon from '../components/common/Icon'
import { useInstituteStore } from '../store/useInstituteStore'
import { useUIStore } from '../store/useStore'
import ToastContainer from '../components/institute/ToastContainer'

interface InstituteModuleItem {
  step: number
  badge: string
  label: string
  path: string
  icon: string
  hint: string
}

export default function InstitutePage() {
  const { instituteDetails, subInstitutes, userRoles, users } = useInstituteStore()
  const { setActivePath, setActiveSection } = useUIStore()
  const [search, setSearch] = useState('')

  // Section 1: Account Details (Steps 1–3)
  const accountModules: InstituteModuleItem[] = [
    {
      step: 1,
      badge: 'Step 1',
      label: 'Institute Details',
      path: '/institute-details',
      icon: 'fa-solid fa-id-badge',
      hint: 'Logo (200x200), Banner (300x70) & Profile',
    },
    {
      step: 2,
      badge: 'Step 2',
      label: 'My Sub Institute',
      path: '/my-sub-institute',
      icon: 'fa-solid fa-network-wired',
      hint: `${subInstitutes.length} Campuses & Branch Operations`,
    },
    {
      step: 3,
      badge: 'Step 3',
      label: 'Master Setup',
      path: '/master-setup',
      icon: 'fa-solid fa-sliders',
      hint: 'User Roles & Dynamic Custom Fields',
    },
  ]

  // Section 2: Institute Setup (Steps 4–11)
  const setupModules: InstituteModuleItem[] = [
    {
      step: 4,
      badge: 'Step 4',
      label: 'Years Management',
      path: '/years-management',
      icon: 'fa-solid fa-calendar-days',
      hint: 'Academic Calendar & Session Terms',
    },
    {
      step: 5,
      badge: 'Step 5',
      label: 'Department Management',
      path: '/department-management',
      icon: 'fa-solid fa-sitemap',
      hint: 'Faculties, Heads & Stream Departments',
    },
    {
      step: 6,
      badge: 'Step 6',
      label: 'Standards',
      path: '/standards',
      icon: 'fa-solid fa-graduation-cap',
      hint: 'Class Roster & Capacity Allocation',
    },
    {
      step: 7,
      badge: 'Step 7',
      label: 'Subject Group Type',
      path: '/subject-group-type',
      icon: 'fa-solid fa-tags',
      hint: 'Core, Elective & Vocational Streams',
    },
    {
      step: 8,
      badge: 'Step 8',
      label: 'Classrooms',
      path: '/classrooms',
      icon: 'fa-solid fa-door-open',
      hint: 'Physical & Digital Smart Classrooms',
    },
    {
      step: 9,
      badge: 'Step 9',
      label: 'Group Classrooms',
      path: '/group-classrooms',
      icon: 'fa-solid fa-people-roof',
      hint: 'Combined Lecture Halls & Auditoriums',
    },
    {
      step: 10,
      badge: 'Step 10',
      label: 'Master Subject Group',
      path: '/master-subject-group',
      icon: 'fa-solid fa-layer-group',
      hint: 'Subject Mapping & Course Curricula',
    },
    {
      step: 11,
      badge: 'Step 11',
      label: 'Subject Labs',
      path: '/subject-labs',
      icon: 'fa-solid fa-flask-vial',
      hint: 'Science & Computer Laboratories',
    },
  ]

  // Section 3: User Management (Steps 12–14)
  const userModules: InstituteModuleItem[] = [
    {
      step: 12,
      badge: 'Step 12',
      label: 'Institute Admin',
      path: '/institute-admin',
      icon: 'fa-solid fa-user-shield',
      hint: 'Principal & Executive Administrative Roster',
    },
    {
      step: 13,
      badge: 'Step 13',
      label: 'Students',
      path: '/students',
      icon: 'fa-solid fa-user-graduate',
      hint: 'Enrolled Student Records & Dynamic Fields',
    },
    {
      step: 14,
      badge: 'Step 14',
      label: 'Faculties',
      path: '/faculties',
      icon: 'fa-solid fa-chalkboard-user',
      hint: 'Teaching Staff, Mentors & Faculty Files',
    },
  ]

  // Filter logic
  const filterList = (list: InstituteModuleItem[]) => {
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter((item) => item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q))
  }

  const filteredAccount = useMemo(() => filterList(accountModules), [search])
  const filteredSetup = useMemo(() => filterList(setupModules), [search])
  const filteredUsers = useMemo(() => filterList(userModules), [search])

  const handleModuleClick = (path: string) => {
    const clean = path.replace(/^\/+/, '')
    setActivePath(clean)
    setActiveSection('System Setup')
  }

  return (
    <PageWrapper
      breadcrumb={['Dashboard', 'Institute Management']}
      statusText="Tenant Scoped • Multi-Campus Operational"
    >
      <div className="flex flex-col gap-6 max-w-7xl w-full mx-auto pb-16 font-sans">
        <ToastContainer />

        {/* ── Header Institutional Identity Banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/30 animate-fade-in">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-primary-fixed/30 to-tertiary-fixed/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-16 h-16 rounded-2xl bg-white border border-outline-variant/40 flex items-center justify-center p-1 shadow-xs overflow-hidden flex-shrink-0">
                {instituteDetails.logoUrl ? (
                  <img
                    src={instituteDetails.logoUrl}
                    alt={instituteDetails.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <i className="fa-solid fa-graduation-cap text-3xl text-primary"></i>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-on-surface leading-tight">
                    {instituteDetails.name || 'Imperial Institute of Higher Education'}
                  </h1>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                    Active Multi-Tenant Campus
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-3 flex-wrap">
                  <span>
                    <i className="fa-solid fa-location-dot mr-1 text-secondary"></i>
                    {instituteDetails.address || 'Academic City, Knowledge Hub'}
                  </span>
                  <span>•</span>
                  <span>
                    <i className="fa-solid fa-certificate mr-1 text-primary"></i>
                    {instituteDetails.affiliationCode || 'CBSE-REG-847291'}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center min-w-[90px]">
                <div className="font-bold text-on-surface text-base">{subInstitutes.length}</div>
                <div className="text-[11px] text-secondary font-medium">Sub Institutes</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center min-w-[90px]">
                <div className="font-bold text-on-surface text-base">{userRoles.length}</div>
                <div className="text-[11px] text-secondary font-medium">User Roles</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center min-w-[90px]">
                <div className="font-bold text-primary text-base">{users.length}</div>
                <div className="text-[11px] text-secondary font-medium">Enrolled Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-on-surface tracking-tight">
              Institute Management Modules
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Click any module card below to open its dedicated configuration workspace.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-secondary text-xs"></i>
            <input
              type="text"
              placeholder="Find institute module..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-secondary/70 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2 text-secondary hover:text-on-surface text-xs"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1: Account Details (Steps 1–3)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col bg-surface-container-low/40 rounded-2xl p-space-md border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-surface-container">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h3 className="text-[17px] font-bold text-on-surface tracking-tight">Account Details</h3>
            </div>
            <span className="text-[12px] px-2.5 py-0.5 bg-primary/10 text-primary rounded-full font-semibold border border-primary/20">
              {filteredAccount.length} Modules
            </span>
          </div>

          {filteredAccount.length === 0 ? (
            <div className="py-6 text-center text-xs text-secondary">No modules matching "{search}"</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredAccount.map((m) => (
                <Link
                  key={m.label}
                  to={m.path}
                  onClick={() => handleModuleClick(m.path)}
                  className="block focus:outline-none h-full"
                >
                  <div className="erp-module-card group h-full">
                    <span className="badge-new">{m.badge}</span>
                    <div className="erp-module-icon-wrap">
                      <Icon name={m.icon} className="erp-module-icon" />
                    </div>
                    <span className="erp-module-label">{m.label}</span>
                    <span className="text-[11px] text-secondary mt-1 font-normal opacity-75 line-clamp-1">
                      {m.hint}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2: Institute Setup (Steps 4–11)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col bg-surface-container-low/40 rounded-2xl p-space-md border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-surface-container">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
              <h3 className="text-[17px] font-bold text-on-surface tracking-tight">Institute Setup</h3>
            </div>
            <span className="text-[12px] px-2.5 py-0.5 bg-tertiary-fixed/40 text-tertiary rounded-full font-semibold border border-tertiary/20">
              {filteredSetup.length} Modules
            </span>
          </div>

          {filteredSetup.length === 0 ? (
            <div className="py-6 text-center text-xs text-secondary">No modules matching "{search}"</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredSetup.map((m) => (
                <Link
                  key={m.label}
                  to={m.path}
                  onClick={() => handleModuleClick(m.path)}
                  className="block focus:outline-none h-full"
                >
                  <div className="erp-module-card group h-full">
                    <span className="badge-new">{m.badge}</span>
                    <div className="erp-module-icon-wrap">
                      <Icon name={m.icon} className="erp-module-icon" />
                    </div>
                    <span className="erp-module-label">{m.label}</span>
                    <span className="text-[11px] text-secondary mt-1 font-normal opacity-75 line-clamp-1">
                      {m.hint}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3: User Management (Steps 12–14)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col bg-surface-container-low/40 rounded-2xl p-space-md border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-surface-container">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <h3 className="text-[17px] font-bold text-on-surface tracking-tight">User Management</h3>
            </div>
            <span className="text-[12px] px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold border border-purple-200">
              {filteredUsers.length} Modules
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="py-6 text-center text-xs text-secondary">No modules matching "{search}"</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredUsers.map((m) => (
                <Link
                  key={m.label}
                  to={m.path}
                  onClick={() => handleModuleClick(m.path)}
                  className="block focus:outline-none h-full"
                >
                  <div className="erp-module-card group h-full">
                    <span className="badge-new">{m.badge}</span>
                    <div className="erp-module-icon-wrap">
                      <Icon name={m.icon} className="erp-module-icon text-primary" />
                    </div>
                    <span className="erp-module-label">{m.label}</span>
                    <span className="text-[11px] text-secondary mt-1 font-normal opacity-75 line-clamp-1">
                      {m.hint}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
