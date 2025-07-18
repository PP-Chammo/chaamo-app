import React, { useCallback } from 'react';

import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';

import { Button, ScreenContainer, UploadInstruction } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { FRAME_HEIGHT, FRAME_WIDTH } from '@/constants/setup-profile';
import { useImageCapturedVar } from '@/hooks/useImageCapturedVar';

export default function IDCardCapturedScreen() {
  const [imageCaptured, setImageCaptured] = useImageCapturedVar();

  const handleRetake = useCallback(() => {
    setImageCaptured(imageCaptured);
    router.push('/id-card');
  }, [imageCaptured, setImageCaptured]);

  const handleSubmit = useCallback(() => {
    // TODO: Implement submit logic save image to storage and send to backend
    router.push('/id-card-progress');
  }, []);

  return (
    <ScreenContainer className={classes.container}>
      <Header title="ID Verification" onBackPress={() => router.back()} />
      <View className={classes.content}>
        <Text className={classes.title}>Photo ID Card</Text>
        <Text className={classes.instructionText}>
          Please point the camera at the ID card. Position it inside the frame.
          Make sure it is clear enough
        </Text>
        <Image
          // Note: Tailwind does not generate classes at runtime.
          // To use dynamic styles like this, you must use inline styles or ensure all possible classes are generated at build time.
          style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
          source={{ uri: imageCaptured.uri }}
          className={classes.image}
        />
        <UploadInstruction variant="light" />
      </View>
      <View className={classes.buttonContainer}>
        <Button
          variant="light"
          onPress={handleRetake}
          className={classes.button}
        >
          Try Again
        </Button>
        <Button onPress={handleSubmit} className={classes.button}>
          Submit
        </Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  container: 'flex-1',
  title: 'text-slate-600 text-3xl font-bold my-8',
  instructionText: 'text-slate-600 text-sm',
  image: 'w-full my-10 rounded-lg self-center',
  content: 'flex-1 px-4.5',
  button: 'flex-1',
  buttonContainer: 'flex-row gap-4 justify-between mb-5 p-4.5',
};
