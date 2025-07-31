import React, { memo, useCallback, useState } from 'react';

import { clsx } from 'clsx';
import { cssInterop } from 'nativewind';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Icon } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

cssInterop(ScrollView, {
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

interface SelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  required?: boolean;
  name: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  options?: Option[];
  error?: string;
  inputClassName?: string;
  className?: string;
}

interface Option {
  label: string;
  value: string;
}

const Select: React.FC<SelectProps> = memo(function Select({
  label,
  placeholder,
  value,
  required,
  onChange,
  name,
  options = [],
  error,
  inputClassName,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange({ name, value: optionValue });
      setIsOpen(false);
    },
    [onChange, name],
  );

  const selectedLabel = options.find((o) => o.value === value)?.label || '';

  return (
    <View className={clsx(classes.container, className)}>
      {label && (
        <Text className={classes.label}>
          {label}
          {required && <Text className={classes.required}>*</Text>}
        </Text>
      )}
      <View
        className={clsx(classes.inputContainer)}
        style={{ position: 'relative' }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          testID="select"
          className={clsx(classes.input, inputClassName)}
          onPress={() => setIsOpen((prevState) => !prevState)}
        >
          <Text
            className={clsx({
              [classes.inputText]: !!selectedLabel,
              [classes.inputTextPlaceholder]: !selectedLabel,
            })}
          >
            {selectedLabel || placeholder}
          </Text>
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={getColor('slate-700')}
            className={classes.chevronIcon}
          />
        </TouchableOpacity>
        {isOpen && (
          <View className={classes.dropdown}>
            <ScrollView className="max-h-[50px]">
              {options.map((option, idx) => (
                <React.Fragment key={option.value}>
                  <TouchableOpacity
                    className={classes.dropdownOption}
                    onPress={() => handleSelect(option.value)}
                  >
                    <Text className={classes.dropdownOptionText}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                  {idx < options.length - 1 && (
                    <View className={classes.dropdownSeparator} />
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      {error && <Text className={classes.error}>{error}</Text>}
    </View>
  );
});

export default Select;

const classes = {
  container: 'gap-2',
  label: 'text-slate-500 font-medium text-md ml-4',
  required: 'text-red-500',
  inputContainer: 'relative',
  input:
    'flex flex-row justify-between items-center border border-slate-200 text-gray-700 rounded-lg px-4 bg-white h-[46px]',
  error: 'text-red-500 text-sm',
  inputText: 'text-gray-700',
  inputTextPlaceholder: 'text-gray-400',
  chevronIcon: 'mt-0.5',
  dropdown:
    'absolute left-0 right-0 top-full max-h-[180px] bg-white border border-slate-200 rounded-lg shadow-lg shadow-black/10 mt-1 z-50 overflow-hidden',
  dropdownOption: 'px-4 py-3',
  dropdownOptionText: 'text-gray-600',
  dropdownSeparator: 'h-px bg-gray-100',
};
