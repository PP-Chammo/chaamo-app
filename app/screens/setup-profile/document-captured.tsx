import React, { useCallback } from 'react';

import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Text, View } from 'react-native';

import { Button, ScreenContainer, UploadInstruction } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { FRAME_HEIGHT, FRAME_WIDTH } from '@/constants/setup-profile';
import {
  DocumentType,
  useCreateUserDocumentMutation,
  useUpdateProfileMutation,
} from '@/generated/graphql';
import { useImageCapturedVar } from '@/hooks/useImageCapturedVar';
import { useUserVar } from '@/hooks/useUserVar';
import { uploadToBucket } from '@/utils/supabase';

export default function IDCardCapturedScreen() {
  const [user] = useUserVar();
  const [imageCaptured, setImageCaptured] = useImageCapturedVar();
  const { type, title } = useLocalSearchParams();

  const [createUserDocument, { loading }] = useCreateUserDocumentMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const handleRetake = useCallback(() => {
    setImageCaptured(imageCaptured);
    router.push('/screens/setup-profile/document-input');
  }, [imageCaptured, setImageCaptured]);

  const handleSubmit = useCallback(async () => {
    const uploadedUrl = await uploadToBucket(
      imageCaptured.uri,
      'chaamo',
      'documents',
    );

    if (!uploadedUrl) {
      Alert.alert('Error', 'Failed to upload image');
      return;
    }

    await createUserDocument({
      variables: {
        objects: [
          {
            file_url: uploadedUrl,
            document_type: type as DocumentType,
            user_id: user?.id,
          },
        ],
      },
      onCompleted: async ({ insertIntouser_documentsCollection }) => {
        if (insertIntouser_documentsCollection?.records?.length) {
          await updateProfile({
            variables: {
              set: {
                is_profile_complete: true,
              },
            },
            onCompleted: ({ updateprofilesCollection }) => {
              if (updateprofilesCollection?.records?.length) {
                router.push('/screens/setup-profile/document-progress');
              }
            },
          });
        }
      },
    });
  }, [createUserDocument, imageCaptured.uri, type, updateProfile, user?.id]);

  return (
    <ScreenContainer className={classes.container}>
      <Header title="ID Verification" onBackPress={() => router.back()} />
      <View className={classes.content}>
        <Text className={classes.title}>Photo {title}</Text>
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
          disabled={loading}
        >
          Try Again
        </Button>
        <Button
          loading={loading}
          disabled={loading}
          onPress={handleSubmit}
          className={classes.button}
        >
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
