// Reusable placeholder for pages under construction
import PageWrapper from '../components/ui/PageWrapper'

export default function PlaceholderPage({ title, icon, breadcrumb, description }) {
  return (
    <PageWrapper breadcrumb={breadcrumb}>
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-primary-fixed/40 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[40px] text-primary">{icon}</span>
        </div>
        <h2 className="text-headline-md text-on-surface mb-2">{title}</h2>
        <p className="text-body-md text-on-surface-variant mb-8 text-center max-w-md">
          {description || `The ${title} module is being set up. Full CRUD functionality will be available after backend integration.`}
        </p>
        <div className="flex gap-3">
          <button className="btn-primary">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New
          </button>
          <button className="btn-secondary">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Import
          </button>
        </div>
      </div>
    </PageWrapper>
  )
}
