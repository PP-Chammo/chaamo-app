import { User } from '@supabase/supabase-js';

import { UserAddress, UserProfile } from '@/domains';
import { SupportedCurrency } from '@/types/currency';

type ProfileAndAddress = UserProfile & UserAddress;

interface ProfileWithAddress extends ProfileAndAddress {
  email: string;
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
