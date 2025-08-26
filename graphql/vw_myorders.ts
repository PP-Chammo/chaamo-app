import { gql } from '@apollo/client';

export const getVwMyOrders = gql`
  query GetVwMyOrders(
    $filter: vw_myordersFilter
    $last: Int
    $orderBy: [vw_myordersOrderBy!]
  ) {
    vw_myordersCollection(filter: $filter, last: $last, orderBy: $orderBy) {
      edges {
        node {
          id
          listing_id
          listing_type
          name
          status
          currency
          final_price
          seller_earnings
          image_urls
        }
      }
    }
  }
`;
