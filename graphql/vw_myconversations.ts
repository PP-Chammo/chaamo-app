import { gql } from '@apollo/client';

export const getVwMyConversations = gql`
  query GetVwMyConversations(
    $filter: vw_myconversationsFilter
    $last: Int
    $orderBy: [vw_myconversationsOrderBy!]
  ) {
    vw_myconversationsCollection(
      filter: $filter
      last: $last
      orderBy: $orderBy
    ) {
      edges {
        node {
          id
          username
          profile_image_url
          partner_id
          content
          created_at
          unread_count
        }
      }
    }
  }
`;
