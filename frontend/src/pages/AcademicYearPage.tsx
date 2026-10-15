import PageWrapper from '../components/ui/PageWrapper'

const sessions = [
  { id: 1, name: '2024-2025', start: '2024-04-01', end: '2025-03-31', terms: 2, status: 'Active',  current: true  },
  { id: 2, name: '2023-2024', start: '2023-04-01', end: '2024-03-31', terms: 2, status: 'Closed',  current: false },
  { id: 3, name: '2022-2023', start: '2022-04-01', end: '2023-03-31', terms: 2, status: 'Closed',  current: false },
]

export default function AcademicYearPage() {
  return (
    <PageWrapper breadcrumb={['Dashboard', 'Academic Year & Session']}>
      <div className="flex flex-col gap-space-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-headline-md text-on-surface">Academic Year & Session</h1>
            <p className="text-body-md text-on-surface-variant">Manage academic years, terms and promotion rules</p>
          </div>
          <button className="btn-primary">
            <i className="fa-solid fa-plus text-[15px]"></i>
            New Academic Year
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md stagger">
          {sessions.map(s => (
            <div key={s.id} className={`card p-space-md hover:shadow-md transition-shadow animate-fade-in ${s.current ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}>
              {s.current && (
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  <span className="text-label-sm text-tertiary font-semibold uppercase tracking-wider">Current Session</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 flex items-center justify-center">
                  <i className="fa-solid fa-calendar-days text-[24px] text-primary"></i>
                </div>
                <div>
                  <h3 className="text-headline-sm text-on-surface">{s.name}</h3>
                  <p className="text-body-sm text-on-surface-variant">{s.terms} Terms</p>
                </div>
              </div>
              <div className="space-y-2 mb-4 text-body-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Start Date</span>
                  <span className="text-on-surface font-medium">{new Date(s.start).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">End Date</span>
                  <span className="text-on-surface font-medium">{new Date(s.end).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Status</span>
                  <span className={`badge-status ${s.status==='Active'?'bg-tertiary-fixed text-on-tertiary-fixed':'bg-surface-container text-secondary'}`}>{s.status}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-surface-container">
                <button className="btn-secondary flex-1 justify-center text-xs">
                  <i className="fa-solid fa-sliders text-[14px]"></i> Configure
                </button>
                {!s.current && (
                  <button className="btn-ghost text-xs px-2 py-1.5">Archive</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
