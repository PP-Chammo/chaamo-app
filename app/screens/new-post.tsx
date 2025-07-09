import React, { useCallback, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

import { Icon, KeyboardView, ScreenContainer } from '@/components/atoms';
import { Header, TextArea } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import { getColor } from '@/utils/getColor';

interface Form {
  imageUrl: string;
  description: string;
}

const initialForm: Form = {
  imageUrl: '',
  description: '',
};

export default function NewPostScreen() {
  const [form, setForm] = useState<Form>(initialForm);

  const handleChange = ({ name, value }: TextChangeParams) => {
    setForm({ ...form, [name]: value });
  };

  const handlePickImage = useCallback(async () => {
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

    setForm((prev) => ({ ...prev, imageUrl: selectedImage.uri }));
  }, []);

  const handleRemoveImage = useCallback(() => {
    setForm((prev) => ({ ...prev, imageUrl: '' }));
  }, []);

  return (
    <ScreenContainer>
      <Header title="Add New Post" onBackPress={() => router.back()} />

      <View className={classes.container}>
        <Text className={classes.title}>What’s on your mind?</Text>
        {form.imageUrl && (
          <View className={classes.imageContainer}>
            <Image
              source={{ uri: form.imageUrl }}
              className={classes.image}
              resizeMode="cover"
            />
            <TouchableOpacity
              className={classes.closeIcon}
              onPress={handleRemoveImage}
            >
              <Icon name="close" size={20} color={getColor('slate-700')} />
            </TouchableOpacity>
          </View>
        )}
        <KeyboardView>
          <TextArea
            name="description"
            onChange={handleChange}
            label="Description"
          />
        </KeyboardView>
      </View>
      <TouchableOpacity
        className={classes.attachment}
        onPress={handlePickImage}
      >
        <Icon name="paperclip" size={20} color={getColor('white')} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const classes = {
  title: 'text-teal-600 text-xl font-medium',
  container: 'flex-1 mx-6 gap-8',
  image: 'w-full h-72 rounded-2xl',
  attachment: 'bg-teal-600 rounded-full p-3 absolute bottom-16 right-6',
  imageContainer: 'relative',
  closeIcon: 'absolute top-2 right-2 bg-white rounded-full p-1',
};
