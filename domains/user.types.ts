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
