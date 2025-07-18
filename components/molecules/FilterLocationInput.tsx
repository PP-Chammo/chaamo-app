import { memo, useCallback, useState } from 'react';

import { TouchableOpacity, View } from 'react-native';

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
      setOpen(true);
    }, []);

    return (
      <Row testID="filter-location-input" className={classes.rowContainer}>
        <Icon
          name="location-pin"
          variant="SimpleLineIcons"
          size={24}
          color={getColor('gray-600')}
        />
        <TouchableOpacity
          testID="filter-location-button"
          onPress={handleOpen}
          className={classes.input}
          activeOpacity={0.7}
        >
          <View>
            <Label className={classes.label}>Location</Label>
            {!!value && <Label testID="filter-location-value">{value}</Label>}
          </View>
          <Icon
            name={open ? 'chevron-up' : 'chevron-down'}
            size={28}
            color={getColor('gray-600')}
          />
        </TouchableOpacity>
      </Row>
    );
  },
);

const classes = {
  rowContainer: 'gap-4',
  label: 'text-gray-600 text-base font-semibold',
  input:
    'flex-1 flex flex-row justify-between items-center h-12 pl-1 border-b border-gray-300 rounded-lg shadow-sm',
};

export default FilterLocationInput;
