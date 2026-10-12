import { useState } from 'react'
import PageWrapper from '../components/ui/PageWrapper'

const institutes = [
  { id: 1, name: 'St. Xavier Academy', board: 'CBSE', code: '10294', campus: 'Main Campus', city: 'Mumbai', status: 'Active', students: 3480, staff: 248 },
  { id: 2, name: 'St. Xavier – Andheri', board: 'CBSE', code: '10295', campus: 'Branch Campus', city: 'Mumbai', status: 'Active', students: 1200, staff: 86 },
]

function InstituteCard({ institute, onEdit }) {
  return (
    <div className="card p-space-md hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px] text-primary">account_balance</span>
          </div>
          <div>
            <h3 className="text-headline-sm text-on-surface">{institute.name}</h3>
            <p className="text-body-sm text-on-surface-variant">{institute.campus} • {institute.city}</p>
          </div>
        </div>
        <span className={`badge-status ${institute.status === 'Active' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}`}>
          {institute.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface-container-low rounded-lg p-3">
          <div className="text-label-sm text-on-surface-variant mb-1">Board</div>
          <div className="text-label-md font-semibold text-on-surface">{institute.board}</div>
        </div>
        <div className="bg-surface-container-low rounded-lg p-3">
          <div className="text-label-sm text-on-surface-variant mb-1">Code</div>
          <div className="text-label-md font-semibold text-on-surface">{institute.code}</div>
        </div>
        <div className="bg-surface-container-low rounded-lg p-3">
          <div className="text-label-sm text-on-surface-variant mb-1">Students</div>
          <div className="text-label-md font-semibold text-on-surface">{institute.students.toLocaleString()}</div>
        </div>
        <div className="bg-surface-container-low rounded-lg p-3">
          <div className="text-label-sm text-on-surface-variant mb-1">Staff</div>
          <div className="text-label-md font-semibold text-on-surface">{institute.staff}</div>
        </div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-surface-container">
        <button className="btn-primary flex-1 justify-center" onClick={() => onEdit(institute)}>
          <span className="material-symbols-outlined text-[16px]">edit</span> Edit
        </button>
        <button className="btn-secondary flex-1 justify-center">
          <span className="material-symbols-outlined text-[16px]">settings</span> Settings
        </button>
      </div>
    </div>
  )
}

function InstituteModal({ institute, onClose }) {
  const [form, setForm] = useState(institute || { name:'', board:'CBSE', code:'', campus:'', city:'', status:'Active' })
  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in">
        <div className="flex items-center justify-between p-space-md border-b border-surface-container">
          <h2 className="text-headline-md text-on-surface">{institute ? 'Edit Institute' : 'Add Institute'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="p-space-md flex flex-col gap-4">
          <div>
            <label className="text-label-md text-on-surface-variant block mb-1.5">Institute Name *</label>
            <input className="input-field" value={form.name} onChange={e=>handle('name',e.target.value)} placeholder="e.g. St. Xavier Academy" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label-md text-on-surface-variant block mb-1.5">Board *</label>
              <select className="input-field" value={form.board} onChange={e=>handle('board',e.target.value)}>
                {['CBSE','ICSE','State Board','IB','IGCSE'].map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant block mb-1.5">Affiliation Code</label>
              <input className="input-field" value={form.code} onChange={e=>handle('code',e.target.value)} placeholder="e.g. 10294" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label-md text-on-surface-variant block mb-1.5">Campus Type</label>
              <input className="input-field" value={form.campus} onChange={e=>handle('campus',e.target.value)} placeholder="Main / Branch" />
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant block mb-1.5">City</label>
              <input className="input-field" value={form.city} onChange={e=>handle('city',e.target.value)} placeholder="City" />
            </div>
          </div>
          <div>
            <label className="text-label-md text-on-surface-variant block mb-1.5">Status</label>
            <select className="input-field" value={form.status} onChange={e=>handle('status',e.target.value)}>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-space-md border-t border-surface-container">
          <button className="btn-ghost flex-1 justify-center" onClick={onClose}>Cancel</button>
          <button className="btn-primary flex-1 justify-center" onClick={onClose}>
            <span className="material-symbols-outlined text-[18px]">save</span>
            {institute ? 'Update' : 'Create'} Institute
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InstitutePage() {
  const [modal, setModal] = useState(null) // null | 'add' | institute object

  return (
    <PageWrapper breadcrumb={['Dashboard', 'Institute']} statusText="2 Campuses Active">
      <div className="flex flex-col gap-space-lg">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-headline-md text-on-surface">Institute Management</h1>
            <p className="text-body-md text-on-surface-variant">Manage campuses, board affiliations & branch settings</p>
          </div>
          <button className="btn-primary" onClick={() => setModal('add')}>
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Campus
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md stagger">
          {institutes.map(inst => (
            <InstituteCard key={inst.id} institute={inst} onEdit={setModal} />
          ))}
        </div>
      </div>

      {modal && (
        <InstituteModal
          institute={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </PageWrapper>
  )
}
