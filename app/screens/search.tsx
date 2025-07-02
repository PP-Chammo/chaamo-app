import { useCallback, useRef, useState } from 'react';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { TextInput } from 'react-native';

import { Row, ScreenContainer, SearchField } from '@/components/atoms';
import { ButtonIcon } from '@/components/molecules';
import { SearchHistories } from '@/components/organisms';
import { TextChangeParams } from '@/domains';
import { useStorage } from '@/hooks/useStorage';
import { getColor } from '@/utils/getColor';

export default function CardsScreen() {
  const searchRef = useRef<TextInput>(null);
  const { getStorage, setStorage, appendStorage, removeStorage } = useStorage();
  const query = useLocalSearchParams();

  const [searchText, setSearchText] = useState('');
  const [historyList, setHistoryList] = useState<string[]>([]);

  const handleChange = useCallback(({ value }: TextChangeParams) => {
    setSearchText(value);
  }, []);

  const filterOutItem = useCallback((item: string, list: string[]) => {
    return list.filter((v) => v !== item);
  }, []);

  const handleClear = useCallback(
    (item: string) => async () => {
      setHistoryList((prev = []) => filterOutItem(item, prev));
      const currentHistories = await getStorage<string[]>('searchHistories');
      if ((currentHistories?.length ?? 0) > 0) {
        const updatedHistories = currentHistories?.filter(
          (searchText) => searchText !== item,
        );
        await setStorage('searchHistories', updatedHistories);
      }
    },
    [filterOutItem, getStorage, setStorage],
  );

  const handleClearAll = useCallback(() => {
    setHistoryList([]);
    removeStorage('searchHistories');
  }, [removeStorage]);

  const handleSubmitSearch = useCallback(
    (searchQuery?: string) => {
      const cleanSearch = searchQuery?.trim();
      if (cleanSearch) {
        setSearchText(cleanSearch);
        if (!historyList.includes(cleanSearch)) {
          appendStorage<string>('searchHistories', cleanSearch);
        }
        router.push({
          pathname: '/screens/cards',
          params: { search: cleanSearch },
        });
      }
    },
    [appendStorage, historyList],
  );

  useFocusEffect(
    useCallback(() => {
      if (query?.focus === 'true') {
        setTimeout(() => {
          if (searchRef?.current) {
            searchRef?.current?.focus();
          }
        }, 100);
      }
    }, [query?.focus]),
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const histories = await getStorage<string[]>('searchHistories');
          if (histories && Array.isArray(histories)) {
            setHistoryList(histories);
          } else {
            setStorage('searchHistories', []);
          }
        } catch (e: unknown) {
          console.error('Failed to load search histories:', e);
        }
      })();
    }, [getStorage, setStorage]),
  );

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Row className={classes.headerContainer}>
        <ButtonIcon
          name="arrow-left"
          onPress={() => router.back()}
          iconSize={24}
          color={getColor('gray-500')}
        />
        <SearchField
          ref={searchRef}
          value={searchText}
          onChange={handleChange}
          onSubmitEditing={() => handleSubmitSearch(searchText)}
        />
      </Row>
      <SearchHistories
        list={historyList}
        onRemovePress={handleClear}
        onClearAllPress={handleClearAll}
        onHistoryPress={handleSubmitSearch}
      />
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  headerContainer: 'bg-white pl-2 pr-5 py-5',
  filterContainer: 'px-5 py-3',
  filterButton: '!px-4 !py-2',
  filterTextContainer: 'px-5 py-3 !gap-1',
  filterPlaceholder: 'font-light text-gray-500',
  resultText: 'font-semibold',
  contentContainer: 'gap-3',
};
