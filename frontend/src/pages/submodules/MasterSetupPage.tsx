import React from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../../components/ui/PageWrapper'
import MasterSetupSection from '../../components/institute/MasterSetupSection'
import ToastContainer from '../../components/institute/ToastContainer'

export default function MasterSetupPage() {
  return (
    <PageWrapper
      breadcrumb={['Dashboard', 'Institute Management', 'Master Setup']}
      statusText="Tenant Scoped • Roles & Dynamic Custom Fields"
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Step 3 of 14
              </span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Master Setup</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Configure system user roles (3.1) and role-specific custom field schemas (3.2) dynamically mapped to user forms.
            </p>
          </div>
        </div>

        {/* Component */}
        <MasterSetupSection />
      </div>
    </PageWrapper>
  )
}
