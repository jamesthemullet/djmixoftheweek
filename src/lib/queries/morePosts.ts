const MORE_POSTS = `
  query GetOtherPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        id
        slug
        title
        date
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
        genres {
          nodes {
            name
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
