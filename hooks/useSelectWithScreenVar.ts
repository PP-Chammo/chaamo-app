import { router } from 'expo-router';

import { selectWithScreenStore } from '@/stores/selectWithScreenStore';
import { createReactiveVar } from '@/utils/reactive';

const { setSelectedCountry, setSelectedState, ...initialState } =
  selectWithScreenStore;
const selectWithScreenVar =
  createReactiveVar<typeof initialState>(initialState);

type State = typeof initialState;
type SetVarArg = { selectedCountry?: string; selectedState?: string };

function useSelectWithScreenVar(): [State, (value: SetVarArg) => void] {
  const state = selectWithScreenVar.useVar();
  const setVar = (value: SetVarArg) => {
    selectWithScreenVar.set({ ...state, ...value });
    router.back();
  };
  return [state, setVar];
}

export { useSelectWithScreenVar };
