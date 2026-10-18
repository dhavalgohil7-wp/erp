import React from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../../components/ui/PageWrapper'
import InstituteSetupSection from '../../components/institute/InstituteSetupSection'
import ToastContainer from '../../components/institute/ToastContainer'

type SetupTab =
  | 'years'
  | 'departments'
  | 'standards'
  | 'subject-types'
  | 'classrooms'
  | 'group-classrooms'
  | 'master-subject-groups'
  | 'subject-labs'

interface SetupSubmodulePageProps {
  tab: SetupTab
  title: string
  stepNumber: number
  subtitle?: string
}

export default function SetupSubmodulePage({
  tab,
  title,
  stepNumber,
  subtitle,
}: SetupSubmodulePageProps) {
  return (
    <PageWrapper
      breadcrumb={['Dashboard', 'Institute Management', title]}
      statusText="Tenant Scoped • Institute Setup Operations"
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-tertiary-fixed/40 text-tertiary border border-tertiary/20">
                Step {stepNumber} of 14
              </span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {subtitle || `Manage institutional ${title.toLowerCase()} configurations, records and status states.`}
            </p>
          </div>
        </div>

        {/* Component */}
        <InstituteSetupSection initialTab={tab} />
      </div>
    </PageWrapper>
  )
}
