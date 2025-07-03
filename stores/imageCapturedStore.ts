export interface ImageCapturedStore {
  uri: string;
  height: number;
  width: number;
}

export const imageCapturedStore: ImageCapturedStore = {
  uri: '',
  height: 0,
  width: 0,
};
