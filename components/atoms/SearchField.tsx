import { forwardRef, memo, useCallback } from 'react';

import { clsx } from 'clsx';
import { TextInput, TextInputProps } from 'react-native';

import { TextChangeParams } from '@/domains';

interface SearchFieldProps extends Omit<TextInputProps, 'onChange'> {
  value: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  onPress?: () => void;
  className?: string;
}

const SearchField = forwardRef<TextInput, SearchFieldProps>(
  function SearchField({ value, onChange, onPress, className, ...props }, ref) {
    const handleChange = useCallback(
      (value: string) => {
        onChange({ name: 'search', value });
      },
      [onChange],
    );

    return (
      <TextInput
        ref={ref}
        value={value}
        placeholder="Search"
        className={clsx(classes.input, className)}
        onChangeText={handleChange}
        enterKeyHint="search"
        onPress={onPress}
        {...props}
      />
    );
  },
);

const classes = {
  input:
    'flex-1 rounded-lg border border-teal-100/60 rounded-md px-4 bg-gray-50 h-[38px]',
};

export default memo(SearchField);
