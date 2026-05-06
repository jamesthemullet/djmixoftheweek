const ALL_POSTS_QUERY = `
  query AllPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        slug
        title
        ratings {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            srcSet
          }
        }
        genres {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default ALL_POSTS_QUERY;
