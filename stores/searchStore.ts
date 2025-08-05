export interface SearchStore {
  query: string;
  category: string;
  location: string;
  priceRange: string;
  condition: string;
  adProperties: string;
}

export const searchStore: SearchStore = {
  query: '',
  category: '',
  location: '',
  priceRange: '',
  condition: '',
  adProperties: '',
};
