import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

const uri = process.env.EXPO_PUBLIC_SUPABASE_GRAPHQL_URL;
const apikey = process.env.EXPO_PUBLIC_SUPABASE_S_KEY;

const cache = new InMemoryCache({
  addTypename: false,
});

const client = new ApolloClient({
  link: new HttpLink({
    uri,
    headers: {
      apikey: apikey || '',
    },
  }),
  cache,
});

export default client;
export { ApolloProvider, cache };
