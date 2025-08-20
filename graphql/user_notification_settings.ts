import { gql } from '@apollo/client';

export const getUserNotificationSettings = gql`
  query getUserNotificationSettings($filter: user_notification_settingsFilter) {
    user_notification_settingsCollection(filter: $filter) {
      edges {
        node {
          user_id
          notification_type
          is_enabled
        }
      }
    }
  }
`;

export const updateUserNotificationSettings = gql`
  mutation updateUserNotificationSettings(
    $set: user_notification_settingsUpdateInput!
    $filter: user_notification_settingsFilter
  ) {
    updateuser_notification_settingsCollection(set: $set, filter: $filter) {
      records {
        notification_type
      }
    }
  }
`;

export const createUserNotificationSettings = gql`
  mutation createUserNotificationSettings(
    $objects: [user_notification_settingsInsertInput!]!
  ) {
    insertIntouser_notification_settingsCollection(objects: $objects) {
      records {
        notification_type
      }
    }
  }
`;
