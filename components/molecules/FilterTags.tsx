import { memo, useMemo } from 'react';

import { Button, Row } from '@/components/atoms';
import { useSearchVar } from '@/hooks/useSearchVar';

const FilterTags = memo(function FilterTags() {
  const [searchVar] = useSearchVar();

  const filters = useMemo(() => {
    let filters: string[] = [];
    if (searchVar.query) {
      filters = [...filters, searchVar.query.trim()];
    }
    if (searchVar.location.length > 0) {
      const splittedLocation = searchVar.location
        .split(',')
        .map((loc) => loc.trim());
      filters = [...filters, ...splittedLocation];
    }
    if (searchVar.priceRange.length > 0) {
      const [min, max] = searchVar.priceRange
        .split(',')
        .map((price) => price.trim());
      filters.push(
        `${min.length > 0 ? '$' + min : '0'} - ${max.length > 0 ? '$' + Number(max) : 'Any'}`,
      );
    }
    if (searchVar.condition.length > 0) {
      const splittedCondition = searchVar.condition
        .split(',')
        .map((loc) => loc.trim());
      filters = [...filters, ...splittedCondition];
    }
    if (searchVar.adProperties.length > 0) {
      const splittedAdProperties = searchVar.adProperties
        .split(',')
        .map((loc) => loc.trim());
      filters = [...filters, ...splittedAdProperties];
    }
    return filters.filter((filter) => filter.trim().length > 0);
  }, [
    searchVar.adProperties,
    searchVar.condition,
    searchVar.location,
    searchVar.priceRange,
    searchVar.query,
  ]);

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
