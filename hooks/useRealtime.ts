import { useEffect, useRef } from 'react';

import { useApolloClient, DocumentNode } from '@apollo/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { tableQueryMap } from '@/constants/tableQueryMap';
import { supabase } from '@/utils/supabase';

type TableName = keyof typeof tableQueryMap;

type Row = Record<string, unknown>;

type Edge = {
  node: Row;
  cursor?: string;
  __typename?: string;
};

const tryParseArgsFromRootKey = (
  key: string,
): Record<string, unknown> | undefined => {
  const start = key.indexOf('(');
  const end = key.lastIndexOf(')');
  if (start === -1 || end === -1 || end <= start) return undefined;
  const json = key.slice(start + 1, end);
  try {
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return undefined;
  }
};

type Payload = {
  eventType?: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: Row;
  old?: Row;
};

export const useRealtime = (
  tables: TableName[],
  options?: { persistent?: boolean; hasHook?: boolean },
) => {
  const client = useApolloClient();
  const channelsRef = useRef<Record<string, RealtimeChannel | null>>({});
  const persistent = options?.persistent ?? true;
  const hasHook = options?.hasHook ?? false;

  useEffect(() => {
    if (!Array.isArray(tables) || tables.length === 0) return;

    tables.forEach((tableNameRaw) => {
      const tableName = String(tableNameRaw) as TableName;
      const cfg = tableQueryMap[tableName];
      if (!cfg) {
        console.warn(`useRealtime: unknown table "${tableName}"`);
        return;
      }

      const key = String(tableName);
      if (channelsRef.current[key]) return;

      const channel = supabase
        .channel(`realtime:${key}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: key },
          (payloadIn: unknown) => {
            try {
              const p = payloadIn as Payload;
              const collKey = cfg.dataKey as string;
              const root =
                (
                  client.cache.extract(true) as {
                    ROOT_QUERY?: Record<string, unknown>;
                  }
                ).ROOT_QUERY || {};
              const rootKeys = Object.keys(root).filter((k) =>
                k.startsWith(collKey),
              );
              let matchedAny = false;

              const performSilentWrite = (
                variables: Record<string, unknown> | undefined,
              ) => {
                try {
                  const prevRaw = client.cache.readQuery({
                    query: cfg.query as DocumentNode,
                    variables: variables || {},
                  }) as Record<string, unknown> | null;
                  if (!prevRaw) return;
                  const connRaw = prevRaw[collKey] as
                    | Record<string, unknown>
                    | undefined;
                  if (!connRaw) return;
                  const edgesRaw = Array.isArray(connRaw.edges)
                    ? (connRaw.edges as unknown[])
                    : [];
                  const edges: Edge[] = edgesRaw.map((e) => e as Edge);
                  const pk = cfg.primaryKey[0];

                  const newPrev = (() => {
                    if (p.eventType === 'INSERT') {
                      if (!p.new) return prevRaw;
                      if (
                        edges.some(
                          (e) =>
                            String(e.node[pk]) === String((p.new as Row)[pk]),
                        )
                      )
                        return prevRaw;
                      const cursor =
                        typeof (p.new as Row)[pk] !== 'undefined'
                          ? String((p.new as Row)[pk])
                          : String(Date.now());
                      const newEdge: Edge = {
                        node: p.new as Row,
                        cursor,
                        __typename: `${key}Edge`,
                      };
                      return {
                        ...prevRaw,
                        [collKey]: { ...connRaw, edges: [...edges, newEdge] },
                      } as Record<string, unknown>;
                    }

                    if (p.eventType === 'UPDATE') {
                      if (!p.new || !p.old) return prevRaw;
                      const idx = edges.findIndex(
                        (e) =>
                          String(e.node[pk]) === String((p.old as Row)[pk]),
                      );
                      const filter = variables?.filter as
                        | Record<string, unknown>
                        | undefined;
                      const nowMatches = (() => {
                        if (!filter) return true;
                        const postIdFilter = (
                          filter.post_id as Record<string, unknown> | undefined
                        )?.['eq'];
                        if (postIdFilter !== undefined) {
                          return (
                            String(postIdFilter) ===
                            String((p.new as Row).post_id)
                          );
                        }
                        return true;
                      })();

                      if (idx === -1 && nowMatches) {
                        const cursor =
                          typeof (p.new as Row)[pk] !== 'undefined'
                            ? String((p.new as Row)[pk])
                            : String(Date.now());
                        const newEdge: Edge = {
                          node: p.new as Row,
                          cursor,
                          __typename: `${key}Edge`,
                        };
                        return {
                          ...prevRaw,
                          [collKey]: { ...connRaw, edges: [...edges, newEdge] },
                        } as Record<string, unknown>;
                      }

                      if (idx !== -1 && !nowMatches) {
                        const updated = edges.filter((_, i) => i !== idx);
                        return {
                          ...prevRaw,
                          [collKey]: { ...connRaw, edges: updated },
                        } as Record<string, unknown>;
                      }

                      if (idx !== -1 && nowMatches) {
                        const merged: Row = {
                          ...(edges[idx].node ?? {}),
                          ...(p.new as Row),
                        };
                        const updated = edges.map((e, i) =>
                          i === idx ? { ...e, node: merged } : e,
                        );
                        return {
                          ...prevRaw,
                          [collKey]: { ...connRaw, edges: updated },
                        } as Record<string, unknown>;
                      }
                      return prevRaw;
                    }

                    if (p.eventType === 'DELETE') {
                      if (!p.old) return prevRaw;
                      const updated = edges.filter(
                        (e) =>
                          String(e.node[pk]) !== String((p.old as Row)[pk]),
                      );
                      if (updated.length === edges.length) return prevRaw;
                      return {
                        ...prevRaw,
                        [collKey]: { ...connRaw, edges: updated },
                      } as Record<string, unknown>;
                    }

                    return prevRaw;
                  })();

                  if (newPrev === prevRaw) return;

                  client.cache.writeQuery({
                    query: cfg.query as DocumentNode,
                    variables: variables || {},
                    data: newPrev,
                  });
                } catch (err) {
                  const msg = (err as Error)?.message ?? '';
                  if (
                    /No cached result|Can't find field|Can't find query/i.test(
                      msg,
                    )
                  )
                    return;
                  console.warn('useRealtime (silent write) error:', err);
                }
              };

              const performUpdateQuery = (
                variables: Record<string, unknown> | undefined,
              ) => {
                try {
                  client.cache.updateQuery(
                    {
                      query: cfg.query as DocumentNode,
                      variables: variables || {},
                    },
                    (prevIn) => {
                      const prev = prevIn as Record<string, unknown> | null;
                      if (!prev) return prevIn;
                      const connRaw = prev[collKey] as
                        | Record<string, unknown>
                        | undefined;
                      if (!connRaw) return prevIn;
                      const edgesRaw = Array.isArray(connRaw.edges)
                        ? (connRaw.edges as unknown[])
                        : [];
                      const edges: Edge[] = edgesRaw.map((e) => e as Edge);
                      const pk = cfg.primaryKey[0];

                      if (p.eventType === 'INSERT') {
                        if (!p.new) return prevIn;
                        if (
                          edges.some(
                            (e) =>
                              String(e.node[pk]) === String((p.new as Row)[pk]),
                          )
                        )
                          return prevIn;
                        const cursor =
                          typeof (p.new as Row)[pk] !== 'undefined'
                            ? String((p.new as Row)[pk])
                            : String(Date.now());
                        const newEdge: Edge = {
                          node: p.new as Row,
                          cursor,
                          __typename: `${key}Edge`,
                        };
                        return {
                          ...prev,
                          [collKey]: { ...connRaw, edges: [...edges, newEdge] },
                        };
                      }

                      if (p.eventType === 'UPDATE') {
                        if (!p.new || !p.old) return prevIn;
                        const idx = edges.findIndex(
                          (e) =>
                            String(e.node[pk]) === String((p.old as Row)[pk]),
                        );
                        const filter = variables?.filter as
                          | Record<string, unknown>
                          | undefined;
                        const nowMatches = (() => {
                          if (!filter) return true;
                          const postIdFilter = (
                            filter.post_id as
                              | Record<string, unknown>
                              | undefined
                          )?.['eq'];
                          if (postIdFilter !== undefined) {
                            return (
                              String(postIdFilter) ===
                              String((p.new as Row).post_id)
                            );
                          }
                          return true;
                        })();

                        if (idx === -1 && nowMatches) {
                          const cursor =
                            typeof (p.new as Row)[pk] !== 'undefined'
                              ? String((p.new as Row)[pk])
                              : String(Date.now());
                          const newEdge: Edge = {
                            node: p.new as Row,
                            cursor,
                            __typename: `${key}Edge`,
                          };
                          return {
                            ...prev,
                            [collKey]: {
                              ...connRaw,
                              edges: [...edges, newEdge],
                            },
                          };
                        }

                        if (idx !== -1 && !nowMatches) {
                          const updated = edges.filter((_, i) => i !== idx);
                          return {
                            ...prev,
                            [collKey]: { ...connRaw, edges: updated },
                          };
                        }

                        if (idx !== -1 && nowMatches) {
                          const merged: Row = {
                            ...(edges[idx].node ?? {}),
                            ...(p.new as Row),
                          };
                          const updated = edges.map((e, i) =>
                            i === idx ? { ...e, node: merged } : e,
                          );
                          return {
                            ...prev,
                            [collKey]: { ...connRaw, edges: updated },
                          };
                        }
                        return prevIn;
                      }

                      if (p.eventType === 'DELETE') {
                        if (!p.old) return prevIn;
                        const updated = edges.filter(
                          (e) =>
                            String(e.node[pk]) !== String((p.old as Row)[pk]),
                        );
                        if (updated.length === edges.length) return prevIn;
                        return {
                          ...prev,
                          [collKey]: { ...connRaw, edges: updated },
                        };
                      }

                      return prevIn;
                    },
                  );
                } catch (err) {
                  console.warn(
                    'useRealtime: updateQuery failed for vars',
                    variables,
                    err,
                  );
                }
              };

              for (const rk of rootKeys) {
                const parsed = tryParseArgsFromRootKey(rk);
                const filter = parsed?.filter as
                  | Record<string, unknown>
                  | undefined;
                const postIdInVars =
                  filter &&
                  typeof filter === 'object' &&
                  filter.post_id &&
                  (filter.post_id as Record<string, unknown>)['eq']
                    ? String((filter.post_id as Record<string, unknown>)['eq'])
                    : undefined;

                const payloadPostId =
                  (p.eventType === 'INSERT'
                    ? (p.new as Row)?.post_id
                    : (p.old as Row)?.post_id) ?? undefined;

                const shouldUpdate =
                  postIdInVars !== undefined
                    ? payloadPostId !== undefined &&
                      String(payloadPostId) === postIdInVars
                    : true;

                if (!shouldUpdate) continue;

                matchedAny = true;
                if (hasHook) {
                  performSilentWrite(parsed);
                } else {
                  performUpdateQuery(parsed);
                }
              }

              if (!matchedAny) {
                //
              }
            } catch (err) {
              console.error('useRealtime: handler failure', err);
            }
          },
        )
        .subscribe();

      channelsRef.current[key] = channel;
    });

    return () => {
      Object.entries(channelsRef.current).forEach(([k, ch]) => {
        try {
          if (ch) {
            ch.unsubscribe();
            supabase.removeChannel(ch);
          }
        } catch {}
      });
      channelsRef.current = {};
    };
  }, [tables, client, persistent, hasHook]);

  const manualUnsubscribeAll = () => {
    Object.entries(channelsRef.current).forEach(([k, ch]) => {
      try {
        if (ch) {
          ch.unsubscribe();
          supabase.removeChannel(ch);
        }
      } catch {}
      channelsRef.current[k] = null;
    });
  };

  return manualUnsubscribeAll;
};
