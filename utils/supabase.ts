import { createClient, SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase environment variables (EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY) are not set.',
  );
}

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

export type TableName = Extract<keyof Database['public']['Tables'], string>;
export type TableRow<T extends TableName> =
  Database['public']['Tables'][T]['Row'];
export type TableInsert<T extends TableName> =
  Database['public']['Tables'][T]['Insert'];
export type TableUpdate<T extends TableName> =
  Database['public']['Tables'][T]['Update'];

export type Match = Record<string, unknown>;
export type Order = { column: string; ascending?: boolean };
export type Range = [number, number];

export async function getData<T extends TableName>(
  table: T,
  {
    select = '*',
    match,
    order,
    limit,
    single = false,
    range,
  }: {
    select?: string;
    match?: Match;
    order?: Order;
    limit?: number;
    single?: boolean;
    range?: Range;
  } = {},
): Promise<TableRow<T> | TableRow<T>[] | null> {
  let query = supabase.from(table).select(select);
  if (match) query = query.match(match);
  if (order)
    query = query.order(order.column, { ascending: order.ascending ?? true });
  if (limit) query = query.limit(limit);
  if (range) query = query.range(range[0], range[1]);
  const { data, error } = single ? await query.single() : await query;
  if (error) throw error;
  if (
    data === null ||
    Array.isArray(data) ||
    (typeof data === 'object' && data !== null)
  ) {
    return data as unknown as TableRow<T> | TableRow<T>[] | null;
  }
  throw new Error('Unexpected data type returned from Supabase');
}

export async function insertData<T extends TableName>(
  table: T,
  values: TableInsert<T> | TableInsert<T>[],
): Promise<TableRow<T>[] | null> {
  const { data, error } = await supabase.from(table).insert(values).select();
  if (error) throw error;
  return data;
}

export async function updateData<T extends TableName>(
  table: T,
  values: TableUpdate<T>,
  match: Match,
): Promise<TableRow<T>[] | null> {
  const { data, error } = await supabase
    .from(table)
    .update(values)
    .match(match)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteData<T extends TableName>(
  table: T,
  match: Match,
): Promise<null> {
  const { error } = await supabase.from(table).delete().match(match);
  if (error) throw error;
  return null;
}
