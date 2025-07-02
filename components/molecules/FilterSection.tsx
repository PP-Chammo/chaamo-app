import { memo } from 'react';

import { View } from 'react-native';

import { Button, Label, Row } from '@/components/atoms';

interface FilterSectionProps {
  resultCount?: number;
  query?: string;
}

const FilterSection: React.FC<FilterSectionProps> = memo(
  function FilterSection({ resultCount = 0, query }) {
    return (
      <View>
        <Row className={classes.filterContainer}>
          <Button
            variant="primary-light"
            size="small"
            icon="sliders"
            iconVariant="FontAwesome"
            className={classes.filterButton}
          >
            Filters
          </Button>
          <Button variant="light" size="small" className={classes.filterButton}>
            Price
          </Button>
          <Button variant="light" size="small" className={classes.filterButton}>
            Condition
          </Button>
          <Button variant="light" size="small" className={classes.filterButton}>
            Location
          </Button>
        </Row>
        {query && (
          <Row className={classes.filterTextContainer}>
            <Label className={classes.filterPlaceholder}>Showing:</Label>
            <Label className={classes.resultText}>
              {resultCount} results for {query}
            </Label>
          </Row>
        )}
      </View>
    );
  },
);

const classes = {
  filterContainer: 'px-5 py-3',
  filterButton: '!px-4 !py-2',
  filterTextContainer: 'px-5 pt-1 pb-4 !gap-1',
  filterPlaceholder: 'font-light text-gray-500',
  resultText: 'font-semibold',
};

export default FilterSection;
