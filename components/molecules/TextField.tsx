import React, { memo, useCallback, useState } from 'react';

import { clsx } from 'clsx';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

import { Icon } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { formatExpiryCardField } from '@/utils/card';
import { getColor } from '@/utils/getColor';

interface TextFieldProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  required?: boolean;
  type?: 'text' | 'password' | 'date';
  hidePassword?: boolean;
  name: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  error?: string;
  leftIcon?: React.ComponentProps<typeof Icon>['name'];
  leftIconSize?: React.ComponentProps<typeof Icon>['size'];
  leftIconColor?: React.ComponentProps<typeof Icon>['color'];
  leftIconVariant?: React.ComponentProps<typeof Icon>['variant'];
  leftComponent?: React.ReactNode;
  rightIcon?: React.ComponentProps<typeof Icon>['name'];
  rightIconSize?: React.ComponentProps<typeof Icon>['size'];
  rightIconColor?: React.ComponentProps<typeof Icon>['color'];
  rightIconVariant?: React.ComponentProps<typeof Icon>['variant'];
  rightComponent?: React.ReactNode;
  onRightIconPress?: () => void;
  inputClassName?: string;
  className?: string;
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
  leftIconSize = 24,
  leftIconColor = getColor('slate-500'),
  leftIconVariant = 'MaterialCommunityIcons',
  leftComponent,
  rightIcon,
  rightIconSize = 24,
  rightIconColor = getColor('slate-500'),
  rightIconVariant = 'MaterialCommunityIcons',
  rightComponent,
  onRightIconPress,
  inputClassName,
  className,
  ...props
}) {
  const [hidePassword, setHidePassword] = useState(true);

  const handleChange = useCallback(
    (value: string) => {
      let formattedValue = value;
      if (type === 'date') {
        formattedValue = formatExpiryCardField(value);
      }
      onChange({ name, value: formattedValue });
    },
    [name, onChange, type],
  );

  return (
    <View
      testID="text-field-container"
      className={clsx(classes.container, className)}
    >
      {label && (
        <Text className={classes.label}>
          {label}
          {required && <Text className={classes.required}>*</Text>}
        </Text>
      )}
      <View className={classes.inputContainer}>
        {leftIcon && (
          <View testID="left-icon" className={classes.leftIconContainer}>
            <Icon
              name={leftIcon}
              size={leftIconSize}
              color={leftIconColor}
              variant={leftIconVariant}
            />
          </View>
        )}
        {leftComponent && (
          <View className={classes.leftComponentContainer}>
            {leftComponent}
          </View>
        )}
        <TextInput
          testID="text-input"
          placeholder={placeholder}
          className={clsx(
            classes.input,
            inputClassName,
            leftIcon && classes.inputWithLeftIcon,
          )}
          onChangeText={handleChange}
          secureTextEntry={type === 'password' && hidePassword}
          value={value}
          placeholderTextColor={getColor('gray-400')}
          {...props}
        />
        {type === 'password' && (
          <Pressable
            testID="eye-icon"
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
        {rightIcon && (
          <View className={classes.rightIconContainer}>
            <Icon
              name={rightIcon}
              size={rightIconSize}
              color={rightIconColor}
              variant={rightIconVariant}
              onPress={onRightIconPress}
            />
          </View>
        )}
        {rightComponent && (
          <View className={classes.rightComponentContainer}>
            {rightComponent}
          </View>
        )}
      </View>
      {error && <Text className={classes.error}>{error}</Text>}
    </View>
  );
});

export default TextField;

const classes = {
  container: 'flex gap-2',
  label: 'text-slate-500 font-medium text-md ml-4',
  required: 'text-red-500',
  inputContainer: 'relative',
  input:
    'rounded-lg border border-slate-200 text-gray-700 rounded-lg p-4 bg-white h-[46px]',
  inputWithLeftIcon: 'px-12 py-4',
  eyeIcon: 'absolute right-4 top-1/2 -translate-y-1/2',
  error: 'text-red-500 text-sm',
  leftIconContainer: 'absolute left-4 top-1/2 -translate-y-1/2 z-10',
  leftComponentContainer: 'absolute left-4 translate-y-1/2 z-10',
  rightIconContainer: 'absolute right-4 top-1/2 -translate-y-1/2 z-10',
  rightComponentContainer: 'absolute right-4 translate-y-1/2 z-10',
};
