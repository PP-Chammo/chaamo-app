import { memo } from 'react';

import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, Label, Row } from '@/components/atoms';

interface FilterSectionProps {
  resultCount?: number;
  query?: string;
}

const FilterSection: React.FC<FilterSectionProps> = memo(
  function FilterSection({ resultCount = 0, query }) {
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
            className={classes.filterButton}
          >
            Filters
          </Button>
          <Button
            testID="filter-price-button"
            variant="light"
            size="small"
            className={classes.filterButton}
            rightIcon="close"
          >
            Price
          </Button>
          <Button
            testID="filter-condition-button"
            variant="light"
            size="small"
            className={classes.filterButton}
            rightIcon="close"
          >
            Condition
          </Button>
          <Button
            testID="filter-location-button"
            variant="light"
            size="small"
            className={classes.filterButton}
            rightIcon="close"
          >
            Location
          </Button>
        </ScrollView>
        {query && (
          <Row className={classes.filterTextContainer}>
            <Label className={classes.filterPlaceholder}>Showing:</Label>
            <Label className={classes.resultText} testID="filter-result-text">
              {resultCount} results for {query}
            </Label>
          </Row>
        )}
      </View>
    );
  },
);

const classes = {
  filterContainer: 'px-4.5 py-3 gap-2',
  filterButton: '!px-3',
  filterTextContainer: 'px-4.5 pt-1 pb-4 !gap-1',
  filterPlaceholder: 'font-light text-gray-500',
  resultText: 'font-semibold',
};

export default FilterSection;
