import React from 'react';

import { clsx } from 'clsx';
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
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

const KeyboardView: React.FC<KeyboardViewProps> = ({
  children,
  enableOnAndroid = true,
  enableAutomaticScroll = true,
  extraScrollHeight = 50,
  extraHeight = 250,
  contentContainerClassName,
  className,
  keyboardShouldPersistTaps = 'handled',
  ...props
}) => {
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
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...props}
      >
        {children}
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

const classes = {
  container: 'flex-1 gap-3',
  contentContainer: 'gap-3 pb-20',
};

export default KeyboardView;
