import { useState } from 'react'
import PageWrapper from '../components/ui/PageWrapper'

const students = [
  { id: 1, admNo: 'ADM2024001', name: 'Emily Watson',   class: '8-A', dob: '2011-10-24', guardian: 'Mark Watson',   status: 'Active', fees: 'Paid' },
  { id: 2, admNo: 'ADM2024002', name: 'Aaliyah Patel',  class: '11-B', dob: '2008-04-15', guardian: 'Raj Patel',    status: 'Active', fees: 'Pending' },
  { id: 3, admNo: 'ADM2024003', name: 'James Liu',       class: '9-C', dob: '2010-07-22', guardian: 'Wei Liu',       status: 'Active', fees: 'Paid' },
  { id: 4, admNo: 'ADM2024004', name: 'Sara Gonzalez',  class: '7-A', dob: '2012-01-08', guardian: 'Carlos Gonzalez', status: 'Active', fees: 'Overdue' },
]

const feeColor = { Paid: 'bg-tertiary-fixed text-on-tertiary-fixed', Pending: 'bg-primary-fixed text-on-primary-fixed', Overdue: 'bg-error-container text-on-error-container' }

function AdmissionModal({ onClose }) {
  const [step, setStep] = useState(1)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-space-md border-b border-surface-container sticky top-0 bg-surface-container-lowest">
          <h2 className="text-headline-md text-on-surface">New Student Admission</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-lg">
            <i className="fa-solid fa-xmark text-[16px] text-on-surface-variant"></i>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-space-md pt-space-md">
          {['Personal Info','Guardian Details','Documents','Enrollment'].map((s,i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-label-sm font-bold flex-shrink-0 ${step===i+1?'bg-primary text-on-primary':step>i+1?'bg-tertiary-container text-on-tertiary':'bg-surface-container text-secondary'}`}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span className={`text-label-sm hidden sm:block ${step===i+1?'text-on-surface font-semibold':'text-secondary'}`}>{s}</span>
              {i < 3 && <div className="flex-1 h-px bg-surface-container mx-1" />}
            </div>
          ))}
        </div>

        <div className="p-space-md flex flex-col gap-4">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">First Name *</label><input className="input-field" placeholder="First name" /></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Last Name *</label><input className="input-field" placeholder="Last name" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Date of Birth *</label><input className="input-field" type="date" /></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Gender *</label>
                  <select className="input-field"><option>Male</option><option>Female</option><option>Other</option></select></div>
              </div>
              <div><label className="text-label-md text-on-surface-variant block mb-1.5">Address</label><textarea className="input-field" rows={2} placeholder="Full residential address" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Mobile</label><input className="input-field" placeholder="+91 XXXXX XXXXX" /></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Email</label><input className="input-field" type="email" placeholder="student@email.com" /></div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Guardian Name *</label><input className="input-field" placeholder="Guardian full name" /></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Relation *</label>
                  <select className="input-field"><option>Father</option><option>Mother</option><option>Guardian</option></select></div>
              </div>
              <div><label className="text-label-md text-on-surface-variant block mb-1.5">Guardian Mobile *</label><input className="input-field" placeholder="+91 XXXXX XXXXX" /></div>
              <div><label className="text-label-md text-on-surface-variant block mb-1.5">Occupation</label><input className="input-field" placeholder="Occupation" /></div>
            </>
          )}
          {step === 3 && (
            <div className="space-y-3">
              {['Birth Certificate','Aadhaar Card','Transfer Certificate','Passport Photo','Previous Marksheet'].map(doc => (
                <div key={doc} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-file-lines text-[15px] text-secondary"></i>
                    <span className="text-body-sm text-on-surface">{doc}</span>
                  </div>
                  <button className="text-label-sm text-primary font-semibold hover:underline">Upload</button>
                </div>
              ))}
            </div>
          )}
          {step === 4 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Class *</label>
                  <select className="input-field">{['Nursery','KG','1','2','3','4','5','6','7','8','9','10','11','12'].map(c=><option key={c}>Class {c}</option>)}</select></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Section *</label>
                  <select className="input-field">{['A','B','C','D'].map(s=><option key={s}>Section {s}</option>)}</select></div>
              </div>
              <div><label className="text-label-md text-on-surface-variant block mb-1.5">Roll Number</label><input className="input-field" placeholder="Assign roll number" /></div>
              <div><label className="text-label-md text-on-surface-variant block mb-1.5">Admission Date</label><input className="input-field" type="date" /></div>
            </>
          )}
        </div>

        <div className="flex gap-3 p-space-md border-t border-surface-container sticky bottom-0 bg-surface-container-lowest">
          {step > 1 ? (
            <button className="btn-ghost flex-1 justify-center" onClick={() => setStep(s=>s-1)}>
              <i className="fa-solid fa-arrow-left text-[14px] mr-1.5"></i> Back
            </button>
          ) : (
            <button className="btn-ghost flex-1 justify-center" onClick={onClose}>Cancel</button>
          )}
          {step < 4 ? (
            <button className="btn-primary flex-1 justify-center" onClick={() => setStep(s=>s+1)}>
              Next <i className="fa-solid fa-arrow-right text-[14px] ml-1.5"></i>
            </button>
          ) : (
            <button className="btn-primary flex-1 justify-center" onClick={onClose}>
              <i className="fa-solid fa-circle-check text-[15px] mr-1.5"></i> Confirm Admission
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StudentsPage() {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.admNo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageWrapper breadcrumb={['Dashboard', 'Admission & Inquiry']} statusText={`${students.length} Students Enrolled`}>
      <div className="flex flex-col gap-space-lg">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-headline-md text-on-surface">Student Profile & Admission</h1>
            <p className="text-body-md text-on-surface-variant">Manage student records, admissions and enrollment</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-user-plus text-[15px]"></i>
            New Admission
          </button>
        </div>

        {/* Search bar */}
        <div className="card p-space-md">
          <div className="relative max-w-sm">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-[14px] text-on-surface-variant"></i>
            <input className="input-field pl-9" placeholder="Search by name or admission no..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  {['Adm No.','Name','Class','Guardian','Fees','Status','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-label-md text-on-surface-variant font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="table-row-hover border-t border-surface-container">
                    <td className="px-4 py-3 text-body-sm font-mono text-secondary">{s.admNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-label-sm font-bold">
                          {s.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span className="text-body-sm font-semibold text-on-surface">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-sm text-on-surface">{s.class}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{s.guardian}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-status ${feeColor[s.fees]}`}>{s.fees}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-status bg-tertiary-fixed text-on-tertiary-fixed">{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors" title="View">
                          <i className="fa-solid fa-eye text-[14px]"></i>
                        </button>
                        <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                          <i className="fa-solid fa-pen-to-square text-[14px]"></i>
                        </button>
                        <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-error transition-colors" title="Delete">
                          <i className="fa-solid fa-trash-can text-[14px]"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && <AdmissionModal onClose={() => setShowModal(false)} />}
    </PageWrapper>
  )
}
