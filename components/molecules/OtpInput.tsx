import React, { memo } from 'react';

import { StyleSheet, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

import { Label } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface OTPInputProps {
  error: boolean;
  onChange: ({ name, value }: TextChangeParams) => void;
  name: string;
}

const OTPInput: React.FC<OTPInputProps> = memo(function OTPInput({
  error,
  onChange,
  name,
}) {
  const handleChange = (text: string) => {
    onChange({ name, value: text });
  };

  return (
    <View testID="otp-input">
      <OtpInput
        numberOfDigits={6}
        onTextChange={handleChange}
        theme={{
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
        }}
      />
      {error && (
        <Label className={classes.error}>Error! Incorrect OTP Entered</Label>
      )}
    </View>
  );
});

const classes = {
  error: 'text-red-700 text-md text-center mt-3',
};

// We use styles here instead of classes/nativewind because the OtpInput component from 'react-native-otp-entry' expects style objects (StyleSheet or plain JS objects) for its theming props, not className strings. Nativewind classes are not compatible with these style props, so we must use StyleSheet-based styles.
const styles = StyleSheet.create({
  pinCodeContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: 46,
    height: 48,
    backgroundColor: getColor('white'),
  },
  pinCodeText: {
    fontSize: 16,
  },
  focusStick: {
    borderWidth: 1,
    borderColor: getColor('primary-700'),
    height: 16,
  },
  focusedPinCodeContainer: {
    borderWidth: 1,
    borderColor: getColor('primary-500'),
  },
});

export default OTPInput;
