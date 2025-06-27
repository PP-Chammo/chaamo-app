import React from 'react';

import { remapProps } from 'nativewind';
import { View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

import { Icon, Label } from '@/components/atoms';

type PhoneInputChangeParams = {
  name: string;
  value: string;
};

interface PhoneNumberInputProps {
  name: string;
  value: string;
  onChange: (params: PhoneInputChangeParams) => void;
}

const StyledPhoneInput = remapProps(PhoneInput, {
  className: 'containerStyle',
  textContainerClassName: 'textContainerStyle',
  textInputClassName: 'textInputStyle',
  codeTextClassName: 'codeTextStyle',
  flagButtonClassName: 'flagButtonStyle',
});

const PhoneNumberInput = ({ name, value, onChange }: PhoneNumberInputProps) => {
  const handleChange = (text: string) => onChange({ name, value: text });

  return (
    <View className="w-full">
      <Label>
        Phone<Label style={{ color: 'red' }}>*</Label>
      </Label>
      <StyledPhoneInput
        defaultCode="GB"
        layout="second"
        value={value}
        onChangeFormattedText={handleChange}
        autoFocus
        className={classes.container}
        textContainerClassName={classes.textContainer}
        textInputClassName={classes.textInput}
        codeTextClassName={classes.codeText}
        flagButtonClassName={classes.flagButton}
        renderDropdownImage={
          <Icon name="chevron-down" size={18} color="#374151" />
        }
        countryPickerProps={{
          renderFlagButton: false,
        }}
      />
    </View>
  );
};

const classes = {
  container: 'w-full mt-2 bg-transparent',
  textContainer:
    'rounded-md bg-white ml-2 border border-gray-200 flex-1 h-[45px] min-h-[45px] max-h-[45px] py-0',
  textInput:
    'text-[15px] text-gray-500 pl-2 h-[45px] min-h-[45px] max-h-[45px] py-0',
  codeText: 'text-[15px] text-gray-700 mr-3',
  flagButton:
    'w-[120px] bg-white rounded-md border border-gray-200 h-[45px] min-h-[45px] max-h-[45px] px-3 py-0 items-center justify-center',
};

export default PhoneNumberInput;
