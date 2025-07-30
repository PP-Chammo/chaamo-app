import { SearchStore, searchStore } from '@/stores/searchStore';
import { createReactiveVar } from '@/utils/reactive';

const searchVar = createReactiveVar<SearchStore>(searchStore);

function useSearchVar(): [SearchStore, (value: Partial<SearchStore>) => void] {
  const searchState = searchVar.useVar();
  const setSearchVar = (value: Partial<SearchStore>) => {
    searchVar.set({ ...searchState, ...value });
  };
  return [searchState, setSearchVar];
}

export { useSearchVar };
