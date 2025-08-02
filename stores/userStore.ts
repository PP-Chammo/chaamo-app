import { User } from '@supabase/supabase-js';

import { GetProfilesQuery, GetUserAddressesQuery } from '@/generated/graphql';
import { SupportedCurrency } from '@/types/currency';
import { DeepGet } from '@/types/helper';

export interface UserStore extends User {
  id: string;
  profile?: ProfileWithAddress;
}

interface ProfileWithAddress extends ProfileAndAddress {
  currency: SupportedCurrency;
}

type ProfileAndAddress = DeepGet<
  GetProfilesQuery,
  ['profilesCollection', 'edges', 0, 'node']
> &
  DeepGet<
    GetUserAddressesQuery,
    ['user_addressesCollection', 'edges', 0, 'node']
  >;

export const userStore: UserStore = {
  id: '',
  app_metadata: {},
  user_metadata: {},
  aud: '',
  created_at: '',
  profile: undefined,
};
