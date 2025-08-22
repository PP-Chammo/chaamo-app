import { Alert, Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

import {
  BaseNotification,
  BaseNotificationSetting,
  BaseProfile,
  BaseUserAddress,
} from '@/domains';
import { UserStore } from '@/stores/userStore';

interface ExportDataResult {
  personalInfo?: PersonalInfo;
  activityData?: ActivityData;
  settings?: Settings;
  metadata: ExportMetadata;
}

interface PersonalInfo {
  profile: BaseProfile & { email?: string };
  address: BaseUserAddress;
}

interface ActivityData {
  notifications: BaseNotification[];
}

interface Settings {
  notificationPreferences: BaseNotificationSetting[];
}

interface ExportMetadata {
  exportDate: string;
  exportVersion: string;
  userId: string;
  dataFormat: string;
  appName: string;
  description: string;
}

const createMetadata = (user: UserStore): ExportMetadata => {
  return {
    exportDate: new Date().toISOString(),
    exportVersion: '1.0.0',
    userId: user.id,
    dataFormat: 'JSON',
    appName: 'Chaamo',
    description: 'Trading card marketplace data export',
  };
};

const getPersonalInfo = async (user: UserStore): Promise<PersonalInfo> => {
  return {
    profile: {
      id: user?.id,
      username: user?.profile?.username ?? '',
      email: user?.email ?? '',
      phone_number: user?.profile?.phone_number ?? '',
      country_code: user?.profile?.country_code ?? '',
      profile_image_url: user?.profile?.profile_image_url ?? '',
      currency: user?.profile?.currency ?? '',
      created_at: user?.created_at ?? '',
      is_profile_complete: user?.profile?.is_profile_complete ?? false,
    },
    address: {
      user_addresses_id: user?.profile?.user_addresses_id ?? '',
      address_line_1: user?.profile?.address_line_1 ?? '',
      city: user?.profile?.city ?? '',
      state_province: user?.profile?.state_province ?? '',
      country: user?.profile?.country ?? '',
      postal_code: user?.profile?.postal_code ?? '',
    },
  };
};

const getActivityData = async (
  activityData: ActivityData,
): Promise<ActivityData> => activityData;

const getSettings = async (settings: Settings): Promise<Settings> => settings;

export const exportData = async (
  user: UserStore,
  activityData: ActivityData,
  settings: Settings,
): Promise<ExportDataResult> => {
  try {
    const result: ExportDataResult = {
      metadata: createMetadata(user),
      personalInfo: await getPersonalInfo(user),
      activityData: await getActivityData(activityData),
      settings: await getSettings(settings),
    };

    return result;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};

export const exportUserData = async (
  user: UserStore,
  activityData: ActivityData,
  settings: Settings,
): Promise<void> => {
  try {
    const data = await exportData(user, activityData, settings);

    const jsonData = JSON.stringify(data, null, 2);

    const fileName = `chaamo-export-${user.id}-${Date.now()}.json`;

    let baseDir = RNFS.DocumentDirectoryPath;

    if (Platform.OS === 'android') {
      try {
        const writeGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message:
              'Chaamo needs access to your storage to export your data to Downloads.',
            buttonPositive: 'OK',
          },
        );

        const readGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message:
              'Chaamo needs access to your storage to export your data to Downloads.',
            buttonPositive: 'OK',
          },
        );

        const hasPermission =
          writeGranted === PermissionsAndroid.RESULTS.GRANTED ||
          readGranted === PermissionsAndroid.RESULTS.GRANTED;

        if (hasPermission && RNFS.DownloadDirectoryPath) {
          baseDir = RNFS.DownloadDirectoryPath;
        } else if (RNFS.ExternalDirectoryPath) {
          baseDir = RNFS.ExternalDirectoryPath;
        }
      } catch {
        baseDir = RNFS.ExternalDirectoryPath ?? RNFS.DocumentDirectoryPath;
      }
    }

    let fileUri = `${baseDir}/${fileName}`;

    await RNFS.mkdir(baseDir);

    try {
      await RNFS.writeFile(fileUri, jsonData, 'utf8');
    } catch (writeErr) {
      if (Platform.OS === 'android') {
        const fallbackDir =
          RNFS.ExternalDirectoryPath ?? RNFS.DocumentDirectoryPath;
        if (fallbackDir && fallbackDir !== baseDir) {
          baseDir = fallbackDir;
          fileUri = `${baseDir}/${fileName}`;
          await RNFS.mkdir(baseDir);
          await RNFS.writeFile(fileUri, jsonData, 'utf8');
        } else {
          throw writeErr;
        }
      } else {
        throw writeErr;
      }
    }

    Alert.alert(
      'Export Successful',
      `Your data has been exported to:\n${fileName}\n\nFile location: ${fileUri}`,
    );
  } catch (error) {
    console.error('Export failed:', error);
    Alert.alert(
      'Export Failed',
      'There was an error exporting your data. Please try again.',
    );
  }
};
