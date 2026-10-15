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
// Route map: sidebar path → page component
const routeMap: Record<string, React.ReactNode> = {
  'overview-and-analytics': <Dashboard />,
  'institute-setup': <InstitutePage />,
  'academic-year': <AcademicYearPage />,
  'user-roles': <UsersPage />,
  'admission-and-inquiry': <StudentsPage />,
  'hr-and-payroll': <StaffPage />,
  'class-subject': <ClassSubjectPage />,
  'system-settings': <SettingsPage />,

  // Placeholder pages for modules not yet built
  'calendar-and-events': <PlaceholderPage title="Calendar & Events" icon="calendar_month" breadcrumb={['Dashboard', 'Calendar & Events']} />,
  'exam-planner': <PlaceholderPage title="Exam Planner" icon="quiz" breadcrumb={['Dashboard', 'Exam Planner']} />,
  'analysis-and-reports': <PlaceholderPage title="Analysis & Reports" icon="analytics" breadcrumb={['Dashboard', 'Analysis & Reports']} />,
  'academic-planner': <PlaceholderPage title="Academic Planner" icon="assignment" breadcrumb={['Dashboard', 'Academic Planner']} />,
  'timetable-management': <PlaceholderPage title="Timetable" icon="schedule" breadcrumb={['Dashboard', 'Timetable']} />,
  'student-attendance': <PlaceholderPage title="Student Attendance" icon="how_to_reg" breadcrumb={['Dashboard', 'Student Attendance']} />,
  'homework-and-classwork': <PlaceholderPage title="Homework & Classwork" icon="edit_note" breadcrumb={['Dashboard', 'Homework & Classwork']} />,
  'lesson-planning': <PlaceholderPage title="Lesson Planning" icon="menu_book" breadcrumb={['Dashboard', 'Lesson Planning']} />,
  'material-upload': <PlaceholderPage title="Material Upload" icon="cloud_upload" breadcrumb={['Dashboard', 'Material Upload']} />,
  'certificate-generator': <PlaceholderPage title="Certificate Generator" icon="verified" breadcrumb={['Dashboard', 'Certificate Generator']} />,
  'sms-and-system-logs': <PlaceholderPage title="SMS & System Logs" icon="sms" breadcrumb={['Dashboard', 'SMS & System Logs']} />,
  'birthday-hub': <PlaceholderPage title="Birthday Hub" icon="cake" breadcrumb={['Dashboard', 'Birthday Hub']} />,
  'fee-management': <PlaceholderPage title="Fee Management" icon="payments" breadcrumb={['Dashboard', 'Fee Management']} />,
  'biometric-attendance': <PlaceholderPage title="Biometric Attendance" icon="fingerprint" breadcrumb={['Dashboard', 'Biometric Attendance']} />,
  'transportation-fleet': <PlaceholderPage title="Transportation" icon="directions_bus" breadcrumb={['Dashboard', 'Transportation']} />,
  'library-hub': <PlaceholderPage title="Library" icon="local_library" breadcrumb={['Dashboard', 'Library']} />,
  'hostel-management': <PlaceholderPage title="Hostel" icon="hotel" breadcrumb={['Dashboard', 'Hostel']} />,
  'student-wallet': <PlaceholderPage title="Student Wallet" icon="account_balance_wallet" breadcrumb={['Dashboard', 'Student Wallet']} />,
  'canteen-pos': <PlaceholderPage title="Canteen" icon="restaurant" breadcrumb={['Dashboard', 'Canteen']} />,
  'inventory-and-assets': <PlaceholderPage title="Inventory" icon="inventory_2" breadcrumb={['Dashboard', 'Inventory']} />,
  'gate-pass-management': <PlaceholderPage title="Gate Pass" icon="badge" breadcrumb={['Dashboard', 'Gate Pass']} />,
  'grievance-and-complaints': <PlaceholderPage title="Grievance & Complaints" icon="support_agent" breadcrumb={['Dashboard', 'Grievance & Complaints']} />,
  'expense-management': <PlaceholderPage title="Expense Management" icon="receipt_long" breadcrumb={['Dashboard', 'Expense Management']} />,
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
