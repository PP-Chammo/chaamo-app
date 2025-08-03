import React, { useCallback, useState } from 'react';

import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Alert, TouchableOpacity, View } from 'react-native';

import {
  Button,
  Icon,
  KeyboardView,
  Label,
  ScreenContainer,
} from '@/components/atoms';
import { Header, TextArea } from '@/components/molecules';
import { TextChangeParams } from '@/domains';
import { useCreateCommunityPostsMutation } from '@/generated/graphql';
import { useUserVar } from '@/hooks/useUserVar';
import { getColor } from '@/utils/getColor';
import { uploadToBucket } from '@/utils/supabase';

interface Form {
  contentImageUrl?: string;
  content: string;
}

const initialForm: Form = {
  contentImageUrl: undefined,
  content: '',
};

export default function NewPostScreen() {
  const [user] = useUserVar();
  const [createPosts, { loading }] = useCreateCommunityPostsMutation();

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

    setForm((prev) => ({ ...prev, contentImageUrl: selectedImage.uri }));
  }, []);

  const handleRemoveImage = useCallback(() => {
    setForm((prev) => ({ ...prev, contentImageUrl: '' }));
  }, []);

  const handleSubmitPost = useCallback(async () => {
    try {
      let uploadedUrl;
      if (form.contentImageUrl) {
        uploadedUrl = await uploadToBucket(
          form.contentImageUrl,
          'chaamo',
          'community_posts',
        );
      }
      createPosts({
        variables: {
          objects: [
            {
              user_id: user.id,
              content: form.content,
              ...(uploadedUrl
                ? {
                    content_image_url: uploadedUrl,
                  }
                : {}),
            },
          ],
        },
        onCompleted: ({ insertIntocommunity_postsCollection }) => {
          if (insertIntocommunity_postsCollection) {
            Alert.alert('Posted!', 'Your Post submit successfully', [
              {
                text: 'OK',
                onPress: () => {
                  router.back();
                },
              },
            ]);
          }
        },
        onError: console.log,
      });
    } catch (e: unknown) {
      console.error('create community post error', e);
    }
  }, [createPosts, form.content, form.contentImageUrl, user.id]);

  return (
    <ScreenContainer>
      <Header title="Add New Post" onBackPress={() => router.back()} />
      <View className={classes.container}>
        <Label className={classes.title}>What’s on your mind?</Label>
        <KeyboardView>
          {!!form.contentImageUrl && (
            <View className={classes.imageContainer}>
              <Image
                source={{ uri: form.contentImageUrl }}
                className={classes.image}
                contentFit="cover"
              />
              <TouchableOpacity
                className={classes.closeIcon}
                onPress={handleRemoveImage}
              >
                <Icon name="close" size={20} color={getColor('slate-700')} />
              </TouchableOpacity>
            </View>
          )}
          <TextArea
            name="content"
            value={form.content}
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
      <View className={classes.buttonContainer}>
        <Button
          onPress={handleSubmitPost}
          loading={loading}
          disabled={loading || !form.content}
        >
          Submit Post
        </Button>
      </View>
    </ScreenContainer>
  );
}

const classes = {
  title: 'text-primary-500 text-xl font-medium',
  container: 'flex-1 mx-4.5 gap-8',
  image: 'w-full h-72 rounded-2xl',
  attachment: 'bg-primary-500 rounded-full p-3 absolute bottom-28 right-6',
  imageContainer: 'relative',
  closeIcon: 'absolute top-2 right-2 bg-white rounded-full p-1',
  buttonContainer: 'p-4.5',
};
