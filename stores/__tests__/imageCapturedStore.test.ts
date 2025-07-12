import { imageCapturedStore } from '../imageCapturedStore';

describe('imageCapturedStore', () => {
  it('should have default values', () => {
    expect(imageCapturedStore.uri).toBe('');
    expect(imageCapturedStore.height).toBe(0);
    expect(imageCapturedStore.width).toBe(0);
  });
});
