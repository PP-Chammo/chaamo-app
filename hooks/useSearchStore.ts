import { create } from 'zustand';

import { SearchStore, searchStore } from '@/stores/searchStore';

interface SearchState extends SearchStore {
  setSearch: (key: keyof SearchStore, value: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  ...searchStore,
  setSearch: (key: keyof SearchStore, newValue: string) => {
    set({ [key]: newValue });
  },
}));
