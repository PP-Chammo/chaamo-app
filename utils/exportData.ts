import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

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
  profile: BaseProfile & { email: string };
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
    },
    address: {
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

    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, jsonData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

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
