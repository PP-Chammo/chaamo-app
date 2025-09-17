import { gql } from '@apollo/client';

export const getVwListingCards = gql`
  query GetVwListingCards(
    $filter: vw_listing_cardsFilter
    $last: Int
    $orderBy: [vw_listing_cardsOrderBy!]
  ) {
    vw_listing_cardsCollection(
      filter: $filter
      last: $last
      orderBy: $orderBy
    ) {
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
          is_favorite
          is_boosted
          status
        }
      }
    }
  }
`;

export const getVwListingCardDetail = gql`
  query GetVwListingCardDetail($filter: vw_listing_cardsFilter) {
    vw_listing_cardsCollection(filter: $filter, first: 1) {
      edges {
        node {
          id
          card_id
          seller_id
          seller_image_url
          seller_username
          category_id
          years
          card_set
          name
          variation
          serial_number
          number
          condition
          grading_company
          grade_number
          listing_type
          image_urls
          title
          description
          currency
          start_price
          reserve_price
          highest_bid_currency
          highest_bid_price
          last_sold_currency
          last_sold_price
          last_sold_is_checked
          last_sold_is_correct
          created_at
          end_time
          category_id
          condition
          is_boosted
        }
      }
    }
  }
`;
