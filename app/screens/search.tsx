import { useCallback, useRef, useState } from 'react';

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { TextInput } from 'react-native';

import { ScreenContainer } from '@/components/atoms';
import { HeaderSearch } from '@/components/molecules';
import { SearchHistoryList } from '@/components/organisms';
import { TextChangeParams } from '@/domains';
import { useSearchVar } from '@/hooks/useSearchVar';
import { useStorage } from '@/hooks/useStorage';

export default function CardsScreen() {
  const searchRef = useRef<TextInput>(null);
  const { getStorage, setStorage, appendStorage, removeStorage } = useStorage();
  const params = useLocalSearchParams();
  const [searchVar, setSearchVar] = useSearchVar();

  const [historyList, setHistoryList] = useState<string[]>([]);

  const handleCtaBack = useCallback(() => {
    setSearchVar({ query: '' });
    router.back();
  }, [setSearchVar]);

  const handleChange = useCallback(
    ({ value }: TextChangeParams) => {
      setSearchVar({ query: value.trim() });
    },
    [setSearchVar],
  );

  const filterOutItem = useCallback((item: string, list: string[]) => {
    return list.filter((v) => v !== item);
  }, []);

  const handleClear = useCallback(
    async (item: string) => {
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

  const handleSubmitSearch = useCallback(
    (selectedQuery?: string) => {
      const trimmedQuery = searchVar.query.trim();
      if (selectedQuery) {
        setSearchVar({ query: selectedQuery });
      }
      if (!historyList.includes(trimmedQuery)) {
        appendStorage<string>('searchHistories', trimmedQuery);
      }
      router.push('/screens/product-list');
    },
    [appendStorage, historyList, searchVar.query, setSearchVar],
  );

  const handleClearAll = useCallback(() => {
    setHistoryList([]);
    removeStorage('searchHistories');
  }, [removeStorage]);

  useFocusEffect(
    useCallback(() => {
      if (params?.focus === 'true') {
        setTimeout(() => {
          if (searchRef?.current) {
            searchRef?.current?.focus();
          }
        }, 100);
      }
    }, [params?.focus]),
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
      <HeaderSearch
        value={searchVar.query}
        onChange={handleChange}
        onBackPress={handleCtaBack}
        onSubmit={handleSubmitSearch}
      />
      <SearchHistoryList
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
  filterContainer: 'px-4.5 py-3',
  filterButton: '!px-4 !py-2',
  filterTextContainer: 'px-4.5 py-3 !gap-1',
  filterPlaceholder: 'font-light text-gray-500',
  resultText: 'font-semibold',
  contentContainer: 'gap-3',
};
