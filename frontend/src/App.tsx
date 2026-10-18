import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import { useUIStore } from './store/useStore'

// Pages
import Dashboard from './pages/Dashboard'
import InstitutePage from './pages/InstitutePage'
import AcademicYearPage from './pages/AcademicYearPage'
import UsersPage from './pages/UsersPage'
import StudentsPage from './pages/StudentsPage'
import StaffPage from './pages/StaffPage'
import ClassSubjectPage from './pages/ClassSubjectPage'
import SettingsPage from './pages/SettingsPage'
import PlaceholderPage from './pages/PlaceholderPage'
import Loader from './components/loader/loader'

// Institute Management Submodules
import InstituteDetailsPage from './pages/submodules/InstituteDetailsPage'
import SubInstitutesPage from './pages/submodules/SubInstitutesPage'
import MasterSetupPage from './pages/submodules/MasterSetupPage'
import SetupSubmodulePage from './pages/submodules/SetupSubmodulePage'
import UserRoleSubmodulePage from './pages/submodules/UserRoleSubmodulePage'

// Route map: sidebar/tile path → page component
const routeMap: Record<string, React.ReactNode> = {
  // Main Dashboard
  'overview-and-analytics': <Dashboard />,

  // Core Functional Pages
  'institute-management': <InstitutePage />,
  'institute-setup': <InstitutePage />,

  // 14 Institute Management Submodule Pages (Direct URL routing)
  'institute-details': <InstituteDetailsPage />,
  'my-sub-institute': <SubInstitutesPage />,
  'sub-institutes': <SubInstitutesPage />,
  'master-setup': <MasterSetupPage />,
  'years-management': <SetupSubmodulePage tab="years" title="Years Management" stepNumber={4} subtitle="Manage academic year sessions, terms, and date ranges." />,
  'academic-year': <SetupSubmodulePage tab="years" title="Years Management" stepNumber={4} subtitle="Manage academic year sessions, terms, and date ranges." />,
  'academic-years': <SetupSubmodulePage tab="years" title="Years Management" stepNumber={4} subtitle="Manage academic year sessions, terms, and date ranges." />,
  'department-management': <SetupSubmodulePage tab="departments" title="Department Management" stepNumber={5} subtitle="Configure faculty departments, codes, and heads of department." />,
  'standards': <SetupSubmodulePage tab="standards" title="Standards" stepNumber={6} subtitle="Define academic grades, standards, streams, and student capacities." />,
  'subject-group-type': <SetupSubmodulePage tab="subject-types" title="Subject Group Type" stepNumber={7} subtitle="Configure subject group classifications (Core, Elective, Vocational)." />,
  'classrooms': <SetupSubmodulePage tab="classrooms" title="Classrooms" stepNumber={8} subtitle="Manage room allocations, floor locations, and AV equipment." />,
  'classroom': <SetupSubmodulePage tab="classrooms" title="Classrooms" stepNumber={8} subtitle="Manage room allocations, floor locations, and AV equipment." />,
  'group-classrooms': <SetupSubmodulePage tab="group-classrooms" title="Group Classrooms" stepNumber={9} subtitle="Configure combined lecture halls, auditoriums, and examination centers." />,
  'group-class-room': <SetupSubmodulePage tab="group-classrooms" title="Group Classrooms" stepNumber={9} subtitle="Configure combined lecture halls, auditoriums, and examination centers." />,
  'master-subject-group': <SetupSubmodulePage tab="master-subject-groups" title="Master Subject Group" stepNumber={10} subtitle="Group subjects by standard and stream curriculum." />,
  'subject-labs': <SetupSubmodulePage tab="subject-labs" title="Subject Labs" stepNumber={11} subtitle="Manage specialized science, robotics, and computing laboratories." />,
  'institute-admin': <UserRoleSubmodulePage role="institute admin" title="Institute Admin" stepNumber={12} subtitle="Administrator records, contact info, and dynamic role custom fields." />,
  'students': <UserRoleSubmodulePage role="student" title="Students" stepNumber={13} subtitle="Student directory with dynamic fields defined in Master Setup." />,
  'faculties': <UserRoleSubmodulePage role="faculties" title="Faculties" stepNumber={14} subtitle="Faculty directory with designations, departments, and custom attributes." />,

  'user-roles': <MasterSetupPage />,
  'admission-and-inquiry': <StudentsPage />,
  'inquiry-admission': <StudentsPage />,
  'hr-and-payroll': <StaffPage />,
  'hr-management': <StaffPage />,
  'class-subject': <ClassSubjectPage />,
  'system-settings': <SettingsPage />,
  'settings': <SettingsPage />,

  // System Setup Modules (Division 1)
  'calendar-and-analysis': <PlaceholderPage title="Calendar & Analysis" icon="fa-solid fa-calendar-check" breadcrumb={['System Setup', 'Calendar & Analysis']} description="Academic calendar, event schedules, institutional milestones, and activity tracking." />,
  'calendar-and-events': <PlaceholderPage title="Calendar & Analysis" icon="fa-solid fa-calendar-check" breadcrumb={['System Setup', 'Calendar & Analysis']} description="Academic calendar, event schedules, institutional milestones, and activity tracking." />,
  'exam-planner-and-scheduler': <PlaceholderPage title="Exam Planner & Scheduler" icon="fa-solid fa-calendar-plus" breadcrumb={['System Setup', 'Exam Planner & Scheduler']} description="Exam term planning, date sheet scheduling, hall allocations and seating arrangements." />,
  'exam-planner': <PlaceholderPage title="Exam Planner & Scheduler" icon="fa-solid fa-calendar-plus" breadcrumb={['System Setup', 'Exam Planner & Scheduler']} description="Exam term planning, date sheet scheduling, hall allocations and seating arrangements." />,
  'analysis-and-reports': <PlaceholderPage title="Analysis & Reports" icon="fa-solid fa-chart-pie" breadcrumb={['System Setup', 'Analysis & Reports']} description="Comprehensive institutional reports, academic growth tracking, analytics and metrics." />,
  'material-upload': <PlaceholderPage title="Material Upload" icon="fa-solid fa-cloud-arrow-up" breadcrumb={['System Setup', 'Material Upload']} description="Upload digital syllabus, e-books, study materials and resources for faculties and students." />,
  'material-management': <PlaceholderPage title="Material Management" icon="fa-solid fa-file-lines" breadcrumb={['System Setup', 'Material Management']} description="Manage and categorize study materials, e-learning content, and digital repository." />,
  'system-logs': <PlaceholderPage title="System Logs" icon="fa-solid fa-server" breadcrumb={['System Setup', 'System Logs']} description="Monitor server activities, security audits, login histories, and transaction logs." />,
  'system-log': <PlaceholderPage title="System Logs" icon="fa-solid fa-server" breadcrumb={['System Setup', 'System Logs']} description="Monitor server activities, security audits, login histories, and transaction logs." />,
  'sms-and-system-logs': <PlaceholderPage title="System Logs" icon="fa-solid fa-server" breadcrumb={['System Setup', 'System Logs']} description="Monitor server activities, security audits, login histories, and transaction logs." />,
  'birthdays': <PlaceholderPage title="Birthday" icon="fa-solid fa-cake-candles" breadcrumb={['System Setup', 'Birthday']} description="Automate birthday wishes, view campus celebration calendar, and manage greetings." />,
  'birthday-hub': <PlaceholderPage title="Birthday" icon="fa-solid fa-cake-candles" breadcrumb={['System Setup', 'Birthday']} description="Automate birthday wishes, view campus celebration calendar, and manage greetings." />,
  'certificate-generation': <PlaceholderPage title="Certificate Generation" icon="fa-solid fa-print" breadcrumb={['System Setup', 'Certificate Generation']} description="Design, generate and issue digital academic certificates, bonafide certificates, and diplomas." />,
  'certificate-generator': <PlaceholderPage title="Certificate Generation" icon="fa-solid fa-print" breadcrumb={['System Setup', 'Certificate Generation']} description="Design, generate and issue digital academic certificates, bonafide certificates, and diplomas." />,
  'sms-log': <PlaceholderPage title="Sms Log" icon="fa-solid fa-inbox" breadcrumb={['System Setup', 'Sms Log']} description="Review SMS gateway logs, delivery confirmations, notifications history and SMS balance." />,
  'student-attendance': <PlaceholderPage title="Student Attendance" icon="fa-solid fa-list-check" breadcrumb={['System Setup', 'Student Attendance']} description="Track daily attendance rosters, section roll-calls, leaves and parent absentee alerts." />,
  'academic-planner': <PlaceholderPage title="Academic Planner" icon="fa-solid fa-calendar-week" breadcrumb={['System Setup', 'Academic Planner']} description="Curriculum milestone planning, term syllabi targets, and teaching schedule roadmap." />,
  'dynamic-reports': <PlaceholderPage title="Dynamic Reports" icon="fa-solid fa-book-bookmark" breadcrumb={['System Setup', 'Dynamic Reports']} description="Generate custom ad-hoc institutional reports, export data in Excel/PDF, and analyze metrics." />,
  'timetable-management': <PlaceholderPage title="Timetable Management" icon="fa-solid fa-table-cells" breadcrumb={['System Setup', 'Timetable Management']} description="Master timetable schedule, faculty substitutions, classroom allocations, and period grids." />,
  'homework': <PlaceholderPage title="Homework" icon="fa-solid fa-book-open" breadcrumb={['System Setup', 'Homework']} description="Assign daily homework, track submissions, evaluate assignments and give teacher feedback." />,
  'homework-and-classwork': <PlaceholderPage title="Homework" icon="fa-solid fa-book-open" breadcrumb={['System Setup', 'Homework']} description="Assign daily homework, track submissions, evaluate assignments and give teacher feedback." />,
  'classwork': <PlaceholderPage title="Classwork" icon="fa-solid fa-book-open-reader" breadcrumb={['System Setup', 'Classwork']} description="Daily classwork logs, classroom topics covered, practice sheets, and lecture notes." />,
  'lesson-planning': <PlaceholderPage title="Lesson Planning" icon="fa-solid fa-star" breadcrumb={['System Setup', 'Lesson Planning']} description="Create lesson plans, learning outcomes, chapter objectives, and teaching methodologies." />,
  'user-remarks': <PlaceholderPage title="User Remarks" icon="fa-solid fa-comment-dots" breadcrumb={['System Setup', 'User Remarks']} description="Log behavioral remarks, academic observations, and parent-teacher communications." />,

  // All in one ERP Modules (Division 2)
  'library': <PlaceholderPage title="Library" icon="fa-solid fa-book" breadcrumb={['All in one ERP Modules', 'Library']} description="Book catalog, barcode scanning, issue/return circulation, fine calculations, and book reservations." />,
  'library-hub': <PlaceholderPage title="Library" icon="fa-solid fa-book" breadcrumb={['All in one ERP Modules', 'Library']} description="Book catalog, barcode scanning, issue/return circulation, fine calculations, and book reservations." />,
  'transportation': <PlaceholderPage title="Transportation" icon="fa-solid fa-bus" breadcrumb={['All in one ERP Modules', 'Transportation']} description="Fleet tracking, bus routes, driver assignments, fuel management and student bus passes." />,
  'transportation-fleet': <PlaceholderPage title="Transportation" icon="fa-solid fa-bus" breadcrumb={['All in one ERP Modules', 'Transportation']} description="Fleet tracking, bus routes, driver assignments, fuel management and student bus passes." />,
  'fee-management': <PlaceholderPage title="Fee Management" icon="fa-solid fa-money-bill-wave" breadcrumb={['All in one ERP Modules', 'Fee Management']} description="Fee structure, invoice collection, online payments, concession approval, and overdue fines." />,
  'attendance-machine': <PlaceholderPage title="Attendance Machine" icon="fa-solid fa-id-badge" breadcrumb={['All in one ERP Modules', 'Attendance Machine']} description="Biometric device integration, RFID card punch records, real-time sync and machine health." />,
  'biometric-attendance': <PlaceholderPage title="Attendance Machine" icon="fa-solid fa-id-badge" breadcrumb={['All in one ERP Modules', 'Attendance Machine']} description="Biometric device integration, RFID card punch records, real-time sync and machine health." />,
  'hostel': <PlaceholderPage title="Hostel" icon="fa-solid fa-bed" breadcrumb={['All in one ERP Modules', 'Hostel']} description="Hostel rooms, bed allocation, warden rosters, mess billing, and resident student attendance." />,
  'hostel-management': <PlaceholderPage title="Hostel" icon="fa-solid fa-bed" breadcrumb={['All in one ERP Modules', 'Hostel']} description="Hostel rooms, bed allocation, warden rosters, mess billing, and resident student attendance." />,
  'website-builder': <PlaceholderPage title="Website Builder" icon="fa-solid fa-globe" breadcrumb={['All in one ERP Modules', 'Website Builder']} description="Institutional public CMS, landing page builder, announcements widget, and school portal editor." />,
  'target-management': <PlaceholderPage title="Target Management" icon="fa-solid fa-box-archive" breadcrumb={['All in one ERP Modules', 'Target Management']} description="Departmental KPI targets, admission quotas, academic performance milestones, and goal tracking." />,
  'result-module': <PlaceholderPage title="Result Module" icon="fa-solid fa-star" breadcrumb={['All in one ERP Modules', 'Result Module']} description="Grade book, report cards calculation, percentile rankings, exam grading, and transcript publishing." />,
  'inventory-management': <PlaceholderPage title="Inventory Management" icon="fa-solid fa-boxes-stacked" breadcrumb={['All in one ERP Modules', 'Inventory Management']} description="Stock inventory, asset allocation, procurement requests, supplier orders, and depreciation." />,
  'inventory-and-assets': <PlaceholderPage title="Inventory Management" icon="fa-solid fa-boxes-stacked" breadcrumb={['All in one ERP Modules', 'Inventory Management']} description="Stock inventory, asset allocation, procurement requests, supplier orders, and depreciation." />,
  'wallet': <PlaceholderPage title="Wallet" icon="fa-solid fa-wallet" breadcrumb={['All in one ERP Modules', 'Wallet']} description="Campus digital smart card wallet, canteen cashless payments, top-up history, and refund balance." />,
  'student-wallet': <PlaceholderPage title="Wallet" icon="fa-solid fa-wallet" breadcrumb={['All in one ERP Modules', 'Wallet']} description="Campus digital smart card wallet, canteen cashless payments, top-up history, and refund balance." />,
  'complaint-grievance': <PlaceholderPage title="Complaint / Grievance" icon="fa-solid fa-comment-dots" breadcrumb={['All in one ERP Modules', 'Complaint / Grievance']} description="Student & staff ticket desk, dispute resolution, anonymous complaints box, and escalation status." />,
  'grievance-and-complaints': <PlaceholderPage title="Complaint / Grievance" icon="fa-solid fa-comment-dots" breadcrumb={['All in one ERP Modules', 'Complaint / Grievance']} description="Student & staff ticket desk, dispute resolution, anonymous complaints box, and escalation status." />,
  'canteen-management': <PlaceholderPage title="Canteen Management" icon="fa-solid fa-utensils" breadcrumb={['All in one ERP Modules', 'Canteen Management']} description="POS terminal, daily cafeteria menu, nutrition tracking, student meal plans and food item pricing." />,
  'canteen-pos': <PlaceholderPage title="Canteen Management" icon="fa-solid fa-utensils" breadcrumb={['All in one ERP Modules', 'Canteen Management']} description="POS terminal, daily cafeteria menu, nutrition tracking, student meal plans and food item pricing." />,
  'gate-pass': <PlaceholderPage title="Gate Pass" icon="fa-solid fa-id-card" breadcrumb={['All in one ERP Modules', 'Gate Pass']} description="Visitor pass issuance, student early exit permits, staff outbound approvals, and security barcode check." />,
  'gate-pass-management': <PlaceholderPage title="Gate Pass" icon="fa-solid fa-id-card" breadcrumb={['All in one ERP Modules', 'Gate Pass']} description="Visitor pass issuance, student early exit permits, staff outbound approvals, and security barcode check." />,
  'expense-management': <PlaceholderPage title="Expense Management" icon="fa-solid fa-receipt" breadcrumb={['All in one ERP Modules', 'Expense Management']} description="Voucher disbursement, petty cash management, vendor invoices, operational expense approval." />,
  'finance-management': <PlaceholderPage title="Finance Management" icon="fa-solid fa-percent" breadcrumb={['All in one ERP Modules', 'Finance Management']} description="Balance sheets, general ledger, profit/loss accounts, audit trails, and tax compliance." />,
  'gallery': <PlaceholderPage title="Gallery" icon="fa-solid fa-image" breadcrumb={['All in one ERP Modules', 'Gallery']} description="Institutional photo albums, annual sports event gallery, press media, and video archives." />,
  'voice-call': <PlaceholderPage title="Voice Call" icon="fa-solid fa-phone" breadcrumb={['All in one ERP Modules', 'Voice Call']} description="Automated IVR call broadcasts, emergency voice alerts to parents, and PBX telephony log." />,
  'pocket-study': <PlaceholderPage title="Pocket Study" icon="fa-solid fa-headphones" breadcrumb={['All in one ERP Modules', 'Pocket Study']} description="Audio lectures, digital podcasts, quick revision soundbites, and mobile micro-learning modules." />,
  'exit-staff': <PlaceholderPage title="Exit Staff" icon="fa-solid fa-user-xmark" breadcrumb={['All in one ERP Modules', 'Exit Staff']} description="Staff resignation workflows, clearance certificates, exit interviews, and experience letters." />,
}

export default function App() {
  const location = useLocation()
  const { activePath, setActivePath } = useUIStore()

  // Clean pathname into route key: e.g. "/fee-management" -> "fee-management", "/" -> "overview-and-analytics"
  const rawPath = location.pathname.replace(/^\/+|\/+$/g, '')
  const currentPath = !rawPath || rawPath === 'overview-and-analytics' ? 'overview-and-analytics' : rawPath

  // Synchronize URL navigation (browser back / forward buttons) with activePath in Zustand
  useEffect(() => {
    if (currentPath !== activePath) {
      setActivePath(currentPath)
    }
  }, [currentPath, activePath, setActivePath])

  // Render page directly based on URL path
  const page = routeMap[currentPath] ?? <Dashboard />

  return (
    <Loader>
      <AdminLayout>
        {page}
      </AdminLayout>
    </Loader>
  )
}
