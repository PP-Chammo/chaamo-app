import { router } from 'expo-router';
import { create } from 'zustand';

import {
  selectWithScreenStore,
  SelectWithScreenStore,
} from '@/stores/selectWithScreenStore';

export interface SelectWithScreenState extends SelectWithScreenStore {
  setSelectedCountry: (country: string) => void;
  setSelectedState: (state: string) => void;
}

export const useSelectWithScreenStore = create<SelectWithScreenState>(
  (set) => ({
    ...selectWithScreenStore,
    setSelectedCountry: (country: string) => {
      set({ selectedCountry: country });
      router.back();
    },
    setSelectedState: (state: string) => {
      set({ selectedState: state });
      router.back();
    },
  }),
);
