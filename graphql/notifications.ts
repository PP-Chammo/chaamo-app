import { gql } from '@apollo/client';

export const getNotifications = gql`
  query GetNotifications($filter: notificationsFilter, $last: Int) {
    notificationsCollection(filter: $filter, last: $last) {
      edges {
        node {
          id
          notification_types {
            name
          }
          content
          created_at
        }
      }
    }
  }
`;
