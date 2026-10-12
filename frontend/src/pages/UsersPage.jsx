import { useState } from 'react'
import PageWrapper from '../components/ui/PageWrapper'

const roles = [
  { id: 1, name: 'Super Admin', users: 1, permissions: 'All', color: 'bg-error-container text-on-error-container' },
  { id: 2, name: 'Principal',   users: 2, permissions: 'Read/Write', color: 'bg-primary-fixed text-on-primary-fixed' },
  { id: 3, name: 'Teacher',     users: 148, permissions: 'Limited', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { id: 4, name: 'Student',     users: 3480, permissions: 'Read Only', color: 'bg-secondary-fixed text-on-secondary-fixed' },
  { id: 5, name: 'Parent',      users: 2900, permissions: 'Read Only', color: 'bg-secondary-fixed text-on-secondary-fixed' },
]

const users = [
  { id: 1, name: 'Dr. Sarah Jenkins', email: 'sarah@edusuite.com', role: 'Super Admin', status: 'Active', lastLogin: '2 min ago' },
  { id: 2, name: 'Prof. Alan Wright',  email: 'alan@edusuite.com',  role: 'Principal',   status: 'Active', lastLogin: '1 hr ago' },
  { id: 3, name: 'Ms. Priya Sharma',  email: 'priya@edusuite.com', role: 'Teacher',     status: 'Active', lastLogin: 'Yesterday' },
  { id: 4, name: 'Mr. Raj Mehta',     email: 'raj@edusuite.com',   role: 'Teacher',     status: 'Inactive', lastLogin: '5 days ago' },
]

export default function UsersPage() {
  const [tab, setTab] = useState('users')

  return (
    <PageWrapper breadcrumb={['Dashboard', 'User & Role Management']}>
      <div className="flex flex-col gap-space-lg">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-headline-md text-on-surface">User & Role Management</h1>
            <p className="text-body-md text-on-surface-variant">Manage system users, roles and granular permissions</p>
          </div>
          <button className="btn-primary">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Add User
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg w-fit">
          {[['users','Users'],['roles','Roles & Permissions']].map(([key,label]) => (
            <button key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded text-label-md font-semibold transition-colors ${tab===key ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-secondary hover:text-on-surface'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'users' ? (
          <div className="card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low">
                    {['Name','Email','Role','Status','Last Login','Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-label-md text-on-surface-variant font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="table-row-hover border-t border-surface-container">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-label-sm font-bold">
                            {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <span className="text-body-sm font-semibold text-on-surface">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-on-surface-variant">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="badge-status bg-primary-fixed/40 text-primary">{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge-status ${u.status==='Active' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-secondary'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-on-surface-variant">{u.lastLogin}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md stagger animate-fade-in">
            {roles.map(role => (
              <div key={role.id} className="card p-space-md hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[24px] text-primary">shield</span>
                    <h3 className="text-headline-sm text-on-surface">{role.name}</h3>
                  </div>
                  <span className={`badge-status ${role.color}`}>{role.permissions}</span>
                </div>
                <div className="text-body-sm text-on-surface-variant mb-4">
                  <span className="font-semibold text-on-surface">{role.users.toLocaleString()}</span> users assigned
                </div>
                <div className="flex gap-2 pt-3 border-t border-surface-container">
                  <button className="btn-secondary flex-1 justify-center text-xs">
                    <span className="material-symbols-outlined text-[15px]">tune</span> Permissions
                  </button>
                  <button className="btn-ghost px-2 py-1.5">
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
