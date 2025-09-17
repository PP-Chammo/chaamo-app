import { gql } from '@apollo/client';

export const getNotifications = gql`
  query GetNotifications($filter: notificationsFilter, $last: Int) {
    notificationsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          type
          actions
          content
          created_at
        }
      }
    }
  }
`;
