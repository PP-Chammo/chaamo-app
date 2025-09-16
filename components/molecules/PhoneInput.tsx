import React, { memo, useRef } from 'react';

import { StyleSheet, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

import { Icon, Label } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

const PhoneInputLocal = PhoneInput as unknown as React.JSX.ElementType;

interface PhoneNumberInputProps {
  name: string;
  value: string;
  countryCode?: string;
  onChange: (
    { name, value }: TextChangeParams,
    callingCode: string,
    countryCode: string,
  ) => void;
  required?: boolean;
  error?: string;
}

interface PhoneInputMethods {
  getNumber: () => string | undefined;
  getCallingCode: () => string | undefined;
  getCountryCode: () => string | undefined;
  // bisa tambah method lain jika perlu
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = memo(
  function PhoneNumberInput({
    name,
    value,
    countryCode = 'GB',
    onChange,
    required,
    error,
  }) {
    const phoneInput = useRef<PhoneInputMethods>(null);
    const handleChange = (text: string) => {
      const callingCode = phoneInput.current?.getCallingCode();
      const countryCode = phoneInput.current?.getCountryCode();
      const safeCalling = callingCode ? `+${callingCode}` : '';
      const safeCountry = countryCode ?? '';
      onChange({ name, value: text }, safeCalling, safeCountry);
    };

    const handleChangeCountry = (country: {
      callingCode: string[];
      cca2: string;
    }) => {
      const safeCalling = country.callingCode?.[0]
        ? `+${country.callingCode[0]}`
        : '';
      const safeCountry = country.cca2 ?? '';
      onChange({ name, value }, safeCalling, safeCountry);
    };

    return (
      <View testID="phone-input-container" className={classes.container}>
        <Label className={classes.label}>
          Phone
          {required && <Label className={classes.required}>*</Label>}
        </Label>
        <PhoneInputLocal
          ref={phoneInput}
          testID="phone-input-field"
          defaultCode={countryCode}
          layout="second"
          value={value}
          onChangeText={handleChange}
          onChangeCountry={handleChangeCountry}
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
        {!!error && <Label className={classes.error}>{error}</Label>}
      </View>
    );
  },
);

const classes = {
  container: 'w-full',
  label: 'text-slate-500 font-medium text-md ml-4',
  required: 'text-red-500',
  error: 'text-red-500 text-sm',
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
