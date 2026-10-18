import React, { useState } from 'react'
import {
  useInstituteStore,
  AcademicYear,
  Department,
  Standard,
  SubjectGroupType,
  Classroom,
  GroupClassroom,
  MasterSubjectGroup,
} from '../../store/useInstituteStore'

type SetupSubTab =
  | 'years'
  | 'departments'
  | 'standards'
  | 'subject-types'
  | 'classrooms'
  | 'group-classrooms'
  | 'master-subject-groups'
  | 'subject-labs'

interface InstituteSetupSectionProps {
  initialTab?: SetupSubTab
  onClose?: () => void
}

export default function InstituteSetupSection({ initialTab, onClose }: InstituteSetupSectionProps = {}) {
  const store = useInstituteStore()
  const [activeTab, setActiveTab] = useState<SetupSubTab>(initialTab || 'years')
  const [search, setSearch] = useState('')

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  // Generic modal states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Sub-module tabs meta
  const tabs = [
    { id: 'years', label: '4. Years Management', icon: 'fa-calendar-days', count: store.academicYears.length },
    { id: 'departments', label: '5. Department Management', icon: 'fa-sitemap', count: store.departments.length },
    { id: 'standards', label: '6. Standards', icon: 'fa-graduation-cap', count: store.standards.length },
    { id: 'subject-types', label: '7. Subject Group Type', icon: 'fa-tags', count: store.subjectGroupTypes.length },
    { id: 'classrooms', label: '8. Classroom', icon: 'fa-door-open', count: store.classrooms.length },
    { id: 'group-classrooms', label: '9. Group Class Room', icon: 'fa-people-roof', count: store.groupClassrooms.length },
    { id: 'master-subject-groups', label: '10. Master Subject Group', icon: 'fa-layer-group', count: store.masterSubjectGroups.length },
    { id: 'subject-labs', label: '11. Subject Labs', icon: 'fa-flask-vial', count: store.subjectLabs?.length || 0 },
  ] as const

  // Form states
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errorMsg, setErrorMsg] = useState('')

  const openAdd = () => {
    setErrorMsg('')
    if (activeTab === 'years') {
      setFormData({ name: '', startDate: '', endDate: '', termsCount: 2, status: 'Active' })
    } else if (activeTab === 'departments') {
      setFormData({ name: '', code: '', headOfDept: '', status: 'Active' })
    } else if (activeTab === 'standards') {
      setFormData({ name: '', code: '', stream: 'General', capacity: 120, status: 'Active' })
    } else if (activeTab === 'subject-types') {
      setFormData({ name: '', description: '', status: 'Active' })
    } else if (activeTab === 'classrooms') {
      setFormData({ roomNumber: '', building: 'Academic Block A', floor: '1st Floor', capacity: 45, hasProjector: true, status: 'Active' })
    } else if (activeTab === 'group-classrooms') {
      setFormData({ name: '', roomsIncluded: '', totalCapacity: 150, purpose: '', status: 'Active' })
    } else if (activeTab === 'master-subject-groups') {
      setFormData({ groupName: '', standardId: store.standards[0]?.id || '', standardName: store.standards[0]?.name || '', groupType: 'Core + Elective', subjectsList: '', status: 'Active' })
    } else if (activeTab === 'subject-labs') {
      setFormData({ name: '', code: '', department: store.departments[0]?.name || 'Department of Science', labIncharge: '', capacity: 35, status: 'Active' })
    }
    setIsAddOpen(true)
  }

  const openEdit = (item: any) => {
    setErrorMsg('')
    setEditItem(item)
    setFormData({ ...item })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name && !formData.groupName && !formData.roomNumber) {
      setErrorMsg('Please fill in the required name / identifier field.')
      return
    }

    if (activeTab === 'years') {
      if (editItem) {
        store.updateAcademicYear(editItem.id, formData)
        store.addToast({ title: 'Year Updated', description: formData.name, type: 'success' })
      } else {
        store.addAcademicYear(formData as any)
        store.addToast({ title: 'Academic Year Added', description: formData.name, type: 'success' })
      }
    } else if (activeTab === 'departments') {
      if (editItem) {
        store.updateDepartment(editItem.id, formData)
        store.addToast({ title: 'Department Updated', description: formData.name, type: 'success' })
      } else {
        store.addDepartment(formData as any)
        store.addToast({ title: 'Department Added', description: formData.name, type: 'success' })
      }
    } else if (activeTab === 'standards') {
      if (editItem) {
        store.updateStandard(editItem.id, formData)
        store.addToast({ title: 'Standard Updated', description: formData.name, type: 'success' })
      } else {
        store.addStandard(formData as any)
        store.addToast({ title: 'Standard Added', description: formData.name, type: 'success' })
      }
    } else if (activeTab === 'subject-types') {
      if (editItem) {
        store.updateSubjectGroupType(editItem.id, formData)
        store.addToast({ title: 'Subject Type Updated', description: formData.name, type: 'success' })
      } else {
        store.addSubjectGroupType(formData as any)
        store.addToast({ title: 'Subject Type Added', description: formData.name, type: 'success' })
      }
    } else if (activeTab === 'classrooms') {
      if (editItem) {
        store.updateClassroom(editItem.id, formData)
        store.addToast({ title: 'Classroom Updated', description: formData.roomNumber, type: 'success' })
      } else {
        store.addClassroom(formData as any)
        store.addToast({ title: 'Classroom Added', description: formData.roomNumber, type: 'success' })
      }
    } else if (activeTab === 'group-classrooms') {
      if (editItem) {
        store.updateGroupClassroom(editItem.id, formData)
        store.addToast({ title: 'Group Classroom Updated', description: formData.name, type: 'success' })
      } else {
        store.addGroupClassroom(formData as any)
        store.addToast({ title: 'Group Classroom Added', description: formData.name, type: 'success' })
      }
    } else if (activeTab === 'master-subject-groups') {
      const std = store.standards.find(s => s.id === formData.standardId)
      const payload = {
        ...formData,
        standardName: std ? std.name : formData.standardName || 'Standard'
      }
      if (editItem) {
        store.updateMasterSubjectGroup(editItem.id, payload)
        store.addToast({ title: 'Subject Group Updated', description: formData.groupName, type: 'success' })
      } else {
        store.addMasterSubjectGroup(payload as any)
        store.addToast({ title: 'Subject Group Added', description: formData.groupName, type: 'success' })
      }
    } else if (activeTab === 'subject-labs') {
      if (editItem) {
        store.updateSubjectLab(editItem.id, formData)
        store.addToast({ title: 'Subject Lab Updated', description: formData.name, type: 'success' })
      } else {
        store.addSubjectLab(formData as any)
        store.addToast({ title: 'Subject Lab Added', description: formData.name, type: 'success' })
      }
    }

    setIsAddOpen(false)
    setEditItem(null)
  }

  const handleDelete = () => {
    if (!deleteId) return
    if (activeTab === 'years') store.deleteAcademicYear(deleteId)
    else if (activeTab === 'departments') store.deleteDepartment(deleteId)
    else if (activeTab === 'standards') store.deleteStandard(deleteId)
    else if (activeTab === 'subject-types') store.deleteSubjectGroupType(deleteId)
    else if (activeTab === 'classrooms') store.deleteClassroom(deleteId)
    else if (activeTab === 'group-classrooms') store.deleteGroupClassroom(deleteId)
    else if (activeTab === 'master-subject-groups') store.deleteMasterSubjectGroup(deleteId)
    else if (activeTab === 'subject-labs') store.deleteSubjectLab(deleteId)

    store.addToast({ title: 'Record Deleted', type: 'info' })
    setDeleteId(null)
  }

  const toggleStatus = (id: string, current: string) => {
    const next = current === 'Active' ? 'Inactive' : 'Active'
    if (activeTab === 'years') store.updateAcademicYear(id, { status: next as any })
    else if (activeTab === 'departments') store.updateDepartment(id, { status: next as any })
    else if (activeTab === 'standards') store.updateStandard(id, { status: next as any })
    else if (activeTab === 'subject-types') store.updateSubjectGroupType(id, { status: next as any })
    else if (activeTab === 'classrooms') store.updateClassroom(id, { status: next as any })
    else if (activeTab === 'group-classrooms') store.updateGroupClassroom(id, { status: next as any })
    else if (activeTab === 'master-subject-groups') store.updateMasterSubjectGroup(id, { status: next as any })
    else if (activeTab === 'subject-labs') store.updateSubjectLab(id, { status: next as any })
    store.addToast({ title: `Status set to ${next}`, type: 'info' })
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg border border-outline-variant/30 shadow-sm animate-fade-in space-y-space-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-space-sm border-b border-surface-container">
        <div>
          <h2 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-tertiary text-[15px]">
              <i className="fa-solid fa-layer-group"></i>
            </span>
            Section 2 — Institute Setup
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Standardized CRUD sub-modules (Modules 4–10) configuring foundational institutional structures.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="btn-primary text-sm px-4 py-2 font-semibold flex items-center gap-2 shadow-xs"
        >
          <i className="fa-solid fa-plus text-[13px]"></i>
          Add New Record
        </button>
      </div>

      {/* Sub-Tab Navigator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-surface-container scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id as SetupSubTab)
              setSearch('')
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
            }`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-secondary'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-2.5 text-secondary text-[12px]"></i>
          <input
            type="text"
            placeholder="Search records in this module..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Active Tab Table Display */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30 text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">
              {activeTab === 'years' && (
                <>
                  <th className="py-3 px-4">Academic Year</th>
                  <th className="py-3 px-4">Duration Range</th>
                  <th className="py-3 px-4">Terms</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              {activeTab === 'departments' && (
                <>
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4">Dept Code</th>
                  <th className="py-3 px-4">Head of Department</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              {activeTab === 'standards' && (
                <>
                  <th className="py-3 px-4">Standard / Class</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Stream</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              {activeTab === 'subject-types' && (
                <>
                  <th className="py-3 px-4">Subject Group Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              {activeTab === 'classrooms' && (
                <>
                  <th className="py-3 px-4">Room Number</th>
                  <th className="py-3 px-4">Building & Floor</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Smart AV</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              {activeTab === 'group-classrooms' && (
                <>
                  <th className="py-3 px-4">Group Hall Name</th>
                  <th className="py-3 px-4">Rooms Included</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Primary Purpose</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              {activeTab === 'master-subject-groups' && (
                <>
                  <th className="py-3 px-4">Group Name</th>
                  <th className="py-3 px-4">Assigned Standard</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subjects Included</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              {activeTab === 'subject-labs' && (
                <>
                  <th className="py-3 px-4">Lab Name</th>
                  <th className="py-3 px-4">Lab Code</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">In-Charge</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Status</th>
                </>
              )}
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {/* 4. Years */}
            {activeTab === 'years' &&
              store.academicYears
                .filter((y) => y.name.toLowerCase().includes(search.toLowerCase()))
                .map((y) => (
                  <tr key={y.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold text-on-surface">{y.name}</td>
                    <td className="py-3 px-4 text-secondary">
                      {y.startDate} to {y.endDate}
                    </td>
                    <td className="py-3 px-4">{y.termsCount} Terms</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(y.id, y.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          y.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {y.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(y)} className="p-1 text-primary hover:bg-primary/10 rounded mr-2">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => setDeleteId(y.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

            {/* 5. Departments */}
            {activeTab === 'departments' &&
              store.departments
                .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
                .map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold text-on-surface">{d.name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-primary">{d.code}</td>
                    <td className="py-3 px-4 text-secondary">{d.headOfDept}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(d.id, d.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          d.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {d.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(d)} className="p-1 text-primary hover:bg-primary/10 rounded mr-2">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => setDeleteId(d.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

            {/* 6. Standards */}
            {activeTab === 'standards' &&
              store.standards
                .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
                .map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold text-on-surface">{s.name}</td>
                    <td className="py-3 px-4 font-mono text-primary font-bold">{s.code}</td>
                    <td className="py-3 px-4 text-secondary">{s.stream}</td>
                    <td className="py-3 px-4 font-semibold">{s.capacity} seats</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(s.id, s.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          s.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {s.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(s)} className="p-1 text-primary hover:bg-primary/10 rounded mr-2">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => setDeleteId(s.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

            {/* 7. Subject Group Types */}
            {activeTab === 'subject-types' &&
              store.subjectGroupTypes
                .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
                .map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold text-on-surface">{t.name}</td>
                    <td className="py-3 px-4 text-secondary">{t.description}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(t.id, t.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          t.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(t)} className="p-1 text-primary hover:bg-primary/10 rounded mr-2">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => setDeleteId(t.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

            {/* 8. Classrooms */}
            {activeTab === 'classrooms' &&
              store.classrooms
                .filter((c) => c.roomNumber.toLowerCase().includes(search.toLowerCase()))
                .map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold text-on-surface">{c.roomNumber}</td>
                    <td className="py-3 px-4 text-secondary">
                      {c.building} • {c.floor}
                    </td>
                    <td className="py-3 px-4 font-semibold">{c.capacity} students</td>
                    <td className="py-3 px-4">
                      {c.hasProjector ? (
                        <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                          <i className="fa-solid fa-check"></i> Projector Ready
                        </span>
                      ) : (
                        <span className="text-secondary text-xs">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(c.id, c.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          c.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(c)} className="p-1 text-primary hover:bg-primary/10 rounded mr-2">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

            {/* 9. Group Classrooms */}
            {activeTab === 'group-classrooms' &&
              store.groupClassrooms
                .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
                .map((g) => (
                  <tr key={g.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold text-on-surface">{g.name}</td>
                    <td className="py-3 px-4 text-secondary">{g.roomsIncluded}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{g.totalCapacity} capacity</td>
                    <td className="py-3 px-4 text-secondary">{g.purpose}</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(g.id, g.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          g.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {g.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(g)} className="p-1 text-primary hover:bg-primary/10 rounded mr-2">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => setDeleteId(g.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

            {/* 10. Master Subject Groups */}
            {activeTab === 'master-subject-groups' &&
              store.masterSubjectGroups
                .filter((m) => m.groupName.toLowerCase().includes(search.toLowerCase()))
                .map((m) => (
                  <tr key={m.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold text-on-surface">{m.groupName}</td>
                    <td className="py-3 px-4 text-secondary">{m.standardName}</td>
                    <td className="py-3 px-4">
                      <span className="badge-status bg-surface-container text-xs">{m.groupType}</span>
                    </td>
                    <td className="py-3 px-4 text-secondary max-w-xs truncate" title={m.subjectsList}>
                      {m.subjectsList}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(m.id, m.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          m.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(m)} className="p-1 text-primary hover:bg-primary/10 rounded mr-2">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => setDeleteId(m.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}

            {/* 11. Subject Labs */}
            {activeTab === 'subject-labs' &&
              (store.subjectLabs || [])
                .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.code.toLowerCase().includes(search.toLowerCase()))
                .map((l) => (
                  <tr key={l.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold text-on-surface">{l.name}</td>
                    <td className="py-3 px-4 font-mono text-secondary text-xs">{l.code}</td>
                    <td className="py-3 px-4 text-secondary">{l.department}</td>
                    <td className="py-3 px-4 text-secondary">{l.labIncharge || 'Unassigned'}</td>
                    <td className="py-3 px-4">{l.capacity} Seats</td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(l.id, l.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          l.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {l.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(l)} className="p-1 text-primary hover:bg-primary/10 rounded mr-2">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => setDeleteId(l.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Generic Modal */}
      {(isAddOpen || editItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-outline-variant/30 animate-scale-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
              <h3 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
                <i className="fa-solid fa-layer-group text-primary"></i>
                {editItem ? 'Edit Record' : 'Add New Record'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false)
                  setEditItem(null)
                }}
                className="text-secondary hover:text-on-surface"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Dynamic form inputs based on active tab */}
              {activeTab === 'years' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Academic Year Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. 2024-2025"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'departments' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Department Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Department of Physics"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Department Code</label>
                    <input
                      type="text"
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. PHY"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Head of Department</label>
                    <input
                      type="text"
                      value={formData.headOfDept || ''}
                      onChange={(e) => setFormData({ ...formData, headOfDept: e.target.value })}
                      placeholder="e.g. Dr. Jane Smith"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      required
                    />
                  </div>
                </>
              )}

              {activeTab === 'standards' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Standard Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Grade 11 - Science"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Code</label>
                      <input
                        type="text"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="G11-SCI"
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity || 120}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'subject-types' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Type Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elective Stream"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Scope and purpose..."
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs resize-none"
                    />
                  </div>
                </>
              )}

              {activeTab === 'classrooms' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Room Number / Title</label>
                    <input
                      type="text"
                      value={formData.roomNumber || ''}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      placeholder="e.g. Room 204 or Chemistry Lab"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Building</label>
                      <input
                        type="text"
                        value={formData.building || ''}
                        onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity || 40}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'group-classrooms' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Group Classroom Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Main Auditorium"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Rooms Included</label>
                    <input
                      type="text"
                      value={formData.roomsIncluded || ''}
                      onChange={(e) => setFormData({ ...formData, roomsIncluded: e.target.value })}
                      placeholder="e.g. Hall A + Hall B"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Total Capacity</label>
                    <input
                      type="number"
                      value={formData.totalCapacity || 100}
                      onChange={(e) => setFormData({ ...formData, totalCapacity: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                </>
              )}

              {activeTab === 'master-subject-groups' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Group Name</label>
                    <input
                      type="text"
                      value={formData.groupName || ''}
                      onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                      placeholder="e.g. PCM with Computer Science"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Standard</label>
                    <select
                      value={formData.standardId || ''}
                      onChange={(e) => setFormData({ ...formData, standardId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                    >
                      {store.standards.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Subjects List (Comma separated)</label>
                    <textarea
                      rows={2}
                      value={formData.subjectsList || ''}
                      onChange={(e) => setFormData({ ...formData, subjectsList: e.target.value })}
                      placeholder="Physics, Chemistry, Maths, English"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs resize-none"
                    />
                  </div>
                </>
              )}

              {activeTab === 'subject-labs' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Subject Lab Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Physics Instrumentation Lab"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Lab Code</label>
                      <input
                        type="text"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="LAB-PHY-01"
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity || 30}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Department</label>
                    <select
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                    >
                      {store.departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Lab In-Charge Faculty</label>
                    <input
                      type="text"
                      value={formData.labIncharge || ''}
                      onChange={(e) => setFormData({ ...formData, labIncharge: e.target.value })}
                      placeholder="e.g. Dr. Aris Vance"
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1">Status</label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {errorMsg && (
                <div className="p-2 rounded bg-red-50 text-red-600 text-xs">{errorMsg}</div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false)
                    setEditItem(null)
                  }}
                  className="btn-ghost text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs px-4 py-1.5 font-bold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-outline-variant/30 text-center">
            <h3 className="text-sm font-bold mb-2">Delete Record?</h3>
            <p className="text-xs text-secondary mb-4">This record will be permanently deleted from the setup roster.</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setDeleteId(null)} className="btn-ghost text-xs px-3 py-1.5">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
