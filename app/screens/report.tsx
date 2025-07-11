import { useState } from 'react';

import { clsx } from 'clsx';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, Label, ScreenContainer } from '@/components/atoms';
import { Header, TextField, RadioInput } from '@/components/molecules';
import { reportOptions } from '@/constants/reportOptions';

export default function ReportScreen() {
  const [selected, setSelected] = useState('');
  const [otherReason, setOtherReason] = useState('');

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
          onPress={() => router.back()}
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
  buttonTop: 'flex flex-row items-center gap-5 rounded-t-xl p-4.5',
  button: 'flex flex-row items-center gap-5 p-4.5',
  buttonBottom: 'flex flex-row items-center gap-5 rounded-b-xl p-4.5',
  titleContainer: 'p-4.5',
  title: '!text-2xl font-bold text-teal-600',
  buttonContainer: 'p-4.5',
};
