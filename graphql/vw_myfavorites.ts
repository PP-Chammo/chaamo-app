import { gql } from '@apollo/client';

export const getVwMyFavorites = gql`
  query GetVwMyFavorites($filter: vw_myfavoritesFilter, $last: Int) {
    vw_myfavoritesCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          listing_type
          image_urls
          title
          currency
          start_price
          highest_bid_currency
          highest_bid_price
          last_sold_currency
          last_sold_price
          last_sold_is_checked
          last_sold_is_correct
          seller_username
          created_at
          bid_count
        }
      }
    }
  }
`;
