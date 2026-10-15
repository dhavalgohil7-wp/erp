import { useState } from 'react'
import PageWrapper from '../components/ui/PageWrapper'
import { Navigate, useNavigate } from 'react-router-dom'

interface StepDef {
  number: string
  name: string
  color: 'green' | 'purple' | 'blue'
  route: string
}

const accountDetails: StepDef[] = [
  { number: '1', name: 'Institute Details', color: 'green', route: 'institute-details' },
]

const instituteSetup: StepDef[] = [
  { number: '2', name: 'Years Management', color: 'purple', route: 'years-management' },
  { number: '3', name: 'Department Management', color: 'purple', route: 'department-management' },
  { number: '4', name: 'User Roles Management', color: 'purple', route: 'user-roles-management' },
  { number: '5', name: 'Classrooms', color: 'purple', route: 'classrooms' },
]

const userManagement: StepDef[] = [
  { number: '6', name: 'Student', color: 'blue', route: 'student-management' },
  { number: '7', name: 'Faculty', color: 'blue', route: 'faculty-management' }
]

function StepCard({ step, onClick }: { step: StepDef; onClick: () => void }) {
  const isGreen = step.color === 'green'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl px-5 py-4 text-right
        flex flex-col items-end justify-end min-h-[90px]
        transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-white/50
        ${isGreen
          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-400/40'
          : 'bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-purple-500/40'
        }
      `}
    >
      {/* Decorative star / shape background */}
      <span
        aria-hidden="true"
        className={`
          absolute left-3 top-1/2 -translate-y-1/2
          text-[60px] leading-none select-none pointer-events-none
          ${isGreen ? 'text-emerald-300/40' : 'text-purple-300/30'}
        `}
      >
        ✦
      </span>

      <span className="relative z-10 text-[22px] font-bold leading-tight">
        Step {step.number}
      </span>
      <span className="relative z-10 text-[13px] font-medium opacity-90 mt-0.5 leading-tight">
        {step.name}
      </span>
    </button>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">
      {title}
    </h2>
  )
}

export default function InstitutePage() {
  const [activeStep, setActiveStep] = useState<StepDef | null>(null)
  const navigate = useNavigate()

  return (
    <PageWrapper breadcrumb={['Dashboard', 'Institute Setup']} statusText="Setup Wizard">
      <div className="flex flex-col gap-space-lg max-w-5xl">

        {/* Page header */}
        <div>
          <h1 className="text-headline-md text-on-surface">Institute Setup</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Complete the steps below to configure your institute.
          </p>
        </div>

        {/* Active step detail panel */}
        {activeStep && (
          <div className={`
            rounded-2xl p-space-md border flex items-center gap-4 animate-fade-in
            ${activeStep.color === 'green'
              ? 'border-emerald-400/30 bg-emerald-50/10'
              : 'border-purple-400/30 bg-purple-50/10'
            }
          `}>
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0
              ${activeStep.color === 'green'
                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                : 'bg-gradient-to-br from-violet-500 to-purple-700'
              }
            `}>
              {activeStep.number}
            </div>
            <div className="flex-1">
              <div className="text-[13px] text-on-surface-variant font-medium">
                Step {activeStep.number}
              </div>
              <div className="text-headline-sm text-on-surface font-semibold">
                {activeStep.name}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep(null)}
              className="p-1.5 hover:bg-surface-container rounded-lg transition-colors"
            >
              <i className="fa-solid fa-xmark text-on-surface-variant text-[16px]"></i>
            </button>
          </div>
        )}

        {/* Account Details group */}
        <div>
          <SectionHeader title="Account Details" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {accountDetails.map((step) => (
              <StepCard
                key={step.number}
                step={step}
                onClick={() => setActiveStep(step)}
              />
            ))}
          </div>
        </div>

        {/* Institute Setup group */}
        <div>
          <SectionHeader title="Institute Setup" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {instituteSetup.map((step) => (
              <StepCard
                key={step.number}
                step={step}
                onClick={() => setActiveStep(step)}
              />
            ))}
          </div>
        </div>

        {/* User Management group */}
        <div>
          <SectionHeader title="User Management" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {userManagement.map((step) => (
              <StepCard
                key={step.number}
                step={step}
                onClick={() => navigate(`/institute/abcd`)}
              />
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  )
}
