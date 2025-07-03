import { memo, useMemo } from 'react';

import { TextInput, View } from 'react-native';

import { Icon, Label, Row } from '@/components/atoms';
import { SearchStore } from '@/stores/searchStore';
import { getColor } from '@/utils/getColor';

interface FilterPriceRangeInputProps {
  value: string;
  onChange: (key: keyof SearchStore, value: string) => void;
}

const FilterPriceRangeInput: React.FC<FilterPriceRangeInputProps> = memo(
  function FilterLocationInput({ value, onChange }) {
    const [minPrice, maxPrice] = useMemo(
      () => value.split(',').map((item) => item.trim()),
      [value],
    );

    const handleChange = (index: number) => (text: string) => {
      const newValue = [...value];
      newValue[index] = text;
      if (index === 0 && !newValue[1]) {
        newValue[1] = 'Any';
      }
      if (index === 1 && !newValue[0]) {
        newValue[0] = '0';
      }
      onChange('priceRange', newValue.join(','));
    };

    return (
      <View className={classes.container}>
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
            value={minPrice}
            placeholder="0"
            onChangeText={handleChange(0)}
            className={classes.input}
          />
          <Label>to</Label>
          <TextInput
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
