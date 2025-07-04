import { ScrollView, Text, View } from 'react-native';

import { Icon, Label, ProfileStat } from '@/components/atoms';

export default function AboutScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
          <ProfileStat className={classes.stat} title="Followers" value="5" />
          <ProfileStat className={classes.stat} title="Following" value="5" />
        </View>

        <View className={classes.locationContainer}>
          <Label>Location</Label>
          <View className={classes.locationValueContainer}>
            <Icon name="map-marker-outline" size={18} color="black" />
            <Label>London, UK</Label>
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
  contentContainer: 'flex-1',
  statContainer: 'flex flex-row justify-between m-2 gap-2',
  stat: 'bg-white flex-1 p-5 rounded-lg shadow border border-gray-100',
  locationContainer: 'mt-5',
  locationValueContainer: 'flex flex-row gap-1',
  memberSinceText: 'text-sm text-gray-500 uppercase text-center mt-12 mb-5',
};
