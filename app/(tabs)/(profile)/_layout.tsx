import { Stack } from 'expo-router';
import { View } from 'react-native';

import {
  Avatar,
  Button,
  Divider,
  Icon,
  Label,
  ProfileStat,
  ScreenContainer,
} from '@/components/atoms';
import { Header, ProfileTabs } from '@/components/molecules';
import { getColor } from '@/utils/getColor';

export default function ProfileLayout() {
  return (
    <ScreenContainer className={classes.container}>
      <Header title="Profile" />
      <View className={classes.profileContainer}>
        <Avatar
          size={80}
          imageContainerClassName={classes.avatarImageContainer}
        />
        <View className={classes.profileInfoContainer}>
          <Label variant="title" className={classes.profileName}>
            John Doe
          </Label>
          <View className={classes.portfolioValueContainer}>
            <Label className={classes.portfolioValueLabel}>
              Portfolio Value:
            </Label>
            <Label className={classes.portfolioValue}>$2000</Label>
            <View className={classes.portfolioValueIconContainer}>
              <Icon
                name="arrow-up-right"
                size={16}
                color={getColor('teal-600')}
                variant="Feather"
              />
            </View>
          </View>
        </View>
      </View>

      <View className={classes.profileStatsContainer}>
        <ProfileStat title="Listing" value="5" />
        <Divider />
        <ProfileStat title="Followers" value="8" />
        <Divider />
        <ProfileStat title="Following" value="51" />
      </View>

      <Button icon="pencil-outline">Edit Profile</Button>
      <ProfileTabs className="mt-10 mb-5" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: getColor('transparent'),
          },
        }}
      />
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1 px-6',
  profileContainer: 'flex-row gap-5 mt-2 items-center',
  avatarImageContainer: 'border-2 border-white',
  profileInfoContainer: 'gap-2',
  profileName: 'text-3xl font-bold',
  portfolioValueContainer: 'flex-row items-center gap-1',
  portfolioValueLabel: 'flex-row items-center text-md text-slate-500',
  portfolioValue: 'text-teal-600 font-bold',
  portfolioValueIconContainer: 'border border-teal-600 rounded-full',
  profileStatsContainer: 'flex-row justify-between mx-12 my-8',
};
