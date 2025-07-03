import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const setupProfileTabs = [
  { title: 'Personal Info.', route: 'personal-info' },
  { title: 'Address', route: 'address' },
  { title: 'ID Verification', route: 'id-verification' },
];

export const FRAME_WIDTH = width * 0.85;
export const FRAME_HEIGHT = FRAME_WIDTH * 0.6;
