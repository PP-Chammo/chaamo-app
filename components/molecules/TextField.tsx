import React, { memo, useState } from 'react';

import { clsx } from 'clsx';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

import { Icon } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface TextFieldProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  required?: boolean;
  type?: 'text' | 'password';
  hidePassword?: boolean;
  name: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  error?: string;
  leftIcon?: React.ReactNode;
  inputClassName?: string;
}

const TextField: React.FC<TextFieldProps> = memo(function TextField({
  label,
  placeholder,
  value,
  required,
  type = 'text',
  onChange,
  name,
  error,
  leftIcon,
  inputClassName,
  ...props
}) {
  const [hidePassword, setHidePassword] = useState(true);

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
      <View className={classes.inputContainer}>
        {leftIcon && (
          <View className={classes.leftIconContainer}>{leftIcon}</View>
        )}
        <TextInput
          placeholder={placeholder}
          className={clsx(
            classes.input,
            inputClassName,
            leftIcon && classes.inputWithLeftIcon,
          )}
          onChangeText={handleChange}
          secureTextEntry={type === 'password' && hidePassword}
          {...props}
        />
        {type === 'password' && (
          <Pressable
            className={classes.eyeIcon}
            onPress={() => setHidePassword(!hidePassword)}
          >
            <Icon
              name={hidePassword ? 'eye' : 'eye-off'}
              size={24}
              color={getColor('slate-700')}
            />
          </Pressable>
        )}
      </View>
      {error && <Text className={classes.error}>{error}</Text>}
    </View>
  );
});

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
  inputWithLeftIcon: 'px-12 py-4',
  eyeIcon: 'absolute right-4 top-1/2 -translate-y-1/2',
  error: 'text-red-500 text-sm',
  leftIconContainer: 'absolute left-4 translate-y-1/2 z-10',
};
