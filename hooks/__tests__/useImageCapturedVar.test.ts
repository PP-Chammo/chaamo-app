import { act, renderHook } from '@testing-library/react-native';
import { router } from 'expo-router';

import { useImageCapturedVar } from '../useImageCapturedVar';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

describe('useImageCapturedVar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useImageCapturedVar());
    const [imageState] = result.current;
    expect(imageState.uri).toBe('');
    expect(imageState.height).toBe(0);
    expect(imageState.width).toBe(0);
  });

  it('should set image and navigate', () => {
    const { result } = renderHook(() => useImageCapturedVar());
    const [, setImageCapturedVar] = result.current;
    const newImage = { uri: 'test.jpg', height: 100, width: 200 };
    act(() => {
      setImageCapturedVar(newImage);
    });
    const [imageState] = result.current;
    expect(imageState.uri).toBe('test.jpg');
    expect(imageState.height).toBe(100);
    expect(imageState.width).toBe(200);
    expect(router.push).toHaveBeenCalledWith(
      '/(setup-profile)/(upload-identity)/id-card-captured',
    );
  });
});
