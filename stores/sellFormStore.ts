import { CardCondition, ListingType } from '@/generated/graphql';

export interface SellFormStore {
  imageUrl: string;
  title: string;
  description: string;
  category_id: string;
  condition: CardCondition;
  listing_type: ListingType;
  currency: string;
  price: string;
  endDate: string;
  minPrice: string;
  reservedPrice: string;

  master_card_id: string;
  grading_company: string;
  grade: number;

  listing_id?: string;
  user_card_id?: string;
  selectedPackageDays: string;
  payment_id: string;
  start_time: string;
  end_time: string;
}

export const sellFormStore: SellFormStore = {
  imageUrl: '',
  title: '',
  description: '',
  category_id: '',
  condition: CardCondition.RAW,
  listing_type: ListingType.PORTFOLIO,
  currency: '$',
  price: '',
  endDate: '',
  minPrice: '',
  reservedPrice: '',
  //  below input get from autocomplete
  master_card_id: '',
  grading_company: '',
  grade: 0,
  // below inputs for ad package
  listing_id: undefined,
  user_card_id: undefined,
  selectedPackageDays: '',
  payment_id: '',
  start_time: '',
  end_time: '',
};
