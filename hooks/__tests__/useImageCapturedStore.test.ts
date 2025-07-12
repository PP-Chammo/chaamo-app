import { renderHook, act } from '@testing-library/react-native';

import { useImageCapturedStore } from '../useImageCapturedStore';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

const { router } = require('expo-router');

describe('useImageCapturedStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useImageCapturedStore());
    expect(result.current.uri).toBe('');
    expect(result.current.height).toBe(0);
    expect(result.current.width).toBe(0);
  });

  it('should set image and navigate', () => {
    const { result } = renderHook(() => useImageCapturedStore());
    const newImage = { uri: 'test.jpg', height: 100, width: 200 };
    act(() => {
      result.current.setImageCaptured(newImage);
    });
    expect(result.current.uri).toBe('test.jpg');
    expect(result.current.height).toBe(100);
    expect(result.current.width).toBe(200);
    expect(router.push).toHaveBeenCalledWith(
      '/(setup-profile)/(upload-identity)/id-card-captured',
    );
  });
});
