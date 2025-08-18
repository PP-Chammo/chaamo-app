import {
  imageCapturedStore,
  ImageCapturedStore,
} from '@/stores/imageCapturedStore';
import { createReactiveVar } from '@/utils/reactive';

const imageCapturedVar =
  createReactiveVar<ImageCapturedStore>(imageCapturedStore);

function useImageCapturedVar(): [
  ImageCapturedStore,
  (image: ImageCapturedStore, callback?: () => void) => void,
] {
  const imageState = imageCapturedVar.useVar();
  const setImageCapturedVar = (
    image: ImageCapturedStore,
    callback?: () => void,
  ) => {
    imageCapturedVar.set(image);
    callback?.();
  };
  return [imageState, setImageCapturedVar];
}

export { useImageCapturedVar };
