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
      className={classes.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const classes = {
  container: 'container',
};

export default KeyboardView;
