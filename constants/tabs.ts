import { getColor } from '@/utils/getColor';

export const setupProfileTabs = [
  { title: 'Personal Info.', route: 'personal-info' },
  { title: 'Address', route: 'address' },
  { title: 'ID Verification', route: '(upload-identity)/proof-identity' },
];

export const profileTabs = ['Portfolio', 'Sold Items', 'About', 'Reviews'];

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
