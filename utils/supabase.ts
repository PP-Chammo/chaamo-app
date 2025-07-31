import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

import { randomString } from './randomString';

const mimeTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: {
        async getItem(key) {
          return AsyncStorage.getItem(key);
        },
        async setItem(key, value) {
          return AsyncStorage.setItem(key, value);
        },
        async removeItem(key) {
          return AsyncStorage.removeItem(key);
        },
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
      },
    },
  },
);

export async function uploadToBucket(
  localUri: string,
  bucket: string,
  folder: string = '',
): Promise<string | null> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist at path: ' + localUri);
    }

    // Ambil ekstensi
    const fileExt = localUri.split('.').pop() || 'jpg';
    const fileName = `${randomString(16)}.${fileExt}`;
    const pathInBucket = folder ? `${folder}/${fileName}` : fileName;
    const contentType =
      mimeTypes[fileExt.toLowerCase()] || 'application/octet-stream';

    // Baca sebagai base64
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const arrayBuffer = decode(base64);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(pathInBucket, arrayBuffer, { contentType });

    if (error) {
      console.error('Upload to bucket error:', error);
      return null;
    }

    const uploaded = supabase.storage.from(bucket).getPublicUrl(pathInBucket);
    return uploaded.data.publicUrl;
  } catch (e) {
    console.error('Supabase Upload error:', e);
    return null;
  }
}
