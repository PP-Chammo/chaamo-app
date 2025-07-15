import { forwardRef, memo, useCallback } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface SearchFieldProps extends Omit<TextInputProps, 'onChange'> {
  value: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  onPress?: () => void;
  onSubmit?: () => void;
  className?: string;
  inputClassName?: string;
  testID?: string;
}

const SearchField = forwardRef<TextInput, SearchFieldProps>(
  function SearchField(
    {
      value,
      onChange,
      onPress,
      onSubmit,
      className,
      inputClassName,
      testID,
      ...props
    },
    ref,
  ) {
    const handleChange = useCallback(
      (value: string) => {
        onChange({ name: 'search', value });
      },
      [onChange],
    );

    const handleClear = useCallback(() => {
      onChange({ name: 'search', value: '' });
    }, [onChange]);

    return (
      <View testID={testID} className={clsx(classes.container, className)}>
        <TextInput
          ref={ref}
          value={value}
          placeholder="Search"
          className={clsx(classes.input, inputClassName)}
          onChangeText={handleChange}
          enterKeyHint="search"
          onPress={onPress}
          onSubmitEditing={() => onSubmit?.()}
          {...props}
        />
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleClear}
          className={clsx(classes.clearButton, value.length === 0 && 'hidden')}
        >
          <MaterialCommunityIcons
            name="close"
            size={18}
            color={getColor('gray-600')}
          />
        </TouchableOpacity>
      </View>
    );
  },
);

const classes = {
  container: 'relative flex-1 h-11',
  input:
    'flex-1 rounded-lg border border-primary-100/60 rounded-md px-4 bg-gray-50 h-[38px]',
  clearButton: 'absolute right-0 top-1/2 -translate-y-1/2 p-3',
};

export default memo(SearchField);
