import { ListingType } from '@/generated/graphql';

export interface ListingCardType {
  type?: ListingType | null;
  id: string;
  imageUrls: string | string[] | null;
  title: string;
  currency?: string | null;
  price?: string | null;
  marketCurrency?: string | null;
  marketPrice?: string | null;
  indicator?: string | null;
  boosted?: boolean;
}
