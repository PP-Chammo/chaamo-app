import { User } from '@supabase/supabase-js';

import { GetProfilesQuery, GetUserAddressesQuery } from '@/generated/graphql';
import { DeepGet } from '@/types/helper';

export interface ProfileStore extends User {
  id: string;
  profile?: DeepGet<
    GetProfilesQuery,
    ['profilesCollection', 'edges', 0, 'node']
  > &
    DeepGet<
      GetUserAddressesQuery,
      ['user_addressesCollection', 'edges', 0, 'node']
    >;
}

export const profileStore: ProfileStore = {
  id: '',
  app_metadata: {},
  user_metadata: {},
  aud: '',
  created_at: '',
  profile: undefined,
};
