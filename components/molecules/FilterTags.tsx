import { memo, useMemo } from 'react';

import { Button, Row } from '@/components/atoms';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useSearchVar } from '@/hooks/useSearchVar';
import { useUserVar } from '@/hooks/useUserVar';

const FilterTags = memo(function FilterTags() {
  const [user] = useUserVar();
  const [search, setSearch] = useSearchVar();
  const { formatDisplay } = useCurrencyDisplay();

  const filters = useMemo(() => {
    let filters: Record<string, string>[] = [];
    if (search.query) {
      filters = [
        ...filters,
        {
          key: 'query',
          value: search.query,
        },
      ];
    }
    if (search.category) {
      filters = [
        ...filters,
        {
          key: 'category',
          value: search.category,
        },
      ];
    }
    if (search.location.length > 0) {
      const splittedLocation = search.location
        .split(',')
        .map((loc) => loc.trim());
      filters = [
        ...filters,
        ...splittedLocation.map((location) => ({
          key: 'location',
          value: location,
        })),
      ];
    }
    if (search.priceRange.length > 0) {
      const [min, max] = search.priceRange
        .split(',')
        .map((price) => price.trim());
      filters = [
        ...filters,
        {
          key: 'priceRange',
          value: `${formatDisplay(user?.profile?.currency, min.length > 0 ? min : 0, { unfixed: true })} - ${max.length > 0 ? formatDisplay(user?.profile?.currency, max, { unfixed: true }) : 'Any'}`,
        },
      ];
    }
    if (search.condition.length > 0) {
      const splittedCondition = search.condition
        .split(',')
        .map((loc) => loc.trim());
      filters = [
        ...filters,
        ...splittedCondition.map((condition) => ({
          key: 'condition',
          value: condition,
        })),
      ];
    }
    if (search.adProperties.length > 0) {
      const splittedAdProperties = search.adProperties
        .split(',')
        .map((loc) => loc.trim());
      filters = [
        ...filters,
        ...splittedAdProperties.map((adProperty) => ({
          key: 'adProperties',
          value: adProperty,
        })),
      ];
    }
    return filters.filter((filter) => filter.value.trim().length > 0);
  }, [
    formatDisplay,
    search.adProperties,
    search.category,
    search.condition,
    search.location,
    search.priceRange,
    search.query,
    user?.profile?.currency,
  ]);

  return (
    <Row testID="filter-tags" className={classes.container}>
      {filters.map(({ key, value }) => (
        <Button
          key={value}
          testID={`filter-tag-${value}`}
          size="small"
          variant="light"
          onPress={() => {
            if (['condition', 'adProperties'].includes(key)) {
              setSearch({
                ...search,
                [key]: (search?.[key as keyof typeof search] ?? '')
                  .split(',')
                  .filter((item) => item !== value)
                  .join(','),
              });
            } else {
              setSearch({
                ...search,
                [key]: '',
              });
            }
          }}
        >
          {String(value)}
        </Button>
      ))}
    </Row>
  );
});

const classes = {
  container: 'flex flex-wrap gap-2 p-5',
};

export default FilterTags;
