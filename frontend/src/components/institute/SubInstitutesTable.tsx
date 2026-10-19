import React, { useState } from 'react'
import { useInstituteStore, SubInstitute } from '../../store/useInstituteStore'

export default function SubInstitutesTable() {
  const {
    subInstitutes,
    addSubInstitute,
    updateSubInstitute,
    deleteSubInstitute,
    toggleSubInstituteStatus,
    addToast,
  } = useInstituteStore()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All')

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<SubInstitute | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    status: 'Active' as 'Active' | 'Inactive',
  })
  const [formError, setFormError] = useState('')

  const openAddModal = () => {
    setFormData({ name: '', code: '', city: '', status: 'Active' })
    setFormError('')
    setIsAddModalOpen(true)
  }

  const openEditModal = (sub: SubInstitute) => {
    setEditingSub(sub)
    setFormData({
      name: sub.name,
      code: sub.code,
      city: sub.city,
      status: sub.status,
    })
    setFormError('')
  }

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setFormError('Sub-institute name is required.')
      return
    }
    if (!formData.code.trim()) {
      setFormError('Branch code is required.')
      return
    }

    addSubInstitute({
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      city: formData.city.trim() || 'Main Campus Area',
      status: formData.status,
    })

    setIsAddModalOpen(false)
    addToast({
      title: 'Sub Institute Created',
      description: `"${formData.name}" has been added to your institutional network.`,
      type: 'success',
    })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSub) return
    if (!formData.name.trim()) {
      setFormError('Sub-institute name is required.')
      return
    }

    updateSubInstitute(editingSub.id, {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      city: formData.city.trim(),
      status: formData.status,
    })

    setEditingSub(null)
    addToast({
      title: 'Sub Institute Updated',
      description: `Changes saved for ${formData.name}.`,
      type: 'success',
    })
  }

  const confirmDelete = () => {
    if (!deletingId) return
    const target = subInstitutes.find((s) => s.id === deletingId)
    deleteSubInstitute(deletingId)
    setDeletingId(null)
    addToast({
      title: 'Sub Institute Deleted',
      description: target ? `Removed ${target.name}` : 'Sub institute removed.',
      type: 'info',
    })
  }

  const filtered = subInstitutes.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.code.toLowerCase().includes(search.toLowerCase()) ||
      sub.id.toLowerCase().includes(search.toLowerCase()) ||
      sub.city.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' ? true : sub.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg border border-outline-variant/30 shadow-sm animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-space-sm mb-space-md border-b border-surface-container">
        <div>
          <h2 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[15px]">
              <i className="fa-solid fa-network-wired"></i>
            </span>
            My Sub Institute
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Manage subsidiary branches, satellite campuses, and affiliated institutes.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn-primary text-sm px-4 py-2 font-semibold flex items-center gap-2 shadow-xs"
        >
          <i className="fa-solid fa-plus text-[13px]"></i>
          Add New Sub Institute
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-space-md">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-secondary text-[13px]"></i>
          <input
            type="text"
            placeholder="Search by ID, name, or branch code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-[13.5px] border border-outline-variant/30 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-xs">
          {(['All', 'Active', 'Inactive'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${statusFilter === status
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
                }`}
            >
              {status} {status === 'All' && `(${subInstitutes.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Listing Table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30 text-[12.5px] font-bold text-on-surface-variant uppercase tracking-wider">
              <th className="py-3.5 px-4">ID</th>
              <th className="py-3.5 px-4">Name & Branch Code</th>
              <th className="py-3.5 px-4">Campus Location</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-[13.5px]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-secondary">
                  <i className="fa-solid fa-folder-open text-[32px] mb-2 block opacity-40"></i>
                  No sub institutes match your search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[13px] text-primary font-bold">
                    {sub.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-on-surface">{sub.name}</div>
                    <div className="text-[12px] text-secondary font-mono">Code: {sub.code}</div>
                  </td>
                  <td className="py-3.5 px-4 text-secondary">
                    <i className="fa-solid fa-location-dot mr-1.5 text-secondary/60"></i>
                    {sub.city}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => {
                        toggleSubInstituteStatus(sub.id)
                        addToast({
                          title: 'Status Updated',
                          description: `${sub.name} marked as ${sub.status === 'Active' ? 'Inactive' : 'Active'
                            }`,
                          type: 'info',
                        })
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer ${sub.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                        }`}
                      title="Click to toggle status"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                      />
                      {sub.status}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(sub)}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                        title="Edit Sub Institute"
                      >
                        <i className="fa-solid fa-pen-to-square text-[15px]"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(sub.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Sub Institute"
                      >
                        <i className="fa-solid fa-trash-can text-[15px]"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-outline-variant/30 animate-scale-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
              <h3 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
                <i className="fa-solid fa-plus-circle text-primary"></i> Add Sub Institute
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-secondary hover:text-on-surface text-lg"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-on-surface mb-1">
                  Sub-Institute Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. St. Xavier North Campus"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border border-outline-variant/30 focus:border-primary outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-on-surface mb-1">
                  Branch Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SX-NC-02"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] font-mono border border-outline-variant/30 focus:border-primary outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-on-surface mb-1">
                  Campus City / Location
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Gandhinagar Sector 12"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border border-outline-variant/30 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-on-surface mb-1">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border border-outline-variant/30 focus:border-primary outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {formError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600 text-xs flex items-center gap-1.5 border border-red-200">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-ghost text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs px-5 py-2 font-semibold">
                  Create Sub Institute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-outline-variant/30 animate-scale-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
              <h3 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
                <i className="fa-solid fa-pen-to-square text-primary"></i> Edit Sub Institute
              </h3>
              <button
                type="button"
                onClick={() => setEditingSub(null)}
                className="text-secondary hover:text-on-surface text-lg"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-on-surface mb-1">
                  Sub-Institute Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border border-outline-variant/30 focus:border-primary outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-on-surface mb-1">
                  Branch Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] font-mono border border-outline-variant/30 focus:border-primary outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-on-surface mb-1">
                  Campus City / Location
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border border-outline-variant/30 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-on-surface mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-[14px] border border-outline-variant/30 focus:border-primary outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {formError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-600 text-xs flex items-center gap-1.5 border border-red-200">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="btn-ghost text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs px-5 py-2 font-semibold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-outline-variant/30 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 text-xl">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <h3 className="text-headline-sm text-on-surface font-bold mb-1">Delete Sub Institute?</h3>
            <p className="text-body-sm text-secondary mb-5">
              Are you sure you want to delete this sub-institute record? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="btn-ghost text-xs px-4 py-2 border border-outline-variant/40 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
