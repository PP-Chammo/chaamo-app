import { set } from 'lodash';

import { UserStore, userStore } from '@/stores/userStore';
import { createReactiveVar } from '@/utils/reactive';

const profileVar = createReactiveVar<UserStore>(userStore);

// 👇 Custom type untuk key path dan nilainya
type DeepPartialObject<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartialObject<T[K]> : T[K];
};

type PathValue = {
  [K: string]: unknown;
};

function useUserVar(): [
  UserStore,
  (value: DeepPartialObject<UserStore> | PathValue) => void,
] {
  const userState = profileVar.useVar();

  const setUserVar = (value: DeepPartialObject<UserStore> | PathValue) => {
    const updated: UserStore = { ...userState };

    Object.entries(value).forEach(([path, val]) => {
      set(updated, path, val);
    });

    profileVar.set(updated);
  };

  return [userState, setUserVar];
}

export { useUserVar };
