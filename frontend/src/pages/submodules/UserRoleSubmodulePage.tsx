import React from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../../components/ui/PageWrapper'
import UserManagementSection, { UserRoleTab } from '../../components/institute/UserManagementSection'
import ToastContainer from '../../components/institute/ToastContainer'

interface UserRoleSubmodulePageProps {
  role: UserRoleTab
  title: string
  stepNumber: number
  subtitle?: string
}

export default function UserRoleSubmodulePage({
  role,
  title,
  stepNumber,
  subtitle,
}: UserRoleSubmodulePageProps) {
  return (
    <PageWrapper
      breadcrumb={['Dashboard', 'Institute Management', title]}
      statusText="Tenant Scoped • Dynamic Field Schema Enforced"
    >
      <div className="flex flex-col gap-5 max-w-7xl w-full mx-auto pb-16">
        <ToastContainer />

        {/* Back Link & Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-container">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/institute-management"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 transition-colors"
              >
                <i className="fa-solid fa-arrow-left text-[11px]"></i>
                Back to Institute Management
              </Link>
              <span className="text-secondary text-xs">•</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                Step {stepNumber} of 14
              </span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {subtitle || `Manage ${title.toLowerCase()} records with dynamic role custom fields and unique constraint validations.`}
            </p>
          </div>
        </div>

        {/* Component */}
        <UserManagementSection defaultRole={role} />
      </div>
    </PageWrapper>
  )
}
