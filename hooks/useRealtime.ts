import { useCallback, useEffect, useRef } from 'react';

import { useApolloClient } from '@apollo/client';
import { Modifier } from '@apollo/client/cache';
import { RealtimeChannel } from '@supabase/supabase-js';

import { tableQueryMap } from '@/constants/tableQueryMap';
import { supabase } from '@/utils/supabase';

type TableName = keyof typeof tableQueryMap;

type GlobalChannelEntry = {
  channel: RealtimeChannel;
  refCount: number;
  reconnectAttempts: number;
  reconnectTimeout?: ReturnType<typeof setTimeout> | null;
  isReconnecting?: boolean;
  lastError?: string | Error;
  lingerTimeout?: ReturnType<typeof setTimeout> | null;
  persistent?: boolean;
  subscribed?: boolean;
};

const globalChannels: Record<string, GlobalChannelEntry | undefined> = {};
const MAX_RECONNECT_ATTEMPTS = 5;
const MAX_RECONNECT_DELAY_MS = 30_000;
const CHANNEL_LINGER_MS = 30_000;
const SUBSCRIBE_READY_TIMEOUT_MS = 7_000;

type Edge = {
  node: Record<string, unknown>;
  cursor?: string;
  __typename?: string;
};

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
  __typename?: string;
};

type ConnectionShape = {
  edges: Edge[];
  pageInfo: PageInfo;
  __typename?: string;
} | null;

/**
 * useRealtime hook
 *
 * - Creates one global supabase channel per tableName (globalChannels)
 * - Attaches postgres_changes listener before subscribe
 * - Ensures globalChannels entry exists BEFORE subscribe so callbacks can read state safely
 * - Adds small timeout to detect subscribe failures
 * - Updates Apollo cache via client.cache.modify(id: 'ROOT_QUERY', fields: {...})
 * - Only triggers refetch when cache.modify throws an actual error
 */
export const useRealtime = (
  tables: TableName[],
  options?: { persistent?: boolean },
) => {
  const client = useApolloClient();
  const localTablesRef = useRef<Set<string>>(new Set());
  const persistent = options?.persistent ?? true;

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubscribeTimeRef = useRef<number>(0);
  const DEBOUNCE_MS = 1000;

  const encode = (s: string) =>
    typeof btoa !== 'undefined' ? btoa(s) : Buffer.from(s).toString('base64');

  const matchesFilter = (
    row: Record<string, unknown>,
    filter: unknown,
  ): boolean => {
    if (!filter || typeof filter !== 'object') return true;
    const f = filter as Record<string, unknown>;
    const orClause = (f as { or?: unknown }).or;
    if (Array.isArray(orClause)) {
      return orClause.some((sub) => matchesFilter(row, sub));
    }
    for (const [key, value] of Object.entries(f)) {
      if (!value || typeof value !== 'object') continue;
      const valObj = value as { eq?: unknown };
      if ('eq' in valObj) {
        if ((row as Record<string, unknown>)[key] !== valObj.eq) return false;
      }
    }
    return true;
  };

  const getFieldValue = (
    key: string,
    nodeOrEdge: unknown,
    readField: (fieldName: string, obj?: unknown) => unknown,
    edgeObj?: unknown,
  ): unknown => {
    try {
      const fromRead = readField(key, nodeOrEdge);
      if (fromRead !== undefined) return fromRead;
    } catch {}
    if (nodeOrEdge && typeof nodeOrEdge === 'object') {
      const plain = nodeOrEdge as Record<string, unknown>;
      if (key in plain && plain[key] !== undefined) return plain[key];
    }
    if (edgeObj) {
      try {
        const fromEdgeRead = readField(key, edgeObj);
        if (fromEdgeRead !== undefined) return fromEdgeRead;
      } catch {}
    }
    return undefined;
  };

  const mergeNodes = (
    oldNode: Record<string, unknown> | undefined,
    newNode: Record<string, unknown> | undefined,
  ): Record<string, unknown> => {
    return { ...(oldNode ?? {}), ...(newNode ?? {}) };
  };

  const handlePayload = (tableName: TableName, payload: unknown) => {
    const config = tableQueryMap[tableName];
    if (!config) return;

    const p = payload as {
      eventType?: 'INSERT' | 'UPDATE' | 'DELETE';
      new?: Record<string, unknown>;
      old?: Record<string, unknown>;
    };

    try {
      const getRootQuerySnapshot = () => {
        try {
          const data = client.cache.extract(true) as Record<string, unknown>;
          return (data as { ROOT_QUERY?: Record<string, unknown> }).ROOT_QUERY;
        } catch {
          return undefined;
        }
      };
      const pickByPrefix = (
        root: Record<string, unknown> | undefined,
        prefix: string,
      ) => {
        if (!root) return null;
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(root)) {
          if (k.startsWith(prefix)) out[k] = v;
        }
        return out;
      };

      const beforeRoot = getRootQuerySnapshot();
      console.debug(
        `🧠 [Apollo][${String(config.dataKey)}][BEFORE]`,
        pickByPrefix(beforeRoot, String(config.dataKey)),
      );

      const fieldsObj: Record<string, unknown> = {
        [config.dataKey]: (
          existingConnection: ConnectionShape,
          details: {
            readField: (fieldName: string, obj?: unknown) => unknown;
            args?: { filter?: unknown };
          },
        ) => {
          if (!existingConnection) {
            if (
              p.eventType === 'INSERT' &&
              matchesFilter(
                p.new as Record<string, unknown>,
                details.args?.filter,
              )
            ) {
              const pkVal = (p.new as Record<string, unknown>)[
                config.primaryKey[0]
              ];
              const cursor = encode(`${tableName}:${pkVal}`);
              return {
                edges: [
                  {
                    node: p.new as Record<string, unknown>,
                    cursor,
                    __typename: `${tableName}Edge`,
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: cursor,
                  endCursor: cursor,
                  __typename: 'PageInfo',
                },
                __typename: `${tableName}Connection`,
              } as ConnectionShape;
            }
            return existingConnection;
          }

          const edges = existingConnection.edges || [];
          let updatedEdges = [...edges];
          const filterArg = details.args?.filter;
          const readField = details.readField;
          const primaryKeys = config.primaryKey;

          switch (p.eventType) {
            case 'INSERT': {
              const index = edges.findIndex((edge) =>
                primaryKeys.every(
                  (key) =>
                    getFieldValue(key, (edge as Edge).node, readField, edge) ===
                    (p.new as Record<string, unknown>)[key],
                ),
              );

              if (index === -1) {
                if (
                  matchesFilter(p.new as Record<string, unknown>, filterArg)
                ) {
                  const pkVal = (p.new as Record<string, unknown>)[
                    primaryKeys[0]
                  ];
                  const cursor = encode(`${tableName}:${pkVal}`);
                  const newEdge: Edge = {
                    node: p.new as Record<string, unknown>,
                    cursor,
                    __typename: `${tableName}Edge`,
                  };
                  updatedEdges = [...edges, newEdge];
                }
              } else {
                const oldEdge = edges[index];
                const merged = mergeNodes(
                  oldEdge.node as Record<string, unknown>,
                  p.new as Record<string, unknown>,
                );
                updatedEdges = edges.map((e, i) =>
                  i === index ? { ...e, node: merged } : e,
                );
              }
              break;
            }

            case 'DELETE': {
              const initialCount = edges.length;
              updatedEdges = edges.filter((edge) => {
                return !primaryKeys.every(
                  (key) =>
                    getFieldValue(key, (edge as Edge).node, readField, edge) ===
                    (p.old as Record<string, unknown>)[key],
                );
              });
              const removedCount = initialCount - updatedEdges.length;
              if (removedCount === 0) {
                const cacheIds = edges.map((edge) =>
                  primaryKeys
                    .map((key) => {
                      const val = getFieldValue(
                        key,
                        (edge as Edge).node,
                        readField,
                        edge,
                      );
                      return `${key}:${val === undefined ? 'undefined' : String(val)}`;
                    })
                    .join(','),
                );
                const targetId = primaryKeys
                  .map(
                    (key) =>
                      `${key}:${(p.old as Record<string, unknown>)[key]}`,
                  )
                  .join(',');
                console.warn(
                  `⚠️ ${tableName} DELETE: Item not found in merged cache.`,
                  {
                    target: targetId,
                    cacheItems: cacheIds,
                    cacheSize: edges.length,
                  },
                );
              }
              break;
            }

            case 'UPDATE': {
              const index = edges.findIndex((edge) =>
                primaryKeys.every(
                  (key) =>
                    getFieldValue(key, (edge as Edge).node, readField, edge) ===
                    (p.old as Record<string, unknown>)[key],
                ),
              );

              const nowMatches = matchesFilter(
                p.new as Record<string, unknown>,
                filterArg,
              );

              if (index !== -1 && !nowMatches) {
                updatedEdges = edges.filter((_, i) => i !== index);
              } else if (index === -1 && nowMatches) {
                const pkVal = (p.new as Record<string, unknown>)[
                  primaryKeys[0]
                ];
                const cursor = encode(`${tableName}:${pkVal}`);
                const newEdge: Edge = {
                  node: p.new as Record<string, unknown>,
                  cursor,
                  __typename: `${tableName}Edge`,
                };
                updatedEdges = [...edges, newEdge];
              } else if (index !== -1 && nowMatches) {
                const oldEdge = edges[index];
                const merged = mergeNodes(
                  oldEdge.node as Record<string, unknown>,
                  p.new as Record<string, unknown>,
                );
                updatedEdges = edges.map((e, i) =>
                  i === index ? { ...e, node: merged } : e,
                );
              }
              break;
            }
          }

          return {
            ...existingConnection,
            edges: updatedEdges,
          } as ConnectionShape;
        },
      };

      try {
        client.cache.modify({
          id: 'ROOT_QUERY',
          fields: fieldsObj as unknown as Record<string, Modifier<unknown>>,
        });

        const afterRoot = (
          client.cache.extract(true) as { ROOT_QUERY?: Record<string, unknown> }
        ).ROOT_QUERY;
        console.debug(
          `🧠 [Apollo][${String(config.dataKey)}][AFTER]`,
          pickByPrefix(afterRoot, String(config.dataKey)),
        );
      } catch (err) {
        console.error(
          `❌ ${tableName}: Cache.modify failed, will attempt safe refetch`,
          err,
        );
      }
    } catch (error) {
      console.error(`❌ ${tableName}: Cache update failed (unexpected)`, error);
      try {
        client.refetchQueries({ include: [tableQueryMap[tableName].query] });
      } catch (rerr) {
        console.error(`❌ ${tableName}: refetchQueries also failed`, rerr);
      }
    }
  };

  const createChannel = (tableName: TableName) => {
    const topic = `realtime:${tableName}`;
    const channel = supabase.channel(topic);

    if (!globalChannels[tableName]) {
      globalChannels[tableName] = {
        channel,
        refCount: 0,
        reconnectAttempts: 0,
        reconnectTimeout: null,
        isReconnecting: false,
        lingerTimeout: null,
        persistent,
        subscribed: false,
      };
    } else {
      const e = globalChannels[tableName]!;
      if (e.channel !== channel) {
        e.channel = channel;
        e.subscribed = false;
      }
    }

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: tableName },
      (payload) => {
        try {
          console.log(
            `📡 [${tableName}] --> ${payload.eventType}:`,
            payload.eventType === 'DELETE' ? payload.old : payload.new,
          );
          handlePayload(tableName, payload);
        } catch (err) {
          console.error(`❌ [${tableName}] handlePayload error:`, err);
        }
      },
    );

    let readyTimer: ReturnType<typeof setTimeout> | null = null;

    channel.subscribe((status, error) => {
      if (!globalChannels[tableName]) return;
      const e = globalChannels[tableName]!;

      if (status === 'SUBSCRIBED') {
        e.subscribed = true;
        e.reconnectAttempts = 0;
        if (e.reconnectTimeout) {
          clearTimeout(e.reconnectTimeout);
          e.reconnectTimeout = null;
        }
        if (readyTimer) {
          clearTimeout(readyTimer);
          readyTimer = null;
        }
        console.log(
          `✅ ${tableName}: Channel subscribed successfully (topic=${topic})`,
        );
      } else if (status === 'CHANNEL_ERROR') {
        const errMsg =
          (error && error.message) || error || 'Unknown channel error';
        e.lastError = errMsg;
        console.error(`❌ ${tableName}: Channel error -`, errMsg);
        if (!e.isReconnecting) {
          attemptReconnect(tableName, e);
        }
      } else if (status === 'TIMED_OUT') {
        console.error(`⏰ ${tableName}: Subscription timed out`);
        if (!e.isReconnecting) attemptReconnect(tableName, e);
      } else if (status === 'CLOSED') {
        console.log(`🔒 ${tableName}: Channel closed`);
        e.lastError = 'Channel closed';
        if (!e.isReconnecting && (e.refCount > 0 || e.persistent))
          attemptReconnect(tableName, e);
      } else {
        console.log(`${tableName}: subscription status: ${String(status)}`);
      }
    });

    readyTimer = setTimeout(() => {
      const e = globalChannels[tableName];
      if (e && !e.subscribed) {
        e.lastError = `Subscribe timeout (${SUBSCRIBE_READY_TIMEOUT_MS}ms)`;
        console.warn(
          `⚠️ ${tableName}: subscribe not confirmed within ${SUBSCRIBE_READY_TIMEOUT_MS}ms`,
        );
        if (!e.isReconnecting) attemptReconnect(tableName, e);
      }
    }, SUBSCRIBE_READY_TIMEOUT_MS);

    return channel;
  };

  const attemptReconnect = (
    tableName: TableName,
    entry: GlobalChannelEntry,
  ) => {
    if (!entry) return;
    entry.isReconnecting = true;
    const attempts = entry.reconnectAttempts ?? 0;
    if (attempts >= MAX_RECONNECT_ATTEMPTS && !entry.persistent) {
      console.error(`❌ ${tableName}: Max reconnect attempts reached`);
      entry.isReconnecting = false;
      return;
    }
    const delay = Math.min(
      1000 * Math.pow(2, attempts),
      MAX_RECONNECT_DELAY_MS,
    );
    entry.reconnectAttempts = attempts + 1;
    if (entry.reconnectTimeout) clearTimeout(entry.reconnectTimeout);
    console.log(
      `🔄 ${tableName}: Reconnect attempt #${entry.reconnectAttempts} in ${delay}ms`,
    );
    entry.reconnectTimeout = setTimeout(() => {
      try {
        try {
          if (entry.channel) {
            entry.channel.unsubscribe();
            supabase.removeChannel(entry.channel);
          }
        } catch (cleanupErr) {
          console.warn(`⚠️ ${tableName}: cleanup error`, cleanupErr);
        }

        const newChannel = createChannel(tableName);
        const e = globalChannels[tableName];
        if (e) {
          e.channel = newChannel;
          e.isReconnecting = false;
          e.lastError = undefined;
        }
      } catch (err) {
        console.error(
          `❌ ${tableName}: reconnect failed to create new channel`,
          err,
        );
        entry.isReconnecting = false;
      }
    }, delay);
  };

  const subscribeLocal = useCallback(
    (tableName: TableName) => {
      const key = String(tableName);
      localTablesRef.current.add(key);

      const existing = globalChannels[key];
      if (existing) {
        existing.refCount += 1;
        if (persistent) existing.persistent = true;
        if (existing.lastError && !existing.isReconnecting) {
          console.log(`🔄 ${tableName}: recovering existing channel`);
          attemptReconnect(tableName, existing);
        }
        return;
      }

      const channel = createChannel(tableName);

      if (globalChannels[key]) {
        const existingEntry = globalChannels[key]!;
        existingEntry.refCount += 1;
        if (existingEntry.lingerTimeout) {
          clearTimeout(existingEntry.lingerTimeout!);
          existingEntry.lingerTimeout = null;
        }
        if (persistent) existingEntry.persistent = true;
        if (existingEntry.channel !== channel) {
          try {
            channel.unsubscribe();
          } catch {}
          try {
            supabase.removeChannel(channel);
          } catch {}
        }
        return;
      }

      globalChannels[key] = {
        channel,
        refCount: 1,
        reconnectAttempts: 0,
        reconnectTimeout: null,
        isReconnecting: false,
        lingerTimeout: null,
        persistent,
      };
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [persistent],
  );

  const unsubscribeLocal = useCallback((tableName: TableName) => {
    const key = String(tableName);
    localTablesRef.current.delete(key);
    const entry = globalChannels[key];
    if (!entry) return;
    entry.refCount -= 1;
    if (entry.refCount <= 0) {
      if (entry.persistent) {
        entry.refCount = 0;
        return;
      }
      if (entry.lingerTimeout) {
        clearTimeout(entry.lingerTimeout);
      }
      entry.lingerTimeout = setTimeout(() => {
        const current = globalChannels[key];
        if (!current) return;
        if (current.refCount > 0) {
          if (current.lingerTimeout) {
            clearTimeout(current.lingerTimeout);
            current.lingerTimeout = null;
          }
          return;
        }
        try {
          current.channel.unsubscribe();
        } catch {}
        try {
          supabase.removeChannel(current.channel);
        } catch {}
        if (current.reconnectTimeout) {
          clearTimeout(current.reconnectTimeout);
        }
        if (current.lingerTimeout) {
          clearTimeout(current.lingerTimeout);
        }
        delete globalChannels[key];
      }, CHANNEL_LINGER_MS);
    }
  }, []);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    const now = Date.now();
    const timeSinceLastSubscribe = now - lastSubscribeTimeRef.current;

    if (
      timeSinceLastSubscribe < DEBOUNCE_MS &&
      lastSubscribeTimeRef.current > 0
    ) {
      debounceTimeoutRef.current = setTimeout(() => {
        performSubscription();
      }, DEBOUNCE_MS - timeSinceLastSubscribe);

      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
          debounceTimeoutRef.current = null;
        }
      };
    }

    performSubscription();

    function performSubscription() {
      lastSubscribeTimeRef.current = Date.now();

      const currentTables = new Set(tables.map(String));
      const previousTables = new Set(localTablesRef.current);

      previousTables.forEach((tableName) => {
        if (!currentTables.has(tableName)) {
          console.log(`🔄 useRealtime: Unsubscribing from ${tableName}`);
          unsubscribeLocal(tableName as TableName);
        }
      });

      const subscribedInThisEffect = new Set<string>();
      tables.forEach((t) => {
        const config = tableQueryMap[t];
        if (!config) {
          console.warn(`❌ useRealtime: No query config for table: ${t}`);
          return;
        }
        subscribeLocal(t);
        subscribedInThisEffect.add(String(t));
      });
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, [tables, DEBOUNCE_MS, subscribeLocal, unsubscribeLocal]);

  const manualUnsubscribeAll = () => {
    localTablesRef.current.forEach((k) => {
      unsubscribeLocal(k as TableName);
    });
    localTablesRef.current.clear();
  };

  return manualUnsubscribeAll;
};
