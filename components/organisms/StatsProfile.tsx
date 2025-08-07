import { useMemo } from 'react';

import { ScrollView, Text, View } from 'react-native';

import { Icon, Label, ProfileStat } from '@/components/atoms';
import { useGetUserAddressesQuery } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

export default function StatsProfile() {
  const [user] = useUserVar();

  const { data: addressData } = useGetUserAddressesQuery({
    variables: {
      filter: {
        user_id: { eq: user?.id },
      },
    },
  });

  const address = useMemo(
    () => addressData?.user_addressesCollection?.edges?.[0]?.node,
    [addressData?.user_addressesCollection?.edges],
  );

  return (
    <ScrollView testID="stats-profile" showsVerticalScrollIndicator={false}>
      <View className={classes.contentContainer}>
        <View className={classes.statContainer}>
          <ProfileStat
            className={classes.stat}
            title="Portfolio Listings"
            value="5"
          />
          <ProfileStat className={classes.stat} title="Sold Items" value="5" />
        </View>
        <View className={classes.statContainer}>
          <ProfileStat
            className={classes.stat}
            title="Auction Items"
            value="5"
          />
          <ProfileStat
            className={classes.stat}
            title="Buy Now Items"
            value="5"
          />
        </View>
        <View className={classes.statContainer}>
          <ProfileStat
            className={classes.stat}
            title="Total Earnings"
            value="5"
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
              {address?.city}, {address?.country}
            </Label>
          </View>
        </View>
      </View>
      <Text className={classes.memberSinceText}>
        member since: jan 12, 2019
      </Text>
    </ScrollView>
  );
}

const classes = {
  contentContainer: 'flex-1 px-4.5 py-3',
  statContainer: 'flex flex-row justify-between my-1.5 gap-3',
  stat: 'bg-white flex-1 p-5 rounded-lg shadow border border-gray-100',
  locationContainer: 'mt-5',
  locationValueContainer: 'flex flex-row gap-1',
  memberSinceText: 'text-sm text-gray-500 uppercase text-center mt-12 mb-5',
};
