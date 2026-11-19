import { create } from 'zustand'

export type CursorState = 'default' | 'ring' | 'magnify' | 'drag' | 'open'
export type Theme = 'dark' | 'light'

interface AppState {
  section: number
  setSection: (s: number) => void
  theme: Theme
  toggleTheme: () => void
  cursorState: CursorState
  setCursorState: (s: CursorState) => void
  preloaderDone: boolean
  setPreloaderDone: () => void
  activeProject: string | null
  setActiveProject: (id: string | null) => void
  bujjiMode: boolean
  setBujjiMode: (v: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  section: 0,
  setSection: (section) => set({ section }),
  theme: 'dark',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  cursorState: 'default',
  setCursorState: (cursorState) => set({ cursorState }),
  preloaderDone: false,
  setPreloaderDone: () => set({ preloaderDone: true }),
  activeProject: null,
  setActiveProject: (activeProject) => set({ activeProject }),
  bujjiMode: false,
  setBujjiMode: (bujjiMode) => set({ bujjiMode }),
}))
