import { memo, useMemo } from 'react';

import { Button, Row } from '@/components/atoms';
import { useSearchStore } from '@/hooks/useSearchStore';

const FilterTags = memo(function FilterTags() {
  const { query, condition, location, priceRange, adProperties } =
    useSearchStore();

  const filters = useMemo(() => {
    let filters: string[] = [];
    if (query) {
      filters = [...filters, query.trim()];
    }
    if (location.length > 0) {
      const splittedLocation = location.split(',').map((loc) => loc.trim());
      filters = [...filters, ...splittedLocation];
    }
    if (priceRange.length > 0) {
      const [min, max] = priceRange.split(',').map((price) => price.trim());
      filters.push(
        `${min.length > 0 ? '$' + min : '0'} - ${max.length > 0 ? '$' + Number(max) : 'Any'}`,
      );
    }
    if (condition.length > 0) {
      const splittedCondition = condition.split(',').map((loc) => loc.trim());
      filters = [...filters, ...splittedCondition];
    }
    if (adProperties.length > 0) {
      const splittedAdProperties = adProperties
        .split(',')
        .map((loc) => loc.trim());
      filters = [...filters, ...splittedAdProperties];
    }
    return filters.filter((filter) => filter.trim().length > 0);
  }, [adProperties, condition, location, priceRange, query]);

  return (
    <Row testID="filter-tags" className={classes.container}>
      {filters.map((filter) => (
        <Button
          key={filter}
          testID={`filter-tag-${filter}`}
          size="small"
          variant="light"
        >
          {filter}
        </Button>
      ))}
    </Row>
  );
});

const classes = {
  container: 'flex flex-wrap gap-2 p-5',
};

export default FilterTags;
