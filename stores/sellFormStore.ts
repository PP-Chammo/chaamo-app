import { CardCondition, ListingType } from '@/generated/graphql';

export interface SellFormStore {
  imageUrls: string[];

  cardCategoryId: string;
  cardYears: string;
  cardSet: string;
  cardName: string;
  cardVariation: string;
  cardSerialNumber: string;
  cardNumber: string;
  cardCondition: CardCondition;
  cardGradingCompany: string;
  cardGradeNumber: string;

  description: string;
  listingType: ListingType;
  currency: string;

  //sell
  startPrice: string;

  // auction
  reservedPrice: string;
  endTime: string;

  // ad package
  listingId?: string;
  cardId?: string;
  paymentId: string;
  selectedPackageDays: string;
}

export const sellFormStore: SellFormStore = {
  imageUrls: [],
  cardCategoryId: '',

  // canonical card detail input
  cardYears: '',
  cardSet: '',
  cardName: '',
  cardVariation: '',
  cardSerialNumber: '',
  cardNumber: '',
  cardCondition: CardCondition.RAW,
  cardGradingCompany: '',
  cardGradeNumber: '',

  description: '',
  listingType: ListingType.PORTFOLIO,
  currency: '$',

  // sell
  startPrice: '',

  // auction
  reservedPrice: '',
  endTime: '',

  // ad package
  listingId: undefined,
  cardId: undefined,
  paymentId: '',
  selectedPackageDays: '',
};
