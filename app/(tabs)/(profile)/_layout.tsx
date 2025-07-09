import { router } from 'expo-router';
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
import { Header, TabView } from '@/components/molecules';
import { profileTabs } from '@/constants/tabs';
import { getColor } from '@/utils/getColor';

import AboutProfileScreen from './about';
import PortfolioProfileScreen from './portfolio';
import ReviewsProfileScreen from './reviews';
import SoldItemsProfileScreen from './sold-items';

export default function ProfileLayout() {
  return (
    <ScreenContainer className={classes.container}>
      <Header
        title="Profile"
        iconRight="menu"
        onRightPress={() => router.push('/screens/settings')}
      />
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

      <Button icon="pencil-outline" className={classes.button}>
        Edit Profile
      </Button>
      <TabView className={classes.tabView} tabs={profileTabs}>
        <PortfolioProfileScreen />
        <SoldItemsProfileScreen />
        <AboutProfileScreen />
        <ReviewsProfileScreen />
      </TabView>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1',
  profileContainer: 'flex-row gap-5 mt-2 items-center px-5',
  avatarImageContainer: 'border-2 border-white',
  profileInfoContainer: 'gap-2',
  profileName: 'text-3xl font-bold',
  portfolioValueContainer: 'flex-row items-center gap-1',
  portfolioValueLabel: 'flex-row items-center text-md text-slate-500',
  portfolioValue: 'text-teal-600 font-bold',
  portfolioValueIconContainer: 'border border-teal-600 rounded-full',
  profileStatsContainer: 'flex-row justify-between mx-12 my-8',
  tabView: 'mt-10',
  button: 'mx-5',
  tabViewContent: 'px-5',
};
