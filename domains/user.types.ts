import {
  GetBlockedUsersQuery,
  GetProfilesQuery,
  GetUserAddressesQuery,
} from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export type BlockedUsers = DeepGet<
  GetBlockedUsersQuery,
  ['blocked_usersCollection', 'edges', number, 'node', 'profiles']
>;

export type BaseProfile = DeepGet<
  GetProfilesQuery,
  ['profilesCollection', 'edges', number, 'node']
>;

export type BaseUserAddress = DeepGet<
  GetUserAddressesQuery,
  ['user_addressesCollection', 'edges', number, 'node']
>;

export type UserProfile = DeepGet<
  GetProfilesQuery,
  ['profilesCollection', 'edges', 0, 'node']
>;

export type UserAddress = DeepGet<
  GetUserAddressesQuery,
  ['user_addressesCollection', 'edges', 0, 'node']
>;
