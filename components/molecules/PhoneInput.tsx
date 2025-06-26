import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

import { Label } from '@/components/atoms';

interface PhoneNumberInputProps {
  name: string;
  value: string;
  onChange: ({ name, value }: { name: string; value: string }) => void;
}

const PhoneNumberInput = ({ name, value, onChange }: PhoneNumberInputProps) => {
  const handleChange = (text: string) => onChange({ name, value: text });

  return (
    <View className={classes.container}>
      <Label>
        Phone<Label style={{ color: 'red' }}>*</Label>
      </Label>
      <PhoneInput
        defaultCode="GB"
        layout="second"
        value={value}
        onChangeFormattedText={handleChange}
        autoFocus
        containerStyle={styles.container}
        textContainerStyle={styles.textContainer}
        textInputStyle={styles.textInput}
        codeTextStyle={styles.codeText}
        flagButtonStyle={styles.flagButton}
        renderDropdownImage={
          <Ionicons name="chevron-down" size={18} color="#374151" />
        }
        countryPickerProps={{
          renderFlagButton: false,
        }}
      />
    </View>
  );
};

const classes = {
  container: 'w-full',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginTop: 8,
    width: '100%',
  },
  textContainer: {
    borderRadius: 6,
    backgroundColor: '#fff',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    height: 45,
    minHeight: 45,
    maxHeight: 45,
    paddingVertical: 0,
  },
  textInput: {
    fontSize: 15,
    color: '#6B7280',
    paddingLeft: 8,
    height: 45,
    minHeight: 45,
    maxHeight: 45,
    paddingVertical: 0,
  },
  codeText: {
    fontSize: 15,
    color: '#374151',
    marginRight: 12,
  },
  flagButton: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
