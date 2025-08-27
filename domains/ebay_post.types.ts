import { GetEbayPostsQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export type BaseEbayPost = DeepGet<
  GetEbayPostsQuery,
  ['ebay_postsCollection', 'edges', number, 'node']
>;
