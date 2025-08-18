import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { BaseProfile } from '@/domains';
import {
  DocumentVerificationStatus,
  OrderByDirection,
  UserDocuments,
} from '@/generated/graphql';
import { getProfiles } from '@/graphql/profiles';
import { getUserAddresses } from '@/graphql/user_addresses';
import { getUserDocument } from '@/graphql/user_documents';
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
  await GoogleSignin.signOut();
  await supabase.auth.signOut();
  router.replace('/(auth)/sign-in');
}

export async function loginWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();

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
  callback: (
    success: boolean,
    user?: BaseProfile,
    userDocument?: UserDocuments,
  ) => void,
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

    if (error) {
      console.error('Session error:', error);
      errorAlert();
      return;
    }

    if (data?.session) {
      const selectedProfile = await client.query({
        fetchPolicy: 'network-only',
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

      const profileData =
        selectedProfile?.data?.profilesCollection?.edges?.[0]?.node;

      const selectedUserAddress = await client.query({
        fetchPolicy: 'network-only',
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

      const userDocument = await client.query({
        fetchPolicy: 'network-only',
        query: getUserDocument,
        variables: {
          filter: {
            user_id: { eq: userId },
          },
          orderBy: [
            {
              uploaded_at: OrderByDirection.DESCNULLSLAST,
            },
          ],
        },
      });

      const userDocumentData =
        userDocument?.data?.user_documentsCollection?.edges?.[0]?.node;

      if (!profileData?.is_profile_complete)
        return router.replace('/screens/setup-profile/personal-info');

      if (userDocumentData?.status === DocumentVerificationStatus.REJECTED)
        return router.replace('/screens/setup-profile/document-rejected');

      callback(true, profileData, userDocumentData);
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

export const deleteAccount = async (cb: () => void) => {
  try {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;

    if (!userId) {
      return;
    }

    const { error } = await supabase.functions.invoke('delete-user', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    if (!error) {
      await logout();
      cb();
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    Alert.alert('Error', 'Failed to delete account');
  }
};
