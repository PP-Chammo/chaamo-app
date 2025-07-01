export interface SelectWithScreenStore {
  selectedCountry: string;
  selectedState: string;
  setSelectedCountry: (country: string) => void;
  setSelectedState: (state: string) => void;
}

export const selectWithScreenStore: SelectWithScreenStore = {
  selectedCountry: '',
  selectedState: '',
  setSelectedCountry: () => {},
  setSelectedState: () => {},
};
