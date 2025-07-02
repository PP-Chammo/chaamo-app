import { memo } from 'react';

import { TouchableOpacity, FlatList } from 'react-native';

import { Label, Icon, Row } from '@/components/atoms';
import { GroupWithLink } from '@/components/molecules';
import { getColor } from '@/utils/getColor';

interface SearchHistoriesProps {
  list?: string[];
  onRemovePress: (historyText: string) => void;
  onClearAllPress: () => void;
  onHistoryPress: (searchText: string) => void;
  className?: string;
}

const SearchHistories: React.FC<SearchHistoriesProps> = memo(
  function SearchHistories({
    list,
    onRemovePress,
    onClearAllPress,
    onHistoryPress,
    className,
  }) {
    return (
      <GroupWithLink
        title="Recent Search"
        titleLink="Clear All"
        onPress={onClearAllPress}
        className={className}
      >
        <FlatList
          data={list}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Row between className={classes.itemRow}>
              <TouchableOpacity
                onPress={() => onHistoryPress(item)}
                className={classes.searchText}
              >
                <Label className={classes.itemText}>{item}</Label>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onRemovePress(item)}>
                <Icon name="close" size={20} color={getColor('gray-600')} />
              </TouchableOpacity>
            </Row>
          )}
          className={classes.list}
        />
      </GroupWithLink>
    );
  },
);

const classes = {
  container: 'mt-2',
  headerRow: 'mb-2',
  title: 'font-bold text-base',
  clearAll: 'text-teal-500 font-bold',
  itemRow: 'py-2',
  itemText: 'text-base',
  list: 'p-5',
  searchText: 'flex-1',
};

export default SearchHistories;
