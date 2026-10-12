import Sidebar from './Sidebar'
import Header from './Header'
import { useUIStore } from '../../store/useStore'

export default function AdminLayout({ children }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-h-screen content-slide-transition ${
          sidebarOpen ? 'lg:pl-72' : 'pl-0'
        }`}
      >
        <Header />
        <main className="relative pt-16 bg-surface min-h-screen flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
