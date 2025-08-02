import { useCallback } from 'react';

import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  Button,
  Divider,
  Icon,
  Label,
  ProfileStat,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TabView } from '@/components/molecules';
import {
  AboutProfile,
  PortfolioProfile,
  ReviewsProfile,
  SoldItemsProfile,
} from '@/components/organisms';
import { profileTabs } from '@/constants/tabs';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';

export default function ProfileScreen() {
  const [user] = useUserVar();

  const handleSettingsPress = useCallback(() => {
    router.push('/screens/settings');
  }, []);

  const handlePortfolioValuePress = useCallback(() => {
    router.push('/screens/portfolio-value');
  }, []);

  const handleFollowersPress = useCallback(() => {
    router.push('/screens/followers');
  }, []);

  const handleFollowingPress = useCallback(() => {
    router.push('/screens/followings');
  }, []);

  const handleEditProfilePress = useCallback(() => {
    console.log('Edit profile pressed');
  }, []);

  return (
    <ScreenContainer className={classes.container}>
      <Header
        title="Profile"
        rightIcon="menu"
        onRightPress={handleSettingsPress}
      />
      <View className={classes.profileContainer}>
        <Avatar
          size="lg"
          imageUrl={
            user?.profile?.profile_image_url ?? user?.user_metadata?.avatar_url
          }
        />
        <View className={classes.profileInfoContainer}>
          <Label variant="title" className={classes.profileName}>
            {user?.profile?.username ?? user?.user_metadata?.name}
          </Label>
          <View className={classes.portfolioContainer}>
            <Label className={classes.portfolioValueLabel}>
              Portfolio Value:
            </Label>
            <TouchableOpacity
              onPress={handlePortfolioValuePress}
              className={classes.portfolioValueContainer}
            >
              <Label className={classes.portfolioValue}>$2000</Label>
              <View className={classes.portfolioValueIconContainer}>
                <Icon
                  name="arrow-up-right"
                  size={16}
                  color={getColor('primary-500')}
                  variant="Feather"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className={classes.profileStatsContainer}>
        <ProfileStat title="Listing" value="5" />
        <Divider />
        <ProfileStat
          title="Followers"
          value="8"
          onPress={handleFollowersPress}
        />
        <Divider />
        <ProfileStat
          title="Following"
          value="51"
          onPress={handleFollowingPress}
        />
      </View>

      <Button
        icon="pencil-outline"
        className={classes.editProfileButton}
        onPress={handleEditProfilePress}
      >
        Edit Profile
      </Button>
      <TabView className={classes.tabView} tabs={profileTabs}>
        <PortfolioProfile />
        <SoldItemsProfile />
        <AboutProfile />
        <ReviewsProfile />
      </TabView>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1',
  profileContainer: 'flex-row gap-5 mt-2 px-4.5 items-center',
  profileInfoContainer: 'gap-2',
  profileName: 'text-3xl font-bold',
  portfolioContainer: 'flex-row items-center gap-1',
  portfolioValueContainer: 'flex-row items-center gap-1',
  portfolioValueLabel: 'flex-row items-center text-md text-slate-500',
  portfolioValue: '!text-primary-500 font-bold',
  portfolioValueIconContainer: 'border border-primary-500 rounded-full',
  profileStatsContainer: 'flex-row justify-between mx-12 my-8',
  tabView: 'mt-10',
  editProfileButton: 'mx-4.5',
};
