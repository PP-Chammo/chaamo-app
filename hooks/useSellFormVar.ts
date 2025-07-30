import { SellFormStore, sellFormStore } from '@/stores/sellFormStore';
import { createReactiveVar } from '@/utils/reactive';

export const initialSellFormState = JSON.parse(
  JSON.stringify({
    ...sellFormStore,
  }),
);

const sellFormVar = createReactiveVar<SellFormStore>(sellFormStore);

function useSellFormVar(): [
  SellFormStore,
  (value: Partial<SellFormStore>) => void,
] {
  const sellFormState = sellFormVar.useVar();
  const setSellFormVar = (value: Partial<SellFormStore>) => {
    sellFormVar.set({ ...sellFormState, ...value });
  };
  return [sellFormState, setSellFormVar];
}

export { useSellFormVar };
