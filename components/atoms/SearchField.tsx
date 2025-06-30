import { memo } from 'react';

import { clsx } from 'clsx';
import { TextInput, TextInputProps } from 'react-native';

import { TextChangeParams } from '@/domains';

interface SearchFieldProps extends Omit<TextInputProps, 'onChange'> {
  onChange: ({ name, value }: TextChangeParams) => void;
  className?: string;
}

const SearchField: React.FC<SearchFieldProps> = memo(function SearchField({
  value,
  onChange,
  className,
  ...props
}) {
  const handleChange = (value: string) => {
    onChange({ name: 'search', value });
  };

  return (
    <TextInput
      placeholder="Search"
      className={clsx(classes.input, className)}
      onChangeText={handleChange}
      enterKeyHint="search"
      {...props}
    />
  );
});

const classes = {
  input:
    'flex-1 rounded-lg border border-teal-100/60 rounded-md px-4 bg-gray-50 h-[38px]',
};

export default SearchField;
