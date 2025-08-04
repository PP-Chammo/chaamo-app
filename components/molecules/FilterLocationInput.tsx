import React, { memo, useCallback, useState } from 'react';

import { ScrollView, TouchableOpacity, View } from 'react-native';

import countries from '@/assets/data/countries.json';
import { Icon, Label, Row } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface FilterLocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FilterLocationInput: React.FC<FilterLocationInputProps> = memo(
  function FilterLocationInput({ value, onChange }) {
    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => {
      setOpen(!open);
    }, [open]);

    // Convert countries data to options format
    const countryOptions = countries.map((country) => ({
      label: country.name,
      value: country.name,
    }));

    const handleSelect = useCallback(
      (countryName: string) => {
        onChange(countryName);
        setOpen(false);
      },
      [onChange],
    );

    // Find the selected country label for display
    const selectedCountry = countryOptions.find(
      (option) => option.value === value,
    );
    const selectedLabel = selectedCountry?.label || value;

    return (
      <Row testID="filter-location-input" className={classes.rowContainer}>
        <Icon
          name="location-pin"
          variant="SimpleLineIcons"
          size={24}
          color={getColor('gray-600')}
        />
        <View className={classes.inputContainer}>
          <TouchableOpacity
            testID="filter-location-button"
            onPress={handleOpen}
            className={classes.input}
            activeOpacity={0.7}
          >
            <View>
              {!selectedLabel ? (
                <Label className={classes.label}>Location</Label>
              ) : (
                <Label testID="filter-location-value">{selectedLabel}</Label>
              )}
            </View>
            <Icon
              name={open ? 'chevron-up' : 'chevron-down'}
              size={28}
              color={getColor('gray-600')}
            />
          </TouchableOpacity>
          {open && (
            <View className={classes.dropdown}>
              <ScrollView
                className="max-h-[180px]"
                showsVerticalScrollIndicator={false}
              >
                {countryOptions.map((option, idx) => (
                  <React.Fragment key={option.value}>
                    <TouchableOpacity
                      className={classes.dropdownOption}
                      onPress={() => handleSelect(option.value)}
                    >
                      <Label className={classes.dropdownOptionText}>
                        {option.label}
                      </Label>
                    </TouchableOpacity>
                    {idx < countryOptions.length - 1 && (
                      <View className={classes.dropdownSeparator} />
                    )}
                  </React.Fragment>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Row>
    );
  },
);

const classes = {
  rowContainer: 'gap-4',
  label: 'text-gray-600 text-base font-semibold',
  input:
    'flex-1 flex flex-row justify-between items-center h-12 pl-1 border-b border-gray-300 rounded-lg shadow-sm',
  inputContainer: 'relative flex-1',
  dropdown:
    'absolute left-0 right-0 top-full max-h-[180px] bg-white border border-slate-200 rounded-lg shadow-lg shadow-black/10 mt-1 z-50 overflow-hidden',
  dropdownOption: 'px-4 py-3',
  dropdownOptionText: 'text-gray-600',
  dropdownSeparator: 'h-px bg-gray-100',
};

export default FilterLocationInput;
