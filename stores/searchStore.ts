export interface SearchStore {
  query: string;
  categoryId?: number;
  category: string;
  location: string;
  priceRange: string;
  condition: string;
  adProperties: string;
}

export const searchStore: SearchStore = {
  query: '',
  categoryId: undefined,
  category: '',
  location: '',
  priceRange: '',
  condition: '',
  adProperties: '',
};
