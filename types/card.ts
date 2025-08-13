import { ListingType } from '@/generated/graphql';

export interface ListingCardType {
  type?: ListingType | null;
  id: string;
  imageUrl: string;
  title: string;
  currency?: string | null;
  price?: string | null;
  marketCurrency?: string | null;
  marketPrice?: string | null;
  indicator?: string | null;
  boosted?: boolean;
}
