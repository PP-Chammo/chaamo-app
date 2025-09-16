import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface TextAreaProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  name: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  inputClassName?: string;
  required?: boolean;
  rows?: number;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = memo(function TextArea({
  label,
  placeholder,
  value,
  onChange,
  name,
  inputClassName,
  required,
  error,
  ...props
}) {
  const handleChange = (value: string) => {
    onChange({ name, value });
  };

  return (
    <View className={classes.container}>
      {label && (
        <Text className={classes.label}>
          {label}
          {required && <Text className={classes.required}>*</Text>}
        </Text>
      )}
      <TextInput
        multiline
        placeholder={placeholder}
        textAlignVertical="top"
        className={clsx(
          classes.input,
          inputClassName,
          !!error && classes.errorBorder,
        )}
        value={value}
        autoComplete="off"
        onChangeText={handleChange}
        placeholderTextColor={getColor('gray-400')}
        {...props}
      />
      {error && <Text className={classes.error}>{error}</Text>}
    </View>
  );
});

export default TextArea;

const classes = {
  container: 'flex gap-2',
  label: 'text-slate-500 font-medium text-md ml-4',
  required: 'text-red-500',
  input:
    'rounded-lg border border-slate-200 rounded-md p-4 bg-white min-h-24 max-h-56',
  error: 'text-red-500 text-sm',
  errorBorder: '!border-red-500',
};
