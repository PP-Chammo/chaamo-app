import { gql } from '@apollo/client';

export const getNotificationTypes = gql`
  query getNotificationTypes($filter: notification_typesFilter) {
    notification_typesCollection(filter: $filter) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
