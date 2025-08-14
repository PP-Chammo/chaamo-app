import { ListingType } from '@/generated/graphql';

type ListingTypeItem = { label: string; value: ListingType | 'all' };

export const listingTypes: ListingTypeItem[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Auction',
    value: ListingType.AUCTION,
  },
  {
    label: 'Sell',
    value: ListingType.SELL,
  },
  {
    label: 'Portfolio',
    value: ListingType.PORTFOLIO,
  },
];
