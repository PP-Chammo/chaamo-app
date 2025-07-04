import { User } from './user';

export interface Post {
  id: number;
  user_id: number;
  user?: Partial<User>;
  date: string;
  text: string;
  image?: string | null;
  comments?: number;
  likes?: number;
}
