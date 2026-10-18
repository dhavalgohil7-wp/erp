import React, { useState } from 'react'
import { useInstituteStore, UserRecord } from '../../store/useInstituteStore'
import DynamicFieldRenderer from './DynamicFieldRenderer'

export type UserRoleTab = 'student' | 'faculties' | 'institute admin'

interface UserManagementSectionProps {
  defaultRole?: UserRoleTab
  onClose?: () => void
}

export default function UserManagementSection({ defaultRole, onClose }: UserManagementSectionProps = {}) {
  const {
    users,
    addUserRecord,
    updateUserRecord,
    deleteUserRecord,
    roleDefaultFields,
    roleCustomFields,
    addToast,
  } = useInstituteStore()

  const [activeTab, setActiveTab] = useState<UserRoleTab>(defaultRole || 'student')
  const [search, setSearch] = useState('')

  React.useEffect(() => {
    if (defaultRole) {
      setActiveTab(defaultRole)
    }
  }, [defaultRole])

  // Modal / Drawer states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null)
  const [viewingUser, setViewingUser] = useState<UserRecord | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form states
  const [defaultValues, setDefaultValues] = useState<Record<string, any>>({})
  const [customValues, setCustomValues] = useState<Record<string, any>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState('')

  const activeCustomDefs = roleCustomFields[activeTab.toLowerCase()] || []
  const activeDefaultDefs =
    roleDefaultFields[activeTab.toLowerCase()] ||
    roleDefaultFields['student'] ||
    []

  // Open Add modal with fresh defaults
  const openAddModal = () => {
    setEditingUser(null)
    setFormErrors({})
    setGlobalError('')

    const initialDefaults: Record<string, any> = {}
    if (activeTab === 'student') {
      initialDefaults.admissionNo = `ADM-2024-${Math.floor(100 + Math.random() * 900)}`
      initialDefaults.rollNo = String(Math.floor(100 + Math.random() * 800))
      initialDefaults.fullName = ''
      initialDefaults.gender = 'Male'
      initialDefaults.dob = '2008-01-01'
      initialDefaults.parentName = ''
      initialDefaults.email = ''
      initialDefaults.phone = ''
      initialDefaults.standard = 'Grade 11 - Science'
      initialDefaults.address = ''
    } else if (activeTab === 'faculties') {
      initialDefaults.employeeCode = `FAC-2024-${Math.floor(10 + Math.random() * 90)}`
      initialDefaults.fullName = ''
      initialDefaults.designation = 'Senior Lecturer'
      initialDefaults.department = 'Department of Science'
      initialDefaults.qualification = 'M.Sc / Ph.D.'
      initialDefaults.email = ''
      initialDefaults.phone = ''
      initialDefaults.joiningDate = new Date().toISOString().split('T')[0]
    } else if (activeTab === 'institute admin') {
      initialDefaults.adminId = `ADM-${Math.floor(100 + Math.random() * 900)}`
      initialDefaults.fullName = ''
      initialDefaults.email = ''
      initialDefaults.phone = ''
      initialDefaults.roleLevel = 'Institutional Admin'
      initialDefaults.department = 'General Administration'
    }

    setDefaultValues(initialDefaults)
    setCustomValues({})
    setIsFormModalOpen(true)
  }

  // Open Edit modal
  const openEditModal = (user: UserRecord) => {
    setEditingUser(user)
    setFormErrors({})
    setGlobalError('')
    setDefaultValues({ ...user.defaultData })
    setCustomValues({ ...user.customData })
    setIsFormModalOpen(true)
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}

    // 1. Validate Default Fields
    for (const def of activeDefaultDefs) {
      const val = defaultValues[def.key]
      if (def.required && (!val || String(val).trim() === '')) {
        errors[def.key] = `${def.label} is required.`
      }
    }

    // 2. Validate Dynamic Custom Fields
    for (const cDef of activeCustomDefs) {
      const val = customValues[cDef.title]
      if (cDef.required && (!val || String(val).trim() === '')) {
        errors[cDef.title] = `${cDef.title} is required.`
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Save
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')

    if (!validateForm()) {
      setGlobalError('Please fill all required default and custom fields.')
      return
    }

    const payload = {
      roleId: activeTab,
      fullName: defaultValues.fullName || defaultValues.name || 'Unnamed Record',
      email: defaultValues.email || '',
      phone: defaultValues.phone || '',
      status: (editingUser?.status || 'Active') as 'Active' | 'Inactive',
      defaultData: defaultValues,
      customData: customValues,
    }

    if (editingUser) {
      const result = updateUserRecord(editingUser.id, payload)
      if (!result.success) {
        setGlobalError(result.error || 'Failed to update record.')
        return
      }
      addToast({
        title: 'Record Updated',
        description: `Successfully updated ${payload.fullName}.`,
        type: 'success',
      })
    } else {
      const result = addUserRecord(payload)
      if (!result.success) {
        setGlobalError(result.error || 'Failed to create record.')
        return
      }
      addToast({
        title: 'Record Created',
        description: `Successfully registered ${payload.fullName} under ${activeTab}.`,
        type: 'success',
      })
    }

    setIsFormModalOpen(false)
  }

  // Filtered users for active tab
  const tabUsers = users.filter((u) => u.roleId.toLowerCase() === activeTab.toLowerCase())
  const filteredUsers = tabUsers.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      JSON.stringify(u.defaultData).toLowerCase().includes(q) ||
      JSON.stringify(u.customData).toLowerCase().includes(q)
    )
  })

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg border border-outline-variant/30 shadow-sm animate-fade-in space-y-space-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-space-sm border-b border-surface-container">
        <div>
          <h2 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[15px]">
              <i className="fa-solid fa-users-gear"></i>
            </span>
            Section 3 — User Management
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Modules 11, 12, 13 with forms dynamically integrated with Default + Custom fields from Master Setup.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn-primary text-sm px-4 py-2 font-semibold flex items-center gap-2 shadow-xs"
        >
          <i className="fa-solid fa-user-plus text-[13px]"></i>
          Add New{' '}
          {activeTab === 'student'
            ? 'Student (Module 11)'
            : activeTab === 'faculties'
            ? 'Faculty (Module 12)'
            : 'Admin (Module 13)'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-surface-container pb-2">
        {(
          [
            { id: 'student', label: '11. Students', icon: 'fa-graduation-cap' },
            { id: 'faculties', label: '12. Faculties', icon: 'fa-chalkboard-user' },
            { id: 'institute admin', label: '13. Admin', icon: 'fa-user-tie' },
          ] as const
        ).map((tab) => {
          const count = users.filter((u) => u.roleId.toLowerCase() === tab.id).length
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id)
                setSearch('')
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container-low hover:bg-surface-container text-secondary'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Dynamic Fields Banner Notice */}
      <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/60 flex items-center justify-between text-xs text-purple-900">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles text-purple-600 text-sm"></i>
          <span>
            Active Dynamic Fields for <strong>{activeTab}</strong>: {activeCustomDefs.length} custom field(s) configured in Master Setup (3.2).
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-purple-700">
          <span>Unique constraints enforced</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-2.5 text-secondary text-[12px]"></i>
          <input
            type="text"
            placeholder={`Search ${activeTab} records by name, email, or custom values...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* User Records Table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
              <th className="py-3 px-4">User Identity</th>
              <th className="py-3 px-4">Contact Info</th>
              <th className="py-3 px-4">Role Key Attributes</th>
              <th className="py-3 px-4">Dynamic Custom Fields (3.2)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-secondary">
                  <i className="fa-solid fa-users text-[32px] opacity-40 mb-2 block"></i>
                  No {activeTab} records found matching your query.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/40">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {user.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface">{user.fullName}</div>
                        <div className="text-[11px] text-secondary font-mono">
                          ID: {user.defaultData.admissionNo || user.defaultData.employeeCode || user.defaultData.adminId || user.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs">
                    <div className="text-on-surface">{user.email}</div>
                    <div className="text-secondary">{user.phone}</div>
                  </td>

                  <td className="py-3.5 px-4 text-xs">
                    {activeTab === 'student' && (
                      <span className="font-medium text-on-surface">
                        {user.defaultData.standard} • Roll: {user.defaultData.rollNo}
                      </span>
                    )}
                    {activeTab === 'faculties' && (
                      <span className="font-medium text-on-surface">
                        {user.defaultData.designation} • {user.defaultData.department}
                      </span>
                    )}
                    {activeTab === 'institute admin' && (
                      <span className="font-medium text-on-surface">
                        {user.defaultData.roleLevel}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-xs max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(user.customData).length === 0 ? (
                        <span className="text-secondary italic">None</span>
                      ) : (
                        Object.entries(user.customData).map(([k, v]) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10.5px] font-medium"
                          >
                            <strong>{k}:</strong> {String(v)}
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingUser(user)}
                        className="p-1.5 text-secondary hover:text-on-surface rounded-lg hover:bg-surface-container"
                        title="View Details Drawer"
                      >
                        <i className="fa-solid fa-eye text-[14px]"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg"
                        title="Edit User"
                      >
                        <i className="fa-solid fa-pen-to-square text-[14px]"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(user.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete User"
                      >
                        <i className="fa-solid fa-trash-can text-[14px]"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic User Creation / Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl p-6 shadow-2xl border border-outline-variant/30 animate-scale-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container sticky top-0 bg-surface-container-lowest z-10">
              <div>
                <h3 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
                  <i className="fa-solid fa-user-pen text-primary"></i>
                  {editingUser ? `Edit ${activeTab} Record` : `Register New ${activeTab}`}
                </h3>
                <p className="text-[12px] text-secondary mt-0.5">
                  Dynamically rendering Default + Custom fields defined in Master Setup (3.2).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-secondary hover:text-on-surface text-lg"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-6">
              {/* Default Fields Accordion / Group */}
              <div className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Part 1 — Standard Role Attributes (Default Fields)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {activeDefaultDefs.map((def) => (
                    <div key={def.key} className={def.type === 'Textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-[13px] font-semibold text-on-surface mb-1">
                        {def.label} {def.required && <span className="text-red-500">*</span>}
                      </label>
                      {def.type === 'Textarea' ? (
                        <textarea
                          rows={2}
                          value={defaultValues[def.key] || ''}
                          onChange={(e) =>
                            setDefaultValues({ ...defaultValues, [def.key]: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-outline-variant/30 text-xs resize-none"
                        />
                      ) : (
                        <input
                          type={
                            def.type === 'Date'
                              ? 'date'
                              : def.type === 'Email'
                              ? 'email'
                              : def.type === 'Number'
                              ? 'number'
                              : 'text'
                          }
                          value={defaultValues[def.key] || ''}
                          onChange={(e) =>
                            setDefaultValues({ ...defaultValues, [def.key]: e.target.value })
                          }
                          placeholder={`Enter ${def.label}`}
                          className={`w-full px-3 py-2 rounded-xl bg-white border text-xs ${
                            formErrors[def.key] ? 'border-red-500' : 'border-outline-variant/30'
                          } outline-none focus:border-primary`}
                        />
                      )}
                      {formErrors[def.key] && (
                        <p className="text-red-500 text-[11px] mt-1">{formErrors[def.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Fields Dynamically Injected */}
              <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200/50 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-purple-950 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    Part 2 — Master Setup Custom Fields ({activeCustomDefs.length})
                  </div>
                  <span className="text-[11px] font-mono text-purple-700">Dynamically generated</span>
                </div>

                <DynamicFieldRenderer
                  customFields={activeCustomDefs}
                  values={customValues}
                  onChange={(fieldTitle, val) =>
                    setCustomValues({ ...customValues, [fieldTitle]: val })
                  }
                  errors={formErrors}
                />
              </div>

              {globalError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2 border border-red-200">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  {globalError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container sticky bottom-0 bg-surface-container-lowest">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="btn-ghost text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs px-5 py-2 font-bold shadow-xs">
                  Save {activeTab} Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Viewer Drawer / Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-outline-variant/30 animate-scale-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
              <h3 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
                <i className="fa-solid fa-id-card text-primary"></i> Complete User Profile
              </h3>
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="text-secondary hover:text-on-surface text-lg"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center text-base">
                  {viewingUser.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-sm">{viewingUser.fullName}</h4>
                  <p className="text-secondary font-mono">{viewingUser.email} • {viewingUser.phone}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-fixed text-primary">
                    Role: {viewingUser.roleId}
                  </span>
                </div>
              </div>

              {/* Default Data List */}
              <div className="p-4 rounded-xl border border-outline-variant/30 space-y-2">
                <div className="font-bold text-on-surface uppercase text-[11px] tracking-wider mb-2">
                  Standard Built-in Attributes:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(viewingUser.defaultData).map(([k, v]) => (
                    <div key={k} className="p-2 rounded bg-surface-container-low/60">
                      <span className="text-[10px] text-secondary block uppercase">{k}</span>
                      <span className="font-semibold text-on-surface text-xs">{String(v || '—')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Dynamic Data List */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
                <div className="font-bold text-purple-900 uppercase text-[11px] tracking-wider mb-2">
                  Dynamic Master Custom Attributes:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(viewingUser.customData).length === 0 ? (
                    <span className="text-secondary italic col-span-2">No custom attributes captured.</span>
                  ) : (
                    Object.entries(viewingUser.customData).map(([k, v]) => (
                      <div key={k} className="p-2 rounded bg-white border border-purple-100">
                        <span className="text-[10px] text-purple-700 block font-bold uppercase">{k}</span>
                        <span className="font-semibold text-on-surface text-xs">{String(v || '—')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="btn-primary text-xs px-4 py-2"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-outline-variant/30 text-center">
            <h3 className="text-sm font-bold mb-2">Delete User Record?</h3>
            <p className="text-xs text-secondary mb-4">
              This record will be permanently deleted from the institutional database.
            </p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setDeleteId(null)} className="btn-ghost text-xs px-3 py-1.5">
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUserRecord(deleteId)
                  setDeleteId(null)
                  addToast({ title: 'User Deleted', type: 'info' })
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
