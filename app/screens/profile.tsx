import { useCallback, useMemo, useRef, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import pluralize from 'pluralize';
import { Alert, TouchableOpacity, View } from 'react-native';

import {
  Avatar,
  Button,
  ContextMenu,
  Divider,
  Icon,
  Label,
  Loading,
  ProfileStat,
  Row,
  ScreenContainer,
} from '@/components/atoms';
import { Header, Lazy, TabView } from '@/components/molecules';
import { profileTabs } from '@/constants/tabs';
import {
  useCreateBlockedUsersMutation,
  useCreateFollowsMutation,
  useGetProfilesQuery,
  useGetVwChaamoListingsQuery,
  useRemoveBlockedUsersMutation,
  useRemoveFollowsMutation,
  useUpdateProfileMutation,
} from '@/generated/graphql';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';
import { useCurrencyDisplay } from '@/hooks/useCurrencyDisplay';
import { useFollows } from '@/hooks/useFollows';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';
import { uploadToBucket } from '@/utils/supabase';

export default function ProfileScreen() {
  const [user] = useUserVar();
  const { userId } = useLocalSearchParams();
  const { getIsBlocked } = useBlockedUsers();
  const { formatDisplay } = useCurrencyDisplay();
  const { getIsFollowing: getIsFollowingSelf } = useFollows();
  const { followers, followings, getIsFollowing } = useFollows(
    userId as string,
  );

  const currentUser = useMemo(() => userId ?? user?.id, [userId, user?.id]);

  const dotsRef = useRef<View>(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const { data, refetch } = useGetProfilesQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        id: { eq: currentUser },
      },
    },
  });

  const { data: listingData } = useGetVwChaamoListingsQuery({
    skip: !userId && !user?.id,
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        seller_id: { eq: currentUser },
      },
    },
  });

  const [removeFollow, { loading: loadingUnfollow }] =
    useRemoveFollowsMutation();
  const [removeFromFollower] = useRemoveFollowsMutation();
  const [createFollow, { loading: loadingFollow }] = useCreateFollowsMutation();
  const [createBlockedUsers] = useCreateBlockedUsersMutation();
  const [removeBlockedUsers] = useRemoveBlockedUsersMutation();
  const [updateProfile, { loading: loadingUpdateProfile }] =
    useUpdateProfileMutation();

  const isSelfProfile = useMemo(() => {
    if (!userId) {
      return true;
    }
    return user?.id === userId;
  }, [user?.id, userId]);

  const profile = useMemo(() => {
    return data?.profilesCollection?.edges?.[0]?.node;
  }, [data?.profilesCollection?.edges]);

  const handleSettingsPress = useCallback(() => {
    if (isSelfProfile) {
      return router.push('/screens/settings');
    }
    setIsContextMenuVisible(true);
  }, [isSelfProfile]);

  const handleToggleFollow = useCallback(
    (followeeUserId: string) => () => {
      if (getIsFollowingSelf(followeeUserId)) {
        removeFollow({
          variables: {
            filter: {
              follower_user_id: { eq: user?.id },
              followee_user_id: { eq: followeeUserId },
            },
          },
        });
      } else {
        createFollow({
          variables: {
            objects: [
              {
                follower_user_id: user?.id,
                followee_user_id: followeeUserId,
              },
            ],
          },
        });
      }
    },
    [getIsFollowingSelf, createFollow, removeFollow, user?.id],
  );

  const handleRemoveFromFollower = useCallback(
    (followerUserId: string) => () => {
      removeFromFollower({
        variables: {
          filter: {
            follower_user_id: { eq: followerUserId },
            followee_user_id: { eq: user?.id },
          },
        },
        onCompleted: ({ deleteFromfollowsCollection }) => {
          if (deleteFromfollowsCollection?.records?.length) {
            setIsContextMenuVisible(false);
          }
        },
      });
    },
    [removeFromFollower, user?.id],
  );

  const handleToggleBlockedUser = useCallback(() => {
    if (getIsBlocked(userId as string)) {
      removeBlockedUsers({
        variables: {
          filter: {
            blocker_user_id: { eq: user?.id },
            blocked_user_id: { eq: userId },
          },
        },
        onCompleted: ({ deleteFromblocked_usersCollection }) => {
          if (deleteFromblocked_usersCollection?.records?.length) {
            setIsContextMenuVisible(false);
          }
        },
      });
    } else {
      createBlockedUsers({
        variables: {
          objects: [
            {
              blocker_user_id: user?.id,
              blocked_user_id: userId,
            },
          ],
        },
        onCompleted: ({ insertIntoblocked_usersCollection }) => {
          if (insertIntoblocked_usersCollection?.records?.length) {
            setIsContextMenuVisible(false);
            removeFollow({
              variables: {
                filter: {
                  follower_user_id: { eq: user?.id },
                  followee_user_id: { eq: userId },
                },
              },
            });
            Alert.alert('Blocked', 'User blocked successfully');
          }
        },
      });
    }
  }, [
    getIsBlocked,
    userId,
    removeBlockedUsers,
    user?.id,
    createBlockedUsers,
    removeFollow,
  ]);

  const handleUpdateProfileImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert(
        'Permission required',
        'We need permission to access your photos.',
      );
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled || !result.assets.length)
      return Alert.alert('No image selected');
    const selectedImage = result.assets[0];
    if (selectedImage?.uri) {
      const uploadedUrl = await uploadToBucket(
        selectedImage.uri,
        'chaamo',
        'profiles',
      );

      updateProfile({
        variables: {
          filter: {
            id: { eq: user?.id },
          },
          set: {
            profile_image_url: uploadedUrl,
          },
        },
        onCompleted: () => {
          refetch();
        },
      });
    }
  }, [updateProfile, user?.id, refetch]);

  return (
    <>
      <ScreenContainer
        className={classes.container}
        enableBottomSafeArea={!isSelfProfile}
      >
        <Header
          title={
            isSelfProfile
              ? 'Profile'
              : `${profile?.username.split(' ')?.[0]}'s Profile`
          }
          rightIcon={isSelfProfile ? 'menu' : 'dots-vertical'}
          onBackPress={isSelfProfile ? undefined : () => router.back()}
          onRightPress={handleSettingsPress}
          rightRef={dotsRef}
        />
        <View className={classes.profileContainer}>
          <Avatar
            size="lg"
            imageUrl={profile?.profile_image_url ?? ''}
            onPress={isSelfProfile ? handleUpdateProfileImage : undefined}
            loading={loadingUpdateProfile}
          />
          <View className={classes.profileInfoContainer}>
            <Label variant="title" className={classes.profileName}>
              {profile?.username}
            </Label>
            {isSelfProfile && (
              <View className={classes.portfolioContainer}>
                <Label className={classes.portfolioValueLabel}>
                  Portfolio Value:
                </Label>
                <TouchableOpacity
                  onPress={() => router.push('/screens/portfolio-value')}
                  className={classes.portfolioValueContainer}
                >
                  <Label className={classes.portfolioValue}>
                    {formatDisplay(user?.profile?.currency, 0)}
                  </Label>
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
            )}
          </View>
        </View>

        <View className={classes.profileStatsContainer}>
          <ProfileStat
            title="Listing"
            value={
              listingData?.vw_chaamo_cardsCollection?.edges?.length?.toString() ??
              '0'
            }
          />
          <Divider />
          <ProfileStat
            title={pluralize('Followers', Number(followers.length))}
            value={String(followers.length)}
            onPress={() =>
              router.push({
                pathname: '/screens/followers',
                params: {
                  userId,
                },
              })
            }
          />
          <Divider />
          <ProfileStat
            title={pluralize('Following', Number(followings.length))}
            value={String(followings.length)}
            onPress={() =>
              router.push({
                pathname: '/screens/followings',
                params: {
                  userId,
                },
              })
            }
          />
        </View>

        {isSelfProfile ? (
          <Button
            icon="pencil-outline"
            className={classes.editProfileButton}
            onPress={() => router.push('/screens/personal-details')}
          >
            Edit Profile
          </Button>
        ) : (
          <Row className={classes.buttonContainer}>
            {getIsBlocked(userId as string) ? (
              <Button
                iconVariant="Ionicons"
                icon="ban-outline"
                variant="danger-light"
                className={classes.button}
                onPress={handleToggleBlockedUser}
                disabled={loadingFollow || loadingUnfollow}
                loading={loadingFollow || loadingUnfollow}
              >
                Unblock
              </Button>
            ) : (
              <>
                <Button
                  iconVariant="SimpleLineIcons"
                  icon={
                    getIsFollowing(userId as string)
                      ? 'user-following'
                      : 'user-follow'
                  }
                  className={classes.button}
                  onPress={handleToggleFollow(userId as string)}
                  disabled={loadingFollow || loadingUnfollow}
                  loading={loadingFollow || loadingUnfollow}
                >
                  {getIsFollowingSelf(userId as string) ? 'Unfollow' : 'Follow'}
                </Button>
                <Button
                  variant="light"
                  icon="message-processing-outline"
                  className={classes.button}
                  onPress={() =>
                    router.push({
                      pathname: '/screens/chat',
                      params: {
                        userId,
                      },
                    })
                  }
                >
                  Message
                </Button>
              </>
            )}
          </Row>
        )}
        <TabView className={classes.tabView} tabs={profileTabs}>
          <Lazy
            load={() => import('@/components/organisms/PortfolioProfile')}
            fallback={<Loading />}
          />
          <Lazy
            load={() => import('@/components/organisms/SoldItemsProfile')}
            fallback={<Loading />}
          />
          <Lazy
            load={() => import('@/components/organisms/StatsProfile')}
            fallback={<Loading />}
          />
          <Lazy
            load={() => import('@/components/organisms/ReviewsProfile')}
            fallback={<Loading />}
          />
        </TabView>
      </ScreenContainer>
      {!isSelfProfile && (
        <ContextMenu
          visible={isContextMenuVisible}
          onClose={() => setIsContextMenuVisible(false)}
          triggerRef={dotsRef}
          menuHeight={60}
        >
          {getIsFollowing(user?.id) && (
            <>
              <TouchableOpacity
                onPress={handleRemoveFromFollower(userId as string)}
              >
                <Label className={classes.unfollowText}>
                  Remove from followers
                </Label>
              </TouchableOpacity>
              <Divider position="horizontal" />
            </>
          )}
          <TouchableOpacity onPress={handleToggleBlockedUser}>
            <Label className={classes.blockText}>
              {getIsBlocked(userId as string) ? 'Unblock' : 'Block'}
            </Label>
          </TouchableOpacity>
        </ContextMenu>
      )}
    </>
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
  buttonContainer: 'gap-4 px-4.5',
  button: 'flex-1',
  blockText: '!text-red-600 text-md font-medium',
  unfollowText: '!text-slate-600 text-md font-medium',
};
