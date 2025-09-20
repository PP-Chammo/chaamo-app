import { gql } from '@apollo/client';

export const monitor = gql`
  query Monitor($filter: monitorFilter) {
    monitorCollection(filter: $filter) {
      edges {
        node {
          ebay_posts_category_1_count
          ebay_posts_category_2_count
          ebay_posts_category_3_count
          ebay_posts_category_4_count
          ebay_posts_category_5_count
          ebay_posts_category_6_count
          ebay_posts_category_7_count
          ebay_posts_category_8_count
          ebay_posts_category_9_count
          ebay_posts_category_10_count
          ebay_posts_category_11_count
          ebay_posts_category_12_count
          ebay_posts_category_99_count
        }
      }
    }
  }
`;
