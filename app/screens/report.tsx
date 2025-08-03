import { useCallback, useMemo, useState } from 'react';

import { clsx } from 'clsx';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, View } from 'react-native';

import {
  Button,
  KeyboardView,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import { Header, RadioInput, TextField } from '@/components/molecules';
import { reportOptions } from '@/constants/reportOptions';
import {
  useCreateReportedListingsMutation,
  useCreateReportedPostsMutation,
  useCreateReportedUsersMutation,
} from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';

export default function ReportScreen() {
  const [user] = useUserVar();
  const { listingId, postId, userId } = useLocalSearchParams();

  const [selected, setSelected] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const [addReportedListings, { loading: loadingListing }] =
    useCreateReportedListingsMutation();
  const [addReportedPosts, { loading: loadingPost }] =
    useCreateReportedPostsMutation();
  const [addReportedUsers, { loading: loadingUser }] =
    useCreateReportedUsersMutation();

  const reportContext = useMemo(() => {
    if (listingId) {
      return 'listing card';
    } else if (postId) {
      return 'post';
    }
    return 'user';
  }, [listingId, postId]);

  const handleSubmitReport = useCallback(() => {
    if (listingId) {
      return addReportedListings({
        variables: {
          objects: [
            {
              reporter_user_id: user.id,
              reported_user_id: userId,
              reported_listing_id: listingId,
              reason: selected === 'Other' ? otherReason : selected,
            },
          ],
        },
        onCompleted: ({ insertIntoreported_listingsCollection }) => {
          if (insertIntoreported_listingsCollection?.records?.length) {
            Alert.alert(
              'Reported',
              'Thank you, listing card reported successfully',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    router.back();
                  },
                },
              ],
            );
          }
        },
      });
    } else if (postId) {
      return addReportedPosts({
        variables: {
          objects: [
            {
              reporter_user_id: user.id,
              reported_user_id: userId,
              reported_post_id: postId,
              reason: selected === 'Other' ? otherReason : selected,
            },
          ],
        },
        onCompleted: ({ insertIntoreported_postsCollection }) => {
          if (insertIntoreported_postsCollection?.records?.length) {
            Alert.alert(
              'Reported',
              `Thank you, ${reportContext} reported successfully`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    router.back();
                  },
                },
              ],
            );
          }
        },
      });
    }
    return addReportedUsers({
      variables: {
        objects: [
          {
            reporter_user_id: user.id,
            reported_user_id: userId,
            reason: selected === 'Other' ? otherReason : selected,
          },
        ],
      },
      onCompleted: ({ insertIntoreported_usersCollection }) => {
        if (insertIntoreported_usersCollection?.records?.length) {
          Alert.alert('Reported', 'Thank you, post reported successfully', [
            {
              text: 'OK',
              onPress: () => {
                router.back();
              },
            },
          ]);
        }
      },
    });
  }, [
    addReportedListings,
    addReportedPosts,
    addReportedUsers,
    listingId,
    otherReason,
    postId,
    user.id,
    reportContext,
    selected,
    userId,
  ]);

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Report"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <View className={classes.titleContainer}>
        <Label variant="title" className={classes.title}>
          Why are you reporting this {reportContext} ?
        </Label>
      </View>
      <KeyboardView>
        <View className={classes.container}>
          {reportOptions.map((option) => (
            <View
              key={option.label}
              className={clsx(classes.optionContainer, {
                'rounded-t-lg': option.position === 'top',
                'rounded-b-lg': option.position === 'bottom',
              })}
            >
              <RadioInput
                name="report"
                label={option.label}
                selected={selected === option.label}
                onPress={() => setSelected(option.label)}
              />
              {option.label === 'Other' && selected === 'Other' && (
                <TextField
                  name="otherReason"
                  placeholder="Please tell us what's wrong"
                  value={otherReason}
                  onChange={({ name, value }) => {
                    if (name === 'otherReason') {
                      setOtherReason(value);
                    }
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </KeyboardView>
      <View className={classes.buttonContainer}>
        <Button
          variant="primary"
          onPress={handleSubmitReport}
          loading={loadingListing || loadingPost || loadingUser}
          disabled={
            selected === 'Other'
              ? !otherReason
              : !selected || loadingListing || loadingPost || loadingUser
          }
        >
          Submit Report
        </Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  containerTop: 'bg-white',
  header: 'bg-white',
  container: 'flex-1 gap-0.5 px-4.5',
  optionContainer: 'bg-white gap-3 p-4.5',
  titleContainer: 'p-4.5',
  title: '!text-2xl font-bold text-primary-500',
  buttonContainer: 'p-4.5 mb-4.5',
};
