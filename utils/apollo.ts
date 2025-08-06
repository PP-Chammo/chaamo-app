import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NextLink,
  NormalizedCacheObject,
  Observable,
  Operation,
} from '@apollo/client';
import { Session } from '@supabase/supabase-js';

import { supabase } from './supabase';

const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const graphqlUrl = process.env.EXPO_PUBLIC_SUPABASE_GRAPHQL_URL!;

const cache = new InMemoryCache({
  addTypename: false,
});

const authLink = new ApolloLink((operation: Operation, forward: NextLink) => {
  return new Observable((observer) => {
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error getting Supabase session:', error.message);
        }

        const session: Session | null = data?.session ?? null;
        const accessToken = session?.access_token;

        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            apikey: supabaseAnonKey,
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        }));

        forward(operation).subscribe(observer);
      })
      .catch((err) => {
        observer.error(err);
      });
  });
});

const httpLink = new HttpLink({
  uri: graphqlUrl,
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export default client;
export { ApolloProvider, cache };
