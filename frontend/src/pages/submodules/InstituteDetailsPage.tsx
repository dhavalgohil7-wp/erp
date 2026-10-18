import React from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../../components/ui/PageWrapper'
import InstituteDetailsForm from '../../components/institute/InstituteDetailsForm'
import ToastContainer from '../../components/institute/ToastContainer'

export default function InstituteDetailsPage() {
  return (
    <PageWrapper
      breadcrumb={['Dashboard', 'Institute Management', 'Institute Details']}
      statusText="Tenant Scoped • Logo 200x200 & Banner 300x70 Validated"
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
                Step 1 of 14
              </span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Institute Details</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Configure core institutional branding, campus contact credentials, and verified logo / banner assets.
            </p>
          </div>
        </div>

        {/* Component */}
        <InstituteDetailsForm />
      </div>
    </PageWrapper>
  )
}
