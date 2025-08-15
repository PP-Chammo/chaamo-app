import { getColor } from '@/utils/getColor';

export const setupProfileTabs = [
  { title: 'Personal Info.', route: 'screens/setup-profile/personal-info' },
  { title: 'Address', route: 'screens/setup-profile/address' },
  {
    title: 'ID Verification',
    route: 'screens/setup-profile/document-upload-selection',
  },
];

export const profileTabs = ['Portfolio', 'Sold Items', 'My Stats', 'Reviews'];

export const inboxTabs = ['All', 'Buying', 'My Bids'];

export const productListTabs = [
  'All Cards',
  {
    title: 'Auction',
    icon: 'access-point',
    iconColor: getColor('red-500'),
    iconSize: 16,
  },
  'Fixed Price',
];

export const privacyPolicyTabs = [
  'Privacy Policy',
  'Terms of Service',
  'HMRC Guidelines',
];

export const ORDER_TABS = ['Sold', 'Bought'];

export const PERIODS_TABS_FILTER = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

export const ORDER_TABS_FILTER = [
  { label: 'In Progress', value: 'progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];
