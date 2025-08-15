import React, { useCallback, useRef, useState } from 'react';

import { Camera, CameraView, PermissionStatus } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';

import { ScreenContainer, UploadInstruction } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { FRAME_HEIGHT, FRAME_WIDTH } from '@/constants/setup-profile';
import { useImageCapturedVar } from '@/hooks/useImageCapturedVar';

export default function DocumentInputScreen() {
  const { title } = useLocalSearchParams();

  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const setImageCaptured = useImageCapturedVar()[1];

  const takePicture = useCallback(async () => {
    if (cameraRef.current && isCameraReady) {
      const photo = await cameraRef?.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      setImageCaptured(photo);
    }
  }, [cameraRef, isCameraReady, setImageCaptured]);

  const requestCameraPermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === PermissionStatus.GRANTED);
  }, []);

  const handleBrowseDocument = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const photo = result.assets[0];

    setImageCaptured(photo);
  }, [setImageCaptured]);

  useFocusEffect(
    useCallback(() => {
      requestCameraPermission();
    }, [requestCameraPermission]),
  );

  cssInterop(CameraView, {
    className: {
      target: 'style',
    },
  });

  if (hasPermission === null) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white mb-4">
          Camera permission is required to continue.
        </Text>
        <TouchableOpacity
          className="bg-cyan-500 px-4.5 py-3 rounded-lg"
          onPress={requestCameraPermission}
        >
          <Text className="text-white font-bold">Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white">No access to camera</Text>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <Header
        className={classes.header}
        title={title as string}
        onBackPress={() => router.back()}
      />
      <CameraView
        ref={cameraRef}
        className={classes.camera}
        onCameraReady={() => setIsCameraReady(true)}
      />
      <View className={classes.overlay}>
        <Text className={classes.title}>Photo {title}</Text>
        <Text className={classes.instructionText}>
          Please point the camera at the {title}. Position it inside the frame.
          Make sure it is clear enough
        </Text>
        <View className={classes.frameContainer}>
          <View
            // Note: Tailwind does not generate classes at runtime.
            // To use dynamic styles like this, you must use inline styles or ensure all possible classes are generated at build time.
            style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
            className={classes.frame}
          />
        </View>
        <UploadInstruction className={classes.uploadInstruction} />
        <TouchableOpacity
          className={classes.browseDocument}
          onPress={handleBrowseDocument}
        >
          <Image
            source={require('@/assets/images/browse-document.png')}
            className={classes.browseDocumentImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className={classes.captureButton}
          onPress={takePicture}
        >
          <View className={classes.captureButtonIcon} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  title: 'text-white text-3xl font-bold mb-8',
  camera: 'absolute inset-0',
  overlay: 'absolute inset-0 mx-4.5 mt-24 mb-24',
  instructionText: 'text-white text-base',
  uploadInstruction: 'bottom-24',
  frameContainer: 'flex-1 justify-center items-center',
  frame: `border-4 border-cyan-400 rounded-lg bg-transparent`,
  header: 'bg-transparent p-6',
  captureButton:
    'absolute -bottom-5 self-center w-20 h-20 rounded-full bg-white/20 justify-center items-center border-4 border-slate-400',
  captureButtonIcon: 'w-16 h-16 rounded-full bg-cyan-400',
  browseDocument: 'w-10 h-10 rounded-full',
  browseDocumentImage: 'absolute inset-0 rounded-full bg-white',
};
