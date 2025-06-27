import React, { useState } from 'react';

import { Text, TextInput, TextInputProps, View } from 'react-native';

import { Icon } from '@/components/atoms';
import { InputChangeParams } from '@/domains';

interface TextFieldProps extends Omit<TextInputProps, 'onChange'> {
  label: string;
  required?: boolean;
  type?: 'text' | 'password';
  hidePassword?: boolean;
  name: string;
  onChange: ({ name, value }: InputChangeParams) => void;
  error?: string;
}

const TextField = ({
  label,
  placeholder,
  value,
  required,
  type = 'text',
  onChange,
  name,
  error,
  ...props
}: TextFieldProps) => {
  const [hidePassword, setHidePassword] = useState(true);

  const handleChange = (value: string) => {
    onChange({ name, value });
  };

  return (
    <View className={classes.container}>
      <Text className={classes.label}>
        {label}
        {required && <Text className={classes.required}>*</Text>}
      </Text>
      <View className={classes.inputContainer}>
        <TextInput
          placeholder={placeholder}
          className={classes.input}
          onChangeText={handleChange}
          secureTextEntry={type === 'password' && hidePassword}
          {...props}
        />
        {type === 'password' && (
          <Icon
            className={classes.eyeIcon}
            name={hidePassword ? 'eye' : 'eye-off'}
            size={24}
            color="#374151"
            onPress={() => setHidePassword(!hidePassword)}
          />
        )}
      </View>
      {error && <Text className={classes.error}>{error}</Text>}
    </View>
  );
};

export default TextField;

const classes = {
  container: 'gap-2',
  label: 'text-slate-500 font-medium text-md ml-4',
  title: 'text-2xl font-bold text-teal-600',
  description: 'text-slate-500 font-medium text-md mb-6',
  login: 'text-gray-500 text-md text-center underline font-bold',
  link: 'text-teal-600 underline font-bold',
  loginButton: 'my-2',
  signUp: 'text-slate-500 text-md text-center mb-8',
  required: 'text-red-500',
  inputContainer: 'relative',
  input: 'rounded-lg border border-slate-200 rounded-md p-4 bg-white h-[48px]',
  eyeIcon: 'absolute right-4 top-1/2 -translate-y-1/2',
  error: 'text-red-500 text-sm',
};
