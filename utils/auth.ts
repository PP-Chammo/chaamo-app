import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { getProfiles } from '@/graphql/profiles';
import { getUserAddresses } from '@/graphql/user_addresses';
import { ProfileStore } from '@/stores/profileStore';
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
      router.replace('/(tabs)/home');
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
  setProfile: (value: Partial<ProfileStore>) => void,
  callback: (success: boolean, userId?: string) => void,
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

    if (error) {
      console.error('Session error:', error);
      errorAlert();
      return;
    }

    if (data.session) {
      const userId = data?.session?.user.id;
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

      const { profilesCollection } = selectedProfile.data || {};

      const selectedUserAddress = await client.query({
        query: getUserAddresses,
        variables: {
          filter: {
            user_id: { eq: userId },
          },
        },
      });

      const profileData = profilesCollection?.edges[0]?.node;
      const addressData =
        selectedUserAddress?.data?.user_addressesCollection?.edges[0]?.node;

      setProfile({
        ...data?.session?.user,
        profile: { ...profileData, ...addressData } as DeepGet<
          ProfileStore,
          ['profile']
        >,
      });

      callback(true, userId);
    } else {
      callback(false);
    }
  } catch (error) {
    console.error('Data fetching error:', error);
    callback(false);
    errorAlert();
  }
};
