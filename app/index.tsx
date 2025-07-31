import { useCallback, useEffect, useState } from 'react';

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ActivityIndicator, Alert, View } from 'react-native';

import { useGetProfilesLazyQuery } from '@/generated/graphql';
import { useProfileVar } from '@/hooks/useProfileVar';
import { supabase } from '@/utils/supabase';

export default function StartPage() {
  const [, setProfile] = useProfileVar();
  const [checkedSession, setCheckedSession] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  const [getProfile, { loading: loadingGetProfile }] = useGetProfilesLazyQuery({
    fetchPolicy: 'network-only',
  });

  cssInterop(Image, {
    className: {
      target: 'style',
    },
  });

  const checkSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session error:', error);
      router.replace('/(auth)/sign-in');
      return;
    }
    if (isDevelopment) {
      if (data.session) {
        getProfile({
          variables: {
            filter: {
              id: { eq: data.session.user.id },
            },
          },
          onCompleted: ({ profilesCollection }) => {
            if (profilesCollection) {
              setProfile({
                ...data.session.user,
                profile: profilesCollection.edges[0].node,
              });
              setCheckedSession(true);
              router.replace('/(tabs)/home');
            } else {
              Alert.alert(
                'Failed get session',
                'Session expired, please re-login.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setCheckedSession(true);
                      router.replace('/(auth)/sign-in');
                    },
                  },
                ],
              );
            }
          },
        });
      } else {
        setCheckedSession(true);
        router.replace('/(auth)/sign-in');
      }
    }
  }, [getProfile, isDevelopment, setProfile]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isDevelopment || !checkedSession || loadingGetProfile)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <View className={classes.container}>
      <Image
        source={require('@/assets/images/splash-screen.gif')}
        className={classes.image}
        contentFit="contain"
      />
    </View>
  );
}

const classes = {
  container: 'bg-splash w-full h-full',
  image: 'absolute inset-0',
};
