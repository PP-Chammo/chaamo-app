import { GetBlockedUsersQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export type BlockedUsers = DeepGet<
  GetBlockedUsersQuery,
  ['blocked_usersCollection', 'edges', 'node', 'profiles']
>;
