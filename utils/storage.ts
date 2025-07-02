import AsyncStorage from '@react-native-async-storage/async-storage';

const serialize = <T>(value: T): string => JSON.stringify(value);
const deserialize = <T>(value: string | null): T | null => {
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

export async function fnGetStorage<T = unknown>(
  key: string,
): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  return deserialize<T>(value);
}

export async function fnSetStorage<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, serialize<T>(value));
}

export async function fnAppendStorage<T>(key: string, value: T): Promise<void> {
  const storedValues = await AsyncStorage.getItem(key);
  const parsedValues = deserialize<T[]>(storedValues) || [];
  if (Array.isArray(parsedValues)) {
    const newValues = [...parsedValues, value];
    await AsyncStorage.setItem(key, serialize<T[]>(newValues));
  } else if (parsedValues !== null && typeof parsedValues === 'object') {
    await AsyncStorage.setItem(key, serialize<T[]>([parsedValues as T, value]));
  } else {
    await AsyncStorage.setItem(key, serialize<T[]>([value]));
  }
}

export async function fnRemoveStorage(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
