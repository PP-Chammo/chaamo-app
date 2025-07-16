import { memo, useMemo } from 'react';

import { TextInput, View } from 'react-native';

import { Icon, Label, Row } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface FilterPriceRangeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FilterPriceRangeInput: React.FC<FilterPriceRangeInputProps> = memo(
  function FilterLocationInput({ value, onChange }) {
    const [minPrice, maxPrice] = useMemo(() => {
      if (!value) return ['', ''];
      const [min, max] = value.split(',');
      return [min || '', max || ''];
    }, [value]);

    const handleChange = (index: number) => (text: string) => {
      let newMin = minPrice;
      let newMax = maxPrice;
      if (index === 0) newMin = text;
      if (index === 1) newMax = text;
      const joined = `${newMin},${newMax}`;
      onChange(joined);
    };

    return (
      <View testID="filter-price-range-input" className={classes.container}>
        <Row className={classes.labelContainer}>
          <Icon
            name="dollar-sign"
            variant="Feather"
            size={22}
            color={getColor('gray-600')}
          />
          <Label className={classes.label}>Price Range</Label>
        </Row>
        <Row className={classes.inputContainer}>
          <TextInput
            testID="filter-price-min-input"
            value={minPrice}
            placeholder="0"
            onChangeText={handleChange(0)}
            className={classes.input}
          />
          <Label>to</Label>
          <TextInput
            testID="filter-price-max-input"
            value={maxPrice}
            placeholder="Any"
            onChangeText={handleChange(1)}
            className={classes.input}
          />
        </Row>
      </View>
    );
  },
);

const classes = {
  container: 'gap-2',
  labelContainer: 'flex flex-row items-center gap-5',
  label: 'text-gray-600 text-base font-semibold',
  inputContainer:
    'flex flex-row items-center justify-between self-end gap-4 pl-11 pt-2',
  input:
    'flex-1 bg-white text-gray-800 text-center h-9 leading-5 text-base border border-gray-200 rounded',
};

export default FilterPriceRangeInput;
