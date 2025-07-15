import { Database } from '@/types/database';

import * as supabaseUtils from '../supabase';
import { deleteData, getData, insertData, updateData } from '../supabase';

jest.mock('../supabase', () => {
  const actual = jest.requireActual('../supabase');
  return {
    ...actual,
    getData: jest.fn(),
    insertData: jest.fn(),
    updateData: jest.fn(),
    deleteData: jest.fn(),
  };
});

const TABLE = 'users';
type UserRow = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];

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

describe('supabase utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getData returns data', async () => {
    (supabaseUtils.getData as jest.Mock).mockResolvedValue(mockUser);
    const data = await getData<typeof TABLE>(TABLE, {
      single: true,
      match: { id: '1' },
    });
    expect(data).toEqual(mockUser);
  });

  it('getData throws error', async () => {
    (supabaseUtils.getData as jest.Mock).mockRejectedValue(new Error('fail'));
    await expect(
      getData<typeof TABLE>(TABLE, { single: true }),
    ).rejects.toThrow('fail');
  });

  it('insertData returns data', async () => {
    (supabaseUtils.insertData as jest.Mock).mockResolvedValue(mockUsers);
    const data = await insertData<typeof TABLE>(TABLE, mockUser as UserInsert);
    expect(data).toEqual(mockUsers);
  });

  it('insertData throws error', async () => {
    (supabaseUtils.insertData as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );
    await expect(
      insertData<typeof TABLE>(TABLE, mockUser as UserInsert),
    ).rejects.toThrow('fail');
  });

  it('updateData returns data', async () => {
    (supabaseUtils.updateData as jest.Mock).mockResolvedValue(mockUsers);
    const data = await updateData<typeof TABLE>(
      TABLE,
      { username: 'Jane' },
      { id: '1' },
    );
    expect(data).toEqual(mockUsers);
  });

  it('updateData throws error', async () => {
    (supabaseUtils.updateData as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );
    await expect(
      updateData<typeof TABLE>(TABLE, { username: 'Jane' }, { id: '1' }),
    ).rejects.toThrow('fail');
  });

  it('deleteData returns null', async () => {
    (supabaseUtils.deleteData as jest.Mock).mockResolvedValue(null);
    const data = await deleteData<typeof TABLE>(TABLE, { id: '1' });
    expect(data).toBeNull();
  });

  it('deleteData throws error', async () => {
    (supabaseUtils.deleteData as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );
    await expect(deleteData<typeof TABLE>(TABLE, { id: '1' })).rejects.toThrow(
      'fail',
    );
  });
});
