import POST_LIST_FIELDS from "./postListFields";

const OTHER_POSTS_AFTER_FIRST_QUERY = `
  query GetOtherPosts($after: String) {
    posts(first: 11, after: $after) {
      nodes {
        ${POST_LIST_FIELDS}
        featuredImage {
          node {
            mediaDetails {
              sizes {
                sourceUrl
                name
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

export default OTHER_POSTS_AFTER_FIRST_QUERY;
