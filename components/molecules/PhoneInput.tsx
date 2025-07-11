import React, { memo } from 'react';

import { StyleSheet, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

import { Icon, Label } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

const PhoneInputLocal = PhoneInput as unknown as React.JSX.ElementType;

interface PhoneNumberInputProps {
  name: string;
  value: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  required?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = memo(
  function PhoneNumberInput({ name, value, onChange, required }) {
    const handleChange = (text: string) => onChange({ name, value: text });

    return (
      <View className={classes.container}>
        <Label className={classes.label}>
          Phone
          {required && <Label className={classes.required}>*</Label>}
        </Label>
        <PhoneInputLocal
          defaultCode="GB"
          layout="second"
          value={value}
          onChangeFormattedText={handleChange}
          autoFocus={false}
          containerStyle={styles.container}
          textContainerStyle={styles.textContainer}
          textInputStyle={styles.textInput}
          codeTextStyle={styles.codeText}
          flagButtonStyle={styles.flagButton}
          renderDropdownImage={
            <Icon name="chevron-down" size={18} color={getColor('slate-700')} />
          }
          countryPickerProps={{
            countryCodes: ['GB', 'US', 'CA', 'DE', 'FR', 'ES', 'IT', 'AU'],
            renderFlagButton: false,
          }}
        />
      </View>
    );
  },
);

const classes = {
  container: 'w-full',
  label: 'text-slate-500 font-medium text-md ml-4',
  required: 'text-red-500',
};

// We use StyleSheet instead of classes/nativewind here because the 'react-native-phone-number-input' component
// does not support the 'className' prop or Tailwind/nativewind class utilities. It expects direct style objects
// via props like 'containerStyle', 'textContainerStyle', etc., which are compatible with React Native's StyleSheet.

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginTop: 3,
    width: '100%',
  },
  textContainer: {
    borderRadius: 6,
    backgroundColor: getColor('white'),
    marginLeft: 8,
    borderWidth: 1,
    borderColor: getColor('slate-200'),
    flex: 1,
    height: 45,
    minHeight: 45,
    maxHeight: 45,
    paddingVertical: 0,
  },
  textInput: {
    fontSize: 15,
    color: getColor('slate-700'),
    paddingLeft: 8,
    height: 45,
    minHeight: 45,
    maxHeight: 45,
    paddingVertical: 0,
  },
  codeText: {
    fontSize: 15,
    color: getColor('slate-700'),
    marginRight: 12,
  },
  flagButton: {
    width: 120,
    backgroundColor: getColor('white'),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: getColor('slate-200'),
    height: 45,
    minHeight: 45,
    maxHeight: 45,
    paddingHorizontal: 12,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PhoneNumberInput;
