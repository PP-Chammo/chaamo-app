import { CardCondition, ListingType } from '@/generated/graphql';

export const conditions = [
  {
    label: 'Raw',
    value: CardCondition.RAW,
  },
  {
    label: 'Graded',
    value: CardCondition.GRADED,
  },
];

export const conditionSells = [
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
];
