import React from 'react';

import { KeyboardAvoidingViewProps } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface KeyboardViewProps extends KeyboardAvoidingViewProps {
  children: React.ReactNode;
  keyboardVerticalOffset?: number;
}

const KeyboardView: React.FC<KeyboardViewProps> = ({
  children,
  keyboardVerticalOffset = 160,
  ...props
}) => {
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName={classes.container}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

const classes = {
  container: '',
};

export default KeyboardView;
