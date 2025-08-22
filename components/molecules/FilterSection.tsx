import { memo, useMemo } from 'react';

import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, Label, Row } from '@/components/atoms';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useSearchVar } from '@/hooks/useSearchVar';
import { useUserVar } from '@/hooks/useUserVar';

interface FilterSectionProps {
  resultCount?: number | string;
}

const FilterSection: React.FC<FilterSectionProps> = memo(
  function FilterSection({ resultCount = 0 }) {
    const [user] = useUserVar();
    const [search, setSearch] = useSearchVar();
    const { formatDisplay } = useCurrencyDisplay();

    const priceRange = useMemo(() => {
      if (!search?.priceRange) return '';
      const [min, max] = search.priceRange.split(',');
      return `${formatDisplay(user?.profile?.currency, min.length > 0 ? min : '0', { unfixed: true })} - ${max.length > 0 ? formatDisplay(user?.profile?.currency, max, { unfixed: true }) : 'Any'}`;
    }, [formatDisplay, search.priceRange, user?.profile?.currency]);

    const conditions = useMemo(() => {
      if (!search?.condition) return [];
      return search.condition.split(',');
    }, [search.condition]);

    return (
      <View testID="filter-section">
        <ScrollView
          testID="filter-scroll-view"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName={classes.filterContainer}
        >
          <Button
            testID="filter-advanced-button"
            onPress={() => router.push('/screens/advanced-filter')}
            variant="primary-light"
            size="small"
            icon="sliders"
            iconVariant="FontAwesome"
            className={classes.filterButtonWithClose}
          >
            Filters
          </Button>
          {!!search?.query && (
            <Button
              testID="filter-search-button"
              variant="light"
              size="small"
              className={classes.filterButtonWithClose}
              rightIcon="close"
              onPress={() => setSearch({ query: '' })}
            >
              {search?.query}
            </Button>
          )}
          {!!search?.category && (
            <Button
              testID="filter-category-button"
              variant="light"
              size="small"
              className={classes.filterButton}
              onPress={() => setSearch({ category: '' })}
            >
              {search?.category}
            </Button>
          )}
          {!!search?.location && (
            <Button
              testID="filter-location-button"
              variant="light"
              size="small"
              className={classes.filterButtonWithClose}
              rightIcon="close"
              onPress={() => setSearch({ location: '' })}
            >
              {search?.location}
            </Button>
          )}
          {!!search?.priceRange && (
            <Button
              testID="filter-price-button"
              variant="light"
              size="small"
              className={classes.filterButtonWithClose}
              rightIcon="close"
              onPress={() => setSearch({ priceRange: '' })}
            >
              {priceRange}
            </Button>
          )}
          {!!search?.condition &&
            conditions.map((condition) => (
              <Button
                key={condition}
                testID="filter-condition-button"
                variant="light"
                size="small"
                className={classes.filterButtonWithClose}
                rightIcon="close"
                onPress={() =>
                  setSearch({
                    condition: conditions
                      .filter((c) => c !== condition)
                      .join(','),
                  })
                }
              >
                {condition}
              </Button>
            ))}
          {!!search?.adProperties && (
            <Button
              testID="filter-adProperties-button"
              variant="light"
              size="small"
              className={classes.filterButtonWithClose}
              rightIcon="close"
              onPress={() => setSearch({ adProperties: '' })}
            >
              {search?.adProperties}
            </Button>
          )}
        </ScrollView>
        {(!!search.query || !!search.category) && (
          <Row className={classes.filterTextContainer}>
            <Label className={classes.filterPlaceholder}>Showing:</Label>
            <Label className={classes.resultText} testID="filter-result-text">
              {resultCount} results for {search?.query || search?.category}
            </Label>
          </Row>
        )}
      </View>
    );
  },
);

const classes = {
  filterContainer: 'px-4.5 py-3 gap-2',
  filterButtonWithClose: '!px-3',
  filterButton: '!px-5',
  filterTextContainer: 'px-4.5 pt-1 pb-4 !gap-1',
  filterPlaceholder: 'font-light text-gray-500',
  resultText: 'font-semibold',
};

export default FilterSection;
