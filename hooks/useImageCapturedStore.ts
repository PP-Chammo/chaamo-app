import { router } from 'expo-router';
import { create } from 'zustand';

import {
  imageCapturedStore,
  ImageCapturedStore,
} from '@/stores/imageCapturedStore';

export interface ImageCapturedState extends ImageCapturedStore {
  setImageCaptured: (image: ImageCapturedStore) => void;
}

export const useImageCapturedStore = create<ImageCapturedState>((set) => ({
  ...imageCapturedStore,
  setImageCaptured: (image: ImageCapturedStore) => {
    set(image);
    router.push('/(setup-profile)/(upload-identity)/id-card-captured');
  },
}));
