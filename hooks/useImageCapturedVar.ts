import { router, useLocalSearchParams } from 'expo-router';

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
  const params = useLocalSearchParams();
  const imageState = imageCapturedVar.useVar();
  const setImageCapturedVar = (image: ImageCapturedStore) => {
    imageCapturedVar.set(image);
    router.push({
      pathname: '/screens/setup-profile/document-captured',
      params,
    });
  };
  return [imageState, setImageCapturedVar];
}

export { useImageCapturedVar };
