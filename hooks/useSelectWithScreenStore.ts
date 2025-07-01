import { router } from 'expo-router';
import { create } from 'zustand';

export interface SelectWithScreenStore {
  selectedCountry: string;
  selectedState: string;
  setSelectedCountry: (country: string) => void;
  setSelectedState: (state: string) => void;
}

export const useSelectWithScreenStore = create<SelectWithScreenStore>(
  (set) => ({
    selectedCountry: '',
    selectedState: '',
    setSelectedCountry: (country: string) => {
      set({ selectedCountry: country });
      router.replace('/(setup-profile)/address');
    },
    setSelectedState: (state: string) => {
      set({ selectedState: state });
      router.replace('/(setup-profile)/address');
    },
  }),
);
