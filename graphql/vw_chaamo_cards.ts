import { gql } from '@apollo/client';

export const getVwChaamoListings = gql`
  query GetVwChaamoListings(
    $filter: vw_chaamo_cardsFilter
    $last: Int
    $orderBy: [vw_chaamo_cardsOrderBy!]
  ) {
    vw_chaamo_cardsCollection(filter: $filter, last: $last, orderBy: $orderBy) {
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
          is_favorite
          is_boosted
          status
        }
      }
    }
  }
`;

export const getVwChaamoDetail = gql`
  query GetVwChaamoDetail($filter: vw_chaamo_cardsFilter) {
    vw_chaamo_cardsCollection(filter: $filter, last: 1) {
      edges {
        node {
          id
          seller_id
          seller_image_url
          seller_username
          listing_type
          image_url
          name
          description
          currency
          start_price
          reserve_price
          highest_bid_price
          last_sold_currency
          last_sold_price
          created_at
          end_time
          category_id
          condition
          user_card_id
        }
      }
    }
  }
`;
