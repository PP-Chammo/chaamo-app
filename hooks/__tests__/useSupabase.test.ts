import { act, renderHook, waitFor } from '@testing-library/react-native';

import type { Database } from '@/types/database';
import * as supabaseUtils from '@/utils/supabase';

import { useSupabase } from '../useSupabase';

jest.mock('@/utils/supabase', () => ({
  getData: jest.fn(),
  insertData: jest.fn(),
  updateData: jest.fn(),
  deleteData: jest.fn(),
}));

// Use a real table name and type from your generated Database
type UserRow = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
const TABLE = 'users';

const mockUser: UserRow = {
  created_at: '2023-01-01T00:00:00Z',
  id: '1',
  id_document_url: null,
  id_verification_status: 'pending',
  phone_number: null,
  tier: 'free',
  updated_at: '2023-01-01T00:00:00Z',
  username: 'John',
};
const mockUsers: UserRow[] = [mockUser];

describe('useSupabase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchData sets data and loading states', async () => {
    (supabaseUtils.getData as jest.Mock).mockResolvedValue(mockUsers);
    const { result } = renderHook(() => useSupabase<typeof TABLE>(TABLE));
    act(() => {
      result.current.fetchData();
    });
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.data).toEqual(mockUsers));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetchData handles error', async () => {
    (supabaseUtils.getData as jest.Mock).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useSupabase<typeof TABLE>(TABLE));
    act(() => {
      result.current.fetchData();
    });
    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('insert sets data', async () => {
    (supabaseUtils.insertData as jest.Mock).mockResolvedValue(mockUsers);
    const { result } = renderHook(() => useSupabase<typeof TABLE>(TABLE));
    act(() => {
      result.current.insert(mockUser as UserInsert);
    });
    await waitFor(() => expect(result.current.data).toEqual(mockUsers));
    expect(result.current.error).toBeNull();
  });

  it('update sets data', async () => {
    (supabaseUtils.updateData as jest.Mock).mockResolvedValue(mockUsers);
    const { result } = renderHook(() => useSupabase<typeof TABLE>(TABLE));
    act(() => {
      result.current.update({ name: 'Jane' } as Partial<UserRow>, { id: '1' });
    });
    await waitFor(() => expect(result.current.data).toEqual(mockUsers));
    expect(result.current.error).toBeNull();
  });

  it('remove sets data to null', async () => {
    (supabaseUtils.deleteData as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useSupabase<typeof TABLE>(TABLE));
    act(() => {
      result.current.remove({ id: '1' });
    });
    await waitFor(() => expect(result.current.data).toBeNull());
    expect(result.current.error).toBeNull();
  });
});
