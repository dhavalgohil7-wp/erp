import React, { useState, useEffect } from 'react'
import {
  useInstituteStore,
  CustomFieldDef,
  CustomFieldType,
  UserRoleItem,
} from '../../store/useInstituteStore'

type MasterSetupTab =
  | 'roles'
  | 'user-fields'
  | 'master-fields'
  | 'field-selection'
  | 'settings'

interface FieldSelectionItem {
  id: string
  label: string
  subtext?: string
}

const TAB4_GENERAL_FIELDS: FieldSelectionItem[] = [
  { id: 'name', label: 'Name.' },
  { id: 'gr_no', label: 'Gr No.' },
  { id: 'mobile', label: 'Mobile.' },
  { id: 'uid_no', label: 'UID No.' },
  { id: 'email', label: 'Email.' },
  { id: 'admission_category', label: 'Admission Category.' },
  { id: 'admission_date', label: 'Admission Date.' },
  { id: 'admission_number', label: 'Admission Number.' },
  { id: 'admission_form_number', label: 'Admission Form Number.' },
  { id: 'date_of_birth', label: 'Date Of Birth.' },
  { id: 'birth_place', label: 'Birth Place.' },
  { id: 'gender', label: 'Gender.' },
  { id: 'religion', label: 'Religion.' },
  { id: 'blood_group', label: 'Blood Group.' },
  { id: 'nationality', label: 'Nationality.' },
  { id: 'pincode', label: 'Pincode.' },
  { id: 'address', label: 'Address.' },
  { id: 'mother_tongue', label: 'Mother Tongue.' },
  { id: 'adhar_card_no', label: 'Adhar Card No.' },
]

const TAB4_BANK_FIELDS: FieldSelectionItem[] = [
  { id: 'bank_account_name', label: 'Bank Account Name.' },
  { id: 'bank_branch', label: 'Bank Branch.' },
  { id: 'bank_ac_no', label: 'Bank A/C No.' },
  { id: 'branch_ifsc_code', label: 'Branch IFSC code.' },
  { id: 'profile_image', label: 'Profile Image.' },
  { id: 'remarks', label: 'Remarks.' },
  { id: 'height', label: 'Height.' },
  { id: 'weight', label: 'Weight.' },
]

const TAB4_PARENT_FIELDS: FieldSelectionItem[] = [
  {
    id: 'parent_1_details',
    label: 'Parent 1 Details.',
    subtext: '("Parent1 Name, Parent1 Email, Parent1 Number")',
  },
  {
    id: 'parent_2_details',
    label: 'Parent 2 Details.',
    subtext: '("Parent2 Name, Parent2 Email, Parent2 Number")',
  },
  { id: 'family_annual_income', label: 'Family Annual Income' },
  {
    id: 'family_member_details',
    label: 'Family Member Details (Name, Relation, Date of Birth, Phone no., etc)',
  },
]

const TAB4_HISTORY_FIELDS: FieldSelectionItem[] = [
  { id: 'previous_school_name', label: 'Previous School Name.' },
  { id: 'previous_board', label: 'Previous Board.' },
  { id: 'previous_standard_class', label: 'Previous Standard/class' },
  { id: 'last_year_of_passing', label: 'Last Year of Passing.' },
  { id: 'last_school_left_date', label: 'Last school left date.' },
  { id: 'last_school_left_reason', label: 'Last school left Reason.' },
  {
    id: 'qualification',
    label:
      'Qualification (StandarName, School/College, Board/University, Year, Total Marks, %/Percentile)',
  },
  {
    id: 'student_documents',
    label:
      'Student Documents (Multiple - Student Certificates, Mark sheets, Proofs or Documents etc. )',
  },
]

const ALL_TAB4_FIELDS: FieldSelectionItem[] = [
  ...TAB4_GENERAL_FIELDS,
  ...TAB4_BANK_FIELDS,
  ...TAB4_PARENT_FIELDS,
  ...TAB4_HISTORY_FIELDS,
]

export default function MasterSetupSection() {
  const {
    userRoles,
    addUserRole,
    updateUserRole,
    toggleUserRoleStatus,
    deleteUserRole,
    roleCustomFields,
    saveRoleCustomFields,
    roleFieldSelections,
    saveRoleFieldSelection,
    roleDefaultFields,
    addToast,
  } = useInstituteStore()

  // Active top tab (1 » User Roles, 2 » User Fields, etc.)
  const [activeTab, setActiveTab] = useState<MasterSetupTab>('roles')

  // ── Tab 1: User Roles State ──
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDesc, setNewRoleDesc] = useState('')
  const [newRoleStatus, setNewRoleStatus] = useState<'Active' | 'Inactive'>('Active')
  const [roleError, setRoleError] = useState('')
  const [roleToDelete, setRoleToDelete] = useState<UserRoleItem | null>(null)

  // Inline edit state for selected role
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  // ── Tab 2: User Fields State ──
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('students')
  const [activeLoadedRole, setActiveLoadedRole] = useState<string>('students')
  const [isDefaultAccordionOpen, setIsDefaultAccordionOpen] = useState(true)
  const [isCustomAccordionOpen, setIsCustomAccordionOpen] = useState(true)
  const [workingCustomFields, setWorkingCustomFields] = useState<CustomFieldDef[]>([])

  // Load custom fields when activeLoadedRole changes
  useEffect(() => {
    const key = activeLoadedRole.toLowerCase()
    const fields =
      roleCustomFields[key] ||
      roleCustomFields[key.replace(/s$/, '')] ||
      roleCustomFields['student'] ||
      []
    const defaultBlank: CustomFieldDef[] = [
      {
        id: `cf-${Date.now()}`,
        title: '',
        fieldType: 'Text',
        required: false,
        isUnique: false,
        optionsString: '',
      },
    ]
    const customList = fields && fields.length > 0 ? fields : defaultBlank
    setWorkingCustomFields(JSON.parse(JSON.stringify(customList)))
  }, [activeLoadedRole, roleCustomFields])

  // Selected role object
  const selectedRole = userRoles.find((r) => r.id === selectedRoleId) || null

  // Switch to Tab 2 and load fields for a specific role
  const handleConfigureRoleFields = (roleName: string) => {
    setSelectedRoleKey(roleName.toLowerCase())
    setActiveLoadedRole(roleName.toLowerCase())
    setActiveTab('user-fields')
    addToast({
      title: 'Configuring Fields',
      description: `Loaded custom fields schema for role "${roleName}".`,
      type: 'info',
    })
  }

  // Handle Add Role submit
  const handleAddRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoleName.trim()) {
      setRoleError('Role name is required.')
      return
    }

    const exists = userRoles.some(
      (r) => r.name.toLowerCase() === newRoleName.trim().toLowerCase()
    )
    if (exists) {
      setRoleError('A role with this name already exists.')
      return
    }

    addUserRole(newRoleName.trim(), newRoleDesc.trim(), newRoleStatus)
    setIsAddRoleOpen(false)
    setNewRoleName('')
    setNewRoleDesc('')
    setRoleError('')

    addToast({
      title: 'New Role Created',
      description: `Role "${newRoleName.trim()}" is now active in Custom Role Lists.`,
      type: 'success',
    })
  }

  // Handle Save Edit Role
  const handleSaveEditRole = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
    if (!editName.trim()) return

    updateUserRole(selectedRole.id, {
      name: editName.trim(),
      description: editDesc.trim(),
    })
    setIsEditingRole(false)
    addToast({
      title: 'Role Updated',
      description: `Role details saved for "${editName.trim()}".`,
      type: 'success',
    })
  }

  // Handle Toggle Status
  const handleToggleStatus = (role: UserRoleItem, e?: React.MouseEvent) => {
    e?.stopPropagation()
    toggleUserRoleStatus(role.id)
    const nextStatus = role.status === 'Inactive' ? 'Active' : 'Inactive'
    addToast({
      title: `Status Updated`,
      description: `Role "${role.name}" is now ${nextStatus}.`,
      type: 'info',
    })
  }

  // Handle Delete Role
  const handleDeleteRole = (id: string) => {
    const roleToRemove = userRoles.find((r) => r.id === id)
    const success = deleteUserRole(id)
    if (success) {
      if (selectedRoleId === id) {
        setSelectedRoleId(null)
        setIsEditingRole(false)
      }
      if (roleToRemove && activeLoadedRole.toLowerCase() === roleToRemove.name.toLowerCase()) {
        setActiveLoadedRole('student')
      }
      addToast({
        title: 'Role Deleted',
        description: `Custom role "${roleToRemove?.name || ''}" removed successfully.`,
        type: 'info',
      })
    } else {
      addToast({
        title: 'Cannot Delete',
        description: 'System default role is protected and cannot be deleted.',
        type: 'error',
      })
    }
  }

  // ── Tab 2 Handlers: User Fields ──
  const handleLoadRoleFields = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveLoadedRole(selectedRoleKey)
    setIsDefaultAccordionOpen(true)
    setIsCustomAccordionOpen(true)
    addToast({
      title: 'Role Fields Loaded',
      description: `Loaded field configuration for role "${selectedRoleKey}".`,
      type: 'info',
    })
  }

  const handleAddRow = () => {
    const newField: CustomFieldDef = {
      id: `cf-${Date.now()}`,
      title: '',
      fieldType: 'Text',
      required: false,
      isUnique: false,
      optionsString: '',
    }
    setWorkingCustomFields([...workingCustomFields, newField])
  }

  const handleRemoveRow = (index: number) => {
    setWorkingCustomFields(workingCustomFields.filter((_, i) => i !== index))
  }

  const handleFieldChange = (
    index: number,
    key: keyof CustomFieldDef,
    value: any
  ) => {
    const updated = [...workingCustomFields]
    updated[index] = { ...updated[index], [key]: value }
    setWorkingCustomFields(updated)
  }

  const handleSaveCustomFields = () => {
    const empty = workingCustomFields.some((f) => !f.title.trim())
    if (empty) {
      addToast({
        title: 'Validation Error',
        description: 'All custom fields must have a valid title.',
        type: 'error',
      })
      return
    }

    saveRoleCustomFields(activeLoadedRole.toLowerCase(), workingCustomFields)
    addToast({
      title: 'Custom Fields Saved',
      description: `Updated ${workingCustomFields.length} custom field(s) for role "${activeLoadedRole}".`,
      type: 'success',
    })
  }

  // Resolve default fields
  const normalizedKey = activeLoadedRole.toLowerCase()
  const defaultFields =
    roleDefaultFields[normalizedKey] ||
    roleDefaultFields[normalizedKey.replace(/s$/, '')] ||
    roleDefaultFields['student'] ||
    []

  // ── Tab 4: Field Selection State (ww & eee images) ──
  const [fieldRoleSelection, setFieldRoleSelection] = useState<string>('')
  const [isFieldRoleLoaded, setIsFieldRoleLoaded] = useState<boolean>(false)
  const [selectedFieldKeys, setSelectedFieldKeys] = useState<Record<string, boolean>>({})

  // Helper to load or initialize fields for a role
  const loadFieldsForRole = (roleName: string) => {
    if (!roleName) {
      setIsFieldRoleLoaded(false)
      return
    }
    const roleKey = roleName.toLowerCase()
    const savedSelections = roleFieldSelections[roleKey]

    if (savedSelections && Array.isArray(savedSelections)) {
      const stateMap: Record<string, boolean> = {}
      ALL_TAB4_FIELDS.forEach((f) => {
        stateMap[f.id] = savedSelections.includes(f.id)
      })
      setSelectedFieldKeys(stateMap)
    } else {
      // Default: all fields checked as shown in image eee
      const stateMap: Record<string, boolean> = {}
      ALL_TAB4_FIELDS.forEach((f) => {
        stateMap[f.id] = true
      })
      setSelectedFieldKeys(stateMap)
    }
    setIsFieldRoleLoaded(true)
  }

  const handleRoleDropdownChange = (roleName: string) => {
    setFieldRoleSelection(roleName)
    if (roleName) {
      loadFieldsForRole(roleName)
    } else {
      setIsFieldRoleLoaded(false)
    }
  }

  const handleGoRoleClick = () => {
    if (!fieldRoleSelection) {
      addToast({
        title: 'Select Role',
        description: 'Please select a role to view field selections.',
        type: 'warning',
      })
      return
    }
    loadFieldsForRole(fieldRoleSelection)
  }

  const handleToggleSingleField = (fieldId: string) => {
    setSelectedFieldKeys((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  const handleToggleGroup = (items: FieldSelectionItem[]) => {
    const allChecked = items.every((f) => !!selectedFieldKeys[f.id])
    const nextVal = !allChecked
    setSelectedFieldKeys((prev) => {
      const next = { ...prev }
      items.forEach((f) => {
        next[f.id] = nextVal
      })
      return next
    })
  }

  const handleSelectAllFields = () => {
    const next: Record<string, boolean> = {}
    ALL_TAB4_FIELDS.forEach((f) => {
      next[f.id] = true
    })
    setSelectedFieldKeys(next)
  }

  const handleDeselectAllFields = () => {
    const next: Record<string, boolean> = {}
    ALL_TAB4_FIELDS.forEach((f) => {
      next[f.id] = false
    })
    setSelectedFieldKeys(next)
  }

  const handleSaveFieldSelections = () => {
    if (!fieldRoleSelection) return
    const activeKeys = Object.entries(selectedFieldKeys)
      .filter(([_, val]) => !!val)
      .map(([key]) => key)

    saveRoleFieldSelection(fieldRoleSelection.toLowerCase(), activeKeys)
    addToast({
      title: 'Field Selection Saved',
      description: `Saved ${activeKeys.length} active field(s) for role "${fieldRoleSelection}".`,
      type: 'success',
    })
  }

  const isGeneralAllChecked = TAB4_GENERAL_FIELDS.every((f) => !!selectedFieldKeys[f.id])
  const isBankAllChecked = TAB4_BANK_FIELDS.every((f) => !!selectedFieldKeys[f.id])
  const isParentAllChecked = TAB4_PARENT_FIELDS.every((f) => !!selectedFieldKeys[f.id])
  const isHistoryAllChecked = TAB4_HISTORY_FIELDS.every((f) => !!selectedFieldKeys[f.id])

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden animate-fade-in font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER TITLE (Exact match to screenshot)
         ───────────────────────────────────────────────────────────── */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-surface-container">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-shapes text-primary text-base"></i>
          <h2 className="text-base font-bold text-on-surface tracking-tight">
            All In One Setup Here...
          </h2>
        </div>

        <span className="text-xs text-secondary font-medium hidden sm:inline-block">
          Enterprise Master Configuration Engine
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FIVE TABS BAR (Numbered with Subtitles)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-surface-container overflow-x-auto scrollbar-none bg-surface-container-low/20">
        {/* Tab 1: User Roles */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('roles')
            setIsAddRoleOpen(false)
          }}
          className={`px-5 py-3 text-left transition-all relative flex flex-col border-r border-surface-container whitespace-nowrap min-w-[170px] ${activeTab === 'roles'
            ? 'bg-surface-container-lowest border-t-2 border-primary shadow-xs'
            : 'hover:bg-surface-container-low/60 opacity-80 hover:opacity-100'
            }`}
        >
          <span
            className={`text-sm font-bold ${activeTab === 'roles' ? 'text-primary' : 'text-on-surface'
              }`}
          >
            1 » User Roles
          </span>
          <span className="text-[11px] text-secondary mt-0.5">For All Sub Institutes</span>
        </button>

        {/* Tab 2: User Fields */}
        <button
          type="button"
          onClick={() => setActiveTab('user-fields')}
          className={`px-5 py-3 text-left transition-all relative flex flex-col border-r border-surface-container whitespace-nowrap min-w-[170px] ${activeTab === 'user-fields'
            ? 'bg-surface-container-lowest border-t-2 border-primary shadow-xs'
            : 'hover:bg-surface-container-low/60 opacity-80 hover:opacity-100'
            }`}
        >
          <span
            className={`text-sm font-bold ${activeTab === 'user-fields' ? 'text-primary' : 'text-on-surface'
              }`}
          >
            2 » User Fields
          </span>
          <span className="text-[11px] text-secondary mt-0.5">For All Sub Institutes</span>
        </button>

        {/* Tab 3: Master Fields */}
        <button
          type="button"
          onClick={() => setActiveTab('master-fields')}
          className={`px-5 py-3 text-left transition-all relative flex flex-col border-r border-surface-container whitespace-nowrap min-w-[170px] ${activeTab === 'master-fields'
            ? 'bg-surface-container-lowest border-t-2 border-primary shadow-xs'
            : 'hover:bg-surface-container-low/60 opacity-80 hover:opacity-100'
            }`}
        >
          <span
            className={`text-sm font-bold ${activeTab === 'master-fields' ? 'text-primary' : 'text-on-surface'
              }`}
          >
            3 » Master Fields
          </span>
          <span className="text-[11px] text-secondary mt-0.5">For Current Institute</span>
        </button>

        {/* Tab 4: Field Selection */}
        <button
          type="button"
          onClick={() => setActiveTab('field-selection')}
          className={`px-5 py-3 text-left transition-all relative flex flex-col border-r border-surface-container whitespace-nowrap min-w-[170px] ${activeTab === 'field-selection'
            ? 'bg-surface-container-lowest border-t-2 border-primary shadow-xs'
            : 'hover:bg-surface-container-low/60 opacity-80 hover:opacity-100'
            }`}
        >
          <span
            className={`text-sm font-bold ${activeTab === 'field-selection' ? 'text-primary' : 'text-on-surface'
              }`}
          >
            4 » Field Selection
          </span>
          <span className="text-[11px] text-secondary mt-0.5">For Current Institute</span>
        </button>

        {/* Tab 5: Institute Settings */}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-3 text-left transition-all relative flex flex-col whitespace-nowrap min-w-[170px] ${activeTab === 'settings'
            ? 'bg-surface-container-lowest border-t-2 border-primary shadow-xs'
            : 'hover:bg-surface-container-low/60 opacity-80 hover:opacity-100'
            }`}
        >
          <span
            className={`text-sm font-bold ${activeTab === 'settings' ? 'text-primary' : 'text-on-surface'
              }`}
          >
            5 » Institute Settings
          </span>
          <span className="text-[11px] text-secondary mt-0.5">For Current Institute</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: USER ROLES (Flat Two-Column Layout directly in card)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'roles' && (
        <div>
          {/* Subheader bar: Manage Institute User Roles */}
          <div className="w-full bg-surface-container-low px-5 py-2.5 border-b border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-users text-primary text-sm"></i>
              <span className="font-bold text-xs sm:text-sm text-on-surface">
                Manage Institute User Roles
              </span>
            </div>
            <span className="text-[11px] text-secondary font-medium">
              Total {userRoles.length} Roles Defined
            </span>
          </div>

          {/* Two-Column Work Area (NO extra nested cards) */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
            {/* ── Left Column: Custom Role Lists (Select Role To Take Actions) ── */}
            <div className="md:col-span-5 p-5 border-b md:border-b-0 md:border-r border-surface-container flex flex-col">
              {/* Left Column Header */}
              <div className="flex items-center gap-1.5 pb-2.5 mb-3 border-b border-surface-container">
                <i className="fa-regular fa-hand-point-right text-secondary text-sm"></i>
                <h3 className="text-xs sm:text-sm font-bold text-on-surface">
                  Custom Role Lists
                </h3>
                <span className="text-[11px] text-secondary font-normal">
                  (Select Role To Take Actions)
                </span>
              </div>

              {/* Roles Listing Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-surface-container text-secondary font-bold">
                      <th className="py-2 px-2.5">Role Name</th>
                      <th className="py-2 px-2 text-center">Current Status</th>
                      <th className="py-2 px-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {userRoles.map((role) => {
                      const isSelected = selectedRoleId === role.id
                      const isActive = role.status !== 'Inactive'

                      return (
                        <tr
                          key={role.id}
                          onClick={() => {
                            setSelectedRoleId(role.id)
                            setIsAddRoleOpen(false)
                            setIsEditingRole(false)
                          }}
                          className={`cursor-pointer transition-colors group ${isSelected
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'hover:bg-surface-container-low/60 text-on-surface'
                            }`}
                        >
                          <td className="py-2.5 px-2.5">
                            <div className="flex items-center gap-2">
                              <i
                                className={`fa-solid fa-caret-right text-[10px] transition-transform ${isSelected
                                  ? 'text-primary translate-x-0.5'
                                  : 'text-secondary/50 group-hover:text-primary'
                                  }`}
                              ></i>
                              <span className="text-xs font-semibold">{role.name}</span>
                              {role.isDefault && (
                                <span className="text-[10px] font-normal text-secondary opacity-70">
                                  (Default)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={(e) => handleToggleStatus(role, e)}
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                                }`}
                              title="Click to toggle status"
                            >
                              {isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="py-2.5 px-2.5 text-right">
                            {!role.isDefault ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setRoleToDelete(role)
                                }}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                                title={`Delete role "${role.name}"`}
                              >
                                <i className="fa-regular fa-trash-can text-xs"></i>
                              </button>
                            ) : (
                              <span
                                className="inline-flex items-center justify-center w-7 h-7 text-secondary/30"
                                title="Default core role cannot be deleted"
                              >
                                <i className="fa-solid fa-lock text-[11px]"></i>
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Quick count footer */}
              <div className="mt-auto pt-4 text-[11px] text-secondary flex items-center justify-between">
                <span>{userRoles.filter((r) => r.status !== 'Inactive').length} Active</span>
                <span>{userRoles.filter((r) => r.status === 'Inactive').length} Inactive</span>
              </div>
            </div>

            {/* ── Right Column: Action Panel ── */}
            <div className="md:col-span-7 p-5 flex flex-col">
              {/* Action Panel Header */}
              <div className="flex items-center justify-between pb-2.5 mb-4 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-pen-to-square text-secondary text-sm"></i>
                  <h3 className="text-xs sm:text-sm font-bold text-on-surface">Action Panel</h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAddRoleOpen(true)
                    setIsEditingRole(false)
                    setSelectedRoleId(null)
                  }}
                  className="btn-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  Add New
                </button>
              </div>

              {/* Action Panel Body Content */}
              <div className="flex-1 flex flex-col justify-center">
                {/* STATE 1: Add New Role Form */}
                {isAddRoleOpen ? (
                  <form
                    onSubmit={handleAddRoleSubmit}
                    className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4 animate-scale-in"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                        <i className="fa-solid fa-user-plus"></i>
                        Create New User Role
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddRoleOpen(false)}
                        className="text-secondary hover:text-on-surface text-xs"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface">
                        Role Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="e.g. Accountant, Lab Technician, Coordinator"
                        className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface">
                        Role Description / Operational Scope
                      </label>
                      <input
                        type="text"
                        value={newRoleDesc}
                        onChange={(e) => setNewRoleDesc(e.target.value)}
                        placeholder="Brief overview of responsibilities and permissions"
                        className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-on-surface">
                        Initial Status
                      </label>
                      <select
                        value={newRoleStatus}
                        onChange={(e) => setNewRoleStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface"
                      >
                        <option value="Active">Active (Available immediately)</option>
                        <option value="Inactive">Inactive (Disabled temporarily)</option>
                      </select>
                    </div>

                    {roleError && (
                      <div className="p-2.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                        {roleError}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                      <button
                        type="button"
                        onClick={() => setIsAddRoleOpen(false)}
                        className="btn-ghost text-xs px-3 py-1.5"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary text-xs px-4 py-1.5 font-bold">
                        Save Role
                      </button>
                    </div>
                  </form>
                ) : selectedRole ? (
                  /* STATE 2: Role Selected - Action Workspace */
                  <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-base">
                          <i className="fa-solid fa-user-gear"></i>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                            {selectedRole.name}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedRole.status !== 'Inactive'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                                }`}
                            >
                              {selectedRole.status || 'Active'}
                            </span>
                          </h4>
                          <p className="text-[11px] text-secondary mt-0.5">
                            {selectedRole.description || 'System assigned institutional role'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedRoleId(null)}
                        className="text-secondary hover:text-on-surface text-xs"
                        title="Deselect role"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    {/* Role Metrics & Status Card */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
                        <span className="text-[11px] text-secondary">Enrolled User Count</span>
                        <div className="text-base font-bold text-on-surface mt-0.5">
                          {selectedRole.userCount || 0} {selectedRole.name}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
                        <span className="text-[11px] text-secondary">System Role Classification</span>
                        <div className="text-xs font-semibold text-primary mt-1">
                          {selectedRole.isDefault ? 'Protected Core Default' : 'Custom Configurable'}
                        </div>
                      </div>
                    </div>

                    {/* Inline Edit Form if toggled */}
                    {isEditingRole ? (
                      <form
                        onSubmit={handleSaveEditRole}
                        className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 space-y-3"
                      >
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">Role Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-surface-container-low border border-outline-variant/30 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-surface-container-low border border-outline-variant/30 text-xs"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingRole(false)}
                            className="btn-ghost text-xs px-2.5 py-1"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn-primary text-xs px-3 py-1 font-bold"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    ) : null}

                    {/* Primary Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      {/* Jump to Tab 2 button */}
                      <button
                        type="button"
                        onClick={() => handleConfigureRoleFields(selectedRole.name)}
                        className="btn-primary text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
                      >
                        <i className="fa-solid fa-sliders text-[11px]"></i>
                        Configure User Fields for "{selectedRole.name}"
                      </button>

                      {/* Edit Details Button */}
                      {!isEditingRole && !selectedRole.isDefault && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingRole(true)
                            setEditName(selectedRole.name)
                            setEditDesc(selectedRole.description || '')
                          }}
                          className="px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-pen text-[11px]"></i>
                          Edit Role
                        </button>
                      )}

                      {/* Status Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(selectedRole, e)}
                        className="px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-power-off text-[11px]"></i>
                        Make {selectedRole.status === 'Inactive' ? 'Active' : 'Inactive'}
                      </button>

                      {/* Delete Role Button */}
                      {!selectedRole.isDefault && (
                        <button
                          type="button"
                          onClick={() => setRoleToDelete(selectedRole)}
                          className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors ml-auto flex items-center gap-1.5"
                          title="Delete custom role"
                        >
                          <i className="fa-solid fa-trash-can text-[11px]"></i>
                          Remove Role
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* STATE 3: Default Empty State (Exact match to screenshot) */
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <p className="text-secondary text-sm font-medium">
                      Select Role To Perform Actions...
                    </p>
                    <p className="text-[11px] text-secondary/70 mt-1 max-w-xs">
                      Click any role from the left list to view status, edit permissions, or configure its dynamic field schema.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: USER FIELDS (3.2 Role Selector + 2 Accordions)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'user-fields' && (
        <div>
          {/* Subheader */}
          <div className="w-full bg-surface-container-low px-5 py-2.5 border-b border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-sliders text-primary text-sm"></i>
              <span className="font-bold text-xs sm:text-sm text-on-surface">
                Manage Institute User Fields
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('roles')}
              className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i> Back to User Roles
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Step 1: Select Role Dropdown + Submit button */}
            <form
              onSubmit={handleLoadRoleFields}
              className="flex flex-col sm:flex-row sm:items-end gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30"
            >
              <div className="flex-1">
                <label className="block text-xs font-bold mb-1 text-on-surface">
                  Select Role to Configure Schema:
                </label>
                <select
                  value={selectedRoleKey}
                  onChange={(e) => setSelectedRoleKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {userRoles.map((r) => (
                    <option key={r.id} value={r.name.toLowerCase()}>
                      {r.name} {r.isDefault ? '(Default Protected)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary text-xs px-5 py-2 font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-arrows-rotate text-[11px]"></i>
                Load Field Schema
              </button>
            </form>

            {/* Currently Editing Schema Banner */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 text-xs">
                <i className="fa-solid fa-shield-halved text-primary"></i>
                <span className="text-secondary font-medium">Currently Editing Schema for:</span>
                <strong className="text-primary uppercase tracking-wider font-bold">
                  {activeLoadedRole}
                </strong>
              </div>
              <span className="text-[11px] text-secondary">
                {workingCustomFields.length} Custom Field(s)
              </span>
            </div>

            {/* ── ACCORDION 1: Default Fields (Read-Only) ── */}
            <div className="rounded-xl border border-outline-variant/30 overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setIsDefaultAccordionOpen(!isDefaultAccordionOpen)}
                className="w-full px-4 py-3 bg-surface-container-low flex items-center justify-between text-left text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
              >
                <div className="flex items-center gap-2">
                  <i
                    className={`fa-solid fa-chevron-right text-[11px] transition-transform ${isDefaultAccordionOpen ? 'rotate-90 text-primary' : 'text-secondary'
                      }`}
                  ></i>
                  <span>Default Fields (Predefined • Read-Only)</span>
                </div>
                <span className="text-[11px] font-semibold text-secondary">
                  {defaultFields.length} Predefined System Fields
                </span>
              </button>

              {isDefaultAccordionOpen && (
                <div className="p-4 bg-surface-container-lowest animate-fade-in overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-surface-container text-secondary font-bold">
                        <th className="py-2 px-3">Field Key</th>
                        <th className="py-2 px-3">Field Label</th>
                        <th className="py-2 px-3">Input Type</th>
                        <th className="py-2 px-3">Mandatory?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {defaultFields.map((field) => (
                        <tr key={field.key} className="hover:bg-surface-container-low/40">
                          <td className="py-2.5 px-3 font-mono text-secondary text-[11px]">
                            {field.key}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-on-surface">
                            {field.label}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] font-medium text-secondary">
                              {field.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {field.required ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                <i className="fa-solid fa-check text-[10px]"></i> Yes
                              </span>
                            ) : (
                              <span className="text-secondary text-[11px]">Optional</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── ACCORDION 2: Custom Fields (Dynamic Form Schema Builder) ── */}
            <div className="rounded-xl border border-outline-variant/30 overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setIsCustomAccordionOpen(!isCustomAccordionOpen)}
                className="w-full px-4 py-3 bg-surface-container-low flex items-center justify-between text-left text-xs font-bold text-on-surface transition-colors hover:bg-surface-container"
              >
                <div className="flex items-center gap-2">
                  <i
                    className={`fa-solid fa-chevron-right text-[11px] transition-transform ${isCustomAccordionOpen ? 'rotate-90 text-primary' : 'text-secondary'
                      }`}
                  ></i>
                  <span>Custom Fields (Dynamic Form Schema Builder)</span>
                </div>
                <span className="text-[11px] font-semibold text-primary">
                  {workingCustomFields.length} Dynamic Fields
                </span>
              </button>

              {isCustomAccordionOpen && (
                <div className="p-4 bg-surface-container-lowest animate-fade-in space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-secondary">
                      Fields added below are dynamically rendered on registration forms for this role.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="btn-secondary text-xs px-3 py-1.5 font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i>
                      Add New Custom Field
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-surface-container rounded-lg overflow-hidden">
                      <thead className="bg-surface-container-low text-secondary font-bold">
                        <tr className="border-b border-surface-container">
                          <th className="py-2.5 px-3 w-12 text-center">Sr.No</th>
                          <th className="py-2.5 px-3 min-w-[150px]">Field Title</th>
                          <th className="py-2.5 px-3 min-w-[120px]">Field Type</th>
                          <th className="py-2.5 px-3 w-24 text-center">Required?</th>
                          <th className="py-2.5 px-3 w-24 text-center">Is Unique?</th>
                          <th className="py-2.5 px-3 min-w-[200px]">Value (Comma Separated)</th>
                          <th className="py-2.5 px-3 w-16 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {workingCustomFields.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-secondary text-xs italic">
                              No custom fields defined for role "{activeLoadedRole}". Click "+ Add New Custom Field" to create one.
                            </td>
                          </tr>
                        ) : (
                          workingCustomFields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-surface-container-low/30">
                              <td className="py-2 px-3 text-center text-secondary font-bold">
                                {index + 1}
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={field.title || ''}
                                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                  placeholder="e.g. Blood Group"
                                  className="w-full px-2.5 py-1.5 rounded bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                  required
                                />
                              </td>
                              <td className="py-2 px-3">
                                <select
                                  value={field.fieldType || 'Text'}
                                  onChange={(e) =>
                                    handleFieldChange(index, 'fieldType', e.target.value as CustomFieldType)
                                  }
                                  className="w-full px-2 py-1.5 rounded bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface"
                                >
                                  <option value="Text">Text</option>
                                  <option value="Number">Number</option>
                                  <option value="Password">Password</option>
                                  <option value="Email">Email</option>
                                  <option value="Date">Date</option>
                                  <option value="Dropdown">Dropdown (Select)</option>
                                  <option value="Checkbox">Checkbox</option>
                                  <option value="Radio">Radio</option>
                                  <option value="Textarea">Textarea</option>
                                </select>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleFieldChange(index, 'required', !field.required)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${field.required
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                    : 'bg-slate-100 text-slate-500 border-slate-300'
                                    }`}
                                >
                                  {field.required ? 'Yes' : 'No'}
                                </button>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleFieldChange(index, 'isUnique', !field.isUnique)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${field.isUnique
                                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                                    : 'bg-slate-100 text-slate-500 border-slate-300'
                                    }`}
                                >
                                  {field.isUnique ? 'Yes' : 'No'}
                                </button>
                              </td>
                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={field.optionsString || ''}
                                  onChange={(e) =>
                                    handleFieldChange(index, 'optionsString', e.target.value)
                                  }
                                  placeholder="Option A, Option B, Option C"
                                  disabled={
                                    !['Dropdown', 'Radio', 'Checkbox'].includes(field.fieldType)
                                  }
                                  className="w-full px-2.5 py-1.5 rounded bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRow(index)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Remove field"
                                >
                                  <i className="fa-solid fa-trash-can text-xs"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-surface-container">
                    <button
                      type="button"
                      onClick={handleSaveCustomFields}
                      className="btn-primary text-xs px-6 py-2 font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <i className="fa-solid fa-floppy-disk text-xs"></i>
                      Save Custom Field Schema
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: MASTER FIELDS (Universal Institute Master Registry)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'master-fields' && (
        <div>
          <div className="w-full bg-surface-container-low px-5 py-2.5 border-b border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-book-bookmark text-primary text-sm"></i>
              <span className="font-bold text-xs sm:text-sm text-on-surface">
                Campus Master Field Dictionary (Current Institute Scoped)
              </span>
            </div>
            <span className="text-[11px] text-secondary">Active Tenant Rules</span>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <p className="text-xs text-secondary">
              Master fields are institutional globals inherited across all campus departments, academic grades, and administrative reports.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-surface-container rounded-lg">
                <thead className="bg-surface-container-low text-secondary font-bold">
                  <tr className="border-b border-surface-container">
                    <th className="py-2.5 px-3">Field Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">System Key</th>
                    <th className="py-2.5 px-3">Enforcement</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">National Academic ID</td>
                    <td className="py-2.5 px-3 text-secondary">Government Registry</td>
                    <td className="py-2.5 px-3 font-mono text-secondary text-[11px]">GOV_APAAR_ID</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-700">Mandatory</td>
                    <td className="py-2.5 px-3"><span className="badge-new">Active</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">Campus RFID Card Serial</td>
                    <td className="py-2.5 px-3 text-secondary">Biometrics & Turnstiles</td>
                    <td className="py-2.5 px-3 font-mono text-secondary text-[11px]">RFID_CARD_HEX</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-700">Unique Constraint</td>
                    <td className="py-2.5 px-3"><span className="badge-new">Active</span></td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-2.5 px-3 font-semibold text-on-surface">Emergency Blood Group</td>
                    <td className="py-2.5 px-3 text-secondary">Medical & Infirmary</td>
                    <td className="py-2.5 px-3 font-mono text-secondary text-[11px]">MED_BLOOD_GRP</td>
                    <td className="py-2.5 px-3 font-semibold text-secondary">Universal Dropdown</td>
                    <td className="py-2.5 px-3"><span className="badge-new">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: FIELD SELECTION (Exact match to screenshots ww & eee)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'field-selection' && (
        <div className="p-5 sm:p-6 space-y-5 animate-fade-in">
          {/* Header as per screenshot ww */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-gear text-secondary text-base"></i>
            <h3 className="font-bold text-on-surface text-base sm:text-lg tracking-tight">
              Manage Fields Selection
            </h3>
          </div>

          {/* Role Selector Box as per screenshot ww */}
          <div className="bg-surface-container-low/40 border border-outline-variant/30 rounded-xl p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
              <label
                htmlFor="tab4-role-select"
                className="text-xs sm:text-sm font-semibold text-on-surface whitespace-nowrap"
              >
                Select Role
              </label>

              <div className="relative w-full sm:w-80">
                <select
                  id="tab4-role-select"
                  value={fieldRoleSelection}
                  onChange={(e) => handleRoleDropdownChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant/50 bg-surface-container-lowest text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs font-medium cursor-pointer"
                >
                  <option value="">--Select--</option>
                  {userRoles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleGoRoleClick}
                className="w-full sm:w-auto px-7 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all shadow-xs active:scale-[0.98]"
              >
                Go
              </button>
            </div>
          </div>

          {/* Fields Selection Matrix (3 Columns) as per screenshot eee */}
          {isFieldRoleLoaded && fieldRoleSelection ? (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                {/* ═══════════════════════════════════════════════════════
                    COLUMN 1: 1. Basic Details
                   ═══════════════════════════════════════════════════════ */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden shadow-2xs">
                  {/* Column Header */}
                  <div className="bg-[#b8d4f1] dark:bg-[#1e3a5f] text-[#1e3a8a] dark:text-[#bfdbfe] font-bold py-2.5 px-3 text-center text-xs sm:text-sm tracking-wide border-b border-[#a2c4e6] dark:border-outline-variant/30">
                    1. Basic Details
                  </div>

                  {/* Group 1: General Details */}
                  <div>
                    <div
                      onClick={() => handleToggleGroup(TAB4_GENERAL_FIELDS)}
                      className="px-3.5 py-2.5 border-b border-surface-container flex items-center gap-2.5 bg-surface-container-low/40 cursor-pointer select-none hover:bg-surface-container-low/70 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isGeneralAllChecked}
                        onChange={() => { }} // handled by container onClick
                        className="w-4 h-4 rounded text-primary border-outline-variant/60 focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="font-bold text-on-surface text-xs sm:text-[13px]">
                        General Details
                      </span>
                    </div>

                    <div className="divide-y divide-surface-container/60">
                      {TAB4_GENERAL_FIELDS.map((field) => (
                        <label
                          key={field.id}
                          className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-surface-container-low/40 transition-colors cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedFieldKeys[field.id]}
                            onChange={() => handleToggleSingleField(field.id)}
                            className="w-4 h-4 rounded text-primary border-outline-variant/60 focus:ring-primary/20 cursor-pointer"
                          />
                          <span className="text-on-surface text-xs sm:text-[13px]">
                            {field.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Group 2: Bank Details */}
                  <div className="border-t-2 border-surface-container">
                    <div
                      onClick={() => handleToggleGroup(TAB4_BANK_FIELDS)}
                      className="px-3.5 py-2.5 border-b border-surface-container flex items-center gap-2.5 bg-surface-container-low/40 cursor-pointer select-none hover:bg-surface-container-low/70 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isBankAllChecked}
                        onChange={() => { }} // handled by container onClick
                        className="w-4 h-4 rounded text-primary border-outline-variant/60 focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="font-bold text-on-surface text-xs sm:text-[13px]">
                        Bank Details
                      </span>
                    </div>

                    <div className="divide-y divide-surface-container/60">
                      {TAB4_BANK_FIELDS.map((field) => (
                        <label
                          key={field.id}
                          className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-surface-container-low/40 transition-colors cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedFieldKeys[field.id]}
                            onChange={() => handleToggleSingleField(field.id)}
                            className="w-4 h-4 rounded text-primary border-outline-variant/60 focus:ring-primary/20 cursor-pointer"
                          />
                          <span className="text-on-surface text-xs sm:text-[13px]">
                            {field.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════════
                    COLUMN 2: 2. Parent1 and Parent2 Details
                   ═══════════════════════════════════════════════════════ */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden shadow-2xs">
                  {/* Column Header */}
                  <div className="bg-[#b8d4f1] dark:bg-[#1e3a5f] text-[#1e3a8a] dark:text-[#bfdbfe] font-bold py-2.5 px-3 text-center text-xs sm:text-sm tracking-wide border-b border-[#a2c4e6] dark:border-outline-variant/30">
                    2. Parent1 and Parent2 Details
                  </div>

                  {/* Select All */}
                  <div
                    onClick={() => handleToggleGroup(TAB4_PARENT_FIELDS)}
                    className="px-3.5 py-2.5 border-b border-surface-container flex items-center gap-2.5 bg-surface-container-low/40 cursor-pointer select-none hover:bg-surface-container-low/70 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isParentAllChecked}
                      onChange={() => { }} // handled by container onClick
                      className="w-4 h-4 rounded text-primary border-outline-variant/60 focus:ring-primary/20 cursor-pointer"
                    />
                    <span className="font-bold text-on-surface text-xs sm:text-[13px]">
                      Select All
                    </span>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-surface-container/60">
                    {TAB4_PARENT_FIELDS.map((field) => (
                      <label
                        key={field.id}
                        className="flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-surface-container-low/40 transition-colors cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={!!selectedFieldKeys[field.id]}
                          onChange={() => handleToggleSingleField(field.id)}
                          className="mt-0.5 w-4 h-4 rounded text-primary border-outline-variant/60 focus:ring-primary/20 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-on-surface text-xs sm:text-[13px] font-medium leading-snug">
                            {field.label}
                          </div>
                          {field.subtext && (
                            <div className="text-[11px] text-secondary mt-0.5 leading-tight">
                              {field.subtext}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════════
                    COLUMN 3: 3. Past Histories
                   ═══════════════════════════════════════════════════════ */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden shadow-2xs">
                  {/* Column Header */}
                  <div className="bg-[#b8d4f1] dark:bg-[#1e3a5f] text-[#1e3a8a] dark:text-[#bfdbfe] font-bold py-2.5 px-3 text-center text-xs sm:text-sm tracking-wide border-b border-[#a2c4e6] dark:border-outline-variant/30">
                    3. Past Histories
                  </div>

                  {/* Select All */}
                  <div
                    onClick={() => handleToggleGroup(TAB4_HISTORY_FIELDS)}
                    className="px-3.5 py-2.5 border-b border-surface-container flex items-center gap-2.5 bg-surface-container-low/40 cursor-pointer select-none hover:bg-surface-container-low/70 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isHistoryAllChecked}
                      onChange={() => { }} // handled by container onClick
                      className="w-4 h-4 rounded text-primary border-outline-variant/60 focus:ring-primary/20 cursor-pointer"
                    />
                    <span className="font-bold text-on-surface text-xs sm:text-[13px]">
                      Select All
                    </span>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-surface-container/60">
                    {TAB4_HISTORY_FIELDS.map((field) => (
                      <label
                        key={field.id}
                        className="flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-surface-container-low/40 transition-colors cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={!!selectedFieldKeys[field.id]}
                          onChange={() => handleToggleSingleField(field.id)}
                          className="mt-0.5 w-4 h-4 rounded text-primary border-outline-variant/60 focus:ring-primary/20 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-on-surface text-xs sm:text-[13px] font-medium leading-snug">
                            {field.label}
                          </div>
                          {field.subtext && (
                            <div className="text-[11px] text-secondary mt-0.5 leading-tight">
                              {field.subtext}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar at bottom */}
              <div className="pt-4 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-secondary">
                  Active Role:{' '}
                  <span className="font-semibold text-on-surface">
                    {fieldRoleSelection}
                  </span>{' '}
                  &bull;{' '}
                  <span className="font-semibold text-primary">
                    {Object.values(selectedFieldKeys).filter(Boolean).length}
                  </span>{' '}
                  of {ALL_TAB4_FIELDS.length} fields enabled
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSelectAllFields}
                    className="px-3.5 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-medium text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllFields}
                    className="px-3.5 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-medium text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    Deselect All
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFieldSelections}
                    className="px-5 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg text-xs sm:text-sm shadow-xs flex items-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <i className="fa-solid fa-floppy-disk text-xs"></i>
                    Save Field Selection
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 px-4 text-center border border-dashed border-outline-variant/40 rounded-xl bg-surface-container-low/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                <i className="fa-solid fa-arrow-up text-base"></i>
              </div>
              <h4 className="text-sm font-semibold text-on-surface mb-1">
                No Role Selected
              </h4>
              <p className="text-xs text-secondary max-w-md mx-auto">
                Select a role from the dropdown above and click{' '}
                <span className="font-semibold text-primary">Go</span> to
                configure the visible fields matrix.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: INSTITUTE SETTINGS (Registration Rules)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div>
          <div className="w-full bg-surface-container-low px-5 py-2.5 border-b border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-gears text-primary text-sm"></i>
              <span className="font-bold text-xs sm:text-sm text-on-surface">
                Campus Operational Policy & Sequencing Rules
              </span>
            </div>
            <span className="text-[11px] text-secondary">Global Config</span>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
                <h4 className="font-bold text-on-surface">Auto-Generated Code Prefixes</h4>
                <div>
                  <label className="block text-secondary text-[11px] mb-1">Student Admission Prefix</label>
                  <input
                    type="text"
                    defaultValue="ADM-2024-"
                    className="w-full px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-secondary text-[11px] mb-1">Faculty Employee Code Prefix</label>
                  <input
                    type="text"
                    defaultValue="FAC-2024-"
                    className="w-full px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
                <h4 className="font-bold text-on-surface">Self-Service Permissions</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Allow students to edit custom contact information</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Notify Institute Admin on new role custom field updates</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Enforce unique validation on email and phone numbers</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Delete Confirmation Modal */}
      {roleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-outline-variant/30 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 text-lg">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1.5">Delete Role?</h3>
            <p className="text-xs text-secondary mb-5">
              Are you sure you want to remove role{' '}
              <span className="font-semibold text-on-surface">"{roleToDelete.name}"</span>? Any custom configurations for this role will be removed.
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setRoleToDelete(null)}
                className="btn-ghost text-xs px-4 py-2 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteRole(roleToDelete.id)
                  setRoleToDelete(null)
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-xs"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
