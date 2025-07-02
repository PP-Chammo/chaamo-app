import React from 'react';

import { router } from 'expo-router';
import { Dimensions, Image, Text, View } from 'react-native';

import { Button, ScreenContainer, UploadInstruction } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { useImageCapturedStore } from '@/hooks/useImageCapturedStore';
import { imageCapturedStore } from '@/stores/imageCapturedStore';

const { width } = Dimensions.get('window');
const FRAME_WIDTH = width * 0.85;
const FRAME_HEIGHT = FRAME_WIDTH * 0.6;

export default function IDCardCapturedScreen() {
  const { uri, setImageCaptured } = useImageCapturedStore();

  const handleRetake = () => {
    setImageCaptured(imageCapturedStore);
    router.push('/id-card');
  };

  const handleSubmit = () => {
    // TODO: Implement submit logic save image to storage and send to backend
    console.log('submit');
    router.push('/id-card-progress');
  };

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
          source={{ uri }}
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
  container: 'flex-1 p-6',
  title: 'text-slate-600 text-3xl font-bold my-8',
  instructionText: 'text-slate-600 text-sm',
  image: 'w-full my-10 rounded-lg self-center',
  content: 'flex-1',
  button: 'flex-1',
  buttonContainer: 'flex-row gap-4 justify-between mb-5',
};
