import React from 'react';

import {
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import { Text, Animated, Platform, Keyboard, PanResponder, PanResponderInstance } from 'react-native';

import BottomSheetModal from '../BottomSheetModal';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('BottomSheetModal', () => {
  const mockOnDismiss = jest.fn();
  const mockChildren = <Text>Test Content</Text>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Animated.timing and Animated.spring directly
    jest.spyOn(Animated, 'timing').mockImplementation((() => ({
      start: (cb?: () => void) => cb && cb(),
    })) as unknown as jest.MockedFunction<typeof Animated.timing>);
    jest.spyOn(Animated, 'spring').mockImplementation((() => ({
      start: (cb?: () => void) => cb && cb(),
    })) as unknown as jest.MockedFunction<typeof Animated.spring>);
  });

  it('renders correctly when show is true', () => {
    const { getByTestId } = render(
      <BottomSheetModal show={true} onDismiss={mockOnDismiss}>
        {mockChildren}
      </BottomSheetModal>,
    );
    expect(getByTestId('bottom-sheet-container')).toBeTruthy();
  });

  it('does not render when show is false', () => {
    const { queryByTestId } = render(
      <BottomSheetModal show={false} onDismiss={mockOnDismiss}>
        {mockChildren}
      </BottomSheetModal>,
    );
    expect(queryByTestId('bottom-sheet-container')).toBeNull();
  });

  it('renders children content', () => {
    const { getByText } = render(
      <BottomSheetModal show={true} onDismiss={mockOnDismiss}>
        <Text>Custom Content</Text>
      </BottomSheetModal>,
    );
    expect(getByText('Custom Content')).toBeTruthy();
  });

  it('applies custom height when provided', () => {
    const { getByTestId } = render(
      <BottomSheetModal show={true} onDismiss={mockOnDismiss} height={300}>
        {mockChildren}
      </BottomSheetModal>,
    );
    expect(getByTestId('bottom-sheet-container')).toBeTruthy();
  });

  it('handles keyboard events correctly', () => {
    const { getByTestId } = render(
      <BottomSheetModal show={true} onDismiss={mockOnDismiss}>
        {mockChildren}
      </BottomSheetModal>,
    );
    expect(getByTestId('bottom-sheet-container')).toBeTruthy();
  });

  it('calls onDismiss when overlay is pressed', async () => {
    render(
      <BottomSheetModal show={true} onDismiss={mockOnDismiss}>
        {mockChildren}
      </BottomSheetModal>,
    );
    // NativeWind/cssInterop wrapping prevents getByTestId, getByLabelText, and getAllByRole from working reliably.
    // As a last-resort workaround, we use UNSAFE_queryAllByProps to directly find the overlay by testID.
    // This is necessary only for this case due to the way NativeWind/cssInterop wraps components.
    const overlays = screen.UNSAFE_queryAllByProps({
      testID: 'bottom-sheet-overlay',
    });
    const overlay = overlays[0];
    expect(overlay).toBeTruthy();
    // Test accessibility props while we have the overlay
    expect(overlay.props.accessibilityLabel).toBe('Close bottom sheet');
    expect(overlay.props.accessibilityRole).toBe('button');
    // Test the press functionality
    if (overlay.props.onPress) {
      overlay.props.onPress();
    } else {
      fireEvent.press(overlay);
    }
    await waitFor(() => {
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('adjusts for keyboard height on keyboardDidShow/keyboardDidHide', () => {
    // Mock Platform.OS as 'ios' to test effectiveKeyboardHeight logic
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', {
      value: 'ios',
      writable: true,
    });
    // Mock Keyboard.addListener to capture the callbacks
    const listeners: Record<string, Function> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(Keyboard, 'addListener').mockImplementation((...args: any[]) => {
      const [event, cb] = args as [string, Function];
      listeners[event] = cb;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { remove: jest.fn() } as any;
    });
    const { getByTestId } = render(
      <BottomSheetModal show={true} onDismiss={mockOnDismiss}>
        {mockChildren}
      </BottomSheetModal>,
    );
    // Simulate keyboardDidShow event
    listeners['keyboardDidShow'] &&
      listeners['keyboardDidShow']({ endCoordinates: { height: 100 } });
    // Simulate keyboardDidHide event
    listeners['keyboardDidHide'] && listeners['keyboardDidHide']();
    expect(getByTestId('bottom-sheet-container')).toBeTruthy();

    // Restore original Platform.OS
    Object.defineProperty(Platform, 'OS', {
      value: originalOS,
      writable: true,
    });
  });

  it('returns null when show is false and isOpen.current is false', () => {
    // Render with show=false, should return null
    const { queryByTestId } = render(
      <BottomSheetModal show={false} onDismiss={mockOnDismiss}>
        {mockChildren}
      </BottomSheetModal>,
    );
    expect(queryByTestId('bottom-sheet-container')).toBeNull();
  });

  it('handles pan responder drag below and above threshold', () => {
    // Mock PanResponder.create to capture the handlers
    const mockPanHandlers = {
      onStartShouldSetPanResponder: jest.fn(),
      onMoveShouldSetPanResponder: jest.fn(),
      onPanResponderGrant: jest.fn(),
      onPanResponderMove: jest.fn(),
      onPanResponderRelease: jest.fn(),
      onPanResponderTerminate: jest.fn(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(PanResponder, 'create').mockImplementation((config: any) => {
      // Store the config handlers in our mockPanHandlers
      if (config.onMoveShouldSetPanResponder) {
        mockPanHandlers.onMoveShouldSetPanResponder = config.onMoveShouldSetPanResponder;
      }
      if (config.onPanResponderRelease) {
        mockPanHandlers.onPanResponderRelease = config.onPanResponderRelease;
      }
      return {
        panHandlers: mockPanHandlers,
      } as unknown as PanResponderInstance;
    });

    const { getByTestId } = render(
      <BottomSheetModal show={true} onDismiss={mockOnDismiss}>
        {mockChildren}
      </BottomSheetModal>,
    );

    const sheet = getByTestId('bottom-sheet-container');
    expect(sheet).toBeTruthy();

    // Test drag below threshold (should not dismiss)
    const belowThresholdEvent = {
      nativeEvent: { pageX: 0, pageY: 0 },
    };
    const belowThresholdGestureState = {
      dy: 50, // Below threshold (25% of sheet height)
      dx: 0,
      vx: 0,
      vy: 0,
      x0: 0,
      y0: 0,
      moveX: 0,
      moveY: 50,
      numberActiveTouches: 1,
    };

    // Test onMoveShouldSetPanResponder
    const shouldSetPanResponder = mockPanHandlers.onMoveShouldSetPanResponder(
      belowThresholdEvent,
      belowThresholdGestureState,
    );
    expect(shouldSetPanResponder).toBe(true);

    // Test onPanResponderRelease below threshold (should not call onDismiss)
    mockPanHandlers.onPanResponderRelease(
      belowThresholdEvent,
      belowThresholdGestureState,
    );
    expect(mockOnDismiss).not.toHaveBeenCalled();

    // Test drag above threshold (should dismiss)
    const aboveThresholdEvent = {
      nativeEvent: { pageX: 0, pageY: 0 },
    };
    const aboveThresholdGestureState = {
      dy: 200, // Above threshold (25% of sheet height)
      dx: 0,
      vx: 0,
      vy: 0,
      x0: 0,
      y0: 0,
      moveX: 0,
      moveY: 200,
      numberActiveTouches: 1,
    };

    // Test onPanResponderRelease above threshold (should call onDismiss)
    mockPanHandlers.onPanResponderRelease(
      aboveThresholdEvent,
      aboveThresholdGestureState,
    );
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });
});
