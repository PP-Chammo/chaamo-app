import React from 'react';

import { clsx } from 'clsx';
import { cssInterop } from 'nativewind';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface KeyboardViewProps {
  children: React.ReactNode;
  enableOnAndroid?: boolean;
  enableAutomaticScroll?: boolean;
  extraScrollHeight?: number;
  extraHeight?: number;
  contentContainerClassName?: string;
  className?: string;
}

const KeyboardView: React.FC<KeyboardViewProps> = ({
  children,
  enableOnAndroid = true,
  enableAutomaticScroll = true,
  extraScrollHeight = 50,
  extraHeight = 250,
  contentContainerClassName,
  className,
  ...props
}) => {
  cssInterop(KeyboardAwareScrollView, {
    className: {
      target: 'style',
    },
    contentContainerClassName: {
      target: 'contentContainerStyle',
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        enableOnAndroid={enableOnAndroid}
        enableAutomaticScroll={enableAutomaticScroll}
        extraScrollHeight={extraScrollHeight}
        extraHeight={extraHeight}
        contentContainerClassName={clsx(
          classes.contentContainer,
          contentContainerClassName,
        )}
        className={clsx(classes.container, className)}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {children}
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

const classes = {
  container: 'flex-1 gap-3',
  contentContainer: 'flex-grow gap-3 pb-20',
};

export default KeyboardView;
