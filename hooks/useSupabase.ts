import { useCallback, useState } from 'react';

import {
  deleteData,
  getData,
  insertData,
  Match,
  TableInsert,
  TableName,
  TableRow,
  TableUpdate,
  updateData,
} from '@/utils/supabase';

/**
 * useSupabase hook for type-safe CRUD operations on any table.
 * @template T TableName
 */
export function useSupabase<T extends TableName>(table: T) {
  const [data, setData] = useState<TableRow<T> | TableRow<T>[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch data from the table.
   */
  const fetchData = useCallback(
    async (options?: {
      select?: string;
      match?: Match;
      order?: { column: string; ascending?: boolean };
      limit?: number;
      single?: boolean;
      range?: [number, number];
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getData<T>(table, options);
        setData(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table],
  );

  /**
   * Insert data into the table.
   */
  const insert = useCallback(
    async (values: TableInsert<T> | TableInsert<T>[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await insertData<T>(table, values);
        setData(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table],
  );

  /**
   * Update data in the table.
   */
  const update = useCallback(
    async (values: TableUpdate<T>, match: Match) => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateData<T>(table, values, match);
        setData(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table],
  );

  /**
   * Delete data from the table.
   */
  const remove = useCallback(
    async (match: Match) => {
      setLoading(true);
      setError(null);
      try {
        await deleteData<T>(table, match);
        setData(null);
        return null;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table],
  );

  return { data, error, loading, fetchData, insert, update, remove };
}
