import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { UserProfile } from '@/domains';
import { createProfiles, getProfiles } from '@/graphql/profiles';
import { getUserAddresses } from '@/graphql/user_addresses';
import { UserStore } from '@/stores/userStore';
import { DeepGet } from '@/types/helper';

import client from './apollo';
import { supabase } from './supabase';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  offlineAccess: true,
});

export async function logout() {
  await supabase.auth.signOut();
  router.replace('/(auth)/sign-in');
}

export async function loginWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    const idToken = userInfo?.data?.idToken;

    if (!idToken) {
      return;
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    } else if (error) {
      console.error('❌ Login error:', error);
      Alert.alert('Login failed', error.message);
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('❌ Google Sign-In error:', error);
    Alert.alert(
      'Login Error',
      error.message || 'An error occurred when logging in with Google',
    );
  }
}

export const updateProfileSession = async (
  setUser: (value: Partial<UserStore>) => void,
  callback: (success: boolean, user?: UserProfile) => void,
) => {
  const errorAlert = () => {
    Alert.alert('Session Error', 'Failed to load profile. Please re-login.', [
      {
        text: 'OK',
        onPress: () => {
          callback(false);
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  try {
    const { data, error } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;
    const username = data?.session?.user?.user_metadata?.full_name;

    if (error) {
      console.error('Session error:', error);
      errorAlert();
      return;
    }

    if (data?.session) {
      const profileResult = await client.query({
        query: getProfiles,
        variables: {
          filter: {
            id: { eq: userId },
          },
        },
      });

      const profileExists =
        profileResult?.data?.profilesCollection?.edges?.length > 0;

      let profileData;

      if (userId && !profileExists) {
        const createResult = await client.mutate({
          mutation: createProfiles,
          variables: {
            objects: [
              {
                id: userId,
                username,
              },
            ],
          },
        });

        profileData =
          createResult.data?.insertIntoprofilesCollection?.records?.[0];

        if (createResult.errors) {
          console.error(
            'Create profile error:',
            JSON.stringify(createResult.errors),
          );
          errorAlert();
          return;
        }
      } else {
        const selectedProfile = await client.query({
          query: getProfiles,
          variables: {
            filter: {
              id: { eq: userId },
            },
          },
        });

        if (selectedProfile.error) {
          console.error('Profile fetch error:', selectedProfile.error);
          errorAlert();
          return;
        }

        profileData =
          selectedProfile?.data?.profilesCollection?.edges?.[0]?.node;
      }

      const selectedUserAddress = await client.query({
        query: getUserAddresses,
        variables: {
          filter: {
            user_id: { eq: userId },
          },
        },
      });

      const addressData =
        selectedUserAddress?.data?.user_addressesCollection?.edges?.[0]?.node;

      await new Promise<void>((resolve) => {
        setUser({
          ...data?.session?.user,
          profile: {
            ...profileData,
            ...addressData,
          } as DeepGet<UserStore, ['profile']>,
        });

        setTimeout(() => {
          resolve();
        }, 0);
      });

      callback(true, profileData);
    } else {
      callback(false);
    }
  } catch (error) {
    supabase.auth.signOut();
    console.error('Unexpected error in updateProfileSession:', error);
    callback(false);
    errorAlert();
  }
};
