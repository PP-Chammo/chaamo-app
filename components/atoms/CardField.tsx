import { memo, useMemo } from 'react';

import { clsx } from 'clsx';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { MasterCard, VisaCard } from '@/assets/svg';
import { TextChangeParams } from '@/domains/input.types';
import { formatCardField, validateCardNumber } from '@/utils/card';

interface CardFieldProps extends Omit<TextInputProps, 'onChange'> {
  value: string;
  onChange: ({ name, value }: TextChangeParams) => void;
  label: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  error?: string;
  name: string;
}

const CardField = memo(function CardField({
  value,
  onChange,
  label,
  required,
  className,
  inputClassName,
  error,
  name,
  ...props
}: CardFieldProps) {
  const handleChange = (text: string) => {
    const formatted = formatCardField(text);
    onChange({ name, value: formatted });
  };

  const cardValidation = useMemo(() => {
    return validateCardNumber(value);
  }, [value]);

  const renderCardIcon = () => {
    if (cardValidation.isVisa) {
      return <VisaCard />;
    }

    if (cardValidation.isMasterCard) {
      return <MasterCard />;
    }

    return null;
  };

  return (
    <View className={clsx(classes.container, className)}>
      {label && (
        <Text className={classes.label}>
          {label}
          {required && <Text className={classes.required}>*</Text>}
        </Text>
      )}
      <View>
        <TextInput
          value={value}
          onChangeText={handleChange}
          keyboardType="numeric"
          maxLength={19}
          className={clsx(classes.input, inputClassName)}
          {...props}
        />
        <View className={classes.cardIcon}>{renderCardIcon()}</View>
      </View>
      {error && <Text className={classes.error}>{error}</Text>}
      {value && value.length >= 4 && !cardValidation.isValid && (
        <Text className={classes.error}>Invalid card number</Text>
      )}
    </View>
  );
});

const classes = {
  container: 'gap-2',
  label: 'text-slate-500 font-medium text-md ml-4',
  required: 'text-red-500',
  inputContainer: 'relative',
  input:
    'rounded-lg border border-slate-200 text-gray-700 rounded-lg p-4 bg-white h-[48px]',
  error: 'text-red-500 text-sm',
  cardIcon: 'absolute right-4 translate-y-1/2 z-10',
};

export default CardField;
