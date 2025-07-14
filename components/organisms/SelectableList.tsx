import { memo, useMemo, useState } from 'react';

import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { Icon, Row } from '@/components/atoms';
import { TextField } from '@/components/molecules';
import { getColor } from '@/utils/getColor';

interface SelectableListProps {
  value: string;
  data: string[];
  onSelect: (item: string) => void;
}

const SelectableList: React.FC<SelectableListProps> = memo(
  function SelectSelectableList({
    data,
    onSelect,
    value,
  }: SelectableListProps) {
    const [search, setSearch] = useState<string>('');

    const filteredData = useMemo(
      () => data.filter((s) => s.toLowerCase().includes(search.toLowerCase())),
      [data, search],
    );

    return (
      <>
        <View className={classes.searchContainer}>
          <TextField
            name="search"
            placeholder="Search"
            value={search}
            onChange={({ value }) => setSearch(value)}
            leftIcon={
              <Icon name="magnify" size={24} color={getColor('slate-700')} />
            }
          />
        </View>
        <View className={classes.listContainer}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item}
            contentContainerClassName={classes.listContentContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                className={classes.stateItem}
              >
                <Row between>
                  <Text>{item}</Text>
                  {value === item && (
                    <Icon
                      name="check"
                      size={24}
                      color={getColor('primary-500')}
                    />
                  )}
                </Row>
              </TouchableOpacity>
            )}
          />
        </View>
      </>
    );
  },
);

const classes = {
  searchContainer: 'px-4.5',
  listContainer: 'px-4.5 mt-4.5 bg-white',
  stateItem: 'border-b border-gray-200 p-4.5',
  listContentContainer: 'gap-2.5',
};

export default SelectableList;
