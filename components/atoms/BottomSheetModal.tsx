import React, { useCallback, useEffect, useRef, useState } from 'react';

import { clsx } from 'clsx';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEvent,
  PanResponder,
  PanResponderGestureState,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetModalProps {
  show: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  height?: number; // Optional custom height
  className?: string;
  overlayClassName?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

const screenHeight = Dimensions.get('window').height;

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  show,
  onDismiss,
  children,
  height,
  className,
  overlayClassName,
  variant = 'primary',
}) => {
  const insets = useSafeAreaInsets();
  const sheetHeight = height ?? screenHeight * 0.5;
  const DRAG_DISMISS_THRESHOLD = sheetHeight * 0.25;
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const isOpen = useRef(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onKeyboardShow = (e: KeyboardEvent) =>
      setKeyboardHeight(e.endCoordinates.height);
    const onKeyboardHide = () => setKeyboardHeight(0);
    const showSub = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (show) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        isOpen.current = true;
      });
    } else {
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        isOpen.current = false;
      });
    }
  }, [show, translateY, sheetHeight]);

  const handleOverlayPress = useCallback(() => {
    Animated.timing(translateY, {
      toValue: sheetHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      isOpen.current = false;
      onDismiss();
    });
  }, [sheetHeight, onDismiss, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: useCallback(
        (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          return Math.abs(gestureState.dy) > 5;
        },
        [],
      ),
      onPanResponderMove: useCallback(
        (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        [translateY],
      ),
      onPanResponderRelease: useCallback(
        (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          if (gestureState.dy > DRAG_DISMISS_THRESHOLD) {
            Animated.timing(translateY, {
              toValue: sheetHeight,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              isOpen.current = false;
              onDismiss();
            });
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
        [DRAG_DISMISS_THRESHOLD, sheetHeight, onDismiss, translateY],
      ),
    }),
  ).current;

  if (!show) return null;

  // Subtract safe area inset from keyboard height on iOS
  const effectiveKeyboardHeight =
    Platform.OS === 'ios' ? Math.max(0, keyboardHeight - insets.bottom) : 0;

  return (
    <>
      {/* Overlay */}
      <Pressable
        className={clsx(classes.overlay, overlayClassName)}
        onPress={handleOverlayPress}
        accessible={true}
        accessibilityLabel="Close bottom sheet"
        accessibilityRole="button"
        testID="bottom-sheet-overlay"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View
          className={classes.container}
          pointerEvents={show ? 'auto' : 'none'}
          testID="bottom-sheet-container"
        >
          {/* Bottom Sheet */}
          <Animated.View
            className={clsx(
              classes.sheet.base,
              classes.sheet[variant],
              className,
            )}
            style={{
              height: sheetHeight,
              transform: [{ translateY }],
              bottom: effectiveKeyboardHeight,
            }}
            {...panResponder.panHandlers}
            accessibilityViewIsModal={true}
            accessibilityLiveRegion="polite"
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <View className={classes.handleContainer}>
                <View
                  className={clsx(classes.handle.base, classes.handle[variant])}
                />
              </View>
              <View className={classes.content}>{children}</View>
            </ScrollView>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const classes = {
  container: 'z-90 absolute inset-0',
  overlay: 'absolute inset-0 bg-black/30',
  sheet: {
    base: 'absolute left-0 right-0 bottom-0 rounded-t-3xl shadow-lg',
    default: 'bg-neutral-500',
    primary: 'bg-primary-500',
    secondary: 'bg-white',
  },
  handleContainer: 'items-center pt-4 pb-2',
  handle: {
    base: 'w-16 h-1.5 rounded',
    default: 'bg-white',
    primary: 'bg-white/70',
    secondary: 'bg-slate-600/70',
  },
  content: 'flex-1 justify-center',
};

export default BottomSheetModal;
