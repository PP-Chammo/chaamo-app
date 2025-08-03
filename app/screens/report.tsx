import { useCallback, useState } from 'react';

import { clsx } from 'clsx';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header, RadioInput, TextField } from '@/components/molecules';
import { reportOptions } from '@/constants/reportOptions';
import { useCreateReportedUsersMutation } from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';

export default function ReportScreen() {
  const [profile] = useProfileVar();
  const { userId } = useLocalSearchParams();

  const [selected, setSelected] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const [addReportedUsers] = useCreateReportedUsersMutation();

  const handleSubmitReport = useCallback(() => {
    addReportedUsers({
      variables: {
        objects: [
          {
            reporter_user_id: profile.id,
            reported_user_id: userId,
            reason: selected === 'Other' ? otherReason : selected,
          },
        ],
      },
      onCompleted: ({ insertIntoreported_usersCollection }) => {
        if (insertIntoreported_usersCollection?.records?.length) {
          Alert.alert('Reported', 'Thank you, user reported successfully', [
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
  }, [addReportedUsers, otherReason, profile.id, selected, userId]);

  return (
    <ScreenContainer classNameTop={classes.containerTop}>
      <Header
        title="Report"
        onBackPress={() => router.back()}
        className={classes.header}
      />
      <View className={classes.titleContainer}>
        <Label variant="title" className={classes.title}>
          Why are you reporting?
        </Label>
      </View>
      <ScrollView contentContainerClassName={classes.container}>
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
      </ScrollView>
      <View className={classes.buttonContainer}>
        <Button
          variant="primary"
          onPress={handleSubmitReport}
          disabled={!selected}
        >
          Submit
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
  buttonContainer: 'p-4.5',
};
