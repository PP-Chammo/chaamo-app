import { router } from 'expo-router';

import {
  imageCapturedStore,
  ImageCapturedStore,
} from '@/stores/imageCapturedStore';
import { createReactiveVar } from '@/utils/reactive';

const imageCapturedVar =
  createReactiveVar<ImageCapturedStore>(imageCapturedStore);

function useImageCapturedVar(): [
  ImageCapturedStore,
  (image: ImageCapturedStore) => void,
] {
  const imageState = imageCapturedVar.useVar();
  const setImageCapturedVar = (image: ImageCapturedStore) => {
    imageCapturedVar.set(image);
    router.push('/screens/setup-profile/identity/id-card-captured');
  };
  return [imageState, setImageCapturedVar];
}

export { useImageCapturedVar };
