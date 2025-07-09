import React from 'react';

import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from 'react-native';

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
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 75}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardView;
