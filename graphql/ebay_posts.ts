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
          name
          normalised_name
          image_url
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
      totalCount
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
