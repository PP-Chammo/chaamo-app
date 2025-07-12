import { memo, useCallback, useMemo } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { Icon, Label, Row } from '@/components/atoms';
import { conditions } from '@/constants/condition';
import { SearchStore } from '@/stores/searchStore';
import { getColor } from '@/utils/getColor';

interface FilterConditionInputProps {
  value: string;
  onChange: (key: keyof SearchStore, value: string) => void;
}

const FilterConditionInput: React.FC<FilterConditionInputProps> = memo(
  function FilterConditionInput({ value, onChange }) {
    const splittedValues = useMemo(
      () => value.split(',').map((item) => item.trim()),
      [value],
    );

    const handleToggleValue = useCallback(
      (value: string) => () => {
        if (splittedValues.includes(value)) {
          const newValues = splittedValues.filter(
            (item) => item !== value && item !== '',
          );
          onChange('condition', newValues.join(','));
        } else {
          const newValues = [
            ...splittedValues.filter((item) => item !== ''),
            value,
          ];
          onChange('condition', newValues.join(','));
        }
      },
      [onChange, splittedValues],
    );

    return (
      <View testID="filter-condition-input" className={classes.container}>
        <Row className={classes.labelContainer}>
          <Icon
            name="check-decagram-outline"
            size={22}
            color={getColor('gray-600')}
          />
          <Label className={classes.label}>Condition</Label>
        </Row>
        <Row className={classes.inputContainer}>
          {conditions.map((condition) => (
            <TouchableOpacity
              key={condition.value}
              testID={`filter-condition-button-${condition.value}`}
              onPress={handleToggleValue(condition.value)}
              activeOpacity={0.5}
              className={classes.filterButton}
            >
              {splittedValues.includes(condition.value) && (
                <Icon
                  name="check-circle"
                  color={getColor('teal-600')}
                  size={20}
                />
              )}
              <Label
                className={classes.text}
                testID={`filter-condition-label-${condition.value}`}
              >
                {condition.label}
              </Label>
            </TouchableOpacity>
          ))}
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
    'flex flex-row items-center gap-3 ml-12 py-2 border-b border-gray-300',
  filterButton:
    'bg-white min-w-20 min-h-9 px-3 flex flex-row justify-center items-center gap-1 border border-gray-200 rounded-full shadow-sm',
  text: 'text-sm text-gray-600',
};

export default FilterConditionInput;
