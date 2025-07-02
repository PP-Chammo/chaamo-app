import {
  fnGetStorage,
  fnSetStorage,
  fnRemoveStorage,
  fnAppendStorage,
} from '@/utils/storage';

export function useStorage() {
  return {
    getStorage: fnGetStorage,
    setStorage: fnSetStorage,
    appendStorage: fnAppendStorage,
    removeStorage: fnRemoveStorage,
  };
}
