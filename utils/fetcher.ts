// utils/fetcher.ts
const DEFAULT_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type FetcherOptions = Omit<RequestInit, 'body' | 'method'> & {
  baseUrl?: string;
  headers?: HeadersInit;
};

function buildUrl(path: string, query?: QueryParams): string {
  // If path is already a full URL, use it directly (but still append query if provided)
  if (/^https?:\/\//i.test(path)) {
    const url = new URL(path);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v == null) continue;
        url.searchParams.append(k, String(v));
      }
    }
    return url.toString();
  }

  const base = new URL(DEFAULT_BASE_URL!);

  // combine base pathname and path safely (avoid new URL treating path starting with / as absolute)
  const basePath = (base.pathname || '').replace(/\/+$/g, ''); // remove trailing slash
  const relPath = (path || '').replace(/^\/+/g, ''); // remove leading slash
  const combined = [basePath, relPath].filter(Boolean).join('/');
  base.pathname = combined ? `${combined}` : '/';

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v == null) continue;
      base.searchParams.append(k, String(v));
    }
  }

  return base.toString();
}

function isPrimitiveOrSerializable(v: unknown): boolean {
  return (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    (typeof v === 'object' && v !== null)
  );
}

async function parseError(res: Response): Promise<Error> {
  try {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return new Error(`Fetch error ${res.status}: ${JSON.stringify(json)}`);
    } catch {
      return new Error(`Fetch error ${res.status}: ${text || res.statusText}`);
    }
  } catch {
    return new Error(`Fetch error ${res.status}: ${res.statusText}`);
  }
}

async function coreRequest<
  TResponse = unknown,
  TPayload = QueryParams | unknown,
>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  path: string,
  payload?: TPayload,
  options: FetcherOptions = {},
): Promise<TResponse> {
  const { baseUrl, headers: optHeaders, ...restOptions } = options;

  // build initial url (if GET + payload as query we'll rebuild below)
  let url = buildUrl(path, undefined);

  // normalize headers using Headers API so we can safely set values
  const hdrs = new Headers(optHeaders ?? undefined);
  if (!hdrs.has('Accept')) hdrs.set('Accept', 'application/json');

  let body: BodyInit | undefined;

  if (method === 'GET' && payload && typeof payload === 'object') {
    // treat payload as query params for GET
    url = buildUrl(path, payload as QueryParams);
  } else if (payload !== undefined) {
    const p = payload as unknown;
    // If payload is already a string or FormData/URLSearchParams/Blob, use it raw
    if (
      typeof p === 'string' ||
      p instanceof FormData ||
      p instanceof URLSearchParams ||
      p instanceof Blob
    ) {
      body = p as BodyInit;
    } else if (isPrimitiveOrSerializable(p)) {
      body = JSON.stringify(p);
      if (!hdrs.has('Content-Type'))
        hdrs.set('Content-Type', 'application/json');
    } else {
      // fallback
      body = JSON.stringify(p);
      if (!hdrs.has('Content-Type'))
        hdrs.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(url, {
    method,
    headers: hdrs,
    body,
    ...restOptions,
  });

  if (!response.ok) throw await parseError(response);

  if (response.status === 204) {
    return undefined as unknown as TResponse;
  }

  const text = await response.text();
  if (!text) return undefined as unknown as TResponse;

  try {
    return JSON.parse(text) as TResponse;
  } catch {
    return text as unknown as TResponse;
  }
}

export const fetcher = {
  get: async <
    TResponse = unknown,
    TQuery extends QueryParams | undefined = undefined,
  >(
    path: string,
    query?: TQuery,
    options?: FetcherOptions,
  ): Promise<TResponse> =>
    coreRequest<TResponse, TQuery>('GET', path, query, options),

  post: async <TResponse = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: FetcherOptions,
  ): Promise<TResponse> =>
    coreRequest<TResponse, TBody>('POST', path, body, options),

  put: async <TResponse = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: FetcherOptions,
  ): Promise<TResponse> =>
    coreRequest<TResponse, TBody>('PUT', path, body, options),

  delete: async <TResponse = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: FetcherOptions,
  ): Promise<TResponse> =>
    coreRequest<TResponse, TBody>('DELETE', path, body, options),

  request: coreRequest,
};

export default fetcher;
