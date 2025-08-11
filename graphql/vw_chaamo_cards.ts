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
          currency
          price
          start_price
          name
          seller_username
          seller_country
          created_at
          is_favorite
          is_boosted
          status
        }
      }
    }
  }
`;

export const getVwCommonDetail = gql`
  query GetVwCommonDetail($filter: vw_chaamo_cardsFilter) {
    vw_chaamo_cardsCollection(filter: $filter, last: 1) {
      edges {
        node {
          id
          seller_id
          seller_image_url
          seller_username
          listing_type
          image_url
          currency
          price
          created_at
          name
          ebay_highest_price
          description
          is_favorite
        }
      }
    }
  }
`;

export const getVwAuctionDetail = gql`
  query GetVwAuctionDetail($filter: vw_chaamo_cardsFilter) {
    vw_chaamo_cardsCollection(filter: $filter, last: 1) {
      edges {
        node {
          id
          seller_id
          seller_image_url
          seller_username
          listing_type
          image_url
          currency
          start_price
          created_at
          ends_at
          name
          ebay_highest_price
          description
          is_favorite
        }
      }
    }
  }
`;
