import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface InstituteDetails {
  name: string
  address: string
  email: string
  phone: string
  logoUrl: string
  bannerUrl: string
  website?: string
  affiliationCode?: string
}

export interface SubInstitute {
  id: string
  name: string
  code: string
  city: string
  status: 'Active' | 'Inactive'
  createdAt: string
}

export interface UserRoleItem {
  id: string
  name: string
  isDefault?: boolean
  description?: string
  userCount: number
  status?: 'Active' | 'Inactive'
}

export type CustomFieldType =
  | 'Text'
  | 'Number'
  | 'Password'
  | 'Email'
  | 'Date'
  | 'Dropdown'
  | 'Checkbox'
  | 'Radio'
  | 'Textarea'

export interface CustomFieldDef {
  id: string
  title: string
  fieldType: CustomFieldType
  required: boolean
  isUnique: boolean
  optionsString: string // comma-separated
  description?: string
}

export interface DefaultFieldDef {
  key: string
  label: string
  type: string
  required: boolean
}

// Institute Setup sub-module models
export interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  termsCount: number
  status: 'Active' | 'Inactive'
}

export interface Department {
  id: string
  name: string
  code: string
  headOfDept: string
  status: 'Active' | 'Inactive'
}

export interface Standard {
  id: string
  name: string
  code: string
  stream?: string
  capacity: number
  status: 'Active' | 'Inactive'
}

export interface SubjectGroupType {
  id: string
  name: string
  description: string
  status: 'Active' | 'Inactive'
}

export interface Classroom {
  id: string
  roomNumber: string
  building: string
  floor: string
  capacity: number
  hasProjector: boolean
  status: 'Active' | 'Inactive'
}

export interface GroupClassroom {
  id: string
  name: string
  roomsIncluded: string
  totalCapacity: number
  purpose: string
  status: 'Active' | 'Inactive'
}

export interface MasterSubjectGroup {
  id: string
  groupName: string
  standardId: string
  standardName: string
  groupType: string
  subjectsList: string
  status: 'Active' | 'Inactive'
}

export interface SubjectLab {
  id: string
  name: string
  code: string
  department: string
  labIncharge: string
  capacity: number
  status: 'Active' | 'Inactive'
}

// User records with dynamic custom field values
export interface UserRecord {
  id: string
  roleId: string // 'student' | 'faculty' | 'admin' | string
  fullName: string
  email: string
  phone: string
  status: 'Active' | 'Inactive'
  createdAt: string
  defaultData: Record<string, any>
  customData: Record<string, any>
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface InstituteStoreState {
  // 1.1 Details
  instituteDetails: InstituteDetails
  updateInstituteDetails: (details: Partial<InstituteDetails>) => void

  // 1.2 Sub Institutes
  subInstitutes: SubInstitute[]
  addSubInstitute: (item: Omit<SubInstitute, 'id' | 'createdAt'>) => void
  updateSubInstitute: (id: string, item: Partial<SubInstitute>) => void
  deleteSubInstitute: (id: string) => void
  toggleSubInstituteStatus: (id: string) => void

  // 1.3 Master Setup - Roles
  userRoles: UserRoleItem[]
  addUserRole: (name: string, description?: string, status?: 'Active' | 'Inactive') => void
  updateUserRole: (id: string, updates: Partial<UserRoleItem>) => void
  toggleUserRoleStatus: (id: string) => void
  deleteUserRole: (id: string) => boolean

  // 1.3 Master Setup - Role Custom Fields
  roleCustomFields: Record<string, CustomFieldDef[]> // keyed by role name or ID (lowercase)
  saveRoleCustomFields: (roleKey: string, fields: CustomFieldDef[]) => void

  // 1.3 Master Setup - Role Field Selections (Tab 4)
  roleFieldSelections: Record<string, string[]>
  saveRoleFieldSelection: (roleKey: string, fieldIds: string[]) => void

  // Role Default Fields (read-only reference)
  roleDefaultFields: Record<string, DefaultFieldDef[]>

  // Section 2: Institute Setup CRUD
  academicYears: AcademicYear[]
  addAcademicYear: (item: Omit<AcademicYear, 'id'>) => void
  updateAcademicYear: (id: string, item: Partial<AcademicYear>) => void
  deleteAcademicYear: (id: string) => void

  departments: Department[]
  addDepartment: (item: Omit<Department, 'id'>) => void
  updateDepartment: (id: string, item: Partial<Department>) => void
  deleteDepartment: (id: string) => void

  standards: Standard[]
  addStandard: (item: Omit<Standard, 'id'>) => void
  updateStandard: (id: string, item: Partial<Standard>) => void
  deleteStandard: (id: string) => void

  subjectGroupTypes: SubjectGroupType[]
  addSubjectGroupType: (item: Omit<SubjectGroupType, 'id'>) => void
  updateSubjectGroupType: (id: string, item: Partial<SubjectGroupType>) => void
  deleteSubjectGroupType: (id: string) => void

  classrooms: Classroom[]
  addClassroom: (item: Omit<Classroom, 'id'>) => void
  updateClassroom: (id: string, item: Partial<Classroom>) => void
  deleteClassroom: (id: string) => void

  groupClassrooms: GroupClassroom[]
  addGroupClassroom: (item: Omit<GroupClassroom, 'id'>) => void
  updateGroupClassroom: (id: string, item: Partial<GroupClassroom>) => void
  deleteGroupClassroom: (id: string) => void

  masterSubjectGroups: MasterSubjectGroup[]
  addMasterSubjectGroup: (item: Omit<MasterSubjectGroup, 'id'>) => void
  updateMasterSubjectGroup: (id: string, item: Partial<MasterSubjectGroup>) => void
  deleteMasterSubjectGroup: (id: string) => void

  // Step 11: Subject Labs
  subjectLabs: SubjectLab[]
  addSubjectLab: (item: Omit<SubjectLab, 'id'>) => void
  updateSubjectLab: (id: string, item: Partial<SubjectLab>) => void
  deleteSubjectLab: (id: string) => void

  // Section 3: User Management
  users: UserRecord[]
  addUserRecord: (record: Omit<UserRecord, 'id' | 'createdAt'>) => { success: boolean; error?: string }
  updateUserRecord: (id: string, record: Partial<UserRecord>) => { success: boolean; error?: string }
  deleteUserRecord: (id: string) => void

  // UI Toast notifications
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

// Default pre-defined fields for the 3 primary roles
const INITIAL_DEFAULT_FIELDS: Record<string, DefaultFieldDef[]> = {
  student: [
    { key: 'admissionNo', label: 'Admission Number', type: 'Text', required: true },
    { key: 'rollNo', label: 'Roll Number', type: 'Number', required: true },
    { key: 'fullName', label: 'Full Name', type: 'Text', required: true },
    { key: 'gender', label: 'Gender', type: 'Select', required: true },
    { key: 'dob', label: 'Date of Birth', type: 'Date', required: true },
    { key: 'parentName', label: 'Parent / Guardian Name', type: 'Text', required: true },
    { key: 'email', label: 'Student / Parent Email', type: 'Email', required: true },
    { key: 'phone', label: 'Emergency Contact Phone', type: 'Phone', required: true },
    { key: 'standard', label: 'Standard / Class', type: 'Text', required: true },
    { key: 'address', label: 'Residential Address', type: 'Textarea', required: false },
  ],
  faculties: [
    { key: 'employeeCode', label: 'Employee Code', type: 'Text', required: true },
    { key: 'fullName', label: 'Full Faculty Name', type: 'Text', required: true },
    { key: 'designation', label: 'Designation / Title', type: 'Text', required: true },
    { key: 'department', label: 'Department Assigned', type: 'Text', required: true },
    { key: 'qualification', label: 'Highest Qualification', type: 'Text', required: true },
    { key: 'email', label: 'Official Institutional Email', type: 'Email', required: true },
    { key: 'phone', label: 'Primary Contact Number', type: 'Phone', required: true },
    { key: 'joiningDate', label: 'Date of Joining', type: 'Date', required: true },
  ],
  'institute admin': [
    { key: 'adminId', label: 'Administrator ID', type: 'Text', required: true },
    { key: 'fullName', label: 'Administrator Full Name', type: 'Text', required: true },
    { key: 'email', label: 'Admin Login Email', type: 'Email', required: true },
    { key: 'phone', label: 'Contact Number', type: 'Phone', required: true },
    { key: 'roleLevel', label: 'Access Authorization Level', type: 'Text', required: true },
    { key: 'department', label: 'Supervisory Directorate', type: 'Text', required: false },
  ],
}

// Initial custom fields demo
const INITIAL_CUSTOM_FIELDS: Record<string, CustomFieldDef[]> = {
  student: [
    {
      id: 'cf-1',
      title: '',
      fieldType: 'Text',
      required: false,
      isUnique: false,
      optionsString: '',
    },
  ],
  faculties: [
    {
      id: 'cf-2',
      title: '',
      fieldType: 'Text',
      required: false,
      isUnique: false,
      optionsString: '',
    },
  ],
  'institute admin': [
    {
      id: 'cf-3',
      title: '',
      fieldType: 'Text',
      required: false,
      isUnique: false,
      optionsString: '',
    },
  ],
}

export const useInstituteStore = create<InstituteStoreState>()(
  persist(
    (set, get) => ({
      instituteDetails: {
        name: 'St. Xavier International Academy',
        address: '42 Knowledge Corridor, Tech Park Avenue, Silicon Hills, Ahmedabad 380054',
        email: 'info@stxavieracademy.edu.in',
        phone: '+91 79 2840 9100',
        logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=140&fit=crop&q=80',
        website: 'https://stxavieracademy.edu.in',
        affiliationCode: 'CBSE-REG-847291',
      },

      updateInstituteDetails: (details) =>
        set((state) => ({
          instituteDetails: { ...state.instituteDetails, ...details },
        })),

      subInstitutes: [
        {
          id: 'SUB-101',
          name: 'St. Xavier City Junior Wing',
          code: 'SX-JR-01',
          city: 'Ahmedabad West',
          status: 'Active',
          createdAt: '2024-01-15',
        },
        {
          id: 'SUB-102',
          name: 'St. Xavier North Campus',
          code: 'SX-NC-02',
          city: 'Gandhinagar',
          status: 'Active',
          createdAt: '2024-03-20',
        },
        {
          id: 'SUB-103',
          name: 'St. Xavier Sports Academy',
          code: 'SX-SA-03',
          city: 'Sanand',
          status: 'Inactive',
          createdAt: '2024-05-10',
        },
      ],

      addSubInstitute: (item) =>
        set((state) => ({
          subInstitutes: [
            ...state.subInstitutes,
            {
              ...item,
              id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
              createdAt: new Date().toISOString().split('T')[0],
            },
          ],
        })),

      updateSubInstitute: (id, item) =>
        set((state) => ({
          subInstitutes: state.subInstitutes.map((s) => (s.id === id ? { ...s, ...item } : s)),
        })),

      deleteSubInstitute: (id) =>
        set((state) => ({
          subInstitutes: state.subInstitutes.filter((s) => s.id !== id),
        })),

      toggleSubInstituteStatus: (id) =>
        set((state) => ({
          subInstitutes: state.subInstitutes.map((s) =>
            s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
          ),
        })),

      userRoles: [
        { id: 'role-1', name: 'Student', isDefault: true, userCount: 3480, status: 'Active', description: 'Enrolled students' },
        { id: 'role-2', name: 'Faculty', isDefault: false, userCount: 184, status: 'Active', description: 'Teaching faculty & mentors' },
        { id: 'role-3', name: 'Principal', isDefault: false, userCount: 1, status: 'Active', description: 'Head of Institution' }

      ],

      addUserRole: (name, description, status = 'Active') => {
        const trimmed = name.trim()
        if (!trimmed) return
        set((state) => ({
          userRoles: [
            ...state.userRoles,
            {
              id: `role-${Date.now()}`,
              name: trimmed,
              isDefault: false,
              userCount: 0,
              status,
              description: description || 'Custom user role',
            },
          ],
        }))
      },

      updateUserRole: (id, updates) =>
        set((state) => ({
          userRoles: state.userRoles.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),

      toggleUserRoleStatus: (id) =>
        set((state) => ({
          userRoles: state.userRoles.map((r) =>
            r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r
          ),
        })),

      deleteUserRole: (id) => {
        const role = get().userRoles.find((r) => r.id === id)
        if (!role || role.isDefault) return false
        set((state) => ({
          userRoles: state.userRoles.filter((r) => r.id !== id),
        }))
        return true
      },

      roleCustomFields: INITIAL_CUSTOM_FIELDS,

      saveRoleCustomFields: (roleKey, fields) =>
        set((state) => ({
          roleCustomFields: {
            ...state.roleCustomFields,
            [roleKey.toLowerCase()]: fields,
          },
        })),

      roleFieldSelections: {},

      saveRoleFieldSelection: (roleKey, fieldIds) =>
        set((state) => ({
          roleFieldSelections: {
            ...state.roleFieldSelections,
            [roleKey.toLowerCase()]: fieldIds,
          },
        })),

      roleDefaultFields: INITIAL_DEFAULT_FIELDS,

      academicYears: [
        { id: 'ay-1', name: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', termsCount: 2, status: 'Active' },
        { id: 'ay-2', name: '2023-2024', startDate: '2023-04-01', endDate: '2024-03-31', termsCount: 2, status: 'Inactive' },
        { id: 'ay-3', name: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', termsCount: 2, status: 'Inactive' },
      ],

      addAcademicYear: (item) =>
        set((state) => ({ academicYears: [...state.academicYears, { ...item, id: `ay-${Date.now()}` }] })),

      updateAcademicYear: (id, item) =>
        set((state) => ({ academicYears: state.academicYears.map((a) => (a.id === id ? { ...a, ...item } : a)) })),

      deleteAcademicYear: (id) =>
        set((state) => ({ academicYears: state.academicYears.filter((a) => a.id !== id) })),

      departments: [
        { id: 'dept-1', name: 'Department of Science', code: 'SCI', headOfDept: 'Dr. Aris Vance', status: 'Active' },
        { id: 'dept-2', name: 'Department of Mathematics', code: 'MATH', headOfDept: 'Prof. Helen Ross', status: 'Active' },
        { id: 'dept-3', name: 'Department of Commerce & Economics', code: 'COMM', headOfDept: 'Rajesh Mehta', status: 'Active' },
        { id: 'dept-4', name: 'Department of Computer Science', code: 'CS', headOfDept: 'Priya Sharma', status: 'Active' },
        { id: 'dept-5', name: 'Department of Languages & Humanities', code: 'LANG', headOfDept: 'Anita Roy', status: 'Active' },
      ],

      addDepartment: (item) =>
        set((state) => ({ departments: [...state.departments, { ...item, id: `dept-${Date.now()}` }] })),

      updateDepartment: (id, item) =>
        set((state) => ({ departments: state.departments.map((d) => (d.id === id ? { ...d, ...item } : d)) })),

      deleteDepartment: (id) =>
        set((state) => ({ departments: state.departments.filter((d) => d.id !== id) })),

      standards: [
        { id: 'std-1', name: 'Grade 9', code: 'G09', stream: 'General', capacity: 180, status: 'Active' },
        { id: 'std-2', name: 'Grade 10', code: 'G10', stream: 'General (ICSE/CBSE)', capacity: 180, status: 'Active' },
        { id: 'std-3', name: 'Grade 11 - Science', code: 'G11-SCI', stream: 'Science Stream', capacity: 120, status: 'Active' },
        { id: 'std-4', name: 'Grade 11 - Commerce', code: 'G11-COM', stream: 'Commerce Stream', capacity: 100, status: 'Active' },
        { id: 'std-5', name: 'Grade 12 - Science', code: 'G12-SCI', stream: 'Science Stream', capacity: 120, status: 'Active' },
        { id: 'std-6', name: 'Grade 12 - Commerce', code: 'G12-COM', stream: 'Commerce Stream', capacity: 100, status: 'Active' },
      ],

      addStandard: (item) =>
        set((state) => ({ standards: [...state.standards, { ...item, id: `std-${Date.now()}` }] })),

      updateStandard: (id, item) =>
        set((state) => ({ standards: state.standards.map((s) => (s.id === id ? { ...s, ...item } : s)) })),

      deleteStandard: (id) =>
        set((state) => ({ standards: state.standards.filter((s) => s.id !== id) })),

      subjectGroupTypes: [
        { id: 'sgt-1', name: 'Core Compulsory', description: 'Mandatory foundational academic subjects', status: 'Active' },
        { id: 'sgt-2', name: 'Elective Major', description: 'Stream specialized major subject tracks', status: 'Active' },
        { id: 'sgt-3', name: 'Skill & Vocational', description: 'Practical and technical skill certifications', status: 'Active' },
        { id: 'sgt-4', name: 'Co-Curricular & Arts', description: 'Physical education, fine arts and performing arts', status: 'Active' },
      ],

      addSubjectGroupType: (item) =>
        set((state) => ({ subjectGroupTypes: [...state.subjectGroupTypes, { ...item, id: `sgt-${Date.now()}` }] })),

      updateSubjectGroupType: (id, item) =>
        set((state) => ({ subjectGroupTypes: state.subjectGroupTypes.map((t) => (t.id === id ? { ...t, ...item } : t)) })),

      deleteSubjectGroupType: (id) =>
        set((state) => ({ subjectGroupTypes: state.subjectGroupTypes.filter((t) => t.id !== id) })),

      classrooms: [
        { id: 'cr-101', roomNumber: 'Room 101', building: 'Academic Block A', floor: '1st Floor', capacity: 45, hasProjector: true, status: 'Active' },
        { id: 'cr-102', roomNumber: 'Room 102', building: 'Academic Block A', floor: '1st Floor', capacity: 45, hasProjector: true, status: 'Active' },
        { id: 'cr-201', roomNumber: 'Physics Lab 1', building: 'Science Complex', floor: '2nd Floor', capacity: 35, hasProjector: true, status: 'Active' },
        { id: 'cr-202', roomNumber: 'Chemistry Lab', building: 'Science Complex', floor: '2nd Floor', capacity: 35, hasProjector: true, status: 'Active' },
        { id: 'cr-301', roomNumber: 'Computer Lab Alpha', building: 'IT Tower', floor: '3rd Floor', capacity: 50, hasProjector: true, status: 'Active' },
      ],

      addClassroom: (item) =>
        set((state) => ({ classrooms: [...state.classrooms, { ...item, id: `cr-${Date.now()}` }] })),

      updateClassroom: (id, item) =>
        set((state) => ({ classrooms: state.classrooms.map((c) => (c.id === id ? { ...c, ...item } : c)) })),

      deleteClassroom: (id) =>
        set((state) => ({ classrooms: state.classrooms.filter((c) => c.id !== id) })),

      groupClassrooms: [
        { id: 'gcr-1', name: 'Main Campus Auditorium', roomsIncluded: 'Hall A + Stage Wings', totalCapacity: 650, purpose: 'Assemblies, Seminars & Convocations', status: 'Active' },
        { id: 'gcr-2', name: 'Examination Complex Beta', roomsIncluded: 'Rooms 201 + 202 + 203', totalCapacity: 160, purpose: 'Term Board Examinations', status: 'Active' },
        { id: 'gcr-3', name: 'AV Amphitheater', roomsIncluded: 'Digital Media Room', totalCapacity: 120, purpose: 'Guest Lectures & Workshops', status: 'Active' },
      ],

      addGroupClassroom: (item) =>
        set((state) => ({ groupClassrooms: [...state.groupClassrooms, { ...item, id: `gcr-${Date.now()}` }] })),

      updateGroupClassroom: (id, item) =>
        set((state) => ({ groupClassrooms: state.groupClassrooms.map((g) => (g.id === id ? { ...g, ...item } : g)) })),

      deleteGroupClassroom: (id) =>
        set((state) => ({ groupClassrooms: state.groupClassrooms.filter((g) => g.id !== id) })),

      masterSubjectGroups: [
        {
          id: 'msg-1',
          groupName: 'PCM with Computer Science',
          standardId: 'std-3',
          standardName: 'Grade 11 - Science',
          groupType: 'Core + Elective',
          subjectsList: 'Physics, Chemistry, Mathematics, English Core, Computer Science (Python)',
          status: 'Active',
        },
        {
          id: 'msg-2',
          groupName: 'PCB with Biotechnology',
          standardId: 'std-3',
          standardName: 'Grade 11 - Science',
          groupType: 'Core + Elective',
          subjectsList: 'Physics, Chemistry, Biology, English Core, Biotechnology',
          status: 'Active',
        },
        {
          id: 'msg-3',
          groupName: 'Commerce with Applied Mathematics',
          standardId: 'std-4',
          standardName: 'Grade 11 - Commerce',
          groupType: 'Core + Elective',
          subjectsList: 'Accountancy, Business Studies, Economics, English Core, Applied Mathematics',
          status: 'Active',
        },
      ],

      addMasterSubjectGroup: (item) =>
        set((state) => ({ masterSubjectGroups: [...state.masterSubjectGroups, { ...item, id: `msg-${Date.now()}` }] })),

      updateMasterSubjectGroup: (id, item) =>
        set((state) => ({ masterSubjectGroups: state.masterSubjectGroups.map((m) => (m.id === id ? { ...m, ...item } : m)) })),

      deleteMasterSubjectGroup: (id) =>
        set((state) => ({ masterSubjectGroups: state.masterSubjectGroups.filter((m) => m.id !== id) })),

      subjectLabs: [
        { id: 'lab-1', name: 'Physics Instrumentation Lab', code: 'LAB-PHY-01', department: 'Department of Science', labIncharge: 'Dr. Aris Vance', capacity: 35, status: 'Active' },
        { id: 'lab-2', name: 'Organic Chemistry Lab', code: 'LAB-CHM-02', department: 'Department of Science', labIncharge: 'Dr. Meera Sen', capacity: 30, status: 'Active' },
        { id: 'lab-3', name: 'Computer Systems Lab 1', code: 'LAB-CS-01', department: 'Department of Computer Science', labIncharge: 'Priya Sharma', capacity: 50, status: 'Active' },
        { id: 'lab-4', name: 'Language & Phonetics Lab', code: 'LAB-LANG-01', department: 'Department of Languages & Humanities', labIncharge: 'Anita Roy', capacity: 40, status: 'Active' },
      ],

      addSubjectLab: (item) =>
        set((state) => ({ subjectLabs: [...state.subjectLabs, { ...item, id: `lab-${Date.now()}` }] })),

      updateSubjectLab: (id, item) =>
        set((state) => ({ subjectLabs: state.subjectLabs.map((l) => (l.id === id ? { ...l, ...item } : l)) })),

      deleteSubjectLab: (id) =>
        set((state) => ({ subjectLabs: state.subjectLabs.filter((l) => l.id !== id) })),

      users: [
        {
          id: 'usr-s1',
          roleId: 'student',
          fullName: 'Aarav Patel',
          email: 'aarav.patel@example.com',
          phone: '+91 98250 11223',
          status: 'Active',
          createdAt: '2024-04-10',
          defaultData: {
            admissionNo: 'ADM-2024-001',
            rollNo: '101',
            fullName: 'Aarav Patel',
            gender: 'Male',
            dob: '2008-05-14',
            parentName: 'Ramesh Patel',
            email: 'aarav.patel@example.com',
            phone: '+91 98250 11223',
            standard: 'Grade 11 - Science',
            address: 'Sector 8, Gandhinagar',
          },
          customData: {
            'Blood Group': 'O+',
            'Transportation Required': 'Yes',
            'Aadhaar / National ID': '4821 9912 3001',
          },
        },
        {
          id: 'usr-s2',
          roleId: 'student',
          fullName: 'Ananya Sharma',
          email: 'ananya.sharma@example.com',
          phone: '+91 98250 44556',
          status: 'Active',
          createdAt: '2024-04-12',
          defaultData: {
            admissionNo: 'ADM-2024-002',
            rollNo: '102',
            fullName: 'Ananya Sharma',
            gender: 'Female',
            dob: '2008-09-22',
            parentName: 'Sunil Sharma',
            email: 'ananya.sharma@example.com',
            phone: '+91 98250 44556',
            standard: 'Grade 11 - Science',
            address: 'Bopal Crossroad, Ahmedabad',
          },
          customData: {
            'Blood Group': 'B+',
            'Transportation Required': 'No',
            'Aadhaar / National ID': '7712 4019 8812',
          },
        },
        {
          id: 'usr-f1',
          roleId: 'faculties',
          fullName: 'Dr. Aris Vance',
          email: 'aris.vance@stxavieracademy.edu.in',
          phone: '+91 94280 88210',
          status: 'Active',
          createdAt: '2022-06-01',
          defaultData: {
            employeeCode: 'FAC-SCI-01',
            fullName: 'Dr. Aris Vance',
            designation: 'Senior HOD & Physics Lecturer',
            department: 'Department of Science',
            qualification: 'Ph.D. in Applied Physics',
            email: 'aris.vance@stxavieracademy.edu.in',
            phone: '+91 94280 88210',
            joiningDate: '2022-06-01',
          },
          customData: {
            'Specialization Area': 'Quantum & Astrophysics',
            'Employment Type': 'Full Time',
            'Staff Identification PAN': 'ABCDE1234F',
          },
        },
        {
          id: 'usr-a1',
          roleId: 'institute admin',
          fullName: 'Sarah Jenkins',
          email: 'sarah.jenkins@stxavieracademy.edu.in',
          phone: '+91 99090 33441',
          status: 'Active',
          createdAt: '2021-01-10',
          defaultData: {
            adminId: 'ADM-SYS-001',
            fullName: 'Sarah Jenkins',
            email: 'sarah.jenkins@stxavieracademy.edu.in',
            phone: '+91 99090 33441',
            roleLevel: 'Chief Institutional Administrator',
            department: 'Central Administration Directorate',
          },
          customData: {
            'Security Clearance Tier': 'Tier 1 (Master Admin)',
          },
        },
      ],

      addUserRecord: (record) => {
        const roleKey = record.roleId.toLowerCase()
        const customDefs = get().roleCustomFields[roleKey] || []

        // Enforce unique constraints across existing users with this role
        for (const def of customDefs) {
          if (def.isUnique) {
            const val = record.customData[def.title]
            if (val && String(val).trim()) {
              const duplicate = get().users.find(
                (u) =>
                  u.roleId.toLowerCase() === roleKey &&
                  String(u.customData[def.title] || '').trim().toLowerCase() === String(val).trim().toLowerCase()
              )
              if (duplicate) {
                return {
                  success: false,
                  error: `Field "${def.title}" must be unique! Value "${val}" is already registered by ${duplicate.fullName}.`,
                }
              }
            }
          }
        }

        const newId = `usr-${Date.now().toString(36)}`
        set((state) => ({
          users: [
            {
              ...record,
              id: newId,
              createdAt: new Date().toISOString().split('T')[0],
            },
            ...state.users,
          ],
        }))
        return { success: true }
      },

      updateUserRecord: (id, record) => {
        const existing = get().users.find((u) => u.id === id)
        if (!existing) return { success: false, error: 'User record not found.' }

        const roleKey = (record.roleId || existing.roleId).toLowerCase()
        const customDefs = get().roleCustomFields[roleKey] || []

        // Enforce unique check excluding self
        for (const def of customDefs) {
          if (def.isUnique && record.customData && record.customData[def.title] !== undefined) {
            const val = record.customData[def.title]
            if (val && String(val).trim()) {
              const duplicate = get().users.find(
                (u) =>
                  u.id !== id &&
                  u.roleId.toLowerCase() === roleKey &&
                  String(u.customData[def.title] || '').trim().toLowerCase() === String(val).trim().toLowerCase()
              )
              if (duplicate) {
                return {
                  success: false,
                  error: `Field "${def.title}" must be unique! Value "${val}" is already taken by ${duplicate.fullName}.`,
                }
              }
            }
          }
        }

        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...record } : u)),
        }))
        return { success: true }
      },

      deleteUserRecord: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }))
        setTimeout(() => {
          get().removeToast(id)
        }, 4000)
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'institute-management-storage-v2',
      partialize: (state) => ({
        instituteDetails: state.instituteDetails,
        subInstitutes: state.subInstitutes,
        userRoles: state.userRoles,
        roleCustomFields: state.roleCustomFields,
        roleFieldSelections: state.roleFieldSelections,
        academicYears: state.academicYears,
        departments: state.departments,
        standards: state.standards,
        subjectGroupTypes: state.subjectGroupTypes,
        classrooms: state.classrooms,
        groupClassrooms: state.groupClassrooms,
        masterSubjectGroups: state.masterSubjectGroups,
        subjectLabs: state.subjectLabs,
        users: state.users,
      }),
    }
  )
)
