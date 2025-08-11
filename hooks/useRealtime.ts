import { useEffect, useRef } from 'react';

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
};

const globalChannels: Record<string, GlobalChannelEntry | undefined> = {};
const MAX_RECONNECT_ATTEMPTS = 5;
const MAX_RECONNECT_DELAY_MS = 30_000;

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

export const useRealtime = (tables: TableName[]) => {
  const client = useApolloClient();
  const localTablesRef = useRef<Set<string>>(new Set());

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
    const fromRead = readField(key, nodeOrEdge);
    if (fromRead !== undefined) return fromRead;
    if (nodeOrEdge && typeof nodeOrEdge === 'object') {
      const plain = nodeOrEdge as Record<string, unknown>;
      if (key in plain && plain[key] !== undefined) return plain[key];
    }
    if (edgeObj) {
      const fromEdgeRead = readField(key, edgeObj);
      if (fromEdgeRead !== undefined) return fromEdgeRead;
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
                  `⚠️ ${tableName} DELETE: Item not found in cache`,
                  {
                    target: targetId,
                    cacheItems: cacheIds,
                    cacheSize: edges.length,
                  },
                );
                client.refetchQueries({
                  include: [config.query],
                });
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

      client.cache.modify({
        fields: fieldsObj as unknown as Record<string, Modifier<unknown>>,
      });
    } catch (error) {
      console.error(`❌ ${tableName}: Cache update failed`, error);
      const cfg = tableQueryMap[tableName];
      if (cfg) {
        client.refetchQueries({ include: [cfg.query] });
      }
    }
  };

  const createChannel = (tableName: TableName) => {
    const topic = `${tableName}-changes`;
    const channel = supabase
      .channel(topic)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          console.log(
            `📡 [${tableName}] --> ${payload.eventType}:`,
            payload.eventType === 'DELETE' ? payload.old : payload.new,
          );
          handlePayload(tableName, payload);
        },
      )
      .subscribe((status, error) => {
        if (status === 'SUBSCRIBED') {
          const entry = globalChannels[tableName];
          if (entry) entry.reconnectAttempts = 0;
        } else if (status === 'CHANNEL_ERROR') {
          console.error(
            `❌ ${tableName}: Channel error`,
            error?.message || error,
          );
          const entry = globalChannels[tableName];
          if (!entry) return;
          const attempts = entry.reconnectAttempts || 0;
          if (attempts < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(
              1000 * Math.pow(2, attempts),
              MAX_RECONNECT_DELAY_MS,
            );
            entry.reconnectAttempts = attempts + 1;
            if (entry.reconnectTimeout) {
              clearTimeout(entry.reconnectTimeout);
            }
            entry.reconnectTimeout = setTimeout(() => {
              try {
                channel.unsubscribe();
                supabase.removeChannel(channel);
              } catch {}
              const newTopic = `${tableName}-changes-${Date.now()}`;
              const newChannel = supabase
                .channel(newTopic)
                .on(
                  'postgres_changes',
                  { event: '*', schema: 'public', table: tableName },
                  (payload) => handlePayload(tableName, payload),
                )
                .subscribe((newStatus) => {
                  if (newStatus === 'SUBSCRIBED') {
                    const e = globalChannels[tableName];
                    if (e) {
                      e.channel = newChannel;
                      e.reconnectAttempts = 0;
                      if (e.reconnectTimeout) {
                        clearTimeout(e.reconnectTimeout);
                        e.reconnectTimeout = null;
                      }
                    }
                  } else if (newStatus === 'CHANNEL_ERROR') {
                    console.error(
                      `❌ ${tableName}: Reconnection attempt failed`,
                    );
                  }
                });

              const entryNow = globalChannels[tableName];
              if (entryNow) {
                entryNow.channel = newChannel;
              }
            }, delay);
          } else {
            console.error(`❌ ${tableName}: Max reconnection attempts reached`);
          }
        } else if (status === 'TIMED_OUT') {
          console.error(`⏰ ${tableName}: Connection timed out`);
        } else if (status === 'CLOSED') {
          // console.log(`[realtime] Channel closed for ${tableName}`);
        }
      });

    return channel;
  };

  const subscribeLocal = (tableName: TableName) => {
    const key = String(tableName);
    localTablesRef.current.add(key);

    const existing = globalChannels[key];
    if (existing) {
      existing.refCount += 1;
      return;
    }

    const channel = createChannel(tableName);
    globalChannels[key] = {
      channel,
      refCount: 1,
      reconnectAttempts: 0,
      reconnectTimeout: null,
    };
  };

  const unsubscribeLocal = (tableName: TableName) => {
    const key = String(tableName);
    localTablesRef.current.delete(key);
    const entry = globalChannels[key];
    if (!entry) return;
    entry.refCount -= 1;
    if (entry.refCount <= 0) {
      try {
        entry.channel.unsubscribe();
      } catch {}
      try {
        supabase.removeChannel(entry.channel);
      } catch {}
      if (entry.reconnectTimeout) {
        clearTimeout(entry.reconnectTimeout);
      }
      delete globalChannels[key];
    }
  };

  useEffect(() => {
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

    return () => {
      subscribedInThisEffect.forEach((k) => {
        unsubscribeLocal(k as TableName);
      });
    };
    /* intentional: re-subscribe if `tables` reference changes; use stable array */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manualUnsubscribeAll = () => {
    localTablesRef.current.forEach((k) => {
      unsubscribeLocal(k as TableName);
    });
    localTablesRef.current.clear();
  };

  return manualUnsubscribeAll;
};
