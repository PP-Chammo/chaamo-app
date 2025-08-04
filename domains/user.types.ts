import { GetBlockedAccountsQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export type BlockedUsers = DeepGet<
  GetBlockedAccountsQuery,
  ['blocked_usersCollection', 'edges', 'node', 'profiles']
>;
