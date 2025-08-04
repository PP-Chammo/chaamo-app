import { GetBlockedAccountsQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export interface Profile {
  username: string;
  profile_image_url: string;
  bio: string;
}

export type BlockedUsers = DeepGet<
  GetBlockedAccountsQuery,
  ['blocked_usersCollection', 'edges', 'node', 'profiles']
>;
