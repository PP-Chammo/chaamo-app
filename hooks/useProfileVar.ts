import { ProfileStore, profileStore } from '@/stores/profileStore';
import { createReactiveVar } from '@/utils/reactive';

const profileVar = createReactiveVar<ProfileStore>(profileStore);

function useProfileVar(): [
  ProfileStore,
  (value: Partial<ProfileStore>) => void,
] {
  const profileState = profileVar.useVar();
  const setProfileVar = (value: Partial<ProfileStore>) => {
    profileVar.set({ ...profileState, ...value });
  };
  return [profileState, setProfileVar];
}

export { useProfileVar };
