import React, { useRef, useState } from 'react';

import { Camera, CameraView, PermissionStatus } from 'expo-camera';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

import { ScreenContainer, UploadInstruction } from '@/components/atoms';
import { Header } from '@/components/molecules';
import { useImageCapturedStore } from '@/hooks/useImageCapturedStore';

const { width } = Dimensions.get('window');
const FRAME_WIDTH = width * 0.85;
const FRAME_HEIGHT = FRAME_WIDTH * 0.6;

export default function IDCardScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const { setImageCaptured } = useImageCapturedStore();

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      const photo = await cameraRef?.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      console.log({ photo });

      setImageCaptured(photo);
    }
  };

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
          className="bg-cyan-500 px-6 py-3 rounded-lg"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === PermissionStatus.GRANTED);
          }}
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
        title="ID Photo"
        onBackPress={() => router.back()}
      />
      <CameraView
        ref={cameraRef}
        className={classes.camera}
        onCameraReady={() => setIsCameraReady(true)}
      />
      <View className={classes.overlay}>
        <Text className={classes.title}>Photo ID Card</Text>
        <Text className={classes.instructionText}>
          Please point the camera at the ID card. Position it inside the frame.
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
  camera: 'flex-1',
  overlay: 'absolute inset-0 mx-6 mt-24 mb-10',
  instructionText: 'text-white text-base',
  uploadInstruction: 'bottom-20',
  frameContainer: 'flex-1 justify-center items-center',
  frame: `border-4 border-cyan-400 rounded-lg bg-transparent`,
  header: 'bg-transparent p-6',
  captureButton:
    'absolute bottom-0 self-center w-20 h-20 rounded-full bg-white/20 justify-center items-center border-4 border-slate-200',
  captureButtonIcon: 'w-16 h-16 rounded-full bg-cyan-400',
};
