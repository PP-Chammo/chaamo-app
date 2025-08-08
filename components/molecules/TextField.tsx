import React, { memo, useCallback, useState } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { clsx } from 'clsx';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  Platform,
  Modal,
} from 'react-native';

import { Icon, Label } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { formatDateInput, formatDate } from '@/utils/date';
import { getColor } from '@/utils/getColor';

interface TextFieldProps extends Omit<TextInputProps, 'onChange'> {
  label?: string;
  required?: boolean;
  type?: 'text' | 'password' | 'date';
  hidePassword?: boolean;
  name: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  error?: string;
  leftLabel?: string;
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
  leftLabel,
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [leftLabelWidth, setLeftLabelWidth] = useState(0);

  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date(),
  );

  const handleChange = useCallback(
    (value: string) => {
      let formattedValue = value;
      if (type === 'date') {
        formattedValue = formatDateInput(value);
      }
      onChange({ name, value: formattedValue });
    },
    [name, onChange, type],
  );

  const handleDateChange = useCallback(
    (_event: unknown, date?: Date) => {
      if (date) {
        setSelectedDate(date);
        if (Platform.OS === 'android') {
          handleChange(formatDate(date, 'dd/MM/yyyy'));
          setShowDatePicker(false);
        }
      }
    },
    [handleChange],
  );

  const handleDatePress = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const handleLeftLabelLayout = useCallback(
    (event: { nativeEvent: { layout: { width: number } } }) => {
      const { width } = event.nativeEvent.layout;
      setLeftLabelWidth(width + 20);
    },
    [],
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
        <View className={classes.inputRow}>
          {leftLabel && (
            <View
              className={classes.leftLabelContainer}
              onLayout={handleLeftLabelLayout}
            >
              <Label className={classes.leftLabel}>{leftLabel}</Label>
            </View>
          )}
          {leftComponent && (
            <View className={classes.leftComponentContainer}>
              {leftComponent}
            </View>
          )}
          {leftIcon && (
            <View className={classes.leftIconContainer}>
              <Icon
                name={leftIcon}
                size={leftIconSize}
                color={leftIconColor}
                variant={leftIconVariant}
              />
            </View>
          )}
          <View className={classes.inputWrapper}>
            {type === 'date' ? (
              <Pressable
                testID="date-input"
                onPress={handleDatePress}
                className={clsx(classes.inputDate, inputClassName)}
              >
                <Text
                  className={classes.inputDateText}
                  style={{
                    paddingLeft:
                      leftLabelWidth || (leftIcon || leftComponent ? 36 : 12),
                  }}
                >
                  {value || placeholder}
                </Text>
              </Pressable>
            ) : (
              <TextInput
                testID="text-input"
                autoComplete="off"
                autoCorrect={false}
                placeholder={placeholder}
                className={clsx(classes.input, inputClassName)}
                style={{
                  paddingLeft:
                    leftLabelWidth || (leftIcon || leftComponent ? 36 : 12),
                }}
                onChangeText={handleChange}
                secureTextEntry={type === 'password' && hidePassword}
                value={value}
                placeholderTextColor={getColor('gray-400')}
                {...props}
              />
            )}
          </View>
          {type === 'password' && (
            <Pressable
              testID="eye-icon"
              className={classes.eyeIcon}
              onPress={() => setHidePassword(!hidePassword)}
            >
              <Icon
                name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={getColor('slate-500')}
                variant="MaterialCommunityIcons"
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
                onPress={type === 'date' ? handleDatePress : onRightIconPress}
              />
            </View>
          )}
          {rightComponent && (
            <View className={classes.rightComponentContainer}>
              {rightComponent}
            </View>
          )}
        </View>
      </View>
      {error && <Text className={classes.error}>{error}</Text>}
      {Platform.OS === 'ios' && type === 'date' && showDatePicker && (
        <Modal
          transparent
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View className={classes.modalContainer}>
            <View className={classes.modalContent}>
              <View className={classes.modalHeader}>
                <Text className={classes.modalTitle}>Select Date</Text>
                <Pressable
                  onPress={() => {
                    handleChange(formatDate(selectedDate, 'dd/MM/yyyy'));
                    setShowDatePicker(false);
                  }}
                >
                  <Text className={classes.modalDone}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        </Modal>
      )}
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
    'rounded-lg border border-slate-200 text-gray-700 text-base rounded-lg px-4 leading-5 bg-white h-[46px] -mt-px',
  inputDate:
    'rounded-lg border border-slate-200 text-base rounded-lg leading-5 bg-white h-[46px] justify-center',
  inputDateText: 'text-gray-700',
  inputWithLeftIcon: 'px-12 py-4',
  eyeIcon: 'ml-2',
  error: 'text-red-500 text-sm',
  leftLabel: 'text-slate-500 text-base',
  leftLabelContainer: 'absolute left-3 top-1/2 -translate-y-1/2 z-10',
  leftIconContainer: 'absolute left-3 top-1/2 -translate-y-1/2 z-10',
  leftComponentContainer: 'absolute left-3 top-1/2 -translate-y-1/2 z-10',
  rightIconContainer: 'absolute right-4 top-1/2 -translate-y-1/2 z-10',
  rightComponentContainer: 'absolute right-4 top-1/2 -translate-y-1/2 z-10',
  inputRow: 'flex-row items-center relative',
  inputWrapper: 'flex-1',
  modalContainer: 'flex-1 justify-end bg-black/50',
  modalContent: 'bg-white rounded-t-3xl p-4',
  modalHeader: 'flex-row justify-between items-center mb-4',
  modalTitle: 'text-lg font-bold',
  modalDone: 'text-blue-500 text-lg',
};
