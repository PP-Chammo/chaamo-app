import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, View } from 'react-native';

import { Icon, Label, Row, ScreenContainer } from '@/components/atoms';
import {
  Chart,
  CommonCard,
  Header,
  ListContainer,
} from '@/components/molecules';
import {
  dummyFeaturedCardList,
  dummyPortfolioValueData,
} from '@/constants/dummy';
import { getColor } from '@/utils/getColor';

cssInterop(ScrollView, {
  className: {
    target: 'style',
  },
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function PortfolioValueScreen() {
  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Portfolio Value"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className={classes.currentCollectionContainer}>
          <View className={classes.currentCollectionContainerGreen}>
            <Label className={classes.currentCollectionTitle}>
              Your current collection
            </Label>
            <Label className={classes.currentCollectionValue}>$2000</Label>
          </View>
          <Row className={classes.currentCollectionRow}>
            <View className={classes.currentCollectionContainerYellow}>
              <Row className={classes.currentCollectionTitleRow}>
                <Label className={classes.currentCollectionTitle}>
                  Sold items
                </Label>
                <Icon
                  name="trending-up"
                  color={getColor('primary-500')}
                  size={20}
                />
              </Row>
              <Label className={classes.currentCollectionValue}>$300</Label>
            </View>
            <View className={classes.currentCollectionContainerRed}>
              <Row className={classes.currentCollectionTitleRow}>
                <Label className={classes.currentCollectionTitle}>
                  Pending
                </Label>
                <Icon
                  name="trending-down"
                  color={getColor('red-600')}
                  size={20}
                />
              </Row>
              <Label className={classes.currentCollectionValue}>$500</Label>
            </View>
          </Row>
        </View>
        <ListContainer
          title="Recently Added"
          onViewAllHref="/screens/product-list"
          data={dummyFeaturedCardList}
        >
          {(featured: (typeof dummyFeaturedCardList)[number]) => (
            <CommonCard
              id={featured.id}
              key={featured.id}
              imageUrl={featured.imageUrl}
              title={featured.title}
              price={featured.price}
              marketPrice={featured.marketPrice}
              marketType={featured.marketType}
              indicator={featured.indicator}
              rightIcon="heart-outline"
              onRightIconPress={() => {
                console.log(`Favorite pressed for card ${featured.id}`);
              }}
            />
          )}
        </ListContainer>
        <View className={classes.chartContainer}>
          <Chart data={dummyPortfolioValueData} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  header: 'bg-white',
  currentCollectionContainer: 'px-4.5 pt-4.5',
  currentCollectionContainerGreen:
    'flex-1 gap-1.5 bg-primary-100/40 rounded-lg p-4',
  currentCollectionContainerYellow:
    'flex-1 gap-1.5 bg-orange-100/60 rounded-lg p-4',
  currentCollectionContainerRed: 'flex-1 gap-1.5 bg-red-100/60 rounded-lg p-4',
  currentCollectionTitle: 'text-sm font-light text-gray-900',
  currentCollectionValue: '!text-2xl font-bold',
  currentCollectionRow: 'flex-1 gap-4 py-4',
  currentCollectionTitleRow: 'gap-2',
  chartContainer: 'p-4.5',
};
