import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import { fnRemoveStorage, fnSetStorage } from './storage';
import { supabase } from './supabase';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  offlineAccess: true,
});

export async function logout() {
  await supabase.auth.signOut();
  await fnRemoveStorage('session');
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

      await fnSetStorage('session', data.session);
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
