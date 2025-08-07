import { User } from '@supabase/supabase-js';

import { GetProfilesQuery, GetUserAddressesQuery } from '@/generated/graphql';
import { SupportedCurrency } from '@/types/currency';
import { DeepGet } from '@/types/helper';

type ProfileAndAddress = DeepGet<
  GetProfilesQuery,
  ['profilesCollection', 'edges', 0, 'node']
> &
  DeepGet<
    GetUserAddressesQuery,
    ['user_addressesCollection', 'edges', 0, 'node']
  >;

interface ProfileWithAddress extends ProfileAndAddress {
  currency: SupportedCurrency;
}

export interface UserStore extends User {
  id: string;
  profile?: ProfileWithAddress;
}

export const userStore: UserStore = {
  id: '',
  app_metadata: {},
  user_metadata: {},
  aud: '',
  created_at: '',
  profile: undefined,
};
