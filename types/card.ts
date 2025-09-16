import {
  GetEbayPostsQuery,
  GetVwListingCardsQuery,
  ListingType,
} from '@/generated/graphql';

import { DeepGet } from './helper';

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

export type ChaamoEdge = DeepGet<
  GetVwListingCardsQuery,
  ['vw_listing_cardsCollection', 'edges', number]
>;
export type EbayEdge = DeepGet<
  GetEbayPostsQuery,
  ['ebay_postsCollection', 'edges', number]
>;

export type MergedItem =
  | { kind: 'chaamo'; edge: ChaamoEdge }
  | { kind: 'ebay'; edge: EbayEdge };
