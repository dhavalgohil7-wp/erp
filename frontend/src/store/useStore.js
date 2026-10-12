import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
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

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  activePath: 'overview-and-analytics',
  activeSection: '',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActivePath: (path) => set({ activePath: path }),
  setActiveSection: (section) => set({ activeSection: section }),
}))
