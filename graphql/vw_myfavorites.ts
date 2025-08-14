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
          currency
          start_price
          last_sold_currency
          last_sold_price
          seller_username
          created_at
          bid_count
        }
      }
    }
  }
`;
