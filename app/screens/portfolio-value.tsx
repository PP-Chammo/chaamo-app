import { useMemo } from 'react';

import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, View } from 'react-native';

import { Boost, Icon, Label, Row, ScreenContainer } from '@/components/atoms';
import {
  Chart,
  Header,
  ListContainer,
  ListingCard,
} from '@/components/molecules';
import { dummyPortfolioValueData } from '@/constants/dummy';
import {
  ListingType,
  OrderByDirection,
  useGetVwChaamoListingsQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';
import { getIndicator } from '@/utils/getIndicator';

cssInterop(ScrollView, {
  className: {
    target: 'style',
  },
  contentContainerClassName: {
    target: 'contentContainerStyle',
  },
});

export default function PortfolioValueScreen() {
  const [user] = useUserVar();
  const { formatDisplay } = useCurrencyDisplay();

  const { data } = useGetVwChaamoListingsQuery({
    skip: !user?.id,
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        seller_id: { eq: user?.id },
      },
      orderBy: {
        created_at: OrderByDirection.DESCNULLSLAST,
      },
    },
  });

  const mostValuableList = useMemo(
    () => data?.vw_chaamo_cardsCollection?.edges ?? [],
    [data?.vw_chaamo_cardsCollection?.edges],
  );

  const lastSoldPrice = useMemo(() => {
    const lastSold = mostValuableList?.find(
      (edge) => edge.node.listing_type === ListingType.SELL,
    );

    return lastSold?.node.last_sold_price ?? 0;
  }, [mostValuableList]);

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
            <Label className={classes.currentCollectionValue}>
              {formatDisplay(user?.profile?.currency, lastSoldPrice)}
            </Label>
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
              <Label className={classes.currentCollectionValue}>
                {formatDisplay(user?.profile?.currency, 0)}
              </Label>
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
              <Label className={classes.currentCollectionValue}>
                {formatDisplay(user?.profile?.currency, 0)}
              </Label>
            </View>
          </Row>
        </View>
        <ListContainer
          title="Most Valuable"
          titleLink="View Portfolio"
          onViewAllHref={{
            pathname: '/(tabs)/profile',
            params: {
              userId: user?.id,
            },
          }}
          data={mostValuableList}
        >
          {(item) => (
            <ListingCard
              type={item.node.listing_type}
              id={item.node.id}
              imageUrls={item.node.image_urls ?? ''}
              title={item.node.name ?? ''}
              currency={item.node?.currency}
              price={item.node?.start_price}
              marketCurrency={item.node?.last_sold_currency}
              marketPrice={item.node?.last_sold_price}
              lastSoldIsChecked={item.node?.last_sold_is_checked ?? false}
              lastSoldIsCorrect={item.node?.last_sold_is_correct ?? false}
              indicator={getIndicator(
                item.node?.start_price,
                item.node?.last_sold_price,
              )}
              onPress={() =>
                router.push({
                  pathname: '/screens/listing-detail',
                  params: {
                    id: item.node.id,
                  },
                })
              }
              rightComponent={<Boost boosted={item.node.is_boosted ?? false} />}
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
