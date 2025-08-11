import { useMemo } from 'react';

import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Icon, Label, ProfileStat } from '@/components/atoms';
import {
  ListingStatus,
  ListingType,
  useGetProfilesQuery,
  useGetUserAddressesQuery,
  useGetVwChaamoListingsQuery,
} from '@/generated/graphql';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useUserVar } from '@/hooks/useUserVar';

export default function StatsProfile() {
  const { publicUserId } = useLocalSearchParams();
  const [user] = useUserVar();
  const { formatDisplay, convertSymbolToCurrency, convertCurrencyToSymbol } =
    useCurrencyDisplay();

  const { data: publicUserData } = useGetProfilesQuery({
    skip: !publicUserId,
    variables: {
      filter: {
        id: { eq: publicUserId },
      },
    },
  });

  const { data: addressData } = useGetUserAddressesQuery({
    variables: {
      filter: {
        user_id: { eq: publicUserId ?? user?.id },
      },
    },
  });

  const { data: listingsData } = useGetVwChaamoListingsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        seller_id: { eq: publicUserId ?? user?.id },
      },
    },
  });

  const publicUser = useMemo(() => {
    return publicUserData?.profilesCollection?.edges?.[0]?.node;
  }, [publicUserData?.profilesCollection?.edges]);

  const address = useMemo(
    () => addressData?.user_addressesCollection?.edges?.[0]?.node,
    [addressData?.user_addressesCollection?.edges],
  );

  const portfolioCount = useMemo(() => {
    return (
      listingsData?.vw_chaamo_cardsCollection?.edges
        ?.filter(
          (listing) => listing.node.listing_type === ListingType.PORTFOLIO,
        )
        .length?.toString() ?? '0'
    );
  }, [listingsData?.vw_chaamo_cardsCollection?.edges]);

  const soldCount = useMemo(() => {
    return (
      listingsData?.vw_chaamo_cardsCollection?.edges
        ?.filter((listing) => listing.node.status === ListingStatus.SOLD)
        .length?.toString() ?? '0'
    );
  }, [listingsData?.vw_chaamo_cardsCollection?.edges]);

  const auctionCount = useMemo(() => {
    return (
      listingsData?.vw_chaamo_cardsCollection?.edges
        ?.filter((listing) => listing.node.listing_type === ListingType.AUCTION)
        .length?.toString() ?? '0'
    );
  }, [listingsData?.vw_chaamo_cardsCollection?.edges]);

  const sellCount = useMemo(() => {
    return (
      listingsData?.vw_chaamo_cardsCollection?.edges
        ?.filter((listing) => listing.node.listing_type === ListingType.SELL)
        .length?.toString() ?? '0'
    );
  }, [listingsData?.vw_chaamo_cardsCollection?.edges]);

  const totalEarnings = useMemo(() => {
    return (
      listingsData?.vw_chaamo_cardsCollection?.edges
        ?.filter((listing) => listing.node.status === ListingStatus.SOLD)
        ?.reduce(
          (acc, listing) =>
            acc +
            Number(
              formatDisplay(
                convertSymbolToCurrency('USD'),
                listing.node.price,
                {
                  showSymbol: false,
                },
              ),
            ),
          0,
        )
        ?.toString() ?? '0'
    );
  }, [
    convertSymbolToCurrency,
    formatDisplay,
    listingsData?.vw_chaamo_cardsCollection?.edges,
  ]);

  return (
    <ScrollView testID="stats-profile" showsVerticalScrollIndicator={false}>
      <View className={classes.contentContainer}>
        <View className={classes.statContainer}>
          <ProfileStat
            className={classes.stat}
            title="Portfolio Listings"
            value={portfolioCount}
            testID="portfolio"
          />
          <ProfileStat
            className={classes.stat}
            title="Sold Items"
            value={soldCount}
            testID="sold"
          />
        </View>
        <View className={classes.statContainer}>
          <ProfileStat
            className={classes.stat}
            title="Auction Items"
            value={auctionCount}
            testID="auction"
          />
          <ProfileStat
            className={classes.stat}
            title="Buy Now Items"
            value={sellCount}
            testID="buy-now"
          />
        </View>
        <View className={classes.statContainer}>
          <ProfileStat
            className={classes.stat}
            title="Total Earnings"
            value={`${convertCurrencyToSymbol(user?.profile?.currency)}${totalEarnings}`}
            testID="total-earnings"
          />
        </View>

        <View className={classes.locationContainer}>
          <Label>Location</Label>
          <View className={classes.locationValueContainer}>
            <Icon
              name="map-marker-outline"
              size={18}
              color="black"
              testID="location-icon"
            />
            <Label>
              {address?.city && address?.country
                ? `${address?.city}, ${address?.country}`
                : address?.city || address?.country
                  ? `${address?.city || address?.country}`
                  : 'unknown'}
            </Label>
          </View>
        </View>
      </View>
      <Label className={classes.memberSinceText}>
        member since:{' '}
        {format(
          new Date(publicUser?.created_at ?? user?.created_at),
          'MMM d, yyyy',
        )}
      </Label>
    </ScrollView>
  );
}

const classes = {
  contentContainer: 'flex-1 px-4.5 py-3',
  statContainer: 'flex flex-row justify-between my-1.5 gap-3',
  stat: 'bg-white flex-1 p-5 rounded-lg shadow border border-gray-100',
  locationContainer: 'mt-5',
  locationValueContainer: 'flex flex-row gap-1 items-center',
  memberSinceText: 'text-sm text-gray-500 uppercase text-center mt-12 mb-5',
};
