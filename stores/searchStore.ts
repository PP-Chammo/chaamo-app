export interface SearchStore {
  query: string;
  location: string;
  priceRange: string;
  condition: string;
  adProperties: string;
}

export const searchStore: SearchStore = {
  query: '',
  location: '',
  priceRange: '',
  condition: '',
  adProperties: '',
};
