import {
  fnGetStorage,
  fnSetStorage,
  fnAppendStorage,
  fnRemoveStorage,
} from '../storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AsyncStorage = require('@react-native-async-storage/async-storage');

describe('storage utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fnGetStorage', () => {
    it('should return null if no value', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      const result = await fnGetStorage('key');
      expect(result).toBeNull();
    });
    it('should return parsed value if valid JSON', async () => {
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ a: 1 }));
      const result = await fnGetStorage('key');
      expect(result).toEqual({ a: 1 });
    });
    it('should return raw value if invalid JSON', async () => {
      AsyncStorage.getItem.mockResolvedValue('not-json');
      const result = await fnGetStorage('key');
      expect(result).toBe('not-json');
    });
  });

  describe('fnSetStorage', () => {
    it('should serialize and store value', async () => {
      await fnSetStorage('key', { b: 2 });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify({ b: 2 }),
      );
    });
  });

  describe('fnAppendStorage', () => {
    it('should append to existing array', async () => {
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify([1, 2]));
      await fnAppendStorage('key', 3);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify([1, 2, 3]),
      );
    });
    it('should create array if stored value is not array but object', async () => {
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ c: 3 }));
      await fnAppendStorage('key', 4);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify([{ c: 3 }, 4]),
      );
    });
    it('should create array if no stored value', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      await fnAppendStorage('key', 5);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify([5]),
      );
    });
    it('should create array if stored value is not array or object', async () => {
      AsyncStorage.getItem.mockResolvedValue('not-json');
      await fnAppendStorage('key', 6);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify([6]),
      );
    });
  });

  describe('fnRemoveStorage', () => {
    it('should remove item', async () => {
      await fnRemoveStorage('key');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('key');
    });
  });
});
