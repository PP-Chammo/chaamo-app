import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { clsx } from 'clsx';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Icon } from '@/components/atoms';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

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
  disabled?: boolean;
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
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value || '');

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const selectRef = useRef<View>(null);

  const handleToggle = useCallback(() => {
    if (!isOpen && selectRef.current) {
      selectRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({
          top: Platform.OS === 'ios' ? pageY : pageY - height,
          left: pageX,
          width: width,
        });
      });
    }
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleSelect = useCallback(
    (selectedValue: string) => {
      setSelectedValue(selectedValue);
      setIsOpen(false);
      onChange?.({ name, value: selectedValue });
    },
    [onChange, name],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value, setSelectedValue]);

  return (
    <View className={clsx(classes.container, className)}>
      {label && (
        <Text className={classes.label}>
          {label}
          {required && <Text className={classes.required}>*</Text>}
        </Text>
      )}
      <View ref={selectRef} className={classes.selectRefContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          testID="select"
          className={clsx(classes.input, inputClassName)}
          onPress={handleToggle}
          disabled={disabled}
        >
          <Text
            className={clsx(
              classes.inputText,
              !selectedValue && classes.inputTextPlaceholder,
            )}
          >
            {selectedValue
              ? options.find((opt) => opt.value === selectedValue)?.label
              : placeholder}
          </Text>
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={getColor('slate-700')}
            className={clsx(classes.chevronIcon, isOpen && 'rotate-180')}
          />
        </TouchableOpacity>

        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={handleClose}
        >
          <Pressable className={classes.backdrop} onPress={handleClose}>
            <View
              style={{
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: 210,
              }}
              className={classes.modalDropdown}
            >
              <ScrollView
                showsVerticalScrollIndicator={true}
                bounces={false}
                keyboardShouldPersistTaps="always"
              >
                {options.map((option, idx) => (
                  <React.Fragment key={option.value}>
                    <TouchableOpacity
                      className={classes.dropdownOption}
                      onPress={() => handleSelect(option.value)}
                      activeOpacity={0.7}
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
          </Pressable>
        </Modal>
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
    'flex flex-row justify-between items-center border border-slate-200 text-gray-700 rounded-lg px-4 bg-white h-[46px] disabled:opacity-70',
  error: 'text-red-500 text-sm',
  inputText: 'text-gray-700 flex-1',
  inputTextPlaceholder: 'text-gray-400',
  chevronIcon: 'mt-0.5',
  dropdown:
    'absolute left-0 right-0 top-full bg-white border border-slate-200 rounded-lg shadow-lg shadow-black/10 mt-1 z-[999] elevation-5',
  dropdownOption: 'px-4 py-3',
  dropdownOptionText: 'text-gray-600',
  dropdownSeparator: 'h-px bg-gray-100',
  selectRefContainer: 'relative z-10',
  backdrop: 'flex-1 bg-black/20',
  modalDropdown:
    'bg-white py-2 border border-slate-200 rounded-lg shadow-lg shadow-black/10',
};
