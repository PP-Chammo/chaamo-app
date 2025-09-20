import { gql } from '@apollo/client';

export const getEbayPosts = gql`
  query GetEbayPosts(
    $filter: ebay_postsFilter
    $first: Int
    $after: Cursor
    $orderBy: [ebay_postsOrderBy!]
  ) {
    ebay_postsCollection(
      filter: $filter
      first: $first
      after: $after
      orderBy: $orderBy
    ) {
      edges {
        node {
          id
          title
          normalised_name
          image_url
          image_hd_url
          currency
          price
          sold_at
          post_url
          region
          condition
          grade
          grading_company
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const ebayPostDetail = gql`
  query GetEbayPostDetail($filter: ebay_postsFilter) {
    ebay_postsCollection(filter: $filter, first: 1) {
      edges {
        node {
          id
          title
          normalised_name
          image_hd_url
          currency
          price
          sold_at
        }
      }
    }
  }
`;

export const deleteEbayPosts = gql`
  mutation DeleteEbayPosts($filter: ebay_postsFilter) {
    deleteFromebay_postsCollection(filter: $filter) {
      records {
        id
      }
    }
  }
`;
