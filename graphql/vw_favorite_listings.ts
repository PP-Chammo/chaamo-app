import { gql } from '@apollo/client';

export const getVwMyFavoriteListings = gql`
  query GetVwMyFavoriteListings(
    $filter: vw_myfavorite_listingsFilter
    $last: Int
  ) {
    vw_myfavorite_listingsCollection(filter: $filter, last: $last) {
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
          price
          start_price
        }
      }
    }
  }
`;
