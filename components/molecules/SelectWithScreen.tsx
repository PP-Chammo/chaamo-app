import React, { memo } from 'react';

import { clsx } from 'clsx';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { getColor } from '@/utils/getColor';

import { Icon } from '../atoms';

interface SelectWithScreenProps extends TextInputProps {
  label?: string;
  required?: boolean;
  onPress: () => void;
  error?: string;
  leftIcon?: React.ReactNode;
  inputClassName?: string;
  placeholder?: string;
}

const SelectWithScreen: React.FC<SelectWithScreenProps> = memo(
  function SelectWithScreen({
    label,
    required,
    onPress,
    error,
    leftIcon,
    inputClassName,
    placeholder,
    ...props
  }) {
    return (
      <View className={classes.container}>
        {label && (
          <Text className={classes.label}>
            {label}
            {required && <Text className={classes.required}>*</Text>}
          </Text>
        )}
        <View className={classes.inputContainer}>
          <TextInput
            className={clsx(
              classes.input,
              inputClassName,
              leftIcon && classes.inputWithLeftIcon,
            )}
            onPress={onPress}
            placeholder={placeholder}
            {...props}
          />

          <View className={classes.leftIconContainer}>
            <Icon name="chevron-down" size={24} color={getColor('slate-700')} />
          </View>
        </View>
        {error && <Text className={classes.error}>{error}</Text>}
      </View>
    );
  },
);

export default SelectWithScreen;

const classes = {
  container: 'gap-2 flex-1',
  label: 'text-slate-500 font-medium text-md ml-4',
  required: 'text-red-500',
  inputContainer: 'relative',
  input: 'rounded-lg border border-slate-200 rounded-md p-4 bg-white h-[48px]',
  inputWithLeftIcon: 'px-12 py-4',
  eyeIcon: 'absolute right-4 top-1/2 -translate-y-1/2',
  error: 'text-red-500 text-sm',
  leftIconContainer: 'absolute right-4 translate-y-1/2 z-10',
};
