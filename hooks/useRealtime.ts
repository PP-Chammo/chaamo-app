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
  isReconnecting?: boolean;
  lastError?: string | Error;
  lingerTimeout?: ReturnType<typeof setTimeout> | null;
  persistent?: boolean;
};

const globalChannels: Record<string, GlobalChannelEntry | undefined> = {};
const MAX_RECONNECT_ATTEMPTS = 5;
const MAX_RECONNECT_DELAY_MS = 30_000;
const CHANNEL_LINGER_MS = 30_000; // keep channel alive briefly after last unsubscribe

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

export const useRealtime = (
  tables: TableName[],
  options?: { persistent?: boolean },
) => {
  const client = useApolloClient();
  const localTablesRef = useRef<Set<string>>(new Set());
  const persistent = options?.persistent ?? true;

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
      );

    // Ensure a provisional entry exists before subscribe fires any callbacks
    if (!globalChannels[tableName]) {
      globalChannels[tableName] = {
        channel,
        refCount: 0,
        reconnectAttempts: 0,
        reconnectTimeout: null,
        isReconnecting: false,
        lingerTimeout: null,
        persistent,
      };
    }

    channel.subscribe((status, error) => {
      const entry = globalChannels[tableName];

      if (status === 'SUBSCRIBED') {
        console.log(`✅ ${tableName}: Channel subscribed successfully`);
        if (entry) {
          entry.reconnectAttempts = 0;
          if (entry.reconnectTimeout) {
            clearTimeout(entry.reconnectTimeout);
            entry.reconnectTimeout = null;
          }
        }
      } else if (status === 'CHANNEL_ERROR') {
        const errorMsg = error?.message || error || 'Unknown channel error';
        console.error(`❌ ${tableName}: Channel error -`, errorMsg);

        if (!entry) {
          console.warn(
            `⚠️ ${tableName}: No entry found; skipping reconnection for now`,
          );
        }

        // Prevent multiple simultaneous reconnection attempts
        if (entry && entry.isReconnecting) {
          console.log(`🔄 ${tableName}: Reconnection already in progress`);
          return;
        }

        if (!entry) return; // no state to manage yet; subscribeLocal will create and can trigger recovery

        entry.lastError =
          typeof errorMsg === 'string' ? errorMsg : String(errorMsg);
        const attempts = entry.reconnectAttempts || 0;
        if (entry.persistent || attempts < MAX_RECONNECT_ATTEMPTS) {
          entry.isReconnecting = true;
          const delay = Math.min(
            1000 * Math.pow(2, attempts),
            MAX_RECONNECT_DELAY_MS,
          );
          entry.reconnectAttempts = attempts + 1;

          console.log(
            `🔄 ${tableName}: Reconnecting in ${delay}ms (attempt ${entry.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
          );

          // Clear existing timeout
          if (entry.reconnectTimeout) {
            clearTimeout(entry.reconnectTimeout);
          }

          entry.reconnectTimeout = setTimeout(() => {
            const currentEntry = globalChannels[tableName];
            if (!currentEntry || !currentEntry.isReconnecting) {
              console.warn(
                `⚠️ ${tableName}: Entry removed or not reconnecting, aborting`,
              );
              return;
            }

            console.log(
              `🔄 ${tableName}: Starting reconnection attempt ${currentEntry.reconnectAttempts}`,
            );

            // Cleanup old channel
            try {
              if (currentEntry.channel) {
                currentEntry.channel.unsubscribe();
                supabase.removeChannel(currentEntry.channel);
              }
            } catch (cleanupError) {
              console.warn(`⚠️ ${tableName}: Cleanup error:`, cleanupError);
            }

            // Create new channel with unique topic
            const newTopic = `${tableName}-changes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newChannel = supabase
              .channel(newTopic)
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
              .subscribe((newStatus, newError) => {
                const currentEntry = globalChannels[tableName];
                if (!currentEntry) return;

                if (newStatus === 'SUBSCRIBED') {
                  console.log(`✅ ${tableName}: Reconnection successful`);
                  currentEntry.channel = newChannel;
                  currentEntry.reconnectAttempts = 0;
                  currentEntry.isReconnecting = false;
                  currentEntry.lastError = undefined;
                  if (currentEntry.reconnectTimeout) {
                    clearTimeout(currentEntry.reconnectTimeout);
                    currentEntry.reconnectTimeout = null;
                  }
                } else if (newStatus === 'CHANNEL_ERROR') {
                  const newErrorMsg =
                    newError?.message ||
                    newError ||
                    'Unknown reconnection error';
                  console.error(
                    `❌ ${tableName}: Reconnection failed -`,
                    newErrorMsg,
                  );
                  currentEntry.isReconnecting = false;
                  currentEntry.lastError = newErrorMsg;
                  // The new channel will trigger its own reconnection logic
                } else if (newStatus === 'TIMED_OUT') {
                  console.error(`⏰ ${tableName}: Reconnection timed out`);
                  currentEntry.isReconnecting = false;
                  currentEntry.lastError = 'Connection timed out';
                }
              });

            // Update entry with new channel
            if (globalChannels[tableName]) {
              globalChannels[tableName]!.channel = newChannel;
            }
          }, delay);
        } else {
          console.error(
            `❌ ${tableName}: Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`,
          );
          entry.isReconnecting = false;
          entry.lastError = `Max reconnection attempts reached: ${errorMsg}`;
          // Clean up the entry
          if (entry.reconnectTimeout) {
            clearTimeout(entry.reconnectTimeout);
            entry.reconnectTimeout = null;
          }
        }
      } else if (status === 'TIMED_OUT') {
        console.error(`⏰ ${tableName}: Connection timed out`);
        // Treat timeout as channel error for reconnection
        if (
          entry &&
          (entry.persistent ||
            entry.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) &&
          !entry.isReconnecting
        ) {
          entry.isReconnecting = true;
          entry.lastError = 'Connection timed out';
          // Trigger reconnection logic similar to CHANNEL_ERROR
          const attempts = entry.reconnectAttempts || 0;
          const delay = Math.min(
            1000 * Math.pow(2, attempts),
            MAX_RECONNECT_DELAY_MS,
          );
          entry.reconnectAttempts = attempts + 1;

          if (entry.reconnectTimeout) {
            clearTimeout(entry.reconnectTimeout);
          }

          entry.reconnectTimeout = setTimeout(() => {
            const newChannel = createChannel(tableName);
            const currentEntry = globalChannels[tableName];
            if (currentEntry) {
              currentEntry.channel = newChannel;
              currentEntry.isReconnecting = false;
            }
          }, delay);
        }
      } else if (status === 'CLOSED') {
        console.log(`🔒 ${tableName}: Channel closed`);
        // Mark lastError so future subscribers can trigger recovery even if refCount is 0 (lingering)
        const e = globalChannels[tableName];
        if (e) {
          e.lastError = 'Channel closed';
        }
        // Attempt reconnection if this wasn't an intentional unsubscribe or if persistent
        if (
          e &&
          (e.refCount > 0 || e.persistent) &&
          (e.persistent || e.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) &&
          !e.isReconnecting
        ) {
          e.isReconnecting = true;
          const attempts = e.reconnectAttempts || 0;
          const delay = Math.min(
            1000 * Math.pow(2, attempts),
            MAX_RECONNECT_DELAY_MS,
          );
          e.reconnectAttempts = attempts + 1;
          if (e.reconnectTimeout) {
            clearTimeout(e.reconnectTimeout);
          }
          e.reconnectTimeout = setTimeout(() => {
            const newChannel = createChannel(tableName);
            const currentEntry = globalChannels[tableName];
            if (currentEntry) {
              currentEntry.channel = newChannel;
              currentEntry.isReconnecting = false;
            }
          }, delay);
        }
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
      // Promote to persistent if requested
      if (persistent) existing.persistent = true;
      // If existing channel has errors, try to reconnect
      if (existing.lastError && !existing.isReconnecting) {
        console.log(`🔄 ${tableName}: Attempting to recover existing channel`);
        const newChannel = createChannel(tableName);
        existing.channel = newChannel;
        existing.reconnectAttempts = 0;
        existing.lastError = undefined;
      }
      return;
    }

    const channel = createChannel(tableName);
    // Handle rare race condition: another subscriber might have created the
    // same channel entry between the existence check and creation above.
    if (globalChannels[key]) {
      const existingEntry = globalChannels[key]!;
      existingEntry.refCount += 1;
      if (existingEntry.lingerTimeout) {
        clearTimeout(existingEntry.lingerTimeout!);
        existingEntry.lingerTimeout = null;
      }
      if (persistent) existingEntry.persistent = true;
      // Only dispose the newly created channel if it's NOT the same instance
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
  };

  const unsubscribeLocal = (tableName: TableName) => {
    const key = String(tableName);
    localTablesRef.current.delete(key);
    const entry = globalChannels[key];
    if (!entry) return;
    entry.refCount -= 1;
    if (entry.refCount <= 0) {
      if (entry.persistent) {
        // Keep channel alive globally; do not teardown
        entry.refCount = 0;
        return;
      }
      // Delay teardown to allow quick navigations back to reuse the live channel
      if (entry.lingerTimeout) {
        clearTimeout(entry.lingerTimeout);
      }
      entry.lingerTimeout = setTimeout(() => {
        const current = globalChannels[key];
        if (!current) return;
        if (current.refCount > 0) {
          // Reused while lingering; keep it
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
