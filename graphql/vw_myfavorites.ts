import { gql } from '@apollo/client';

export const getVwMyFavorites = gql`
  query GetVwMyFavorites($filter: vw_myfavoritesFilter, $last: Int) {
    vw_myfavoritesCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          listing_type
          image_url
          name
          bid_count
          seller_username
          created_at
          currency
          start_price
        }
      }
    }
  }
`;
