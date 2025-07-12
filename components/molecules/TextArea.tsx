import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { TextChangeParams } from '@/domains';

interface TextAreaProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  name: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  inputClassName?: string;
}

const TextArea: React.FC<TextAreaProps> = memo(function TextArea({
  label,
  placeholder,
  value,
  onChange,
  name,
  inputClassName,
  ...props
}) {
  const handleChange = (value: string) => {
    onChange({ name, value });
  };

  return (
    <View className={classes.container}>
      {label && <Text className={classes.label}>{label}</Text>}
      <TextInput
        multiline
        placeholder={placeholder}
        textAlignVertical="top"
        className={clsx(classes.input, inputClassName)}
        onChangeText={handleChange}
        {...props}
      />
    </View>
  );
});

export default TextArea;

const classes = {
  container: 'gap-2',
  label: 'text-slate-500 font-medium text-md ml-4',
  input: 'rounded-lg border border-slate-200 rounded-md px-4 bg-white min-h-24',
};
