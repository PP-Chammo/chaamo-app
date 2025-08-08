import { ListingType } from '@/generated/graphql';

export const portfolioFilters = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Sell',
    value: ListingType.SELL,
  },
  {
    label: 'Auction',
    value: ListingType.AUCTION,
  },
  {
    label: 'Portfolio',
    value: ListingType.PORTFOLIO,
  },
  {
    label: 'Boosted',
    value: 'boosted',
  },
];
