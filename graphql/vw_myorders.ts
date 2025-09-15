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
          title
          status
          currency
          final_price
          seller_earnings
          seller_username
          shipping_fee
          insurance_fee
          image_urls
          created_at
          gateway_account_info
          shipping_tracking_number
          shipping_address
        }
      }
    }
  }
`;
