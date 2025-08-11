import { ListingType } from '@/generated/graphql';

export interface ListingCardType {
  type?: ListingType | null;
  id: string;
  imageUrl: string;
  title: string;
  price?: string;
  marketPrice: string;
  indicator?: string | null;
  boosted?: boolean;
}
