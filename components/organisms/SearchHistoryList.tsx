import { memo } from 'react';

import { TouchableOpacity } from 'react-native';

import { Label, Icon, Row } from '@/components/atoms';
import { ListContainer, ListContainerDirection } from '@/components/molecules';
import { getColor } from '@/utils/getColor';

interface SearchHistoriesProps {
  list?: string[];
  onRemovePress: (historyText: string) => void;
  onClearAllPress: () => void;
  onHistoryPress: (searchText: string) => void;
}

const SearchHistories: React.FC<SearchHistoriesProps> = memo(
  function SearchHistories({
    list,
    onRemovePress,
    onClearAllPress,
    onHistoryPress,
  }) {
    return (
      <ListContainer
        title="Recent Search"
        onViewAllHref="/screens/search"
        data={list ?? []}
        className={classes.container}
        contentContainerClassName={classes.contentContainer}
        titleLink="Clear All"
        onPress={onClearAllPress}
        listDirection={ListContainerDirection.Vertical}
      >
        {(item: string) => (
          <Row between className={classes.itemRow}>
            <TouchableOpacity
              onPress={() => onHistoryPress(item)}
              className={classes.searchText}
            >
              <Label className={classes.itemText}>{item}</Label>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onRemovePress(item)}>
              <Icon name="close" size={20} color={getColor('slate-600')} />
            </TouchableOpacity>
          </Row>
        )}
      </ListContainer>
    );
  },
);

const classes = {
  container: 'mt-4.5',
  contentContainer: '!gap-3',
  itemRow: 'py-2',
  itemText: 'text-base',
  searchText: 'flex-1',
};

export default SearchHistories;
