import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: Record<string, unknown> | null
  token: string | null
  isAuthenticated: boolean
  login: (user: Record<string, unknown>, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)

interface UIState {
  sidebarOpen: boolean
  activePath: string
  activeSection: string
  toggleSidebar: () => void
  setActivePath: (path: string) => void
  setActiveSection: (section: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activePath: 'overview-and-analytics',
  activeSection: '',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActivePath: (path) => set({ activePath: path }),
  setActiveSection: (section) => set({ activeSection: section }),
}))
