import {
  GetBlockedUsersQuery,
  GetProfilesQuery,
  GetUserAddressesQuery,
} from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export type BlockedUsers = DeepGet<
  GetBlockedUsersQuery,
  ['blocked_usersCollection', 'edges', 'node', 'profiles']
>;

export type UserProfile = DeepGet<
  GetProfilesQuery,
  ['profilesCollection', 'edges', 0, 'node']
>;

export type UserAddress = DeepGet<
  GetUserAddressesQuery,
  ['user_addressesCollection', 'edges', 0, 'node']
>;
