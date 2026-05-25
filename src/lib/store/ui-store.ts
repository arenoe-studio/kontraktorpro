import { create } from "zustand";

interface UiStore {
  sidebarOpen: boolean;
  activeFilters: Record<string, string>;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActiveFilter: (key: string, value: string) => void;
  clearActiveFilters: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: true,
  activeFilters: {},
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value },
    })),
  clearActiveFilters: () => set({ activeFilters: {} }),
}));
