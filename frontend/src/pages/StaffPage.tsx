import { useState } from 'react'
import PageWrapper from '../components/ui/PageWrapper'

const staff = [
  { id: 1, empId: 'EMP001', name: 'Prof. Alan Wright',  dept: 'Management', designation: 'Principal',       joined: '2018-06-01', status: 'Active' },
  { id: 2, empId: 'EMP002', name: 'Ms. Priya Sharma',   dept: 'Science',    designation: 'Sr. Teacher',      joined: '2020-07-15', status: 'Active' },
  { id: 3, empId: 'EMP003', name: 'Mr. Marcus Vance',   dept: 'Science',    designation: 'Physics Teacher',  joined: '2019-03-10', status: 'Active' },
  { id: 4, empId: 'EMP004', name: 'Ms. Anita Desai',    dept: 'Arts',       designation: 'Art Teacher',      joined: '2021-01-20', status: 'Active' },
  { id: 5, empId: 'EMP005', name: 'Mr. Raj Kumar',      dept: 'Maths',      designation: 'Maths Teacher',    joined: '2017-08-05', status: 'On Leave' },
]

const depts = ['Management','Science','Maths','Commerce','Arts','Sports','Admin']
const designations = ['Principal','Vice Principal','Sr. Teacher','Teacher','Jr. Teacher','Coordinator','Admin Staff']

export default function StaffPage() {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <PageWrapper breadcrumb={['Dashboard', 'HR Management']} statusText={`${staff.length} Staff Records`}>
      <div className="flex flex-col gap-space-lg">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-headline-md text-on-surface">Staff / Employee Records</h1>
            <p className="text-body-md text-on-surface-variant">Manage departments, designations, joining & exit records</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <i className="fa-solid fa-user-plus text-[15px]"></i>
            Add Staff
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md stagger">
          {[
            { label: 'Total Staff',  value: '248', icon: 'fa-solid fa-id-badge',       bg: 'bg-primary-fixed/50' },
            { label: 'Teaching',     value: '148', icon: 'fa-solid fa-graduation-cap', bg: 'bg-tertiary-fixed/30' },
            { label: 'Non-Teaching', value: '86',  icon: 'fa-solid fa-headset',        bg: 'bg-secondary-fixed/50' },
            { label: 'On Leave',     value: '14',  icon: 'fa-solid fa-calendar-xmark', bg: 'bg-error-container' },
          ].map(s => (
            <div key={s.label} className="card p-space-md flex items-center gap-3 animate-fade-in">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <i className={`${s.icon} text-[18px] text-primary`}></i>
              </div>
              <div>
                <div className="stat-value text-[20px]">{s.value}</div>
                <div className="text-body-sm text-on-surface-variant">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="card p-space-md">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-[14px] text-on-surface-variant"></i>
              <input className="input-field pl-9" placeholder="Search by name, dept, emp ID..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <select className="input-field w-auto">
              <option>All Departments</option>
              {depts.map(d=><option key={d}>{d}</option>)}
            </select>
            <select className="input-field w-auto">
              <option>All Statuses</option>
              <option>Active</option><option>On Leave</option><option>Resigned</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low">
                  {['Emp ID','Name','Department','Designation','Joined','Status','Actions'].map(h=>(
                    <th key={h} className="text-left px-4 py-3 text-label-md text-on-surface-variant font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.dept.toLowerCase().includes(search.toLowerCase())).map(s=>(
                  <tr key={s.id} className="table-row-hover border-t border-surface-container">
                    <td className="px-4 py-3 text-body-sm font-mono text-secondary">{s.empId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary text-label-sm font-bold">
                          {s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <span className="text-body-sm font-semibold text-on-surface">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{s.dept}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface">{s.designation}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{new Date(s.joined).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-status ${s.status==='Active'?'bg-tertiary-fixed text-on-tertiary-fixed':'bg-primary-fixed text-on-primary-fixed'}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors" title="View">
                          <i className="fa-solid fa-eye text-[14px]"></i>
                        </button>
                        <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                          <i className="fa-solid fa-pen-to-square text-[14px]"></i>
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

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in">
            <div className="flex items-center justify-between p-space-md border-b border-surface-container">
              <h2 className="text-headline-md text-on-surface">Add Staff Member</h2>
              <button onClick={()=>setShowModal(false)} className="p-1.5 hover:bg-surface-container rounded-lg">
                <i className="fa-solid fa-xmark text-[16px] text-on-surface-variant"></i>
              </button>
            </div>
            <div className="p-space-md flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">First Name *</label><input className="input-field" placeholder="First name" /></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Last Name *</label><input className="input-field" placeholder="Last name" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Department *</label>
                  <select className="input-field">{depts.map(d=><option key={d}>{d}</option>)}</select></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Designation *</label>
                  <select className="input-field">{designations.map(d=><option key={d}>{d}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Joining Date</label><input className="input-field" type="date" /></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Mobile *</label><input className="input-field" placeholder="+91 XXXXX XXXXX" /></div>
              </div>
              <div><label className="text-label-md text-on-surface-variant block mb-1.5">Email</label><input className="input-field" type="email" placeholder="staff@email.com" /></div>
            </div>
            <div className="flex gap-3 p-space-md border-t border-surface-container">
              <button className="btn-ghost flex-1 justify-center" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn-primary flex-1 justify-center" onClick={()=>setShowModal(false)}>
                <i className="fa-solid fa-floppy-disk text-[15px]"></i> Save Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
