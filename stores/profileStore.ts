import { User } from '@supabase/supabase-js';

export interface ProfileStore extends User {
  id: string;
}

export const profileStore: ProfileStore = {
  id: '',
  app_metadata: {},
  user_metadata: {},
  aud: '',
  created_at: '',
};
