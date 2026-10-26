import POST_LIST_FIELDS from "./postListFields";

const MORE_POSTS = `
  query GetOtherPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
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
            sourceUrl
          }
        }
      }
        pageInfo {
          endCursor
          hasNextPage
        }
    }
  }
`;

export default MORE_POSTS;
