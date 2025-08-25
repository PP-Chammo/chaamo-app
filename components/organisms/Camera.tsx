import React, { memo, useCallback, useRef, useState } from 'react';

import { Camera, CameraView, PermissionStatus } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';

import { useImageCapturedVar } from '@/hooks/useImageCapturedVar';

import { ScreenContainer } from '../atoms';
import Header from '../molecules/Header';

cssInterop(CameraView, {
  className: {
    target: 'style',
  },
});

interface CameraProps {
  onTakeCallback?: () => void;
  onBackPress?: () => void;
}

const CameraComponent = memo(function CameraComponent({
  onTakeCallback,
  onBackPress,
}: CameraProps) {
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [enableTorch, setEnableTorch] = useState<boolean>(false);

  const setImageCaptured = useImageCapturedVar()[1];

  const takePicture = useCallback(async () => {
    if (cameraRef.current && isCameraReady) {
      const photo = await cameraRef?.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      setImageCaptured(photo, onTakeCallback);
    }
  }, [isCameraReady, onTakeCallback, setImageCaptured]);

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

    setImageCaptured(photo, onTakeCallback);
  }, [onTakeCallback, setImageCaptured]);

  useFocusEffect(
    useCallback(() => {
      requestCameraPermission();
    }, [requestCameraPermission]),
  );

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

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
        onBackPress={onBackPress ?? router.back}
        leftIconColor="white"
        rightIcon={enableTorch ? 'flash' : 'flash-outline'}
        rightIconColor="white"
        onRightPress={() => setEnableTorch((prev) => !prev)}
      />
      {isFocused && hasPermission && (
        <CameraView
          ref={cameraRef}
          className={classes.camera}
          facing="back"
          onCameraReady={() => setIsCameraReady(true)}
          enableTorch={enableTorch}
        />
      )}
      <View className={classes.overlay}>
        <TouchableOpacity
          className={classes.browseDocument}
          onPress={handleBrowseDocument}
        >
          <Image
            source={require('@/assets/images/browse-document.png')}
            className={classes.browseDocumentIcon}
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
});

const classes = {
  camera: 'absolute right-0 left-0 bottom-0 top-0',
  header: 'bg-transparent p-6 z-40',
  captureButton:
    'absolute -bottom-5 self-center w-20 h-20 rounded-full bg-white/20 justify-center items-center border-4 border-slate-400',
  captureButtonIcon: 'w-16 h-16 rounded-full bg-cyan-400',
  browseDocument: 'absolute -bottom-2 w-12 h-12 rounded-full',
  browseDocumentIcon:
    'absolute right-0 left-0 bottom-0 top-0 rounded-full bg-white',
  overlay:
    'absolute right-0 left-0 bottom-0 top-0 mx-4.5 mt-24 mb-24 justify-center',
};

export default CameraComponent;
