import { CardCondition, ListingType } from '@/generated/graphql';

export interface SellFormStore {
  imageUrl: string;
  title: string;
  description: string;
  category_id: string;
  condition: CardCondition;
  listing_type: ListingType;
  end_time: string;
  currency: string;
  start_price: string;
  reserved_price: string;

  master_card_id: string;
  grading_company: string;
  grade: number;

  listing_id?: string;
  user_card_id?: string;
  payment_id: string;
  start_time: string;
  selectedPackageDays: string;
}

export const sellFormStore: SellFormStore = {
  imageUrl: '',
  title: '',
  description: '',
  category_id: '',
  condition: CardCondition.RAW,
  listing_type: ListingType.PORTFOLIO,
  currency: '$',
  start_price: '',
  reserved_price: '',
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
